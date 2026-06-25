import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — PropTrack" },
      { name: "description", content: "Sign in to your PropTrack broker workspace." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const signIn = useStore((s) => s.signIn);
  const signOut = useStore((s) => s.signOut);
  const user = useStore((s) => s.user);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  return (
    <Shell>
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <div className="hidden lg:block">
          <h1 className="font-display text-5xl font-semibold leading-tight text-primary">
            Welcome to <br /><span className="text-accent">PropTrack.</span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Sign in to access your saved compounds, lead pipeline, and the full broker workspace.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-foreground/80">
            <li>• Track every Sahel compound on one map</li>
            <li>• Convert browsing into closed deals</li>
            <li>• Share project links with clients in a tap</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <div className="flex gap-2 rounded-full bg-secondary p-1 text-sm">
            {(["signin", "signup"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 rounded-full px-4 py-1.5 font-medium transition-colors ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>
          {user ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-muted-foreground">You're signed in as <strong className="text-primary">{user.email}</strong>.</p>
              <Button className="w-full rounded-full" onClick={() => navigate({ to: "/dashboard" })}>Go to dashboard</Button>
              <Button variant="outline" className="w-full rounded-full" onClick={signOut}>Sign out</Button>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              signIn(email, name || undefined);
              navigate({ to: "/dashboard" });
            }}>
              {mode === "signup" && (
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1.5" />
                </div>
              )}
              <div>
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brokerage.com" className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="pw">Password</Label>
                <Input id="pw" type="password" placeholder="••••••••" className="mt-1.5" />
              </div>
              <Button type="submit" className="w-full rounded-full" size="lg">
                {mode === "signin" ? "Sign in" : "Create account"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Demo sign-in stores your session locally in this browser.
              </p>
            </form>
          )}
        </div>
      </div>
    </Shell>
  );
}