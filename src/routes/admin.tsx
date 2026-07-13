import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { useStore } from "@/lib/store";
import { ShieldCheck, Users, CreditCard, TrendingUp, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Broker Account — PropTrack" },
      { name: "description", content: "Manage your PropTrack broker account, subscription plan, and billing." },
    ],
  }),
  component: AdminPage,
});

const allPlans = [
  {
    name: "Free",
    price: "EGP 0",
    period: "forever",
    features: ["Up to 10 CRM Leads", "Interactive Map", "50 searches/month", "Daily Brief (Standard)"],
    tier: "Starter" as const,
  },
  {
    name: "Power Broker",
    price: "EGP 299",
    period: "/month",
    highlight: true,
    features: ["Up to 200 CRM Leads", "WhatsApp Campaigns", "Daily Brief (Personalized)", "Unlimited Calculators", "5 client-share links"],
    tier: "Pro" as const,
  },
  {
    name: "Power Broker+",
    price: "EGP 599",
    period: "/month",
    features: ["Unlimited CRM Leads", "AI Matchmaker engine", "Google Calendar Connector", "WhatsApp integration", "Unlimited active links"],
    tier: "Agency" as const,
  },
];


const seedAccounts = [
  { name: "Ahmed Khaled", email: "ahmed@nawy-broker.com", tier: "Pro", status: "Active", joined: "Mar 2026" },
  { name: "Salma Adel", email: "salma@coldwell-eg.com", tier: "Agency", status: "Active", joined: "Jan 2026" },
  { name: "Yara Mostafa", email: "yara@vintage-eg.com", tier: "Starter", status: "Trial", joined: "Jun 2026" },
  { name: "Hassan Ali", email: "hassan@indpb.com", tier: "Pro", status: "Past due", joined: "Nov 2025" },
];

function AdminPage() {
  const user = useStore((s) => s.user);

  return (
    <Shell>
      {/* Header */}
      <div className="border-b border-border/60 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5" /> Broker Account Management
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
            Account & Subscriptions
          </h1>
          <p className="mt-2 text-primary-foreground/80">
            Manage your plan, view broker accounts, and upgrade your subscription.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 space-y-12">

        {/* Current User Status */}
        {user && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-2xl font-bold text-accent font-display">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-primary text-lg">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  <Check className="h-3 w-3" /> {user.tier} Plan — Active
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/dashboard/billing">
                <Button className="rounded-xl gap-2">
                  <CreditCard className="h-4 w-4" /> Upgrade Plan
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Plan Cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-primary">Subscription Plans</h2>
            <Link to="/pricing" className="text-sm text-accent hover:underline flex items-center gap-1">
              Full pricing page <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {allPlans.map((p) => {
              const isCurrent = user?.tier === p.tier;
              return (
                <div
                  key={p.name}
                  className={`rounded-3xl border p-6 shadow-sm flex flex-col ${
                    isCurrent
                      ? "border-accent bg-accent/5 ring-2 ring-accent/30"
                      : p.highlight
                      ? "border-border bg-card ring-1 ring-border"
                      : "border-border bg-card"
                  }`}
                >
                  {isCurrent && (
                    <div className="mb-3 inline-block rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground self-start">
                      CURRENT PLAN
                    </div>
                  )}
                  {p.highlight && !isCurrent && (
                    <div className="mb-3 inline-block rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground self-start">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="font-display text-xl font-semibold text-primary">{p.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-display text-3xl font-extrabold text-primary">{p.price}</span>
                    <span className="text-sm text-muted-foreground">{p.period}</span>
                  </div>
                  <ul className="mt-4 space-y-1.5 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-foreground/80">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <Link to="/dashboard/billing">
                      <Button
                        className={`w-full rounded-full text-sm ${
                          isCurrent
                            ? "bg-accent/10 text-accent cursor-default hover:bg-accent/10"
                            : "bg-secondary text-primary hover:bg-secondary/80"
                        }`}
                        disabled={isCurrent}
                      >
                        {isCurrent ? "Current Plan" : "Upgrade"}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Total Brokers</div>
              <div className="font-display text-2xl font-bold text-primary">4</div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <CreditCard className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Active Subscriptions</div>
              <div className="font-display text-2xl font-bold text-primary">3</div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Monthly Revenue</div>
              <div className="font-display text-2xl font-bold text-primary">EGP 2,497</div>
            </div>
          </div>
        </section>

        {/* Broker Accounts Table */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-primary mb-5">Broker Accounts</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-3 text-left">Broker</th>
                  <th className="p-3 text-left">Plan</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {seedAccounts.map((a) => (
                  <tr key={a.email} className="border-b border-border/60 last:border-b-0 hover:bg-secondary/10 transition-colors">
                    <td className="p-3">
                      <div className="font-medium text-primary">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.email}</div>
                    </td>
                    <td className="p-3">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-primary">{a.tier}</span>
                    </td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        a.status === "Active" ? "bg-emerald-100 text-emerald-900"
                        : a.status === "Trial" ? "bg-amber-100 text-amber-900"
                        : "bg-rose-100 text-rose-900"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{a.joined}</td>
                    <td className="p-3 text-right">
                      <button className="text-sm text-accent hover:underline">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            * Account management connects to your ADIB bank subscription system. Submit payment references via{" "}
            <Link to="/dashboard/billing" className="text-accent hover:underline">Billing page</Link>.
          </p>
        </section>
      </div>
    </Shell>
  );
}
