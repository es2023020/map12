import json
import re

files = ['src/data/compounds.generated.ts', 'src/data/compounds.ts']
dev_map = {}

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Match both "developer": "..." and developer: "..."
    matches1 = re.findall(r'"developer":\s*"([^"]+)",\s*"developerSlug":\s*"([^"]+)"', content)
    matches2 = re.findall(r'developer:\s*"([^"]+)",\s*developerSlug:\s*"([^"]+)"', content)
    for name, slug in matches1 + matches2:
        if slug not in dev_map:
            dev_map[slug] = {'name': name, 'slug': slug, 'count': 0}
        dev_map[slug]['count'] += 1

dev_list = sorted(list(dev_map.values()), key=lambda x: x['count'], reverse=True)
print(f"Total unique developers extracted: {len(dev_list)}")

with open('src/data/developers-list.json', 'w', encoding='utf-8') as out:
    json.dump(dev_list, out, indent=2, ensure_ascii=False)
print("Saved to src/data/developers-list.json")
