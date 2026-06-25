import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { compounds } from "@/data/compounds";
import { destinations } from "@/data/destinations";
import { developers } from "@/data/developers";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { availability } from "@/data/availability";

// Compute true max price from availability data (highest real price) or fall back to compound list
const availMaxPrices = availability.flatMap((a) => a.breakdown.map((b) => b.maxPriceM));
const compoundPrices = compounds.map((c) => c.priceFrom);
const allPrices = [...availMaxPrices, ...compoundPrices].filter((p) => p > 0);
const PRICE_MAX = Math.max(...allPrices);
const PRICE_MIN = Math.min(...compoundPrices);
const ALL_TYPES = Array.from(new Set(compounds.flatMap((c) => c.types))).sort();

export const Route = createFileRoute("/projects/")({
  validateSearch: (search: Record<string, unknown>) => ({
    destination: typeof search.destination === "string" ? search.destination : "",
    dev: typeof search.dev === "string" ? search.dev : "",
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "All Projects — PropTrack" },
      { name: "description", content: "Browse every compound in the PropTrack database. Filter by destination, developer, price and delivery year." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { destination: destinationParam, dev: devParam, q: qParam } = Route.useSearch();
  const [q, setQ] = useState(qParam || "");
  const [destination, setArea] = useState(destinationParam || "");
  const [dev, setDev] = useState(devParam || "");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sort, setSort] = useState<"name" | "price-asc" | "price-desc" | "delivery">("name");
  const [filtersOpen, setFiltersOpen] = useState(!!(destinationParam || devParam || qParam));

  const hasFilters = !!(q || destination || dev || status || type || maxPrice < PRICE_MAX);

  function clearAll() {
    setQ(""); setArea(""); setDev(""); setStatus(""); setType(""); setMaxPrice(PRICE_MAX);
  }

  const availabilityMap = useMemo(() => {
    return new Map(availability.map((a) => [a.slug, a]));
  }, []);

  const matchCompound = (
    c: any,
    qVal: string,
    destinationVal: string,
    devVal: string,
    statusVal: string,
    typeVal: string,
    maxPriceVal: number
  ) => {
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

      const hay = `${c.name} ${c.developer} ${c.destination} ${c.blurb} ${c.types.join(" ")} ${c.amenities.join(" ")} ${availText}`.toLowerCase();
      
      const stopWords = new Set(["in", "for", "with", "a", "an", "the", "at", "by", "of", "and", "on"]);
      const queryWords = qVal
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w && !stopWords.has(w));
        
      if (queryWords.length > 0 && !queryWords.every((word) => hay.includes(word))) return false;
    }
    if (destinationVal && c.destination !== destinationVal) return false;
    if (devVal && c.developerSlug !== devVal) return false;
    if (statusVal && c.status !== statusVal) return false;
    if (typeVal && !c.types.includes(typeVal)) return false;
    if (c.priceFrom > maxPriceVal) return false;
    return true;
  };

  const filtered = useMemo(() => {
    let list = compounds.filter((c) => matchCompound(c, q, destination, dev, status, type, maxPrice));
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price-asc") return a.priceFrom - b.priceFrom;
      if (sort === "price-desc") return b.priceFrom - a.priceFrom;
      return a.deliveryYear - b.deliveryYear;
    });
  }, [q, destination, dev, status, type, maxPrice, sort, availabilityMap]);

  // Dynamic cascading option computations:
  const activeDestinations = useMemo(() => {
    const list = compounds.filter((c) => matchCompound(c, q, "", dev, status, type, maxPrice));
    const slugs = new Set(list.map((c) => c.destination));
    return destinations.filter((a) => slugs.has(a.slug));
  }, [q, dev, status, type, maxPrice, availabilityMap]);

  const activeDevelopers = useMemo(() => {
    const list = compounds.filter((c) => matchCompound(c, q, destination, "", status, type, maxPrice));
    const slugs = new Set(list.map((c) => c.developerSlug));
    return developers.filter((d) => slugs.has(d.slug));
  }, [q, destination, status, type, maxPrice, availabilityMap]);

  const activeStatuses = useMemo(() => {
    const list = compounds.filter((c) => matchCompound(c, q, destination, dev, "", type, maxPrice));
    const statuses = new Set(list.map((c) => c.status));
    return ["Delivered", "Under Construction", "Off-Plan"].filter((s) => statuses.has(s));
  }, [q, destination, dev, type, maxPrice, availabilityMap]);

  const activeTypes = useMemo(() => {
    const list = compounds.filter((c) => matchCompound(c, q, destination, dev, status, "", maxPrice));
    const types = new Set(list.flatMap((c) => c.types));
    return ALL_TYPES.filter((t) => types.has(t));
  }, [q, destination, dev, status, maxPrice, availabilityMap]);

  const FilterPanel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-accent hover:underline">Clear all</button>
        )}
      </div>
      <div className="space-y-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects, developer, keywords..." className="pl-9 text-sm" />
        </div>
        <p className="text-[10px] text-muted-foreground leading-normal px-1">
          Try searching like <span className="italic font-medium text-primary">"3 beds chalet sea view"</span> or <span className="italic font-medium text-primary">"ready to move marassi"</span>.
        </p>
      </div>
      <FilterSelect label="Destination" value={destination} onChange={setArea}
        options={[{ value: "", label: "All destinations" }, ...activeDestinations.map((a) => ({ value: a.slug, label: a.name }))]} />
      <FilterSelect label="Developer" value={dev} onChange={setDev}
        options={[{ value: "", label: "All developers" }, ...activeDevelopers.map((d) => ({ value: d.slug, label: d.name }))]} />
      <FilterSelect label="Status" value={status} onChange={setStatus}
        options={[
          { value: "", label: "Any status" },
          ...activeStatuses.map((s) => ({ value: s, label: s }))
        ]} />
      <FilterSelect label="Unit Type" value={type} onChange={setType}
        options={[{ value: "", label: "Any type" }, ...activeTypes.map((t) => ({ value: t, label: t }))]} />
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Max price</span>
          <span className="font-semibold text-primary">EGP {maxPrice}M</span>
        </div>
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-accent" />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>EGP {PRICE_MIN}M</span><span>EGP {PRICE_MAX}M</span>
        </div>
      </div>
    </div>
  );

  return (
    <Shell>
      {/* Header */}
      <div className="border-b border-border/60 bg-gradient-sand">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:py-10 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Property Atlas</div>
              <h1 className="mt-1 font-display text-3xl md:text-4xl font-semibold tracking-tight text-primary">All projects</h1>
              <p className="mt-2 text-muted-foreground">{compounds.length} compounds across Sahel, Cairo, Red Sea & beyond.</p>
            </div>
            {/* Mobile: Filters toggle button */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors lg:hidden ${
                hasFilters ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasFilters && <span className="h-2 w-2 rounded-full bg-accent" />}
              {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="border-b border-border/60 bg-card px-4 py-5 lg:hidden">
          {FilterPanel}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-soft lg:sticky lg:top-20 lg:self-start">
            {FilterPanel}
          </aside>

          {/* Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                <strong className="text-primary">{filtered.length}</strong> of {compounds.length} projects
                {hasFilters && (
                  <button onClick={clearAll} className="ml-2 text-xs text-accent hover:underline">clear filters</button>
                )}
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="name">Sort: Name (A–Z)</option>
                <option value="price-asc">Price (low → high)</option>
                <option value="price-desc">Price (high → low)</option>
                <option value="delivery">Delivery year</option>
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((c) => <CompoundCard key={c.slug} c={c} />)}
            </div>
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <Search className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No projects match these filters.</p>
                <button onClick={clearAll} className="mt-2 text-sm text-accent hover:underline">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
