import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Map,
  Maximize2,
  Minimize2,
  ExternalLink,
  X,
  Search,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Layers,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Route as RouteIcon,
  Filter,
} from "lucide-react";
import { mapPlates, type MapPlate } from "@/data/maps-plates";
import { compounds } from "@/data/compounds";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dashboard/maps")({
  head: () => ({
    meta: [
      { title: "Interactive Field Atlas & Maps Library — Property Atlas" },
      {
        name: "description",
        content: "High-resolution technical field atlas, regional master plans, and linear road maps across Greater Cairo and the North Coast.",
      },
    ],
  }),
  component: NativeMapsLibraryPage,
});

export default function NativeMapsLibraryPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalPlate, setActiveModalPlate] = useState<MapPlate | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState<"plates" | "km-strip">("plates");

  // Sahel compounds sorted by kilometer
  const sahelKmList = useMemo(() => {
    return compounds
      .filter((c) => c.km !== undefined && c.km !== null && c.km > 0)
      .sort((a, b) => (a.km ?? 0) - (b.km ?? 0));
  }, []);

  const filteredPlates = useMemo(() => {
    return mapPlates.filter((p) => {
      const matchRegion = selectedRegion === "all" || p.region === selectedRegion;
      const matchQuery =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keyCompounds.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRegion && matchQuery;
    });
  }, [selectedRegion, searchQuery]);

  const handleOpenModal = (plate: MapPlate) => {
    setActiveModalPlate(plate);
    setZoomLevel(1);
  };

  const handleCloseModal = () => {
    setActiveModalPlate(null);
    setZoomLevel(1);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-primary to-slate-950 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent-foreground backdrop-blur-md">
              <Compass className="h-3.5 w-3.5" />
              <span>Technical Field Atlas · 2026 Edition</span>
            </div>
            <h1 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight">
              Master Blueprints & Regional Field Maps
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Fourteen high-resolution plates charting Egyptian property corridors — East Cairo,
              Mostakbal City, Sheikh Zayed & October, and the 273km Mediterranean shoreline.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
              <div className="font-display text-2xl font-bold text-accent">04</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Regions</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
              <div className="font-display text-2xl font-bold text-accent">14</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Plates</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
              <div className="font-display text-2xl font-bold text-accent">380+</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Mapped Projects</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
              <div className="font-display text-2xl font-bold text-accent">273km</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Coastline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar & Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Region Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: "All Regions (14)" },
            { id: "coast", label: "North Coast (6)" },
            { id: "new-cairo", label: "New Cairo (3)" },
            { id: "mostakbal", label: "Mostakbal City (2)" },
            { id: "west", label: "Greater West (3)" },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              className={`rounded-xl px-3.5 py-2 font-semibold whitespace-nowrap transition-all ${
                selectedRegion === r.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Search & Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plates, compounds, roads..."
              className="pl-9 h-9 text-xs rounded-xl"
            />
          </div>

          <div className="flex rounded-xl bg-secondary/80 p-1 text-xs shrink-0">
            <button
              onClick={() => setViewMode("plates")}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                viewMode === "plates" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              Plates
            </button>
            <button
              onClick={() => setViewMode("km-strip")}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                viewMode === "km-strip" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              Sahel Km Strip
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "plates" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlates.map((plate) => (
            <div
              key={plate.id}
              className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden shadow-soft hover:shadow-soft-xl transition-all duration-300"
            >
              {/* Plate Image Viewport */}
              <div
                onClick={() => handleOpenModal(plate)}
                className="relative h-48 w-full bg-slate-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={plate.image}
                  alt={plate.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  onError={(e) => {
                    // Fallback to satellite if specific svg failed
                    (e.target as HTMLImageElement).src = "/destinations/new-cairo.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges on preview */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="rounded-lg bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[11px] font-mono font-bold text-accent">
                    {plate.plateNumber}
                  </span>
                  {plate.kmRange && (
                    <span className="rounded-lg bg-blue-600/80 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white">
                      {plate.kmRange}
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <div className="rounded-full bg-black/50 p-1.5 text-white/80 group-hover:text-white group-hover:bg-accent transition-all">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-display text-base font-bold text-white leading-tight">
                    {plate.title}
                  </h3>
                  <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-accent shrink-0" />
                    <span>{plate.bearing}</span>
                  </div>
                </div>
              </div>

              {/* Plate Body Details */}
              <div className="flex flex-col flex-1 p-5 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {plate.description}
                </p>

                {/* Technical Specs */}
                <div className="space-y-1.5 rounded-2xl bg-secondary/40 p-3 text-[11px]">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-muted-foreground">Borders:</span>
                    <span className="font-medium text-foreground text-right max-w-[65%]">{plate.borders}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-muted-foreground">Access Roads:</span>
                    <span className="font-medium text-foreground text-right max-w-[65%]">{plate.accessRoads}</span>
                  </div>
                </div>

                {/* Key compounds chips */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Key Developments Included:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {plate.keyCompounds.map((comp, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground/90"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-2 flex items-center gap-2">
                  <Button
                    onClick={() => handleOpenModal(plate)}
                    variant="outline"
                    className="flex-1 rounded-xl text-xs h-9 font-semibold gap-1.5"
                  >
                    <ZoomIn className="h-3.5 w-3.5" /> Inspect Blueprint
                  </Button>
                  <a
                    href={plate.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-border h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Open Full Resolution"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Sahel Kilometer Strip Mode */
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-soft">
          <div className="border-b border-border bg-secondary/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-primary">
                  Sahel Coastal Highway Linear Kilometer Index
                </h3>
                <p className="text-xs text-muted-foreground">
                  Complete sequential catalog of compounds ordered from Alexandria Km 90 to Marsa Matrouh Km 273.
                </p>
              </div>
              <div className="text-xs font-mono font-semibold text-accent">
                {sahelKmList.length} Coastal Compounds Indexed
              </div>
            </div>
          </div>

          <div className="divide-y divide-border/60 max-h-[650px] overflow-y-auto">
            {sahelKmList.map((c) => (
              <div
                key={c.slug}
                className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-accent">KM</span>
                    <span className="font-mono text-sm font-extrabold">{c.km}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/projects/${c.slug}`}
                        className="font-bold text-sm text-primary hover:text-accent transition-colors"
                      >
                        {c.name}
                      </Link>
                      {c.flagship && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                          ★ Flagship
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {c.developer} · <span className="capitalize">{c.destination.replace(/-/g, " ")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xs font-bold text-primary">
                      {c.priceFrom > 0 ? `EGP ${c.priceFrom}M+` : "Price on Request"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Delivery: {c.deliveryYear} · {c.status}
                    </div>
                  </div>
                  <Link
                    to={`/projects/${c.slug}`}
                    className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox / Modal Inspector */}
      {activeModalPlate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-black/70 p-2 rounded-2xl border border-white/20">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 3))}
              className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.7))}
              className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <a
              href={activeModalPlate.image}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-accent px-3 py-2 text-xs font-bold text-accent-foreground hover:bg-accent/90 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="h-4 w-4" /> Open Original
            </a>
            <button
              onClick={handleCloseModal}
              className="rounded-xl bg-red-600/80 p-2 text-white hover:bg-red-600 transition-colors ml-2"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Header Badge */}
          <div className="fixed top-4 left-4 z-50 text-white max-w-md pointer-events-none">
            <span className="rounded-lg bg-accent px-2.5 py-1 text-xs font-bold font-mono text-accent-foreground uppercase">
              {activeModalPlate.plateNumber} · {activeModalPlate.regionName}
            </span>
            <h2 className="text-lg font-bold text-white mt-1 drop-shadow-md">
              {activeModalPlate.title}
            </h2>
            <p className="text-xs text-slate-300 drop-shadow-md">
              {activeModalPlate.bearing} · {activeModalPlate.accessRoads}
            </p>
          </div>

          {/* Zoomable Image Container */}
          <div className="relative h-[85vh] w-[90vw] overflow-auto flex items-center justify-center p-4">
            <img
              src={activeModalPlate.image}
              alt={activeModalPlate.title}
              style={{
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.15s ease-out",
              }}
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl border border-white/10 cursor-grab active:cursor-grabbing"
            />
          </div>
        </div>
      )}
    </div>
  );
}
