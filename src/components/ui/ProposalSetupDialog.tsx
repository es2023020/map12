import { useState, useEffect } from "react";
import { User, Phone, Briefcase, FileText, Sparkles, X } from "lucide-react";

export interface ProposalAgentClientDetails {
  agentName: string;
  agentPhone: string;
  agentTitle: string;
  clientName: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: ProposalAgentClientDetails) => void;
  projectName?: string;
  defaultClientName?: string;
}

const LOCAL_STORAGE_KEY = "property_atlas_agent_proposal_info";

export function ProposalSetupDialog({
  isOpen,
  onClose,
  onConfirm,
  projectName = "Property",
  defaultClientName = "Valued Client",
}: Props) {
  const [agentName, setAgentName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [agentTitle, setAgentTitle] = useState("");
  const [clientName, setClientName] = useState(defaultClientName);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.agentName) setAgentName(parsed.agentName);
        if (parsed.agentPhone) setAgentPhone(parsed.agentPhone);
        if (parsed.agentTitle) setAgentTitle(parsed.agentTitle);
      } else {
        // Defaults
        setAgentName("Senior Property Consultant");
        setAgentPhone("+20 102 932 4783");
        setAgentTitle("Luxury Real Estate Advisor");
      }
    } catch {
      setAgentName("Senior Property Consultant");
      setAgentPhone("+20 102 932 4783");
      setAgentTitle("Luxury Real Estate Advisor");
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const details: ProposalAgentClientDetails = {
      agentName: agentName.trim() || "Senior Property Consultant",
      agentPhone: agentPhone.trim() || "+20 102 932 4783",
      agentTitle: agentTitle.trim() || "Luxury Real Estate Advisor",
      clientName: clientName.trim() || "Valued Client",
    };

    // Save agent defaults for future proposals
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
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
                {projectName} • Custom Proposal Setup
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
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed text-xs">
            Please enter the client and agent contact details. These will be automatically formatted and embedded into the official executive PDF proposal document.
          </p>

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
              className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-3 text-sm font-bold text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Agent Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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
                className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-500"
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
                className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-500"
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
              className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-500"
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
              Generate &amp; Open PDF Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
