import { useState, useMemo, useEffect, useRef } from "react";

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

import { INITIAL_ISSUES, MOCK_USERS } from "./data/mockIssues";
import type { Issue, Priority, Status } from "./types/sprint";

export default function App() {
    const [currentView, setCurrentView] = useState<"landing" | "auth" | "app">("landing");
    const [activeTab, setActiveTab] = useState<"board" | "backlog" | "analytics" | "settings">("board");

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPriority, setSelectedPriority] = useState<Priority | "all">("all");
    const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | "all">("all");
    const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [defaultModalStatus, setDefaultModalStatus] = useState<Status>("todo");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleCreateIssue = (newIssueData: {
        title: string;
        description: string;
        status: Status;
        priority: Priority;
        assigneeId: string;
        tags: string[];
    }) => {
        const assigneeUser = MOCK_USERS.find((u) => u.id === newIssueData.assigneeId) || null;

        const newIssue: Issue = {
            id: `DEV-${100 + issues.length + 1}`,
            title: newIssueData.title,
            description: newIssueData.description,
            status: newIssueData.status,
            priority: newIssueData.priority,
            assignee: assigneeUser,
            tags: newIssueData.tags,
            createdAt: new Date().toISOString(),
            order: 0,
        };

        setIssues((prevIssues) => [newIssue, ...prevIssues]);
    };

    const handleOpenCreateModal = (status: Status = "todo") => {
        setDefaultModalStatus(status);
        setIsCreateModalOpen(true);
    };

    const handleMoveIssue = (issueId: string, newStatus: Status) => {
        setIssues((prevIssues) =>
            prevIssues.map((issue) => 
                issue.id === issueId ? { ...issue, status: newStatus } : issue
            )
        );
    };

    const handleMoveToSprint = (issueId: string) => {
        handleMoveIssue(issueId, "todo");
    }

    const filteredIssues = useMemo(() => {
        return issues.filter((issue) => {
            if(searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchesId = issue.id.toLowerCase().includes(query);
                const matchedTitle = issue.title.toLowerCase().includes(query);
                const matchedTag = issue.tags.some((t) => t.toLowerCase().includes(query));

                if(!matchesId && !matchedTitle && !matchedTag) return false;
            }

            if(selectedPriority !== "all" && issue.priority !== selectedPriority) return false;

            if(selectedAssigneeId !== "all") {
                if(!issue.assignee || issue.assignee.id !== selectedAssigneeId) return false;
            }

            return true;
        });
    }, [issues, searchQuery, selectedPriority, selectedAssigneeId]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
                return;
            }

            const activeTag = document.activeElement?.tagName.toLowerCase();
            const isTyping = activeTag === "input" || activeTag === "textarea" || activeTag === "select";

            if(isTyping) return;

            if(e.key.toLowerCase() === "c" || e.key.toLowerCase() === "n") {
                e.preventDefault();
                handleOpenCreateModal("todo");
            }

            if(e.key == "Escape") setIsCreateModalOpen(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if(currentView === "landing") {
        return (
            <LandingPage
                onLaunchApp={() => setCurrentView("app")}
                onOpenLogin={() => setCurrentView("auth")}
            />
        );
    }

    if(currentView === "auth") {
        return <AuthPage onLoginSuccess={() => setCurrentView("app")} />;
    }

     return (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
            <Sidebar
                activeTab={activeTab}
                onSelectTab={(tab) => setActiveTab(tab as any)}
            />
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <Navbar onOpenNewIssue={() => handleOpenCreateModal("todo")} />
                
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
                    />
                )}
                <main className="flex-1 overflow-hidden flex flex-col bg-slate-950">
                    {activeTab === "board" && (
                        <KanbanBoard
                            issues={filteredIssues}
                            onAddIssue={(status) => handleOpenCreateModal(status)}
                            onMoveIssue={handleMoveIssue}
                        />
                    )}
                    {activeTab === "backlog" && (
                        <BacklogView
                            issues={issues}
                            onMoveToSprint={handleMoveToSprint}
                            onOpenNewIssue={() => handleOpenCreateModal("backlog")}
                        />
                    )}
                    {activeTab === "analytics" && <AnalyticsView issues={issues} />}
                    {activeTab === "settings" && <SettingsView />}
                </main>
                <CreateIssueModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreateIssue={handleCreateIssue}
                    defaultStatus={defaultModalStatus}
                />
            </div>
        </div>
    );
}