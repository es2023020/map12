import fs from 'fs';

const compFile = fs.readFileSync('src/data/compounds.generated.ts', 'utf8');
const compJsonMatch = compFile.match(/export const compoundsGenerated:\s*Compound\[\]\s*=\s*(\[[\s\S]*\]);/);
const compounds = JSON.parse(compJsonMatch[1]);

const targetSlugs = [
  'allegria',
  'aqua-lagoons-june',
  'eastown',
  'sodic-west',
  'westown-residences',
  'al-rehab',
  'madinaty',
  'south-med',
  'salt-marina'
];

for (const slug of targetSlugs) {
  const c = compounds.find(x => x.slug === slug);
  console.log(`${c.name} (${c.slug}): status=${c.status}, isNewLaunch=${c.isNewLaunch}, priceFrom=${c.priceFrom}`);
}
