import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { compounds } from "@/data/compounds";
import { destinations } from "@/data/destinations";
import { developers } from "@/data/developers";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { availability } from "@/data/availability";
import { useStore } from "@/lib/store";
import { useDebounce } from "@/lib/useDebounce";
import { SmartSearchBar } from "@/components/ui/SmartSearchBar";

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
  const navigate = useNavigate();
  const { destination: destinationParam, dev: devParam, q: qParam } = Route.useSearch();
  const [q, setQ] = useState(qParam || "");
  const debouncedQ = useDebounce(q, 250);
  const [destination, setArea] = useState(destinationParam || "");
  const [dev, setDev] = useState(devParam || "");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [kiloFilter, setKiloFilter] = useState("");

  const mainCompounds = useMemo(() => compounds.filter((c) => !c.parentSlug), [compounds]);
  const availMaxPrices = useMemo(() => availability.flatMap((a) => a.breakdown.map((b) => b.maxPriceM)), [availability]);
  const compoundPrices = useMemo(() => mainCompounds.map((c) => c.priceFrom), [mainCompounds]);
  const allPrices = useMemo(() => [...availMaxPrices, ...compoundPrices].filter((p) => p > 0), [availMaxPrices, compoundPrices]);
  const PRICE_MAX = useMemo(() => (allPrices.length > 0 ? Math.max(...allPrices) : 100), [allPrices]);
  const PRICE_MIN = useMemo(() => (compoundPrices.length > 0 ? Math.min(...compoundPrices) : 0), [compoundPrices]);
  const ALL_TYPES = useMemo(() => Array.from(new Set(mainCompounds.flatMap((c) => c.types))).sort(), [mainCompounds]);

  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const currentMaxPrice = maxPrice ?? PRICE_MAX;
  const [sort, setSort] = useState<"name" | "price-asc" | "price-desc" | "delivery">("name");
  const [filtersOpen, setFiltersOpen] = useState(!!(destinationParam || devParam || qParam));
  const trackEvent = useStore((s) => s.trackEvent);

  const hasFilters = !!(q || destination || dev || status || type || kiloFilter || currentMaxPrice < PRICE_MAX);

  function clearAll() {
    setQ(""); setArea(""); setDev(""); setStatus(""); setType(""); setKiloFilter(""); setMaxPrice(null);
  }

  const handleSelectPreset = (presetType: "destination" | "dev" | "q", val: string) => {
    if (presetType === "destination") setArea(val);
    else if (presetType === "dev") setDev(val);
    else setQ(val);
  };

  const availabilityMap = useMemo(() => {
    return new Map(availability.map((a) => [a.slug, a]));
  }, [availability]);

  const searchableTextMap = useMemo(() => {
    const map = new Map<string, string>();
    mainCompounds.forEach((c) => {
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
      map.set(c.slug, `${c.name} ${c.developer} ${c.destination} ${c.blurb} ${c.types.join(" ")} ${c.amenities.join(" ")} ${availText}`.toLowerCase());
    });
    return map;
  }, [availabilityMap]);

  const matchCompound = (
    c: any,
    qVal: string,
    destinationVal: string,
    devVal: string,
    statusVal: string,
    typeVal: string,
    maxPriceVal: number,
    kiloFilterVal: string
  ) => {
    if (qVal) {
      // Intelligent Query Processing
      const stopWords = new Set(["in", "for", "with", "a", "an", "the", "at", "by", "of", "and", "on"]);
      const queryWords = qVal
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w && !stopWords.has(w));

      if (queryWords.length > 0) {
        const hay = searchableTextMap.get(c.slug) || "";
        const devLower = c.developer.toLowerCase();
        const destLower = c.destination.toLowerCase();

        for (const word of queryWords) {
          let wordMatches = false;

          if ((word === "mv" || word === "mountainview") && (devLower.includes("mountain view") || devLower.includes("mv"))) {
            wordMatches = true;
          } else if ((word === "ph" || word === "phd" || word === "palm") && devLower.includes("palm hills")) {
            wordMatches = true;
          } else if ((word === "tagamo3" || word === "tagamoa" || word === "tagamo'") && destLower.includes("new-cairo")) {
            wordMatches = true;
          } else if (word === "zayed" && (destLower.includes("sheikh-zayed") || destLower.includes("new-zayed"))) {
            wordMatches = true;
          } else if (word === "hekma" && destLower.includes("ras-el-hekma")) {
            wordMatches = true;
          } else if (word === "heneish" && destLower.includes("sidi-heneish")) {
            wordMatches = true;
          } else if (/^\d+(\.\d+)?m$/.test(word)) {
            const priceVal = parseFloat(word.slice(0, -1));
            if (!isNaN(priceVal) && c.priceFrom <= priceVal * 1.15) {
              wordMatches = true;
            }
          } else if (/^\d{4}$/.test(word)) {
            const yearVal = parseInt(word);
            if (c.deliveryYear === yearVal) {
              wordMatches = true;
            }
          } else if (hay.includes(word)) {
            wordMatches = true;
          }

          if (!wordMatches) return false;
        }
      }
    }
    if (destinationVal && c.destination !== destinationVal) return false;
    if (devVal && c.developerSlug !== devVal) return false;
    if (statusVal && c.status !== statusVal) return false;
    if (typeVal && !c.types.includes(typeVal)) return false;
    if (c.priceFrom > maxPriceVal) return false;
    if (kiloFilterVal) {
      if (c.km === undefined || c.km === null) return false;
      if (kiloFilterVal === "90-120" && (c.km < 90 || c.km > 120)) return false;
      if (kiloFilterVal === "120-150" && (c.km < 120 || c.km > 150)) return false;
      if (kiloFilterVal === "150-180" && (c.km < 150 || c.km > 180)) return false;
      if (kiloFilterVal === "180-220" && (c.km < 180 || c.km > 220)) return false;
      if (kiloFilterVal === "220+" && c.km < 220) return false;
    }
    return true;
  };

  const filtered = useMemo(() => {
    let list = mainCompounds.filter((c) => matchCompound(c, debouncedQ, destination, dev, status, type, currentMaxPrice, kiloFilter));
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price-asc") return a.priceFrom - b.priceFrom;
      if (sort === "price-desc") return b.priceFrom - a.priceFrom;
      return a.deliveryYear - b.deliveryYear;
    });
  }, [debouncedQ, destination, dev, status, type, currentMaxPrice, kiloFilter, sort, searchableTextMap, mainCompounds]);

  // Dynamic cascading option computations:
  const activeFilters = useMemo(() => {
    const activeDests = new Set<string>();
    const activeDevs = new Set<string>();
    const activeStats = new Set<string>();
    const activeTyps = new Set<string>();

    mainCompounds.forEach((c) => {
      // For activeDestinations (match everything except destination filter)
      if (matchCompound(c, debouncedQ, "", dev, status, type, currentMaxPrice, kiloFilter)) {
        activeDests.add(c.destination);
      }
      // For activeDevelopers (match everything except developer filter)
      if (matchCompound(c, debouncedQ, destination, "", status, type, currentMaxPrice, kiloFilter)) {
        activeDevs.add(c.developerSlug);
      }
      // For activeStatuses (match everything except status filter)
      if (matchCompound(c, debouncedQ, destination, dev, "", type, currentMaxPrice, kiloFilter)) {
        activeStats.add(c.status);
      }
      // For activeTypes (match everything except type filter)
      if (matchCompound(c, debouncedQ, destination, dev, status, "", currentMaxPrice, kiloFilter)) {
        c.types.forEach((t) => activeTyps.add(t));
      }
    });

    return {
      destinations: destinations.filter((a) => activeDests.has(a.slug)),
      developers: developers.filter((d) => activeDevs.has(d.slug)),
      statuses: ["RTM", "Off-Plan"].filter((s) => activeStats.has(s as any)),
      types: ALL_TYPES.filter((t) => activeTyps.has(t))
    };
  }, [debouncedQ, destination, dev, status, type, maxPrice, kiloFilter, searchableTextMap, mainCompounds]);

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
      <SmartSearchBar
        value={q}
        onChange={setQ}
        onSelectProject={(slug) => navigate({ to: "/projects/$slug", params: { slug } })}
        onSelectDeveloper={setDev}
        onSelectDestination={setArea}
        onSelectPreset={handleSelectPreset}
        variant="compact"
        showPresets={false}
        placeholder="Filter projects..."
      />

      <FilterSelect label="Destination" value={destination} onChange={setArea}
        options={[{ value: "", label: "All destinations" }, ...activeFilters.destinations.map((a) => ({ value: a.slug, label: a.name }))]} />
      <FilterSelect label="Developer" value={dev} onChange={setDev}
        options={[{ value: "", label: "All developers" }, ...activeFilters.developers.map((d) => ({ value: d.slug, label: d.name }))]} />
      <FilterSelect label="Status" value={status} onChange={setStatus}
        options={[
          { value: "", label: "Any status" },
          ...activeFilters.statuses.map((s) => ({ value: s, label: s }))
        ]} />
      <FilterSelect label="Unit Type" value={type} onChange={setType}
        options={[{ value: "", label: "Any type" }, ...activeFilters.types.map((t) => ({ value: t, label: t }))]} />
      {(!destination || destinations.find(d => d.slug === destination)?.region === "north-coast") && (
        <FilterSelect label="Sahel Highway Marker (Kilo)" value={kiloFilter} onChange={setKiloFilter}
          options={[
            { value: "", label: "Any Kilo range" },
            { value: "90-120", label: "KM 90 – 120 (Gateway & Alamein)" },
            { value: "120-150", label: "KM 120 – 150 (Sidi Abdelrahman)" },
            { value: "150-180", label: "KM 150 – 180 (Al Dabaa)" },
            { value: "180-220", label: "KM 180 – 220 (Ras El Hekma)" },
            { value: "220+", label: "KM 220+ (Sidi Heneish)" }
          ]} />
      )}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Max price</span>
          <span className="font-semibold text-primary">EGP {currentMaxPrice}M</span>
        </div>
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={currentMaxPrice}
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Property Atlas</div>
              <h1 className="mt-1 font-display text-3xl md:text-4xl font-semibold tracking-tight text-primary">All projects</h1>
              <p className="mt-1.5 text-muted-foreground">{compounds.length} compounds across Sahel, Cairo, Red Sea & beyond.</p>
            </div>
            {/* Mobile: Filters toggle button */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors lg:hidden self-start md:self-auto ${
                hasFilters ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasFilters && <span className="h-2 w-2 rounded-full bg-accent" />}
              {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {/* Hero Smart Search Bar */}
          <div className="mt-6">
            <SmartSearchBar
              value={q}
              onChange={setQ}
              onSelectProject={(slug) => navigate({ to: "/projects/$slug", params: { slug } })}
              onSelectDeveloper={setDev}
              onSelectDestination={setArea}
              onSelectPreset={handleSelectPreset}
              variant="hero"
              showPresets={true}
              placeholder="Search by project name, developer (e.g. Ora, Mountain View), destination..."
            />
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
