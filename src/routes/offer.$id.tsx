import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useOfferStore } from "@/lib/offerStore";
import { useStore } from "@/lib/store";
import { formatExactPrice } from "@/lib/currency";
import {
  Building2,
  MapPin,
  Calendar,
  Layers,
  Phone,
  User,
  Sparkles,
  Share2,
  Check,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ImageIcon,
} from "lucide-react";

export const Route = createFileRoute("/offer/$id")({
  component: PublicOfferPage,
});

function PublicOfferPage() {
  const { id } = Route.useParams();
  const getOffer = useOfferStore((s) => s.getOffer);
  const recordOfferView = useOfferStore((s) => s.recordOfferView);
  const currency = useStore((s) => s.currency) || "EGP";

  const offer = getOffer(id);
  const [recorded, setRecorded] = useState(false);

  useEffect(() => {
    if (id && !recorded) {
      recordOfferView(id);
      setRecorded(true);
    }
  }, [id, recorded, recordOfferView]);

  if (!offer) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl max-w-md w-full">
          <span className="text-4xl mb-3 block">📑</span>
          <h2 className="font-display text-xl font-bold text-primary">Proposal Link Expired or Not Found</h2>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            This customized property proposal link may have been updated or removed. Please contact your property representative.
          </p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-accent">
            Go to Homepage <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const dpAmountEgp = offer.totalPriceEgp * (offer.dpPct / 100);
  const remainingEgp = offer.totalPriceEgp - dpAmountEgp;
  const monthlyEgp = offer.durationYrs > 0 ? remainingEgp / (offer.durationYrs * 12) : 0;

  const isRtm =
    offer.deliveryNote.toLowerCase().includes("ready") ||
    offer.deliveryNote.toLowerCase().includes("1 month") ||
    offer.deliveryNote.toLowerCase().includes("2026");

  const ctaText = isRtm
    ? "Schedule Private Site Visit"
    : "Schedule Presentation Meeting";

  const handleActionWhatsApp = () => {
    const text = `Hello ${offer.agentName},\nI reviewed the proposal for *${offer.projectName}* (${offer.unitType} - ${offer.areaSqm}m²).\nI would like to ${ctaText.toLowerCase()}!`;
    window.open(`https://wa.me/${offer.agentPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-accent selection:text-white pb-12">
      {/* Executive Top Banner */}
      <div className="border-b border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              {offer.agencyName}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Exclusive Proposal
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-8 space-y-6">
        {/* Header Hero Section */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-accent/15 px-3 py-1 text-[10px] font-bold text-accent border border-accent/20">
              Tailored Executive Offer
            </span>
            <span className="text-[11px] text-slate-400">
              Prepared for <strong className="text-white font-bold">{offer.clientName}</strong>
            </span>
          </div>

          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
              {offer.projectName}
            </h1>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-white">
                <Building2 className="h-3.5 w-3.5 text-accent" /> {offer.developerName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-accent" /> {offer.location || "North Coast, Egypt"}
              </span>
            </p>
          </div>

          {/* Intro Message Box */}
          <div className="rounded-2xl bg-slate-950/80 p-4 border border-white/10 text-xs text-slate-300 leading-relaxed space-y-1.5">
            <div className="font-bold text-white">Dear {offer.clientName},</div>
            <p>{offer.projectDescription}</p>
          </div>
        </div>

        {/* Specifications & Pricing Grid */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1.5 border-b border-white/10 pb-3">
            <Sparkles className="h-4 w-4" /> Property Specifications &amp; Pricing
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-white/10">
              <div className="text-[9px] font-bold text-slate-400 uppercase">Unit Type</div>
              <div className="font-bold text-white mt-1">{offer.unitType}</div>
            </div>
            <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-white/10">
              <div className="text-[9px] font-bold text-slate-400 uppercase">Built-up Area (BUA)</div>
              <div className="font-bold text-white mt-1">{offer.areaSqm} m²</div>
            </div>
            <div className="rounded-2xl bg-accent/20 p-3.5 border border-accent/40 col-span-2 sm:col-span-2">
              <div className="text-[9px] font-bold text-accent uppercase">Starting Total Price</div>
              <div className="font-display text-lg font-black text-white mt-0.5">
                {formatExactPrice(offer.totalPriceEgp, currency)}
              </div>
            </div>
          </div>

          {/* Payment Plan Breakdown */}
          <div className="rounded-2xl bg-slate-950/80 p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="font-bold text-white uppercase tracking-wider">Payment Schedule</span>
              <span className="font-bold text-accent">{offer.dpPct}% DP over {offer.durationYrs} Years</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-900 p-3 text-center border border-white/10">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Down Payment ({offer.dpPct}%)</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  {formatExactPrice(dpAmountEgp, currency)}
                </div>
              </div>

              <div className="rounded-xl bg-slate-900 p-3 text-center border border-accent/40">
                <div className="text-[9px] font-bold text-accent uppercase">Est. Monthly Payment</div>
                <div className="font-black text-white text-sm mt-0.5">
                  {monthlyEgp > 0 ? `${formatExactPrice(monthlyEgp, currency)}/mo` : "Custom Terms"}
                </div>
              </div>

              <div className="rounded-xl bg-slate-900 p-3 text-center border border-white/10">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Delivery Date</div>
                <div className="font-bold text-white text-sm mt-0.5">{offer.deliveryNote}</div>
              </div>
            </div>
          </div>

          {/* Maintenance & Extras */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-white/10">
              <div className="text-[9px] font-bold text-slate-400 uppercase">Maintenance Deposit</div>
              <div className="font-bold text-white mt-1">{offer.maintenanceFee}</div>
            </div>
            <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-white/10">
              <div className="text-[9px] font-bold text-slate-400 uppercase">Inclusions &amp; Extras</div>
              <div className="font-bold text-white mt-1">{offer.otherFees}</div>
            </div>
          </div>
        </div>

        {/* Amenities & Features */}
        {offer.amenities && offer.amenities.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-accent border-b border-white/10 pb-2">
              Master Plan Features &amp; Lifestyle Amenities
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {offer.amenities.map((item, i) => (
                <span key={i} className="rounded-xl bg-slate-950 border border-white/10 px-3 py-1.5 font-semibold text-slate-200">
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project Visual Gallery */}
        {offer.photoPaths && offer.photoPaths.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-accent border-b border-white/10 pb-2">
              Architectural Renders &amp; Visuals
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {offer.photoPaths.map((path, i) => (
                <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                  <img src={path} alt={`Render ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Contact Footer */}
        <div className="rounded-3xl border-2 border-accent bg-slate-900/90 p-6 sm:p-8 shadow-2xl text-center space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
              Ready to take the next step?
            </span>
            <h3 className="font-display text-xl font-bold text-white mt-1">
              Interested in {offer.projectName}?
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Contact representative <strong className="text-white">{offer.agentName}</strong> to reserve your unit or schedule a site visit.
            </p>
          </div>

          <button
            onClick={handleActionWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-emerald-500 transition-all cursor-pointer"
          >
            <Share2 className="h-4 w-4" /> {ctaText} via WhatsApp
          </button>

          <div className="text-[11px] text-slate-400 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-bold text-white">{offer.agentName}</span> — {offer.agentTitle}
            </div>
            <div>
              Phone: <strong className="text-white">{offer.agentPhone}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
