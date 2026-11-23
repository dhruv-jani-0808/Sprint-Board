import { useMemo } from "react";
import type { Issue } from "../types/sprint";
import { BarChart3, TrendingUp, CheckCircle2, Clock, Users } from "lucide-react";

interface AnalyticsViewProps {
    issues: Issue[];
    sprintName?: string;
}

export function AnalyticsView({ issues, sprintName }: AnalyticsViewProps) {
    const totalIssues = issues.length;
    const completedIssues = issues.filter((i) => i.status === "done").length;
    const inProgressIssues = issues.filter((i) => i.status === "in_progress").length;
    const pendingIssues = issues.filter((i) => i.status === "todo" || i.status === "backlog").length;
    
    const completionRate = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;
    const inProgressRate = totalIssues > 0 ? Math.round((inProgressIssues / totalIssues) * 100) : 0;
    const pendingRate = totalIssues > 0 ? Math.round((pendingIssues / totalIssues) * 100) : 0;

    const activeAssignees = useMemo(() => {
        const map = new Map<string, any>();
        issues.forEach((i) => {
            if (i.assignee) {
                map.set(i.assignee.id, i.assignee);
            }
        });
        return Array.from(map.values());
    }, [issues]);
    
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950 text-slate-100 select-none">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                    <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                        Sprint Metrics & Analytics
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Performance analytics, velocity tracking, and workload distribution for your active sprint.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{sprintName || "Sprint 1"} (Active)</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                        <span>Total Issues</span>
                        <BarChart3 className="w-4 h-4 text-sky-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">
                        {totalIssues}
                    </div>
                    <p className="text-[11px] text-slate-500">Active sprint scope</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                        <span>Completed</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">
                        {completedIssues}
                    </div>
                    <p className="text-[11px] text-emerald-500/80 font-medium">
                        {completionRate}% of sprint complete
                    </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                        <span>In Progress</span>
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">
                        {inProgressIssues}
                    </div>
                    <p className="text-[11px] text-slate-500">Active engineering focus</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                        <span>Pending</span>
                        <Clock className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">
                        {pendingIssues}
                    </div>
                    <p className="text-[11px] text-slate-500">Backlog and to do</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-200">
                            Sprint Completion Progress
                        </h3>
                        <span className="text-xs font-mono text-emerald-400 font-medium">
                            {completionRate}% Complete
                        </span>
                    </div>
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Done</span>
                                <span className="font-mono text-slate-200">{completedIssues} ({completionRate}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>In Progress</span>
                                <span className="font-mono text-slate-200">{inProgressIssues} ({inProgressRate}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${inProgressRate}%` }} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Pending</span>
                                <span className="font-mono text-slate-200">{pendingIssues} ({pendingRate}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-600 rounded-full transition-all duration-500" style={{ width: `${pendingRate}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-200">
                            Team Workload Breakdown
                        </h3>
                        <Users className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="space-y-3">
                        {activeAssignees.length > 0 ? (
                            activeAssignees.map((user) => {
                                const userAssigned = issues.filter((i) => i.assignee?.id === user.id);
                                const userDone = userAssigned.filter((i) => i.status === "done").length;
                                const userRate = userAssigned.length > 0 ? Math.round((userDone / userAssigned.length) * 100) : 0;
                                return (
                                    <div key={user.id} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                alt={user.name}
                                                className="w-6 h-6 rounded-full border border-slate-700 object-cover"
                                            />
                                            <span className="font-medium text-slate-300 capitalize">{user.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-400 font-mono">{userAssigned.length} assigned</span>
                                            <span className="bg-slate-800 text-sky-400 px-2 py-0.5 rounded font-mono text-[11px]">
                                                {userRate}% done
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-xs text-slate-500 py-6 text-center italic">
                                No assignees assigned to issues in this sprint
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
