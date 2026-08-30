import fs from 'fs';

const compFile = fs.readFileSync('src/data/compounds.generated.ts', 'utf8');
const compJsonMatch = compFile.match(/export const compoundsGenerated:\s*Compound\[\]\s*=\s*(\[[\s\S]*\]);/);
const compounds = JSON.parse(compJsonMatch[1]);

let availFile = fs.readFileSync('src/data/availability.generated.ts', 'utf8');
availFile = availFile.replace(/^import\s+.*;/gm, '').replace(/^\/\/.*$/gm, '');
const availArrayCode = availFile.replace(/export const availability:\s*ProjectAvailability\[\]\s*=\s*/, 'return ').replace(/;\s*$/, '');
const availList = new Function(availArrayCode)();

const availMap = new Map(availList.map(a => [a.slug, a]));

const missing = [];
const available = [];

for (const c of compounds) {
  const slug = c.slug;
  const name = c.name;
  const dev = c.developer || 'Unknown';
  const dest = c.destination || 'Unknown';

  const av = availMap.get(slug);
  const tot = av ? (av.totalAvailable || 0) : 0;
  let unitsCount = 0;
  if (av && av.breakdown && Array.isArray(av.breakdown)) {
    for (const b of av.breakdown) {
      if (b.units && Array.isArray(b.units)) unitsCount += b.units.length;
    }
  }

  if (!av || (tot === 0 && unitsCount === 0)) {
    missing.push({ slug, name, dev, dest });
  } else {
    available.push({ slug, name, dev, dest, totalAvailable: tot, unitsCount });
  }
}

console.log(`Total Projects: ${compounds.length}`);
console.log(`Projects WITH Availability: ${available.length}`);
console.log(`Projects MISSING Availability: ${missing.length}`);

// Group missing by Developer
const byDev = {};
missing.forEach(p => {
  if (!byDev[p.dev]) byDev[p.dev] = [];
  byDev[p.dev].push(p);
});

console.log('\n--- MISSING BY DEVELOPER ---');
Object.keys(byDev).sort().forEach(dev => {
  console.log(`\n### ${dev} (${byDev[dev].length})`);
  byDev[dev].sort((a,b) => a.name.localeCompare(b.name)).forEach(p => {
    console.log(`- ${p.name} (${p.slug})`);
  });
});
