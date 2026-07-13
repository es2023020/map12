import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import {
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  ChevronLeft,
  ChevronRight,
  Map,
  LayoutGrid,
  Eye,
  Search,
  X,
  ExternalLink,
  Building2,
  Globe,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/maps")({
  head: () => ({
    meta: [
      { title: "Maps Library — PropTrack" },
      { name: "description", content: "Interactive map library for PropTrack agents — browse all project area maps and market reference PDFs." },
    ],
  }),
  component: MapsPage,
});

const maps = [
  {
    id: "nawy-sahel",
    title: "Nawy Sahel Map",
    subtitle: "Complete Sahel Compound Directory",
    description: "Full interactive map of all Sahel North Coast compounds, from Alexandria to Sidi Heneish. Shows project locations, zones, and distances.",
    file: "/maps/Nawy Sahel Map.pdf",
    category: "North Coast",
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    borderColor: "border-cyan-200 dark:border-cyan-900/40",
    textColor: "text-cyan-700 dark:text-cyan-300",
    icon: Globe,
    tags: ["Sahel", "North Coast", "Compounds", "2026"],
    pages: 1,
    size: "2.5 MB",
  },
  {
    id: "north-coast-hosny",
    title: "North Coast Map by Eslam Hosny",
    subtitle: "Detailed North Coast Reference Map",
    description: "Professional-grade map covering all major North Coast destinations from Sidi Abdel Rahman to Ras El Hekma. Includes km markers, developer zones, and project footprints.",
    file: "/maps/North Coast Map by Eslam Hosny.pdf",
    category: "North Coast",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-900/40",
    textColor: "text-blue-700 dark:text-blue-300",
    icon: Map,
    tags: ["North Coast", "Hekma", "Sahel", "Reference"],
    pages: 1,
    size: "12.3 MB",
  },
  {
    id: "sahel-map",
    title: "Sahel Map",
    subtitle: "Sahel Area Overview",
    description: "Overview map of the entire Sahel coastal strip with project clusters, beachfront coverage, and distance indicators from Alexandria.",
    file: "/maps/Sahel Map.pdf",
    category: "North Coast",
    color: "from-teal-500 to-emerald-600",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    borderColor: "border-teal-200 dark:border-teal-900/40",
    textColor: "text-teal-700 dark:text-teal-300",
    icon: Layers,
    tags: ["Sahel", "Overview", "Coastal"],
    pages: 1,
    size: "3.5 MB",
  },
  {
    id: "new-cairo-hosny",
    title: "New Cairo Map by Eslam Hosny",
    subtitle: "New Cairo Project Reference Map",
    description: "Comprehensive map of New Cairo, Fifth Settlement, and Mostakbal City compounds. Shows major developments, roads, and community zones.",
    file: "/maps/New Cairo Map by Eslam Hosny.pdf",
    category: "New Cairo",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    borderColor: "border-violet-200 dark:border-violet-900/40",
    textColor: "text-violet-700 dark:text-violet-300",
    icon: Building2,
    tags: ["New Cairo", "Fifth Settlement", "Mostakbal"],
    pages: 1,
    size: "3.9 MB",
  },
  {
    id: "mostakbal-hosny",
    title: "Mostakbal City Map by Eslam Hosny",
    subtitle: "Mostakbal City Layout Reference",
    description: "Detailed reference for Mostakbal City master plan, showing compound locations, plot sizes, and road network relative to Cairo Ring Road.",
    file: "/maps/Mostakbal City Map by Eslam Hosny.pdf",
    category: "Mostakbal City",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    borderColor: "border-rose-200 dark:border-rose-900/40",
    textColor: "text-rose-700 dark:text-rose-300",
    icon: LayoutGrid,
    tags: ["Mostakbal", "Master Plan", "East Cairo"],
    pages: 1,
    size: "3.0 MB",
  },
  {
    id: "west-hosny",
    title: "West Map by Eslam Hosny",
    subtitle: "West Cairo & October City Reference",
    description: "Full reference map for 6th of October City, Sheikh Zayed, and New Zayed compounds. Covers the western corridor from Ring Road to desert edge.",
    file: "/maps/West Map by Eslam Hosny.pdf",
    category: "West Cairo",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-900/40",
    textColor: "text-amber-700 dark:text-amber-300",
    icon: Building2,
    tags: ["October City", "Sheikh Zayed", "West Cairo"],
    pages: 1,
    size: "4.9 MB",
  },
];

