const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const CONFIG_FILE = path.join(ROOT, 'config', 'whatsapp-groups.json');
const MATRIX_FILE = path.join(ROOT, 'config', 'developers-matrix.json');
const COMPOUNDS_FILE = path.join(ROOT, 'src', 'data', 'compounds.generated.ts');

// 1. Load compounds to gather all known developers and projects
const compoundsText = fs.readFileSync(COMPOUNDS_FILE, 'utf8');
const devSlugMap = new Map();
const allProjects = [];

const slugMatches = compoundsText.matchAll(/"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"[\s\S]*?"developer":\s*"([^"]+)",\s*"developerSlug":\s*"([^"]+)"/g);
for (const match of slugMatches) {
  const [_, slug, name, developer, developerSlug] = match;
  devSlugMap.set(developerSlug, developer);
  allProjects.push({ slug, name, developer, developerSlug });
}

// 2. Load Matrix
const matrix = fs.existsSync(MATRIX_FILE) ? JSON.parse(fs.readFileSync(MATRIX_FILE, 'utf8')) : [];
for (const m of matrix) {
  if (m.canonical_slug && m.developer_name) {
    devSlugMap.set(m.canonical_slug, m.developer_name);
  }
}

function tokenize(str) {
  if (!str) return [];
  return str
    .toLowerCase()
    .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, ' ')
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0);
}

const NOISE_WORDS = new Set([
  'tai', 'premium', 'official', 'brokers', 'broker', 'sales', 'team',
  'developments', 'development', 'dev', 'devs', 'holding', 'group',
  'properties', 'property', 'real', 'estate', 'misr', 'egypt', 'communities',
  'partners', 'partner', 'hub', 'vip', 'channel', 'updates', 'project', 'projects'
]);

function getCoreWords(tokens) {
  return tokens.filter(t => !NOISE_WORDS.has(t));
}

// Definite personal/university filter
const NON_DEV_SUBSTRINGS = [
  'physiotherapy', 'hospital', 'presentation', 'study group', 'hult prize', 'stem family',
  'hirewave', 'medical library', 'فطار', 'صور الفرح', 'حجز الصحاب', 'عايزين نذاكر',
  'bus el shorouk', 'bus badr', 'bus shorouk', 'herts', 'concentrix', 'placement',
  'reception', 'auditions', 'halloween', 'birthday', 'عيد ميلاد', 'خروجة', 'المصفوعين',
  'الصحابة', 'الاخوات', 'الساحل', 'كوره', 'كورة', 'لعب انهارده'
];

const ALIASES = [
  { match: ['palm', 'hills'], slug: 'palm-hills-developments', name: 'Palm Hills Developments' },
  { match: ['palmhills'], slug: 'palm-hills-developments', name: 'Palm Hills Developments' },
  { match: ['arco'], slug: 'arco', name: 'Arco Developments' },
  { match: ['akadia'], slug: 'akadia-developments', name: 'Akadia Developments' },
  { match: ['remal'], slug: 'remal-developments', name: 'Remal Developments' },
  { match: ['edge', 'holding'], slug: 'edge-holding', name: 'Edge Holding' },
  { match: ['edgeholding'], slug: 'edge-holding', name: 'Edge Holding' },
  { match: ['diar2'], slug: 'diar-developments', name: 'Diar Developments' },
  { match: ['gro'], slug: 'gro-development', name: 'Gro Development' },
  { match: ['torec'], slug: 'torec-developments', name: 'Torec Developments' },
  { match: ['najma'], slug: 'najma-developments', name: 'Najma Developments' },
  { match: ['eg', 'towers'], slug: 'eg-towers', name: 'EG Towers' },
  { match: ['eins'], slug: 'eg-towers', name: 'EG Towers' },
  { match: ['assema'], slug: 'al-assema-developments', name: 'Al Assema Developments' },
  { match: ['alassema'], slug: 'al-assema-developments', name: 'Al Assema Developments' },
  { match: ['developer', 'x'], slug: 'developer-x', name: 'Developer X' },
  { match: ['baron'], slug: 'el-baron-developments', name: 'El Baron Developments' },
  { match: ['batal'], slug: 'el-batal-developments', name: 'El Batal Developments' },
  { match: ['rock'], slug: 'el-batal-developments', name: 'El Batal Developments' },
  { match: ['centrada'], slug: 'centrada-developments', name: 'Centrada Developments' },
  { match: ['morshedy'], slug: 'morshedy-group', name: 'El Morshedy Group' },
  { match: ['bonyan'], slug: 'bonyan-developments', name: 'Bonyan Developments' },
  { match: ['daima'], slug: 'daima-developments', name: 'Daima Developments' },
  { match: ['cleopatra'], slug: 'cleopatra-developments', name: 'Cleopatra Developments' },
  { match: ['capitalhills'], slug: 'capital-hills-developments', name: 'Capital Hills Developments' },
  { match: ['capital', 'hills'], slug: 'capital-hills-developments', name: 'Capital Hills Developments' },
  { match: ['dal'], slug: 'dal-developments', name: 'DAL Developments' },
  { match: ['eco', 'west'], slug: 'new-city-developments', name: 'New City Developments (Eco West)' },
  { match: ['ecowest'], slug: 'new-city-developments', name: 'New City Developments (Eco West)' },
  { match: ['dau'], slug: 'al-dau-development', name: 'Al Dau Development' },
  { match: ['cpd'], slug: 'cpd-developments', name: 'CPD Developments' },
  { match: ['paragon'], slug: 'paragon-developments', name: 'Paragon Developments' },
  { match: ['royal'], slug: 'royal-developments', name: 'Royal Developments' },
  { match: ['areej'], slug: 'areej-developments', name: 'Areej Developments' },
  { match: ['abyat'], slug: 'abyat-el-kuwteya', name: 'Abyat El Kuwteya' },
  { match: ['amad'], slug: 'amad-developments', name: 'Amad Developments' },
  { match: ['dolmen'], slug: 'dolmen-developments', name: 'Dolmen Developments' },
  { match: ['nations', 'of', 'sky'], slug: 'sky-ad-developments', name: 'Sky AD Developments (Nations of Sky)' },
  { match: ['address', 'exclusive'], slug: 'the-address-investments', name: 'The Address Investments' },
  { match: ['wadi', 'degla'], slug: 'wadi-degla-developments', name: 'Wadi Degla Developments' },
  { match: ['wadidegla'], slug: 'wadi-degla-developments', name: 'Wadi Degla Developments' },
  { match: ['anchor'], slug: 'anchor-developments', name: 'Anchor Developments' },
  { match: ['burooj'], slug: 'imkan-misr', name: 'Imkan Misr (Al Burouj)' },
  { match: ['borouj'], slug: 'imkan-misr', name: 'Imkan Misr (Al Burouj)' },
  { match: ['amazon'], slug: 'amazon-developments', name: 'Amazon Developments' }
];

