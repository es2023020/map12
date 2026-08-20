import { compounds } from '../src/data/compounds.ts';
import { destinations } from '../src/data/destinations.ts';

// Get all north-coast subdestinations
const sahelDestSlugs = new Set([
  'north-coast',
  'sahel',
  'sidi-heneish',
  'ras-el-hekma',
  'al-dabaa',
  'ghazala-bay',
  'sidi-abdelrahman',
  'new-alamein'
]);

// Also check destinations with region === 'north-coast'
destinations.forEach(d => {
  if (d.region === 'north-coast') sahelDestSlugs.add(d.slug);
});

const withKm = [];
const missingKm = [];

compounds.forEach(c => {
  if (c.parentSlug) return;
  const isSahel = sahelDestSlugs.has(c.destination) || (c.city && c.city.toLowerCase().includes('north coast'));
  if (isSahel) {
    if (c.km !== undefined && c.km !== null && c.km > 0) {
      withKm.push({ slug: c.slug, name: c.name, km: c.km, destination: c.destination });
    } else {
      missingKm.push({ slug: c.slug, name: c.name, developer: c.developer, destination: c.destination });
    }
  }
});

console.log(`\n======================================================`);
console.log(`Total North Coast Projects: ${withKm.length + missingKm.length}`);
console.log(`With Known Kilo (km): ${withKm.length}`);
console.log(`MISSING Kilo (km): ${missingKm.length}`);
console.log(`======================================================\n`);

console.log('--- North Coast Projects WITH Known Kilo ---');
withKm.sort((a,b) => a.km - b.km).forEach(p => console.log(`  ✅ Kilo ${String(p.km).padEnd(4)} | ${p.name.padEnd(32)} (${p.destination})`));

console.log('\n--- North Coast Projects MISSING Kilo ---');
missingKm.sort((a,b) => a.name.localeCompare(b.name)).forEach((p, idx) => {
  console.log(`  ${idx + 1}. ${p.name.padEnd(35)} (Developer: ${p.developer} | Region: ${p.destination})`);
});
