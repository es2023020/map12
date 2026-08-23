import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type SubscriptionTier } from "@/lib/store";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Property Atlas" },
      { name: "description", content: "Sign in or sign up to your Property Atlas broker workspace." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const signIn = useStore((s) => s.signIn);
  const signUp = useStore((s) => s.signUp);
  const signOut = useStore((s) => s.signOut);
  const user = useStore((s) => s.user);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [tier, setTier] = useState<SubscriptionTier>("Pro");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (mode === "signin") {
      const success = signIn(email, password);
      if (success) {
        setSuccessMsg("Success! Redirecting to workspace...");
        setTimeout(() => navigate({ to: "/dashboard" }), 1000);
      } else {
        setErrorMsg("Invalid credentials. Try admin@propertyatlas.com / Team1");
      }
    } else {
      if (!name || !password) {
        setErrorMsg("Please fill in all details");
        return;
      }
      const success = signUp(email, name, password, tier);
      if (success) {
        setSuccessMsg("Account created! Logging in...");
        setTimeout(() => navigate({ to: "/dashboard" }), 1000);
      } else {
        setErrorMsg("Email already registered");
      }
    }
  };

  return (
    <Shell>
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-12 px-4 py-10 lg:grid-cols-2 lg:px-8 animate-in fade-in duration-300">
        {/* Marketing Info Pane */}
        <div className="hidden lg:block space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <Compass className="h-6 w-6 animate-pulse" />
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-tight text-primary">
            The Central Hub for <br />
            <span className="bg-gradient-to-r from-accent to-violet-500 bg-clip-text text-transparent">
              Real Estate Agents.
            </span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Sign up to manage client pipelines, match availability sheets in seconds, configure
            instant WhatsApp campaigns, and track targets.
          </p>
          <div className="space-y-3.5 text-sm text-foreground/80 font-medium">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4.5 w-4.5 text-accent shrink-0" />
              <span>Built-in local AI Client Matcher and reminders</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4.5 w-4.5 text-accent shrink-0" />
              <span>Searchable database of 28+ raw project PDF catalogs</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4.5 w-4.5 text-accent shrink-0" />
              <span>One-tap WhatsApp client sheet dispatcher</span>
            </div>
          </div>
        </div>

        {/* Form Card Pane */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft-xl max-w-md mx-auto w-full">
          <div className="flex gap-2 rounded-full bg-secondary/60 p-1.5 text-sm mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 rounded-full py-2 font-bold transition-all ${
                  mode === m
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {user ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                <p className="text-sm font-semibold text-primary">
                  You are logged in as {user.name} ({user.email}).
                </p>
              </div>
              <Button
                className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 py-2.5 font-bold"
                onClick={() => navigate({ to: "/dashboard" })}
              >
                Go to Workspace
              </Button>
              <Button variant="outline" className="w-full rounded-xl py-2.5" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Alert Feedback Messages */}
              {errorMsg && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-600 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-3.5">
                  <div>
                    <Label htmlFor="name">Broker Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="mt-1.5 rounded-xl"
                      required
                    />
                  </div>

                  {/* Workspace Tiers Selection Grid */}
                  <div>
                    <Label>Brokerage Plan Tier</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {(["Starter", "Pro", "BrokerageAdmin"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTier(t)}
                          className={`rounded-xl border p-2.5 text-center transition-all ${
                            tier === t
                              ? "border-accent bg-accent/10 text-accent font-bold"
                              : "border-border/80 bg-background text-muted-foreground hover:border-border"
                          }`}
                        >
                          <div className="text-xs">{t === "BrokerageAdmin" ? "Agency" : t}</div>
                          <div className="text-[10px] opacity-75 mt-0.5">
                            {t === "Starter" ? "299/mo" : t === "Pro" ? "499/mo" : "1,499/mo"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <Label htmlFor="email">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@brokerage.com"
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pw">Account Password</Label>
                  <Input
                    id="pw"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 py-2.5 font-bold"
                size="lg"
              >
                {mode === "signin" ? "Sign In" : "Register Workspace"}
              </Button>

              <div className="text-center text-xs text-muted-foreground mt-3">
                {mode === "signin" ? (
                  <span>
                    Demo Admin login: <strong>admin@propertyatlas.com</strong> / <strong>Team1</strong>
                  </span>
                ) : (
                  <span>Demo databases store sessions locally in this browser.</span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </Shell>
  );
}
