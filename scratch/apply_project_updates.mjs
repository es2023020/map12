import fs from 'fs';

// 1. Update src/data/compounds.generated.ts
const compFile = fs.readFileSync('src/data/compounds.generated.ts', 'utf8');
const compJsonMatch = compFile.match(/export const compoundsGenerated:\s*Compound\[\]\s*=\s*(\[[\s\S]*\]);/);
let compounds = JSON.parse(compJsonMatch[1]);

const updatesMap = {
  'allegria': { status: 'On-Hold', isNewLaunch: false },
  'aqua-lagoons-june': { status: 'Off-Plan', isNewLaunch: true },
  'eastown': { status: 'On-Hold', isNewLaunch: false },
  'sodic-west': { status: 'On-Hold', isNewLaunch: false },
  'westown-residences': { status: 'On-Hold', isNewLaunch: false },
  'al-rehab': { status: 'On-Hold', isNewLaunch: false },
  'madinaty': { status: 'On-Hold', isNewLaunch: false },
  'south-med': { status: 'Off-Plan', isNewLaunch: true, priceFrom: 0 },
  'salt-marina': { status: 'Off-Plan', isNewLaunch: true },
};

for (const [slug, fields] of Object.entries(updatesMap)) {
  const c = compounds.find(x => x.slug === slug);
  if (c) {
    Object.assign(c, fields);
    console.log(`Updated ${slug} in compounds.generated.ts:`, fields);
  } else {
    console.warn(`Slug ${slug} not found in compounds.generated.ts`);
  }
}

const updatedCompContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(compounds, null, 2)};
`;
fs.writeFileSync('src/data/compounds.generated.ts', updatedCompContent, 'utf8');

// 2. Update src/data/compounds.ts if aqua-lagoons-june or salt-marina are there
let compTs = fs.readFileSync('src/data/compounds.ts', 'utf8');
if (compTs.includes('slug: "aqua-lagoons-june"')) {
  // ensure isNewLaunch: true
  compTs = compTs.replace(
    /(slug:\s*"aqua-lagoons-june"[\s\S]*?)(status:\s*"[^"]*")/g,
    '$1status: "Off-Plan",\n    isNewLaunch: true'
  );
}
if (compTs.includes('slug: "salt-marina"')) {
  compTs = compTs.replace(
    /(slug:\s*"salt-marina"[\s\S]*?)(status:\s*"[^"]*")/g,
    '$1status: "Off-Plan",\n    isNewLaunch: true'
  );
}
fs.writeFileSync('src/data/compounds.ts', compTs, 'utf8');
console.log('Updated src/data/compounds.ts');

// 3. Update src/data/compound-registry.ts for relevant keys
let regTs = fs.readFileSync('src/data/compound-registry.ts', 'utf8');

const regSoldOuts = ['allegria', 'eastown', 'sodic-west', 'al-rehab', 'madinaty'];
for (const slug of regSoldOuts) {
  if (regTs.includes(`"${slug}":`)) {
    regTs = regTs.replace(
      new RegExp(`("${slug}":\\s*\\{[\\s\\S]*?status:\\s*)"[^"]+"`),
      `$1"On-Hold"`
    );
  }
}
if (regTs.includes('"aqua-lagoons-june":')) {
  regTs = regTs.replace(
    /("aqua-lagoons-june":\s*\{[\s\S]*?status:\s*)"[^"]+"/,
    '$1"Off-Plan"'
  );
}
if (regTs.includes('"south-med":')) {
  regTs = regTs.replace(
    /("south-med":\s*\{[\s\S]*?status:\s*)"[^"]+"/,
    '$1"Off-Plan"'
  );
  regTs = regTs.replace(
    /("south-med":\s*\{[\s\S]*?priceFrom:\s*)[0-9.]+/,
    '$10'
  );
}
fs.writeFileSync('src/data/compound-registry.ts', regTs, 'utf8');
console.log('Updated src/data/compound-registry.ts');

// 4. Update src/data/availability.generated.ts for sold out compounds to have 0 available
let availFile = fs.readFileSync('src/data/availability.generated.ts', 'utf8');
let availCode = availFile.replace(/^import\s+.*;/gm, '').replace(/^\/\/.*$/gm, '');
const availArrayCode = availCode.replace(/export const availability:\s*ProjectAvailability\[\]\s*=\s*/, 'return ').replace(/;\s*$/, '');
let availList = new Function(availArrayCode)();

const soldOutSlugs = ['allegria', 'eastown', 'sodic-west', 'westown-residences', 'al-rehab', 'madinaty'];
for (const slug of soldOutSlugs) {
  const item = availList.find(a => a.slug === slug);
  if (item) {
    item.totalAvailable = 0;
    item.breakdown = [];
  }
}

const updatedAvailContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { ProjectAvailability } from "./availability";

export const availability: ProjectAvailability[] = ${JSON.stringify(availList, null, 2)};
`;
fs.writeFileSync('src/data/availability.generated.ts', updatedAvailContent, 'utf8');
console.log('Updated availability.generated.ts');
