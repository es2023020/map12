import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { compoundBySlug } from "@/data/compounds";
import { availabilityBySlug } from "@/data/availability";
import { GitCompareArrows, X, Download } from "lucide-react";

export const Route = createFileRoute("/dashboard/compare")({
  component: ComparePage,
});

function ComparePage() {
  const items = useStore((s) => s.compareList);
  const remove = useStore((s) => s.toggleCompare);
  const list = items.map(compoundBySlug).filter(Boolean) as NonNullable<
    ReturnType<typeof compoundBySlug>
  >[];

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <GitCompareArrows className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 font-display text-2xl font-semibold text-primary">
          Nothing to compare
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tap the compare icon on a project card to add it here (max 4).
        </p>
        <Link
          to="/projects"
          search={{ destination: "", dev: "", q: "" }}
          className="mt-5 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse projects
        </Link>
      </div>
    );
  }

  const rows: Array<{
    label: string;
    get: (c: NonNullable<ReturnType<typeof compoundBySlug>>) => string;
  }> = [
    { label: "Developer", get: (c) => c.developer },
    {
      label: "Developer History & profile",
      get: (c) =>
        `Project by ${c.developer}. Spanning leading footprints across top Egyptian destinations with proven quality delivery.`,
    },
    { label: "Destination", get: (c) => c.destination.replace(/-/g, " ").toUpperCase() },
    {
      label: "Exact Location Details",
      get: (c) => {
        const avail = availabilityBySlug(c.slug);
        return avail && (avail as any).city
          ? (avail as any).city
          : `${c.destination.replace(/-/g, " ")} region`;
      },
    },
    {
      label: "Status",
      get: (c) => (c.deliveryYear <= 2027 || c.status === "RTM" ? "Ready to Move (RTM)" : "Off-Plan"),
    },
    { label: "Delivery Year", get: (c) => `${c.deliveryYear} (${c.deliveryYear <= 2027 ? "RTM" : "Off-Plan"})` },
    {
      label: "Finishing Specs",
      get: (c) => {
        const avail = availabilityBySlug(c.slug);
        if (avail && avail.breakdown && avail.breakdown.length > 0) {
          const finishings = Array.from(
            new Set(avail.breakdown.map((b) => b.finishing).filter(Boolean)),
          );
          if (finishings.length > 0) return finishings.join(" · ");
        }
        if (/core\s*&\s*shell/i.test(c.blurb)) return "Core & Shell";
        if (/semi[- ]finished/i.test(c.blurb)) return "Semi Finished";
        if (/fully[- ]finished|finished/i.test(c.blurb)) return "Fully Finished";
        return "Fully Finished";
      },
    },
    {
      label: "Key Amenities",
      get: (c) => {
        const avail = availabilityBySlug(c.slug);
        return c.amenities
          ? c.amenities.slice(0, 6).join(", ")
          : (avail as any)?.amenities
            ? (avail as any).amenities.slice(0, 6).join(", ")
            : "Green Areas, Security";
      },
    },
    { label: "Starting price", get: (c) => `EGP ${c.priceFrom}M` },
    { label: "Beachfront", get: (c) => (c.beachfront ? "Yes" : "No") },
    { label: "Project size", get: (c) => c.areaSize ?? "—" },
    { label: "Unit sizes", get: (c) => c.unitSizes ?? "—" },
    { label: "Unit types", get: (c) => c.types.join(", ") },
    { label: "Payment plan", get: (c) => c.paymentPlan },
  ];

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = `Property Atlas Agent Report — ${list.map((c) => c.name).join(" vs ")}`;
    const style = document.createElement("style");
    style.id = "print-only-style";
    style.innerHTML = `
      @media print {
        header, footer, nav, aside, .no-print, button { display: none !important; }
        body { background: white !important; color: black !important; }
        #agent-compare-report { display: block !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
        .shadow-soft, .shadow-sm, .shadow-2xl { box-shadow: none !important; border: 1px solid #ddd !important; }
        tr { page-break-inside: avoid !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.title = originalTitle;
    setTimeout(() => {
      const s = document.getElementById("print-only-style");
      if (s) s.remove();
    }, 1000);
  };

  return (
    <div id="agent-compare-report" className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary">
            Comparing {list.length} compounds
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Agent side-by-side technical specs &amp; availability feed
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="no-print inline-flex items-center gap-1.5 rounded-xl bg-accent text-accent-foreground px-4 py-2 text-xs font-bold transition-all hover:bg-accent/80 shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          Download PDF
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/10">
              <th className="w-40 p-4 text-left text-xs uppercase tracking-wider text-muted-foreground">
                Attribute
              </th>
              {list.map((c) => (
                <th key={c.slug} className="p-4 text-left align-top">
                  <div className="relative">
                    <button
                      onClick={() => remove(c.slug)}
                      className="no-print absolute -top-2 -right-1 rounded-full bg-secondary p-1 text-muted-foreground hover:text-primary"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <img
                      src={c.hero}
                      alt={c.name}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                    <Link
                      to="/projects/$slug"
                      params={{ slug: c.slug }}
                      className="mt-2 block font-display text-base font-semibold text-primary hover:text-accent"
                    >
                      {c.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((r) => (
              <tr key={r.label} className="hover:bg-secondary/10 transition-colors">
                <td className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {r.label}
                </td>
                {list.map((c) => (
                  <td key={c.slug} className="p-4 align-top text-foreground/90 font-medium">
                    {r.get(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Bottom PDF Download Action */}
      <div className="no-print flex justify-center pt-6">
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-2 rounded-xl bg-accent text-accent-foreground px-6 py-3 font-bold text-xs hover:bg-accent/90 transition-all shadow-md"
        >
          <Download className="h-4 w-4" />
          Download Agent Comparison Report (PDF)
        </button>
      </div>
    </div>
  );
}
