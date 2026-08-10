import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Shield,
  KeyRound,
  Building2,
  CheckCircle2,
  LogOut,
  CreditCard,
  Mail,
  UserCheck,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const user = useStore((s) => s.user);
  const signOut = useStore((s) => s.signOut);
  const usersDatabase = useStore((s) => s.usersDatabase);

  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUsers = usersDatabase.map((u) => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, name, ...(password ? { password } : {}) };
      }
      return u;
    });

    useStore.setState({
      usersDatabase: updatedUsers,
      user: { ...user, name },
    });

    setSuccessMsg("Profile details updated successfully!");
    setPassword("");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSignOut = () => {
    signOut();
    router.navigate({ to: "/auth" });
  };

  const invoices = [
    {
      id: "INV-2026-004",
      date: "June 28, 2026",
      amount:
        user?.tier === "BrokerageAdmin" ? "EGP 1,499" : user?.tier === "Pro" ? "EGP 499" : "EGP 0",
      status: "Paid via ADIB",
      method: "Bank Transfer",
    },
    {
      id: "INV-2026-003",
      date: "May 28, 2026",
      amount:
        user?.tier === "BrokerageAdmin" ? "EGP 1,499" : user?.tier === "Pro" ? "EGP 499" : "EGP 0",
      status: "Paid via ADIB",
      method: "Bank Transfer",
    },
    {
      id: "INV-2026-002",
      date: "April 28, 2026",
      amount:
        user?.tier === "BrokerageAdmin" ? "EGP 1,499" : user?.tier === "Pro" ? "EGP 499" : "EGP 0",
      status: "Paid via ADIB",
      method: "Bank Transfer",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="border-b border-border/40 pb-4">
        <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
          <User className="h-6 w-6 text-accent" /> My Profile & Workspace Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your broker credentials, check account subscription status, and view transaction
          history.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display font-bold text-primary flex items-center gap-2 mb-4">
              <UserCheck className="h-5 w-5 text-accent" /> Profile Credentials
            </h3>

            {successMsg && (
              <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-600 flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Profile Photo Uploader */}
              <div className="flex items-center gap-4 p-3.5 bg-secondary/20 rounded-2xl border border-border/60">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="h-16 w-16 rounded-full object-cover border-2 border-accent"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground font-display text-2xl font-bold">
                    {user?.name[0]?.toUpperCase() || "B"}
                  </div>
                )}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-primary">Profile Photo avatar</div>
                  <div className="flex gap-2">
                    <label className="cursor-pointer rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 px-3 py-1.5 text-[10px] font-bold transition-all">
                      Choose Image
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              if (user) {
                                const updatedUsers = usersDatabase.map((u) => {
                                  if (u.email.toLowerCase() === user.email.toLowerCase()) {
                                    return { ...u, avatar: base64 };
                                  }
                                  return u;
                                });
                                useStore.setState({
                                  user: { ...user, avatar: base64 },
                                  usersDatabase: updatedUsers,
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {user?.avatar && (
                      <button
                        type="button"
                        onClick={() => {
                          if (user) {
                            const updatedUsers = usersDatabase.map((u) => {
                              if (u.email.toLowerCase() === user.email.toLowerCase()) {
                                return { ...u, avatar: "" };
                              }
                              return u;
                            });
                            useStore.setState({
                              user: { ...user, avatar: "" },
                              usersDatabase: updatedUsers,
                            });
                          }
                        }}
                        className="rounded-lg border border-destructive/20 hover:bg-destructive/5 text-destructive px-3 py-1.5 text-[10px] font-bold transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Email Address (Primary)
                </label>
                <div className="mt-1.5 font-semibold text-primary text-sm bg-secondary/30 p-2.5 rounded-xl border border-border/60">
                  {user?.email || "guest@proptrack.eg"}
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">
                  Email address cannot be changed. Contact support to transfer workspace ownership.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Full Display Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <KeyRound className="h-3.5 w-3.5" /> Update Password (Optional)
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password to update..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="rounded-xl font-bold bg-accent text-accent-foreground hover:bg-accent/90 px-5"
                >
                  Update Account Details
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display font-bold text-primary flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-accent" /> Payment History (ADIB Bank)
            </h3>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="p-3">Invoice ID</th>
                    <th className="p-3">Billing Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-all"
                    >
                      <td className="p-3 font-mono font-bold text-primary">{inv.id}</td>
                      <td className="p-3 text-muted-foreground">{inv.date}</td>
                      <td className="p-3 font-semibold text-primary">{inv.amount}</td>
                      <td className="p-3">
                        <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-accent/20 bg-accent/5 p-6 shadow-sm space-y-4">
            <h3 className="font-display font-extrabold text-primary flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" /> Workspace Subscription
            </h3>

            <div className="space-y-1.5">
              <div className="text-xs text-muted-foreground">Current Plan Level</div>
              <div className="font-display text-2xl font-black text-accent uppercase tracking-wider">
                {user?.tier || "Starter"}
              </div>
            </div>

            <div className="border-t border-border/40 pt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Workspace Status</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Verified Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Renewal Date</span>
                <span className="font-bold text-primary">July 28, 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Processor</span>
                <span className="font-bold text-primary">ADIB Transfer</span>
              </div>
            </div>

            <div className="border-t border-border/40 pt-3">
              <button
                onClick={() => router.navigate({ to: "/dashboard/billing" })}
                className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold py-2"
              >
                Upgrade or Change Plan
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-primary flex items-center gap-2">
              <Building2 className="h-5 w-5 text-accent" /> Connector Integrations
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Google Calendar Connect</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">WhatsApp Web Link</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">AI Matchmaker alerts</span>
                <span
                  className={`font-semibold ${user?.tier === "Starter" ? "text-muted-foreground/60" : "text-emerald-600"}`}
                >
                  {user?.tier === "Starter" ? "Unavailable (Upgrade)" : "Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm text-center space-y-3">
            <div className="text-xs text-muted-foreground">
              Finished working in your broker workspace?
            </div>
            <button
              onClick={handleSignOut}
              className="w-full rounded-xl border border-destructive/20 hover:bg-destructive/5 text-destructive font-bold text-xs py-2.5 flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="h-4 w-4" /> Sign Out from PropTrack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
