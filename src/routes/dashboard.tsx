import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Heart, 
  ListChecks, 
  GitCompareArrows, 
  Users, 
  Calendar, 
  Video, 
  MessageSquareCode, 
  MessageSquare,
  Compass, 
  ExternalLink,
  Map,
  Calculator,
  Megaphone,
  Sparkles,
  CreditCard,
  Plus,
  Trash2,
  X,
  PlusCircle,
  Menu,
  KeyRound,
  User
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Broker Workspace — PropTrack" },
      { name: "description", content: "Your PropTrack Notion workspace — lead CRM, documents library, targets and integrations." },
    ],
  }),
  component: DashboardLayout,
});

const tabs = [
  { to: "/dashboard" as const, label: "Workspace Home", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/leads" as const, label: "CRM Lead Pipeline", icon: ListChecks },
  { to: "/dashboard/campaigns" as const, label: "WhatsApp Campaigns", icon: Megaphone },
  { to: "/dashboard/favorites" as const, label: "Favorites Library", icon: Heart },
  { to: "/dashboard/compare" as const, label: "Unit Compare Engine", icon: GitCompareArrows },
  { to: "/dashboard/maps" as const, label: "Maps Library", icon: Map },
  { to: "/dashboard/profile" as const, label: "My Profile Details", icon: User },
];

const connectors = [
  { href: "https://calendar.google.com", label: "Google Calendar", icon: Calendar, color: "text-blue-500 hover:bg-blue-500/10" },
  { href: "https://meet.google.com", label: "Google Meet", icon: Video, color: "text-emerald-500 hover:bg-emerald-500/10" },
  { href: "https://web.whatsapp.com", label: "WhatsApp Web", icon: MessageSquareCode, color: "text-green-500 hover:bg-green-500/10" }
];

function DashboardLayout() {
  const user = useStore((s) => s.user);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const limitHitError = useStore((s) => s.limitHitError);
  const clearLimitHitError = useStore((s) => s.clearLimitHitError);

  const isAdmin = user?.email?.toLowerCase() === "elsayedshoeip70@gmail.com";
  const visibleTabs = isAdmin ? tabs : tabs.filter((t) => t.to !== "/dashboard/maps");

  // Custom shortcuts state
  const customShortcuts = useStore((s) => s.customShortcuts) || [];
  const addShortcut = useStore((s) => s.addCustomShortcut);
  const deleteShortcut = useStore((s) => s.deleteCustomShortcut);
  const signOut = useStore((s) => s.signOut);

  const [openModal, setOpenModal] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState("");
  const [shortcutUrl, setShortcutUrl] = useState("");

  const handleAddShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortcutLabel || !shortcutUrl) return;

    let processedUrl = shortcutUrl.trim();
    if (!/^https?:\/\//i.test(processedUrl) && !processedUrl.startsWith("/")) {
      if (processedUrl.includes(".") || processedUrl.includes(":")) {
        processedUrl = "https://" + processedUrl;
      }
    }

    addShortcut(shortcutLabel, processedUrl);
    setShortcutLabel("");
    setShortcutUrl("");
    setOpenModal(false);
  };

  return (
    <Shell>
      <div className="min-h-screen bg-background text-foreground lg:flex">
        
        {/* Notion Sidebar */}
        <aside className="w-full shrink-0 border-r border-border/60 bg-card p-6 lg:w-64 lg:min-h-screen flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-5">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-xl object-cover border border-border shrink-0" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground font-display text-lg font-bold shrink-0">
                    {user ? user.name[0].toUpperCase() : "G"}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-primary">
                    {user ? user.name : "Guest Broker"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {user ? `${user.tier} Partner` : "Standard Plan"}
                  </p>
                </div>
              </div>
              
              <Link to="/auth" onClick={() => signOut()} title="Sign Out Account" className="text-muted-foreground hover:text-destructive transition-colors">
                <KeyRound className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-6">
              <div>
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Navigation</span>
                <nav className="mt-2 space-y-1">
                  {visibleTabs.map((t) => {
                    const active = t.exact ? pathname === t.to : pathname === t.to || pathname.startsWith(t.to + "/");
                    return (
                      <Link key={t.to} to={t.to}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          active 
                            ? "bg-accent/15 text-accent border-l-2 border-accent" 
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        }`}>
                        <t.icon className="h-4 w-4" /> {t.label}
                      </Link>
                    );
                  })}
                  {(user?.tier === "BrokerageAdmin" || user?.tier === "BrokerageSeat") && (
                    <Link to="/dashboard/team"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        pathname.startsWith("/dashboard/team")
                          ? "bg-accent/15 text-accent border-l-2 border-accent" 
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}>
                      <Users className="h-4 w-4 text-indigo-500" /> Team Workspace
                    </Link>
                  )}
                </nav>
              </div>

              <div>
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Connectors & Map</span>
                <div className="mt-2 space-y-1">
                  {connectors.map((c) => (
                    <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all text-muted-foreground hover:text-foreground ${c.color}`}>
                      <span className="flex items-center gap-3">
                        <c.icon className="h-4 w-4" /> {c.label}
                      </span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  ))}
                  
                  {isAdmin && (
                    <Link to="/map" search={{ destination: "", dev: "", q: "" }} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                      <span className="flex items-center gap-3">
                        <Map className="h-4 w-4 text-violet-500" /> Interactive Map
                      </span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Link>
                  )}
                  <Link to="/calculator" search={{ project: "" }} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                    <span className="flex items-center gap-3">
                      <Calculator className="h-4 w-4 text-pink-500" /> Installment Calc
                    </span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </Link>
                </div>
              </div>

              {/* Collapsible & Dynamic Custom Shortcut Links Section */}
              <div>
                <div className="flex items-center justify-between px-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Custom Shortcuts</span>
                  <button onClick={() => setOpenModal(true)} className="text-muted-foreground hover:text-accent transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                <div className="mt-2 space-y-1">
                  {customShortcuts.map((s) => (
                    <div key={s.id} className="flex items-center justify-between group rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all">
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 truncate max-w-[140px]">
                        <Compass className="h-4 w-4 shrink-0 text-accent" />
                        <span className="truncate">{s.label}</span>
                      </a>
                      <button onClick={() => deleteShortcut(s.id)} className="text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {customShortcuts.length === 0 && (
                    <div className="px-3 py-2 text-xs text-muted-foreground/70 italic">No custom shortcuts. click + to add</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade & Billing Footer bar */}
          <div className="mt-6 border-t border-border/60 pt-5">
            <Link to="/dashboard/billing" className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-3 hover:bg-accent/10 transition-all">
              <CreditCard className="h-5 w-5 text-accent shrink-0" />
              <div>
                <div className="text-xs font-bold text-primary">Upgrade Workspace</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Payment via ADIB Bank</div>
              </div>
            </Link>
          </div>
        </aside>

        {/* Notion Page Workspace Content */}
        <main className="flex-1 px-4 py-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>

      {/* Custom Shortcut Form Modal dialog */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
              <h3 className="font-display font-bold text-primary">Add Custom Link</h3>
              <button onClick={() => setOpenModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddShortcut} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">Link Label</label>
                <input
                  type="text"
                  placeholder="e.g. My CRM Docs"
                  value={shortcutLabel}
                  onChange={(e) => setShortcutLabel(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">Target URL</label>
                <input
                  type="text"
                  placeholder="e.g. docs.google.com"
                  value={shortcutUrl}
                  onChange={(e) => setShortcutUrl(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpenModal(false)}>Cancel</Button>
                <Button type="submit" className="rounded-xl">Create Link</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Quick-Launch Button */}
      <a
        href="https://web.whatsapp.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Open WhatsApp Web"
        className="fixed bottom-6 right-6 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-200 group"
        style={{width: '52px', height: '52px'}}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-card border border-border px-2 py-1 text-[10px] font-bold text-primary shadow opacity-0 group-hover:opacity-100 transition-opacity">
          WhatsApp Web
        </span>
      </a>

      {limitHitError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <Sparkles className="h-6 w-6 text-indigo-500 animate-pulse shrink-0" />
              <h3 className="font-display font-bold text-lg text-primary">Workspace Limit Reached</h3>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {limitHitError.msg}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" className="rounded-xl text-xs" onClick={clearLimitHitError}>
                Close Alert
              </Button>
              <Link
                to="/dashboard/billing"
                onClick={clearLimitHitError}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 transition-all shadow"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>
        </div>
      )}

    </Shell>
  );
}