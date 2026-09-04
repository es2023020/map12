import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useStore } from "@/lib/store";
import {
  Calculator,
  ChevronDown,
  Phone,
  Wallet,
  Calendar,
  TrendingDown,
  Building2,
  CheckCircle2,
  Info,
  Search,
  Sliders,
  MapPin,
  Tag,
} from "lucide-react";
import { destinations } from "@/data/destinations";
import { compounds as staticCompounds, compoundBySlug } from "@/data/compounds";
import { isReadyToMove, hasRTMUnits, hasOffPlanUnits } from "@/lib/delivery";

export const Route = createFileRoute("/calculator")({
  validateSearch: (search: Record<string, unknown>): { project?: string; unitId?: string; unitType?: string; price?: string } => ({
    project: typeof search.project === "string" ? search.project : "",
    unitId: typeof search.unitId === "string" ? search.unitId : "",
    unitType: typeof search.unitType === "string" ? search.unitType : "",
    price: typeof search.price === "string" ? search.price : undefined,
  }),
  loader: async () => {
    const { loadAvailabilityAsync } = await import("@/data/availability");
    await loadAvailabilityAsync();
  },
  head: () => ({
    meta: [
      { title: "Payment Calculator — Property Atlas" },
      {
        name: "description",
        content:
          "Calculate down payment, monthly, quarterly and annual installments for any Egyptian real-estate project.",
      },
    ],
  }),
  component: CalculatorPage,
});

const DURATIONS = [5, 7, 8, 10, 12, 15];
const DP_OPTIONS = [2.5, 5, 10, 15, 20, 25, 30, 40, 50];

function fmt(n: number, decimals = 2) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(decimals) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toFixed(0);
}

function fmtEGP(n: number) {
  return "EGP " + n.toLocaleString("en-EG", { maximumFractionDigits: 0 });
}

function parseBudgetInput(input: string): number {
  const cleaned = input.toLowerCase().replace(/[^0-9.mk]/g, "");
  if (!cleaned) return 0;
  if (cleaned.endsWith("m")) {
    return parseFloat(cleaned) || 0;
  }
  if (cleaned.endsWith("k")) {
    return (parseFloat(cleaned) || 0) / 1000;
  }
  const val = parseFloat(cleaned) || 0;
  if (val >= 100_000) {
    return val / 1_000_000;
  }
  return val;
}

function parsePaymentPlan(plan?: string): { dp: number; duration: number } {
  if (!plan) return { dp: 10, duration: 8 };

  const lower = plan.toLowerCase();

  // Try matching down payment: e.g. "5% down", "10% down", "5% downpayment"
  let dp = 10;
  const dpMatch = lower.match(/(\d+)%\s*(?:down|dp|payment)/);
  if (dpMatch) {
    dp = parseInt(dpMatch[1]);
  }

  // Try matching installment years: e.g. "8 years", "10 years equal installments"
  let duration = 8;
  const durMatch = lower.match(/(\d+)\s*years/);
  if (durMatch) {
    duration = parseInt(durMatch[1]);
  } else {
    const durMatch2 = lower.match(/(\d+)\s*yr/);
    if (durMatch2) duration = parseInt(durMatch2[1]);
  }

  return { dp, duration };
}

function matchDestination(compDest: string, filterVal: string | string[]): boolean {
  if (!filterVal || (Array.isArray(filterVal) && filterVal.length === 0)) return true;
  const filters = Array.isArray(filterVal) ? filterVal : [filterVal];

  return filters.some((f) => {
    if (!f) return true;
    if (f === "macro-new-cairo") {
      const eastCairoSlugs = [
        "new-cairo",
        "mostakbal-city",
        "shorouk",
        "heliopolis",
        "obour",
        "sarai",
        "6th-settlement",
        "eastern-expansion",
        "new-administrative-capital",
      ];
      return eastCairoSlugs.includes(compDest);
    }
    if (f === "macro-west-cairo") {
      const westCairoSlugs = [
        "sheikh-zayed",
        "new-zayed",
        "6th-october",
        "northern-expansion",
      ];
      return westCairoSlugs.includes(compDest);
    }
    if (f === "macro-north-coast") {
      const sahelSlugs = [
        "sidi-heneish",
        "ras-el-hekma",
        "al-dabaa",
        "ghazala-bay",
        "sidi-abdelrahman",
        "new-alamein",
      ];
      return sahelSlugs.includes(compDest);
    }
    return compDest === f;
  });
}

