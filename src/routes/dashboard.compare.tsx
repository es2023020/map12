import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { compoundBySlug } from "@/data/compounds";
import { GitCompareArrows, X } from "lucide-react";

export const Route = createFileRoute("/dashboard/compare")({
  component: ComparePage,
});

function ComparePage() {
  const items = useStore((s) => s.compareList);
  const remove = useStore((s) => s.toggleCompare);
  const list = items.map(compoundBySlug).filter(Boolean) as NonNullable<ReturnType<typeof compoundBySlug>>[];

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <GitCompareArrows className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 font-display text-2xl font-semibold text-primary">Nothing to compare</h2>
        <p className="mt-2 text-sm text-muted-foreground">Tap the compare icon on a project card to add it here (max 4).</p>
        <Link to="/projects" className="mt-5 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Browse projects</Link>
      </div>
    );
  }

  const rows: Array<{ label: string; get: (c: NonNullable<ReturnType<typeof compoundBySlug>>) => string }> = [
    { label: "Developer", get: (c) => c.developer },
    { label: "Destination", get: (c) => c.destination },
    { label: "Status", get: (c) => c.status },
    { label: "Delivery", get: (c) => String(c.deliveryYear) },
    { label: "Starting price", get: (c) => `EGP ${c.priceFrom}M` },
    { label: "Beachfront", get: (c) => (c.beachfront ? "Yes" : "No") },
    { label: "Project size", get: (c) => c.areaSize ?? "—" },
    { label: "Unit sizes", get: (c) => c.unitSizes ?? "—" },
    { label: "Unit types", get: (c) => c.types.join(", ") },
    { label: "Payment plan", get: (c) => c.paymentPlan },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-primary">Comparing {list.length} compounds</h2>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-40 p-4 text-left text-xs uppercase tracking-wider text-muted-foreground">Attribute</th>
              {list.map((c) => (
                <th key={c.slug} className="p-4 text-left align-top">
                  <div className="relative">
                    <button onClick={() => remove(c.slug)} className="absolute -top-2 -right-1 rounded-full bg-secondary p-1 text-muted-foreground hover:text-primary"><X className="h-3 w-3" /></button>
                    <img src={c.hero} alt={c.name} className="h-24 w-full rounded-lg object-cover" />
                    <Link to="/projects/$slug" params={{ slug: c.slug }} className="mt-2 block font-display text-base font-semibold text-primary hover:text-accent">{c.name}</Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-border/60 last:border-b-0">
                <td className="p-4 text-xs uppercase tracking-wider text-muted-foreground">{r.label}</td>
                {list.map((c) => (
                  <td key={c.slug} className="p-4 align-top text-foreground/90">{r.get(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}