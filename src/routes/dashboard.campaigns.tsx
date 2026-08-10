import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useStore, type Lead } from "@/lib/store";
import { useDebounce } from "@/lib/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { compounds } from "@/data/compounds";
import * as XLSX from "xlsx";
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
  Plus,
  FileSpreadsheet,
  Eraser,
  RefreshCw,
  Smile,
  Briefcase,
  FileUp,
  CheckCircle
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
  const addLead = useStore((s) => s.addLead);

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

  // Direct client actions
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);

  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientBudget, setNewClientBudget] = useState("10");
  const [newClientInterest, setNewClientInterest] = useState("");
  const [newClientNotes, setNewClientNotes] = useState("");

  const [importStatusMsg, setImportStatusMsg] = useState<string | null>(null);
  const [importStatusType, setImportStatusType] = useState<"success" | "error" | null>(null);

  // Auto-dismiss status messages
  useEffect(() => {
    if (importStatusMsg) {
      const timer = setTimeout(() => {
        setImportStatusMsg(null);
        setImportStatusType(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [importStatusMsg]);

  const toggleSelectLead = (id: string) => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSingleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone) return;

    addLead({
      name: newClientName,
      phone: newClientPhone,
      budget: parseFloat(newClientBudget) || 10,
      interest: newClientInterest,
      notes: newClientNotes,
      stage: "new"
    });

    setTimeout(() => {
      const updatedLeads = useStore.getState().leads;
      const newestLead = updatedLeads[0];
      if (newestLead) {
        setSelectedLeads(prev => {
          if (!prev.includes(newestLead.id)) {
            return [newestLead.id, ...prev];
          }
          return prev;
        });
      }
      setImportStatusMsg(`Added and selected client "${newClientName}".`);
      setImportStatusType("success");
      
      setNewClientName("");
      setNewClientPhone("");
      setNewClientBudget("10");
      setNewClientInterest("");
      setNewClientNotes("");
      setShowAddClientForm(false);
    }, 50);
  };

  const handleSheetImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatusMsg("Importing file...");
    setImportStatusType(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
          setImportStatusMsg("Error: sheet is empty.");
          setImportStatusType("error");
          return;
        }

        const rawMatrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as any[][];
        if (!rawMatrix || rawMatrix.length === 0) {
          setImportStatusMsg("Error: sheet is empty.");
          setImportStatusType("error");
          return;
        }

        const findHeaderRow = (rows: any[][]) => {
          const keywords = ["name", "client", "phone", "mobile", "number", "tel", "contact", "budget", "price", "interest", "compound", "notes", "details"];
          let maxScore = -1;
          let bestIdx = 0;
          for (let i = 0; i < Math.min(10, rows.length); i++) {
            const row = rows[i];
            if (!Array.isArray(row)) continue;
            let score = 0;
            row.forEach(cell => {
              if (cell === null || cell === undefined || cell === "") return;
              const str = String(cell).toLowerCase().replace(/[^a-z0-9]+/g, "");
              if (keywords.some(k => str.includes(k))) score += 2;
            });
            if (score > maxScore && score >= 2) {
              maxScore = score;
              bestIdx = i;
            }
          }
          return bestIdx;
        };

        const headerIdx = findHeaderRow(rawMatrix);
        const headerRow = rawMatrix[headerIdx] || [];
        const headers = headerRow.map((c, i) => String(c).trim().toLowerCase() || `column_${i + 1}`);

        const findIndex = (opts: string[]) => {
          return headers.findIndex(h => opts.some(opt => h.replace(/[^a-z0-9]+/g, "").includes(opt)));
        };

        const nameIdx = findIndex(["name", "client", "fullname", "username", "customer"]);
        const phoneIdx = findIndex(["phone", "mobile", "number", "tel", "whatsapp", "contact"]);
        const budgetIdx = findIndex(["budget", "price", "cost", "egp"]);
        const interestIdx = findIndex(["interest", "compound", "project", "location", "area"]);
        const notesIdx = findIndex(["notes", "details", "requirements", "description", "comment"]);

        if (nameIdx === -1 || phoneIdx === -1) {
          setImportStatusMsg("Error: Could not find Name or Phone columns.");
          setImportStatusType("error");
          return;
        }

        const dataRows = rawMatrix.slice(headerIdx + 1);
        let count = 0;

        for (const row of dataRows) {
          if (!row || row.length === 0) continue;
          const name = String(row[nameIdx] || "").trim();
          const phone = String(row[phoneIdx] || "").trim();
          if (!name || !phone) continue;

          const budgetVal = budgetIdx !== -1 ? parseFloat(String(row[budgetIdx])) : 10;
          const budget = isNaN(budgetVal) ? 10 : budgetVal;
          const interest = interestIdx !== -1 ? String(row[interestIdx] || "").trim() : "";
          const notes = notesIdx !== -1 ? String(row[notesIdx] || "").trim() : "";

          addLead({
            name,
            phone,
            budget,
            interest,
            notes,
            stage: "new"
          });
          count++;
        }

        if (count > 0) {
          setTimeout(() => {
            const updatedLeads = useStore.getState().leads;
            const newlyAddedIds = updatedLeads.slice(0, count).map(l => l.id);
            setSelectedLeads(prev => {
              const unique = new Set([...prev, ...newlyAddedIds]);
              return Array.from(unique);
            });
            setImportStatusMsg(`Successfully imported and selected ${count} clients.`);
            setImportStatusType("success");
            setShowImportForm(false);
          }, 50);
        } else {
          setImportStatusMsg("No clients with Name & Phone found.");
          setImportStatusType("error");
        }
      } catch (err: any) {
        setImportStatusMsg(`Error: ${err.message}`);
        setImportStatusType("error");
      }
    };
    reader.readAsBinaryString(file);
  };

  const adjustTextTone = (tone: "professional" | "friendly" | "urgent" | "emojis") => {
    let text = templateText;
    
    if (tone === "professional") {
      text = text
        .replace(/^(hello|hi|dear|greetings|good day)[^\n]*/gi, "Dear {name},")
        .replace(/(best regards|warmly|best|sincerely|cheers)[^\n]*$/gi, "Kind regards,\n{broker_name}");
      if (!text.includes("Kind regards")) {
        text += "\n\nKind regards,\n{broker_name}";
      }
    } else if (tone === "friendly") {
      const greetingMatch = text.match(/^(hello|hi|dear|greetings|good day)[^\n]*/i);
      const insertStr = "\n\nHope you're having a wonderful week!";
      if (greetingMatch) {
        const endOfGreetingIdx = text.indexOf("\n", greetingMatch.index);
        if (endOfGreetingIdx !== -1) {
          text = text.slice(0, endOfGreetingIdx) + insertStr + text.slice(endOfGreetingIdx);
        } else {
          text = text + insertStr;
        }
      } else {
        text = "Hello {name}," + insertStr + "\n\n" + text;
      }
    } else if (tone === "urgent") {
      if (!text.includes("🚨")) {
        text = "🚨 LIMITED TIME OPPORTUNITY:\n\n" + text;
      }
      const lines = text.split("\n");
      const signoffIdx = lines.findIndex(l => /best regards|warmly|best|sincerely|cheers|kind regards/i.test(l));
      const urgentCall = "Note: Premium units are in extremely high demand and sell fast. Let me know ASAP if you'd like me to hold or book a unit.";
      if (signoffIdx !== -1) {
        lines.splice(signoffIdx, 0, urgentCall, "");
        text = lines.join("\n");
      } else {
        text += `\n\n${urgentCall}`;
      }
    } else if (tone === "emojis") {
      const replacements: [RegExp, string][] = [
        [/beachfront|sea|coast/gi, "🏖️ beachfront"],
        [/villa|villas|townhouse/gi, "🏡 villa"],
        [/unit|units|apartment/gi, "🔑 unit"],
        [/installment|installments|down payment/gi, "💰 installments"],
        [/exclusive|vip/gi, "✨ exclusive"],
        [/budget/gi, "📈 budget"],
        [/broker|me/gi, "📞 me"],
        [/sahel|zayed/gi, "📍 sahel/zayed"]
      ];
      replacements.forEach(([regex, emojiText]) => {
        text = text.replace(regex, emojiText);
      });
    }

    setTemplateText(text);
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

              {/* Add Client / Import Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setShowAddClientForm(prev => !prev);
                    setShowImportForm(false);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                    showAddClientForm 
                      ? "bg-emerald-500 text-white border-emerald-500" 
                      : "bg-secondary text-primary hover:bg-secondary/80 border-border/40"
                  }`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Client
                </button>
                <button
                  onClick={() => {
                    setShowImportForm(prev => !prev);
                    setShowAddClientForm(false);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                    showImportForm 
                      ? "bg-emerald-500 text-white border-emerald-500" 
                      : "bg-secondary text-primary hover:bg-secondary/80 border-border/40"
                  }`}
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Import Sheet
                </button>
              </div>

              {/* Import status message */}
              {importStatusMsg && (
                <div className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 animate-in fade-in duration-200 ${
                  importStatusType === "success" 
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                    : importStatusType === "error"
                      ? "bg-red-500/10 text-red-600 border-red-500/20"
                      : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                }`}>
                  {importStatusType === "success" ? (
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : importStatusType === "error" ? (
                    <X className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  ) : (
                    <Clock className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                  )}
                  <span>{importStatusMsg}</span>
                </div>
              )}

              {/* Add Client Collapsible Form */}
              {showAddClientForm && (
                <form onSubmit={handleSingleClientSubmit} className="space-y-3 bg-secondary/30 border border-border/60 p-4 rounded-2xl animate-in slide-in-from-top-4 duration-200">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                    <Plus className="h-3.5 w-3.5 text-emerald-500" /> Add Client Profile
                  </h4>
                  <div className="space-y-2">
                    <Input
                      required
                      placeholder="Client Name *"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="bg-background rounded-xl text-xs h-9 border-border/60"
                    />
                    <Input
                      required
                      placeholder="Phone (e.g. +20100...) *"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      className="bg-background rounded-xl text-xs h-9 border-border/60"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Budget (EGP M)"
                        value={newClientBudget}
                        onChange={(e) => setNewClientBudget(e.target.value)}
                        className="bg-background rounded-xl text-xs h-9 border-border/60"
                      />
                      <Input
                        placeholder="Interest slug"
                        value={newClientInterest}
                        onChange={(e) => setNewClientInterest(e.target.value)}
                        className="bg-background rounded-xl text-xs h-9 border-border/60"
                      />
                    </div>
                    <Input
                      placeholder="Notes (Timeline, requirements)"
                      value={newClientNotes}
                      onChange={(e) => setNewClientNotes(e.target.value)}
                      className="bg-background rounded-xl text-xs h-9 border-border/60"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddClientForm(false)}
                      className="rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-secondary transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold hover:bg-emerald-600 transition-all shadow-xs"
                    >
                      Add & Select
                    </button>
                  </div>
                </form>
              )}

              {/* Import Excel/CSV Collapsible Form */}
              {showImportForm && (
                <div className="space-y-3 bg-secondary/30 border border-border/60 p-4 rounded-2xl animate-in slide-in-from-top-4 duration-200">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" /> Import Client List
                  </h4>
                  
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl bg-background border border-dashed border-emerald-500/40 hover:border-emerald-500 p-4 text-center cursor-pointer transition-all shadow-2xs">
                    <Upload className="h-6 w-6 text-emerald-500" />
                    <span className="font-bold text-xs text-primary">Upload Spreadsheet</span>
                    <span className="text-[9px] text-muted-foreground leading-tight">Supports Excel (.xlsx, .xls) and CSV. Columns must include: Name, Phone</span>
                    <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleSheetImport} />
                  </label>
                  
                  <div className="bg-background/60 p-2.5 rounded-xl border border-border/40 text-[9px] text-muted-foreground space-y-1">
                    <span className="font-bold text-primary block uppercase">Auto-detected Columns</span>
                    <div>• Name column: <span className="font-semibold">name, client, fullname</span></div>
                    <div>• Phone column: <span className="font-semibold">phone, mobile, tel, contact</span></div>
                    <div>• Extra columns: <span className="font-semibold">budget, interest, notes</span></div>
                  </div>
                </div>
              )}

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
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">2</span>
                  Compose Message & Media
                </h3>
                <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Auto-saved
                </span>
              </div>

              {/* Quick Template Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Campaign Templates</span>
                <div className="flex flex-wrap gap-1.5">
                  {defaultCampaignTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTemplateText(t.body);
                        if (t.mediaUrl) setSelectedMediaUrl(t.mediaUrl);
                      }}
                      className="rounded-xl border border-border/80 bg-background/50 hover:bg-emerald-500/5 hover:border-emerald-500/60 px-3 py-1.5 text-xs font-semibold text-primary transition-all cursor-pointer"
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Picture Upload & Attachment Box */}
              <div className="rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-emerald-600" /> Attached Photo / brochure link
                  </span>
                  {selectedMediaUrl && (
                    <button onClick={() => setSelectedMediaUrl("")} className="text-[10px] font-bold text-red-500 hover:underline">
                      Remove media
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-card border border-border hover:border-emerald-500 px-3 py-2 text-xs font-bold text-primary cursor-pointer transition-all shadow-2xs">
                    <Upload className="h-4 w-4 text-emerald-600" />
                    <span>Upload image from device</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
                  </label>
                  
                  <Input
                    placeholder="Or paste media URL..."
                    value={selectedMediaUrl.startsWith("data:") ? "" : selectedMediaUrl}
                    onChange={(e) => setSelectedMediaUrl(e.target.value)}
                    className="flex-1 bg-card rounded-xl text-xs h-9 border-border/60"
                  />
                </div>
              </div>

              {/* The Ultimate Writing Workspace */}
              <div className="space-y-2">
                {/* Formatting & variable bar */}
                <div className="flex items-center justify-between border border-border/60 bg-secondary/25 p-2 rounded-t-xl -mb-2 border-b-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase mr-1.5">Tags:</span>
                    {[
                      { label: "Name", ph: "{name}" },
                      { label: "Interest", ph: "{interest}" },
                      { label: "Budget", ph: "{budget}" },
                      { label: "Broker", ph: "{broker_name}" },
                    ].map(ph => (
                      <button
                        key={ph.ph}
                        onClick={() => insertPlaceholder(ph.ph)}
                        className="rounded-lg bg-background hover:bg-emerald-500/10 hover:text-emerald-600 border border-border/40 px-2 py-1 text-[10px] font-semibold text-primary transition-all flex items-center gap-0.5"
                      >
                        <Plus className="h-2.5 w-2.5" />
                        {ph.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setTemplateText("")}
                      title="Clear text"
                      className="p-1 rounded-lg hover:bg-red-500/15 hover:text-red-500 text-muted-foreground transition-all cursor-pointer"
                    >
                      <Eraser className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setTemplateText(defaultCampaignTemplates[0].body)}
                      title="Reset to default template"
                      className="p-1 rounded-lg hover:bg-secondary text-muted-foreground transition-all cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Textarea container with focus ring */}
                <div className="relative group border border-border/60 rounded-b-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all overflow-hidden bg-background">
                  <textarea
                    value={templateText}
                    onChange={(e) => setTemplateText(e.target.value)}
                    rows={7}
                    className="w-full bg-transparent px-3.5 py-3 text-xs text-primary focus:outline-none resize-none leading-relaxed min-h-[170px]"
                    placeholder="Write your broadcast message copy here..."
                  />

                  {/* Writing area footer metrics */}
                  <div className="flex justify-between items-center border-t border-border/30 px-3 py-1.5 bg-secondary/10 text-[9px] text-muted-foreground font-semibold">
                    <div className="flex items-center gap-2">
                      <span>{templateText.length} characters</span>
                      <span>•</span>
                      <span>{Math.ceil(templateText.length / 160)} message unit(s)</span>
                    </div>

                    {/* Syntax checker badge */}
                    {templateText.includes("{") && !templateText.includes("}") ? (
                      <span className="text-amber-500 flex items-center gap-0.5">⚠️ Unclosed tag</span>
                    ) : (
                      <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                        <Check className="h-3 w-3 stroke-[3]" /> Tags validated
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tone Optimizer Bar (Sparkles!) */}
              <div className="bg-gradient-to-r from-emerald-500/5 to-accent/5 border border-emerald-500/20 p-3 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" /> Message Enhancer Tone Presets
                </span>
                
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => adjustTextTone("professional")}
                    className="rounded-lg bg-background hover:bg-emerald-500/10 text-[10px] font-semibold text-primary hover:text-emerald-600 border border-border/40 py-1.5 px-1.5 transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  >
                    👔 Formal
                  </button>
                  <button
                    onClick={() => adjustTextTone("friendly")}
                    className="rounded-lg bg-background hover:bg-emerald-500/10 text-[10px] font-semibold text-primary hover:text-emerald-600 border border-border/40 py-1.5 px-1.5 transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  >
                    🤝 Friendly
                  </button>
                  <button
                    onClick={() => adjustTextTone("urgent")}
                    className="rounded-lg bg-background hover:bg-emerald-500/10 text-[10px] font-semibold text-primary hover:text-emerald-600 border border-border/40 py-1.5 px-1.5 transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  >
                    ⏰ Urgent
                  </button>
                  <button
                    onClick={() => adjustTextTone("emojis")}
                    className="rounded-lg bg-background hover:bg-emerald-500/10 text-[10px] font-semibold text-primary hover:text-emerald-600 border border-border/40 py-1.5 px-1.5 transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  >
                    ✨ Emojis
                  </button>
                </div>
              </div>

              <Button
                onClick={handleStartCampaign}
                disabled={selectedLeads.length === 0}
                className="w-full rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 py-3 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
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
