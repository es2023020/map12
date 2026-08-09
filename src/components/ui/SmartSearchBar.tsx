import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, Building2, MapPin, Sparkles, ChevronRight, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { compounds } from "@/data/compounds";
import { developers } from "@/data/developers";
import { destinations } from "@/data/destinations";

export interface SmartSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSelectProject?: (slug: string) => void;
  onSelectDeveloper?: (slug: string) => void;
  onSelectDestination?: (slug: string) => void;
  onSelectPreset?: (type: "destination" | "dev" | "q", val: string) => void;
  placeholder?: string;
  variant?: "default" | "compact" | "hero";
  showPresets?: boolean;
  className?: string;
  autoFocus?: boolean;
}

const PRESETS = [
  { label: "Sahel", icon: "🏖️", type: "destination" as const, val: "north-coast" },
  { label: "New Cairo", icon: "🏙️", type: "destination" as const, val: "new-cairo" },
  { label: "Ras El Hekma", icon: "🌊", type: "destination" as const, val: "ras-el-hekma" },
  { label: "Sheikh Zayed", icon: "🏡", type: "destination" as const, val: "sheikh-zayed" },
  { label: "Mountain View", icon: "🏔️", type: "dev" as const, val: "mountain-view" },
  { label: "Palm Hills", icon: "🌴", type: "dev" as const, val: "palm-hills" },
  { label: "Flagship", icon: "⭐", type: "q" as const, val: "flagship" },
];

