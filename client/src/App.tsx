import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Sidebar } from "./components/layout/sidebar";
import { Navbar } from "./components/layout/Navbar";
import { FilterBar } from "./components/FilterBar";
import { KanbanBoard } from "./components/KanbanBoard";
import { CreateIssueModal } from "./components/CreateIssueModal";
import { BacklogView } from "./components/BacklogView";
import { AnalyticsView } from "./components/AnalyticsView";
import { SettingsView } from "./components/SettingsView";
import { AuthPage } from "./components/auth/AuthPage";
import { LandingPage } from "./components/landing/LandingPage";

import { authApi, sprintApi, issueApi } from "./api/client";
import { useWebSocket } from "./hooks/useWebSocket";
import type { Issue, Priority, Status } from "./types/sprint";

type ViewType = "landing" | "auth" | "app";
type TabType = "board" | "backlog" | "analytics" | "settings";

const getRouteFromUrl = (): { view: ViewType; tab: TabType } => {
    if (typeof window === "undefined") return { view: "landing", tab: "board" };
    const path = window.location.pathname.replace(/^\/+/, "").toLowerCase();
    if (path === "auth" || path === "login") return { view: "auth", tab: "board" };
    if (path === "app" || path === "board") return { view: "app", tab: "board" };
    if (path === "backlog") return { view: "app", tab: "backlog" };
    if (path === "analytics") return { view: "app", tab: "analytics" };
    if (path === "settings") return { view: "app", tab: "settings" };
    return { view: "landing", tab: "board" };
};

