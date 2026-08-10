import fs from "fs";
import path from "path";

const root = process.cwd();

// 1. Update ogami and caesar-bay in src/data/compounds.ts
const compPath = path.join(root, "src", "data", "compounds.ts");
let compCode = fs.readFileSync(compPath, "utf-8");

// Modify ogami raw definition in compounds.ts
// ogami definition in compounds.ts:
//   {
//     slug: "ogami",
//     name: "Ogami",
//     ...
compCode = compCode.replace(/slug:\s*"ogami"[\s\S]*?priceFrom:\s*[\d.]+/g, (m) =>
  m.replace(/priceFrom:\s*[\d.]+/, "priceFrom: 28.0"),
);
compCode = compCode.replace(/slug:\s*"ogami"[\s\S]*?paymentPlan:\s*"[^"]*"/g, (m) =>
  m.replace(/paymentPlan:\s*"[^"]*"/, 'paymentPlan: "5% down · 7 or 8 years equal installments"'),
);
compCode = compCode.replace(/slug:\s*"ogami"[\s\S]*?unitSizes:\s*"[^"]*"/g, (m) =>
  m.replace(/unitSizes:\s*"[^"]*"/, 'unitSizes: "150–215 m²"'),
);
compCode = compCode.replace(/slug:\s*"ogami"[\s\S]*?types:\s*\[[\s\S]*?\]/g, (m) =>
  m.replace(/types:\s*\[[\s\S]*?\]/, 'types: ["Townhouse", "Twin House", "Villa"]'),
);

// We should also update the priceFrom inside raw array sahelRaw for Ogami and Caesar Bay
//   ["Ogami", 205, "ras-el-hekma", "SODIC", 22, 2029, true],
compCode = compCode.replace(
  /\["Ogami",\s*205,\s*"ras-el-hekma",\s*"SODIC",\s*\d+,\s*2029,\s*true]/g,
  '["Ogami", 205, "ras-el-hekma", "SODIC", 28, 2029, true]',
);
//   ["Caesar Bay", 201, "ras-el-hekma", "SODIC", 9, 2026, true],
compCode = compCode.replace(
  /\["Caesar Bay",\s*201,\s*"ras-el-hekma",\s*"SODIC",\s*\d+,\s*2026,\s*true]/g,
  '["Caesar Bay", 201, "ras-el-hekma", "SODIC", 37, 2026, true]',
);

// Also modify caesar-bay static compound details if any exist in compounds.ts
// Let's check if caesar-bay has a block in compounds.ts.
// In compounds.ts, caesar-bay does not have a custom object definition, it's generated from raw.
// So raw update is sufficient.

fs.writeFileSync(compPath, compCode, "utf-8");
console.log("Updated compounds.ts raw and static definitions.");

// 2. Add availability details for ogami and caesar-bay to src/data/availability.generated.ts
const availPath = path.join(root, "src", "data", "availability.generated.ts");
let availCode = fs.readFileSync(availPath, "utf-8");

const ogamiAvail = {
  slug: "ogami",
  developer: "SODIC",
  totalAvailable: 4,
  lastUpdated: "2026-07-22",
  note: "EOI: EGP 250,000",
  breakdown: [
    {
      type: "Courtyard Town Villa",
      available: 1,
      minSqm: 150,
      maxSqm: 150,
      minPriceM: 28.0,
      maxPriceM: 32.0,
      finishing: "Core & Shell",
      deliveryNote: "3 Years",
      paymentPlan: "5% down · 7 or 8 years equal installments",
      units: [
        {
          id: "ogami-courtyard-town",
          unitNo: "Courtyard Town Villa",
          beds: 3,
          finishing: "Core & Shell",
          areaSqm: 150,
          view: "Garden View",
          priceEGP: 28000000,
          status: "Available",
        },
      ],
    },
    {
      type: "Oasis Twin Villa",
      available: 1,
      minSqm: 170,
      maxSqm: 170,
      minPriceM: 36.0,
      maxPriceM: 36.0,
      finishing: "Core & Shell",
      deliveryNote: "3 Years",
      paymentPlan: "5% down · 7 or 8 years equal installments",
      units: [
        {
          id: "ogami-oasis-twin",
          unitNo: "Oasis Twin Villa",
          beds: 3,
          finishing: "Core & Shell",
          areaSqm: 170,
          view: "Lagoon View",
          priceEGP: 36000000,
          status: "Available",
        },
      ],
    },
    {
      type: "The Houses",
      available: 1,
      minSqm: 180,
      maxSqm: 180,
      minPriceM: 45.0,
      maxPriceM: 45.0,
      finishing: "Core & Shell",
      deliveryNote: "3 Years",
      paymentPlan: "5% down · 7 or 8 years equal installments",
      units: [
        {
          id: "ogami-the-houses",
          unitNo: "The Houses G+1",
          beds: 3,
          finishing: "Core & Shell",
          areaSqm: 180,
          view: "Pool View",
          priceEGP: 45000000,
          status: "Available",
        },
      ],
    },
    {
      type: "Sea Breeze Villa",
      available: 1,
      minSqm: 215,
      maxSqm: 215,
      minPriceM: 50.0,
      maxPriceM: 50.0,
      finishing: "Core & Shell",
      deliveryNote: "3 Years",
      paymentPlan: "5% down · 7 or 8 years equal installments",
      units: [
        {
          id: "ogami-sea-breeze",
          unitNo: "Sea Breeze Villa Oasis",
          beds: 3, // 3 + Guest
          finishing: "Core & Shell",
          areaSqm: 215,
          view: "Sea View",
          priceEGP: 50000000,
          status: "Available",
          areaNote: "+ Guest Bedroom",
        },
      ],
    },
  ],
};

