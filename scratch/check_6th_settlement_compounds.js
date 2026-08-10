import { compounds } from "../src/data/compounds.js";

const res = compounds.filter((c) => c.destination === "6th-settlement");
console.log("Total 6th Settlement compounds:", res.length);
console.log(
  "Compounds:",
  res.map((c) => ({ slug: c.slug, name: c.name, dev: c.developer })),
);
