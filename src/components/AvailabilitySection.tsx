import { PdfProposalModal, type OfferProposalData } from "@/components/ui/PdfProposalModal";
import { useStore } from "@/lib/store";
import { formatCurrency, formatExactPrice } from "@/lib/currency";
import { Share2, Copy, Check, Printer, FileText } from "lucide-react";
function parsePaymentPlan(plan?: string): { dp: number; duration: number } {
  if (!plan) return { dp: 10, duration: 8 };
  const lower = plan.toLowerCase();

  let dp = 10;
  const dpMatch = lower.match(/(\d+(?:\.\d+)?)\s*%\s*(?:dp|down)/);
  if (dpMatch) {
    dp = parseFloat(dpMatch[1]);
  }

  let duration = 8;
  const durMatch = lower.match(/(\d+)\s*(?:years?|yrs?)/);
  if (durMatch) {
    duration = parseInt(durMatch[1], 10);
  }

  return { dp, duration };
}

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { ProjectAvailability, UnitBreakdown } from "@/data/availability";
import {
  Phone,
  TrendingUp,
  Home,
  BarChart2,
  Clock,
  ArrowRight,
  Layers,
  Building,
  Waves,
  X,
  Ruler,
  BadgePercent,
  CalendarClock,
  ChevronRight,
  Paintbrush2,
  MapPin,
  Calculator,
} from "lucide-react";
import { isReadyToMove } from "@/lib/delivery";

interface Props {
  data: ProjectAvailability;
  projectSlug?: string;
  onRegisterInterest?: (type: string) => void;
}

