import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useDebounce } from "@/lib/useDebounce";
import { useState, useRef, useMemo } from "react";
import { compounds } from "@/data/compounds";
import mediaRegistry from "@/data/media-registry.json";
import { 
  Target, 
  TrendingUp, 
  Users, 
  FileText, 
  CheckSquare, 
  Notebook, 
  Compass, 
  Plus, 
  Check, 
  Trash2, 
  Search, 
  Download,
  Calendar,
  Video,
  MessageSquare,
  Sparkles,
  X,
  FileVideo,
  Image as ImageIcon,
  ExternalLink,
  Laptop,
  Share2,
  Eye,
  Flame,
  MapPin,
  Activity,
  Trophy,
  ArrowUpRight,
  Star,
  PhoneCall,
  Heart,
  BarChart3,
  Zap
} from "lucide-react";
import {
  computeProjectScores,
  computeTrendingAreas,
  computeTopDeals,
  computeMarketPulse,
  topProjectsByScore
} from "@/lib/analytics";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

// Default static documents
const defaultDocuments = [
  { name: "Fact Sheet V-Levels and V-Residence", type: "pdf", category: "Dunes (V-Levels)", file: "Fact Sheet V-Levels and V-Residence.pdf", path: "/profiles/Fact Sheet V-Levels and V-Residence.pdf" },
  { name: "Factsheet Commonhaus", type: "pdf", category: "Upwyde (Commonhaus)", file: "Factsheet Commonhaus.pdf", path: "/profiles/Factsheet Commonhaus.pdf" },
  { name: "Azha North Available Units", type: "pdf", category: "Madaar", file: "Azha North Available Units Data_1.pdf", path: "/profiles/Azha North Available Units Data_1_text.txt" },
  { name: "The Hillage Available Units", type: "pdf", category: "Madaar", file: "The Hillage Available Units by azha.pdf", path: "/profiles/The Hillage Available Units by azha_text.txt" },
  { name: "North Coast FACTSHEET sodic (June-2026)", type: "pdf", category: "SODIC", file: "North Coast FACTSHEET sodic (June-2026).pdf", path: "/profiles/sodic.pdf" },
  { name: "VYE Sodic unit 303 Offer Details", type: "pdf", category: "SODIC", file: "VYE-VYE02-B06-303-Offer by sodic.pdf", path: "/profiles/sodic.pdf" },
  { name: "Ora - Availability & Masterplans", type: "pdf", category: "Ora Developers", file: "Ora - Availability + Masterplans + Payment Plans.pdf", path: "/profiles/ora-developers.pdf" }
];

