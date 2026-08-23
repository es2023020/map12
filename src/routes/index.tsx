import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { MapClient } from "@/components/map/MapClient";
import { compounds } from "@/data/compounds";
import { destinations } from "@/data/destinations";
import { developers } from "@/data/developers";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  Building2,
  Users,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Search,
  Compass,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { NewLaunchesSlider } from "@/components/NewLaunchesSlider";
import { HomeQuickSearch } from "@/components/HomeQuickSearch";
import { TopDevelopersSection } from "@/components/TopDevelopersSection";
import { buildWebsiteSchema, buildOrganizationSchema, BASE_SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Property Atlas — Egypt's Property Intelligence Platform & Compound Atlas" },
      {
        name: "description",
        content:
          "Explore 380+ compounds in Sahel, New Cairo, Sheikh Zayed, and across Egypt. Built for Egyptian buyers, investors, and real estate brokers.",
      },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content: "Property Atlas — Real-Estate Intelligence for Egyptian Brokers",
      },
      {
        property: "og:description",
        content:
          "Interactive map of every Sahel, New Cairo, and Sheikh Zayed compound. Compare prices, delivery years, and availability.",
      },
      { property: "og:image", content: `${BASE_SITE_URL}/logo.png` },
      { property: "og:url", content: BASE_SITE_URL },
    ],
    links: [{ rel: "canonical", href: BASE_SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildWebsiteSchema()),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(buildOrganizationSchema()),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = compounds.filter((c) =>
    ["marassi", "jefaira", "soul", "mivida", "almaza-bay", "hacienda-bay"].includes(c.slug),
  );
  const sahelCompounds = compounds.filter(
    (c) => destinations.find((a) => a.slug === c.destination)?.region === "north-coast",
  );

  return (
    <Shell>
      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground pt-6 sm:pt-10 pb-12 sm:pb-20">
        {/* Ambient Gradient Mesh Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80')] bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary to-background z-0 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 0%, oklch(0.72 0.12 195 / .4), transparent 50%), radial-gradient(ellipse at 80% 100%, oklch(0.7 0.18 40 / .35), transparent 60%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-3.5 py-1.5 text-xs font-semibold text-accent shadow-soft backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Egypt's #1 Real-Estate Atlas & Intelligence Engine</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
                Every Compound. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-300 to-amber-500">
                  One Unified Map.
                </span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-primary-foreground/85 leading-relaxed">
                Empowering Egyptian real-estate brokers, investors, and home buyers with instant
                access to 380+ mapped compounds, masterplans, inventory availability, and developer insights.
              </p>

              {/* Quick Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/map"
                  search={{ destination: "", dev: "", q: "" }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto rounded-full bg-accent text-accent-foreground hover:bg-accent/90 h-13 px-7 text-sm font-extrabold shadow-xl hover:shadow-accent/20 transition-all"
                  >
                    Explore Interactive Map <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link
                  to="/projects"
                  search={{ destination: "", dev: "", q: "" }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto rounded-full border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white h-13 px-7 text-sm font-bold backdrop-blur-md transition-all"
                  >
                    Browse {compounds.length} Compounds
                  </Button>
                </Link>
              </div>

              {/* Live Market Counter Ticker */}
              <div className="pt-4 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg rounded-2xl bg-card/10 border border-white/10 p-4 backdrop-blur-md">
                <Stat label="Mapped Compounds" value={`${compounds.length}+`} />
                <Stat label="Tier-1 Developers" value={String(developers.length)} />
                <Stat label="Master Destinations" value={String(destinations.length)} />
              </div>
            </div>

            {/* Right Map Preview Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[340px] sm:h-[440px] lg:h-[480px] w-full overflow-hidden rounded-3xl border border-white/15 shadow-2xl group">
                <MapClient
                  compounds={sahelCompounds}
                  className="h-full w-full"
                  initialCenter={[31.0, 28.3]}
                  initialZoom={9}
                />

                {/* Floating Map Overlay Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 border border-border/80 px-3 py-1 text-[11px] font-bold text-foreground shadow-lg backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Sahel & Cairo Pins
                  </span>
                  <Link
                    to="/map"
                    search={{ destination: "", dev: "", q: "" }}
                    className="pointer-events-auto rounded-full bg-accent text-accent-foreground px-3.5 py-1 text-xs font-bold shadow-md hover:bg-accent/90 transition-colors"
                  >
                    Full Screen →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Search Bar Widget embedded inside Hero */}
          <div className="mt-10 sm:mt-14">
            <HomeQuickSearch />
          </div>
        </div>
      </section>

      {/* ─── NEW LAUNCHES SLIDER ──────────────────────────────────── */}
      <NewLaunchesSlider />

      {/* ─── DESTINATIONS DISCOVERY STRIP ──────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8">
        <SectionHeader
          title="Destinations We Cover"
          subtitle="Explore compounds grouped by Egypt's top investment hotspots — North Coast to Tagamo3."
          link={{ to: "/destinations", label: "All Destinations" }}
        />
        <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((a) => (
            <Link
              key={a.slug}
              to="/destinations/$slug"
              params={{ slug: a.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:shadow-xl hover:border-accent/50 hover:-translate-y-1"
            >
              <div className="aspect-[16/10] sm:aspect-[4/3] overflow-hidden">
                <img
                  src={a.hero}
                  alt={a.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div className="font-display text-xl font-bold group-hover:text-accent transition-colors">
                    {a.name}
                  </div>
                  <Compass className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-primary-foreground/80">
                  <span>{a.kmRange ?? "Greater Cairo"}</span>
                  <span className="font-semibold text-accent">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED COMPOUNDS SECTION ───────────────────────────── */}
      <section className="bg-gradient-sand py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Featured Benchmark Compounds"
            subtitle="Hand-picked flagship developments, luxury resorts, and high-demand communities."
            link={{ to: "/projects", label: "View All 380+ Projects" }}
          />
          <div className="mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CompoundCard key={c.slug} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOP DEVELOPERS SECTION ───────────────────────────────── */}
      <TopDevelopersSection />

      {/* ─── BROKER & INVESTOR VALUE PROPOSITION ────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20 lg:px-8 border-t border-border/40">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent mb-3">
            <ShieldCheck className="h-3.5 w-3.5" /> Built For Real Estate Professionals
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Why Egyptian Brokers & Investors Use Property Atlas
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-muted-foreground">
            Save hours of searching across scattered PDFs, brochures, and developer price lists.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Map-First Intelligence",
              body: "Every single compound accurately pinned with GPS coordinates. Filter by destination, developer, price, delivery year, or beachfront status.",
            },
            {
              icon: Layers,
              title: "Compound Deep-Dives",
              body: "Complete unit layout breakdown, price ranges per sqm, payment plans, masterplans, and downloadable verified brochures.",
            },
            {
              icon: Users,
              title: "Broker Command Workspace",
              body: "Lead pipeline manager, client favorites, side-by-side compound comparison, and PDF brochure export directly for clients.",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-soft transition-all duration-300 hover:shadow-xl hover:border-accent/40"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent mb-5">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary">{v.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> 100% Free Access for Registered Agents
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BOTTOM CONVERSION CTA BANNER ─────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 sm:p-12 lg:p-16 text-primary-foreground shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80')] bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none" />
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur">
                <TrendingUp className="h-3.5 w-3.5 text-accent" /> Upgrade Your Real-Estate Workflow
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Stop Juggling PDFs & Spreadsheets. <br />
                <span className="text-accent">Start Closing More Deals.</span>
              </h2>
              <p className="max-w-xl text-sm sm:text-base text-primary-foreground/80 leading-relaxed">
                Access the full 380+ compound atlas, interactive GIS map, broker dashboard, and availability scanner in one platform.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link to="/auth" className="w-full">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 h-13 px-8 text-sm font-extrabold shadow-xl transition-all"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/map" search={{ destination: "", dev: "", q: "" }} className="w-full">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 h-13 px-8 text-sm font-bold backdrop-blur-md transition-all"
                >
                  Explore Interactive Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function SectionHeader({
  title,
  subtitle,
  link,
}: {
  title: string;
  subtitle: string;
  link: { to: string; label: string };
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2.5xl sm:text-4xl font-bold tracking-tight text-primary">
          {title}
        </h2>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">{subtitle}</p>
      </div>
      <Link
        to={link.to}
        search={{ destination: "", dev: "", q: "" }}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-accent hover:text-accent/80 transition-colors group shrink-0"
      >
        <span>{link.label}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-2xl sm:text-3xl font-extrabold text-accent leading-none">
        {value}
      </div>
      <div className="mt-1 text-[11px] sm:text-xs font-semibold text-primary-foreground/75 leading-tight">
        {label}
      </div>
    </div>
  );
}
