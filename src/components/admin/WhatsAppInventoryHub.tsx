import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  Building2,
  Search,
  RefreshCw,
  Send,
  FileText,
  Clock,
  ArrowRight,
  Database,
} from "lucide-react";

interface DeveloperGroupEntry {
  group_display_name: string;
  canonical_slug: string;
  developer_name: string;
  has_folder_in_availability: boolean;
  projects: string[];
  projects_count: number;
}

interface StagedUpdate {
  id: string;
  timestamp: string;
  source: string;
  filename?: string;
  developerSlug: string;
  projectsAffected: string[];
  diffs: any[];
  status: string;
}

export function WhatsAppInventoryHub() {
  const [loading, setLoading] = useState(true);
  const [autonomousMode, setAutonomousMode] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<StagedUpdate[]>([]);
  const [developersMatrix, setDevelopersMatrix] = useState<DeveloperGroupEntry[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [simText, setSimText] = useState("");
  const [simDev, setSimDev] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp-inventory");
      if (res.ok) {
        const data = await res.json();
        setAutonomousMode(data.autonomous_mode ?? false);
        setPendingUpdates(data.pending_updates ?? []);
        setDevelopersMatrix(data.developers_matrix ?? []);
        setAuditLog(data.recent_audit ?? []);
      }
    } catch (err) {
      console.error("Failed to load WhatsApp Inventory data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleMode = async () => {
    try {
      const res = await fetch("/api/whatsapp-inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-autonomous" }),
      });
      if (res.ok) {
        const data = await res.json();
        setAutonomousMode(data.autonomous_mode);
        setActionMessage({
          text: data.autonomous_mode
            ? "⚡ Autonomous Mode activated. Future sheets will publish automatically!"
            : "🛡️ Supervised Mode activated. Updates will wait for your manual approval.",
          type: "success",
        });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message, type: "error" });
    }
  };

  const handleApprove = async (updateId: string) => {
    try {
      const res = await fetch("/api/whatsapp-inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", updateId }),
      });
      if (res.ok) {
        setActionMessage({ text: "✅ Update approved and applied to live app!", type: "success" });
        fetchData();
      }
    } catch (err: any) {
      setActionMessage({ text: err.message, type: "error" });
    }
  };

  const handleReject = async (updateId: string) => {
    if (!confirm("Are you sure you want to discard this update?")) return;
    try {
      const res = await fetch("/api/whatsapp-inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", updateId }),
      });
      if (res.ok) {
        setActionMessage({ text: "Update discarded.", type: "success" });
        fetchData();
      }
    } catch (err: any) {
      setActionMessage({ text: err.message, type: "error" });
    }
  };

  const handleSimulateText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simText.trim()) return;
    setSimulating(true);
    try {
      const res = await fetch("/api/whatsapp-inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test-text", text: simText, developerSlug: simDev || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ text: `Message processed successfully! (${data.message})`, type: "success" });
        setSimText("");
        fetchData();
      } else {
        setActionMessage({ text: data.message || "No inventory action detected.", type: "error" });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message, type: "error" });
    } finally {
      setSimulating(false);
    }
  };

  const filteredMatrix = developersMatrix.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.group_display_name.toLowerCase().includes(q) ||
      d.developer_name.toLowerCase().includes(q) ||
      d.canonical_slug.toLowerCase().includes(q) ||
      d.projects.some((p) => p.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Mode Controller */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                WhatsApp Live Inventory Hub
                <span className="rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/20">
                  87 Developer Groups Active
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage WhatsApp developer groups, review incoming Excel & PDF inventory updates, and toggle autonomous mode.
              </p>
            </div>
          </div>
        </div>

        {/* Handover & Autonomous Toggle */}
        <div className="flex items-center gap-3 bg-secondary/30 border border-border/60 rounded-xl p-2.5">
          <div className="text-right">
            <div className="text-xs font-bold text-primary flex items-center justify-end gap-1.5">
              {autonomousMode ? (
                <>
                  <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>Autonomous Handover</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                  <span>Supervised Approval</span>
                </>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {autonomousMode ? "Auto-applies valid sheets" : "Requires your approval first"}
            </div>
          </div>
          <button
            onClick={handleToggleMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              autonomousMode
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-accent hover:bg-accent/90 text-white"
            }`}
          >
            {autonomousMode ? "Switch to Supervised" : "Switch to Autonomous"}
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            actionMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-xs opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* ── 1. STAGED REVIEWS QUEUE (HUMAN IN THE LOOP) ── */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-display text-sm font-bold text-primary flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Pending Review Queue ({pendingUpdates.length})
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Incoming WhatsApp updates awaiting your approval before publishing to Property Atlas.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="rounded-lg border border-border p-1.5 hover:bg-secondary/40 text-muted-foreground hover:text-primary transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {pendingUpdates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-8 text-center bg-secondary/5">
            <CheckCircle2 className="h-7 w-7 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-xs font-bold text-primary">All Caught Up!</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              No developer sheets or text announcements are currently waiting in the review queue.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingUpdates.map((update) => (
              <div
                key={update.id}
                className="rounded-xl border border-border/80 bg-secondary/10 p-4 space-y-3 hover:border-accent/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-primary">
                        {update.developerSlug.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(update.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-[10px] bg-accent/10 border border-accent/20 text-accent font-bold px-2 py-0.5 rounded-full">
                        {update.source}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Source: <span className="font-semibold text-primary">{update.filename || update.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(update.id)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-xs font-bold text-muted-foreground transition-colors flex items-center gap-1"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(update.id)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-soft transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve &amp; Deploy
                    </button>
                  </div>
                </div>

                {/* Diffs Summary */}
                {update.diffs && update.diffs.length > 0 && (
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 pt-2 border-t border-border/20">
                    {update.diffs.map((diff: any, idx: number) => (
                      <div key={idx} className="bg-card/80 border border-border/60 rounded-lg p-2.5 space-y-1">
                        <div className="font-bold text-[11px] text-primary flex items-center justify-between">
                          <span>{diff.projectSlug}</span>
                          {diff.isProjectSoldOut && (
                            <span className="text-[9px] font-bold bg-destructive/10 text-destructive border border-destructive/20 px-1.5 rounded">
                              SOLD OUT
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground flex gap-2">
                          <span className="text-emerald-400 font-semibold">+{diff.unitsAdded} Added</span>
                          <span className="text-primary font-semibold">~{diff.unitsUpdated} Updated</span>
                          <span className="text-rose-400 font-semibold">-{diff.unitsMarkedSold} Sold</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Available: {diff.totalPreviouslyAvailable} ➔{" "}
                          <span className="font-bold text-primary">{diff.totalCurrentlyAvailable}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 2. LIVE ANNOUNCEMENT TESTER ── */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
        <h3 className="font-display text-sm font-bold text-primary flex items-center gap-2">
          <Send className="h-4 w-4 text-accent" />
          Test Real-Time WhatsApp Announcement
        </h3>
        <p className="text-[11px] text-muted-foreground">
          Simulate a message sent in any developer group to verify how the engine parses and updates availability.
        </p>

        <form onSubmit={handleSimulateText} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
            <input
              type="text"
              value={simText}
              onChange={(e) => setSimText(e.target.value)}
              placeholder="e.g. Keeva Phase 2 is completely SOLD OUT or متاح الآن في جايا شاليه 120م 10.5 مليون كود CH-502"
              className="w-full rounded-xl border border-border bg-secondary/20 px-3.5 py-2 text-xs text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={simulating || !simText.trim()}
              className="rounded-xl bg-accent text-white font-bold text-xs px-4 py-2 hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {simulating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              <span>Test Parse</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── 3. DEVELOPER GROUPS MATRIX (87 GROUPS) ── */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-display text-sm font-bold text-primary flex items-center gap-2">
              <Building2 className="h-4 w-4 text-accent" />
              Connected Developer Groups ({developersMatrix.length})
            </h3>
            <p className="text-[11px] text-muted-foreground">
              The 87 developer groups monitored by your WhatsApp automation listener.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search developer or compound..."
              className="w-full rounded-xl border border-border bg-secondary/20 pl-8 pr-3 py-1.5 text-xs text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="max-h-[480px] overflow-y-auto divide-y divide-border/60">
            {filteredMatrix.map((dev, idx) => (
              <div
                key={idx}
                className="p-3.5 hover:bg-secondary/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">{dev.group_display_name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">({dev.canonical_slug})</span>
                    {dev.has_folder_in_availability ? (
                      <span className="text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">
                        Active In App
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold bg-zinc-500/10 border border-zinc-500/20 text-muted-foreground px-1.5 py-0.2 rounded">
                        Ready
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Developer: <span className="font-semibold text-primary">{dev.developer_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-primary">{dev.projects_count} Compounds</div>
                    <div className="text-[10px] text-muted-foreground truncate max-w-[220px]" title={dev.projects.join(", ")}>
                      {dev.projects.slice(0, 3).join(", ") || "No compounds mapped"}
                      {dev.projects.length > 3 && ` +${dev.projects.length - 3} more`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
