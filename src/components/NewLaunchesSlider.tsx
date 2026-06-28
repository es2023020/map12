import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { compounds } from "@/data/compounds";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const newProjectSlugs = [
  "creekview", "elea-azha-north", "aqua-lagoons-june", "sadaf", 
  "commonhaus", "the-lynks", "park-sight", "silvertown-lagoon-cabanas", 
  "marresidence", "chapters-residence", "vea-new-cairo", "vie-collective", 
  "vie-halo", "coral-coves", "menorca", "the-commons", "covaya", 
  "olive-oasis", "sealine-seashore",
  "hacienda-ras-el-hekma", "direction-white", "hap-town", "seazen"
];

export function NewLaunchesSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });
  const sliderCompounds = compounds.filter(c => newProjectSlugs.includes(c.slug));

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
              <Sparkles className="h-3.5 w-3.5" /> New Launches 2026
            </div>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground">
              Market <span className="text-accent">First Look</span>
            </h2>
            <p className="mt-2 text-muted-foreground text-sm max-w-md">
              Discover the latest exclusive real estate launches across Egypt. Reserve your spot before the general market.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full border-border/60 bg-card hover:bg-accent/10 hover:text-accent">
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full border-border/60 bg-card hover:bg-accent/10 hover:text-accent">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 touch-pan-y">
            {sliderCompounds.map((c) => (
              <div key={c.slug} className="min-w-0 shrink-0 grow-0 pl-4 basis-[85%] sm:basis-[45%] md:basis-[35%] lg:basis-[28%]">
                <Link to="/projects/$slug" params={{ slug: c.slug }} className="group block relative rounded-2xl bg-card border border-border/40 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img src={c.hero} alt={c.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white border border-white/10">
                        {c.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-white font-display text-xl font-bold truncate">{c.name}</div>
                      <div className="text-white/80 text-xs font-medium truncate flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3 w-3" /> {c.destination.replace(/-/g, " ")}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
