import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Waves, Calendar, GitCompareArrows, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { destinationBySlug } from "@/data/destinations";
import type { Compound } from "@/data/compounds";

export function CompoundCard({ c }: { c: Compound }) {
  const isFav = useStore((s) => s.favorites.includes(c.slug));
  const isCmp = useStore((s) => s.compareList.includes(c.slug));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const toggleCmp = useStore((s) => s.toggleCompare);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-accent/30 flex flex-col">
      {/* Image Hero */}
      <Link to="/projects/$slug" params={{ slug: c.slug }} className="relative block overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-secondary">
          <img
            src={c.hero}
            alt={c.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />
        </div>

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex gap-1.5 z-10">
          {c.beachfront && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm border border-white/10">
              <Waves className="h-3 w-3" /> Beachfront
            </span>
          )}
          <span className={`rounded-full backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold shadow-sm border ${
            c.status === "Off-Plan"
              ? "bg-amber-500/80 text-white border-amber-400/20"
              : c.status === "Under Construction"
              ? "bg-blue-500/80 text-white border-blue-400/20"
              : "bg-emerald-500/80 text-white border-emerald-400/20"
          }`}>
            {c.status}
          </span>
        </div>

        {/* Action buttons overlay */}
        <div className="absolute right-3 top-3 flex gap-1.5 z-10">
          <button
            onClick={(e) => { e.preventDefault(); toggleCmp(c.slug); }}
            aria-label="Compare"
            className={`rounded-full backdrop-blur-md border p-1.5 transition-all hover:scale-110 shadow-sm ${
              isCmp
                ? "border-accent/60 bg-accent text-accent-foreground"
                : "border-white/20 bg-black/30 text-white hover:bg-accent/80"
            }`}
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); toggleFav(c.slug); }}
            aria-label="Favorite"
            className={`rounded-full backdrop-blur-md border p-1.5 transition-all hover:scale-110 shadow-sm ${
              isFav
                ? "border-rose-400/60 bg-rose-500 text-white"
                : "border-white/20 bg-black/30 text-white hover:bg-rose-500/80"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Bottom text on image */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <div className="font-display text-base font-bold text-white truncate drop-shadow-sm">{c.name}</div>
          <div className="text-white/75 text-[11px] font-medium truncate mt-0.5">{c.developer}</div>
        </div>
      </Link>

      {/* Info section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span className="inline-flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 flex-shrink-0 text-accent" />
            <span className="truncate">{destinationBySlug(c.destination)?.name ?? c.destination}{c.km ? ` · km ${c.km}` : ""}</span>
          </span>
          <span className="inline-flex items-center gap-1 flex-shrink-0">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            {c.deliveryYear}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">From</span>
            <span className="font-display text-base font-bold text-primary">EGP {c.priceFrom}M</span>
          </div>
          <Link
            to="/projects/$slug"
            params={{ slug: c.slug }}
            className="rounded-lg bg-accent/10 border border-accent/20 hover:bg-accent hover:text-accent-foreground px-3 py-1.5 text-[10px] font-bold text-accent transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}