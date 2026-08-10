import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  Settings2,
  TrendingUp,
  FileText,
  Plus,
  Trash2,
  ShieldCheck,
  Check,
  X,
  Percent,
  Clock,
  ArrowUpRight,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/team")({
  component: TeamWorkspacePage,
});

function TeamWorkspacePage() {
  const user = useStore((s) => s.user);
  const brokerageSeats = useStore((s) => s.brokerageSeats) || [];
  const projectAccessList = useStore((s) => s.projectAccessList) || [];
  const addSeatAgent = useStore((s) => s.addBrokerageSeatAgent);
  const removeSeatAgent = useStore((s) => s.removeBrokerageSeatAgent);
  const toggleProjectAccess = useStore((s) => s.toggleProjectAccess);
  const compounds = useStore((s) => s.compoundsList) || [];

  // Form state
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!user || user.tier !== "BrokerageAdmin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 border border-slate-200 dark:border-slate-800 rounded-3xl bg-card">
        <Users className="h-12 w-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Requires Brokerage Team Plan
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mt-2">
          This dashboard is only available to registered Brokerage Workspace Administrators. Please
          upgrade your plan in the Billing tab.
        </p>
      </div>
    );
  }

  // Calculate stats
  const activeSeatsCount = brokerageSeats.length;
  const totalLeads = brokerageSeats.reduce((acc, s) => acc + (s.crmContacts || 0), 0);
  const totalSends = brokerageSeats.reduce((acc, s) => acc + (s.whatsappSends || 0), 0);

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!newEmail || !newName) return;

    const success = addSeatAgent(newEmail.trim(), newName.trim());
    if (success) {
      setSuccessMsg(`Successfully allocated brokerage seat to ${newName}.`);
      setNewEmail("");
      setNewName("");
    } else {
      setErrorMsg("Failed to add agent. Seats limit exceeded or email is already registered.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="h-7 w-7 text-indigo-500" /> Team Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your team seats, review performance analytics, toggle project brochures, and
            access itemized invoices.
          </p>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Seats Allocated</span>
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {activeSeatsCount} <span className="text-sm font-normal text-slate-500">active</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">EGP 199 per active seat/month</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Aggregated CRM Leads
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{totalLeads}</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Total leads captured by all seat members
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Aggregated WhatsApp Sends
            </span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{totalSends}</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Team messages broadcast this billing cycle
          </p>
        </div>
      </div>

      {/* Grid: Seat Management & Central Controls */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Seat Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Seat Allocation Management
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Add brokers to your subscription plan. Removed brokers will instantly lose their
                workspace seat.
              </p>
            </div>

            {/* Add broker form */}
            <form
              onSubmit={handleAddAgent}
              className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-4"
            >
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Add Team Broker
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-1.5 text-xs focus:outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-1.5 text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}
                {successMsg && <p className="text-xs text-emerald-500 font-medium">{successMsg}</p>}
                <Button
                  type="submit"
                  size="sm"
                  className="ml-auto rounded-lg text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                >
                  <Plus className="h-3 w-3 mr-1" /> Provision Seat
                </Button>
              </div>
            </form>

            {/* List of active brokers */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Active Team Members
              </h3>
              {brokerageSeats.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No seats provisioned. Add an agent above.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                  {brokerageSeats.map((seat) => (
                    <div
                      key={seat.email}
                      className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{seat.name}</p>
                        <p className="text-[10px] text-slate-500">{seat.email}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            {seat.crmContacts || 0} leads · {seat.whatsappSends || 0} WA sends
                          </p>
                          <p className="text-[9px] text-slate-400">
                            Last active: {seat.lastActive || "Never"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSeatAgent(seat.email)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                          title="Revoke Seat Access"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Central Brochure Control & Invoicing */}
        <div className="space-y-6">
          {/* Brochure Control */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-violet-500" /> Brochure Access Filters
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Disable/enable specific project brochures for the entire team layout.
              </p>
            </div>

            <div className="max-h-[220px] overflow-y-auto space-y-2 border border-slate-100 dark:border-slate-800 rounded-xl p-2.5">
              {compounds.map((c: any) => {
                const blocked = projectAccessList.includes(c.slug);
                return (
                  <div key={c.slug} className="flex items-center justify-between text-xs p-1">
                    <span className="truncate max-w-[140px] font-medium text-slate-700 dark:text-slate-300">
                      {c.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleProjectAccess(c.slug)}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide transition-all ${
                        blocked
                          ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                          : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                      }`}
                    >
                      {blocked ? "Disabled" : "Enabled"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itemized Invoicing */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" /> Itemized Invoice
            </h2>

            <div className="text-xs space-y-2.5 bg-slate-50 dark:bg-slate-900/40 p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl">
              <div className="flex justify-between">
                <span className="text-slate-500">Billing Cycle:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Monthly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Base Seats Required:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  5 Seats (Min)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Allocated:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {activeSeatsCount} seats
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rate per seat:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">EGP 199</span>
              </div>

              <hr className="border-slate-200 dark:border-slate-800" />

              <div className="flex justify-between text-sm">
                <span className="font-bold text-slate-800 dark:text-slate-200">Total Monthly:</span>
                <span className="font-extrabold text-indigo-500">
                  EGP {Math.max(5, activeSeatsCount) * 199}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs rounded-xl"
              onClick={() => alert("Invoice downloaded (mock)")}
            >
              <Download className="h-3 w-3 mr-1.5" /> Download Itemized Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
