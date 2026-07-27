import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { compounds } from "@/data/compounds";
import { destinations } from "@/data/destinations";
import { buildWebsiteSchema, buildOrganizationSchema, BASE_SITE_URL } from "@/lib/seo";
import { ArrowLeft, MapPin, Building2, Sparkles, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ar/")({
  head: () => ({
    meta: [
      { title: "PropTrack مصر — محرك بحث وعروض كمبوندات الساحل والتجمع وزايد" },
      { name: "description", content: "استعرض كل كمبوندات الساحل الشمالي، New Cairo، و Sheikh Zayed على الخريطة مباشرة. قارن الاسعار وخطة السداد واستلام 2026." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "PropTrack مصر — دليلك لأفضل الكمبوندات والعقارات" },
      { property: "og:description", content: "خريطة تفاعلية لجميع كمبوندات الساحل والتجمع وزايد. اسعار حديثة وأنظمة تقسيط بدون فوائد." },
      { property: "og:image", content: `${BASE_SITE_URL}/logo.png` },
      { property: "og:url", content: `${BASE_SITE_URL}/ar` },
    ],
    links: [
      { rel: "canonical", href: `${BASE_SITE_URL}/ar` },
      { rel: "alternate", hrefLang: "en", href: BASE_SITE_URL },
      { rel: "alternate", hrefLang: "ar", href: `${BASE_SITE_URL}/ar` },
      { rel: "alternate", hrefLang: "x-default", href: BASE_SITE_URL },
    ],
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
  component: ArabicHomePage,
});

function ArabicHomePage() {
  const featured = compounds.filter((c) => ["marassi", "jefaira", "soul", "mivida", "almaza-bay", "hacienda-bay"].includes(c.slug));

  return (
    <Shell>
      <div dir="rtl" className="font-sans text-right">
        {/* Human Review Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
            مراجعة لهجة مصرية: تم اعتماد المصطلحات التسويقية المصرية والعلامات التجارية باللاتينية.
          </span>
          <Link to="/" className="underline text-[11px] font-bold">English Version</Link>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur mb-4">
                <Sparkles className="h-3.5 w-3.5 text-accent" /> منصة العقارات الأولى في مصر
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
                كل كمبوندات الساحل والتجمع وزايد <br />
                <span className="text-accent">على خريطة واحدة.</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-primary-foreground/80 leading-relaxed max-w-xl">
                تصفح أحدث أسعار وتفاصيل وحدات Off-Plan والاستلام الفوري في كمبوندات SODIC، Marassi، Palm Hills، و Mountain View مباشرة مع خطط سداد وتقسيط تصل إلى 8 سنوات.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/map" search={{ search: "", sort: "name-asc", view: "grid" } as any} className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm font-bold shadow-md hover:bg-accent/90">
                  افتح الخريطة التفاعلية
                </Link>
                <Link to="/projects" search={{ search: "", sort: "name-asc", view: "grid" } as any} className="inline-flex items-center justify-center rounded-full border border-white/30 bg-transparent text-white px-6 py-3 text-sm font-semibold hover:bg-white/10">
                  تصفح جميع الكمبوندات (155+)
                </Link>
              </div>
            </div>

            {/* Quick Destination Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destinations.slice(0, 4).map((d) => (
                <Link
                  key={d.slug}
                  to="/ar/destinations/$slug"
                  params={{ slug: d.slug }}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-4 hover:border-accent/50 transition-all"
                >
                  <div className="h-28 rounded-xl overflow-hidden mb-3">
                    <img src={d.hero} alt={d.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="font-bold text-base text-white group-hover:text-accent transition-colors">{d.name}</div>
                  <div className="text-xs text-white/70 mt-1">كمبوندات وتطوير عقاري في {d.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">أبرز الكمبوندات والمشاريع الأكثر طلباً</h2>
              <p className="text-sm text-muted-foreground mt-1">وحدات سكنية وساحلية بأعلى عائد استثماري وأنظمة تقسيط مريحة.</p>
            </div>
            <Link to="/projects" search={{ search: "", sort: "name-asc", view: "grid" } as any} className="text-xs font-bold text-accent hover:underline">
              عرض الكل ←
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((c) => (
              <CompoundCard key={c.slug} c={c} />
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
