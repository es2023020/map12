import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { compoundBySlug } from "@/data/compounds";
import { breakdownByTypeSlug, unitTypeSlug } from "@/data/availability";
import type { UnitListing, ProjectAvailability } from "@/data/availability";
import type { Compound } from "@/data/compounds";
import {
  ArrowLeft, Phone, Ruler, Calendar, MapPin, Wallet,
  CheckCircle2, AlertCircle, Info, Building2, ExternalLink,
  Calculator, Filter, ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/units/$projectSlug/$typeSlug")({
  loader: ({ params }) => {
    const compound = compoundBySlug(params.projectSlug);
    if (!compound) throw notFound();
    const result = breakdownByTypeSlug(params.projectSlug, params.typeSlug);
    if (!result) throw notFound();
    return { compound, project: result.project, breakdown: result.breakdown };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      {
        title: `${loaderData.breakdown.type}${loaderData.breakdown.beds ? ` ${loaderData.breakdown.beds}BR` : ""} — ${loaderData.compound.name} | PropTrack`,
      },
      {
        name: "description",
        content: `${loaderData.breakdown.available} available ${loaderData.breakdown.type} units in ${loaderData.compound.name}. Prices from EGP ${loaderData.breakdown.minPriceM.toFixed(1)}M.`,
      },
    ] : [],
  }),
  component: UnitTypePage,
});

function fmtShort(egp: number) {
  const m = egp / 1_000_000;
  const s = m.toFixed(3).replace(/\.?0+$/, "");
  return `EGP ${s}M`;
}

