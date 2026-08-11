import { Link } from "@tanstack/react-router";
import type { ProjectAvailability } from "@/data/availability";
import { unitTypeSlug } from "@/data/availability";
import { Phone, TrendingUp, Home, BarChart2, Clock, ArrowRight, Layers, Building, Waves } from "lucide-react";

interface Props {
  data: ProjectAvailability;
  projectSlug?: string;
  onRegisterInterest?: (type: string) => void;
}

export function AvailabilitySection({ data, projectSlug, onRegisterInterest }: Props) {
  const totalMin = Math.min(...data.breakdown.map((b) => b.minPriceM));
  const totalMax = Math.max(...data.breakdown.map((b) => b.maxPriceM));

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-50/60 to-teal-50/60 px-6 py-5 dark:border-emerald-500/10 dark:from-emerald-950/20 dark:to-teal-950/20 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
            <Home className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </span>
          </span>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Live Connected Inventory
            </div>
            <div className="font-display text-2xl font-extrabold text-emerald-950 dark:text-emerald-50 leading-tight">
              {data.totalAvailable > 0 ? (
                <>{data.totalAvailable.toLocaleString()} units available</>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">Not updated yet</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Connected price range
          </div>
          <div className="font-display text-lg font-bold text-emerald-950 dark:text-emerald-50">
            EGP {totalMin.toFixed(1)}M – {totalMax.toFixed(1)}M
          </div>
        </div>
      </div>

      {/* Unit breakdown grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.breakdown.map((row, i) => {
          const avgPriceM = (row.minPriceM + row.maxPriceM) / 2;
          const label = `${row.type}${row.beds ? ` · ${row.beds}BR` : ""}`;

          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-medium hover:border-accent/40 group flex flex-col justify-between"
            >
              {/* Card top branding/icon */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                    {getUnitIcon(row.type)}
                  </span>
                  {row.available > 0 ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                      {row.available} Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      Sold Out
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-lg font-bold text-primary group-hover:text-accent transition-colors">
                    {label}
                  </h3>
                  {row.cluster && (
                    <p className="text-xs text-muted-foreground mt-0.5 font-semibold">
                      Phase: {row.cluster}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Typical Size:{" "}
                    <strong className="text-primary font-semibold">
                      {row.minSqm === row.maxSqm ? `${row.minSqm}` : `${row.minSqm}–${row.maxSqm}`} m²
                    </strong>
                  </p>
                </div>
              </div>

              {/* Price details & Call to Action */}
              <div className="mt-6 pt-5 border-t border-border/60">
                <div className="flex justify-between items-baseline mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Average Price
                    </span>
                    <div className="font-display text-2xl font-black text-primary">
                      EGP {avgPriceM.toFixed(2)}M
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    Range: {row.minPriceM.toFixed(1)}M–{row.maxPriceM.toFixed(1)}M
                  </div>
                </div>

                {onRegisterInterest && row.available > 0 ? (
                  <button
                    onClick={() => onRegisterInterest(row.type)}
                    className="w-full rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Register Interest
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <a
                    href="tel:201029324783"
                    className="w-full rounded-2xl border border-border bg-secondary/30 py-3 text-xs font-bold text-primary text-center hover:bg-secondary/60 hover:border-accent/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Request Live Price
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MiniStat
          icon={<BarChart2 className="h-4.5 w-4.5" />}
          label="Unit categories"
          value={String(data.breakdown.length)}
        />
        <MiniStat
          icon={<TrendingUp className="h-4.5 w-4.5" />}
          label="Entry price"
          value={`EGP ${totalMin.toFixed(1)}M`}
          accent
        />
        <MiniStat
          icon={<Home className="h-4.5 w-4.5" />}
          label="Max size"
          value={`${Math.max(...data.breakdown.map((b) => b.maxSqm))} m²`}
        />
        <MiniStat
          icon={<Clock className="h-4.5 w-4.5" />}
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
  );
}

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
  if (t.includes("apartment") || t.includes("flat") || t.includes("studio") || t.includes("office") || t.includes("clinic")) {
    return <Layers className="h-5 w-5" />;
  }
  if (t.includes("villa") || t.includes("standalone")) {
    return <Home className="h-5 w-5" />;
  }
  if (t.includes("townhouse") || t.includes("town") || t.includes("twin") || t.includes("duplex")) {
    return <Building className="h-5 w-5" />;
  }
  if (t.includes("chalet") || t.includes("cabin") || t.includes("floating") || t.includes("cabana")) {
    return <Waves className="h-5 w-5" />;
  }
  return <Home className="h-5 w-5" />;
}
