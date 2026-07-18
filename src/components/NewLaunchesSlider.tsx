import React, { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useStore } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewLaunchesSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });
  const compoundsList = useStore((s) => s.compoundsList) || [];
  const sliderCompounds = compoundsList.filter(c => c.isNewLaunch);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (sliderCompounds.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-card to-background py-16 relative overflow-hidden border-y border-border/40">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 mb-3 text-xs font-medium text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Exclusive Launches 2026
            </div>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground">
              Market <span className="text-accent">First Look</span>
            </h2>
            <p className="mt-2 text-muted-foreground text-sm max-w-md">
              Discover the latest exclusive real estate launches across Egypt. Reserve your spot before the general market.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/new-launches" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-primary hover:border-accent hover:text-accent hover:bg-accent/5 transition-all">
              View All Launches <ArrowRight className="h-3.5 w-3.5 text-accent" />
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full border-border/60 bg-card hover:bg-accent/10 hover:text-accent">
                <ArrowRight className="h-4 w-4 rotate-180" />
              </Button>
              <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full border-border/60 bg-card hover:bg-accent/10 hover:text-accent">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 touch-pan-y">
            {sliderCompounds.map((c) => {
              const parent = c.parentSlug ? compoundsList.find(p => p.slug === c.parentSlug) : null;
              const hasImgError = failedImages[c.slug];
              return (
                <div key={c.slug} className="min-w-0 shrink-0 grow-0 pl-4 basis-[85%] sm:basis-[45%] md:basis-[35%] lg:basis-[28%]">
                  <Link to="/projects/$slug" params={{ slug: c.slug }} className="group block relative rounded-2xl bg-card border border-border/40 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                      {hasImgError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary/80 p-4 text-center select-none">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/60 mb-2" />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">No image uploaded</span>
                          <span className="text-[9px] text-muted-foreground/80 mt-0.5">Edit in admin dashboard</span>
                        </div>
                      ) : (
                        <img 
                          src={c.hero} 
                          alt={c.name} 
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          loading="lazy" 
                          onError={() => setFailedImages(prev => ({ ...prev, [c.slug]: true }))}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white border border-white/10">
                          {c.status}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <div className="text-white font-display text-lg font-bold truncate">{c.name}</div>
                        <div className="text-white/80 text-xs font-medium truncate flex items-center gap-1.5 mt-1">
                          <MapPin className="h-3 w-3" /> {c.destination.replace(/-/g, " ")}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {parent ? (
                          <div className="mb-2">
                            <span className="inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-2 py-0.5 text-[9px] font-bold text-accent">
                              Phase of {parent.name}
                            </span>
                          </div>
                        ) : (
                          <div className="mb-2">
                            <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary">
                              Primary Launch
                            </span>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Developer</div>
                        <div className="text-sm font-medium text-foreground">{c.developer}</div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Starting from</div>
                          <div className="text-accent font-semibold">{c.priceFrom}M EGP</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Delivery</div>
                          <div className="text-sm font-semibold flex items-center justify-end gap-1"><Calendar className="h-3 w-3 text-muted-foreground" /> {c.deliveryYear}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
