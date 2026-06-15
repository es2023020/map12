import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { compounds } from "@/data/compounds";
import {
  Calculator, ChevronDown, Phone, Wallet, Calendar,
  TrendingDown, Building2, CheckCircle2, Info
} from "lucide-react";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Payment Calculator — PropTrack" },
      { name: "description", content: "Calculate down payment, monthly, quarterly and annual installments for any Egyptian real-estate project." },
    ],
  }),
  component: CalculatorPage,
});

const DURATIONS = [5, 7, 8, 10, 12, 15];
const DP_OPTIONS = [5, 8, 10, 15, 20, 25, 30, 40, 50];

function fmt(n: number, decimals = 2) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(decimals) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toFixed(0);
}

function fmtEGP(n: number) {
  return "EGP " + n.toLocaleString("en-EG", { maximumFractionDigits: 0 });
}

function CalculatorPage() {
  const [mode, setMode] = useState<"project" | "custom">("project");
  const [projectSlug, setProjectSlug] = useState(compounds[0]?.slug ?? "");
  const [customPrice, setCustomPrice] = useState(5);
  const [dpPct, setDpPct] = useState(10);
  const [duration, setDuration] = useState(8);
  const [maintenance, setMaintenance] = useState(8);
  const [unitType, setUnitType] = useState("");
  const [tab, setTab] = useState<"monthly" | "quarterly" | "annual">("monthly");

  const selectedProject = useMemo(() => compounds.find((c) => c.slug === projectSlug), [projectSlug]);

  const basePrice = mode === "project"
    ? (selectedProject?.priceFrom ?? 5)
    : customPrice;

  const downPayment = basePrice * (dpPct / 100);
  const maintenanceFee = basePrice * (maintenance / 100);
  const remaining = basePrice - downPayment;
  const totalMonths = duration * 12;
  const monthly = remaining / totalMonths;
  const quarterly = remaining / (duration * 4);
  const annual = remaining / duration;

  const schedule = useMemo(() => {
    return DURATIONS.map((yr) => {
      const rem = basePrice - downPayment;
      const mo = rem / (yr * 12);
      const qt = rem / (yr * 4);
      const an = rem / yr;
      return { yr, mo, qt, an };
    });
  }, [basePrice, downPayment]);

  const projectTypes = selectedProject?.types ?? [];

  return (
    <Shell>
      <div className="border-b border-border/60 bg-gradient-to-br from-primary/8 via-transparent to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:py-12 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-md">
              <Calculator className="h-6 w-6" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">PropTrack Tools</div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-primary">Payment Calculator</h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Enter any unit price and instantly see your down payment, monthly, quarterly and annual installment breakdown across all available durations.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">

          {/* ── Left: Inputs ── */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="mb-4 font-display text-lg font-semibold text-primary flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent" /> Project & Price
              </h2>

              {/* Mode toggle */}
              <div className="mb-5 flex rounded-xl border border-border overflow-hidden">
                {(["project", "custom"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                      mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {m === "project" ? "Select Project" : "Custom Price"}
                  </button>
                ))}
              </div>

              {mode === "project" ? (
                <div className="space-y-3">
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Project
                  </label>
                  <div className="relative">
                    <select
                      value={projectSlug}
                      onChange={(e) => setProjectSlug(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {compounds.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name} — EGP {c.priceFrom}M
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  {projectTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {projectTypes.map((t) => (
                        <button
                          key={t}
                          onClick={() => setUnitType(unitType === t ? "" : t)}
                          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                            unitType === t
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-border text-muted-foreground hover:border-accent"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedProject && (
                    <div className="rounded-xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Developer</span>
                        <span className="font-medium text-primary">{selectedProject.developer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Area</span>
                        <span className="font-medium text-primary">{selectedProject.area.replace(/-/g, " ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium text-primary">{selectedProject.deliveryYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium text-primary">{selectedProject.status}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Unit Price (EGP millions)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1} max={200} step={0.5}
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Number(e.target.value))}
                      className="w-32 rounded-xl border border-border bg-background px-4 py-3 text-center font-display text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-sm text-muted-foreground">EGP million</span>
                  </div>
                  <input
                    type="range" min={1} max={200} step={0.5} value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>EGP 1M</span><span>EGP 200M</span>
                  </div>
                </div>
              )}
            </div>

            {/* Down payment */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="mb-4 font-display text-lg font-semibold text-primary flex items-center gap-2">
                <Wallet className="h-5 w-5 text-accent" /> Down Payment
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {DP_OPTIONS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setDpPct(p)}
                    className={`rounded-xl py-2.5 text-sm font-semibold transition-all border ${
                      dpPct === p
                        ? "border-accent bg-accent text-white shadow-sm"
                        : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
                <span className="text-sm text-muted-foreground">Down payment amount</span>
                <span className="font-display text-xl font-bold text-accent">{fmtEGP(downPayment * 1_000_000)}</span>
              </div>
            </div>

            {/* Duration */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="mb-4 font-display text-lg font-semibold text-primary flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" /> Payment Duration
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {DURATIONS.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setDuration(yr)}
                    className={`rounded-xl py-2.5 text-sm font-semibold transition-all border ${
                      duration === yr
                        ? "border-accent bg-accent text-white shadow-sm"
                        : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                    }`}
                  >
                    {yr}yr
                  </button>
                ))}
              </div>
            </div>

            {/* Maintenance */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="mb-3 font-display text-base font-semibold text-primary flex items-center gap-2">
                <Info className="h-4 w-4 text-accent" /> Maintenance Fee
              </h2>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={5} max={15} step={1} value={maintenance}
                  onChange={(e) => setMaintenance(Number(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="w-12 text-right font-semibold text-primary">{maintenance}%</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Typically 8–10% one-time fee</span>
                <span>{fmtEGP(maintenanceFee * 1_000_000)}</span>
              </div>
            </div>

            <a
              href="tel:01233374501"
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-4 w-4" /> Call PropTrack Advisor · 01233374501
            </a>
          </div>

          {/* ── Right: Results ── */}
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Unit Price", value: fmtEGP(basePrice * 1_000_000), color: "text-primary", bg: "bg-secondary/50" },
                { label: "Down Payment", value: fmtEGP(downPayment * 1_000_000), color: "text-accent", bg: "bg-accent/8" },
                { label: "Remaining", value: fmtEGP(remaining * 1_000_000), color: "text-primary", bg: "bg-secondary/50" },
                { label: "Maintenance", value: fmtEGP(maintenanceFee * 1_000_000), color: "text-amber-600", bg: "bg-amber-50" },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl border border-border ${s.bg} p-4`}>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <div className={`mt-1.5 font-display text-lg font-bold ${s.color} leading-tight`}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Active plan highlight */}
            <div className="rounded-2xl border-2 border-accent bg-gradient-to-br from-accent/10 to-transparent p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent">Selected plan · {dpPct}% DP · {duration} years</div>
                  <div className="mt-2 font-display text-4xl font-bold text-primary">
                    {fmtEGP(monthly * 1_000_000)}
                    <span className="ml-2 text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-sm text-muted-foreground">Quarterly</div>
                  <div className="font-display text-2xl font-semibold text-primary">{fmtEGP(quarterly * 1_000_000)}</div>
                  <div className="text-xs text-muted-foreground mt-2">Annual</div>
                  <div className="font-display text-xl font-semibold text-primary">{fmtEGP(annual * 1_000_000)}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                Based on developer installment plan — 0% interest (typical for Egyptian developers).
              </div>
            </div>

            {/* Instalment frequency tabs */}
            <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <div className="flex border-b border-border">
                {(["monthly", "quarterly", "annual"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                      tab === t ? "border-b-2 border-accent text-accent bg-accent/5" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration</th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {tab === "monthly" ? "Monthly" : tab === "quarterly" ? "Quarterly" : "Annual"} Payment
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Paid</th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {schedule.map(({ yr, mo, qt, an }) => {
                      const payment = tab === "monthly" ? mo : tab === "quarterly" ? qt : an;
                      const count = tab === "monthly" ? yr * 12 : tab === "quarterly" ? yr * 4 : yr;
                      const total = remaining;
                      const isActive = yr === duration;
                      return (
                        <tr
                          key={yr}
                          onClick={() => setDuration(yr)}
                          className={`cursor-pointer transition-colors ${
                            isActive ? "bg-accent/8 font-semibold" : "hover:bg-secondary/50"
                          }`}
                        >
                          <td className={`py-3 pl-2 ${isActive ? "text-accent" : "text-primary"}`}>
                            {yr} years
                            {isActive && <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent uppercase">selected</span>}
                          </td>
                          <td className={`py-3 pr-2 text-right font-display text-base ${isActive ? "text-accent" : "text-primary"}`}>
                            {fmtEGP(payment * 1_000_000)}
                          </td>
                          <td className="py-3 pr-2 text-right text-muted-foreground">
                            {fmtEGP(total * 1_000_000)}
                          </td>
                          <td className="py-3 pr-2 text-right text-muted-foreground">{count}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Full summary */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="mb-4 font-display text-base font-semibold text-primary flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-accent" /> Full Payment Summary
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Unit price", value: fmtEGP(basePrice * 1_000_000) },
                  { label: `Down payment (${dpPct}%)`, value: fmtEGP(downPayment * 1_000_000), accent: true },
                  { label: "Remaining balance", value: fmtEGP(remaining * 1_000_000) },
                  { label: `Monthly installment (${duration} yrs)`, value: fmtEGP(monthly * 1_000_000), accent: true },
                  { label: `Quarterly installment (${duration} yrs)`, value: fmtEGP(quarterly * 1_000_000) },
                  { label: `Annual installment (${duration} yrs)`, value: fmtEGP(annual * 1_000_000) },
                  { label: `Maintenance fee (${maintenance}%)`, value: fmtEGP(maintenanceFee * 1_000_000) },
                  { label: "Total investment (excl. maintenance)", value: fmtEGP(basePrice * 1_000_000), total: true },
                ].map(({ label, value, accent, total }) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                      total ? "border border-primary/20 bg-primary/5 font-semibold" :
                      accent ? "bg-accent/5" : ""
                    }`}
                  >
                    <span className={total ? "text-primary" : "text-muted-foreground"}>{label}</span>
                    <span className={total ? "font-display text-base font-bold text-primary" : accent ? "font-semibold text-accent" : "font-medium text-primary"}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
                * Calculations assume 0% interest developer installment plan (standard for Egyptian off-plan real estate). Actual payment plan terms vary by developer and project launch. Contact your PropTrack advisor for exact terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
