import { toast } from "sonner";
import { compounds } from "@/data/compounds";
import { projectImages } from "@/data/project-images";
import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { formatExactPrice } from "@/lib/currency";
import { formatDeliveryStatus } from "@/lib/delivery";
import mediaRegistry from "@/data/media-registry.json";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Share2,
  Building2,
  MapPin,
  Sparkles,
  Edit3,
  Award,
  Compass,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  HardHat,
  Trees,
  Briefcase,
  Phone,
  User,
  FileText,
  DollarSign,
  Calendar,
  Grid,
  Image as ImageIcon,
  Check,
} from "lucide-react";

export interface OfferProposalData {
  clientName?: string;
  agentName?: string;
  agentPhone?: string;
  agentTitle?: string;
  unitCode?: string;
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
  maintenancePct?: number;
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
  const [editMode, setEditMode] = useState(false);
  const [zoomScale, setZoomScale] = useState(100);

  const handleZoomIn = () => setZoomScale((z) => Math.min(z + 20, 200));
  const handleZoomOut = () => setZoomScale((z) => Math.max(z - 20, 50));
  const handleResetZoom = () => setZoomScale(100);

  // Theme & Accent Color Presets
  const [docMode, setDocMode] = useState<"dark" | "light">("dark");
  const [accentColor, setAccentColor] = useState<"gold" | "emerald" | "indigo" | "rose">("gold");
  const [variationIndex, setVariationIndex] = useState(0);

  // Agent & Client State
  const [clientName, setClientName] = useState(data.clientName || "Valued Client");
  const [agentName, setAgentName] = useState(data.agentName || user?.name || "Senior Property Consultant");
  const [agentTitle, setAgentTitle] = useState(data.agentTitle || "Luxury Real Estate Advisor");
  const [agentPhone, setAgentPhone] = useState(data.agentPhone || "+20 102 932 4783");
  const [agentEmail, setAgentEmail] = useState(user?.email || "advisor@realestate.eg");
  const [agencyName, setAgencyName] = useState("Exclusive Real Estate Advisory");

  // Property Details State
  const [unitCode, setUnitCode] = useState(data.unitCode || `UN-${Math.floor(100 + Math.random() * 900)}`);
  const [projectName, setProjectName] = useState(data.projectName);
  const [developerName, setDeveloperName] = useState(data.developerName);
  const [developerBrief, setDeveloperBrief] = useState(
    `${data.developerName} is a premier master-plan developer in Egypt with a proven track record of delivering luxury residential and commercial destinations with high capital appreciation.`
  );
  const [locationStr, setLocationStr] = useState(data.location || "North Coast, Egypt");
  const [locationHighlights, setLocationHighlights] = useState([
    "Direct Access to International Coastal Highway & Main Arteries",
    "15 Minutes from Regional Airport & Commercial Hubs",
    "Prime Waterfront Elevation with Unobstructed Views",
    "Surrounded by Top-Tier Hospitality Resorts & Yacht Marinas",
  ]);

  const [unitType, setUnitType] = useState(data.unitType);
  const [areaSqm, setAreaSqm] = useState(String(data.areaSqm));
  const [totalPriceEgp, setTotalPriceEgp] = useState(data.startingPriceEgp);
  const [dpPct, setDpPct] = useState(data.dpPct || 10);
  const [durationYrs, setDurationYrs] = useState(data.durationYrs || 8);
  const [paymentPlanStr, setPaymentPlanStr] = useState(data.paymentPlanStr);
  const [deliveryNote, setDeliveryNote] = useState(
    data.deliveryNote ? formatDeliveryStatus(data.deliveryNote).label : "Off-Plan (In 2.5 Years)"
  );
  const [finishingStatus, setFinishingStatus] = useState(data.finishing || "Fully Finished w/ ACs");

