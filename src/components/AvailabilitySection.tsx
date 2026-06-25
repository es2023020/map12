import { Link } from "@tanstack/react-router";
import type { ProjectAvailability } from "@/data/availability";
import { unitTypeSlug } from "@/data/availability";
import { Phone, TrendingUp, Home, BarChart2, Clock, ArrowRight } from "lucide-react";

interface Props {
  data: ProjectAvailability;
  projectSlug?: string;
}

export function AvailabilitySection({ data, projectSlug }: Props) {
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
              {data.totalAvailable.toLocaleString()} units available
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Connected price range</div>
          <div className="font-display text-lg font-bold text-emerald-950 dark:text-emerald-50">
            EGP {totalMin.toFixed(1)}M – {totalMax.toFixed(1)}M
          </div>
        </div>
      </div>

      {/* Unit breakdown table */}
      <div className="overflow-hidden rounded-2xl border border-border shadow-soft bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Unit Type</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Available</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Size (m²)</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Price (EGP M)</th>
                <th className="hidden sm:table-cell px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">% of Total</th>
                {projectSlug && (
                  <th className="px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Listings</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.breakdown.map((row, i) => {
                const pct = Math.round((row.available / data.totalAvailable) * 100);
                const slug = projectSlug ? unitTypeSlug(row) : null;
                const hasListings = Boolean(row.units && row.units.length > 0);
                const label = `${row.type}${row.beds ? ` · ${row.beds}BR` : ""}${row.cluster ? ` (${row.cluster})` : ""}`;

                return (
                  <tr key={i} className="group hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-block h-3 w-3 shrink-0 rounded-full border border-white/20 shadow-sm" style={{ background: typeColor(row.type) }} />
                        {projectSlug && slug ? (
                          <Link
                            to="/units/$projectSlug/$typeSlug"
                            params={{ projectSlug, typeSlug: slug }}
                            className="font-semibold text-primary hover:text-accent transition-colors inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                          >
                            {label}
                          </Link>
                        ) : (
                          <span className="font-semibold text-primary">{label}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        {row.available}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-muted-foreground font-medium">
                      {row.minSqm === row.maxSqm ? `${row.minSqm}` : `${row.minSqm}–${row.maxSqm}`}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-bold text-primary">
                        {row.minPriceM.toFixed(1)}–{row.maxPriceM.toFixed(1)}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: typeColor(row.type) }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs font-semibold text-muted-foreground">{pct}%</span>
                      </div>
                    </td>
                    {projectSlug && (
                      <td className="px-5 py-3.5 text-center hidden sm:table-cell">
                        {slug && (
                          <Link
                            to="/units/$projectSlug/$typeSlug"
                            params={{ projectSlug, typeSlug: slug }}
                            className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1 text-xs font-bold shadow-soft transition-all duration-200 hover:scale-[1.03] ${
                              hasListings
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "bg-secondary text-primary hover:bg-secondary/80"
                            }`}
                          >
                            {hasListings ? `${row.units!.length} listed` : "View"}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
          href="tel:01233374501"
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

function MiniStat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3.5 ${accent ? "border-accent/30 bg-accent/5" : "border-border bg-card"}`}>
      <div className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${accent ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="mt-2.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-sm font-semibold text-primary leading-tight">{value}</div>
    </div>
  );
}

function typeColor(type: string): string {
  const map: Record<string, string> = {
    "Apartment": "#6366F1", "Garden Apartment": "#8B5CF6",
    "Villa": "#14B8A6", "Town House": "#F59E0B", "Townhome": "#F59E0B",
    "Twin House": "#F97316", "Twinhome": "#F97316",
    "Chalet": "#0EA5E9", "Cabin": "#10B981",
    "Beach House": "#06B6D4", "Duplex": "#A855F7",
    "Penthouse": "#EC4899", "Studio": "#84CC16",
    "Grand View Villa": "#14B8A6", "Millennial Apartment": "#6366F1",
    "Garden Millennial": "#8B5CF6", "I-Villa": "#F97316",
    "I-Apartment": "#6366F1", "Park Villa": "#14B8A6",
    "Lake House": "#0EA5E9", "One Storey": "#F59E0B",
    "Sky Loft": "#A855F7", "Cabana": "#06B6D4",
    "One Storey Villa": "#F97316", "Standalone Villa": "#14B8A6",
    "Twin Villa": "#F97316", "Sky Villa": "#EC4899",
    "Typical Loft": "#A855F7", "Boardwalk Apartment": "#0EA5E9",
    "Garden Apartment NHF": "#8B5CF6", "Serviced Office": "#6B7280",
    "Admin Office": "#6B7280", "Medical Clinic": "#EF4444",
  };
  return map[type] ?? "#6B7280";
}
