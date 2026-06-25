import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { MapClient } from "@/components/map/MapClient";
import { compounds } from "@/data/compounds";
import { areas, areaColor } from "@/data/areas";
import { developers } from "@/data/developers";
import { landmarks } from "@/data/landmarks";
import { Input } from "@/components/ui/input";
import {
  Search, MapPin, Star, X, ExternalLink, ChevronDown, ChevronUp,
  Layers, Map as MapIcon, List, SlidersHorizontal, ArrowLeft, Phone,
  Building2, Waves
} from "lucide-react";
import { availability } from "@/data/availability";
function LogoBadge({ src, name, className = "" }: { src: string; name: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const initials = name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
  return (
    <div className={`relative overflow-hidden shrink-0 ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center bg-primary">
        <span className="text-primary-foreground font-bold text-xs select-none">{initials}</span>
      </div>
      <img src={src} alt={name}
        className={`absolute inset-0 h-full w-full object-contain bg-white transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)} onError={() => {}} />
    </div>
  );
}

export const Route = createFileRoute("/map")({
  validateSearch: (search: Record<string, unknown>) => ({
    area: typeof search.area === "string" ? search.area : "",
    dev: typeof search.dev === "string" ? search.dev : "",
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Property Atlas — Interactive Map | PropTrack" },
      { name: "description", content: "155+ projects across Egyptian markets — pinned on a private map briefing for advisors." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { area: areaParam, dev: devParam, q: qParam } = Route.useSearch();
  const [q, setQ] = useState(qParam || "");
  const [dev, setDev] = useState<string>(devParam || "");
  const [areaSlug, setAreaSlug] = useState<string | null>(areaParam || null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [flagshipOnly, setFlagshipOnly] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "map">("map");
  const [filtersOpen, setFiltersOpen] = useState(!!(areaParam || devParam || qParam));

  const availabilityMap = useMemo(() => {
    return new Map(availability.map((a) => [a.slug, a]));
  }, []);

  const matchMapCompound = (
    c: any,
    qVal: string,
    areaVal: string | null,
    devVal: string,
    flagshipVal: boolean
  ) => {
    if (areaVal && c.area !== areaVal) return false;
    if (devVal && c.developerSlug !== devVal) return false;
    if (flagshipVal && !c.flagship) return false;
    if (qVal) {
      const avail = availabilityMap.get(c.slug);
      let availText = "";
      if (avail) {
        const terms = new Set<string>();
        terms.add(`${avail.totalAvailable} units`);
        if (avail.note) terms.add(avail.note);
        for (const b of avail.breakdown) {
          if (b.type) terms.add(b.type);
          if (b.beds) {
            terms.add(`${b.beds} beds`);
            terms.add(`${b.beds}br`);
            terms.add(`${b.beds} bedroom`);
            terms.add(`${b.beds} bedrooms`);
          }
          if (b.finishing) terms.add(b.finishing);
          if (b.cluster) terms.add(b.cluster);
          if (b.deliveryNote) terms.add(b.deliveryNote);
          if (b.paymentPlan) terms.add(b.paymentPlan);
          
          for (const u of b.units ?? []) {
            if (u.cluster) terms.add(u.cluster);
            if (u.finishing) terms.add(u.finishing);
            if (u.view) terms.add(u.view);
            if (u.deliveryNote) terms.add(u.deliveryNote);
            if (u.paymentPlan) terms.add(u.paymentPlan);
            if (u.status) terms.add(u.status);
            if (u.areaNote) terms.add(u.areaNote);
          }
        }
        availText = Array.from(terms).join(" ");
      }

      const hay = `${c.name} ${c.developer} ${c.area} ${c.city ?? ""} ${c.blurb} ${c.types.join(" ")} ${c.amenities.join(" ")} ${availText}`.toLowerCase();
      
      const stopWords = new Set(["in", "for", "with", "a", "an", "the", "at", "by", "of", "and", "on"]);
      const queryWords = qVal
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w && !stopWords.has(w));
        
      if (queryWords.length > 0 && !queryWords.every((word) => hay.includes(word))) return false;
    }
    return true;
  };

  const filtered = useMemo(() => {
    return compounds.filter((c) => matchMapCompound(c, q, areaSlug, dev, flagshipOnly));
  }, [areaSlug, dev, flagshipOnly, q, availabilityMap]);

  // Dynamic active options for cascading UI
  const activeDevelopers = useMemo(() => {
    const list = compounds.filter((c) => matchMapCompound(c, q, areaSlug, "", flagshipOnly));
    const slugs = new Set(list.map((c) => c.developerSlug));
    return developers.filter((d) => slugs.has(d.slug));
  }, [q, areaSlug, flagshipOnly, availabilityMap]);

  const areaCounts = useMemo(() => {
    const m = new Map<string, number>();
    areas.forEach((a) => {
      const count = compounds.filter((c) => matchMapCompound(c, q, a.slug, dev, flagshipOnly)).length;
      m.set(a.slug, count);
    });
    return m;
  }, [q, dev, flagshipOnly, availabilityMap]);

  const devCounts = useMemo(() => {
    const m = new Map<string, number>();
    developers.forEach((d) => {
      const count = compounds.filter((c) => matchMapCompound(c, q, areaSlug, d.slug, flagshipOnly)).length;
      m.set(d.slug, count);
    });
    return m;
  }, [q, areaSlug, flagshipOnly, availabilityMap]);

  const visibleLandmarks = useMemo(
    () => (areaSlug ? landmarks.filter((l) => l.area === areaSlug) : landmarks),
    [areaSlug],
  );

  const active = activeSlug ? compounds.find((c) => c.slug === activeSlug) ?? null : null;
  const activeArea = active ? areas.find((a) => a.slug === active.area) : null;
  const activeDev = active ? developers.find((d) => d.slug === active.developerSlug) : null;
  const selectedArea = areaSlug ? areas.find((a) => a.slug === areaSlug) : null;

  const mapCenter: [number, number] = selectedArea?.center ?? [29.5, 31.0];
  const mapZoom = selectedArea?.zoom ?? 6;
  const hasFilters = !!(q || dev || areaSlug || flagshipOnly);

  function clearAll() {
    setQ(""); setDev(""); setAreaSlug(null); setFlagshipOnly(false); setActiveSlug(null);
  }

  return (
    <Shell noFooter>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">

        {/* ══════════════════════════════════
            LEFT PANEL — Search + Project List
            Always visible on md+
        ══════════════════════════════════ */}
        <aside
          className={`
            flex flex-col border-r border-border/60 bg-card shadow-sm
            w-full shrink-0
            md:w-[320px] lg:w-[360px] md:flex
            ${mobileView === "list" ? "flex" : "hidden md:flex"}
          `}
        >
          {/* Panel header */}
          <div className="border-b border-border/60 px-4 pt-4 pb-3 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">The Address</div>
                <h2 className="font-display text-lg font-semibold text-primary leading-tight">Property Atlas</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFiltersOpen((v) => !v)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${filtersOpen ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent hover:text-accent"}`}
                >
                  <SlidersHorizontal className="h-3 w-3" /> Filters
                  {hasFilters && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                </button>
                {hasFilters && (
                  <button onClick={clearAll} className="text-[10px] text-accent hover:underline">Clear</button>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="space-y-1">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search project, developer, keywords…"
                  className="pl-9 text-sm"
                />
                {q && (
                  <button onClick={() => setQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-primary">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal px-1">
                Try searching <span className="italic font-medium text-primary">"3 beds sea view"</span> or <span className="italic font-medium text-primary">"chalet ready"</span>.
              </p>
            </div>

            {/* Expandable filters */}
            {filtersOpen && (
              <div className="space-y-2 pt-1">
                <div className="relative">
                  <button
                    onClick={() => setDevOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <span className="truncate text-foreground/80">
                      {dev ? developers.find((d) => d.slug === dev)?.name : "All developers"}
                    </span>
                    {devOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  </button>
                  {devOpen && (
                    <div className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-border bg-card shadow-lg">
                      <button onClick={() => { setDev(""); setDevOpen(false); }}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-secondary">All developers</button>
                      {[...activeDevelopers].sort((a, b) => a.name.localeCompare(b.name)).map((d) => (
                        <div key={d.slug} className="flex items-center border-b border-border/30 last:border-b-0">
                          <button onClick={() => { setDev(d.slug); setDevOpen(false); }}
                            className="flex flex-1 items-center justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-secondary">
                            <span className="truncate">{d.name}</span>
                            <span className="text-[10px] text-muted-foreground">{devCounts.get(d.slug) ?? 0}</span>
                          </button>
                          <Link to="/developers/$slug" params={{ slug: d.slug }} onClick={() => setDevOpen(false)}
                            className="px-2 py-1.5 text-accent hover:bg-secondary">
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground hover:text-primary">
                    <input type="checkbox" checked={flagshipOnly} onChange={(e) => setFlagshipOnly(e.target.checked)} className="h-3.5 w-3.5 accent-accent" />
                    <Star className="h-3 w-3 text-amber-500" /> Flagship only
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground hover:text-primary">
                    <input type="checkbox" checked={showLandmarks} onChange={(e) => setShowLandmarks(e.target.checked)} className="h-3.5 w-3.5 accent-accent" />
                    <Layers className="h-3 w-3" /> Landmarks
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Area chips */}
          <div className="border-b border-border/60 px-3 py-2.5 shrink-0">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Areas</span>
              <Link to="/areas" className="text-[10px] font-medium text-accent hover:underline">Browse all →</Link>
            </div>
            <div className="flex flex-wrap gap-1">
              <button onClick={() => setAreaSlug(null)}
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${areaSlug === null ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-primary"}`}>
                All · {compounds.length}
              </button>
              {areas.map((a) => {
                const isActive = areaSlug === a.slug;
                return (
                  <span key={a.slug} className={`inline-flex items-center overflow-hidden rounded-full border text-[11px] ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                    <button onClick={() => setAreaSlug(isActive ? null : a.slug)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 hover:opacity-80">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: a.color }} />
                      {a.name.split(" ")[0]} · {areaCounts.get(a.slug) ?? 0}
                    </button>
                    <Link to="/areas/$slug" params={{ slug: a.slug }}
                      className={`border-l px-1 py-0.5 ${isActive ? "border-primary-foreground/30" : "border-border"} hover:opacity-80`}>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-1.5 text-xs text-muted-foreground shrink-0">
            <span><strong className="text-primary">{filtered.length}</strong> of {compounds.length} projects</span>
          </div>

          {/* Project list */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.slug}
                onClick={() => { setActiveSlug(c.slug === activeSlug ? null : c.slug); setMobileView("map"); }}
                className={`flex w-full items-start gap-2 border-b border-border/60 px-3 py-2.5 text-left transition-colors ${activeSlug === c.slug ? "bg-accent/8 border-l-2 border-l-accent" : "hover:bg-secondary/50"}`}
              >
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-white/30" style={{ background: areaColor(c.area) }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1">
                      <span className="truncate font-display text-sm font-semibold text-primary">{c.name}</span>
                      {c.flagship && <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-500" />}
                    </div>
                    <span className="shrink-0 text-[11px] font-semibold text-primary">EGP {c.priceFrom}M</span>
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">{c.developer}</div>
                  <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <MapPin className="h-2.5 w-2.5" />
                    {areas.find((a) => a.slug === c.area)?.name ?? c.area}
                    {c.km ? ` · km ${c.km}` : ""}
                  </div>
                </div>
                <Link to="/projects/$slug" params={{ slug: c.slug }} onClick={(e) => e.stopPropagation()}
                  className="shrink-0 self-center rounded-full p-1 text-accent hover:bg-accent/10" title="Open full page">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <Search className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">No projects match. Try widening your filters.</p>
                <button onClick={clearAll} className="mt-2 text-sm text-accent hover:underline">Clear all filters</button>
              </div>
            )}
          </div>
        </aside>

        {/* ══════════════════════════════════
            CENTER — MAP (always fills remaining space)
        ══════════════════════════════════ */}
        <div className={`relative flex-1 ${mobileView === "map" ? "flex" : "hidden md:flex"} flex-col min-w-0`}>
          <MapClient
            compounds={filtered}
            landmarks={visibleLandmarks}
            showLandmarks={showLandmarks}
            activeSlug={activeSlug}
            onSelect={(slug) => {
              setActiveSlug(slug);
              setMobileView("list");
            }}
            initialCenter={mapCenter}
            initialZoom={mapZoom}
            className="h-full w-full flex-1"
          />

          {/* Map legend (desktop) */}
          <div className="pointer-events-none absolute bottom-8 right-3 z-10 hidden rounded-2xl border border-border/60 bg-card/95 p-3 text-[10px] shadow backdrop-blur lg:block">
            <div className="font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2">Map key</div>
            <div className="flex flex-col gap-1.5">
              <KeyRow color="#3B82F6" label="Project" />
              <KeyRow color="#CA8A04" label="★ Flagship" />
              <KeyRow color="#EA580C" label="Mall" />
              <KeyRow color="#2563EB" label="Airport" />
              <KeyRow color="#06B6D4" label="Beach" />
            </div>
          </div>

          {/* Mobile floating card when project selected */}
          {active && mobileView === "map" && (
            <div className="absolute bottom-16 left-3 right-3 z-20 md:hidden">
              <div className="rounded-2xl border border-border bg-card/98 p-3 shadow-xl backdrop-blur">
                <div className="flex items-start gap-3">
                  <img src={active.hero} alt={active.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm font-semibold text-primary leading-tight">{active.name}</div>
                    <div className="text-xs text-muted-foreground">{active.developer}</div>
                    <div className="mt-1 text-xs font-semibold text-primary">EGP {active.priceFrom}M</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Link to="/projects/$slug" params={{ slug: active.slug }}
                      className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground whitespace-nowrap">
                      Full page
                    </Link>
                    <button onClick={() => setActiveSlug(null)} className="rounded-full border border-border p-1 text-muted-foreground self-center">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════
            RIGHT PANEL — Project detail (desktop/tablet)
            Slides in when a project is selected
        ══════════════════════════════════ */}
        {active && (
          <aside className="hidden md:flex flex-col w-[340px] lg:w-[380px] shrink-0 border-l border-border/60 bg-card shadow-lg overflow-hidden">
            <DetailPanel
              active={active}
              activeArea={activeArea}
              activeDev={activeDev}
              onClose={() => setActiveSlug(null)}
            />
          </aside>
        )}

      </div>

      {/* Mobile bottom tab bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 flex border-t border-border/60 bg-card md:hidden">
        <button onClick={() => setMobileView("list")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${mobileView === "list" ? "text-primary" : "text-muted-foreground"}`}>
          <List className="h-4 w-4" />
          Projects <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px]">{filtered.length}</span>
        </button>
        <div className="w-px bg-border/60" />
        <button onClick={() => setMobileView("map")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${mobileView === "map" ? "text-primary" : "text-muted-foreground"}`}>
          <MapIcon className="h-4 w-4" />
          Map
        </button>
      </div>
    </Shell>
  );
}

/* ─── Right Detail Panel ─────────────────────────────────── */
function DetailPanel({
  active,
  activeArea,
  activeDev,
  onClose,
}: {
  active: any;
  activeArea: any;
  activeDev: any;
  onClose: () => void;
}) {
  const [descOpen, setDescOpen] = useState(false);
  const isLong = active.blurb.length > 180;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero */}
      <div className="relative h-48 shrink-0 overflow-hidden">
        <img src={active.hero} alt={active.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
        <button
          onClick={onClose}
          className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-primary shadow hover:bg-card transition-colors"
          title="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <Link
          to="/projects/$slug"
          params={{ slug: active.slug }}
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/90 text-white shadow hover:bg-accent transition-colors"
          title="Open full page"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-primary-foreground/80">
            <span className="h-2 w-2 rounded-full" style={{ background: activeArea?.color }} />
            {activeArea?.name} {active.km ? `· km ${active.km}` : ""}
          </div>
          <h2 className="mt-0.5 font-display text-xl font-semibold leading-tight">{active.name}</h2>
          <p className="text-xs text-primary-foreground/80">by {active.developer}</p>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Pill>{active.type ?? "Residential"}</Pill>
            <Pill>{active.status}</Pill>
            {active.beachfront && <Pill variant="beach"><Waves className="h-2.5 w-2.5" /> Beachfront</Pill>}
            {active.flagship && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Flagship
              </span>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-secondary/40 p-3 text-center">
            <MiniStat label="From" value={`EGP ${active.priceFrom}M`} />
            <MiniStat label="Delivery" value={String(active.deliveryYear)} />
            <MiniStat label="Sizes" value={active.unitSizes ?? "—"} />
          </div>

          {/* Live Availability Info */}
          {(() => {
            const avail = availability.find((a) => a.slug === active.slug);
            if (!avail || avail.totalAvailable === 0) return null;
            return (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-950/20 dark:bg-emerald-950/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Live Availability</span>
                  </div>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400">Updated {avail.lastUpdated}</span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{avail.totalAvailable}</span>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400">units available</span>
                </div>
                {avail.breakdown.length > 0 && (
                  <div className="mt-2 border-t border-emerald-100/50 pt-2 dark:border-emerald-900/20">
                    <div className="text-[9px] font-semibold uppercase tracking-wider text-emerald-700/80 dark:text-emerald-400/80 mb-1">Available Types</div>
                    <div className="flex flex-wrap gap-1">
                      {avail.breakdown.slice(0, 4).map((b) => (
                        <span key={b.type} className="rounded bg-emerald-100/70 dark:bg-emerald-950/50 px-1.5 py-0.5 text-[9px] font-medium text-emerald-800 dark:text-emerald-300">
                          {b.type} ({b.available})
                        </span>
                      ))}
                      {avail.breakdown.length > 4 && (
                        <span className="rounded bg-emerald-100/70 dark:bg-emerald-950/50 px-1.5 py-0.5 text-[9px] font-medium text-emerald-800 dark:text-emerald-300">
                          +{avail.breakdown.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Description */}
          <p className="text-sm leading-relaxed text-foreground/80">
            {descOpen || !isLong ? active.blurb : active.blurb.slice(0, 180).trimEnd() + "…"}
            {isLong && (
              <button onClick={() => setDescOpen((v) => !v)} className="ml-1 text-accent hover:underline text-xs">
                {descOpen ? "Less" : "More"}
              </button>
            )}
          </p>

          {/* Highlights */}
          <div>
            <SectionLabel>Highlights</SectionLabel>
            <div className="flex flex-wrap gap-1">
              {(active.highlights ?? active.amenities ?? []).slice(0, 8).map((h: string) => (
                <span key={h} className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-foreground/80">{h}</span>
              ))}
            </div>
          </div>

          {/* Unit types */}
          <div>
            <SectionLabel>Unit Types</SectionLabel>
            <div className="flex flex-wrap gap-1">
              {(active.types ?? []).map((t: string) => (
                <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-primary">{t}</span>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <SectionLabel>Location</SectionLabel>
            <a href={`https://www.google.com/maps/search/?api=1&query=${active.lat},${active.lng}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline">
              <MapPin className="h-3 w-3" />
              {active.lat.toFixed(4)}, {active.lng.toFixed(4)} — Open in Maps
            </a>
          </div>

          {/* Developer card */}
          {activeDev && (
            <div>
              <SectionLabel>Developer</SectionLabel>
              <Link to="/developers/$slug" params={{ slug: activeDev.slug }}
                className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3 hover:bg-secondary transition-colors">
                <LogoBadge src={activeDev.logo} name={activeDev.name} className="h-10 w-10 rounded-lg" />
                <div className="min-w-0">
                  <div className="font-medium text-sm text-primary leading-tight truncate">{activeDev.name}</div>
                  <div className="text-xs text-muted-foreground">{activeDev.count} projects</div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0" />
              </Link>
            </div>
          )}

          {/* CTAs */}
          <div className="space-y-2 pt-1 pb-4">
            <Link to="/projects/$slug" params={{ slug: active.slug }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Building2 className="h-4 w-4" /> View full project page
            </Link>
            <a href="tel:01233374501"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-primary hover:bg-secondary transition-colors">
              <Phone className="h-4 w-4" /> Contact advisor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────── */
function KeyRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-foreground/80">{label}</span>
    </div>
  );
}

function Pill({ children, variant }: { children: React.ReactNode; variant?: "beach" }) {
  if (variant === "beach") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sunset/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sunset">
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{children}</div>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-xs font-semibold text-primary leading-tight">{value}</div>
    </div>
  );
}

