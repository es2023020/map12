import fs from 'fs';

const compFile = fs.readFileSync('src/data/compounds.generated.ts', 'utf8');
const compJsonMatch = compFile.match(/export const compoundsGenerated:\s*Compound\[\]\s*=\s*(\[[\s\S]*\]);/);
const compounds = JSON.parse(compJsonMatch[1]);

let availFile = fs.readFileSync('src/data/availability.generated.ts', 'utf8');
availFile = availFile.replace(/^import\s+.*;/gm, '');
availFile = availFile.replace(/^\/\/.*$/gm, '');
const availArrayCode = availFile.replace(/export const availability:\s*ProjectAvailability\[\]\s*=\s*/, 'return ').replace(/;\s*$/, '');
const availList = new Function(availArrayCode)();

const availMap = new Map(availList.map(a => [a.slug, a]));

const missingEntry = [];
const zeroAvailable = [];
const activeAvailable = [];

for (const c of compounds) {
  const slug = c.slug;
  const name = c.name;
  const dev = c.developer || 'Unknown';
  if (!availMap.has(slug)) {
    missingEntry.push({ slug, name, dev, reason: 'No availability entry' });
  } else {
    const av = availMap.get(slug);
    const tot = av.totalAvailable || 0;
    let unitsCount = 0;
    if (av.breakdown && Array.isArray(av.breakdown)) {
      for (const b of av.breakdown) {
        if (b.units && Array.isArray(b.units)) unitsCount += b.units.length;
      }
    }
    if (tot === 0 && unitsCount === 0) {
      zeroAvailable.push({ slug, name, dev, reason: 'Entry exists but 0 units available' });
    } else {
      activeAvailable.push({ slug, name, dev, totalAvailable: tot, unitsCount });
    }
  }
}

console.log('Total compounds in catalog:', compounds.length);
console.log('Active availability count:', activeAvailable.length);
console.log('No availability entry:', missingEntry.length);
console.log('0 available units:', zeroAvailable.length);
console.log('Total missing availability (no entry + 0 units):', missingEntry.length + zeroAvailable.length);

console.log('\n=== LIST OF ALL PROJECTS MISSING AVAILABILITY (NO ENTRY) ===');
missingEntry.sort((a,b) => a.name.localeCompare(b.name)).forEach(item => {
  console.log(`- ${item.name} (${item.slug}) [${item.dev}]`);
});

console.log('\n=== LIST OF ALL PROJECTS WITH 0 UNITS AVAILABLE ===');
zeroAvailable.sort((a,b) => a.name.localeCompare(b.name)).forEach(item => {
  console.log(`- ${item.name} (${item.slug}) [${item.dev}]`);
});
