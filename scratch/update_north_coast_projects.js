import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();

// Discard local changes first to start clean
try {
  execSync(
    "git checkout src/data/compounds.ts src/data/project-locations.ts src/data/sahel-details.ts",
    { stdio: "inherit" },
  );
} catch (e) {
  console.log("Could not checkout, continuing...");
}

// ----------------------------------------------------
// 1. UPDATE src/data/compounds.ts
// ----------------------------------------------------
const compPath = path.join(root, "src", "data", "compounds.ts");
let compCode = fs.readFileSync(compPath, "utf-8");

// Remove Sky North and Summer from raw arrays
compCode = compCode.replace(
  /\s*\["Sky North",\s*246,\s*"sidi-heneish",\s*"Sky AD\. Developments",\s*11,\s*2029,\s*false\],?\n?/g,
  "\n",
);
compCode = compCode.replace(
  /\s*\["Summer",\s*246,\s*"sidi-heneish",\s*"Al Ahly Sabbour",\s*9,\s*2026,\s*true\],?\n?/g,
  "\n",
);

// Update raw arrays for the others
compCode = compCode.replace(
  /\["Alam Al Roum",\s*275,\s*"sidi-heneish",\s*"Alam Al Roum Developments",\s*18,\s*2028,\s*true\]/g,
  '["Alam Al Roum", 270, "sidi-heneish", "Qatari Diar", 0, 2026, true]',
);
compCode = compCode.replace(
  /\["Jamila",\s*273,\s*"sidi-heneish",\s*"New Jersey Developments",\s*14,\s*2027,\s*true\]/g,
  '["Jamila", 268, "sidi-heneish", "New Jersey Developments", 4.5, 2028, true]',
);
compCode = compCode.replace(
  /\["Hacienda Heneish",\s*248,\s*"sidi-heneish",\s*"Palm Hills Developments",\s*16,\s*2027,\s*true\]/g,
  '["Hacienda Heneish", 247, "sidi-heneish", "Palm Hills Developments", 12.0, 2028, true]',
);
compCode = compCode.replace(
  /\["Silversands",\s*247,\s*"sidi-heneish",\s*"Ora Developers",\s*22,\s*2027,\s*true\]/g,
  '["Silversands", 222, "sidi-heneish", "Ora Developers", 9.7, 2028, true]',
);
compCode = compCode.replace(
  /\["Marsa Baghush",\s*240,\s*"sidi-heneish",\s*"Shehab A. Mazhar",\s*13,\s*2027,\s*true\]/g,
  '["Marsa Baghush", 248, "sidi-heneish", "SQM Developments", 6.0, 2027, true]',
);
compCode = compCode.replace(
  /\["Beit Al Bahr",\s*241,\s*"sidi-heneish",\s*"Beit Al Bahr Developments",\s*15,\s*2027,\s*true\]/g,
  '["Beit Al Bahr", 245, "sidi-heneish", "Beit Al Bahr Developments", 14.9, 2027, true]',
);

// Update Hacienda Blue destination to ras-el-hekma
compCode = compCode.replace(
  /\["Hacienda Blue",\s*168,\s*"al-dabaa",\s*"Palm Hills Developments",\s*12,\s*2026,\s*true\]/g,
  '["Hacienda Blue", 168, "ras-el-hekma", "Palm Hills Developments", 12, 2026, true]',
);

// Update details block for hacienda-blue in compounds.ts static array
const blueBlockRegex = /\{\s*slug:\s*"hacienda-blue"[\s\S]*?\},/g;
compCode = compCode.replace(
  blueBlockRegex,
  `{
    slug: "hacienda-blue",
    name: "Hacienda Blue",
    destination: "ras-el-hekma",
    lat: 31.1098, lng: 27.7715,
    developer: "Palm Hills Developments",
    developerSlug: "palm-hills-developments",
    priceFrom: 12,
    deliveryYear: 2026,
    status: "Delivered",
    beachfront: true,
    types: ["Chalet", "Apartment", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["Private beach", "Beach club", "Swimming pools", "Clubhouse", "Restaurants & cafés", "Retail area", "Gym", "Kids' play areas", "Landscaped gardens", "24/7 security"],
    hero: "/projects/hacienda-blue/1.jpg",
    gallery: ["/projects/hacienda-blue/1.jpg", "/projects/hacienda-blue/2.jpg"],
    blurb: "Hacienda Blue is a premium development by Palm Hills Developments in Sidi Abdelrahman, presenting high-end unit designs and world-class compound amenities.",
    paymentPlan: "5% down payment · installments up to 10 years",
    highlights: ["Boutique luxury beach retreat", "Low-density planning", "Pristine Ras El Hekma location", "Tranquil coastal destination"],
  },`,
);

