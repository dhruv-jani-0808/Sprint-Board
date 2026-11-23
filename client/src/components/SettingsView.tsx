import { useState } from "react";
import { Settings, Users, Bell, Trash2, Plus, Save, Check } from "lucide-react";

interface SettingsViewProps {
    onSaveSettings?: (data: { name: string; slug: string }) => void;
    currentUser?: any;
    workspace?: any;
}

export function SettingsView({ onSaveSettings, currentUser, workspace }: SettingsViewProps) {
    const [workspaceName, setWorkspaceName] = useState(workspace?.name || (currentUser ? `${currentUser.name}'s Workspace` : "SprintHub Workspace"));
    const [workspaceSlug, setWorkspaceSlug] = useState(workspace?.slug || "sprinthub.app/engineering");
    const [members, setMembers] = useState(
        currentUser
            ? [{
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                avatar: currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`,
                role: "Owner",
            }]
            : []
    );
    const [isSaved, setIsSaved] = useState(false);

    const [emailDigest, setEmailDigest] = useState(true);
    const [statusNotify, setStatusNotify] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(false);

    const handleSave = () => {
        onSaveSettings?.({ name: workspaceName, slug: workspaceSlug });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleRemoveMember = (id: string) => {
        setMembers((prev) => prev.filter((m) => m.id !== id));
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950 text-slate-100 select-none">
            <div className="pb-4 border-b border-slate-800/80">
                <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                    Workspace Settings
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                    Manage team members, roles, notifications, and workspace preferences.
                </p>
            </div>
            <div className="space-y-6 max-w-4xl">
                {/* General Details */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                        <Settings className="w-4 h-4 text-sky-400" />
                        <h3>Workspace Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Workspace Name
                            </label>
                            <input
                                type="text"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Workspace URL
                            </label>
                            <input
                                type="text"
                                value={workspaceSlug}
                                onChange={(e) => setWorkspaceSlug(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            <span>{isSaved ? "Saved" : "Save Changes"}</span>
                        </button>
                    </div>
                </div>

                {/* Team Members */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                            <Users className="w-4 h-4 text-sky-400" />
                            <h3>Team Members & Roles ({members.length})</h3>
                        </div>
                        <button
                            type="button"
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Invite Member</span>
                        </button>
                    </div>
                    <div className="divide-y divide-slate-800/60 border border-slate-800/60 rounded-lg overflow-hidden">
                        {members.length > 0 ? (
                            members.map((user) => (
                                <div key={user.id} className="p-3 flex items-center justify-between bg-slate-950/40">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                            alt={user.name}
                                            className="w-7 h-7 rounded-full border border-slate-700 object-cover"
                                        />
                                        <div>
                                            <div className="text-xs font-semibold text-slate-200 capitalize">
                                                {user.name}
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <select className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded px-2 py-1 outline-none cursor-pointer">
                                            <option value="admin">Admin</option>
                                            <option value="member">Member</option>
                                            <option value="viewer">Viewer</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMember(user.id)}
                                            className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                                            title="Remove member"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-slate-500 italic">
                                No workspace members yet. Sign in or invite team members.
                            </div>
                        )}
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                        <Bell className="w-4 h-4 text-sky-400" />
                        <h3>Notification Preferences</h3>
                    </div>
                    <div className="space-y-3 text-xs">
                        <label className="flex items-center gap-3 text-slate-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailDigest}
                                onChange={(e) => setEmailDigest(e.target.checked)}
                                className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0 focus:ring-offset-0"
                            />
                            <span>Receive daily email digest for assigned issues</span>
                        </label>
                        <label className="flex items-center gap-3 text-slate-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={statusNotify}
                                onChange={(e) => setStatusNotify(e.target.checked)}
                                className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0 focus:ring-offset-0"
                            />
                            <span>Real-time desktop notifications for card movement</span>
                        </label>
                        <label className="flex items-center gap-3 text-slate-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={weeklySummary}
                                onChange={(e) => setWeeklySummary(e.target.checked)}
                                className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0 focus:ring-offset-0"
                            />
                            <span>Weekly sprint burndown analytics report</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
