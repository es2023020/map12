import fs from 'fs';

let availFile = fs.readFileSync('src/data/availability.generated.ts', 'utf8');
availFile = availFile.replace(/^import\s+.*;/gm, '').replace(/^\/\/.*$/gm, '');
const availArrayCode = availFile.replace(/export const availability:\s*ProjectAvailability\[\]\s*=\s*/, 'return ').replace(/;\s*$/, '');
const availList = new Function(availArrayCode)();

const targetSlugs = [
  'hacienda-heneish',
  'zoya',
  'la-vista-bay-east',
  'la-vista-east',
  'mountain-view-icity-new-cairo'
];

for (const slug of targetSlugs) {
  const item = availList.find(a => a.slug === slug);
  if (!item) continue;
  console.log(`\n=================== ${slug.toUpperCase()} ===================`);
  for (const b of item.breakdown) {
    console.log(`Type: ${b.type}, Beds: ${b.beds}, Available: ${b.available}, minPriceM: ${b.minPriceM}, minSqm: ${b.minSqm}`);
    b.units.forEach(u => {
      console.log(`   UnitNo: ${u.unitNo}, Beds: ${u.beds}, Area: ${u.areaSqm}m², PriceEGP: ${u.priceEGP} (${u.priceEGP/1e6}M)`);
    });
  }
}
