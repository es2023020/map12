import { compoundsGenerated } from "../src/data/compounds.generated";
import { compoundRegistry } from "../src/data/compound-registry";

let countWithRegistryCoords = 0;
let countWithCoastKm = 0;
let countWithRoughCoords = 0;

const roughList: string[] = [];

for (const c of compoundsGenerated) {
  const reg = compoundRegistry[c.slug];
  if (reg && reg.lat != null && reg.lng != null) {
    countWithRegistryCoords++;
  } else if (c.km != null) {
    countWithCoastKm++;
  } else {
    countWithRoughCoords++;
    roughList.push(c.slug);
  }
}

console.log("Coordinate statistics:");
console.log("- Precise coordinates from registry:", countWithRegistryCoords);
console.log("- Coast KM coordinates:", countWithCoastKm);
console.log("- Rough / offset coordinates:", countWithRoughCoords);
console.log("\nSome rough coordinates project slugs:", roughList.slice(0, 15));
