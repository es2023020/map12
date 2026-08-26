import { toast } from "sonner";
import { compounds } from "@/data/compounds";
import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatExactPrice } from "@/lib/currency";
import mediaRegistry from "@/data/media-registry.json";
import {
  X,
  Printer,
  Download,
  Share2,
  Check,
  Copy,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Ruler,
  Phone,
  User,
  Sparkles,
  Video,
  ImageIcon,
  Edit3,
  Eye,
  ShieldCheck,
  Plus,
  Trash2,
  RefreshCw,
  Award,
} from "lucide-react";

export interface OfferProposalData {
  clientName?: string;
  projectName: string;
  projectSlug: string;
  developerName: string;
  location?: string;
  unitType: string;
  areaSqm: number | string;
  startingPriceEgp: number;
  paymentPlanStr: string;
  dpPct: number;
  durationYrs: number;
  deliveryNote: string;
  finishing?: string;
  cluster?: string;
  maintenanceFee?: string;
  otherFees?: string;
  amenities?: string[];
  description?: string;
}

interface Props {
  data: OfferProposalData;
  onClose: () => void;
}

export function PdfProposalModal({ data, onClose }: Props) {
  const currency = useStore((s) => s.currency) || "EGP";
  const user = useStore((s) => s.user);

  const docRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // Mode (Dark vs Light) & Accent Color Presets
  const [docMode, setDocMode] = useState<"dark" | "light">("dark");
  const [accentColor, setAccentColor] = useState<"gold" | "emerald" | "indigo" | "rose">("gold");
  const [variationIndex, setVariationIndex] = useState(0);

  // Retrieve project media files from registry
  const projectMedia = (mediaRegistry.projects_media as any)?.[data.projectSlug] || [];
  const initialImages = projectMedia.filter((m: any) => m.type === "image");

  // Editable Form States
  const [clientName, setClientName] = useState(data.clientName || "Valued Client");
  const [agentName, setAgentName] = useState(user?.name || "Senior Property Consultant");
  const [agentTitle, setAgentTitle] = useState("Luxury Property Advisor");
  const [agentPhone, setAgentPhone] = useState("+20 102 932 4783");
  const [agentEmail, setAgentEmail] = useState(user?.email || "consultant@realestate.eg");
  const [agencyName, setAgencyName] = useState("Exclusive Real Estate Advisory");

  const [projectName, setProjectName] = useState(data.projectName);
  const [developerName, setDeveloperName] = useState(data.developerName);
  const [developerBrief, setDeveloperBrief] = useState(
    `${data.developerName} is one of Egypt's premier master-plan real estate developers with a proven track record of delivering luxury residential and commercial destinations with high capital appreciation.`
  );
  const [locationStr, setLocationStr] = useState(data.location || "North Coast, Egypt");
  const [unitType, setUnitType] = useState(data.unitType);
  const [areaSqm, setAreaSqm] = useState(String(data.areaSqm));
  const [totalPriceEgp, setTotalPriceEgp] = useState(data.startingPriceEgp);
  const [dpPct, setDpPct] = useState(data.dpPct || 10);
  const [durationYrs, setDurationYrs] = useState(data.durationYrs || 8);
  const [paymentPlanStr, setPaymentPlanStr] = useState(data.paymentPlanStr);
  const [deliveryNote, setDeliveryNote] = useState(data.deliveryNote || "Q4 2028");
  const [finishingStatus, setFinishingStatus] = useState(data.finishing || "Fully Finished");

  const [maintenanceFee, setMaintenanceFee] = useState(data.maintenanceFee || "8% Maintenance Deposit");
  const [otherFees, setOtherFees] = useState(data.otherFees || "Clubhouse & Underground Parking Included");
  const [projectDescription, setProjectDescription] = useState(
    data.description || `${data.projectName} by ${data.developerName} is an iconic European waterfront-inspired community engineered for low-density privacy and high lifestyle return.`
  );

  const [amenitiesList, setAmenitiesList] = useState<string[]>(
    data.amenities || ["24/7 Smart ID Security", "Crystal Lagoons & Pools", "Private Beach Access", "Clubhouse & Wellness Spa", "Commercial Retail Strip", "Underground Resident Parking"]
  );

  // Optional Media Settings
  const [includePhotos, setIncludePhotos] = useState(true);
  const [selectedPhotoPaths, setSelectedPhotoPaths] = useState<string[]>(
    initialImages.slice(0, 3).map((img: any) => img.path)
  );

  // Auto-resolve real developer and location if generic
  useEffect(() => {
    const foundComp = compounds.find(
      (c) => c.slug === data.projectSlug || c.name.toLowerCase() === data.projectName.toLowerCase()
    );
    if (foundComp) {
      if (!data.developerName || data.developerName.toLowerCase().includes("atlas") || data.developerName === "Developer") {
        setDeveloperName(foundComp.developer);
      }
      if (!data.location || data.location.toLowerCase().includes("atlas")) {
        setLocationStr(foundComp.destination.replace("-", " ").toUpperCase() + ", Egypt");
      }
      if (foundComp.blurb) {
        setProjectDescription(foundComp.blurb);
      }
      setDeveloperBrief(
        `${foundComp.developer} is one of Egypt's top-tier master-plan developers with a rich portfolio of delivered communities in ${foundComp.destination.replace("-", " ").toUpperCase()}.`
      );
    }
  }, [data]);

  // Generate alternative proposal variation (Re-wording, color palette & tone cycling)
  const handleGenerateAlternative = () => {
    const intros = [
      `Discover luxury living at ${projectName} by ${developerName} — prime location in ${locationStr} featuring exclusive masterplan architecture and world-class amenities.`,
      `Official Executive Portfolio for ${projectName} developed by ${developerName}. Positioned strategically in ${locationStr} with flexible payment schedules tailored for you.`,
      `Tailored Investment Summary for ${projectName} (${developerName}). Premium residential inventory offering high capital appreciation in ${locationStr}.`,
      `Exclusive Masterplan Release for ${projectName} by ${developerName} — prime opportunity in ${locationStr} with flexible long-term installment structures.`,
    ];

    const colors: Array<"gold" | "emerald" | "indigo" | "rose"> = ["gold", "emerald", "indigo", "rose"];
    const nextColor = colors[(colors.indexOf(accentColor) + 1) % colors.length];
    const nextIdx = (variationIndex + 1) % intros.length;

    setAccentColor(nextColor);
    setVariationIndex(nextIdx);
    setProjectDescription(intros[nextIdx]);

    toast.success(`Generated New Proposal Variation (${nextColor.toUpperCase()} Palette)!`);
  };


  // Dynamic Theme Helpers
  const getThemeClasses = () => {
    const isDark = docMode === "dark";
    let accentText = "text-amber-400";
    let accentBg = "bg-amber-500/15";
    let accentBorder = "border-amber-500/30";
    let accentBtn = "bg-amber-500 text-slate-950 hover:bg-amber-400";

    if (accentColor === "emerald") {
      accentText = isDark ? "text-emerald-400" : "text-emerald-700";
      accentBg = isDark ? "bg-emerald-500/15" : "bg-emerald-50";
      accentBorder = isDark ? "border-emerald-500/30" : "border-emerald-200";
      accentBtn = "bg-emerald-600 text-white hover:bg-emerald-500";
    } else if (accentColor === "indigo") {
      accentText = isDark ? "text-indigo-400" : "text-indigo-700";
      accentBg = isDark ? "bg-indigo-500/15" : "bg-indigo-50";
      accentBorder = isDark ? "border-indigo-500/30" : "border-indigo-200";
      accentBtn = "bg-indigo-600 text-white hover:bg-indigo-500";
    } else if (accentColor === "rose") {
      accentText = isDark ? "text-rose-400" : "text-rose-700";
      accentBg = isDark ? "bg-rose-500/15" : "bg-rose-50";
      accentBorder = isDark ? "border-rose-500/30" : "border-rose-200";
      accentBtn = "bg-rose-600 text-white hover:bg-rose-500";
    } else {
      accentText = isDark ? "text-amber-400" : "text-amber-700";
      accentBg = isDark ? "bg-amber-500/15" : "bg-amber-50";
      accentBorder = isDark ? "border-amber-500/30" : "border-amber-300";
    }

    return {
      canvasBg: isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900",
      cardBg: isDark ? "bg-slate-900/80 border-white/15" : "bg-white border-slate-200 shadow-md",
      subCardBg: isDark ? "bg-slate-950 border-white/10" : "bg-slate-100/70 border-slate-200",
      textPrimary: isDark ? "text-white" : "text-slate-900",
      textSecondary: isDark ? "text-slate-300" : "text-slate-600",
      textMuted: isDark ? "text-slate-400" : "text-slate-500",
      borderSubtle: isDark ? "border-white/10" : "border-slate-200",
      accentText,
      accentBg,
      accentBorder,
      accentBtn,
    };
  };

  const theme = getThemeClasses();

  // Financial Calculations
  const dpAmountEgp = totalPriceEgp * (dpPct / 100);
  const remainingEgp = totalPriceEgp - dpAmountEgp;
  const monthlyEgp = durationYrs > 0 ? remainingEgp / (durationYrs * 12) : 0;

  const isRtm =
    deliveryNote.toLowerCase().includes("ready") ||
    deliveryNote.toLowerCase().includes("1 month") ||
    deliveryNote.toLowerCase().includes("2026");

  const ctaText = isRtm
    ? "Reply to this offer to arrange a private site visit or viewing."
    : "Reply to this offer to schedule a presentation meeting or site visit.";

  const proposalText =
    `Hello ${clientName},

` +
    `Executive Offer: ${projectName} by ${developerName}
` +
    `Location: ${locationStr}

` +
    `Property Specifications:
` +
    `• Unit Type: ${unitType}
` +
    `• BUA: ${areaSqm} m²
` +
    `• Starting Price: ${formatExactPrice(totalPriceEgp, currency)}
` +
    `• Down Payment (${dpPct}%): ${formatExactPrice(dpAmountEgp, currency)}
` +
    `• Est. Monthly: ${formatExactPrice(monthlyEgp, currency)}/mo
` +
    `• Payment Plan: ${paymentPlanStr}
` +
    `• Delivery Date: ${deliveryNote}
` +
    `• Maintenance: ${maintenanceFee}

` +
    `${ctaText}

` +
    `Representative: ${agentName} — ${agentTitle} (${agentPhone})`;

  // Direct PDF Download using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!docRef.current) return;
    setDownloading(true);
    try {
      // @ts-ignore
      const html2canvasModule = await import(/* @vite-ignore */ "html2canvas");
      // @ts-ignore
      const jsPdfModule = await import(/* @vite-ignore */ "jspdf");

      const html2canvas = html2canvasModule.default || html2canvasModule;
      const jsPDF = jsPdfModule.jsPDF || jsPdfModule.default || jsPdfModule;

      const canvas = await html2canvas(docRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#0f172a",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${projectName.replace(/[^a-zA-Z0-9]/g, "_")}_Proposal.pdf`);
    } catch (e) {
      console.error("PDF export fallback", e);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(proposalText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(proposalText)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-5xl rounded-3xl border border-white/15 bg-slate-900 shadow-2xl overflow-hidden my-4 print:shadow-none print:border-none print:my-0">

        {/* 🌟 Unmissable Action Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950 px-6 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-base font-bold text-white leading-tight">
                Executive 3-Page Proposal Editor
              </div>
              <div className="text-[10px] text-amber-400 font-bold tracking-wide">
                Developer: {developerName} • {projectName}
              </div>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode Switcher: Dark vs Light */}
            <div className="flex items-center gap-1 rounded-2xl bg-slate-800 p-1 border border-white/10 text-xs">
              <button
                onClick={() => setDocMode("dark")}
                className={`rounded-xl px-2.5 py-1 font-bold transition-all cursor-pointer ${
                  docMode === "dark" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-300 hover:text-white"
                }`}
              >
                🌙 Dark Mode
              </button>
              <button
                onClick={() => setDocMode("light")}
                className={`rounded-xl px-2.5 py-1 font-bold transition-all cursor-pointer ${
                  docMode === "light" ? "bg-white text-slate-950 shadow-sm" : "text-slate-300 hover:text-white"
                }`}
              >
                ☀️ White Mode
              </button>
            </div>

            {/* Accent Color Palette Selector */}
            <div className="flex items-center gap-1 rounded-2xl bg-slate-800 p-1 border border-white/10 text-xs">
              <button
                onClick={() => setAccentColor("gold")}
                className={`h-5 w-5 rounded-full bg-amber-400 border-2 cursor-pointer transition-transform ${
                  accentColor === "gold" ? "border-white scale-110" : "border-transparent opacity-60"
                }`}
                title="Luxury Gold Accent"
              />
              <button
                onClick={() => setAccentColor("emerald")}
                className={`h-5 w-5 rounded-full bg-emerald-400 border-2 cursor-pointer transition-transform ${
                  accentColor === "emerald" ? "border-white scale-110" : "border-transparent opacity-60"
                }`}
                title="Emerald Green Accent"
              />
              <button
                onClick={() => setAccentColor("indigo")}
                className={`h-5 w-5 rounded-full bg-indigo-400 border-2 cursor-pointer transition-transform ${
                  accentColor === "indigo" ? "border-white scale-110" : "border-transparent opacity-60"
                }`}
                title="Royal Indigo Accent"
              />
              <button
                onClick={() => setAccentColor("rose")}
                className={`h-5 w-5 rounded-full bg-rose-400 border-2 cursor-pointer transition-transform ${
                  accentColor === "rose" ? "border-white scale-110" : "border-transparent opacity-60"
                }`}
                title="Rose Gold Accent"
              />
            </div>
            <button
              onClick={handleGenerateAlternative}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer shadow-sm"
              title="Change proposal intro wording & theme"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Regenerate Proposal</span>
            </button>

            <button
              onClick={() => setEditMode(!editMode)}
              className={`inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all border cursor-pointer ${
                editMode
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md"
                  : "border border-white/20 bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              {editMode ? <Eye className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
              {editMode ? "Preview Document" : "Edit All Details"}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {downloading ? "Generating PDF..." : "Download PDF"}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 px-3.5 py-2 text-xs font-bold border border-emerald-500/30 transition-all cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              WhatsApp
            </button>

            <button
              onClick={onClose}
              className="rounded-2xl bg-slate-800 p-2 text-slate-300 hover:bg-rose-600 hover:text-white border border-white/10 transition-colors ml-1 cursor-pointer"
              title="Close Proposal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Edit Form Drawer (Hidden when in preview mode or print) */}
        {editMode && (
          <div className="bg-slate-950 border-b border-white/10 p-6 space-y-4 print:hidden animate-in fade-in-50 duration-200">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Edit3 className="h-4 w-4" /> Live In-App Proposal Field Editor
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Agent Representative Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Agent Title &amp; Division</label>
                <input
                  type="text"
                  value={agentTitle}
                  onChange={(e) => setAgentTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Agent Phone</label>
                <input
                  type="text"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Agent Email</label>
                <input
                  type="text"
                  value={agentEmail}
                  onChange={(e) => setAgentEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Agency / Advisory Name</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Real Developer Name</label>
                <input
                  type="text"
                  value={developerName}
                  onChange={(e) => setDeveloperName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Exact Project Location</label>
                <input
                  type="text"
                  value={locationStr}
                  onChange={(e) => setLocationStr(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Starting Price (EGP)</label>
                <input
                  type="number"
                  value={totalPriceEgp}
                  onChange={(e) => setTotalPriceEgp(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Down Payment (%)</label>
                <input
                  type="number"
                  value={dpPct}
                  onChange={(e) => setDpPct(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Duration (Years)</label>
                <input
                  type="number"
                  value={durationYrs}
                  onChange={(e) => setDurationYrs(parseInt(e.target.value, 10) || 0)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Developer Track Record &amp; Brief</label>
              <textarea
                rows={2}
                value={developerBrief}
                onChange={(e) => setDeveloperBrief(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 📄 3-PAGE EXECUTIVE LUXURY PROPOSAL CANVAS */}
        <div ref={docRef} className={`p-6 sm:p-10 space-y-12 font-sans transition-colors duration-300 ${theme.canvasBg}`}>

          {/* ─── PAGE 1: EXECUTIVE COVER & DEVELOPER OVERVIEW ─── */}
          <div className={`rounded-3xl border p-8 space-y-6 shadow-2xl backdrop-blur-xl transition-colors duration-300 ${theme.cardBg}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                  {agencyName}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </div>

            <div className="space-y-2">
              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                Official Executive Portfolio
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {projectName}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-white">
                  <Building2 className="h-4 w-4 text-amber-400" /> Real Developer: {developerName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="h-4 w-4 text-amber-400" /> {locationStr}
                </span>
              </p>
            </div>

            {/* Client Greeting Box */}
            <div className="rounded-2xl bg-slate-950 p-5 border border-white/10 space-y-2">
              <div className="font-bold text-white text-sm">Prepared Exclusively For: {clientName}</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {projectDescription}
              </p>
            </div>

            {/* Real Developer Overview Brief */}
            <div className="rounded-2xl bg-amber-500/10 p-5 border border-amber-500/25 space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-400" /> Developer Reputation &amp; Track Record ({developerName})
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {developerBrief}
              </p>
            </div>
          </div>

          {/* ─── PAGE 2: SPECIFICATIONS, PRICING & PAYMENT SCHEDULE ─── */}
          <div className={`rounded-3xl border p-8 space-y-6 shadow-2xl backdrop-blur-xl transition-colors duration-300 ${theme.cardBg}`}>
            <div className="text-xs font-extrabold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Page 2: Property Specifications &amp; Payment Breakdown
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-2xl bg-slate-950 p-4 border border-white/10">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Unit Type</div>
                <div className="font-bold text-white text-sm mt-1">{unitType}</div>
              </div>
              <div className="rounded-2xl bg-slate-950 p-4 border border-white/10">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Built-up Area (BUA)</div>
                <div className="font-bold text-white text-sm mt-1">{areaSqm} m²</div>
              </div>
              <div className="rounded-2xl bg-amber-500/20 p-4 border border-amber-500/40 col-span-2 sm:col-span-2">
                <div className="text-[9px] font-bold text-amber-400 uppercase">Starting Total Price</div>
                <div className="font-display text-xl font-black text-white mt-0.5">
                  {formatExactPrice(totalPriceEgp, currency)}
                </div>
              </div>
            </div>

            {/* Payment Schedule Breakdown Card */}
            <div className="rounded-2xl bg-slate-950 p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                <span className="font-bold text-white uppercase tracking-wider">Payment Schedule</span>
                <span className="font-bold text-amber-400">{dpPct}% Down Payment over {durationYrs} Years</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-900 p-4 text-center border border-white/10">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Down Payment ({dpPct}%)</div>
                  <div className="font-bold text-white text-base mt-1">{formatExactPrice(dpAmountEgp, currency)}</div>
                </div>

                <div className="rounded-xl bg-slate-900 p-4 text-center border border-amber-500/50">
                  <div className="text-[9px] font-bold text-amber-400 uppercase">Est. Monthly Payment</div>
                  <div className="font-black text-white text-base mt-1">
                    {monthlyEgp > 0 ? `${formatExactPrice(monthlyEgp, currency)}/mo` : "Custom Terms"}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-900 p-4 text-center border border-white/10">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Estimated Delivery</div>
                  <div className="font-bold text-white text-base mt-1">{deliveryNote}</div>
                </div>
              </div>
            </div>

            {/* Maintenance & Additional Terms */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl bg-slate-950 p-4 border border-white/10">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Maintenance Deposit</div>
                <div className="font-bold text-white mt-1">{maintenanceFee}</div>
              </div>
              <div className="rounded-2xl bg-slate-950 p-4 border border-white/10">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Included Amenities &amp; Extras</div>
                <div className="font-bold text-white mt-1">{otherFees}</div>
              </div>
            </div>
          </div>

          {/* ─── PAGE 3: AMENITIES, VISUAL GALLERY & AGENT CONTACT BADGE ─── */}
          <div className={`rounded-3xl border p-8 space-y-6 shadow-2xl backdrop-blur-xl transition-colors duration-300 ${theme.cardBg}`}>
            <div className="text-xs font-extrabold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Page 3: Master Plan Features &amp; Representative Details
            </div>

            {/* Amenities Grid */}
            {amenitiesList.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Lifestyle Amenities</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {amenitiesList.map((item, i) => (
                    <span key={i} className="rounded-xl bg-slate-950 border border-white/10 px-3 py-1.5 font-semibold text-slate-200">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Architectural Visual Gallery */}
            {includePhotos && selectedPhotoPaths.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Architectural Renders</div>
                <div className="grid grid-cols-3 gap-3">
                  {selectedPhotoPaths.map((path, i) => (
                    <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                      <img src={path} alt={`Render ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Executive Agent Badge & Representative Details */}
            <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-r from-slate-950 to-slate-900 p-6 sm:p-8 space-y-4 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                    Official Advisory Representative
                  </div>
                  <div className="font-display text-xl font-bold text-white mt-1">
                    {agentName}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {agentTitle} • <strong className="text-white">{agencyName}</strong>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-300 space-y-1">
                  <div>Direct Phone: <strong className="text-white text-sm">{agentPhone}</strong></div>
                  <div>Email: <span className="text-slate-300">{agentEmail}</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>To schedule a private viewing for <strong>{projectName}</strong>, contact your advisor above.</span>
                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share via WhatsApp
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sticky Action Footer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-slate-950 px-6 py-4 print:hidden">
          <div className="text-xs text-slate-400">
            Client: <strong className="text-white">{clientName}</strong> • Real Developer: <strong className="text-amber-400">{developerName}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAlternative}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Regenerate Variation
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" /> {downloading ? "Generating PDF..." : "Download PDF"}
            </button>

            <button
              onClick={onClose}
              className="rounded-2xl border border-white/15 bg-slate-800 px-4 py-1.5 text-xs font-bold text-slate-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
            >
              Close Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
