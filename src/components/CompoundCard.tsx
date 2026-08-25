import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Waves, Calendar, GitCompareArrows } from "lucide-react";
import { useStore } from "@/lib/store";
import { destinationBySlug } from "@/data/destinations";
import { developers } from "@/data/developers";
import type { Compound } from "@/data/compounds";
import { isReadyToMove, hasRTMUnits, hasOffPlanUnits } from "@/lib/delivery";

export function CompoundCard({ c }: { c: Compound }) {
  const isFav = useStore((s) => s.favorites.includes(c.slug));
  const isCmp = useStore((s) => s.compareList.includes(c.slug));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const toggleCmp = useStore((s) => s.toggleCompare);
  const availabilityList = useStore((s) => s.availabilityList);

  const developerInfo = developers.find((d) => d.slug === c.developerSlug);
  const avail = availabilityList.find((a) => a.slug === c.slug);
  const hasRtm = hasRTMUnits(c, avail);
  const hasOffPlan = hasOffPlanUnits(c, avail);

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 bg-gradient-to-b from-card to-background/5">
      <Link to="/projects/$slug" params={{ slug: c.slug }} className="relative block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
          <img
            src={c.hero}
            alt={c.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Gradient Overlay for badge readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-300" />

          {/* Floating Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
            {c.beachfront && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sunset/90 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-2xs">
                <Waves className="h-2.5 w-2.5" /> Beachfront
              </span>
            )}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-2xs border ${
                hasRtm && hasOffPlan
                  ? "bg-gradient-to-r from-emerald-500/90 to-blue-600/90 text-white border-emerald-400/20"
                  : hasRtm
                  ? "bg-emerald-500/90 text-white border-emerald-400/20"
                  : "bg-primary/95 text-white border-primary-foreground/15"
              }`}
            >
              {hasRtm && hasOffPlan
                ? "RTM & Off-Plan"
                : hasRtm
                ? "Ready to Move"
                : "Off-Plan"}
            </span>
          </div>

          {c.km !== undefined && (
            <div className="absolute right-3 top-3 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-bold text-white shadow-sm border border-white/10 tracking-wider">
                <MapPin className="h-2.5 w-2.5 text-accent" /> KM {c.km}
              </span>
            </div>
          )}

          {/* Floating Developer Logo */}
          {developerInfo?.logo && (
            <div className="absolute bottom-3 right-3 h-9 w-9 rounded-xl bg-white/95 p-1.5 shadow-md border border-border/40 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 backdrop-blur-xs z-10">
              <img
                src={developerInfo.logo}
                alt={developerInfo.name}
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link to="/projects/$slug" params={{ slug: c.slug }}>
              <h3 className="font-display text-lg font-bold leading-tight text-primary truncate hover:text-accent transition-colors duration-200">
                {c.name}
              </h3>
            </Link>
            <p className="mt-1 text-[10px] font-bold text-muted-foreground/75 tracking-wider uppercase truncate">
              {c.developer}
            </p>
          </div>

          {/* Compare & Favorite Buttons */}
          <div className="flex shrink-0 gap-1.5">
            <button
              onClick={() => toggleCmp(c.slug)}
              aria-label="Compare"
              className={`rounded-full border p-2 transition-all duration-200 cursor-pointer ${
                isCmp
                  ? "border-accent bg-accent text-accent-foreground shadow-2xs"
                  : "border-border/80 text-muted-foreground hover:bg-secondary/50 hover:text-primary"
              }`}
            >
              <GitCompareArrows className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => toggleFav(c.slug)}
              aria-label="Favorite"
              className={`rounded-full border p-2 transition-all duration-200 cursor-pointer ${
                isFav
                  ? "border-sunset bg-sunset text-white shadow-2xs"
                  : "border-border/80 text-muted-foreground hover:bg-secondary/50 hover:text-primary"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Location & Year details */}
        <div className="mt-4 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-semibold text-muted-foreground/75">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground/50" />
            {destinationBySlug(c.destination)?.name ?? c.destination}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
            {c.deliveryYear === new Date().getFullYear()
              ? "Ready Now"
              : `Delivery ${c.deliveryYear}`}
          </span>
        </div>

        {/* Card Footer pricing & details CTA */}
        <div className="mt-6 flex items-end justify-between border-t border-border/40 pt-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Starting From
            </span>
            <span className="font-display text-lg font-bold text-primary tracking-tight">
              {c.priceFrom > 0 ? `EGP ${c.priceFrom}M` : "Price on Request"}
            </span>
          </div>
          <Link
            to="/projects/$slug"
            params={{ slug: c.slug }}
            className="inline-flex items-center gap-1 rounded-xl bg-accent/10 hover:bg-accent px-4 py-2 text-xs font-bold text-accent hover:text-white transition-all duration-200"
          >
            Details{" "}
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
