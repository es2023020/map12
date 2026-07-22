import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const root = process.cwd();

// Temporarily checkout compounds.ts to extract staticCompounds
console.log('Temporarily reverting compounds.ts to index...');
execSync('git checkout src/data/compounds.ts', { cwd: root });

// Run the TSX script to build compounds.generated.ts
console.log('Running fix_compounds_generated.ts...');
execSync('npx tsx scratch/fix_compounds_generated.ts', { cwd: root });

// Re-apply compounds.ts modifications
console.log('Restoring compounds.ts modifications...');
let compCode = fs.readFileSync(path.join(root, 'src', 'data', 'compounds.ts'), 'utf-8');

// 1. apply saada-sahel updates
compCode = compCode.replace(
  /slug:\s*"saada-sahel"[\s\S]*?priceFrom:\s*[\d.]+/g,
  (m) => m.replace(/priceFrom:\s*[\d.]+/, 'priceFrom: 21.5')
);
compCode = compCode.replace(
  /slug:\s*"saada-sahel"[\s\S]*?deliveryYear:\s*\d+/g,
  (m) => m.replace(/deliveryYear:\s*\d+/, 'deliveryYear: 2029')
);
compCode = compCode.replace(
  /slug:\s*"saada-sahel"[\s\S]*?types:\s*\[[\s\S]*?\]/g,
  (m) => m.replace(/types:\s*\[[\s\S]*?\]/, 'types: ["Chalet", "Townhouse", "Villa"]')
);
compCode = compCode.replace(
  /slug:\s*"saada-sahel"[\s\S]*?paymentPlan:\s*"[^"]*"/g,
  (m) => m.replace(/paymentPlan:\s*"[^"]*"/, 'paymentPlan: "5% down · 5% after 3 mos · 9 years equal installments"')
);
compCode = compCode.replace(
  /slug:\s*"saada-sahel"[\s\S]*?areaSize:\s*"[^"]*"/g,
  (m) => m.replace(/areaSize:\s*"[^"]*"/, 'areaSize: "125 feddan"')
);
compCode = compCode.replace(
  /slug:\s*"saada-sahel"[\s\S]*?unitSizes:\s*"[^"]*"/g,
  (m) => m.replace(/unitSizes:\s*"[^"]*"/, 'unitSizes: "149–500 m²"')
);

// 2. Load from compounds.generated.ts
compCode = compCode.replace(
  /const staticCompounds = baseStaticCompounds\.find\(c => c\.slug === "vie"\)[\s\S]*?: \[ \.\.\.baseStaticCompounds, vieParent \];/g,
  'import { compoundsGenerated } from "./compounds.generated";\n\nexport const staticCompounds: Compound[] = compoundsGenerated;'
);
// or matching the exact text:
compCode = compCode.replace(
  /const staticCompounds = baseStaticCompounds\.find\(c => c\.slug === "vie"\)\s*\?\s*baseStaticCompounds\s*:\s*\[\s*\.\.\.baseStaticCompounds,\s*vieParent\s*\];/g,
  'import { compoundsGenerated } from "./compounds.generated";\n\nexport const staticCompounds: Compound[] = compoundsGenerated;'
);

fs.writeFileSync(path.join(root, 'src', 'data', 'compounds.ts'), compCode, 'utf-8');
console.log('compounds.ts restored and fully configured!');
