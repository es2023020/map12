import json
import re

with open('src/data/compounds.generated.ts', 'r', encoding='utf-8') as f:
    text = f.read()
    match = re.search(r'=\s*(\[.*\]);?', text, re.DOTALL)
    compounds = json.loads(match.group(1))

search_terms = [
    'bahr', 'beit', 'belle', 'beta', 'beverly', 'bianchi', 'bloomfields'
]

print("Matching compounds:")
for c in compounds:
    slug = c['slug']
    name = c['name']
    for st in search_terms:
        if st in slug.lower() or st in name.lower():
            print(f"- term: '{st}' -> slug: '{slug}', name: '{name}'")
