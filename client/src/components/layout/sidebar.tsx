import { 
  Kanban, 
  Archive, 
  BarChart3, 
  Settings, 
  Users, 
  Flame,
  CheckCircle2
} from "lucide-react";

interface SidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onGoHome?: () => void;
  members?: any[];
  currentUser?: any;
  onOpenLogin?: () => void;
}

export function Sidebar({ activeTab = "board", onSelectTab, onGoHome, members = [], currentUser, onOpenLogin }: SidebarProps) {
  const navItems = [
    { id: "board", label: "Active Board", icon: Kanban },
    { id: "backlog", label: "Backlog", icon: Archive },
    { id: "analytics", label: "Sprint Metrics", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* 1. App Brand Header (Clickable to go home) */}
      <div 
        onClick={onGoHome}
        className="h-14 px-5 border-b border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-900/60 transition-colors group"
        title="Go to Home"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
          <Flame className="w-5 h-5 fill-slate-950 stroke-none" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100 tracking-tight leading-none group-hover:text-brand-400 transition-colors">
            SprintHub
          </h1>
          <span className="text-[10px] text-slate-500 font-medium">
            Core Engineering Team
          </span>
        </div>
      </div>

      {/* 2. Primary Navigation Links */}
      <div className="p-3 space-y-1">
        <p className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab?.(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-slate-900 text-brand-500 border border-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-brand-500" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Sprint Progress Widget */}
      <div className="mx-3 my-2 p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
            Sprint 24
          </span>
          <span className="text-[11px] font-bold text-brand-500">Active</span>
        </div>
        
        {/* Progress Track */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: "100%" }} />
        </div>
        
        <p className="text-[10px] text-slate-500 mt-2">
          Sprint in progress
        </p>
      </div>

      {/* 4. Team Members List */}
      <div className="p-3 flex-1 overflow-y-auto">
        <p className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Assignees</span>
          <Users className="w-3 h-3 text-slate-500" />
        </p>
        <div className="mt-1 space-y-1">
          {members && members.length > 0 ? (
            members.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-900/50 cursor-pointer transition-colors"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-slate-800 ring-1 ring-slate-700">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    width="24"
                    height="24"
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                </div>
                <span className="text-xs text-slate-300 font-medium truncate">
                  {user.name}
                </span>
              </div>
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-slate-500 italic">No assignees yet</p>
          )}
        </div>
      </div>

      {/* Guest Mode Sign In Banner */}
      {!currentUser && (
        <div className="mx-3 my-2 p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 text-center space-y-2">
          <p className="text-[11px] text-slate-300 font-medium">Guest Mode</p>
          <p className="text-[10px] text-slate-400">Sign in to create issues and manage real sprints.</p>
          <button
            onClick={onOpenLogin}
            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Sign In / Sign Up
          </button>
        </div>
      )}

      {/* 5. Footer Settings */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => onSelectTab?.("settings")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "settings"
              ? "bg-slate-900 text-sky-400 border border-slate-800"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
          }`}
        >
          <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-sky-400" : "text-slate-500"}`} />
          <span>Workspace Settings</span>
        </button>
      </div>
    </aside>
  );
}
