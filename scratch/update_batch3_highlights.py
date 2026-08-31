import json
import re

updates_b3 = {
    "beit-al-bahr": {
        "highlights": [
            "Pristine North Coast coastal location with direct Mediterranean sea views",
            "Accessible via Alexandria-Marsa Matrouh Coastal Highway",
            "Close to major resort hubs in Ras El Hekma & Sidi Abdel Rahman zones",
            "Pristine white-sand beaches, crystal-clear waters, & private pools",
            "Luxury resort-style hospitality, fine dining, & landscaped promenades"
        ]
    },
    "belle-vie": {
        "highlights": [
            "Intersections of Dabaa Corridor, Cairo-Alexandria Desert Road, & Rod El Farag Axis",
            "3 mins from Cairo-Alexandria Desert Road & Rod El Farag Axis",
            "8 to 10 mins from 26th of July Corridor (Mehwar) & Dabaa Road link",
            "8 mins from Sphinx International Airport",
            "15 mins from Mall of Arabia, Cairo Gate, & American International School (AIS)"
        ]
    },
    "belle-vie-new-zayed": {
        "highlights": [
            "Intersections of Dabaa Corridor, Cairo-Alexandria Desert Road, & Rod El Farag Axis",
            "3 mins from Cairo-Alexandria Desert Road & Rod El Farag Axis",
            "8 to 10 mins from 26th of July Corridor (Mehwar) & Dabaa Road link",
            "8 mins from Sphinx International Airport",
            "15 mins from Mall of Arabia, Cairo Gate, & American International School (AIS)"
        ]
    },
    "beta-greens": {
        "highlights": [
            "Heart of Mostakbal City across an 85-acre master plan with vast greenery",
            "5 mins from Madinaty, Madinaty South Park, sports club, & medical center",
            "10 to 15 mins from New Administrative Capital & main capital gates",
            "Direct access via Middle Ring Road & close to Cairo-Suez Road corridor",
            "25 mins from Cairo International Airport & 35 mins from Heliopolis"
        ]
    },
    "beverly-hills": {
        "highlights": [
            "Directly along Cairo-Alexandria Desert Road in central West Cairo",
            "Minutes from 26th of July Corridor (Mehwar), Rod El Farag Axis, & Dabaa link",
            "5 to 15 mins from Arkan Plaza, Allegria, & Hyper One",
            "Near top academic institutions including Nile University & MUST",
            "Integrated sports facilities, parks, & international schools in community"
        ]
    },
    "bianchi-ilios": {
        "highlights": [
            "Km 134/135 on Alexandria-Marsa Matrouh Coastal Road in Sidi Abdel Rahman",
            "Directly next to Amwaj, Marassi, & Hacienda Bay",
            "Pristine private beachfront with 46,000 sqm wave-controlled crystal lagoons",
            "Greek-inspired architecture with 5-star hotel, wellness clubhouse, & dining",
            "Accessible via Dabaa Road & Fouka Road from Cairo & New Alamein"
        ]
    },
    "bloomfields": {
        "highlights": [
            "Corridor connecting New Cairo's Golden Square & New Administrative Capital",
            "10 mins from American University in Cairo (AUC) campus",
            "Direct accessibility via Middle Ring Road, Regional Ring Road, & Suez Road",
            "Close to New Capital Airport & upcoming Monorail / Electric Rail stations",
            "Minutes from Madinaty & 45 mins from Ain Sokhna via direct highway links"
        ]
    }
}

# 1. Update src/data/compounds.generated.ts
gen_path = 'src/data/compounds.generated.ts'
with open(gen_path, 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'=\s*(\[.*\]);?', text, re.DOTALL)
if match:
    compounds = json.loads(match.group(1))
    updated_count = 0
    for c in compounds:
        slug = c['slug']
        if slug in updates_b3:
            c['highlights'] = updates_b3[slug]['highlights']
            # If belle-vie-new-zayed, add note or parent link if appropriate
            if slug == 'belle-vie-new-zayed':
                c['parentSlug'] = 'belle-vie'
            updated_count += 1
    
    new_json_str = json.dumps(compounds, indent=2, ensure_ascii=False)
    new_text = text[:match.start(1)] + new_json_str + text[match.end(1):]
    with open(gen_path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print(f"Updated {updated_count} compounds in compounds.generated.ts")

# 2. Update src/data/compounds.ts if compounds exist there
comp_ts_path = 'src/data/compounds.ts'
with open(comp_ts_path, 'r', encoding='utf-8') as f:
    comp_ts_content = f.read()

for slug, udata in updates_b3.items():
    hl_str = json.dumps(udata['highlights'], indent=6, ensure_ascii=False)
    pattern = rf'(slug:\s*"{slug}".*?highlights:\s*)\[[^\]]*\]'
    if re.search(pattern, comp_ts_content, re.DOTALL):
        comp_ts_content = re.sub(pattern, rf'\1{hl_str}', comp_ts_content, flags=re.DOTALL)
        print(f"Updated {slug} in compounds.ts")

with open(comp_ts_path, 'w', encoding='utf-8') as f:
    f.write(comp_ts_content)

print("Finished update script for Batch 3.")
