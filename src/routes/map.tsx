import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { MapClient } from "@/components/map/MapClient";
import { compounds } from "@/data/compounds";
import { areas, areaColor } from "@/data/areas";
import { developers } from "@/data/developers";
import { landmarks } from "@/data/landmarks";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, X, ExternalLink, ChevronDown, ChevronUp, Layers, Menu } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Property Atlas — Interactive Map | PropTrack" },
      { name: "description", content: "104+ projects across 11 Egyptian markets — pinned on a private map briefing for advisors." },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);

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

  return (
    <Shell noFooter>
      <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
        {/* Full-bleed map underneath */}
        <div className="absolute inset-0">
          <MapClient
            compounds={filtered}
            landmarks={visibleLandmarks}
            showLandmarks={showLandmarks}
            activeSlug={activeSlug}
            onSelect={(slug) => setActiveSlug(slug)}
            initialCenter={mapCenter}
            initialZoom={mapZoom}
            className="h-full w-full"
          />
        </div>

        {/* Map key (desktop) */}
        <div className="pointer-events-none absolute right-4 bottom-24 z-10 hidden rounded-2xl border border-border/60 bg-card/95 p-3 text-[10px] shadow-soft backdrop-blur md:block">
          <div className="font-semibold uppercase tracking-[0.16em] text-muted-foreground">Map key</div>
          <div className="mt-2 flex flex-col gap-1.5">
            <KeyRow color="#3B82F6" label="Project · area-coloured" />
            <KeyRow color="#CA8A04" label="★ Flagship" />
            <KeyRow color="#EA580C" label="Mall" />
            <KeyRow color="#2563EB" label="Airport" />
            <KeyRow color="#9333EA" label="University" />
            <KeyRow color="#06B6D4" label="Beach" />
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="absolute left-3 top-3 z-30 flex items-center gap-2 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg">
            <Menu className="h-3.5 w-3.5" /> {filtered.length} projects
          </button>
          <button onClick={() => setShowLandmarks((v) => !v)} className={`inline-flex items-center gap-1 rounded-full border bg-card/95 px-2.5 py-1 text-[11px] font-medium shadow ${showLandmarks ? "border-accent text-accent" : "border-border text-muted-foreground"}`}>
            <Layers className="h-3 w-3" /> Landmarks
          </button>
        </div>

        {/* Floating overlay sidebar */}
        <aside
          className={`${sidebarOpen ? "fixed inset-0 z-40 m-0 flex w-full max-w-none rounded-none" : "hidden"} flex-col overflow-hidden border border-border/60 bg-card/95 shadow-2xl backdrop-blur lg:absolute lg:left-4 lg:top-4 lg:bottom-4 lg:z-20 lg:flex lg:w-[380px] lg:rounded-2xl`}
        >
          <div className="border-b border-border/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">The Address</div>
                <h2 className="font-display text-lg font-semibold text-primary">Property Atlas</h2>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary lg:hidden">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search project, developer, area…"
                className="pl-9"
              />
            </div>

            {/* Developer dropdown */}
            <div className="relative mt-2">
              <button
                onClick={() => setDevOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm"
              >
                <span className="truncate text-foreground/80">{dev ? developers.find((d) => d.slug === dev)?.name : "All developers"}</span>
                {devOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {devOpen && (
                <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-border bg-card shadow-lg">
                  <button
                    onClick={() => { setDev(""); setDevOpen(false); }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-secondary"
                  >
                    All developers
                  </button>
                  {[...developers].sort((a, b) => a.name.localeCompare(b.name)).map((d) => (
                    <div key={d.slug} className="flex items-center gap-1 border-b border-border/40 last:border-b-0">
                      <button
                        onClick={() => { setDev(d.slug); setDevOpen(false); }}
                        className="flex flex-1 items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-secondary"
                      >
                        <span className="truncate">{d.name}</span>
                        <span className="text-[10px] text-muted-foreground">{d.count}</span>
                      </button>
                      <Link
                        to="/developers/$slug" params={{ slug: d.slug }}
                        onClick={() => setDevOpen(false)}
                        className="px-2 py-2 text-accent hover:bg-secondary"
                        title={`Open ${d.name} page`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-3 text-[11px]">
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground">
                <input type="checkbox" checked={flagshipOnly} onChange={(e) => setFlagshipOnly(e.target.checked)} className="h-3.5 w-3.5 accent-accent" />
                <Star className="h-3 w-3 text-amber-500" /> Flagship only
              </label>
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground">
                <input type="checkbox" checked={showLandmarks} onChange={(e) => setShowLandmarks(e.target.checked)} className="h-3.5 w-3.5 accent-accent" />
                <Layers className="h-3 w-3" /> Landmarks
              </label>
            </div>
          </div>

          {/* Area chips */}
          <div className="border-b border-border/60 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Areas</span>
              <Link to="/areas" className="text-[10px] font-medium text-accent hover:underline">Browse all →</Link>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setAreaSlug(null)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${areaSlug === null ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-primary"}`}
              >
                All · {compounds.length}
              </button>
              {areas.map((a) => {
                const isActive = areaSlug === a.slug;
                return (
                  <span key={a.slug} className={`inline-flex items-center overflow-hidden rounded-full border ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                    <button
                      onClick={() => setAreaSlug(isActive ? null : a.slug)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium hover:text-primary"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
                      {a.name} · {areaCounts.get(a.slug) ?? 0}
                    </button>
                    <Link
                      to="/areas/$slug" params={{ slug: a.slug }}
                      className={`border-l px-1.5 py-1 ${isActive ? "border-primary-foreground/30 hover:bg-primary/80" : "border-border hover:bg-secondary"}`}
                      title={`Open ${a.name} page`}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-xs text-muted-foreground">
            <span><strong className="text-primary">{filtered.length}</strong> projects shown</span>
            {active && <button onClick={() => setActiveSlug(null)} className="text-accent hover:underline">Clear selection</button>}
          </div>

          {/* Result list */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <div
                key={c.slug}
                className={`flex items-start gap-2 border-b border-border/60 p-3 transition-colors ${activeSlug === c.slug ? "bg-secondary" : "hover:bg-secondary/50"}`}
              >
                <button
                  onClick={() => { setActiveSlug(c.slug); setSidebarOpen(false); }}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  title="Preview on map"
                >
                  <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full ring-2 ring-white" style={{ background: areaColor(c.area) }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate font-display text-sm font-semibold text-primary">{c.name}</span>
                        {c.flagship && <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-500" />}
                      </div>
                      <span className="shrink-0 text-[11px] font-semibold text-primary">EGP {c.priceFrom}M</span>
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">{c.developer}</div>
                    <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <MapPin className="h-2.5 w-2.5" /> {areas.find((a) => a.slug === c.area)?.name ?? c.area}
                    </div>
                  </div>
                </button>
                <Link
                  to="/projects/$slug" params={{ slug: c.slug }}
                  className="shrink-0 self-center rounded-full p-1.5 text-accent hover:bg-accent/10"
                  title="Open full page"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No projects match. Try widening filters.</div>
            )}
          </div>
        </aside>

        {/* Detail slide-in panel */}
        {active && (
          <div className="fixed inset-0 z-40 flex justify-end lg:absolute lg:inset-y-0 lg:right-0 lg:z-30">
            <button
              onClick={() => setActiveSlug(null)}
              className="absolute inset-0 bg-primary/30 backdrop-blur-[1px] lg:hidden"
              aria-label="Close"
            />
            <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-border/60 bg-card shadow-2xl">
              <div className="relative h-48 shrink-0 overflow-hidden">
                <img src={active.hero} alt={active.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <button
                  onClick={() => setActiveSlug(null)}
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-primary shadow hover:bg-card"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-primary-foreground/85">
                    <span className="h-2 w-2 rounded-full" style={{ background: activeArea?.color }} />
                    {activeArea?.name} · {activeArea?.city}
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-semibold leading-tight">{active.name}</h2>
                  <p className="text-xs text-primary-foreground/85">by {active.developer}</p>
                </div>
              </div>

              <div className="space-y-5 p-5">
                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Pill>{active.type ?? "Residential"}</Pill>
                  <Pill>{active.status}</Pill>
                  {active.flagship && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Flagship
                    </span>
                  )}
                </div>

                {/* Key stats */}
                <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-secondary/50 p-3 text-center">
                  <Stat label="From" value={`EGP ${active.priceFrom}M`} />
                  <Stat label="Delivery" value={String(active.deliveryYear)} />
                  <Stat label="Sizes" value={active.unitSizes ?? "—"} />
                </div>

                {/* Short description */}
                <ShortDescription text={active.blurb} />

                {/* Highlights */}
                <div>
                  <SectionLabel>Highlights</SectionLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {(active.highlights ?? active.amenities).map((h) => (
                      <span key={h} className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-foreground/80">{h}</span>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <SectionLabel>Location</SectionLabel>
                  <div className="rounded-xl border border-border bg-card p-3 text-xs">
                    <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {active.lat.toFixed(4)}, {active.lng.toFixed(4)}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${active.lat},${active.lng}`}
                      target="_blank" rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-accent hover:underline"
                    >
                      Open in Google Maps <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Area + Developer quick-jumps */}
                <div className="grid grid-cols-2 gap-2">
                  {activeArea && (
                    <Link
                      to="/areas/$slug" params={{ slug: activeArea.slug }}
                      className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5 text-xs hover:border-accent hover:bg-accent/5"
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
                      className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5 text-xs hover:border-accent hover:bg-accent/5"
                    >
                      <img src={activeDev.logo} alt={activeDev.name} className="h-7 w-7 shrink-0 rounded-lg" />
                      <div className="min-w-0">
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Developer</div>
                        <div className="truncate font-medium text-primary">{activeDev.name}</div>
                      </div>
                    </Link>
                  )}
                </div>

                <Link
                  to="/projects/$slug" params={{ slug: active.slug }}
                  className="block w-full rounded-full bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground shadow-soft hover:bg-primary/90"
                >
                  Open full project page →
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Shell>
  );
}

function KeyRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full ring-2 ring-white" style={{ background: color }} />
      <span className="text-foreground/80">{label}</span>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{children}</span>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-sm font-semibold text-primary">{value}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{children}</div>;
}

function ShortDescription({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const isLong = text.length > 160;
  return (
    <p className="text-sm leading-relaxed text-foreground/80">
      {open || !isLong ? text : text.slice(0, 160).trimEnd() + "…"}
      {isLong && (
        <button onClick={() => setOpen((v) => !v)} className="ml-1 text-accent hover:underline">
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </p>
  );
}