import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { compoundBySlug, compounds } from "@/data/compounds";
import { CompoundCard } from "@/components/CompoundCard";
import { Heart, Users, Building2, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

function DashboardOverview() {
  const favorites = useStore((s) => s.favorites);
  const recent = useStore((s) => s.recentlyViewed);
  const leads = useStore((s) => s.leads);
  const openLeads = leads.filter((l) => l.stage !== "closed").length;
  const totalPipeline = leads.reduce((s, l) => s + l.budget, 0);

  const trending = compounds.slice(0, 4);

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Open leads" value={String(openLeads)} hint={`${leads.length} total`} />
        <Kpi icon={TrendingUp} label="Pipeline value" value={`EGP ${totalPipeline}M`} hint="across all leads" />
        <Kpi icon={Heart} label="Saved compounds" value={String(favorites.length)} hint="favorites" />
        <Kpi icon={Building2} label="Recently viewed" value={String(recent.length)} hint="this session" />
      </div>

      {recent.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-semibold text-primary">Recently viewed</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map(compoundBySlug).filter(Boolean).slice(0, 4).map((c) => <CompoundCard key={c!.slug} c={c!} />)}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-primary">Market pulse</h2>
          <Link to="/projects" className="text-sm text-accent hover:underline">All projects →</Link>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((c) => <CompoundCard key={c.slug} c={c} />)}
        </div>
      </section>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent"><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-4 font-display text-3xl font-semibold text-primary">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}