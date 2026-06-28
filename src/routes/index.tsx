import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { MapClient } from "@/components/map/MapClient";
import { compounds } from "@/data/compounds";
import { destinations } from "@/data/destinations";
import { developers } from "@/data/developers";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Building2, Users, Sparkles } from "lucide-react";
import { NewLaunchesSlider } from "@/components/NewLaunchesSlider";
import { NewLaunchesDashboard } from "@/components/NewLaunchesDashboard";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PropTrack — Egypt's property intelligence platform for brokers" },
      { name: "description", content: "Every Sahel compound on one map, plus New Cairo and Sheikh Zayed. Built for Egyptian real-estate brokers." },
      { property: "og:title", content: "PropTrack — Real-estate intelligence for Egyptian brokers" },
      { property: "og:description", content: "Interactive map of every Sahel, New Cairo and Sheikh Zayed compound. Project library, broker dashboard, lead pipeline." },
      { property: "og:image", content: "/logo.png" },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = compounds.filter((c) => ["marassi", "jefaira", "soul", "mivida", "almaza-bay", "hacienda-bay"].includes(c.slug));
  const sahelCompounds = compounds.filter((c) => destinations.find((a) => a.slug === c.destination)?.region === "north-coast");

  return (
    <Shell>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-0" />
        <div className="absolute inset-0 opacity-50 mix-blend-screen" style={{
          backgroundImage: "radial-gradient(ellipse at 20% 0%, oklch(0.72 0.12 195 / .5), transparent 50%), radial-gradient(ellipse at 80% 100%, oklch(0.7 0.18 40 / .4), transparent 60%)",
        }} />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="PropTrack" className="h-14 w-14 object-contain drop-shadow-xl" />
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Built for Egyptian brokers
              </span>
            </div>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Every compound. <br />
              <span className="text-accent">One map.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-primary-foreground/80">
              PropTrack is the real-estate intelligence platform for the Egyptian market — Sahel, New Cairo, and Sheikh Zayed, mapped in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/map">
                <Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Explore the Map <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  Browse {compounds.length} projects
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
              <Stat label="Compounds" value={String(compounds.length)} />
              <Stat label="Developers" value={String(developers.length)} />
              <Stat label="Destinations" value={String(destinations.length)} />
            </div>
          </div>
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl lg:h-[520px]">
            <MapClient compounds={sahelCompounds} className="h-full w-full" initialCenter={[31.0, 28.3]} initialZoom={9} />
          </div>
        </div>
      </section>

      {/* New Launches Slider */}
      <NewLaunchesSlider />

      {/* Destinations strip */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <SectionHeader title="Destinations we cover" subtitle="From Sidi Heneish to Tagamo3." link={{ to: "/destinations", label: "All destinations" }} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((a) => (
            <Link key={a.slug} to="/destinations/$slug" params={{ slug: a.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={a.hero} alt={a.name} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
                <div className="font-display text-xl font-semibold">{a.name}</div>
                <div className="mt-0.5 text-xs text-primary-foreground/80">{a.kmRange ?? "Greater Cairo"}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured compounds */}
      <section className="bg-gradient-sand">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <SectionHeader title="Featured compounds" subtitle="Hand-picked launches and benchmarks." link={{ to: "/projects", label: "All projects" }} />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => <CompoundCard key={c.slug} c={c} />)}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: MapPin, title: "Map-first intelligence", body: "Every project pinned, filterable by destination, developer, price and delivery year. Smooth as Google Maps, branded for brokers." },
            { icon: Building2, title: "Compound deep-dives", body: "Developer, payment plan, unit mix, amenities and a mini-map — everything your client asks for in one page." },
            { icon: Users, title: "Broker workspace", body: "Lead pipeline, favorites, side-by-side compare, and tier-based subscriptions." },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-primary">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground lg:p-14">
          <div className="grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
                Stop juggling brochures.<br />Start closing.
              </h2>
              <p className="mt-3 max-w-lg text-primary-foreground/80">
                Get the broker dashboard, full project library, and the interactive map — built specifically for Egypt.
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <Link to="/auth"><Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">Start free</Button></Link>
              <Link to="/admin"><Button size="lg" variant="outline" className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">See plans</Button></Link>
            </div>
          </div>
        </div>
      </section>
      
      <NewLaunchesDashboard />
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-semibold text-accent">{value}</div>
      <div className="text-xs uppercase tracking-wider text-primary-foreground/70">{label}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle, link }: { title: string; subtitle: string; link?: { to: string; label: string } }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-primary">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {link && (
        <Link to={link.to as any} className="group inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-primary">
          {link.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
