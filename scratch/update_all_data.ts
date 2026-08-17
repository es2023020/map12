import fs from "fs";
import path from "path";
import { compoundsGenerated } from "../src/data/compounds.generated";
import { availability } from "../src/data/availability.generated";

const rootDir = process.cwd();

// ---------------------------------------------------------
// 1. Update compounds.generated.ts
// ---------------------------------------------------------
console.log(`Loaded ${compoundsGenerated.length} compounds from compounds.generated.ts`);

let bloomfieldsFound = false;
let scenesFound = false;

const updatedCompounds = compoundsGenerated.map((c) => {
  if (c.slug === "bloomfields") {
    bloomfieldsFound = true;
    return {
      ...c,
      priceFrom: 5.8,
      paymentPlan: "0%–5% down payment, remaining balance spread over 8 to 10 years in equal installments",
      highlights: [
        "1BR from 5.8M EGP, 2BR from 8.6M EGP, 3BR from 10.4M EGP, Duplex from 22.1M EGP",
        "415-feddan college town concept in Mostakbal City",
        "Sprawling green spaces & crystal lagoons",
        "Tatweer Misr signature masterplan"
      ]
    };
  }
  if (c.slug === "scenes") {
    scenesFound = true;
    return {
      ...c,
      name: "Scenes",
      destination: "mostakbal-city",
      lat: 30.0425,
      lng: 31.6480,
      developer: "Tatweer Misr",
      developerSlug: "tatweer-misr",
      priceFrom: 14.6,
      deliveryYear: 2030,
      status: "Off-Plan",
      beachfront: false,
      types: ["Townhouse", "Twin House", "Standalone Villa"],
      amenities: [
        "Clubhouse",
        "Green Corridors",
        "Artificial Lakes",
        "Botanical Stations",
        "Sports Facilities",
        "Commercial Retail Area",
        "24/7 Security",
        "Backup Generators"
      ],
      hero: "/projects/scenes/1.jpeg",
      gallery: [
        "/projects/scenes/1.jpeg",
        "/projects/scenes/2.jpg",
        "/projects/scenes/3.jpg",
        "/projects/scenes/4.jpg",
        "/projects/scenes/5.jpg"
      ],
      blurb: "Scenes by Tatweer Misr is a luxury, low-density, villas-only residential compound spanning 100 acres in Mostakbal City, East Cairo. 80% of the land is dedicated to green landscapes, water features, and open spaces.",
      paymentPlan: "10 Years equal installments · 30% Cash Discount",
      areaSize: "100 feddan",
      unitSizes: "165–210 m²",
      type: "Residential",
      city: "Mostakbal City, East Cairo, Egypt",
      flagship: true,
      isNewLaunch: true,
      masterPlanUrl: "/Masterplans/scenes.jpg",
      highlights: [
        "Luxury low-density villas-only community (100 acres)",
        "80% green landscapes & water features, 20% footprint",
        "Townhouses from 14.6M, Standalones from 17.15M, Twin Houses from 17.8M",
        "10 years payment plan · 30% Cash Discount",
        "Delivered fully finished by Dec 2030",
        "Heart of Mostakbal City near Hub Town & Neom"
      ]
    };
  }
  return c;
});

if (!scenesFound) {
  updatedCompounds.push({
    slug: "scenes",
    name: "Scenes",
    destination: "mostakbal-city",
    lat: 30.0425,
    lng: 31.6480,
    developer: "Tatweer Misr",
    developerSlug: "tatweer-misr",
    priceFrom: 14.6,
    deliveryYear: 2030,
    status: "Off-Plan",
    beachfront: false,
    types: ["Townhouse", "Twin House", "Standalone Villa"],
    amenities: [
      "Clubhouse",
      "Green Corridors",
      "Artificial Lakes",
      "Botanical Stations",
      "Sports Facilities",
      "Commercial Retail Area",
      "24/7 Security",
      "Backup Generators"
    ],
    hero: "/projects/scenes/1.jpeg",
    gallery: [
      "/projects/scenes/1.jpeg",
      "/projects/scenes/2.jpg",
      "/projects/scenes/3.jpg",
      "/projects/scenes/4.jpg",
      "/projects/scenes/5.jpg"
    ],
    blurb: "Scenes by Tatweer Misr is a luxury, low-density, villas-only residential compound spanning 100 acres in Mostakbal City, East Cairo. 80% of the land is dedicated to green landscapes, water features, and open spaces.",
    paymentPlan: "10 Years equal installments · 30% Cash Discount",
    areaSize: "100 feddan",
    unitSizes: "165–210 m²",
    type: "Residential",
    city: "Mostakbal City, East Cairo, Egypt",
    flagship: true,
    isNewLaunch: true,
    masterPlanUrl: "/Masterplans/scenes.jpg",
    highlights: [
      "Luxury low-density villas-only community (100 acres)",
      "80% green landscapes & water features, 20% footprint",
      "Townhouses from 14.6M, Standalones from 17.15M, Twin Houses from 17.8M",
      "10 years payment plan · 30% Cash Discount",
      "Delivered fully finished by Dec 2030",
      "Heart of Mostakbal City near Hub Town & Neom"
    ]
  });
}