// Remove static blocks for sky-north and summer in compounds.ts static array
const skyNorthStaticRegex = /\{\s*slug:\s*"sky-north"[\s\S]*?\},/g;
compCode = compCode.replace(skyNorthStaticRegex, "");
const summerStaticRegex = /\{\s*slug:\s*"summer"[\s\S]*?\},/g;
compCode = compCode.replace(summerStaticRegex, "");

// Update other static blocks in compounds.ts static array
const alamRoumStaticRegex = /\{\s*slug:\s*"alam-al-roum"[\s\S]*?\},/g;
compCode = compCode.replace(
  alamRoumStaticRegex,
  `{
    slug: "alam-al-roum",
    name: "Alam Al Roum",
    destination: "sidi-heneish",
    lat: 31.352, lng: 27.351,
    developer: "Qatari Diar",
    developerSlug: "qatari-diar",
    priceFrom: 0,
    deliveryYear: 2026,
    status: "Off-Plan",
    beachfront: true,
    types: ["Chalet", "Twin House", "Villa"],
    amenities: ["Yacht Marina", "7.2 km Private Beach", "Luxury Hotels", "Commercial Hubs", "Water Sports", "Smart Infrastructure", "Parks & Public Areas"],
    hero: "/projects/alam-al-roum/1.jpg",
    gallery: ["/projects/alam-al-roum/1.jpg"],
    blurb: "Alam Al Roum by Qatari Diar is a mega-scale coastal resort destination of 5,000 faddans east of Marsa Matrouh, featuring a yacht marina, hotels, and 7.2 km of private beachfront.",
    paymentPlan: "Price on request / Competitive pre-launch valuations",
    highlights: ["by Qatari Diar", "7.2 km private beach", "International Yacht Marina"],
    areaSize: "5000 feddan",
  },`,
);

const jamilaStaticRegex = /\{\s*slug:\s*"jamila"[\s\S]*?\},/g;
compCode = compCode.replace(
  jamilaStaticRegex,
  `{
    slug: "jamila",
    name: "Jamila",
    destination: "sidi-heneish",
    lat: 31.220, lng: 27.480,
    developer: "New Jersey Developments",
    developerSlug: "new-jersey-developments",
    priceFrom: 4.5,
    deliveryYear: 2028,
    status: "Off-Plan",
    beachfront: true,
    types: ["Chalet", "Townhouse", "Twin House", "Villa"],
    amenities: ["Marriott Hotel", "700m Beachfront", "16,000 sqm Pools", "Crystal Lagoons", "Commercial Strip", "Clubhouse", "Gym & Spa", "24/7 Security"],
    hero: "/projects/jamila/1.jpg",
    gallery: ["/projects/jamila/1.jpg"],
    blurb: "Jamila Sidi Heneish by New Jersey Developments is a 130-feddan premium beachfront community with a low 9% building footprint, featuring a 5-star Marriott hotel and a 700m private beach.",
    paymentPlan: "5% down payment · installments up to 10 years",
    highlights: ["9% building footprint", "Marriott 5-star hotel", "700m private beach"],
    areaSize: "130 feddan",
    unitSizes: "80–220 m²",
  },`,
);

const haciendaHeneishStaticRegex = /\{\s*slug:\s*"hacienda-heneish"[\s\S]*?\},/g;
compCode = compCode.replace(
  haciendaHeneishStaticRegex,
  `{
    slug: "hacienda-heneish",
    name: "Hacienda Heneish",
    destination: "sidi-heneish",
    lat: 31.1927, lng: 27.5827,
    developer: "Palm Hills Developments",
    developerSlug: "palm-hills-developments",
    priceFrom: 12.0,
    deliveryYear: 2028,
    status: "Off-Plan",
    beachfront: true,
    types: ["Chalet", "Apartment", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["5-star Hotel", "Serviced Apartments", "Beach Club", "Crystal Lagoons", "Commercial Strip", "Sports Courts", "Kids Areas", "24/7 Security"],
    hero: "/projects/hacienda-heneish/1.jpg",
    gallery: ["/projects/hacienda-heneish/1.jpg", "/projects/hacienda-heneish/2.jpg"],
    blurb: "Hacienda Heneish by Palm Hills Developments is a massive 420-feddan coastal retreat in Sidi Heneish, offering premium hospitality, crystal lagoons, and direct beach access to signature turquoise waters.",
    paymentPlan: "5% down payment · installments up to 8 years",
    highlights: ["Palm Hills premium quality", "420 acres masterplan", "Turquoise water beachfront"],
    areaSize: "420 feddan",
    unitSizes: "80–350 m²",
  },`,
);

