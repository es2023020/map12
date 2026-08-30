import fs from 'fs';
import path from 'path';

// 1. Load compounds.generated.ts
const compFile = fs.readFileSync('src/data/compounds.generated.ts', 'utf8');
const compJsonMatch = compFile.match(/export const compoundsGenerated:\s*Compound\[\]\s*=\s*(\[[\s\S]*\]);/);
let compounds = JSON.parse(compJsonMatch[1]);

const cIdx = compounds.findIndex(x => x.slug === 'one33');
const one33CompoundData = {
  slug: "one33",
  name: "ONE33",
  destination: "northern-expansion",
  lat: 30.044,
  lng: 30.965,
  developer: "Arkan Palm",
  developerSlug: "arkan-palm",
  priceFrom: 5.5,
  deliveryYear: 2030,
  status: "Off-Plan",
  isNewLaunch: true,
  beachfront: false,
  types: [
    "1 Bedroom Apartment",
    "2 Bedrooms Apartment",
    "3 Bedrooms Apartment",
    "Ground Duplex",
    "Townhouse Middle",
    "Townhouse Corner",
    "Standalone Villa"
  ],
  amenities: [
    "Clubhouse",
    "Swimming pools",
    "Sports club",
    "Parks",
    "Commercial boulevard",
    "Restaurants & cafés",
    "Gym",
    "Kids' areas",
    "24/7 security"
  ],
  hero: "/projects/one33/1.jpg",
  gallery: [
    "/projects/one33/1.jpg",
    "/projects/one33/2.jpg",
    "/projects/one33/3.jpg",
    "/projects/one33/4.jpg",
    "/projects/one33/5.jpg"
  ],
  blurb: "ONE33 by Arkan Palm is a premium new release residential community featuring standalone villas, townhouses & luxury apartments in a prime location near Sheikh Zayed.",
  paymentPlan: "5% Down · 5% After 3 Mos · 9 Yrs Equal Installments",
  areaSize: "133 acres",
  unitSizes: "85–261 m²",
  type: "Residential",
  highlights: [
    "New Release by Arkan Palm",
    "Prime Sheikh Zayed Location",
    "5% Down Payment over 9 Years",
    "Villas, Townhouses & Apartments"
  ],
  city: "Sheikh Zayed / Northern Expansion, West Cairo, Egypt",
  masterPlanUrl: "/masterplans/one33.svg"
};

if (cIdx !== -1) {
  compounds[cIdx] = { ...compounds[cIdx], ...one33CompoundData };
} else {
  compounds.push(one33CompoundData);
}

const updatedCompContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(compounds, null, 2)};
`;
fs.writeFileSync('src/data/compounds.generated.ts', updatedCompContent, 'utf8');
console.log('Updated ONE33 in compounds.generated.ts');

// 2. Load availability.generated.ts
let availFile = fs.readFileSync('src/data/availability.generated.ts', 'utf8');
let availCode = availFile.replace(/^import\s+.*;/gm, '').replace(/^\/\/.*$/gm, '');
const availArrayCode = availCode.replace(/export const availability:\s*ProjectAvailability\[\]\s*=\s*/, 'return ').replace(/;\s*$/, '');
let availList = new Function(availArrayCode)();

const one33AvailData = {
  slug: "one33",
  developer: "Arkan Palm",
  totalAvailable: 8,
  breakdown: [
    {
      type: "Apartment",
      beds: 1,
      available: 1,
      minSqm: 85,
      maxSqm: 85,
      minPriceM: 5.5,
      maxPriceM: 5.5,
      units: [
        {
          id: "one33-1",
          unitNo: "ONE33-APT-1B-85",
          beds: 1,
          finishing: "Fully Finished",
          areaSqm: 85,
          view: "Landscapes & Water Features",
          priceEGP: 5500000,
          status: "Available",
          slug: "one33",
          cluster: "New Release",
          delivery_note: "Off-Plan (4 Years)",
          payment_plan: "5%+5% over 9 years equal installments"
        }
      ]
    },
    {
      type: "Apartment",
      beds: 2,
      available: 1,
      minSqm: 120,
      maxSqm: 120,
      minPriceM: 7.8,
      maxPriceM: 7.8,
      units: [
        {
          id: "one33-2",
          unitNo: "ONE33-APT-2B-120",
          beds: 2,
          finishing: "Fully Finished",
          areaSqm: 120,
          view: "Landscapes & Water Features",
          priceEGP: 7800000,
          status: "Available",
          slug: "one33",
          cluster: "New Release",
          delivery_note: "Off-Plan (4 Years)",
          payment_plan: "5%+5% over 9 years equal installments"
        }
      ]
    },
    {
      type: "Apartment",
      beds: 3,
      available: 1,
      minSqm: 148,
      maxSqm: 148,
      minPriceM: 10.5,
      maxPriceM: 10.5,
      units: [
        {
          id: "one33-3",
          unitNo: "ONE33-APT-3B-148",
          beds: 3,
          finishing: "Fully Finished",
          areaSqm: 148,
          view: "Landscapes & Water Features",
          priceEGP: 10500000,
          status: "Available",
          slug: "one33",
          cluster: "New Release",
          delivery_note: "Off-Plan (4 Years)",
          payment_plan: "5%+5% over 9 years equal installments"
        }
      ]
    },
    {
      type: "Duplex",
      beds: 3,
      available: 1,
      minSqm: 223,
      maxSqm: 223,
      minPriceM: 15.6,
      maxPriceM: 15.6,
      units: [
        {
          id: "one33-4",
          unitNo: "ONE33-DPLX-GR-223",
          beds: 3,
          finishing: "Fully Finished",
          areaSqm: 223,
          view: "Private Garden & Landscape",
          priceEGP: 15600000,
          status: "Available",
          slug: "one33",
          cluster: "New Release",
          area_note: "223m² BUA + Private Garden",
          delivery_note: "Off-Plan (4 Years)",
          payment_plan: "5%+5% over 9 years equal installments"
        }
      ]
    },
    {
      type: "Townhouse",
      beds: 3,
      available: 2,
      minSqm: 183,
      maxSqm: 198,
      minPriceM: 16.0,
      maxPriceM: 17.5,
      units: [
        {
          id: "one33-5",
          unitNo: "ONE33-TH-MID-183",
          beds: 3,
          finishing: "Core & Shell",
          areaSqm: 183,
          view: "Landscape",
          priceEGP: 16000000,
          status: "Available",
          slug: "one33",
          cluster: "Townhouse Middle",
          delivery_note: "Off-Plan (4 Years)",
          payment_plan: "5%+5% over 9 years equal installments"
        },
        {
          id: "one33-6",
          unitNo: "ONE33-TH-CNR-198",
          beds: 3,
          finishing: "Core & Shell",
          areaSqm: 198,
          view: "Corner Landscape View",
          priceEGP: 17500000,
          status: "Available",
          slug: "one33",
          cluster: "Townhouse Corner",
          delivery_note: "Off-Plan (4 Years)",
          payment_plan: "5%+5% over 9 years equal installments"
        }
      ]
    },
    {
      type: "Standalone Villa",
      beds: 4,
      available: 2,
      minSqm: 252,
      maxSqm: 261,
      minPriceM: 23.3,
      maxPriceM: 24.1,
      units: [
        {
          id: "one33-7",
          unitNo: "ONE33-VILLA-IV-252",
          beds: 4,
          finishing: "Core & Shell",
          areaSqm: 252,
          view: "Prime Park & Lagoon View",
          priceEGP: 23300000,
          status: "Available",
          slug: "one33",
          cluster: "Villa IV",
          delivery_note: "Off-Plan (4 Years)",
          payment_plan: "5%+5% over 9 years equal installments"
        },
        {
          id: "one33-8",
          unitNo: "ONE33-VILLA-VI-261",
          beds: 4,
          finishing: "Core & Shell",
          areaSqm: 261,
          view: "Prime Park & Lagoon View",
          priceEGP: 24100000,
          status: "Available",
          slug: "one33",
          cluster: "Villa VI",
          delivery_note: "Off-Plan (4 Years)",
          payment_plan: "5%+5% over 9 years equal installments"
        }
      ]
    }
  ],
  lastUpdated: "2026-08-30"
};

const aIdx = availList.findIndex(x => x.slug === 'one33');
if (aIdx !== -1) {
  availList[aIdx] = one33AvailData;
} else {
  availList.push(one33AvailData);
}

const updatedAvailContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { ProjectAvailability } from "./availability";

export const availability: ProjectAvailability[] = ${JSON.stringify(availList, null, 2)};
`;
fs.writeFileSync('src/data/availability.generated.ts', updatedAvailContent, 'utf8');
console.log('Added ONE33 availability to availability.generated.ts');