export function AvailabilitySection({ data, projectSlug, onRegisterInterest }: Props) {
  const [selectedUnit, setSelectedUnit] = useState<UnitBreakdown | null>(null);

  const totalMin = Math.min(...data.breakdown.map((b) => b.minPriceM));
  const totalMax = Math.max(...data.breakdown.map((b) => b.maxPriceM));

  return (
    <>
      <div className="space-y-6">
        {/* Header banner - Simplified and professional */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/35 px-6 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Home className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Unit Sizing & Availability
              </div>
              <div className="font-display text-lg font-bold text-primary leading-tight mt-0.5">
                {data.breakdown.length} Unit{data.breakdown.length !== 1 ? " Types" : " Type"}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Price Range
            </div>
            <div className="font-display text-base font-bold text-primary mt-0.5">
              EGP {totalMin.toFixed(1)}M – {totalMax.toFixed(1)}M
            </div>
          </div>
        </div>

        {/* Instruction hint */}
        <p className="text-xs text-muted-foreground text-center font-medium tracking-wide">
          Click any unit type below to view full details
        </p>

        {/* Unit breakdown grid - Simple, consistent, clean */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.breakdown.map((row, i) => {
            const avgPriceM = (row.minPriceM + row.maxPriceM) / 2;
            const label = `${row.type}${row.beds ? ` · ${row.beds}BR` : ""}`;

            return (
              <button
                key={i}
                onClick={() => setSelectedUnit(row)}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left p-5 transition-all duration-200 hover:border-accent hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Icon + details badge */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                      {getUnitIcon(row.type)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-secondary/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors border border-border/40">
                        View Unit Details
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-base font-bold text-primary group-hover:text-accent transition-colors leading-tight">
                    {label}
                  </h3>
                  {row.cluster && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                      Phase: {row.cluster}
                    </p>
                  )}

                  {/* Size */}
                  <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Ruler className="h-3 w-3 shrink-0" />
                    <span>
                      {row.minSqm === row.maxSqm
                        ? `${row.minSqm} m²`
                        : `${row.minSqm}–${row.maxSqm} m²`}
                    </span>
                  </div>
                </div>

                {/* Price & Hover Popups */}
                <div className="mt-5 pt-3 border-t border-border/40 w-full">
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
                    Average Price
                  </div>
                  <div className="font-display text-lg font-black text-primary group-hover:text-accent transition-colors mt-0.5">
                    EGP {avgPriceM.toFixed(1)}M
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Range: {row.minPriceM.toFixed(1)}M – {row.maxPriceM.toFixed(1)}M
                  </div>

                  {/* Light Hover Popups */}
                  {(() => {
                    const samplePrice = row.minPriceM * 1000000;
                    const sampleDp = samplePrice * 0.10; // 10% DP
                    const sampleMonthly = (samplePrice - sampleDp) / (8 * 12); // 8 Yrs
                    return (
                      <div className="mt-3 hidden group-hover:grid grid-cols-2 gap-1.5 transition-all duration-200 animate-in fade-in-50">
                        <div className="rounded-lg bg-accent/10 border border-accent/30 p-1.5 text-center">
                          <div className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">
                            💡 10% Down Payment
                          </div>
                          <div className="text-[10px] font-bold text-accent truncate">
                            EGP {(sampleDp / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div className="rounded-lg bg-primary/10 border border-primary/20 p-1.5 text-center">
                          <div className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">
                            📅 Est. Monthly (8Y)
                          </div>
                          <div className="text-[10px] font-bold text-primary truncate">
                            EGP {Math.round(sampleMonthly).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <Link
                    to="/calculator"
                    search={{
                      project: data.slug,
                      unitType: row.type,
                      price: String(row.minPriceM * 1000000)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent/10 border border-accent/30 py-2 text-[11px] font-bold text-accent hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer shadow-2xs"
                  >
                    <Calculator className="h-3.5 w-3.5" />
                    Calculate Payment
                  </Link>
                </div>
              </button>
            );
          })}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MiniStat
            icon={<BarChart2 className="h-4 w-4" />}
            label="Unit categories"
            value={String(data.breakdown.length)}
          />
          <MiniStat
            icon={<TrendingUp className="h-4 w-4" />}
            label="Entry price"
            value={`EGP ${totalMin.toFixed(1)}M`}
            accent
          />
          <MiniStat
            icon={<Home className="h-4 w-4" />}
            label="Max size"
            value={`${Math.max(...data.breakdown.map((b) => b.maxSqm))} m²`}
          />
          <MiniStat
            icon={<Clock className="h-4 w-4" />}
            label="Data as of"
            value={data.lastUpdated}
          />
        </div>

        {data.note && (
          <div className="flex items-start gap-2 rounded-xl border border-border bg-secondary/10 px-4 py-3">
            <span className="mt-0.5 text-muted-foreground text-xs">ⓘ</span>
            <p className="text-xs text-muted-foreground">{data.note}</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <a
            href="tel:201029324783"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all"
          >
            <Phone className="h-3.5 w-3.5" />
            Request Live Price List
          </a>
          <span className="text-[11px] font-medium text-muted-foreground bg-secondary/50 border border-border px-3 py-1 rounded-lg">
            Developer Feed: {data.developer}
          </span>
        </div>
      </div>

      {/* Unit Detail Modal */}
      {selectedUnit && (
        <UnitDetailModal
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onRegisterInterest={onRegisterInterest}
        />
      )}
    </>
  );
}

// ─── Unit Detail Modal ─────────────────────────────────────────────────────────

export function UnitDetailModal({
  unit,
  projectSlug,
  deliveryYear,
  compoundStatus,
  onClose,
  onRegisterInterest,
}: {
  unit: UnitBreakdown;
  projectSlug?: string;
  deliveryYear?: number;
  compoundStatus?: string;
  onClose: () => void;
  onRegisterInterest?: (unitType: string) => void;
}) {
  const avgPriceM = (unit.minPriceM + unit.maxPriceM) / 2;
  const currency = useStore((s) => s.currency);
  const [copied, setCopied] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const unitRtm = isReadyToMove(deliveryYear, unit.deliveryNote, compoundStatus);
  const parsedPlan = parsePaymentPlan(unit.paymentPlan || "");
  const estimatedDpEgp = (avgPriceM * 1_000_000) * (parsedPlan.dp / 100);
  const estimatedRemainingEgp = (avgPriceM * 1_000_000) - estimatedDpEgp;
  const estimatedMonthlyEgp = parsedPlan.duration > 0 ? estimatedRemainingEgp / (parsedPlan.duration * 12) : 0;

  const ctaText = unitRtm
    ? "If you are interested, reply to this message to arrange a site visit or private viewing."
    : "If you are interested, reply to this message to schedule a presentation meeting or site visit.";

  const shareText = `Hello [Client Name],\n\n` +
    `Discover premium living at ${projectSlug ? projectSlug.replace(/-/g, " ").toUpperCase() : "Property Atlas"}.\n\n` +
    `Property Specifications & Financials\n` +
    `• Unit Type: ${unit.type}\n` +
    `• Built-up Area (BUA): ${unit.minSqm === unit.maxSqm ? `${unit.minSqm} m²` : `${unit.minSqm}–${unit.maxSqm} m²`}\n` +
    `• Starting Price: ${formatCurrency(unit.minPriceM, currency)}\n` +
    `• Down Payment (${parsedPlan.dp}%): ${formatExactPrice(estimatedDpEgp, currency)}\n` +
    `• Estimated Monthly: ${formatExactPrice(estimatedMonthlyEgp, currency)}/mo\n` +
    `• Payment Terms: ${unit.paymentPlan || "Flexible Installments"}\n` +
    `• Delivery Date: ${unit.deliveryNote || (unitRtm ? "Ready to Move" : "4 Years")}\n\n` +
    `${ctaText}`;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="relative border-b border-border/40 p-6 bg-gradient-to-r from-secondary/50 via-card to-secondary/30">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent border border-accent/20">
              {getUnitIcon(unit.type)}
            </div>
            <div>
              {unit.cluster && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {unit.cluster}
                  </span>
                </div>
              )}
              <h2 className="font-display text-xl font-bold text-primary leading-tight mt-1">
                {unit.type} {unit.beds ? `(${unit.beds} Bedrooms)` : ""}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Price Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-card to-accent/5 p-5 border border-accent/20 shadow-xs">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  Starting Price
                </div>
                <div className="font-display text-3xl font-black text-primary mt-0.5 tracking-tight">
                  {formatCurrency(unit.minPriceM, currency)}
                  {unit.minPriceM !== unit.maxPriceM && (
                    <span className="text-sm font-semibold text-muted-foreground"> – {formatCurrency(unit.maxPriceM, currency)}</span>
                  )}
                </div>
              </div>

              {/* Quick DP & Monthly badges */}
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  💡 DP ({parsedPlan.dp}%): {formatExactPrice(estimatedDpEgp, currency)}
                </span>
                {estimatedMonthlyEgp > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 border border-blue-500/20">
                    📅 {formatExactPrice(estimatedMonthlyEgp, currency)}/mo
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sizing & Specs Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <DetailChip
              icon={<Ruler className="h-4 w-4 text-accent" />}
              label="BUA / Unit Area"
              value={
                unit.minSqm === unit.maxSqm
                  ? `${unit.minSqm} m²`
                  : `${unit.minSqm}–${unit.maxSqm} m²`
              }
            />
            <DetailChip
              icon={<CalendarClock className="h-4 w-4 text-accent" />}
              label="Delivery Timeline"
              value={unit.deliveryNote || (unitRtm ? "Ready to Move" : "4 Years")}
            />
            {unit.finishing && (
              <DetailChip
                icon={<Paintbrush2 className="h-4 w-4 text-accent" />}
                label="Finishing Type"
                value={unit.finishing}
              />
            )}
            {unit.available > 0 && (
              <DetailChip
                icon={<Layers className="h-4 w-4 text-accent" />}
                label="Available Units"
                value={`${unit.available} Units Listed`}
              />
            )}
            {unit.paymentPlan && (
              <DetailChip
                icon={<BadgePercent className="h-4 w-4 text-accent" />}
                label="Payment Terms"
                value={unit.paymentPlan}
                fullWidth
              />
            )}
          </div>

                    {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              to="/calculator"
              search={{
                project: projectSlug || (unit as any).projectSlug || "",
                unitType: unit.type,
                price: String(unit.minPriceM * 1000000)
              }}
              onClick={onClose}
              className="w-full rounded-2xl bg-accent py-3 text-xs font-bold text-accent-foreground shadow-md hover:bg-accent/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="h-4 w-4" />
              Open Live Mortgage &amp; Installment Calculator
            </Link>

            {onRegisterInterest && (
              <button
                onClick={() => {
                  onRegisterInterest(unit.type);
                  onClose();
                }}
                className="w-full rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Register Interest for this Unit
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            <a
              href="tel:201029324783"
              className="w-full rounded-2xl border border-border bg-card py-2.5 text-xs font-bold text-primary text-center hover:bg-secondary transition-all flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4 text-accent" />
              Speak with Property Representative
            </a>

            {/* PDF Proposal & WhatsApp Sharing Tools */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
              <button
                onClick={() => setShowPdfModal(true)}
                className="rounded-xl bg-accent hover:bg-accent/90 py-2.5 px-3 text-xs font-bold text-accent-foreground shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" />
                Generate PDF Offer
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-3 text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                WhatsApp Offer
              </a>
            </div>
          </div>
        </div>
      </div>

      {showPdfModal && (
        <PdfProposalModal
          data={{
            projectName: projectSlug ? projectSlug.replace(/-/g, " ").toUpperCase() : "Property Atlas",
            projectSlug: projectSlug || "",
            developerName: "Developer",
            unitType: unit.type,
            areaSqm: unit.minSqm === unit.maxSqm ? unit.minSqm : `${unit.minSqm}–${unit.maxSqm}`,
            startingPriceEgp: unit.minPriceM * 1000000,
            paymentPlanStr: unit.paymentPlan || "Flexible Installments",
            dpPct: parsedPlan.dp,
            durationYrs: parsedPlan.duration,
            deliveryNote: unit.deliveryNote || (unitRtm ? "Ready to Move" : "4 Years"),
            finishing: unit.finishing
          }}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
}

// ─── Detail Chip ───────────────────────────────────────────────────────────────

function DetailChip({
  icon,
  label,
  value,
  fullWidth,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-3 bg-secondary/20 border border-border/40 ${fullWidth ? "col-span-2" : ""}`}
    >
      <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-semibold text-primary">{value}</div>
    </div>
  );
}

// ─── MiniStat ──────────────────────────────────────────────────────────────────

function MiniStat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? "border-accent/20 bg-accent/5" : "border-border bg-card"}`}>
      <div className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${accent ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="mt-2 text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-display text-sm font-semibold text-primary leading-tight">
        {value}
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getUnitIcon(type: string) {
  const t = type.toLowerCase();
  if (
    t.includes("apartment") ||
    t.includes("flat") ||
    t.includes("studio") ||
    t.includes("office") ||
    t.includes("clinic")
  ) {
    return <Layers className="h-5 w-5" />;
  }
  if (t.includes("villa") || t.includes("standalone")) {
    return <Home className="h-5 w-5" />;
  }
  if (
    t.includes("townhouse") ||
    t.includes("town") ||
    t.includes("twin") ||
    t.includes("duplex")
  ) {
    return <Building className="h-5 w-5" />;
  }
  if (
    t.includes("chalet") ||
    t.includes("cabin") ||
    t.includes("floating") ||
    t.includes("cabana")
  ) {
    return <Waves className="h-5 w-5" />;
  }
  return <Home className="h-5 w-5" />;
}
