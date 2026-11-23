import { useState, useRef, useEffect } from "react";
import type { Issue, Priority } from "../types/sprint";
import { AlertCircle, ArrowUp, ArrowRight, ArrowDown, GripVertical, UserX, Check, Trash2 } from "lucide-react";

interface IssueCardProps {
    issue: Issue;
    onClick?: (issue: Issue) => void;
    members?: any[];
    onUpdateAssignee?: (issueId: string, assigneeId: string | null) => void;
    onDelete?: (issueId: string) => void;
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

export function IssueCard({ issue, onClick, members = [], onUpdateAssignee, onDelete }: IssueCardProps) {
    const [isAssigneePickerOpen, setIsAssigneePickerOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const priorityBadge = getPriorityBadge(issue.priority);
    const PriorityIcon = priorityBadge.icon;

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsAssigneePickerOpen(false);
            }
        };
        if (isAssigneePickerOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isAssigneePickerOpen]);

    const handleSelectAssignee = (e: React.MouseEvent, assigneeId: string | null) => {
        e.stopPropagation();
        onUpdateAssignee?.(issue.backendId || issue.id, assigneeId);
        setIsAssigneePickerOpen(false);
    };

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", issue.id);
                e.dataTransfer.effectAllowed = "move";
            }}
            onClick={() => onClick?.(issue)}
            className={`group relative bg-slate-900 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700/80 rounded-lg p-3.5 shadow-sm transition-all duration-150 cursor-grab active:cursor-grabbing select-none ${
                isAssigneePickerOpen ? "z-30 ring-1 ring-slate-700" : "z-0"
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    <span className="text-xs font-mono font-medium text-sky-400/90 tracking-wide">
                        {issue.id}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className={`flex items-center gap-1 border px-2 py-0.5 rounded text-[11px] font-medium ${priorityBadge.className}`}>
                        <PriorityIcon className="w-3 h-3" />
                        <span>{priorityBadge.label}</span>
                    </div>
                    {onDelete && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete issue ${issue.id}?`)) {
                                    onDelete(issue.backendId || issue.id);
                                }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded transition-all cursor-pointer"
                            title="Delete issue"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            <h4 className="text-sm font-medium text-slate-200 line-clamp-2 leading-snug mb-3 group-hover:text-slate-100 transition-colors">
                {issue.title}
            </h4>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 relative">
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

                {/* Assignee Section with Click-to-Change Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    {issue.assignee ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAssigneePickerOpen(!isAssigneePickerOpen);
                            }}
                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
                            title={`Assigned to ${issue.assignee.name} (Click to change)`}
                        >
                            <img
                                src={issue.assignee.avatar}
                                alt={issue.assignee.name}
                                className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="text-[11px] font-medium truncate max-w-[80px]">
                                {issue.assignee.name}
                            </span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAssigneePickerOpen(!isAssigneePickerOpen);
                            }}
                            className="px-2 py-0.5 rounded-full text-[11px] font-semibold text-red-400 bg-red-950/60 border border-red-800/60 hover:bg-red-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Click to assign member"
                        >
                            <UserX className="w-3 h-3 text-red-400" />
                            <span>no assignees</span>
                        </button>
                    )}

                    {/* Assignee Picker Popover */}
                    {isAssigneePickerOpen && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1 z-50 text-xs divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-100"
                        >
                            <div className="p-1">
                                <button
                                    type="button"
                                    onClick={(e) => handleSelectAssignee(e, null)}
                                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-left ${
                                        !issue.assignee
                                            ? "bg-red-950/60 text-red-400 font-semibold border border-red-800/40"
                                            : "text-slate-300 hover:bg-red-950/30 hover:text-red-400"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <UserX className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                        <span className="font-medium">No assignee (Unassign)</span>
                                    </div>
                                    {!issue.assignee && <Check className="w-3 h-3 text-red-400 shrink-0" />}
                                </button>
                            </div>

                            <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                                <p className="px-2 py-1 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                                    Assign to:
                                </p>
                                {members.length > 0 ? (
                                    members.map((member) => {
                                        const isCurrent = issue.assignee?.id === member.id;
                                        return (
                                            <button
                                                key={member.id}
                                                type="button"
                                                onClick={(e) => handleSelectAssignee(e, member.id)}
                                                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors text-left ${
                                                    isCurrent
                                                        ? "bg-sky-950/50 text-sky-400 font-semibold"
                                                        : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <img
                                                        src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                                                        alt={member.name}
                                                        className="w-4 h-4 rounded-full object-cover shrink-0"
                                                    />
                                                    <span className="truncate">{member.name}</span>
                                                </div>
                                                {isCurrent && <Check className="w-3 h-3 text-sky-400 shrink-0" />}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="px-2 py-1 text-slate-500 text-[11px] italic">
                                        No members in workspace
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
