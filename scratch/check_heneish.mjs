import fs from 'fs';

const compFile = fs.readFileSync('src/data/compounds.generated.ts', 'utf8');
const compJsonMatch = compFile.match(/export const compoundsGenerated:\s*Compound\[\]\s*=\s*(\[[\s\S]*\]);/);
const compounds = JSON.parse(compJsonMatch[1]);

const c = compounds.find(x => x.slug === 'hacienda-heneish');
console.log('compounds.generated.ts priceFrom:', c ? c.priceFrom : 'NOT FOUND');

const compTs = fs.readFileSync('src/data/compounds.ts', 'utf8');
const matchCompTs = compTs.match(/slug:\s*"hacienda-heneish"[\s\S]*?priceFrom:\s*([0-9.]+)/);
console.log('compounds.ts priceFrom:', matchCompTs ? matchCompTs[1] : 'NOT FOUND');

const regTs = fs.readFileSync('src/data/compound-registry.ts', 'utf8');
const matchRegTs = regTs.match(/"hacienda-heneish":\s*\{[\s\S]*?priceFrom:\s*([0-9.]+)/);
console.log('compound-registry.ts priceFrom:', matchRegTs ? matchRegTs[1] : 'NOT FOUND');
