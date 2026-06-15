import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { compounds } from "@/data/compounds";
import { areas } from "@/data/areas";
import {
  Sparkles, SlidersHorizontal, Building2, MapPin, Wallet,
  Calendar, Waves, CheckCircle2, ArrowRight, Phone,
  Star, ChevronRight, RefreshCw, Users
} from "lucide-react";

export const Route = createFileRoute("/suggestions")({
  head: () => ({
    meta: [
      { title: "Unit Finder — PropTrack" },
      { name: "description", content: "Tell us your client's needs and we'll match the best available units across all developers." },
    ],
  }),
  component: SuggestionsPage,
});

const ALL_TYPES = Array.from(new Set(compounds.flatMap((c) => c.types))).sort();
const ALL_AMENITIES = Array.from(new Set(compounds.flatMap((c) => c.amenities))).sort();
const POPULAR_AMENITIES = ["Clubhouse", "Swimming Pools", "Crystal Lagoon", "Gym & Spa", "Beachfront", "24/7 Security", "Golf", "Kids Area"];

type Form = {
  budgetMin: number;
  budgetMax: number;
  areas: string[];
  types: string[];
  deliveryMax: number;
  beachfront: boolean;
  amenities: string[];
  status: string;
};

const DEFAULT_FORM: Form = {
  budgetMin: 0,
  budgetMax: 100,
  areas: [],
  types: [],
  deliveryMax: 2030,
  beachfront: false,
  amenities: [],
  status: "",
};

function scoreCompound(c: typeof compounds[0], form: Form): number {
  let score = 0;
  if (form.areas.length > 0 && form.areas.includes(c.area)) score += 30;
  if (c.priceFrom >= form.budgetMin && c.priceFrom <= form.budgetMax) score += 25;
  if (form.types.length > 0) {
    const matched = form.types.filter((t) => c.types.includes(t)).length;
    score += (matched / form.types.length) * 20;
  }
  if (form.beachfront && c.beachfront) score += 15;
  if (form.amenities.length > 0) {
    const matched = form.amenities.filter((a) => c.amenities.includes(a)).length;
    score += (matched / form.amenities.length) * 10;
  }
  if (c.deliveryYear <= form.deliveryMax) score += 5;
  if (form.status && c.status === form.status) score += 5;
  if ((c as any).flagship) score += 3;
  return score;
}

