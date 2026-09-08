import { toast } from "sonner";
import mediaRegistry from "@/data/media-registry.json";
import { formatCurrency, formatExactPrice } from "@/lib/currency";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { compounds, compoundBySlug, Compound } from "@/data/compounds";
import { availabilityBySlug } from "@/data/availability";
import { useStore } from "@/lib/store";
import { formatDeliveryStatus } from "@/lib/delivery";
import { CompareSetupDialog, type CompareMetadata } from "@/components/ui/CompareSetupDialog";
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
  Briefcase,
  Printer,
  FileCode,
} from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Multi-Project Side-by-Side Comparison & Technical Matrix | Property Atlas" },
      {
        name: "description",
        content:
          "Compare 2 up to 10 Egyptian real estate compounds side-by-side. Compare whole project feddan specs or unit-level layouts, indoor BUA vs terrace areas, prices per sqm, payment terms, and cash discounts.",
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

  // Initialize slots with store items or 2 default slots
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

  // Pre-generation questionnaire dialog state
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [metadata, setMetadata] = useState<CompareMetadata>({
    agentName: "Sayed Shoeip",
    agentTitle: "Senior Real Estate Consultant",
    agentPhone: "+20 102 932 4783",
    clientName: "Valuation & Investment Committee",
  });

  // Expand slots scalability: 2 up to 10 projects/units
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

  // Preset comparisons
  const QUICK_PRESETS = [
    {
      label: "SAADA vs EVER NEW CAIRO",
      slugs: ["horizon-by-saada", "ever-new-cairo"],
    },
    {
      label: "Saada New Cairo vs Badya vs Solana",
      slugs: ["horizon-by-saada", "badya", "solana"],
    },
    {
      label: "Nyoum October vs Creekview vs Direction White",
      slugs: ["nyoum-october", "creekview", "direction-white"],
    },
    {
      label: "Marassi vs Solare vs Ogami",
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

      // Granularity Adaptation: Whole Project vs Specific Unit
      const areaDisplay = isAll
        ? comp?.areaSize || "— (Feddan Masterplan)"
        : bd
        ? `Indoor BUA: ${bd.minSqm} m²${bd.maxSqm > bd.minSqm ? `–${bd.maxSqm} m²` : ""} (+ Outdoor Terrace / Garden)`
        : "—";

      const unitTypeDisplay = isAll
        ? comp?.types?.join(", ") || "Standalone Villa, Townhouse, Twin House"
        : bd
        ? `Unit Layout: ${bd.type}${bd.beds ? ` (${bd.beds} Bedrooms)` : ""}`
        : "Standard Layout";

      const paymentPlanDisplay = bd
        ? bd.paymentPlan || comp?.paymentPlan || "5% DP / 8 Years Equal Installments"
        : comp?.paymentPlan || "5% DP / 8 Years Equal Installments";

      const maintenanceFeeStr = isAll ? "8% Maintenance Deposit" : "8% Maintenance Deposit upon Delivery";
      const scopeLabel = isAll ? "Whole Project Specs" : `Unit Layout: ${bd?.type || "Specific Unit"}`;

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
    if (!searchQuery) return compounds.slice(0, 12);
    return compounds
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.developer.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 12);
  }, [searchQuery]);

  const currency = useStore((s) => s.currency);

  // Table rows with explicit dual/multi column attribute structure
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
      label: string;
      icon: any;
      isDifferent: boolean;
      values: TableValue[];
    }

    const scopeVals = validSlots.map((s) => s.specs.scopeLabel);
    const developerVals = validSlots.map((s) => s.comp?.developer || "—");
    const destVals = validSlots.map((s) => s.comp?.destination.replace(/-/g, " ").toUpperCase() || "—");
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
        label: "Comparison Scope",
        icon: Layers,
        isDifferent: getRowIsDifferent(scopeVals),
        values: validSlots.map((s) => ({
          text: s.specs.scopeLabel,
          badge: s.specs.isSpecificUnit ? "Unit Level" : "Whole Project",
          isHighlight: s.specs.isSpecificUnit,
        })),
      },
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
          text: `Leading footprint in Egyptian real estate with high build standards (${s.comp?.developer}).`,
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
          text: (s.avail as any)?.city || s.comp?.city || `${s.comp?.destination.replace(/-/g, " ")} Region, Egypt`,
          isHighlight: false,
        })),
      },
      {
        label: "Compound Status",
        icon: ShieldCheck,
        isDifferent: getRowIsDifferent(statusVals),
        values: validSlots.map((s) => ({
          text: s.specs.isRtm ? "RTM (Ready To Move) ★" : s.comp?.status || "Off-Plan",
          badge: s.specs.isRtm ? "★ Ready To Move" : undefined,
          isHighlight: s.specs.isRtm,
        })),
      },
      {
        label: "Unit Types Available / Floor Plan",
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
        label: "Project / Unit Area",
        icon: ArrowUpDown,
        isDifferent: getRowIsDifferent(areaVals),
        values: validSlots.map((s) => ({ text: s.specs.areaDisplay, isHighlight: false })),
      },
      {
        label: "Starting Price",
        icon: Wallet,
        isDifferent: getRowIsDifferent(priceVals),
        values: validSlots.map((s) => {
          const isLowest = minPriceVal !== null && s.specs.priceEgpM === minPriceVal;
          return {
            text: formatExactPrice(s.specs.priceEgpExact, currency),
            badge: isLowest ? "★ Lowest Starting Price" : undefined,
            isHighlight: isLowest,
          };
        }),
      },
      {
        label: "Price per m² (Est.)",
        icon: Wallet,
        isDifferent: true,
        values: validSlots.map((s) => ({
          text: s.specs.pricePerSqmEgp > 0 ? `${formatExactPrice(s.specs.pricePerSqmEgp, currency)} / m²` : "—",
          isHighlight: false,
        })),
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
            text: s.specs.delivery,
            badge: isEarliest ? "★ Earliest Delivery" : undefined,
            isHighlight: isEarliest,
          };
        }),
      },
      {
        label: "Payment Terms & Discounts",
        icon: Calendar,
        isDifferent: getRowIsDifferent(payVals),
        values: validSlots.map((s) => ({
          text: `${s.specs.paymentPlanDisplay} • Up to 40% Cash Discount`,
          badge: s.specs.paymentPlanDisplay.includes("0%") ? "★ 0% Down Payment" : undefined,
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

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Direct PDF Download
  const handleGeneratePDF = () => {
    setQuestionnaireOpen(true);
  };

  const executeDownloadPDF = async (customMeta: CompareMetadata) => {
    const targetEl = document.getElementById("comparison-report-container");
    if (!targetEl) return;
    setDownloadingPdf(true);
    toast.info("Generating high-resolution Comparison PDF...");
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
        backgroundColor: "#090d16",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const names = validSlots.map((s) => s.comp?.name || "Project").join("_vs_");
      pdf.save(`Comparison_${names.replace(/[^a-zA-Z0-9_]/g, "")}.pdf`);
      toast.success("Comparison PDF downloaded directly to your device!");
    } catch (e) {
      console.error("Comparison PDF export error", e);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Standalone HTML/CSS code generator for offline sharing
  const handleCopyStandaloneHTML = () => {
    const htmlCode = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Side-by-Side Property Comparison Matrix</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #fff; padding: 30px; }
    .card { background: #1e293b; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; }
    h1 { color: #fbbf24; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left; font-size: 13px; }
    th { background: #090d16; color: #fbbf24; text-transform: uppercase; font-size: 11px; }
    .badge { background: rgba(251, 191, 36, 0.2); color: #fbbf24; padding: 2px 8px; border-radius: 99px; font-weight: bold; font-size: 10px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Side-by-Side Technical Comparison Matrix</h1>
    <p>Prepared for: <strong>${metadata.clientName}</strong> | Representative: <strong>${metadata.agentName}</strong> (${metadata.agentPhone})</p>
    <table>
      <thead>
        <tr>
          <th>Attribute</th>
          ${validSlots.map((s) => `<th>${s.comp?.name} (${s.comp?.developer})</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${tableRows
          .map(
            (row) => `
          <tr>
            <td><strong>${row.label}</strong></td>
            ${row.values.map((v) => `<td>${v.text} ${v.badge ? `<span class="badge">${v.badge}</span>` : ""}</td>`).join("")}
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </div>
</body>
</html>`;
    navigator.clipboard.writeText(htmlCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <Shell>
      {/* Questionnaire Modal */}
      <CompareSetupDialog
        isOpen={questionnaireOpen}
        onClose={() => setQuestionnaireOpen(false)}
        onConfirm={(meta) => {
          setMetadata(meta);
          setQuestionnaireOpen(false);
          executeDownloadPDF(meta);
        }}
      />

      {/* Header Banner */}
      <div className="bg-slate-950 text-white border-b border-white/10 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
                <GitCompareArrows className="h-3.5 w-3.5" /> Side-by-Side Multi-Project Comparison Matrix
              </div>
              <h1 className="mt-2 font-display text-3xl md:text-4xl font-black tracking-tight">
                Technical Comparison &amp; Specification Engine
              </h1>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                Compare <strong className="text-amber-400">2 up to 10 projects/units</strong> side-by-side. Dynamically adapt metrics between whole project feddan masterplans and unit-level floor plan specifications.
              </p>
            </div>

            {/* Top Toolbar Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleGeneratePDF}
                disabled={downloadingPdf}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {downloadingPdf ? "Generating PDF..." : "Export Comparison PDF"}
              </button>

              <button
                onClick={handleCopyStandaloneHTML}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
              >
                <FileCode className="h-4 w-4 text-amber-400" />
                {copiedCode ? "Copied Code!" : "Copy Standalone HTML"}
              </button>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="mt-6 border-t border-white/10 pt-4 flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider">Quick Presets:</span>
            {QUICK_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleApplyPreset(p.slugs)}
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 font-medium text-slate-300 hover:border-amber-500/50 hover:text-white transition-all cursor-pointer"
              >
                ⚡ {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div id="comparison-report-container" className="mx-auto max-w-7xl px-4 py-8 lg:px-8 space-y-10 bg-slate-950 text-white min-h-screen">
        
        {/* Branding Header Card */}
        <div className="rounded-3xl border border-white/15 bg-slate-900 p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              Official Property Atlas Comparison Sheet
            </div>
            <div className="font-display text-xl font-bold text-white">
              Prepared for: <span className="text-amber-400">{metadata.clientName}</span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-300 space-y-0.5">
            <div>Advisor: <strong className="text-white">{metadata.agentName}</strong> ({metadata.agentTitle})</div>
            <div>Direct Phone: <strong className="text-amber-400">{metadata.agentPhone}</strong></div>
          </div>
        </div>

        {/* Slot Controls Bar (2 to 10 Slots) */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
              Comparing {validSlots.length} of {slots.length} Slots (Max 10)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showDiffsOnly}
                onChange={(e) => setShowDiffsOnly(e.target.checked)}
                className="rounded border-white/20 bg-slate-900 text-amber-500 focus:ring-amber-500"
              />
              Show Differences Only
            </label>

            {slots.length < 10 && (
              <button
                onClick={handleAddSlot}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-3.5 py-1.5 text-xs font-bold border border-amber-500/30 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Project Slot
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 1: PROJECT OVERVIEW & VISUAL COMPARISON
           ══════════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-2">
            <Eye className="h-4 w-4" /> Section 1: Project Overview &amp; Visual Comparison
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slots.map((slot, idx) => {
              const comp = compoundBySlug(slot.slug);
              const avail = availabilityBySlug(slot.slug);
              return (
                <div key={slot.id} className="rounded-3xl border border-white/15 bg-slate-900 overflow-hidden flex flex-col p-4 space-y-3 relative group">
                  {/* Slot Header & Dropdown */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                      PROJECT #{idx + 1}
                    </span>
                    {slots.length > 2 && (
                      <button
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="rounded-full p-1 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors"
                        title="Remove Slot"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Project Selector Input */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveSearchSlotId(activeSearchSlotId === slot.id ? null : slot.id)}
                      className="w-full rounded-2xl border border-white/15 bg-slate-950 px-3.5 py-2 text-left text-xs font-bold text-white flex items-center justify-between hover:border-amber-500/50 transition-colors"
                    >
                      <span className="truncate">{comp ? comp.name : "Select Project..."}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                    </button>

                    {/* Dropdown Popup */}
                    {activeSearchSlotId === slot.id && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-2xl border border-white/20 bg-slate-950 p-2 shadow-2xl space-y-2">
                        <input
                          type="text"
                          placeholder="Search project..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {filteredCompounds.map((c) => (
                            <button
                              key={c.slug}
                              onClick={() => handleSelectCompound(slot.id, c.slug)}
                              className="w-full rounded-xl px-3 py-1.5 text-left text-xs font-semibold text-slate-200 hover:bg-amber-500/20 hover:text-amber-300 transition-colors truncate"
                            >
                              {c.name} ({c.developer})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* High-Res Visual Asset Placeholder / Render */}
                  {comp ? (
                    <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 relative">
                      <img src={comp.hero} alt={comp.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-2 text-[10px] font-bold text-white">
                        [Visual Render: {comp.name}]
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full rounded-2xl border border-dashed border-white/20 bg-slate-950 flex flex-col items-center justify-center p-4 text-center text-slate-500">
                      <Building2 className="h-8 w-8 mb-2 opacity-50" />
                      <span className="text-[10px]">Select project above to load visual renders</span>
                    </div>
                  )}

                  {/* Scope Selector: Whole Project vs Specific Unit Layout */}
                  {avail && avail.breakdown.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400">Comparison Granularity</label>
                      <select
                        value={slot.selectedTypeIdx}
                        onChange={(e) => handleSelectUnitType(slot.id, e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-2.5 py-1.5 text-[11px] font-bold text-amber-300 focus:outline-none cursor-pointer"
                      >
                        <option value="all">Whole Project Specs</option>
                        {avail.breakdown.map((b, bIdx) => (
                          <option key={bIdx} value={bIdx}>
                            Unit: {b.type} ({b.minSqm}m²)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 2: SIDE-BY-SIDE SPECIFICATION MATRIX
           ══════════════════════════════════════════════════════════════ */}
        <div className="space-y-4 pt-4">
          <div className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-2">
            <Sliders className="h-4 w-4" /> Section 2: Side-by-Side Specification Matrix
          </div>

          <div className="rounded-3xl border border-white/15 bg-slate-900 overflow-x-auto shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/15 bg-slate-950">
                  <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-amber-400 w-48 shrink-0">
                    Attribute
                  </th>
                  {validSlots.map((s, idx) => (
                    <th key={s.slot.id} className="p-4 text-xs font-bold text-white min-w-[200px]">
                      <div className="text-[10px] text-amber-400 font-extrabold">PROJECT #{idx + 1}</div>
                      <div className="text-sm font-black mt-0.5">{s.comp?.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{s.comp?.developer}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs">
                {visibleRows.map((row, rIdx) => {
                  const RowIcon = row.icon;
                  return (
                    <tr key={rIdx} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-bold text-slate-300 flex items-center gap-2 bg-slate-950/40">
                        <RowIcon className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>{row.label}</span>
                      </td>
                      {row.values.map((valObj, vIdx) => (
                        <td key={vIdx} className={`p-4 font-medium ${valObj.isHighlight ? "bg-amber-500/10 font-bold text-white" : "text-slate-200"}`}>
                          <div className="space-y-1">
                            <div>{valObj.text}</div>
                            {valObj.badge && (
                              <span className="inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[9px] font-black text-amber-300 border border-amber-500/40">
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

        {/* Advisor Badge Footer */}
        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-slate-950 to-slate-900 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              Official Property Atlas Advisory Sheet
            </div>
            <div className="font-display text-xl font-bold text-white mt-1">
              Representative: {metadata.agentName}
            </div>
            <div className="text-xs text-slate-300">{metadata.agentTitle}</div>
          </div>
          <div className="text-right text-xs text-slate-300 space-y-1">
            <div>Direct Phone: <strong className="text-white text-sm">{metadata.agentPhone}</strong></div>
            <button
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(validSlots.map(s => s.comp?.name).join(" vs "))}`, "_blank")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" /> Share Matrix via WhatsApp
            </button>
          </div>
        </div>

      </div>
    </Shell>
  );
}
