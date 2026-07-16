import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore, type Lead } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { compounds } from "@/data/compounds";
import { 
  Megaphone, 
  Users, 
  Send, 
  Check, 
  Play, 
  FileText,
  X,
  Smartphone,
  MessageSquare,
  ExternalLink,
  Search,
  Share2,
  Building2,
  TrendingUp,
  Percent,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";

export const Route = createFileRoute("/dashboard/campaigns")({
  component: CampaignsPage,
});

const defaultCampaignTemplates = [
  { id: "c1", title: "Sahel Summer Launch", body: "Hello {name},\n\nHope you are well! Tatweer Misr just launched a new beachfront release in Solare Sahel with flexible 7-year installment plans starting at EGP 6M. Let me know if you would like me to send the master plan!\n\nBest regards,\n{broker_name}" },
  { id: "c2", title: "Zayed Commercial Launch", body: "Dear {name},\n\nWe just received the updated factsheet for Elm Tree in New Zayed. Offering premium units with a low 5% down payment. Since you expressed interest in western developments, let me know if we can schedule a quick walkthrough.\n\nBest,\n{broker_name}" },
  { id: "c3", title: "Immediate Delivery Compiles", body: "Hi {name},\n\nI have compiled a list of immediate delivery properties matching your budget of EGP {budget}M. Your interest in {interest} is well served - let me know if I should send the PDF overview.\n\nBest,\n{broker_name}" }
];

const mockCampaignHistory = [
  { id: "h1", name: "North Coast Q3 Broadcast", date: "2026-07-10", reached: 14, status: "Completed", openRate: "98%" },
  { id: "h2", name: "Zayed Commercial Outreach", date: "2026-07-08", reached: 8, status: "Completed", openRate: "100%" },
  { id: "h3", name: "New Capital R8 Promos", date: "2026-07-02", reached: 11, status: "Completed", openRate: "96%" }
];

function CampaignsPage() {
  const leads = useStore((s) => s.leads);
  const user = useStore((s) => s.user);

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [templateText, setTemplateText] = useState(defaultCampaignTemplates[0].body);
  const [filterInterest, setFilterInterest] = useState("");
  const [activeQueue, setActiveQueue] = useState<Lead[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // WhatsApp panel state
  const [showWaPanel, setShowWaPanel] = useState(false);
  const [waPanelUrl, setWaPanelUrl] = useState("https://web.whatsapp.com");

  // Compound share search
  const [compoundSearch, setCompoundSearch] = useState("");
  const [activeShareTab, setActiveShareTab] = useState<"contacts" | "compounds">("contacts");

  const toggleSelectLead = (id: string) => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAllFiltered = (filtered: Lead[]) => {
    const filteredIds = filtered.map(l => l.id);
    setSelectedLeads(prev => {
      const otherIds = prev.filter(id => !filteredIds.includes(id));
      return [...otherIds, ...filteredIds];
    });
  };

  const clearAllSelected = (filtered: Lead[]) => {
    const filteredIds = filtered.map(l => l.id);
    setSelectedLeads(prev => prev.filter(id => !filteredIds.includes(id)));
  };

  const resolveMessage = (lead: Lead, body: string) => {
    const brokerName = user?.name || "your PropTrack broker";
    return body
      .replace(/{name}/g, lead.name)
      .replace(/{interest}/g, lead.interest || "your preferred compound")
      .replace(/{budget}/g, String(lead.budget))
      .replace(/{broker_name}/g, brokerName);
  };

  const openWhatsAppUrl = (url: string) => {
    setWaPanelUrl(url);
    setShowWaPanel(true);
  };

  const handleStartCampaign = () => {
    const queue = leads.filter(l => selectedLeads.includes(l.id));
    setActiveQueue(queue);
    setCurrentIndex(0);
  };

  const handleSendCurrent = () => {
    if (currentIndex >= activeQueue.length) return;
    const currentLead = activeQueue[currentIndex];
    const messageText = resolveMessage(currentLead, templateText);
    const cleanedPhone = currentLead.phone.replace(/[^0-9]/g, "");
    const phoneWithCode = cleanedPhone.startsWith("0") ? "2" + cleanedPhone : cleanedPhone;
    openWhatsAppUrl(`https://web.whatsapp.com/send?phone=${phoneWithCode}&text=${encodeURIComponent(messageText)}`);
    setCurrentIndex(prev => prev + 1);
  };

  // Share a compound listing to WhatsApp
  const handleShareCompound = (comp: typeof compounds[0]) => {
    const brokerName = user?.name || "your PropTrack broker";
    const msg = `Hello!\n\nI wanted to share this exciting property listing with you:\n\n*${comp.name}*\nDeveloper: ${comp.developer}\nLocation: ${comp.destination}\nStarting from: EGP ${comp.priceFrom}M\nUnit Types: ${comp.types.join(", ")}\n\nFor full details, unit availability and payment plans:\nhttps://proptrack.eg/projects/${comp.slug}\n\nReach out to me for a private showing!\n${brokerName}`;
    openWhatsAppUrl(`https://web.whatsapp.com/send?text=${encodeURIComponent(msg)}`);
  };

  const insertPlaceholder = (ph: string) => {
    setTemplateText(prev => prev + ph);
  };

  const filteredList = leads.filter(l => 
    !filterInterest || (l.interest && l.interest.toLowerCase().includes(filterInterest.toLowerCase()))
  );

  const filteredCompounds = compounds.filter(c =>
    compoundSearch.length < 2 || 
    c.name.toLowerCase().includes(compoundSearch.toLowerCase()) ||
    c.developer.toLowerCase().includes(compoundSearch.toLowerCase()) ||
    c.destination.toLowerCase().includes(compoundSearch.toLowerCase())
  ).slice(0, 30);

  // Dynamic Statistics
  const targetReachCount = selectedLeads.length;
  const combinedSegmentBudget = useMemo(() => {
    return leads
      .filter(l => selectedLeads.includes(l.id))
      .reduce((sum, l) => sum + l.budget, 0);
  }, [leads, selectedLeads]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border/40 pb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-accent" /> WhatsApp Campaigns Manager
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Select client targets, compose templates, and broadcast personalized WhatsApp messages. Share compound listings directly.</p>
        </div>
        <button
          onClick={() => openWhatsAppUrl("https://web.whatsapp.com")}
          className="inline-flex items-center gap-2 rounded-xl bg-green-500 text-white px-4 py-2 text-xs font-bold hover:bg-green-600 transition-colors shadow"
        >
          <MessageSquare className="h-4 w-4" /> Open WhatsApp Web
        </button>
      </div>

      {/* Campaigns Dashboard Analytics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Users className="h-4.5 w-4.5" />
          </div>
          <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Audience Selected</div>
          <div className="mt-1 font-display text-xl font-bold text-primary">{targetReachCount} Contacts</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
          <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Budget Targeted</div>
          <div className="mt-1 font-display text-xl font-bold text-emerald-600">EGP {combinedSegmentBudget}M</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <Percent className="h-4.5 w-4.5" />
          </div>
          <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Est. Delivery Rate</div>
          <div className="mt-1 font-display text-xl font-bold text-primary">99.8%</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <MessageSquare className="h-4.5 w-4.5" />
          </div>
          <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Average Open Rate</div>
          <div className="mt-1 font-display text-xl font-bold text-primary">98% <span className="text-[10px] text-muted-foreground font-semibold">benchmark</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 rounded-xl bg-secondary/50 p-1 w-fit text-xs border border-border/40">
        {(["contacts", "compounds"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveShareTab(tab)}
            className={`rounded-lg px-4 py-1.5 font-bold capitalize transition-all ${activeShareTab === tab ? "bg-card text-primary shadow-sm border border-border/40" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === "contacts" ? <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Campaign Contacts</span> : <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Share Compound</span>}
          </button>
        ))}
      </div>

      {activeShareTab === "contacts" && (
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          
          {/* Step 1: Select Audience */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" /> 1. Select Client Audience
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => selectAllFiltered(filteredList)}>Select All</Button>
                <Button size="sm" variant="outline" onClick={() => clearAllSelected(filteredList)}>Clear</Button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" style={{ top: "50%" }} />
              <input
                type="text"
                placeholder="Filter client list by interest (e.g. marassi, solare, new-cairo)..."
                value={filterInterest}
                onChange={(e) => setFilterInterest(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-transparent pl-9 pr-4 py-2.5 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {filteredList.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-secondary/20 transition-all">
                  <button onClick={() => toggleSelectLead(lead.id)} className="flex items-center gap-3 text-left">
                    <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                      selectedLeads.includes(lead.id) ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background"
                    }`}>
                      {selectedLeads.includes(lead.id) && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-primary">{lead.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{lead.phone} &bull; EGP {lead.budget}M budget</div>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    {lead.interest && (
                      <span className="rounded bg-accent/15 px-2 py-0.5 text-[9px] font-bold text-accent uppercase">{lead.interest}</span>
                    )}
                    <button
                      title="Quick message this contact"
                      onClick={() => {
                        const cleanedPhone = lead.phone.replace(/[^0-9]/g, "");
                        const phoneWithCode = cleanedPhone.startsWith("0") ? "2" + cleanedPhone : cleanedPhone;
                        const msg = resolveMessage(lead, templateText);
                        openWhatsAppUrl(`https://web.whatsapp.com/send?phone=${phoneWithCode}&text=${encodeURIComponent(msg)}`);
                      }}
                      className="rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white p-1.5 transition-all"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredList.length === 0 && (
                <div className="text-center py-8 text-xs text-muted-foreground italic">No leads found matching query. Add clients in CRM first.</div>
              )}
            </div>
          </div>

          {/* Step 2: Compose Template */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
            <div className="border-b border-border/40 pb-3">
              <span className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" /> 2. Compose Template
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Sparkles className="h-3 w-3 text-accent" /> Pre-built Campaigns</span>
              <div className="grid gap-1.5">
                {defaultCampaignTemplates.map((t) => (
                  <button key={t.id} onClick={() => setTemplateText(t.body)}
                    className="w-full text-left rounded-lg border border-border/40 p-2.5 text-xs hover:border-accent hover:bg-accent/5 transition-colors truncate font-semibold text-primary">
                    {t.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase flex justify-between">
                <span>Message Text</span>
                <span className="text-accent lowercase font-normal">Connected client variables</span>
              </span>
              <textarea
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                className="w-full h-36 rounded-xl border border-border bg-transparent p-3 text-xs text-primary focus:border-accent focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Variable insertion buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Insert placeholders</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Client Name", ph: "{name}" },
                  { label: "Interest", ph: "{interest}" },
                  { label: "Budget", ph: "{budget}" },
                  { label: "Broker Name", ph: "{broker_name}" },
                ].map(ph => (
                  <button
                    key={ph.ph}
                    onClick={() => insertPlaceholder(ph.ph)}
                    className="rounded-lg bg-secondary px-2.5 py-1 text-[10px] font-semibold text-muted-foreground hover:bg-accent/15 hover:text-accent border border-border/50 transition-all"
                  >
                    +{ph.label}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleStartCampaign} 
              disabled={selectedLeads.length === 0}
              className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 py-2.5 font-bold flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4" /> Start Campaign ({selectedLeads.length} leads)
            </Button>
          </div>
        </div>
      )}

      {/* Compound Sharing Tab */}
      {activeShareTab === "compounds" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Share2 className="h-4 w-4 text-accent" /> Share Compound Listings to WhatsApp
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Search any compound below and click to generate a pre-filled WhatsApp message with starting price, location, types, and compound URL.</p>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground animate-pulse" />
            <input
              type="text"
              placeholder="Search compounds by name, developer, or zone..."
              value={compoundSearch}
              onChange={(e) => setCompoundSearch(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-transparent pl-9 pr-4 py-2.5 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredCompounds.map(comp => (
              <div key={comp.slug} className="rounded-xl border border-border bg-secondary/10 p-4 hover:border-accent/40 hover:bg-secondary/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-primary truncate">{comp.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{comp.developer} &bull; {comp.destination.replace(/-/g, " ").toUpperCase()}</div>
                  <div className="text-[10px] font-bold text-accent mt-2">Starting EGP {comp.priceFrom}M</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {comp.types.slice(0, 3).map(t => (
                      <span key={t} className="rounded bg-secondary px-1.5 py-0.5 text-[8px] font-bold text-muted-foreground uppercase">{t}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleShareCompound(comp)}
                  className="mt-4 w-full rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white py-2 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageSquare className="h-3 w-3" /> Share details to WhatsApp
                </button>
              </div>
            ))}
            {filteredCompounds.length === 0 && (
              <div className="col-span-full text-center py-8 text-xs text-muted-foreground italic">No compounds found matching term.</div>
            )}
          </div>
        </div>
      )}

      {/* Active Campaign Dispatcher */}
      {activeQueue.length > 0 && activeShareTab === "contacts" && (
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 animate-in fade-in duration-300 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-accent/10 pb-4 mb-4">
            <div>
              <h3 className="font-display font-bold text-primary text-lg flex items-center gap-2">
                <Send className="h-5 w-5 text-accent animate-bounce" /> Broadcast Dispatcher
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Pre-filled chats open sequentially inside WhatsApp conversation panels</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-primary">{currentIndex} / {activeQueue.length} Dispatched</span>
              <div className="w-32 bg-border h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-accent h-full transition-all duration-300" style={{ width: `${(currentIndex / activeQueue.length) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {currentIndex < activeQueue.length ? (
            <div className="grid gap-4 md:grid-cols-3 items-center bg-card border border-border/60 p-4 rounded-xl">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Target Client</span>
                <div className="text-sm font-bold text-primary mt-1">{activeQueue[currentIndex].name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{activeQueue[currentIndex].phone}</div>
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 bg-secondary/20 p-3 rounded-lg border border-border/40">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Template Render</span>
                  <p className="text-xs text-foreground/80 mt-1 italic line-clamp-2 leading-relaxed">
                    {resolveMessage(activeQueue[currentIndex], templateText).substring(0, 120)}...
                  </p>
                </div>
                <button onClick={handleSendCurrent} className="rounded-xl bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-colors px-4 py-2.5 flex items-center gap-1.5 shrink-0">
                  <Send className="h-3.5 w-3.5" /> Dispatch to WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center flex flex-col items-center">
              <span className="inline-flex rounded-full bg-emerald-500 text-white p-2 mb-2 shadow-soft">
                <Check className="h-4.5 w-4.5 stroke-[3]" />
              </span>
              <p className="text-sm font-semibold text-primary">All campaign outreach messages dispatched successfully!</p>
            </div>
          )}
        </div>
      )}

      {/* Campaigns History */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
        <div className="border-b border-border/40 pb-3 flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" /> Recent Campaigns Log
          </span>
          <span className="text-xs text-muted-foreground font-semibold">Track historical broadcasting sheets</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-[10px] font-bold text-muted-foreground uppercase">
                <th className="p-3">Campaign Reference</th>
                <th className="p-3">Dispatch Date</th>
                <th className="p-3 text-right">Contacts Reached</th>
                <th className="p-3 text-right">Est. Open Rate</th>
                <th className="p-3 text-right">Outbound Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {mockCampaignHistory.map((h) => (
                <tr key={h.id} className="hover:bg-secondary/15 transition-colors">
                  <td className="p-3 font-semibold text-primary">{h.name}</td>
                  <td className="p-3 text-xs text-muted-foreground font-medium">{h.date}</td>
                  <td className="p-3 text-right text-xs font-bold text-primary">{h.reached}</td>
                  <td className="p-3 text-right text-xs font-bold text-emerald-600">{h.openRate}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                      <CheckCircle className="h-3 w-3" /> {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded WhatsApp Web Panel (slide-up from bottom-right) */}
      {showWaPanel && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md animate-in slide-in-from-bottom-8 duration-300">
          <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col" style={{height: "480px"}}>
            
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-green-500 text-white shadow-soft">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-bold">WhatsApp Dispatch Portal</span>
              </div>
              <div className="flex items-center gap-3">
                <a href={waPanelUrl} target="_blank" rel="noopener noreferrer" 
                  className="text-[10px] font-semibold text-white/80 hover:text-white flex items-center gap-1">
                  Open Full Web <ExternalLink className="h-3 w-3" />
                </a>
                <button onClick={() => setShowWaPanel(false)} className="rounded-lg p-1 hover:bg-white/20 transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Main content - helpful redirect since WA blocks iframes */}
            <div className="flex-1 flex flex-col items-center justify-center bg-card text-center px-8 space-y-5">
              <div className="rounded-full bg-green-500/10 p-5 shadow-soft">
                <MessageSquare className="h-12 w-12 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg">Send Message Dialog</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs">
                  Your template details have been pre-filled. Please launch the conversation window to send immediately.
                </p>
              </div>
              <a 
                href={waPanelUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 text-white px-6 py-3 font-bold text-sm hover:bg-green-600 transition-colors shadow-lg w-full justify-center"
              >
                <MessageSquare className="h-5 w-5" /> Launch Chat Conversation
              </a>
              <button onClick={() => setShowWaPanel(false)} className="text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
