import { Plus, MoreHorizontal } from "lucide-react";
import { IssueCard } from "./IssueCard";

// TODO: Define props interface

export function KanbanColumn() {
  // TODO: Call useMutation for moving cards between columns

  return (
    <div className="w-80 flex-shrink-0 flex flex-col bg-slate-900/50 rounded-xl border border-slate-800/80 p-3 max-h-full">
      <div className="flex items-center justify-between px-1 py-1.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-sky-500/10" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
            In Progress
          </h3>
          <span className="bg-slate-800/90 text-slate-400 text-xs px-2 py-0.5 rounded-full font-mono font-medium border border-slate-700/50">
            2
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
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

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar min-h-[200px]">
        <IssueCard />
        <IssueCard />
      </div>
    </div>
  );
}
