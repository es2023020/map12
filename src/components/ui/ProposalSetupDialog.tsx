import { useState, useEffect } from "react";
import { User, Phone, Briefcase, FileText, Sparkles, X, Home, Layers, Check } from "lucide-react";
import { availabilityBySlug } from "@/data/availability";
import { formatExactPrice } from "@/lib/currency";

export interface ProposalAgentClientDetails {
  agentName: string;
  agentPhone: string;
  agentTitle: string;
  clientName: string;
  unitCode?: string;
  unitType?: string;
  areaSqm?: number | string;
  startingPriceEgp?: number;
  paymentPlanStr?: string;
  deliveryNote?: string;
  finishing?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: ProposalAgentClientDetails) => void;
  projectName?: string;
  projectSlug?: string;
  defaultClientName?: string;
  initialUnit?: any;
}

const LOCAL_STORAGE_KEY = "property_atlas_agent_proposal_info";

export function ProposalSetupDialog({
  isOpen,
  onClose,
  onConfirm,
  projectName = "Property",
  projectSlug = "",
  defaultClientName = "Valued Client",
  initialUnit,
}: Props) {
  const [agentName, setAgentName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [agentTitle, setAgentTitle] = useState("");
  const [clientName, setClientName] = useState(defaultClientName);

  // Selected Unit Specs
  const [unitCode, setUnitCode] = useState("");
  const [unitType, setUnitType] = useState("");
  const [areaSqm, setAreaSqm] = useState("");
  const [priceEgp, setPriceEgp] = useState<number | "">("");
  const [paymentPlanStr, setPaymentPlanStr] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [finishing, setFinishing] = useState("");

  // Resolve available inventory options for project
  const avail = projectSlug ? availabilityBySlug(projectSlug) : null;
  const breakdownRows = avail?.breakdown || [];

  // Build flattened unit options
  const unitOptions: Array<{
    id: string;
    label: string;
    type: string;
    areaSqm: number | string;
    priceEGP: number;
    paymentPlan?: string;
    deliveryNote?: string;
    finishing?: string;
  }> = [];

  if (breakdownRows.length > 0) {
    breakdownRows.forEach((b, idx) => {
      if (b.units && b.units.length > 0) {
        b.units.forEach((u) => {
          unitOptions.push({
            id: u.id || `UN-${100 + idx * 10}`,
            label: `[${u.id || `UN-${100 + idx * 10}`}] ${b.type} — ${u.areaSqm} m² — ${formatExactPrice(u.priceEGP, "EGP")}`,
            type: b.type,
            areaSqm: u.areaSqm,
            priceEGP: u.priceEGP,
            paymentPlan: u.paymentPlan || b.paymentPlan,
            deliveryNote: u.deliveryNote || b.deliveryNote,
            finishing: u.finishing || b.finishing,
          });
        });
      } else {
        const avgPrice = ((b.minPriceM + b.maxPriceM) / 2) * 1_000_000;
        const avgSqm = b.minSqm === b.maxSqm ? b.minSqm : `${b.minSqm}–${b.maxSqm}`;
        const generatedId = `UN-${101 + idx * 5}`;
        unitOptions.push({
          id: generatedId,
          label: `[${generatedId}] ${b.type} — ${avgSqm} m² — ${formatExactPrice(avgPrice, "EGP")}`,
          type: b.type,
          areaSqm: avgSqm,
          priceEGP: avgPrice,
          paymentPlan: b.paymentPlan,
          deliveryNote: b.deliveryNote,
          finishing: b.finishing,
        });
      }
    });
  }

  const [selectedOptionId, setSelectedOptionId] = useState<string>("");

  useEffect(() => {
    // Load agent info from localStorage
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.agentName) setAgentName(parsed.agentName);
        if (parsed.agentPhone) setAgentPhone(parsed.agentPhone);
        if (parsed.agentTitle) setAgentTitle(parsed.agentTitle);
      } else {
        setAgentName("Senior Property Consultant");
        setAgentPhone("+20 102 932 4783");
        setAgentTitle("Luxury Real Estate Advisor");
      }
    } catch {
      setAgentName("Senior Property Consultant");
      setAgentPhone("+20 102 932 4783");
      setAgentTitle("Luxury Real Estate Advisor");
    }

    // Set initial unit if passed
    if (initialUnit) {
      setUnitType(initialUnit.type || "");
      setAreaSqm(initialUnit.minSqm || initialUnit.areaSqm || "145");
      setPriceEgp((initialUnit.minPriceM || 14.5) * 1000000);
      setPaymentPlanStr(initialUnit.paymentPlan || "10% DP over 8 Yrs");
      setDeliveryNote(initialUnit.deliveryNote || "Off-Plan (In 2.5 Yrs)");
      setFinishing(initialUnit.finishing || "Fully Finished w/ ACs");
      setUnitCode(`UN-${Math.floor(100 + Math.random() * 900)}`);
    } else if (unitOptions.length > 0) {
      const firstOpt = unitOptions[0];
      setSelectedOptionId(firstOpt.id);
      setUnitCode(firstOpt.id);
      setUnitType(firstOpt.type);
      setAreaSqm(String(firstOpt.areaSqm));
      setPriceEgp(firstOpt.priceEGP);
      if (firstOpt.paymentPlan) setPaymentPlanStr(firstOpt.paymentPlan);
      if (firstOpt.deliveryNote) setDeliveryNote(firstOpt.deliveryNote);
      if (firstOpt.finishing) setFinishing(firstOpt.finishing);
    }
  }, [isOpen, initialUnit, projectSlug]);

  if (!isOpen) return null;

  const handleSelectUnitOption = (optId: string) => {
    setSelectedOptionId(optId);
    const found = unitOptions.find((o) => o.id === optId);
    if (found) {
      setUnitCode(found.id);
      setUnitType(found.type);
      setAreaSqm(String(found.areaSqm));
      setPriceEgp(found.priceEGP);
      if (found.paymentPlan) setPaymentPlanStr(found.paymentPlan);
      if (found.deliveryNote) setDeliveryNote(found.deliveryNote);
      if (found.finishing) setFinishing(found.finishing);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const details: ProposalAgentClientDetails = {
      agentName: agentName.trim() || "Senior Property Consultant",
      agentPhone: agentPhone.trim() || "+20 102 932 4783",
      agentTitle: agentTitle.trim() || "Luxury Real Estate Advisor",
      clientName: clientName.trim() || "Valued Client",
      unitCode: unitCode.trim() || `UN-${Math.floor(100 + Math.random() * 900)}`,
      unitType: unitType.trim() || "Luxury Layout",
      areaSqm: areaSqm || "145",
      startingPriceEgp: typeof priceEgp === "number" ? priceEgp : 14500000,
      paymentPlanStr: paymentPlanStr || "10% DP over 8 Yrs",
      deliveryNote: deliveryNote || "Off-Plan (In 2.5 Yrs)",
      finishing: finishing || "Fully Finished w/ ACs",
    };

    // Save agent defaults
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          agentName: details.agentName,
          agentPhone: details.agentPhone,
          agentTitle: details.agentTitle,
        })
      );
    } catch {}

    onConfirm(details);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-slate-900 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white leading-snug">
                Configure Executive Proposal
              </h2>
              <p className="text-xs text-amber-400/90 font-medium">
                {projectName} • Select Unit &amp; Contact Details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* Available Units Selection Box */}
          {unitOptions.length > 0 && (
            <div className="rounded-2xl bg-slate-950 p-4 border border-amber-500/30 space-y-2">
              <label className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Home className="h-4 w-4" /> Select Unit from Available Inventory ({unitOptions.length} Listed)
              </label>
              <select
                value={selectedOptionId}
                onChange={(e) => handleSelectUnitOption(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                {unitOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Unit Specs Override Grid */}
          <div className="rounded-2xl bg-slate-950 p-4 border border-white/10 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-amber-400" /> Selected Unit Details (Editable)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Code / Key</label>
                <input
                  type="text"
                  value={unitCode}
                  onChange={(e) => setUnitCode(e.target.value)}
                  placeholder="e.g. UN-304"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Type Layout</label>
                <input
                  type="text"
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                  placeholder="e.g. 3BR Lagoon Chalet"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Indoor Area BUA (m²)</label>
                <input
                  type="text"
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(e.target.value)}
                  placeholder="e.g. 145"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2 sm:col-span-3">
                <label className="text-[10px] font-bold text-amber-400 uppercase">Base Unit Price (EGP)</label>
                <input
                  type="number"
                  value={priceEgp}
                  onChange={(e) => setPriceEgp(parseFloat(e.target.value) || "")}
                  placeholder="e.g. 14500000"
                  className="mt-1 w-full rounded-xl border border-amber-500/40 bg-slate-900 px-3 py-2 text-sm font-black text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Client Name Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Client Name (Recipient)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Eng. Mohamed Ali"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Agent Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-amber-400" /> Agent Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Mansour"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-amber-400" /> Agent Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +20 102 932 4783"
                value={agentPhone}
                onChange={(e) => setAgentPhone(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-amber-400" /> Agent Title &amp; Division
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Commercial & Residential Advisor"
              value={agentTitle}
              onChange={(e) => setAgentTitle(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/15 bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-xs font-black text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Create PDF Proposal For Selected Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
