import fs from 'fs';

const genPath = 'd:/map12/src/data/compounds.generated.ts';
const genContent = fs.readFileSync(genPath, 'utf8');

const targets = [
  { slug: 'la-vista-bay', lat: 31.0657004, lng: 28.3583149, destination: 'al-dabaa' },
  { slug: 'azzar-islands', lat: 31.2466667, lng: 27.8550000, destination: 'ras-el-hekma' },
  { slug: 'playa', lat: 31.0250849, lng: 28.5852691, destination: 'ghazala-bay' },
  { slug: 'lasirena-sahel', lat: 31.0228412, lng: 28.5255196, destination: 'al-dabaa' },
  { slug: 'youd', lat: 31.0868086, lng: 28.1608845, destination: 'ras-el-hekma' },
  { slug: 'the-waterway-north-coast', lat: 31.0689544, lng: 28.3450598, destination: 'al-dabaa' },
  { slug: 'the-waterway', lat: 31.0689544, lng: 28.3450598, destination: 'al-dabaa' },
  { slug: 'seashell', lat: 30.9895515, lng: 28.6934000, destination: 'sidi-abdelrahman' },
  { slug: 'south-med', lat: 31.0655500, lng: 28.3975181, destination: 'al-dabaa' },
  { slug: 'telal-soul', lat: 31.0139519, lng: 28.5977631, destination: 'sidi-abdelrahman' },
  { slug: 'surf-and-sand-seazen', lat: 31.0688546, lng: 28.3525583, destination: 'al-dabaa' },
  { slug: 'seazen', lat: 31.0688546, lng: 28.3525583, destination: 'al-dabaa' },
  { slug: 'dayz', lat: 30.8473374, lng: 28.9802767, destination: 'new-alamein' },
  { slug: 'soul', lat: 31.0640551, lng: 28.2256345, destination: 'ras-el-hekma' },
  { slug: 'zahra', lat: 30.9524885, lng: 28.8069929, destination: 'new-alamein' },
  { slug: 'saada-north-coast', lat: 31.1315000, lng: 27.7702000, destination: 'ras-el-hekma' },
  { slug: 'saada-sahel', lat: 31.1315000, lng: 27.7702000, destination: 'ras-el-hekma' },
  { slug: 'district-5', lat: 29.9882, lng: 31.4320, destination: 'new-cairo' },
  { slug: 'belle-vie', lat: 30.0619, lng: 30.8977, destination: 'new-zayed' },
  { slug: 'hacienda-blue', lat: 31.0150, lng: 28.1600, destination: 'al-dabaa' },
  { slug: 'the-hillage', lat: 30.0740, lng: 30.9650, destination: 'sheikh-zayed' },
  { slug: 'palm-hills-jirian', lat: 30.0940, lng: 30.8700, destination: 'new-zayed' },
  { slug: 'elm-tree-park', lat: 30.0650, lng: 31.0100, destination: 'northern-expansion' },
  { slug: 'marassi', lat: 30.9707, lng: 28.7488, destination: 'sidi-abdelrahman' },
  { slug: 'mivida', lat: 30.0055, lng: 31.5388, destination: 'new-cairo' },
  { slug: 'sarai', lat: 30.0985, lng: 31.6993, destination: 'sarai' },
  { slug: 'patio-5-east', lat: 30.1150, lng: 31.6020, destination: 'shorouk' },
  { slug: 'patio-prime', lat: 30.1120, lng: 31.6000, destination: 'shorouk' },
  { slug: 'patio-casa', lat: 30.1180, lng: 31.6050, destination: 'shorouk' },
];

const match = genContent.match(/export const compoundsGenerated: Compound\[\] = (\[[\s\S]*\]);?/);
if (match) {
  const genData = JSON.parse(match[1]);
  let updated = 0;
  targets.forEach(t => {
    const item = genData.find(x => x.slug === t.slug);
    if (item) {
      item.lat = t.lat;
      item.lng = t.lng;
      item.destination = t.destination;
      updated++;
    }
  });

  const header = `import { Compound } from "./compounds";\n\nexport const compoundsGenerated: Compound[] = `;
  fs.writeFileSync(genPath, `${header}${JSON.stringify(genData, null, 2)};\n`, 'utf8');
  console.log(`Updated ${updated} compounds in compounds.generated.ts`);
} else {
  console.log('Regex failed to parse compoundsGenerated');
}
