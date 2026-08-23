import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useStore } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MapPin,
  Sparkles,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Building2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewLaunchesSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    skipSnaps: false,
  });

  const compoundsList = useStore((s) => s.compoundsList) || [];
  const sliderCompounds = compoundsList.filter((c) => c.isNewLaunch);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Auto-play timer (swiping every 4 seconds unless hovered)
  useEffect(() => {
    if (!emblaApi || isPaused) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [emblaApi, isPaused]);

  if (sliderCompounds.length === 0) return null;

  return (
    <section
      className="bg-gradient-to-b from-primary/5 via-card to-background py-14 sm:py-20 relative overflow-hidden border-y border-border/40"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Live Progress & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-3.5 py-1.5 text-xs font-bold text-accent shadow-soft backdrop-blur-md mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Exclusive Launches 2026
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Market <span className="text-accent">First Look</span>
            </h2>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-lg leading-relaxed">
              Explore upcoming flagship developments before general market release. Interactive auto-swiping deck.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/new-launches"
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-5 py-2.5 text-xs font-bold text-primary hover:border-accent hover:text-accent hover:bg-accent/5 shadow-sm transition-all"
            >
              <span>View All Launches</span>
              <ArrowRight className="h-3.5 w-3.5 text-accent" />
            </Link>

            {/* Navigation Arrow Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                aria-label="Previous Slide"
                className="h-10 w-10 rounded-full border-border/80 bg-card shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                aria-label="Next Slide"
                className="h-10 w-10 rounded-full border-border/80 bg-card shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Swiping Carousel Deck */}
        <div className="overflow-hidden py-4 -mx-4 px-4" ref={emblaRef}>
          <div className="flex -ml-4 touch-pan-y">
            {sliderCompounds.map((c, idx) => {
              const isActive = idx === selectedIndex;
              const hasImgError = failedImages[c.slug];
              const priceText = c.priceFrom > 0 ? `From EGP ${c.priceFrom}M` : "Price On Call";

              return (
                <div
                  key={c.slug}
                  className="min-w-0 shrink-0 grow-0 pl-4 sm:pl-6 basis-[88%] sm:basis-[55%] md:basis-[42%] lg:basis-[33.33%]"
                >
                  <Link
                    to="/projects/$slug"
                    params={{ slug: c.slug }}
                    className={`group relative block rounded-3xl bg-card border shadow-lg overflow-hidden transition-all duration-500 transform ${
                      isActive
                        ? "border-accent/80 scale-[1.02] shadow-2xl ring-2 ring-accent/30"
                        : "border-border/60 opacity-90 hover:opacity-100 hover:scale-[1.01]"
                    }`}
                  >
                    {/* Media Container */}
                    <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-secondary">
                      {hasImgError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-muted p-6 text-center select-none">
                          <ImageIcon className="h-10 w-10 text-muted-foreground/50 mb-2" />
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            {c.name}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={c.hero}
                          alt={c.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={() => setFailedImages((prev) => ({ ...prev, [c.slug]: true }))}
                        />
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      {/* Top Status & New Launch Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-accent-foreground shadow-md">
                          <TrendingUp className="h-3 w-3" /> New Launch
                        </span>
                        <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] font-bold text-white shadow-md">
                          {c.status}
                        </span>
                      </div>

                      {/* Bottom Info Overlay inside Image */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <div className="font-display text-xl font-extrabold truncate group-hover:text-accent transition-colors">
                          {c.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/80 font-medium mt-1 truncate">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-accent" /> {c.developer}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Details */}
                    <div className="p-4 sm:p-5 bg-card flex items-center justify-between border-t border-border/40">
                      <div>
                        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          Starting Price
                        </div>
                        <div className="font-display text-base sm:text-lg font-extrabold text-accent">
                          {priceText}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-end gap-1">
                          <Calendar className="h-3 w-3" /> Delivery
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-foreground">
                          {c.deliveryYear || 2028}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {sliderCompounds.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "w-8 bg-accent shadow-md"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
