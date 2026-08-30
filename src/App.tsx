import { useState, useMemo } from "react";
import { Sidebar } from "./components/layout/sidebar";
import { Navbar } from "./components/layout/Navbar";
import { FilterBar } from "./components/FilterBar";
import { KanbanBoard } from "./components/KanbanBoard";
import { INITIAL_ISSUES, MOCK_USERS } from "./data/mockIssues";
import type { Issue, Priority, Status } from "./types/sprint";
import { CreateIssueModal } from "./components/CreateIssueModal";

export default function App() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPriority, setSelectedPriority] = useState<Priority | "all">("all");
    const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | "all">("all");
    const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [defaultModalStatus, setDefaultModalStatus] = useState<Status>("todo");

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

    return (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
            <Sidebar activeTab="board" onSelectTab={() => {}} />
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <Navbar onOpenNewIssue={() => handleOpenCreateModal("todo")} />
                <FilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedPriority={selectedPriority}
                    onPriorityChange={setSelectedPriority}
                    selectedAssigneeId={selectedAssigneeId}
                    onAssigneeChange={setSelectedAssigneeId}
                    onOpenNewIssue={() => handleOpenCreateModal("todo")}
                />
                <main className="flex-1 overflow-hidden flex flex-col bg-slate-950">
                    <KanbanBoard issues={filteredIssues} onAddIssue={(status) => handleOpenCreateModal(status)}/>
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