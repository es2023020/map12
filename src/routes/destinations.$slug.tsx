import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { MapClient } from "@/components/map/MapClient";
import { CompoundCard } from "@/components/CompoundCard";
import { destinationBySlug, destinations } from "@/data/destinations";
import { compoundsByDestination, compounds } from "@/data/compounds";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Wallet,
  Calendar,
  Waves,
  TrendingUp,
  Map as MapIcon,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";

import { buildDestinationSchema, buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";

import { getDestinationSEO } from "@/lib/seo-templates";

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }) => {
    const a = destinationBySlug(params.slug);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const list = compoundsByDestination(loaderData.slug);
    const minPrice = list.length > 0 ? Math.min(...list.map((c) => c.priceFrom)) : 0;

    const seo = getDestinationSEO(
      {
        name: loaderData.name,
        slug: loaderData.slug,
        blurb: loaderData.blurb,
        region: loaderData.region,
        projectCount: list.length,
        minPrice,
      },
      "en",
    );

    const placeSchema = buildDestinationSchema({
      name: loaderData.name,
      slug: loaderData.slug,
      blurb: loaderData.blurb,
      hero: loaderData.hero,
      center: loaderData.center,
      region: loaderData.region,
    });

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "Destinations", item: "/destinations" },
      { name: loaderData.name, item: `/destinations/${loaderData.slug}` },
    ]);

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.metaDesc },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.metaDesc },
        { property: "og:image", content: loaderData.hero },
        { property: "og:url", content: seo.canonical },
      ],
      links: [
        { rel: "canonical", href: seo.canonical },
        { rel: "alternate", hrefLang: "en", href: seo.alternateEn },
        { rel: "alternate", hrefLang: "ar", href: seo.alternateAr },
        { rel: "alternate", hrefLang: "x-default", href: seo.alternateEn },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(placeSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: AreaPage,
});

