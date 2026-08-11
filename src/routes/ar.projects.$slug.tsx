import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Heart,
  MapPin,
  Calendar,
  Building2,
  Wallet,
  Check,
  Phone,
  ChevronLeft,
  ChevronRight,
  Globe,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Sparkles,
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
  const dev = developerBySlug(c.developerSlug || "") || {
    slug: c.developerSlug || "unknown",
    name: c.developer || "Unknown Developer",
    logo: `https://ui-avatars.com/api/?background=1f3a5f&color=fff&bold=true&size=128&name=${encodeURIComponent(c.developer || "D")}`,
    count: 1,
    blurb: `${c.developer} is an active real estate developer with projects tracked on PropTrack.`,
    website: "",
  };
  const related = compoundsByDestination(c.destination)
    .filter((x) => x.slug !== c.slug)
    .slice(0, 4);

  const priceStr = formatEGP(c.priceFrom);
  const favorites = useStore((s) => s.favorites);
  const toggleFav = useStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(c.slug);

  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);

  const user = useStore((s) => s.user);
  const addLead = useStore((s) => s.addLead);

  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadUnit, setLeadUnit] = useState("");
  const [leadInterestType, setLeadInterestType] = useState("Buying");
  const [leadTime, setLeadTime] = useState("Any Time");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (interestModalOpen) {
      setLeadName(user?.name || "");
      setLeadPhone(user?.phone || "");
      if (!leadUnit) {
        setLeadUnit(c.types?.[0] || "Apartment");
      }
      setLeadInterestType("Buying");
      setLeadTime("Any Time");
    }
  }, [interestModalOpen, user, c.types]);

  const handleRegisterInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      toast.error("يرجى ملء الاسم ورقم الهاتف.");
      return;
    }
    setIsSubmitting(true);
    try {
      addLead({
        name: leadName,
        phone: leadPhone,
        budget: c.priceFrom || 0,
        interest: c.slug,
        stage: "new",
        notes: `الوحدة المفضلة: ${leadUnit}\nنوع الاهتمام: ${leadInterestType}\nأفضل وقت للاتصال: ${leadTime}`,
      });
      toast.success("تم تسجيل اهتمامك بنجاح! سيتصل بك أحد وكلائنا قريباً.");
      setInterestModalOpen(false);
    } catch (err) {
      toast.error("فشل في تسجيل الاهتمام. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Load heavy availability data asynchronously in background
    import("@/data/availability").then((mod) => {
      mod.loadAvailabilityAsync().then(() => {
        setAvailabilityLoaded(true);
      });
    });
  }, [c.slug]);

  return (
    <Shell>
      <div dir="rtl" className="font-sans text-right">
        {/* Human Review Quality Badge */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
            مراجعة لهجة مصرية: تم صياغة المحتوى باللهجة المصرية التسويقية مع الحفاظ على أسماء
            المطورين والكمبوند باللاتينية.
          </span>
          <Link
            to="/projects/$slug"
            params={{ slug: c.slug }}
            className="underline text-[11px] font-bold"
          >
            English Page
          </Link>
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
            <p className="mt-2 text-sm sm:text-base text-white/80 max-w-2xl">{c.blurb}</p>
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
                  يعد كمبوند <strong>{c.name}</strong> من أبرز المشاريع السكنية والساحلية الصادرة عن
                  شركة <strong>{c.developer}</strong> في منطقة <strong>{c.destination}</strong>. تم
                  تصميم الماستر بلان لتقديم أعلى مستويات الخصوصية مع إطلالات مباشرة على اللاندسكيب
                  والبحيرات الصناعية.
                </p>
                <p>
                  يبدأ سعر الوحدات في كمبوند <strong>{c.name}</strong> من{" "}
                  <strong>{priceStr}</strong> مع توفير خطط سداد مريحة تعتمد على{" "}
                  <strong>مقدم 5% إلى 10%</strong> وتقسيط الباقي على أقساط متساوية بدون فوائد تصل
                  حتى <strong>8 سنوات</strong>.
                </p>
              </div>

              {/* Unique Features List */}
              <div className="pt-2">
                <h3 className="font-bold text-foreground text-base mb-3">
                  الخدمات والمميزات الرئيسية:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {c.amenities.map((a) => (
                    <div
                      key={a}
                      className="flex items-center gap-2 bg-secondary/40 p-2.5 rounded-xl border border-border/50"
                    >
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Plan Card */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-primary mb-2">
                أنظمة السداد والتقسيط المتاحة
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                تتوفر خطط سداد مخصصة بخيارات تقسيط مرنة لمشروع {c.name}.
              </p>
              <div className="text-2xl font-bold text-accent font-display mb-4">
                {c.paymentPlan}
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:201029324783"
                  className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90"
                >
                  <Phone className="inline h-3.5 w-3.5 ml-1" /> تواصل مع مستشار العقارات
                </a>
                <Link
                  to="/calculator"
                  search={{ project: c.slug }}
                  className="px-5 py-2.5 rounded-full border border-accent text-accent text-xs font-bold hover:bg-accent/10"
                >
                  <Calculator className="inline h-3.5 w-3.5 ml-1" /> حساب قيمة الأقساط
                </Link>
              </div>
            </div>

            {/* Live Availability Section if available */}
            {availabilityBySlug(c.slug) && (
              <div className="space-y-3">
                <h3 className="font-display text-xl font-bold text-foreground">
                  الوحدات المتاحة حالياً للبيع
                </h3>
                <AvailabilitySection
                  data={availabilityBySlug(c.slug)!}
                  projectSlug={c.slug}
                  onRegisterInterest={(type) => {
                    setLeadUnit(type);
                    setInterestModalOpen(true);
                  }}
                />
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
              <span className="text-xs uppercase font-bold text-muted-foreground block">
                السعر الإفتتاحي
              </span>
              <div className="font-display text-3xl font-bold text-accent">{priceStr}</div>
              <div className="space-y-2 pt-2">
                <Button
                  className="w-full rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold cursor-pointer"
                  size="lg"
                  onClick={() => setInterestModalOpen(true)}
                >
                  <Sparkles className="ml-2 h-4 w-4" /> تسجيل الاهتمام بالكمبوند
                </Button>
                <Button
                  onClick={() => toggleFav(c.slug)}
                  variant="outline"
                  className="w-full rounded-full"
                  size="lg"
                >
                  <Heart className={`ml-2 h-4 w-4 ${isFav ? "fill-sunset text-sunset" : ""}`} />
                  {isFav ? "محفوظ في المفضلة" : "حفظ في المفضلة"}
                </Button>
              </div>
            </div>

            {/* Developer Summary Card */}
            {dev && (
              <Link
                to="/ar/developers/$slug"
                params={{ slug: dev.slug }}
                className="block bg-card border border-border rounded-2xl p-5 hover:border-accent transition-colors"
              >
                <span className="text-xs text-muted-foreground block mb-1">عن المطور العقاري</span>
                <div className="font-bold text-foreground text-lg">{dev.name}</div>
                <div className="text-xs text-accent font-semibold mt-1">
                  تصفح جميع مشاريع {dev.name} ({dev.count}) ←
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Related Compounds in Same Destination */}
        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              مشاريع أخرى في {c.destination}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <CompoundCard key={r.slug} c={r} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Register Interest Modal (Arabic) */}
      <Dialog open={interestModalOpen} onOpenChange={setInterestModalOpen}>
        <DialogContent
          className="max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl backdrop-blur-xl animate-fade-in z-50 text-right"
          dir="rtl"
        >
          <DialogHeader className="text-right sm:text-right">
            <DialogTitle className="font-display text-2xl font-bold text-primary">
              تسجيل الاهتمام
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              مهتم بمشروع <strong className="text-primary font-semibold">{c.name}</strong>؟ يرجى ملء
              بياناتك أدناه للتواصل معك.
            </p>
          </DialogHeader>

          <form onSubmit={handleRegisterInterest} className="space-y-4 mt-3">
            <div className="space-y-1.5">
              <label
                htmlFor="ar-lead-name"
                className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
              >
                الاسم بالكامل
              </label>
              <input
                id="ar-lead-name"
                type="text"
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="مثال: أحمد محمد"
                className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="ar-lead-phone"
                className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
              >
                رقم الهاتف
              </label>
              <input
                id="ar-lead-phone"
                type="tel"
                required
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                placeholder="مثال: 01001234567"
                className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15 text-left"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="ar-lead-unit"
                  className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
                >
                  الوحدة المفضلة
                </label>
                <div className="relative">
                  <select
                    id="ar-lead-unit"
                    value={leadUnit}
                    onChange={(e) => setLeadUnit(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border/80 bg-background/50 pl-8 pr-3.5 py-2.5 text-xs font-medium text-foreground transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15 cursor-pointer"
                  >
                    {(c.types && c.types.length > 0
                      ? c.types
                      : ["Apartment", "Chalet", "Villa", "Townhouse", "Twin House"]
                    ).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="ar-lead-interest"
                  className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
                >
                  نوع الاهتمام
                </label>
                <div className="relative">
                  <select
                    id="ar-lead-interest"
                    value={leadInterestType}
                    onChange={(e) => setLeadInterestType(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border/80 bg-background/50 pl-8 pr-3.5 py-2.5 text-xs font-medium text-foreground transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15 cursor-pointer"
                  >
                    <option value="Buying">شراء</option>
                    <option value="Renting">إيجار</option>
                    <option value="Investing">استثمار</option>
                    <option value="Selling">بيع</option>
                  </select>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="ar-lead-time"
                className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
              >
                أفضل وقت للاتصال
              </label>
              <div className="relative">
                <select
                  id="ar-lead-time"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border/80 bg-background/50 pl-8 pr-3.5 py-2.5 text-xs font-medium text-foreground transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15 cursor-pointer"
                >
                  <option value="Any Time">أي وقت</option>
                  <option value="Morning (9 AM - 12 PM)">صباحاً (9 ص - 12 م)</option>
                  <option value="Afternoon (12 PM - 4 PM)">بعد الظهر (12 م - 4 م)</option>
                  <option value="Evening (4 PM - 8 PM)">مساءً (4 م - 8 م)</option>
                </select>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <ChevronDown className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-accent text-accent-foreground font-bold cursor-pointer"
              >
                {isSubmitting ? "جاري الإرسال..." : "سجل اهتمامك"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl cursor-pointer"
                onClick={() => setInterestModalOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
