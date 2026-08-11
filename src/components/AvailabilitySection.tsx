import { useState } from "react";
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
  Maximize2,
  Ruler,
  BadgePercent,
  CalendarClock,
  ChevronRight,
  Paintbrush2,
  MapPin,
} from "lucide-react";

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
      <div className="space-y-8">
        {/* Header banner */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.06) 100%)",
            border: "1px solid rgba(16,185,129,0.18)",
          }}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl px-6 py-5 backdrop-blur-md shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
              <Home className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            </span>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Live Inventory
              </div>
              <div className="font-display text-xl font-extrabold text-emerald-950 dark:text-emerald-50 leading-tight mt-0.5">
                {data.breakdown.length} Unit{data.breakdown.length !== 1 ? " Types" : " Type"} Available
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Price Range
            </div>
            <div className="font-display text-lg font-bold text-emerald-950 dark:text-emerald-50 mt-0.5">
              EGP {totalMin.toFixed(1)}M – {totalMax.toFixed(1)}M
            </div>
          </div>
        </div>

        {/* Instruction hint */}
        <p className="text-xs text-muted-foreground text-center -mt-2 font-medium tracking-wide">
          Tap a unit type to view full details
        </p>

        {/* Unit breakdown grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.breakdown.map((row, i) => {
            const avgPriceM = (row.minPriceM + row.maxPriceM) / 2;
            const label = `${row.type}${row.beds ? ` · ${row.beds}BR` : ""}`;
            const color = typeColor(row.type);

            return (
              <button
                key={i}
                onClick={() => setSelectedUnit(row)}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                style={{ "--unit-color": color } as React.CSSProperties}
              >
                {/* Color accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl transition-all duration-300 group-hover:h-1.5"
                  style={{ background: color }}
                />

                <div className="p-6 pt-7">
                  {/* Icon + type */}
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                      style={{ background: color }}
                    >
                      {getUnitIcon(row.type)}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ background: `${color}18`, color }}
                    >
                      View Details
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-primary leading-tight">
                    {label}
                  </h3>
                  {row.cluster && (
                    <p className="text-xs text-muted-foreground mt-1 font-semibold">
                      Phase: {row.cluster}
                    </p>
                  )}

                  {/* Size */}
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Ruler className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {row.minSqm === row.maxSqm
                        ? `${row.minSqm} m²`
                        : `${row.minSqm}–${row.maxSqm} m²`}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-5 pt-4 border-t border-border/60">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                      Average Price
                    </div>
                    <div className="font-display text-2xl font-black" style={{ color }}>
                      EGP {avgPriceM.toFixed(2)}M
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Range: {row.minPriceM.toFixed(1)}M – {row.maxPriceM.toFixed(1)}M
                    </div>
                  </div>
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
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
            <span className="mt-0.5 text-amber-600">ⓘ</span>
            <p className="text-xs font-medium text-amber-800 dark:text-amber-200">{data.note}</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <a
            href="tel:201029324783"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-soft hover:bg-emerald-700 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Request Updated Live List
          </a>
          <span className="text-xs font-medium text-muted-foreground bg-secondary/50 border border-border px-3 py-1 rounded-full">
            Developer Feed: {data.developer} · Checked {data.lastUpdated}
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
  const color = typeColor(unit.type);
  const avgPriceM = (unit.minPriceM + unit.maxPriceM) / 2;
  const label = `${unit.type}${unit.beds ? ` · ${unit.beds} Bedroom${unit.beds > 1 ? "s" : ""}` : ""}`;

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "var(--card, #fff)" }}
        role="dialog"
        aria-modal="true"
        aria-label={`${label} Details`}
      >
        {/* Color header */}
        <div
          className="relative px-7 pt-8 pb-7"
          style={{
            background: `linear-gradient(135deg, ${color}22 0%, ${color}10 100%)`,
            borderBottom: `1px solid ${color}30`,
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <span
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg shrink-0"
              style={{ background: color }}
            >
              {getUnitIcon(unit.type)}
            </span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color }}>
                Unit Type
              </div>
              <h2 className="font-display text-2xl font-black text-primary leading-tight">
                {unit.type}
              </h2>
              {unit.beds && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {unit.beds} Bedroom{unit.beds > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-5">
          {/* Price spotlight */}
          <div
            className="rounded-2xl p-5"
            style={{ background: `${color}0d`, border: `1px solid ${color}25` }}
          >
            <div className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color }}>
              Average Price
            </div>
            <div className="font-display text-3xl font-black" style={{ color }}>
              EGP {avgPriceM.toFixed(2)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Range: EGP {unit.minPriceM.toFixed(2)}M – {unit.maxPriceM.toFixed(2)}M
            </div>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-3">
            <DetailChip
              icon={<Ruler className="h-4 w-4" />}
              label="Area"
              value={
                unit.minSqm === unit.maxSqm
                  ? `${unit.minSqm} m²`
                  : `${unit.minSqm}–${unit.maxSqm} m²`
              }
              color={color}
            />
            {unit.cluster && (
              <DetailChip
                icon={<MapPin className="h-4 w-4" />}
                label="Phase / Cluster"
                value={unit.cluster}
                color={color}
              />
            )}
            {unit.finishing && (
              <DetailChip
                icon={<Paintbrush2 className="h-4 w-4" />}
                label="Finishing"
                value={unit.finishing}
                color={color}
              />
            )}
            {unit.deliveryNote && (
              <DetailChip
                icon={<CalendarClock className="h-4 w-4" />}
                label="Delivery"
                value={unit.deliveryNote}
                color={color}
              />
            )}
            {unit.paymentPlan && (
              <DetailChip
                icon={<BadgePercent className="h-4 w-4" />}
                label="Payment Plan"
                value={unit.paymentPlan}
                color={color}
                fullWidth
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-1">
            {onRegisterInterest && (
              <button
                onClick={() => {
                  onRegisterInterest(unit.type);
                  onClose();
                }}
                className="w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ background: color }}
              >
                Register Interest
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
            <a
              href="tel:201029324783"
              className="w-full rounded-2xl border border-border bg-secondary/30 py-3 text-sm font-bold text-primary text-center hover:bg-secondary/60 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4" />
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
  color,
  fullWidth,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3.5 ${fullWidth ? "col-span-2" : ""}`}
      style={{ background: "var(--secondary, #f3f4f6)", border: "1px solid var(--border, #e5e7eb)" }}
    >
      <div className="flex items-center gap-1.5 mb-1" style={{ color }}>
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm font-semibold text-primary">{value}</div>
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
    <div
      className={`rounded-xl border p-3.5 ${accent ? "border-accent/30 bg-accent/5" : "border-border bg-card"}`}
    >
      <div
        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${accent ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"}`}
      >
        {icon}
      </div>
      <div className="mt-2.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-display text-sm font-semibold text-primary leading-tight">
        {value}
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function typeColor(type: string): string {
  const map: Record<string, string> = {
    Apartment: "#6366F1",
    "Garden Apartment": "#8B5CF6",
    Villa: "#14B8A6",
    "Town House": "#F59E0B",
    Townhome: "#F59E0B",
    "Twin House": "#F97316",
    Twinhome: "#F97316",
    Chalet: "#0EA5E9",
    Cabin: "#10B981",
    "Beach House": "#06B6D4",
    Duplex: "#A855F7",
    Penthouse: "#EC4899",
    Studio: "#84CC16",
    "Grand View Villa": "#14B8A6",
    "Millennial Apartment": "#6366F1",
    "Garden Millennial": "#8B5CF6",
    "I-Villa": "#F97316",
    "I-Apartment": "#6366F1",
    "Park Villa": "#14B8A6",
    "Lake House": "#0EA5E9",
    "One Storey": "#F59E0B",
    "Sky Loft": "#A855F7",
    Cabana: "#06B6D4",
    "One Storey Villa": "#F97316",
    "Standalone Villa": "#14B8A6",
    "Twin Villa": "#F97316",
    "Sky Villa": "#EC4899",
    "Typical Loft": "#A855F7",
    "Boardwalk Apartment": "#0EA5E9",
    "Garden Apartment NHF": "#8B5CF6",
    "Serviced Office": "#6B7280",
    "Admin Office": "#6B7280",
    "Medical Clinic": "#EF4444",
  };
  return map[type] ?? "#6B7280";
}

function getUnitIcon(type: string) {
  const t = type.toLowerCase();
  if (
    t.includes("apartment") ||
    t.includes("flat") ||
    t.includes("studio") ||
    t.includes("office") ||
    t.includes("clinic")
  ) {
    return <Layers className="h-6 w-6" />;
  }
  if (t.includes("villa") || t.includes("standalone")) {
    return <Home className="h-6 w-6" />;
  }
  if (
    t.includes("townhouse") ||
    t.includes("town") ||
    t.includes("twin") ||
    t.includes("duplex")
  ) {
    return <Building className="h-6 w-6" />;
  }
  if (
    t.includes("chalet") ||
    t.includes("cabin") ||
    t.includes("floating") ||
    t.includes("cabana")
  ) {
    return <Waves className="h-6 w-6" />;
  }
  return <Home className="h-6 w-6" />;
}
