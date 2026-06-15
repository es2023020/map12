import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { compounds } from "@/data/compounds";
import { areas } from "@/data/areas";
import { developers } from "@/data/developers";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

const PRICE_MAX = Math.max(...compounds.map((c) => c.priceFrom));
const PRICE_MIN = Math.min(...compounds.map((c) => c.priceFrom));
const ALL_TYPES = Array.from(new Set(compounds.flatMap((c) => c.types))).sort();

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "All Projects — PropTrack" },
      { name: "description", content: "Browse every compound in the PropTrack database. Filter by area, developer, price and delivery year." },
      { property: "og:title", content: "All Projects — PropTrack" },
      { property: "og:description", content: "Searchable library of every Sahel, New Cairo and Sheikh Zayed compound." },
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
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price-asc") return a.priceFrom - b.priceFrom;
      if (sort === "price-desc") return b.priceFrom - a.priceFrom;
      return a.deliveryYear - b.deliveryYear;
    });
    return list;
  }, [q, area, dev, status, type, maxPrice, sort]);

  return (
    <Shell>
      <div className="border-b border-border/60 bg-gradient-sand">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-primary">All projects</h1>
          <p className="mt-2 text-muted-foreground">{compounds.length} compounds across Sahel and Greater Cairo.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <aside className="space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-soft lg:sticky lg:top-20 lg:self-start">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9" />
            </div>
            <FilterSelect label="Area" value={area} onChange={setArea}
              options={[{ value: "", label: "All areas" }, ...areas.map((a) => ({ value: a.slug, label: a.name }))]} />
            <FilterSelect label="Developer" value={dev} onChange={setDev}
              options={[{ value: "", label: "All developers" }, ...developers.map((d) => ({ value: d.slug, label: d.name }))]} />
            <FilterSelect label="Status" value={status} onChange={setStatus}
              options={[{ value: "", label: "Any status" }, { value: "Delivered", label: "Delivered" }, { value: "Under Construction", label: "Under Construction" }, { value: "Off-Plan", label: "Off-Plan" }]} />
            <FilterSelect label="Unit type" value={type} onChange={setType}
              options={[{ value: "", label: "Any type" }, ...ALL_TYPES.map((t) => ({ value: t, label: t }))]} />
            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>Max price</span><span className="text-primary">EGP {maxPrice}M</span>
              </div>
              <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-accent" />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>EGP {PRICE_MIN}M</span><span>EGP {PRICE_MAX}M</span>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground"><strong className="text-primary">{filtered.length}</strong> projects</div>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-sm">
                <option value="name">Sort: Name (A–Z)</option>
                <option value="price-asc">Price (low to high)</option>
                <option value="price-desc">Price (high to low)</option>
                <option value="delivery">Delivery year</option>
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((c) => <CompoundCard key={c.slug} c={c} />)}
            </div>
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                No projects match these filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}