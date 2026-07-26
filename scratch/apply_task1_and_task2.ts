import * as fs from "fs";
import * as path from "path";
import { compoundsGenerated } from "../src/data/compounds.generated";

console.log("Applying Task 1 (The Med developer fix) and Task 2 (Masterplan attachments)...");

const generatedPath = path.join(process.cwd(), "src", "data", "compounds.generated.ts");
const compoundsPath = path.join(process.cwd(), "src", "data", "compounds.ts");

// Map of masterplan filename to target project slug
const masterplanMappings: Record<string, string> = {
  "31 west.jpg": "31-west",
  "97 hills.jpg": "97-hills",
  "aeon.jpg": "aeon",
  "alam el roum.jpg": "alam-al-roum",
  "aliva.jpg": "mountain-view-aliva",
  "allegria.jpg": "allegria",
  "almaza bay.jpg": "almaza-bay",
  "amwaj.jpg": "amwaj",
  "anakaji.jpg": "anakaji",
  "at east.jpg": "at-east",
  "azha north coast.jpg": "azha-north-coast",
  "Azha.jpg": "azha-sokhna",
  "azzar island.jpg": "azzar-islands",
  "badya.jpg": "badya",
  "beit el bahr.jpg": "beit-al-bahr",
  "belle vie.jpg": "belle-vie",
  "belle vie.png": "belle-vie",
  "bianchii illios.jpg": "bianchi-ilios",
  "blumar.jpg": "blumar-sokhna",
  "bombooo.jpg": "bamboo-extension",
  "caesar.jpg": "caesar-sodic",
  "cairo gate.jpg": "cairo-gate",
  "chapters residence.jpg": "chapters-residence",
  "chillout.jpg": "mountain-view-chillout",
  "city oval.jpg": "city-oval",
  "cresent walk.jpg": "crescent-walk",
  "crysta.jpg": "mountain-view-crystal",
  "d bay.jpg": "d-bay",
  "dayz.jpg": "days",
  "diplo 3.jpg": "diplo-3",
  "direction white.jpg": "direction-white",
  "dose.jpg": "d-o-s-e",
  "gaia.jpg": "gaia",
  "grand valley.jpg": "mountain-view-grand-valley",
  "hacienda bay.jpg": "hacienda-bay",
  "hacienda blue.jpg": "hacienda-blue",
  "hacienda heniesh.jpg": "hacienda-heneish",
  "Hacienda ras El Hdekma .avif": "hacienda-ras-el-hekma",
  "hacienda waters.jpg": "hacienda-waters",
  "icity cairo.jpg": "mountain-view-icity-new-cairo",
  "illatini city edge.jpg": "il-latini-city-edge",
  "jamila.jpg": "jamila",
  "jefaira.jpg": "jefaira",
  "jirian.jpg": "palm-hills-jirian",
  "june.jpg": "june-north-coast",
  "katameya coast.png": "katameya-coast",
  "katameya dunes.jpg": "katameya-dunes",
  "katameya heights.jpg": "katameya-heights",
  "keeva.jpg": "keeva",
  "kinda.jpg": "kinda-residence",
  "koun.jpg": "koun",
  "la vista ras elhikma.jpg": "la-vista-ras-el-hekma",
  "lavista bay.jpg": "la-vista-bay",
  "lavista casada.jpg": "la-vista-cascada",
  "lvls.jpg": "lvls",
  "lyv.jpg": "lyv",
  "m4.jpg": "mountain-view-mv4",
  "madinaty.jpg": "madinaty",
  "makadi.jpg": "makadi-heights",
  "marbay.jpg": "marbay-ras-el-hekma",
  "marrassi.jpg": "marassi",
  "marsa boughash.jpg": "marsa-baghush",
  "masaya.jpg": "masaya",
  "mazarine.jpg": "mazarine",
  "mivida.jpg": "mivida",
  "mountain view ras elhekma.jpg": "mountain-view-ras-el-hekma",
  "murano.jpg": "murano",
  "mv ras elhikma.jpg": "mountain-view-ras-el-hekma",
  "naia bay.jpg": "naia-bay",
  "o west.jpg": "o-west",
  "ogami.jpg": "ogami",
  "Palm hills katameya jpg": "palm-hills-katameya",
  "palm hills new cairo.jpg": "palm-hills-new-cairo",
  "patio town.jpg": "el-patio-town",
  "Ramla.jpg": "ramla",
  "saada.jpg": "sa-ada-sahel",
  "sadaf.jpg": "sadaf-north-coast",
  "safia.jpg": "safia",
  "salt.jpg": "salt-north-coast",
  "sarai.jpg": "sarai",
  "seashell.jpg": "seashell-ras-el-hekma",
  "seashore.jpg": "hyde-park-north-seashore",
  "seazen.jpg": "seazen",
  "shamassi.jpg": "shamasi",
  "SOLARE.jpg": "solare",
  "soul.png": "soul",
  "south med.jpg": "south-med",
  "stella heights.jpg": "stella-heights",
  "Talala.jpg": "talala",
  "telal.jpg": "telal-east",
  "the c.jpg": "the-c",
  "the med.jpg": "the-med",
  "the waterway northcoast.jpg": "the-waterway",
  "uptown cairo.jpg": "uptown-cairo",
  "VEA.jpg": "vea-new-cairo",
  "VYE.jpg": "vye-sodic",
  "youd.jpg": "youd",
  "Zahra.jpg": "zahra",
  "ZED east.jpg": "zed-east",
  "Zoya.jpg": "zoya"
};

// Invert map: slug -> masterplanUrl
const slugToMasterplan: Record<string, string> = {};
for (const [filename, slug] of Object.entries(masterplanMappings)) {
  slugToMasterplan[slug] = `/Masterplans/${filename}`;
}

// 1. Update compounds.generated.ts
const updatedCompounds = compoundsGenerated.map(c => {
  let updatedC = { ...c };

  // Task 1: Fix developer for "the-med"
  if (c.slug === "the-med") {
    updatedC.developer = "People and Places";
    updatedC.developerSlug = "people-and-places";
    updatedC.blurb = c.blurb.replace(/PRE Developments/g, "People and Places");
    console.log("✅ Updated developer for The Med to People and Places");
  }

  // Task 2: Attach masterplanUrl
  if (slugToMasterplan[c.slug]) {
    updatedC.masterPlanUrl = slugToMasterplan[c.slug];
  }

  return updatedC;
});

const outputContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(updatedCompounds, null, 2)};
`;

fs.writeFileSync(generatedPath, outputContent, "utf-8");
console.log("Updated compounds.generated.ts");

// 2. Update compounds.ts static data for "the-med"
if (fs.existsSync(compoundsPath)) {
  let text = fs.readFileSync(compoundsPath, "utf-8");
  text = text.replace(
    /\["The Med", 192, "ras-el-hekma", "PRE Developments", 11, 2027, true\],/,
    '["The Med", 192, "ras-el-hekma", "People and Places", 11, 2027, true],'
  );
  fs.writeFileSync(compoundsPath, text, "utf-8");
  console.log("Updated compounds.ts");
}
