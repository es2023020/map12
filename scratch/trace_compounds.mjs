import fs from 'fs';

const content = fs.readFileSync('d:/map12/src/data/compounds.ts', 'utf8');

// Find all places where lat or lng are set or mapped
const matches = content.match(/.*?(projectLocations|compoundRegistry|sahelDetails|kmToLatLng|location|lat|lng).*/g) || [];

console.log('--- Tracing lat/lng in compounds.ts ---');
matches.slice(0, 40).forEach(m => console.log(m.trim()));
