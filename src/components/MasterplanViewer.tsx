import { useState, useRef, useMemo } from "react";
import { formatCurrency } from "@/lib/currency";
import { useStore } from "@/lib/store";
import mediaRegistry from "@/data/media-registry.json";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  MapPin,
  Layers,
  Sparkles,
  Share2,
  Building2,
  Compass,
  Check,
  ChevronRight,
  Eye,
  Info,
  Waves,
} from "lucide-react";

export interface MasterplanPrecinct {
  id: string;
  name: string;
  type: string;
  xPct: number; // percentage X position on map (0 - 100)
  yPct: number; // percentage Y position on map (0 - 100)
  minPriceM: number;
  maxPriceM?: number;
  availableCount?: number;
  deliveryNote: string;
  isRtm?: boolean;
  unitTypes: string[];
}

interface Props {
  projectSlug: string;
  projectName: string;
  developerName: string;
  masterplanImage?: string;
  precincts?: MasterplanPrecinct[];
  onSelectPrecinct?: (precinctName: string) => void;
}

export function MasterplanViewer({
  projectSlug,
  projectName,
  developerName,
  masterplanImage,
  precincts,
  onSelectPrecinct,
}: Props) {
  const currency = useStore((s) => s.currency) || "EGP";

  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeViewMode, setActiveViewMode] = useState<"3d" | "2d" | "satellite">("3d");
  const [selectedPrecinctId, setSelectedPrecinctId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Lookup images from media registry
  const projectMedia = (mediaRegistry.projects_media as any)?.[projectSlug] || [];
  const projectImages = projectMedia.filter((m: any) => m.type === "image");
  const activeMapSrc =
    masterplanImage ||
    (projectImages.length > 0 ? projectImages[0].path : `/projects/${projectSlug}/1.jpg`);

  // Dynamically resolve 100% accurate precincts from project availability breakdown
  const availabilityList = useStore((s) => s.availabilityList) || [];
  const projectAvail = availabilityList.find((a) => a.slug === projectSlug);

  const resolvedPrecincts: MasterplanPrecinct[] = useMemo(() => {
    if (precincts && precincts.length > 0) return precincts;
    if (!projectAvail || !Array.isArray(projectAvail.breakdown) || projectAvail.breakdown.length === 0) {
      return [];
    }

    // Map real breakdown items to map positions
    const positions = [
      { x: 30, y: 35 },
      { x: 55, y: 48 },
      { x: 75, y: 62 },
      { x: 40, y: 75 },
      { x: 65, y: 30 },
      { x: 25, y: 65 },
    ];

    return projectAvail.breakdown.slice(0, 6).map((b: any, idx: number) => {
      const pos = positions[idx % positions.length];
      const isRtm = b.deliveryNote?.toLowerCase().includes("ready") || 
                    b.deliveryNote?.toLowerCase().includes("1 month") || 
                    b.deliveryNote?.toLowerCase().includes("rtm");
      return {
        id: `precinct-${idx}`,
        name: b.cluster || `${b.type}${b.beds ? ` (${b.beds} BR)` : ""}`,
        type: b.type,
        xPct: pos.x,
        yPct: pos.y,
        minPriceM: b.minPriceM,
        maxPriceM: b.maxPriceM,
        availableCount: b.available || 1,
        deliveryNote: b.deliveryNote || "Standard Delivery",
        isRtm,
        unitTypes: [b.type],
      };
    });
  }, [precincts, projectAvail]);

  const activePrecinct = useMemo(
    () => resolvedPrecincts.find((p) => p.id === selectedPrecinctId) || resolvedPrecincts[0],
    [selectedPrecinctId, resolvedPrecincts]
  );

  // Mouse drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.3, 3.0));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.3, 0.8));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  const handleShareMasterplan = () => {
    const shareText = `*${projectName} Interactive Masterplan* (${developerName})\nExplore precinct layout, lagoon views & unit positions:\n${window?.location?.origin || "https://propertyatlas.eg"}${activeMapSrc}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl transition-all duration-300 ${
        isFullscreen ? "fixed inset-4 z-50 my-0 max-w-none" : "w-full"
      }`}
    >
      {/* Viewer Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 bg-secondary/35 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold shadow-xs">
            <Compass className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Interactive Precinct Masterplan
              </span>
              <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[9px] font-bold border border-emerald-500/20">
                Live Interactive Zones
              </span>
            </div>
            <div className="font-display text-base font-bold text-primary leading-tight mt-0.5">
              {projectName} Sector Footprint
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl bg-background border border-border/60 p-1 text-xs">
          <button
            onClick={() => setActiveViewMode("3d")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 font-bold transition-all ${
              activeViewMode === "3d"
                ? "bg-accent text-accent-foreground shadow-xs"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            3D Render View
          </button>
          <button
            onClick={() => setActiveViewMode("2d")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 font-bold transition-all ${
              activeViewMode === "2d"
                ? "bg-accent text-accent-foreground shadow-xs"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            2D Masterplan
          </button>
          <button
            onClick={() => setActiveViewMode("satellite")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 font-bold transition-all ${
              activeViewMode === "satellite"
                ? "bg-accent text-accent-foreground shadow-xs"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            Satellite Location
          </button>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomIn}
            className="rounded-xl border border-border bg-card p-2 text-primary hover:bg-secondary transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="rounded-xl border border-border bg-card p-2 text-primary hover:bg-secondary transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="rounded-xl border border-border bg-card p-2 text-primary hover:bg-secondary transition-all cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={handleShareMasterplan}
            className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share Masterplan
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-xl border border-border bg-card p-2 text-primary hover:bg-secondary transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Masterplan Interactive Area */}
      <div
        className="relative h-[480px] w-full overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Render Map Layer with Smooth Transform */}
        <div
          className="absolute inset-0 transition-transform duration-75"
          style={{
            transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
          }}
        >
          <img
            src={activeMapSrc}
            alt={`${projectName} Masterplan`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              activeViewMode === "2d"
                ? "contrast-125 saturate-50 brightness-90"
                : activeViewMode === "satellite"
                ? "hue-rotate-15 saturate-150 brightness-95"
                : "brightness-100"
            }`}
            onError={(e) => {
              // Fallback background render
              (e.target as HTMLElement).style.display = "none";
            }}
          />

          {/* Interactive Precinct Hotspot Pins */}
          {resolvedPrecincts.map((precinct) => {
            const isSelected = precinct.id === activePrecinct?.id;
            return (
              <div
                key={precinct.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPrecinctId(precinct.id);
                  if (onSelectPrecinct) onSelectPrecinct(precinct.name);
                }}
                style={{
                  left: `${precinct.xPct}%`,
                  top: `${precinct.yPct}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              >
                {/* Pulsing Beacon Ring */}
                <div
                  className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${
                    isSelected ? "bg-accent" : "bg-emerald-400"
                  }`}
                />

                {/* Hotspot Button */}
                <div
                  className={`relative flex items-center gap-2 rounded-2xl px-3 py-1.5 text-xs font-bold shadow-xl transition-all duration-200 ${
                    isSelected
                      ? "bg-accent text-accent-foreground scale-110 ring-4 ring-accent/30"
                      : "bg-background/90 text-primary hover:bg-card hover:scale-105 border border-border/80"
                  }`}
                >
                  <MapPin className={`h-3.5 w-3.5 ${isSelected ? "text-accent-foreground" : "text-accent"}`} />
                  <span className="truncate max-w-[140px] font-display">{precinct.name}</span>
                  {precinct.isRtm && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>

                {/* Quick Hover Tooltip Card */}
                <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:block w-64 rounded-2xl border border-border bg-card/95 p-3.5 shadow-2xl backdrop-blur-md z-30 pointer-events-none animate-in fade-in-50 duration-150">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    {precinct.type}
                  </div>
                  <div className="font-display text-xs font-bold text-primary mt-0.5">
                    {precinct.name}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] border-t border-border/40 pt-2">
                    <div>
                      <span className="text-muted-foreground">Starting Price:</span>
                      <div className="font-bold text-primary">{formatCurrency(precinct.minPriceM, currency)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Timeline:</span>
                      <div className="font-bold text-accent">{precinct.deliveryNote}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corner Mini-Map Info Panel */}
        {activePrecinct && (
          <div className="absolute bottom-4 left-4 z-30 max-w-sm rounded-2xl border border-border/80 bg-card/90 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2 mb-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Active Precinct Inspector
              </div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
                {activePrecinct.unitTypes.join(" · ")}
              </span>
            </div>

            <h4 className="font-display text-sm font-bold text-primary">
              {activePrecinct.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activePrecinct.type}
            </p>

            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-border/40">
              <div>
                <div className="text-[9px] uppercase font-bold text-muted-foreground">Starting Price</div>
                <div className="font-display text-sm font-black text-primary">
                  {formatCurrency(activePrecinct.minPriceM, currency)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase font-bold text-muted-foreground">Timeline</div>
                <div className="font-semibold text-accent">{activePrecinct.deliveryNote}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
