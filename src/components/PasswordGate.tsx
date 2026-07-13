import { useState, useEffect } from "react";
import { Lock, ShieldAlert, KeyRound, Eye, EyeOff, CheckCircle } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export function PasswordGate({ children }: Props) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = sessionStorage.getItem("proptrack_authorized");
    if (auth === "true") {
      setIsAuthorized(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Team1") {
      setIsUnlocking(true);
      setError(false);
      setTimeout(() => {
        sessionStorage.setItem("proptrack_authorized", "true");
        setIsAuthorized(true);
      }, 800);
    } else {
      setError(true);
      setPassword("");
      // Reset error shake after animation
      setTimeout(() => setError(false), 500);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-accent/15 rounded-full blur-[150px] animate-pulse duration-[8000ms]" />

      <div 
        className={`relative w-full max-w-lg mx-4 p-8 md:p-10 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-[0_0_50px_0_rgba(0,0,0,0.5)] transition-all duration-700 transform ${
          isUnlocking ? "scale-95 opacity-0 blur-md pointer-events-none" : "scale-100 opacity-100"
        }`}
      >
        {/* Glow boarder card effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-accent/10 opacity-50 pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          {/* Animated Lock Icon */}
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800/80 border border-white/10 mb-8 shadow-inner overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {isUnlocking ? (
              <CheckCircle className="w-9 h-9 text-emerald-400 animate-bounce" />
            ) : error ? (
              <ShieldAlert className="w-9 h-9 text-rose-500 animate-shake" />
            ) : (
              <Lock className="w-8 h-8 text-emerald-400 animate-pulse" />
            )}
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
            Confidential Access Required
          </h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-sm">
            This portal hosts PropTrack's exclusive live inventories, developer summaries, and real estate intelligence. 
          </p>

          <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
            <div className={`relative rounded-2xl border transition-all duration-300 ${
              error ? "border-rose-500 bg-rose-950/10 animate-shake" : "border-white/10 bg-slate-950/40 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500"
            }`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Access Key"
                className="block w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-slate-500 text-sm font-medium border-0 focus:ring-0 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-500 text-left pl-2 animate-fade-in">
                Access key incorrect. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={isUnlocking}
              className="relative w-full py-4 rounded-2xl font-bold text-sm tracking-wide text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 overflow-hidden group shadow-lg shadow-emerald-950/20"
            >
              {/* Button gradient overlays */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                {isUnlocking ? "Unlocking Portal..." : "Authorize Access"}
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 w-full flex items-center justify-between text-[11px] text-slate-500 font-semibold tracking-wider uppercase">
            <span>Security Status: Active</span>
            <span>Ref: Team1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
