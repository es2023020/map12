import json
import re

with open('src/data/compounds.generated.ts', 'r', encoding='utf-8') as f:
    text = f.read()
    match = re.search(r'=\s*(\[.*\]);?', text, re.DOTALL)
    compounds = json.loads(match.group(1))

search_terms = [
    '31', '90', '97', 'address', 'aeon', 'rehab', 'alam', 'allegria', 'almaza', 'amorada', 'amwaj', 'anakaji'
]

print("Found compounds:")
for c in compounds:
    name = c['name']
    slug = c['slug']
    for st in search_terms:
        if st in slug.lower() or st in name.lower():
            print(f"- term: {st} -> slug: '{slug}', name: '{name}'")
            print(f"  current highlights: {c.get('highlights')}")
            print(f"  current blurb: {c.get('blurb')[:60]}...")