const categories = ["All", "North Coast", "New Cairo", "Mostakbal City", "West Cairo"];

export default function MapsPage() {
  const [selectedMap, setSelectedMap] = useState<(typeof maps)[0] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [searchQ, setSearchQ] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const filtered = maps.filter((m) => {
    const matchCat = filterCat === "All" || m.category === filterCat;
    const q = searchQ.toLowerCase();
    const matchSearch = !q || m.title.toLowerCase().includes(q) || m.subtitle.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const openMap = useCallback((map: (typeof maps)[0]) => {
    setSelectedMap(map);
    setIsFullscreen(false);
  }, []);

  const closeMap = useCallback(() => {
    setSelectedMap(null);
    setIsFullscreen(false);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Map className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-primary">Maps Library</h1>
                <p className="text-sm text-muted-foreground">Agent reference maps &amp; area PDFs</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              {maps.length} maps available
            </span>
          </div>
        </div>

        {/* Search + Filter Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search maps..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            {searchQ && (
              <button onClick={() => setSearchQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  filterCat === cat
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:text-primary hover:border-accent/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-1.5 transition-all ${viewMode === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-primary"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-1.5 transition-all ${viewMode === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-primary"}`}
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid / List View */}
      {viewMode === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((map) => {
            const Icon = map.icon;
            return (
              <div
                key={map.id}
                className={`group relative overflow-hidden rounded-2xl border ${map.borderColor} bg-card shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
                onClick={() => openMap(map)}
              >
                {/* Gradient Header */}
                <div className={`relative h-36 bg-gradient-to-br ${map.color} overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/30" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-white/10 blur-xl" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-black/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {map.size}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20">
                      PDF
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className={`mb-1 text-[10px] font-bold uppercase tracking-wider ${map.textColor}`}>
                    {map.category}
                  </div>
                  <h3 className="font-display font-bold text-primary text-sm leading-snug mb-1 group-hover:text-accent transition-colors">
                    {map.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                    {map.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {map.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${map.bgColor} ${map.textColor}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openMap(map); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${map.color} px-3 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Map
                    </button>
                    <a
                      href={map.file}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center rounded-xl border border-border bg-secondary/40 p-2 text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={map.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center rounded-xl border border-border bg-secondary/40 p-2 text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((map) => {
            const Icon = map.icon;
            return (
              <div
                key={map.id}
                className={`group flex items-center gap-4 rounded-2xl border ${map.borderColor} bg-card p-4 shadow-soft hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5`}
                onClick={() => openMap(map)}
              >
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${map.color} shadow-sm`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${map.textColor} mb-0.5`}>{map.category}</div>
                  <h3 className="font-display font-bold text-primary text-sm group-hover:text-accent transition-colors">{map.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{map.subtitle}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{map.size}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); openMap(map); }}
                    className={`rounded-xl bg-gradient-to-r ${map.color} px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-90 flex items-center gap-1.5`}
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  <a
                    href={map.file}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-xl border border-border p-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/40">
            <Map className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-primary">No maps found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Fullscreen PDF Viewer Modal */}
      {selectedMap && (
        <div
          className={`fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md ${isFullscreen ? "" : "p-4 sm:p-8"}`}
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          {/* Viewer Toolbar */}
          <div className={`flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg ${isFullscreen ? "rounded-none border-x-0 border-t-0" : "mb-4"}`}>
            {/* Left: Map Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${selectedMap.color}`}>
                <selectedMap.icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-sm text-primary truncate">{selectedMap.title}</div>
                <div className="text-[11px] text-muted-foreground truncate">{selectedMap.subtitle}</div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={selectedMap.file}
                download
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </a>
              <a
                href={selectedMap.file}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open Tab
              </a>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="rounded-xl border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:text-primary transition-all"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={closeMap}
                className="rounded-xl border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:text-destructive transition-all"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* PDF Iframe */}
          <div className={`relative flex-1 overflow-hidden ${isFullscreen ? "" : "rounded-2xl border border-border shadow-xl"} bg-zinc-100 dark:bg-zinc-900`}>
            <iframe
              ref={iframeRef}
              src={`${selectedMap.file}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
              className="h-full w-full border-0"
              title={selectedMap.title}
            />
          </div>

          {/* Bottom: Tags row (only when not fullscreen) */}
          {!isFullscreen && (
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {selectedMap.tags.map((tag) => (
                  <span key={tag} className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${selectedMap.bgColor} ${selectedMap.textColor}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{selectedMap.size} · PDF</span>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
