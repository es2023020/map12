import { BASE_SITE_URL, formatEGP } from "./seo";

export type Language = "en" | "ar";

export interface ProjectSEOData {
  name: string;
  slug: string;
  developer: string;
  developerSlug?: string;
  destination: string;
  destinationName?: string;
  priceFrom: number;
  deliveryYear: number;
  blurb: string;
  status: string;
}

export interface DestinationSEOData {
  name: string;
  slug: string;
  blurb: string;
  region?: string;
  projectCount: number;
  minPrice?: number;
  maxPrice?: number;
  filter?: string;
}

export interface DeveloperSEOData {
  name: string;
  slug: string;
  blurb?: string;
  projectCount: number;
}

export interface CompareSEOData {
  projectA: { name: string; slug: string; developer: string; priceFrom: number };
  projectB: { name: string; slug: string; developer: string; priceFrom: number };
  pairSlug: string;
}

// Format destination name cleanly (e.g. "ras-el-hekma" -> "Ras El Hekma")
export function cleanDestName(dest: string): string {
  if (!dest) return "Egypt";
  return dest.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * 1. Project Page SEO Templates
 */
export function getProjectSEO(p: ProjectSEOData, lang: Language = "en") {
  const destName = p.destinationName || cleanDestName(p.destination);
  const priceStr = formatEGP(p.priceFrom);
  const year = p.deliveryYear || 2026;

  if (lang === "ar") {
    const title = `${p.name} — السعر وخطة السداد ${year} | ${destName}`;
    const metaDesc = `مشروع ${p.name} من شركة ${p.developer} في ${destName}. اسعار تبدأ من ${priceStr} واستلام ${year}. تفاصيل كمبوندات ${destName} وتقسيط بدون فوائد.`;
    const h1 = `كمبوند ${p.name} — ${destName}`;
    const canonical = `${BASE_SITE_URL}/ar/projects/${p.slug}`;
    const alternateEn = `${BASE_SITE_URL}/projects/${p.slug}`;

    return { title, metaDesc, h1, canonical, alternateEn, alternateAr: canonical };
  }

  const title = `${p.name} — Price & Payment Plan ${year} | ${destName}`;
  const metaDesc = `Explore ${p.name} by ${p.developer} in ${destName}. Starting price from ${priceStr}, delivery year ${year}. ${p.blurb}`;
  const h1 = `${p.name} by ${p.developer}`;
  const canonical = `${BASE_SITE_URL}/projects/${p.slug}`;
  const alternateAr = `${BASE_SITE_URL}/ar/projects/${p.slug}`;

  return { title, metaDesc, h1, canonical, alternateEn: canonical, alternateAr };
}

/**
 * 2. Destination Page SEO Templates & Filter Landing Page Templates
 */
export function getDestinationSEO(d: DestinationSEOData, lang: Language = "en") {
  const year = new Date().getFullYear();
  const minPriceStr = d.minPrice ? formatEGP(d.minPrice) : "";
  const filterKey = d.filter ? d.filter.toLowerCase() : "";

  if (lang === "ar") {
    let title = `كمبوندات ${d.name} — الأسعار والمشاريع الجديدة ${year}`;
    let metaDesc = `دليل كمبوندات ${d.name} في مصر. استعرض ${d.projectCount} مشروع اسعار تبدأ من ${minPriceStr || "اقل مقدم"} مع خطط سداد وتقسيط يصل الى 8 سنوات.`;
    let h1 = `كمبوندات والمشاريع الجديدة في ${d.name}`;

    if (filterKey === "off-plan") {
      title = `مشاريع تحت الإنشاء وأوف بلان في ${d.name} — تقسيط ${year}`;
      metaDesc = `افضل مشاريع تحت الإنشاء (Off-Plan) في ${d.name}. احجز بمقدم 5% وتقسيط على 8 سنين بأقل سعر افتتاحية.`;
      h1 = `شقق وفيلات تحت الإنشاء في ${d.name}`;
    } else if (filterKey === "villas") {
      title = `فيلات للبيع في ${d.name} بالتقسيط — اسعار ${year}`;
      metaDesc = `تصفح افضل فيلات وتوين هاوس وتاون هاوس للبيع في ${d.name}. خطط سداد مريحة ومساحات مختلفة من كبار المطورين.`;
      h1 = `فيلات للبيع في ${d.name}`;
    } else if (filterKey === "apartments") {
      title = `شقق للبيع في ${d.name} بمقدم 10% — اسعار ${year}`;
      metaDesc = `شقق للبيع في كمبوندات ${d.name}. اختر شقتك بمقدم 10% وتقسيط حتى 8 سنوات بفيو على البحر واللاندسكيب.`;
      h1 = `شقق للبيع في ${d.name}`;
    } else if (filterKey.startsWith("under-")) {
      const match = filterKey.match(/under-(\d+)m/);
      const limit = match ? match[1] : "6";
      title = `شقق بأقل من ${limit} مليون في ${d.name} — اسعار ${year}`;
      metaDesc = `دليل الشقق والوحدات بأقل من ${limit} مليون جنيه في كمبوندات ${d.name}. قارن الأسعار وأنظمة السداد المتاحة.`;
      h1 = `شقق وحدات بأقل من ${limit} مليون في ${d.name}`;
    } else if (filterKey === "investment" || filterKey === "best-investment") {
      title = `افضل مناطق للاستثمار العقاري في ${d.name} — دليل ${year}`;
      metaDesc = `تحليل عوائد الاستثمار العقاري والزيادة الرأسمالية في كمبوندات ${d.name}. اكتشف افضل المشاريع للاستثمار بالتقسيط.`;
      h1 = `افضل فرص الاستثمار العقاري في ${d.name}`;
    }

    const canonical = d.filter
      ? `${BASE_SITE_URL}/ar/destinations/${d.slug}/${d.filter}`
      : `${BASE_SITE_URL}/ar/destinations/${d.slug}`;
    const alternateEn = d.filter
      ? `${BASE_SITE_URL}/destinations/${d.slug}/${d.filter}`
      : `${BASE_SITE_URL}/destinations/${d.slug}`;

    return { title, metaDesc, h1, canonical, alternateEn, alternateAr: canonical };
  }

  let title = `Compounds in ${d.name} — Prices & New Launches ${year}`;
  let metaDesc = `Browse ${d.projectCount} luxury compounds in ${d.name}. Compare starting prices from ${minPriceStr || "developer rates"}, payment plans & delivery dates.`;
  let h1 = `Compounds & Developments in ${d.name}`;

  if (filterKey === "off-plan") {
    title = `Off-Plan Projects in ${d.name} — 2026 Price & Installment Guide`;
    metaDesc = `Explore off-plan compounds in ${d.name}. Lock in early launch prices with 5% down payments and 8-year installments.`;
    h1 = `Off-Plan Properties in ${d.name}`;
  } else if (filterKey === "villas") {
    title = `Villas for Sale in ${d.name} — Prices & Installment Plans`;
    metaDesc = `Browse standalone villas, twin houses and townhouses for sale in ${d.name}. View master plans and developer specs.`;
    h1 = `Villas for Sale in ${d.name}`;
  } else if (filterKey === "apartments") {
    title = `Apartments for Sale in ${d.name} with 10% Down Payment`;
    metaDesc = `Find luxury apartments for sale in ${d.name} compounds. Filter by bedroom count, sea view, and flexible payment terms.`;
    h1 = `Apartments for Sale in ${d.name}`;
  } else if (filterKey.startsWith("under-")) {
    const match = filterKey.match(/under-(\d+)m/);
    const limit = match ? match[1] : "6";
    title = `Properties Under ${limit}M EGP in ${d.name} | Property Atlas`;
    metaDesc = `Browse real estate inventory priced under ${limit} Million EGP in ${d.name}. Compare payment plans and unit layouts.`;
    h1 = `Properties Under ${limit}M EGP in ${d.name}`;
  }

  const canonical = d.filter
    ? `${BASE_SITE_URL}/destinations/${d.slug}/${d.filter}`
    : `${BASE_SITE_URL}/destinations/${d.slug}`;
  const alternateAr = d.filter
    ? `${BASE_SITE_URL}/ar/destinations/${d.slug}/${d.filter}`
    : `${BASE_SITE_URL}/ar/destinations/${d.slug}`;

  return { title, metaDesc, h1, canonical, alternateEn: canonical, alternateAr };
}

/**
 * 3. Developer Page SEO Templates
 */
export function getDeveloperSEO(dev: DeveloperSEOData, lang: Language = "en") {
  if (lang === "ar") {
    const title = `مشاريع ${dev.name} الجديدة في مصر — ${dev.projectCount} كمبوند`;
    const metaDesc = `دليل مشاريع كمبوندات شركة ${dev.name} في مصر. تصفح الأسعار الحالية وخطة السداد لمشاريع ${dev.name} في New Cairo و Sahel و Sheikh Zayed.`;
    const h1 = `مشاريع شركة ${dev.name} في مصر`;
    const canonical = `${BASE_SITE_URL}/ar/developers/${dev.slug}`;
    const alternateEn = `${BASE_SITE_URL}/developers/${dev.slug}`;

    return { title, metaDesc, h1, canonical, alternateEn, alternateAr: canonical };
  }

  const title = `${dev.name} Projects in Egypt — ${dev.projectCount} Compounds`;
  const metaDesc = `Explore ${dev.projectCount} developments by ${dev.name} across Egypt. View current launch prices, payment terms, and master plans.`;
  const h1 = `${dev.name} Real Estate Projects`;
  const canonical = `${BASE_SITE_URL}/developers/${dev.slug}`;
  const alternateAr = `${BASE_SITE_URL}/ar/developers/${dev.slug}`;

  return { title, metaDesc, h1, canonical, alternateEn: canonical, alternateAr };
}

/**
 * 4. Comparison Page SEO Templates
 */
export function getCompareSEO(c: CompareSEOData, lang: Language = "en") {
  if (lang === "ar") {
    const title = `مقارنة ${c.projectA.name} ضد ${c.projectB.name} — الأسعار والموقع`;
    const metaDesc = `مقارنة تفصيلية بين كمبوند ${c.projectA.name} من ${c.projectA.developer} وكمبوند ${c.projectB.name} من ${c.projectB.developer}. قارن سعر المتر والتقسيط والموقع.`;
    const h1 = `مقارنة ${c.projectA.name} ضد ${c.projectB.name}`;
    const canonical = `${BASE_SITE_URL}/ar/compare/${c.pairSlug}`;
    const alternateEn = `${BASE_SITE_URL}/compare/${c.pairSlug}`;

    return { title, metaDesc, h1, canonical, alternateEn, alternateAr: canonical };
  }

  const title = `${c.projectA.name} vs ${c.projectB.name} — Compare Price, Location & Amenities`;
  const metaDesc = `Side-by-side real estate comparison of ${c.projectA.name} by ${c.projectA.developer} and ${c.projectB.name} by ${c.projectB.developer}. Compare prices, payment plans, and delivery dates.`;
  const h1 = `${c.projectA.name} vs ${c.projectB.name}`;
  const canonical = `${BASE_SITE_URL}/compare/${c.pairSlug}`;
  const alternateAr = `${BASE_SITE_URL}/ar/compare/${c.pairSlug}`;

  return { title, metaDesc, h1, canonical, alternateEn: canonical, alternateAr };
}
