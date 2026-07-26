import * as fs from "fs";
import * as path from "path";
import { compoundsGenerated } from "../src/data/compounds.generated";

const list = [
  "zed-east",
  "the-waterway",
  "marbay-ras-el-hekma",
  "la-vista-topaz",
  "la-vista-bay-east",
  "la-vista-gardens",
  "katameya-dunes",
  "katameya-heights",
  "kai-sokhna",
  "jebal-sokhna",
  "grova-east-hills",
  "fifth-square",
  "esse-residence",
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

console.log("=== CHECKING IMAGE FILE EXISTENCE ===");

const missing: string[] = [];

for (const slug of list) {
  const filePath = path.join(process.cwd(), "public", "projects", slug, "1.jpg");
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size < 100) {
    missing.push(slug);
    console.log(`❌ MISSING/INVALID IMAGE: public/projects/${slug}/1.jpg`);
  } else {
    console.log(`✅ HAS IMAGE (${fs.statSync(filePath).size} bytes): public/projects/${slug}/1.jpg`);
  }
}

console.log(`Total missing: ${missing.length}`);
