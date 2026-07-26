import * as fs from "fs";
import * as path from "path";
import { compoundsGenerated } from "../src/data/compounds.generated";

console.log("Updating Esse Residence destination to new-cairo...");

const generatedPath = path.join(process.cwd(), "src", "data", "compounds.generated.ts");
const locationsPath = path.join(process.cwd(), "src", "data", "project-locations.ts");
const compoundsPath = path.join(process.cwd(), "src", "data", "compounds.ts");

// 1. Update compounds.generated.ts
const updated = compoundsGenerated.map(c => {
  if (c.slug === "esse-residence") {
    return {
      ...c,
      destination: "new-cairo",
      city: "Cairo-Suez Road, New Cairo, Egypt (within Sarai Compound)"
    };
  }
  return c;
});

const outputContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(updated, null, 2)};
`;
fs.writeFileSync(generatedPath, outputContent, "utf-8");
console.log("Updated compounds.generated.ts");

// 2. Update project-locations.ts
if (fs.existsSync(locationsPath)) {
  let text = fs.readFileSync(locationsPath, "utf-8");
  text = text.replace(
    /"esse-residence":\s*\{[^}]+\},/,
    `"esse-residence": { name: "Esse Residence", destination: "new-cairo", location: "Cairo-Suez Road, New Cairo (Sarai Compound)", mapsUrl: "https://maps.google.com/?q=Esse+Residence+Sarai+New+Cairo" },`
  );
  fs.writeFileSync(locationsPath, text, "utf-8");
  console.log("Updated project-locations.ts");
}

// 3. Update compounds.ts static/raw
if (fs.existsSync(compoundsPath)) {
  let text = fs.readFileSync(compoundsPath, "utf-8");
  text = text.replace(
    /slug:\s*"esse-residence"[\s\S]*?destination:\s*"new-administrative-capital"/,
    `slug: "esse-residence",\n    destination: "new-cairo"`
  );
  fs.writeFileSync(compoundsPath, text, "utf-8");
  console.log("Updated compounds.ts");
}
