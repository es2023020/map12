import fs from 'fs';

const genPath = 'd:/map12/src/data/compounds.generated.ts';
const genContent = fs.readFileSync(genPath, 'utf8');

const match = genContent.match(/export const compoundsGenerated: Compound\[\] = (\[[\s\S]*\]);?/);
if (match) {
  const genData = JSON.parse(match[1]);
  
  const fix = (slug, lat, lng, dest) => {
    const item = genData.find(x => x.slug === slug);
    if (item) {
      item.lat = lat;
      item.lng = lng;
      item.destination = dest;
    }
  };

  fix('the-waterway', 31.0689544, 28.3450598, 'al-dabaa');
  fix('the-waterway-north-coast', 31.0689544, 28.3450598, 'al-dabaa');
  fix('seashell', 30.9895515, 28.6934000, 'sidi-abdelrahman');
  fix('seashell-ras-el-hekma', 30.9895515, 28.6934000, 'sidi-abdelrahman');
  fix('zahra', 30.9524885, 28.8069929, 'new-alamein');
  fix('zahra-north-coast', 30.9524885, 28.8069929, 'new-alamein');

  const header = `import { Compound } from "./compounds";\n\nexport const compoundsGenerated: Compound[] = `;
  fs.writeFileSync(genPath, `${header}${JSON.stringify(genData, null, 2)};\n`, 'utf8');
  console.log('Fixed the-waterway, seashell, and zahra in compounds.generated.ts');
}
