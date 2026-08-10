import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { destinationBySlug } from "@/data/destinations";
import { compoundsByDestination } from "@/data/compounds";
import { getDestinationSEO } from "@/lib/seo-templates";
import { buildDestinationSchema, buildBreadcrumbSchema, formatEGP } from "@/lib/seo";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Wallet,
  TrendingUp,
  CheckCircle2,
  ArrowUpDown,
} from "lucide-react";

export const Route = createFileRoute("/ar/destinations/$slug")({
  loader: ({ params }) => {
    const dest = destinationBySlug(params.slug);
    if (!dest) throw notFound();
    return dest;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const compoundsList = compoundsByDestination(loaderData.slug);
    const minPrice =
      compoundsList.length > 0 ? Math.min(...compoundsList.map((c) => c.priceFrom)) : 0;

    const seo = getDestinationSEO(
      {
        name: loaderData.name,
        slug: loaderData.slug,
        blurb: loaderData.blurb,
        region: loaderData.region,
        projectCount: compoundsList.length,
        minPrice,
      },
      "ar",
    );

    const placeSchema = buildDestinationSchema({
      name: loaderData.name,
      slug: loaderData.slug,
      blurb: loaderData.blurb,
      hero: loaderData.hero,
      center: loaderData.center,
      region: loaderData.region,
    });

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "الرئيسية", item: "/ar" },
      { name: "الوجهات", item: "/ar/destinations" },
      { name: loaderData.name, item: `/ar/destinations/${loaderData.slug}` },
    ]);

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.metaDesc },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.metaDesc },
        { property: "og:image", content: loaderData.hero },
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
          children: JSON.stringify(placeSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: ArabicDestinationPage,
});

