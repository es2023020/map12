import fs from 'fs';
import path from 'path';

// We will read compounds.generated.ts, extract the JSON structure, modify it, and write it back.
const root = process.cwd();
const filePath = path.join(root, 'src', 'data', 'compounds.generated.ts');

const content = fs.readFileSync(filePath, 'utf-8');
// Extract the array from `export const compoundsGenerated: Compound[] = [ ... ];`
const arrayMatch = content.match(/export const compoundsGenerated: Compound\[\] = (\[[\s\S]*?\]);/);
if (!arrayMatch) {
  console.error("Could not match compoundsGenerated array!");
  process.exit(1);
}

const list = eval(arrayMatch[1]);
console.log(`Loaded ${list.length} compounds from compounds.generated.ts`);

// 1. Remove sky-north and summer
const filteredList = list.filter((c: any) => c.slug !== 'sky-north' && c.slug !== 'summer');
console.log(`After removing sky-north and summer: ${filteredList.length} compounds`);

// 2. Apply updates
const updates: Record<string, Partial<any>> = {
  "hacienda-blue": {
    destination: "ras-el-hekma",
    city: "Ras El Hekma, North Coast, Egypt",
  },
  "bamboo-iii": {
    destination: "6th-october",
  },
  "alam-al-roum": {
    destination: "sidi-heneish",
    lat: 31.352,
    lng: 27.351,
    developer: "Qatari Diar",
    developerSlug: "qatari-diar",
    priceFrom: 0,
    deliveryYear: 2026,
    status: "Off-Plan",
    beachfront: true,
    types: ["Chalet", "Twin House", "Villa"],
    amenities: ["Yacht Marina", "7.2 km Private Beach", "Luxury Hotels", "Commercial Hubs", "Water Sports", "Smart Infrastructure", "Parks & Public Areas"],
    blurb: "Alam Al Roum by Qatari Diar is a mega-scale coastal resort destination of 5,000 faddans east of Marsa Matrouh, featuring a yacht marina, hotels, and 7.2 km of private beachfront.",
    paymentPlan: "Price on request / Competitive pre-launch valuations",
    areaSize: "5000 feddan",
    unitSizes: "Chalet, Twin House, Villa",
    highlights: ["by Qatari Diar", "7.2 km private beach", "International Yacht Marina"],
    city: "East of Marsa Matrouh, North Coast, Egypt",
    type: "Resort"
  },
  "jamila": {
    destination: "sidi-heneish",
    lat: 31.220,
    lng: 27.480,
    developer: "New Jersey Developments",
    developerSlug: "new-jersey-developments",
    priceFrom: 4.5,
    deliveryYear: 2028,
    status: "Off-Plan",
    beachfront: true,
    types: ["Chalet", "Townhouse", "Twin House", "Villa"],
    amenities: ["Marriott Hotel", "700m Beachfront", "16,000 sqm Pools", "Crystal Lagoons", "Commercial Strip", "Clubhouse", "Gym & Spa", "24/7 Security"],
    blurb: "Jamila Sidi Heneish by New Jersey Developments is a 130-feddan premium beachfront community with a low 9% building footprint, featuring a 5-star Marriott hotel and a 700m private beach.",
    paymentPlan: "5% down payment · installments up to 10 years",
    highlights: ["9% building footprint", "Marriott 5-star hotel", "700m private beach"],
    areaSize: "130 feddan",
    unitSizes: "80–220 m²",
    city: "Sidi Heneish, North Coast, Egypt",
    type: "Resort"
  },
  "hacienda-heneish": {
    destination: "sidi-heneish",
    lat: 31.1927,
    lng: 27.5827,
    developer: "Palm Hills Developments",
    developerSlug: "palm-hills-developments",
    priceFrom: 12.0,
    deliveryYear: 2028,
    status: "Off-Plan",
    beachfront: true,
    types: ["Chalet", "Apartment", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["5-star Hotel", "Serviced Apartments", "Beach Club", "Crystal Lagoons", "Commercial Strip", "Sports Courts", "Kids Areas", "24/7 Security"],
    blurb: "Hacienda Heneish by Palm Hills Developments is a massive 420-feddan coastal retreat in Sidi Heneish, offering premium hospitality, crystal lagoons, and direct beach access to signature turquoise waters.",
    paymentPlan: "5% down payment · installments up to 8 years",
    highlights: ["Palm Hills premium quality", "420 acres masterplan", "Turquoise water beachfront"],
    areaSize: "420 feddan",
    unitSizes: "80–350 m²",
    city: "Sidi Heneish, North Coast, Egypt",
    type: "Resort"
  },
  "silversands": {
    destination: "sidi-heneish",
    lat: 31.193,
    lng: 27.595,
    developer: "Ora Developers",
    developerSlug: "ora-developers",
    priceFrom: 9.7,
    deliveryYear: 2028,
    status: "Off-Plan",
    beachfront: true,
    types: ["Chalet", "Apartment", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["1.2 km Beachfront", "88,000 sqm Lagoons", "Multiple Clubhouses", "Boutique Hotels", "Commercial Hub", "Health & Wellness Club", "Sports Courts", "Open-air Cinema"],
    blurb: "Silversands Sidi Heneish is Ora Developers' flagship WATG-masterplanned resort spanning 506 feddans, featuring 1.2 km of private beachfront and an 88,000 sqm swimmable lagoon.",
    paymentPlan: "5% down payment · installments up to 10 years",
    highlights: ["1.2 km beachfront", "88,000 sqm Crystal Lagoon", "Ora premium masterplan"],
    areaSize: "506 feddan",
    unitSizes: "95–450 m²",
    city: "Sidi Heneish / Ras El Hekma corridor, North Coast, Egypt",
    type: "Resort"
  },
  "marsa-baghush": {
    destination: "sidi-heneish",
    lat: 31.218,
    lng: 27.425,
    developer: "Shehab Mazhar / SQM Developments",
    developerSlug: "shehab-mazhar-sqm-developments",
    priceFrom: 6.0,
    deliveryYear: 2027,
    status: "Under Construction",
    beachfront: true,
    types: ["Chalet", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["Private Beachfront", "Boutique Hotel", "Cascading Pools", "Clubhouse & Spa", "Fine Dining", "Green Parks", "24/7 Security"],
    blurb: "Marsa Baghush by Shehab Mazhar (SQM Developments) is a boutique 130-feddan community in Sidi Heneish, designed with tiered elevations to ensure panoramic sea views from every residence.",
    paymentPlan: "5% down payment · installments up to 8 years",
    highlights: ["Designed by Shehab Mazhar", "Tiered sea views", "Sidi Heneish beachfront"],
    areaSize: "130 feddan",
    unitSizes: "80–300 m²",
    city: "Sidi Heneish, North Coast, Egypt",
    type: "Resort"
  },
  "beit-al-bahr": {
    destination: "sidi-heneish",
    lat: 31.20,
    lng: 27.63,
    developer: "Beit Al Bahr Developments",
    developerSlug: "beit-al-bahr-developments",
    priceFrom: 14.9,
    deliveryYear: 2027,
    status: "Under Construction",
    beachfront: true,
    types: ["Chalet", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["3.5 km Private Beachfront", "Swimmable Lagoons", "Exclusive Clubhouses", "Seaside Cinema", "Commercial Strip", "Wellness Center", "24/7 Security"],
    blurb: "Beit El Bahr inside El Abd Resort Sidi Heneish is a tiered 450-feddan beachfront project offering 3.5 km of private white sand beach and swimmable lagoons.",
    paymentPlan: "10% down payment · installments up to 8 years",
    highlights: ["3.5 km private beachfront", "Tiered beachfront phases", "Inside El Abd Resort"],
    areaSize: "450 feddan",
    unitSizes: "95–400 m²",
    city: "Sidi Heneish, North Coast, Egypt",
    type: "Resort"
  }
};

for (const compound of filteredList) {
  const up = updates[compound.slug];
  if (up) {
    Object.assign(compound, up);
    console.log(`Updated compound: ${compound.slug}`);
  }
}

// Write back to compounds.generated.ts
const newContent = `// Auto-generated initial seed.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(filteredList, null, 2)};
`;

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log("Wrote compounds.generated.ts successfully");
