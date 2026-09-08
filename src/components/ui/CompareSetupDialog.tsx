import { useState, useEffect } from "react";
import { User, Phone, Briefcase, FileText, Sparkles, X, FastForward, Check } from "lucide-react";

export interface CompareMetadata {
  agentName: string;
  agentTitle: string;
  agentPhone: string;
  clientName: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (metadata: CompareMetadata) => void;
  defaultClientName?: string;
}

const LOCAL_STORAGE_KEY = "property_atlas_compare_branding_info";

export function CompareSetupDialog({
  isOpen,
  onClose,
  onConfirm,
  defaultClientName = "Valuation & Investment Committee",
}: Props) {
  const [agentName, setAgentName] = useState("");
  const [agentTitle, setAgentTitle] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [clientName, setClientName] = useState(defaultClientName);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.agentName) setAgentName(parsed.agentName);
        if (parsed.agentTitle) setAgentTitle(parsed.agentTitle);
        if (parsed.agentPhone) setAgentPhone(parsed.agentPhone);
      } else {
        setAgentName("Sayed Shoeip");
        setAgentTitle("Senior Real Estate Consultant");
        setAgentPhone("+20 102 932 4783");
      }
    } catch {
      setAgentName("Sayed Shoeip");
      setAgentTitle("Senior Real Estate Consultant");
      setAgentPhone("+20 102 932 4783");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProceed = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const metadata: CompareMetadata = {
      agentName: agentName.trim() || "Sayed Shoeip",
      agentTitle: agentTitle.trim() || "Senior Real Estate Consultant",
      agentPhone: agentPhone.trim() || "+20 102 932 4783",
      clientName: clientName.trim() || "Valuation & Investment Committee",
    };

    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          agentName: metadata.agentName,
          agentTitle: metadata.agentTitle,
          agentPhone: metadata.agentPhone,
        })
      );
    } catch {}

    onConfirm(metadata);
  };

  const handleSkip = () => {
    handleProceed();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white leading-snug">
                Pre-Generation Questionnaire
              </h2>
              <p className="text-xs text-amber-400 font-semibold">
                Personalized Branding &amp; Comparison Metadata
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
        <form onSubmit={handleProceed} className="space-y-4 text-xs">
          {/* Explicit Optional Note */}
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-slate-200 leading-relaxed font-medium">
            💡 <strong className="text-amber-400">Note:</strong> ALL fields are optional. You can customize details below or click <strong className="text-white">"Skip"</strong> to proceed with defaults immediately.
          </div>

          {/* Questionnaire Inputs */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> 1. Agent Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sayed Shoeip"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-amber-400" /> 2. Professional Title
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Real Estate Consultant"
                value={agentTitle}
                onChange={(e) => setAgentTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-amber-400" /> 3. Phone / WhatsApp Number
              </label>
              <input
                type="text"
                placeholder="e.g. +20 102 932 4783"
                value={agentPhone}
                onChange={(e) => setAgentPhone(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> 4. Client Name / Recipient
              </label>
              <input
                type="text"
                placeholder="e.g. Valuation & Investment Committee"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Action Buttons: Skip vs Proceed */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <FastForward className="h-4 w-4 text-amber-400" />
              Skip (Use Defaults)
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-xs font-black text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Check className="h-4 w-4" />
              Proceed with Comparison
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
