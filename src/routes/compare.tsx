import { toast } from "sonner";
import { formatExactPrice } from "@/lib/currency";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { compounds, compoundBySlug } from "@/data/compounds";
import { availabilityBySlug } from "@/data/availability";
import { useStore } from "@/lib/store";
import { formatDeliveryStatus } from "@/lib/delivery";
import { Button } from "@/components/ui/button";
import {
  GitCompareArrows,
  Search,
  ChevronDown,
  Check,
  MapPin,
  Calendar,
  Building2,
  Wallet,
  ShieldCheck,
  ArrowUpDown,
  Sliders,
  Plus,
  X,
  Layers,
  Sparkles,
  Share2,
  Copy,
  Printer,
  ExternalLink,
  ArrowRight,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Multi-Project Side-by-Side Comparison & Technical Matrix | Property Atlas" },
      {
        name: "description",
        content:
          "Compare 2 up to 10 Egyptian real estate compounds side-by-side. Compare masterplan feddan specs or unit-level layouts, indoor BUA, prices per sqm, payment terms, and delivery timelines.",
      },
    ],
  }),
  component: ComparePage,
});

interface SelectedSlot {
  id: string;
  slug: string;
  selectedTypeIdx: number | "all";
}

export function ComparePage() {
  const compareList = useStore((s) => s.compareList);
  const currency = useStore((s) => s.currency);

  // Initialize slots with store items or 2 default flagship projects
  const [slots, setSlots] = useState<SelectedSlot[]>(() => {
    if (compareList.length >= 2) {
      return compareList.map((slug, idx) => ({
        id: `slot-${idx}-${Date.now()}`,
        slug,
        selectedTypeIdx: "all",
      }));
    }
    if (compareList.length === 1) {
      return [
        { id: `slot-0-${Date.now()}`, slug: compareList[0], selectedTypeIdx: "all" },
        { id: `slot-1-${Date.now()}`, slug: "", selectedTypeIdx: "all" },
      ];
    }
    return [
      { id: `slot-0-${Date.now()}`, slug: "horizon-by-saada", selectedTypeIdx: "all" },
      { id: `slot-1-${Date.now()}`, slug: "ever-new-cairo", selectedTypeIdx: "all" },
    ];
  });

  const [activeSearchSlotId, setActiveSearchSlotId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightDiffs, setHighlightDiffs] = useState(true);
  const [showDiffsOnly, setShowDiffsOnly] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Slot management (2 up to 10 slots)
  const handleAddSlot = () => {
    if (slots.length >= 10) return;
    setSlots((prev) => [
      ...prev,
      {
        id: `slot-${prev.length}-${Date.now()}`,
        slug: "",
        selectedTypeIdx: "all",
      },
    ]);
  };

  const handleRemoveSlot = (slotId: string) => {
    if (slots.length <= 2) return;
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  const handleSelectCompound = (slotId: string, slug: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, slug, selectedTypeIdx: "all" } : s))
    );
    setActiveSearchSlotId(null);
    setSearchQuery("");
  };

  const handleSelectUnitType = (slotId: string, value: string) => {
    const selectedTypeIdx = value === "all" ? "all" : parseInt(value, 10);
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, selectedTypeIdx } : s))
    );
  };

  // Curated presets tailored to Egyptian luxury markets
  const QUICK_PRESETS = [
    {
      label: "Saada vs Ever New Cairo",
      slugs: ["horizon-by-saada", "ever-new-cairo"],
    },
    {
      label: "New Cairo: Saada vs Badya vs Solana",
      slugs: ["horizon-by-saada", "badya", "solana"],
    },
    {
      label: "West Cairo: Nyoum October vs Creekview vs Direction White",
      slugs: ["nyoum-october", "creekview", "direction-white"],
    },
    {
      label: "North Coast: Marassi vs Solare vs Ogami",
      slugs: ["marassi", "solare", "ogami"],
    },
  ];

  const handleApplyPreset = (slugs: string[]) => {
    setSlots(
      slugs.map((slug, idx) => ({
        id: `preset-${idx}-${Date.now()}`,
        slug,
        selectedTypeIdx: "all",
      }))
    );
    toast.success("Applied comparison preset");
  };

  // Resolved Slots Data & Dynamic Specs Scope Engine
  const resolvedSlots = useMemo(() => {
    return slots.map((slot) => {
      const comp = compoundBySlug(slot.slug);
      const avail = availabilityBySlug(slot.slug);
      const isAll = slot.selectedTypeIdx === "all";
      const bd =
        !isAll && avail && typeof slot.selectedTypeIdx === "number"
          ? avail.breakdown[slot.selectedTypeIdx]
          : null;

      const isRtm =
        comp?.status === "RTM" ||
        comp?.deliveryYear === 2026 ||
        bd?.deliveryNote?.toLowerCase().includes("ready");

      const priceEgpM = bd ? bd.minPriceM : comp?.priceFrom ?? 0;
      const priceEgpExact = priceEgpM * 1_000_000;
      const areaSqmVal = bd ? bd.minSqm : 145;
      const pricePerSqmEgp = areaSqmVal > 0 ? Math.round(priceEgpExact / areaSqmVal) : 0;

      const delivery = formatDeliveryStatus(bd?.deliveryNote, comp?.deliveryYear, comp?.status).label;

      const areaDisplay = isAll
        ? comp?.areaSize || "— (Feddan Masterplan)"
        : bd
        ? `${bd.minSqm} m²${bd.maxSqm > bd.minSqm ? `–${bd.maxSqm} m²` : ""} BUA (+ Terrace/Garden)`
        : "—";

      const unitTypeDisplay = isAll
        ? comp?.types?.join(", ") || "Standalone Villa, Townhouse, Twin House"
        : bd
        ? `${bd.type}${bd.beds ? ` (${bd.beds} Beds)` : ""}`
        : "Standard Layout";

      const paymentPlanDisplay = bd
        ? bd.paymentPlan || comp?.paymentPlan || "5% DP / 8 Years Equal Installments"
        : comp?.paymentPlan || "5% DP / 8 Years Equal Installments";

      const maintenanceFeeStr = isAll ? "8% Maintenance Deposit" : "8% Maintenance Deposit upon Delivery";
      const scopeLabel = isAll ? "Whole Project Masterplan" : `Unit Layout: ${bd?.type || "Specific Unit"}`;

      return {
        slot,
        comp,
        avail,
        specs: {
          priceEgpM,
          priceEgpExact,
          pricePerSqmEgp,
          delivery,
          areaDisplay,
          unitTypeDisplay,
          paymentPlanDisplay,
          maintenanceFeeStr,
          finishing: bd?.finishing || "Project Standard",
          cluster: bd?.cluster || "All Phases",
          scopeLabel,
          isSpecificUnit: !isAll,
          isRtm,
        },
      };
    });
  }, [slots]);

  const validSlots = useMemo(() => resolvedSlots.filter((rs) => rs.comp), [resolvedSlots]);

  // Competitive Highlighting Engine
  const minPriceVal = useMemo(() => {
    if (validSlots.length === 0) return null;
    const prices = validSlots.map((s) => s.specs.priceEgpM).filter((p) => p > 0);
    return prices.length > 0 ? Math.min(...prices) : null;
  }, [validSlots]);

  const earliestYearVal = useMemo(() => {
    if (validSlots.length === 0) return null;
    const extractYear = (str: string) => {
      const match = str.match(/\d+/);
      if (!match) return 9999;
      const y = parseInt(match[0], 10);
      return y < 100 ? 2000 + y : y;
    };
    const years = validSlots.map((s) => extractYear(s.specs.delivery));
    const validYears = years.filter((y) => y < 9999);
    return validYears.length > 0 ? Math.min(...validYears) : null;
  }, [validSlots]);

  const filteredCompounds = useMemo(() => {
    if (!searchQuery) return compounds.slice(0, 15);
    return compounds
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.destination.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 15);
  }, [searchQuery]);

  // Table rows with clean attribute mapping
  const tableRows = useMemo(() => {
    if (validSlots.length === 0) return [];

    const getRowIsDifferent = (values: string[]) => {
      if (values.length <= 1) return false;
      return new Set(values).size > 1;
    };

    interface TableValue {
      text: string;
      badge?: string;
      isHighlight?: boolean;
    }

    interface TableRowItem {
      category: string;
      label: string;
      icon: any;
      isDifferent: boolean;
      values: TableValue[];
    }

    const scopeVals = validSlots.map((s) => s.specs.scopeLabel);
    const developerVals = validSlots.map((s) => s.comp?.developer || "—");
    const destVals = validSlots.map((s) => (s.comp?.destination || "").replace(/-/g, " ").toUpperCase() || "—");
    const statusVals = validSlots.map((s) => s.comp?.status || "—");
    const typeVals = validSlots.map((s) => s.specs.unitTypeDisplay);
    const clusterVals = validSlots.map((s) => s.specs.cluster);
    const finishingVals = validSlots.map((s) => s.specs.finishing);
    const areaVals = validSlots.map((s) => s.specs.areaDisplay);
    const priceVals = validSlots.map((s) => `${s.specs.priceEgpM}M`);
    const deliveryVals = validSlots.map((s) => s.specs.delivery);
    const payVals = validSlots.map((s) => s.specs.paymentPlanDisplay);

    const rows: TableRowItem[] = [
      {
        category: "Scope & Status",
        label: "Comparison Scope",
        icon: Layers,
        isDifferent: getRowIsDifferent(scopeVals),
        values: validSlots.map((s) => ({
          text: s.specs.scopeLabel,
          badge: s.specs.isSpecificUnit ? "Unit Layout" : "Masterplan",
          isHighlight: s.specs.isSpecificUnit,
        })),
      },
      {
        category: "Identity",
        label: "Developer",
        icon: Building2,
        isDifferent: getRowIsDifferent(developerVals),
        values: validSlots.map((s) => ({ text: s.comp?.developer || "—", isHighlight: false })),
      },
      {
        category: "Identity",
        label: "Destination",
        icon: MapPin,
        isDifferent: getRowIsDifferent(destVals),
        values: validSlots.map((s) => ({
          text: (s.comp?.destination || "").replace(/-/g, " ").toUpperCase() || "—",
          isHighlight: false,
        })),
      },
      {
        category: "Identity",
        label: "Location Details",
        icon: MapPin,
        isDifferent: true,
        values: validSlots.map((s) => ({
          text: (s.avail as any)?.city || s.comp?.city || `${(s.comp?.destination || "").replace(/-/g, " ")} Region, Egypt`,
          isHighlight: false,
        })),
      },
      {
        category: "Scope & Status",
        label: "Development Status",
        icon: ShieldCheck,
        isDifferent: getRowIsDifferent(statusVals),
        values: validSlots.map((s) => ({
          text: s.specs.isRtm ? "Ready to Move (RTM)" : s.comp?.status || "Under Construction",
          badge: s.specs.isRtm ? "Ready to Move" : undefined,
          isHighlight: s.specs.isRtm,
        })),
      },
      {
        category: "Layout & Specs",
        label: "Unit Types / Layout",
        icon: Sliders,
        isDifferent: getRowIsDifferent(typeVals),
        values: validSlots.map((s) => ({ text: s.specs.unitTypeDisplay, isHighlight: false })),
      },
      {
        category: "Layout & Specs",
        label: "Phase / Cluster",
        icon: Layers,
        isDifferent: getRowIsDifferent(clusterVals),
        values: validSlots.map((s) => ({ text: s.specs.cluster, isHighlight: false })),
      },
      {
        category: "Layout & Specs",
        label: "Finishing Standard",
        icon: ShieldCheck,
        isDifferent: getRowIsDifferent(finishingVals),
        values: validSlots.map((s) => ({ text: s.specs.finishing, isHighlight: false })),
      },
      {
        category: "Layout & Specs",
        label: "Built-Up Area (BUA)",
        icon: ArrowUpDown,
        isDifferent: getRowIsDifferent(areaVals),
        values: validSlots.map((s) => ({ text: s.specs.areaDisplay, isHighlight: false })),
      },
      {
        category: "Financials",
        label: "Starting Price",
        icon: Wallet,
        isDifferent: getRowIsDifferent(priceVals),
        values: validSlots.map((s) => {
          const isLowest = minPriceVal !== null && s.specs.priceEgpM === minPriceVal;
          return {
            text: formatExactPrice(s.specs.priceEgpExact, currency),
            badge: isLowest ? "★ Lowest Price" : undefined,
            isHighlight: isLowest,
          };
        }),
      },
      {
        category: "Financials",
        label: "Est. Price per m²",
        icon: Wallet,
        isDifferent: true,
        values: validSlots.map((s) => ({
          text: s.specs.pricePerSqmEgp > 0 ? `${formatExactPrice(s.specs.pricePerSqmEgp, currency)} / m²` : "—",
          isHighlight: false,
        })),
      },
      {
        category: "Timeline",
        label: "Delivery Timeline",
        icon: Calendar,
        isDifferent: getRowIsDifferent(deliveryVals),
        values: validSlots.map((s) => {
          const extractYr = (str: string) => {
            const match = str.match(/\d+/);
            if (!match) return 9999;
            const y = parseInt(match[0], 10);
            return y < 100 ? 2000 + y : y;
          };
          const yr = extractYr(s.specs.delivery);
          const isEarliest = earliestYearVal !== null && yr === earliestYearVal;
          return {
            text: s.specs.delivery,
            badge: isEarliest ? "★ Earliest Delivery" : undefined,
            isHighlight: isEarliest,
          };
        }),
      },
      {
        category: "Financials",
        label: "Payment Terms",
        icon: Calendar,
        isDifferent: getRowIsDifferent(payVals),
        values: validSlots.map((s) => ({
          text: s.specs.paymentPlanDisplay,
          badge: s.specs.paymentPlanDisplay.includes("0%") ? "0% Down Payment" : undefined,
          isHighlight: false,
        })),
      },
    ];
    return rows;
  }, [validSlots, minPriceVal, earliestYearVal, currency]);

  const visibleRows = useMemo(() => {
    if (showDiffsOnly) {
      return tableRows.filter((r) => r.isDifferent);
    }
    return tableRows;
  }, [tableRows, showDiffsOnly]);

  const handleShareLink = () => {
    if (typeof window === "undefined") return;
    const slugs = validSlots.map((s) => s.comp?.slug).filter(Boolean);
    const url = `${window.location.origin}/compare?projects=${slugs.join(",")}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success("Comparison link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Shell>
      {/* ─── BRAND HERO SECTION ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-10 sm:py-14 print:py-4">
        {/* Ambient Gradient Mesh Background */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 0%, oklch(0.72 0.12 195 / .45), transparent 50%), radial-gradient(ellipse at 80% 100%, oklch(0.7 0.18 40 / .3), transparent 60%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-3.5 py-1 text-xs font-semibold text-accent shadow-soft backdrop-blur-md">
                <GitCompareArrows className="h-3.5 w-3.5" />
                <span>Side-by-Side Property Matrix</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Technical Property Comparison
              </h1>
              <p className="text-sm sm:text-base text-primary-foreground/80 max-w-2xl leading-relaxed">
                Compare <strong className="text-accent font-bold">2 up to 10 Egyptian compounds</strong> side-by-side. 
                Evaluate masterplan feddan footprint, floor plan BUA, starting prices, delivery schedules, and payment structures.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap print:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareLink}
                className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white backdrop-blur-md text-xs font-semibold h-9.5 px-4 cursor-pointer transition-all"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-accent mr-1.5" /> : <Share2 className="h-3.5 w-3.5 mr-1.5 text-accent" />}
                {copiedLink ? "Link Copied" : "Share Comparison"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white backdrop-blur-md text-xs font-semibold h-9.5 px-4 cursor-pointer transition-all"
              >
                <Printer className="h-3.5 w-3.5 mr-1.5 text-accent" />
                Print / Save PDF
              </Button>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="mt-8 border-t border-white/10 pt-4 flex items-center gap-2 flex-wrap text-xs print:hidden">
            <span className="font-semibold text-primary-foreground/60 uppercase tracking-wider text-[11px] mr-1">
              Popular Comparisons:
            </span>
            {QUICK_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleApplyPreset(p.slugs)}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-medium text-white/90 hover:border-accent hover:text-accent hover:bg-accent/10 transition-all cursor-pointer backdrop-blur-sm"
              >
                ⚡ {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT AREA ──────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">

        {/* ─── CONTROLS BAR ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 print:hidden">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent border border-accent/25">
              Comparing {validSlots.length} of {slots.length} Projects
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              (Add up to 10 compounds simultaneously)
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showDiffsOnly}
                onChange={(e) => setShowDiffsOnly(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              Show Differences Only
            </label>

            {slots.length < 10 && (
              <Button
                size="sm"
                onClick={handleAddSlot}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold h-8.5 px-3.5 cursor-pointer shadow-soft"
              >
                <Plus className="h-3.5 w-3.5 mr-1 text-accent" />
                Add Project Slot
              </Button>
            )}
          </div>
        </div>

        {/* ─── SECTION 1: PROJECT SLOTS OVERVIEW ─────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
              <Building2 className="h-4 w-4 text-accent" />
              <span>Compared Projects ({validSlots.length})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {slots.map((slot, idx) => {
              const comp = compoundBySlug(slot.slug);
              const avail = availabilityBySlug(slot.slug);
              const isSearchOpen = activeSearchSlotId === slot.id;

              return (
                <div
                  key={slot.id}
                  className="rounded-2xl border border-border bg-card shadow-soft p-4 flex flex-col space-y-3 relative transition-all duration-200 hover:border-accent/40"
                >
                  {/* Slot Header */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-accent">
                      Slot #{idx + 1}
                    </span>
                    {slots.length > 2 && (
                      <button
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                        title="Remove this slot"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Project Selector Trigger */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveSearchSlotId(isSearchOpen ? null : slot.id)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-left text-xs font-bold text-foreground flex items-center justify-between hover:border-accent transition-colors shadow-2xs"
                    >
                      <span className="truncate">{comp ? comp.name : "Select Compound..."}</span>
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </button>

                    {/* Dropdown Popup */}
                    {isSearchOpen && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-border bg-popover p-2 shadow-xl space-y-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Type compound or developer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div className="max-h-52 overflow-y-auto space-y-1 divide-y divide-border/30">
                          {filteredCompounds.map((c) => (
                            <button
                              key={c.slug}
                              onClick={() => handleSelectCompound(slot.id, c.slug)}
                              className="w-full text-left px-2.5 py-1.5 text-xs rounded-md hover:bg-accent/10 hover:text-accent font-medium text-foreground transition-colors flex flex-col"
                            >
                              <span className="font-bold">{c.name}</span>
                              <span className="text-[10px] text-muted-foreground">{c.developer} • {(c.destination || "").replace(/-/g, " ")}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Visual Project Thumbnail */}
                  {comp ? (
                    <div className="aspect-16/10 w-full rounded-xl overflow-hidden bg-muted relative group">
                      <img
                        src={comp.hero}
                        alt={comp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] pointer-events-none">
                        <span className="font-semibold truncate text-white/90">{comp.developer}</span>
                        <span className="font-bold text-accent capitalize">{(comp.destination || "").replace(/-/g, " ")}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-16/10 w-full rounded-xl border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
                      <Building2 className="h-6 w-6 mb-1 opacity-40 text-primary" />
                      <span className="text-[11px] font-medium">Select a compound above</span>
                    </div>
                  )}

                  {/* Comparison Granularity Selector */}
                  {avail && avail.breakdown.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Granularity:
                      </label>
                      <select
                        value={slot.selectedTypeIdx}
                        onChange={(e) => handleSelectUnitType(slot.id, e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:border-accent cursor-pointer"
                      >
                        <option value="all">Whole Masterplan</option>
                        {avail.breakdown.map((b, bIdx) => (
                          <option key={bIdx} value={bIdx}>
                            Unit: {b.type} ({b.minSqm}m²)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {comp && (
                    <div className="pt-1">
                      <Link
                        to="/projects/$slug"
                        params={{ slug: comp.slug }}
                        target="_blank"
                        className="text-[11px] font-bold text-accent hover:underline inline-flex items-center gap-1"
                      >
                        View full project details <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── SECTION 2: SPECIFICATION MATRIX TABLE ──────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
              <Sliders className="h-4 w-4 text-accent" />
              <span>Technical Specification Matrix</span>
            </div>
            {showDiffsOnly && (
              <span className="text-xs text-accent font-semibold">
                Filtering: Showing differences only ({visibleRows.length} attributes)
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                {/* Header Row */}
                <thead>
                  <tr className="border-b border-border bg-primary text-primary-foreground">
                    <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-accent w-56 shrink-0">
                      Specification
                    </th>
                    {validSlots.map((s, idx) => (
                      <th key={s.slot.id} className="p-4 text-xs font-bold text-white min-w-[200px]">
                        <div className="text-[10px] text-accent font-black uppercase tracking-wider">
                          Project #{idx + 1}
                        </div>
                        <div className="font-display text-base font-bold mt-0.5 text-white">
                          {s.comp?.name}
                        </div>
                        <div className="text-[11px] text-primary-foreground/75 font-normal">
                          {s.comp?.developer}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-border text-xs">
                  {visibleRows.map((row, rIdx) => {
                    const RowIcon = row.icon;
                    return (
                      <tr
                        key={rIdx}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <td className="p-4 font-semibold text-foreground flex items-center gap-2.5 bg-muted/20">
                          <RowIcon className="h-4 w-4 text-accent shrink-0" />
                          <span>{row.label}</span>
                        </td>
                        {row.values.map((valObj, vIdx) => (
                          <td
                            key={vIdx}
                            className={`p-4 font-medium transition-colors ${
                              valObj.isHighlight
                                ? "bg-accent/10 font-bold text-foreground"
                                : "text-foreground"
                            }`}
                          >
                            <div className="space-y-1">
                              <div>{valObj.text}</div>
                              {valObj.badge && (
                                <span className="inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent border border-accent/25">
                                  {valObj.badge}
                                </span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── FOOTER BRANDING CARD ─────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-accent">
              Property Atlas Comparison Engine
            </div>
            <div className="font-display text-lg font-bold text-foreground">
              Egypt's Most Comprehensive Compound Atlas
            </div>
            <p className="text-xs text-muted-foreground">
              Data verified across 380+ residential and coastal masterplans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/map" search={{ destination: "", dev: "", q: "" }}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-border text-xs font-bold cursor-pointer"
              >
                Open Map View
              </Button>
            </Link>
            <Link to="/projects" search={{ destination: "", dev: "", q: "" }}>
              <Button
                size="sm"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold cursor-pointer"
              >
                Browse All Compounds
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </Shell>
  );
}
