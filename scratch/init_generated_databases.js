import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

// Load destinations and compounds to seed initial files
const destPath = path.join(root, 'src', 'data', 'destinations.ts');
let destCode = fs.readFileSync(destPath, 'utf-8');

// Extract staticDestinations array
const destMatch = destCode.match(/const staticDestinations: Destination\[] = (\[[\s\S]*?]);/);
const staticDestArray = destMatch ? destMatch[1] : '[]';

const destGenContent = `// Auto-generated initial seed.
import type { Destination } from "./destinations";

export const destinationsGenerated: Destination[] = ${staticDestArray};
`;
fs.writeFileSync(path.join(root, 'src', 'data', 'destinations.generated.ts'), destGenContent, 'utf-8');
console.log('Seeded src/data/destinations.generated.ts');

// For compounds: since it is very large, let's load it dynamically
const compPath = path.join(root, 'src', 'data', 'compounds.ts');
let compCode = fs.readFileSync(compPath, 'utf-8');

const compMatch = compCode.match(/const staticCompounds = (baseStaticCompounds[\s\S]*?);/);
// Actually, let's just write staticCompounds by evaluating it or from the source
// Let's write a simple import and evaluate script
import('../src/data/compounds.js').then((module) => {
  const compGenContent = `// Auto-generated initial seed.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(module.staticCompounds, null, 2)};
`;
  fs.writeFileSync(path.join(root, 'src', 'data', 'compounds.generated.ts'), compGenContent, 'utf-8');
  console.log('Seeded src/data/compounds.generated.ts');
}).catch((err) => {
  console.error('Failed to import compounds dynamically:', err);
});
