import fs from 'fs';
import { compounds } from '../src/data/compounds.ts';
import { kmToLatLng } from '../src/data/coast.ts';
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

// Filter all North Coast main compounds
const sahelCompounds = compounds.filter(c => {
  if (c.parentSlug) return false;
  return sahelDestSlugs.has(c.destination) || (c.city && c.city.toLowerCase().includes('north coast'));
});

// Sort by KM ascending
sahelCompounds.sort((a, b) => {
  const kmA = a.km ?? 150;
  const kmB = b.km ?? 150;
  if (kmA !== kmB) return kmA - kmB;
  return a.name.localeCompare(b.name);
});

console.log(`Found ${sahelCompounds.length} North Coast compounds to align.`);

// Assign distinct, strictly ascending effective KM values to ensure strictly decreasing longitudes
const kmGroups = new Map();
sahelCompounds.forEach(c => {
  const baseKm = Math.floor(c.km ?? 150);
  if (!kmGroups.has(baseKm)) kmGroups.set(baseKm, []);
  kmGroups.get(baseKm).push(c);
});

const updatedCoords = new Map();

kmGroups.forEach((group, baseKm) => {
  const step = 0.8 / group.length;
  group.forEach((c, idx) => {
    const effectiveKm = Math.round((baseKm + idx * step) * 100) / 100;
    const [baseLat, baseLng] = kmToLatLng(effectiveKm);
    
    // Smooth latitude offset for overlapping pins
    const latOffset = (idx % 2 === 0 ? 0.001 : -0.001) * idx;
    const finalLat = Math.round((baseLat + latOffset) * 1000000) / 1000000;
    const finalLng = Math.round(baseLng * 1000000) / 1000000;
    
    updatedCoords.set(c.slug, { lat: finalLat, lng: finalLng, km: effectiveKm, name: c.name, destination: c.destination });
  });
});

// 1. Update wikimapia-locations.json
const wmPath = 'd:/map12/src/data/wikimapia-locations.json';
const wmJson = JSON.parse(fs.readFileSync(wmPath, 'utf8'));

updatedCoords.forEach((val, slug) => {
  wmJson[slug] = {
    id: slug,
    name: val.name,
    lat: val.lat,
    lng: val.lng,
    destination: val.destination,
    km: val.km,
    url: `https://wikimapia.org/#lang=en&lat=${val.lat}&lon=${val.lng}&z=15`
  };
});
fs.writeFileSync(wmPath, JSON.stringify(wmJson, null, 2), 'utf8');
console.log('Updated wikimapia-locations.json');

// 2. Update compounds.generated.ts
const genPath = 'd:/map12/src/data/compounds.generated.ts';
const genContent = fs.readFileSync(genPath, 'utf8');

const match = genContent.match(/export const compoundsGenerated: Compound\[\] = (\[[\s\S]*\]);?/);
if (match) {
  const genData = JSON.parse(match[1]);
  let updatedCount = 0;
  genData.forEach(item => {
    const val = updatedCoords.get(item.slug);
    if (val) {
      item.lat = val.lat;
      item.lng = val.lng;
      item.km = val.km;
      updatedCount++;
    }
  });
  const header = `import { Compound } from "./compounds";\n\nexport const compoundsGenerated: Compound[] = `;
  fs.writeFileSync(genPath, `${header}${JSON.stringify(genData, null, 2)};\n`, 'utf8');
  console.log(`Updated ${updatedCount} items in compounds.generated.ts`);
}

// 3. Update compounds.ts
const compoundsPath = 'd:/map12/src/data/compounds.ts';
let compCode = fs.readFileSync(compoundsPath, 'utf8');

updatedCoords.forEach((val, slug) => {
  const regex = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?lat:\\s*)([0-9.-]+)([\\s\\S]*?lng:\\s*)([0-9.-]+)`, 'g');
  compCode = compCode.replace(regex, `$1${val.lat}$3${val.lng}`);
  
  // Also update km property if present
  const kmRegex = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?km:\\s*)([0-9.-]+)`, 'g');
  compCode = compCode.replace(kmRegex, `$1${val.km}`);
});

fs.writeFileSync(compoundsPath, compCode, 'utf8');
console.log('Updated compounds.ts');
