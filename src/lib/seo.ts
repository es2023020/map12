export const BASE_SITE_URL = "https://proptrack1.vercel.app";

export function formatEGP(amount: number): string {
  if (!amount) return "Price on Request";
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M EGP`;
  }
  return `${amount.toLocaleString()} EGP`;
}

export function getCanonicalUrl(path: string): string {
  const cleanPath = path.split("?")[0].split("#")[0];
  return `${BASE_SITE_URL}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
}

export function buildProjectSchema(compound: {
  name: string;
  slug: string;
  developer: string;
  developerSlug?: string;
  destination: string;
  priceFrom: number;
  deliveryYear: number;
  hero: string;
  blurb: string;
  status: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${compound.name} Compound`,
    description: compound.blurb,
    url: `${BASE_SITE_URL}/projects/${compound.slug}`,
    image: compound.hero ? [compound.hero] : undefined,
    datePosted: "2026-01-01",
    offers: compound.priceFrom
      ? {
          "@type": "Offer",
          priceCurrency: "EGP",
          price: compound.priceFrom,
          availability: "https://schema.org/InStock",
          validFrom: "2026-01-01",
        }
      : undefined,
    offeredBy: {
      "@type": "Organization",
      name: compound.developer,
      url: `${BASE_SITE_URL}/developers/${compound.developerSlug || compound.developer.toLowerCase().replace(/\s+/g, "-")}`,
    },
    containedInPlace: {
      "@type": "Place",
      name: compound.destination,
      address: {
        "@type": "PostalAddress",
        addressLocality: compound.destination,
        addressCountry: "EG",
      },
    },
  };
}

export function buildDestinationSchema(destination: {
  name: string;
  slug: string;
  blurb: string;
  hero: string;
  center?: [number, number];
  region?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: destination.name,
    description: destination.blurb,
    url: `${BASE_SITE_URL}/destinations/${destination.slug}`,
    image: destination.hero,
    geo: destination.center
      ? {
          "@type": "GeoCoordinates",
          latitude: destination.center[0],
          longitude: destination.center[1],
        }
      : undefined,
    address: {
      "@type": "PostalAddress",
      addressRegion: destination.region || destination.name,
      addressCountry: "EG",
    },
  };
}

export function buildDeveloperSchema(developer: {
  name: string;
  slug: string;
  blurb?: string;
  logo?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: developer.name,
    description: developer.blurb || `${developer.name} real estate developments in Egypt`,
    url: `${BASE_SITE_URL}/developers/${developer.slug}`,
    logo: developer.logo
      ? developer.logo.startsWith("http")
        ? developer.logo
        : `${BASE_SITE_URL}${developer.logo}`
      : undefined,
  };
}

export function buildBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item.startsWith("http") ? it.item : `${BASE_SITE_URL}${it.item}`,
    })),
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PropTrack",
    url: BASE_SITE_URL,
    description: "Egypt's premier real estate compound atlas and property intelligence platform.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_SITE_URL}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PropTrack Egypt",
    url: BASE_SITE_URL,
    logo: `${BASE_SITE_URL}/logo.png`,
    description:
      "Real-estate intelligence and compound search platform for Egyptian property buyers and brokers.",
    sameAs: [],
  };
}