const silversandsStaticRegex = /\{\s*slug:\s*"silversands"[\s\S]*?\},/g;
compCode = compCode.replace(
  silversandsStaticRegex,
  `{
    slug: "silversands",
    name: "Silversands",
    destination: "sidi-heneish",
    lat: 31.193, lng: 27.595,
    developer: "Ora Developers",
    developerSlug: "ora-developers",
    priceFrom: 9.7,
    deliveryYear: 2028,
    status: "Off-Plan",
    beachfront: true,
    types: ["Chalet", "Apartment", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["1.2 km Beachfront", "88,000 sqm Lagoons", "Multiple Clubhouses", "Boutique Hotels", "Commercial Hub", "Health & Wellness Club", "Sports Courts", "Open-air Cinema"],
    hero: "/projects/silversands/1.jpg",
    gallery: ["/projects/silversands/1.jpg", "/projects/silversands/2.jpg"],
    blurb: "Silversands Sidi Heneish is Ora Developers' flagship WATG-masterplanned resort spanning 506 feddans, featuring 1.2 km of private beachfront and an 88,000 sqm swimmable lagoon.",
    paymentPlan: "5% down payment · installments up to 10 years",
    highlights: ["1.2 km beachfront", "88,000 sqm Crystal Lagoon", "Ora premium masterplan"],
    areaSize: "506 feddan",
    unitSizes: "95–450 m²",
  },`,
);

const marsaBaghushStaticRegex = /\{\s*slug:\s*"marsa-baghush"[\s\S]*?\},/g;
compCode = compCode.replace(
  marsaBaghushStaticRegex,
  `{
    slug: "marsa-baghush",
    name: "Marsa Baghush",
    destination: "sidi-heneish",
    lat: 31.218, lng: 27.425,
    developer: "Shehab Mazhar / SQM Developments",
    developerSlug: "shehab-mazhar-sqm-developments",
    priceFrom: 6.0,
    deliveryYear: 2027,
    status: "Under Construction",
    beachfront: true,
    types: ["Chalet", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["Private Beachfront", "Boutique Hotel", "Cascading Pools", "Clubhouse & Spa", "Fine Dining", "Green Parks", "24/7 Security"],
    hero: "/projects/marsa-baghush/1.jpg",
    gallery: ["/projects/marsa-baghush/1.jpg", "/projects/marsa-baghush/2.jpg"],
    blurb: "Marsa Baghush by Shehab Mazhar (SQM Developments) is a boutique 130-feddan community in Sidi Heneish, designed with tiered elevations to ensure panoramic sea views from every residence.",
    paymentPlan: "5% down payment · installments up to 8 years",
    highlights: ["Designed by Shehab Mazhar", "Tiered sea views", "Sidi Heneish beachfront"],
    areaSize: "130 feddan",
    unitSizes: "80–300 m²",
  },`,
);

const beitAlBahrStaticRegex = /\{\s*slug:\s*"beit-al-bahr"[\s\S]*?\},/g;
compCode = compCode.replace(
  beitAlBahrStaticRegex,
  `{
    slug: "beit-al-bahr",
    name: "Beit Al Bahr",
    destination: "sidi-heneish",
    lat: 31.20, lng: 27.63,
    developer: "Beit Al Bahr Developments",
    developerSlug: "beit-al-bahr-developments",
    priceFrom: 14.9,
    deliveryYear: 2027,
    status: "Under Construction",
    beachfront: true,
    types: ["Chalet", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["3.5 km Private Beachfront", "Swimmable Lagoons", "Exclusive Clubhouses", "Seaside Cinema", "Commercial Strip", "Wellness Center", "24/7 Security"],
    hero: "/projects/beit-al-bahr/1.jpg",
    gallery: ["/projects/beit-al-bahr/1.jpg"],
    blurb: "Beit El Bahr inside El Abd Resort Sidi Heneish is a tiered 450-feddan beachfront project offering 3.5 km of private white sand beach and swimmable lagoons.",
    paymentPlan: "10% down payment · installments up to 8 years",
    highlights: ["3.5 km private beachfront", "Tiered beachfront phases", "Inside El Abd Resort"],
    areaSize: "450 feddan",
    unitSizes: "95–400 m²",
  },`,
);

