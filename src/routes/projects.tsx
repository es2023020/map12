import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { compounds } from "@/data/compounds";
import { areas } from "@/data/areas";
import { developers } from "@/data/developers";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";

const PRICE_MAX = Math.max(...compounds.map((c) => c.priceFrom));
const PRICE_MIN = Math.min(...compounds.map((c) => c.priceFrom));
const ALL_TYPES = Array.from(new Set(compounds.flatMap((c) => c.types))).sort();

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "All Projects — PropTrack" },
      { name: "description", content: "Browse every compound in the PropTrack database. Filter by area, developer, price and delivery year." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [dev, setDev] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sort, setSort] = useState<"name" | "price-asc" | "price-desc" | "delivery">("name");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasFilters = !!(q || area || dev || status || type || maxPrice < PRICE_MAX);

  function clearAll() {
    setQ(""); setArea(""); setDev(""); setStatus(""); setType(""); setMaxPrice(PRICE_MAX);
  }

  const filtered = useMemo(() => {
    let list = compounds.filter((c) => {
      if (q) {
        const hay = `${c.name} ${c.developer} ${c.area} ${c.blurb} ${c.types.join(" ")} ${c.amenities.join(" ")}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      if (area && c.area !== area) return false;
      if (dev && c.developerSlug !== dev) return false;
      if (status && c.status !== status) return false;
      if (type && !c.types.includes(type)) return false;
      if (c.priceFrom > maxPrice) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price-asc") return a.priceFrom - b.priceFrom;
      if (sort === "price-desc") return b.priceFrom - a.priceFrom;
      return a.deliveryYear - b.deliveryYear;
    });
  }, [q, area, dev, status, type, maxPrice, sort]);

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
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects…" className="pl-9" />
      </div>
      <FilterSelect label="Area" value={area} onChange={setArea}
        options={[{ value: "", label: "All areas" }, ...areas.map((a) => ({ value: a.slug, label: a.name }))]} />
      <FilterSelect label="Developer" value={dev} onChange={setDev}
        options={[{ value: "", label: "All developers" }, ...developers.map((d) => ({ value: d.slug, label: d.name }))]} />
      <FilterSelect label="Status" value={status} onChange={setStatus}
        options={[
          { value: "", label: "Any status" },
          { value: "Delivered", label: "Delivered" },
          { value: "Under Construction", label: "Under Construction" },
          { value: "Off-Plan", label: "Off-Plan" },
        ]} />
      <FilterSelect label="Unit Type" value={type} onChange={setType}
        options={[{ value: "", label: "Any type" }, ...ALL_TYPES.map((t) => ({ value: t, label: t }))]} />
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
