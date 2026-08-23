import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { useStore } from "@/lib/store";
import {
  Building2,
  Calendar,
  MapPin,
  Sparkles,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/new-launches")({
  head: () => ({
    meta: [
      { title: "Exclusive New Launches 2026 — Property Atlas" },
      {
        name: "description",
        content: "Egypt's most anticipated real estate developments, updated in real time.",
      },
    ],
  }),
  component: NewLaunchesPage,
});

function NewLaunchesPage() {
  const compoundsList = useStore((s) => s.compoundsList) || [];
  const launches = useMemo(() => compoundsList.filter((c) => c.isNewLaunch), [compoundsList]);

  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [searchVal, setSearchVal] = useState("");
  const [destFilter, setDestFilter] = useState("");

  const destinationsList = useMemo(() => {
    const list = new Set<string>();
    launches.forEach((l) => list.add(l.destination));
    return Array.from(list);
  }, [launches]);

  const filteredLaunches = useMemo(() => {
    return launches.filter((c) => {
      const parent = c.parentSlug ? compoundsList.find((p) => p.slug === c.parentSlug) : null;
      const parentName = parent ? parent.name : "";

      const matchSearch =
        c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        c.developer.toLowerCase().includes(searchVal.toLowerCase()) ||
        c.destination.toLowerCase().includes(searchVal.toLowerCase()) ||
        parentName.toLowerCase().includes(searchVal.toLowerCase());

      const matchDest = !destFilter || c.destination === destFilter;

      return matchSearch && matchDest;
    });
  }, [launches, searchVal, destFilter, compoundsList]);

  return (
    <Shell>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-accent/90 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/25 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-foreground/75 hover:text-accent transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 mb-3 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Market First Look
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Egypt New Launches <span className="text-accent">2026</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-primary-foreground/80 max-w-xl leading-relaxed">
            A dedicated portal for premium off-plan launches, new phases, and exclusive
            opportunities across Ras El Hekma, New Cairo, and Sheikh Zayed.
          </p>
        </div>
      </div>

      {/* Main Body */}
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Filters strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search launches, developers..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full border border-border/80 rounded-xl bg-card pl-9 pr-4 py-2 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Destination filter */}
            <div className="relative w-full sm:w-auto">
              <select
                value={destFilter}
                onChange={(e) => setDestFilter(e.target.value)}
                className="w-full sm:w-auto appearance-none border border-border/80 rounded-xl bg-card px-4 py-2 pr-8 text-xs font-semibold text-primary focus:outline-none"
              >
                <option value="">All Destinations</option>
                {destinationsList.map((d) => (
                  <option key={d} value={d}>
                    {d.replace(/-/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="text-xs text-muted-foreground font-medium">
            Showing <strong className="text-foreground">{filteredLaunches.length}</strong> of{" "}
            {launches.length} launches
          </div>
        </div>

        {/* Launches Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredLaunches.map((c) => {
            const parent = c.parentSlug ? compoundsList.find((p) => p.slug === c.parentSlug) : null;
            const hasImgError = failedImages[c.slug];
            return (
              <Link
                key={c.slug}
                to="/projects/$slug"
                params={{ slug: c.slug }}
                className="group relative rounded-2xl bg-card border border-border/40 shadow-soft hover:shadow-xl hover:-translate-y-1 overflow-hidden transition-all flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                  {hasImgError ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary/80 p-4 text-center select-none">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/60 mb-2" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        No image uploaded
                      </span>
                      <span className="text-[9px] text-muted-foreground/80 mt-0.5">
                        Edit in admin dashboard
                      </span>
                    </div>
                  ) : (
                    <img
                      src={c.hero}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={() => setFailedImages((prev) => ({ ...prev, [c.slug]: true }))}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white border border-white/10">
                      {c.status}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="text-white font-display text-base font-bold truncate">
                      {c.name}
                    </div>
                    <div className="text-white/80 text-[10px] font-medium truncate flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3 w-3" /> {c.destination.replace(/-/g, " ")}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {parent ? (
                      <div className="mb-2">
                        <span className="inline-flex items-center rounded-full bg-accent/15 border border-accent/25 px-2.5 py-0.5 text-[9px] font-extrabold text-accent">
                          Phase of {parent.name}
                        </span>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[9px] font-extrabold text-primary">
                          Primary Launch
                        </span>
                      </div>
                    )}

                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                      Developer
                    </div>
                    <div className="text-xs font-semibold text-foreground truncate">
                      {c.developer}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-wide font-medium">
                        Starting from
                      </div>
                      <div className="text-accent text-sm font-bold">{c.priceFrom}M EGP</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-muted-foreground uppercase tracking-wide font-medium">
                        Delivery
                      </div>
                      <div className="text-xs font-bold flex items-center justify-end gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" /> {c.deliveryYear}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredLaunches.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 p-16 text-center text-muted-foreground bg-card">
            No new launches match your search query or filters.
          </div>
        )}
      </div>
    </Shell>
  );
}