const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
const groups = config.groups || {};

let matchedCount = 0;
let personalCount = 0;

for (const [jid, g] of Object.entries(groups)) {
  const name = g.name || '';
  const tokens = tokenize(name);
  const normalizedStr = tokens.join(' ');

  // Check if explicitly non-dev personal/school
  const isPersonal = NON_DEV_SUBSTRINGS.some(sub => normalizedStr.includes(sub));
  if (isPersonal) {
    groups[jid].developer_slug = 'general-developer';
    groups[jid].developer_name = name;
    groups[jid].is_master_group = false;
    personalCount++;
    continue;
  }

  let matchResult = null;

  // 1. Alias check (EXACT token inclusion)
  for (const a of ALIASES) {
    const isMatch = a.match.every(word => tokens.includes(word));
    if (isMatch) {
      matchResult = { slug: a.slug, name: a.name };
      break;
    }
  }

  // 2. Matrix check
  if (!matchResult) {
    for (const m of matrix) {
      const devTokens = getCoreWords(tokenize(m.developer_name));
      const displayTokens = getCoreWords(tokenize(m.group_display_name));
      const slugTokens = m.canonical_slug.split('-').filter(t => !NOISE_WORDS.has(t));

      const matchesDev = devTokens.length > 0 && devTokens.every(dt => tokens.includes(dt));
      const matchesDisplay = displayTokens.length > 0 && displayTokens.every(dt => tokens.includes(dt));
      const matchesSlug = slugTokens.length > 0 && slugTokens.every(st => tokens.includes(st));

      const matchesProject = (m.projects || []).some(proj => {
        const pTokens = proj.split('-').filter(t => !NOISE_WORDS.has(t));
        return pTokens.length > 0 && pTokens.every(pt => tokens.includes(pt));
      });

      if (matchesDev || matchesDisplay || matchesSlug || matchesProject) {
        matchResult = { slug: m.canonical_slug, name: m.developer_name };
        break;
      }
    }
  }

  // 3. Compounds check
  if (!matchResult) {
    for (const proj of allProjects) {
      const pTokens = tokenize(proj.name).filter(t => !NOISE_WORDS.has(t));
      if (pTokens.length >= 2 && pTokens.every(pt => tokens.includes(pt))) {
        matchResult = { slug: proj.developerSlug, name: proj.developer };
        break;
      }
    }
  }

  if (matchResult) {
    groups[jid].developer_slug = matchResult.slug;
    groups[jid].developer_name = matchResult.name;
    groups[jid].is_master_group = true;
    matchedCount++;
  } else {
    // If it was previously matched to a real developer and wasn't personal, keep it
    if (g.developer_slug && g.developer_slug !== 'general-developer') {
      matchedCount++;
    } else {
      groups[jid].developer_slug = 'general-developer';
      groups[jid].developer_name = name;
      groups[jid].is_master_group = false;
    }
  }
}

config.last_synced_at = new Date().toISOString();
config.total_groups = Object.keys(groups).length;
config.matched_count = matchedCount;

fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');

console.log('Done!');
console.log(`Matched developer groups: ${matchedCount}`);
console.log(`Personal/Unmatched: ${config.total_groups - matchedCount}`);
