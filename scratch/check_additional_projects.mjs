import { compounds } from '../src/data/compounds.ts';
import fs from 'fs';

const wmJson = JSON.parse(fs.readFileSync('./src/data/wikimapia-locations.json', 'utf8'));

const targets = [
  'la-vista-bay-east',
  'la-vista-east',
  'saada-sahel',
  'marina',
  'the-islands',
  'azzar-islands',
  'swanlake',
  'swan-lake'
];

console.log('\n--- Checking Additional Projects ---');

targets.forEach(t => {
  const c = compounds.find(x => x.slug === t || x.slug.includes(t) || x.name.toLowerCase().includes(t));
  const wm = wmJson[t];
  if (c) {
    console.log(`✓ ${t.padEnd(22)} | Slug: ${c.slug.padEnd(25)} | Comp: ${c.lat}, ${c.lng} | Dest: ${c.destination} | WM: ${wm?.lat}, ${wm?.lng}`);
  } else {
    console.log(`❌ ${t.padEnd(22)} | NOT FOUND IN compounds`);
  }
});