  // Maintenance & Fees
  const [maintenancePct, setMaintenancePct] = useState(data.maintenancePct || 8);
  const [otherFees, setOtherFees] = useState(data.otherFees || "Clubhouse Membership & Underground Resident Parking Included");
  const [projectDescription, setProjectDescription] = useState(
    data.description || `${data.projectName} by ${data.developerName} is an iconic waterfront-inspired community engineered for low-density privacy and exceptional investment growth.`
  );

  const [amenitiesList, setAmenitiesList] = useState<string[]>(
    data.amenities && data.amenities.length > 0
      ? data.amenities
      : [
          "24/7 Smart Gate Security & CCTV Surveillance",
          "Crystal Swimmable Lagoons & Infinity Pools",
          "Private Beach Club & Watersports Hub",
          "Wellness Spa, Gym & Sports Courts",
          "Boutique Commercial Retail Strip & Fine Dining",
          "Underground Resident & Visitor Parking",
          "Lush Green Spine & Running / Cycling Trails",
          "Children's Aqua Park & Outdoor Playgrounds",
        ]
  );

  // Strategic Partners State
  const [masterplanner, setMasterplanner] = useState("WATG / Sasaki International");
  const [architectFirm, setArchitectFirm] = useState("CallisonRTKL Architects");
  const [mainContractor, setMainContractor] = useState("Orascom Construction / Hassan Allam");
  const [landscapePartner, setLandscapePartner] = useState("Sites International Landscape");
  const [facilityManager, setFacilityManager] = useState("EnviroFix & Luxury Hospitality Ops");

  // Project Masterplan & Photos Gathering
  const foundComp = compounds.find(
    (c) => c.slug === data.projectSlug || c.name.toLowerCase() === data.projectName.toLowerCase()
  );

  const realMasterplanUrl =
    foundComp?.masterPlanUrl || (foundComp as any)?.masterplanUrl || null;

  // Gather pictures from projectImages, compound gallery, hero, and mediaRegistry
  const localProjImages = projectImages[data.projectSlug] || projectImages[foundComp?.slug || ""] || [];
  const registryMedia = ((mediaRegistry.projects_media as any)?.[data.projectSlug] || [])
    .filter((m: any) => m.type === "image")
    .map((m: any) => m.path);
  const compGallery = foundComp?.gallery || [];
  const compHero = foundComp?.hero ? [foundComp.hero] : [];

  const allCollectedImages = Array.from(
    new Set([...localProjImages, ...compGallery, ...registryMedia, ...compHero])
  ).filter((src) => Boolean(src) && typeof src === "string");

  const [selectedPhotoPaths, setSelectedPhotoPaths] = useState<string[]>(
    allCollectedImages.length > 0
      ? allCollectedImages.slice(0, 12)
      : [
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
          "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
        ]
  );

