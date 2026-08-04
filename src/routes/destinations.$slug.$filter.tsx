import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { destinationBySlug, destinations } from "@/data/destinations";
import { compoundsByDestination } from "@/data/compounds";
import { buildDestinationSchema, buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";
import { ArrowLeft, Filter, Building2, MapPin } from "lucide-react";

export const Route = createFileRoute("/destinations/$slug/$filter")({
  loader: ({ params }) => {
    const dest = destinationBySlug(params.slug);
    if (!dest) throw notFound();
    return { dest, filter: params.filter };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { dest, filter } = loaderData;
    const filterFormatted = filter.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const canonicalUrl = getCanonicalUrl(`/destinations/${dest.slug}/${filter}`);

    const pageTitle = `${filterFormatted} Compounds in ${dest.name} — Real Estate & Pricing Guide`;
    const metaDesc = `Explore filtered ${filterFormatted} real estate projects in ${dest.name}, Egypt. View starting prices, payment plans, and delivery dates.`;

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "Destinations", item: "/destinations" },
      { name: dest.name, item: `/destinations/${dest.slug}` },
      { name: filterFormatted, item: `/destinations/${dest.slug}/${filter}` },
    ]);

    return {
      meta: [
        { title: pageTitle },
        { name: "description", content: metaDesc },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: metaDesc },
        { property: "og:image", content: dest.hero },
        { property: "og:url", content: canonicalUrl },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: DestinationFilterPage,
});

function DestinationFilterPage() {
  const { dest, filter } = Route.useLoaderData();
  const allCompounds = compoundsByDestination(dest.slug);

  // Filter logic based on filter string
  const filteredCompounds = allCompounds
    .filter((c) => {
      const f = filter.toLowerCase();
      if (f === "off-plan") return c.status === "Off-Plan";
      if (f === "delivered" || f === "ready-to-move") return c.status === "Delivered";
      if (f === "under-construction") return c.status === "Under Construction";
      if (f === "beachfront") return c.beachfront;
      if (f.startsWith("under-")) {
        const match = f.match(/under-(\d+)m/);
        if (match) {
          const maxM = parseInt(match[1], 10);
          return c.priceFrom > 0 && c.priceFrom <= maxM * 1_000_000;
        }
      }
      if (f === "villas") return c.types.some((t) => /villa|townhouse|twin/i.test(t));
      if (f === "chalets") return c.types.some((t) => /chalet/i.test(t));
      if (f === "apartments") return c.types.some((t) => /apartment|duplex|penthouse/i.test(t));
      return true;
    })
    .sort((a, b) => {
      if (a.km !== undefined && b.km !== undefined) return a.km - b.km;
      if (a.km !== undefined) return -1;
      if (b.km !== undefined) return 1;
      return a.priceFrom - b.priceFrom;
    });

  const filterName = filter.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // Unique Intro Copy based on filter to prevent thin/duplicate content
  const getIntroCopy = () => {
    if (filter === "off-plan") {
      return `Off-plan developments in ${dest.name} represent the highest growth investment vector in Egyptian real estate. Buyers benefit from initial tier-1 developer launch prices, extended 7 to 8 year interest-free installment schedules, and maximum equity appreciation prior to delivery.`;
    }
    if (filter === "delivered" || filter === "ready-to-move") {
      return `Ready-to-move delivered compounds in ${dest.name} offer immediate occupancy and instant rental yield generation. Skip construction wait times and inspect completed community amenities, landscaping, and maintenance operations before finalizing your investment.`;
    }
    if (filter === "beachfront") {
      return `Beachfront compounds in ${dest.name} occupy prime coastal frontage with direct Mediterranean sea access. Known for high summer rental yields and premium resale liquidity, these compounds represent the pinnacle of luxury coastal living in Egypt.`;
    }
    if (filter === "villas") {
      return `Standalone villas, twin houses, and townhouses in ${dest.name} offer spacious private gardens, dedicated parking, and expansive multi-bedroom layouts designed for family luxury and maximum privacy.`;
    }
    return `Explore curated ${filterName} properties in ${dest.name}. Each compound listing provides verified starting prices, developer background, delivery dates, master plans, and unit availability.`;
  };

  return (
    <Shell>
      {/* Header banner */}
      <div className="relative bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/destinations/$slug"
            params={{ slug: dest.slug }}
            className="inline-flex items-center gap-1.5 text-xs text-primary-foreground/70 hover:text-accent mb-4 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to {dest.name} Overview
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-1">
            <Filter className="h-3.5 w-3.5" /> Filtered View
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {filterName} Properties in {dest.name}
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-primary-foreground/80 leading-relaxed">
            {getIntroCopy()}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-border">
          {[
            { label: "All Properties", slug: "" },
            { label: "Off-Plan", slug: "off-plan" },
            { label: "Delivered", slug: "delivered" },
            { label: "Beachfront", slug: "beachfront" },
            { label: "Villas", slug: "villas" },
            { label: "Under 10M EGP", slug: "under-10m" },
          ].map((item) => {
            const isActive = item.slug === filter || (item.slug === "" && !filter);
            return item.slug === "" ? (
              <Link
                key={item.label}
                to="/destinations/$slug"
                params={{ slug: dest.slug }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isActive
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-accent"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.label}
                to="/destinations/$slug/$filter"
                params={{ slug: dest.slug, filter: item.slug }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isActive
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-accent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Compound Grid */}
        {filteredCompounds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompounds.map((c) => (
              <CompoundCard key={c.slug} c={c} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <Building2 className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" />
            <h3 className="text-lg font-semibold text-foreground">No compounds match this specific filter</h3>
            <p className="text-sm text-muted-foreground mt-1">Try exploring all compounds in {dest.name}.</p>
            <Link
              to="/destinations/$slug"
              params={{ slug: dest.slug }}
              className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90"
            >
              Browse all in {dest.name}
            </Link>
          </div>
        )}
      </div>
    </Shell>
  );
}
