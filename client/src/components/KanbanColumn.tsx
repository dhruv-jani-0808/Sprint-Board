import { useState, useRef, useEffect } from "react";
import { Plus, MoreHorizontal, ArrowUpDown, Clock } from "lucide-react";
import type { Column, Issue, Status } from "../types/sprint";
import { IssueCard } from "./IssueCard";

interface KanbanColumnProps {
    column: Column;
    issues: Issue[];
    onAddIssue?: (status: Status) => void;
    onCardClick?: (issue: Issue) => void;
    onMoveIssue?: (issueId: string, newStatus: Status) => void;
    members?: any[];
    onUpdateAssignee?: (issueId: string, assigneeId: string | null) => void;
    onSortColumn?: (status: Status, criteria: "priority" | "date") => void;
    onDeleteIssue?: (issueId: string) => void;
}

export function KanbanColumn({
    column,
    issues,
    onAddIssue,
    onCardClick,
    onMoveIssue,
    members = [],
    onUpdateAssignee,
    onSortColumn,
    onDeleteIssue,
}: KanbanColumnProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

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
            className="flex-1 min-w-0 w-full flex flex-col bg-slate-900/40 rounded-lg border border-slate-800/60 p-2.5 max-h-full transition-colors relative"
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

                <div className="flex items-center gap-1 relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => onAddIssue?.(column.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                        title={`Add issue to ${column.title}`}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                            isMenuOpen ? "bg-slate-800 text-slate-200" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        }`}
                        title="Column actions"
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Column 3-Dots Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-40 text-xs divide-y divide-slate-800/60">
                            <div className="p-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onAddIssue?.(column.id);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-left"
                                >
                                    <Plus className="w-3.5 h-3.5 text-sky-400" />
                                    <span>Add Issue to {column.title}</span>
                                </button>
                            </div>
                            <div className="p-1 space-y-0.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onSortColumn?.(column.id, "priority");
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-left"
                                >
                                    <ArrowUpDown className="w-3.5 h-3.5" />
                                    <span>Sort by Priority</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onSortColumn?.(column.id, "date");
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-left"
                                >
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Sort by Newest</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 pb-16 custom-scrollbar min-h-[150px]">
                {issues.length > 0 ? (
                    issues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            onClick={onCardClick}
                            members={members}
                            onUpdateAssignee={onUpdateAssignee}
                            onDelete={onDeleteIssue}
                        />
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
