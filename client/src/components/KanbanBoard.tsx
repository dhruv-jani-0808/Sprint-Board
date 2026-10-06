import type { Issue, Status } from "../types/sprint";
import { COLUMNS } from "../data/mockIssues";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
    issues: Issue[];
    onAddIssue?: (status: Status) => void;
    onCardClick?: (issue: Issue) => void;
    onMoveIssue?: (issueId: string, newStatus: Status) => void;
}

export function KanbanBoard({ issues, onAddIssue, onCardClick, onMoveIssue }: KanbanBoardProps) {
    // TODO: Call useQuery to fetch issues/board data

    return (
        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 items-start min-h-0 overflow-y-auto select-none">
            {COLUMNS.map((column) => {
                const columnIssues = issues.filter((issue) => issue.status === column.id);
                return (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        issues={columnIssues}
                        onAddIssue={onAddIssue}
                        onCardClick={onCardClick}
                        onMoveIssue={onMoveIssue}
                    />
                );
            })}
        </div>
    );
}
