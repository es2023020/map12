import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, MapPin, Building2, ArrowRight } from "lucide-react";
import { destinations } from "@/data/destinations";
import { Button } from "@/components/ui/button";

export function HomeQuickSearch() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/projects",
      search: {
        destination: destination || "",
        dev: "",
        q: query || type || "",
      },
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full rounded-2xl sm:rounded-3xl bg-card/95 border border-border/80 shadow-2xl p-3 sm:p-4 backdrop-blur-xl transition-all hover:border-accent/40"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Search Query */}
        <div className="relative flex items-center rounded-xl bg-background/80 border border-border/60 px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-accent/50 transition-all">
          <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-2.5" />
          <div className="w-full">
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">
              Search Project
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Marassi, Soul, SODIC..."
              className="w-full bg-transparent text-xs sm:text-sm text-foreground font-semibold placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>
        </div>

        {/* Destination Dropdown */}
        <div className="relative flex items-center rounded-xl bg-background/80 border border-border/60 px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-accent/50 transition-all">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mr-2.5" />
          <div className="w-full">
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">
              Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-foreground font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">All Destinations</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div className="relative flex items-center rounded-xl bg-background/80 border border-border/60 px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-accent/50 transition-all">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mr-2.5" />
          <div className="w-full">
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">
              Property Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-foreground font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">All Layout Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Chalet">Chalet</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Twin House">Twin House</option>
              <option value="Standalone Villa">Standalone Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Duplex">Duplex</option>
            </select>
          </div>
        </div>

        {/* Search Submit Button */}
        <div className="flex items-center">
          <Button
            type="submit"
            size="lg"
            className="w-full h-full min-h-[48px] rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <span>Search Compounds</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </form>
  );
}
