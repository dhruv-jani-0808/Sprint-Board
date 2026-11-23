import { Flame, ArrowRight, Kanban, Zap, Shield, Sparkles } from "lucide-react";

interface LandingPageProps {
    onLaunchApp?: () => void;
    onOpenLogin?: () => void;
}

export function LandingPage({ onLaunchApp, onOpenLogin }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/30 selection:text-sky-200 select-none flex flex-col justify-between">
            {/* Header */}
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
                    <button type="button" onClick={onLaunchApp} className="hover:text-slate-200 transition-colors">Interactive Board</button>
                    <a href="https://github.com/dhruv-jani-0808/Sprint-Board" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        <span>GitHub</span>
                    </a>
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

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-16 space-y-20 flex-1">
                {/* Hero Section */}
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
                            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-all cursor-pointer"
                        >
                            <span>Get Started for Free</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onLaunchApp}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm px-5 py-2.5 rounded-lg transition-all cursor-pointer"
                        >
                            <span>Explore Interactive Demo</span>
                        </button>
                    </div>
                </div>

                {/* Features Section (Moved ABOVE the board demo as requested) */}
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
                        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
                            <div className="w-9 h-9 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-400 flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-200">Keyboard First</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Navigate your board, create issues, and trigger actions entirely via ⌘K keyboard shortcuts.
                            </p>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
                            <div className="w-9 h-9 rounded-lg bg-teal-950/60 border border-teal-800/60 text-teal-400 flex items-center justify-center">
                                <Kanban className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-200">Fluid Drag & Drop</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Move ticket cards fluidly across Backlog, To Do, In Progress, and Done columns with zero lag.
                            </p>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
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

                {/* Interactive Board Demo Banner */}
                <div
                    className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl overflow-hidden cursor-pointer hover:border-sky-500/50 transition-all group"
                    onClick={onLaunchApp}
                >
                    <div className="h-80 sm:h-96 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm font-mono group-hover:text-slate-200 transition-colors">
                        <Kanban className="w-12 h-12 text-sky-500 animate-pulse group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-slate-300">Click anywhere to launch active Sprint Board</span>
                        <span className="text-xs text-slate-500">Live WebSockets • Redis In-Memory Sync • PostgreSQL Compound Indexes</span>
                    </div>
                </div>
            </main>

            {/* Footer (Added below click anywhere banner as requested) */}
            <footer className="border-t border-slate-800/80 bg-slate-950/90 py-10 px-6 sm:px-12 mt-12">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={onLaunchApp}>
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-sky-500/20">
                            <Flame className="w-4 h-4 fill-slate-950 stroke-none" />
                        </div>
                        <span className="text-sm font-bold text-slate-200 tracking-tight">
                            SprintHub
                        </span>
                        <span className="text-xs text-slate-500 border-l border-slate-800 pl-3">
                            High-velocity issue tracking
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-slate-400">
                        <button type="button" onClick={onLaunchApp} className="hover:text-slate-200 transition-colors">
                            Active Board
                        </button>
                        <button type="button" onClick={onOpenLogin} className="hover:text-slate-200 transition-colors">
                            Sign In
                        </button>
                        <a
                            href="https://github.com/dhruv-jani-0808/Sprint-Board"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                            <span>Source Code</span>
                        </a>
                    </div>

                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} SprintHub. Built for high-velocity teams.
                    </p>
                </div>
            </footer>
        </div>
    );
}
