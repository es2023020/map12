import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type Lead } from "@/lib/store";
import { compounds } from "@/data/compounds";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  AlertCircle,
  TrendingUp,
  Flame,
  Check,
  Send,
  MessageSquare,
  Compass,
  ArrowRight,
  BrainCircuit,
  Search,
  Sparkle,
  X,
} from "lucide-react";

import { notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/ai-assistant")({
  loader: () => {
    throw notFound();
  },
  component: () => null,
});

function AIAssistantPage() {
  const leads = useStore((s) => s.leads);
  const user = useStore((s) => s.user);
  const updatePriority = useStore((s) => s.updateLeadPriority);
  const updateContacted = useStore((s) => s.updateLeadContacted);

  const [insights, setInsights] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [whatsappLead, setWhatsappLead] = useState<Lead | null>(null);
  const [customMsg, setCustomMsg] = useState("");

  // Built-in Analytical Engine to prioritize and match client profiles
  useEffect(() => {
    const calculatedInsights: any[] = [];
    const generatedReminders: any[] = [];

    leads.forEach((lead) => {
      // 1. Calculate Priority level dynamically based on stage & budget
      let dynamicPriority: "high" | "medium" | "low" = "medium";
      let priorityReasons: string[] = [];

      if (lead.stage === "negotiating" || lead.stage === "viewing") {
        dynamicPriority = "high";
        priorityReasons.push(`Active pipeline stage (${lead.stage})`);
      }
      if (lead.budget >= 15) {
        dynamicPriority = "high";
        priorityReasons.push(`High net-worth budget: EGP ${lead.budget}M`);
      }

      const daysSinceContact = Math.round(
        (Date.now() - (lead.lastContacted || lead.createdAt)) / 86400000,
      );
      if (daysSinceContact >= 4 && lead.stage !== "closed") {
        priorityReasons.push(`No follow-up in ${daysSinceContact} days`);
        generatedReminders.push({
          id: `r-${lead.id}`,
          lead,
          type: "followup",
          text: `Follow up with ${lead.name} (${daysSinceContact} days inactive). Pitch new releases.`,
          message: `Hi ${lead.name},\n\nHope you're having a great day! Just checking in to see if you reviewed the project specifications. Let me know if you would like me to compile another option list!\n\nBest,\n${user ? user.name : "your PropTrack partner"}`,
        });
      }

      // Auto-update store state if priority differs (local sync)
      if (lead.priority !== dynamicPriority) {
        updatePriority(lead.id, dynamicPriority);
      }

      // 2. Built-in Matchmaking Engine (match budget and interest with actual compounds list)
      const interestKeyword = (lead.interest || "").toLowerCase();
      const matchedCompounds = compounds
        .filter((c) => {
          // Match project interest keyword or destination/developer
          const matchesInterest =
            c.slug.includes(interestKeyword) ||
            c.name.toLowerCase().includes(interestKeyword) ||
            c.destination.toLowerCase().includes(interestKeyword) ||
            c.developer.toLowerCase().includes(interestKeyword);

          // Match entry price
          const matchesBudget = c.priceFrom <= lead.budget;

          return matchesInterest && matchesBudget;
        })
        .slice(0, 3); // Top 3 matches

      calculatedInsights.push({
        lead,
        dynamicPriority,
        reasons: priorityReasons.length > 0 ? priorityReasons : ["Standard Pipeline Lead"],
        matches: matchedCompounds,
        daysSinceContact,
      });
    });

    setInsights(calculatedInsights);
    setReminders(generatedReminders);
  }, [leads, user]);

  const handleLaunchWhatsApp = (lead: Lead, msgText: string) => {
    updateContacted(lead.id);
    const cleanedPhone = lead.phone.replace(/[^0-9]/g, "");
    const phoneWithCode = cleanedPhone.startsWith("0") ? "2" + cleanedPhone : cleanedPhone;
    window.open(
      `https://web.whatsapp.com/send?phone=${phoneWithCode}&text=${encodeURIComponent(msgText)}`,
      "_blank",
    );
    setWhatsappLead(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border/40 pb-4">
        <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
          <BrainCircuit className="h-7 w-7 text-accent" /> Offline AI Broker Assistant
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Built-in broker co-pilot analyzing lead pipeline priorities, generating smart reminders,
          and matchmaking budgets to active compounds.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Left column: Action Reminders */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <Sparkle className="h-4 w-4 text-accent" /> Smart Daily Alerts ({reminders.length})
          </h3>

          <div className="space-y-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="rounded-xl border border-border/50 bg-secondary/15 p-3.5 space-y-2 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-accent">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Inactive Follow-up</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                  "{rem.text}"
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      setWhatsappLead(rem.lead);
                      setCustomMsg(rem.message);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-green-500 hover:text-green-600 transition-colors"
                  >
                    <MessageSquare className="h-3 w-3" /> Dispatch Followup
                  </button>
                </div>
              </div>
            ))}
            {reminders.length === 0 && (
              <div className="rounded-xl border border-dashed border-border/60 p-5 text-center text-xs text-muted-foreground py-12 bg-secondary/10">
                <Check className="mx-auto h-5 w-5 text-emerald-500 mb-2" />
                All client touchpoints are fresh! No pending follow-up alerts.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Lead Analysis & Matchmaking */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
              Pipeline Matchmaking & Recommendations
            </h3>

            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
              {insights.map((insight) => (
                <div
                  key={insight.lead.id}
                  className="rounded-xl border border-border/60 p-4 space-y-3 bg-secondary/10"
                >
                  {/* Lead Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/30 pb-2">
                    <div>
                      <div className="font-semibold text-primary text-sm flex items-center gap-2">
                        {insight.lead.name}
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                            insight.dynamicPriority === "high"
                              ? "bg-red-500/10 text-red-500"
                              : insight.dynamicPriority === "medium"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {insight.dynamicPriority} PRIORITY
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Budget: EGP {insight.lead.budget}M • Interest:{" "}
                        {insight.lead.interest || "General"}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground">Days since contact</span>
                      <div className="text-xs font-bold text-primary mt-0.5">
                        {insight.daysSinceContact}d
                      </div>
                    </div>
                  </div>

                  {/* Priority Reasons */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                      Reasoning
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {insight.reasons.map((r: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded bg-background border border-border/60 px-1.5 py-0.5 text-[9px] text-muted-foreground font-semibold"
                        >
                          • {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommended Matching Compounds */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 text-accent">
                      <Sparkles className="h-3 w-3" /> Matching Project Suggestions
                    </span>

                    <div className="grid gap-2 sm:grid-cols-3 mt-1">
                      {insight.matches.map((match: any) => (
                        <div
                          key={match.slug}
                          className="rounded-lg bg-card border border-border/60 p-2 hover:border-accent/40 transition-colors flex flex-col justify-between h-20"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-[10px] font-bold text-primary">
                              {match.name}
                            </div>
                            <div className="text-[9px] text-muted-foreground mt-0.5">
                              {match.destination}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[9px] border-t border-border/30 pt-1 mt-1">
                            <span className="font-semibold text-primary">
                              EGP {match.priceFrom}M+
                            </span>
                            <Link
                              to="/projects/$slug"
                              params={{ slug: match.slug }}
                              className="text-accent hover:underline flex items-center gap-0.5 font-bold"
                            >
                              View <ArrowRight className="h-2 w-2" />
                            </Link>
                          </div>
                        </div>
                      ))}
                      {insight.matches.length === 0 && (
                        <div className="col-span-full rounded-lg border border-dashed border-border/50 p-3 text-center text-[10px] text-muted-foreground py-6">
                          No matching compounds found within budget in "{insight.lead.interest}"
                          area.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Message preview Modal overlay */}
      {whatsappLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
              <h3 className="font-display font-bold text-primary flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" /> Send Alert Follow-up
              </h3>
              <button
                onClick={() => setWhatsappLead(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-xs text-muted-foreground">
                Recipient:{" "}
                <strong className="text-primary">
                  {whatsappLead.name} ({whatsappLead.phone})
                </strong>
              </div>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full h-36 rounded-xl border border-border bg-transparent p-3 text-xs text-primary focus:border-accent focus:outline-none resize-none leading-relaxed"
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setWhatsappLead(null)}>
                  Cancel
                </Button>
                <button
                  onClick={() => handleLaunchWhatsApp(whatsappLead, customMsg)}
                  className="rounded-xl bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-colors px-4 py-2 flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Dispatch via WhatsApp Web
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
