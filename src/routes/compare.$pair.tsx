import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { compoundBySlug, compounds } from "@/data/compounds";
import { availabilityBySlug } from "@/data/availability";
import { formatEGP, buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";
import {
  ArrowLeft,
  Check,
  GitCompareArrows,
  MapPin,
  Building2,
  Calendar,
  Waves,
  Star,
  ChevronRight,
} from "lucide-react";

import { getCompareSEO } from "@/lib/seo-templates";

export const Route = createFileRoute("/compare/$pair")({
  loader: ({ params }) => {
    const parts = params.pair.split("-vs-");
    if (parts.length !== 2) throw notFound();
    const compA = compoundBySlug(parts[0]);
    const compB = compoundBySlug(parts[1]);
    if (!compA || !compB) throw notFound();
    return { compA, compB, pairSlug: params.pair };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { compA, compB, pairSlug } = loaderData;

    const seo = getCompareSEO(
      {
        projectA: compA,
        projectB: compB,
        pairSlug,
      },
      "en",
    );

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "Compare", item: "/compare" },
      { name: `${compA.name} vs ${compB.name}`, item: `/compare/${pairSlug}` },
    ]);

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.metaDesc },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.metaDesc },
        { property: "og:image", content: compA.hero },
        { property: "og:url", content: seo.canonical },
      ],
      links: [
        { rel: "canonical", href: seo.canonical },
        { rel: "alternate", hrefLang: "en", href: seo.alternateEn },
        { rel: "alternate", hrefLang: "ar", href: seo.alternateAr },
        { rel: "alternate", hrefLang: "x-default", href: seo.alternateEn },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: ComparePairPage,
});

function ComparePairPage() {
  const { compA, compB, pairSlug } = Route.useLoaderData();
  const availA = availabilityBySlug(compA.slug);
  const availB = availabilityBySlug(compB.slug);

  const priceAStr = formatEGP(compA.priceFrom);
  const priceBStr = formatEGP(compB.priceFrom);

  return (
    <Shell>
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/compare"
            className="inline-flex items-center gap-1.5 text-xs text-primary-foreground/70 hover:text-accent mb-4 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Custom Comparison Tool
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-1">
            <GitCompareArrows className="h-3.5 w-3.5" /> Project Comparison
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {compA.name} <span className="text-accent font-normal italic">vs</span> {compB.name}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-primary-foreground/80 max-w-3xl">
            Side-by-side analysis of starting prices, developer track records, master plan layouts,
            delivery timelines, and unit availability.
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A */}
          <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-md">
            <div className="relative h-48 sm:h-56">
              <img src={compA.hero} alt={compA.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase font-semibold text-accent">
                  {compA.developer}
                </span>
                <h2 className="text-2xl font-bold font-display">{compA.name}</h2>
              </div>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-semibold text-foreground capitalize">
                  {compA.destination.replace(/-/g, " ")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Starting Price</span>
                <span className="font-bold text-accent">{priceAStr}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Delivery Year</span>
                <span className="font-semibold text-foreground">
                  {compA.deliveryYear} ({compA.deliveryYear <= 2027 || compA.status === "RTM" ? "RTM" : "Off-Plan"})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Finishing Specs</span>
                <span className="font-semibold text-foreground font-medium text-accent">
                  {(() => {
                    if (availA && availA.breakdown && availA.breakdown.length > 0) {
                      const finishings = Array.from(
                        new Set(availA.breakdown.map((b) => b.finishing).filter(Boolean)),
                      );
                      if (finishings.length > 0) return finishings.join(" · ");
                    }
                    if (/core\s*&\s*shell/i.test(compA.blurb)) return "Core & Shell";
                    if (/semi[- ]finished/i.test(compA.blurb)) return "Semi Finished";
                    return "Fully Finished";
                  })()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Beachfront Access</span>
                <span className="font-semibold text-foreground">
                  {compA.beachfront ? "Direct Mediterranean Beach" : "Lagoon / Inland"}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground block mb-2 font-medium">Unit Types</span>
                <div className="flex flex-wrap gap-1.5">
                  {compA.types.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <Link
                  to="/projects/$slug"
                  params={{ slug: compA.slug }}
                  className="block w-full text-center py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View Full {compA.name} Specs <ChevronRight className="inline h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card B */}
          <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-md">
            <div className="relative h-48 sm:h-56">
              <img src={compB.hero} alt={compB.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase font-semibold text-accent">
                  {compB.developer}
                </span>
                <h2 className="text-2xl font-bold font-display">{compB.name}</h2>
              </div>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-semibold text-foreground capitalize">
                  {compB.destination.replace(/-/g, " ")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Starting Price</span>
                <span className="font-bold text-accent">{priceBStr}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Delivery Year</span>
                <span className="font-semibold text-foreground">
                  {compB.deliveryYear} ({compB.deliveryYear <= 2027 || compB.status === "RTM" ? "RTM" : "Off-Plan"})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Finishing Specs</span>
                <span className="font-semibold text-foreground font-medium text-accent">
                  {(() => {
                    if (availB && availB.breakdown && availB.breakdown.length > 0) {
                      const finishings = Array.from(
                        new Set(availB.breakdown.map((b) => b.finishing).filter(Boolean)),
                      );
                      if (finishings.length > 0) return finishings.join(" · ");
                    }
                    if (/core\s*&\s*shell/i.test(compB.blurb)) return "Core & Shell";
                    if (/semi[- ]finished/i.test(compB.blurb)) return "Semi Finished";
                    return "Fully Finished";
                  })()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Beachfront Access</span>
                <span className="font-semibold text-foreground">
                  {compB.beachfront ? "Direct Mediterranean Beach" : "Lagoon / Inland"}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground block mb-2 font-medium">Unit Types</span>
                <div className="flex flex-wrap gap-1.5">
                  {compB.types.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <Link
                  to="/projects/$slug"
                  params={{ slug: compB.slug }}
                  className="block w-full text-center py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View Full {compB.name} Specs <ChevronRight className="inline h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Advisory Analysis */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="font-display text-xl font-bold text-foreground">
            Advisory Takeaways: {compA.name} vs {compB.name}
          </h3>
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-3">
            <p>
              When evaluating <strong>{compA.name}</strong> by {compA.developer} against{" "}
              <strong>{compB.name}</strong> by {compB.developer}, buyers should prioritize location
              connectivity, beach frontage type, and initial capital outlay.
            </p>
            <p>
              <strong>{compA.name}</strong> starts at {priceAStr} with expected delivery in{" "}
              {compA.deliveryYear}. It is particularly well-suited for buyers prioritizing{" "}
              {compA.types.join(", ")}.
            </p>
            <p>
              <strong>{compB.name}</strong> offers entry points starting at {priceBStr} and
              estimated delivery in {compB.deliveryYear}. It features unit configurations including{" "}
              {compB.types.join(", ")}.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
