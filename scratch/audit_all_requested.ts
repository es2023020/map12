import { compoundsGenerated } from "../src/data/compounds.generated";

console.log("=== AUDIT OF ALL REQUESTED PROJECTS ===");

const slugsToAudit = [
  "azzar-islands",
  "mountain-view-crystal",
  "sodic-east",
  "district-5",
  "keeva",
  "el-patio-vera",
  "elm-tree-park",
  "lvls",
  "the-mornings",
  "crescent-walk",
  "shamasi",
  "sodic-the-estates",
  "solana",
  "dejoya-residence",
  "v-levels",
  "one33",
  "vye-sodic",
  "palm-hills-jirian",
  "playa"
];

for (const slug of slugsToAudit) {
  const item = compoundsGenerated.find(c => c.slug === slug);
  if (!item) {
    console.log(`❌ MISSING SLUG: ${slug}`);
  } else {
    console.log(`✅ [${slug}]`);
    console.log(`   Name: ${item.name}`);
    console.log(`   Destination: ${item.destination}`);
    console.log(`   Developer: ${item.developer}`);
    console.log(`   PriceFrom: ${item.priceFrom}`);
    console.log(`   Delivery: ${item.deliveryYear}`);
    console.log(`   AreaSize: ${item.areaSize}`);
    console.log(`   Lat/Lng: [${item.lat}, ${item.lng}]`);
    console.log(`   Km: ${item.km ?? 'N/A'}`);
    console.log(`   Hero: ${item.hero}`);
  }
}

const checkAbsence = ["palm-hills-sheikh-zayed", "playa-seashell", "palm-hills-alexandria", "sheraton-residences", "soma-sharm"];
for (const slug of checkAbsence) {
  const item = compoundsGenerated.find(c => c.slug === slug);
  if (item) {
    console.log(`❌ SHOULD BE ABSENT BUT FOUND: ${slug}`);
  } else {
    console.log(`✅ ABSENT AS EXPECTED: ${slug}`);
  }
}