function matchPropertyType(typeStr: string | string[] | undefined, filterVal: string): boolean {
  if (!filterVal) return true;
  if (!typeStr) return false;

  const checkSingle = (t: string) => {
    const lowerT = t.toLowerCase();
    switch (filterVal) {
      case "Apartment":
        return (
          lowerT.includes("apartment") ||
          lowerT.includes("studio") ||
          lowerT.includes("condo") ||
          lowerT.includes("br")
        );
      case "Duplex":
        return (
          lowerT.includes("duplex") ||
          lowerT.includes("i-villa") ||
          lowerT.includes("ivilla") ||
          lowerT.includes("sky villa") ||
          lowerT.includes("park villa") ||
          lowerT.includes("family house")
        );
      case "Penthouse":
        return lowerT.includes("penthouse") || lowerT.includes("loft");
      case "Town House":
        return (
          lowerT.includes("town") ||
          lowerT.includes("quad") ||
          lowerT.includes("fourplex") ||
          lowerT.includes("court")
        );
      case "Twin House":
        return lowerT.includes("twin");
      case "Villa":
        return (
          lowerT.includes("villa") ||
          lowerT.includes("stand alone") ||
          lowerT.includes("standalone") ||
          lowerT.includes("mansion") ||
          lowerT.includes("palace")
        );
      case "Chalet":
        return (
          lowerT.includes("chalet") ||
          lowerT.includes("cabana") ||
          lowerT.includes("cabin") ||
          lowerT.includes("beach house")
        );
      case "Commercial":
        return (
          lowerT.includes("office") ||
          lowerT.includes("retail") ||
          lowerT.includes("clinic") ||
          lowerT.includes("commercial")
        );
      default:
        return lowerT.includes(filterVal.toLowerCase());
    }
  };

  if (Array.isArray(typeStr)) {
    return typeStr.some(checkSingle);
  }
  return checkSingle(typeStr);
}

