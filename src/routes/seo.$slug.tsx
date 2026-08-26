import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { compounds } from "@/data/compounds";
import { CompoundCard } from "@/components/CompoundCard";
import {
  Building2,
  MapPin,
  Sparkles,
  Waves,
  ShieldCheck,
  Check,
  Share2,
  ArrowRight,
  Calculator,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/seo/$slug")({
  component: SeoLandingPage,
});

const SEO_PAGES_DATA: Record<string, {
  title: string;
  metaDesc: string;
  heroHeading: string;
  heroSubheading: string;
  destFilter?: string;
  typeFilter?: string;
  statusFilter?: string;
  keywords: string[];
  faq: { q: string; a: string }[];
}> = {
  "ras-el-hekma-rtm-villas": {
    title: "Ready to Move Villas & Chalets in Ras El Hekma 2026 | Property Atlas",
    metaDesc: "Explore delivered and ready to move beachfront villas, chalets, and twin houses in Ras El Hekma North Coast with 10% down payment over 7 years.",
    heroHeading: "Ready to Move Villas & Chalets in Ras El Hekma",
    heroSubheading: "Instant handover luxury sea-view residences in Egypt's premier Mediterranean destination.",
    destFilter: "ras-el-hekma",
    keywords: ["Ras El Hekma RTM", "Ras El Hekma Villas", "Ready Chalets Ras El Hekma", "Sodic June", "Fouka Bay"],
    faq: [
      {
        q: "What are the starting prices for Ready to Move villas in Ras El Hekma?",
        a: "Ready to Move chalets in Ras El Hekma start from EGP 15.6M, while standalone shoreline villas range from EGP 47M up to EGP 230M depending on direct sea row proximity.",
      },
      {
        q: "What payment plans are available for delivered North Coast units?",
        a: "Most ready-to-move inventory requires a 10% to 20% down payment with remaining balances spread over 4 to 7 years in equal installments.",
      },
    ],
  },
  "new-cairo-admin-offices": {
    title: "Administrative Offices on North 90th St New Cairo | Property Atlas",
    metaDesc: "Discover corporate administrative offices and medical clinics for sale directly fronting North 90th Street in Fifth Settlement New Cairo.",
    heroHeading: "Corporate Administrative Offices on North 90th Street",
    heroSubheading: "Prime mixed-use business developments with 10% down payment over 8 years.",
    destFilter: "new-cairo",
    typeFilter: "Admin",
    keywords: ["W55 New Cairo", "North 90th Offices", "Administrative Clinics Fifth Settlement", "Waterway Offices"],
    faq: [
      {
        q: "What is the entry price for administrative offices in W55 New Cairo?",
        a: "Admin office spaces in W55 on North 90th Street start from EGP 36.56M for 182m² to 185m² floor plates with 10% down payment over 8 years.",
      },
    ],
  },
  "sidi-abdelrahman-chalets": {
    title: "Beachfront Chalets & Cabins in Sidi Abdel Rahman | Property Atlas",
    metaDesc: "Find prime chalets and beach cabins in Sidi Abdel Rahman North Coast with crystal lagoon access and zero down payment options.",
    heroHeading: "Beachfront Chalets & Cabins in Sidi Abdel Rahman",
    heroSubheading: "Exclusive coastal compounds in Egypt's classic white-sand coastline.",
    destFilter: "sidi-abdelrahman",
    keywords: ["Marassi Chalets", "Sidi Abdel Rahman Cabins", "Telal Soul", "Stella Sidi Abdel Rahman"],
    faq: [
      {
        q: "Which compounds offer beachfront chalets in Sidi Abdel Rahman?",
        a: "Top developments include Marassi by Emaar, Telal Soul by Roya, and Diplo Village with chalets starting from EGP 13.1M.",
      },
    ],
  },
  "sheikh-zayed-villas": {
    title: "Luxury Townhouses & Standalone Villas in Sheikh Zayed | Property Atlas",
    metaDesc: "Compare luxury standalone villas, twin houses, and townhouses in Sheikh Zayed and New Zayed with flexible 8 to 10 year installment plans.",
    heroHeading: "Luxury Standalone Villas & Townhouses in Sheikh Zayed",
    heroSubheading: "Gated residential communities in West Cairo with lush green plazas.",
    destFilter: "sheikh-zayed",
    keywords: ["Sheikh Zayed Villas", "New Zayed Townhouses", "ZED West", "V-Levels", "Commonhaus"],
    faq: [
      {
        q: "What are the average villa sizes available in Sheikh Zayed?",
        a: "Townhouse sizes start from 180m² to 240m², while standalone villas span 280m² to 550m².",
      },
    ],
  },
};

function SeoLandingPage() {
  const { slug } = Route.useParams();
  const pageData = SEO_PAGES_DATA[slug] || SEO_PAGES_DATA["ras-el-hekma-rtm-villas"];

  const filteredCompounds = useMemo(() => {
    return compounds.filter((c) => {
      if (pageData.destFilter && c.destination !== pageData.destFilter) return false;
      return true;
    }).slice(0, 8);
  }, [pageData]);

  // Schema Markup (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Property Atlas Egypt",
    "description": pageData.metaDesc,
    "url": `https://propertyatlas.eg/seo/${slug}`,
    "areaServed": "Egypt",
  };

  return (
    <Shell>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <div className="bg-slate-900 text-white border-b border-white/5 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent border border-accent/20">
              <Sparkles className="h-3.5 w-3.5" /> High-Intent Real Estate Guide
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {pageData.heroHeading}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {pageData.heroSubheading}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {pageData.keywords.map((kw, i) => (
                <span key={i} className="rounded-lg bg-slate-800 border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 space-y-12">
        <div>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">
                Featured Verified Developments
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Handpicked projects matching your search criteria with live inventory breakdowns.
              </p>
            </div>

            <Link
              to="/calculator"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-primary hover:bg-secondary transition-all"
            >
              <Calculator className="h-3.5 w-3.5 text-accent" /> Mortgage Calculator
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCompounds.map((compound) => (
              <CompoundCard key={compound.slug} c={compound} />
            ))}
          </div>
        </div>

        {/* FAQ Schema Section */}
        {pageData.faq.length > 0 && (
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-soft">
            <h3 className="font-display text-xl font-bold text-primary border-b border-border pb-3">
              Frequently Asked Questions (FAQ)
            </h3>
            <div className="space-y-4">
              {pageData.faq.map((item, idx) => (
                <div key={idx} className="rounded-2xl bg-secondary/30 p-4 border border-border/40 space-y-1.5">
                  <h4 className="font-bold text-primary text-sm">
                    Q: {item.q}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
