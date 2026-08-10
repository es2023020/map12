import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { CompoundListRow } from "@/components/CompoundListRow";
import { MapClient } from "@/components/map/MapClient";
import { compounds } from "@/data/compounds";
import { destinations } from "@/data/destinations";
import { developers } from "@/data/developers";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Grid, List as ListIcon, Map as MapIcon, Sparkles, Building2, MapPin } from "lucide-react";
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
  
  // Quick Filters
  const [beachfrontOnly, setBeachfrontOnly] = useState(false);
  const [flagshipOnly, setFlagshipOnly] = useState(false);
  const [rtmOnly, setRtmOnly] = useState(false);

  // View Mode: grid, list, map
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");

  // Map focus & active markers
  const [focusCompound, setFocusCompound] = useState<any | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

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

  const hasFilters = !!(q || destination || dev || status || type || kiloFilter || currentMaxPrice < PRICE_MAX || beachfrontOnly || flagshipOnly || rtmOnly);

  function clearAll() {
    setQ(""); 
    setArea(""); 
    setDev(""); 
    setStatus(""); 
    setType(""); 
    setKiloFilter(""); 
    setMaxPrice(null);
    setBeachfrontOnly(false);
    setFlagshipOnly(false);
    setRtmOnly(false);
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
  }, [availabilityMap, mainCompounds]);

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
    if (beachfrontOnly && !c.beachfront) return false;
    if (flagshipOnly && !c.flagship) return false;
    if (rtmOnly && c.status !== "RTM") return false;

    if (qVal) {
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
  }, [debouncedQ, destination, dev, status, type, currentMaxPrice, kiloFilter, sort, beachfrontOnly, flagshipOnly, rtmOnly, mainCompounds]);

  // Dynamic cascading option computations:
  const activeFilters = useMemo(() => {
    const activeDests = new Set<string>();
    const activeDevs = new Set<string>();
    const activeStats = new Set<string>();
    const activeTyps = new Set<string>();

    mainCompounds.forEach((c) => {
      if (matchCompound(c, debouncedQ, "", dev, status, type, currentMaxPrice, kiloFilter)) {
        activeDests.add(c.destination);
      }
      if (matchCompound(c, debouncedQ, destination, "", status, type, currentMaxPrice, kiloFilter)) {
        activeDevs.add(c.developerSlug);
      }
      if (matchCompound(c, debouncedQ, destination, dev, "", type, currentMaxPrice, kiloFilter)) {
        activeStats.add(c.status);
      }
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
  }, [debouncedQ, destination, dev, status, type, maxPrice, kiloFilter, beachfrontOnly, flagshipOnly, rtmOnly, mainCompounds]);

  // Toggle quick tag pills helper
  const handleToggleTag = (tagType: "beachfront" | "flagship" | "rtm" | "dest" | "dev", value?: string) => {
    if (tagType === "beachfront") setBeachfrontOnly(!beachfrontOnly);
    else if (tagType === "flagship") setFlagshipOnly(!flagshipOnly);
    else if (tagType === "rtm") setRtmOnly(!rtmOnly);
    else if (tagType === "dest" && value) setArea(destination === value ? "" : value);
    else if (tagType === "dev" && value) setDev(dev === value ? "" : value);
  };

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <SlidersHorizontal className="h-4 w-4 text-accent" /> Filters
          {hasFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-[10px] font-bold text-accent">
              !
            </span>
          )}
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs font-medium text-sunset hover:underline">Clear all</button>
        )}
      </div>

      <div className="space-y-4">
        {/* Quick Toggles */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick Options</label>
          <div className="flex flex-col gap-2 bg-secondary/30 p-2.5 rounded-xl border border-border/40">
            <label className="flex items-center justify-between text-xs font-semibold text-primary cursor-pointer select-none">
              <span>Beachfront 🏖️</span>
              <input 
                type="checkbox" 
                checked={beachfrontOnly}
                onChange={() => setBeachfrontOnly(!beachfrontOnly)}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent accent-accent"
              />
            </label>
            <label className="flex items-center justify-between text-xs font-semibold text-primary cursor-pointer select-none border-t border-border/30 pt-2">
              <span>★ Flagship Priority</span>
              <input 
                type="checkbox" 
                checked={flagshipOnly}
                onChange={() => setFlagshipOnly(!flagshipOnly)}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent accent-accent"
              />
            </label>
            <label className="flex items-center justify-between text-xs font-semibold text-primary cursor-pointer select-none border-t border-border/30 pt-2">
              <span>Ready to Move 🔑</span>
              <input 
                type="checkbox" 
                checked={rtmOnly}
                onChange={() => setRtmOnly(!rtmOnly)}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent accent-accent"
              />
            </label>
          </div>
        </div>

        {/* Normal Select Filters */}
        <FilterSelect icon={<MapPin className="h-3.5 w-3.5" />} label="Destination" value={destination} onChange={setArea}
          options={[{ value: "", label: "All destinations" }, ...activeFilters.destinations.map((a) => ({ value: a.slug, label: a.name }))]} />
        
        <FilterSelect icon={<Building2 className="h-3.5 w-3.5" />} label="Developer" value={dev} onChange={setDev}
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
              { value: "90-120", label: "KM 90 – 120 (Gateway & Alamein)" },
              { value: "120-150", label: "KM 120 – 150 (Sidi Abdelrahman)" },
              { value: "150-180", label: "KM 150 – 180 (Al Dabaa)" },
              { value: "180-220", label: "KM 180 – 220 (Ras El Hekma)" },
              { value: "220+", label: "KM 220+ (Sidi Heneish)" }
            ]} />
        )}

        {/* Price Slider */}
        <div className="pt-2">
          <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>Max price</span>
            <span className="font-bold text-accent">EGP {currentMaxPrice}M</span>
          </div>
          <input 
            type="range" 
            min={PRICE_MIN} 
            max={PRICE_MAX} 
            value={currentMaxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))} 
            className="w-full accent-accent h-1 bg-secondary rounded-lg appearance-none cursor-pointer" 
          />
          <div className="mt-1 flex justify-between text-[9px] font-semibold text-muted-foreground">
            <span>EGP {PRICE_MIN}M</span>
            <span>EGP {PRICE_MAX}M</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Shell noFooter={viewMode === "map"}>
      {/* Search Header Banner */}
      <div className="border-b border-border/60 bg-gradient-sand relative overflow-hidden">
        {/* Light decoration */}
        <div className="absolute right-0 top-0 h-64 w-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 h-48 w-48 bg-sunset/5 rounded-full blur-2xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 py-8 lg:py-10 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                <Sparkles className="h-3 w-3" /> Property Atlas
              </div>
              <h1 className="mt-1 font-display text-3.5xl md:text-4xl font-bold tracking-tight text-primary">
                Explore Projects
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                Browse {mainCompounds.length} primary compounds across Sahel, Cairo, Sokhna & Red Sea.
              </p>
            </div>
            
            {/* View Mode & Filter Toggles */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              {/* Desktop view switcher */}
              <div className="flex items-center rounded-full bg-secondary/80 p-0.5 border border-border/40 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-full p-1.5 transition-colors ${viewMode === "grid" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                  title="Grid View"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-full p-1.5 transition-colors ${viewMode === "list" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                  title="List View"
                >
                  <ListIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`rounded-full p-1.5 transition-colors ${viewMode === "map" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                  title="Split Map View"
                >
                  <MapIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile: Filters toggle button */}
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors lg:hidden ${
                  hasFilters ? "border-accent bg-accent/15 text-accent shadow-sm" : "border-border bg-card text-muted-foreground"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {hasFilters && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                {filtersOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Hero Smart Search Bar */}
          <div className="mt-6 max-w-4xl">
            <SmartSearchBar
              value={q}
              onChange={setQ}
              onSelectProject={(slug) => navigate({ to: "/projects/$slug", params: { slug } })}
              onSelectDeveloper={setDev}
              onSelectDestination={setArea}
              onSelectPreset={handleSelectPreset}
              variant="hero"
              showPresets={false}
              placeholder="Search by project name, developer (e.g. Ora, Palm Hills), destination..."
            />
          </div>

          {/* Quick Filter Pills Row */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mr-1.5 select-none shrink-0">Quick tags:</span>
            <button 
              onClick={() => handleToggleTag("beachfront")}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all shrink-0 select-none ${beachfrontOnly ? "bg-sunset text-white border-sunset shadow-sm" : "bg-card text-muted-foreground border-border/50 hover:border-muted-foreground/30"}`}
            >
              Beachfront 🏖️
            </button>
            <button 
              onClick={() => handleToggleTag("flagship")}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all shrink-0 select-none ${flagshipOnly ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-card text-muted-foreground border-border/50 hover:border-muted-foreground/30"}`}
            >
              ★ Flagship
            </button>
            <button 
              onClick={() => handleToggleTag("rtm")}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all shrink-0 select-none ${rtmOnly ? "bg-accent text-white border-accent shadow-sm" : "bg-card text-muted-foreground border-border/50 hover:border-muted-foreground/30"}`}
            >
              Ready to Move 🔑
            </button>
            <button 
              onClick={() => handleToggleTag("dest", "ras-el-hekma")}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all shrink-0 select-none ${destination === "ras-el-hekma" ? "bg-primary text-white border-primary shadow-sm" : "bg-card text-muted-foreground border-border/50 hover:border-muted-foreground/30"}`}
            >
              Ras El Hekma 🌊
            </button>
            <button 
              onClick={() => handleToggleTag("dest", "new-cairo")}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all shrink-0 select-none ${destination === "new-cairo" ? "bg-primary text-white border-primary shadow-sm" : "bg-card text-muted-foreground border-border/50 hover:border-muted-foreground/30"}`}
            >
              New Cairo 🏙️
            </button>
            <button 
              onClick={() => handleToggleTag("dev", "ora-developers")}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all shrink-0 select-none ${dev === "ora-developers" ? "bg-primary text-white border-primary shadow-sm" : "bg-card text-muted-foreground border-border/50 hover:border-muted-foreground/30"}`}
            >
              Ora Developers 🏔️
            </button>
            <button 
              onClick={() => handleToggleTag("dev", "palm-hills-developments")}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all shrink-0 select-none ${dev === "palm-hills-developments" ? "bg-primary text-white border-primary shadow-sm" : "bg-card text-muted-foreground border-border/50 hover:border-muted-foreground/30"}`}
            >
              Palm Hills 🌴
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer (toggled by mobile filter button) */}
      {filtersOpen && (
        <div className="border-b border-border/60 bg-card px-4 py-5 lg:hidden animate-fade-in">
          {FilterPanel}
        </div>
      )}

      {/* Main Grid/Map Body Area */}
      {viewMode === "map" ? (
        /* Split Map View Layout (locks height, hides footer) */
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0 border-r border-border/60 bg-card p-5 overflow-y-auto h-full">
            {FilterPanel}
          </aside>

          {/* Middle scrollable projects list */}
          <div className="w-full lg:w-[420px] shrink-0 border-r border-border/60 bg-background flex flex-col h-[50%] lg:h-full order-2 lg:order-1">
            <div className="p-4 border-b border-border/40 bg-card shrink-0 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold">
                Showing <strong className="text-primary">{filtered.length}</strong> main projects
              </span>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value as any)}
                className="rounded-md border border-border bg-card px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="name">Sort: A–Z</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="delivery">Delivery year</option>
              </select>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 h-full">
              {filtered.map((c) => (
                <CompoundCard key={c.slug} c={c} />
              ))}
              {filtered.length === 0 && (
                <EmptyState clearAll={clearAll} />
              )}
            </div>
          </div>

          {/* Right side interactive map */}
          <div className="flex-1 h-[50%] lg:h-full order-1 lg:order-2 relative bg-secondary">
            <MapClient 
              compounds={filtered} 
              className="h-full w-full" 
              focus={focusCompound}
              activeSlug={activeSlug}
              initialCenter={[30.8, 29.5]}
              initialZoom={8}
              onSelect={(slug) => {
                setActiveSlug(slug);
                const c = mainCompounds.find(x => x.slug === slug);
                if (c) setFocusCompound(c);
                const el = document.getElementById(`compound-card-${slug}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
              }}
            />
          </div>
        </div>
      ) : (
        /* Regular Catalog Grid/List Layout */
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Desktop filter sidebar */}
            <aside className="hidden lg:block space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-soft lg:sticky lg:top-20 lg:self-start">
              {FilterPanel}
            </aside>

            {/* List panel */}
            <div className="space-y-4">
              {/* Header counts & sorting */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="text-xs text-muted-foreground font-semibold">
                  Showing <strong className="text-primary">{filtered.length}</strong> of {mainCompounds.length} projects
                  {hasFilters && (
                    <button onClick={clearAll} className="ml-2 text-xs font-semibold text-sunset hover:underline">clear filters</button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <select 
                    value={sort} 
                    onChange={(e) => setSort(e.target.value as any)}
                    className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="name">Sort: Name (A–Z)</option>
                    <option value="price-asc">Price (low → high)</option>
                    <option value="price-desc">Price (high → low)</option>
                    <option value="delivery">Delivery year</option>
                  </select>
                </div>
              </div>

              {/* View Render */}
              {viewMode === "grid" ? (
                /* Grid View */
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((c) => (
                    <CompoundCard key={c.slug} c={c} />
                  ))}
                </div>
              ) : (
                /* List View (dense horizontal rows) */
                <div className="flex flex-col gap-3">
                  {filtered.map((c) => (
                    <CompoundListRow 
                      key={c.slug} 
                      c={c} 
                    />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {filtered.length === 0 && (
                <EmptyState clearAll={clearAll} />
              )}
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

function FilterSelect({ 
  label, 
  value, 
  onChange, 
  options,
  icon
}: {
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border border-border/80 bg-background py-2 pr-8 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${icon ? "pl-9" : "pl-3"}`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function EmptyState({ clearAll }: { clearAll: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center shadow-soft">
      <Search className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
      <p className="text-xs font-bold text-muted-foreground">No projects match these filters.</p>
      <button onClick={clearAll} className="mt-2 text-xs font-semibold text-accent hover:underline">
        Clear all filters
      </button>
    </div>
  );
}
