import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { developerBySlug } from "@/data/developers";
import { compoundsByDeveloper } from "@/data/compounds";
import { getDeveloperSEO } from "@/lib/seo-templates";
import { buildDeveloperSchema, buildBreadcrumbSchema } from "@/lib/seo";
import { Building2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/ar/developers/$slug")({
  loader: ({ params }) => {
    const dev = developerBySlug(params.slug);
    if (!dev) throw notFound();
    return dev;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const compoundsList = compoundsByDeveloper(loaderData.slug);

    const seo = getDeveloperSEO(
      {
        name: loaderData.name,
        slug: loaderData.slug,
        blurb: loaderData.blurb,
        projectCount: compoundsList.length,
      },
      "ar"
    );

    const devSchema = buildDeveloperSchema({
      name: loaderData.name,
      slug: loaderData.slug,
      blurb: loaderData.blurb,
      logo: loaderData.logo,
    });

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "الرئيسية", item: "/ar" },
      { name: "المطورين", item: "/ar/developers" },
      { name: loaderData.name, item: `/ar/developers/${loaderData.slug}` },
    ]);

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.metaDesc },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.metaDesc },
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
          children: JSON.stringify(devSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: ArabicDeveloperPage,
});

function ArabicDeveloperPage() {
  const dev = Route.useLoaderData();
  const list = compoundsByDeveloper(dev.slug);
  const seo = getDeveloperSEO({ name: dev.name, slug: dev.slug, blurb: dev.blurb, projectCount: list.length }, "ar");

  return (
    <Shell>
      <div dir="rtl" className="font-sans text-right">
        {/* Human Review Quality Badge */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
            مراجعة لهجة مصرية: تم اعتماد اسم المطور باللاتينية {dev.name} مع محتوى تسويقي مصري.
          </span>
          <Link to="/developers/$slug" params={{ slug: dev.slug }} className="underline text-[11px] font-bold">English Page</Link>
        </div>

        {/* Header */}
        <div className="bg-primary text-primary-foreground py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-accent tracking-wider">سجل مشاريع المطور العقاري</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-1">
                {seo.h1}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-primary-foreground/80 max-w-2xl leading-relaxed">
                {dev.blurb || `تصفح كل مشاريع كمبوندات شركة ${dev.name} في مصر.`}
              </p>
            </div>
            {dev.logo && (
              <div className="h-16 w-28 bg-white rounded-2xl p-2 shrink-0 shadow-md">
                <img src={dev.logo} alt={dev.name} className="h-full w-full object-contain" />
              </div>
            )}
          </div>
        </div>

        {/* Compounds Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">مشاريع شركة {dev.name} ({list.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((c) => (
              <CompoundCard key={c.slug} c={c} />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