const compoundsGenFile = path.join(rootDir, "src", "data", "compounds.generated.ts");
const compoundsCode = `import { Compound } from "./compounds";\n\nexport const compoundsGenerated: Compound[] = ${JSON.stringify(updatedCompounds, null, 2)};\n`;
fs.writeFileSync(compoundsGenFile, compoundsCode, "utf-8");
console.log("Successfully wrote compounds.generated.ts");

// ---------------------------------------------------------
// 2. Update availability.generated.ts
// ---------------------------------------------------------
const bloomfieldsAvail = {
  slug: "bloomfields",
  developer: "Tatweer Misr",
  totalAvailable: 16,
  breakdown: [
    {
      type: "1 Bedroom Apartment",
      beds: 1,
      available: 4,
      minSqm: 75,
      maxSqm: 95,
      minPriceM: 5.8,
      maxPriceM: 7.2,
      finishing: "Finished",
      deliveryNote: "Off-Plan",
      paymentPlan: "5% down · 8-10 years",
      units: [
        {
          id: "bf-1br-1",
          unitNo: "BF-101",
          beds: 1,
          finishing: "Finished",
          areaSqm: 75,
          view: "Landscape View",
          priceEGP: 5800000,
          status: "Available"
        },
        {
          id: "bf-1br-2",
          unitNo: "BF-102",
          beds: 1,
          finishing: "Finished",
          areaSqm: 85,
          view: "Park View",
          priceEGP: 6400000,
          status: "Available"
        }
      ]
    },
    {
      type: "2 Bedroom Apartment",
      beds: 2,
      available: 4,
      minSqm: 110,
      maxSqm: 135,
      minPriceM: 8.6,
      maxPriceM: 9.8,
      finishing: "Finished",
      deliveryNote: "Off-Plan",
      paymentPlan: "5% down · 8-10 years",
      units: [
        {
          id: "bf-2br-1",
          unitNo: "BF-201",
          beds: 2,
          finishing: "Finished",
          areaSqm: 110,
          view: "Garden View",
          priceEGP: 8600000,
          status: "Available"
        },
        {
          id: "bf-2br-2",
          unitNo: "BF-202",
          beds: 2,
          finishing: "Finished",
          areaSqm: 125,
          view: "Lagoon View",
          priceEGP: 9200000,
          status: "Available"
        }
      ]
    },
    {
      type: "3 Bedroom Apartment",
      beds: 3,
      available: 4,
      minSqm: 145,
      maxSqm: 175,
      minPriceM: 10.4,
      maxPriceM: 13.5,
      finishing: "Finished",
      deliveryNote: "Off-Plan",
      paymentPlan: "5% down · 8-10 years",
      units: [
        {
          id: "bf-3br-1",
          unitNo: "BF-301",
          beds: 3,
          finishing: "Finished",
          areaSqm: 145,
          view: "Central Park View",
          priceEGP: 10400000,
          status: "Available"
        },
        {
          id: "bf-3br-2",
          unitNo: "BF-302",
          beds: 3,
          finishing: "Finished",
          areaSqm: 165,
          view: "Lagoon & Landscape View",
          priceEGP: 12100000,
          status: "Available"
        }
      ]
    },
    {
      type: "Duplex",
      beds: 3,
      available: 4,
      minSqm: 200,
      maxSqm: 260,
      minPriceM: 22.1,
      maxPriceM: 26.5,
      finishing: "Finished",
      deliveryNote: "Off-Plan",
      paymentPlan: "5% down · 8-10 years",
      units: [
        {
          id: "bf-dup-1",
          unitNo: "BF-D-101",
          beds: 3,
          finishing: "Finished",
          areaSqm: 200,
          view: "Main Boulevard & Lagoon",
          priceEGP: 22100000,
          status: "Available"
        },
        {
          id: "bf-dup-2",
          unitNo: "BF-D-102",
          beds: 4,
          finishing: "Finished",
          areaSqm: 240,
          view: "Panoramic View",
          priceEGP: 24800000,
          status: "Available"
        }
      ]
    }
  ],
  lastUpdated: "2026-08-16",
  note: "Bloomfields Tatweer Misr: 1BR from 5.8M, 2BR from 8.6M, 3BR from 10.4M, Duplex from 22.1M"
};

