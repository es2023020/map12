import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { developers } from "@/data/developers";
import { Search, Building2, TrendingUp, Globe, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";

function LogoBadge({ src, name, className = "" }: { src: string; name: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const initials = name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
  return (
    <div className={`relative overflow-hidden shrink-0 ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center bg-primary">
        <span className="text-primary-foreground font-bold text-sm select-none">{initials}</span>
      </div>
      <img src={src} alt={name}
        className={`absolute inset-0 h-full w-full object-contain bg-white transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)} onError={() => {}} />
    </div>
  );
}

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "Developers — PropTrack" },
      { name: "description", content: "All Egyptian real-estate developers tracked by PropTrack." },
    ],
  }),
  component: DevelopersPage,
});

function DevelopersPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"projects" | "name">("projects");

  const filtered = useMemo(() => {
    let list = developers.filter((d) => {
      if (!q) return true;
      return d.name.toLowerCase().includes(q.toLowerCase()) || d.blurb.toLowerCase().includes(q.toLowerCase());
    });
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [q, sort]);

  const topDevelopers = developers.slice(0, 3);

  return (
    <Shell>
      {/* Hero header */}
      <div className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Property Atlas</div>
              <h1 className="mt-1 font-display text-3xl md:text-4xl font-semibold text-primary">Developers</h1>
              <p className="mt-2 text-muted-foreground max-w-lg">
                {developers.length} developers actively building across Egypt's premium real-estate markets.
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="font-display text-3xl font-semibold text-primary">{developers.length}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Developers</div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold text-primary">
                  {developers.reduce((s, d) => s + d.count, 0)}
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12 lg:px-8">

        {/* Featured top 3 */}
        <div className="mb-10 md:mb-14">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
            <TrendingUp className="h-4 w-4 text-accent" /> Most active developers
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {topDevelopers.map((d) => (
              <Link
                key={d.slug}
                to="/developers/$slug"
                params={{ slug: d.slug }}
                className="group relative flex gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft hover:-translate-y-0.5 hover:shadow-lg hover:border-accent/40 transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-accent/5 group-hover:bg-accent/10 transition-colors" />
                <LogoBadge src={d.logo} name={d.name} className="h-14 w-14 shrink-0 rounded-xl object-contain bg-white border border-border/60 p-1" />
                <div className="min-w-0 relative z-10">
                  <div className="font-display text-lg font-semibold text-primary group-hover:text-accent transition-colors leading-tight">{d.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{d.count} projects tracked</div>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{d.blurb}</p>
                </div>
                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Search + sort bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search developers…" className="pl-9" />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "projects" | "name")}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="projects">Sort: Most projects</option>
            <option value="name">Sort: A–Z</option>
          </select>
          <div className="text-sm text-muted-foreground ml-auto">
            <strong className="text-primary">{filtered.length}</strong> developers
          </div>
        </div>

        {/* All developers grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((d) => (
            <Link
              key={d.slug}
              to="/developers/$slug"
              params={{ slug: d.slug }}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-accent/40"
            >
              <LogoBadge
                src={d.logo}
                name={d.name}
                className="h-12 w-12 shrink-0 rounded-xl object-contain bg-white border border-border/60 p-0.5"
              />
              <div className="min-w-0 flex-1">
                <div className="font-display text-sm font-semibold text-primary group-hover:text-accent transition-colors leading-tight truncate">{d.name}</div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3 shrink-0" />
                  {d.count} {d.count === 1 ? "project" : "projects"}
                </div>
              </div>
              {d.website && (
                <Globe className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-accent shrink-0 transition-colors" />
              )}
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No developers match "<strong>{q}</strong>".
          </div>
        )}
      </div>
    </Shell>
  );
}
