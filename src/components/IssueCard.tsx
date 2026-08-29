import { AlertCircle, GripVertical } from "lucide-react";

// TODO: Define props interface

export function IssueCard() {
  // TODO: Implement drag-and-drop / click handler

  return (
    <div className="group relative bg-slate-900 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700/80 rounded-lg p-3.5 shadow-sm transition-all duration-150 cursor-grab active:cursor-grabbing select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
          <span className="text-xs font-mono font-medium text-sky-400/90 tracking-wide">
            DEV-101
          </span>
        </div>
        <div className="flex items-center gap-1 text-red-400 bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded text-[11px] font-medium">
          <AlertCircle className="w-3 h-3" />
          <span>Urgent</span>
        </div>
      </div>

      <h4 className="text-sm font-medium text-slate-200 line-clamp-2 leading-snug mb-3 group-hover:text-slate-100 transition-colors">
        Implement JWT authentication refresh rotation and secure HTTP-only cookies
      </h4>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="bg-slate-800 text-slate-300 text-[11px] font-medium px-2 py-0.5 rounded border border-slate-700/60">
            Backend
          </span>
          <span className="bg-slate-800 text-slate-300 text-[11px] font-medium px-2 py-0.5 rounded border border-slate-700/60">
            Security
          </span>
        </div>

        <div className="flex items-center gap-2">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=jani"
            alt="Assignee"
            className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800 object-cover"
          />
        </div>
      </div>
    </div>
  );
}