  // Auto-resolve developer & location details
  useEffect(() => {
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
        `${foundComp.developer} is one of Egypt's premier master-plan real estate developers with a top-tier portfolio of delivered communities in ${foundComp.destination.replace("-", " ").toUpperCase()}.`
      );
    }
  }, [data, foundComp]);

  // Financial Calculations
  const maintenanceFeeEgp = totalPriceEgp * (maintenancePct / 100);
  const baseTotalPriceInclMaint = totalPriceEgp + maintenanceFeeEgp;

  const dpAmountEgp = totalPriceEgp * (dpPct / 100);
  const remainingEgp = totalPriceEgp - dpAmountEgp;

  const totalMonths = Math.max(durationYrs * 12, 1);
  const totalQuarters = Math.max(durationYrs * 4, 1);
  const totalYears = Math.max(durationYrs, 1);

  const monthlyInstallment = remainingEgp / totalMonths;
  const quarterlyInstallment = remainingEgp / totalQuarters;
  const annualInstallment = remainingEgp / totalYears;

  const cashDiscountEgp = totalPriceEgp * 0.3; // 30% cash discount estimate
  const cashPriceEgp = totalPriceEgp - cashDiscountEgp;

  // Theme styling helpers
  const getThemeClasses = () => {
    const isDark = docMode === "dark";
    let accentText = "text-amber-400";
    let accentBg = "bg-amber-500/15";
    let accentBorder = "border-amber-500/30";

    if (accentColor === "emerald") {
      accentText = isDark ? "text-emerald-400" : "text-emerald-700";
      accentBg = isDark ? "bg-emerald-500/15" : "bg-emerald-50";
      accentBorder = isDark ? "border-emerald-500/30" : "border-emerald-200";
    } else if (accentColor === "indigo") {
      accentText = isDark ? "text-indigo-400" : "text-indigo-700";
      accentBg = isDark ? "bg-indigo-500/15" : "bg-indigo-50";
      accentBorder = isDark ? "border-indigo-500/30" : "border-indigo-200";
    } else if (accentColor === "rose") {
      accentText = isDark ? "text-rose-400" : "text-rose-700";
      accentBg = isDark ? "bg-rose-500/15" : "bg-rose-50";
      accentBorder = isDark ? "border-rose-500/30" : "border-rose-200";
    }

    return {
      canvasBg: isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900",
      cardBg: isDark ? "bg-slate-900/90 border-white/15 shadow-2xl" : "bg-white border-slate-200 shadow-xl",
      subCardBg: isDark ? "bg-slate-950 border-white/10" : "bg-slate-100/80 border-slate-200",
      textPrimary: isDark ? "text-white" : "text-slate-900",
      textSecondary: isDark ? "text-slate-300" : "text-slate-700",
      textMuted: isDark ? "text-slate-400" : "text-slate-500",
      borderSubtle: isDark ? "border-white/10" : "border-slate-200",
      accentText,
      accentBg,
      accentBorder,
    };
  };

  const theme = getThemeClasses();

  // Multi-Page PDF Download using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!docRef.current) return;
    setDownloading(true);
    toast.info("Generating multi-page high resolution PDF proposal...");
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
        backgroundColor: docMode === "dark" ? "#090d16" : "#f8fafc",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
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

      pdf.save(`${projectName.replace(/[^a-zA-Z0-9]/g, "_")}_Proposal_${unitCode}.pdf`);
      toast.success("Executive PDF Proposal downloaded successfully!");
    } catch (e) {
      console.error("PDF export fallback", e);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  // Quick WhatsApp Share
  const handleShareWhatsApp = () => {
    const text = `Hello ${clientName},\n\n` +
      `Official Executive Offer: ${projectName} (${developerName})\n` +
      `• Unit Code: ${unitCode}\n` +
      `• Type: ${unitType} (${areaSqm} m²)\n` +
      `• Starting Base Price: ${formatExactPrice(totalPriceEgp, currency)}\n` +
      `• Maintenance Fee (${maintenancePct}%): ${formatExactPrice(maintenanceFeeEgp, currency)}\n` +
      `• Base Total Price (incl. Maint.): ${formatExactPrice(baseTotalPriceInclMaint, currency)}\n` +
      `• Down Payment (${dpPct}%): ${formatExactPrice(dpAmountEgp, currency)}\n` +
      `• Est. Monthly: ${formatExactPrice(monthlyInstallment, currency)}/mo (${durationYrs} Yrs)\n` +
      `• Delivery: ${deliveryNote}\n\n` +
      `Representative: ${agentName} (${agentTitle})\nDirect Phone: ${agentPhone}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Calculate page count estimate (5 core sections + photo gallery pages)
  const galleryPages = Math.ceil(selectedPhotoPaths.length / 4);
  const totalPagesEstimate = 5 + galleryPages;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-2 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-5xl rounded-3xl border border-white/15 bg-slate-900 shadow-2xl overflow-hidden my-4 print:shadow-none print:border-none print:my-0">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950 px-6 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-base font-bold text-white leading-tight flex items-center gap-2">
                <span>Executive {totalPagesEstimate}-Page Proposal Editor</span>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                  Unit: {unitCode}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Client: <strong className="text-amber-400">{clientName}</strong> • Advisor: <strong className="text-white">{agentName}</strong> ({agentPhone})
              </div>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 rounded-2xl bg-slate-800 p-1 border border-white/10 text-xs">
              <button
                onClick={() => setDocMode("dark")}
                className={`rounded-xl px-2.5 py-1 font-bold transition-all cursor-pointer ${
                  docMode === "dark" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-300 hover:text-white"
                }`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => setDocMode("light")}
                className={`rounded-xl px-2.5 py-1 font-bold transition-all cursor-pointer ${
                  docMode === "light" ? "bg-white text-slate-950 shadow-sm" : "text-slate-300 hover:text-white"
                }`}
              >
                ☀️ Light
              </button>
            </div>

            {/* Accent Color Palette */}
            <div className="flex items-center gap-1 rounded-2xl bg-slate-800 p-1 border border-white/10 text-xs">
              <button
                onClick={() => setAccentColor("gold")}
                className={`h-4 w-4 rounded-full bg-amber-400 border-2 cursor-pointer transition-transform ${
                  accentColor === "gold" ? "border-white scale-110" : "border-transparent opacity-60"
                }`}
                title="Gold Accent"
              />
              <button
                onClick={() => setAccentColor("emerald")}
                className={`h-4 w-4 rounded-full bg-emerald-400 border-2 cursor-pointer transition-transform ${
                  accentColor === "emerald" ? "border-white scale-110" : "border-transparent opacity-60"
                }`}
                title="Emerald Accent"
              />
              <button
                onClick={() => setAccentColor("indigo")}
                className={`h-4 w-4 rounded-full bg-indigo-400 border-2 cursor-pointer transition-transform ${
                  accentColor === "indigo" ? "border-white scale-110" : "border-transparent opacity-60"
                }`}
                title="Indigo Accent"
              />
              <button
                onClick={() => setAccentColor("rose")}
                className={`h-4 w-4 rounded-full bg-rose-400 border-2 cursor-pointer transition-transform ${
                  accentColor === "rose" ? "border-white scale-110" : "border-transparent opacity-60"
                }`}
                title="Rose Accent"
              />
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 rounded-2xl bg-slate-800 p-1 border border-white/10 text-xs text-white">
              <button onClick={handleZoomOut} className="rounded-xl p-1 hover:bg-slate-700 cursor-pointer">
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="px-1 font-mono font-bold text-amber-400 text-xs">{zoomScale}%</span>
              <button onClick={handleZoomIn} className="rounded-xl p-1 hover:bg-slate-700 cursor-pointer">
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              className={`inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-black transition-all border cursor-pointer ${
                editMode
                  ? "bg-amber-400 text-slate-950 border-amber-300 shadow"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 hover:from-amber-400 hover:to-amber-500 shadow"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{editMode ? "Hide Editor" : "EDIT ALL DETAILS"}</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {downloading ? "Generating PDF..." : "Download PDF"}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 px-3 py-2 text-xs font-bold border border-emerald-500/30 transition-all cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" /> WhatsApp
            </button>

            <button
              onClick={onClose}
              className="rounded-2xl bg-slate-800 p-2 text-slate-300 hover:bg-rose-600 hover:text-white border border-white/10 transition-colors ml-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* In-App Live Editor Panel Drawer */}
        {editMode && (
          <div className="bg-slate-950 border-b border-white/10 p-6 space-y-4 print:hidden animate-in fade-in-50 duration-200">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Edit3 className="h-4 w-4" /> Comprehensive In-App Proposal Field Editor
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Code</label>
                <input
                  type="text"
                  value={unitCode}
                  onChange={(e) => setUnitCode(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
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
                <label className="text-[10px] font-bold text-slate-400 uppercase">Agent Representative</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
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
                <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Type</label>
                <input
                  type="text"
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Indoor Area BUA (m²)</label>
                <input
                  type="text"
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Base Unit Price (EGP)</label>
                <input
                  type="number"
                  value={totalPriceEgp}
                  onChange={(e) => setTotalPriceEgp(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Maintenance Deposit (%)</label>
                <input
                  type="number"
                  value={maintenancePct}
                  onChange={(e) => setMaintenancePct(parseFloat(e.target.value) || 0)}
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
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Delivery Date Note</label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Finishing Spec</label>
                <input
                  type="text"
                  value={finishingStatus}
                  onChange={(e) => setFinishingStatus(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Strategic Partners Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-white/10">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Masterplanner &amp; Architect</label>
                <input
                  type="text"
                  value={masterplanner}
                  onChange={(e) => setMasterplanner(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Main Construction Contractor</label>
                <input
                  type="text"
                  value={mainContractor}
                  onChange={(e) => setMainContractor(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Landscape &amp; Facility Ops</label>
                <input
                  type="text"
                  value={landscapePartner}
                  onChange={(e) => setLandscapePartner(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* 📄 FULL MULTI-PAGE EXECUTIVE PDF CANVAS */}
        <div
          ref={docRef}
          className={`p-6 sm:p-10 space-y-12 font-sans transition-all duration-200 origin-top ${theme.canvasBg}`}
          style={{ transform: `scale(${zoomScale / 100})`, transformOrigin: "top center" }}
        >
          {/* ══════════════════════════════════════════════════════════════
              SECTION 1: EXECUTIVE SUMMARY & LOCATION ADVANTAGE
             ══════════════════════════════════════════════════════════════ */}
          <div className={`rounded-3xl border p-8 space-y-6 ${theme.cardBg} print:break-after-page`}>
            {/* Agency Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                  {agencyName} • Official Proposal
                </span>
              </div>
              <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
                <span>Unit Code: <strong className="text-white">{unitCode}</strong></span>
                <span>•</span>
                <span>Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                  1. Executive Summary &amp; Location Advantage
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {projectName}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-white">
                  <Building2 className="h-4 w-4 text-amber-400" /> Real Developer: {developerName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="h-4 w-4 text-amber-400" /> {locationStr}
                </span>
              </p>
            </div>

            {/* Client Prepared Card */}
            <div className="rounded-2xl bg-slate-950 p-6 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-amber-400" /> Prepared Exclusively For: <span className="text-amber-400">{clientName}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Confidential Offer</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {projectDescription}
              </p>
            </div>

            {/* Developer Reputation Brief */}
            <div className="rounded-2xl bg-amber-500/10 p-5 border border-amber-500/25 space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-amber-400" /> Developer Reputation &amp; Portfolio Track Record ({developerName})
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {developerBrief}
              </p>
            </div>

            {/* Strategic Location Advantage Grid */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Compass className="h-4 w-4 text-amber-400" /> Strategic Location &amp; Landmark Connectivity
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {locationHighlights.map((item, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-950 p-3.5 border border-white/10 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 2: PROJECT MASTER PLAN & KEY AMENITIES
             ══════════════════════════════════════════════════════════════ */}
          <div className={`rounded-3xl border p-8 space-y-6 ${theme.cardBg} print:break-after-page`}>
            <div className="text-xs font-extrabold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-3 flex items-center gap-2">
              <Layers className="h-4 w-4" /> 2. Project Master Plan &amp; Key Lifestyle Amenities
            </div>

            {/* REAL MASTERPLAN IMAGE EMBEDDED DIRECTLY IN SECTION 2 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Grid className="h-4 w-4 text-amber-400" /> Official Masterplan Layout &amp; Zoning
                </div>
                <span className="text-[10px] text-amber-400 font-semibold">
                  Low-Density Footprint • Green Spine Integration
                </span>
              </div>

              <div className="relative rounded-2xl border border-white/15 bg-slate-950 p-4 overflow-hidden group shadow-inner">
                {realMasterplanUrl ? (
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center">
                    <img
                      src={realMasterplanUrl}
                      alt={`${projectName} Masterplan`}
                      className="max-h-[380px] w-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  // Elegant SVG Masterplan Layout Diagram Fallback
                  <div className="aspect-[16/9] w-full rounded-xl bg-slate-900/90 border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                        {projectName} Architectural Master Plan
                      </div>
                      <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        80%+ Greenery &amp; Lagoons
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 my-auto relative z-10 text-center">
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                        <div className="text-xs font-bold text-white">Residential Zone</div>
                        <div className="text-[10px] text-amber-300 mt-1">Tiered Villas &amp; Low-rise Chalets</div>
                      </div>
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                        <div className="text-xs font-bold text-white">Central Lagoon Spine</div>
                        <div className="text-[10px] text-emerald-300 mt-1">Swimmable Crystal Lagoons</div>
                      </div>
                      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                        <div className="text-xs font-bold text-white">Commercial Strip</div>
                        <div className="text-[10px] text-indigo-300 mt-1">Retail Promenade &amp; Dining</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-2 relative z-10">
                      <span>Developer: {developerName}</span>
                      <span>Location: {locationStr}</span>
                      <span>Scale: Low Footprint Masterplan</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Amenities Grid */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" /> Integrated Key Lifestyle Amenities
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                {amenitiesList.map((item, i) => (
                  <div key={i} className="rounded-xl bg-slate-950 border border-white/10 p-3 font-semibold text-slate-200 flex items-center gap-2 shadow-sm">
                    <Check className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 3: UNIT SPECIFICATIONS & TOTAL PRICING
             ══════════════════════════════════════════════════════════════ */}
          <div className={`rounded-3xl border p-8 space-y-6 ${theme.cardBg} print:break-after-page`}>
            <div className="text-xs font-extrabold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" /> 3. Unit Specifications &amp; Comprehensive Pricing Breakdown
            </div>

            {/* Main Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="rounded-2xl bg-slate-950 p-4 border border-white/10">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Unit Code</div>
                <div className="font-bold text-amber-400 text-base mt-1">{unitCode}</div>
              </div>
              <div className="rounded-2xl bg-slate-950 p-4 border border-white/10">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Unit Layout / Type</div>
                <div className="font-bold text-white text-sm mt-1">{unitType}</div>
              </div>
              <div className="rounded-2xl bg-slate-950 p-4 border border-white/10">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Indoor Area (BUA)</div>
                <div className="font-bold text-white text-sm mt-1">{areaSqm} m²</div>
              </div>
              <div className="rounded-2xl bg-slate-950 p-4 border border-white/10">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Finishing Spec</div>
                <div className="font-bold text-white text-xs mt-1">{finishingStatus}</div>
              </div>
            </div>

            {/* Detailed Price & Maintenance Table */}
            <div className="rounded-2xl bg-slate-950 border border-white/15 overflow-hidden">
              <div className="bg-slate-900/80 px-6 py-3 border-b border-white/10 font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Property Pricing Component</span>
                <span>Amount ({currency})</span>
              </div>

              <div className="divide-y divide-white/10 text-xs text-slate-200">
                <div className="flex items-center justify-between px-6 py-3.5">
                  <span className="font-semibold text-slate-300">Base Unit Price</span>
                  <span className="font-bold text-white text-sm">{formatExactPrice(totalPriceEgp, currency)}</span>
                </div>

                <div className="flex items-center justify-between px-6 py-3.5 bg-amber-500/5">
                  <div>
                    <span className="font-semibold text-slate-200">Maintenance Fees ({maintenancePct}%)</span>
                    <div className="text-[10px] text-slate-400">One-time maintenance deposit upon delivery</div>
                  </div>
                  <span className="font-bold text-amber-300 text-sm">{formatExactPrice(maintenanceFeeEgp, currency)}</span>
                </div>

                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-t-2 border-amber-500/40">
                  <div>
                    <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">Base Total Price</div>
                    <div className="text-xs font-bold text-white">(Unit Price + Maintenance Fees)</div>
                  </div>
                  <div className="font-display text-2xl font-black text-white">
                    {formatExactPrice(baseTotalPriceInclMaint, currency)}
                  </div>
                </div>
              </div>
            </div>

            {/* Extras Note */}
            <div className="rounded-xl bg-slate-950 p-4 border border-white/10 text-xs text-slate-300 flex items-center justify-between">
              <span className="font-medium">Included Extras &amp; Amenities:</span>
              <span className="font-bold text-amber-400">{otherFees}</span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 4: PAYMENT PLAN OPTIONS
             ══════════════════════════════════════════════════════════════ */}
          <div className={`rounded-3xl border p-8 space-y-6 ${theme.cardBg} print:break-after-page`}>
            <div className="text-xs font-extrabold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> 4. Payment Plan Options &amp; Detailed Financial Schedule
            </div>

            {/* Core Schedule Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-2xl bg-slate-950 p-5 border border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Down Payment ({dpPct}%)</div>
                <div className="font-display text-xl font-black text-amber-400 mt-1">{formatExactPrice(dpAmountEgp, currency)}</div>
                <div className="text-[10px] text-slate-400 mt-1">Due Upon Reservation</div>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5 border border-amber-500/40 text-center">
                <div className="text-[10px] font-bold text-amber-400 uppercase">Installment Duration</div>
                <div className="font-display text-xl font-black text-white mt-1">{durationYrs} Equal Years</div>
                <div className="text-[10px] text-slate-400 mt-1">{paymentPlanStr}</div>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5 border border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Target Delivery Date</div>
                <div className="font-display text-lg font-bold text-white mt-1">{deliveryNote}</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1">Guaranteed Delivery Key</div>
              </div>
            </div>

            {/* Comprehensive Payment Schedule Table */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Installment Breakdown Schedules
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Monthly Option */}
                <div className="rounded-2xl bg-slate-950 p-5 border border-white/15 space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-amber-400">Option A: Monthly Installments</div>
                  <div className="font-display text-xl font-black text-white">
                    {formatExactPrice(monthlyInstallment, currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Payable every month for {totalMonths} months
                  </div>
                </div>

                {/* Quarterly Option */}
                <div className="rounded-2xl bg-slate-950 p-5 border border-amber-500/40 space-y-2 bg-amber-500/5">
                  <div className="text-[10px] font-extrabold uppercase text-amber-400">Option B: Quarterly Installments</div>
                  <div className="font-display text-xl font-black text-white">
                    {formatExactPrice(quarterlyInstallment, currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Payable every 3 months ({totalQuarters} installments)
                  </div>
                </div>

                {/* Annual Option */}
                <div className="rounded-2xl bg-slate-950 p-5 border border-white/15 space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-amber-400">Option C: Annual Installments</div>
                  <div className="font-display text-xl font-black text-white">
                    {formatExactPrice(annualInstallment, currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Payable every 12 months ({totalYears} installments)
                  </div>
                </div>
              </div>
            </div>

            {/* Cash Discount & Payment Notes */}
            <div className="rounded-2xl bg-emerald-500/10 p-5 border border-emerald-500/30 flex items-center justify-between text-xs text-slate-200">
              <div>
                <div className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                  Special Upfront Cash Payment Offer
                </div>
                <div className="text-slate-300 text-xs mt-0.5">
                  Pay full cash upfront and save up to 30% on base unit price.
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Estimated Cash Price</div>
                <div className="font-display text-lg font-black text-emerald-300">
                  {formatExactPrice(cashPriceEgp, currency)}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 5: STRATEGIC PARTNERS & REPRESENTATIVE DETAILS
             ══════════════════════════════════════════════════════════════ */}
          <div className={`rounded-3xl border p-8 space-y-6 ${theme.cardBg} print:break-after-page`}>
            <div className="text-xs font-extrabold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-3 flex items-center gap-2">
              <Landmark className="h-4 w-4" /> 5. Strategic Partners &amp; Representative Credentials
            </div>

            {/* Strategic Partners Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-2xl bg-slate-950 p-4 border border-white/10 space-y-1">
                <div className="text-[10px] font-extrabold text-amber-400 uppercase flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5" /> Masterplanner &amp; Architect
                </div>
                <div className="font-bold text-white text-sm">{masterplanner}</div>
                <div className="text-[10px] text-slate-400">Global Architectural Excellence</div>
              </div>

              <div className="rounded-2xl bg-slate-950 p-4 border border-white/10 space-y-1">
                <div className="text-[10px] font-extrabold text-amber-400 uppercase flex items-center gap-1.5">
                  <HardHat className="h-3.5 w-3.5" /> Main Construction Partner
                </div>
                <div className="font-bold text-white text-sm">{mainContractor}</div>
                <div className="text-[10px] text-slate-400">Class-A General Contracting</div>
              </div>

              <div className="rounded-2xl bg-slate-950 p-4 border border-white/10 space-y-1">
                <div className="text-[10px] font-extrabold text-amber-400 uppercase flex items-center gap-1.5">
                  <Trees className="h-3.5 w-3.5" /> Landscape Architecture
                </div>
                <div className="font-bold text-white text-sm">{landscapePartner}</div>
                <div className="text-[10px] text-slate-400">Botanical &amp; Water Features</div>
              </div>
            </div>

            {/* Official Agent Representative Badge */}
            <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-r from-slate-950 to-slate-900 p-6 sm:p-8 space-y-4 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> Official Advisory Representative
                  </div>
                  <div className="font-display text-2xl font-black text-white mt-1">
                    {agentName}
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    {agentTitle} • <strong className="text-white">{agencyName}</strong>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-300 space-y-1">
                  <div>Direct Phone: <strong className="text-white text-sm">{agentPhone}</strong></div>
                  <div>Email: <span className="text-amber-400 font-semibold">{agentEmail}</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>To schedule a private viewing or site presentation for <strong>{projectName}</strong>, contact your advisor above.</span>
                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all cursor-pointer shadow"
                >
                  <Share2 className="h-3.5 w-3.5" /> Contact via WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              PAGES 6+: ARCHITECTURAL PROJECT RENDERS & PICTURES GALLERY
             ══════════════════════════════════════════════════════════════ */}
          {selectedPhotoPaths.length > 0 && (
            <div className="space-y-12">
              {Array.from({ length: Math.ceil(selectedPhotoPaths.length / 4) }).map((_, pageIdx) => {
                const pagePhotos = selectedPhotoPaths.slice(pageIdx * 4, pageIdx * 4 + 4);
                return (
                  <div
                    key={pageIdx}
                    className={`rounded-3xl border p-8 space-y-6 ${theme.cardBg} print:break-after-page`}
                  >
                    <div className="text-xs font-extrabold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" /> Page {6 + pageIdx}: {projectName} Architectural Gallery
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Real Project Renders &amp; Visuals
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {pagePhotos.map((path, i) => (
                        <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 bg-slate-950 shadow-lg relative group">
                          <img
                            src={path}
                            alt={`${projectName} Render ${pageIdx * 4 + i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-3 text-[10px] font-bold text-white flex items-center justify-between">
                            <span>{projectName} Visual {pageIdx * 4 + i + 1}</span>
                            <span className="text-amber-400">{developerName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Bottom Sticky Action Footer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-slate-950 px-6 py-4 print:hidden">
          <div className="text-xs text-slate-400">
            Client: <strong className="text-white">{clientName}</strong> • Unit: <strong className="text-amber-400">{unitCode}</strong> • Total Pages: <strong className="text-white">{totalPagesEstimate} Pages</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" /> {downloading ? "Generating Multi-Page PDF..." : "Download Multi-Page PDF"}
            </button>

            <button
              onClick={onClose}
              className="rounded-2xl border border-white/15 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
            >
              Close Proposal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
