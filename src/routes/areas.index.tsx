import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { areas } from "@/data/areas";
import { compounds } from "@/data/compounds";
import { MapPin, Waves, Building2 } from "lucide-react";

export const Route = createFileRoute("/areas/")({
  head: () => ({
    meta: [
      { title: "Areas — PropTrack" },
      { name: "description", content: "Every coastal zone and Cairo district covered by PropTrack." },
      { property: "og:title", content: "Areas — PropTrack" },
      { property: "og:description", content: "Sahel zones from Sidi Heneish to New Alamein, plus New Cairo, Sheikh Zayed, Red Sea, Sinai and more." },
    ],
  }),
  component: AreasIndex,
});

const REGION_GROUPS = [
  {
    region: "north-coast" as const,
    title: "North Coast (Sahel)",
    subtitle: "Mediterranean coast — premium summer resorts",
    icon: Waves,
    color: "#06B6D4",
  },
  {
    region: "greater-cairo" as const,
    title: "Greater Cairo",
    subtitle: "Year-round city living — New Cairo, Sheikh Zayed, NAC",
    icon: Building2,
    color: "#8B5CF6",
  },
  {
    region: "red-sea" as const,
    title: "Red Sea",
    subtitle: "Sokhna, Hurghada, El Gouna — sea & sun year-round",
    icon: Waves,
    color: "#F97316",
  },
  {
    region: "sinai" as const,
    title: "South Sinai",
    subtitle: "Sharm El Sheikh & Nabq — diving-grade water",
    icon: Waves,
    color: "#DC2626",
  },
  {
    region: "other" as const,
    title: "Fayoum & Other",
    subtitle: "Lake Qarun, eco-retreats, weekend escapes",
    icon: MapPin,
    color: "#84CC16",
  },
];

function AreasIndex() {
  const totalProjects = compounds.length;

  return (
    <Shell>
      {/* Hero header */}
      <div className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Property Atlas</div>
              <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-primary">Areas</h1>
              <p className="mt-2 max-w-xl text-muted-foreground">
                {areas.length} market zones covered — from the Mediterranean coast to the Red Sea, across Greater Cairo and beyond.
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="font-display text-3xl font-semibold text-primary">{totalProjects}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold text-primary">{areas.length}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Zones</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regions */}
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 space-y-14">
        {REGION_GROUPS.map((g) => {
          const regionAreas = areas.filter((a) => a.region === g.region);
          if (regionAreas.length === 0) return null;
          const regionCount = regionAreas.reduce((sum, a) => sum + compounds.filter((c) => c.area === a.slug).length, 0);

          return (
            <section key={g.region}>
              <div className="mb-6 flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0" style={{ background: g.color + "22" }}>
                  <g.icon className="h-5 w-5" style={{ color: g.color }} />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-primary">{g.title}</h2>
                  <p className="text-sm text-muted-foreground">{g.subtitle} · {regionCount} projects</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {regionAreas.map((a) => {
                  const count = compounds.filter((c) => c.area === a.slug).length;
                  return (
                    <Link
                      key={a.slug}
                      to="/areas/$slug"
                      params={{ slug: a.slug }}
                      className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-accent/40"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={a.hero}
                          alt={a.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                        <div
                          className="absolute left-3 top-3 h-3 w-3 rounded-full ring-2 ring-white shadow"
                          style={{ background: a.color }}
                        />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-display text-lg font-semibold text-white leading-tight">{a.name}</h3>
                          {a.kmRange && (
                            <div className="text-xs text-white/80 mt-0.5">{a.kmRange}</div>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {a.city ?? "Egypt"}
                          </span>
                          <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: a.color + "22", color: a.color }}>
                            {count} {count === 1 ? "project" : "projects"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{a.blurb}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </Shell>
  );
}
