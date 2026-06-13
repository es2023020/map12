import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { areas } from "@/data/areas";
import { compounds } from "@/data/compounds";

export const Route = createFileRoute("/areas")({
  head: () => ({
    meta: [
      { title: "Areas — PropTrack" },
      { name: "description", content: "Every coastal zone and Cairo district covered by PropTrack." },
      { property: "og:title", content: "Areas — PropTrack" },
      { property: "og:description", content: "Sahel zones from Sidi Heneish to New Alamein, plus New Cairo and Sheikh Zayed." },
    ],
  }),
  component: AreasIndex,
});

function AreasIndex() {
  const groups = [
    { region: "north-coast" as const, title: "North Coast (Sahel)" },
    { region: "greater-cairo" as const, title: "Greater Cairo" },
  ];
  return (
    <Shell>
      <div className="border-b border-border/60 bg-gradient-sand">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-primary">Areas</h1>
          <p className="mt-2 text-muted-foreground">Every zone covered by PropTrack, with live project counts.</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {groups.map((g) => (
          <section key={g.region} className="mb-12">
            <h2 className="mb-5 font-display text-2xl font-semibold text-primary">{g.title}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {areas.filter((a) => a.region === g.region).map((a) => {
                const count = compounds.filter((c) => c.area === a.slug).length;
                return (
                  <Link key={a.slug} to="/areas/$slug" params={{ slug: a.slug }}
                    className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={a.hero} alt={a.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-xl font-semibold text-primary">{a.name}</h3>
                        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">{count} projects</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{a.kmRange ?? "Greater Cairo"}</div>
                      <p className="mt-3 text-sm text-muted-foreground">{a.blurb}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </Shell>
  );
}