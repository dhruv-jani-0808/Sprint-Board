import { Flame, ArrowRight, Kanban, Zap, Shield, Sparkles } from "lucide-react";

interface LandingPageProps {
    onLaunchApp?: () => void;
    onOpenLogin?: () => void;
}

export function LandingPage({ onLaunchApp, onOpenLogin }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/30 selection:text-sky-200 select-none">
            <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 sm:px-12 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-3 cursor-pointer" onClick={onLaunchApp}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-sky-500/20">
                        <Flame className="w-5 h-5 fill-slate-950 stroke-none" />
                    </div>
                    <span className="text-base font-bold text-slate-100 tracking-tight">
                        SprintHub
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
                    <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
                    <a href="#pricing" className="hover:text-slate-200 transition-colors">Pricing</a>
                    <a href="#docs" className="hover:text-slate-200 transition-colors">Documentation</a>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onOpenLogin}
                        className="text-xs font-semibold text-slate-300 hover:text-slate-100 px-3 py-1.5 transition-colors"
                    >
                        Log In
                    </button>
                    <button
                        type="button"
                        onClick={onLaunchApp}
                        className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
                    >
                        Launch App
                    </button>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800/60 text-sky-400 text-xs font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>SprintHub 2.0 — Engineered for High Velocity</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight">
                        Issue tracking built for modern engineering teams.
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                        Linear-speed sprint planning, real-time keyboard navigation, and instant metrics — zero bloat.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onLaunchApp}
                            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-all"
                        >
                            <span>Get Started for Free</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onLaunchApp}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm px-5 py-2.5 rounded-lg transition-all"
                        >
                            <span>Explore Interactive Demo</span>
                        </button>
                    </div>
                </div>
                <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl overflow-hidden cursor-pointer" onClick={onLaunchApp}>
                    <div className="h-96 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm font-mono">
                        <Kanban className="w-12 h-12 text-sky-500 animate-pulse" />
                        <span>Click anywhere to launch active Sprint Board demo</span>
                    </div>
                </div>
                <div id="features" className="space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-slate-100">
                            Built for speed. Designed for focus.
                        </h2>
                        <p className="text-xs text-slate-400">
                            Everything you need to ship products faster without meeting overhead.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl space-y-3">
                            <div className="w-9 h-9 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-400 flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-200">Keyboard First</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Navigate your board, create issues, and trigger actions entirely via ⌘K keyboard shortcuts.
                            </p>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl space-y-3">
                            <div className="w-9 h-9 rounded-lg bg-teal-950/60 border border-teal-800/60 text-teal-400 flex items-center justify-center">
                                <Kanban className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-200">Fluid Drag & Drop</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Move ticket cards fluidly across Backlog, To Do, In Progress, and Done columns.
                            </p>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl space-y-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-400 flex items-center justify-center">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-200">Real-Time Metrics</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Live burndown charts, velocity tracking, and workload breakdowns for your active sprint.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
