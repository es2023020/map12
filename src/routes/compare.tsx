import mediaRegistry from "@/data/media-registry.json";
import { formatCurrency, formatExactPrice } from "@/lib/currency";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { compounds, compoundBySlug, Compound } from "@/data/compounds";
import { availabilityBySlug } from "@/data/availability";
import { useStore } from "@/lib/store";
import {
  GitCompareArrows,
  Search,
  ChevronDown,
  Check,
  MapPin,
  Calendar,
  Building2,
  Wallet,
  Waves,
  Info,
  ShieldCheck,
  ArrowUpDown,
  Sliders,
  Download,
  Plus,
  X,
  Layers,
  Sparkles,
  Share2,
  Copy,
  Edit3,
  Eye,
  User,
  Phone,
} from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Multi-Project Side-by-Side Comparison | Property Atlas" },
      {
        name: "description",
        content:
          "Compare multiple Egyptian real estate compounds side-by-side. Compare whole projects or specific unit types, starting prices, delivery timelines, and payment plans.",
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

  // Initialize slots with store items or empty slots (no pre-filled default placeholders)
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
      { id: `slot-0-${Date.now()}`, slug: "", selectedTypeIdx: "all" },
      { id: `slot-1-${Date.now()}`, slug: "", selectedTypeIdx: "all" },
    ];
  });

  const [activeSearchSlotId, setActiveSearchSlotId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [highlightDiffs, setHighlightDiffs] = useState(true);
  const [showDiffsOnly, setShowDiffsOnly] = useState(false);




  // Quick preset comparisons
  const QUICK_PRESETS = [
    {
      label: "Nyoum October vs Creekview vs Direction White",
      slugs: ["nyoum-october", "creekview", "direction-white"],
    },
    {
      label: "Marassi vs Solare vs Ogami",
      slugs: ["marassi", "solare", "ogami"],
    },
    {
      label: "Saada New Cairo vs Badya vs Solana",
      slugs: ["horizon-by-saada", "badya", "solana"],
    },
    {
      label: "Ashrafieh vs Fifth Square vs Mivida",
      slugs: ["ashrafieh", "fifth-square", "mivida"],
    },
  ];

  const handleAddSlot = () => {
    if (slots.length >= 5) return;
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
    if (slots.length <= 2) return; // Keep at least 2 projects
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  const handleSelectCompound = (slotId: string, slug: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, slug, selectedTypeIdx: "all" } : s)),
    );
    setActiveSearchSlotId(null);
    setSearchQuery("");
  };

  const handleSelectUnitType = (slotId: string, value: string) => {
    const selectedTypeIdx = value === "all" ? "all" : parseInt(value, 10);
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, selectedTypeIdx } : s)),
    );
  };

  const handleApplyPreset = (slugs: string[]) => {
    setSlots(
      slugs.map((slug, idx) => ({
        id: `preset-${idx}-${Date.now()}`,
        slug,
        selectedTypeIdx: "all",
      })),
    );
  };

  // Resolve data and specs for each slot
  const resolvedSlots = useMemo(() => {
    return slots.map((slot) => {
      const comp = compoundBySlug(slot.slug);
      const avail = availabilityBySlug(slot.slug);
      const isAll = slot.selectedTypeIdx === "all";
      const bd =
        !isAll && avail && typeof slot.selectedTypeIdx === "number"
          ? avail.breakdown[slot.selectedTypeIdx]
          : null;

      const price = bd ? bd.minPriceM : comp?.priceFrom ?? 0;
      const delivery = bd
        ? bd.deliveryNote || comp?.deliveryYear.toString() || "—"
        : comp?.deliveryYear.toString() || "—";
      const area = bd
        ? bd.minSqm === bd.maxSqm
          ? `${bd.minSqm} m²`
          : `${bd.minSqm}–${bd.maxSqm} m²`
        : comp?.areaSize || "—";
      const unitTypeDisplay = bd
        ? `${bd.type}${bd.beds ? ` (${bd.beds} BR)` : ""}`
        : comp?.types.join(", ") || "—";
      const paymentPlan = bd ? bd.paymentPlan || comp?.paymentPlan || "—" : comp?.paymentPlan || "—";
      const finishing = bd ? bd.finishing || "Project Standard" : "Project Standard";
      const cluster = bd ? bd.cluster || "All Phases" : "All Phases";
      const scopeLabel = isAll
        ? "Whole Project Specs"
        : bd
          ? `Unit: ${bd.type}${bd.beds ? ` (${bd.beds} BR)` : ""}`
          : "Whole Project Specs";

      return {
        slot,
        comp,
        avail,
        specs: {
          price,
          delivery,
          area,
          unitTypeDisplay,
          paymentPlan,
          finishing,
          cluster,
          scopeLabel,
          isSpecificUnit: !isAll,
        },
      };
    });
  }, [slots]);

  const validSlots = useMemo(() => resolvedSlots.filter((rs) => rs.comp), [resolvedSlots]);

  // Find lowest price and earliest delivery for highlights
  const minPriceVal = useMemo(() => {
    if (validSlots.length === 0) return null;
    const prices = validSlots.map((s) => s.specs.price).filter((p) => p > 0);
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
    if (!searchQuery) return compounds.slice(0, 12);
    return compounds
      .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.developer.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 12);
  }, [searchQuery]);

  // Construct table rows
  const currency = useStore((s) => s.currency);
  const [copiedCompare, setCopiedCompare] = useState(false);

  const compareShareText = useMemo(() => {
    if (validSlots.length === 0) return "";
    let msg = `Hello [Client Name],\n\n`;
    msg += `Here is your customized side-by-side property comparison sheet:\n\n`;

    validSlots.forEach((s, idx) => {
      const slug = s.comp?.slug || "";
      const projectMedia = (mediaRegistry.projects_media as any)?.[slug] || [];
      const images = projectMedia.filter((m: any) => m.type === "image");
      const videos = projectMedia.filter((m: any) => m.type === "video");

      msg += `*${idx + 1}. ${s.comp?.name}* by ${s.comp?.developer}\n`;
      msg += ` • Location: ${s.comp?.destination.replace(/-/g, " ").toUpperCase()}\n`;
      msg += ` • Unit Type: ${s.specs.unitTypeDisplay}\n`;
      msg += ` • Built-up Area: ${s.specs.area}\n`;
      msg += ` • Starting Price: ${formatCurrency(s.specs.price, currency)}\n`;
      msg += ` • Payment Plan: ${s.specs.paymentPlan}\n`;
      msg += ` • Delivery Date: ${s.specs.delivery}\n`;

      if (images.length > 0) {
        msg += ` 🖼️ Photos: ${window?.location?.origin || "https://propertyatlas.eg"}${images[0].path}\n`;
      }
      if (videos.length > 0) {
        msg += ` 📹 Video Walkthrough: ${window?.location?.origin || "https://propertyatlas.eg"}${videos[0].path}\n`;
      }
      msg += `\n`;
    });

    msg += `If you are interested in any of these projects, reply to this message to arrange a site visit or schedule a presentation meeting.\n\n`;
    msg += `Contact Representative: Property Atlas Sales Team (+20 102 932 4783)`;
    return msg;
  }, [validSlots, currency]);

  const handleCopyCompare = () => {
    navigator.clipboard.writeText(compareShareText);
    setCopiedCompare(true);
    setTimeout(() => setCopiedCompare(false), 2000);
  };

  const tableRows = useMemo(() => {
    if (validSlots.length === 0) return [];

    const getRowIsDifferent = (values: string[]) => {
      if (values.length <= 1) return false;
      return new Set(values).size > 1;
    };

    const developerVals = validSlots.map((s) => s.comp?.developer || "—");
    const destVals = validSlots.map((s) => s.comp?.destination.replace(/-/g, " ").toUpperCase() || "—");
    const statusVals = validSlots.map((s) => s.comp?.status || "—");
    const scopeVals = validSlots.map((s) => s.specs.scopeLabel);
    const typeVals = validSlots.map((s) => s.specs.unitTypeDisplay);
    const clusterVals = validSlots.map((s) => s.specs.cluster);
    const finishingVals = validSlots.map((s) => s.specs.finishing);
    const areaVals = validSlots.map((s) => s.specs.area);
    const priceVals = validSlots.map((s) => `${s.specs.price}M`);
    const deliveryVals = validSlots.map((s) => s.specs.delivery);
    const payVals = validSlots.map((s) => s.specs.paymentPlan);

    return [
      {
        label: "Developer",
        icon: Building2,
        isDifferent: getRowIsDifferent(developerVals),
        values: validSlots.map((s) => ({ text: s.comp?.developer || "—", isHighlight: false })),
      },
      {
        label: "Developer Profile",
        icon: Building2,
        isDifferent: getRowIsDifferent(developerVals),
        values: validSlots.map((s) => ({
          text: `Project by ${s.comp?.developer}. Leading footprint in Egyptian real estate with high build standards.`,
          isHighlight: false,
        })),
      },
      {
        label: "Destination",
        icon: MapPin,
        isDifferent: getRowIsDifferent(destVals),
        values: validSlots.map((s) => ({
          text: s.comp?.destination.replace(/-/g, " ").toUpperCase() || "—",
          isHighlight: false,
        })),
      },
      {
        label: "Exact Location Details",
        icon: MapPin,
        isDifferent: true,
        values: validSlots.map((s) => ({
          text: (s.avail as any)?.city || s.comp?.city || `${s.comp?.destination.replace(/-/g, " ")} region`,
          isHighlight: false,
        })),
      },
      {
        label: "Compound Status",
        icon: ShieldCheck,
        isDifferent: getRowIsDifferent(statusVals),
        values: validSlots.map((s) => ({ text: s.comp?.status || "—", isHighlight: false })),
      },
      {
        label: "Comparison Scope",
        icon: Layers,
        isDifferent: getRowIsDifferent(scopeVals),
        values: validSlots.map((s) => ({
          text: s.specs.scopeLabel,
          isHighlight: s.specs.isSpecificUnit,
        })),
      },
      {
        label: "Unit Type / Layout",
        icon: Sliders,
        isDifferent: getRowIsDifferent(typeVals),
        values: validSlots.map((s) => ({ text: s.specs.unitTypeDisplay, isHighlight: false })),
      },
      {
        label: "Phase / Cluster",
        icon: Info,
        isDifferent: getRowIsDifferent(clusterVals),
        values: validSlots.map((s) => ({ text: s.specs.cluster, isHighlight: false })),
      },
      {
        label: "Finishing Type",
        icon: ShieldCheck,
        isDifferent: getRowIsDifferent(finishingVals),
        values: validSlots.map((s) => ({ text: s.specs.finishing, isHighlight: false })),
      },
      {
        label: "Unit BUA Size",
        icon: ArrowUpDown,
        isDifferent: getRowIsDifferent(areaVals),
        values: validSlots.map((s) => ({ text: s.specs.area, isHighlight: false })),
      },
      {
        label: "Starting Price",
        icon: Wallet,
        isDifferent: getRowIsDifferent(priceVals),
        values: validSlots.map((s) => {
          const isLowest = minPriceVal !== null && s.specs.price === minPriceVal;
          return {
            text: `EGP ${s.specs.price}M ${isLowest ? "★ Lowest" : ""}`,
            isHighlight: isLowest,
          };
        }),
      },
      {
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
            text: `${s.specs.delivery} ${isEarliest ? "★ Earliest" : ""}`,
            isHighlight: isEarliest,
          };
        }),
      },
      {
        label: "Payment Terms",
        icon: Calendar,
        isDifferent: getRowIsDifferent(payVals),
        values: validSlots.map((s) => ({ text: s.specs.paymentPlan, isHighlight: false })),
      },
      {
        label: "Key Amenities",
        icon: Waves,
        isDifferent: true,
        values: validSlots.map((s) => ({
          text: s.comp?.amenities ? s.comp.amenities.slice(0, 6).join(", ") : "Green landscapes, Security",
          isHighlight: false,
        })),
      },
    ];
  }, [validSlots, minPriceVal, earliestYearVal]);

  const visibleRows = useMemo(() => {
    if (showDiffsOnly) {
      return tableRows.filter((r) => r.isDifferent);
    }
    return tableRows;
  }, [tableRows, showDiffsOnly]);

  // Editable comparison state
  const [editMode, setEditMode] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [clientName, setClientName] = useState("Valued Client");
  const [agentName, setAgentName] = useState("Senior Real Estate Consultant");
  const [agentTitle, setAgentTitle] = useState("Luxury Advisory Division");
  const [agentPhone, setAgentPhone] = useState("+20 102 932 4783");
  const [agentEmail, setAgentEmail] = useState("consultant@realestate.eg");
  const [agencyName, setAgencyName] = useState("Exclusive Real Estate Advisory");
  const [summaryHook, setSummaryHook] = useState("Here is your curated side-by-side multi-project comparison analysis detailing pricing, payment schedules, unit specifications, and delivery timelines.");

  // Direct PDF Download using html2canvas & jsPDF
  const handleDownloadPDF = async () => {
    const targetEl = document.getElementById("comparison-report-container");
    if (!targetEl) return;
    setDownloadingPdf(true);
    try {
      // @ts-ignore
      const html2canvasModule = await import(/* @vite-ignore */ "html2canvas");
      // @ts-ignore
      const jsPdfModule = await import(/* @vite-ignore */ "jspdf");

      const html2canvas = html2canvasModule.default || html2canvasModule;
      const jsPDF = jsPdfModule.jsPDF || jsPdfModule.default || jsPdfModule;

      const canvas = await html2canvas(targetEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const names = validSlots.map((s) => s.comp?.name || "Project").join("_vs_");
      pdf.save(`Comparison_${names.replace(/[^a-zA-Z0-9_]/g, "")}.pdf`);
    } catch (e) {
      console.error("Direct PDF export fallback", e);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <Shell>
      {/* Header Banner */}
      <div className="bg-slate-900 text-white border-b border-white/5 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                <GitCompareArrows className="h-3.5 w-3.5" /> Multi-Project Comparison Engine
              </div>
              <h1 className="mt-2 font-display text-3xl md:text-4xl font-extrabold tracking-tight">
                Side-by-Side Analysis
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                Compare 2 or more projects simultaneously. Choose whether to compare whole projects or specific unit types per compound.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`no-print inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-md cursor-pointer ${
                    editMode
                      ? "bg-accent text-accent-foreground"
                      : "border border-white/20 bg-slate-800 text-white hover:bg-slate-700"
                  }`}
                >
                  {editMode ? <Eye className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
                  {editMode ? "Preview Comparison" : "Edit Fields & Agent Info"}
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={downloadingPdf}
                  className="no-print inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold transition-all hover:bg-primary/90 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  {downloadingPdf ? "Exporting PDF..." : "Download Comparison PDF"}
                </button>
                {slots.length < 5 && (
                  <button
                    onClick={handleAddSlot}
                    className="no-print inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-4 py-2 text-xs font-bold transition-all hover:bg-emerald-500 shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Another Project ({slots.length}/5)
                  </button>
                )}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-col gap-2 max-w-md bg-slate-950/50 p-4 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Multi-Project Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_PRESETS.map((qp) => (
                  <button
                    key={qp.label}
                    onClick={() => handleApplyPreset(qp.slugs)}
                    className="rounded-lg bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 transition-colors border border-white/5 text-left"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Project Selector Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Comparing {slots.length} Projects
            </h2>
            {slots.length < 5 && (
              <button
                onClick={handleAddSlot}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="h-4 w-4" /> Add Project Column
              </button>
            )}
          </div>

          <div className={`grid gap-4 ${slots.length === 2 ? "grid-cols-1 md:grid-cols-2" : slots.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
            {resolvedSlots.map(({ slot, comp, avail }, index) => {
              const isSearchOpen = activeSearchSlotId === slot.id;
              return (
                <div
                  key={slot.id}
                  className="space-y-3 bg-card p-4 rounded-2xl border border-border shadow-soft relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent">
                      Project #{index + 1}
                    </span>
                    {slots.length > 2 && (
                      <button
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="rounded-full bg-secondary/80 hover:bg-destructive/20 hover:text-destructive p-1 text-muted-foreground transition-colors"
                        title="Remove column"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Compound Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        if (isSearchOpen) {
                          setActiveSearchSlotId(null);
                        } else {
                          setActiveSearchSlotId(slot.id);
                          setSearchQuery("");
                        }
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-xs font-semibold text-primary shadow-sm hover:bg-secondary/60 transition-colors"
                    >
                      <span className="truncate">{comp?.name ?? "Select Project"}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>

                    {isSearchOpen && (
                      <div className="absolute left-0 right-0 z-30 mt-1 rounded-xl border border-border bg-card p-2 shadow-2xl animate-fade-in">
                        <div className="relative flex items-center border-b border-border/60 pb-2 mb-2">
                          <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search project..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1 text-xs bg-secondary/50 rounded-lg border-0 focus:ring-1 focus:ring-accent focus:outline-none"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-56 overflow-y-auto space-y-1">
                          {filteredCompounds.map((c) => (
                            <button
                              key={c.slug}
                              onClick={() => handleSelectCompound(slot.id, c.slug)}
                              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors ${
                                slot.slug === c.slug
                                  ? "bg-accent/15 text-accent font-bold"
                                  : "hover:bg-secondary/80 text-primary"
                              }`}
                            >
                              <span className="truncate">{c.name}</span>
                              {slot.slug === c.slug && <Check className="h-3.5 w-3.5 shrink-0" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scope Selector: Whole Project vs Specific Unit */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Compare Scope / Unit
                    </label>
                    <select
                      value={slot.selectedTypeIdx}
                      onChange={(e) => handleSelectUnitType(slot.id, e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="all">Whole Project (Overall Compound)</option>
                      {avail && avail.breakdown.length > 0 ? (
                        avail.breakdown.map((b, idx) => (
                          <option key={idx} value={idx}>
                            Unit: {b.type} {b.beds ? `(${b.beds} BR)` : ""} · EGP {b.minPriceM}M+
                          </option>
                        ))
                      ) : (
                        <option disabled>No specific breakdown available</option>
                      )}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Edit Drawer Controls (Hidden when in preview mode or print) */}
        {editMode && (
          <div className="no-print mb-6 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-lg animate-in fade-in-50 duration-200">
            <div className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Edit3 className="h-4 w-4" /> Edit Comparison Details &amp; Representative Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Agent Title &amp; Division</label>
                <input
                  type="text"
                  value={agentTitle}
                  onChange={(e) => setAgentTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Agent Phone</label>
                <input
                  type="text"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Agent Email / Agency</label>
                <input
                  type="text"
                  value={agentEmail}
                  onChange={(e) => setAgentEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Agency / Advisory Name</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Executive Proposal Introduction</label>
              <textarea
                rows={2}
                value={summaryHook}
                onChange={(e) => setSummaryHook(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-primary focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        )}

        {validSlots.length >= 2 ? (
          <div id="comparison-report-container" className="space-y-8 animate-fade-in">
            {/* Display Options Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-soft">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDiffsOnly(!showDiffsOnly)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    showDiffsOnly
                      ? "bg-primary text-white shadow-sm"
                      : "bg-secondary text-primary hover:bg-secondary/80"
                  }`}
                >
                  {showDiffsOnly ? "Showing Differences Only" : "Show Differences Only"}
                </button>
                <button
                  onClick={() => setHighlightDiffs(!highlightDiffs)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    highlightDiffs
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-secondary text-primary hover:bg-secondary/80"
                  }`}
                >
                  {highlightDiffs ? "Highlights On" : "Highlights Off"}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-semibold">
                  Showing {visibleRows.length} attributes across {validSlots.length} projects
                </span>
                <button
                  onClick={handleDownloadPDF}
                  className="no-print inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-bold transition-all hover:bg-accent/80 shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Top Cards Grid */}
            <div className={`grid gap-4 ${validSlots.length === 2 ? "grid-cols-1 md:grid-cols-2" : validSlots.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
              {validSlots.map(({ slot, comp, specs }, idx) => (
                <div
                  key={slot.id}
                  className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft flex flex-col justify-between"
                >
                  <div>
                    <div className="relative">
                      <img src={comp?.hero} alt={comp?.name} className="h-40 w-full object-cover" />
                      <div className="absolute top-2 left-2 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white uppercase shadow-sm border border-white/10">
                        #{idx + 1} {specs.isSpecificUnit ? "Unit View" : "Whole Compound"}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        {comp?.developer}
                      </div>
                      <h3 className="mt-0.5 font-display text-xl font-bold text-primary truncate">
                        {comp?.name}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                        {comp?.blurb}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border bg-secondary/10 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Price</span>
                    <span className="font-display text-lg font-bold text-emerald-600">
                      EGP {specs.price}M
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Spec Matrix Table */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
              <div className="px-6 py-4 border-b border-border bg-secondary/20 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary">
                    Side-by-Side Specifications Matrix
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Comparing {validSlots.length} projects side-by-side with dynamic unit type configuration.
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/80 bg-secondary/15">
                      <th className="w-48 min-w-[180px] p-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Attribute
                      </th>
                      {validSlots.map(({ slot, comp, specs }, idx) => (
                        <th
                          key={slot.id}
                          className="min-w-[200px] p-4 text-left text-xs font-bold uppercase tracking-wider text-primary border-l border-border/60"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-accent">Project #{idx + 1}</span>
                            <span className="text-sm text-primary font-bold">{comp?.name}</span>
                            <span className="text-[10px] font-normal text-muted-foreground">
                              {specs.scopeLabel}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {visibleRows.map((row) => {
                      const Icon = row.icon;
                      const hasDiff = row.isDifferent && highlightDiffs;
                      return (
                        <tr
                          key={row.label}
                          className={`transition-colors hover:bg-secondary/15 ${
                            hasDiff ? "bg-amber-500/5" : ""
                          }`}
                        >
                          <td className="p-4 font-bold text-primary flex items-center gap-2">
                            <Icon className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>{row.label}</span>
                          </td>
                          {row.values.map((valObj, idx) => (
                            <td
                              key={idx}
                              className={`p-4 font-medium text-slate-700 border-l border-border/60 ${
                                valObj.isHighlight && highlightDiffs
                                  ? "bg-emerald-500/10 text-emerald-800 font-bold"
                                  : ""
                              }`}
                            >
                              {valObj.text}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {validSlots.map(({ slot, comp }) => (
                <div key={slot.id} className="flex gap-2">
                  <Link to="/projects/$slug" params={{ slug: slot.slug }} className="flex-1">
                    <button className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-soft">
                      {comp?.name} Page
                    </button>
                  </Link>
                  <Link to="/calculator" search={{ project: slot.slug }} className="flex-1">
                    <button className="w-full rounded-xl border border-accent bg-card py-3 text-xs font-semibold text-accent hover:bg-accent/5 transition-colors shadow-soft">
                      Calculator
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <GitCompareArrows className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-primary">
              Select projects to compare
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose at least 2 compounds above to view side-by-side specs.
            </p>
          </div>
        )}
      </div>
    </Shell>
  );
}
