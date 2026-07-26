const fs = require("fs");
const path = require("path");

// Read project-locations
const locationsFile = fs.readFileSync("src/data/project-locations.ts", "utf8");
const slugMatches = Array.from(locationsFile.matchAll(/"([a-z0-9-]+)":\s*\{\s*name:\s*"([^"]+)"/g));

// Read brochure-map if exists
let brochureMap = {};
if (fs.existsSync("src/data/brochure-map.ts")) {
  const bContent = fs.readFileSync("src/data/brochure-map.ts", "utf8");
  const bMatches = Array.from(bContent.matchAll(/"([a-z0-9-]+)":\s*"([^"]+)"/g));
  for (const m of bMatches) {
    brochureMap[m[1]] = m[2];
  }
}

// Read brochures dir
const brochuresDir = "public/brochures";
const brochureFiles = fs.existsSync(brochuresDir) ? fs.readdirSync(brochuresDir) : [];

// Read masterplans dir
const masterplansDir = "public/Masterplans";
const masterplanFiles = fs.existsSync(masterplansDir) ? fs.readdirSync(masterplansDir) : [];

// Read compounds.generated.ts / compound-registry.ts for masterPlanUrl and brochureUrl
let compoundMasterPlans = {};
let compoundBrochures = {};

if (fs.existsSync("src/data/compounds.generated.ts")) {
  const cContent = fs.readFileSync("src/data/compounds.generated.ts", "utf8");
  const blocks = cContent.split(/\{\s*"id":/);
  for (const block of blocks) {
    const slugMatch = block.match(/"slug":\s*"([^"]+)"/);
    const mpMatch = block.match(/"masterPlanUrl":\s*"([^"]+)"/);
    const brMatch = block.match(/"brochureUrl":\s*"([^"]+)"/);
    if (slugMatch) {
      const slug = slugMatch[1];
      if (mpMatch && mpMatch[1]) compoundMasterPlans[slug] = mpMatch[1];
      if (brMatch && brMatch[1]) compoundBrochures[slug] = brMatch[1];
    }
  }
}

if (fs.existsSync("src/data/compound-registry.ts")) {
  const rContent = fs.readFileSync("src/data/compound-registry.ts", "utf8");
  const blocks = rContent.split(/\{\s*id:/);
  for (const block of blocks) {
    const slugMatch = block.match(/slug:\s*"([^"]+)"/);
    const mpMatch = block.match(/masterPlanUrl:\s*"([^"]+)"/);
    const brMatch = block.match(/brochureUrl:\s*"([^"]+)"/);
    if (slugMatch) {
      const slug = slugMatch[1];
      if (mpMatch && mpMatch[1]) compoundMasterPlans[slug] = mpMatch[1];
      if (brMatch && brMatch[1]) compoundBrochures[slug] = brMatch[1];
    }
  }
}

const missingMasterPlan = [];
const missingBrochure = [];
const missingBoth = [];

for (const m of slugMatches) {
  const slug = m[1];
  const name = m[2];

  // Check brochure
  let hasBrochure = false;
  if (brochureMap[slug] || compoundBrochures[slug]) {
    hasBrochure = true;
  } else {
    // Check if a file in public/brochures matches the slug or name
    const slugClean = slug.replace(/-/g, "").toLowerCase();
    const found = brochureFiles.some(f => {
      const fClean = f.replace(/[^a-z0-9]/gi, "").toLowerCase();
      return fClean.includes(slugClean) || slugClean.includes(fClean.replace("pdf", ""));
    });
    if (found) hasBrochure = true;
  }

  // Check master plan
  let hasMasterPlan = false;
  if (compoundMasterPlans[slug]) {
    hasMasterPlan = true;
  } else {
    // Check if a file in public/Masterplans matches the slug or name
    const slugClean = slug.replace(/-/g, "").toLowerCase();
    const found = masterplanFiles.some(f => {
      const fClean = f.replace(/[^a-z0-9]/gi, "").toLowerCase();
      return fClean.includes(slugClean);
    });
    if (found) hasMasterPlan = true;
  }

  if (!hasBrochure) missingBrochure.push({ slug, name });
  if (!hasMasterPlan) missingMasterPlan.push({ slug, name });
  if (!hasBrochure && !hasMasterPlan) missingBoth.push({ slug, name });
}

console.log(`TOTAL PROJECTS: ${slugMatches.length}`);
console.log(`MISSING BROCHURE COUNT: ${missingBrochure.length}`);
console.log(`MISSING MASTER PLAN COUNT: ${missingMasterPlan.length}`);
console.log(`MISSING BOTH COUNT: ${missingBoth.length}`);

fs.mkdirSync("scratch", { recursive: true });
fs.writeFileSync("scratch/audit_results.json", JSON.stringify({ missingBrochure, missingMasterPlan, missingBoth }, null, 2));