fs.writeFileSync(compPath, compCode, "utf-8");
console.log("compounds.ts updated successfully.");

// ----------------------------------------------------
// 2. UPDATE src/data/compound-registry.ts
// ----------------------------------------------------
const regPath = path.join(root, "src", "data", "compound-registry.ts");
let regCode = fs.readFileSync(regPath, "utf-8");

// Remove sky-north and summer custom definitions
regCode = regCode.replace(/\s*"sky-north":\s*\{[\s\S]*?\},\s*\n/g, "\n");
regCode = regCode.replace(/\s*"summer":\s*\{[\s\S]*?\},\s*\n/g, "\n");

// Helper to replace or inject keys
const registryUpdates = {
  "hacienda-blue": {
    destination: "ras-el-hekma",
    city: "Ras El Hekma, North Coast, Egypt",
    lat: 31.1098,
    lng: 27.7715,
    developer: "Palm Hills Developments",
    beachfront: true,
    type: "Resort",
    blurb:
      "Hacienda Blue is a boutique luxury beachfront development by Palm Hills offering contemporary residences, private beaches, and panoramic Mediterranean views in Ras El Hekma.",
    paymentPlan: "5% down, installments up to 10 years",
    amenities: [
      "Private beach",
      "Beach club",
      "Swimming pools",
      "Clubhouse",
      "Restaurants & cafés",
      "Retail area",
      "Gym",
      "Kids' play areas",
      "Landscaped gardens",
      "24/7 security",
    ],
    types: ["Chalet", "Apartment", "Townhouse", "Twin House", "Standalone Villa"],
    highlights: [
      "Boutique luxury beach retreat",
      "Low-density planning",
      "Pristine Ras El Hekma location",
      "Tranquil coastal destination",
    ],
  },
  "alam-al-roum": {
    destination: "sidi-heneish",
    city: "East of Marsa Matrouh, North Coast, Egypt",
    lat: 31.352,
    lng: 27.351,
    developer: "Qatari Diar",
    beachfront: true,
    type: "Resort",
    blurb:
      "Alam Al Roum by Qatari Diar is a mega-scale coastal resort destination of 5,000 faddans east of Marsa Matrouh, featuring a yacht marina, hotels, and 7.2 km of private beachfront.",
    paymentPlan: "Price on request / Competitive pre-launch valuations",
    amenities: [
      "Yacht Marina",
      "7.2 km Private Beach",
      "Luxury Hotels",
      "Commercial Hubs",
      "Water Sports",
      "Smart Infrastructure",
      "Parks & Public Areas",
    ],
    types: ["Chalet", "Twin House", "Villa"],
    highlights: ["by Qatari Diar", "7.2 km private beach", "International Yacht Marina"],
    areaSize: "5000 feddan",
  },
  jamila: {
    destination: "sidi-heneish",
    city: "Sidi Heneish, North Coast, Egypt",
    lat: 31.22,
    lng: 27.48,
    developer: "New Jersey Developments",
    beachfront: true,
    type: "Resort",
    blurb:
      "Jamila Sidi Heneish by New Jersey Developments is a 130-feddan premium beachfront community with a low 9% building footprint, featuring a 5-star Marriott hotel and a 700m private beach.",
    paymentPlan: "5% down payment · installments up to 10 years",
    amenities: [
      "Marriott Hotel",
      "700m Beachfront",
      "16,000 sqm Pools",
      "Crystal Lagoons",
      "Commercial Strip",
      "Clubhouse",
      "Gym & Spa",
      "24/7 Security",
    ],
    types: ["Chalet", "Townhouse", "Twin House", "Villa"],
    highlights: ["9% building footprint", "Marriott 5-star hotel", "700m private beach"],
    areaSize: "130 feddan",
    unitSizes: "80–220 m²",
  },
  "hacienda-heneish": {
    destination: "sidi-heneish",
    city: "Sidi Heneish, North Coast, Egypt",
    lat: 31.1927,
    lng: 27.5827,
    developer: "Palm Hills Developments",
    beachfront: true,
    type: "Resort",
    blurb:
      "Hacienda Heneish by Palm Hills Developments is a massive 420-feddan coastal retreat in Sidi Heneish, offering premium hospitality, crystal lagoons, and direct beach access to signature turquoise waters.",
    paymentPlan: "5% down payment · installments up to 8 years",
    amenities: [
      "5-star Hotel",
      "Serviced Apartments",
      "Beach Club",
      "Crystal Lagoons",
      "Commercial Strip",
      "Sports Courts",
      "Kids Areas",
      "24/7 Security",
    ],
    types: ["Chalet", "Apartment", "Townhouse", "Twin House", "Standalone Villa"],
    highlights: [
      "Palm Hills premium quality",
      "420 acres masterplan",
      "Turquoise water beachfront",
    ],
    areaSize: "420 feddan",
    unitSizes: "80–350 m²",
  },
  silversands: {
    destination: "sidi-heneish",
    city: "Sidi Heneish / Ras El Hekma corridor, North Coast, Egypt",
    lat: 31.193,
    lng: 27.595,
    developer: "Ora Developers",
    beachfront: true,
    type: "Resort",
    blurb:
      "Silversands Sidi Heneish is Ora Developers' flagship WATG-masterplanned resort spanning 506 feddans, featuring 1.2 km of private beachfront and an 88,000 sqm swimmable lagoon.",
    paymentPlan: "5% down payment · installments up to 10 years",
    amenities: [
      "1.2 km Beachfront",
      "88,000 sqm Lagoons",
      "Multiple Clubhouses",
      "Boutique Hotels",
      "Commercial Hub",
      "Health & Wellness Club",
      "Sports Courts",
      "Open-air Cinema",
    ],
    types: ["Chalet", "Apartment", "Townhouse", "Twin House", "Standalone Villa"],
    highlights: ["1.2 km beachfront", "88,000 sqm Crystal Lagoon", "Ora premium masterplan"],
    areaSize: "506 feddan",
    unitSizes: "95–450 m²",
  },
  "marsa-baghush": {
    destination: "sidi-heneish",
    city: "Sidi Heneish, North Coast, Egypt",
    lat: 31.218,
    lng: 27.425,
    developer: "Shehab Mazhar / SQM Developments",
    beachfront: true,
    type: "Resort",
    blurb:
      "Marsa Baghush by Shehab Mazhar (SQM Developments) is a boutique 130-feddan community in Sidi Heneish, designed with tiered elevations to ensure panoramic sea views from every residence.",
    paymentPlan: "5% down payment · installments up to 8 years",
    amenities: [
      "Private Beachfront",
      "Boutique Hotel",
      "Cascading Pools",
      "Clubhouse & Spa",
      "Fine Dining",
      "Green Parks",
      "24/7 Security",
    ],
    types: ["Chalet", "Townhouse", "Twin House", "Standalone Villa"],
    highlights: ["Designed by Shehab Mazhar", "Tiered sea views", "Sidi Heneish beachfront"],
    areaSize: "130 feddan",
    unitSizes: "80–300 m²",
  },
  "beit-al-bahr": {
    destination: "sidi-heneish",
    city: "Sidi Heneish, North Coast, Egypt",
    lat: 31.2,
    lng: 27.63,
    developer: "Beit Al Bahr Developments",
    beachfront: true,
    type: "Resort",
    blurb:
      "Beit El Bahr inside El Abd Resort Sidi Heneish is a tiered 450-feddan beachfront project offering 3.5 km of private white sand beach and swimmable lagoons.",
    paymentPlan: "10% down payment · installments up to 8 years",
    amenities: [
      "3.5 km Private Beachfront",
      "Swimmable Lagoons",
      "Exclusive Clubhouses",
      "Seaside Cinema",
      "Commercial Strip",
      "Wellness Center",
      "24/7 Security",
    ],
    types: ["Chalet", "Townhouse", "Twin House", "Standalone Villa"],
    highlights: ["3.5 km private beachfront", "Tiered beachfront phases", "Inside El Abd Resort"],
    areaSize: "450 feddan",
    unitSizes: "95–400 m²",
  },
};

