import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { MapClient } from "@/components/map/MapClient";
import { CompoundCard } from "@/components/CompoundCard";
import { developerBySlug } from "@/data/developers";
import { compoundsByDeveloper } from "@/data/compounds";
import { areas } from "@/data/areas";
import {
  ArrowLeft, Building2, Wallet, Calendar, MapPin,
  Globe, Phone, Map as MapIcon, ExternalLink
} from "lucide-react";

function LogoBadge({ src, name, className = "" }: { src: string; name: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const initials = name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
  return (
    <div className={`relative overflow-hidden shrink-0 ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center bg-primary">
        <span className="text-primary-foreground font-bold text-sm select-none">{initials}</span>
      </div>
      <img src={src} alt={name}
        className={`absolute inset-0 h-full w-full object-contain bg-white transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)} onError={() => {}} />
    </div>
  );
}

export const Route = createFileRoute("/developers/$slug")({
  loader: ({ params }) => {
    const d = developerBySlug(params.slug);
    if (!d) throw notFound();
    return d;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — Projects | PropTrack` },
      { name: "description", content: `${loaderData.blurb} Browse ${loaderData.count} projects by ${loaderData.name}.` },
      { property: "og:title", content: `${loaderData.name} | PropTrack` },
      { property: "og:description", content: loaderData.blurb },
    ] : [],
  }),
  component: DevPage,
});

function DevPage() {
  const d = Route.useLoaderData();
  const list = compoundsByDeveloper(d.slug);

  const avgPrice = list.length > 0
    ? Math.round(list.reduce((s, c) => s + c.priceFrom, 0) / list.length)
    : 0;
  const deliveredCount = list.filter((c) => c.status === "Delivered").length;
  const offPlanCount = list.filter((c) => c.status === "Off-Plan").length;
  const underConstructionCount = list.filter((c) => c.status === "Under Construction").length;
  const uniqueAreas = Array.from(new Set(list.map((c) => c.area)));
  const beachfrontCount = list.filter((c) => c.beachfront).length;

  const mapCenter: [number, number] = list.length > 0
    ? [
        list.reduce((s, c) => s + c.lat, 0) / list.length,
        list.reduce((s, c) => s + c.lng, 0) / list.length,
      ]
    : [29.5, 31.0];

  return (
    <Shell>
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 lg:py-14 lg:px-8">
          <Link to="/developers" className="inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-accent transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> All developers
          </Link>
          <div className="mt-5 flex flex-wrap items-start gap-5">
            <LogoBadge
              src={d.logo}
              name={d.name}
              className="h-20 w-20 shrink-0 rounded-2xl border border-white/20 shadow-lg"
            />
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">{d.name}</h1>
              <p className="mt-1 text-primary-foreground/70">{d.count} projects on PropTrack</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/80">{d.blurb}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <a
                href="tel:+201234567890"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-white/20 transition-colors"
              >
                <Phone className="h-4 w-4" /> Contact advisor
              </a>
              <Link
                to="/map"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent/80 border border-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent transition-colors"
              >
                <MapIcon className="h-4 w-4" /> View on map
              </Link>
              {d.website && (
                <a
                  href={d.website}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-primary-foreground/80 hover:bg-white/15 transition-colors"
                >
                  <Globe className="h-4 w-4" /> Official website
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
            <StatBar icon={Building2} label="Total projects" value={String(list.length)} />
            <StatBar icon={Wallet} label="Avg. starting price" value={`EGP ${avgPrice}M`} />
            <StatBar icon={Calendar} label="Delivered" value={`${deliveredCount} projects`} className="hidden sm:flex" />
            <StatBar icon={MapPin} label="Markets" value={`${uniqueAreas.length} ${uniqueAreas.length === 1 ? "area" : "areas"}`} className="hidden sm:flex" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12 lg:px-8">

        {/* Status pills + beachfront */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { label: "Delivered", count: deliveredCount, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
            { label: "Under Construction", count: underConstructionCount, cls: "text-amber-700 bg-amber-50 border-amber-200" },
            { label: "Off-Plan", count: offPlanCount, cls: "text-blue-700 bg-blue-50 border-blue-200" },
            ...(beachfrontCount > 0 ? [{ label: "Beachfront", count: beachfrontCount, cls: "text-cyan-700 bg-cyan-50 border-cyan-200" }] : []),
          ].filter((x) => x.count > 0).map(({ label, count, cls }) => (
            <span key={label} className={`rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>
              {label}: {count}
            </span>
          ))}
        </div>

        {/* Active areas */}
        {uniqueAreas.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-3 font-display text-lg font-semibold text-primary">Active in</h2>
            <div className="flex flex-wrap gap-2">
              {uniqueAreas.map((aSlug) => {
                const area = areas.find((a) => a.slug === aSlug);
                if (!area) return null;
                const areaCount = list.filter((c) => c.area === aSlug).length;
                return (
                  <Link
                    key={aSlug}
                    to="/areas/$slug"
                    params={{ slug: aSlug }}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-accent hover:text-accent transition-colors"
                  >
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: area.color }} />
                    {area.name}
                    <span className="text-xs text-muted-foreground">{areaCount}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Map */}
        {list.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 font-display text-xl md:text-2xl font-semibold text-primary inline-flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" /> Project locations
            </h2>
            <div className="h-[300px] md:h-[400px] overflow-hidden rounded-3xl border border-border shadow-soft">
              <MapClient
                compounds={list}
                initialCenter={mapCenter}
                initialZoom={list.length === 1 ? 13 : 6}
                showLandmarks={false}
                className="h-full w-full"
              />
            </div>
          </div>
        )}

        {/* Project grid header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl md:text-2xl font-semibold text-primary">
            All {list.length} projects by {d.name}
          </h2>
          <Link to="/projects" className="text-sm text-accent hover:underline">
            Browse all projects →
          </Link>
        </div>

        {/* Projects */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((c) => <CompoundCard key={c.slug} c={c} />)}
        </div>

        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            No projects tracked yet for this developer.
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
  className = "",
}: {
  icon: any;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-4 md:px-5 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-display text-sm font-semibold text-primary">{value}</div>
      </div>
    </div>
  );
}
