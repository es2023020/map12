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
                      {row.deliveryNote && (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            isReadyToMove(undefined, row.deliveryNote)
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-primary/10 text-primary border border-primary/20"
                          }`}
                        >
                          {isReadyToMove(undefined, row.deliveryNote) ? "RTM" : "Off-Plan"}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-secondary/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                        Details
                        <ChevronRight className="h-3 w-3" />
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

                {/* Price */}
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

                  <Link
                    to="/calculator"
                    search={{ project: data.slug, price: String(row.minPriceM * 1000000) }}
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

function UnitDetailModal({
  unit,
  onClose,
  onRegisterInterest,
}: {
  unit: UnitBreakdown;
  onClose: () => void;
  onRegisterInterest?: (type: string) => void;
}) {
  const avgPriceM = (unit.minPriceM + unit.maxPriceM) / 2;
  const label = `${unit.type}${unit.beds ? ` · ${unit.beds} Bedroom${unit.beds > 1 ? "s" : ""}` : ""}`;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden border border-border bg-card shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-label={`${label} Details`}
      >
        {/* Simple header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/60">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
              {getUnitIcon(unit.type)}
            </span>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Unit Detail View
              </div>
              <h2 className="font-display text-lg font-bold text-primary leading-tight">
                {unit.type}
              </h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Price details */}
          <div className="rounded-xl bg-secondary/45 p-4 border border-border/40">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
              Average Price
            </div>
            <div className="font-display text-2xl font-black text-primary mt-0.5">
              EGP {avgPriceM.toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Range: EGP {unit.minPriceM.toFixed(1)}M – {unit.maxPriceM.toFixed(1)}M
            </div>
          </div>

          {/* Sizing & details */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <DetailChip
              icon={<Ruler className="h-3.5 w-3.5" />}
              label="Typical Area"
              value={
                unit.minSqm === unit.maxSqm
                  ? `${unit.minSqm} m²`
                  : `${unit.minSqm}–${unit.maxSqm} m²`
              }
            />
            {unit.cluster && (
              <DetailChip
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Phase/Cluster"
                value={unit.cluster}
              />
            )}
            {unit.finishing && (
              <DetailChip
                icon={<Paintbrush2 className="h-3.5 w-3.5" />}
                label="Finishing"
                value={unit.finishing}
              />
            )}
            {unit.deliveryNote && (
              <DetailChip
                icon={<CalendarClock className="h-3.5 w-3.5" />}
                label="Delivery"
                value={unit.deliveryNote}
              />
            )}
            {unit.paymentPlan && (
              <DetailChip
                icon={<BadgePercent className="h-3.5 w-3.5" />}
                label="Payment Plan"
                value={unit.paymentPlan}
                fullWidth
              />
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/calculator"
              search={{ project: (unit as any).projectSlug || "", price: String(unit.minPriceM * 1000000) }}
              onClick={onClose}
              className="w-full rounded-xl bg-accent py-3 text-xs font-bold text-accent-foreground shadow-md hover:bg-accent/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="h-4 w-4" />
              Calculate Payment Plan
            </Link>

            {onRegisterInterest && (
              <button
                onClick={() => {
                  onRegisterInterest(unit.type);
                  onClose();
                }}
                className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Register Interest
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            <a
              href="tel:201029324783"
              className="w-full rounded-xl border border-border bg-card py-2.5 text-xs font-bold text-primary text-center hover:bg-secondary transition-all flex items-center justify-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" />
              Request Live Price
            </a>
          </div>
        </div>
      </div>
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
