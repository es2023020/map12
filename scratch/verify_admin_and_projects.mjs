import { compounds } from '../src/data/compounds.ts';

const targets = [
  'diplo-3',
  'diplo-village',
  'mountain-view-ras-el-hekma',
  'shamasi',
  'bianchi-ilios'
];

console.log('\n--- Checking 4 Specified Compounds ---');

targets.forEach(slug => {
  const c = compounds.find(x => x.slug === slug || x.slug.includes(slug));
  if (c) {
    console.log(`✓ ${slug.padEnd(28)} | Name: ${c.name.padEnd(28)} | Km: ${String(c.km).padEnd(5)} | Lat: ${c.lat.toFixed(4)}, Lng: ${c.lng.toFixed(4)} | Dest: ${c.destination}`);
  } else {
    console.log(`❌ ${slug.padEnd(28)} | NOT FOUND`);
  }
});
