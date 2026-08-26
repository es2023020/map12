import mediaRegistry from "@/data/media-registry.json";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type LeadStage, type Lead, type ActivityLogItem } from "@/lib/store";
import { useDebounce } from "@/lib/useDebounce";
import { compounds } from "@/data/compounds";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Phone,
  Trash2,
  Search,
  MessageSquare,
  Send,
  UserCheck,
  DollarSign,
  FileText,
  X,
  Sparkles,
  Link as LinkIcon,
  Check,
  Target,
  Calendar,
  NotebookPen,
  History,
  Info,
  ExternalLink,
  Flame,
  Copy,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/leads")({
  component: LeadsPage,
});

const stages: Array<{ id: LeadStage; label: string; color: string; border: string }> = [
  { id: "new", label: "New Leads", color: "bg-secondary text-primary", border: "border-border" },
  {
    id: "contacted",
    label: "Contacted",
    color: "bg-blue-500/10 text-blue-500",
    border: "border-blue-500/20",
  },
  {
    id: "viewing",
    label: "Viewing Site",
    color: "bg-amber-500/10 text-amber-500",
    border: "border-amber-500/20",
  },
  {
    id: "negotiating",
    label: "Negotiating",
    color: "bg-violet-500/10 text-violet-500",
    border: "border-violet-500/20",
  },
  {
    id: "closed",
    label: "Closed Won",
    color: "bg-emerald-500/10 text-emerald-500",
    border: "border-emerald-500/20",
  },
];