export function SmartSearchBar({
  value,
  onChange,
  onSelectProject,
  onSelectDeveloper,
  onSelectDestination,
  onSelectPreset,
  placeholder = "Search projects, developers, locations, or unit types...",
  variant = "default",
  showPresets = true,
  className = "",
  autoFocus = false,
}: SmartSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K or /
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (
        e.key === "/" &&
        document.activeElement !== inputRef.current &&
        !(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter main compounds (exclude sub-clusters)
  const mainCompounds = useMemo(() => compounds.filter((c) => !c.parentSlug), [compounds]);

  // Compute live search suggestions
  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) {
      return {
        compounds: mainCompounds.slice(0, 4),
        developers: developers.slice(0, 3),
        destinations: destinations.slice(0, 3),
      };
    }

    const matchedCompounds = mainCompounds
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.developer.toLowerCase().includes(q) ||
          c.destination.toLowerCase().includes(q) ||
          (c.types && c.types.some((t) => t.toLowerCase().includes(q)))
      )
      .slice(0, 5);

    const matchedDevelopers = developers
      .filter((d) => d.name.toLowerCase().includes(q) || d.slug.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedDestinations = destinations
      .filter((a) => a.name.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q))
      .slice(0, 3);

    return {
      compounds: matchedCompounds,
      developers: matchedDevelopers,
      destinations: matchedDestinations,
    };
  }, [value, mainCompounds]);

  const totalItems =
    suggestions.compounds.length +
    suggestions.developers.length +
    suggestions.destinations.length;

  // Keyboard navigation inside dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setSelectedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      let idx = selectedIndex;
      if (idx < suggestions.compounds.length) {
        const item = suggestions.compounds[idx];
        if (onSelectProject) onSelectProject(item.slug);
        else onChange(item.name);
      } else {
        idx -= suggestions.compounds.length;
        if (idx < suggestions.developers.length) {
          const item = suggestions.developers[idx];
          if (onSelectDeveloper) onSelectDeveloper(item.slug);
          else onChange(item.name);
        } else {
          idx -= suggestions.developers.length;
          if (idx < suggestions.destinations.length) {
            const item = suggestions.destinations[idx];
            if (onSelectDestination) onSelectDestination(item.slug);
            else onChange(item.name);
          }
        }
      }
      setIsOpen(false);
    }
  };

  const isHero = variant === "hero";
  const isCompact = variant === "compact";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div
        className={`relative flex items-center transition-all duration-200 ${
          isHero
            ? "rounded-2xl border-2 border-primary/20 bg-card shadow-lg hover:border-primary/40 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15"
            : isCompact
            ? "rounded-xl border border-border/80 bg-background shadow-xs hover:border-accent/50 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10"
            : "rounded-xl border border-border bg-card shadow-xs focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20"
        }`}
      >
        <div className={`pointer-events-none flex items-center justify-center text-muted-foreground ${isHero ? "pl-5 text-accent" : "pl-3.5 text-muted-foreground"}`}>
          {isHero ? <Sparkles className="h-5 w-5 animate-pulse" /> : <Search className="h-4 w-4" />}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full bg-transparent font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none ${
            isHero ? "py-3.5 pl-3 pr-20 text-base md:text-lg" : isCompact ? "py-2.5 pl-2.5 pr-14 text-xs md:text-sm" : "py-2.5 pl-3 pr-16 text-sm"
          }`}
        />

        {/* Action icons on right */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                inputRef.current?.focus();
                setIsOpen(true);
              }}
              className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border/80 bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              <span>⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Preset Quick Chips (Hero / Default) */}
      {showPresets && !isCompact && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3 text-accent" /> Presets:
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                if (onSelectPreset) {
                  onSelectPreset(preset.type, preset.val);
                } else if (preset.type === "destination" && onSelectDestination) {
                  onSelectDestination(preset.val);
                } else if (preset.type === "dev" && onSelectDeveloper) {
                  onSelectDeveloper(preset.val);
                } else {
                  onChange(preset.label);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs font-medium text-foreground/80 hover:border-accent hover:bg-accent/10 hover:text-accent transition-all shadow-2xs"
            >
              <span>{preset.icon}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Auto-Suggestion Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[420px] overflow-y-auto rounded-2xl border border-border/80 bg-card p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 slide-in-from-top-2 duration-150">
          {totalItems === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <Search className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
              <p>No results found for &ldquo;<strong className="text-foreground">{value}</strong>&rdquo;</p>
              <p className="mt-1 text-xs text-muted-foreground/70">Try searching for developer names like &ldquo;Ora&rdquo; or regions like &ldquo;Sahel&rdquo;</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Projects Section */}
              {suggestions.compounds.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Projects & Compounds</span>
                    <span className="ml-auto text-[9px] font-normal text-muted-foreground">({suggestions.compounds.length})</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {suggestions.compounds.map((c, i) => {
                      const globalIdx = i;
                      const isSelected = selectedIndex === globalIdx;
                      return (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => {
                            if (onSelectProject) onSelectProject(c.slug);
                            else onChange(c.name);
                            setIsOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
                            isSelected ? "bg-accent/15 text-accent font-medium" : "hover:bg-secondary/70 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {c.hero ? (
                              <img src={c.hero} alt={c.name} className="h-8 w-8 shrink-0 rounded-lg object-cover border border-border/50" />
                            ) : (
                              <div className="h-8 w-8 shrink-0 rounded-lg bg-secondary flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="text-xs md:text-sm font-semibold truncate leading-tight">{c.name}</div>
                              <div className="text-[11px] text-muted-foreground truncate">{c.developer} · {c.destination}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 text-right">
                            <span className="text-xs font-bold text-primary">EGP {c.priceFrom}M</span>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Developers Section */}
              {suggestions.developers.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Real Estate Developers</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {suggestions.developers.map((d, i) => {
                      const globalIdx = suggestions.compounds.length + i;
                      const isSelected = selectedIndex === globalIdx;
                      return (
                        <button
                          key={d.slug}
                          type="button"
                          onClick={() => {
                            if (onSelectDeveloper) onSelectDeveloper(d.slug);
                            else onChange(d.name);
                            setIsOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left transition-colors ${
                            isSelected ? "bg-accent/15 text-accent font-medium" : "hover:bg-secondary/70 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {d.logo ? (
                              <img src={d.logo} alt={d.name} className="h-6 w-6 shrink-0 rounded-md object-contain bg-white border border-border/40 p-0.5" />
                            ) : (
                              <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                            )}
                            <span className="text-xs md:text-sm font-medium truncate">{d.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <span>{d.count} projects</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Destinations Section */}
              {suggestions.destinations.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Regions & Destinations</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {suggestions.destinations.map((a, i) => {
                      const globalIdx = suggestions.compounds.length + suggestions.developers.length + i;
                      const isSelected = selectedIndex === globalIdx;
                      return (
                        <button
                          key={a.slug}
                          type="button"
                          onClick={() => {
                            if (onSelectDestination) onSelectDestination(a.slug);
                            else onChange(a.name);
                            setIsOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left transition-colors ${
                            isSelected ? "bg-accent/15 text-accent font-medium" : "hover:bg-secondary/70 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: a.color }} />
                            <span className="text-xs md:text-sm font-medium truncate">{a.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <span>{a.region}</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