function DashboardOverview() {
  const favorites = useStore((s) => s.favorites);
  const leads = useStore((s) => s.leads);
  const agentNotes = useStore((s) => s.agentNotes);
  const agentTasks = useStore((s) => s.agentTasks);
  const salesTarget = useStore((s) => s.salesTarget);
  const user = useStore((s) => s.user);
  const isAdmin = user?.email?.toLowerCase() === "elsayedshoeip70@gmail.com";
  const analyticsEvents = useStore((s) => s.analyticsEvents);
  const compoundsList = useStore((s) => s.compoundsList);
  const trackEvent = useStore((s) => s.trackEvent);
  
  const updateNotes = useStore((s) => s.updateNotes);
  const setSalesTarget = useStore((s) => s.setSalesTarget);
  const addTask = useStore((s) => s.addTask);
  const toggleTask = useStore((s) => s.toggleTask);
  const deleteTask = useStore((s) => s.deleteTask);

  const customBrochures = useStore((s) => s.customBrochures) || [];
  const customProfiles = useStore((s) => s.customProfiles) || [];
  const addCustomBrochure = useStore((s) => s.addCustomBrochure);
  const addCustomProfile = useStore((s) => s.addCustomProfile);

  const router = useRouter();

  const [newTaskText, setNewTaskText] = useState("");
  const [docSearch, setDocSearch] = useState("");
  const debouncedDocSearch = useDebounce(docSearch, 250);
  const [activeTab, setActiveTab] = useState("Documents");
  const [globalSearch, setGlobalSearch] = useState("");
  const debouncedGlobalSearch = useDebounce(globalSearch, 250);
  
  // Media search state
  const [selectedMediaProject, setSelectedMediaProject] = useState("");

  // Asset creation modals
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Brochure form states
  const [brochureName, setBrochureName] = useState("");
  const [brochureCategory, setBrochureCategory] = useState("");
  const [brochureFile, setBrochureFile] = useState<File | null>(null);

  // Profile form states
  const [profileName, setProfileName] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const brochureInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleBrochureFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBrochureFile(file);
      // Clean filename for prefill
      const clean = file.name.replace(/\.pdf$/i, "").replace(/[\-_]/g, " ").trim();
      setBrochureName(clean);
      // Try to guess a category from compounds
      const guessed = compounds.find(c => clean.toLowerCase().includes(c.slug.replace("-", " ")) || clean.toLowerCase().includes(c.name.toLowerCase()));
      setBrochureCategory(guessed ? guessed.name : "");
      setShowBrochureModal(true);
    }
  };

  const handleProfileFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      // Clean name for prefill
      const clean = file.name.replace(/\.pdf$/i, "").replace(/Company Profile/i, "").replace(/[\-_]/g, " ").trim();
      setProfileName(clean);
      setShowProfileModal(true);
    }
  };

  // PDF Preview states
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewPdfTitle, setPreviewPdfTitle] = useState("");

  const handlePreviewPdf = (pdfPath: string, title: string) => {
    setPreviewPdfTitle(title);
    if (pdfPath.startsWith("data:application/pdf;base64,")) {
      // Decode base64 to binary and create Blob URL
      try {
        const base64Data = pdfPath.replace(/^data:application\/pdf;base64,/, "");
        const sliceSize = 512;
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        setPreviewPdfUrl(blobUrl);
      } catch (err) {
        console.error("Failed to decode base64 PDF:", err);
        // Fallback directly
        setPreviewPdfUrl(pdfPath);
      }
    } else {
      setPreviewPdfUrl(pdfPath);
    }
  };

  // Calculate stats
  const openLeads = leads.filter((l) => l.stage !== "closed").length;
  const totalPipeline = leads.reduce((s, l) => s + l.budget, 0);
  const closedSalesVolume = leads.filter((l) => l.stage === "closed").reduce((s, l) => s + l.budget, 0);

  // SVG Progress Ring calculations
  const targetVal = salesTarget || 50;
  const progressPercent = Math.min(100, Math.round((closedSalesVolume / targetVal) * 100));
  
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progressPercent / 100) * circumference;

  // ── Analytics Intelligence Engine ────────────────────────────────────────
  const allCompounds = compoundsList.length > 0 ? compoundsList : compounds;

  const projectScores = useMemo(
    () => computeProjectScores(analyticsEvents, allCompounds, favorites),
    [analyticsEvents, allCompounds, favorites]
  );

  const topViewed = useMemo(
    () => topProjectsByScore(projectScores, allCompounds, 5),
    [projectScores, allCompounds]
  );

  const trendingAreas = useMemo(
    () => computeTrendingAreas(analyticsEvents, allCompounds).slice(0, 6),
    [analyticsEvents, allCompounds]
  );

  const topDeals = useMemo(
    () => computeTopDeals(analyticsEvents, allCompounds, favorites, 3),
    [analyticsEvents, allCompounds, favorites]
  );

  const marketPulse = useMemo(
    () => computeMarketPulse(analyticsEvents, allCompounds).slice(0, 8),
    [analyticsEvents, allCompounds]
  );

  const totalEvents = analyticsEvents.length;
  const recentEvents = analyticsEvents.filter(e => Date.now() - e.timestamp < 72 * 3600000).length;


  // Compile full document list: default docs + scanned brochures + custom brochures
  const scannedDocs = (mediaRegistry.brochures || []).map(b => ({
    name: b.clean_name,
    type: "pdf",
    category: "Synced Brochure",
    file: b.filename,
    path: b.path
  }));
  
  const allDocs = [...defaultDocuments, ...scannedDocs, ...customBrochures];

  const filteredDocs = allDocs.filter(d => 
    d.name.toLowerCase().includes(debouncedDocSearch.toLowerCase()) || 
    d.category.toLowerCase().includes(debouncedDocSearch.toLowerCase())
  );

  const handleAddBrochureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brochureName || !brochureCategory || !brochureFile) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      
      // Call backend API to write to physical directory D:\map12\public\brochures
      try {
        const formData = new FormData();
        formData.append("file", brochureFile);
        formData.append("type", "brochure");
        formData.append("fileName", brochureFile.name);

        await fetch("/api/upload-asset", {
          method: "POST",
          body: formData
        });
      } catch (err) {
        console.error("Backend file write failed:", err);
      }

      addCustomBrochure({
        name: brochureName,
        type: "pdf",
        category: brochureCategory,
        file: brochureFile.name,
        path: base64,
        size_mb: Number((brochureFile.size / (1024 * 1024)).toFixed(2))
      });
      setBrochureName("");
      setBrochureCategory("");
      setBrochureFile(null);
      setShowBrochureModal(false);
    };
    reader.readAsDataURL(brochureFile);
  };

  const handleAddProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profileFile) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;

      // Call backend API to write to physical directory D:\map12\public\profiles
      try {
        const formData = new FormData();
        formData.append("file", profileFile);
        formData.append("type", "profile");
        formData.append("fileName", profileFile.name);

        await fetch("/api/upload-asset", {
          method: "POST",
          body: formData
        });
      } catch (err) {
        console.error("Backend file write failed:", err);
      }

      addCustomProfile({
        clean_name: profileName,
        filename: profileFile.name,
        path: base64,
        size_mb: Number((profileFile.size / (1024 * 1024)).toFixed(2))
      });
      setProfileName("");
      setProfileFile(null);
      setShowProfileModal(false);
    };
    reader.readAsDataURL(profileFile);
  };

  // Selected media list from selected project folder
  const currentProjectMedia = selectedMediaProject ? (mediaRegistry.projects_media as any)[selectedMediaProject] || [] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
      
      {/* Workspace Greeting & Subheader */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Compass className="h-7 w-7 text-accent" /> Agent Notion Workspace
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            A comprehensive, offline-ready central command center for real estate professionals.
          </p>
        </div>
        
        {/* Google / Gmail Account Status & Connectors */}
        <div className="flex flex-wrap items-center gap-3">
          {user ? (
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-3 py-1.5 text-xs flex items-center gap-2">
              <Laptop className="h-4 w-4 text-blue-500" />
              <div className="text-left">
                <div className="font-semibold text-primary">Google Sync Active</div>
                <div className="text-[10px] text-muted-foreground">{user.email}</div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
              Google Account Disconnected
            </div>
          )}

          <div className="flex items-center gap-2 rounded-xl bg-card border border-border/60 p-1.5 shadow-sm">
            <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" 
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/25 transition-colors" title="Google Calendar">
              <Calendar className="h-4 w-4" />
            </a>
            <a href="https://meet.google.com" target="_blank" rel="noopener noreferrer" 
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/25 transition-colors" title="Google Meet">
              <Video className="h-4 w-4" />
            </a>
            <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer" 
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/25 transition-colors" title="WhatsApp Web">
              <MessageSquare className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Global Real Estate search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Global Search Engine — type any unit type, project, price, or developer (e.g. Marassi chalet, Sodic, 12M)..."
          value={globalSearch}
          onChange={(e) => {
            setGlobalSearch(e.target.value);
            // Track search for analytics (debounce-like: only emit if 3+ chars)
            if (e.target.value.length >= 3) {
              trackEvent({ type: "search", query: e.target.value });
            }
          }}
          className="w-full rounded-2xl border border-border/80 bg-card pl-12 pr-4 py-3.5 text-sm text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none shadow-sm transition-all"
        />
        {globalSearch.length > 0 && (
          <button onClick={() => setGlobalSearch("")} className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Global Search Results list */}
      {debouncedGlobalSearch.length > 0 && (
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-accent/15 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Matched Compounds & Units
            </span>
            <span className="text-xs text-muted-foreground">Showing top matches</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {compounds.filter(c => {
              const q = debouncedGlobalSearch.toLowerCase();
              return c.name.toLowerCase().includes(q) ||
                     c.developer.toLowerCase().includes(q) ||
                     c.destination.toLowerCase().includes(q) ||
                     c.types.some(t => t.toLowerCase().includes(q)) ||
                     (c.priceFrom && String(c.priceFrom).includes(q));
            }).slice(0, 6).map(match => (
              <div key={match.slug} className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between h-36 hover:border-accent/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{match.developer}</span>
                    <span className="text-[10px] font-bold text-accent uppercase">{match.destination}</span>
                  </div>
                  <h4 className="font-display font-bold text-primary text-sm mt-1">{match.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.types.map(t => (
                      <span key={t} className="rounded bg-secondary/50 px-1.5 py-0.5 text-[8px] font-bold text-muted-foreground uppercase">{t}</span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-border/40 pt-2.5 mt-2">
                  <span className="font-bold text-primary text-xs">EGP {match.priceFrom}M+</span>
                  <div className="flex gap-2">
                    <Link to="/projects/$slug" params={{ slug: match.slug }} className="text-[10px] font-bold text-accent hover:underline">Details →</Link>
                  </div>
                </div>
              </div>
            ))}
            {compounds.filter(c => {
              const q = debouncedGlobalSearch.toLowerCase();
              return c.name.toLowerCase().includes(q) ||
                     c.developer.toLowerCase().includes(q) ||
                     c.destination.toLowerCase().includes(q) ||
                     c.types.some(t => t.toLowerCase().includes(q)) ||
                     (c.priceFrom && String(c.priceFrom).includes(q));
            }).length === 0 && (
              <div className="col-span-full py-6 text-center text-xs text-muted-foreground italic">No matching projects or units found.</div>
            )}
          </div>
        </div>
      )}


      {/* ═══════════════════════════════════════════════════════
          INSIGHT INTELLIGENCE DASHBOARD (ADMIN ONLY)
      ═══════════════════════════════════════════════════════ */}
      
      {isAdmin && (
        <>
          {/* Intelligence Status Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-r from-accent/10 via-accent/5 to-purple-500/10 px-6 py-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent pointer-events-none" />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-lg shadow-accent/30">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-primary flex items-center gap-1.5">
                    Intelligence Center <span className="text-[10px] font-bold tracking-widest uppercase text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">Live</span>
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {totalEvents > 0
                      ? `Analyzing ${totalEvents} tracked interactions · ${recentEvents} in the last 72h`
                      : "Start browsing projects to unlock real-time market insights"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="rounded-xl border border-border/60 bg-card/80 px-3 py-1.5 text-center">
                  <div className="text-xs font-extrabold text-primary">{topViewed.filter(p => p.score > 0).length}</div>
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Active Projects</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/80 px-3 py-1.5 text-center">
                  <div className="text-xs font-extrabold text-primary">{trendingAreas.filter(a => a.score > 0).length}</div>
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Trending Areas</div>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-center">
                  <div className="text-xs font-extrabold text-amber-400">{topDeals.filter(d => d.totalScore > 0).length}</div>
                  <div className="text-[9px] uppercase tracking-wider text-amber-400/70 font-semibold">Top Deals</div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 1: Most Viewed + Top 3 Deals */}
          <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">

            {/* Most Viewed Projects */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold text-primary">Most Viewed Projects</h2>
                    <p className="text-[10px] text-muted-foreground">Score = Views ×1 + Saves ×3 + Calls ×7 + Business value</p>
                  </div>
                </div>
                <Link to="/projects" search={{ destination: "", dev: "", q: "" }} className="text-[10px] font-bold text-accent hover:underline flex items-center gap-0.5">
                  All <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              {topViewed.length === 0 || topViewed.every(p => p.score === 0) ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-primary">No activity yet</p>
                  <p className="text-xs text-muted-foreground max-w-xs">Browse project pages to track views. Every page visit, save, and call gets scored automatically.</p>
                  <Link to="/projects" search={{ destination: "", dev: "", q: "" }} className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-accent text-accent-foreground px-4 py-2 text-xs font-bold hover:bg-accent/90 transition-all">
                    <ArrowUpRight className="h-3.5 w-3.5" /> Explore Projects
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {topViewed.map(({ compound: c, score }, i) => {
                    const maxScore = topViewed[0]?.score || 1;
                    const pct = Math.round((score / maxScore) * 100);
                    const rankColors = ["text-amber-400", "text-slate-400", "text-orange-600", "text-muted-foreground", "text-muted-foreground"];
                    const barColors = ["bg-gradient-to-r from-amber-400/80 to-amber-500", "bg-gradient-to-r from-blue-400/80 to-blue-500", "bg-gradient-to-r from-purple-400/80 to-purple-500", "bg-gradient-to-r from-green-400/80 to-green-500", "bg-gradient-to-r from-rose-400/80 to-rose-500"];
                    
                    return (
                      <Link key={c.slug} to="/projects/$slug" params={{ slug: c.slug }} className="flex items-center gap-4 rounded-xl border border-border/40 bg-secondary/10 p-3.5 hover:border-accent/40 hover:bg-secondary/30 transition-all group">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black ${rankColors[i]} ${i === 0 ? "bg-amber-500/10" : "bg-secondary/50"}`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-primary truncate">{c.name}</span>
                            <span className="text-[10px] font-black text-primary shrink-0">{Math.round(score)} pts</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="h-2.5 w-2.5 shrink-0" />{c.destination} · {c.developer}
                          </div>
                          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary/50 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ${barColors[i]}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent shrink-0 transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top 3 Deals */}
            <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-b from-amber-500/5 to-card p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-amber-500/20 pb-4 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-primary">Top 3 Deals</h2>
                  <p className="text-[10px] text-muted-foreground">Engagement + Business value score</p>
                </div>
              </div>

              {topDeals.every(d => d.totalScore === 0) ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                  <Trophy className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">Track interactions to see top deals ranked automatically</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topDeals.map(({ compound: c, engagementScore, businessScore, totalScore, tags }, i) => (
                    <Link key={c.slug} to="/projects/$slug" params={{ slug: c.slug }}
                      className="block rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-black ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-400" : "text-orange-600"}`}>
                              #{i + 1}
                            </span>
                            <span className="text-xs font-bold text-primary truncate">{c.name}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{c.destination}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-black text-amber-400">{Math.round(totalScore)}</div>
                          <div className="text-[9px] text-muted-foreground">score</div>
                        </div>
                      </div>
                      
                      {/* Score breakdown */}
                      <div className="mt-2 flex items-center gap-2 text-[9px] font-semibold text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Activity className="h-2.5 w-2.5" />{Math.round(engagementScore)} eng</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5" />{Math.round(businessScore)} biz</span>
                      </div>

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tags.slice(0, 3).map(tag => (
                            <span key={tag} className="rounded-full bg-accent/10 border border-accent/20 px-1.5 py-0.5 text-[8px] font-bold text-accent">{tag}</span>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-2 flex items-center justify-between border-t border-amber-500/15 pt-2">
                        <span className="text-[10px] font-bold text-muted-foreground">EGP {c.priceFrom}M+</span>
                        <span className="text-[9px] font-bold text-accent group-hover:underline flex items-center gap-0.5">View <ArrowUpRight className="h-2.5 w-2.5" /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Trending Areas + Market Pulse */}
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Trending Areas */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-border/40 pb-4 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-primary">Trending Areas</h2>
                  <p className="text-[10px] text-muted-foreground">Searches ×2 + Views ×1 + Saves ×3 (weighted 72h)</p>
                </div>
              </div>

              {trendingAreas.every(a => a.score === 0) ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                  <MapPin className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">Search for areas or view projects to build area trend data</p>
                  <Link to="/projects" search={{ destination: "", dev: "", q: "" }} className="mt-1 text-[10px] text-accent hover:underline font-bold">Explore Areas →</Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {trendingAreas.map((area, i) => {
                    const maxScore = trendingAreas[0]?.score || 1;
                    const pct = Math.round((area.score / maxScore) * 100);
                    const isHot = area.score > maxScore * 0.7;
                    
                    return (
                      <div key={area.area} className="flex items-center gap-3 rounded-xl border border-border/30 bg-secondary/10 p-3 hover:bg-secondary/20 transition-all">
                        <div className="shrink-0">
                          {isHot ? (
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-500">
                              <Flame className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground text-xs font-bold">
                              {i + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <Link to="/projects" search={{ destination: area.area, dev: "", q: "" }} className="text-xs font-bold text-primary hover:text-accent truncate transition-colors">
                              {area.area}
                            </Link>
                            <div className="flex items-center gap-2 shrink-0 text-[9px] text-muted-foreground font-semibold">
                              <span className="flex items-center gap-0.5"><Search className="h-2.5 w-2.5" />{Math.round(area.searchCount)}</span>
                              <span className="flex items-center gap-0.5"><Eye className="h-2.5 w-2.5" />{Math.round(area.viewCount)}</span>
                              <span className="flex items-center gap-0.5"><Heart className="h-2.5 w-2.5" />{Math.round(area.saveCount)}</span>
                            </div>
                          </div>
                          <div className="mt-1.5 h-1 w-full rounded-full bg-secondary/50 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${isHot ? "bg-gradient-to-r from-rose-400 to-rose-600" : "bg-gradient-to-r from-blue-400 to-blue-600"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Market Pulse */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-border/40 pb-4 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-primary">Market Pulse</h2>
                  <p className="text-[10px] text-muted-foreground">Area performance — Avg price, projects, momentum</p>
                </div>
              </div>

              {marketPulse.every(m => m.trendScore === 0) ? (
                <div className="space-y-2">
                  {/* Static fallback showing all areas by project count */}
                  {(() => {
                    const areaData: Record<string, { prices: number[]; count: number }> = {};
                    for (const c of allCompounds) {
                      if (!c.destination) continue;
                      if (!areaData[c.destination]) areaData[c.destination] = { prices: [], count: 0 };
                      if (c.priceFrom) areaData[c.destination].prices.push(c.priceFrom);
                      areaData[c.destination].count++;
                    }
                    return Object.entries(areaData)
                      .sort((a, b) => b[1].count - a[1].count)
                      .slice(0, 6)
                      .map(([area, d]) => {
                        const avg = d.prices.reduce((a, b) => a + b, 0) / (d.prices.length || 1);
                        return (
                          <div key={area} className="flex items-center justify-between rounded-xl border border-border/30 bg-secondary/10 p-2.5">
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-primary truncate">{area}</div>
                              <div className="text-[9px] text-muted-foreground">{d.count} projects · avg EGP {avg.toFixed(1)}M</div>
                            </div>
                            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold text-muted-foreground">—</span>
                          </div>
                        );
                      });
                  })()}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {marketPulse.map(entry => {
                    const momentumConfig = {
                      rising: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "↑ Rising", dot: "bg-emerald-400" },
                      stable: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", label: "→ Stable", dot: "bg-blue-400" },
                      cooling: { color: "text-slate-400", bg: "bg-secondary/50 border-border/30", label: "↓ Cooling", dot: "bg-slate-400" },
                    }[entry.momentum];
                    
                    return (
                      <div key={entry.area} className="flex items-center justify-between rounded-xl border border-border/30 bg-secondary/10 p-3 hover:bg-secondary/20 transition-all">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${momentumConfig.dot} shrink-0`} />
                            <Link to="/projects" search={{ destination: entry.area, dev: "", q: "" }} className="text-xs font-bold text-primary hover:text-accent truncate transition-colors">
                              {entry.area}
                            </Link>
                          </div>
                          <div className="text-[9px] text-muted-foreground mt-0.5 pl-3.5">
                            {entry.projectCount} projects · avg EGP {entry.avgPrice.toFixed(1)}M
                          </div>
                        </div>
                        <div className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${momentumConfig.color} ${momentumConfig.bg}`}>
                          {momentumConfig.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Main Workspace Checklist Grid */}
      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Notebook className="h-5 w-5 text-accent" />
            <h2 className="font-display text-lg font-semibold text-primary">Broker Scratchpad</h2>
          </div>
          <textarea
            value={agentNotes}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="Type notes, customer wishlists, copy-paste templates here... (Auto-saves instantly to offline storage)"
            className="w-full flex-1 mt-4 bg-transparent border-0 outline-none resize-none text-sm text-foreground/80 placeholder:text-muted-foreground focus:ring-0 leading-relaxed"
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3 justify-between">
            <span className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-accent" />
              <h2 className="font-display text-lg font-semibold text-primary">Daily Agenda Checklist</h2>
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {agentTasks.filter(t => t.completed).length}/{agentTasks.length} Done
            </span>
          </div>

          <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1">
            {agentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-secondary/20 p-2.5 hover:bg-secondary/40 transition-colors">
                <button onClick={() => toggleTask(task.id)} className="flex items-center gap-3 text-left min-w-0">
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    task.completed ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background"
                  }`}>
                    {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span className={`text-sm leading-none truncate ${task.completed ? "text-muted-foreground line-through" : "text-primary"}`}>
                    {task.text}
                  </span>
                </button>
                <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {agentTasks.length === 0 && (
              <div className="text-center py-10 text-sm text-muted-foreground">No tasks left! Add a task below to plan your day.</div>
            )}
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newTaskText.trim()) return;
            addTask(newTaskText);
            setNewTaskText("");
          }} className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Add new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="flex-1 rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <button type="submit" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground hover:bg-accent/80 transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Shared Document Library / Fact Sheet Previewer widget */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              <h2 className="font-display text-lg font-semibold text-primary">Marketing & Documents Library</h2>
            </span>
            
            {/* Library Category Tabs */}
            <div className="flex gap-1.5 rounded-lg bg-secondary/50 p-1 text-xs">
              {["Documents", "Developer Profiles", "Pictures & Videos"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                    activeTab === tab ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* Action buttons + search controls */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {activeTab === "Documents" && (
              <>
                <input
                  type="file"
                  ref={brochureInputRef}
                  accept="application/pdf"
                  onChange={handleBrochureFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => brochureInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 px-3 py-1.5 text-xs font-bold transition-all shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Brochure
                </button>
              </>
            )}
            
            {activeTab === "Developer Profiles" && (
              <>
                <input
                  type="file"
                  ref={profileInputRef}
                  accept="application/pdf"
                  onChange={handleProfileFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => profileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 px-3 py-1.5 text-xs font-bold transition-all shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Profile
                </button>
              </>
            )}

            {activeTab === "Documents" && (
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search fact sheets/inventories..."
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  className="w-full rounded-xl border border-border/60 bg-transparent pl-9 pr-4 py-1.5 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Tab 1: Documents list */}
        {activeTab === "Documents" && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[360px] overflow-y-auto pr-1">
            {filteredDocs.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-secondary/15 p-3 hover:border-accent/40 transition-all group">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-primary">{doc.name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-accent/10 px-1 py-0.5 text-[10px] font-medium text-accent">{doc.category}</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">{doc.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handlePreviewPdf(doc.path, doc.name)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all"
                    title="Preview PDF document inline"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={`https://web.whatsapp.com/send?text=${encodeURIComponent(`Check out this document: ${doc.name} (${doc.category}) — available in PropTrack broker library.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all"
                    title="Share via WhatsApp"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={doc.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border hover:border-accent hover:text-accent transition-all group-hover:scale-105"
                    title="Download File"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
            {filteredDocs.length === 0 && (
              <div className="col-span-full py-10 text-center text-sm text-muted-foreground">No documents found matching "{docSearch}"</div>
            )}
          </div>
        )}

        {/* Tab 2: Developer Profiles (scanned from public/profiles) */}
        {activeTab === "Developer Profiles" && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[360px] overflow-y-auto pr-1">
            {[...(mediaRegistry.profiles || []), ...customProfiles].map((dev, idx) => (
              <div key={idx} className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-2 hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">{dev.clean_name}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold">{dev.size_mb} MB</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Official PDF Company Profile</p>
                <div className="flex justify-between items-center pt-1 border-t border-border/20 mt-2 gap-2">
                  <span className="text-[9px] text-muted-foreground font-mono truncate max-w-[120px]">{dev.filename}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePreviewPdf(dev.path, dev.clean_name)}
                      className="inline-flex h-6 items-center gap-1 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white px-2 text-[9px] font-bold transition-all"
                      title="Preview PDF"
                    >
                      <Eye className="h-3 w-3" /> Preview
                    </button>
                    <a
                      href={`https://web.whatsapp.com/send?text=${encodeURIComponent(`Check out this developer company profile: ${dev.clean_name} — ${window?.location?.origin || 'https://proptrack.eg'}${dev.path}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-6 items-center gap-1 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white px-2 text-[9px] font-bold transition-all"
                      title="Share via WhatsApp"
                    >
                      <Share2 className="h-3 w-3" /> Share
                    </a>
                    <a href={dev.path} target="_blank" rel="noopener noreferrer" download className="inline-flex h-6 items-center gap-1 rounded-lg border border-border text-accent hover:border-accent px-2 text-[9px] font-bold transition-all">
                      <Download className="h-3 w-3" /> PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {[...(mediaRegistry.profiles || []), ...customProfiles].length === 0 && (
              <div className="col-span-full py-10 text-center text-sm text-muted-foreground">No developer profiles found. Add profiles to "D:\map12\public\profiles" to see them here.</div>
            )}
          </div>
        )}

        {/* Tab 3: Pictures & Videos (scanned from public/projects) */}
        {activeTab === "Pictures & Videos" && (
          <div className="space-y-6 mt-4">
            
            {/* Project Selection Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-primary shrink-0">Select Project Folder:</label>
              <select
                value={selectedMediaProject}
                onChange={(e) => setSelectedMediaProject(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-primary font-semibold focus:border-accent focus:outline-none max-w-xs"
              >
                <option value="">-- Choose project --</option>
                {Object.keys(mediaRegistry.projects_media || {}).sort().map(slug => {
                  const compObj = compounds.find(c => c.slug === slug);
                  return (
                    <option key={slug} value={slug}>{compObj ? compObj.name : slug}</option>
                  );
                })}
              </select>
            </div>

            {/* Media Gallery Grid */}
            {selectedMediaProject ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-h-[400px] overflow-y-auto pr-1">
                {currentProjectMedia.map((media: any, idx: number) => (
                  <div key={idx} className="rounded-xl border border-border bg-card overflow-hidden hover:border-accent/40 transition-all flex flex-col justify-between">
                    
                    {/* Media Display Area */}
                    <div className="bg-secondary/40 h-32 flex items-center justify-center overflow-hidden border-b border-border/40">
                      {media.type === "image" ? (
                        <img src={media.path} alt={media.filename} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <video src={media.path} controls className="w-full h-full object-contain bg-black" />
                      )}
                    </div>
                    
                    {/* Footer text */}
                    <div className="p-2.5">
                      <div className="text-[10px] font-bold text-primary truncate flex items-center gap-1">
                        {media.type === "image" ? <ImageIcon className="h-3 w-3 text-blue-500 shrink-0" /> : <FileVideo className="h-3 w-3 text-red-500 shrink-0" />}
                        <span className="truncate">{media.filename}</span>
                      </div>
                      <a href={media.path} target="_blank" rel="noopener noreferrer" className="mt-1.5 text-[9px] font-semibold text-accent hover:underline flex items-center gap-0.5 justify-end">
                        Open Full <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
                {currentProjectMedia.length === 0 && (
                  <div className="col-span-full py-10 text-center text-xs text-muted-foreground italic">No pictures or videos found in "public/projects/{selectedMediaProject}".</div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 p-10 text-center text-xs text-muted-foreground">
                Please select a project from the dropdown list to view all synchronized pictures and videos.
              </div>
            )}
            
          </div>
        )}

      </div>

      {/* Add Brochure Modal */}
      {showBrochureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
              <h3 className="font-display font-bold text-primary">Confirm Custom Brochure Details</h3>
              <button onClick={() => setShowBrochureModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddBrochureSubmit} className="space-y-4">
              <div className="bg-secondary/20 p-3.5 rounded-2xl border border-border/60">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Selected File</label>
                <div className="text-xs font-bold text-accent truncate mt-1">
                  {brochureFile ? brochureFile.name : "No file attached"}
                </div>
                {brochureFile && (
                  <div className="text-[9px] text-muted-foreground font-semibold mt-0.5">
                    {(brochureFile.size / (1024 * 1024)).toFixed(2)} MB PDF Document
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Brochure Title / Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Marassi Summer 2026 Factsheet"
                  value={brochureName}
                  onChange={(e) => setBrochureName(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Category / Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Emaar (Marassi)"
                  value={brochureCategory}
                  onChange={(e) => setBrochureCategory(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border/40 mt-4">
                <Button type="button" variant="ghost" onClick={() => setShowBrochureModal(false)}>Cancel</Button>
                <Button type="submit" className="rounded-xl">Add Brochure Asset</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
              <h3 className="font-display font-bold text-primary">Confirm Developer Profile Details</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddProfileSubmit} className="space-y-4">
              <div className="bg-secondary/20 p-3.5 rounded-2xl border border-border/60">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Selected File</label>
                <div className="text-xs font-bold text-accent truncate mt-1">
                  {profileFile ? profileFile.name : "No file attached"}
                </div>
                {profileFile && (
                  <div className="text-[9px] text-muted-foreground font-semibold mt-0.5">
                    {(profileFile.size / (1024 * 1024)).toFixed(2)} MB PDF Document
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Company / Developer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Al Ahly Sabbour Developments"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border/40 mt-4">
                <Button type="button" variant="ghost" onClick={() => setShowProfileModal(false)}>Cancel</Button>
                <Button type="submit" className="rounded-xl">Add Profile Asset</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Previewer Modal */}
      {previewPdfUrl && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">PropTrack PDF Document Viewer</span>
              <h3 className="font-display font-bold text-primary text-sm truncate max-w-md">{previewPdfTitle}</h3>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href={previewPdfUrl} 
                download={`${previewPdfTitle}.pdf`}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-accent text-accent-foreground px-4 text-xs font-bold hover:bg-accent/90 transition-all shadow-sm"
              >
                <Download className="h-4 w-4" /> Download
              </a>
              <button 
                onClick={() => {
                  if (previewPdfUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(previewPdfUrl);
                  }
                  setPreviewPdfUrl(null);
                }} 
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary hover:bg-secondary/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-border bg-card shadow-inner">
            <iframe 
              src={`${previewPdfUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          </div>
        </div>
      )}

    </div>
  );
}
