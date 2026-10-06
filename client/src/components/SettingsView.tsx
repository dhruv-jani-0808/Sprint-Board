import { useState } from "react";
import { Settings, Users, Bell, Trash2, Plus, Save, Check } from "lucide-react";
import { MOCK_USERS } from "../data/mockIssues";

interface SettingsViewProps {
    onSaveSettings?: (data: { name: string; slug: string }) => void;
}

export function SettingsView({ onSaveSettings }: SettingsViewProps) {
    const [workspaceName, setWorkspaceName] = useState("SprintHub Core Engineering");
    const [workspaceSlug, setWorkspaceSlug] = useState("sprinthub.app/core-engineering");
    const [members, setMembers] = useState(MOCK_USERS);
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
                        <h3>General Workspace Details</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Workspace Name
                            </label>
                            <input
                                type="text"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Workspace URL Slug
                            </label>
                            <input
                                type="text"
                                value={workspaceSlug}
                                onChange={(e) => setWorkspaceSlug(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                        >
                            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                            <span>{isSaved ? "Saved!" : "Save Changes"}</span>
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
                        {members.map((user) => (
                            <div key={user.id} className="p-3 flex items-center justify-between bg-slate-950/40">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatar}
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
                        ))}
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
                                className="rounded accent-sky-500"
                            />
                            <span>Email digest when assigned to a new issue</span>
                        </label>
                        <label className="flex items-center gap-3 text-slate-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={statusNotify}
                                onChange={(e) => setStatusNotify(e.target.checked)}
                                className="rounded accent-sky-500"
                            />
                            <span>Notify on card status changes across columns</span>
                        </label>
                        <label className="flex items-center gap-3 text-slate-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={weeklySummary}
                                onChange={(e) => setWeeklySummary(e.target.checked)}
                                className="rounded accent-sky-500"
                            />
                            <span>Weekly sprint performance summary email</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