function LeadsPage() {
  const leads = useStore((s) => s.leads);
  const addLead = useStore((s) => s.addLead);
  const updateStage = useStore((s) => s.updateLeadStage);
  const removeLead = useStore((s) => s.deleteLead);

  const assignUnit = useStore((s) => s.assignUnitToLead);
  const removeUnit = useStore((s) => s.removeUnitFromLead);
  const updateNotesAndBudget = useStore((s) => s.updateLeadNotesAndBudget);
  const updateLeadContacted = useStore((s) => s.updateLeadContacted);
  const addLeadActivity = useStore((s) => s.addLeadActivity);
  const updateLeadPriority = useStore((s) => s.updateLeadPriority);
  const updateLeadDetails = useStore((s) => s.updateLeadDetails);
  const incrementWhatsAppSends = useStore((s) => s.incrementWhatsAppSends);

  const user = useStore((s) => s.user);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", budget: 10, interest: "", notes: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  // Lead Details Modal State (Notion-style detail page)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Custom manual note logger input state
  const [newNoteText, setNewNoteText] = useState("");

  // Google Calendar Scheduler form state
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDateTime, setMeetingDateTime] = useState("");
  const [meetingType, setMeetingType] = useState<"Google Meet" | "Site Visit">("Google Meet");
  const [inviteText, setInviteText] = useState("");

  // Search state for compound assignment inside modal
  const [assignSearch, setAssignSearch] = useState("");

  // WhatsApp template dialog state
  const [whatsappLead, setWhatsappLead] = useState<Lead | null>(null);
  const [customMsg, setCustomMsg] = useState("");

  // Form templates handler
  const applyTemplate = (
    lead: Lead,
    templateType: "welcome" | "followup" | "offer",
    customText?: string,
  ) => {
    const brokerName = user ? user.name : "your Property Atlas broker partner";
    const compoundName = lead.interest ? lead.interest.toUpperCase() : "your preferred project";

    if (customText) {
      setCustomMsg(customText);
      return;
    }

    if (templateType === "welcome") {
      setCustomMsg(
        `Hello ${lead.name},\n\nThis is ${brokerName} from Property Atlas. I noticed your interest in ${compoundName}. I have prepared the latest exclusive availability and pricing brochures for you. Let me know when you are free for a brief call!\n\nBest regards,\n${brokerName}`,
      );
    } else if (templateType === "followup") {
      setCustomMsg(
        `Hi ${lead.name},\n\nJust following up on our discussion regarding ${compoundName}. We have just received an updated release list with highly flexible payment terms. Let me know if you would like me to send it over.\n\nWarm regards,\n${brokerName}`,
      );
    } else if (templateType === "offer") {
      setCustomMsg(
        `Dear ${lead.name},\n\nI have compiled the official proposal for ${compoundName}. The starting entry price for this layout is EGP ${lead.budget}M. Please review the attached document and let me know if we can schedule a site visit.\n\nBest regards,\n${brokerName}`,
      );
    }
  };

  const handleLaunchWhatsApp = (lead: Lead) => {
    const success = incrementWhatsAppSends();
    if (!success) return;

    updateLeadContacted(lead.id);
    const cleanedPhone = lead.phone.replace(/[^0-9]/g, "");
    const phoneWithCode = cleanedPhone.startsWith("0") ? "2" + cleanedPhone : cleanedPhone;
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneWithCode}&text=${encodeURIComponent(customMsg)}`;
    window.open(whatsappUrl, "_blank");
    setWhatsappLead(null);
  };

  // Assign compound to client
  const handleAssignCompound = (leadId: string, compoundSlug: string, startPrice: number) => {
    const compoundObj = compounds.find((c) => c.slug === compoundSlug);
    if (!compoundObj) return;

    const unitDesc = `${compoundObj.name} - Entry Layout (EGP ${startPrice}M+)`;
    assignUnit(leadId, unitDesc);

    // Refresh modal state
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) =>
        prev
          ? {
              ...prev,
              assignedUnits: prev.assignedUnits.includes(unitDesc)
                ? prev.assignedUnits
                : [...prev.assignedUnits, unitDesc],
              activityLog: [
                {
                  id: Math.random().toString(),
                  type: "system",
                  text: `Linked compound unit: ${unitDesc}`,
                  timestamp: Date.now(),
                },
                ...prev.activityLog,
              ],
            }
          : null,
      );
    }
    setAssignSearch("");
  };

  const handleRemoveCompound = (leadId: string, unitDesc: string) => {
    removeUnit(leadId, unitDesc);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) =>
        prev
          ? {
              ...prev,
              assignedUnits: prev.assignedUnits.filter((u) => u !== unitDesc),
              activityLog: [
                {
                  id: Math.random().toString(),
                  type: "system",
                  text: `Removed linked unit: ${unitDesc}`,
                  timestamp: Date.now(),
                },
                ...prev.activityLog,
              ],
            }
          : null,
      );
    }
  };

  const handleAddManualNote = (leadId: string) => {
    if (!newNoteText.trim()) return;
    addLeadActivity(leadId, "note", newNoteText);

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) =>
        prev
          ? {
              ...prev,
              activityLog: [
                {
                  id: Math.random().toString(),
                  type: "note",
                  text: newNoteText,
                  timestamp: Date.now(),
                },
                ...prev.activityLog,
              ],
            }
          : null,
      );
    }
    setNewNoteText("");
  };

  // Google Calendar Integration Handler
  const handleScheduleMeeting = (lead: Lead) => {
    if (!meetingDateTime || !meetingTitle) return;

    const dateObj = new Date(meetingDateTime);
    const formatISO = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const startStr = formatISO(dateObj);
    const endStr = formatISO(new Date(dateObj.getTime() + 60 * 60 * 1000)); // Default 1 hour

    const locationStr =
      meetingType === "Google Meet" ? "Google Meet Link (Auto)" : "Compound Project Site Location";

    // Personalize calendar invite with connected Gmail details
    const organizerName = user ? user.name : "Property Atlas Broker";
    const organizerEmail = user ? user.email : "";
    const detailsStr = `Organizer: ${organizerName} (${organizerEmail})\n\nViewing presentation compiled via Property Atlas workspace.\nClient name: ${lead.name}\nClient budget: EGP ${lead.budget}M.\nClient interest: ${lead.interest || "General"}.`;

    // Construct URL for Google Calendar with attendee/src parameters
    let calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meetingTitle)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(detailsStr)}&location=${encodeURIComponent(locationStr)}`;
    if (organizerEmail) {
      calendarUrl += `&add=${encodeURIComponent(organizerEmail)}`;
    }

    // Log meeting to lead history
    const logMsg = `Scheduled appointment: "${meetingTitle}" on ${dateObj.toLocaleDateString()} at ${dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} (${meetingType})`;
    addLeadActivity(lead.id, "meeting", logMsg);

    // Refresh details modal
    if (selectedLead && selectedLead.id === lead.id) {
      setSelectedLead((prev) =>
        prev
          ? {
              ...prev,
              activityLog: [
                {
                  id: Math.random().toString(),
                  type: "meeting",
                  text: logMsg,
                  timestamp: Date.now(),
                },
                ...(prev.activityLog || []),
              ],
            }
          : null,
      );
    }

    // Set copyable WhatsApp text
    setInviteText(
      `Hello ${lead.name},\n\nLooking forward to our scheduled session: *${meetingTitle}*.\n📅 Date: ${dateObj.toLocaleDateString()}\n⏰ Time: ${dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}\n📍 Location: ${meetingType === "Google Meet" ? "Google Meet Video Call" : "Compound Showroom Area"}.\n\nOrganizer: ${organizerName} (${organizerEmail})\n\nLet me know if you would like me to adjust the details!\n\nBest regards,\n${organizerName}`,
    );

    // Open Calendar invite page
    window.open(calendarUrl, "_blank");
  };

  // Filter compounds based on assign query
  const matchedCompounds = compounds
    .filter(
      (c) =>
        c.name.toLowerCase().includes(assignSearch.toLowerCase()) ||
        c.destination.toLowerCase().includes(assignSearch.toLowerCase()),
    )
    .slice(0, 5);

  // Filter leads based on query
  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      l.phone.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (l.interest && l.interest.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
      (l.notes && l.notes.toLowerCase().includes(debouncedSearchQuery.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">CRM Lead Pipeline</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage client cards, assign compound sheets, log call histories, and dispatch calendar
            slots.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leads, details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-transparent pl-9 pr-4 py-2 text-sm text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <Button
            onClick={() => setOpen(!open)}
            className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Lead
          </Button>
        </div>
      </div>

      {open && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft max-w-2xl animate-in fade-in duration-200">
          <h3 className="text-sm font-semibold text-primary mb-3">Add Client Profile</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Client name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Phone (e.g. +20100...)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Budget (EGP M)"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
            />
            <Input
              placeholder="Interest (compound slug)"
              value={form.interest}
              onChange={(e) => setForm({ ...form, interest: e.target.value })}
            />
            <Input
              className="md:col-span-2"
              placeholder="Notes (requirements, timeline...)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!form.name || !form.phone) return;
                addLead({ ...form, stage: "new" });
                setForm({ name: "", phone: "", budget: 10, interest: "", notes: "" });
                setOpen(false);
              }}
            >
              Add client
            </Button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid gap-4 lg:grid-cols-5 items-start">
        {stages.map((stg) => {
          const items = filteredLeads.filter((l) => l.stage === stg.id);
          return (
            <div
              key={stg.id}
              className={`rounded-2xl border ${stg.border} bg-secondary/10 p-3 h-full min-h-[500px]`}
            >
              <div className="flex items-center justify-between px-1 border-b border-border/40 pb-2 mb-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${stg.color}`}
                >
                  {stg.label}
                </span>
                <span className="text-xs font-bold text-muted-foreground">{items.length}</span>
              </div>

              <div className="space-y-3">
                {items.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-xl border border-border/60 bg-card p-3.5 shadow-sm hover:shadow transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="min-w-0 cursor-pointer flex-1"
                        onClick={() => {
                          setSelectedLead(l);
                          setMeetingTitle(`Viewing with ${l.name}`);
                        }}
                      >
                        <div className="font-semibold text-primary truncate hover:text-accent flex items-center gap-1.5">
                          {l.name}
                          {l.priority === "high" && (
                            <Flame className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" /> {l.phone}
                        </div>
                      </div>
                      <button
                        onClick={() => removeLead(l.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-1 border-t border-b border-border/40 py-2 my-2 text-xs">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">
                          Budget
                        </div>
                        <div className="font-semibold text-primary mt-0.5">EGP {l.budget}M</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">
                          Interest
                        </div>
                        <div className="font-semibold text-accent mt-0.5 truncate">
                          {l.interest || "General"}
                        </div>
                      </div>
                    </div>

                    {/* Link Unit checklist tags */}
                    {(l.assignedUnits || []).length > 0 && (
                      <div className="space-y-1 my-2">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">
                          Linked Units
                        </span>
                        <div className="space-y-1">
                          {(l.assignedUnits || []).slice(0, 2).map((unit, idx) => (
                            <div
                              key={idx}
                              className="text-[10px] text-primary truncate bg-secondary/35 p-1 rounded border border-border/40 flex items-center justify-between"
                            >
                              <span className="truncate">{unit}</span>
                            </div>
                          ))}
                          {(l.assignedUnits || []).length > 2 && (
                            <div className="text-[9px] text-muted-foreground italic">
                              + {l.assignedUnits.length - 2} more...
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {l.notes && (
                      <div className="text-xs text-foreground/75 bg-secondary/20 p-2 rounded-lg line-clamp-2 leading-relaxed">
                        {l.notes}
                      </div>
                    )}

                    {/* Action buttons bar */}
                    <div className="mt-4 flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedLead(l);
                          setMeetingTitle(`Viewing with ${l.name}`);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-secondary text-primary hover:bg-secondary/80 transition-all py-1.5 text-xs font-semibold"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          setWhatsappLead(l);
                          applyTemplate(l, "welcome");
                        }}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all p-1.5 text-xs font-semibold w-8 h-8"
                        title="Open WhatsApp templates"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Stage transition buttons */}
                    <div className="mt-3 flex flex-wrap gap-1 border-t border-border/40 pt-2.5">
                      {stages
                        .filter((s) => s.id !== stg.id)
                        .map((s) => (
                          <button
                            key={s.id}
                            onClick={() => updateStage(l.id, s.id)}
                            className="rounded bg-background border border-border/80 px-1 py-0.5 text-[9px] font-semibold text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                          >
                            → {s.label.split(" ")[0]}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground py-10 bg-card/40">
                    Empty stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notion-style Lead Details Side Panel overlay */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl h-full bg-card border-l border-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-accent" /> Client Profile Sheet
                  </h3>
                  <span className="text-[10px] text-muted-foreground">ID: #{selectedLead.id}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedLead(null);
                    setInviteText("");
                    setMeetingDateTime("");
                  }}
                  className="rounded-lg p-1.5 hover:bg-secondary/85 text-muted-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Client Info Grid */}
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={selectedLead.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        updateLeadDetails(selectedLead.id, { name: newName });
                        setSelectedLead((prev) => (prev ? { ...prev, name: newName } : null));
                      }}
                      className="w-full mt-1.5 rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-primary font-semibold focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={selectedLead.phone}
                      onChange={(e) => {
                        const newPhone = e.target.value;
                        updateLeadDetails(selectedLead.id, { phone: newPhone });
                        setSelectedLead((prev) => (prev ? { ...prev, phone: newPhone } : null));
                      }}
                      className="w-full mt-1.5 rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-primary font-semibold focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Sales Budget (EGP Millions)
                    </label>
                    <input
                      type="number"
                      value={selectedLead.budget}
                      onChange={(e) => {
                        const newBudget = Number(e.target.value);
                        updateNotesAndBudget(selectedLead.id, selectedLead.notes || "", newBudget);
                        setSelectedLead((prev) => (prev ? { ...prev, budget: newBudget } : null));
                      }}
                      className="w-full mt-1.5 rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-primary font-bold focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      General Interest Area
                    </label>
                    <input
                      type="text"
                      value={selectedLead.interest || ""}
                      onChange={(e) => {
                        const newInterest = e.target.value;
                        updateLeadDetails(selectedLead.id, { interest: newInterest });
                        setSelectedLead((prev) =>
                          prev ? { ...prev, interest: newInterest } : null,
                        );
                      }}
                      className="w-full mt-1.5 rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-primary font-semibold focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dropdown Selectors for Stage and Priority */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Pipeline Stage
                    </label>
                    <select
                      value={selectedLead.stage}
                      onChange={(e) => {
                        const newStage = e.target.value as LeadStage;
                        updateStage(selectedLead.id, newStage);
                        setSelectedLead((prev) => (prev ? { ...prev, stage: newStage } : null));
                      }}
                      className="w-full mt-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs text-primary font-semibold focus:border-accent focus:outline-none"
                    >
                      {stages.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Lead Priority
                    </label>
                    <select
                      value={selectedLead.priority}
                      onChange={(e) => {
                        const newPriority = e.target.value as "high" | "medium" | "low";
                        updateLeadPriority(selectedLead.id, newPriority);
                        setSelectedLead((prev) =>
                          prev ? { ...prev, priority: newPriority } : null,
                        );
                      }}
                      className="w-full mt-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs text-primary font-semibold focus:border-accent focus:outline-none"
                    >
                      <option value="high">🔥 High Priority</option>
                      <option value="medium">⚡ Medium Priority</option>
                      <option value="low">❄️ Low Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Private Remarks & Call Notes
                  </label>
                  <textarea
                    value={selectedLead.notes}
                    onChange={(e) => {
                      const newNotes = e.target.value;
                      updateNotesAndBudget(selectedLead.id, newNotes, selectedLead.budget);
                      setSelectedLead((prev) => (prev ? { ...prev, notes: newNotes } : null));
                    }}
                    className="w-full mt-1.5 rounded-xl border border-border bg-transparent p-3 text-xs text-primary focus:border-accent focus:outline-none h-20 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Linked Sheets / Assigned Units Section */}
              <div className="border-t border-border/40 pt-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <LinkIcon className="h-4 w-4 text-accent" /> Assigned Project Sheets (
                  {(selectedLead.assignedUnits || []).length})
                </span>

                <div className="space-y-2">
                  {(selectedLead.assignedUnits || []).map((unit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-all"
                    >
                      <div className="text-xs font-semibold text-primary truncate flex-1">
                        {unit}
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        {/* Send Sheet WhatsApp Button */}
                        <button
                          onClick={() => {
                            const msg = `Hello ${selectedLead.name},\n\nI have recommended this property option matching your budget:\n*${unit}*\n\nLet me know if you would like me to arrange a project visit!\n\nBest,`;
                            setWhatsappLead(selectedLead);
                            applyTemplate(selectedLead, "welcome", msg);
                          }}
                          className="p-1.5 rounded bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                          title="Send Sheet directly to WhatsApp"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveCompound(selectedLead.id, unit)}
                          className="p-1.5 rounded bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(selectedLead.assignedUnits || []).length === 0 && (
                    <div className="text-xs text-muted-foreground italic py-1">
                      No units mapped. Search compounds below to assign an option.
                    </div>
                  )}
                </div>

                {/* Compound Searcher to link unit */}
                <div className="space-y-2 bg-secondary/15 p-3 rounded-xl border border-border/40">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Search className="h-3 w-3" /> Link Compound Availability
                  </label>
                  <input
                    type="text"
                    placeholder="Type to search compounds..."
                    value={assignSearch}
                    onChange={(e) => setAssignSearch(e.target.value)}
                    className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-1.5 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                  {assignSearch.length > 0 && (
                    <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-lg mt-1 space-y-1 max-h-36 overflow-y-auto">
                      {matchedCompounds.map((comp) => (
                        <button
                          key={comp.slug}
                          type="button"
                          onClick={() =>
                            handleAssignCompound(selectedLead.id, comp.slug, comp.priceFrom)
                          }
                          className="w-full text-left px-3 py-2 text-xs hover:bg-secondary/40 text-primary transition-all flex items-center justify-between"
                        >
                          <span>
                            {comp.name} ({comp.destination})
                          </span>
                          <span className="font-bold text-accent">EGP {comp.priceFrom}M+</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Google Calendar Scheduler Widget */}
              <div className="border-t border-border/40 pt-5 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center justify-between gap-1.5 w-full">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-accent" /> Google Calendar scheduler
                  </span>
                  {user && (
                    <span className="text-[10px] text-blue-500 font-semibold lowercase">
                      Connected: {user.email}
                    </span>
                  )}
                </div>

                <div className="bg-secondary/10 p-4 rounded-xl border border-border/40 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[9px] font-bold text-muted-foreground uppercase">
                        Appointment Title
                      </label>
                      <input
                        type="text"
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                        className="w-full mt-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-primary focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-muted-foreground uppercase">
                        Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={meetingDateTime}
                        onChange={(e) => setMeetingDateTime(e.target.value)}
                        className="w-full mt-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-primary focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-muted-foreground uppercase">
                        Meeting Type
                      </label>
                      <div className="flex gap-2 mt-1">
                        {(["Google Meet", "Site Visit"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setMeetingType(t)}
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border transition-all ${
                              meetingType === t
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border bg-background text-muted-foreground"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleScheduleMeeting(selectedLead)}
                      disabled={!meetingDateTime}
                      className="rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      Schedule Invite <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Invites link pre-filled display */}
                  {inviteText && (
                    <div className="mt-3 bg-card p-3 rounded-lg border border-border/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-green-500 uppercase flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> Copy WhatsApp Confirmation
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(inviteText);
                          }}
                          className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-1 text-[9px] font-bold"
                        >
                          <Copy className="h-3 w-3" /> Copy Text
                        </button>
                      </div>
                      <p className="text-[10px] text-foreground/80 leading-relaxed italic bg-secondary/25 p-2 rounded whitespace-pre-line">
                        {inviteText}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Timeline Feed */}
              <div className="border-t border-border/40 pt-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <History className="h-4 w-4 text-accent" /> Client Activity History Log
                </span>

                {/* Log Manual Activity Form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Log a client note or call details..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 rounded-xl border border-border/60 bg-transparent px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddManualNote(selectedLead.id)}
                    className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/80 px-3.5 py-2 text-xs font-bold transition-colors"
                  >
                    Log Note
                  </button>
                </div>

                {/* Activities Timeline list */}
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60 pl-6 max-h-60 overflow-y-auto pr-1">
                  {(selectedLead.activityLog || []).map((log) => (
                    <div key={log.id} className="relative space-y-1">
                      {/* Circle Dot indicator */}
                      <span
                        className={`absolute -left-6 top-1 h-2.5 w-2.5 rounded-full border bg-background ${
                          log.type === "note"
                            ? "border-amber-500 bg-amber-500"
                            : log.type === "whatsapp"
                              ? "border-green-500 bg-green-500"
                              : log.type === "meeting"
                                ? "border-blue-500 bg-blue-500"
                                : "border-border"
                        }`}
                      />
                      <div className="flex items-center justify-between text-[9px] text-muted-foreground font-semibold">
                        <span className="uppercase tracking-wider">{log.type}</span>
                        <span>
                          {new Date(log.timestamp).toLocaleDateString()} at{" "}
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed">{log.text}</p>
                    </div>
                  ))}
                  {(selectedLead.activityLog || []).length === 0 && (
                    <div className="text-xs text-muted-foreground italic text-center py-4">
                      No events logged yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-border/40 pt-4 mt-6">
              <Button
                className="w-full rounded-xl"
                onClick={() => {
                  setSelectedLead(null);
                  setInviteText("");
                  setMeetingDateTime("");
                }}
              >
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Template Overlay */}
      {whatsappLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
              <h3 className="font-display font-bold text-primary flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" /> WhatsApp Messenger
              </h3>
              <button
                onClick={() => setWhatsappLead(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-xs text-muted-foreground">
                Recipient:{" "}
                <strong className="text-primary">
                  {whatsappLead.name} ({whatsappLead.phone})
                </strong>
              </div>

              {/* Quick templates chips */}
              <div className="flex gap-2">
                <button
                  onClick={() => applyTemplate(whatsappLead, "welcome")}
                  className="rounded bg-secondary px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-secondary/80"
                >
                  Welcome
                </button>
                <button
                  onClick={() => applyTemplate(whatsappLead, "followup")}
                  className="rounded bg-secondary px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-secondary/80"
                >
                  Followup
                </button>
                <button
                  onClick={() => applyTemplate(whatsappLead, "offer")}
                  className="rounded bg-secondary px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-secondary/80"
                >
                  Proposal
                </button>
              </div>

              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full h-36 rounded-xl border border-border bg-transparent p-3 text-xs text-primary focus:border-accent focus:outline-none resize-none leading-relaxed"
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setWhatsappLead(null)}>
                  Cancel
                </Button>
                <button
                  onClick={() => handleLaunchWhatsApp(whatsappLead)}
                  className="rounded-xl bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-colors px-4 py-2 flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Send to WhatsApp Web
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
