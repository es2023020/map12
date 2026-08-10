import * as fs from "fs";
import * as path from "path";
import { compoundsGenerated } from "../src/data/compounds.generated";

console.log("Applying Cleo and project deletes...");

const compoundsPath = path.join(process.cwd(), "src", "data", "compounds.ts");
const locationsPath = path.join(process.cwd(), "src", "data", "project-locations.ts");
const generatedPath = path.join(process.cwd(), "src", "data", "compounds.generated.ts");

// 1. Update src/data/compounds.ts
let compoundsText = fs.readFileSync(compoundsPath, "utf-8");

// Remove Cleo Mostakbal raw line
compoundsText = compoundsText.replace(
  /\s*\{\s*name:\s*"Cleo Mostakbal",\s*destination:\s*"mostakbal-city",[^}]*\},/g,
  "",
);

// Replace cleo-water-residence static details
const newCleoWaterResidenceBlock = `  {
    slug: "cleo-water-residence",
    name: "Cleo Water Residence",
    destination: "new-cairo",
    lat: 30.015, lng: 31.545,
    developer: "Palm Hills Developments",
    developerSlug: "palm-hills-developments",
    priceFrom: 10,
    deliveryYear: 2027,
    status: "Under Construction",
    beachfront: false,
    types: ["Apartment"],
    amenities: ["Swimming pools", "Sports areas", "Tennis courts", "Yoga areas", "Underground parking", "Dedicated medical services"],
    hero: "/projects/cleo-water-residence/1.jpg",
    gallery: ["/projects/cleo-water-residence/1.jpg","/projects/cleo-water-residence/2.jpg","/projects/cleo-water-residence/3.jpg","/projects/cleo-water-residence/4.jpg"],
    blurb: "Cleo Water Residences is a luxury residential phase located within the Palm Hills New Cairo compound in Egypt, featuring fully finished apartments, scenic lagoons, and vast open green spaces.",
    paymentPlan: "10% down · 8 years equal installments",
    areaSize: "82% green & water space",
    unitSizes: "70–170 m²",
    type: "Residential",
    highlights: ["Palm Hills Developments", "Located in Palm Hills New Cairo", "82% open green spaces", "5,000 m² lake & lagoons"],
  }`;

compoundsText = compoundsText.replace(
  /\{\s*slug:\s*"cleo-water-residence"[\s\S]*?highlighted[\s\S]*?\n\s*\}/g,
  newCleoWaterResidenceBlock,
);

// We should also replace the standard regex if it matches slightly differently
compoundsText = compoundsText.replace(
  /\{\s*slug:\s*"cleo-water-residence"[\s\S]*?Sidi Abdelrahman location"[\s\S]*?\n\s*\}/g,
  newCleoWaterResidenceBlock,
);

fs.writeFileSync(compoundsPath, compoundsText, "utf-8");
console.log("Updated compounds.ts");

// 2. Update src/data/project-locations.ts
let locationsText = fs.readFileSync(locationsPath, "utf-8");
locationsText = locationsText.replace(/\s*"cleo-mostakbal":\s*\{[^}]*\},/g, "");
locationsText = locationsText.replace(/\s*"palm-hills-october":\s*\{[^}]*\},/g, "");

// Add/update cleo-water-residence in locations
if (locationsText.includes('"cleo-water-residence"')) {
  locationsText = locationsText.replace(
    /"cleo-water-residence":\s*\{[^}]*\}/g,
    '"cleo-water-residence": { name: "Cleo Water Residence", destination: "new-cairo", location: "Palm Hills New Cairo, New Cairo, Egypt", mapsUrl: "https://maps.google.com/?q=Palm+Hills+New+Cairo+Egypt" }',
  );
} else {
  locationsText = locationsText.replace(
    "export const projectLocations: Record<string, ProjectLocation> = {",
    `export const projectLocations: Record<string, ProjectLocation> = {\n  "cleo-water-residence": { name: "Cleo Water Residence", destination: "new-cairo", location: "Palm Hills New Cairo, New Cairo, Egypt", mapsUrl: "https://maps.google.com/?q=Palm+Hills+New+Cairo+Egypt" },`,
  );
}

fs.writeFileSync(locationsPath, locationsText, "utf-8");
console.log("Updated project-locations.ts");

// 3. Update compoundsGenerated in compounds.generated.ts
const deleteSlugs = new Set(["cleo-mostakbal", "palm-hills-october"]);
const updatedList = compoundsGenerated
  .filter((c) => !deleteSlugs.has(c.slug))
  .map((c) => {
    const newC = { ...c };

    // Set Belle Vie cover to 3.jpg
    if (newC.slug === "belle-vie") {
      newC.hero = "/projects/belle-vie/3.jpg";
    }

    if (newC.slug === "cleo-water-residence") {
      newC.destination = "new-cairo";
      newC.city = "Palm Hills New Cairo, New Cairo, Egypt";
      newC.lat = 30.015;
      newC.lng = 31.545;
      delete newC.km;
      newC.beachfront = false;
      newC.types = ["Apartment"];
      newC.amenities = [
        "Swimming pools",
        "Sports areas",
        "Tennis courts",
        "Yoga areas",
        "Underground parking",
        "Dedicated medical services",
      ];
      newC.blurb =
        "Cleo Water Residences is a luxury residential phase located within the Palm Hills New Cairo compound in Egypt, featuring fully finished apartments, scenic lagoons, and vast open green spaces.";
      newC.areaSize = "82% green & water space";
      newC.unitSizes = "70–170 m²";
      newC.type = "Residential";
      newC.highlights = [
        "Palm Hills Developments",
        "Located in Palm Hills New Cairo",
        "82% open green spaces",
        "5,000 m² lake & lagoons",
      ];
    }

    return newC;
  });

console.log(`Original: ${compoundsGenerated.length}, New: ${updatedList.length}`);

const outputContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(updatedList, null, 2)};
`;

fs.writeFileSync(generatedPath, outputContent, "utf-8");
console.log("Updated compounds.generated.ts");
