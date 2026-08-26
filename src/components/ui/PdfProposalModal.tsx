import { useState } from "react";
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
}

interface Props {
  data: OfferProposalData;
  onClose: () => void;
}

export function PdfProposalModal({ data, onClose }: Props) {
  const currency = useStore((s) => s.currency) || "EGP";
  const user = useStore((s) => s.user);
  const [copiedText, setCopiedText] = useState(false);
  const [clientInputName, setClientInputName] = useState(data.clientName || "Valued Client");

  const totalPriceEgp = data.startingPriceEgp;
  const dpAmountEgp = totalPriceEgp * (data.dpPct / 100);
  const remainingEgp = totalPriceEgp - dpAmountEgp;
  const monthlyEgp = data.durationYrs > 0 ? remainingEgp / (data.durationYrs * 12) : 0;

  // Retrieve project media files from registry
  const projectMedia = (mediaRegistry.projects_media as any)?.[data.projectSlug] || [];
  const images = projectMedia.filter((m: any) => m.type === "image");
  const videos = projectMedia.filter((m: any) => m.type === "video");

  // Determine if unit is Ready to Move vs Off-Plan
  const isRtm = data.deliveryNote?.toLowerCase().includes("ready") || 
                data.deliveryNote?.toLowerCase().includes("1 month") || 
                data.deliveryNote?.toLowerCase().includes("q1 2026") || 
                data.deliveryNote?.toLowerCase().includes("q2 2026") ||
                data.deliveryNote?.toLowerCase().includes("q3 2026") ||
                data.deliveryNote?.toLowerCase().includes("q4 2026");

  const ctaText = isRtm 
    ? "If you are interested, reply to this message to arrange a site visit or private viewing."
    : "If you are interested, reply to this message to schedule a presentation meeting or site visit.";

  const hookText = `Discover luxury living at ${data.projectName} by ${data.developerName} — prime location & exclusive masterplan.`;

  // Construct structured text proposal
  const proposalText =
    `Hello ${clientInputName},\n\n` +
    `${hookText}\n\n` +
    `Property Specifications & Financials\n` +
    `• Unit Type: ${data.unitType}\n` +
    `• Built-up Area (BUA): ${data.areaSqm} m²\n` +
    `• Starting Price: ${formatExactPrice(totalPriceEgp, currency)}\n` +
    `• Down Payment (${data.dpPct}%): ${formatExactPrice(dpAmountEgp, currency)}\n` +
    `• Estimated Monthly: ${formatExactPrice(monthlyEgp, currency)}/mo\n` +
    `• Payment Plan: ${data.paymentPlanStr}\n` +
    `• Delivery Date: ${data.deliveryNote}\n` +
    (data.finishing ? `• Finishing Status: ${data.finishing}\n` : "") +
    `\nVisual Assets:\n` +
    (images.length > 0 ? `🖼️ Project Photos: ${window?.location?.origin || "https://propertyatlas.eg"}${images[0].path}\n` : "") +
    (videos.length > 0 ? `📹 Video Walkthrough: ${window?.location?.origin || "https://propertyatlas.eg"}${videos[0].path}\n` : "") +
    `\n${ctaText}\n\n` +
    `Contact Representative: ${user?.name || "Property Atlas Sales Team"} (+20 102 932 4783)`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(proposalText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWeb = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.projectName} Offer Proposal`,
          text: proposalText,

        });
      } catch (e) {
        // Fallback to WhatsApp Web
        window.open(`https://wa.me/?text=${encodeURIComponent(proposalText)}`, "_blank");
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(proposalText)}`, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden my-8 print:shadow-none print:border-none print:my-0">
        
        {/* Modal Toolbar (Hidden on print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 bg-secondary/30 px-6 py-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold">
              📄
            </span>
            <span className="font-display text-sm font-bold text-primary">
              Executive Proposal PDF Generator
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-background border border-border px-2.5 py-1 rounded-xl text-xs font-semibold">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Client Name..."
                value={clientInputName}
                onChange={(e) => setClientInputName(e.target.value)}
                className="bg-transparent border-none focus:outline-none w-28 text-primary font-bold"
              />
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>

            <button
              onClick={handleShareWeb}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              Send WhatsApp Offer
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

        {/* Printable Proposal Document Body */}
        <div id="pdf-proposal-document" className="p-8 space-y-8 bg-card print:p-6 print:text-black">
          
          {/* Document Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-border/60 pb-6 print:border-black">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-accent/15 text-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest print:border print:border-black">
                  Official Property Proposal
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Ref #: PROP-{Math.floor(100000 + Math.random() * 900000)}
                </span>
              </div>
              <h1 className="font-display text-2xl font-black text-primary mt-1.5 leading-tight">
                {data.projectName}
              </h1>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-accent" />
                Developer: <span className="text-primary font-bold">{data.developerName}</span>
                {data.location && (
                  <>
                    <span>•</span>
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    <span>{data.location}</span>
                  </>
                )}
              </p>
            </div>

            <div className="text-right border-l border-border/40 pl-6 print:border-black">
              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Prepared For
              </div>
              <div className="font-display text-lg font-bold text-primary mt-0.5">
                {clientInputName}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                Issued: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </div>
            </div>
          </div>

          {/* Intro Text (Strict format without filler) */}
          <div className="rounded-2xl bg-secondary/25 p-5 border border-border/50 space-y-2 print:bg-gray-50 print:border-black">
            <p className="text-sm font-bold text-primary">Dear {clientInputName},</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Here is your customized property proposal for <strong className="text-primary">{data.projectName}</strong> by <strong className="text-primary">{data.developerName}</strong>:
            </p>
          </div>

          {/* Property Specifications & Financials Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Property Specifications &amp; Financials
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-border/60 bg-card p-3.5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Unit Type</div>
                <div className="font-display text-sm font-bold text-primary mt-1">{data.unitType}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-3.5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Built-up Area (BUA)</div>
                <div className="font-display text-sm font-bold text-primary mt-1">{data.areaSqm} m²</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-3.5 bg-accent/5 border-accent/30">
                <div className="text-[10px] font-bold text-accent uppercase">Starting Price</div>
                <div className="font-display text-sm font-black text-accent mt-1">{formatExactPrice(totalPriceEgp, currency)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-3.5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Delivery Date</div>
                <div className="font-display text-sm font-bold text-primary mt-1">{data.deliveryNote}</div>
              </div>
            </div>

            {/* Payment Schedule Card */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
              <div className="text-xs font-bold text-primary uppercase tracking-wider flex items-center justify-between">
                <span>Payment Plan Breakdown</span>
                <span className="text-accent font-semibold">{data.paymentPlanStr}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl bg-secondary/35 p-3 text-center border border-border/40">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Down Payment ({data.dpPct}%)</div>
                  <div className="font-display text-base font-bold text-primary mt-0.5">{formatExactPrice(dpAmountEgp, currency)}</div>
                </div>

                <div className="rounded-xl bg-accent/10 p-3 text-center border border-accent/20">
                  <div className="text-[10px] font-bold text-accent uppercase">Est. Monthly Installment</div>
                  <div className="font-display text-base font-bold text-accent mt-0.5">
                    {monthlyEgp > 0 ? `${formatExactPrice(monthlyEgp, currency)}/mo` : "Custom Terms"}
                  </div>
                </div>

                <div className="rounded-xl bg-secondary/35 p-3 text-center border border-border/40">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Installment Duration</div>
                  <div className="font-display text-base font-bold text-primary mt-0.5">{data.durationYrs} Years</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Assets Section (Pictures & Video Walkthrough) */}
          {images.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                Project Visual Assets &amp; Architecture Gallery
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.slice(0, 3).map((img: any, i: number) => (
                  <div key={i} className="group relative aspect-video rounded-xl overflow-hidden border border-border/60 bg-secondary/30">
                    <img
                      src={img.path}
                      alt={`${data.projectName} render ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[9px] font-bold text-white truncate">
                      {img.filename}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Representative Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 mt-6 text-xs print:border-black">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                {user?.name ? user.name[0].toUpperCase() : "PA"}
              </span>
              <div>
                <div className="font-bold text-primary">{user?.name || "Property Atlas Sales Representative"}</div>
                <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-2 mt-0.5">
                  <Phone className="h-3 w-3 text-accent" />
                  <span>+20 102 932 4783</span>
                  <span>•</span>
                  <span>info@propertyatlas.eg</span>
                </div>
              </div>
            </div>

            <div className="text-right text-[10px] text-muted-foreground">
              <div>Verified Platform Listing</div>
              <div className="font-mono text-accent font-bold mt-0.5">propertyatlas.eg</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
