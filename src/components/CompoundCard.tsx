import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Waves, Calendar, GitCompareArrows, Building2, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { destinationBySlug } from "@/data/destinations";
import type { Compound } from "@/data/compounds";

interface CompoundCardProps {
  c: Compound;
  viewMode?: "grid" | "list";
}

export function CompoundCard({ c, viewMode = "grid" }: CompoundCardProps) {
  const isFav = useStore((s) => s.favorites.includes(c.slug));
  const isCmp = useStore((s) => s.compareList.includes(c.slug));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const toggleCmp = useStore((s) => s.toggleCompare);

  const destName = destinationBySlug(c.destination)?.name ?? c.destination;

  if (viewMode === "list") {
    return (
      <div className={`group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-md hover:border-accent/40 ${
        c.flagship 
          ? "border-amber-400/50 shadow-md shadow-amber-500/5 dark:shadow-amber-950/10" 
          : "border-border/60 shadow-xs"
      }`}>
        {/* Left Side: Image */}
        <Link to="/projects/$slug" params={{ slug: c.slug }} className="relative block shrink-0 w-full sm:w-48 md:w-56 lg:w-64 aspect-[4/3] sm:aspect-square md:aspect-[4/3] overflow-hidden bg-secondary">
          <img src={c.hero} alt={c.name} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          
          <div className="absolute left-3 top-3 flex flex-wrap gap-1">
            {c.flagship && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs uppercase tracking-wider">
                <Sparkles className="h-2.5 w-2.5 fill-current" /> Flagship
              </span>
            )}
            {c.beachfront && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sunset/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-white">
                <Waves className="h-2.5 w-2.5" /> Beachfront
              </span>
            )}
            <span className="rounded-full bg-black/45 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] font-semibold text-white">
              {c.status}
            </span>
          </div>

          {c.km !== undefined && (
            <div className="absolute right-3 top-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 backdrop-blur px-2.5 py-0.5 text-[9px] font-bold text-white shadow-sm border border-white/20">
                <MapPin className="h-2.5 w-2.5 text-accent" /> Km {c.km}
              </span>
            </div>
          )}
        </Link>

        {/* Right Side: Content */}
        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link to="/projects/$slug" params={{ slug: c.slug }}>
                    <h3 className="font-display text-lg md:text-xl font-bold leading-tight text-primary hover:text-accent transition-colors truncate">
                      {c.name}
                    </h3>
                  </Link>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="font-medium truncate">{c.developer}</span>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex shrink-0 gap-1.5">
                <button onClick={() => toggleCmp(c.slug)} aria-label="Compare"
                  className={`rounded-full border p-2 transition-all hover:scale-105 active:scale-95 ${
                    isCmp ? "border-accent bg-accent text-accent-foreground shadow-xs" : "border-border text-muted-foreground bg-card hover:text-primary hover:border-muted-foreground/40"
                  }`}>
                  <GitCompareArrows className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => toggleFav(c.slug)} aria-label="Favorite"
                  className={`rounded-full border p-2 transition-all hover:scale-105 active:scale-95 ${
                    isFav ? "border-sunset bg-sunset text-white shadow-xs" : "border-border text-muted-foreground bg-card hover:text-primary hover:border-muted-foreground/40"
                  }`}>
                  <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            <p className="mt-2 text-xs md:text-sm text-muted-foreground line-clamp-2">
              {c.blurb}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-accent" /> 
                {destName}
                {c.km ? ` · km ${c.km}` : ""}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> 
                Delivery {c.deliveryYear}
              </span>
            </div>

            {/* Type Tags */}
            <div className="flex flex-wrap gap-1">
              {(c.types ?? []).slice(0, 3).map((t) => (
                <span key={t} className="rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground border border-border/30">
                  {t}
                </span>
              ))}
              {(c.types ?? []).length > 3 && (
                <span className="rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground border border-border/30">
                  +{(c.types ?? []).length - 3}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Starting from</span>
              <span className="font-display text-lg font-bold text-primary">
                {c.priceFrom > 0 ? `EGP ${c.priceFrom}M` : "Price on Request"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (enhanced)
  return (
    <div className={`group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
      c.flagship 
        ? "border-amber-400/50 shadow-md shadow-amber-500/5 dark:shadow-amber-950/10" 
        : "border-border/60 shadow-soft"
    }`}>
      <Link to="/projects/$slug" params={{ slug: c.slug }} className="relative block overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-secondary">
          <img src={c.hero} alt={c.name} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108" />
        </div>
        
        {/* Modern high-contrast glass badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1 max-w-[80%]">
          {c.flagship && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-2.5 py-0.5 text-[9px] font-bold text-white shadow-md uppercase tracking-wider border border-amber-300/20">
              <Sparkles className="h-2.5 w-2.5 fill-current animate-pulse" /> Flagship
            </span>
          )}
          {c.beachfront && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sunset/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-white shadow-xs">
              <Waves className="h-2.5 w-2.5" /> Beachfront
            </span>
          )}
          <span className="rounded-full bg-black/45 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] font-semibold text-white shadow-xs">
            {c.status}
          </span>
        </div>

        {c.km !== undefined && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 backdrop-blur px-2.5 py-0.5 text-[9px] font-bold text-white shadow-sm border border-white/20">
              <MapPin className="h-2.5 w-2.5 text-accent" /> Km {c.km}
            </span>
          </div>
        )}

        {/* Dynamic backdrop shadow behind image content */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Link>

      <div className="p-4 flex flex-col justify-between h-[calc(100%-aspect-[4/3])] min-h-[170px]">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Link to="/projects/$slug" params={{ slug: c.slug }}>
                <h3 className="truncate font-display text-base md:text-lg font-bold leading-tight text-primary group-hover:text-accent transition-colors" title={c.name}>
                  {c.name}
                </h3>
              </Link>
              <p className="mt-0.5 truncate text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3 shrink-0" />
                <span>{c.developer}</span>
              </p>
            </div>
            
            {/* Action buttons with nice micro-hover */}
            <div className="flex shrink-0 gap-1">
              <button onClick={() => toggleCmp(c.slug)} aria-label="Compare"
                className={`rounded-full border p-1.5 transition-all hover:scale-105 active:scale-95 ${
                  isCmp ? "border-accent bg-accent text-accent-foreground shadow-xs" : "border-border text-muted-foreground bg-card hover:text-primary hover:border-muted-foreground/40"
                }`}>
                <GitCompareArrows className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => toggleFav(c.slug)} aria-label="Favorite"
                className={`rounded-full border p-1.5 transition-all hover:scale-105 active:scale-95 ${
                  isFav ? "border-sunset bg-sunset text-white shadow-xs" : "border-border text-muted-foreground bg-card hover:text-primary hover:border-muted-foreground/40"
                }`}>
                <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* Unit Type Tags */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {(c.types ?? []).slice(0, 3).map((t) => (
              <span key={t} className="rounded bg-secondary/80 px-1.5 py-0.5 text-[9px] font-medium text-secondary-foreground border border-border/30">
                {t}
              </span>
            ))}
            {(c.types ?? []).length > 3 && (
              <span className="rounded bg-secondary/80 px-1.5 py-0.5 text-[9px] font-medium text-secondary-foreground border border-border/30 text-accent font-semibold">
                +{(c.types ?? []).length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
            <span className="inline-flex items-center gap-1 truncate max-w-[65%]">
              <MapPin className="h-3 w-3 shrink-0 text-accent" /> 
              <span className="truncate">{destName}</span>
            </span>
            <span className="inline-flex items-center gap-1 shrink-0">
              <Calendar className="h-3 w-3 shrink-0" /> 
              <span>{c.deliveryYear}</span>
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">From</span>
            <span className="font-display text-base font-bold text-primary">
              {c.priceFrom > 0 ? `EGP ${c.priceFrom}M` : "Price on Request"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}