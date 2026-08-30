import type { Issue, Status } from "../types/sprint";
import { COLUMNS } from "../data/mockIssues";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
    issues: Issue[];
    onAddIssue?: (status: Status) => void;
    onCardClick?: (issue: Issue) => void;
}

export function KanbanBoard({ issues, onAddIssue, onCardClick }: KanbanBoardProps) {
    // TODO: Call useQuery to fetch issues/board data

    return (
        <div className="flex-1 overflow-x-auto p-6 flex gap-5 items-start min-h-0 select-none">
            {COLUMNS.map((column) => {
                const columnIssues = issues.filter((issue) => issue.status === column.id);
                return (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        issues={columnIssues}
                        onAddIssue={onAddIssue}
                        onCardClick={onCardClick}
                    />
                );
            })}
        </div>
    );
}
