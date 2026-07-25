import { compoundsGenerated } from "../src/data/compounds.generated";

console.log("Total compounds:", compoundsGenerated.length);

for (const c of compoundsGenerated) {
  if (c.slug.includes("summer") || c.name.toLowerCase().includes("summer") ||
      c.slug.includes("sky") || c.name.toLowerCase().includes("sky") ||
      c.slug.includes("october") || c.name.toLowerCase().includes("october")) {
    console.log(`- Slug: "${c.slug}", Name: "${c.name}", Developer: "${c.developer}"`);
  }
}
