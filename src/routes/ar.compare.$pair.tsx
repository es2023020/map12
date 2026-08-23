import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { compoundBySlug } from "@/data/compounds";
import { getCompareSEO } from "@/lib/seo-templates";
import { buildBreadcrumbSchema, formatEGP } from "@/lib/seo";
import { ArrowLeft, GitCompareArrows, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/ar/compare/$pair")({
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
      "ar",
    );

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "الرئيسية", item: "/ar" },
      { name: "المقارنات", item: "/ar/compare" },
      { name: `${compA.name} ضد ${compB.name}`, item: `/ar/compare/${pairSlug}` },
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
  component: ArabicComparePairPage,
});

function ArabicComparePairPage() {
  const { compA, compB, pairSlug } = Route.useLoaderData();
  const seo = getCompareSEO({ projectA: compA, projectB: compB, pairSlug }, "ar");

  const priceAStr = formatEGP(compA.priceFrom);
  const priceBStr = formatEGP(compB.priceFrom);

  return (
    <Shell>
      <div dir="rtl" className="font-sans text-right">
        {/* Human Review Quality Badge */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
            مقارنة محايدة بالعامية المصرية: تحليل الأسعار وأنظمة السداد للمشروعين.
          </span>
          <Link
            to="/compare/$pair"
            params={{ pair: pairSlug }}
            className="underline text-[11px] font-bold"
          >
            English Page
          </Link>
        </div>

        {/* Header */}
        <div className="bg-primary text-primary-foreground py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-1">
              <GitCompareArrows className="h-3.5 w-3.5" /> مقارنة كمبوندات عقارية
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              مقارنة كمبوند {compA.name} <span className="text-accent font-normal italic">ضد</span>{" "}
              كمبوند {compB.name}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-primary-foreground/80 max-w-3xl">
              تحليل مقارن لأسعار المتر، شركات التطوير العقاري، أنظمة السداد والتقسيط، وسنة الاستلام
              المتوقعة.
            </p>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card A */}
            <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-md">
              <div className="relative h-48 sm:h-56">
                <img src={compA.hero} alt={compA.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 left-4 text-white">
                  <span className="text-xs uppercase font-semibold text-accent">
                    {compA.developer}
                  </span>
                  <h2 className="text-2xl font-bold font-display">{compA.name}</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">المنطقة والوجهة</span>
                  <span className="font-semibold text-foreground">{compA.destination}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">بداية الأسعار</span>
                  <span className="font-bold text-accent">{priceAStr}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">سنة الاستلام والحالة</span>
                  <span className="font-semibold text-foreground">
                    {compA.deliveryYear} ({compA.deliveryYear <= 2027 || compA.status === "RTM" ? "تسليم فوري / جاهز" : "تحت الإنشاء"})
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">حالة التشطيب</span>
                  <span className="font-semibold text-accent">
                    {/core\s*&\s*shell/i.test(compA.blurb) ? "محارة وواجهات" : /semi[- ]finished/i.test(compA.blurb) ? "نصف تشطيب" : "تشطيب كامل"}
                  </span>
                </div>
                <div className="pt-2">
                  <Link
                    to="/ar/projects/$slug"
                    params={{ slug: compA.slug }}
                    className="block w-full text-center py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg"
                  >
                    عرض تفاصيل وحدات {compA.name}
                  </Link>
                </div>
              </div>
            </div>

            {/* Card B */}
            <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-md">
              <div className="relative h-48 sm:h-56">
                <img src={compB.hero} alt={compB.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 left-4 text-white">
                  <span className="text-xs uppercase font-semibold text-accent">
                    {compB.developer}
                  </span>
                  <h2 className="text-2xl font-bold font-display">{compB.name}</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">المنطقة والوجهة</span>
                  <span className="font-semibold text-foreground">{compB.destination}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">بداية الأسعار</span>
                  <span className="font-bold text-accent">{priceBStr}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">سنة الاستلام والحالة</span>
                  <span className="font-semibold text-foreground">
                    {compB.deliveryYear} ({compB.deliveryYear <= 2027 || compB.status === "RTM" ? "تسليم فوري / جاهز" : "تحت الإنشاء"})
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">حالة التشطيب</span>
                  <span className="font-semibold text-accent">
                    {/core\s*&\s*shell/i.test(compB.blurb) ? "محارة وواجهات" : /semi[- ]finished/i.test(compB.blurb) ? "نصف تشطيب" : "تشطيب كامل"}
                  </span>
                </div>
                <div className="pt-2">
                  <Link
                    to="/ar/projects/$slug"
                    params={{ slug: compB.slug }}
                    className="block w-full text-center py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg"
                  >
                    عرض تفاصيل وحدات {compB.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
