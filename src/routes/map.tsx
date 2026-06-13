import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { MapClient } from "@/components/map/MapClient";
import { compounds } from "@/data/compounds";
import { areas } from "@/data/areas";
import { developers } from "@/data/developers";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Waves } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Interactive Map — PropTrack" },
      { name: "description", content: "Every Sahel compound and Greater Cairo project, pinned on a smooth interactive map." },
      { property: "og:title", content: "Interactive Compound Map — PropTrack" },
      { property: "og:description", content: "Explore every Sahel compound and Greater Cairo project on one map." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [region, setRegion] = useState<"all" | "north-coast" | "greater-cairo">("all");
  const [areaSlug, setAreaSlug] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [dev, setDev] = useState<string>("");
  const [focusSlug, setFocusSlug] = useState<string | null>(null);
  const [beachOnly, setBeachOnly] = useState(false);

  const filtered = useMemo(() => {
    return compounds.filter((c) => {
      const a = areas.find((x) => x.slug === c.area);
      if (region !== "all" && a?.region !== region) return false;
      if (areaSlug && c.area !== areaSlug) return false;
      if (beachOnly && !c.beachfront) return false;
      if (dev && c.developerSlug !== dev) return false;
      if (q && !`${c.name} ${c.developer}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [region, areaSlug, beachOnly, dev, q]);

  const focused = focusSlug ? compounds.find((c) => c.slug === focusSlug) ?? null : null;
  const filterAreas = areas.filter((a) => region === "all" || a.region === region);

  return (
    <Shell noFooter>
      <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="flex w-full shrink-0 flex-col border-r border-border/60 bg-card lg:w-[380px]">
          <div className="border-b border-border/60 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search compounds or developers" className="pl-9" />
            </div>
            <div className="mt-3 flex gap-1.5">
              {(["all", "north-coast", "greater-cairo"] as const).map((r) => (
                <button key={r} onClick={() => { setRegion(r); setAreaSlug(null); }}
                  className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                    region === r ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-primary"
                  }`}>
                  {r === "all" ? "All" : r === "north-coast" ? "North Coast" : "Greater Cairo"}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button onClick={() => setAreaSlug(null)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${areaSlug === null ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-muted-foreground hover:text-primary"}`}>
                All areas
              </button>
              {filterAreas.map((a) => (
                <button key={a.slug} onClick={() => setAreaSlug(a.slug === areaSlug ? null : a.slug)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${areaSlug === a.slug ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-muted-foreground hover:text-primary"}`}>
                  {a.name}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-xs">
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground">
                <input type="checkbox" checked={beachOnly} onChange={(e) => setBeachOnly(e.target.checked)} className="h-3.5 w-3.5 accent-accent" />
                <Waves className="h-3 w-3" /> Beachfront only
              </label>
              <select value={dev} onChange={(e) => setDev(e.target.value)} className="rounded-md border border-border bg-card px-2 py-1 text-xs">
                <option value="">All developers</option>
                {developers.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-xs text-muted-foreground">
            <span><strong className="text-primary">{filtered.length}</strong> projects shown</span>
            {focused && <button onClick={() => setFocusSlug(null)} className="text-accent hover:underline">Reset view</button>}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <button key={c.slug} onClick={() => setFocusSlug(c.slug)}
                className={`flex w-full gap-3 border-b border-border/60 p-3 text-left transition-colors ${focusSlug === c.slug ? "bg-secondary" : "hover:bg-secondary/50"}`}>
                <img src={c.hero} alt={c.name} className="h-16 w-20 shrink-0 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="truncate font-display text-sm font-semibold text-primary">{c.name}</div>
                    {c.beachfront && <Waves className="h-3 w-3 shrink-0 text-sunset" />}
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">{c.developer}</div>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{c.km ? `km ${c.km}` : "Cairo"}</span>
                    <span className="font-semibold text-primary">EGP {c.priceFrom}M</span>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No compounds match. Try widening filters.</div>
            )}
          </div>
          {focused && (
            <div className="border-t border-border/60 bg-card p-4">
              <Link to="/projects/$slug" params={{ slug: focused.slug }}
                className="block rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Open {focused.name} →
              </Link>
            </div>
          )}
        </aside>

        {/* Map */}
        <div className="relative min-h-[400px] flex-1">
          <MapClient
            compounds={filtered}
            focus={focused}
            initialCenter={region === "greater-cairo" ? [30.04, 31.24] : [30.95, 28.8]}
            initialZoom={region === "greater-cairo" ? 10 : 9}
            className="h-full w-full"
          />
        </div>
      </div>
    </Shell>
  );
}