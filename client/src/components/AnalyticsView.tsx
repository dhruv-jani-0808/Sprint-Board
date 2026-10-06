import type { Issue } from "../types/sprint";
import { BarChart3, TrendingUp, CheckCircle2, Clock, Users } from "lucide-react";
import { MOCK_USERS } from "../data/mockIssues";

interface AnalyticsViewProps {
    issues: Issue[];
}

export function AnalyticsView({ issues }: AnalyticsViewProps) {
    const totalIssues = issues.length;
    const completedIssues = issues.filter((i) => i.status === "done").length;
    const inProgressIssues = issues.filter((i) => i.status === "in_progress").length;
    const pendingIssues = issues.filter((i) => i.status === "todo" || i.status === "backlog").length;
    
    const completionRate = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;
    const inProgressRate = totalIssues > 0 ? Math.round((inProgressIssues / totalIssues) * 100) : 0;
    const pendingRate = totalIssues > 0 ? Math.round((pendingIssues / totalIssues) * 100) : 0;
    
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950 text-slate-100 select-none">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                    <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                        Sprint Metrics & Analytics
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Performance analytics, velocity tracking, and workload distribution for Sprint 24.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                        <option value="sprint-24">Sprint 24 (Active)</option>
                        <option value="sprint-23">Sprint 23 (Completed)</option>
                        <option value="sprint-22">Sprint 22 (Completed)</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                        <span>Total Issues</span>
                        <BarChart3 className="w-4 h-4 text-sky-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">{totalIssues}</div>
                    <div className="text-[11px] text-slate-500 font-medium">Active sprint total</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                        <span>Completion Rate</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">{completionRate}%</div>
                    <div className="text-[11px] text-emerald-400 font-medium">{completedIssues} of {totalIssues} completed</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                        <span>Sprint Velocity</span>
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">34 pts</div>
                    <div className="text-[11px] text-slate-500 font-medium">On track for goal</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                        <span>Avg Cycle Time</span>
                        <Clock className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">2.4 days</div>
                    <div className="text-[11px] text-emerald-400 font-medium">-12% faster than Sprint 23</div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl space-y-4">
                    <h3 className="text-sm font-semibold text-slate-200">
                        Sprint Burndown & Progress
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Completed (Done)</span>
                                <span className="font-mono text-slate-200">{completedIssues} issues ({completionRate}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>In Progress</span>
                                <span className="font-mono text-slate-200">{inProgressIssues} issues ({inProgressRate}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${inProgressRate}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>To Do & Backlog</span>
                                <span className="font-mono text-slate-200">{pendingIssues} issues ({pendingRate}%)</span>
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
                        {MOCK_USERS.map((user) => {
                            const userAssigned = issues.filter((i) => i.assignee?.id === user.id);
                            const userDone = userAssigned.filter((i) => i.status === "done").length;
                            const userRate = userAssigned.length > 0 ? Math.round((userDone / userAssigned.length) * 100) : 0;
                            return (
                                <div key={user.id} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <img
                                            src={user.avatar}
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
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
