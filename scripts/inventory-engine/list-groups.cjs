const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', '..', 'config', 'whatsapp-groups.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const groups = Object.entries(config.groups || {});

console.log('Total groups in config:', groups.length);

const matched = [];
const unmatched = [];

for (const [jid, g] of groups) {
  if (g.developer_slug && g.developer_slug !== 'general-developer') {
    matched.push({ jid, name: g.name, dev: g.developer_name, slug: g.developer_slug });
  } else {
    unmatched.push({ jid, name: g.name });
  }
}

console.log('--- MATCHED GROUPS (' + matched.length + ') ---');
matched.forEach((m, idx) => {
  console.log((idx + 1) + '. ' + m.name + ' -> ' + m.dev + ' (' + m.slug + ')');
});

console.log('\n--- UNMATCHED GROUPS (' + unmatched.length + ') ---');
unmatched.forEach((u, idx) => {
  console.log((idx + 1) + '. ' + u.name);
});
