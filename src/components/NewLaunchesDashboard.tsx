import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { compounds } from "@/data/compounds";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, Search } from "lucide-react";

const newProjectSlugs = [
  "creekview", "elea-azha-north", "aqua-lagoons-june", "sadaf", 
  "commonhaus", "the-lynks", "park-sight", "silvertown-lagoon-cabanas", 
  "marresidence", "chapters-residence", "vea-new-cairo", "vie-collective", 
  "vie-halo", "coral-coves", "menorca", "the-commons", "covaya", 
  "olive-oasis", "sealine-seashore",
  "hacienda-ras-el-hekma", "direction-white", "hap-town", "seazen"
];

export function NewLaunchesDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState<string>("All");

  const dashboardCompounds = compounds.filter(c => newProjectSlugs.includes(c.slug));

  const filtered = dashboardCompounds.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.developer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDest = selectedDest === "All" || c.destination === selectedDest;
    return matchesSearch && matchesDest;
  });

  const uniqueDestinations = ["All", ...Array.from(new Set(dashboardCompounds.map(c => c.destination)))];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="fixed bottom-6 right-6 z-50 group cursor-pointer">
          <div className="absolute -inset-2 bg-gradient-to-r from-accent via-primary to-accent rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <Button size="lg" className="relative rounded-full h-14 px-6 bg-card text-foreground border border-accent/30 shadow-2xl hover:bg-card hover:scale-105 transition-all">
            <Sparkles className="h-5 w-5 text-accent mr-2" />
            <span className="font-semibold">New Launches 2026</span>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent animate-ping" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent" />
          </Button>
        </div>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto p-0 border-l border-border/40 bg-card shadow-2xl z-[100]">
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border/40 p-6 pt-10">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center gap-2 text-2xl font-display font-semibold">
              <Sparkles className="h-6 w-6 text-accent" />
              New Launches
            </SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Explore the latest 2026 pre-market and off-plan properties.
            </p>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search projects or developers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-full border border-border/60 bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {uniqueDestinations.map(dest => (
                <button
                  key={dest}
                  onClick={() => setSelectedDest(dest)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedDest === dest 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {dest === "All" ? "All Regions" : dest.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No projects found matching your criteria.
            </div>
          ) : (
            filtered.map((c) => (
              <Link key={c.slug} to="/projects/$slug" params={{ slug: c.slug }} className="group block bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-accent/40 transition-all hover:shadow-lg">
                <div className="flex flex-row h-[120px]">
                  <div className="w-1/3 h-full relative overflow-hidden">
                    <img src={c.hero} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground leading-tight truncate pr-2">{c.name}</h3>
                        <span className="text-[10px] uppercase font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
                          {c.priceFrom}M
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {c.destination.replace(/-/g, " ")}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                      <div className="text-xs font-medium text-foreground truncate">{c.developer}</div>
                      <div className="text-[10px] text-muted-foreground shrink-0">{c.deliveryYear}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