export default function App() {
    const queryClient = useQueryClient();
    const initialRoute = useMemo(() => getRouteFromUrl(), []);
    const [currentView, setCurrentView] = useState<ViewType>(initialRoute.view);
    const [activeTab, setActiveTab] = useState<TabType>(initialRoute.tab);

    const navigate = (view: ViewType, tab: TabType = "board") => {
        setCurrentView(view);
        setActiveTab(tab);
        let targetPath = "/";
        if (view === "auth") targetPath = "/auth";
        else if (view === "app") targetPath = tab === "board" ? "/board" : `/${tab}`;
        if (window.location.pathname !== targetPath) {
            window.history.pushState({ view, tab }, "", targetPath);
        }
    };

    useEffect(() => {
        const handlePopState = () => {
            const route = getRouteFromUrl();
            setCurrentView(route.view);
            setActiveTab(route.tab);
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPriority, setSelectedPriority] = useState<Priority | "all">("all");
    const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | "all">("all");

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [defaultModalStatus, setDefaultModalStatus] = useState<Status>("todo");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { data: authData } = useQuery({
        queryKey: ["auth", "me"],
        queryFn: authApi.getMe,
        retry: false,
    });

    const currentUser = authData?.user;
    const currentWorkspace = currentUser?.memberships?.[0]?.workspace;

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (e) {
            console.error("Logout error", e);
        }
        queryClient.clear();
        navigate("landing");
    };

    const { data: sprintData } = useQuery({
        queryKey: ["sprint", "active", currentWorkspace?.id],
        queryFn: () => sprintApi.getActive(currentWorkspace.id),
        enabled: !!currentWorkspace?.id,
    });

    const activeSprint = sprintData?.sprint;

    const { data: boardData } = useQuery({
        queryKey: ["board", activeSprint?.id],
        queryFn: () => issueApi.getBoard(activeSprint.id),
        enabled: !!activeSprint?.id,
    });

    const rawIssues: any[] = boardData?.issues || [];

    const workspaceMembers = useMemo(() => {
        if (!currentUser) return [];
        const members = currentWorkspace?.members || [];
        if (members.length > 0) {
            return members.map((m: any) => ({
                id: m.user?.id || m.userId || m.id,
                name: m.user?.name || m.name,
                email: m.user?.email || m.email,
                avatar: m.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user?.name || "user"}`,
            }));
        }
        return [{
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            avatar: currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`,
        }];
    }, [currentUser, currentWorkspace]);

    const issues: Issue[] = useMemo(() => {
        return rawIssues.map((i: any) => ({
            id: i.key || i.id,
            backendId: i.id,
            title: i.title,
            description: i.description || "",
            status: (i.status?.toLowerCase() || "todo") as Status,
            priority: (i.priority?.toLowerCase() || "medium") as Priority,
            assignee: i.assignee
                ? {
                    id: i.assignee.id,
                    name: i.assignee.name,
                    email: i.assignee.email || "",
                    avatar: i.assignee.avatarUrl || i.assignee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i.assignee.name}`,
                }
                : null,
            tags: i.tags || [],
            createdAt: i.createdAt || new Date().toISOString(),
            order: i.order || 0,
        }));
    }, [rawIssues]);

    useWebSocket(currentWorkspace?.id, activeSprint?.id);

    const createIssueMutation = useMutation({
        mutationFn: (newIssueData: any) =>
            issueApi.create({
                ...newIssueData,
                workspaceId: currentWorkspace?.id,
                sprintId: activeSprint?.id,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["board", activeSprint?.id] });
        },
    });

    // Instant Optimistic Drag-and-Drop Mutation (0ms delay)
    const moveIssueMutation = useMutation({
        mutationFn: ({ issueId, newStatus, order }: { issueId: string; newStatus: Status; order: number }) => {
            const targetIssue = rawIssues.find((i: any) => i.id === issueId || i.key === issueId);
            const actualId = targetIssue?.id || issueId;
            return issueApi.move(actualId, newStatus.toUpperCase(), order, activeSprint?.id);
        },
        onMutate: async ({ issueId, newStatus }) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: ["board", activeSprint?.id] });

            // Snapshot the previous state
            const previousBoard = queryClient.getQueryData(["board", activeSprint?.id]);

            // Optimistically update TanStack Query cache instantly (0ms!)
            queryClient.setQueryData(["board", activeSprint?.id], (old: any) => {
                if (!old?.issues) return old;
                return {
                    ...old,
                    issues: old.issues.map((i: any) =>
                        i.id === issueId || i.key === issueId
                            ? { ...i, status: newStatus.toUpperCase() }
                            : i
                    ),
                };
            });

            return { previousBoard };
        },
        onError: (_err, _vars, context: any) => {
            // Rollback on failure
            if (context?.previousBoard) {
                queryClient.setQueryData(["board", activeSprint?.id], context.previousBoard);
            }
        },
        onSettled: () => {
            // Sync with backend in background
            queryClient.invalidateQueries({ queryKey: ["board", activeSprint?.id] });
        },
    });

    // Optimistic Assignee Change Mutation (0ms delay)
    const updateAssigneeMutation = useMutation({
        mutationFn: ({ issueId, assigneeId }: { issueId: string; assigneeId: string | null }) => {
            const targetIssue = rawIssues.find((i: any) => i.id === issueId || i.key === issueId);
            const actualId = targetIssue?.id || issueId;
            return issueApi.update(actualId, { assigneeId }, activeSprint?.id);
        },
        onMutate: async ({ issueId, assigneeId }) => {
            await queryClient.cancelQueries({ queryKey: ["board", activeSprint?.id] });
            const previousBoard = queryClient.getQueryData(["board", activeSprint?.id]);

            const assignedMember = assigneeId
                ? workspaceMembers.find((m: any) => m.id === assigneeId) || null
                : null;

            queryClient.setQueryData(["board", activeSprint?.id], (old: any) => {
                if (!old?.issues) return old;
                return {
                    ...old,
                    issues: old.issues.map((i: any) =>
                        i.id === issueId || i.key === issueId
                            ? {
                                ...i,
                                assigneeId,
                                assignee: assignedMember
                                    ? {
                                        id: assignedMember.id,
                                        name: assignedMember.name,
                                        email: assignedMember.email,
                                        avatar: assignedMember.avatar,
                                    }
                                    : null,
                            }
                            : i
                    ),
                };
            });

            return { previousBoard };
        },
        onError: (_err, _vars, context: any) => {
            if (context?.previousBoard) {
                queryClient.setQueryData(["board", activeSprint?.id], context.previousBoard);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board", activeSprint?.id] });
        },
    });

    const handleUpdateAssignee = (issueId: string, assigneeId: string | null) => {
        if (!currentUser) {
            navigate("auth");
            return;
        }
        updateAssigneeMutation.mutate({ issueId, assigneeId });
    };

    const handleCreateIssue = (newIssueData: {
        title: string;
        description: string;
        status: Status;
        priority: Priority;
        assigneeId: string;
        tags: string[];
    }) => {
        if (!currentUser) {
            navigate("auth");
            return;
        }

        createIssueMutation.mutate({
            title: newIssueData.title,
            description: newIssueData.description,
            status: newIssueData.status.toUpperCase(),
            priority: newIssueData.priority.toUpperCase(),
            assigneeId: newIssueData.assigneeId || undefined,
            tags: newIssueData.tags,
        });
    };

    const handleOpenCreateModal = (status: Status = "todo") => {
        if (!currentUser) {
            navigate("auth");
            return;
        }
        setDefaultModalStatus(status);
        setIsCreateModalOpen(true);
    };

    const handleMoveIssue = (issueId: string, newStatus: Status) => {
        if (!currentUser || !activeSprint?.id) {
            navigate("auth");
            return;
        }

        moveIssueMutation.mutate({
            issueId,
            newStatus,
            order: Date.now(),
        });
    };

    const handleMoveToSprint = (issueId: string) => {
        handleMoveIssue(issueId, "todo");
    };

    const filteredIssues = useMemo(() => {
        return issues.filter((issue) => {
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchesId = issue.id.toLowerCase().includes(query);
                const matchedTitle = issue.title.toLowerCase().includes(query);
                const matchedTag = issue.tags.some((t) => t.toLowerCase().includes(query));

                if (!matchesId && !matchedTitle && !matchedTag) return false;
            }

            if (selectedPriority !== "all" && issue.priority !== selectedPriority) return false;

            if (selectedAssigneeId !== "all") {
                if (!issue.assignee || issue.assignee.id !== selectedAssigneeId) return false;
            }

            return true;
        });
    }, [issues, searchQuery, selectedPriority, selectedAssigneeId]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
                return;
            }

            const activeTag = document.activeElement?.tagName.toLowerCase();
            const isTyping = activeTag === "input" || activeTag === "textarea" || activeTag === "select";

            if (isTyping) return;

            if (e.key.toLowerCase() === "c" || e.key.toLowerCase() === "n") {
                e.preventDefault();
                handleOpenCreateModal("todo");
            }

            if (e.key === "Escape") setIsCreateModalOpen(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentUser]);

    if (currentView === "landing") {
        return (
            <LandingPage
                onLaunchApp={() => navigate("app", "board")}
                onOpenLogin={() => navigate("auth")}
                currentUser={currentUser}
                onLogout={handleLogout}
            />
        );
    }

    if (currentView === "auth") {
        return (
            <AuthPage
                onLoginSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
                    navigate("app", "board");
                }}
                onGoHome={() => navigate("landing")}
            />
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
            <Sidebar
                activeTab={activeTab}
                onSelectTab={(tab) => navigate("app", tab as TabType)}
                onGoHome={() => navigate("landing")}
                members={workspaceMembers}
                currentUser={currentUser}
                onOpenLogin={() => navigate("auth")}
            />
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <Navbar
                    onOpenNewIssue={() => handleOpenCreateModal("todo")}
                    currentUser={currentUser}
                    onOpenLogin={() => navigate("auth")}
                    onLogout={handleLogout}
                />

                {activeTab === "board" && (
                    <FilterBar
                        searchInputRef={searchInputRef}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedPriority={selectedPriority}
                        onPriorityChange={setSelectedPriority}
                        selectedAssigneeId={selectedAssigneeId}
                        onAssigneeChange={setSelectedAssigneeId}
                        onOpenNewIssue={() => handleOpenCreateModal("todo")}
                        members={workspaceMembers}
                    />
                )}
                <main className="flex-1 overflow-hidden flex flex-col bg-slate-950">
                    {activeTab === "board" && (
                        <KanbanBoard
                            issues={filteredIssues}
                            onAddIssue={(status) => handleOpenCreateModal(status)}
                            onMoveIssue={handleMoveIssue}
                            members={workspaceMembers}
                            onUpdateAssignee={handleUpdateAssignee}
                        />
                    )}
                    {activeTab === "backlog" && (
                        <BacklogView
                            issues={issues}
                            onMoveToSprint={handleMoveToSprint}
                            onOpenNewIssue={() => handleOpenCreateModal("backlog")}
                        />
                    )}
                    {activeTab === "analytics" && (
                        <AnalyticsView issues={issues} sprintName={activeSprint?.name} />
                    )}
                    {activeTab === "settings" && (
                        <SettingsView
                            currentUser={currentUser}
                            workspace={currentWorkspace}
                            onMemberInvited={() => queryClient.invalidateQueries({ queryKey: ["auth", "me"] })}
                        />
                    )}
                </main>
                <CreateIssueModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreateIssue={handleCreateIssue}
                    defaultStatus={defaultModalStatus}
                    users={workspaceMembers}
                />
            </div>
        </div>
    );
}
