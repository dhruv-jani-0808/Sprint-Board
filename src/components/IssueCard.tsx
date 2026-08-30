import type { Issue, Priority } from "../types/sprint";
import { AlertCircle, ArrowUp, ArrowRight, ArrowDown, GripVertical, User } from "lucide-react";

interface IssueCardProps {
    issue: Issue;
    onClick?: (issue: Issue) => void;
}

const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
        case "urgent":
            return {
                label: "Urgent",
                icon: AlertCircle,
                className: "text-red-400 bg-red-950/40 border-red-900/40",
            };
        case "high":
            return {
                label: "High",
                icon: ArrowUp,
                className: "text-amber-400 bg-amber-950/40 border-amber-900/40",
            };
        case "medium":
            return {
                label: "Medium",
                icon: ArrowRight,
                className: "text-sky-400 bg-sky-950/40 border-sky-900/40",
            };
        case "low":
            return {
                label: "Low",
                icon: ArrowDown,
                className: "text-slate-400 bg-slate-800/40 border-slate-700/40",
            };
    }
};

export function IssueCard({ issue, onClick }: IssueCardProps) {
    const priorityBadge = getPriorityBadge(issue.priority);
    const PriorityIcon = priorityBadge.icon;

    return (
        <div
            onClick={() => onClick?.(issue)}
            className="group relative bg-slate-900 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700/80 rounded-lg p-3.5 shadow-sm transition-all duration-150 cursor-grab active:cursor-grabbing select-none"
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    <span className="text-xs font-mono font-medium text-sky-400/90 tracking-wide">
                        {issue.id}
                    </span>
                </div>
                <div className={`flex items-center gap-1 border px-2 py-0.5 rounded text-[11px] font-medium ${priorityBadge.className}`}>
                    <PriorityIcon className="w-3 h-3" />
                    <span>{priorityBadge.label}</span>
                </div>
            </div>

            <h4 className="text-sm font-medium text-slate-200 line-clamp-2 leading-snug mb-3 group-hover:text-slate-100 transition-colors">
                {issue.title}
            </h4>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {issue.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-slate-800 text-slate-300 text-[11px] font-medium px-2 py-0.5 rounded border border-slate-700/60"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {issue.assignee ? (
                        <img
                            src={issue.assignee.avatar}
                            alt={issue.assignee.name}
                            title={issue.assignee.name}
                            className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800 object-cover"
                        />
                    ) : (
                        <div
                            title="Unassigned"
                            className="w-6 h-6 rounded-full border border-dashed border-slate-700 bg-slate-900 text-slate-500 flex items-center justify-center"
                        >
                            <User className="w-3 h-3" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
