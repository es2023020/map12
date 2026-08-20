import fs from 'fs';

const genPath = 'd:/map12/src/data/compounds.generated.ts';
const wmPath = 'd:/map12/src/data/wikimapia-locations.json';
const compoundsPath = 'd:/map12/src/data/compounds.ts';

const genContent = fs.readFileSync(genPath, 'utf8');
const wmJson = JSON.parse(fs.readFileSync(wmPath, 'utf8'));

const updates = [
  { slug: 'azzar-islands', km: 182 },
  { slug: 'saada-sahel', km: 183 },
  { slug: 'hacienda-blue', km: 170 },
  { slug: 'hacienda-heneish', km: 247 },
  { slug: 'hacienda-red', km: 195 },
  { slug: 'hacienda-waters', km: 190 },
  { slug: 'perla', km: 165 },
  { slug: 'riv-amwaj', km: 136 },
  { slug: 'sadaf', km: 135 },
  { slug: 'sheya-residence', km: 107 }
];

// Update compounds.generated.ts
const match = genContent.match(/export const compoundsGenerated: Compound\[\] = (\[[\s\S]*\]);?/);
if (match) {
  const genData = JSON.parse(match[1]);
  updates.forEach(u => {
    const item = genData.find(x => x.slug === u.slug);
    if (item) {
      item.km = u.km;
    }
  });
  const header = `import { Compound } from "./compounds";\n\nexport const compoundsGenerated: Compound[] = `;
  fs.writeFileSync(genPath, `${header}${JSON.stringify(genData, null, 2)};\n`, 'utf8');
}

// Update wikimapia-locations.json
updates.forEach(u => {
  if (wmJson[u.slug]) {
    wmJson[u.slug].km = u.km;
  }
});
fs.writeFileSync(wmPath, JSON.stringify(wmJson, null, 2), 'utf8');

console.log('Successfully updated km markers for North Coast projects in generated & wikimapia files');
