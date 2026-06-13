import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { useStore } from "@/lib/store";
import { LayoutDashboard, Heart, ListChecks, GitCompareArrows } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Broker Dashboard — PropTrack" },
      { name: "description", content: "Your PropTrack workspace — saved compounds, lead pipeline, and compare." },
    ],
  }),
  component: DashboardLayout,
});

const tabs = [
  { to: "/dashboard" as const, label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/leads" as const, label: "Leads", icon: ListChecks },
  { to: "/dashboard/favorites" as const, label: "Favorites", icon: Heart },
  { to: "/dashboard/compare" as const, label: "Compare", icon: GitCompareArrows },
];

function DashboardLayout() {
  const user = useStore((s) => s.user);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Shell>
      <div className="border-b border-border/60 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/70">Broker workspace</div>
              <h1 className="mt-1 font-display text-3xl font-semibold">
                {user ? `Welcome, ${user.name}` : "Welcome, Guest"}
              </h1>
            </div>
            {user && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{user.tier} plan</span>
            )}
          </div>
          <nav className="mt-6 -mb-px flex gap-1 overflow-x-auto">
            {tabs.map((t) => {
              const active = t.exact ? pathname === t.to : pathname === t.to || pathname.startsWith(t.to + "/");
              return (
                <Link key={t.to} to={t.to}
                  className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    active ? "border-accent text-accent" : "border-transparent text-primary-foreground/70 hover:text-primary-foreground"
                  }`}>
                  <t.icon className="h-4 w-4" /> {t.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Outlet />
      </div>
    </Shell>
  );
}