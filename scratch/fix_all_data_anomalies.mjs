import fs from 'fs';

// 1. Load compounds
const compFile = fs.readFileSync('src/data/compounds.generated.ts', 'utf8');
const compJsonMatch = compFile.match(/export const compoundsGenerated:\s*Compound\[\]\s*=\s*(\[[\s\S]*\]);/);
let compounds = JSON.parse(compJsonMatch[1]);

// 2. Load availability
let availFile = fs.readFileSync('src/data/availability.generated.ts', 'utf8');
availFile = availFile.replace(/^import\s+.*;/gm, '').replace(/^\/\/.*$/gm, '');
const availArrayCode = availFile.replace(/export const availability:\s*ProjectAvailability\[\]\s*=\s*/, 'return ').replace(/;\s*$/, '');
let availList = new Function(availArrayCode)();

console.log('Fixing and syncing all project numbers and inventory metrics...');

// Fix known corrupted single unit in mountain-view-crystal (16.33m² for 22.38M)
const mvCrystal = availList.find(a => a.slug === 'mountain-view-crystal');
if (mvCrystal) {
  mvCrystal.breakdown.forEach(b => {
    if (b.units) {
      b.units = b.units.filter(u => u.unitNo !== 'KI3-SC8-9-03' && u.areaSqm >= 30);
    }
  });
}

// Fix known corrupted single unit in mountain-view-icity-new-cairo (36.76m² for 15.59M)
const mvIcity = availList.find(a => a.slug === 'mountain-view-icity-new-cairo');
if (mvIcity) {
  mvIcity.breakdown.forEach(b => {
    if (b.units) {
      b.units = b.units.filter(u => u.areaSqm >= 30);
    }
  });
}

let syncCount = 0;
let totalAvailableCountFixes = 0;

// Re-calculate breakdown metrics and totalAvailable for ALL availability objects
for (const a of availList) {
  let projTotalAvailable = 0;
  const validPricesM = [];

  for (const b of a.breakdown || []) {
    const units = (b.units || []).filter(u => u.status !== 'Sold');
    b.units = units;
    b.available = units.length;
    projTotalAvailable += units.length;

    if (units.length > 0) {
      const pricesM = units.map(u => u.priceEGP / 1e6).filter(p => p > 0);
      const sqms = units.map(u => u.areaSqm).filter(s => s > 0);

      if (pricesM.length > 0) {
        b.minPriceM = Math.min(...pricesM);
        b.maxPriceM = Math.max(...pricesM);
        validPricesM.push(...pricesM);
      }
      if (sqms.length > 0) {
        b.minSqm = Math.min(...sqms);
        b.maxSqm = Math.max(...sqms);
      }
    }
  }

  if (a.totalAvailable !== projTotalAvailable) {
    a.totalAvailable = projTotalAvailable;
    totalAvailableCountFixes++;
  }

  // Sync catalog priceFrom in compounds.generated.ts
  const c = compounds.find(x => x.slug === a.slug);
  if (c && validPricesM.length > 0) {
    const actualLowestM = Math.round(Math.min(...validPricesM) * 100) / 100;
    if (c.priceFrom !== actualLowestM && actualLowestM > 0) {
      c.priceFrom = actualLowestM;
      syncCount++;
    }
  }
}

console.log(`Synced catalog starting prices (priceFrom) for ${syncCount} projects.`);
console.log(`Fixed totalAvailable unit counts for ${totalAvailableCountFixes} projects.`);

// Write back src/data/compounds.generated.ts
const updatedCompContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(compounds, null, 2)};
`;
fs.writeFileSync('src/data/compounds.generated.ts', updatedCompContent, 'utf8');
console.log('Successfully saved src/data/compounds.generated.ts');

// Write back src/data/availability.generated.ts
const updatedAvailContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { ProjectAvailability } from "./availability";

export const availability: ProjectAvailability[] = ${JSON.stringify(availList, null, 2)};
`;
fs.writeFileSync('src/data/availability.generated.ts', updatedAvailContent, 'utf8');
console.log('Successfully saved src/data/availability.generated.ts');
