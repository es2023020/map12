import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useStore, type Lead } from "@/lib/store";
import { useDebounce } from "@/lib/useDebounce";
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
  Clock,
  Sparkles,
  Filter,
  Copy,
  Eye,
  ShieldCheck,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Download,
  Building2,
  Plus
} from "lucide-react";

export const Route = createFileRoute("/dashboard/campaigns")({
  component: CampaignsPage,
});

const defaultCampaignTemplates = [
  { 
    id: "c1", 
    title: "🏖️ Sahel Summer Launch", 
    mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    body: "Hello {name},\n\nHope you are well! Tatweer Misr just released exclusive new beachfront units in Solare Sahel with flexible 8-year plans starting at EGP {budget}M.\n\nLet me know if you would like me to send the master plan factsheet!\n\nBest regards,\n{broker_name}" 
  },
  { 
    id: "c2", 
    title: "🏡 New Zayed VIP Villa", 
    mediaUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    body: "Dear {name},\n\nWe just received the launch factsheet for Elm Tree & Solana in New Zayed. Premium villa plots with 5% down payment and 8-year installments.\n\nSince you expressed interest in {interest}, let me know if we can schedule a walkthrough!\n\nBest,\n{broker_name}" 
  },
  { 
    id: "c3", 
    title: "🔑 RTM Ready-to-Move", 
    mediaUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    body: "Hi {name},\n\nI compiled a list of immediate delivery (RTM) properties matching your budget around EGP {budget}M. Skip construction wait times!\n\nShould I send over unit photos & floor plans?\n\nBest,\n{broker_name}" 
  }
];

