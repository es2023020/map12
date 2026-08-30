import fs from 'fs';
import path from 'path';

// 1. Update src/data/compounds.generated.ts
const compFile = fs.readFileSync('src/data/compounds.generated.ts', 'utf8');
const compJsonMatch = compFile.match(/export const compoundsGenerated:\s*Compound\[\]\s*=\s*(\[[\s\S]*\]);/);
let compounds = JSON.parse(compJsonMatch[1]);

// Find mountain-view-mv4 and mv-4
const mv4Idx = compounds.findIndex(c => c.slug === 'mountain-view-mv4');
const mv_4Idx = compounds.findIndex(c => c.slug === 'mv-4');

if (mv4Idx !== -1) {
  compounds[mv4Idx] = {
    ...compounds[mv4Idx],
    name: "Mountain View MV4",
    priceFrom: 23.3,
    deliveryYear: 2026,
    status: "RTM",
    types: ["Standalone Villa", "Town House Middle", "Townhouse"],
    unitSizes: "210–275 m²",
    areaSize: "46 feddan",
    highlights: ["6th of October City location", "iCity October campus", "Ready to Move", "Townhouses & Standalone Villas"],
    masterPlanUrl: "/Masterplans/mountain-view-mv4.svg"
  };
}

if (mv_4Idx !== -1) {
  compounds.splice(mv_4Idx, 1);
  console.log('Removed duplicate compound "mv-4" from compounds.generated.ts');
}

const updatedCompContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(compounds, null, 2)};
`;
fs.writeFileSync('src/data/compounds.generated.ts', updatedCompContent, 'utf8');
console.log('Updated compounds.generated.ts');

// 2. Update src/data/availability.generated.ts
let availFile = fs.readFileSync('src/data/availability.generated.ts', 'utf8');
let availCode = availFile.replace(/^import\s+.*;/gm, '').replace(/^\/\/.*$/gm, '');
const availArrayCode = availCode.replace(/export const availability:\s*ProjectAvailability\[\]\s*=\s*/, 'return ').replace(/;\s*$/, '');
let availList = new Function(availArrayCode)();

const mv_4Avail = availList.find(a => a.slug === 'mv-4');
const mv4AvailIdx = availList.findIndex(a => a.slug === 'mountain-view-mv4');

if (mv_4Avail) {
  // Update breakdown & units to use mountain-view-mv4
  const updatedBreakdown = mv_4Avail.breakdown.map(b => ({
    ...b,
    units: b.units.map(u => ({
      ...u,
      slug: 'mountain-view-mv4',
      id: u.id.replace(/^mv-4-/, 'mountain-view-mv4-')
    }))
  }));

  const mergedAvail = {
    slug: 'mountain-view-mv4',
    developer: 'Mountain View',
    totalAvailable: mv_4Avail.totalAvailable,
    breakdown: updatedBreakdown,
    lastUpdated: mv_4Avail.lastUpdated || "2026-08-27"
  };

  if (mv4AvailIdx !== -1) {
    availList[mv4AvailIdx] = mergedAvail;
  } else {
    availList.push(mergedAvail);
  }

  // Filter out mv-4
  availList = availList.filter(a => a.slug !== 'mv-4');
  console.log('Merged availability into mountain-view-mv4 and removed mv-4 from availability.generated.ts');
}

const updatedAvailContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { ProjectAvailability } from "./availability";

export const availability: ProjectAvailability[] = ${JSON.stringify(availList, null, 2)};
`;
fs.writeFileSync('src/data/availability.generated.ts', updatedAvailContent, 'utf8');
console.log('Updated availability.generated.ts');

// 3. Update src/data/media-registry.json
const mediaFile = fs.readFileSync('src/data/media-registry.json', 'utf8');
const mediaRegistry = JSON.parse(mediaFile);
if (mediaRegistry['mv-4']) {
  delete mediaRegistry['mv-4'];
  fs.writeFileSync('src/data/media-registry.json', JSON.stringify(mediaRegistry, null, 2), 'utf8');
  console.log('Removed "mv-4" from media-registry.json');
}

// 4. Update src/data/project-images.ts
let projImgs = fs.readFileSync('src/data/project-images.ts', 'utf8');
if (projImgs.includes('"mv-4":')) {
  projImgs = projImgs.replace(/\s*"mv-4":\s*\[[^\]]*\],?/g, '');
  fs.writeFileSync('src/data/project-images.ts', projImgs, 'utf8');
  console.log('Removed "mv-4" from project-images.ts');
}
