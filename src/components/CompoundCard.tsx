import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Waves, Calendar, GitCompareArrows } from "lucide-react";
import { useStore } from "@/lib/store";
import { titleArea } from "@/lib/format";
import type { Compound } from "@/data/compounds";

export function CompoundCard({ c }: { c: Compound }) {
  const isFav = useStore((s) => s.favorites.includes(c.slug));
  const isCmp = useStore((s) => s.compareList.includes(c.slug));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const toggleCmp = useStore((s) => s.toggleCompare);

  return (
    <div className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <Link to="/projects/$slug" params={{ slug: c.slug }} className="relative block">
        <div className="aspect-[4/3] overflow-hidden bg-secondary">
          <img src={c.hero} alt={c.name} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="absolute left-3 top-3 flex gap-1.5">
          {c.beachfront && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sunset/95 px-2 py-0.5 text-[10px] font-semibold text-white">
              <Waves className="h-3 w-3" /> Beachfront
            </span>
          )}
          <span className="rounded-full bg-background/95 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {c.status}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to="/projects/$slug" params={{ slug: c.slug }}>
              <h3 className="truncate font-display text-lg font-semibold leading-tight text-primary">{c.name}</h3>
            </Link>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.developer}</p>
          </div>
          <div className="flex shrink-0 gap-1">
            <button onClick={() => toggleCmp(c.slug)} aria-label="Compare"
              className={`rounded-full border p-1.5 transition-colors ${isCmp ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-primary"}`}>
              <GitCompareArrows className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => toggleFav(c.slug)} aria-label="Favorite"
              className={`rounded-full border p-1.5 transition-colors ${isFav ? "border-sunset bg-sunset text-white" : "border-border text-muted-foreground hover:text-primary"}`}>
              <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {titleArea(c.area)}{c.km ? ` · km ${c.km}` : ""}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {c.deliveryYear}</span>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">From</span>
          <span className="font-display text-lg font-semibold text-primary">EGP {c.priceFrom}M</span>
        </div>
      </div>
    </div>
  );
}