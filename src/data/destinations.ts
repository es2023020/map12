export type Destination = {
  slug: string;
  name: string;
  region: "north-coast" | "greater-cairo" | "red-sea" | "sinai" | "other";
  color: string; // hex pin color
  city?: string;
  kmRange?: string;
  blurb: string;
  hero: string;
  center: [number, number];
  zoom: number;
};

import { destinationsGenerated } from "./destinations.generated";

const staticDestinations: Destination[] = destinationsGenerated;

export { staticDestinations };

let cachedDestinations: Destination[] | null = null;
let lastDestinationsRead = 0;

function getActiveDestinations(): Destination[] {
  const now = Date.now();
  if (cachedDestinations && now - lastDestinationsRead < 500) {
    return cachedDestinations;
  }
  let activeList = staticDestinations;
  if (typeof window !== "undefined") {
    try {
      const storeStr = localStorage.getItem("proptrack-broker");
      if (storeStr) {
        const parsed = JSON.parse(storeStr);
        if (parsed?.state?.destinationsList?.length) {
          activeList = parsed.state.destinationsList;
        }
      }
    } catch (e) {
      // fallback
    }
  }
  const result = [...activeList];
  for (const sd of staticDestinations) {
    if (!result.some((d) => d.slug === sd.slug)) {
      result.push(sd);
    }
  }
  cachedDestinations = result;
  lastDestinationsRead = now;
  return result;
}

export const destinations: Destination[] = new Proxy(staticDestinations, {
  get(target, prop, receiver) {
    const activeList = getActiveDestinations();
    const val = Reflect.get(activeList, prop, receiver);
    if (typeof val === "function") {
      return val.bind(activeList);
    }
    return val;
  },
  getOwnPropertyDescriptor(target, prop) {
    const activeList = getActiveDestinations();
    return Reflect.getOwnPropertyDescriptor(activeList, prop);
  },
  ownKeys(target) {
    const activeList = getActiveDestinations();
    return Reflect.ownKeys(activeList);
  },
});

export const destinationBySlug = (slug: string) => destinations.find((a) => a.slug === slug);
export const destinationColor = (slug: string) => destinationBySlug(slug)?.color ?? "#3B82F6";

const locationStrings: Record<string, string> = {
  "6th-settlement": "6th Settlement, New Cairo, Cairo Governorate, Egypt",
  "sidi-heneish": "North Coast (Sidi Heneish), Matrouh Governorate, Egypt",
  "ras-el-hekma": "Ras El Hekma, North Coast, Matrouh Governorate, Egypt",
  "al-dabaa": "Al Dabaa, North Coast, Matrouh Governorate, Egypt",
  "ghazala-bay": "Ghazala Bay, North Coast, Matrouh Governorate, Egypt",
  "sidi-abdelrahman": "North Coast (Sidi Abdel Rahman), Matrouh Governorate, Egypt",
  "new-alamein": "New Alamein City, Matrouh Governorate, Egypt",
  "new-cairo": "New Cairo, Cairo Governorate, Egypt",
  "sheikh-zayed": "Sheikh Zayed, Giza Governorate, Egypt",
  "new-zayed": "New Zayed, Giza Governorate, Egypt",
  "6th-october": "6th of October City, Giza Governorate, Egypt",
  "new-administrative-capital": "New Administrative Capital, Cairo Governorate, Egypt",
  "mostakbal-city": "Mostakbal City, New Cairo, Cairo Governorate, Egypt",
  heliopolis: "New Heliopolis, Cairo Governorate, Egypt",
  "ain-sokhna": "Ain Sokhna, Red Sea Governorate, Egypt",
  "red-sea": "Hurghada, Red Sea Governorate, Egypt",
  "south-sinai": "South Sinai Governorate, Egypt",
  fayoum: "Fayoum, Fayoum Governorate, Egypt",
  sarai: "Sarai, New Cairo East, Cairo Governorate, Egypt",
  alexandria: "Alexandria Governorate, Egypt",
  shorouk: "El Shorouk City, Cairo Governorate, Egypt",
  obour: "El Obour City, Qalyubia Governorate, Egypt",
  "eastern-expansion": "Eastern Expansion, East Cairo, Egypt",
  "northern-expansion": "Northern Expansion, West Cairo, Egypt",
};

export const destinationLocationString = (slug: string): string =>
  locationStrings[slug] ?? destinationBySlug(slug)?.name ?? slug;