// 3. Update public/availability-data/one33/ JSON files
const pubDir = path.join(process.cwd(), 'public', 'availability-data', 'one33');
if (!fs.existsSync(pubDir)) {
  fs.mkdirSync(pubDir, { recursive: true });
}

fs.writeFileSync(path.join(pubDir, 'apartment-1br.json'), JSON.stringify([one33AvailData.breakdown[0].units[0]], null, 2), 'utf8');
fs.writeFileSync(path.join(pubDir, 'apartment-2br.json'), JSON.stringify([one33AvailData.breakdown[1].units[0]], null, 2), 'utf8');
fs.writeFileSync(path.join(pubDir, 'apartment-3br.json'), JSON.stringify([one33AvailData.breakdown[2].units[0]], null, 2), 'utf8');
fs.writeFileSync(path.join(pubDir, 'duplex-3br.json'), JSON.stringify([one33AvailData.breakdown[3].units[0]], null, 2), 'utf8');
fs.writeFileSync(path.join(pubDir, 'townhouse-3br.json'), JSON.stringify(one33AvailData.breakdown[4].units, null, 2), 'utf8');
fs.writeFileSync(path.join(pubDir, 'standalone-villa-4br.json'), JSON.stringify(one33AvailData.breakdown[5].units, null, 2), 'utf8');

console.log('Created public/availability-data/one33/ JSON files.');

// 4. Update compound-registry.ts if necessary
let regTs = fs.readFileSync('src/data/compound-registry.ts', 'utf8');
if (regTs.includes('"one33":')) {
  regTs = regTs.replace(
    /"one33":\s*\{[\s\S]*?\n  \},/,
    `"one33": {
    destination: "northern-expansion",
    lat: 30.044,
    lng: 30.965,
    developer: "Arkan Palm",
    city: "Sheikh Zayed / Northern Expansion, West Cairo, Egypt",
    priceFrom: 5.5,
    deliveryYear: 2030,
    status: "Off-Plan",
    blurb: "ONE33 by Arkan Palm is a premium new release residential community featuring standalone villas, townhouses & luxury apartments in a prime location near Sheikh Zayed.",
    paymentPlan: "5% Down · 5% After 3 Mos · 9 Yrs Equal Installments",
    areaSize: "133 acres",
    amenities: ["Clubhouse", "Swimming pools", "Sports club", "Parks", "Commercial boulevard", "24/7 security"],
    types: ["Apartment", "Duplex", "Townhouse", "Standalone Villa"],
    highlights: ["New Release by Arkan Palm", "Near Sheikh Zayed", "5% DP over 9 Years"]
  },`
  );
  fs.writeFileSync('src/data/compound-registry.ts', regTs, 'utf8');
  console.log('Updated ONE33 in compound-registry.ts');
}
