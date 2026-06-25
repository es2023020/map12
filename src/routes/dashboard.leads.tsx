import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type LeadStage } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Phone, Trash2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/leads")({
  component: LeadsPage,
});

const stages: Array<{ id: LeadStage; label: string; color: string }> = [
  { id: "new", label: "New", color: "bg-secondary text-primary" },
  { id: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-900" },
  { id: "viewing", label: "Viewing", color: "bg-amber-100 text-amber-900" },
  { id: "negotiating", label: "Negotiating", color: "bg-violet-100 text-violet-900" },
  { id: "closed", label: "Closed", color: "bg-emerald-100 text-emerald-900" },
];

function LeadsPage() {
  const leads = useStore((s) => s.leads);
  const addLead = useStore((s) => s.addLead);
  const updateStage = useStore((s) => s.updateLeadStage);
  const removeLead = useStore((s) => s.deleteLead);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", budget: 10, interest: "", notes: "" });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary">Lead pipeline</h2>
          <p className="mt-1 text-sm text-muted-foreground">Drag-free kanban — click a stage chip to move a lead.</p>
        </div>
        <Button onClick={() => setOpen(!open)} className="rounded-full"><Plus className="mr-1 h-4 w-4" /> New lead</Button>
      </div>

      {open && (
        <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Client name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input type="number" placeholder="Budget (EGP M)" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
            <Input placeholder="Interest (compound or destination)" value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} />
            <Input className="md:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!form.name || !form.phone) return;
              addLead({ ...form, stage: "new" });
              setForm({ name: "", phone: "", budget: 10, interest: "", notes: "" });
              setOpen(false);
            }}>Add lead</Button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        {stages.map((stg) => {
          const items = leads.filter((l) => l.stage === stg.id);
          return (
            <div key={stg.id} className="rounded-2xl border border-border bg-secondary/30 p-3">
              <div className="flex items-center justify-between px-1">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${stg.color}`}>{stg.label}</span>
                <span className="text-xs font-medium text-muted-foreground">{items.length}</span>
              </div>
              <div className="mt-3 space-y-2">
                {items.map((l) => (
                  <div key={l.id} className="rounded-xl border border-border bg-card p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-primary">{l.name}</div>
                        <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" /> {l.phone}
                        </div>
                      </div>
                      <button onClick={() => removeLead(l.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-semibold text-primary">EGP {l.budget}M</span>
                    </div>
                    {l.interest && <div className="mt-1 truncate text-xs text-muted-foreground">→ {l.interest}</div>}
                    {l.notes && <div className="mt-2 line-clamp-2 text-xs text-foreground/70">{l.notes}</div>}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {stages.filter((s) => s.id !== stg.id).map((s) => (
                        <button key={s.id} onClick={() => updateStage(l.id, s.id)}
                          className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-accent hover:text-accent">
                          → {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">No leads</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}