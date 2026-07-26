import * as fs from "fs";
import * as path from "path";
import { compoundsGenerated } from "../src/data/compounds.generated";

console.log("Deleting specified projects from databases...");

const compoundsPath = path.join(process.cwd(), "src", "data", "compounds.ts");
const locationsPath = path.join(process.cwd(), "src", "data", "project-locations.ts");
const generatedPath = path.join(process.cwd(), "src", "data", "compounds.generated.ts");

const deleteSlugs = new Set([
  "palm-hills-alexandria",
  "sheraton-residences",
  "soma-sharm",
  "palm-hills-october" // double check it's gone
]);

// 1. Update src/data/compounds.ts
if (fs.existsSync(compoundsPath)) {
  let text = fs.readFileSync(compoundsPath, "utf-8");
  
  // Remove Sheraton Residences raw line
  text = text.replace(
    /\s*\{\s*name:\s*"Sheraton Residences",[^}]+?\},/g,
    ""
  );
  
  // Remove Soma Sharm raw line
  text = text.replace(
    /\s*\{\s*name:\s*"Soma Sharm",[^}]+?\},/g,
    ""
  );
  
  // Remove Palm Hills Alexandria static block
  text = text.replace(
    /\{\s*slug:\s*"palm-hills-alexandria"[\s\S]*?year-round Mediterranean living\.",[\s\S]*?\},/g,
    ""
  );
  // Also alternate patterns
  text = text.replace(
    /\{\s*slug:\s*"palm-hills-alexandria"[\s\S]*?highlights:\s*\[[^\]]+?\]\s*\},/g,
    ""
  );

  fs.writeFileSync(compoundsPath, text, "utf-8");
  console.log("Updated compounds.ts");
}

// 2. Update src/data/project-locations.ts
if (fs.existsSync(locationsPath)) {
  let text = fs.readFileSync(locationsPath, "utf-8");
  
  for (const slug of deleteSlugs) {
    const regex = new RegExp(`\\s*"${slug}":\\s*\\{[^}]*\\},`, "g");
    text = text.replace(regex, "");
  }
  
  fs.writeFileSync(locationsPath, text, "utf-8");
  console.log("Updated project-locations.ts");
}

// 3. Update compounds.generated.ts
const updatedList = compoundsGenerated.filter(c => !deleteSlugs.has(c.slug));

console.log(`Original count: ${compoundsGenerated.length}, New count: ${updatedList.length}`);

const outputContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(updatedList, null, 2)};
`;

fs.writeFileSync(generatedPath, outputContent, "utf-8");
console.log("Updated compounds.generated.ts");
