import { compoundsGenerated } from "../src/data/compounds.generated";

const list = [
  "zed-east",
  "the-waterway",
  "marbay-ras-el-hekma",
  "marbay",
  "la-vista-topaz",
  "la-vista-bay-east",
  "lavista-east",
  "la-vista-gardens",
  "katameya-dunes",
  "katameya-heights",
  "kai-sokhna",
  "jebal-sokhna",
  "grova-east-hills",
  "grove-east-hills",
  "fifth-square",
  "esse-residence",
  "esse",
  "elm-tree-park",
  "elm-tree-new-zayed",
  "diplo-3",
  "coral-coves",
  "citystars-park-street",
  "carnelia",
  "chapters-residence",
  "cairo-business-park",
  "business-district-nac",
  "blumar-sokhna",
  "business-district",
  "azzar-islands",
  "bamboo-extension",
  "azha-sokhna"
];

console.log("=== CHECKING SLUGS IN DATABASE ===");
for (const term of list) {
  const item = compoundsGenerated.find(c => c.slug === term || c.name.toLowerCase().includes(term.toLowerCase()));
  if (item) {
    console.log(`Found: [${term}] -> slug: "${item.slug}", name: "${item.name}", dest: "${item.destination}", hero: "${item.hero}"`);
  } else {
    console.log(`Not found exact: [${term}]`);
  }
}