function CalculatorPage() {
  const compoundsList = useStore((s) => s.compoundsList) || [];
  const availabilityList = useStore((s) => s.availabilityList) || [];

  const allCompounds = useMemo(() => {
    if (compoundsList && compoundsList.length > 0) return compoundsList;
    return staticCompounds;
  }, [compoundsList]);

  const mainCompounds = useMemo(() => {
    return allCompounds.filter((c) => {
      if (c.parentSlug) return false;
      const avail = availabilityList.find((a) => a.slug === c.slug);
      if (!avail) return false;
      if (typeof avail.totalAvailable !== "number" || avail.totalAvailable <= 0) return false;
      if (!Array.isArray(avail.breakdown) || avail.breakdown.length === 0) return false;
      const hasPricing = avail.breakdown.some(
        (b: any) =>
          (typeof b.minPriceM === "number" && b.minPriceM > 0) ||
          (Array.isArray(b.units) && b.units.length > 0),
      );
      if (!hasPricing) return false;
      return true;
    });
  }, [allCompounds, availabilityList]);

  const { project: projectParam, unitId: unitIdParam, unitType: unitTypeParam, price: priceParam } = Route.useSearch();
  const [mode, setMode] = useState<"project" | "budget">(
    (projectParam || unitTypeParam || unitIdParam) ? "project" : "budget"
  );

  const initialProjectSlug = useMemo(() => {
    if (projectParam) return projectParam;
    return mainCompounds[0]?.slug ?? allCompounds[0]?.slug ?? "";
  }, [projectParam, mainCompounds, allCompounds]);

  const [projectSlug, setProjectSlug] = useState(projectParam || initialProjectSlug);

  // Directly sync projectParam from URL query to projectSlug and force mode="project"
  useEffect(() => {
    if (projectParam) {
      setProjectSlug(projectParam);
      setMode("project");
    }
  }, [projectParam]);

  const [projectSearchQuery, setProjectSearchQuery] = useState("");

  const selectedProject = useMemo(() => {
    if (!projectSlug) return null;
    const match = allCompounds.find((c) => c.slug === projectSlug);
    if (match) return match;
    return compoundBySlug(projectSlug) ?? null;
  }, [projectSlug, allCompounds]);

  const filteredMainCompounds = useMemo(() => {
    let list = allCompounds.length > 0 ? allCompounds : mainCompounds;
    if (projectSearchQuery.trim()) {
      const q = projectSearchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.developer.toLowerCase().includes(q) ||
          c.destination.toLowerCase().includes(q),
      );
    }
    if (selectedProject && !list.some((c) => c.slug === selectedProject.slug)) {
      list = [selectedProject, ...list];
    }
    return list;
  }, [allCompounds, mainCompounds, projectSearchQuery, selectedProject]);

  useEffect(() => {
    if (projectSearchQuery.trim() && filteredMainCompounds.length > 0) {
      if (!filteredMainCompounds.some((c) => c.slug === projectSlug)) {
        setProjectSlug(filteredMainCompounds[0].slug);
      }
    }
  }, [filteredMainCompounds, projectSearchQuery, projectSlug]);

  const [budgetText, setBudgetText] = useState("15,000,000");
  const [dpPct, setDpPct] = useState(10);
  const [duration, setDuration] = useState(8);
  const [unitType, setUnitType] = useState("");
  const [tab, setTab] = useState<"monthly" | "quarterly" | "annual">("monthly");

  // New unit selector state
  const [selectedUnitId, setSelectedUnitId] = useState("");

  // Advanced filters for "Find by Budget" mode
  const [budgetDestFilters, setBudgetDestFilters] = useState<string[]>([]);
  const [budgetTypeFilter, setBudgetTypeFilter] = useState("");
  const [budgetStatusFilter, setBudgetStatusFilter] = useState<"all" | "RTM" | "Off-Plan">("all");

  // Pagination / expansion limits for matched properties
  const [visibleUnitsLimit, setVisibleUnitsLimit] = useState(8);
  const [visibleProjectsLimit, setVisibleProjectsLimit] = useState(6);

  const projectAvail = useMemo(
    () => availabilityList.find((a) => a.slug === projectSlug),
    [projectSlug, availabilityList],
  );

  // Generate selectable unit types & specific individual units for the project
  const selectableItems = useMemo(() => {
    if (!projectAvail) return [];
    const list: Array<{ id: string; label: string; priceM: number; paymentPlan?: string }> = [];
    projectAvail.breakdown.forEach((b: any, bIdx: number) => {
      // Add the unit type group
      list.push({
        id: `type-${bIdx}`,
        label: `${b.type}${b.beds ? ` (${b.beds} BR)` : ""} · EGP ${b.minPriceM}M+ (Starting)`,
        priceM: b.minPriceM,
        paymentPlan: b.paymentPlan,
      });
      // Add individual units inside this type group
      (b.units ?? []).forEach((u: any) => {
        list.push({
          id: `unit-${u.id}`,
          label: `  ↳ Unit ${u.unitNo || "U-Row"} · ${b.type} · ${u.beds} BR · ${u.areaSqm} sqm · EGP ${(u.priceEGP / 1_000_000).toFixed(2)}M (${u.status})`,
          priceM: u.priceEGP / 1_000_000,
          paymentPlan: u.paymentPlan || b.paymentPlan,
        });
      });
    });
    return list;
  }, [projectAvail]);

  // Auto-select unit or unit type when passed in URL params
  useEffect(() => {
    if (selectableItems.length === 0) return;
    if (unitIdParam) {
      const match = selectableItems.find((item) => item.id === `unit-${unitIdParam}` || item.id === unitIdParam);
      if (match) {
        setSelectedUnitId(match.id);
        return;
      }
    }
    if (unitTypeParam) {
      const match = selectableItems.find((item) => item.label.toLowerCase().includes(unitTypeParam.toLowerCase()));
      if (match) {
        setSelectedUnitId(match.id);
        return;
      }
    }
    if (priceParam) {
      const priceNum = parseFloat(priceParam);
      if (!isNaN(priceNum) && priceNum > 0) {
        const priceM = priceNum > 1000 ? priceNum / 1_000_000 : priceNum;
        const closest = [...selectableItems].sort((a, b) => Math.abs(a.priceM - priceM) - Math.abs(b.priceM - priceM))[0];
        if (closest) {
          setSelectedUnitId(closest.id);
        }
      }
    }
  }, [selectableItems, unitIdParam, unitTypeParam, priceParam]);

  const activeUnitItem = useMemo(() => {
    return selectableItems.find((item) => item.id === selectedUnitId);
  }, [selectedUnitId, selectableItems]);

  // Dynamically update payment plan values based on selected project or selected unit
  useEffect(() => {
    if (mode === "project" && selectedProject) {
      const activePlan = activeUnitItem?.paymentPlan || selectedProject.paymentPlan;
      const parsed = parsePaymentPlan(activePlan);
      setDpPct(parsed.dp);
      setDuration(parsed.duration);
    }
  }, [mode, projectSlug, selectedProject, activeUnitItem]);

  // Reset selected unit when project changes (except on initial load with URL params)
  const [prevProjectSlug, setPrevProjectSlug] = useState(projectSlug);
  useEffect(() => {
    if (prevProjectSlug && prevProjectSlug !== projectSlug) {
      setSelectedUnitId("");
    }
    setPrevProjectSlug(projectSlug);
  }, [projectSlug, prevProjectSlug]);

  const parsedPrice = useMemo(() => {
    return parseBudgetInput(budgetText);
  }, [budgetText]);

  const basePrice =
    mode === "project"
      ? activeUnitItem
        ? activeUnitItem.priceM
        : (selectedProject?.priceFrom ?? 5)
      : parsedPrice || 5;

  const downPayment = basePrice * (dpPct / 100);
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

  const suitableUnits = useMemo(() => {
    const list: Array<{
      projectSlug: string;
      projectName: string;
      developer: string;
      type: string;
      beds: number;
      finishing: string;
      areaSqm: number;
      priceEGP: number;
      paymentPlan: string;
      deliveryNote: string;
      unitId: string;
    }> = [];

    availabilityList.forEach((p) => {
      const comp = compoundsList.find((c) => c.slug === p.slug);
      if (!comp) return;
      if (!p.totalAvailable || p.totalAvailable === 0 || !Array.isArray(p.breakdown) || p.breakdown.length === 0) return;

      // Filter by destination
      if (!matchDestination(comp.destination, budgetDestFilters)) return;

      p.breakdown.forEach((b: any) => {
        // Filter by unit type
        if (budgetTypeFilter && !matchPropertyType(b.type, budgetTypeFilter)) return;

        const units = b.units ?? [];
        units.forEach((u: any) => {
          const deliveryNote = u.deliveryNote || b.deliveryNote || "";
          const isRTM = isReadyToMove(comp.deliveryYear, deliveryNote, comp.status);

          if (budgetStatusFilter === "RTM" && !isRTM) return;
          if (budgetStatusFilter === "Off-Plan" && isRTM) return;

          const budgetLimit = basePrice * 1_000_000 * 1.1;
          if (u.priceEGP > 0 && u.priceEGP <= budgetLimit) {
            list.push({
              projectSlug: p.slug,
              projectName: comp.name,
              developer: p.developer || comp.developer,
              type: b.type || "Unit",
              beds: u.beds || b.beds || 0,
              finishing: u.finishing || b.finishing || "Finished",
              areaSqm: u.areaSqm || 0,
              priceEGP: u.priceEGP,
              paymentPlan: u.paymentPlan || b.paymentPlan || comp.paymentPlan,
              deliveryNote: deliveryNote,
              unitId: u.id,
            });
          }
        });
      });
    });

    return list.sort((a, b) => b.priceEGP - a.priceEGP);
  }, [
    basePrice,
    budgetDestFilters,
    budgetTypeFilter,
    budgetStatusFilter,
    compoundsList,
    availabilityList,
  ]);

  const suitableProjects = useMemo(() => {
    const budgetLimit = basePrice;
    const availMap = new Map(availabilityList.map((a) => [a.slug, a]));

    return mainCompounds
      .filter((c) => {
        const matchPrice = c.priceFrom <= budgetLimit;
        const matchDest = matchDestination(c.destination, budgetDestFilters);
        const matchType = !budgetTypeFilter || matchPropertyType(c.types, budgetTypeFilter);
        const avail = availMap.get(c.slug);
        const rtm = hasRTMUnits(c, avail);
        const offPlan = hasOffPlanUnits(c, avail);

        const matchStatus =
          budgetStatusFilter === "all" ||
          (budgetStatusFilter === "RTM" ? rtm : offPlan);
        return matchPrice && matchDest && matchType && matchStatus;
      })
      .sort((a, b) => b.priceFrom - a.priceFrom);
  }, [basePrice, budgetDestFilters, budgetTypeFilter, budgetStatusFilter, mainCompounds, availabilityList]);

  const projectTypes = selectedProject?.types ?? [];

  // Render helper for suitable properties
  const renderSuitableProperties = () => (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-primary flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-accent" /> Properties matching EGP {basePrice}M
            Budget
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Discover real-time inventory and starting compounds matching your budget preferences.
          </p>
        </div>

        {/* Dynamic Insight Banner */}
        <div className="rounded-lg bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
          💡 Found {suitableProjects.length} Projects &amp; {suitableUnits.length} Live Units
        </div>
      </div>

      {/* Advanced Budget Filters */}
      <div className="grid gap-3 sm:grid-cols-3 bg-secondary/20 p-4 rounded-xl border border-border/40">
        <div>
          <label className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Region Filter
            </span>
            {budgetDestFilters.length > 0 && (
              <span className="text-[10px] text-accent font-bold">
                {budgetDestFilters.length} selected
              </span>
            )}
          </label>
          <div className="relative">
            <select
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  setBudgetDestFilters([]);
                } else if (!budgetDestFilters.includes(val)) {
                  setBudgetDestFilters([...budgetDestFilters, val]);
                }
              }}
              className="w-full appearance-none rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
            >
              <option value="">
                {budgetDestFilters.length === 0
                  ? "All Regions (Choose 1 or more)"
                  : "+ Add another region..."}
              </option>
              <optgroup label="Macro Regions">
                <option value="macro-new-cairo">New Cairo (All East)</option>
                <option value="macro-west-cairo">West Cairo (Zayed &amp; October)</option>
                <option value="macro-north-coast">North Coast (All Sahel)</option>
              </optgroup>
              <optgroup label="Specific Destinations">
                {destinations.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} {budgetDestFilters.includes(d.slug) ? "✓" : ""}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          {budgetDestFilters.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {budgetDestFilters.map((slug) => {
                const dName =
                  slug === "macro-new-cairo"
                    ? "New Cairo (All East)"
                    : slug === "macro-west-cairo"
                      ? "West Cairo (Zayed & October)"
                      : slug === "macro-north-coast"
                        ? "North Coast (All Sahel)"
                        : destinations.find((d) => d.slug === slug)?.name || slug;
                return (
                  <span
                    key={slug}
                    className="inline-flex items-center gap-1 rounded-full bg-accent/15 border border-accent/30 px-2 py-0.5 text-[10px] font-bold text-accent"
                  >
                    {dName}
                    <button
                      type="button"
                      onClick={() =>
                        setBudgetDestFilters(budgetDestFilters.filter((s) => s !== slug))
                      }
                      className="hover:text-destructive text-accent/80 font-bold"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              <button
                type="button"
                onClick={() => setBudgetDestFilters([])}
                className="text-[9px] font-semibold text-muted-foreground hover:text-primary underline px-1"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
            <Tag className="h-3 w-3" /> Property Type
          </label>
          <select
            value={budgetTypeFilter}
            onChange={(e) => setBudgetTypeFilter(e.target.value)}
            className="w-full appearance-none rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">All Property Types</option>
            <option value="Apartment">Apartment &amp; Studio</option>
            <option value="Duplex">Duplex &amp; I-Villa</option>
            <option value="Penthouse">Penthouse &amp; Loft</option>
            <option value="Town House">Town House</option>
            <option value="Twin House">Twin House</option>
            <option value="Villa">Standalone Villa</option>
            <option value="Chalet">Chalet &amp; Cabana</option>
            <option value="Commercial">Commercial, Office &amp; Clinic</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Delivery Status
          </label>
          <select
            value={budgetStatusFilter}
            onChange={(e) => setBudgetStatusFilter(e.target.value as any)}
            className="w-full appearance-none rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All (RTM &amp; Off-Plan)</option>
            <option value="RTM">RTM (Ready to Move)</option>
            <option value="Off-Plan">Off-Plan</option>
          </select>
        </div>
      </div>

      {suitableUnits.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Search className="h-3 w-3" /> Matching Live Units ({suitableUnits.length} total)
            </h4>
            {suitableUnits.length > 8 && (
              <span className="text-[10px] text-muted-foreground font-medium">
                Showing {Math.min(visibleUnitsLimit, suitableUnits.length)} of {suitableUnits.length}
              </span>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {suitableUnits.slice(0, visibleUnitsLimit).map((u, i) => {
              const uDp = u.priceEGP * (dpPct / 100);
              const uRem = u.priceEGP - uDp;
              const uMonthly = uRem / (duration * 12);
              return (
                <div
                  key={i}
                  className="group relative rounded-xl border border-border bg-secondary/30 p-3.5 hover:bg-card hover:border-accent/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <span className="font-semibold text-primary text-xs truncate group-hover:text-accent transition-colors">
                        {u.projectName}
                      </span>
                      <span className="text-xs font-bold text-accent shrink-0">
                        {fmtEGP(u.priceEGP)}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">{u.developer}</div>
                    <div className="text-xs text-primary mt-2 font-medium">
                      {u.type} · {u.beds > 0 ? `${u.beds} Beds` : ""} ·{" "}
                      {u.areaSqm > 0 ? `${u.areaSqm} sqm` : ""}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                      {u.finishing} · {u.deliveryNote || "Contact for delivery"}
                    </div>
                  </div>

                  {/* Light Hover Popups for Down Payment & Monthly Payment */}
                  <div className="mt-3 opacity-95 transition-all">
                    <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/40 text-[10px]">
                      <div className="rounded-lg bg-accent/10 border border-accent/25 p-1.5 text-center">
                        <div className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">
                          💡 {dpPct}% Down Payment
                        </div>
                        <div className="font-bold text-accent truncate">
                          {fmtEGP(uDp)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-primary/10 border border-primary/20 p-1.5 text-center">
                        <div className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">
                          📅 Monthly ({duration}Y)
                        </div>
                        <div className="font-bold text-primary truncate">
                          {fmtEGP(uMonthly)}/mo
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[9px] text-muted-foreground truncate max-w-[120px]">
                      {u.paymentPlan}
                    </span>
                    <Link
                      to="/projects/$slug"
                      params={{ slug: u.projectSlug }}
                      className="text-[10px] font-bold text-accent hover:underline shrink-0 flex items-center gap-0.5"
                    >
                      View Project →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* See More Live Units Button */}
          {suitableUnits.length > visibleUnitsLimit ? (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setVisibleUnitsLimit((prev) => prev + 8)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all shadow-sm"
              >
                See More Live Units ({suitableUnits.length - visibleUnitsLimit} remaining) ↓
              </button>
            </div>
          ) : visibleUnitsLimit > 8 ? (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setVisibleUnitsLimit(8)}
                className="text-[11px] font-semibold text-muted-foreground hover:text-primary underline"
              >
                Show Less Units ↑
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
          No live inventory units listed under EGP {basePrice}M yet matching your filter. See
          starting projects below or adjust filters.
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-accent">
            Projects Starting Within Budget ({suitableProjects.length} total)
          </h4>
          {suitableProjects.length > 6 && (
            <span className="text-[10px] text-muted-foreground font-medium">
              Showing {Math.min(visibleProjectsLimit, suitableProjects.length)} of {suitableProjects.length}
            </span>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {suitableProjects.slice(0, visibleProjectsLimit).map((p) => (
            <Link
              key={p.slug}
              to="/projects/$slug"
              params={{ slug: p.slug }}
              className="group rounded-xl border border-border/60 bg-card p-3 hover:border-accent/40 shadow-soft hover:-translate-y-0.5 transition-all"
            >
              <div className="font-semibold text-primary text-[11px] group-hover:text-accent transition-colors truncate">
                {p.name}
              </div>
              <div className="text-[9px] text-muted-foreground truncate">{p.developer}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground truncate max-w-[50px]">
                  {p.destination.replace(/-/g, " ")}
                </span>
                <span className="text-[10px] font-bold text-primary">From {p.priceFrom}M</span>
              </div>
            </Link>
          ))}
        </div>

        {/* See More Projects Button */}
        {suitableProjects.length > visibleProjectsLimit ? (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setVisibleProjectsLimit((prev) => prev + 6)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all shadow-sm"
            >
              See More Projects ({suitableProjects.length - visibleProjectsLimit} remaining) ↓
            </button>
          </div>
        ) : visibleProjectsLimit > 6 ? (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setVisibleProjectsLimit(6)}
              className="text-[11px] font-semibold text-muted-foreground hover:text-primary underline"
            >
              Show Less Projects ↑
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <Shell>
      <div className="border-b border-border/60 bg-gradient-to-br from-primary/8 via-transparent to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:py-12 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-md">
              <Calculator className="h-6 w-6" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Property Atlas Tools
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-primary flex items-center gap-2">
                Payment Calculator &amp; Budget Finder
              </h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Select a project, calculate down payment/installments, or search for live properties
            matching your custom budget.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* ── Left: Inputs ── */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="mb-4 font-display text-lg font-semibold text-primary flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent" /> Mode &amp; Price
              </h2>

              {/* Mode toggle */}
              <div className="mb-5 flex rounded-xl border border-border overflow-hidden">
                {(["project", "budget"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="flex-1 py-2 text-xs font-semibold transition-colors first:rounded-l-lg last:rounded-r-lg"
                    style={{
                      background: mode === m ? "var(--accent)" : "transparent",
                      color: mode === m ? "#fff" : "var(--muted-foreground)",
                    }}
                  >
                    {m === "project" ? "By Project" : "Find by Budget"}
                  </button>
                ))}
              </div>

              {mode === "project" && (
                <div className="space-y-3">
                  {/* Search Bar for Project */}
                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <span>Search Project</span>
                      {projectSearchQuery && (
                        <span className="text-[10px] text-accent font-semibold">
                          {filteredMainCompounds.length} matches
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Type to search project, developer, region..."
                        value={projectSearchQuery}
                        onChange={(e) => setProjectSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background pl-9 pr-8 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      {projectSearchQuery && (
                        <button
                          onClick={() => setProjectSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary text-xs font-bold"
                          title="Clear search"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Selected Project ({filteredMainCompounds.length} available)
                    </label>
                    <div className="relative">
                      <select
                        value={projectSlug}
                        onChange={(e) => setProjectSlug(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        {filteredMainCompounds.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name} ({c.developer}) — EGP {c.priceFrom}M
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Unit Selector */}
                  {selectableItems.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Specific Unit or Type
                      </label>
                      <div className="relative">
                        <select
                          value={selectedUnitId}
                          onChange={(e) => setSelectedUnitId(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-2.5 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-accent font-mono text-[11px]"
                        >
                          <option value="">
                            Default (Minimum EGP {selectedProject?.priceFrom}M starting)
                          </option>
                          {selectableItems.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  {projectTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {projectTypes.map((t: string) => (
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
                      {activeUnitItem && (
                        <div className="flex justify-between border-b border-dashed border-border/60 pb-1 mb-1.5 text-xs">
                          <span className="text-muted-foreground font-semibold">
                            Active Selection
                          </span>
                          <span
                            className="font-bold text-accent truncate max-w-[200px]"
                            title={activeUnitItem.label}
                          >
                            {activeUnitItem.label.trim()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Developer</span>
                        <span className="font-medium text-primary">
                          {selectedProject.developer}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Destination</span>
                        <span className="font-medium text-primary">
                          {selectedProject.destination.replace(/-/g, " ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium text-primary">
                          {selectedProject.deliveryYear}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Calculated Plan</span>
                        <span className="font-medium text-accent">
                          {activeUnitItem?.paymentPlan || selectedProject.paymentPlan}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-border/40 mt-2 flex justify-end">
                        <Link
                          to="/projects/$slug"
                          params={{ slug: selectedProject.slug }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                        >
                          View project page →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mode === "budget" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                      Target Budget (EGP)
                    </label>
                    <div className="relative rounded-xl border border-border bg-background px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-accent">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                        EGP
                      </span>
                      <input
                        type="text"
                        value={budgetText}
                        onChange={(e) => setBudgetText(e.target.value)}
                        placeholder="e.g. 15,000,000 or 15M"
                        className="w-full bg-transparent pl-8 pr-12 text-base font-semibold focus:outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-accent uppercase">
                        {parsedPrice > 0 ? `${fmt(parsedPrice)}` : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Budget Quick Select Pills */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Quick Select Budgets
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[5, 10, 15, 20, 30, 50, 80].map((val) => (
                        <button
                          key={val}
                          onClick={() => setBudgetText((val * 1_000_000).toLocaleString())}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all hover:bg-accent/5 hover:border-accent ${
                            parsedPrice === val
                              ? "bg-accent text-white border-accent hover:bg-accent hover:text-white"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {val}M
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                      Quick Adjust Slider
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={150}
                      step={0.5}
                      value={parsedPrice || 15}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBudgetText(val.toLocaleString("en-US") + "M");
                      }}
                      className="w-full accent-accent"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>EGP 1M</span>
                      <span>EGP 150M</span>
                    </div>
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
                <span className="font-display text-xl font-bold text-accent">
                  {fmtEGP(downPayment * 1_000_000)}
                </span>
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



            <a
              href="tel:201029324783"
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-4 w-4" /> Call Advisor
            </a>
          </div>

          {/* ── Right: Results ── */}
          <div className="space-y-6">
            {/* In Budget Mode, display Suitable Properties on TOP */}
            {mode === "budget" && renderSuitableProperties()}

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Unit Price",
                  value: fmtEGP(basePrice * 1_000_000),
                  color: "text-primary",
                  bg: "bg-secondary/50",
                },
                {
                  label: "Down Payment",
                  value: fmtEGP(downPayment * 1_000_000),
                  color: "text-accent",
                  bg: "bg-accent/8",
                },
                {
                  label: "Remaining",
                  value: fmtEGP(remaining * 1_000_000),
                  color: "text-primary",
                  bg: "bg-secondary/50",
                },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl border border-border ${s.bg} p-4`}>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                  <div className={`mt-1.5 font-display text-lg font-bold ${s.color} leading-tight`}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Active plan highlight */}
            <div className="rounded-2xl border-2 border-accent bg-gradient-to-br from-accent/10 to-transparent p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Selected plan · {dpPct}% DP · {duration} years
                  </div>
                  <div className="mt-2 font-display text-4xl font-bold text-primary">
                    {fmtEGP(monthly * 1_000_000)}
                    <span className="ml-2 text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-sm text-muted-foreground">Quarterly</div>
                  <div className="font-display text-2xl font-semibold text-primary">
                    {fmtEGP(quarterly * 1_000_000)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Annual</div>
                  <div className="font-display text-xl font-semibold text-primary">
                    {fmtEGP(annual * 1_000_000)}
                  </div>
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
                      tab === t
                        ? "border-b-2 border-accent text-accent bg-accent/5"
                        : "text-muted-foreground hover:text-primary"
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
                      <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Duration
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {tab === "monthly"
                          ? "Monthly"
                          : tab === "quarterly"
                            ? "Quarterly"
                            : "Annual"}{" "}
                        Payment
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Paid
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Payments
                      </th>
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
                            {isActive && (
                              <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent uppercase">
                                selected
                              </span>
                            )}
                          </td>
                          <td
                            className={`py-3 pr-2 text-right font-display text-base ${isActive ? "text-accent" : "text-primary"}`}
                          >
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
                  {
                    label: `Down payment (${dpPct}%)`,
                    value: fmtEGP(downPayment * 1_000_000),
                    accent: true,
                  },
                  { label: "Remaining balance", value: fmtEGP(remaining * 1_000_000) },
                  {
                    label: `Monthly installment (${duration} yrs)`,
                    value: fmtEGP(monthly * 1_000_000),
                    accent: true,
                  },
                  {
                    label: `Quarterly installment (${duration} yrs)`,
                    value: fmtEGP(quarterly * 1_000_000),
                  },
                  {
                    label: `Annual installment (${duration} yrs)`,
                    value: fmtEGP(annual * 1_000_000),
                  },
                  {
                    label: "Total investment",
                    value: fmtEGP(basePrice * 1_000_000),
                    total: true,
                  },
                ].map(({ label, value, accent, total }) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                      total
                        ? "border border-primary/20 bg-primary/5 font-semibold"
                        : accent
                          ? "bg-accent/5"
                          : ""
                    }`}
                  >
                    <span className={total ? "text-primary" : "text-muted-foreground"}>
                      {label}
                    </span>
                    <span
                      className={
                        total
                          ? "font-display text-base font-bold text-primary"
                          : accent
                            ? "font-semibold text-accent"
                            : "font-medium text-primary"
                      }
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
                * Calculations assume 0% interest developer installment plan (standard for Egyptian
                off-plan real estate). Actual payment plan terms vary by developer and project
                launch. Contact your Property Atlas advisor for exact terms.
              </p>
            </div>

            {/* In Project mode, display Suitable Properties at the BOTTOM */}
            {mode !== "budget" && renderSuitableProperties()}
          </div>
        </div>
      </div>
    </Shell>
  );
}