const scenesAvail = {
  slug: "scenes",
  developer: "Tatweer Misr",
  totalAvailable: 12,
  breakdown: [
    {
      type: "Townhouse",
      beds: 3,
      available: 4,
      minSqm: 165,
      maxSqm: 185,
      minPriceM: 14.6,
      maxPriceM: 16.8,
      finishing: "Finished",
      deliveryNote: "Dec 2030",
      paymentPlan: "10 Years · 30% Cash Discount",
      units: [
        {
          id: "scenes-th-1",
          unitNo: "TH-101",
          beds: 3,
          finishing: "Finished",
          areaSqm: 165,
          view: "Green Corridor & Water Feature",
          priceEGP: 14600000,
          status: "Available"
        },
        {
          id: "scenes-th-2",
          unitNo: "TH-102",
          beds: 3,
          finishing: "Finished",
          areaSqm: 175,
          view: "Landscape View",
          priceEGP: 15200000,
          status: "Available"
        }
      ]
    },
    {
      type: "Standalone Villa",
      beds: 4,
      available: 4,
      minSqm: 190,
      maxSqm: 210,
      minPriceM: 17.15,
      maxPriceM: 19.8,
      finishing: "Finished",
      deliveryNote: "Dec 2030",
      paymentPlan: "10 Years · 30% Cash Discount",
      units: [
        {
          id: "scenes-sv-1",
          unitNo: "SV-201",
          beds: 4,
          finishing: "Finished",
          areaSqm: 190,
          view: "Botanical Station & Park View",
          priceEGP: 17150000,
          status: "Available"
        },
        {
          id: "scenes-sv-2",
          unitNo: "SV-202",
          beds: 4,
          finishing: "Finished",
          areaSqm: 205,
          view: "Private Garden View",
          priceEGP: 18500000,
          status: "Available"
        }
      ]
    },
    {
      type: "Twin House",
      beds: 4,
      available: 4,
      minSqm: 180,
      maxSqm: 200,
      minPriceM: 17.8,
      maxPriceM: 20.5,
      finishing: "Finished",
      deliveryNote: "Dec 2030",
      paymentPlan: "10 Years · 30% Cash Discount",
      units: [
        {
          id: "scenes-tw-1",
          unitNo: "TW-301",
          beds: 4,
          finishing: "Finished",
          areaSqm: 180,
          view: "Lake View",
          priceEGP: 17800000,
          status: "Available"
        },
        {
          id: "scenes-tw-2",
          unitNo: "TW-302",
          beds: 4,
          finishing: "Finished",
          areaSqm: 195,
          view: "Central Park View",
          priceEGP: 18900000,
          status: "Available"
        }
      ]
    }
  ],
  lastUpdated: "2026-08-16",
  note: "Scenes Tatweer Misr: Luxury villas compound in Mostakbal City. Townhouses from 14.6M, Standalones from 17.15M, Twin Houses from 17.8M. 10 yrs payment plan, 30% cash discount."
};

const updatedAvail = availability.filter((a) => a.slug !== "bloomfields" && a.slug !== "scenes");
updatedAvail.push(bloomfieldsAvail);
updatedAvail.push(scenesAvail);

const availGenFile = path.join(rootDir, "src", "data", "availability.generated.ts");
const availCode = `// Auto-generated from data/availability/ — do not edit by hand.\n// Run: npm run import-availability\nimport type { ProjectAvailability } from "./availability";\n\nexport const availability: ProjectAvailability[] = ${JSON.stringify(updatedAvail, null, 2)};\n`;
fs.writeFileSync(availGenFile, availCode, "utf-8");
console.log("Successfully wrote availability.generated.ts");
