import { Search, Filter, ChevronDown, X, Plus } from "lucide-react";

// TODO: Define props interface

export function FilterBar() {
  // TODO: Handle search and filter state

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 bg-slate-950 border-b border-slate-800/80 text-sm">
      <div className="flex items-center gap-3 flex-1 min-w-[280px]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search issues by title, ID or tags..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-900 border border-slate-800 focus:border-sky-500/80 rounded-lg text-slate-100 placeholder-slate-500 text-sm outline-none transition-colors"
          />
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative">
          <button
            type="button"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg px-3 py-1.5 text-sm flex items-center gap-2 transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Priority: All</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 mr-1">Assignees:</span>
          <button
            type="button"
            className="w-7 h-7 rounded-full border-2 border-sky-500 ring-2 ring-sky-500/20 overflow-hidden transition-all"
            title="jani"
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=jani"
              alt="jani"
              className="w-full h-full object-cover"
            />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-full border border-slate-800 hover:border-slate-600 overflow-hidden opacity-60 hover:opacity-100 transition-all"
            title="gandhi"
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=gandhi"
              alt="gandhi"
              className="w-full h-full object-cover"
            />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-full border border-slate-800 hover:border-slate-600 overflow-hidden opacity-60 hover:opacity-100 transition-all"
            title="uday"
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=uday"
              alt="uday"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        <button
          type="button"
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium px-3.5 py-1.5 rounded-lg text-sm flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Issue</span>
        </button>
      </div>
    </div>
  );
}
