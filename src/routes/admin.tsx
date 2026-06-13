import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin & Subscriptions — PropTrack" },
      { name: "description", content: "PropTrack admin panel — manage broker subscriptions, plans and team seats." },
    ],
  }),
  component: AdminPage,
});

const plans = [
  { name: "Starter", price: 0, period: "free", features: ["Full project library", "Interactive map", "5 saved compounds", "Up to 10 leads"], cta: "Current plan" },
  { name: "Pro", price: 1499, period: "/mo", features: ["Everything in Starter", "Unlimited favorites & leads", "Side-by-side compare", "Priority new launches", "WhatsApp lead inbox"], cta: "Upgrade", highlight: true },
  { name: "Agency", price: 4999, period: "/mo", features: ["Everything in Pro", "Up to 10 broker seats", "Shared lead pool", "Team analytics", "API access & exports", "Dedicated success manager"], cta: "Contact sales" },
];

const seedAccounts = [
  { name: "Ahmed Khaled", email: "ahmed@nawy-broker.com", tier: "Pro", status: "Active", joined: "Mar 2026" },
  { name: "Salma Adel", email: "salma@coldwell-eg.com", tier: "Agency", status: "Active", joined: "Jan 2026" },
  { name: "Yara Mostafa", email: "yara@vintage-eg.com", tier: "Starter", status: "Trial", joined: "Jun 2026" },
  { name: "Hassan Ali", email: "hassan@indpb.com", tier: "Pro", status: "Past due", joined: "Nov 2025" },
];

function AdminPage() {
  return (
    <Shell>
      <div className="border-b border-border/60 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin panel
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Subscriptions & accounts</h1>
          <p className="mt-2 text-primary-foreground/80">Manage broker plans, team seats and billing.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-primary">Plans</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-3xl border p-6 shadow-soft ${p.highlight ? "border-accent bg-card ring-2 ring-accent/30" : "border-border bg-card"}`}>
              {p.highlight && <div className="mb-3 inline-block rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-accent-foreground">MOST POPULAR</div>}
              <h3 className="font-display text-2xl font-semibold text-primary">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-primary">{p.price === 0 ? "Free" : `EGP ${p.price.toLocaleString()}`}</span>
                {p.price > 0 && <span className="text-sm text-muted-foreground">{p.period}</span>}
              </div>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {f}
                  </li>
                ))}
              </ul>
              <Button className={`mt-6 w-full rounded-full ${p.highlight ? "" : "bg-secondary text-primary hover:bg-secondary/80"}`}>{p.cta}</Button>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-semibold text-primary">Broker accounts</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
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
                <tr key={a.email} className="border-b border-border/60 last:border-b-0">
                  <td className="p-3">
                    <div className="font-medium text-primary">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.email}</div>
                  </td>
                  <td className="p-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-primary">{a.tier}</span></td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${a.status === "Active" ? "bg-emerald-100 text-emerald-900" : a.status === "Trial" ? "bg-amber-100 text-amber-900" : "bg-rose-100 text-rose-900"}`}>{a.status}</span>
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

        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
          <strong className="text-primary">Note:</strong> Subscriptions & billing are a UI placeholder in v1. Wire up to Stripe/Paddle and a real auth backend when ready.
        </div>
      </div>
    </Shell>
  );
}