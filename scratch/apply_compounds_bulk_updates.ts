import * as fs from "fs";
import * as path from "path";
import { compoundsGenerated } from "../src/data/compounds.generated";

console.log(`Loaded ${compoundsGenerated.length} compounds from compounds.generated.ts`);

const updated = compoundsGenerated.map((c) => {
  const newC = { ...c };

  // Set cover page hero to the project's 1.jpg
  newC.hero = `/projects/${c.slug}/1.jpg`;

  // Specific project overrides
  if (c.slug === "marsa-baghush") {
    newC.km = 238;
    newC.lat = 31.13;
    newC.lng = 27.62;
    console.log(`Updated Marsa Baghush: km=${newC.km}, lat=${newC.lat}, lng=${newC.lng}`);
  }

  if (c.slug === "playa") {
    newC.priceFrom = 24;
    console.log(`Updated Playa: priceFrom=${newC.priceFrom}`);
  }

  if (c.slug === "zoya") {
    newC.priceFrom = 11;
    console.log(`Updated Zoya: priceFrom=${newC.priceFrom}`);
  }

  return newC;
});

const outputPath = path.join(process.cwd(), "src", "data", "compounds.generated.ts");
const outputContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(updated, null, 2)};
`;

fs.writeFileSync(outputPath, outputContent, "utf-8");
console.log("Successfully wrote compounds.generated.ts");
