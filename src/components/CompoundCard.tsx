import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Waves, Calendar, GitCompareArrows } from "lucide-react";
import { useStore } from "@/lib/store";
import { destinationBySlug } from "@/data/destinations";
import type { Compound } from "@/data/compounds";

export function CompoundCard({ c }: { c: Compound }) {
  const isFav = useStore((s) => s.favorites.includes(c.slug));
  const isCmp = useStore((s) => s.compareList.includes(c.slug));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const toggleCmp = useStore((s) => s.toggleCompare);

  const destinationName = destinationBySlug(c.destination)?.name ?? c.destination;

  return (
    <div 
      id={`compound-card-${c.slug}`}
      className="group overflow-hidden rounded-2xl border border-border/50 bg-card shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <Link to="/projects/$slug" params={{ slug: c.slug }} className="relative block">
        <div className="aspect-[4/3] overflow-hidden bg-secondary">
          <img 
            src={c.hero} 
            alt={c.name} 
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>
        
        {/* Top left badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 max-w-[70%]">
          {c.beachfront && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sunset/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
              <Waves className="h-3 w-3" /> Beachfront
            </span>
          )}
          <span className="rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-primary shadow-sm border border-border/20">
            {c.status}
          </span>
          {c.flagship && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm border border-amber-400/20">
              ★ Flagship
            </span>
          )}
        </div>

        {/* Top right Sahel marker */}
        {c.km !== undefined && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/80 backdrop-blur px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm border border-white/15">
              <MapPin className="h-2.5 w-2.5 text-accent" /> Km {c.km}
            </span>
          </div>
        )}
      </Link>

      <div className="p-4">
        {/* Title & Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link to="/projects/$slug" params={{ slug: c.slug }}>
              <h3 className="truncate font-display text-lg font-semibold leading-tight text-primary hover:text-accent transition-colors">
                {c.name}
              </h3>
            </Link>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.developer}</p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <button 
              onClick={() => toggleCmp(c.slug)} 
              aria-label="Compare"
              className={`rounded-full border p-1.5 transition-colors ${
                isCmp 
                  ? "border-accent bg-accent text-accent-foreground shadow-sm" 
                  : "border-border text-muted-foreground hover:text-primary hover:bg-secondary/40"
              }`}
            >
              <GitCompareArrows className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => toggleFav(c.slug)} 
              aria-label="Favorite"
              className={`rounded-full border p-1.5 transition-colors ${
                isFav 
                  ? "border-sunset bg-sunset text-white shadow-sm" 
                  : "border-border text-muted-foreground hover:text-primary hover:bg-secondary/40"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 text-accent" /> 
            {destinationName} {c.km ? ` · km ${c.km}` : ""}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> 
            {c.deliveryYear}
          </span>
        </div>

        {/* Starting Price */}
        <div className="mt-4 flex items-baseline gap-1.5 border-t border-border/30 pt-3">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Starting from</span>
          <span className="font-display text-lg font-semibold text-primary">
            {c.priceFrom > 0 ? `EGP ${c.priceFrom}M` : "Price on Request"}
          </span>
        </div>
      </div>
    </div>
  );
}