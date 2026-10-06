import { Plus, MoreHorizontal } from "lucide-react";
import type { Column, Issue, Status } from "../types/sprint";
import { IssueCard } from "./IssueCard";

interface KanbanColumnProps {
    column: Column;
    issues: Issue[];
    onAddIssue?: (status: Status) => void;
    onCardClick?: (issue: Issue) => void;
    onMoveIssue?: (issueId: string, newStatus: Status) => void;
}

export function KanbanColumn({ column, issues, onAddIssue, onCardClick, onMoveIssue }: KanbanColumnProps) {

    const getStatusDotColor = (status: Status) => {
        switch (status) {
            case "backlog":
                return "bg-slate-500 ring-slate-500/20";
            case "todo":
                return "bg-amber-500 ring-amber-500/20";
            case "in_progress":
                return "bg-sky-500 ring-sky-500/20";
            case "done":
                return "bg-emerald-500 ring-emerald-500/20";
        }
    };

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
            }}
            onDrop={(e) => {
                e.preventDefault();
                const issueId = e.dataTransfer.getData("text/plain");
                if (issueId && onMoveIssue) {
                    onMoveIssue(issueId, column.id);
                }
            }}
            className="flex-1 min-w-0 w-full flex flex-col bg-slate-900/40 rounded-lg border border-slate-800/60 p-2.5 max-h-full transition-colors"
        >
            <div className="flex items-center justify-between px-1 py-1.5 mb-2">
                <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ring-4 ${getStatusDotColor(column.id)}`} />
                    <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
                        {column.title}
                    </h3>
                    <span className="bg-slate-800/90 text-slate-400 text-xs px-2 py-0.5 rounded-full font-mono font-medium border border-slate-700/50">
                        {issues.length}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onAddIssue?.(column.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        title="Add issue"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar min-h-[150px]">
                {issues.length > 0 ? (
                    issues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} onClick={onCardClick} />
                    ))
                ) : (
                    <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-lg text-xs text-slate-600 font-medium">
                        No issues
                    </div>
                )}
            </div>
        </div>
    );
}
