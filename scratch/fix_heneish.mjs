import fs from 'fs';

// 1. Update public/availability-data/hacienda-heneish/chalet-1br.json
const chalet1brPath = 'public/availability-data/hacienda-heneish/chalet-1br.json';
if (fs.existsSync(chalet1brPath)) {
  const chalet1br = JSON.parse(fs.readFileSync(chalet1brPath, 'utf8'));
  chalet1br.forEach(u => {
    if (u.id === 'hacienda-heneish-1' || u.unitNo === 'HH-MAZ-614D') {
      u.priceEGP = 15630000;
    }
  });
  fs.writeFileSync(chalet1brPath, JSON.stringify(chalet1br, null, 2), 'utf8');
  console.log('Updated chalet-1br.json for hacienda-heneish');
}

// 2. Update src/data/availability.generated.ts
let availFile = fs.readFileSync('src/data/availability.generated.ts', 'utf8');
let availCode = availFile.replace(/^import\s+.*;/gm, '').replace(/^\/\/.*$/gm, '');
const availArrayCode = availCode.replace(/export const availability:\s*ProjectAvailability\[\]\s*=\s*/, 'return ').replace(/;\s*$/, '');
let availList = new Function(availArrayCode)();

const item = availList.find(a => a.slug === 'hacienda-heneish');
if (item) {
  item.breakdown.forEach(b => {
    if (b.type === 'Chalet' && b.beds === 1) {
      b.minPriceM = 15.63;
      b.maxPriceM = 15.63;
      b.units.forEach(u => {
        if (u.id === 'hacienda-heneish-1' || u.unitNo === 'HH-MAZ-614D') {
          u.priceEGP = 15630000;
        }
      });
    }
  });
  console.log('Updated hacienda-heneish in availability.generated.ts');
}

const updatedAvailContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { ProjectAvailability } from "./availability";

export const availability: ProjectAvailability[] = ${JSON.stringify(availList, null, 2)};
`;
fs.writeFileSync('src/data/availability.generated.ts', updatedAvailContent, 'utf8');

// 3. Update src/data/compounds.generated.ts starting price
const compFile = fs.readFileSync('src/data/compounds.generated.ts', 'utf8');
const compJsonMatch = compFile.match(/export const compoundsGenerated:\s*Compound\[\]\s*=\s*(\[[\s\S]*\]);/);
let compounds = JSON.parse(compJsonMatch[1]);

const henComp = compounds.find(c => c.slug === 'hacienda-heneish');
if (henComp) {
  henComp.priceFrom = 15.63;
  console.log('Updated hacienda-heneish priceFrom in compounds.generated.ts to 15.63');
}

const updatedCompContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(compounds, null, 2)};
`;
fs.writeFileSync('src/data/compounds.generated.ts', updatedCompContent, 'utf8');
