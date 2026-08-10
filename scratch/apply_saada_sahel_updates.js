import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

// 1. Update saada-sahel in compounds.ts
const compPath = path.join(root, "src", "data", "compounds.ts");
let compCode = fs.readFileSync(compPath, "utf-8");

compCode = compCode.replace(/slug:\s*"saada-sahel"[\s\S]*?priceFrom:\s*[\d.]+/g, (m) =>
  m.replace(/priceFrom:\s*[\d.]+/, "priceFrom: 21.5"),
);
compCode = compCode.replace(/slug:\s*"saada-sahel"[\s\S]*?deliveryYear:\s*\d+/g, (m) =>
  m.replace(/deliveryYear:\s*\d+/, "deliveryYear: 2029"),
);
compCode = compCode.replace(/slug:\s*"saada-sahel"[\s\S]*?types:\s*\[[\s\S]*?\]/g, (m) =>
  m.replace(/types:\s*\[[\s\S]*?\]/, 'types: ["Chalet", "Townhouse", "Villa"]'),
);
compCode = compCode.replace(/slug:\s*"saada-sahel"[\s\S]*?paymentPlan:\s*"[^"]*"/g, (m) =>
  m.replace(
    /paymentPlan:\s*"[^"]*"/,
    'paymentPlan: "5% down · 5% after 3 mos · 9 years equal installments"',
  ),
);
compCode = compCode.replace(/slug:\s*"saada-sahel"[\s\S]*?areaSize:\s*"[^"]*"/g, (m) =>
  m.replace(/areaSize:\s*"[^"]*"/, 'areaSize: "125 feddan"'),
);
compCode = compCode.replace(/slug:\s*"saada-sahel"[\s\S]*?unitSizes:\s*"[^"]*"/g, (m) =>
  m.replace(/unitSizes:\s*"[^"]*"/, 'unitSizes: "149–500 m²"'),
);

fs.writeFileSync(compPath, compCode, "utf-8");
console.log("Updated saada-sahel metadata in compounds.ts");

// 2. Append/update saada-sahel in availability.generated.ts
const availPath = path.join(root, "src", "data", "availability.generated.ts");
let availCode = fs.readFileSync(availPath, "utf-8");

const saadaAvail = {
  slug: "saada-sahel",
  developer: "Horizon Egypt Developments",
  totalAvailable: 7,
  lastUpdated: "2026-07-22",
  breakdown: [
    {
      type: "Chalet",
      beds: 2,
      available: 1,
      minSqm: 149,
      maxSqm: 149,
      minPriceM: 21.5,
      maxPriceM: 21.5,
      finishing: "Fully Finished",
      deliveryNote: "3 Years",
      paymentPlan: "5% down · 5% after 3 mos · 9 years",
      units: [
        {
          id: "saada-sahel-chalet-2br",
          unitNo: "Chalet 2BR",
          beds: 2,
          finishing: "Fully Finished",
          areaSqm: 149,
          view: "Garden & Lagoon",
          priceEGP: 21500000,
          status: "Available",
          areaNote: "+ Roof",
        },
      ],
    },
    {
      type: "Chalet",
      beds: 3,
      available: 1,
      minSqm: 168,
      maxSqm: 168,
      minPriceM: 25.8,
      maxPriceM: 25.8,
      finishing: "Fully Finished",
      deliveryNote: "3 Years",
      paymentPlan: "5% down · 5% after 3 mos · 9 years",
      units: [
        {
          id: "saada-sahel-chalet-3br",
          unitNo: "Chalet 3BR",
          beds: 3,
          finishing: "Fully Finished",
          areaSqm: 168,
          view: "Garden & Lagoon",
          priceEGP: 25800000,
          status: "Available",
          areaNote: "+ Garden",
        },
      ],
    },
    {
      type: "Townhouse",
      available: 1,
      minSqm: 278,
      maxSqm: 278,
      minPriceM: 34.5,
      maxPriceM: 34.5,
      finishing: "Fully Finished",
      deliveryNote: "3 Years",
      paymentPlan: "5% down · 5% after 3 mos · 9 years",
      units: [
        {
          id: "saada-sahel-townhouse",
          unitNo: "Town 278m",
          beds: 4,
          finishing: "Fully Finished",
          areaSqm: 278,
          view: "Sea & Lagoon",
          priceEGP: 34500000,
          status: "Available",
        },
      ],
    },
    {
      type: "Standalone Villa",
      available: 4,
      minSqm: 394,
      maxSqm: 500,
      minPriceM: 78.5,
      maxPriceM: 320.0,
      finishing: "Fully Finished",
      deliveryNote: "3 Years",
      paymentPlan: "5% down · 5% after 3 mos · 9 years",
      units: [
        {
          id: "saada-sahel-large-villa",
          unitNo: "Large Villa 394m",
          beds: 5,
          finishing: "Fully Finished",
          areaSqm: 394,
          view: "Sea View",
          priceEGP: 78500000,
          status: "Available",
        },
        {
          id: "saada-sahel-orizo",
          unitNo: "Orizo G+1 (3rd row)",
          beds: 6,
          finishing: "Fully Finished",
          areaSqm: 450,
          view: "3rd row Sea View",
          priceEGP: 216000000,
          status: "Available",
        },
        {
          id: "saada-sahel-nisi",
          unitNo: "Nisi one story (2nd row)",
          beds: 5,
          finishing: "Fully Finished",
          areaSqm: 480,
          view: "2nd row Sea View",
          priceEGP: 244000000,
          status: "Available",
        },
        {
          id: "saada-sahel-miraki",
          unitNo: "Miraki one story (1st row)",
          beds: 6,
          finishing: "Fully Finished",
          areaSqm: 500,
          view: "1st row beachfront",
          priceEGP: 320000000,
          status: "Available",
        },
      ],
    },
  ],
};

// Check if saada-sahel already exists in availability.generated.ts, replace if exists, otherwise append
if (availCode.includes('"saada-sahel"')) {
  // Replace existing entry
  availCode = availCode.replace(
    /\{\s*slug:\s*"saada-sahel"[\s\S]*?\}\s*,\s*\n\s*\]/g,
    (m) => `${JSON.stringify(saadaAvail, null, 2)},\n]`,
  );
} else {
  // Append before the closing bracket of the array
  availCode = availCode.replace(/\];\s*$/, `  ${JSON.stringify(saadaAvail, null, 2)},\n];`);
}

fs.writeFileSync(availPath, availCode, "utf-8");
console.log("Appended saada-sahel availability to availability.generated.ts");
