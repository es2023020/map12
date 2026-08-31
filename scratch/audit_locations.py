import json
import re
import os

with open('src/data/compounds.generated.ts', 'r', encoding='utf-8') as f:
    text = f.read()
    match = re.search(r'=\s*(\[.*\]);?', text, re.DOTALL)
    compounds = json.loads(match.group(1))

# Load compound-registry.ts
with open('src/data/compound-registry.ts', 'r', encoding='utf-8') as f:
    reg_text = f.read()

# Load wikimapia-locations.json
wikimapia = {}
if os.path.exists('src/data/wikimapia-locations.json'):
    with open('src/data/wikimapia-locations.json', 'r', encoding='utf-8') as f:
        wikimapia = json.load(f)

print(f"Total compounds in compounds.generated.ts: {len(compounds)}")

# Parse compound-registry entries to check mapsUrl, exact location, etc.
registry_entries = {}
reg_matches = re.findall(r'"([^"]+)":\s*\{([^}]+)\}', reg_text)
for slug, content in reg_matches:
    registry_entries[slug] = content

audit_list = []

# Destination default center coordinates to check if project uses raw destination center
dest_centers = {
    "new-cairo": (30.012, 31.488),
    "sheikh-zayed": (30.012, 30.985),
    "6th-october": (29.962, 30.932),
    "mostakbal-city": (30.052, 31.681),
    "new-capital": (30.010, 31.720),
    "ras-el-hekma": (31.020, 27.850),
    "sidi-abdelrahman": (30.916, 28.712),
    "new-alamein": (30.835, 28.950),
    "ain-sokhna": (29.600, 32.330),
    "el-gouna": (27.395, 33.678),
    "north-coast": (30.900, 28.800)
}

for c in compounds:
    slug = c['slug']
    name = c['name']
    dest = c.get('destination', '')
    lat = c.get('lat')
    lng = c.get('lng')
    developer = c.get('developer', 'Unknown')
    highlights = c.get('highlights', [])
    city = c.get('city', '')

    reg_content = registry_entries.get(slug, '')
    has_maps_url = 'mapsUrl' in reg_content or 'google' in reg_content.lower()

    # Check if wikimapia has exact map boundary/location
    in_wikimapia = slug in wikimapia or name.lower() in wikimapia or slug.replace('-', ' ') in wikimapia

    # Check location highlight
    has_loc_highlight = any(
        kw in h.lower() for h in highlights 
        for kw in ['location', 'km ', 'km', 'road', 'axis', 'district', 'settlement', 'zayed', 'cairo', 'coast', 'ring', 'corridor', 'square', 'pyramid', 'sea', 'beach', 'gulf', 'bay', 'gate', 'street', 'teseen', 'october', 'capital', 'somabay', 'makadi', 'sokhna', 'alamein', 'hekma']
    )

    # Check if lat/lng is exact destination center (placeholder) or missing
    is_dest_center = False
    if dest in dest_centers and lat and lng:
        dlat, dlng = dest_centers[dest]
        if abs(lat - dlat) < 0.005 and abs(lng - dlng) < 0.005:
            is_dest_center = True

    issues = []
    if not in_wikimapia:
        issues.append("Missing exact map pin/polygon (Wikimapia)")
    if not has_maps_url:
        issues.append("Missing Google Maps link")
    if not has_loc_highlight:
        issues.append("Missing location highlight in highlights")
    if is_dest_center:
        issues.append("Using approximate/destination default center coordinates")

    audit_list.append({
        "slug": slug,
        "name": name,
        "developer": developer,
        "destination": dest,
        "lat": lat,
        "lng": lng,
        "city": city,
        "in_wikimapia": in_wikimapia,
        "has_maps_url": has_maps_url,
        "has_loc_highlight": has_loc_highlight,
        "is_dest_center": is_dest_center,
        "issues": issues,
        "highlights": highlights
    })

with open('scratch/location_audit_results.json', 'w', encoding='utf-8') as out:
    json.dump(audit_list, out, indent=2)

print(f"Audit completed for {len(audit_list)} compounds.")