function CampaignsPage() {
  const leads = useStore((s) => s.leads);
  const user = useStore((s) => s.user);
  const incrementWhatsAppSends = useStore((s) => s.incrementWhatsAppSends);

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [templateText, setTemplateText] = useState(defaultCampaignTemplates[0].body);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>(defaultCampaignTemplates[0].mediaUrl);
  
  const [filterInterest, setFilterInterest] = useState("");
  const [activeQueue, setActiveQueue] = useState<Lead[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Active view tab
  const [activeTab, setActiveTab] = useState<"builder" | "compounds">("builder");

  // WhatsApp modal
  const [showWaPanel, setShowWaPanel] = useState(false);
  const [waPanelUrl, setWaPanelUrl] = useState("https://web.whatsapp.com");

  // Compound search
  const [compoundSearch, setCompoundSearch] = useState("");
  const debouncedCompoundSearch = useDebounce(compoundSearch, 200);

  // Copy feedback
  const [copiedText, setCopiedText] = useState(false);

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
    const filteredIds = new Set(filtered.map(l => l.id));
    setSelectedLeads(prev => prev.filter(id => !filteredIds.has(id)));
  };

  // Safe Spintax Resolver (runs automatically for anti-ban protection)
  const resolveMessage = (lead: Lead, body: string, idx: number = 0) => {
    const greetings = ["Hello", "Hi", "Dear", "Greetings", "Good day"];
    const signoffs = ["Best regards", "Warmly", "Best", "Sincerely", "Cheers"];
    
    const greeting = greetings[idx % greetings.length];
    const signoff = signoffs[idx % signoffs.length];

    const brokerName = user?.name || "PropTrack Broker";
    let text = body
      .replace(/^Hello|^Hi|^Dear|^Greetings|^Good day/gi, greeting)
      .replace(/Best regards|Warmly|Best|Sincerely|Cheers/gi, signoff)
      .replace(/{name}/g, lead.name)
      .replace(/{interest}/g, lead.interest || "your preferred compound")
      .replace(/{budget}/g, String(lead.budget))
      .replace(/{broker_name}/g, brokerName);

    return text;
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
    const success = incrementWhatsAppSends();
    if (!success) return;

    const currentLead = activeQueue[currentIndex];
    const messageText = resolveMessage(currentLead, templateText, currentIndex);
    const cleanedPhone = currentLead.phone.replace(/[^0-9]/g, "");
    const phoneWithCode = cleanedPhone.startsWith("0") ? "2" + cleanedPhone : cleanedPhone;
    
    let fullMsg = messageText;
    if (selectedMediaUrl && !selectedMediaUrl.startsWith("data:")) {
      fullMsg += `\n\n📌 Attached Photo:\n${selectedMediaUrl}`;
    }

    openWhatsAppUrl(`https://web.whatsapp.com/send?phone=${phoneWithCode}&text=${encodeURIComponent(fullMsg)}`);
    setCurrentIndex(prev => prev + 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedMediaUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleShareCompound = (comp: typeof compounds[0]) => {
    const success = incrementWhatsAppSends();
    if (!success) return;

    const brokerName = user?.name || "PropTrack Broker";
    const msg = `Hello!\n\nI wanted to share this listing with you:\n\n*${comp.name}*\nDeveloper: ${comp.developer}\nLocation: ${comp.destination.replace(/-/g, " ").toUpperCase()}\nStarting Price: EGP ${comp.priceFrom}M\nStatus: ${comp.status}\n\nFull Facts & Brochure:\nhttps://proptrack.eg/projects/${comp.slug}\n\nBest regards,\n${brokerName}`;
    openWhatsAppUrl(`https://web.whatsapp.com/send?text=${encodeURIComponent(msg)}`);
  };

  const insertPlaceholder = (ph: string) => {
    setTemplateText(prev => prev + ph);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Filtered Leads
  const filteredList = leads.filter(l => {
    return !filterInterest || 
      (l.interest && l.interest.toLowerCase().includes(filterInterest.toLowerCase())) || 
      l.name.toLowerCase().includes(filterInterest.toLowerCase());
  });

  // Filtered Compounds
  const filteredCompounds = compounds.filter(c =>
    debouncedCompoundSearch.length < 2 || 
    c.name.toLowerCase().includes(debouncedCompoundSearch.toLowerCase()) ||
    c.developer.toLowerCase().includes(debouncedCompoundSearch.toLowerCase()) ||
    c.destination.toLowerCase().includes(debouncedCompoundSearch.toLowerCase())
  ).slice(0, 36);

  // Preview lead
  const previewLead: Lead = useMemo(() => {
    if (selectedLeads.length > 0) {
      const found = leads.find(l => l.id === selectedLeads[0]);
      if (found) return found;
    }
    return leads[0] || { id: "p1", name: "Mohamed Aly", phone: "01001234567", budget: 15, interest: "Ras El Hekma" };
  }, [selectedLeads, leads]);

  const renderedPreviewText = resolveMessage(previewLead, templateText, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Simple Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-emerald-500" /> WhatsApp Campaign Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select clients, add custom text & pictures, and launch safe WhatsApp broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4" /> Auto Anti-Ban Active
          </span>
          <button
            onClick={() => openWhatsAppUrl("https://web.whatsapp.com")}
            className="rounded-xl bg-emerald-500 text-white px-4 py-2 text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
          >
            Open WhatsApp Web
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("builder")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "builder" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          📲 3-Step Campaign Builder
        </button>
        <button
          onClick={() => setActiveTab("compounds")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "compounds" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          🏢 Share Compound Listings
        </button>
      </div>

      {/* BUILDER MODE */}
      {activeTab === "builder" && (
        <div className="space-y-6">
          
          {/* 3 Simple Columns */}
          <div className="grid gap-6 xl:grid-cols-12 items-start">
            
            {/* STEP 1: SELECT CLIENTS (4 Cols) */}
            <div className="xl:col-span-4 rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">1</span>
                  Select Clients ({selectedLeads.length})
                </h3>
                <div className="flex gap-1.5">
                  <button onClick={() => selectAllFiltered(filteredList)} className="text-[10px] font-bold text-accent hover:underline">
                    Select All ({filteredList.length})
                  </button>
                  <span className="text-[10px] text-muted-foreground">&bull;</span>
                  <button onClick={() => clearAllSelected(filteredList)} className="text-[10px] font-bold text-muted-foreground hover:underline">
                    Clear
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter by name or interest..."
                  value={filterInterest}
                  onChange={(e) => setFilterInterest(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              {/* Client List */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredList.map((lead) => {
                  const isSelected = selectedLeads.includes(lead.id);
                  return (
                    <div
                      key={lead.id}
                      onClick={() => toggleSelectLead(lead.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected ? "border-emerald-500 bg-emerald-500/5" : "border-border/60 hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-all ${
                          isSelected ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-primary truncate">{lead.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{lead.phone} &bull; EGP {lead.budget}M</div>
                        </div>
                      </div>

                      {lead.interest && (
                        <span className="rounded-full bg-accent/10 text-accent px-2 py-0.5 text-[9px] font-bold uppercase truncate max-w-[80px]">
                          {lead.interest}
                        </span>
                      )}
                    </div>
                  );
                })}

                {filteredList.length === 0 && (
                  <div className="text-center py-8 text-xs text-muted-foreground italic">No clients found matching filter.</div>
                )}
              </div>
            </div>

            {/* STEP 2: MESSAGE & PICTURE (5 Cols) */}
            <div className="xl:col-span-5 rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">2</span>
                  Compose Message & Picture
                </h3>
              </div>

              {/* Quick Template Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Quick Templates</span>
                <div className="flex flex-wrap gap-1.5">
                  {defaultCampaignTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTemplateText(t.body);
                        if (t.mediaUrl) setSelectedMediaUrl(t.mediaUrl);
                      }}
                      className="rounded-lg border border-border/80 px-2.5 py-1 text-xs font-semibold text-primary hover:border-emerald-500 hover:bg-emerald-500/5 transition-all"
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Picture Upload & Attachment Box */}
              <div className="rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-emerald-600" /> Attach Picture / Brochure
                  </span>
                  {selectedMediaUrl && (
                    <button onClick={() => setSelectedMediaUrl("")} className="text-[10px] font-bold text-red-500 hover:underline">
                      Remove Picture
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-card border border-border hover:border-emerald-500 p-2.5 text-xs font-bold text-primary cursor-pointer transition-all shadow-2xs">
                    <Upload className="h-4 w-4 text-emerald-600" />
                    <span>Upload Image from Device</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                  <span>Message Copy</span>
                  <span>{templateText.length} chars</span>
                </div>
                <textarea
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  className="w-full h-36 rounded-xl border border-border bg-background p-3 text-xs text-primary focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Placeholders */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "+ Name", ph: "{name}" },
                  { label: "+ Interest", ph: "{interest}" },
                  { label: "+ Budget", ph: "{budget}" },
                  { label: "+ Broker", ph: "{broker_name}" },
                ].map(ph => (
                  <button
                    key={ph.ph}
                    onClick={() => insertPlaceholder(ph.ph)}
                    className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary hover:bg-emerald-500/10 hover:text-emerald-600 transition-all"
                  >
                    {ph.label}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleStartCampaign}
                disabled={selectedLeads.length === 0}
                className="w-full rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 py-3 font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <Play className="h-4 w-4" /> Start Broadcast ({selectedLeads.length} Clients)
              </Button>
            </div>

            {/* STEP 3: LIVE PREVIEW (3 Cols) */}
            <div className="xl:col-span-3 rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">3</span>
                  WhatsApp Preview
                </h3>
              </div>

              {/* Simple Phone Screen */}
              <div className="mx-auto w-full max-w-[240px] rounded-[28px] border-[5px] border-slate-800 bg-slate-900 p-1.5 shadow-xl overflow-hidden">
                <div className="rounded-[22px] bg-[#ece5dd] overflow-hidden min-h-[380px] flex flex-col justify-between pt-4">
                  
                  {/* Top Bar */}
                  <div className="bg-[#075e54] text-white px-3 py-2 flex items-center justify-between">
                    <div className="text-[10px] font-bold truncate max-w-[120px]">{previewLead.name}</div>
                    <Smartphone className="h-3 w-3 text-white/80" />
                  </div>

                  {/* Chat Content */}
                  <div className="p-2 space-y-2 flex-1 flex flex-col justify-end">
                    
                    {/* Picture Card if selected */}
                    {selectedMediaUrl && (
                      <div className="self-end max-w-[95%] rounded-xl bg-[#dcf8c6] overflow-hidden p-1 shadow-2xs border border-green-200">
                        <div className="aspect-[16/9] overflow-hidden rounded-lg bg-slate-200">
                          <img src={selectedMediaUrl} alt="Attached" className="h-full w-full object-cover" />
                        </div>
                        <div className="p-1.5 text-[9.5px] text-slate-800 leading-tight whitespace-pre-wrap">
                          {renderedPreviewText.substring(0, 90)}...
                        </div>
                        <div className="px-1 text-[8px] text-right text-slate-500">12:00 PM ✓✓</div>
                      </div>
                    )}

                    {!selectedMediaUrl && (
                      <div className="self-end max-w-[95%] rounded-xl bg-[#dcf8c6] p-2 text-[9.5px] text-slate-800 leading-relaxed whitespace-pre-wrap shadow-2xs">
                        {renderedPreviewText}
                        <div className="mt-1 text-[8px] text-right text-slate-500">12:00 PM ✓✓</div>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#f0f0f0] p-1.5 text-[8px] text-slate-400 text-center border-t border-slate-300">
                    Type a message...
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button onClick={() => handleCopyMessage(renderedPreviewText)} className="text-xs text-muted-foreground hover:text-primary font-semibold">
                  {copiedText ? "✓ Copied!" : "Copy Text"}
                </button>
              </div>
            </div>

          </div>

          {/* ACTIVE DISPATCH QUEUE BAR */}
          {activeQueue.length > 0 && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <h3 className="font-bold text-primary text-base flex items-center gap-2">
                  <Send className="h-4 w-4 text-emerald-600 animate-bounce" /> Sending Queue ({currentIndex + 1} of {activeQueue.length})
                </h3>
                <div className="w-36 bg-border h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(currentIndex / activeQueue.length) * 100}%` }} />
                </div>
              </div>

              {currentIndex < activeQueue.length ? (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl">
                  <div>
                    <div className="text-xs font-bold text-primary">{activeQueue[currentIndex].name}</div>
                    <div className="text-[10px] text-muted-foreground">{activeQueue[currentIndex].phone}</div>
                  </div>

                  <button
                    onClick={handleSendCurrent}
                    className="rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 px-5 py-2.5 flex items-center gap-2 shadow"
                  >
                    <Send className="h-3.5 w-3.5" /> Send to WhatsApp #{currentIndex + 1}
                  </button>
                </div>
              ) : (
                <div className="p-3 text-center text-xs font-bold text-emerald-600">
                  🎉 All messages sent! Check responses on WhatsApp Web.
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* COMPOUND SHARE MODE */}
      {activeTab === "compounds" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2">
              <Share2 className="h-4 w-4 text-emerald-500" /> Share Compound Listings
            </h3>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by compound, developer, or location..."
              value={compoundSearch}
              onChange={(e) => setCompoundSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs text-primary focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-[500px] overflow-y-auto">
            {filteredCompounds.map(comp => (
              <div key={comp.slug} className="rounded-xl border border-border bg-secondary/10 p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-primary truncate">{comp.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{comp.developer} &bull; {comp.destination.replace(/-/g, " ").toUpperCase()}</div>
                  <div className="text-xs font-bold text-emerald-600 mt-1">Starting EGP {comp.priceFrom}M</div>
                </div>

                <button
                  onClick={() => handleShareCompound(comp)}
                  className="mt-3 w-full rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white py-2 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageSquare className="h-3 w-3" /> Share Listing to WhatsApp
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      {showWaPanel && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in slide-in-from-bottom-8 duration-300">
          <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col p-4 text-center space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-primary border-b border-border pb-2">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <MessageSquare className="h-4 w-4" /> Send Message
              </span>
              <button onClick={() => setShowWaPanel(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Your message copy and client phone number have been prepared.</p>
            <a
              href={waPanelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-emerald-500 text-white py-3 text-xs font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow"
            >
              <MessageSquare className="h-4 w-4" /> Open WhatsApp Conversation
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
