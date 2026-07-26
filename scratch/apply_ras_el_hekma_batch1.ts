import * as fs from "fs";
import * as path from "path";
import { compoundsGenerated } from "../src/data/compounds.generated";

console.log("Updating Ras El Hekma projects batch 1...");

const generatedPath = path.join(process.cwd(), "src", "data", "compounds.generated.ts");
const locationsPath = path.join(process.cwd(), "src", "data", "project-locations.ts");
const compoundsPath = path.join(process.cwd(), "src", "data", "compounds.ts");

const rasElHekmaBatch1 = [
  {
    slug: "hacienda-ras-el-hekma",
    name: "Hacienda Ras El Hekma",
    destination: "ras-el-hekma",
    city: "Km 238, Ras El Hekma, North Coast, Egypt",
    lat: 31.144,
    lng: 27.815,
    km: 238,
    developer: "Palm Hills Developments",
    developerSlug: "palm-hills-developments",
    priceFrom: 23.0,
    paymentPlan: "5% down payment · up to 8–10 years equal installments",
    areaSize: "1400 feddan",
    deliveryYear: 2028,
    status: "Under Construction",
    beachfront: true,
    types: ["Chalet", "Apartment", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["4.8 km Beachfront", "Crystal Lagoons", "5-Star Hotels", "Sports Club", "Commercial Retail Strip", "Luxury Clubhouses", "24/7 Security"],
    hero: "/projects/hacienda-ras-el-hekma/1.jpg",
    blurb: "Hacienda Ras El Hekma by Palm Hills Developments — a massive 1,400-feddan flagship Mediterranean resort at Km 238, featuring a 4.8 km beachfront, crystal lagoons, 5-star international hotels, and luxury private residences.",
    highlights: ["4.8 km beachfront", "1,400 feddan masterplan", "5-star international hotels", "Palm Hills flagship"],
    type: "Coastal"
  },
  {
    slug: "modon-ras-el-hekma",
    name: "Modon Ras El Hekma",
    destination: "ras-el-hekma",
    city: "Km 170-220, Ras El Hekma, North Coast, Egypt",
    lat: 31.135,
    lng: 27.765,
    km: 170,
    developer: "Modon Holding",
    developerSlug: "modon-holding",
    priceFrom: 15.9,
    paymentPlan: "5% DP + 5% after 3 months · 8 years equal installments",
    areaSize: "40,000 feddan (Wadi Yemm 2,000 acres)",
    deliveryYear: 2028,
    status: "Under Construction",
    beachfront: true,
    types: ["Chalet", "Apartment", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["44 km Mediterranean Coastline", "Internal International Airport", "Super-yacht Marina", "18-Hole Golf Courses", "Equestrian Center", "5G Smart Infrastructure", "Business District"],
    hero: "/projects/modon-ras-el-hekma/1.jpg",
    blurb: "Modon Ras El Hekma by Modon Holding (Abu Dhabi ADQ) — a landmark 40,000-feddan coastal mega-city featuring 44 km of Mediterranean shoreline, internal international airport, super-yacht marina, golf courses, and Phase 1 Wadi Yemm.",
    highlights: ["44 km coastline", "40,000 feddan mega-city", "Internal international airport", "Phase 1 Wadi Yemm"],
    type: "Coastal"
  },
  {
    slug: "ramla",
    name: "Ramla North Coast",
    destination: "ras-el-hekma",
    city: "Km 215, Ras El Hekma, North Coast, Egypt",
    lat: 31.118,
    lng: 27.702,
    km: 215,
    developer: "Marakez",
    developerSlug: "marakez-properties",
    priceFrom: 17.0,
    paymentPlan: "5% over 7 years or 10% over 8 years equal installments",
    areaSize: "402 feddan",
    deliveryYear: 2028,
    status: "Under Construction",
    beachfront: true,
    types: ["Chalet", "Penthouse", "Duplex", "Twin House", "Standalone Villa"],
    amenities: ["1.4 km Beachfront", "25-acre Swimmable Crystal Lagoon", "The Farm", "Sports Campus", "Boutique Hotel", "Village Street Commercial Strip", "Azza Fahmy Beach Clubhouse"],
    hero: "/projects/ramla/1.jpg",
    blurb: "Ramla North Coast by Marakez — a 402-feddan resort at Km 215 Ras El Hekma, boasting a 1.4 km beachfront, a 25-acre swimmable crystal lagoon, Sports Campus, Village Street, and Azza Fahmy Beach Clubhouse.",
    highlights: ["1.4 km beachfront", "25-acre crystal lagoon", "Azza Fahmy Beach Clubhouse", "402 feddan masterplan"],
    type: "Coastal"
  },
  {
    slug: "azha-north-coast",
    name: "Azha North Coast",
    destination: "ras-el-hekma",
    city: "Km 214, Ras El Hekma, North Coast, Egypt",
    lat: 31.134,
    lng: 27.731,
    km: 214,
    developer: "Madaar Developments",
    developerSlug: "madaar-developments",
    priceFrom: 11.0,
    paymentPlan: "5% down payment · 8 years equal installments",
    areaSize: "250 feddan",
    deliveryYear: 2027,
    status: "Under Construction",
    beachfront: true,
    types: ["Chalet", "Apartment", "Penthouse", "Duplex", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["800 m Beachfront", "45-acre Swimmable Crystal Lagoon", "5-Star Boutique Hotel", "Sports Club", "Commercial Retail Strip", "Upscale Dining", "24/7 Security"],
    hero: "/projects/azha-north-coast/1.jpg",
    blurb: "Azha North Coast by Madaar Developments — a 250-feddan luxury coastal destination at Km 214 Ras El Hekma, featuring an 800m private beach, a 45-acre crystal lagoon, 5-star hotel, and fine dining.",
    highlights: ["800m private beach", "45-acre swimmable lagoon", "5-star boutique hotel", "250 feddan masterplan"],
    type: "Coastal"
  },
  {
    slug: "naia-bay",
    name: "Naia Bay North Coast",
    destination: "ras-el-hekma",
    city: "Km 212, Ras El Hekma, North Coast, Egypt",
    lat: 31.131,
    lng: 27.718,
    km: 212,
    developer: "Naia Developments",
    developerSlug: "naia-developments",
    priceFrom: 9.0,
    paymentPlan: "7%–10% down payment · 7–9 years equal installments",
    areaSize: "112 feddan",
    deliveryYear: 2026,
    status: "Under Construction",
    beachfront: true,
    types: ["Chalet", "Penthouse", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["Greek/Santorini Architecture", "Private Sandy Beach", "60,000 sqm Swimmable Crystal Lagoon", "5-Star Hotel", "Infinity Horizon Pools", "Beach Gym", "Padel Courts", "Commercial Hub"],
    hero: "/projects/naia-bay/1.jpg",
    blurb: "Naia Bay by Naia Developments — a Greek Santorini-inspired 112-feddan beach community at Km 212 Ras El Hekma, featuring a 60,000 sqm crystal lagoon, 5-star hotel, and 15% construction footprint.",
    highlights: ["Greek Santorini architecture", "60,000 sqm crystal lagoon", "15% low building footprint", "112 feddan masterplan"],
    type: "Coastal"
  },
  {
    slug: "el-masyaf",
    name: "El Masyaf North Coast",
    destination: "ras-el-hekma",
    city: "Km 212, Ras El Hekma, North Coast, Egypt",
    lat: 31.129,
    lng: 27.712,
    km: 212,
    developer: "M Squared",
    developerSlug: "m-squared-developments",
    priceFrom: 8.9,
    paymentPlan: "5%–10% down payment · 8–10 years equal installments",
    areaSize: "103 feddan",
    deliveryYear: 2028,
    status: "Under Construction",
    beachfront: true,
    types: ["Cabana", "Chalet", "Apartment", "Penthouse", "Duplex", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["750 m Private Sandy Beach", "Crystal Lagoons", "Barbarossa Beach Club", "Sports Facilities", "Boutique Commercial Strip", "Hospitality Services"],
    hero: "/projects/el-masyaf/1.jpg",
    blurb: "El Masyaf by M Squared — a 103-feddan coastal retreat at Km 212 Ras El Hekma with a 750m beachfront, Barbarossa Beach Club, crystal lagoons, and 80% dedicated landscaping.",
    highlights: ["750m beachfront", "Barbarossa Beach Club", "80% landscape footprint", "103 feddan masterplan"],
    type: "Coastal"
  },
  {
    slug: "fouka-bay",
    name: "Fouka Bay North Coast",
    destination: "ras-el-hekma",
    city: "Km 211, Ras El Hekma, North Coast, Egypt",
    lat: 31.127,
    lng: 27.705,
    km: 211,
    developer: "Tatweer Misr",
    developerSlug: "tatweer-misr",
    priceFrom: 10.0,
    paymentPlan: "10% down payment · 7 years equal installments",
    areaSize: "220 feddan",
    deliveryYear: 2025,
    status: "Under Construction",
    beachfront: true,
    types: ["Chalet", "Apartment", "Penthouse", "Duplex", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["800 m Sandy Beachfront", "Crystal Lagoons by Crystal Lagoons", "House of Development Commercial Strip", "Casa Cook 5-Star Hotel", "Beach Clubhouses", "Water Sports"],
    hero: "/projects/fouka-bay/1.jpg",
    blurb: "Fouka Bay by Tatweer Misr — a 220-feddan terraced Mediterranean resort at Km 211 Ras El Hekma with an 800m sandy beach, swimmable crystal lagoons, and Casa Cook 5-star hotel.",
    highlights: ["800m sandy beach", "Casa Cook 5-star hotel", "Terraced sea view levels", "220 feddan masterplan"],
    type: "Coastal"
  },
  {
    slug: "hacienda-west",
    name: "Hacienda West",
    destination: "ras-el-hekma",
    city: "Km 200, Ras El Hekma, North Coast, Egypt",
    lat: 31.109,
    lng: 27.562,
    km: 200,
    developer: "Palm Hills Developments",
    developerSlug: "palm-hills-developments",
    priceFrom: 15.0,
    paymentPlan: "5%–10% down payment · 7–8 years equal installments",
    areaSize: "137 feddan",
    deliveryYear: 2025,
    status: "Delivered",
    beachfront: true,
    types: ["Chalet", "Apartment", "Penthouse", "Duplex", "Standalone Villa"],
    amenities: ["Exclusive Beachfront", "Signature Beach Clubs & Dining", "Swimming Pools", "Sports Facilities", "Boutique Commercial Area", "24/7 Security"],
    hero: "/projects/hacienda-west/1.jpg",
    gallery: ["/projects/hacienda-west/1.jpg"],
    blurb: "Hacienda West by Palm Hills Developments — an exclusive 137-feddan coastal enclave at Km 200 Ras El Hekma with terraced sea views, signature beach clubs, and luxury summer residences.",
    highlights: ["Km 200 prime location", "Terraced sea view layout", "Signature Palm Hills beach club", "137 feddan masterplan"],
    type: "Coastal"
  },
  {
    slug: "hyde-park-north-seashore",
    name: "Seashore Hyde Park North",
    destination: "ras-el-hekma",
    city: "Km 207, Ras El Hekma, North Coast, Egypt",
    lat: 31.121,
    lng: 27.685,
    km: 207,
    developer: "Hyde Park",
    developerSlug: "hyde-park",
    priceFrom: 8.1,
    paymentPlan: "5% down payment · 8 years equal installments",
    areaSize: "240 feddan",
    deliveryYear: 2028,
    status: "Under Construction",
    beachfront: true,
    types: ["Studio", "Apartment", "Duplex", "Penthouse", "Chalet", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["550 m Sandy Beachfront", "25+ Beach-Entry Pools", "Signature Beach Clubhouses", "Commercial Strip", "Boutique Hotel", "Sports Courts"],
    hero: "/projects/hyde-park-north-seashore/1.jpg",
    blurb: "Seashore (Hyde Park North) by Hyde Park — a 240-feddan terraced resort at Km 207 Ras El Hekma featuring 32m elevations, a 550m beach, 25+ pools, and fully finished residences.",
    highlights: ["550m sandy beach", "32m terraced elevation", "25+ beach-entry pools", "240 feddan masterplan"],
    type: "Coastal"
  },
  {
    slug: "lyv",
    name: "LYV Caesar Ras El Hekma",
    destination: "ras-el-hekma",
    city: "Km 200, Ras El Hekma, North Coast, Egypt",
    lat: 31.108,
    lng: 27.558,
    km: 200,
    developer: "Gates Developments",
    developerSlug: "gates-developments",
    priceFrom: 7.5,
    paymentPlan: "0%–5% down payment · 8–10 years equal installments",
    areaSize: "206 feddan",
    deliveryYear: 2028,
    status: "Under Construction",
    beachfront: true,
    types: ["Apartment", "Chalet", "Duplex", "Penthouse", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["400 m Sandy Beach", "55,000 sqm Swimmable Crystal Lagoon", "21,000 sqm Swimming Pools", "Boutique Hotel", "Elite Clubhouses", "Retail District", "Sports Arena"],
    hero: "/projects/lyv/1.jpg",
    blurb: "LYV Caesar by Gates Developments — a 206-feddan Mediterranean resort at Km 200 Ras El Hekma with 38m sea elevations, a 55,000 sqm crystal lagoon, and 21,000 sqm pool expanses.",
    highlights: ["55,000 sqm crystal lagoon", "38m sea view elevation", "Adjacent to Caesar SODIC", "206 feddan masterplan"],
    type: "Coastal"
  }
];

// Map into compoundsGenerated
let currentList = [...compoundsGenerated];

for (const item of rasElHekmaBatch1) {
  const idx = currentList.findIndex(c => c.slug === item.slug);
  if (idx !== -1) {
    currentList[idx] = { ...currentList[idx], ...item };
    console.log(`Updated existing project: ${item.slug}`);
  } else {
    currentList.push(item as any);
    console.log(`Added new project: ${item.slug}`);
  }
}

// Write back to compounds.generated.ts
const outputContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(currentList, null, 2)};
`;
fs.writeFileSync(generatedPath, outputContent, "utf-8");
console.log("Wrote updated compounds.generated.ts");

// Also update project-locations.ts
let locText = fs.readFileSync(locationsPath, "utf-8");
for (const item of rasElHekmaBatch1) {
  const entry = `  "${item.slug}": { name: "${item.name}", destination: "${item.destination}", location: "${item.city}", mapsUrl: "https://maps.google.com/?q=${encodeURIComponent(item.name)}+Egypt" },`;
  const regex = new RegExp(`\\s*"${item.slug}":\\s*\\{[^}]*\\},`, "g");
  if (locText.match(regex)) {
    locText = locText.replace(regex, "\n" + entry);
  } else {
    locText = locText.replace(
      "export const projectLocations: Record<string, ProjectLocation> = {",
      "export const projectLocations: Record<string, ProjectLocation> = {\n" + entry
    );
  }
}
fs.writeFileSync(locationsPath, locText, "utf-8");
console.log("Wrote updated project-locations.ts");
