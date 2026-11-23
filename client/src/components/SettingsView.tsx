import { useState, useMemo, useEffect } from "react";
import { Settings, Users, Bell, Trash2, Plus, Save, Check, X, Mail, Shield } from "lucide-react";
import { workspaceApi } from "../api/client";

interface SettingsViewProps {
    onSaveSettings?: (data: { name: string; slug: string }) => void;
    currentUser?: any;
    workspace?: any;
    onMemberInvited?: () => void;
}

export function SettingsView({ onSaveSettings, currentUser, workspace, onMemberInvited }: SettingsViewProps) {
    const [workspaceName, setWorkspaceName] = useState(workspace?.name || (currentUser ? `${currentUser.name}'s Workspace` : "SprintHub Workspace"));
    const [workspaceSlug, setWorkspaceSlug] = useState(workspace?.slug || "sprinthub.app/engineering");
    
    const initialMembers = useMemo(() => {
        if (workspace?.members && workspace.members.length > 0) {
            return workspace.members.map((m: any) => ({
                id: m.user?.id || m.userId || m.id,
                name: m.user?.name || m.name,
                email: m.user?.email || m.email,
                avatar: m.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user?.name || "user"}`,
                role: m.role || "MEMBER",
            }));
        }
        if (currentUser) {
            return [{
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                avatar: currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`,
                role: "ADMIN",
            }];
        }
        return [];
    }, [workspace, currentUser]);

    const [members, setMembers] = useState<any[]>(initialMembers);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (workspace?.name) setWorkspaceName(workspace.name);
        if (workspace?.slug) setWorkspaceSlug(workspace.slug);
    }, [workspace?.name, workspace?.slug]);

    useEffect(() => {
        setMembers(initialMembers);
    }, [initialMembers]);

    // Invite Modal State
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("MEMBER");
    const [isInviting, setIsInviting] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

    const [emailDigest, setEmailDigest] = useState(true);
    const [statusNotify, setStatusNotify] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(false);

    const handleSave = async () => {
        if (workspace?.id) {
            try {
                await workspaceApi.update(workspace.id, {
                    name: workspaceName,
                    slug: workspaceSlug,
                });
                onMemberInvited?.();
            } catch (err: any) {
                console.error("Failed to update workspace:", err);
            }
        }
        onSaveSettings?.({ name: workspaceName, slug: workspaceSlug });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleRemoveMember = async (userId: string) => {
        setMembers((prev: any[]) => prev.filter((m: any) => m.id !== userId));
        if (workspace?.id) {
            try {
                await workspaceApi.removeMember(workspace.id, userId);
                onMemberInvited?.();
            } catch (err: any) {
                console.error("Failed to remove member:", err);
            }
        }
    };

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim()) {
            setInviteError("Please enter an email address");
            return;
        }

        if (!workspace?.id) {
            // Local fallback if no workspace is active yet
            const newMember = {
                id: `guest-${Date.now()}`,
                name: inviteEmail.split("@")[0],
                email: inviteEmail.trim(),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inviteEmail.split("@")[0]}`,
                role: inviteRole,
            };
            setMembers((prev: any[]) => [...prev, newMember]);
            setInviteSuccess("Member added successfully!");
            setInviteEmail("");
            setTimeout(() => {
                setIsInviteOpen(false);
                setInviteSuccess(null);
            }, 1200);
            return;
        }

        setIsInviting(true);
        setInviteError(null);
        setInviteSuccess(null);

        try {
            const res = await workspaceApi.invite(workspace.id, inviteEmail.trim(), inviteRole);
            const user = res.member?.user || {
                id: res.member?.id || Date.now().toString(),
                name: inviteEmail.split("@")[0],
                email: inviteEmail.trim(),
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inviteEmail.split("@")[0]}`,
            };

            setMembers((prev: any[]) => [
                ...prev,
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
                    role: inviteRole,
                },
            ]);

            setInviteSuccess("Member invited successfully!");
            setInviteEmail("");
            onMemberInvited?.();
            setTimeout(() => {
                setIsInviteOpen(false);
                setInviteSuccess(null);
            }, 1200);
        } catch (err: any) {
            setInviteError(err.message || "Failed to invite member");
        } finally {
            setIsInviting(false);
        }
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
                            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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
                            onClick={() => {
                                setIsInviteOpen(true);
                                setInviteError(null);
                                setInviteSuccess(null);
                            }}
                            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Invite Member</span>
                        </button>
                    </div>
                    <div className="divide-y divide-slate-800/60 border border-slate-800/60 rounded-lg overflow-hidden">
                        {members.length > 0 ? (
                            members.map((user: any) => (
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
                                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400 uppercase">
                                            {user.role}
                                        </span>
                                        {user.id !== currentUser?.id && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMember(user.id)}
                                                className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                                                title="Remove member"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-slate-500 italic">
                                No workspace members yet. Click "Invite Member" above to add teammates.
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

            {/* Invite Member Modal */}
            {isInviteOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
                                <Users className="w-5 h-5 text-sky-400" />
                                <h3>Invite Team Member</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsInviteOpen(false)}
                                className="text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {inviteError && (
                            <div className="bg-red-950/50 border border-red-800/60 text-red-300 text-xs px-3 py-2 rounded-lg">
                                {inviteError}
                            </div>
                        )}

                        {inviteSuccess && (
                            <div className="bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs px-3 py-2 rounded-lg">
                                {inviteSuccess}
                            </div>
                        )}

                        <form onSubmit={handleSendInvite} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                    Teammate's Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="teammate@company.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                    Role
                                </label>
                                <div className="relative">
                                    <Shield className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <select
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 outline-none transition-colors cursor-pointer"
                                    >
                                        <option value="MEMBER">Member (Can create & move tickets)</option>
                                        <option value="ADMIN">Admin (Full workspace control)</option>
                                        <option value="VIEWER">Viewer (Read-only)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteOpen(false)}
                                    className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isInviting}
                                    className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
                                >
                                    {isInviting ? "Inviting..." : "Send Invite"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
