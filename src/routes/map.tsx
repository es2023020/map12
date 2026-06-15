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
  Layers, Map as MapIcon, List, SlidersHorizontal, ArrowLeft, Phone
} from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Property Atlas — Interactive Map | PropTrack" },
      { name: "description", content: "155+ projects across Egyptian markets — pinned on a private map briefing for advisors." },
      { property: "og:title", content: "Property Atlas — Interactive Map" },
      { property: "og:description", content: "Every compound across Sahel, Cairo, Sokhna, Red Sea and Sinai — on one editorial map." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [q, setQ] = useState("");
  const [dev, setDev] = useState<string>("");
  const [areaSlug, setAreaSlug] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [flagshipOnly, setFlagshipOnly] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "map">("map");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return compounds.filter((c) => {
      if (areaSlug && c.area !== areaSlug) return false;
      if (dev && c.developerSlug !== dev) return false;
      if (flagshipOnly && !c.flagship) return false;
      if (q) {
        const hay = `${c.name} ${c.developer} ${c.area} ${c.city ?? ""} ${c.blurb}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [areaSlug, dev, flagshipOnly, q]);

  const areaCounts = useMemo(() => {
    const m = new Map<string, number>();
    compounds.forEach((c) => m.set(c.area, (m.get(c.area) ?? 0) + 1));
    return m;
  }, []);

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
    setQ("");
    setDev("");
    setAreaSlug(null);
    setFlagshipOnly(false);
    setActiveSlug(null);
  }

  return (
    <Shell noFooter>
      {/* ── Full-height container ── */}
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">

        {/* ══════════════════════════════════════
            LEFT PANEL — search + list/detail
            Always visible on md+, toggle on mobile
        ══════════════════════════════════════ */}
        <aside
          className={`
            flex flex-col border-r border-border/60 bg-card shadow-lg
            w-full shrink-0
            md:w-[380px] md:flex
            ${mobileView === "list" ? "flex" : "hidden md:flex"}
          `}
        >
          {/* ── Panel header ── */}
          <div className="border-b border-border/60 px-4 pt-4 pb-3 space-y-3">
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
                  <SlidersHorizontal className="h-3 w-3" /> Filters {hasFilters ? "·" : ""}
                  {hasFilters && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                </button>
                {hasFilters && (
                  <button onClick={clearAll} className="text-[10px] text-accent hover:underline">Clear</button>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search project, developer, area…"
                className="pl-9 text-sm"
              />
              {q && (
                <button onClick={() => setQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-primary">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Expandable filters */}
            {filtersOpen && (
              <div className="space-y-2 pt-1">
                {/* Developer dropdown */}
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
                      <button
                        onClick={() => { setDev(""); setDevOpen(false); }}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-secondary"
                      >All developers</button>
                      {[...developers].sort((a, b) => a.name.localeCompare(b.name)).map((d) => (
                        <div key={d.slug} className="flex items-center border-b border-border/30 last:border-b-0">
                          <button
                            onClick={() => { setDev(d.slug); setDevOpen(false); }}
                            className="flex flex-1 items-center justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-secondary"
                          >
                            <span className="truncate">{d.name}</span>
                            <span className="text-[10px] text-muted-foreground">{d.count}</span>
                          </button>
                          <Link
                            to="/developers/$slug" params={{ slug: d.slug }}
                            onClick={() => setDevOpen(false)}
                            className="px-2 py-1.5 text-accent hover:bg-secondary"
                          >
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

          {/* ── Area chips ── */}
          <div className="border-b border-border/60 px-3 py-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Areas</span>
              <Link to="/areas" className="text-[10px] font-medium text-accent hover:underline">Browse all →</Link>
            </div>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setAreaSlug(null)}
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${areaSlug === null ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-primary"}`}
              >
                All · {compounds.length}
              </button>
              {areas.map((a) => {
                const isActive = areaSlug === a.slug;
                return (
                  <span key={a.slug} className={`inline-flex items-center overflow-hidden rounded-full border text-[11px] ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                    <button
                      onClick={() => setAreaSlug(isActive ? null : a.slug)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 hover:opacity-80"
                    >
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: a.color }} />
                      {a.name.split(" ")[0]} · {areaCounts.get(a.slug) ?? 0}
                    </button>
                    <Link
                      to="/areas/$slug" params={{ slug: a.slug }}
                      className={`border-l px-1 py-0.5 ${isActive ? "border-primary-foreground/30" : "border-border"} hover:opacity-80`}
                    >
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </span>
                );
              })}
            </div>
          </div>

          {/* ── Result count + clear ── */}
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-1.5 text-xs text-muted-foreground">
            <span><strong className="text-primary">{filtered.length}</strong> of {compounds.length} projects</span>
            {activeSlug && (
              <button onClick={() => setActiveSlug(null)} className="text-accent hover:underline">
                ← Back to list
              </button>
            )}
          </div>

          {/* ── Detail view (when project selected) or project list ── */}
          {active ? (
            <DetailPanel
              active={active}
              activeArea={activeArea}
              activeDev={activeDev}
              onClose={() => setActiveSlug(null)}
            />
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => { setActiveSlug(c.slug); setMobileView("map"); }}
                  className={`flex w-full items-start gap-2 border-b border-border/60 px-3 py-2.5 text-left transition-colors ${activeSlug === c.slug ? "bg-secondary" : "hover:bg-secondary/50"}`}
                >
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-white/50" style={{ background: areaColor(c.area) }} />
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
                  <Link
                    to="/projects/$slug" params={{ slug: c.slug }}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 self-center rounded-full p-1 text-accent hover:bg-accent/10"
                    title="Open full page"
                  >
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
          )}
        </aside>

        {/* ══════════════════════════════════════
            RIGHT — MAP
        ══════════════════════════════════════ */}
        <div className={`relative flex-1 ${mobileView === "map" ? "flex" : "hidden md:flex"} flex-col`}>
          {/* Map */}
          <div className="flex-1">
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
              className="h-full w-full"
            />
          </div>

          {/* Map legend (desktop) */}
          <div className="pointer-events-none absolute right-14 bottom-8 z-10 hidden rounded-2xl border border-border/60 bg-card/95 p-3 text-[10px] shadow backdrop-blur md:block">
            <div className="font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2">Map key</div>
            <div className="flex flex-col gap-1.5">
              <KeyRow color="#3B82F6" label="Project (area-coloured)" />
              <KeyRow color="#CA8A04" label="★ Flagship" />
              <KeyRow color="#EA580C" label="Mall" />
              <KeyRow color="#2563EB" label="Airport" />
              <KeyRow color="#9333EA" label="University" />
              <KeyRow color="#06B6D4" label="Beach" />
            </div>
          </div>

          {/* Active project floating card on map (mobile — shows above map) */}
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
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setMobileView("list")}
                      className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground"
                    >
                      Details
                    </button>
                    <button onClick={() => setActiveSlug(null)} className="rounded-full border border-border p-1 text-muted-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE bottom tab bar
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 inset-x-0 z-30 flex border-t border-border/60 bg-card md:hidden">
        <button
          onClick={() => setMobileView("list")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${mobileView === "list" ? "text-primary" : "text-muted-foreground"}`}
        >
          <List className="h-4 w-4" />
          Projects <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px]">{filtered.length}</span>
        </button>
        <div className="w-px bg-border/60" />
        <button
          onClick={() => setMobileView("map")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${mobileView === "map" ? "text-primary" : "text-muted-foreground"}`}
        >
          <MapIcon className="h-4 w-4" />
          Map
        </button>
      </div>
    </Shell>
  );
}

/* ─── Detail Panel ──────────────────────────────────────── */
function DetailPanel({
  active,
  activeArea,
  activeDev,
  onClose,
}: {
  active: ReturnType<typeof compounds[0]["slug"] extends string ? () => (typeof compounds)[0] : never> extends never ? any : any;
  activeArea: any;
  activeDev: any;
  onClose: () => void;
}) {
  const [descOpen, setDescOpen] = useState(false);
  const isLong = active.blurb.length > 180;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {/* Hero */}
      <div className="relative h-44 shrink-0 overflow-hidden">
        <img src={active.hero} alt={active.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-primary shadow hover:bg-card"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
        <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-primary-foreground/80">
            <span className="h-2 w-2 rounded-full" style={{ background: activeArea?.color }} />
            {activeArea?.name} {active.km ? `· km ${active.km}` : ""}
          </div>
          <h2 className="mt-0.5 font-display text-xl font-semibold leading-tight">{active.name}</h2>
          <p className="text-xs text-primary-foreground/80">by {active.developer}</p>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Pill>{active.type ?? "Residential"}</Pill>
          <Pill>{active.status}</Pill>
          {active.beachfront && <Pill variant="beach">Beachfront</Pill>}
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

        {/* Description */}
        <div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {descOpen || !isLong ? active.blurb : active.blurb.slice(0, 180).trimEnd() + "…"}
            {isLong && (
              <button onClick={() => setDescOpen((v) => !v)} className="ml-1 text-accent hover:underline text-xs">
                {descOpen ? "Less" : "More"}
              </button>
            )}
          </p>
        </div>

        {/* Highlights */}
        <div>
          <SectionLabel>Highlights</SectionLabel>
          <div className="flex flex-wrap gap-1">
            {(active.highlights ?? active.amenities).slice(0, 8).map((h: string) => (
              <span key={h} className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-foreground/80">{h}</span>
            ))}
          </div>
        </div>

        {/* Unit types */}
        <div>
          <SectionLabel>Unit Types</SectionLabel>
          <div className="flex flex-wrap gap-1">
            {active.types.map((t: string) => (
              <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-primary">{t}</span>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <SectionLabel>Location</SectionLabel>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${active.lat},${active.lng}`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
          >
            <MapPin className="h-3 w-3" />
            {active.lat.toFixed(4)}, {active.lng.toFixed(4)} — Open in Maps
          </a>
        </div>

        {/* Quick-jump cards */}
        <div className="grid grid-cols-2 gap-2">
          {activeArea && (
            <Link
              to="/areas/$slug" params={{ slug: activeArea.slug }}
              className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 text-xs hover:border-accent hover:bg-accent/5"
            >
              <span className="h-7 w-7 shrink-0 rounded-lg" style={{ background: activeArea.color }} />
              <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Area</div>
                <div className="truncate font-medium text-primary">{activeArea.name}</div>
              </div>
            </Link>
          )}
          {activeDev && (
            <Link
              to="/developers/$slug" params={{ slug: activeDev.slug }}
              className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 text-xs hover:border-accent hover:bg-accent/5"
            >
              <img src={activeDev.logo} alt={activeDev.name} className="h-7 w-7 shrink-0 rounded-lg" />
              <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Developer</div>
                <div className="truncate font-medium text-primary">{activeDev.name}</div>
              </div>
            </Link>
          )}
        </div>

        {/* CTA buttons */}
        <div className="space-y-2 pt-1">
          <Link
            to="/projects/$slug" params={{ slug: active.slug }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            View full project page <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <a
            href="tel:+201234567890"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-primary hover:border-accent hover:text-accent"
          >
            <Phone className="h-3.5 w-3.5" /> Request a viewing
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Small helpers ─────────────────────────────────────── */
function KeyRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-white/50" style={{ background: color }} />
      <span className="text-foreground/80">{label}</span>
    </div>
  );
}

function Pill({ children, variant }: { children: React.ReactNode; variant?: "beach" }) {
  if (variant === "beach") {
    return <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-blue-200">{children}</span>;
  }
  return <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{children}</span>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-sm font-semibold text-primary leading-tight">{value}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{children}</div>;
}