function UnitTypePage() {
  const { typeSlug: currentTypeSlug } = Route.useParams();
  const { compound, project: avail, breakdown: bd } = Route.useLoaderData();

  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "size-asc" | "size-desc">("price-asc");
  const [filterView, setFilterView] = useState<string>("");
  const [filterFinishing, setFilterFinishing] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const title = bd.beds
    ? `${bd.type} — ${bd.beds} Bedroom${bd.beds > 1 ? "s" : ""}`
    : bd.type;

  const clusterLabel = bd.cluster ? ` · ${bd.cluster}` : "";
  const hasUnits = Boolean(bd.units && bd.units.length > 0);

  const uniqueViews = useMemo(() => {
    return Array.from(new Set(bd.units?.map((u) => u.view).filter(Boolean) ?? [])) as string[];
  }, [bd.units]);

  const uniqueDeliveries = useMemo(() => {
    return Array.from(new Set(bd.units?.map((u) => u.deliveryNote).filter(Boolean) ?? [])) as string[];
  }, [bd.units]);

  const uniqueFinishings = useMemo(() => {
    return Array.from(new Set(bd.units?.map((u) => u.finishing).filter(Boolean) ?? [])) as string[];
  }, [bd.units]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(bd.units?.map((u) => u.status).filter(Boolean) ?? [])) as string[];
  }, [bd.units]);

  const filteredUnits = useMemo(() => {
    if (!bd.units) return [];
    let list = [...bd.units];
    if (filterView) {
      list = list.filter((u) => u.view === filterView);
    }
    if (filterFinishing) {
      list = list.filter((u) => u.finishing === filterFinishing);
    }
    if (filterStatus) {
      list = list.filter((u) => u.status === filterStatus);
    }

    list.sort((a, b) => {
      if (sortBy === "price-asc") return a.priceEGP - b.priceEGP;
      if (sortBy === "price-desc") return b.priceEGP - a.priceEGP;
      if (sortBy === "size-asc") return a.areaSqm - b.areaSqm;
      if (sortBy === "size-desc") return b.areaSqm - a.areaSqm;
      return 0;
    });

    return list;
  }, [bd.units, sortBy, filterView, filterFinishing, filterStatus]);

  const otherTypes = avail.breakdown.filter((b) => unitTypeSlug(b) !== currentTypeSlug);

  return (
    <Shell>
      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <Link to="/projects" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> All projects
            </Link>
            <span>/</span>
            <Link to="/projects/$slug" params={{ slug: compound.slug }} className="hover:text-primary transition-colors truncate max-w-[160px]">
              {compound.name}
            </Link>
            <span>/</span>
            <span className="text-primary font-medium truncate">{title}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[280px] md:h-[340px] overflow-hidden">
        <img src={compound.hero} alt={compound.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {bd.available} unit{bd.available !== 1 ? "s" : ""} available
            </span>
            {bd.cluster && (
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                Cluster {bd.cluster}
              </span>
            )}
            {bd.finishing && (
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                {bd.finishing}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-1 text-white/70">
            {compound.name}{clusterLabel} · by {compound.developer}
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
            <StripStat icon={Wallet} label="Starting from" value={`EGP ${bd.minPriceM.toFixed(2)}M`} accent />
            <StripStat icon={Ruler} label="Size range" value={bd.minSqm === bd.maxSqm ? `${bd.minSqm} m²` : `${bd.minSqm}–${bd.maxSqm} m²`} />
            <StripStat icon={Building2} label="Units available" value={String(bd.available)} className="hidden md:flex" />
            <StripStat icon={Calendar} label="Data updated" value={avail.lastUpdated} className="hidden md:flex" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 space-y-10 pb-32 lg:pb-10">

        {/* Feature pills */}
        {(uniqueViews.length > 0 || uniqueDeliveries.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {uniqueViews.map((v) => (
              <span key={v} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300">
                🌊 {v}
              </span>
            ))}
            {uniqueDeliveries.map((d) => (
              <span key={d} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                📅 {d}
              </span>
            ))}
          </div>
        )}

        {/* ── Individual unit listings ── */}
        {hasUnits ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-display text-xl md:text-2xl font-semibold text-primary">
                  Available Listings ({filteredUnits.length} shown)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Filter and sort current live developer feeds.</p>
              </div>
              <span className="text-xs text-muted-foreground bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 dark:bg-emerald-950/20 dark:border-emerald-900/40">
                Verified: {avail.developer} · {avail.lastUpdated}
              </span>
            </div>

            {/* Filter and Sort Toolbar */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-secondary/20 p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mr-2">
                <Filter className="h-3.5 w-3.5" /> Filter list
              </div>
              {uniqueViews.length > 1 && (
                <select
                  value={filterView}
                  onChange={(e) => setFilterView(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="">All Views</option>
                  {uniqueViews.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              )}
              {uniqueFinishings.length > 1 && (
                <select
                  value={filterFinishing}
                  onChange={(e) => setFilterFinishing(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="">All Finishings</option>
                  {uniqueFinishings.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              )}
              {uniqueStatuses.length > 1 && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="">All Statuses</option>
                  {uniqueStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              )}
              
              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><ArrowUpDown className="h-3 w-3" /> Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-accent font-semibold"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="size-asc">Size: Smallest first</option>
                  <option value="size-desc">Size: Largest first</option>
                </select>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-4 sm:hidden">
              {filteredUnits.length > 0 ? (
                filteredUnits.map((unit, i) => (
                  <UnitCard key={unit.id} unit={unit} index={i + 1} />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No units match your selected filters. Clear filters to see all listings.
                </div>
              )}
            </div>

            {/* Desktop table */}
            {filteredUnits.length > 0 ? (
              <div className="hidden sm:block overflow-hidden rounded-2xl border border-border shadow-soft bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground w-10">#</th>
                        {bd.units!.some((u) => u.cluster) && (
                          <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Cluster</th>
                        )}
                        <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-semibold">Size</th>
                        <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Extra Area</th>
                        <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">View</th>
                        <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Delivery</th>
                        <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Finishing</th>
                        <th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Price</th>
                        <th className="px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredUnits.map((unit, i) => (
                        <tr
                          key={unit.id}
                          className={`hover:bg-secondary/20 transition-colors ${unit.status === "Last Unit" ? "bg-amber-50/20 dark:bg-amber-950/5" : ""}`}
                        >
                          <td className="px-4 py-3.5 text-muted-foreground text-xs font-semibold">{i + 1}</td>
                          {bd.units!.some((u) => u.cluster) && (
                            <td className="px-4 py-3.5">
                              {unit.cluster && (
                                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{unit.cluster}</span>
                              )}
                            </td>
                          )}
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-primary">{unit.areaSqm} m²</span>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground text-xs hidden lg:table-cell font-medium">
                            {unit.areaNote ?? <span className="text-border">—</span>}
                          </td>
                          <td className="px-4 py-3.5 hidden md:table-cell">
                            {unit.view ? (
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded">{unit.view}</span>
                            ) : (
                              <span className="text-border text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 hidden lg:table-cell">
                            {unit.deliveryNote ? (
                              <span className={`text-xs font-bold ${
                                unit.deliveryNote === "Ready to Move"
                                  ? "text-emerald-600"
                                  : unit.deliveryNote.includes("1 ")
                                  ? "text-amber-600"
                                  : "text-muted-foreground"
                              }`}>{unit.deliveryNote}</span>
                            ) : (
                              <span className="text-border text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <FinishingBadge label={unit.finishing} />
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="font-display text-sm font-extrabold text-primary whitespace-nowrap">
                              {fmtShort(unit.priceEGP)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {unit.status === "Last Unit" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                                <AlertCircle className="h-3 w-3" /> Last Unit
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" /> Available
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="hidden sm:block rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground bg-card">
                No units match your selected filters. Clear filters to see all listings.
              </div>
            )}

            {/* Payment plan note */}
            {bd.paymentPlan && (
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3.5 dark:border-blue-900/40 dark:bg-blue-950/20">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Standard Payment Plan</div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{bd.paymentPlan}</p>
              </div>
            )}
          </section>
        ) : (
          /* No individual listings — summary */
          <section>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Info className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-primary">Summary availability</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {bd.available} {bd.type} units across{" "}
                    {bd.minSqm === bd.maxSqm ? `${bd.minSqm} m²` : `${bd.minSqm}–${bd.maxSqm} m²`},{" "}
                    priced EGP {bd.minPriceM.toFixed(1)}M–{bd.maxPriceM.toFixed(1)}M.
                    {bd.finishing && ` Finishing: ${bd.finishing}.`}
                    {bd.paymentPlan && ` Payment: ${bd.paymentPlan}.`}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Call your PropTrack advisor for a complete unit-by-unit breakdown with exact floor plates, views and current offers.
                  </p>
                  <a href="tel:01233374501" className="mt-3 inline-block">
                    <Button size="sm" className="rounded-full gap-1.5 font-bold">
                      <Phone className="h-4 w-4" /> 01233374501
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Actions */}
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-primary">Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/calculator"
              search={{ project: compound.slug }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Payment Calculator
            </Link>
            <Link
              to="/projects/$slug"
              params={{ slug: compound.slug }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors"
            >
              <Building2 className="h-4 w-4" />
              Full project page
            </Link>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${compound.lat},${compound.lng}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <MapPin className="h-4 w-4" />
              Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* Other unit types */}
        {otherTypes.length > 0 && (
          <section>
            <h2 className="mb-4 font-display text-xl font-semibold text-primary">
              Other unit types in {compound.name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {otherTypes.map((b) => (
                <Link
                  key={unitTypeSlug(b)}
                  to="/units/$projectSlug/$typeSlug"
                  params={{ projectSlug: compound.slug, typeSlug: unitTypeSlug(b) }}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-accent/50 hover:bg-secondary/30 transition-all"
                >
                  <div>
                    <div className="font-medium text-primary text-sm">
                      {b.type}{b.beds ? ` · ${b.beds}BR` : ""}{b.cluster ? ` (${b.cluster})` : ""}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {b.available} available · from EGP {b.minPriceM.toFixed(1)}M
                    </div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-accent transition-colors text-lg leading-none">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-card/95 backdrop-blur-xl px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">{title}</div>
            <div className="font-display text-base font-semibold text-primary">from EGP {bd.minPriceM.toFixed(1)}M</div>
          </div>
          <a href="tel:01233374501">
            <Button size="sm" className="rounded-full shrink-0 gap-1.5">
              <Phone className="h-4 w-4" /> Call
            </Button>
          </a>
        </div>
      </div>
    </Shell>
  );
}

function StripStat({
  icon: Icon, label, value, accent = false, className = "",
}: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent?: boolean; className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 px-5 py-4 ${className}`}>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`mt-0.5 font-display text-sm font-semibold ${accent ? "text-accent" : "text-primary"}`}>{value}</div>
      </div>
    </div>
  );
}

function FinishingBadge({ label }: { label: string }) {
  const isFullyFinished = label.toLowerCase().includes("finished") && !label.toLowerCase().includes("semi") && !label.toLowerCase().includes("core");
  const isSemi = label.toLowerCase().includes("semi");
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
      isFullyFinished
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
        : isSemi
        ? "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
        : "bg-secondary text-muted-foreground"
    }`}>
      {label}
    </span>
  );
}

function UnitCard({ unit, index }: { unit: UnitListing; index: number }) {
  return (
    <div className={`rounded-2xl border p-4 ${unit.status === "Last Unit" ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/10" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">Unit #{index}</span>
        {unit.status === "Last Unit" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            <AlertCircle className="h-3 w-3" /> Last Unit
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Available
          </span>
        )}
      </div>
      <div className="font-display text-xl font-bold text-primary">{fmtShort(unit.priceEGP)}</div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Size</span>
          <div className="font-medium text-primary">{unit.areaSqm} m²{unit.areaNote ? ` ${unit.areaNote}` : ""}</div>
        </div>
        {unit.view && (
          <div>
            <span className="text-muted-foreground">View</span>
            <div className="font-medium text-blue-600 dark:text-blue-400">{unit.view}</div>
          </div>
        )}
        {unit.deliveryNote && (
          <div>
            <span className="text-muted-foreground">Delivery</span>
            <div className={`font-medium ${unit.deliveryNote === "Ready to Move" ? "text-emerald-600" : "text-amber-600"}`}>{unit.deliveryNote}</div>
          </div>
        )}
        <div>
          <span className="text-muted-foreground">Finishing</span>
          <div className="font-medium text-primary">{unit.finishing}</div>
        </div>
      </div>
      {unit.paymentPlan && (
        <div className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground leading-relaxed">
          {unit.paymentPlan}
        </div>
      )}
      <a href="tel:01233374501" className="mt-3 block">
        <Button size="sm" className="w-full rounded-full gap-1.5">
          <Phone className="h-3.5 w-3.5" /> Enquire
        </Button>
      </a>
    </div>
  );
}
