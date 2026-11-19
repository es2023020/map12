const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const COMPOUNDS_FILE = path.join(ROOT, 'src', 'data', 'compounds.generated.ts');
const ALIASES_FILE = path.join(ROOT, 'config', 'project-aliases.json');
const GROUPS_FILE = path.join(ROOT, 'config', 'whatsapp-groups.json');

// 1. Load existing aliases
let existing = { compounds: {}, developers: {} };
if (fs.existsSync(ALIASES_FILE)) {
  try {
    existing = JSON.parse(fs.readFileSync(ALIASES_FILE, 'utf8'));
    existing.compounds = existing.compounds || {};
    existing.developers = existing.developers || {};
  } catch (e) {}
}

// 2. Load compounds
const text = fs.readFileSync(COMPOUNDS_FILE, 'utf8');
const projectRegex = /"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"[\s\S]*?"developer":\s*"([^"]+)",\s*"developerSlug":\s*"([^"]+)"/g;

let count = 0;
for (const match of text.matchAll(projectRegex)) {
  const [_, slug, name, developer, developerSlug] = match;
  count++;

  // Add developer alias
  const devLower = developer.toLowerCase().trim();
  const devSlugLower = developerSlug.toLowerCase().trim();
  existing.developers[devLower] = devSlugLower;
  existing.developers[developerSlug.replace(/-/g, ' ')] = devSlugLower;
  existing.developers[developerSlug] = devSlugLower;

  // Add project alias
  const nameLower = name.toLowerCase().trim();
  existing.compounds[nameLower] = slug;
  existing.compounds[slug] = slug;
  existing.compounds[slug.replace(/-/g, ' ')] = slug;

  // Remove common punctuation and add
  const cleanedName = nameLower.replace(/[^a-z0-9\u0600-\u06FF\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleanedName && cleanedName !== nameLower) {
    existing.compounds[cleanedName] = slug;
  }

  // Remove parenthesized content e.g. "New Garden City (R5)" -> "new garden city"
  const noParens = nameLower.replace(/\([^)]*\)/g, '').trim();
  if (noParens && noParens !== nameLower && noParens.length > 3) {
    existing.compounds[noParens] = slug;
  }
}

// 3. Load whatsapp groups to map any developer names from there
if (fs.existsSync(GROUPS_FILE)) {
  try {
    const grpData = JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf8'));
    for (const g of Object.values(grpData.groups || {})) {
      if (g.developer_slug && g.developer_slug !== 'general-developer' && g.developer_name) {
        existing.developers[g.developer_name.toLowerCase().trim()] = g.developer_slug;
        existing.developers[g.developer_slug.replace(/-/g, ' ')] = g.developer_slug;
      }
    }
  } catch (e) {}
}

fs.writeFileSync(ALIASES_FILE, JSON.stringify(existing, null, 2), 'utf8');

console.log(`Successfully compiled project aliases from ${count} compounds:`);
console.log(`  Total Compound Aliases:  ${Object.keys(existing.compounds).length}`);
console.log(`  Total Developer Aliases: ${Object.keys(existing.developers).length}`);