for (const [slug, data] of Object.entries(registryUpdates)) {
  const regex = new RegExp(`\\"${slug}\\"\\s*:\\s*\\{[\\s\\S]*?\\}\\s*,?\\s*\\n`, "g");
  if (regCode.includes(`"${slug}":`)) {
    regCode = regCode.replace(regex, `"${slug}": ${JSON.stringify(data, null, 2)},\n`);
  }
}

fs.writeFileSync(regPath, regCode, "utf-8");
console.log("compound-registry.ts updated successfully.");

// ----------------------------------------------------
// 3. UPDATE src/data/project-locations.ts
// ----------------------------------------------------
const locPath = path.join(root, "src", "data", "project-locations.ts");
let locCode = fs.readFileSync(locPath, "utf-8");

// Remove sky-north and summer
locCode = locCode.replace(/\s*"sky-north":\s*\{[\s\S]*?\},\s*\n/g, "\n");
locCode = locCode.replace(/\s*"summer":\s*\{[\s\S]*?\},\s*\n/g, "\n");

const locUpdates = {
  "alam-al-roum": {
    name: "Alam Al Roum",
    destination: "sidi-heneish",
    location: "East of Marsa Matrouh, North Coast, Egypt",
    mapsUrl: "https://www.google.com/maps/place/Alam+el+Rum+resort/@31.3552324,27.3489873",
  },
  jamila: {
    name: "Jamila",
    destination: "sidi-heneish",
    location: "Sidi Heneish, North Coast, Egypt",
    mapsUrl: "https://maps.google.com/?q=Jamila+North+Coast+Sidi+Heneish",
  },
  "hacienda-heneish": {
    name: "Hacienda Heneish",
    destination: "sidi-heneish",
    location: "Sidi Heneish, North Coast, Egypt",
    mapsUrl: "https://maps.google.com/?q=Hacienda+Heneish+Palm+Hills",
  },
  silversands: {
    name: "Silversands",
    destination: "sidi-heneish",
    location: "Sidi Heneish, North Coast, Egypt",
    mapsUrl: "https://maps.google.com/?q=Silver+Sands+Ora+Sidi+Heneish",
  },
  "marsa-baghush": {
    name: "Marsa Baghush",
    destination: "sidi-heneish",
    location: "Sidi Heneish, North Coast, Egypt",
    mapsUrl: "https://maps.google.com/?q=Marsa+Baghush+Sidi+Heneish",
  },
  "beit-al-bahr": {
    name: "Beit Al Bahr",
    destination: "sidi-heneish",
    location: "Sidi Heneish, North Coast, Egypt",
    mapsUrl: "https://maps.google.com/?q=Beit+El+Bahr+Sidi+Heneish",
  },
  "hacienda-blue": {
    name: "Hacienda Blue",
    destination: "ras-el-hekma",
    location: "Ras El Hekma, North Coast, Egypt",
    mapsUrl: "https://maps.google.com/?q=Hacienda+Blue+North",
  },
};

