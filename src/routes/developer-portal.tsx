import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Shell } from "@/components/layout/Shell";
import { developers } from "@/data/developers";
import { compounds } from "@/data/compounds";
import { developerAccounts } from "@/data/developer-accounts";
import { availability } from "@/data/availability";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  MapPin,
  ExternalLink,
  Users,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  Globe,
  PlusCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Layers,
  Sparkles,
  ShieldCheck,
  Megaphone,
  MessageSquare,
  KeyRound,
  Edit3,
  Calendar,
  AlertCircle,
  Clock,
  LogOut,
  ChevronRight,
  ArrowRight,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/developer-portal")({
  validateSearch: (search: Record<string, unknown>) => ({
    dev: typeof search.dev === "string" ? search.dev : "",
  }),
  head: () => ({
    meta: [
      { title: "Master Developer Portal — Property Atlas" },
      {
        name: "description",
        content:
          "Official Property Atlas Master Developer Portal — private portfolio command center, customer inquiries pipeline, and official launch bulletin publisher.",
      },
    ],
  }),
  component: DeveloperPortalPage,
});

export default function DeveloperPortalPage() {
  const { dev: devParam } = Route.useSearch();
  const user = useStore((s) => s.user);
  const signOut = useStore((s) => s.signOut);
  const loginAsDeveloper = useStore((s) => s.loginAsDeveloper);
  const leads = useStore((s) => s.leads) || [];

  const isAdmin =
    user?.email?.toLowerCase() === "elsayedshoeip70@gmail.com" ||
    user?.email?.toLowerCase() === "admin@propertyatlas.com" ||
    user?.role === "admin";

  const isDeveloperUser = user?.role === "developer";

  // Active developer slug resolution:
  // 1. If admin, can pick via devParam or default to first
  // 2. If logged in developer, use user's developerSlug
  // 3. Fallback
  const [selectedDevSlug, setSelectedDevSlug] = useState<string>(
    user?.developerSlug || devParam || "palm-hills-developments",
  );

  useEffect(() => {
    if (user?.developerSlug && !isAdmin) {
      setSelectedDevSlug(user.developerSlug);
    } else if (devParam) {
      setSelectedDevSlug(devParam);
    }
  }, [user, devParam, isAdmin]);

  // Active Developer Profile
  const activeDev = useMemo(() => {
    return developers.find((d) => d.slug === selectedDevSlug) || developers[0];
  }, [selectedDevSlug]);

  const activeAccount = useMemo(() => {
    return developerAccounts.find((d) => d.slug === selectedDevSlug);
  }, [selectedDevSlug]);

  // Developer Compounds
  const devCompounds = useMemo(() => {
    return compounds.filter((c) => c.developerSlug === selectedDevSlug && !c.parentSlug);
  }, [selectedDevSlug]);

  // Live Supabase Leads Sync
  const [supabaseLeads, setSupabaseLeads] = useState<any[]>([]);

  useEffect(() => {
    if (!supabase || !selectedDevSlug) return;
    let isMounted = true;
    supabase
      .from("leads")
      .select("*")
      .eq("developer_slug", selectedDevSlug)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && isMounted) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            phone: d.phone,
            email: d.email,
            projectName: d.project_name,
            projectSlug: d.project_slug,
            developerSlug: d.developer_slug,
            destination: d.destination,
            budget: d.budget,
            notes: d.notes,
            status: d.status,
            timestamp: d.created_at,
          }));
          setSupabaseLeads(mapped);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [selectedDevSlug]);

  const devLeads = useMemo(() => {
    const localFiltered = leads.filter(
      (l) =>
        (l.developerSlug && l.developerSlug === selectedDevSlug) ||
        (l.projectName && devCompounds.some((c) => c.name.toLowerCase().includes(l.projectName.toLowerCase()))),
    );
    const seenIds = new Set(localFiltered.map((l) => l.id));
    const uniqueSb = supabaseLeads.filter((l) => !seenIds.has(l.id));
    return [...uniqueSb, ...localFiltered];
  }, [leads, selectedDevSlug, devCompounds, supabaseLeads]);

  // Announcements State with Supabase sync
  const [announcements, setAnnouncements] = useState<
    Array<{
      id: string;
      title: string;
      category: string;
      date: string;
      content: string;
      badge?: string;
    }>
  >([
    {
      id: "a1",
      title: `${activeDev.name} Q4 Special Payment Terms Announced`,
      category: "pricing",
      date: "Nov 2026",
      content: "Updated installment schedules released across all coastal and Cairo phases.",
      badge: "Official",
    },
    {
      id: "a2",
      title: "New Luxury Phase Launch Briefing Available",
      category: "launch",
      date: "Oct 2026",
      content: "Brokers and advisors can now download the high-res technical catalog and floorplans.",
      badge: "New Phase",
    },
  ]);

  useEffect(() => {
    if (!supabase || !selectedDevSlug) return;
    let isMounted = true;
    supabase
      .from("developer_announcements")
      .select("*")
      .eq("developer_slug", selectedDevSlug)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0 && isMounted) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: d.category,
            date: new Date(d.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            content: d.content,
            badge: d.badge || (d.category === "launch" ? "New Launch" : "Bulletin"),
          }));
          setAnnouncements((prev) => {
            const existingIds = new Set(mapped.map((m: any) => m.id));
            const retained = prev.filter((p) => !existingIds.has(p.id));
            return [...mapped, ...retained];
          });
        }
      });
    return () => {
      isMounted = false;
    };
  }, [selectedDevSlug]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("launch");
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [searchProjectQuery, setSearchProjectQuery] = useState("");

  // In-portal Quick Login for unauthenticated users
  const [passcodeIdentifier, setPasscodeIdentifier] = useState("");
  const [loginError, setLoginError] = useState("");

  const handlePortalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!passcodeIdentifier) {
      setLoginError("Please enter your developer passcode or company name.");
      return;
    }
    const res = loginAsDeveloper(passcodeIdentifier);
    if (res.success && res.developer) {
      setSelectedDevSlug(res.developer.slug);
      setPasscodeIdentifier("");
    } else {
      setLoginError(res.error || "Invalid developer passcode.");
    }
  };

  const filteredDevCompounds = useMemo(() => {
    if (!searchProjectQuery) return devCompounds;
    const q = searchProjectQuery.toLowerCase();
    return devCompounds.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.destination.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q)),
    );
  }, [devCompounds, searchProjectQuery]);

  const totalUnits = useMemo(() => {
    return devCompounds.reduce((acc, c) => {
      const avail = availability.find((a) => a.slug === c.slug);
      return acc + (avail?.totalAvailable || 0);
    }, 0);
  }, [devCompounds]);

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    const item = {
      id: `ann-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      date: "Just now",
      badge: newCategory === "launch" ? "New Launch" : "Bulletin",
    };
    setAnnouncements([item, ...announcements]);
    setNewTitle("");
    setNewContent("");
    setShowAnnouncementModal(false);

    if (supabase) {
      try {
        await supabase.from("developer_announcements").insert({
          developer_slug: selectedDevSlug,
          developer_name: activeDev.name,
          title: item.title,
          content: item.content,
          category: item.category,
          badge: item.badge,
        });
      } catch (err) {
        console.warn("Could not sync announcement to Supabase:", err);
      }
    }
  };

  // If user is not authenticated as developer and not admin, show clean Developer Access Gate
  if (!user || (!isDeveloperUser && !isAdmin)) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl px-4 py-16 animate-in fade-in duration-300">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft-xl text-center space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-sm">
              <Building2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                <ShieldCheck className="h-3.5 w-3.5" /> Official Master Developer Portal
              </span>
              <h1 className="font-display text-3xl font-extrabold text-primary">
                Developer Portfolio Access
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Developer accounts are pre-created and provisioned by Property Atlas. Enter your company passcode to access your private portfolio, inquiries feed, and launch bulletins.
              </p>
            </div>

            <form onSubmit={handlePortalLogin} className="space-y-4 text-left max-w-sm mx-auto">
              {loginError && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <Label htmlFor="gate-passcode" className="text-xs font-semibold">
                  Developer Passcode or Company Selection
                </Label>
                <div className="relative mt-1.5">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="gate-passcode"
                    value={passcodeIdentifier}
                    onChange={(e) => setPasscodeIdentifier(e.target.value)}
                    placeholder="e.g. DEV_EMAAR_MISR_2026 or Company Name"
                    className="pl-9 rounded-xl font-mono text-xs uppercase"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Format: <code>DEV_[DEVELOPER_SLUG]_2026</code>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 py-2.5 font-bold"
              >
                Access Developer Portal <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/auth"
                  className="text-xs text-muted-foreground hover:text-foreground font-medium underline underline-offset-4"
                >
                  Are you a real estate broker? Open Broker Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
        {/* Developer Portal Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-sm border border-accent/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold text-primary">
                  {activeDev.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Official Developer Portal
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Master Portfolio Management · Client Inquiries Pipeline · Launch Bulletin Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              onClick={() => setShowAnnouncementModal(true)}
              className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs gap-1.5 shadow-sm"
            >
              <Megaphone className="h-3.5 w-3.5" /> Publish Launch Bulletin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="rounded-xl border-border text-xs gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/30"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Admin Quick Switcher Bar (Admins Only) */}
        {isAdmin && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-3.5 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
              <span className="font-bold text-accent">Admin Master View:</span>
              <span className="text-muted-foreground">
                You have administrative access to inspect and manage all 143 developer portals.
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Label htmlFor="dev-switcher" className="sr-only">
                Switch Developer
              </Label>
              <select
                id="dev-switcher"
                value={selectedDevSlug}
                onChange={(e) => setSelectedDevSlug(e.target.value)}
                className="h-8 rounded-xl border border-border bg-card px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent w-full sm:w-64"
              >
                {developers.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} ({d.count} compounds)
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Developer Header Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-border/80 bg-secondary/50 shadow-sm flex items-center justify-center p-2">
                <img
                  src={activeDev.logo}
                  alt={activeDev.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <Building2 className="h-8 w-8 text-muted-foreground absolute" style={{ zIndex: -1 }} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-display text-2xl font-black text-foreground">
                    {activeDev.name}
                  </h2>
                  {activeAccount && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold font-mono text-accent">
                      <KeyRound className="h-3 w-3" /> {activeAccount.accessCode}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {activeAccount?.email && (
                    <span className="flex items-center gap-1 text-primary">
                      <Mail className="h-3.5 w-3.5 text-accent" /> {activeAccount.email}
                    </span>
                  )}
                  {activeDev.foundingYear && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-accent" /> Est. {activeDev.foundingYear}
                    </span>
                  )}
                  {activeDev.website && (
                    <a
                      href={activeDev.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-accent hover:underline font-semibold"
                    >
                      <Globe className="h-3.5 w-3.5" /> Official Website{" "}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/developers/$slug"
                params={{ slug: selectedDevSlug }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/50 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-all"
              >
                View Public Profile <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft hover:shadow-soft-lg transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Portfolio Projects</span>
              <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-3xl font-black text-foreground">
              {devCompounds.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Master-planned compounds</p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft hover:shadow-soft-lg transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Available Units</span>
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-3xl font-black text-foreground">
              {totalUnits > 0 ? totalUnits.toLocaleString() : "85+"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Inventory active in catalog</p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft hover:shadow-soft-lg transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Client Inquiries</span>
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-3xl font-black text-foreground">
              {devLeads.length}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Live Supabase sync
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft hover:shadow-soft-lg transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Bulletins Issued</span>
              <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Megaphone className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-3xl font-black text-foreground">
              {announcements.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Brokers & advisors notified</p>
          </div>
        </div>

        {/* Section: Customer Inquiries & Leads Pipeline */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-foreground">
                  Direct Customer Inquiries Pipeline
                </h3>
                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-extrabold text-accent">
                  {devLeads.length} Leads
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inquiries generated from buyers directly requesting information for {activeDev.name} projects.
              </p>
            </div>
          </div>

          {devLeads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-2">
              <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm font-semibold text-foreground">No new customer leads yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Customer inquiries submitted for {activeDev.name} on the portal will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {devLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-secondary/20 transition-all rounded-xl px-2.5 -mx-2.5"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{lead.name}</span>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase">
                        {lead.status || "New"}
                      </span>
                      {lead.budget && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          Budget: {lead.budget}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-mono text-primary font-semibold">
                        <Phone className="h-3 w-3 text-accent" /> {lead.phone}
                      </span>
                      {lead.projectName && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" /> {lead.projectName}
                        </span>
                      )}
                      {lead.notes && (
                        <span className="italic text-muted-foreground max-w-md truncate">
                          &ldquo;{lead.notes}&rdquo;
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hello ${lead.name}, this is official representative from ${activeDev.name} following up on your inquiry on Property Atlas regarding ${lead.projectName || "our project"}.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> WhatsApp Callback
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Portfolio Compounds Table */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-foreground">
                  Portfolio Compounds & Projects
                </h3>
                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-extrabold text-accent">
                  {filteredDevCompounds.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Master projects registered under {activeDev.name} on the Property Atlas network.
              </p>
            </div>

            <div className="w-full sm:w-64">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={searchProjectQuery}
                  onChange={(e) => setSearchProjectQuery(e.target.value)}
                  placeholder="Filter projects..."
                  className="pl-8 h-9 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="py-3 px-3 font-semibold">Compound / Project</th>
                  <th className="py-3 px-3 font-semibold">Destination</th>
                  <th className="py-3 px-3 font-semibold">Starting Price</th>
                  <th className="py-3 px-3 font-semibold">Delivery</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredDevCompounds.map((c) => (
                  <tr key={c.slug} className="hover:bg-secondary/30 transition-all">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-foreground flex items-center gap-2">
                        <span>{c.name}</span>
                        {c.isNewLaunch && (
                          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                            New Launch
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1">{c.blurb}</div>
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-accent shrink-0" />
                      <span className="capitalize">{c.destination.replace("-", " ")}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-foreground">
                      {c.priceFrom ? `${c.priceFrom}M EGP` : "Contact for Price"}
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground font-mono">
                      {c.deliveryYear || "2027+"}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-foreground">
                        {c.status || "Off-Plan"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to="/projects/$slug"
                        params={{ slug: c.slug }}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-secondary transition-all"
                      >
                        Project Details <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Official Launch Bulletins */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Official Launch Bulletins & Policy Notices
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Notices published here are broadcasted to licensed brokers and advisors on Property Atlas.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAnnouncementModal(true)}
              className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-bold gap-1.5"
            >
              <Megaphone className="h-3.5 w-3.5" /> New Bulletin
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2 hover:border-accent/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                    {ann.badge || "Bulletin"}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {ann.date}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-foreground">{ann.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Publish Launch Bulletin */}
        {showAnnouncementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-soft-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Publish Official Bulletin
                  </h3>
                </div>
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground text-xs"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePostAnnouncement} className="space-y-4">
                <div>
                  <Label htmlFor="bulletin-title">Bulletin Headline</Label>
                  <Input
                    id="bulletin-title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Phase 2 Coastal Chalets Launching Next Week"
                    className="mt-1 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bulletin-category">Category</Label>
                  <select
                    id="bulletin-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="launch">New Phase Launch</option>
                    <option value="pricing">Price & Payment Plan Revision</option>
                    <option value="policy">Broker Commission Policy</option>
                    <option value="phase">Delivery Schedule Update</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="bulletin-content">Announcement Details</Label>
                  <textarea
                    id="bulletin-content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={4}
                    placeholder="Enter official briefing for brokers and advisors..."
                    className="mt-1 flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAnnouncementModal(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                  >
                    Broadcast Bulletin to Supabase
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
