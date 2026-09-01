import { useState, type FormEvent } from "react";
import { Flame, ArrowRight, Lock, Mail, User, Eye, EyeOff } from "lucide-react";

interface AuthPageProps {
    onLoginSuccess?: () => void;
}

export function AuthPage({ onLoginSuccess }: AuthPageProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onLoginSuccess?.();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 select-none">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-400 text-slate-950 shadow-lg shadow-sky-500/20 mb-2">
                        <Flame className="w-7 h-7 fill-slate-950 stroke-none" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                        {isSignUp ? "Create your SprintHub account" : "Welcome back to SprintHub"}
                    </h1>
                    <p className="text-xs text-slate-400">
                        {isSignUp
                            ? "Start managing issues with Linear-speed sprint tools."
                            : "Sign in to access your engineering sprint board."}
                    </p>
                </div>
                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={onLoginSuccess}
                        className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-200 text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                        <span>Continue with GitHub</span>
                    </button>
                    <button
                        type="button"
                        onClick={onLoginSuccess}
                        className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-200 text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                        <span>Continue with Google</span>
                    </button>
                </div>
                <div className="relative flex items-center justify-center">
                    <div className="border-t border-slate-800 w-full" />
                    <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-mono absolute">
                        or email
                    </span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Dhruv Jani"
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-medium text-slate-400">
                                Password
                            </label>
                            {!isSignUp && (
                                <button type="button" className="text-[11px] text-sky-400 hover:underline">
                                    Forgot password?
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all mt-2"
                    >
                        <span>{isSignUp ? "Create SprintHub Account" : "Sign In to SprintHub"}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
                <div className="text-center pt-2 text-xs text-slate-500">
                    <span>{isSignUp ? "Already have an account? " : "Don't have an account? "}</span>
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sky-400 font-semibold hover:underline"
                    >
                        {isSignUp ? "Sign in" : "Create one now"}
                    </button>
                </div>
            </div>
        </div>
    );
}
