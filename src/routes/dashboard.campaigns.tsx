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
  Building2,
  TrendingUp,
  Percent,
  CheckCircle,
  Clock,
  Sparkles,
  Filter,
  Copy,
  Eye,
  Plus,
  Zap,
  Award,
  ShieldCheck,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Pause,
  AlertTriangle,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Download
} from "lucide-react";

export const Route = createFileRoute("/dashboard/campaigns")({
  component: CampaignsPage,
});

const mediaPresets = [
  { id: "m1", name: "🏖️ Sahel Beachfront", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", type: "image" },
  { id: "m2", name: "🏡 Modern Luxury Villa", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", type: "image" },
  { id: "m3", name: "📐 Master Plan Graphic", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", type: "image" },
  { id: "m4", name: "🏙️ Commercial Tower", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", type: "image" },
];

const defaultCampaignTemplates = [
  { 
    id: "c1", 
    title: "🏖️ North Coast & Sahel Summer Launch", 
    category: "Coastal Launch",
    mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    body: "Hello {name},\n\nHope you are well! Tatweer Misr & Hassan Allam just released exclusive new beachfront units in Solare & Heneish with flexible 8-year installment plans starting from EGP {budget}M.\n\nWould you like me to send you the master plan and PDF factsheet?\n\nBest regards,\n{broker_name}" 
  },
  { 
    id: "c2", 
    title: "🏡 West Cairo / New Zayed VIP Factsheet", 
    category: "New Zayed Special",
    mediaUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    body: "Dear {name},\n\nWe just received the updated developer launch details for Elm Tree & Solana in New Zayed. Premium villa plots with 5% down payment and 8-year equal installments.\n\nSince you expressed interest in {interest}, let me know if we can schedule a quick walkthrough!\n\nBest,\n{broker_name}" 
  },
  { 
    id: "c3", 
    title: "🔑 RTM (Ready-to-Move) Immediate Handover", 
    category: "RTM Collection",
    mediaUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    body: "Hi {name},\n\nI compiled a list of immediate delivery (RTM) properties matching your budget around EGP {budget}M. Skip construction wait times and inspect completed amenities!\n\nShould I send over the brochure and unit photos?\n\nBest,\n{broker_name}" 
  },
  { 
    id: "c4", 
    title: "🔥 Flash Price Update & 10% Down Deal", 
    category: "Price Reduction",
    mediaUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    body: "Hi {name},\n\nExclusive flash update: Selected luxury units in {interest} are currently available with an extended 10-year payment plan and special launch pricing for a limited time.\n\nLet me know if you would like me to lock in a private consultation.\n\nBest regards,\n{broker_name}" 
  }
];

const mockCampaignHistory = [
  { id: "h1", name: "North Coast Q3 Broadcast", date: "2026-08-02", reached: 18, status: "Completed", openRate: "98%", category: "Coastal", antiBanScore: "98%" },
  { id: "h2", name: "New Zayed Villa VIP Outreach", date: "2026-07-28", reached: 12, status: "Completed", openRate: "100%", category: "Villas", antiBanScore: "100%" },
  { id: "h3", name: "RTM Ready-to-Move Flash List", date: "2026-07-20", reached: 24, status: "Completed", openRate: "96%", category: "RTM", antiBanScore: "96%" },
  { id: "h4", name: "New Capital Commercial Promo", date: "2026-07-11", reached: 15, status: "Completed", openRate: "94%", category: "Commercial", antiBanScore: "95%" }
];

function CampaignsPage() {
  const leads = useStore((s) => s.leads);
  const user = useStore((s) => s.user);
  const incrementWhatsAppSends = useStore((s) => s.incrementWhatsAppSends);

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [templateText, setTemplateText] = useState(defaultCampaignTemplates[0].body);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>(defaultCampaignTemplates[0].mediaUrl);
  const [customMediaInput, setCustomMediaInput] = useState("");
  
  const [filterInterest, setFilterInterest] = useState("");
  const [filterBudget, setFilterBudget] = useState<number>(0);
  const [activeQueue, setActiveQueue] = useState<Lead[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Anti-Ban Engine Settings
  const [antiBanPacingSec, setAntiBanPacingSec] = useState<number>(10);
  const [useSpintax, setUseSpintax] = useState<boolean>(true);
  const [autoDispatch, setAutoDispatch] = useState<boolean>(false);
  const [dispatching, setDispatching] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"campaign-builder" | "share-compound" | "campaign-logs">("campaign-builder");

  // WhatsApp modal / panel
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

  // Anti-Ban Spintax Message Resolver
  const resolveMessage = (lead: Lead, body: string, idx: number = 0) => {
    let text = body;
    
    if (useSpintax) {
      const greetings = ["Hello", "Hi", "Dear", "Greetings", "Good day"];
      const signoffs = ["Best regards", "Warmly", "Best", "Sincerely", "Cheers"];
      
      const greeting = greetings[idx % greetings.length];
      const signoff = signoffs[idx % signoffs.length];

      text = text
        .replace(/^Hello|^Hi|^Dear|^Greetings|^Good day/gi, greeting)
        .replace(/Best regards|Warmly|Best|Sincerely|Cheers/gi, signoff);
    }

    const brokerName = user?.name || "PropTrack Broker";
    return text
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
    setDispatching(false);
  };

  const handleSendCurrent = () => {
    if (currentIndex >= activeQueue.length) return;
    const success = incrementWhatsAppSends();
    if (!success) return;

    const currentLead = activeQueue[currentIndex];
    const messageText = resolveMessage(currentLead, templateText, currentIndex);
    const cleanedPhone = currentLead.phone.replace(/[^0-9]/g, "");
    const phoneWithCode = cleanedPhone.startsWith("0") ? "2" + cleanedPhone : cleanedPhone;
    
    // If media attached, we include URL in text or open web portal
    let fullMsg = messageText;
    if (selectedMediaUrl) {
      fullMsg += `\n\n📌 Attached Factsheet / Photo:\n${selectedMediaUrl}`;
    }

    openWhatsAppUrl(`https://web.whatsapp.com/send?phone=${phoneWithCode}&text=${encodeURIComponent(fullMsg)}`);
    setCurrentIndex(prev => prev + 1);
  };

  // Auto-dispatch Pacing Timer
  useEffect(() => {
    let timer: any;
    if (dispatching && currentIndex < activeQueue.length) {
      if (countdown > 0) {
        timer = setInterval(() => setCountdown(c => c - 1), 1000);
      } else {
        handleSendCurrent();
        if (currentIndex + 1 < activeQueue.length) {
          setCountdown(antiBanPacingSec);
        } else {
          setDispatching(false);
        }
      }
    }
    return () => clearInterval(timer);
  }, [dispatching, countdown, currentIndex, activeQueue]);

  const toggleAutoDispatch = () => {
    if (dispatching) {
      setDispatching(false);
    } else {
      setDispatching(true);
      setCountdown(antiBanPacingSec);
    }
  };

  const handleShareCompound = (comp: typeof compounds[0]) => {
    const success = incrementWhatsAppSends();
    if (!success) return;

    const brokerName = user?.name || "PropTrack Broker";
    const msg = `Hello!\n\nI wanted to share this exciting property listing with you:\n\n*${comp.name}*\nDeveloper: ${comp.developer}\nLocation: ${comp.destination.replace(/-/g, " ").toUpperCase()}\nStarting Price: EGP ${comp.priceFrom}M\nStatus: ${comp.status}\nUnit Types: ${comp.types.join(", ")}\n\nProject Overview & Brochure:\nhttps://proptrack.eg/projects/${comp.slug}\n\nReach out to me for a private showing!\nBest regards,\n${brokerName}`;
    openWhatsAppUrl(`https://web.whatsapp.com/send?text=${encodeURIComponent(msg)}`);
  };

  const insertPlaceholder = (ph: string) => {
    setTemplateText(prev => prev + ph);
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

  const handleExportCSV = () => {
    const targets = leads.filter(l => selectedLeads.includes(l.id));
    if (targets.length === 0) return;
    const rows = [["Name", "Phone", "Budget_EGP_M", "Interest_Area"]];
    targets.forEach(t => rows.push([t.name, t.phone, String(t.budget), t.interest || ""]));
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `whatsapp_campaign_targets_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Filtered Leads
  const filteredList = leads.filter(l => {
    const matchesInterest = !filterInterest || (l.interest && l.interest.toLowerCase().includes(filterInterest.toLowerCase())) || l.name.toLowerCase().includes(filterInterest.toLowerCase());
    const matchesBudget = !filterBudget || l.budget >= filterBudget;
    return matchesInterest && matchesBudget;
  });

  // Filtered Compounds
  const filteredCompounds = compounds.filter(c =>
    debouncedCompoundSearch.length < 2 || 
    c.name.toLowerCase().includes(debouncedCompoundSearch.toLowerCase()) ||
    c.developer.toLowerCase().includes(debouncedCompoundSearch.toLowerCase()) ||
    c.destination.toLowerCase().includes(debouncedCompoundSearch.toLowerCase())
  ).slice(0, 36);

  // Statistics
  const targetReachCount = selectedLeads.length;
  const combinedSegmentBudget = useMemo(() => {
    return leads
      .filter(l => selectedLeads.includes(l.id))
      .reduce((sum, l) => sum + l.budget, 0);
  }, [leads, selectedLeads]);

  // Anti-Ban Safety Score Computation
  const antiBanScore = useMemo(() => {
    let score = 70;
    if (useSpintax) score += 10;
    if (antiBanPacingSec >= 10) score += 10;
    if (selectedLeads.length > 0 && selectedLeads.length <= 30) score += 10;
    return Math.min(score, 99);
  }, [useSpintax, antiBanPacingSec, selectedLeads.length]);

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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Premium Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-primary via-primary/95 to-slate-900 text-primary-foreground p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 -mb-20 h-48 w-48 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent border border-accent/30">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Mass Production & Anti-Ban Protection Active
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              WhatsApp Broadcast Studio & Anti-Ban Engine
            </h1>
            <p className="text-sm sm:text-base text-primary-foreground/80 leading-relaxed">
              Dispatch high-volume WhatsApp outreach with **Anti-Ban Smart Pacing**, dynamic spintax greetings, and rich media photo/PDF attachments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              disabled={selectedLeads.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 text-white border border-white/20 px-4 py-3 text-xs font-bold hover:bg-white/20 transition-all disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Export CSV Target Sheet ({selectedLeads.length})
            </button>
            <button
              onClick={() => openWhatsAppUrl("https://web.whatsapp.com")}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 text-white px-5 py-3 text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
            >
              <MessageSquare className="h-4 w-4" /> Open WhatsApp Web
            </button>
          </div>
        </div>

        {/* Dashboard Live Stats & Anti-Ban Score */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-6 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-accent" /> Selected Reach
            </div>
            <div className="mt-1 font-display text-2xl font-black text-white">{targetReachCount} <span className="text-xs font-medium text-white/60">Leads</span></div>
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Targeted Capital
            </div>
            <div className="mt-1 font-display text-2xl font-black text-emerald-400">EGP {combinedSegmentBudget}M</div>
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Anti-Ban Safety Rating
            </div>
            <div className="mt-1 font-display text-2xl font-black text-emerald-400">{antiBanScore}% <span className="text-xs font-normal text-white/60">Safe</span></div>
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> Pacing Throttling
            </div>
            <div className="mt-1 font-display text-2xl font-black text-white">{antiBanPacingSec}s <span className="text-xs font-normal text-white/60">Interval</span></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-2">
        <div className="flex gap-2 rounded-2xl bg-card p-1.5 border border-border shadow-sm">
          <button
            onClick={() => setActiveTab("campaign-builder")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "campaign-builder"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <Megaphone className="h-4 w-4 text-accent" /> Campaign & Media Builder
          </button>
          <button
            onClick={() => setActiveTab("share-compound")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "share-compound"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <Share2 className="h-4 w-4 text-emerald-500" /> Share Compound Listings
          </button>
          <button
            onClick={() => setActiveTab("campaign-logs")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "campaign-logs"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <Clock className="h-4 w-4 text-amber-500" /> Campaign History Log
          </button>
        </div>

        {activeTab === "campaign-builder" && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Queue Ready:</span>
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-extrabold text-accent border border-accent/30">
              {selectedLeads.length} Selected
            </span>
          </div>
        )}
      </div>

      {/* TAB 1: CAMPAIGN BUILDER & ANTI-BAN SUITE */}
      {activeTab === "campaign-builder" && (
        <div className="space-y-8">
          
          {/* Main 3-Column Workspace */}
          <div className="grid gap-6 xl:grid-cols-12 items-start">
            
            {/* COLUMN 1: Audience Selection (4 cols) */}
            <div className="xl:col-span-4 rounded-3xl border border-border bg-card p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" /> 1. Audience Target
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Filter CRM leads by interest or budget</p>
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="text-[10px] font-bold rounded-lg px-2 py-1 h-auto" onClick={() => selectAllFiltered(filteredList)}>
                    All ({filteredList.length})
                  </Button>
                  <Button size="sm" variant="ghost" className="text-[10px] font-bold rounded-lg text-muted-foreground px-2 py-1 h-auto" onClick={() => clearAllSelected(filteredList)}>
                    Clear
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search name/interest..."
                    value={filterInterest}
                    onChange={(e) => setFilterInterest(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 border border-border bg-background rounded-xl px-3 py-2 text-xs">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <select
                    value={filterBudget}
                    onChange={(e) => setFilterBudget(Number(e.target.value))}
                    className="w-full bg-transparent font-medium text-primary focus:outline-none cursor-pointer"
                  >
                    <option value={0}>All Budgets</option>
                    <option value={5}>Min EGP 5M+</option>
                    <option value={10}>Min EGP 10M+</option>
                    <option value={20}>Min EGP 20M+</option>
                  </select>
                </div>
              </div>

              {/* Client List */}
              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                {filteredList.map((lead) => {
                  const isSelected = selectedLeads.includes(lead.id);
                  const leadStatus = (lead as any).status || (lead as any).stage;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => toggleSelectLead(lead.id)}
                      className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? "border-accent bg-accent/5 shadow-sm" 
                          : "border-border/60 bg-background/50 hover:bg-secondary/30 hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                          isSelected ? "border-accent bg-accent text-accent-foreground" : "border-muted-foreground/30 bg-background"
                        }`}>
                          {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-primary truncate flex items-center gap-2">
                            {lead.name}
                            {leadStatus && (
                              <span className="text-[9px] font-semibold text-muted-foreground bg-secondary px-1.5 py-0.2 rounded">
                                {leadStatus}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                            <span>{lead.phone}</span>
                            <span>&bull;</span>
                            <span className="font-semibold text-emerald-600">EGP {lead.budget}M</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {lead.interest && (
                          <span className="rounded-full bg-accent/10 text-accent px-2.5 py-0.5 text-[9px] font-bold uppercase truncate max-w-[90px]">
                            {lead.interest}
                          </span>
                        )}
                        <button
                          title="Instant WhatsApp message"
                          onClick={(e) => {
                            e.stopPropagation();
                            const cleanedPhone = lead.phone.replace(/[^0-9]/g, "");
                            const phoneWithCode = cleanedPhone.startsWith("0") ? "2" + cleanedPhone : cleanedPhone;
                            const msg = resolveMessage(lead, templateText, 0);
                            openWhatsAppUrl(`https://web.whatsapp.com/send?phone=${phoneWithCode}&text=${encodeURIComponent(msg)}`);
                          }}
                          className="rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white p-2 transition-all"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredList.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-border rounded-2xl p-6 text-xs text-muted-foreground">
                    No leads found matching your search filter.
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2: Composer + Media Attachment Space + Anti-Ban Controls (5 cols) */}
            <div className="xl:col-span-5 rounded-3xl border border-border bg-card p-6 shadow-soft space-y-5">
              <div className="border-b border-border pb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-accent" /> 2. Composer & Media Studio
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Anti-Ban Active
                </span>
              </div>

              {/* Pre-built Templates */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-accent" /> Campaign Templates
                </span>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {defaultCampaignTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTemplateText(t.body);
                        if (t.mediaUrl) setSelectedMediaUrl(t.mediaUrl);
                      }}
                      className="text-left rounded-xl border border-border/60 p-2 text-xs hover:border-accent hover:bg-accent/5 transition-all group truncate font-semibold text-primary"
                    >
                      <span className="truncate block">{t.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Picture & Media Attachment Studio */}
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-accent" /> Picture & Factsheet Attachment
                  </span>
                  {selectedMediaUrl && (
                    <button
                      onClick={() => setSelectedMediaUrl("")}
                      className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> Remove Attachment
                    </button>
                  )}
                </div>

                {/* Preset Thumbnails */}
                <div className="grid grid-cols-4 gap-2">
                  {mediaPresets.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMediaUrl(m.url)}
                      className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all ${
                        selectedMediaUrl === m.url ? "border-accent ring-2 ring-accent/30" : "border-border/60 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                      {selectedMediaUrl === m.url && (
                        <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white stroke-[3] bg-accent rounded-full p-0.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Image URL input & Upload Local File */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste custom image or PDF URL..."
                      value={customMediaInput}
                      onChange={(e) => setCustomMediaInput(e.target.value)}
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-bold rounded-xl"
                      onClick={() => {
                        if (customMediaInput.trim()) {
                          setSelectedMediaUrl(customMediaInput.trim());
                          setCustomMediaInput("");
                        }
                      }}
                    >
                      Attach Link
                    </Button>
                  </div>

                  <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-accent/40 bg-accent/10 hover:bg-accent/20 p-2.5 text-xs font-bold text-accent cursor-pointer transition-all">
                    <Upload className="h-4 w-4" />
                    <span>Upload Picture from Computer / Device</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Textarea Editor */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                  <span>Message Copy</span>
                  <span>{templateText.length} chars</span>
                </div>
                <textarea
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  placeholder="Write your WhatsApp broadcast copy..."
                  className="w-full h-40 rounded-2xl border border-border bg-background p-3.5 text-xs text-primary focus:border-accent focus:outline-none resize-none leading-relaxed shadow-inner"
                />
              </div>

              {/* Variables */}
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
                    className="rounded-xl bg-secondary px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-accent/20 hover:text-accent border border-border/60 transition-all"
                  >
                    {ph.label}
                  </button>
                ))}
              </div>

              {/* Anti-Ban Protection Settings Panel */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Mass Production Anti-Ban Protection
                </span>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-semibold text-primary">Dynamic Greeting Spintax</span>
                    <input
                      type="checkbox"
                      checked={useSpintax}
                      onChange={(e) => setUseSpintax(e.target.checked)}
                      className="rounded accent-emerald-600 h-4 w-4"
                    />
                  </label>
                  <p className="text-[10px] text-muted-foreground">Rotates opening greetings (Hello, Hi, Dear, Greetings) per message to avoid spam algorithm detection.</p>
                </div>

                <div className="space-y-1 text-xs pt-1">
                  <div className="flex justify-between font-semibold text-primary">
                    <span>Pacing Delay Throttling:</span>
                    <span className="font-bold text-emerald-600">{antiBanPacingSec}s per lead</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={antiBanPacingSec}
                    onChange={(e) => setAntiBanPacingSec(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground">Randomized human interval between dispatches. Keeps phone number safe.</p>
                </div>
              </div>

              <Button 
                onClick={handleStartCampaign} 
                disabled={selectedLeads.length === 0}
                className="w-full rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 py-3 font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent/20 transition-all"
              >
                <Play className="h-4 w-4" /> Start Safe Mass Broadcast ({selectedLeads.length} Leads)
              </Button>
            </div>

            {/* COLUMN 3: Live WhatsApp Phone Mockup with Picture Attachment (3 cols) */}
            <div className="xl:col-span-3 rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                  <Eye className="h-4.5 w-4.5 text-emerald-500" /> Live Preview
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Media Ready</span>
              </div>

              {/* Phone Frame */}
              <div className="relative mx-auto w-full max-w-[260px] rounded-[34px] border-[6px] border-slate-800 bg-slate-900 p-2 shadow-2xl overflow-hidden">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3.5 w-20 rounded-full bg-slate-800 z-20" />

                {/* WhatsApp Screen */}
                <div className="relative rounded-[26px] bg-[#ece5dd] overflow-hidden min-h-[420px] flex flex-col justify-between pt-6">
                  
                  {/* Top Header */}
                  <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center justify-between shadow">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                        {previewLead.name.charAt(0)}
                      </div>
                      <div className="leading-tight">
                        <div className="text-[11px] font-bold truncate max-w-[100px]">{previewLead.name}</div>
                        <div className="text-[8px] text-white/80">online</div>
                      </div>
                    </div>
                    <Smartphone className="h-3.5 w-3.5 text-white/80" />
                  </div>

                  {/* Chat Bubbles with Picture Attachment */}
                  <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-end">
                    
                    {/* Media Image Card if selected */}
                    {selectedMediaUrl && (
                      <div className="self-end max-w-[92%] rounded-2xl bg-[#dcf8c6] overflow-hidden p-1 shadow-xs border border-green-200">
                        <div className="aspect-[16/9] overflow-hidden rounded-xl bg-slate-200 relative">
                          <img src={selectedMediaUrl} alt="Attached Factsheet" className="h-full w-full object-cover" />
                        </div>
                        <div className="p-2 text-[10px] text-slate-800 leading-tight whitespace-pre-wrap">
                          {renderedPreviewText.substring(0, 100)}...
                        </div>
                        <div className="px-2 pb-1 flex items-center justify-end gap-1 text-[8px] text-slate-500">
                          <span>12:00 PM</span>
                          <span className="text-blue-500 font-bold">✓✓</span>
                        </div>
                      </div>
                    )}

                    {!selectedMediaUrl && (
                      <div className="self-end max-w-[92%] rounded-xl bg-[#dcf8c6] p-2.5 text-[10px] text-slate-800 shadow-xs border border-green-200/50 leading-relaxed whitespace-pre-wrap">
                        {renderedPreviewText}
                        <div className="mt-1 flex items-center justify-end gap-1 text-[8px] text-slate-500">
                          <span>12:00 PM</span>
                          <span className="text-blue-500 font-bold">✓✓</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Input */}
                  <div className="bg-[#f0f0f0] p-2 flex items-center gap-1.5 border-t border-slate-300">
                    <div className="flex-1 bg-white rounded-full px-3 py-1 text-[9px] text-slate-400">Type message...</div>
                    <div className="h-6 w-6 rounded-full bg-[#128c7e] text-white flex items-center justify-center text-[10px]">
                      ➤
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-1">
                <button
                  onClick={() => handleCopyMessage(renderedPreviewText)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent font-semibold"
                >
                  <Copy className="h-3.5 w-3.5" /> {copiedText ? "Copied to Clipboard!" : "Copy Text Copy"}
                </button>
              </div>
            </div>

          </div>

          {/* ACTIVE MASS CAMPAIGN DISPATCHER & AUTOMATED PACING CONTROL */}
          {activeQueue.length > 0 && (
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
                <div>
                  <h3 className="font-display font-bold text-primary text-xl flex items-center gap-2">
                    <Send className="h-5 w-5 text-emerald-600 animate-bounce" /> Mass Broadcast Dispatcher (Anti-Ban Throttled)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Automated or step-by-step dispatch with human pacing delay</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-xl">
                    <span className="text-xs font-bold text-primary">Auto-Pacing:</span>
                    <button
                      onClick={toggleAutoDispatch}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        dispatching ? "bg-amber-500 text-white animate-pulse" : "bg-emerald-500 text-white"
                      }`}
                    >
                      {dispatching ? `Pausing in ${countdown}s` : "Start Auto-Pacing"}
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-primary">{currentIndex} of {activeQueue.length} Dispatched</span>
                    <div className="w-44 bg-border h-2 rounded-full overflow-hidden mt-1">
                      <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(currentIndex / activeQueue.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {currentIndex < activeQueue.length ? (
                <div className="grid gap-4 md:grid-cols-3 items-center bg-card border border-border p-5 rounded-2xl shadow-soft">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current Target Lead</span>
                    <div className="text-base font-extrabold text-primary mt-1">{activeQueue[currentIndex].name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{activeQueue[currentIndex].phone}</span>
                      <span>&bull;</span>
                      <span className="font-semibold text-emerald-600">Budget: EGP {activeQueue[currentIndex].budget}M</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 bg-secondary/30 p-4 rounded-xl border border-border/50">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Unique Spintax Rendered Text</span>
                      <p className="text-xs text-foreground/90 mt-1 italic line-clamp-2 leading-relaxed">
                        {resolveMessage(activeQueue[currentIndex], templateText, currentIndex)}
                      </p>
                    </div>

                    <button
                      onClick={handleSendCurrent}
                      className="rounded-2xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all px-6 py-3.5 flex items-center gap-2 shadow-lg shrink-0 hover:scale-102 active:scale-98"
                    >
                      <Send className="h-4 w-4" /> Dispatch #{currentIndex + 1} to WhatsApp
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center flex flex-col items-center space-y-2">
                  <span className="inline-flex rounded-full bg-emerald-500 text-white p-3 shadow-md">
                    <Check className="h-6 w-6 stroke-[3]" />
                  </span>
                  <h4 className="text-base font-bold text-primary">Mass Production Campaign Broadcast Completed!</h4>
                  <p className="text-xs text-muted-foreground max-w-md">All messages sent safely with anti-ban pacing intact.</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: SHARE COMPOUND LISTINGS */}
      {activeTab === "share-compound" && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Share2 className="h-5 w-5 text-emerald-500" /> Share Compound Listings Directly to WhatsApp
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Search any compound in Egypt and click to generate a pre-formatted property card message with price, location, unit types, and verified URL.</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search compounds by name, developer, or area (e.g. solare, palm hills, new cairo)..."
              value={compoundSearch}
              onChange={(e) => setCompoundSearch(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background pl-11 pr-4 py-3 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none shadow-inner"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredCompounds.map(comp => (
              <div key={comp.slug} className="group rounded-2xl border border-border bg-secondary/10 p-5 hover:border-accent/50 hover:bg-secondary/20 transition-all flex flex-col justify-between shadow-2xs">
                <div className="space-y-3">
                  <div className="aspect-[16/9] overflow-hidden rounded-xl bg-secondary relative">
                    <img src={comp.hero} alt={comp.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 right-2 rounded-full bg-background/90 backdrop-blur px-2.5 py-0.5 text-[9px] font-bold text-primary shadow">
                      {comp.status}
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-primary truncate">{comp.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">{comp.developer} &bull; {comp.destination.replace(/-/g, " ").toUpperCase()}</div>
                    <div className="text-xs font-bold text-emerald-600 mt-1.5">Starting EGP {comp.priceFrom}M</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {comp.types.slice(0, 3).map(t => (
                        <span key={t} className="rounded-lg bg-secondary px-2 py-0.5 text-[9px] font-bold text-muted-foreground uppercase">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleShareCompound(comp)}
                  className="mt-5 w-full rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Share Listing to WhatsApp
                </button>
              </div>
            ))}

            {filteredCompounds.length === 0 && (
              <div className="col-span-full text-center py-16 text-xs text-muted-foreground italic border border-dashed border-border rounded-2xl">
                No compounds found matching term.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CAMPAIGN HISTORY LOGS */}
      {activeTab === "campaign-logs" && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-5">
          <div className="border-b border-border pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" /> Historical Campaigns & Anti-Ban Audit Log
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Track past outbound campaign reach, anti-ban rating, and open rate performance benchmarks.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Dispatch Date</th>
                  <th className="p-4 text-right">Leads Reached</th>
                  <th className="p-4 text-right">Anti-Ban Score</th>
                  <th className="p-4 text-right">Open Rate</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {mockCampaignHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-bold text-primary">{h.name}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-accent/10 text-accent px-2.5 py-0.5 text-[10px] font-bold uppercase">{h.category}</span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground font-medium">{h.date}</td>
                    <td className="p-4 text-right text-xs font-extrabold text-primary">{h.reached} Contacts</td>
                    <td className="p-4 text-right text-xs font-bold text-emerald-600">{h.antiBanScore}</td>
                    <td className="p-4 text-right text-xs font-extrabold text-emerald-600">{h.openRate}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Embedded WhatsApp Web Modal (slide-up) */}
      {showWaPanel && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md animate-in slide-in-from-bottom-8 duration-300">
          <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col" style={{ height: "480px" }}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-emerald-600 text-white shadow-soft">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">WhatsApp Dispatcher</span>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href={waPanelUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] font-bold text-white/80 hover:text-white flex items-center gap-1"
                >
                  Full Tab <ExternalLink className="h-3 w-3" />
                </a>
                <button onClick={() => setShowWaPanel(false)} className="rounded-lg p-1 hover:bg-white/20 transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center bg-card text-center px-8 space-y-5">
              <div className="rounded-full bg-emerald-500/10 p-5 shadow-inner border border-emerald-500/20">
                <MessageSquare className="h-12 w-12 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg">Send Conversation Message</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs">
                  Your message text, attached picture link, and client number have been pre-filled. Click below to launch your WhatsApp chat immediately.
                </p>
              </div>
              <a 
                href={waPanelUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 text-white px-6 py-3.5 font-bold text-xs hover:bg-emerald-600 transition-all shadow-lg w-full justify-center"
              >
                <MessageSquare className="h-4 w-4" /> Launch WhatsApp Conversation Window
              </a>
              <button onClick={() => setShowWaPanel(false)} className="text-xs text-muted-foreground hover:text-foreground">Dismiss Window</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
