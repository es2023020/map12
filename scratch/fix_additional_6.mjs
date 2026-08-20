import fs from 'fs';

const genPath = 'd:/map12/src/data/compounds.generated.ts';
const wmPath = 'd:/map12/src/data/wikimapia-locations.json';

const genContent = fs.readFileSync(genPath, 'utf8');
const wmJson = JSON.parse(fs.readFileSync(wmPath, 'utf8'));

const targets = [
  { slug: 'la-vista-bay-east', lat: 31.0665, lng: 28.3600, destination: 'al-dabaa' },
  { slug: 'marina', lat: 30.8348, lng: 29.0046, destination: 'new-alamein' },
  { slug: 'the-islands', lat: 30.8250, lng: 28.9500, destination: 'new-alamein' },
  { slug: 'swan-lake', lat: 31.0450, lng: 27.9750, destination: 'ras-el-hekma' },
  { slug: 'swanlake', lat: 31.0450, lng: 27.9750, destination: 'ras-el-hekma' }
];

targets.forEach(t => {
  wmJson[t.slug] = {
    id: t.slug,
    name: t.slug.replace(/-/g, ' ').toUpperCase(),
    lat: t.lat,
    lng: t.lng,
    destination: t.destination,
    url: `https://wikimapia.org/#lang=en&lat=${t.lat}&lon=${t.lng}&z=15`
  };
});
fs.writeFileSync(wmPath, JSON.stringify(wmJson, null, 2), 'utf8');

const match = genContent.match(/export const compoundsGenerated: Compound\[\] = (\[[\s\S]*\]);?/);
if (match) {
  const genData = JSON.parse(match[1]);
  targets.forEach(t => {
    const item = genData.find(x => x.slug === t.slug);
    if (item) {
      item.lat = t.lat;
      item.lng = t.lng;
      item.destination = t.destination;
    }
  });
  const header = `import { Compound } from "./compounds";\n\nexport const compoundsGenerated: Compound[] = `;
  fs.writeFileSync(genPath, `${header}${JSON.stringify(genData, null, 2)};\n`, 'utf8');
}

console.log('Successfully updated la-vista-bay-east, marina, the-islands, and swan-lake');
