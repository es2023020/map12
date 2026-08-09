import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { compounds } from "@/data/compounds";
import { destinations } from "@/data/destinations";
import { developers } from "@/data/developers";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, LayoutGrid, List, Sparkles, Waves, Building2, Calendar, TrendingUp } from "lucide-react";
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
  const [beachfrontOnly, setBeachfrontOnly] = useState(false);
  const [flagshipOnly, setFlagshipOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const hasFilters = !!(q || destination || dev || status || type || kiloFilter || beachfrontOnly || flagshipOnly || currentMaxPrice < PRICE_MAX);

  function clearAll() {
    setQ(""); setArea(""); setDev(""); setStatus(""); setType(""); setKiloFilter(""); setMaxPrice(null);
    setBeachfrontOnly(false); setFlagshipOnly(false);
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
    kiloFilterVal: string,
    beachfrontVal: boolean,
    flagshipVal: boolean
  ) => {
    if (beachfrontVal && !c.beachfront) return false;
    if (flagshipVal && !c.flagship) return false;

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
    let list = mainCompounds.filter((c) => matchCompound(c, debouncedQ, destination, dev, status, type, currentMaxPrice, kiloFilter, beachfrontOnly, flagshipOnly));
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price-asc") return a.priceFrom - b.priceFrom;
      if (sort === "price-desc") return b.priceFrom - a.priceFrom;
      return a.deliveryYear - b.deliveryYear;
    });
  }, [debouncedQ, destination, dev, status, type, currentMaxPrice, kiloFilter, beachfrontOnly, flagshipOnly, sort, searchableTextMap, mainCompounds]);

  // Dynamic cascading option computations:
  const activeFilters = useMemo(() => {
    const activeDests = new Set<string>();
    const activeDevs = new Set<string>();
    const activeStats = new Set<string>();
    const activeTyps = new Set<string>();

    mainCompounds.forEach((c) => {
      if (matchCompound(c, debouncedQ, "", dev, status, type, currentMaxPrice, kiloFilter, beachfrontOnly, flagshipOnly)) {
        activeDests.add(c.destination);
      }
      if (matchCompound(c, debouncedQ, destination, "", status, type, currentMaxPrice, kiloFilter, beachfrontOnly, flagshipOnly)) {
        activeDevs.add(c.developerSlug);
      }
      if (matchCompound(c, debouncedQ, destination, dev, "", type, currentMaxPrice, kiloFilter, beachfrontOnly, flagshipOnly)) {
        activeStats.add(c.status);
      }
      if (matchCompound(c, debouncedQ, destination, dev, status, "", currentMaxPrice, kiloFilter, beachfrontOnly, flagshipOnly)) {
        c.types.forEach((t) => activeTyps.add(t));
      }
    });

    return {
      destinations: destinations.filter((a) => activeDests.has(a.slug)),
      developers: developers.filter((d) => activeDevs.has(d.slug)),
      statuses: ["RTM", "Off-Plan"].filter((s) => activeStats.has(s as any)),
      types: ALL_TYPES.filter((t) => activeTyps.has(t))
    };
  }, [debouncedQ, destination, dev, status, type, maxPrice, kiloFilter, beachfrontOnly, flagshipOnly, searchableTextMap, mainCompounds]);

  // Active filter chips list:
  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (q) chips.push({ label: `Search: "${q}"`, clear: () => setQ("") });
    if (destination) {
      const dest = destinations.find((d) => d.slug === destination);
      chips.push({ label: `Region: ${dest?.name ?? destination}`, clear: () => setArea("") });
    }
    if (dev) {
      const dObj = developers.find((d) => d.slug === dev);
      chips.push({ label: `Developer: ${dObj?.name ?? dev}`, clear: () => setDev("") });
    }
    if (status) chips.push({ label: `Status: ${status}`, clear: () => setStatus("") });
    if (type) chips.push({ label: `Type: ${type}`, clear: () => setType("") });
    if (kiloFilter) chips.push({ label: `KM: ${kiloFilter}`, clear: () => setKiloFilter("") });
    if (beachfrontOnly) chips.push({ label: "Beachfront Only", clear: () => setBeachfrontOnly(false) });
    if (flagshipOnly) chips.push({ label: "Flagship Only", clear: () => setFlagshipOnly(false) });
    if (maxPrice !== null) chips.push({ label: `Max Price: EGP ${maxPrice}M`, clear: () => setMaxPrice(null) });
    return chips;
  }, [q, destination, dev, status, type, kiloFilter, beachfrontOnly, flagshipOnly, maxPrice]);

  // Computed metrics for stats dashboard:
  const statsMetrics = useMemo(() => {
    const prices = filtered.map((c) => c.priceFrom).filter((p) => p > 0);
    const avg = prices.length > 0 ? Math.round((prices.reduce((sum, p) => sum + p, 0) / prices.length) * 10) / 10 : 0;
    const rtmCount = filtered.filter((c) => c.status === "RTM").length;
    const beachCount = filtered.filter((c) => c.beachfront).length;
    return { avg, rtmCount, beachCount };
  }, [filtered]);

  // Tab selections
  const currentTab = useMemo(() => {
    if (beachfrontOnly) return "beachfront";
    if (flagshipOnly) return "flagship";
    if (status === "RTM") return "rtm";
    if (status === "Off-Plan") return "off-plan";
    return "all";
  }, [beachfrontOnly, flagshipOnly, status]);

  const handleTabChange = (tab: "all" | "beachfront" | "rtm" | "off-plan" | "flagship") => {
    setBeachfrontOnly(tab === "beachfront");
    setFlagshipOnly(tab === "flagship");
    if (tab === "rtm") setStatus("RTM");
    else if (tab === "off-plan") setStatus("Off-Plan");
    else if (tab !== "beachfront" && tab !== "flagship") setStatus("");
  };

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <SlidersHorizontal className="h-4 w-4 text-accent" /> Filter Settings
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs font-semibold text-sunset hover:underline transition-all">Clear All</button>
        )}
      </div>

      <div className="space-y-4">
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
          <FilterSelect label="Sahel Marker (Kilo)" value={kiloFilter} onChange={setKiloFilter}
            options={[
              { value: "", label: "Any Kilo range" },
              { value: "90-120", label: "KM 90 – 120 (Gateway)" },
              { value: "120-150", label: "KM 120 – 150 (Sidi Abdelrahman)" },
              { value: "150-180", label: "KM 150 – 180 (Al Dabaa)" },
              { value: "180-220", label: "KM 180 – 220 (Ras El Hekma)" },
              { value: "220+", label: "KM 220+ (Sidi Heneish)" }
            ]} />
        )}
        
        {/* Quick Toggles */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Features</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground/80 hover:text-foreground cursor-pointer select-none">
              <input type="checkbox" checked={beachfrontOnly} onChange={(e) => setBeachfrontOnly(e.target.checked)} className="rounded border-border text-accent focus:ring-accent accent-accent h-3.5 w-3.5" />
              Beachfront property only
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground/80 hover:text-foreground cursor-pointer select-none">
              <input type="checkbox" checked={flagshipOnly} onChange={(e) => setFlagshipOnly(e.target.checked)} className="rounded border-border text-accent focus:ring-accent accent-accent h-3.5 w-3.5" />
              Flagship projects only
            </label>
          </div>
        </div>

        {/* Pricing Range Slider */}
        <div className="pt-2 border-t border-border/40">
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            <span>Max price</span>
            <span className="font-bold text-accent">EGP {currentMaxPrice}M</span>
          </div>
          <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={currentMaxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-accent bg-secondary h-1.5 rounded-lg appearance-none cursor-pointer" />
          <div className="mt-1.5 flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>EGP {PRICE_MIN}M</span><span>EGP {PRICE_MAX}M</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Shell>
      {/* Immersive Luxury Hero Header */}
      <div className="relative overflow-hidden border-b border-border/40 bg-slate-950 py-12 md:py-16 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 border border-accent/30 px-3 py-1 text-xs font-semibold text-accent uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 fill-current animate-pulse" /> Property Atlas
              </span>
              <h1 className="mt-4 font-display text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Premium Compounds
              </h1>
              <p className="mt-3 text-sm md:text-base text-slate-300 font-medium">
                Browse through {compounds.length} premium coastal, resort, and residential developments across Egypt.
              </p>
            </div>
            
            {/* Mobile: Filters toggle button */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all lg:hidden self-start md:self-auto shadow-md ${
                hasFilters ? "border-accent bg-accent/25 text-white" : "border-white/10 bg-white/5 hover:bg-white/10 text-slate-200"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter Options
              {hasFilters && <span className="h-2.5 w-2.5 rounded-full bg-accent animate-ping" />}
              {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {/* Search bar inside modern Glassmorphic panel */}
          <div className="mt-8 max-w-4xl backdrop-blur-md bg-white/5 p-2 rounded-2xl border border-white/10 shadow-xl">
            <SmartSearchBar
              value={q}
              onChange={setQ}
              onSelectProject={(slug) => navigate({ to: "/projects/$slug", params: { slug } })}
              onSelectDeveloper={setDev}
              onSelectDestination={setArea}
              onSelectPreset={handleSelectPreset}
              variant="hero"
              showPresets={true}
              placeholder="Search project name, developer, region (e.g. Ras El Hekma, Zayed)..."
            />
          </div>
        </div>
      </div>

      {/* Mobile filter panel drawer */}
      {filtersOpen && (
        <div className="border-b border-border bg-card px-4 py-6 lg:hidden animate-fade-in">
          {FilterPanel}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft lg:sticky lg:top-24 lg:self-start">
            {FilterPanel}
          </aside>

          {/* Main Results Workspace */}
          <div className="space-y-6">
            
            {/* Dynamic Dashboard Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-5 rounded-2xl bg-card border border-border shadow-soft">
              <div className="border-r border-border/60 pr-2">
                <span className="block text-xl md:text-2xl font-black text-primary font-display">{filtered.length}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Matching Projects</span>
              </div>
              <div className="border-r border-border/60 px-2">
                <span className="block text-xl md:text-2xl font-black text-primary font-display">
                  {statsMetrics.avg > 0 ? `EGP ${statsMetrics.avg}M` : "N/A"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Average Price</span>
              </div>
              <div className="border-r border-border/60 px-2">
                <span className="block text-xl md:text-2xl font-black text-sunset font-display">{statsMetrics.beachCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Waves className="h-3 w-3" /> Beachfront
                </span>
              </div>
              <div className="pl-2">
                <span className="block text-xl md:text-2xl font-black text-accent font-display">{statsMetrics.rtmCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ready to Move</span>
              </div>
            </div>

            {/* Quick Filter tabs & View Mode Options */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-border/50 pb-4 gap-4">
              {/* Tabs */}
              <div className="flex overflow-x-auto gap-1 pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: "all", label: "All Projects" },
                  { id: "beachfront", label: "Beachfront" },
                  { id: "rtm", label: "Ready to Move" },
                  { id: "off-plan", label: "Off-Plan" },
                  { id: "flagship", label: "Flagships" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                      currentTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Grid / List Toggles and sorting */}
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                {/* Grid / List Toggle */}
                <div className="flex items-center gap-1 border border-border bg-card p-1 rounded-xl shadow-2xs">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-secondary text-primary font-bold shadow-3xs"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    title="Grid layout"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-secondary text-primary font-bold shadow-3xs"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    title="List layout"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                    className="appearance-none rounded-xl border border-border bg-card pl-3.5 pr-9 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer shadow-2xs"
                  >
                    <option value="name">Sort: Name (A–Z)</option>
                    <option value="price-asc">Price (low → high)</option>
                    <option value="price-desc">Price (high → low)</option>
                    <option value="delivery">Delivery year</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 pointer-events-none text-muted-foreground/60" />
                </div>
              </div>
            </div>

            {/* Active Filter Chips bar */}
            {activeFilterChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-2 bg-secondary/35 rounded-xl border border-border/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 pl-1.5">Filters:</span>
                {activeFilterChips.map((chip, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-card border border-border/80 pl-2.5 pr-1 py-1 text-xs font-medium text-foreground hover:border-accent transition-colors"
                  >
                    <span>{chip.label}</span>
                    <button
                      onClick={chip.clear}
                      className="rounded-full p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAll}
                  className="text-xs font-bold text-sunset hover:underline transition-colors ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Result Grid / List */}
            <div className={viewMode === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
              {filtered.map((c) => (
                <CompoundCard key={c.slug} c={c} viewMode={viewMode} />
              ))}
            </div>

            {/* Empty Matches State */}
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border/80 p-16 text-center bg-card shadow-soft">
                <Search className="mx-auto h-12 w-12 text-muted-foreground/35 mb-4 animate-bounce" />
                <h3 className="font-display text-lg font-bold text-primary">No results found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  We couldn't find any compounds matching your active filter combinations. Try clearing some search parameters.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-4 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground shadow-sm hover:opacity-90 transition-opacity"
                >
                  Clear All Filters
                </button>
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
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{label}</label>
      <div className="relative">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-border bg-background pl-3.5 pr-10 py-2.5 text-xs md:text-sm font-medium text-foreground transition-all hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 cursor-pointer shadow-2xs"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground/60 transition-transform duration-200" />
      </div>
    </div>
  );
}
