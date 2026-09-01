import { useState } from "react";
import { Plus, Search, Layers, ArrowUpRight, User } from "lucide-react";
import type { Issue } from "../types/sprint";

interface BacklogViewProps {
    issues: Issue[];
    onMoveToSprint?: (issueId: string) => void;
    onOpenNewIssue?: () => void;
}

export function BacklogView({ issues, onMoveToSprint, onOpenNewIssue }: BacklogViewProps) {
    const [searchQuery, setSearchQuery] = useState("");
    
    const backlogIssues = issues.filter((issue) => {
        if(issue.status !== "backlog") return false;
        if(searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (
                issue.id.toLowerCase().includes(q) || 
                issue.title.toLowerCase().includes(q) ||
                issue.tags.some((t) => t.toLocaleLowerCase().includes(q))
            );
        }
        return true;
    });

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950 text-slate-100 select-none">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                    <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                        Product Backlog
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Manage unsorted tickets and plan upcoming sprint releases.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter backlog issues..."
                            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 focus:border-sky-500/80 rounded-lg text-slate-100 placeholder-slate-500 text-xs outline-none transition-colors"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={onOpenNewIssue}
                        className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Add Backlog Item</span>
                    </button>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-sky-400" />
                        <h3 className="text-sm font-semibold text-slate-200">
                            Unassigned Backlog
                        </h3>
                        <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full font-mono">
                            {backlogIssues.length} Issues
                        </span>
                    </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden divide-y divide-slate-800/60">
                    {backlogIssues.length > 0 ? (
                        backlogIssues.map((issue) => (
                            <div
                                key={issue.id}
                                className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 transition-colors group"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-xs font-mono text-sky-400/90 font-medium">
                                        {issue.id}
                                    </span>
                                    <span className="text-sm text-slate-200 font-medium truncate">
                                        {issue.title}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        {issue.tags.map((t) => (
                                            <span
                                                key={t}
                                                className="bg-slate-800 text-slate-400 text-[11px] px-2 py-0.5 rounded border border-slate-700/50"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <span
                                        className={`text-xs capitalize font-medium ${
                                            issue.priority === "urgent"
                                                ? "text-red-400"
                                                : issue.priority === "high"
                                                ? "text-amber-400"
                                                : issue.priority === "medium"
                                                ? "text-sky-400"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {issue.priority} Priority
                                    </span>
                                    {issue.assignee ? (
                                        <img
                                            src={issue.assignee.avatar}
                                            alt={issue.assignee.name}
                                            title={issue.assignee.name}
                                            className="w-6 h-6 rounded-full border border-slate-700 object-cover"
                                        />
                                    ) : (
                                        <div
                                            title="Unassigned"
                                            className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500"
                                        >
                                            <User className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => onMoveToSprint?.(issue.id)}
                                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 transition-colors flex items-center gap-1"
                                    >
                                        <span>Move to Sprint 24</span>
                                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-500 text-xs font-medium">
                            No backlog items found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