function matchLabel(score: number) {
  if (score >= 70) return { label: "Excellent match", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (score >= 50) return { label: "Strong match", cls: "text-blue-700 bg-blue-50 border-blue-200" };
  if (score >= 30) return { label: "Good match", cls: "text-amber-700 bg-amber-50 border-amber-200" };
  return { label: "Possible match", cls: "text-muted-foreground bg-secondary border-border" };
}

function SuggestionsPage() {
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    if (!submitted) return [];
    return compounds
      .map((c) => ({ c, score: scoreCompound(c, form) }))
      .filter((x) => x.score > 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [submitted, form]);

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  function reset() { setForm(DEFAULT_FORM); setSubmitted(false); }

  const MAX_PRICE = 100;
  const CURRENT_YEAR = 2026;
  const YEARS = [2026, 2027, 2028, 2029, 2030];

  return (
    <Shell>
      <div className="border-b border-border/60 bg-gradient-to-br from-primary/8 via-transparent to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:py-12 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/70 text-white shadow-md">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">PropTrack Tools</div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-primary">Unit Finder</h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Enter your client's requirements below and PropTrack will instantly match the best available units across all developers, ranked by compatibility.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">

          {/* ── Left: Form ── */}
          <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="mb-5 font-display text-lg font-semibold text-primary flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" /> Client Requirements
              </h2>

              {/* Budget */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Wallet className="h-3 w-3" /> Budget range
                  </label>
                  <span className="text-sm font-semibold text-primary">
                    EGP {form.budgetMin}M – {form.budgetMax >= MAX_PRICE ? `${MAX_PRICE}M+` : `${form.budgetMax}M`}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-[11px] text-muted-foreground"><span>Min</span><span>EGP {form.budgetMin}M</span></div>
                    <input type="range" min={0} max={MAX_PRICE - 1} value={form.budgetMin}
                      onChange={(e) => setForm((f) => ({ ...f, budgetMin: Math.min(Number(e.target.value), f.budgetMax - 1) }))}
                      className="w-full accent-accent" />
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-[11px] text-muted-foreground"><span>Max</span><span>EGP {form.budgetMax >= MAX_PRICE ? `${MAX_PRICE}M+` : `${form.budgetMax}M`}</span></div>
                    <input type="range" min={1} max={MAX_PRICE} value={form.budgetMax}
                      onChange={(e) => setForm((f) => ({ ...f, budgetMax: Math.max(Number(e.target.value), f.budgetMin + 1) }))}
                      className="w-full accent-accent" />
                  </div>
                </div>
              </div>

              {/* Areas */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Preferred areas
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {areas.slice(0, 12).map((a) => (
                    <button
                      key={a.slug}
                      onClick={() => setForm((f) => ({ ...f, areas: toggle(f.areas, a.slug) }))}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        form.areas.includes(a.slug)
                          ? "border-accent bg-accent/10 text-accent font-medium"
                          : "border-border text-muted-foreground hover:border-accent"
                      }`}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Unit types */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Unit type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, types: toggle(f.types, t) }))}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        form.types.includes(t)
                          ? "border-accent bg-accent/10 text-accent font-medium"
                          : "border-border text-muted-foreground hover:border-accent"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery year */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Delivery by
                </label>
                <div className="flex gap-2">
                  {YEARS.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setForm((f) => ({ ...f, deliveryMax: yr }))}
                      className={`flex-1 rounded-xl py-2 text-xs font-semibold border transition-colors ${
                        form.deliveryMax === yr
                          ? "border-accent bg-accent text-white"
                          : "border-border text-muted-foreground hover:border-accent"
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project status</label>
                <div className="flex gap-2">
                  {["", "Delivered", "Under Construction", "Off-Plan"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className={`flex-1 rounded-xl py-2 text-xs font-medium border transition-colors ${
                        form.status === s
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-muted-foreground hover:border-accent"
                      }`}
                    >
                      {s || "Any"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Beachfront */}
              <div className="mb-5 flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Waves className="h-4 w-4 text-cyan-500" /> Beachfront only
                </span>
                <button
                  onClick={() => setForm((f) => ({ ...f, beachfront: !f.beachfront }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.beachfront ? "bg-accent" : "bg-border"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.beachfront ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Lifestyle amenities */}
              <div className="mb-6">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3" /> Lifestyle priorities
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_AMENITIES.map((a) => (
                    <button
                      key={a}
                      onClick={() => setForm((f) => ({ ...f, amenities: toggle(f.amenities, a) }))}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        form.amenities.includes(a)
                          ? "border-accent bg-accent/10 text-accent font-medium"
                          : "border-border text-muted-foreground hover:border-accent"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSubmitted(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-colors"
                >
                  <Sparkles className="h-4 w-4" /> Find matching units
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl border border-border p-3.5 text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <a
              href="tel:01233374501"
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-4 w-4" /> Speak to an advisor · 01233374501
            </a>
          </div>

          {/* ── Right: Results ── */}
          <div>
            {!submitted ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
                  <SlidersHorizontal className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary">Set your client's criteria</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                  Fill in the form and hit "Find matching units" to see ranked project recommendations.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-4">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary">No exact matches</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try widening the budget range or removing some filters.
                </p>
                <button onClick={reset} className="mt-4 text-sm text-accent hover:underline">
                  Reset criteria
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-primary">
                      {results.length} matching projects
                    </h2>
                    <p className="text-sm text-muted-foreground">Ranked by compatibility with your client's requirements</p>
                  </div>
                  <button onClick={reset} className="flex items-center gap-1.5 text-sm text-accent hover:underline">
                    <RefreshCw className="h-3.5 w-3.5" /> New search
                  </button>
                </div>
                <div className="space-y-4">
                  {results.map(({ c, score }, idx) => {
                    const { label, cls } = matchLabel(score);
                    const mismatches: string[] = [];
                    if (form.beachfront && !c.beachfront) mismatches.push("Not beachfront");
                    if (c.priceFrom < form.budgetMin) mismatches.push("Below min budget");
                    if (c.priceFrom > form.budgetMax) mismatches.push("Above max budget");
                    return (
                      <div
                        key={c.slug}
                        className={`group rounded-2xl border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                          idx === 0 ? "border-accent/40 ring-1 ring-accent/20" : "border-border/60"
                        }`}
                      >
                        <div className="flex flex-wrap items-start gap-4">
                          <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-secondary">
                            <img
                              src={c.hero || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=70`}
                              alt={c.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {idx === 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-bold text-accent">
                                  <Star className="h-3 w-3 fill-accent" /> Top pick
                                </span>
                              )}
                              <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
                                {label}
                              </span>
                              <span className="text-[11px] font-bold text-muted-foreground">
                                {Math.round(score)}% match
                              </span>
                            </div>
                            <h3 className="mt-1.5 font-display text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                              {c.name}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" /> {c.developer}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {c.area.replace(/-/g, " ")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Wallet className="h-3 w-3" /> EGP {c.priceFrom}M+
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {c.deliveryYear}
                              </span>
                            </div>
                            {/* Matching features */}
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {c.types.filter((t) => form.types.includes(t) || form.types.length === 0).slice(0, 3).map((t) => (
                                <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground">{t}</span>
                              ))}
                              {c.beachfront && (
                                <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[11px] font-medium text-cyan-700">
                                  <Waves className="inline h-2.5 w-2.5 mr-0.5" />Beachfront
                                </span>
                              )}
                              {form.amenities.filter((a) => c.amenities.includes(a)).slice(0, 3).map((a) => (
                                <span key={a} className="inline-flex items-center gap-1 rounded-full bg-accent/8 px-2.5 py-0.5 text-[11px] text-accent">
                                  <CheckCircle2 className="h-2.5 w-2.5" /> {a}
                                </span>
                              ))}
                            </div>
                            {mismatches.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {mismatches.map((m) => (
                                  <span key={m} className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] text-amber-600">{m}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="text-right">
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">From</div>
                              <div className="font-display text-xl font-bold text-primary">EGP {c.priceFrom}M</div>
                            </div>
                            <Link
                              to="/projects/$slug"
                              params={{ slug: c.slug }}
                              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              View project <ArrowRight className="h-3 w-3" />
                            </Link>
                            <Link
                              to="/calculator"
                              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                            >
                              Calculate payments <ChevronRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-6 text-center">
                  <h3 className="font-display text-lg font-semibold text-primary">Need a personalised shortlist?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Our advisors can prepare a full comparison report with unit-level pricing and availability.</p>
                  <a
                    href="tel:01233374501"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
                  >
                    <Phone className="h-4 w-4" /> Call us · 01233374501
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
