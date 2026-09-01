import { Search, ChevronDown, X, Plus } from "lucide-react";
import type { Priority } from "../types/sprint";
import { MOCK_USERS } from "../data/mockIssues";

interface FilterBarProps {
    searchInputRef?: React.RefObject<HTMLInputElement | null>;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedPriority: Priority | 'all';
    onPriorityChange: (priority: Priority | 'all') => void;
    selectedAssigneeId: string | 'all';
    onAssigneeChange: (assigneeId: string | 'all') => void;
    onOpenNewIssue?: () => void;
};

export function FilterBar({
    searchInputRef,
    searchQuery,
    onSearchChange,
    selectedPriority,
    onPriorityChange,
    selectedAssigneeId,
    onAssigneeChange,
    onOpenNewIssue,
}: FilterBarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 bg-slate-950 border-b border-slate-800/80 text-sm select-none">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search issues by title, ID or tags..."
                        className="w-full pl-9 pr-8 py-1.5 bg-slate-900 border border-slate-800 focus:border-sky-500/80 rounded-lg text-slate-100 placeholder-slate-500 text-sm outline-none transition-colors"
                    />
                    {searchQuery ? (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-950/80 border border-slate-800 rounded pointer-events-none">
                            <span className="text-[9px]">⌘</span>K
                        </kbd>
                    )}
                </div>
                <div className="relative">
                    <select
                        value={selectedPriority}
                        onChange={(e) => onPriorityChange(e.target.value as Priority | "all")}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none transition-colors cursor-pointer appearance-none pr-8"
                    >
                        <option value="all">Priority: All</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-400 mr-1">Assignees:</span>
                    <button
                        type="button"
                        onClick={() => onAssigneeChange("all")}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                            selectedAssigneeId === "all"
                                ? "bg-sky-950/60 border-sky-500 text-sky-400"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        All
                    </button>
                    {MOCK_USERS.map((user) => {
                        const isSelected = selectedAssigneeId === user.id;
                        return (
                            <button
                                key={user.id}
                                type="button"
                                onClick={() => onAssigneeChange(isSelected ? "all" : user.id)}
                                className={`w-7 h-7 rounded-full overflow-hidden transition-all ${
                                    isSelected
                                        ? "border-2 border-sky-500 ring-2 ring-sky-500/20 scale-105"
                                        : "border border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100"
                                }`}
                                title={user.name}
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        );
                    })}
                </div>
                <button
                    type="button"
                    onClick={onOpenNewIssue}
                    className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium px-3.5 py-1.5 rounded-lg text-sm flex items-center gap-1.5 shadow-sm transition-colors"
                >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>New Issue</span>
                </button>
            </div>
        </div>
    );
}
