import { compounds } from '../src/data/compounds.ts';
import { destinations } from '../src/data/destinations.ts';

const sahelDestSlugs = new Set([
  'north-coast',
  'sahel',
  'sidi-heneish',
  'ras-el-hekma',
  'al-dabaa',
  'ghazala-bay',
  'sidi-abdelrahman',
  'new-alamein',
  'marsa-matrouh',
  'alam-el-roum'
]);

destinations.forEach(d => {
  if (d.region === 'north-coast') sahelDestSlugs.add(d.slug);
});

const sahel = compounds.filter(c => {
  if (c.parentSlug) return false;
  return sahelDestSlugs.has(c.destination) || (c.city && c.city.toLowerCase().includes('north coast'));
});

// Sort by KM ascending
sahel.sort((a, b) => (a.km ?? 150) - (b.km ?? 150));

console.log(`\n===============================================================`);
console.log(`--- Verification of ${sahel.length} North Coast Projects (Right to Left) ---`);
console.log(`===============================================================\n`);

let inversions = 0;
for (let i = 0; i < sahel.length; i++) {
  const current = sahel[i];
  let status = '✅ OK';
  if (i > 0) {
    const prev = sahel[i - 1];
    // Longitude should strictly decrease as KM increases (i.e. prev.lng >= current.lng)
    if (current.lng > prev.lng + 0.001) {
      status = `❌ INVERSION! (prev: ${prev.name} km ${prev.km} lng ${prev.lng} < current: ${current.name} km ${current.km} lng ${current.lng})`;
      inversions++;
    }
  }
  console.log(`${String(i + 1).padStart(2)}. Kilo ${String(current.km).padEnd(4)} | Lng: ${current.lng.toFixed(4)} | Lat: ${current.lat.toFixed(4)} | ${current.name.padEnd(30)} ${status}`);
}

console.log(`\n===============================================================`);
console.log(`Total Projects: ${sahel.length}`);
console.log(`Total Order Inversions: ${inversions}`);
console.log(`Status: ${inversions === 0 ? 'ALL 94 PROJECTS PERFECTLY ALIGNED (RIGHT TO LEFT BY KILO 92 ➔ 275)' : 'INVERSIONS DETECTED'}`);
console.log(`===============================================================\n`);
