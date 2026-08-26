import { useState, useRef } from "react";
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

  // Retrieve project media files from registry
  const projectMedia = (mediaRegistry.projects_media as any)?.[data.projectSlug] || [];
  const initialImages = projectMedia.filter((m: any) => m.type === "image");
  const initialVideos = projectMedia.filter((m: any) => m.type === "video");

  // Editable Form States
  const [clientName, setClientName] = useState(data.clientName || "Valued Client");
  const [agentName, setAgentName] = useState(user?.name || "Senior Real Estate Consultant");
  const [agentTitle, setAgentTitle] = useState("Luxury Property Advisor");
  const [agentPhone, setAgentPhone] = useState(user?.email && user.email.includes("@") ? "+20 102 932 4783" : "+20 102 932 4783");
  const [agentEmail, setAgentEmail] = useState(user?.email || "consultant@realestate.eg");
  const [agencyName, setAgencyName] = useState("Exclusive Real Estate Advisory");

  const [projectName, setProjectName] = useState(data.projectName);
  const [developerName, setDeveloperName] = useState(data.developerName);
  const [developerBrief, setDeveloperBrief] = useState(
    `${data.developerName} is one of Egypt's premier real estate developers with a proven track record of delivering master-planned luxury communities, top-tier construction standards, and high investment yields.`
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
  const [otherFees, setOtherFees] = useState(data.otherFees || "Clubhouse & Parking Included");
  const [projectDescription, setProjectDescription] = useState(
    data.description || `${data.projectName} is a premier luxury development by ${data.developerName}, featuring master-planned architectural design, lush landscapes, and world-class amenities.`
  );

  const [amenitiesList, setAmenitiesList] = useState<string[]>(
    data.amenities || ["24/7 Security", "Crystal Lagoons", "Private Beachfront", "Clubhouse & Spa", "Commercial Strip", "Underground Parking"]
  );

  // Optional Media Settings
  const [includePhotos, setIncludePhotos] = useState(true);
  const [selectedPhotoPaths, setSelectedPhotoPaths] = useState<string[]>(
    initialImages.slice(0, 3).map((img: any) => img.path)
  );

  // Calculated Financials
  const dpAmountEgp = totalPriceEgp * (dpPct / 100);
  const remainingEgp = totalPriceEgp - dpAmountEgp;
  const monthlyEgp = durationYrs > 0 ? remainingEgp / (durationYrs * 12) : 0;

  const isRtm =
    deliveryNote.toLowerCase().includes("ready") ||
    deliveryNote.toLowerCase().includes("1 month") ||
    deliveryNote.toLowerCase().includes("2026");

  const ctaText = isRtm
    ? "If you are interested, reply to this message to arrange a site visit or private viewing."
    : "If you are interested, reply to this message to schedule a presentation meeting or site visit.";

  const hookText = `Discover luxury living at ${projectName} by ${developerName} — prime location & exclusive masterplan.`;

  // WhatsApp Proposal Message
  const proposalText =
    `Hello ${clientName},\n\n` +
    `${hookText}\n\n` +
    `Property Specifications & Financials\n` +
    `• Unit Type: ${unitType}\n` +
    `• Built-up Area (BUA): ${areaSqm} m²\n` +
    `• Starting Price: ${formatExactPrice(totalPriceEgp, currency)}\n` +
    `• Down Payment (${dpPct}%): ${formatExactPrice(dpAmountEgp, currency)}\n` +
    `• Estimated Monthly: ${formatExactPrice(monthlyEgp, currency)}/mo\n` +
    `• Payment Plan: ${paymentPlanStr}\n` +
    `• Delivery Date: ${deliveryNote}\n` +
    `• Finishing Status: ${finishingStatus}\n` +
    `• Maintenance & Fees: ${maintenanceFee} (${otherFees})\n\n` +
    (includePhotos && selectedPhotoPaths.length > 0
      ? `Visual Assets:\n🖼️ Photos: ${window?.location?.origin || "https://propertyatlas.eg"}${selectedPhotoPaths[0]}\n\n`
      : "") +
    `${ctaText}\n\n` +
    `Contact Representative: ${agentName} — ${agentTitle} (${agentPhone})`;

  // Direct PDF Download using html2canvas & jsPDF
    // Direct PDF Download using dynamic import of html2canvas & jsPDF
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
        backgroundColor: "#ffffff",
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
      console.error("PDF generation fallback to print", e);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-5xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden my-6 print:shadow-none print:border-none print:my-0">

        {/* Modal Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 bg-secondary/40 px-6 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold shadow-xs">
              📑
            </span>
            <div>
              <div className="font-display text-sm font-bold text-primary leading-tight">
                Executive Property Proposal Editor
              </div>
              <div className="text-[10px] text-muted-foreground font-medium">
                Customize agent details, specs, fees, and export direct PDF or WhatsApp offer
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                editMode
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "border border-border bg-card text-primary hover:bg-secondary"
              }`}
            >
              {editMode ? <Eye className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
              {editMode ? "Preview Document" : "Edit All Fields"}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {downloading ? "Generating PDF..." : "Download PDF"}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              WhatsApp Offer
            </button>

            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-secondary transition-all cursor-pointer"
            >
              {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-accent" />}
              {copiedText ? "Copied!" : "Copy Text"}
            </button>

            <button
              onClick={onClose}
              className="rounded-xl border border-border p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Edit Drawer Controls (Hidden when in preview mode or print) */}
        {editMode && (
          <div className="bg-secondary/30 border-b border-border/40 p-6 space-y-4 print:hidden animate-in fade-in-50 duration-200">
            <div className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Edit3 className="h-4 w-4" /> Edit Proposal Specifications &amp; Agent Info
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Agent Title &amp; Agency</label>
                <input
                  type="text"
                  value={agentTitle}
                  onChange={(e) => setAgentTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Agent Phone</label>
                <input
                  type="text"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Agent Email / Agency</label>
                <input
                  type="text"
                  value={agentEmail}
                  onChange={(e) => setAgentEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Agency Name</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Starting Price (EGP)</label>
                <input
                  type="number"
                  value={totalPriceEgp}
                  onChange={(e) => setTotalPriceEgp(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Down Payment (%)</label>
                <input
                  type="number"
                  value={dpPct}
                  onChange={(e) => setDpPct(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Installment Years</label>
                <input
                  type="number"
                  value={durationYrs}
                  onChange={(e) => setDurationYrs(parseInt(e.target.value, 10) || 0)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Maintenance Fee</label>
                <input
                  type="text"
                  value={maintenanceFee}
                  onChange={(e) => setMaintenanceFee(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Other Fees &amp; Extras</label>
                <input
                  type="text"
                  value={otherFees}
                  onChange={(e) => setOtherFees(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Delivery Note</label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Toggle Project Photos */}
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePhotos}
                  onChange={(e) => setIncludePhotos(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                Include Real Project Photos in PDF
              </label>
            </div>
          </div>
        )}

        {/* Printable & Exportable Document Element (White Labeled: NO Property Atlas references) */}
        <div ref={docRef} className="p-8 space-y-6 bg-white text-black font-sans print:p-6">
          
          {/* Executive Header */}
          <div className="flex flex-wrap items-center justify-between gap-6 border-b-2 border-black pb-5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {agencyName}
              </div>
              <h1 className="font-display text-2xl font-black text-black mt-1 leading-tight">
                {projectName}
              </h1>
              <p className="text-xs font-semibold text-gray-700 mt-1 flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-black" />
                Developer: <span className="font-bold text-black">{developerName}</span>
                <span>•</span>
                <MapPin className="h-3.5 w-3.5 text-black" />
                <span>{locationStr}</span>
              </p>
            </div>

            <div className="text-right border-l-2 border-black pl-6">
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Tailored Proposal For
              </div>
              <div className="font-display text-lg font-bold text-black mt-0.5">
                {clientName}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </div>
            </div>
          </div>

          {/* Intro Message */}
          <div className="rounded-xl bg-gray-50 p-4 border border-gray-200 space-y-1.5">
            <p className="text-xs font-bold text-black">Hello {clientName},</p>
            <p className="text-xs text-gray-700 leading-relaxed">
              {projectDescription}
            </p>
          </div>

          {/* Specifications & Financials Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-1">
              Property Specifications &amp; Financial Summary
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="text-[9px] font-bold text-gray-500 uppercase">Unit Type</div>
                <div className="font-bold text-black mt-0.5">{unitType}</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="text-[9px] font-bold text-gray-500 uppercase">Built-up Area (BUA)</div>
                <div className="font-bold text-black mt-0.5">{areaSqm} m²</div>
              </div>
              <div className="rounded-lg border-2 border-black bg-gray-100 p-3">
                <div className="text-[9px] font-bold text-black uppercase">Starting Price</div>
                <div className="font-black text-black mt-0.5">{formatExactPrice(totalPriceEgp, currency)}</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="text-[9px] font-bold text-gray-500 uppercase">Delivery Date</div>
                <div className="font-bold text-black mt-0.5">{deliveryNote}</div>
              </div>
            </div>

            {/* Payment Schedule Card */}
            <div className="rounded-xl border border-gray-300 bg-white p-4 space-y-3">
              <div className="text-xs font-bold text-black uppercase tracking-wider flex items-center justify-between">
                <span>Payment Plan Breakdown</span>
                <span className="text-black font-bold">{paymentPlanStr}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg bg-gray-50 p-3 text-center border border-gray-200">
                  <div className="text-[9px] font-bold text-gray-500 uppercase">Down Payment ({dpPct}%)</div>
                  <div className="font-bold text-black text-sm mt-0.5">{formatExactPrice(dpAmountEgp, currency)}</div>
                </div>

                <div className="rounded-lg bg-gray-100 p-3 text-center border border-gray-400">
                  <div className="text-[9px] font-bold text-black uppercase">Est. Monthly Installment</div>
                  <div className="font-black text-black text-sm mt-0.5">
                    {monthlyEgp > 0 ? `${formatExactPrice(monthlyEgp, currency)}/mo` : "Custom Terms"}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3 text-center border border-gray-200">
                  <div className="text-[9px] font-bold text-gray-500 uppercase">Installment Duration</div>
                  <div className="font-bold text-black text-sm mt-0.5">{durationYrs} Years</div>
                </div>
              </div>
            </div>

            {/* Maintenance & Additional Fees */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="text-[9px] font-bold text-gray-500 uppercase">Maintenance Deposit</div>
                <div className="font-bold text-black mt-0.5">{maintenanceFee}</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="text-[9px] font-bold text-gray-500 uppercase">Other Fees &amp; Inclusions</div>
                <div className="font-bold text-black mt-0.5">{otherFees}</div>
              </div>
            </div>
          </div>

          {/* Project Amenities */}
          {amenitiesList.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-1">
                Project Amenities &amp; Master Plan Features
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {amenitiesList.map((item, i) => (
                  <span key={i} className="rounded-md bg-gray-100 border border-gray-300 px-2.5 py-1 text-[10px] font-bold text-black">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Visual Assets Section */}
          {includePhotos && selectedPhotoPaths.length > 0 && (
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-1">
                Project Architecture &amp; Visual Gallery
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {selectedPhotoPaths.map((path, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                    <img src={path} alt={`Render ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Representative Footer (No Property Atlas) */}
          <div className="flex items-center justify-between border-t-2 border-black pt-4 mt-6 text-xs">
            <div>
              <div className="font-bold text-black">{agentName}</div>
              <div className="text-[10px] text-gray-600 font-semibold mt-0.5">
                {agentTitle} • {agencyName}
              </div>
            </div>

            <div className="text-right text-xs font-bold text-black">
              <div>Phone: {agentPhone}</div>
              <div className="text-[10px] text-gray-600 font-medium">{agentEmail}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
