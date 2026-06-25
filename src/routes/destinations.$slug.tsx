import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { MapClient } from "@/components/map/MapClient";
import { CompoundCard } from "@/components/CompoundCard";
import { destinationBySlug, destinations } from "@/data/destinations";
import { compoundsByDestination, compounds } from "@/data/compounds";
import { ArrowLeft, MapPin, Building2, Wallet, Calendar, Waves, TrendingUp, Map as MapIcon } from "lucide-react";

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }) => {
    const a = destinationBySlug(params.slug);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — Compounds & Map | PropTrack` },
      { name: "description", content: `${loaderData.blurb} Browse every compound in ${loaderData.name} on PropTrack.` },
      { property: "og:title", content: `${loaderData.name} | PropTrack` },
      { property: "og:description", content: loaderData.blurb },
      { property: "og:image", content: loaderData.hero },
    ] : [],
  }),
  component: AreaPage,
});

function AreaPage() {
  const a = Route.useLoaderData();
  const list = compoundsByDestination(a.slug);

  const avgPrice = list.length > 0
    ? Math.round(list.reduce((s, c) => s + c.priceFrom, 0) / list.length)
    : 0;
  const beachfrontCount = list.filter((c) => c.beachfront).length;
  const deliveredCount = list.filter((c) => c.status === "Delivered").length;
  const minPrice = list.length > 0 ? Math.min(...list.map((c) => c.priceFrom)) : 0;
  const maxPrice = list.length > 0 ? Math.max(...list.map((c) => c.priceFrom)) : 0;

  // Get related destinations in the same region
  const relatedAreas = destinations.filter((x) => x.region === a.region && x.slug !== a.slug).slice(0, 4);

  return (
    <Shell>
      {/* Hero */}
      <div className="relative h-[320px] md:h-[380px] overflow-hidden">
        <img src={a.hero} alt={a.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 text-primary-foreground lg:px-8">
          <Link to="/destinations" className="inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-accent transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> All destinations
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-4 w-4 rounded-full ring-2 ring-white/40" style={{ background: a.color }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">
              {a.city ?? "Egypt"} · {a.region.replace(/-/g, " ")}
            </span>
          </div>
          <h1 className="mt-1 font-display text-4xl md:text-5xl font-semibold tracking-tight">{a.name}</h1>
          {a.kmRange && (
            <p className="mt-1 text-primary-foreground/70">{a.kmRange} · Mediterranean coast</p>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4 lg:grid-cols-5">
            <StatBar icon={Building2} label="Total projects" value={String(list.length)} color={a.color} />
            <StatBar icon={Wallet} label="Price range" value={`EGP ${minPrice}–${maxPrice}M`} color={a.color} />
            <StatBar icon={TrendingUp} label="Avg. price" value={`EGP ${avgPrice}M`} color={a.color} className="hidden md:flex" />
            <StatBar icon={Calendar} label="Delivered" value={`${deliveredCount} projects`} color={a.color} className="hidden md:flex" />
            {beachfrontCount > 0 && (
              <StatBar icon={Waves} label="Beachfront" value={`${beachfrontCount} projects`} color={a.color} className="hidden lg:flex" />
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Description */}
        <div className="mb-10 max-w-3xl">
          <p className="text-lg leading-relaxed text-foreground/80">{a.blurb}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/map"
              search={{ destination: a.slug }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors"
            >
              <MapIcon className="h-4 w-4" /> View on map
            </Link>
            <Link
              to="/projects"
              search={{ destination: a.slug }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors"
            >
              <Building2 className="h-4 w-4" /> All {list.length} projects
            </Link>
          </div>
        </div>

        {/* Map */}
        <div className="mb-12">
          <h2 className="mb-4 font-display text-2xl font-semibold text-primary">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" /> Map — {list.length} projects in {a.name}
            </span>
          </h2>
          <div className="h-[420px] overflow-hidden rounded-3xl border border-border shadow-soft">
            <MapClient
              compounds={list}
              initialCenter={a.center}
              initialZoom={a.zoom}
              showLandmarks
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Projects grid */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-primary">
              All {list.length} projects in {a.name}
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {["Delivered", "Under Construction", "Off-Plan"].map((s) => {
                const count = list.filter((c) => c.status === s).length;
                if (!count) return null;
                return (
                  <span key={s} className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground">
                    {s}: <strong className="text-primary">{count}</strong>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((c) => <CompoundCard key={c.slug} c={c} />)}
          </div>
          {list.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
              No projects tracked yet in this destination.
            </div>
          )}
        </div>

        {/* Related destinations */}
        {relatedAreas.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-5 font-display text-xl font-semibold text-primary">Other destinations in the same region</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedAreas.map((ra) => {
                const raCount = compounds.filter((c) => c.destination === ra.slug).length;
                return (
                  <Link
                    key={ra.slug}
                    to="/destinations/$slug"
                    params={{ slug: ra.slug }}
                    className="group overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={ra.hero} alt={ra.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <div className="font-display text-sm font-semibold text-white">{ra.name}</div>
                      </div>
                    </div>
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      {raCount} projects · {ra.city}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

function StatBar({
  icon: Icon,
  label,
  value,
  color,
  className = "",
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 px-5 py-4 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: color + "22" }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </span>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-display text-sm font-semibold text-primary">{value}</div>
      </div>
    </div>
  );
}
