import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type SubscriptionTier } from "@/lib/store";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Compass,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Building2,
  UserCheck,
  Briefcase,
  KeyRound,
  Shield,
  Layers,
  FileText,
} from "lucide-react";
import { validateDeveloperAccess } from "@/data/developer-accounts";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Property Atlas" },
      {
        name: "description",
        content:
          "Unified login for real estate agents, brokers, and master developers on Property Atlas.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const signIn = useStore((s) => s.signIn);
  const signUp = useStore((s) => s.signUp);
  const loginAsDeveloper = useStore((s) => s.loginAsDeveloper);
  const signOut = useStore((s) => s.signOut);
  const user = useStore((s) => s.user);

  // Single unified login mode with optional signup tab
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Signup fields
  const [signupRole, setSignupRole] = useState<"agent" | "broker">("broker");
  const [name, setName] = useState("");
  const [tier, setTier] = useState<SubscriptionTier>("Pro");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    const id = identifier.trim();
    const pw = password;

    if (!id || !pw) {
      setErrorMsg("Please enter both your email/ID and password.");
      setIsLoading(false);
      return;
    }

    if (mode === "signin") {
      try {
        // 1. Check if credentials match a Master Developer Account (by email, slug, or confidential passcode)
        const dev = validateDeveloperAccess(id, pw);
        if (dev) {
          loginAsDeveloper(dev.slug, pw);
          setSuccessMsg(`Welcome, ${dev.name}! Opening Developer Portal...`);
          setTimeout(() => {
            navigate({ to: (`/developer-portal?dev=${dev.slug}` as any) });
          }, 600);
          return;
        }

        // 2. Check Supabase Auth if online
        if (supabase) {
          try {
            const { data: authData, error: authErr } =
              await supabase.auth.signInWithPassword({
                email: id.toLowerCase(),
                password: pw,
              });

            if (!authErr && authData?.user) {
              const meta = authData.user.user_metadata || {};

              // Developer in Supabase
              if (meta.role === "developer" && meta.developer_slug) {
                loginAsDeveloper(meta.developer_slug, pw);
                setSuccessMsg(
                  `Welcome, ${meta.developer_name || "Developer"}! Opening Developer Portal...`,
                );
                setTimeout(() => {
                  navigate({
                    to: (`/developer-portal?dev=${meta.developer_slug}` as any),
                  });
                }, 600);
                return;
              }

              // Agent in Supabase
              if (meta.role === "agent") {
                signIn(id, pw);
                useStore.setState((state) => ({
                  user: state.user
                    ? {
                        ...state.user,
                        role: "agent",
                        name: meta.full_name || state.user.name,
                      }
                    : null,
                }));
                setSuccessMsg(
                  `Welcome, Agent ${meta.full_name || authData.user.email}! Opening Agent Dashboard...`,
                );
                setTimeout(() => navigate({ to: "/dashboard" }), 600);
                return;
              }

              // Broker or Admin in Supabase
              const role = meta.role || "broker";
              signIn(id, pw);
              useStore.setState((state) => ({
                user: state.user
                  ? {
                      ...state.user,
                      role,
                      name: meta.full_name || state.user.name,
                    }
                  : null,
              }));
              const roleLabel = role === "admin" ? "Administrator" : "Broker";
              setSuccessMsg(
                `Welcome, ${roleLabel}! Opening ${roleLabel} Dashboard...`,
              );
              setTimeout(() => navigate({ to: "/dashboard" }), 600);
              return;
            }
          } catch (sbErr) {
            console.warn("Supabase auth check notice:", sbErr);
          }
        }

        // 3. Fallback to Local Store Authentication
        const success = signIn(id, pw);
        if (success) {
          const loggedUser = useStore.getState().user;
          if (loggedUser?.role === "developer") {
            setSuccessMsg(
              `Welcome, ${loggedUser.developerName || loggedUser.name}! Opening Developer Portal...`,
            );
            setTimeout(() => {
              navigate({
                to: (`/developer-portal?dev=${loggedUser.developerSlug || ""}` as any),
              });
            }, 600);
          } else if (loggedUser?.role === "agent") {
            setSuccessMsg(
              `Welcome back, Agent ${loggedUser.name}! Opening Agent Dashboard...`,
            );
            setTimeout(() => navigate({ to: "/dashboard" }), 600);
          } else {
            const roleLabel =
              loggedUser?.role === "admin" ? "Administrator" : "Broker";
            setSuccessMsg(
              `Welcome back, ${roleLabel} ${loggedUser?.name || ""}! Opening ${roleLabel} Dashboard...`,
            );
            setTimeout(() => navigate({ to: "/dashboard" }), 600);
          }
        } else {
          setErrorMsg(
            "Invalid credentials. Please verify your email and password.",
          );
        }
      } catch (err: any) {
        setErrorMsg(err?.message || "Authentication error occurred.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign Up Handler for Agents & Brokers
      if (!name.trim() || !id || !pw) {
        setErrorMsg("Please fill in all details.");
        setIsLoading(false);
        return;
      }

      const success = signUp(id, name.trim(), pw, tier, signupRole);
      if (success) {
        const destTitle = signupRole === "agent" ? "Agent" : "Broker";
        setSuccessMsg(
          `Account created successfully! Opening ${destTitle} Dashboard...`,
        );
        setTimeout(() => navigate({ to: "/dashboard" }), 600);
      } else {
        setErrorMsg("This email address is already registered.");
      }
      setIsLoading(false);
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
            One Unified Access for <br />
            <span className="bg-gradient-to-r from-accent to-violet-500 bg-clip-text text-transparent">
              Agents, Brokers & Developers.
            </span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Sign in with your credentials to access your dedicated workspace.
            Our platform automatically identifies your role and directs you to
            your custom command center.
          </p>
          <div className="space-y-3.5 text-sm text-foreground/80 font-medium">
            <div className="flex items-center gap-2.5">
              <UserCheck className="h-4.5 w-4.5 text-accent shrink-0" />
              <span>
                <strong>Agents:</strong> Real-time unit search, client CRM & AI lead matcher
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Briefcase className="h-4.5 w-4.5 text-accent shrink-0" />
              <span>
                <strong>Brokers:</strong> Team seats, agency pipelines & WhatsApp campaigns
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Building2 className="h-4.5 w-4.5 text-accent shrink-0" />
              <span>
                <strong>Developers:</strong> Live compound inventory, leads feed & bulletin publisher
              </span>
            </div>
          </div>
        </div>

        {/* Form Card Pane */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft-xl max-w-md mx-auto w-full">
          {/* Mode Tabs: Unified Sign In vs Sign Up */}
          <div className="flex gap-1.5 rounded-2xl bg-secondary/60 p-1.5 text-xs mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 rounded-xl py-2.5 font-bold transition-all ${
                mode === "signin"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 rounded-xl py-2.5 font-bold transition-all ${
                mode === "signup"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Logged In State Display */}
          {user ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                <p className="text-sm font-semibold text-primary">
                  You are currently logged in as {user.name}.
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                  {user.role === "developer" && (
                    <>
                      <Building2 className="h-3.5 w-3.5" />
                      <span>Master Developer: {user.developerName || user.name}</span>
                    </>
                  )}
                  {user.role === "agent" && (
                    <>
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Real Estate Agent ({user.tier})</span>
                    </>
                  )}
                  {user.role === "broker" && (
                    <>
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>Broker / Agency ({user.tier})</span>
                    </>
                  )}
                  {user.role === "admin" && (
                    <>
                      <Shield className="h-3.5 w-3.5" />
                      <span>System Administrator</span>
                    </>
                  )}
                </div>
              </div>

              <Button
                className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 py-2.5 font-bold"
                onClick={() =>
                  navigate({
                    to:
                      user.role === "developer"
                        ? (`/developer-portal?dev=${user.developerSlug || ""}` as any)
                        : "/dashboard",
                  })
                }
              >
                {user.role === "developer"
                  ? "Open Developer Portal"
                  : user.role === "agent"
                    ? "Go to Agent Dashboard"
                    : "Go to Broker Dashboard"}
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl py-2.5"
                onClick={signOut}
              >
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

              {/* Mode: Sign Up (Registration for Agents & Brokers) */}
              {mode === "signup" && (
                <div className="space-y-3.5">
                  <div>
                    <Label className="text-xs font-semibold">Account Type</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSignupRole("agent");
                          if (tier === "BrokerageAdmin") setTier("Starter");
                        }}
                        className={`rounded-xl border p-2.5 text-center transition-all ${
                          signupRole === "agent"
                            ? "border-accent bg-accent/10 text-accent font-bold"
                            : "border-border/80 bg-background text-muted-foreground hover:border-border"
                        }`}
                      >
                        <UserCheck className="mx-auto h-4 w-4 mb-1" />
                        <div className="text-xs">Real Estate Agent</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Individual</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSignupRole("broker");
                          if (tier === "Starter") setTier("Pro");
                        }}
                        className={`rounded-xl border p-2.5 text-center transition-all ${
                          signupRole === "broker"
                            ? "border-accent bg-accent/10 text-accent font-bold"
                            : "border-border/80 bg-background text-muted-foreground hover:border-border"
                        }`}
                      >
                        <Briefcase className="mx-auto h-4 w-4 mb-1" />
                        <div className="text-xs">Broker / Brokerage</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Agency Team</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-name" className="text-xs font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="mt-1.5 rounded-xl text-sm"
                      required
                    />
                  </div>

                  {/* Plan Tier Selection */}
                  <div>
                    <Label className="text-xs font-semibold">Workspace Plan</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {(["Starter", "Pro", "BrokerageAdmin"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTier(t)}
                          className={`rounded-xl border p-2 text-center transition-all ${
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

              {/* Shared Credentials Fields (Used for both Unified Sign In and Sign Up) */}
              <div className="space-y-3.5">
                <div>
                  <Label htmlFor="auth-identifier" className="text-xs font-semibold">
                    {mode === "signin"
                      ? "Email or Developer Passcode"
                      : "Work Email"}
                  </Label>
                  <Input
                    id="auth-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      mode === "signin"
                        ? "agent@company.com or DEV_[SLUG]_2026"
                        : "name@brokerage.eg"
                    }
                    className="mt-1.5 rounded-xl text-sm"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <Label htmlFor="auth-password" className="text-xs font-semibold">
                    Password
                  </Label>
                  <Input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="mt-1.5 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 py-2.5 font-bold mt-2"
                size="lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing In...
                  </span>
                ) : mode === "signin" ? (
                  "Sign In to Platform"
                ) : (
                  `Register as ${signupRole === "agent" ? "Agent" : "Broker"}`
                )}
              </Button>

              <div className="text-center text-xs text-muted-foreground pt-1">
                {mode === "signin" ? (
                  <p className="leading-relaxed">
                    Auto-routing: Developers access the Developer Portal; Agents and Brokers access their respective dashboards.
                  </p>
                ) : (
                  <p>
                    Developer accounts are pre-created by Property Atlas. Developers can sign in directly using their credentials.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </Shell>
  );
}
