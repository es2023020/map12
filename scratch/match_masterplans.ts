import * as fs from "fs";
import * as path from "path";
import { compoundsGenerated } from "../src/data/compounds.generated";

const masterplanDir = path.join(process.cwd(), "public", "Masterplans");
const files = fs.readdirSync(masterplanDir);

console.log(`Found ${files.length} masterplan files in ${masterplanDir}\n`);

// Helper to normalize strings for comparison
const normalize = (str: string) =>
  str
    .toLowerCase()
    .replace(/\.(jpg|jpeg|png|avif|webp)$/i, "")
    .replace(/[^a-z0-9]/g, "");

// Build lookup dictionary of compounds by normalized name & normalized slug
const compoundMap = new Map<string, any>();
const normalizedSlugs = new Map<string, any>();

for (const c of compoundsGenerated) {
  compoundMap.set(normalize(c.name), c);
  normalizedSlugs.set(normalize(c.slug), c);
}

// Special alias dictionary for common file names to project slugs
const aliases: Record<string, string> = {
  "31 west": "31-west",
  "97 hills": "97-hills",
  Azha: "azha-sokhna", // Note: Azha.jpg could be Azha Sokhna or Azha North Coast
  "azha north coast": "azha-north-coast",
  "Hacienda ras El Hdekma": "hacienda-ras-el-hekma",
  "Palm hills katameya": "palm-hills-katameya",
  Ramla: "ramla",
  SOLARE: "solare",
  Talala: "talala",
  VEA: "vea-new-cairo",
  VYE: "vye-sodic",
  "ZED east": "zed-east",
  Zahra: "zahra",
  Zoya: "zoya",
  aeon: "aeon",
  "alam el roum": "alam-al-roum",
  aliva: "aliva",
  allegria: "allegria",
  "almaza bay": "almaza-bay",
  amwaj: "amwaj",
  anakaji: "anakaji",
  "at east": "at-east",
  "azzar island": "azzar-islands",
  badya: "badya",
  "beit el bahr": "beit-al-bahr",
  "belle vie": "belle-vie",
  "bianchii illios": "bianchi-ilios",
  blumar: "blumar-sokhna",
  bombooo: "bamboo",
  caesar: "caesar-sodic",
  "cairo gate": "cairo-gate",
  "chapters residence": "chapters-residence",
  chillout: "mountain-view-chillout",
  "city oval": "city-oval",
  "cresent walk": "crescent-walk",
  crysta: "mountain-view-crystal",
  "d bay": "d-bay",
  dayz: "days",
  "diplo 3": "diplo-3",
  "direction white": "direction-white",
  dose: "dose",
  gaia: "gaia",
  "grand valley": "mountain-view-grand-valley",
  "hacienda bay": "hacienda-bay",
  "hacienda blue": "hacienda-blue",
  "hacienda heniesh": "hacienda-heneish",
  "hacienda waters": "hacienda-waters",
  "icity cairo": "icity-mountain-view",
  "illatini city edge": "illatini",
  jamila: "jamila",
  jefaira: "jefaira",
  jirian: "palm-hills-jirian",
  june: "june-north-coast",
  "katameya coast": "katameya-coast",
  "katameya dunes": "katameya-dunes",
  "katameya heights": "katameya-heights",
  keeva: "keeva",
  kinda: "kinda-residence",
  koun: "koun",
  "la vista ras elhikma": "la-vista-ras-el-hekma",
  laserina: "la-serena",
  "lavista bay": "la-vista-bay",
  "lavista casada": "la-vista-casada",
  lvls: "lvls",
  lyv: "lyv",
  m4: "mountain-view-mv4",
  madinaty: "madinaty",
  makadi: "makadi-heights",
  marbay: "marbay-ras-el-hekma",
  marrassi: "marassi",
  "marsa boughash": "marsa-baghush",
  masaya: "masaya",
  mazarine: "mazarine",
  mivida: "mivida",
  "mountain view ras elhekma": "mountain-view-ras-el-hekma",
  murano: "murano",
  "mv ras elhikma": "mountain-view-ras-el-hekma",
  "naia bay": "naia-bay",
  "o west": "o-west",
  ogami: "ogami",
  "palm hills new cairo": "palm-hills-new-cairo",
  "patio town": "el-patio-town",
  saada: "sa-ada-sahel",
  sadaf: "sadaf-north-coast",
  safia: "safia",
  salt: "salt-north-coast",
  sarai: "sarai",
  seashell: "seashell-ras-el-hekma",
  seashore: "hyde-park-north-seashore",
  seazen: "seazen",
  shamassi: "shamasi",
  soul: "soul",
  "south med": "south-med",
  "stella heights": "stella-heights",
  telal: "telal-east",
  "the c": "the-c",
  "the med": "the-med",
  "the waterway northcoast": "the-waterway",
  "uptown cairo": "uptown-cairo",
  youd: "youd",
};

const matches: { file: string; projectSlug: string; projectName: string; confidence: string }[] =
  [];
const unmatchedFiles: string[] = [];

for (const file of files) {
  const baseNameNoExt = file.replace(/\.(jpg|jpeg|png|avif|webp)$/i, "").trim();

  // 1. Check alias lookup
  if (aliases[baseNameNoExt]) {
    const slug = aliases[baseNameNoExt];
    const project = compoundsGenerated.find((c) => c.slug === slug);
    if (project) {
      matches.push({
        file,
        projectSlug: project.slug,
        projectName: project.name,
        confidence: "HIGH",
      });
      continue;
    }
  }

  // 2. Direct normalized match
  const norm = normalize(baseNameNoExt);
  const matchByName = compoundMap.get(norm) || normalizedSlugs.get(norm);
  if (matchByName) {
    matches.push({
      file,
      projectSlug: matchByName.slug,
      projectName: matchByName.name,
      confidence: "HIGH",
    });
    continue;
  }

  // 3. Partial match
  const partial = compoundsGenerated.find(
    (c) => normalize(c.name).includes(norm) || norm.includes(normalize(c.name)),
  );
  if (partial) {
    matches.push({
      file,
      projectSlug: partial.slug,
      projectName: partial.name,
      confidence: "MEDIUM",
    });
    continue;
  }

  unmatchedFiles.push(file);
}

console.log("=== MATCHED MASTER PLANS (" + matches.length + ") ===");
for (const m of matches) {
  console.log(`[${m.confidence}] "${m.file}" -> ${m.projectName} (slug: "${m.projectSlug}")`);
}

console.log("\n=== UNMATCHED MASTER PLAN FILES (" + unmatchedFiles.length + ") ===");
for (const u of unmatchedFiles) {
  console.log(`- "${u}"`);
}
