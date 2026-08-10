import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Waves, Calendar, GitCompareArrows, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { destinationBySlug } from "@/data/destinations";
import type { Compound } from "@/data/compounds";

interface CompoundListRowProps {
  c: Compound;
  onLocate?: () => void;
  isMapActive?: boolean;
}

export function CompoundListRow({ c, onLocate, isMapActive }: CompoundListRowProps) {
  const isFav = useStore((s) => s.favorites.includes(c.slug));
  const isCmp = useStore((s) => s.compareList.includes(c.slug));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const toggleCmp = useStore((s) => s.toggleCompare);

  const destinationName = destinationBySlug(c.destination)?.name ?? c.destination;

  return (
    <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-border/50 bg-card rounded-2xl shadow-soft hover:shadow-md hover:border-accent/30 transition-all duration-300">
      {/* Thumbnail + Title details */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Link to="/projects/$slug" params={{ slug: c.slug }} className="relative shrink-0 block overflow-hidden rounded-xl bg-secondary w-20 h-20 sm:w-24 sm:h-18">
          <img src={c.hero} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute left-1.5 top-1.5 flex gap-1">
            {c.beachfront && (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sunset text-white shadow-sm" title="Beachfront">
                <Waves className="h-2.5 w-2.5" />
              </span>
            )}
          </div>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/projects/$slug" params={{ slug: c.slug }}>
              <h3 className="font-display text-base font-semibold leading-tight text-primary hover:text-accent transition-colors truncate">{c.name}</h3>
            </Link>
            <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[9px] font-semibold text-primary">
              {c.status}
            </span>
            {c.flagship && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-semibold text-accent">
                ★ Flagship
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground truncate">{c.developer}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 text-accent" />
              {destinationName} {c.km ? `· km ${c.km}` : ""}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {c.deliveryYear}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing and Actions */}
      <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto border-t sm:border-t-0 border-border/30 pt-3 sm:pt-0 shrink-0">
        <div className="flex flex-col sm:items-end">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Starting from</span>
          <span className="font-display text-base sm:text-lg font-semibold text-primary">
            {c.priceFrom > 0 ? `EGP ${c.priceFrom}M` : "Price on Request"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
          {isMapActive && onLocate && (
            <button onClick={onLocate} aria-label="Locate on Map" className="rounded-full border border-border p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary/40 transition-colors" title="Locate on map">
              <MapPin className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={() => toggleCmp(c.slug)} aria-label="Compare" className={`rounded-full border p-1.5 transition-colors ${isCmp ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-primary hover:bg-secondary/40"}`} title="Compare">
            <GitCompareArrows className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => toggleFav(c.slug)} aria-label="Favorite" className={`rounded-full border p-1.5 transition-colors ${isFav ? "border-sunset bg-sunset text-white" : "border-border text-muted-foreground hover:text-primary hover:bg-secondary/40"}`} title="Favorite">
            <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} title="Favorite" />
          </button>
          <Link to="/projects/$slug" params={{ slug: c.slug }}>
            <button className="rounded-full border border-border p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary/40 transition-colors" title="View details">
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