function AreaPage() {
  const a = Route.useLoaderData();
  const list = compoundsByDestination(a.slug);

  const avgPrice =
    list.length > 0 ? Math.round(list.reduce((s, c) => s + c.priceFrom, 0) / list.length) : 0;
  const beachfrontCount = list.filter((c) => c.beachfront).length;
  const rtmCount = list.filter((c) => c.status === "RTM").length;
  const minPrice = list.length > 0 ? Math.min(...list.map((c) => c.priceFrom)) : 0;
  const maxPrice = list.length > 0 ? Math.max(...list.map((c) => c.priceFrom)) : 0;

  // Kilometer stats & sorting
  const kmCompounds = list.filter((c) => c.km !== undefined);
  const hasKmData = kmCompounds.length > 0;
  const minKm = hasKmData ? Math.min(...kmCompounds.map((c) => c.km!)) : null;
  const maxKm = hasKmData ? Math.max(...kmCompounds.map((c) => c.km!)) : null;

  const [sortBy, setSortBy] = useState<string>(hasKmData ? "km-asc" : "price-asc");

  const sortedList = [...list].sort((a, b) => {
    if (sortBy === "km-asc") {
      if (a.km !== undefined && b.km !== undefined) return a.km - b.km;
      if (a.km !== undefined) return -1;
      if (b.km !== undefined) return 1;
      return a.priceFrom - b.priceFrom;
    }
    if (sortBy === "km-desc") {
      if (a.km !== undefined && b.km !== undefined) return b.km - a.km;
      if (a.km !== undefined) return -1;
      if (b.km !== undefined) return 1;
      return a.priceFrom - b.priceFrom;
    }
    if (sortBy === "price-asc") return (a.priceFrom || Infinity) - (b.priceFrom || Infinity);
    if (sortBy === "price-desc") return (b.priceFrom || 0) - (a.priceFrom || 0);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  // Get related destinations in the same region
  const relatedAreas = destinations
    .filter((x) => x.region === a.region && x.slug !== a.slug)
    .slice(0, 4);

  return (
    <Shell>
      {/* Hero */}
      <div className="relative h-[320px] md:h-[380px] overflow-hidden">
        <img src={a.hero} alt={a.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 text-primary-foreground lg:px-8">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All destinations
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-full ring-2 ring-white/40"
              style={{ background: a.color }}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">
              {a.city ?? "Egypt"} · {a.region.replace(/-/g, " ")}
            </span>
          </div>
          <h1 className="mt-1 font-display text-4xl md:text-5xl font-semibold tracking-tight">
            {a.name}
          </h1>
          {a.kmRange && (
            <p className="mt-1 text-primary-foreground/70">{a.kmRange} · Mediterranean coast</p>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4 lg:grid-cols-5">
            <StatBar
              icon={Building2}
              label="Total projects"
              value={String(list.length)}
              color={a.color}
            />
            <StatBar
              icon={Wallet}
              label="Price range"
              value={`EGP ${minPrice}–${maxPrice}M`}
              color={a.color}
            />
            <StatBar
              icon={TrendingUp}
              label="Avg. price"
              value={`EGP ${avgPrice}M`}
              color={a.color}
              className="hidden md:flex"
            />
            <StatBar
              icon={Calendar}
              label="RTM / Handover"
              value={`${rtmCount} projects`}
              color={a.color}
              className="hidden md:flex"
            />
            {beachfrontCount > 0 && (
              <StatBar
                icon={Waves}
                label="Beachfront"
                value={`${beachfrontCount} projects`}
                color={a.color}
                className="hidden lg:flex"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Description & Comprehensive Destination Guide */}
        <div className="mb-10 max-w-4xl space-y-6">
          <p className="text-lg leading-relaxed text-foreground/80 font-medium">{a.blurb}</p>

          {/* Detailed Guide Content */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-display text-2xl font-bold text-primary border-b border-border/60 pb-3">
              Comprehensive Destination Guide: {a.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-foreground text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" /> Location & Accessibility from Cairo
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {a.region === "north-coast"
                    ? `${a.name} is situated along the Mediterranean coastline (${a.kmRange || "North Coast"}). Conveniently accessible via the Fouka Highway and Dabaa Corridor, driving time from Central Cairo averages 2.5 to 3.5 hours.`
                    : `${a.name} offers direct arterial access via major ring roads and corridors, placing it within 20-30 minutes of major financial districts, international schools, and commercial hubs.`}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-foreground text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" /> Price Range & Investment Dynamics
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Entry-level pricing in {a.name} starts around EGP {minPrice}M, with premium
                  beachfront or standalone villa compounds reaching EGP {maxPrice}M+. Average
                  pricing across the {list.length} tracked projects stands at EGP {avgPrice}M.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-foreground text-base">Why Buy & Invest in {a.name}?</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2 bg-secondary/40 p-3 rounded-xl border border-border/50">
                  <span className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span>
                    <strong>High Liquidity & Resale Value:</strong> Strong end-user and investor
                    demand drives consistent capital appreciation.
                  </span>
                </li>
                <li className="flex items-start gap-2 bg-secondary/40 p-3 rounded-xl border border-border/50">
                  <span className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span>
                    <strong>Top-Tier Developers:</strong> Home to master plans by Palm Hills, Ora,
                    Sodic, Misr Italia, and Arabella.
                  </span>
                </li>
                <li className="flex items-start gap-2 bg-secondary/40 p-3 rounded-xl border border-border/50">
                  <span className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span>
                    <strong>Flexible Payment Terms:</strong> Extended off-plan payment schedules up
                    to 8 years with 5–10% down payments.
                  </span>
                </li>
                <li className="flex items-start gap-2 bg-secondary/40 p-3 rounded-xl border border-border/50">
                  <span className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span>
                    <strong>Integrated Lifestyle:</strong> Gated security, swimmable lagoons, beach
                    clubs, and commercial strips.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/map"
              search={{ destination: a.slug, dev: "", q: "" }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors"
            >
              <MapIcon className="h-4 w-4" /> View on map
            </Link>
            <Link
              to="/projects"
              search={{ destination: a.slug, dev: "", q: "" }}
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
          {hasKmData && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-4 sm:px-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold text-sm shadow-sm">
                  Km
                </span>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Ranked Kilo to Kilo
                  </div>
                  <div className="text-base font-bold text-primary">
                    Coastal Stretch: Kilo {minKm} → Kilo {maxKm}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground bg-card/80 backdrop-blur border border-border/60 px-3 py-1.5 rounded-full font-medium">
                {kmCompounds.length} projects ordered sequentially by coastal kilometer marker
              </div>
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-primary">
                All {list.length} projects in {a.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {hasKmData
                  ? "Ranked sequentially by coastal kilometer position"
                  : "Comprehensive project directory"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 border border-border bg-card rounded-xl px-3 py-1.5 shadow-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-accent" />
                <span className="font-medium text-muted-foreground">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-primary focus:outline-hidden cursor-pointer"
                >
                  {hasKmData && <option value="km-asc">Km: Low to High (Kilo to Kilo)</option>}
                  {hasKmData && <option value="km-desc">Km: High to Low (Kilo to Kilo)</option>}
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>

              <div className="hidden sm:flex flex-wrap gap-2 text-xs">
                {["RTM", "Off-Plan"].map((s) => {
                  const count = list.filter((c) => c.status === s).length;
                  if (!count) return null;
                  return (
                    <span
                      key={s}
                      className="rounded-xl border border-border bg-card px-3 py-1.5 text-muted-foreground"
                    >
                      {s}: <strong className="text-primary">{count}</strong>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedList.map((c) => (
              <CompoundCard key={c.slug} c={c} />
            ))}
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
            <h2 className="mb-5 font-display text-xl font-semibold text-primary">
              Other destinations in the same region
            </h2>
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
                      <img
                        src={ra.hero}
                        alt={ra.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <div className="font-display text-sm font-semibold text-white">
                          {ra.name}
                        </div>
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
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: color + "22" }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </span>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 font-display text-sm font-semibold text-primary">{value}</div>
      </div>
    </div>
  );
}