const caesarBayAvail = {
  slug: "caesar-bay",
  developer: "SODIC",
  totalAvailable: 3,
  lastUpdated: "2026-07-22",
  note: "EOI: EGP 250,000",
  breakdown: [
    {
      type: "Shell Townhouse",
      available: 1,
      minSqm: 180,
      maxSqm: 180,
      minPriceM: 37.0,
      maxPriceM: 37.0,
      finishing: "Core & Shell",
      deliveryNote: "Ready",
      paymentPlan: "5% down · 8 years equal installments",
      units: [
        {
          id: "caesar-bay-townhouse",
          unitNo: "Shell Townhouse",
          beds: 3,
          finishing: "Core & Shell",
          areaSqm: 180,
          view: "Lagoon View",
          priceEGP: 37000000,
          status: "Available",
        },
      ],
    },
    {
      type: "Bliss Twin Villa",
      available: 1,
      minSqm: 210,
      maxSqm: 210,
      minPriceM: 43.0,
      maxPriceM: 43.0,
      finishing: "Core & Shell",
      deliveryNote: "Ready",
      paymentPlan: "5% down · 8 years equal installments",
      units: [
        {
          id: "caesar-bay-twin",
          unitNo: "Bliss Twin Villa",
          beds: 3,
          finishing: "Core & Shell",
          areaSqm: 210,
          view: "Sea & Lagoon View",
          priceEGP: 43000000,
          status: "Available",
        },
      ],
    },
    {
      type: "Crystal Villa",
      available: 1,
      minSqm: 200,
      maxSqm: 200,
      minPriceM: 46.0,
      maxPriceM: 46.0,
      finishing: "Core & Shell",
      deliveryNote: "Ready",
      paymentPlan: "5% down · 8 years equal installments",
      units: [
        {
          id: "caesar-bay-crystal-villa",
          unitNo: "Crystal Villa",
          beds: 4,
          finishing: "Core & Shell",
          areaSqm: 200,
          view: "Sea View",
          priceEGP: 46000000,
          status: "Available",
        },
      ],
    },
  ],
};

// Check and append to availability.generated.ts
function addOrReplace(slug, data) {
  if (availCode.includes(`"slug": "${slug}"`) || availCode.includes(`slug: "${slug}"`)) {
    console.log(`Replacing existing ${slug} in availability...`);
    const regex = new RegExp(
      `\\{\\s*(?:slug|\\"slug\\"):\\s*\\"${slug}\\"[\\s\\S]*?\\}\\s*,?\\s*\\n?`,
      "g",
    );
    availCode = availCode.replace(regex, "");
  }
  // Append right before closing bracket
  availCode = availCode.replace(/\];\s*$/, `  ${JSON.stringify(data, null, 2)},\n];`);
}

addOrReplace("ogami", ogamiAvail);
addOrReplace("caesar-bay", caesarBayAvail);

fs.writeFileSync(availPath, availCode, "utf-8");
console.log("Appended ogami and caesar-bay availability to availability.generated.ts");
