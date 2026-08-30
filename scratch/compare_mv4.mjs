import fs from 'fs';

let availFile = fs.readFileSync('src/data/availability.generated.ts', 'utf8');
availFile = availFile.replace(/^import\s+.*;/gm, '').replace(/^\/\/.*$/gm, '');
const availArrayCode = availFile.replace(/export const availability:\s*ProjectAvailability\[\]\s*=\s*/, 'return ').replace(/;\s*$/, '');
const availList = new Function(availArrayCode)();

const mv4Avail = availList.find(a => a.slug === 'mountain-view-mv4');
const mv_4Avail = availList.find(a => a.slug === 'mv-4');

console.log('mv4 totalAvailable:', mv4Avail.totalAvailable);
console.log('mv-4 totalAvailable:', mv_4Avail.totalAvailable);

mv4Avail.breakdown.forEach((b, i) => {
  console.log(`mv4 breakdown ${i}: ${b.type}, beds: ${b.beds}, available: ${b.available}, minSqm: ${b.minSqm}, maxSqm: ${b.maxSqm}, units: ${b.units.length}`);
});

mv_4Avail.breakdown.forEach((b, i) => {
  console.log(`mv-4 breakdown ${i}: ${b.type}, beds: ${b.beds}, available: ${b.available}, minSqm: ${b.minSqm}, maxSqm: ${b.maxSqm}, units: ${b.units.length}`);
});