function ArabicDestinationPage() {
  const dest = Route.useLoaderData();
  const list = compoundsByDestination(dest.slug);
  const minPrice = list.length > 0 ? Math.min(...list.map((c) => c.priceFrom)) : 0;
  const minPriceStr = minPrice ? formatEGP(minPrice) : "حسب الطلب";

  const kmCompounds = list.filter((c) => c.km !== undefined);
  const hasKmData = kmCompounds.length > 0;
  const minKm = hasKmData ? Math.min(...kmCompounds.map((c) => c.km!)) : null;
  const maxKm = hasKmData ? Math.max(...kmCompounds.map((c) => c.km!)) : null;

  const [sortBy, setSortBy] = useState<string>(hasKmData ? "km-asc" : "price-asc");

  const sortedList = [...list].sort((a, b) => {
    if (sortBy === "km-asc") {
      if (a.km !== undefined && b.km !== undefined) return a.km - b.km;
      if (a.km !== undefined) return -1;
      if (b.km !== undefined) return 1;
      return a.priceFrom - b.priceFrom;
    }
    if (sortBy === "km-desc") {
      if (a.km !== undefined && b.km !== undefined) return b.km - a.km;
      if (a.km !== undefined) return -1;
      if (b.km !== undefined) return 1;
      return a.priceFrom - b.priceFrom;
    }
    if (sortBy === "price-asc") return (a.priceFrom || Infinity) - (b.priceFrom || Infinity);
    if (sortBy === "price-desc") return (b.priceFrom || 0) - (a.priceFrom || 0);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <Shell>
      <div dir="rtl" className="font-sans text-right">
        {/* Human Review Quality Badge */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
            مراجعة لهجة مصرية: تم صياغة دليل الاستثمار العقاري باللهجة المصرية واستهداف الكلمات
            الأكثر بحثاً.
          </span>
          <Link
            to="/destinations/$slug"
            params={{ slug: dest.slug }}
            className="underline text-[11px] font-bold"
          >
            English Page
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative h-[320px] md:h-[400px] overflow-hidden">
          <img src={dest.hero} alt={dest.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-6 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <span className="text-xs uppercase font-bold text-accent tracking-wider">
              دليل كمبوندات {dest.name}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mt-1">
              كمبوندات {dest.name} — الأسعار والمشاريع الجديدة
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/80 max-w-3xl leading-relaxed">
              {dest.blurb}
            </p>
          </div>
        </div>

        {/* Priority Filter Navigation Pills */}
        <div className="bg-card border-b border-border py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-2 text-xs">
            <Link
              to="/ar/destinations/$slug"
              params={{ slug: dest.slug }}
              className="px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground font-bold"
            >
              جميع كمبوندات {dest.name} ({list.length})
            </Link>
            <Link
              to="/ar/destinations/$slug/$filter"
              params={{ slug: dest.slug, filter: "off-plan" }}
              className="px-3.5 py-1.5 rounded-full bg-secondary text-foreground hover:bg-accent/10 border border-border font-medium"
            >
              شقق وفيلات تحت الإنشاء (Off-Plan)
            </Link>
            <Link
              to="/ar/destinations/$slug/$filter"
              params={{ slug: dest.slug, filter: "apartments" }}
              className="px-3.5 py-1.5 rounded-full bg-secondary text-foreground hover:bg-accent/10 border border-border font-medium"
            >
              شقق للبيع بمقدم 10%
            </Link>
            <Link
              to="/ar/destinations/$slug/$filter"
              params={{ slug: dest.slug, filter: "villas" }}
              className="px-3.5 py-1.5 rounded-full bg-secondary text-foreground hover:bg-accent/10 border border-border font-medium"
            >
              فيلات بالتقسيط
            </Link>
            <Link
              to="/ar/destinations/$slug/$filter"
              params={{ slug: dest.slug, filter: "under-10m" }}
              className="px-3.5 py-1.5 rounded-full bg-secondary text-foreground hover:bg-accent/10 border border-border font-medium"
            >
              شقق بأقل من 10 مليون
            </Link>
          </div>
        </div>

        {/* Content & Investment Guide */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground border-b border-border/60 pb-3">
              دليل الاستثمار العقاري والأسعار في {dest.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-bold text-foreground text-base mb-2">
                  الموقع والوصول من القاهرة:
                </h3>
                <p>
                  تتميز منطقة <strong>{dest.name}</strong> بموقع استراتيجي يسهل الوصول إليه عبر
                  الطرق الرئيسية المحورية، مما يضمن أعلى عائد استثماري وسهولة في التنقل على مدار
                  العام.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base mb-2">
                  مؤشرات الأسعار والتقسيط:
                </h3>
                <p>
                  تبدأ أسعار الوحدات في كمبوندات <strong>{dest.name}</strong> من حوالي{" "}
                  <strong>{minPriceStr}</strong> مع خطط سداد مريحة تعتمد على{" "}
                  <strong>مقدم 5% أو 10%</strong> وتقسيط يصل حتى 8 سنوات.
                </p>
              </div>
            </div>
          </div>

          {/* Compound Grid */}
          <div>
            {hasKmData && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-4 sm:px-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold text-sm shadow-sm">
                    كيلو
                  </span>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> ترتيب المشاريع بالكيلو
                    </div>
                    <div className="text-base font-bold text-primary">
                      الشريط الساحلي: من كيلو {minKm} إلى كيلو {maxKm}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-card/80 backdrop-blur border border-border/60 px-3 py-1.5 rounded-full font-medium">
                  تم ترتيب {kmCompounds.length} مشروعاً تنازلياً وتصاعدياً حسب رقم الكيلو الساحلي
                </div>
              </div>
            )}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-foreground">
                قائمة كمبوندات {dest.name} ({list.length})
              </h2>

              <div className="flex items-center gap-2 border border-border bg-card rounded-xl px-3 py-1.5 text-xs shadow-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-accent" />
                <span className="font-medium text-muted-foreground">ترتيب حسب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-primary focus:outline-hidden cursor-pointer"
                >
                  {hasKmData && (
                    <option value="km-asc">الكيلو: من الأقل للأعلى (من كيلو لكيلو)</option>
                  )}
                  {hasKmData && <option value="km-desc">الكيلو: من الأعلى للأقل</option>}
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                  <option value="name">الاسم (أبجدياً)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedList.map((c) => (
                <CompoundCard key={c.slug} c={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
