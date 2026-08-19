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
      {
        name: "description",
        content:
          "Browse every compound in the PropTrack database. Filter by destination, developer, price and delivery year.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const navigate = useNavigate();
  const { destination: destinationParam, dev: devParam, q: qParam } = Route.useSearch();
  const [q, setQ] = useState(qParam || "");
  const debouncedQ = useDebounce(q, 250);
  const initialDestinations = useMemo(() => {
    if (!destinationParam) return [];
    return destinationParam.split(",").map((s) => s.trim()).filter(Boolean);
  }, [destinationParam]);

  const [destinationsSelected, setDestinationsSelected] = useState<string[]>(initialDestinations);
  const [dev, setDev] = useState(devParam || "");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [kiloFilter, setKiloFilter] = useState("");

  const mainCompounds = useMemo(() => compounds.filter((c) => !c.parentSlug), [compounds]);
  const availMaxPrices = useMemo(
    () => availability.flatMap((a) => a.breakdown.map((b) => b.maxPriceM)),
    [availability],
  );
  const compoundPrices = useMemo(() => mainCompounds.map((c) => c.priceFrom), [mainCompounds]);
  const allPrices = useMemo(
    () => [...availMaxPrices, ...compoundPrices].filter((p) => p > 0),
    [availMaxPrices, compoundPrices],
  );
  const PRICE_MAX = useMemo(
    () => (allPrices.length > 0 ? Math.max(...allPrices) : 100),
    [allPrices],
  );
  const PRICE_MIN = useMemo(
    () => (compoundPrices.length > 0 ? Math.min(...compoundPrices) : 0),
    [compoundPrices],
  );
  const ALL_TYPES = useMemo(
    () => Array.from(new Set(mainCompounds.flatMap((c) => c.types))).sort(),
    [mainCompounds],
  );

  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const currentMaxPrice = maxPrice ?? PRICE_MAX;
  const [sort, setSort] = useState<"name" | "price-asc" | "price-desc" | "delivery">("name");
  const [visibleLimit, setVisibleLimit] = useState(12);
  const [filtersOpen, setFiltersOpen] = useState(!!(destinationParam || devParam || qParam));
  const trackEvent = useStore((s) => s.trackEvent);

  const hasFilters = !!(
    q ||
    destinationsSelected.length > 0 ||
    dev ||
    status ||
    type ||
    kiloFilter ||
    currentMaxPrice < PRICE_MAX
  );

  function clearAll() {
    setQ("");
    setDestinationsSelected([]);
    setDev("");
    setStatus("");
    setType("");
    setKiloFilter("");
    setMaxPrice(null);
  }

  const handleSelectPreset = (presetType: "destination" | "dev" | "q", val: string) => {
    if (presetType === "destination") {
      setDestinationsSelected((prev) => (prev.includes(val) ? prev : [...prev, val]));
    } else if (presetType === "dev") setDev(val);
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
      map.set(
        c.slug,
        `${c.name} ${c.developer} ${c.destination} ${c.blurb} ${c.types.join(" ")} ${c.amenities.join(" ")} ${availText}`.toLowerCase(),
      );
    });
    return map;
  }, [availabilityMap]);

  const matchCompound = (
    c: any,
    qVal: string,
    destinationVal: string | string[],
    devVal: string,
    statusVal: string,
    typeVal: string,
    maxPriceVal: number,
    kiloFilterVal: string,
  ) => {
    if (qVal) {
      // Intelligent Query Processing
      const stopWords = new Set([
        "in",
        "for",
        "with",
        "a",
        "an",
        "the",
        "at",
        "by",
        "of",
        "and",
        "on",
      ]);
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

          if (
            (word === "mv" || word === "mountainview") &&
            (devLower.includes("mountain view") || devLower.includes("mv"))
          ) {
            wordMatches = true;
          } else if (
            (word === "ph" || word === "phd" || word === "palm") &&
            devLower.includes("palm hills")
          ) {
            wordMatches = true;
          } else if (
            (word === "tagamo3" || word === "tagamoa" || word === "tagamo'") &&
            destLower.includes("new-cairo")
          ) {
            wordMatches = true;
          } else if (
            word === "zayed" &&
            (destLower.includes("sheikh-zayed") || destLower.includes("new-zayed"))
          ) {
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
    if (destinationVal && (Array.isArray(destinationVal) ? destinationVal.length > 0 : true)) {
      if (Array.isArray(destinationVal)) {
        if (!destinationVal.includes(c.destination)) return false;
      } else if (c.destination !== destinationVal) {
        return false;
      }
    }
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
    let list = mainCompounds.filter((c) =>
      matchCompound(c, debouncedQ, destinationsSelected, dev, status, type, currentMaxPrice, kiloFilter),
    );
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price-asc") return a.priceFrom - b.priceFrom;
      if (sort === "price-desc") return b.priceFrom - a.priceFrom;
      return a.deliveryYear - b.deliveryYear;
    });
  }, [
    debouncedQ,
    destinationsSelected,
    dev,
    status,
    type,
    currentMaxPrice,
    kiloFilter,
    sort,
    searchableTextMap,
    mainCompounds,
  ]);

  // Dynamic cascading option computations:
  const activeFilters = useMemo(() => {
    const activeDests = new Set<string>();
    const activeDevs = new Set<string>();
    const activeStats = new Set<string>();
    const activeTyps = new Set<string>();

    mainCompounds.forEach((c) => {
      // For activeDestinations (match everything except destination filter)
      if (matchCompound(c, debouncedQ, [], dev, status, type, currentMaxPrice, kiloFilter)) {
        activeDests.add(c.destination);
      }
      // For activeDevelopers (match everything except developer filter)
      if (
        matchCompound(c, debouncedQ, destinationsSelected, "", status, type, currentMaxPrice, kiloFilter)
      ) {
        activeDevs.add(c.developerSlug);
      }
      // For activeStatuses (match everything except status filter)
      if (matchCompound(c, debouncedQ, destinationsSelected, dev, "", type, currentMaxPrice, kiloFilter)) {
        activeStats.add(c.status);
      }
      // For activeTypes (match everything except type filter)
      if (matchCompound(c, debouncedQ, destinationsSelected, dev, status, "", currentMaxPrice, kiloFilter)) {
        c.types.forEach((t) => activeTyps.add(t));
      }
    });

    return {
      destinations: destinations.filter((a) => activeDests.has(a.slug)),
      developers: developers.filter((d) => activeDevs.has(d.slug)),
      statuses: ["RTM", "Off-Plan"].filter((s) => activeStats.has(s as any)),
      types: ALL_TYPES.filter((t) => activeTyps.has(t)),
    };
  }, [
    debouncedQ,
    destinationsSelected,
    dev,
    status,
    type,
    currentMaxPrice,
    kiloFilter,
    searchableTextMap,
    mainCompounds,
  ]);

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <SlidersHorizontal className="h-3.5 w-3.5 text-accent" /> Filters
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent/80 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      <SmartSearchBar
        value={q}
        onChange={setQ}
        onSelectProject={(slug) => navigate({ to: "/projects/$slug", params: { slug } })}
        onSelectDeveloper={setDev}
        onSelectDestination={(val) => setDestinationsSelected([val])}
        onSelectPreset={handleSelectPreset}
        variant="compact"
        showPresets={false}
        placeholder="Filter projects..."
      />

      <MultiDestinationSelect
        selected={destinationsSelected}
        onChange={setDestinationsSelected}
        options={activeFilters.destinations.map((a) => ({ value: a.slug, label: a.name }))}
      />
      <FilterSelect
        label="Developer"
        value={dev}
        onChange={setDev}
        options={[
          { value: "", label: "All developers" },
          ...activeFilters.developers.map((d) => ({ value: d.slug, label: d.name })),
        ]}
      />
      <FilterSelect
        label="Status"
        value={status}
        onChange={setStatus}
        options={[
          { value: "", label: "Any status" },
          ...activeFilters.statuses.map((s) => ({ value: s, label: s })),
        ]}
      />
      <FilterSelect
        label="Unit Type"
        value={type}
        onChange={setType}
        options={[
          { value: "", label: "Any type" },
          ...activeFilters.types.map((t) => ({ value: t, label: t })),
        ]}
      />
      {(!destinationsSelected.length ||
        destinationsSelected.some(
          (slug) => destinations.find((d) => d.slug === slug)?.region === "north-coast",
        )) && (
        <FilterSelect
          label="Sahel Highway Marker (Kilo)"
          value={kiloFilter}
          onChange={setKiloFilter}
          options={[
            { value: "", label: "Any Kilo range" },
            { value: "90-120", label: "KM 90 – 120 (Gateway & Alamein)" },
            { value: "120-150", label: "KM 120 – 150 (Sidi Abdelrahman)" },
            { value: "150-180", label: "KM 150 – 180 (Al Dabaa)" },
            { value: "180-220", label: "KM 180 – 220 (Ras El Hekma)" },
            { value: "220+", label: "KM 220+ (Sidi Heneish)" },
          ]}
        />
      )}
      <div className="pt-2">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
          <span>Max price</span>
          <span className="font-semibold text-primary">EGP {currentMaxPrice}M</span>
        </div>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={currentMaxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground/75 font-medium">
          <span>EGP {PRICE_MIN}M</span>
          <span>EGP {PRICE_MAX}M</span>
        </div>
      </div>
    </div>
  );

  return (
    <Shell>
      {/* Header */}
      <div className="border-b border-border/60 bg-gradient-sand shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:py-12 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Property Atlas
              </div>
              <h1 className="mt-1 font-display text-3xl md:text-4xl font-semibold tracking-tight text-primary">
                All projects
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {mainCompounds.length} compounds across Sahel, Cairo, Red Sea & beyond.
              </p>
            </div>
            {/* Mobile: Filters toggle button */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all lg:hidden self-start md:self-auto shadow-2xs ${
                hasFilters
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {hasFilters && <span className="h-2 w-2 rounded-full bg-accent animate-ping" />}
              {filtersOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Hero Smart Search Bar */}
          <div className="mt-8 max-w-3xl">
            <SmartSearchBar
              value={q}
              onChange={setQ}
              onSelectProject={(slug) => navigate({ to: "/projects/$slug", params: { slug } })}
              onSelectDeveloper={setDev}
              onSelectDestination={(val) => setDestinationsSelected([val])}
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
        <div className="border-b border-border/60 bg-card px-4 py-6 lg:hidden shadow-inner">
          {FilterPanel}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block space-y-6 rounded-2xl border border-border bg-card/65 backdrop-blur-md p-6 shadow-soft lg:sticky lg:top-24 lg:self-start transition-all duration-300">
            {FilterPanel}
          </aside>

          {/* Grid */}
          <div>
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-border/40 pb-4">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Showing <strong className="text-primary">{filtered.length}</strong> of{" "}
                {mainCompounds.length} projects
                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="ml-3 text-[10px] font-bold text-accent hover:text-accent/80 transition-colors uppercase tracking-wider hover:underline"
                  >
                    clear filters
                  </button>
                )}
              </div>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="rounded-xl border border-border bg-card pl-4 pr-9 py-2.5 text-xs font-semibold text-foreground/80 shadow-2xs hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/15 cursor-pointer appearance-none"
                >
                  <option value="name">Sort: Name (A–Z)</option>
                  <option value="price-asc">Price (low → high)</option>
                  <option value="price-desc">Price (high → low)</option>
                  <option value="delivery">Delivery year</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <ChevronDown className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.slice(0, visibleLimit).map((c) => (
                <CompoundCard key={c.slug} c={c} />
              ))}
            </div>

            {filtered.length > visibleLimit && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisibleLimit((prev) => prev + 12)}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-8 py-3.5 text-xs font-bold text-accent hover:bg-accent hover:text-accent-foreground transition-all shadow-md hover:scale-105 cursor-pointer"
                >
                  <span>See More Projects (+{filtered.length - visibleLimit} more options)</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}
            {filtered.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border p-16 text-center shadow-2xs bg-card/10">
                <Search className="mx-auto h-12 w-12 text-muted-foreground/25 mb-4" />
                <h3 className="font-display text-lg font-semibold text-primary">
                  No matching projects
                </h3>
                <p className="mt-1 text-sm text-muted-foreground/80">
                  Try adjusting your filters or search keywords.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-4 rounded-full bg-accent/10 px-5 py-2 text-xs font-semibold text-accent hover:bg-accent/15 transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-border/80 bg-background/50 pl-3.5 pr-10 py-2.5 text-xs font-medium text-foreground transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15 cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-card">
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
          <ChevronDown className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

function MultiDestinationSelect({
  selected,
  onChange,
  options,
}: {
  selected: string[];
  onChange: (slugs: string[]) => void;
  options: Array<{ value: string; label: string }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllOptions, setShowAllOptions] = useState(false);

  const toggleSlug = (slug: string) => {
    if (selected.includes(slug)) {
      onChange(selected.filter((s) => s !== slug));
    } else {
      onChange([...selected, slug]);
    }
  };

  const selectedNames = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label);

  const INITIAL_LIMIT = 5;
  const visibleOptions = showAllOptions ? options : options.slice(0, INITIAL_LIMIT);
  const remainingCount = options.length - INITIAL_LIMIT;

  return (
    <div className="space-y-1.5 relative">
      <label className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
        <span>Destinations / Regions</span>
        {selected.length > 0 && (
          <span className="text-[10px] text-accent font-bold">
            {selected.length} selected
          </span>
        )}
      </label>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {options
            .filter((o) => selected.includes(o.value))
            .map((o) => (
              <span
                key={o.value}
                className="inline-flex items-center gap-1 rounded-full bg-accent/15 border border-accent/30 px-2 py-0.5 text-[10px] font-bold text-accent"
              >
                {o.label}
                <button
                  type="button"
                  onClick={() => toggleSlug(o.value)}
                  className="hover:text-destructive text-accent/80 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[9px] font-semibold text-muted-foreground hover:text-primary underline px-1"
          >
            Clear
          </button>
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left rounded-xl border border-border/80 bg-background/50 pl-3.5 pr-10 py-2.5 text-xs font-medium text-foreground transition-all hover:border-accent/40 focus:outline-none flex items-center justify-between"
        >
          <span className="truncate">
            {selected.length === 0
              ? "All destinations (Select 1 or more)"
              : selected.length === 1
                ? selectedNames[0]
                : `${selected.length} regions (${selectedNames.slice(0, 2).join(", ")}${selectedNames.length > 2 ? "..." : ""})`}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 z-30 mt-1 max-h-72 overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-2xl space-y-1 animate-fade-in">
            <button
              type="button"
              onClick={() => {
                onChange([]);
                setIsOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selected.length === 0 ? "bg-accent/15 text-accent font-bold" : "hover:bg-secondary text-muted-foreground"
              }`}
            >
              All destinations
            </button>
            {visibleOptions.map((o) => {
              const isChecked = selected.includes(o.value);
              return (
                <label
                  key={o.value}
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-colors ${
                    isChecked ? "bg-accent/15 text-accent font-bold" : "hover:bg-secondary text-primary"
                  }`}
                >
                  <span className="truncate">{o.label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSlug(o.value)}
                    className="rounded text-accent focus:ring-accent h-3.5 w-3.5 cursor-pointer"
                  />
                </label>
              );
            })}

            {options.length > INITIAL_LIMIT && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllOptions(!showAllOptions);
                }}
                className="w-full text-center py-2 text-[11px] font-bold text-accent hover:bg-accent/10 rounded-lg transition-colors border-t border-border/40 mt-1 flex items-center justify-center gap-1 cursor-pointer"
              >
                {showAllOptions ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    <span>See more (+{remainingCount} more options)</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
