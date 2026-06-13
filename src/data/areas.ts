export type Area = {
  slug: string;
  name: string;
  region: "north-coast" | "greater-cairo";
  kmRange?: string;
  blurb: string;
  hero: string;
  center: [number, number];
  zoom: number;
};

export const areas: Area[] = [
  {
    slug: "sidi-heneish",
    name: "Sidi Heneish",
    region: "north-coast",
    kmRange: "240–273 km",
    blurb: "The far west of Sahel — clear turquoise water, low density, premium resort projects.",
    hero: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    center: [31.30, 27.35],
    zoom: 12,
  },
  {
    slug: "ras-el-hekma",
    name: "Ras El Hekma",
    region: "north-coast",
    kmRange: "178–238 km",
    blurb: "Egypt's new flagship coastal city — the densest cluster of new launches on the coast.",
    hero: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
    center: [31.18, 27.85],
    zoom: 11,
  },
  {
    slug: "al-dabaa",
    name: "Al Dabaa",
    region: "north-coast",
    kmRange: "155–177 km",
    blurb: "Quiet bays, established families, mature delivered communities.",
    hero: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1600&q=80",
    center: [31.04, 28.15],
    zoom: 12,
  },
  {
    slug: "ghazala-bay",
    name: "Ghazala Bay",
    region: "north-coast",
    kmRange: "145–154 km",
    blurb: "Sheltered bay, calm swim, mid-market established compounds.",
    hero: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    center: [30.94, 28.42],
    zoom: 13,
  },
  {
    slug: "sidi-abdelrahman",
    name: "Sidi Abdelrahman",
    region: "north-coast",
    kmRange: "124–144 km",
    blurb: "The classic Sahel heart — Marassi, Hacienda Bay, mature resort towns.",
    hero: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
    center: [30.90, 28.55],
    zoom: 12,
  },
  {
    slug: "new-alamein",
    name: "New Alamein",
    region: "north-coast",
    kmRange: "100–123 km",
    blurb: "Egypt's new fourth-generation coastal city — year-round towers, downtown core.",
    hero: "https://images.unsplash.com/photo-1496564203457-11bb12075d90?w=1600&q=80",
    center: [30.85, 28.78],
    zoom: 12,
  },
  {
    slug: "new-cairo",
    name: "New Cairo (Tagamo3)",
    region: "greater-cairo",
    blurb: "Tagamo3 El-Khames — Cairo's biggest premium suburb. Mature schools, malls, compounds.",
    hero: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
    center: [30.030, 31.470],
    zoom: 12,
  },
  {
    slug: "sheikh-zayed",
    name: "Sheikh Zayed",
    region: "greater-cairo",
    blurb: "West Cairo's flagship — Zayed, Beverly Hills, Hyde Park West, Sodic West.",
    hero: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
    center: [30.045, 30.975],
    zoom: 12,
  },
];

export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);