for (const [slug, data] of Object.entries(locUpdates)) {
  const regex = new RegExp(`\\"${slug}\\"\\s*:\\s*\\{[\\s\\S]*?\\}\\s*,?\\s*\\n`, "g");
  if (locCode.includes(`"${slug}":`)) {
    locCode = locCode.replace(regex, `"${slug}": ${JSON.stringify(data, null, 2)},\n`);
  }
}

fs.writeFileSync(locPath, locCode, "utf-8");
console.log("project-locations.ts updated successfully.");

// ----------------------------------------------------
// 4. UPDATE src/data/sahel-details.ts
// ----------------------------------------------------
const sahelPath = path.join(root, "src", "data", "sahel-details.ts");
let sahelCode = fs.readFileSync(sahelPath, "utf-8");

// Remove sky-north and summer blocks cleanly
sahelCode = sahelCode.replace(/\s*"sky-north"\s*:\s*\{[\s\S]*?\},\s*\n/g, "\n");
sahelCode = sahelCode.replace(/\s*summer\s*:\s*\{[\s\S]*?\},\s*\n/g, "\n");

const sahelUpdates = {
  "alam-al-roum": {
    developer: "Qatari Diar",
    areaSize: "5000 feddan",
    unitSizes: "Chalet, Twin House, Villa",
    priceFrom: 0,
    deliveryYear: 2026,
    status: "Off-Plan",
    paymentPlan: "Price on request",
    blurb:
      "Alam Al Roum by Qatari Diar is a mega-scale coastal resort destination of 5,000 faddans east of Marsa Matrouh, featuring a yacht marina, hotels, and 7.2 km of private beachfront.",
    highlights: ["by Qatari Diar", "7.2 km private beach", "International Yacht Marina"],
  },
  jamila: {
    developer: "New Jersey Developments",
    areaSize: "130 feddan",
    unitSizes: "80–220 m²",
    priceFrom: 4.5,
    deliveryYear: 2028,
    status: "Off-Plan",
    paymentPlan: "5% down payment · installments up to 10 years",
    blurb:
      "Jamila Sidi Heneish by New Jersey Developments is a 130-feddan premium beachfront community with a low 9% building footprint, featuring a 5-star Marriott hotel and a 700m private beach.",
    highlights: ["9% building footprint", "Marriott 5-star hotel", "700m private beach"],
  },
  "hacienda-heneish": {
    developer: "Palm Hills Developments",
    areaSize: "420 feddan",
    unitSizes: "80–350 m²",
    priceFrom: 12.0,
    deliveryYear: 2028,
    status: "Off-Plan",
    paymentPlan: "5% down payment · installments up to 8 years",
    blurb:
      "Hacienda Heneish by Palm Hills Developments is a massive 420-feddan coastal retreat in Sidi Heneish, offering premium hospitality, crystal lagoons, and direct beach access to signature turquoise waters.",
    highlights: [
      "Palm Hills premium quality",
      "420 acres masterplan",
      "Turquoise water beachfront",
    ],
  },
  silversands: {
    developer: "Ora Developers",
    areaSize: "506 feddan",
    unitSizes: "95–450 m²",
    priceFrom: 9.7,
    deliveryYear: 2028,
    status: "Off-Plan",
    paymentPlan: "5% down payment · installments up to 10 years",
    blurb:
      "Silversands Sidi Heneish is Ora Developers' flagship WATG-masterplanned resort spanning 506 feddans, featuring 1.2 km of private beachfront and an 88,000 sqm swimmable lagoon.",
    highlights: ["1.2 km beachfront", "88,000 sqm Crystal Lagoon", "Ora premium masterplan"],
  },
  "marsa-baghush": {
    developer: "Shehab Mazhar / SQM Developments",
    areaSize: "130 feddan",
    unitSizes: "80–300 m²",
    priceFrom: 6.0,
    deliveryYear: 2027,
    status: "Under Construction",
    paymentPlan: "5% down payment · installments up to 8 years",
    blurb:
      "Marsa Baghush by Shehab Mazhar (SQM Developments) is a boutique 130-feddan community in Sidi Heneish, designed with tiered elevations to ensure panoramic sea views from every residence.",
    highlights: ["Designed by Shehab Mazhar", "Tiered sea views", "Sidi Heneish beachfront"],
  },
  "beit-al-bahr": {
    developer: "Beit Al Bahr Developments",
    areaSize: "450 feddan",
    unitSizes: "95–400 m²",
    priceFrom: 14.9,
    deliveryYear: 2027,
    status: "Under Construction",
    paymentPlan: "10% down payment · installments up to 8 years",
    blurb:
      "Beit El Bahr inside El Abd Resort Sidi Heneish is a tiered 450-feddan beachfront project offering 3.5 km of private white sand beach and swimmable lagoons.",
    highlights: ["3.5 km private beachfront", "Tiered beachfront phases", "Inside El Abd Resort"],
  },
};

for (const [slug, data] of Object.entries(sahelUpdates)) {
  const regex = new RegExp(`\\"${slug}\\"\\s*:\\s*\\{[\\s\\S]*?\\}\\s*,?\\s*\\n`, "g");
  if (sahelCode.includes(`"${slug}":`)) {
    sahelCode = sahelCode.replace(regex, `"${slug}": ${JSON.stringify(data, null, 2)},\n`);
  }
}

// Special case: silversands is defined without quotes: `silversands: {`
sahelCode = sahelCode.replace(
  /silversands\s*:\s*\{[\s\S]*?\},\s*\n/g,
  `silversands: ${JSON.stringify(sahelUpdates.silversands, null, 2)},\n`,
);

fs.writeFileSync(sahelPath, sahelCode, "utf-8");
console.log("sahel-details.ts updated successfully.");
