import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { destinationBySlug } from "@/data/destinations";
import { compoundsByDestination } from "@/data/compounds";
import { getDestinationSEO } from "@/lib/seo-templates";
import { buildBreadcrumbSchema } from "@/lib/seo";
import { ArrowLeft, Filter, Building2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/ar/destinations/$slug/$filter")({
  loader: ({ params }) => {
    const dest = destinationBySlug(params.slug);
    if (!dest) throw notFound();
    return { dest, filter: params.filter };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { dest, filter } = loaderData;
    const allCompounds = compoundsByDestination(dest.slug);

    const seo = getDestinationSEO(
      {
        name: dest.name,
        slug: dest.slug,
        blurb: dest.blurb,
        projectCount: allCompounds.length,
        filter,
      },
      "ar"
    );

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "الرئيسية", item: "/ar" },
      { name: "الوجهات", item: "/ar/destinations" },
      { name: dest.name, item: `/ar/destinations/${dest.slug}` },
      { name: filter, item: `/ar/destinations/${dest.slug}/${filter}` },
    ]);

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.metaDesc },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.metaDesc },
        { property: "og:image", content: dest.hero },
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
  component: ArabicDestinationFilterPage,
});

function ArabicDestinationFilterPage() {
  const { dest, filter } = Route.useLoaderData();
  const allCompounds = compoundsByDestination(dest.slug);

  const filteredCompounds = allCompounds
    .filter((c) => {
      const f = filter.toLowerCase();
      if (f === "off-plan") return c.status === "Off-Plan";
      if (f === "rtm" || f === "delivered" || f === "ready-to-move" || f === "under-construction") return c.status === "RTM";
      if (f === "villas") return c.types.some((t) => /villa|townhouse|twin/i.test(t));
      if (f === "apartments") return c.types.some((t) => /apartment|duplex|penthouse/i.test(t));
      if (f.startsWith("under-")) {
        const match = f.match(/under-(\d+)m/);
        if (match) {
          const maxM = parseInt(match[1], 10);
          return c.priceFrom > 0 && c.priceFrom <= maxM * 1_000_000;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (a.km !== undefined && b.km !== undefined) return a.km - b.km;
      if (a.km !== undefined) return -1;
      if (b.km !== undefined) return 1;
      return a.priceFrom - b.priceFrom;
    });

  const seo = getDestinationSEO({ name: dest.name, slug: dest.slug, blurb: dest.blurb, projectCount: allCompounds.length, filter }, "ar");

  return (
    <Shell>
      <div dir="rtl" className="font-sans text-right">
        {/* Human Review Quality Badge */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
            صفحة هبوط مخصصة: استهداف نية البحث باللغة العربية مع أسماء الكمبوند باللاتينية.
          </span>
          <Link to="/destinations/$slug/$filter" params={{ slug: dest.slug, filter }} className="underline text-[11px] font-bold">English Page</Link>
        </div>

        {/* Header */}
        <div className="bg-primary text-primary-foreground py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link to="/ar/destinations/$slug" params={{ slug: dest.slug }} className="inline-flex items-center gap-1.5 text-xs text-primary-foreground/70 hover:text-accent mb-3">
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" /> العودة لدليل كمبوندات {dest.name}
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              {seo.h1}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-primary-foreground/80 max-w-3xl leading-relaxed">
              استعرض قائمة الوحدات والمشاريع المطابقة لـ {filter} في كمبوندات {dest.name} مع خطط سداد بدون فوائد واسعار استثنائية.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {filteredCompounds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompounds.map((c) => (
                <CompoundCard key={c.slug} c={c} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <Building2 className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-bold text-foreground">لا توجد كمبوندات مطابقة لفلتر البحث حالياً</h3>
              <p className="text-sm text-muted-foreground mt-1">تصفح جميع المشاريع المتاحة في {dest.name}.</p>
              <Link to="/ar/destinations/$slug" params={{ slug: dest.slug }} className="inline-flex items-center justify-center mt-4 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                تصفح كل مشاريع {dest.name}
              </Link>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
