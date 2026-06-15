import type { ProjectAvailability } from "@/data/availability";
import { Phone, TrendingUp, Home, BarChart2, Clock } from "lucide-react";

interface Props {
  data: ProjectAvailability;
}

export function AvailabilitySection({ data }: Props) {
  const totalMin = Math.min(...data.breakdown.map((b) => b.minPriceM));
  const totalMax = Math.max(...data.breakdown.map((b) => b.maxPriceM));

  return (
    <div>
      {/* Header banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-teal-950/30">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
            <Home className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Live Availability</div>
            <div className="font-display text-xl font-bold text-emerald-900 dark:text-emerald-100">
              {data.totalAvailable.toLocaleString()} units available
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400">Price range</div>
          <div className="font-display text-base font-semibold text-emerald-900 dark:text-emerald-100">
            EGP {totalMin.toFixed(1)}M – {totalMax.toFixed(1)}M
          </div>
        </div>
      </div>

      {/* Unit breakdown table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/60">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Unit Type</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Available</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Size (m²)</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Price (EGP M)</th>
                <th className="hidden sm:table-cell px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.breakdown.map((row, i) => {
                const pct = Math.round((row.available / data.totalAvailable) * 100);
                return (
                  <tr key={i} className="bg-card hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: typeColor(row.type) }} />
                        <span className="font-medium text-primary">{row.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {row.available}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {row.minSqm === row.maxSqm
                        ? `${row.minSqm}`
                        : `${row.minSqm}–${row.maxSqm}`}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-primary">
                        {row.minPriceM.toFixed(1)}–{row.maxPriceM.toFixed(1)}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
                          <div
                            className="h-full rounded-full bg-accent transition-all"
                            style={{ width: `${pct}%`, background: typeColor(row.type) }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs text-muted-foreground">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/20">
          <span className="mt-0.5 text-amber-600">ⓘ</span>
          <p className="text-sm text-amber-800 dark:text-amber-200">{data.note}</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href="tel:+201234567890"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
        >
          <Phone className="h-4 w-4" />
          Get live availability list
        </a>
        <span className="text-xs text-muted-foreground">
          Source: {data.developer} — updated {data.lastUpdated}
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
    "Apartment": "#6366F1",
    "Garden Apartment": "#8B5CF6",
    "Villa": "#14B8A6",
    "Town House": "#F59E0B",
    "Twin House": "#F97316",
    "Chalet": "#0EA5E9",
    "Cabin": "#10B981",
    "Beach House": "#06B6D4",
    "Duplex": "#A855F7",
    "Penthouse": "#EC4899",
    "Studio": "#84CC16",
    "Grand View Villa": "#14B8A6",
    "Millennial Apartment": "#6366F1",
    "Garden Millennial": "#8B5CF6",
    "I-Villa": "#F97316",
    "I-Apartment": "#6366F1",
    "Park Villa": "#14B8A6",
    "Lake House": "#0EA5E9",
    "One Storey": "#F59E0B",
    "Sky Loft": "#A855F7",
    "Cabana": "#06B6D4",
    "One Storey Villa": "#F97316",
  };
  return map[type] ?? "#6B7280";
}
