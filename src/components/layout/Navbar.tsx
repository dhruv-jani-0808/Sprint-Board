import { Plus, Layers } from "lucide-react";

interface NavbarProps {
  onOpenNewIssue?: () => void;
}

export function Navbar({ onOpenNewIssue }: NavbarProps) {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2.5 text-sm font-medium">
        <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
          <Layers className="w-4 h-4 text-brand-500" />
        </div>
        <span className="text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
          Engineering
        </span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-100 font-semibold flex items-center gap-2">
          Sprint 24
          <span className="px-2 py-0.5 text-[11px] font-medium bg-brand-500/10 text-brand-500 border border-brand-500/20 rounded-full">
            Active
          </span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live Sync</span>
        </div>

        <button
          onClick={onOpenNewIssue}
          className="bg-brand-500 hover:bg-brand-600 active:scale-95 text-slate-950 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-brand-500/10"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Issue</span>
        </button>
      </div>
    </header>
  );
}