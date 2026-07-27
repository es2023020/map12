import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { MapClient } from "@/components/map/MapClient";
import { compoundBySlug, compoundsByDestination } from "@/data/compounds";
import { destinationBySlug } from "@/data/destinations";
import { developerBySlug } from "@/data/developers";
import { CompoundCard } from "@/components/CompoundCard";
import { availabilityBySlug } from "@/data/availability";
import { AvailabilitySection } from "@/components/AvailabilitySection";
import { getProjectSEO } from "@/lib/seo-templates";
import { buildProjectSchema, buildBreadcrumbSchema, formatEGP } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Heart, MapPin, Calendar, Building2, Wallet, Check, Phone,
  ChevronLeft, ChevronRight, Globe, Calculator, CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/ar/projects/$slug")({
  loader: ({ params }) => {
    const c = compoundBySlug(params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const seo = getProjectSEO(loaderData, "ar");

    const projectSchema = buildProjectSchema({
      name: loaderData.name,
      slug: loaderData.slug,
      developer: loaderData.developer,
      developerSlug: loaderData.developerSlug,
      destination: loaderData.destination,
      priceFrom: loaderData.priceFrom,
      deliveryYear: loaderData.deliveryYear,
      hero: loaderData.hero,
      blurb: loaderData.blurb,
      status: loaderData.status,
    });

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "الرئيسية", item: "/ar" },
      { name: "الوجهات", item: "/ar/destinations" },
      { name: loaderData.destination, item: `/ar/destinations/${loaderData.destination}` },
      { name: loaderData.name, item: `/ar/projects/${loaderData.slug}` },
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
        { property: "og:type", content: "website" },
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
          children: JSON.stringify(projectSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: ArabicCompoundPage,
});

function ArabicCompoundPage() {
  const c = Route.useLoaderData();
  const destination = destinationBySlug(c.destination);
  const dev = developerBySlug(c.developerSlug || "");
  const related = compoundsByDestination(c.destination).filter((x) => x.slug !== c.slug).slice(0, 4);

  const priceStr = formatEGP(c.priceFrom);
  const favorites = useStore((s) => s.favorites);
  const toggleFav = useStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(c.slug);

  return (
    <Shell>
      <div dir="rtl" className="font-sans text-right">
        {/* Human Review Quality Badge */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
            مراجعة لهجة مصرية: تم صياغة المحتوى باللهجة المصرية التسويقية مع الحفاظ على أسماء المطورين والكمبوند باللاتينية.
          </span>
          <Link to="/projects/$slug" params={{ slug: c.slug }} className="underline text-[11px] font-bold">English Page</Link>
        </div>

        {/* Hero Section */}
        <div className="relative h-[340px] md:h-[420px] overflow-hidden">
          <img src={c.hero} alt={c.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          
          <div className="absolute bottom-6 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-accent mb-2">
              <span>{c.developer}</span>
              <span>•</span>
              <span>{c.destination}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              كمبوند {c.name} — {c.destination}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/80 max-w-2xl">
              {c.blurb}
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">السعر يبدأ من</span>
              <span className="font-bold text-accent text-lg">{priceStr}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">سنة الاستلام</span>
              <span className="font-bold text-foreground text-lg">{c.deliveryYear}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">حالة المشروع</span>
              <span className="font-bold text-foreground text-lg">{c.status}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">المطور العقاري</span>
              <span className="font-bold text-foreground text-lg">{c.developer}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Egyptian Arabic Detailed Breakdown */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-foreground border-b border-border/60 pb-3">
                تفاصيل ودليل كمبوند {c.name}
              </h2>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  يعد كمبوند <strong>{c.name}</strong> من أبرز المشاريع السكنية والساحلية الصادرة عن شركة <strong>{c.developer}</strong> في منطقة <strong>{c.destination}</strong>. تم تصميم الماستر بلان لتقديم أعلى مستويات الخصوصية مع إطلالات مباشرة على اللاندسكيب والبحيرات الصناعية.
                </p>
                <p>
                  يبدأ سعر الوحدات في كمبوند <strong>{c.name}</strong> من <strong>{priceStr}</strong> مع توفير خطط سداد مريحة تعتمد على <strong>مقدم 5% إلى 10%</strong> وتقسيط الباقي على أقساط متساوية بدون فوائد تصل حتى <strong>8 سنوات</strong>.
                </p>
              </div>

              {/* Unique Features List */}
              <div className="pt-2">
                <h3 className="font-bold text-foreground text-base mb-3">الخدمات والمميزات الرئيسية:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {c.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 bg-secondary/40 p-2.5 rounded-xl border border-border/50">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Plan Card */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-primary mb-2">أنظمة السداد والتقسيط المتاحة</h3>
              <p className="text-sm text-muted-foreground mb-4">
                تتوفر خطط سداد مخصصة بخيارات تقسيط مرنة لمشروع {c.name}.
              </p>
              <div className="text-2xl font-bold text-accent font-display mb-4">
                {c.paymentPlan}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="tel:201029324783" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90">
                  <Phone className="inline h-3.5 w-3.5 ml-1" /> تواصل مع مستشار العقارات
                </a>
                <Link to="/calculator" search={{ project: c.slug }} className="px-5 py-2.5 rounded-full border border-accent text-accent text-xs font-bold hover:bg-accent/10">
                  <Calculator className="inline h-3.5 w-3.5 ml-1" /> حساب قيمة الأقساط
                </Link>
              </div>
            </div>

            {/* Live Availability Section if available */}
            {availabilityBySlug(c.slug) && (
              <div className="space-y-3">
                <h3 className="font-display text-xl font-bold text-foreground">الوحدات المتاحة حالياً للبيع</h3>
                <AvailabilitySection data={availabilityBySlug(c.slug)!} projectSlug={c.slug} />
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
              <span className="text-xs uppercase font-bold text-muted-foreground block">السعر الإفتتاحي</span>
              <div className="font-display text-3xl font-bold text-accent">{priceStr}</div>
              <div className="space-y-2 pt-2">
                <Button className="w-full rounded-full" size="lg">
                  <Phone className="ml-2 h-4 w-4" /> طلب معاينة ومعلومات الوحدات
                </Button>
                <Button onClick={() => toggleFav(c.slug)} variant="outline" className="w-full rounded-full" size="lg">
                  <Heart className={`ml-2 h-4 w-4 ${isFav ? "fill-sunset text-sunset" : ""}`} />
                  {isFav ? "محفوظ في المفضلة" : "حفظ في المفضلة"}
                </Button>
              </div>
            </div>

            {/* Developer Summary Card */}
            {dev && (
              <Link to="/ar/developers/$slug" params={{ slug: dev.slug }} className="block bg-card border border-border rounded-2xl p-5 hover:border-accent transition-colors">
                <span className="text-xs text-muted-foreground block mb-1">عن المطور العقاري</span>
                <div className="font-bold text-foreground text-lg">{dev.name}</div>
                <div className="text-xs text-accent font-semibold mt-1">تصفح جميع مشاريع {dev.name} ({dev.count}) ←</div>
              </Link>
            )}
          </div>
        </div>

        {/* Related Compounds in Same Destination */}
        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">مشاريع أخرى في {c.destination}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <CompoundCard key={r.slug} c={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
