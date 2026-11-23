import { useState } from "react";
import type { Issue, Status } from "../types/sprint";
import { COLUMNS } from "../data/mockIssues";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
    issues: Issue[];
    onAddIssue?: (status: Status) => void;
    onCardClick?: (issue: Issue) => void;
    onMoveIssue?: (issueId: string, newStatus: Status) => void;
    members?: any[];
    onUpdateAssignee?: (issueId: string, assigneeId: string | null) => void;
    onDeleteIssue?: (issueId: string) => void;
}

const priorityRank: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };

export function KanbanBoard({
    issues,
    onAddIssue,
    onCardClick,
    onMoveIssue,
    members = [],
    onUpdateAssignee,
    onDeleteIssue,
}: KanbanBoardProps) {
    const [sortConfig, setSortConfig] = useState<Record<string, "priority" | "date" | null>>({});

    const handleSortColumn = (status: Status, criteria: "priority" | "date") => {
        setSortConfig((prev) => ({
            ...prev,
            [status]: prev[status] === criteria ? null : criteria,
        }));
    };

    return (
        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 items-start min-h-0 overflow-y-auto select-none">
            {COLUMNS.map((column) => {
                let columnIssues = issues.filter((issue) => issue.status === column.id);
                const sort = sortConfig[column.id];
                if (sort === "priority") {
                    columnIssues = [...columnIssues].sort(
                        (a, b) => (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0)
                    );
                } else if (sort === "date") {
                    columnIssues = [...columnIssues].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                }

                return (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        issues={columnIssues}
                        onAddIssue={onAddIssue}
                        onCardClick={onCardClick}
                        onMoveIssue={onMoveIssue}
                        members={members}
                        onUpdateAssignee={onUpdateAssignee}
                        onSortColumn={handleSortColumn}
                        onDeleteIssue={onDeleteIssue}
                    />
                );
            })}
        </div>
    );
}
