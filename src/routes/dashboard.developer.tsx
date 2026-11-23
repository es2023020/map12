import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useStore } from "@/lib/store";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/dashboard/developer")({
  validateSearch: (search: Record<string, unknown>) => ({
    dev: typeof search.dev === "string" ? search.dev : "",
  }),
  head: () => ({
    meta: [
      { title: "Developer Command Center — Property Atlas" },
      {
        name: "description",
        content: "Dedicated developer portfolio command center, live inquiry pipeline, and inventory manager.",
      },
    ],
  }),
  component: DeveloperDashboardPage,
});

export default function DeveloperDashboardPage() {
  const { dev: devParam } = Route.useSearch();
  const user = useStore((s) => s.user);
  const leads = useStore((s) => s.leads) || [];
  const isAdmin = user?.email?.toLowerCase() === "elsayedshoeip70@gmail.com" || user?.role === "admin";

  // Determine active developer slug:
  // 1. From URL query param
  // 2. From logged in developer user account
  // 3. Fallback to 'palm-hills-developments'
  const initialDevSlug = devParam || user?.developerSlug || "palm-hills-developments";
  const [selectedDevSlug, setSelectedDevSlug] = useState<string>(initialDevSlug);

  // Active Developer Profile
  const activeDev = useMemo(() => {
    return developers.find((d) => d.slug === selectedDevSlug) || developers[0];
  }, [selectedDevSlug]);

  const activeAccount = useMemo(() => {
    return developerAccounts.find((d) => d.slug === selectedDevSlug);
  }, [selectedDevSlug]);

  // Active Developer Compounds
  const devCompounds = useMemo(() => {
    return compounds.filter((c) => c.developerSlug === selectedDevSlug && !c.parentSlug);
  }, [selectedDevSlug]);

  // Active Developer Inquiries / Leads (Local + Supabase live)
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

  // Announcements State
  const [announcements, setAnnouncements] = useState<Array<{
    id: string;
    title: string;
    category: string;
    date: string;
    content: string;
    badge?: string;
  }>>([
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

  // Load live announcements from Supabase
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
            date: new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
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

  // Aggregate stats
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

    // Persist to Supabase developer_announcements
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

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Admin Quick Developer Switcher Bar */}
      {isAdmin && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-3.5 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
            <span className="font-bold text-accent">Admin Master View:</span>
            <span className="text-muted-foreground">
              You have full administrative privileges to inspect and manage any developer portal.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label htmlFor="dev-switcher" className="sr-only">Switch Developer</Label>
            <select
              id="dev-switcher"
              value={selectedDevSlug}
              onChange={(e) => setSelectedDevSlug(e.target.value)}
              className="h-8 rounded-xl border border-border bg-card px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent w-full sm:w-64"
            >
              {developers.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} ({compounds.filter((c) => c.developerSlug === d.slug && !c.parentSlug).length} projects)
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Developer Entity Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Logo */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-white p-2 shadow-soft">
              <img
                src={activeDev.logo}
                alt={activeDev.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?background=1a2b3c&color=fff&name=${encodeURIComponent(activeDev.name)}`;
                }}
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl md:text-3xl font-extrabold text-primary">
                  {activeDev.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Verified Master Developer
                </span>
              </div>

              <p className="text-xs md:text-sm text-muted-foreground max-w-2xl line-clamp-2">
                {activeDev.blurb}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground font-mono">
                {activeAccount?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-accent" /> {activeAccount.email}
                  </span>
                )}
                {activeAccount?.accessCode && (
                  <span className="flex items-center gap-1 bg-secondary/80 px-2 py-0.5 rounded-md font-bold text-primary">
                    <KeyRound className="h-3 w-3 text-accent" /> Passcode: {activeAccount.accessCode}
                  </span>
                )}
                {activeDev.website && (
                  <a
                    href={activeDev.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-accent hover:underline"
                  >
                    <Globe className="h-3 w-3" /> Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setShowAnnouncementModal(true)}
              className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-bold gap-1.5 h-10 px-4"
            >
              <Megaphone className="h-4 w-4" /> Post Launch Bulletin
            </Button>
            <Link
              to={`/developers/${activeDev.slug}`}
              className="inline-flex items-center justify-center rounded-xl border border-border h-10 px-3.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Public Profile <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Portfolio Compounds</span>
            <Building2 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="font-display text-2xl font-bold text-primary mt-2">
            {devCompounds.length}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Active master developments
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Live Availability</span>
            <Layers className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="font-display text-2xl font-bold text-emerald-600 mt-2">
            {totalUnits > 0 ? `${totalUnits} Units` : "Catalog Active"}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Current inventory listed
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Inquiries</span>
            <Users className="h-4 w-4 text-violet-500" />
          </div>
          <div className="font-display text-2xl font-bold text-primary mt-2">
            {devLeads.length} Leads
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Captured for this developer
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Land Bank & Delivery</span>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </div>
          <div className="font-display text-lg font-bold text-primary mt-2 truncate">
            {activeDev.landBank || "25,000+ Feddans"}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Delivered: {activeDev.unitsDelivered || "15,000+ units"}
          </div>
        </div>
      </div>

      {/* Main Tabs / Sections: 1. Compounds Table | 2. Leads Inbox | 3. Official Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Compound Portfolio Management */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-soft">
            <div className="border-b border-border bg-secondary/40 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary">
                    Compound Portfolio & Inventory Status
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Direct overview of all active projects, starting prices, and documentation.
                  </p>
                </div>

                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={searchProjectQuery}
                    onChange={(e) => setSearchProjectQuery(e.target.value)}
                    placeholder="Search compound name..."
                    className="pl-8 h-8 text-xs rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-border/60 max-h-[500px] overflow-y-auto">
              {filteredDevCompounds.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No compounds found for this developer.
                </div>
              ) : (
                filteredDevCompounds.map((c) => {
                  const avail = availability.find((a) => a.slug === c.slug);
                  return (
                    <div
                      key={c.slug}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={c.hero}
                          alt={c.name}
                          className="h-12 w-16 rounded-xl object-cover shrink-0 bg-secondary"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/destinations/new-cairo.jpg";
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/projects/${c.slug}`}
                              className="font-bold text-sm text-primary hover:text-accent transition-colors"
                            >
                              {c.name}
                            </Link>
                            {c.flagship && (
                              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-600">
                                ★ Flagship
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span className="capitalize">{c.destination.replace(/-/g, " ")}</span>
                            {c.km ? ` · km ${c.km}` : ""} · Delivery {c.deliveryYear}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 text-right">
                        <div>
                          <div className="text-xs font-bold text-primary">
                            {c.priceFrom > 0 ? `From EGP ${c.priceFrom}M` : "Price on Request"}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {avail?.totalAvailable ? `${avail.totalAvailable} units available` : "Status: " + c.status}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {c.masterPlanUrl && (
                            <a
                              href={c.masterPlanUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-accent hover:bg-secondary"
                              title="View Master Plan"
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          )}
                          <Link
                            to={`/projects/${c.slug}`}
                            className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary"
                            title="Open Project Page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Live Lead Inquiries & Official Bulletins */}
        <div className="space-y-6">
          {/* Direct Leads Pipeline */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-soft">
            <div className="border-b border-border bg-secondary/40 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-primary">
                  Direct Inquiries Feed
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Prospective buyers asking for {activeDev.name} projects.
                </p>
              </div>
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">
                {devLeads.length}
              </span>
            </div>

            <div className="divide-y divide-border/60 max-h-[300px] overflow-y-auto">
              {devLeads.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No active customer inquiries yet. Leads submitted on your compound pages will appear here in real time.
                </div>
              ) : (
                devLeads.map((lead) => (
                  <div key={lead.id} className="p-3.5 hover:bg-secondary/20 transition-colors space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">{lead.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-accent" />
                      <span>{lead.projectName || "General Inquiry"}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {lead.phone}
                      </span>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 transition-colors"
                      >
                        <MessageSquare className="h-3 w-3" /> WhatsApp
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Published Announcements Feed */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-soft">
            <div className="border-b border-border bg-secondary/40 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-primary">
                  Official Launch Bulletins
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Published to Property Atlas network.
                </p>
              </div>
              <Button
                onClick={() => setShowAnnouncementModal(true)}
                variant="ghost"
                size="sm"
                className="h-7 text-xs font-bold text-accent"
              >
                + New
              </Button>
            </div>

            <div className="divide-y divide-border/60 max-h-[300px] overflow-y-auto">
              {announcements.map((a) => (
                <div key={a.id} className="p-3.5 hover:bg-secondary/20 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[9px] font-bold text-accent uppercase">
                      {a.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{a.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-primary leading-tight">{a.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Publish Launch Bulletin */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-accent" />
                <h3 className="font-display text-lg font-bold text-primary">
                  Publish Official Launch Bulletin
                </h3>
              </div>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs">
              <div>
                <Label htmlFor="ann-title">Announcement Title</Label>
                <Input
                  id="ann-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Phase 2 Launch at Hacienda West — New Payment Plans"
                  className="mt-1.5 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <Label htmlFor="ann-cat">Category</Label>
                <select
                  id="ann-cat"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1.5 flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs"
                >
                  <option value="launch">New Launch Release</option>
                  <option value="pricing">Pricing & Payment Plan Update</option>
                  <option value="phase">New Phase Release</option>
                  <option value="policy">Agency / Broker Commission Policy</option>
                </select>
              </div>

              <div>
                <Label htmlFor="ann-content">Bulletin Details</Label>
                <textarea
                  id="ann-content"
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter the official details, delivery timelines, and special discounts..."
                  className="mt-1.5 flex w-full rounded-xl border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
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
                  className="rounded-xl bg-accent text-accent-foreground font-bold"
                >
                  Publish to Network
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
