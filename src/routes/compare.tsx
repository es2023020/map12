import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { compounds, compoundBySlug } from "@/data/compounds";
import { availabilityBySlug } from "@/data/availability";
import { useStore } from "@/lib/store";
import { 
  GitCompareArrows, Search, ChevronDown, Check, Star, 
  MapPin, Calendar, Building2, Wallet, Waves, ArrowRight,
  TrendingDown, Info, ShieldCheck, ArrowUpDown, Sliders, Download
} from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Side-by-Side Project Comparison | PropTrack" },
      { name: "description", content: "Compare prices, delivery years, available inventory, and payment terms side-by-side for Egyptian real estate compounds." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const compareList = useStore((s) => s.compareList);
  
  // Set initial selected slugs based on compareList in store, fallback to default projects
  const initialA = compareList[0] || "creekview";
  const initialB = compareList[1] || "direction-white";

  const [slugA, setSlugA] = useState(initialA);
  const [slugB, setSlugB] = useState(initialB);

  const [selectedTypeIdxA, setSelectedTypeIdxA] = useState<number | 'all'>('all');
  const [selectedTypeIdxB, setSelectedTypeIdxB] = useState<number | 'all'>('all');

  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  // States for difference highlighting & filtering
  const [highlightDiffs, setHighlightDiffs] = useState(true);
  const [showDiffsOnly, setShowDiffsOnly] = useState(false);

  const compA = useMemo(() => compoundBySlug(slugA), [slugA]);
  const compB = useMemo(() => compoundBySlug(slugB), [slugB]);

  const availA = useMemo(() => availabilityBySlug(slugA), [slugA]);
  const availB = useMemo(() => availabilityBySlug(slugB), [slugB]);

  const filteredCompoundsA = useMemo(() => {
    if (!searchA) return compounds.slice(0, 10);
    return compounds
      .filter((c) => c.name.toLowerCase().includes(searchA.toLowerCase()))
      .slice(0, 10);
  }, [searchA]);

  const filteredCompoundsB = useMemo(() => {
    if (!searchB) return compounds.slice(0, 10);
    return compounds
      .filter((c) => c.name.toLowerCase().includes(searchB.toLowerCase()))
      .slice(0, 10);
  }, [searchB]);

  // Quick Comparison suggestions
  const QUICK_PAIRS = [
    { label: "Creekview vs Marresidence", a: "creekview", b: "marresidence" },
    { label: "Marassi vs Gaia", a: "marassi", b: "gaia" },
    { label: "Solana vs Badya", a: "solana", b: "badya" },
    { label: "Ogami vs Cali Coast", a: "ogami", b: "cali-coast-ras-el-hekma" },
  ];

  // Reset selected unit types when compound slugs change
  const handleSelectA = (slug: string) => {
    setSlugA(slug);
    setSelectedTypeIdxA('all');
    setShowDropdownA(false);
    setSearchA("");
  };

  const handleSelectB = (slug: string) => {
    setSlugB(slug);
    setSelectedTypeIdxB('all');
    setShowDropdownB(false);
    setSearchB("");
  };

  // Resolve specs dynamically
  const specsA = useMemo(() => {
    if (!compA) return null;
    const isAll = selectedTypeIdxA === 'all';
    const bd = !isAll && availA ? availA.breakdown[selectedTypeIdxA as number] : null;
    return {
      price: bd ? bd.minPriceM : compA.priceFrom,
      delivery: bd ? (bd.deliveryNote || compA.deliveryYear.toString()) : compA.deliveryYear.toString(),
      qty: bd ? bd.available : (availA?.totalAvailable ?? 0),
      area: bd ? (bd.minSqm === bd.maxSqm ? `${bd.minSqm} m²` : `${bd.minSqm}–${bd.maxSqm} m²`) : (compA.areaSize || "—"),
      type: bd ? `${bd.type}${bd.beds ? ` (${bd.beds} BR)` : ""}` : compA.types.join(", "),
      pay: bd ? (bd.paymentPlan || compA.paymentPlan) : compA.paymentPlan,
      finish: bd ? (bd.finishing || "Project Standard") : "Project Standard",
      cluster: bd ? bd.cluster || "All Phases" : "All Phases"
    };
  }, [compA, availA, selectedTypeIdxA]);

  const specsB = useMemo(() => {
    if (!compB) return null;
    const isAll = selectedTypeIdxB === 'all';
    const bd = !isAll && availB ? availB.breakdown[selectedTypeIdxB as number] : null;
    return {
      price: bd ? bd.minPriceM : compB.priceFrom,
      delivery: bd ? (bd.deliveryNote || compB.deliveryYear.toString()) : compB.deliveryYear.toString(),
      qty: bd ? bd.available : (availB?.totalAvailable ?? 0),
      area: bd ? (bd.minSqm === bd.maxSqm ? `${bd.minSqm}.00 m²` : `${bd.minSqm}–${bd.maxSqm} m²`) : (compB.areaSize || "—"),
      type: bd ? `${bd.type}${bd.beds ? ` (${bd.beds} BR)` : ""}` : compB.types.join(", "),
      pay: bd ? (bd.paymentPlan || compB.paymentPlan) : compB.paymentPlan,
      finish: bd ? (bd.finishing || "Project Standard") : "Project Standard",
      cluster: bd ? bd.cluster || "All Phases" : "All Phases"
    };
  }, [compB, availB, selectedTypeIdxB]);

  // Highlights Calculations
  const cheaperPrice = useMemo(() => {
    if (!specsA || !specsB) return null;
    if (specsA.price < specsB.price) return "A";
    if (specsB.price < specsA.price) return "B";
    return null;
  }, [specsA, specsB]);

  const largerQty = useMemo(() => {
    if (!specsA || !specsB) return null;
    if (specsA.qty > specsB.qty) return "A";
    if (specsB.qty > specsA.qty) return "B";
    return null;
  }, [specsA, specsB]);

  const soonerDeliv = useMemo(() => {
    if (!specsA || !specsB) return null;
    const extractYear = (str: string) => {
      const match = str.match(/\d+/);
      if (!match) return 9999;
      const y = parseInt(match[0]);
      return y < 100 ? 2000 + y : y;
    };
    const yrA = extractYear(specsA.delivery);
    const yrB = extractYear(specsB.delivery);
    if (yrA < yrB) return "A";
    if (yrB < yrA) return "B";
    return null;
  }, [specsA, specsB]);

  // Construct comparison rows
  const comparisonRows = useMemo(() => {
    if (!compA || !compB || !specsA || !specsB) return [];

    return [
      { 
        label: "Developer", 
        displayA: compA.developer,
        displayB: compB.developer,
        icon: Building2,
        isDifferent: compA.developer !== compB.developer
      },
      { 
        label: "Destination", 
        displayA: compA.destination.replace("-", " ").toUpperCase(),
        displayB: compB.destination.replace("-", " ").toUpperCase(),
        icon: MapPin,
        isDifferent: compA.destination !== compB.destination
      },
      { 
        label: "Compound Status", 
        displayA: compA.status,
        displayB: compB.status,
        icon: ShieldCheck,
        isDifferent: compA.status !== compB.status
      },
      { 
        label: "Unit Type / Configuration", 
        displayA: specsA.type,
        displayB: specsB.type,
        icon: Sliders,
        isDifferent: specsA.type !== specsB.type
      },
      { 
        label: "Inventory Cluster / Phase", 
        displayA: specsA.cluster,
        displayB: specsB.cluster,
        icon: Info,
        isDifferent: specsA.cluster !== specsB.cluster
      },
      { 
        label: "Finishing Type", 
        displayA: specsA.finish,
        displayB: specsB.finish,
        icon: ShieldCheck,
        isDifferent: specsA.finish !== specsB.finish
      },
      { 
        label: "Unit Area Size (BUA)", 
        displayA: specsA.area,
        displayB: specsB.area,
        icon: ArrowUpDown,
        isDifferent: specsA.area !== specsB.area
      },
      { 
        label: "Starting Price", 
        displayA: `EGP ${specsA.price}M ${cheaperPrice === "A" ? "★ Lower" : ""}`,
        displayB: `EGP ${specsB.price}M ${cheaperPrice === "B" ? "★ Lower" : ""}`,
        icon: Wallet,
        isDifferent: specsA.price !== specsB.price
      },
      { 
        label: "Delivery Timeline", 
        displayA: `${specsA.delivery} ${soonerDeliv === "A" ? "★ Sooner" : ""}`,
        displayB: `${specsB.delivery} ${soonerDeliv === "B" ? "★ Sooner" : ""}`,
        icon: Calendar,
        isDifferent: specsA.delivery !== specsB.delivery
      },
      { 
        label: "Payment Terms", 
        displayA: specsA.pay,
        displayB: specsB.pay,
        icon: Calendar,
        isDifferent: specsA.pay !== specsB.pay
      },
      { 
        label: "Active Listings Volume", 
        displayA: specsA.qty > 0 ? `${specsA.qty} units available ${largerQty === "A" ? "★ Higher" : ""}` : `Not updated yet`,
        displayB: specsB.qty > 0 ? `${specsB.qty} units available ${largerQty === "B" ? "★ Higher" : ""}` : `Not updated yet`,
        icon: Star,
        isDifferent: specsA.qty !== specsB.qty
      },
    ];
  }, [compA, compB, specsA, specsB, cheaperPrice, soonerDeliv, largerQty]);

  const visibleRows = useMemo(() => {
    if (showDiffsOnly) {
      return comparisonRows.filter(r => r.isDifferent);
    }
    return comparisonRows;
  }, [comparisonRows, showDiffsOnly]);

  // Download PDF using browser print dialog (print only the comparison report)
  const handleDownloadPDF = () => {
    const printContent = document.getElementById("comparison-report-container");
    if (!printContent) return;
    const originalTitle = document.title;
    document.title = `PropTrack — ${compA?.name ?? "Project A"} vs ${compB?.name ?? "Project B"}`;
    const style = document.createElement("style");
    style.id = "print-only-style";
    style.innerHTML = `
      @media print {
        body > * { display: none !important; }
        #comparison-report-container { display: block !important; }
        #comparison-report-container * { display: revert !important; }
        .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.title = originalTitle;
    setTimeout(() => {
      const s = document.getElementById("print-only-style");
      if (s) s.remove();
    }, 1000);
  };

  return (
    <Shell>
      <div className="bg-slate-900 text-white border-b border-white/5 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                <GitCompareArrows className="h-3.5 w-3.5" /> Project Comparison Engine
              </div>
              <h1 className="mt-2 font-display text-3xl md:text-4xl font-extrabold tracking-tight">
                Side-by-Side Analysis
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                Compare Egyptian properties, listing volumes, starting prices, and delivery terms in real-time.
              </p>
            </div>
            
            {/* Quick suggestions */}
            <div className="flex flex-wrap items-center gap-2 max-w-md bg-slate-950/40 p-4 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase w-full">Quick Comparisons</span>
              {QUICK_PAIRS.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => {
                    handleSelectA(qp.a);
                    handleSelectB(qp.b);
                  }}
                  className="rounded-lg bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 text-[10px] font-semibold text-slate-300 transition-colors border border-white/5"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Selector Bar */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          {/* Selector A Container */}
          <div className="space-y-4 bg-slate-900/10 p-5 rounded-2xl border border-border shadow-soft">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Project A</label>
              <div className="relative">
                <button 
                  onClick={() => setShowDropdownA(!showDropdownA)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-primary shadow-soft hover:bg-secondary/20 transition-colors"
                >
                  <span>{compA?.name ?? "Select Project A"}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                
                {showDropdownA && (
                  <div className="absolute left-0 right-0 z-20 mt-1 rounded-xl border border-border bg-card p-2 shadow-lg animate-fade-in">
                    <div className="relative flex items-center border-b border-border/60 pb-2 mb-2">
                      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search compound..." 
                        value={searchA}
                        onChange={(e) => setSearchA(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 text-xs bg-secondary/50 rounded-lg border-0 focus:ring-1 focus:ring-accent focus:outline-none"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {filteredCompoundsA.map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => handleSelectA(c.slug)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors ${
                            slugA === c.slug ? "bg-accent/15 text-accent" : "hover:bg-secondary/80 text-primary"
                          }`}
                        >
                          <span>{c.name}</span>
                          {slugA === c.slug && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Unit Type Select A */}
            {availA && availA.breakdown.length > 0 ? (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Project A Unit Type</label>
                <select
                  value={selectedTypeIdxA}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedTypeIdxA(val === 'all' ? 'all' : parseInt(val));
                  }}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="all">All Unit Types (Compound Specs)</option>
                  {availA.breakdown.map((b, idx) => (
                    <option key={idx} value={idx}>
                      {b.type}{b.beds ? ` - ${b.beds} BR` : ""}{b.cluster ? ` (${b.cluster})` : ""} · EGP {b.minPriceM}M+
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Project A Unit Type</label>
                <select disabled className="w-full rounded-xl border border-border bg-card/50 px-3 py-2.5 text-xs font-semibold text-muted-foreground cursor-not-allowed">
                  <option>No specific unit type available</option>
                </select>
              </div>
            )}
          </div>

          {/* Selector B Container */}
          <div className="space-y-4 bg-slate-900/10 p-5 rounded-2xl border border-border shadow-soft">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Project B</label>
              <div className="relative">
                <button 
                  onClick={() => setShowDropdownB(!showDropdownB)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-primary shadow-soft hover:bg-secondary/20 transition-colors"
                >
                  <span>{compB?.name ?? "Select Project B"}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                
                {showDropdownB && (
                  <div className="absolute left-0 right-0 z-20 mt-1 rounded-xl border border-border bg-card p-2 shadow-lg animate-fade-in">
                    <div className="relative flex items-center border-b border-border/60 pb-2 mb-2">
                      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search compound..." 
                        value={searchB}
                        onChange={(e) => setSearchB(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 text-xs bg-secondary/50 rounded-lg border-0 focus:ring-1 focus:ring-accent focus:outline-none"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {filteredCompoundsB.map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => handleSelectB(c.slug)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors ${
                            slugB === c.slug ? "bg-accent/15 text-accent" : "hover:bg-secondary/80 text-primary"
                          }`}
                        >
                          <span>{c.name}</span>
                          {slugB === c.slug && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Unit Type Select B */}
            {availB && availB.breakdown.length > 0 ? (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Project B Unit Type</label>
                <select
                  value={selectedTypeIdxB}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedTypeIdxB(val === 'all' ? 'all' : parseInt(val));
                  }}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="all">All Unit Types (Compound Specs)</option>
                  {availB.breakdown.map((b, idx) => (
                    <option key={idx} value={idx}>
                      {b.type}{b.beds ? ` - ${b.beds} BR` : ""}{b.cluster ? ` (${b.cluster})` : ""} · EGP {b.minPriceM}M+
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Project B Unit Type</label>
                <select disabled className="w-full rounded-xl border border-border bg-card/50 px-3 py-2.5 text-xs font-semibold text-muted-foreground cursor-not-allowed">
                  <option>No specific unit type available</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {compA && compB && specsA && specsB ? (
          <div id="comparison-report-container" className="space-y-8 animate-fade-in">
            {/* Visual Analytics / Metrics Bar */}
            <div className="grid gap-6 md:grid-cols-3 bg-secondary/20 p-6 rounded-3xl border border-border/60 shadow-soft">
              {/* Starting Price Metric */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
                  <span>Entry Price Level</span>
                  <span>EGP</span>
                </div>
                <div className="relative h-4 rounded-full bg-slate-200 overflow-hidden flex">
                  {/* Progress bar A */}
                  <div 
                    style={{ width: `${Math.min(100, (specsA.price / (specsA.price + specsB.price + 0.1)) * 100)}%` }} 
                    className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-bold text-white transition-all duration-500"
                  >
                    A
                  </div>
                  {/* Progress bar B */}
                  <div 
                    style={{ width: `${Math.min(100, (specsB.price / (specsA.price + specsB.price + 0.1)) * 100)}%` }} 
                    className="bg-accent h-full flex items-center justify-center text-[9px] font-bold text-accent-foreground transition-all duration-500"
                  >
                    B
                  </div>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className={cheaperPrice === "A" ? "text-emerald-600 font-bold" : ""}>{compA.name} ({specsA.price}M)</span>
                  <span className={cheaperPrice === "B" ? "text-emerald-600 font-bold" : ""}>{compB.name} ({specsB.price}M)</span>
                </div>
              </div>

              {/* Delivery Speed Metric */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
                  <span>Delivery Year timeline</span>
                  <span>Year</span>
                </div>
                <div className="relative h-4 rounded-full bg-slate-200 overflow-hidden flex">
                  {/* Display relative years left starting from 2024 */}
                  {(() => {
                    const extractYr = (s: string) => {
                      const match = s.match(/\d+/);
                      if (!match) return 2028;
                      const v = parseInt(match[0]);
                      return v < 100 ? 2000 + v : v;
                    };
                    const yrA = Math.max(1, extractYr(specsA.delivery) - 2024);
                    const yrB = Math.max(1, extractYr(specsB.delivery) - 2024);
                    return (
                      <>
                        <div 
                          style={{ width: `${(yrA / (yrA + yrB)) * 100}%` }} 
                          className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-bold text-white transition-all duration-500"
                        >
                          A
                        </div>
                        <div 
                          style={{ width: `${(yrB / (yrA + yrB)) * 100}%` }} 
                          className="bg-accent h-full flex items-center justify-center text-[9px] font-bold text-accent-foreground transition-all duration-500"
                        >
                          B
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className={soonerDeliv === "A" ? "text-emerald-600 font-bold" : ""}>{compA.name} ({specsA.delivery})</span>
                  <span className={soonerDeliv === "B" ? "text-emerald-600 font-bold" : ""}>{compB.name} ({specsB.delivery})</span>
                </div>
              </div>

              {/* Inventory Metric */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
                  <span>Available Inventory</span>
                  <span>Units</span>
                </div>
                <div className="relative h-4 rounded-full bg-slate-200 overflow-hidden flex">
                  <div 
                    style={{ width: `${Math.max(10, Math.min(90, ((specsA.qty + 1) / (specsA.qty + specsB.qty + 2)) * 100))}%` }} 
                    className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-bold text-white transition-all duration-500"
                  >
                    A
                  </div>
                  <div 
                    style={{ width: `${Math.max(10, Math.min(90, ((specsB.qty + 1) / (specsA.qty + specsB.qty + 2)) * 100))}%` }} 
                    className="bg-accent h-full flex items-center justify-center text-[9px] font-bold text-accent-foreground transition-all duration-500"
                  >
                    B
                  </div>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className={largerQty === "A" ? "text-emerald-600 font-bold" : ""}>{compA.name} ({specsA.qty})</span>
                  <span className={largerQty === "B" ? "text-emerald-600 font-bold" : ""}>{compB.name} ({specsB.qty})</span>
                </div>
              </div>
            </div>

            {/* Table Settings bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-soft">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDiffsOnly(!showDiffsOnly)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    showDiffsOnly 
                      ? "bg-primary text-white" 
                      : "bg-secondary text-primary hover:bg-secondary/80"
                  }`}
                >
                  {showDiffsOnly ? "Showing Differences Only" : "Show Differences Only"}
                </button>
                <button
                  onClick={() => setHighlightDiffs(!highlightDiffs)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    highlightDiffs 
                      ? "bg-emerald-600 text-white" 
                      : "bg-secondary text-primary hover:bg-secondary/80"
                  }`}
                >
                  {highlightDiffs ? "Highlights On" : "Highlights Off"}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold">
                  Showing {visibleRows.length} attributes
                </span>
                <button
                  onClick={handleDownloadPDF}
                  className="no-print inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-bold transition-all hover:bg-accent/80 shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Project Header Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Card A */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="absolute top-3 left-3 z-10 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white uppercase shadow-sm">
                  Project A
                </div>
                <img src={compA.hero} alt={compA.name} className="h-48 w-full object-cover" />
                <div className="p-6">
                  <div className="text-xs font-bold text-accent uppercase tracking-wider">{compA.developer}</div>
                  <h2 className="mt-1 font-display text-2xl font-bold text-primary">{compA.name}</h2>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground leading-relaxed">{compA.blurb}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">Starting price</span>
                    <span className="font-display text-xl font-bold text-emerald-600">EGP {specsA.price}M</span>
                  </div>
                </div>
              </div>

              {/* Card B */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="absolute top-3 left-3 z-10 rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-accent-foreground uppercase shadow-sm">
                  Project B
                </div>
                <img src={compB.hero} alt={compB.name} className="h-48 w-full object-cover" />
                <div className="p-6">
                  <div className="text-xs font-bold text-accent uppercase tracking-wider">{compB.developer}</div>
                  <h2 className="mt-1 font-display text-2xl font-bold text-primary">{compB.name}</h2>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground leading-relaxed">{compB.blurb}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">Starting price</span>
                    <span className="font-display text-xl font-bold text-emerald-600">EGP {specsB.price}M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spec Table */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
              <div className="px-6 py-4 border-b border-border bg-secondary/20">
                <h3 className="font-display text-lg font-bold text-primary">Technical Specification Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/80 bg-secondary/10">
                      <th className="w-1/4 p-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Specification</th>
                      <th className="w-3/8 p-4 text-left text-xs font-bold uppercase tracking-wider text-primary">Project A: {compA.name}</th>
                      <th className="w-3/8 p-4 text-left text-xs font-bold uppercase tracking-wider text-primary">Project B: {compB.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {visibleRows.map((row) => {
                      const Icon = row.icon;
                      const hasDiff = row.isDifferent && highlightDiffs;
                      return (
                        <tr 
                          key={row.label} 
                          className={`transition-colors hover:bg-secondary/15 ${
                            hasDiff ? "bg-amber-500/5 border-l-4 border-l-amber-500/80" : ""
                          }`}
                        >
                          <td className="p-4 font-bold text-primary flex items-center gap-2">
                            <Icon className="h-4 w-4 text-slate-500" />
                            {row.label}
                          </td>
                          <td className={`p-4 font-medium text-slate-700 ${row.label === "Starting Price" ? "text-emerald-700 font-bold" : ""}`}>
                            {row.displayA}
                          </td>
                          <td className={`p-4 font-medium text-slate-700 ${row.label === "Starting Price" ? "text-emerald-700 font-bold" : ""}`}>
                            {row.displayB}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA bar */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <Link to="/projects/$slug" params={{ slug: slugA }} className="flex-1">
                  <button className="w-full rounded-xl bg-primary py-3.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-soft">
                    View Project A Dashboard
                  </button>
                </Link>
                <Link to="/calculator" search={{ project: slugA }} className="flex-1">
                  <button className="w-full rounded-xl border border-accent bg-card py-3.5 text-xs font-semibold text-accent hover:bg-accent/5 transition-colors shadow-soft">
                    Installment Plans A
                  </button>
                </Link>
              </div>

              <div className="flex gap-4">
                <Link to="/projects/$slug" params={{ slug: slugB }} className="flex-1">
                  <button className="w-full rounded-xl bg-primary py-3.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-soft">
                    View Project B Dashboard
                  </button>
                </Link>
                <Link to="/calculator" search={{ project: slugB }} className="flex-1">
                  <button className="w-full rounded-xl border border-accent bg-card py-3.5 text-xs font-semibold text-accent hover:bg-accent/5 transition-colors shadow-soft">
                    Installment Plans B
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <GitCompareArrows className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-primary">Invalid selection</h2>
            <p className="mt-2 text-sm text-muted-foreground">Please choose two valid compounds above.</p>
          </div>
        )}
      </div>
    </Shell>
  );
}
