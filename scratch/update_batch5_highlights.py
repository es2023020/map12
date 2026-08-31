import json
import re

updates_b5 = {
    "citystars-park-street": {
        "highlights": [
            "1.2 km Ring Road frontage in New Cairo with maximum commercial visibility",
            "5 mins from Cairo-Suez Road; 7 to 10 mins from Cairo Festival City (CFC)",
            "10 mins from North 90th Street, Mohamed Naguib Axis, & Tantawy Axis",
            "15 mins from AUC & 20 mins from Cairo International Airport",
            "72-acre mixed-use development with Fairmont serviced apartments & Park St retail"
        ]
    },
    "cleo-water-residence": {
        "highlights": [
            "Inside Palm Hills New Cairo master plan with direct Middle Ring Road access",
            "17 km from American University in Cairo (AUC) & German University (GUC)",
            "Minutes from North 90th Street commercial spine",
            "30 to 35 mins from Cairo International Airport & easy reach to New Capital",
            "Centered around a 5,000 sqm crystal lagoon with 80%+ open green spaces"
        ]
    },
    "cleopatra-square": {
        "highlights": [
            "Directly on 26th of July Corridor between Sheikh Zayed & 6th of October",
            "15 mins from Lebanon Square (Mohandessin/Giza) via 26th of July Axis",
            "Minutes from Mall of Arabia, Galleria 40, Hyper One, & Nile University",
            "Direct transit to Cairo-Alexandria Desert Road & Rod El Farag Axis",
            "Italian-inspired low-density villa compound designed by G.B. Bellagamba"
        ]
    },
    "club-views": {
        "highlights": [
            "Directly on Cairo-Suez Road inside the 450-acre Sarai master plan",
            "5 mins from New Administrative Capital gateway",
            "10 mins from American University in Cairo (AUC) campus",
            "15 mins from Ring Road connecting to Greater Cairo",
            "Anchored by a 100,000 sqm sports & social clubhouse"
        ]
    },
    "commonhaus": {
        "highlights": [
            "Inside SkyRamp in Sheikh Zayed directly facing Gate 4 near Al-Amal Axis",
            "Accessible via 26th of July Corridor, Dahshour Road, & Desert Road",
            "Short drive to Mall of Arabia, Nile University, & Arkan Plaza",
            "Seamless connectivity to Sphinx International Airport & Smart Village",
            "Managed by BirdNest Hotels & Residences with full serviced hospitality"
        ]
    },
    "coral-coves": {
        "highlights": [
            "Inside Somabay Peninsula with direct Red Sea shoreline & coral reefs",
            "20 mins from Hurghada International Airport & 45 mins from Hurghada city",
            "1.5 hours from El Gouna & ~4-hour drive (or 1.5h flight) from Cairo",
            "Stepped topography ensuring panoramic Red Sea & lagoon views",
            "Near Cascades Golf Course (Gary Player), Thalasso Spa, & international marina"
        ]
    },
    "covaya": {
        "highlights": [
            "Positioned inside Telal Ain Sokhna along Ain Sokhna-Zafarana Road",
            "10 mins from Galala City & Galala Marina; 45 mins from New Capital",
            "75 mins from Greater Cairo via Ain Sokhna highway",
            "Tiered G+4 residential blocks with panoramic sea & landscape views",
            "Fully finished hotel-branded chalets with private beach access & spa"
        ]
    },
    "creek-district": {
        "highlights": [
            "Directly on Cairo-Suez Road at front edge of Creek Town, First Settlement",
            "5 mins from Cairo International Airport & North 90th Street",
            "Adjacent to Al-Rehab City, SwanLake, & 10 mins from Ring Road",
            "15 to 20 mins from New Administrative Capital",
            "High-end commercial, administrative, & medical strip designed by YBA"
        ]
    },
    "creek-town": {
        "highlights": [
            "Directly on Cairo-Suez Road in First Settlement at entrance of Al-Rehab City",
            "2 mins from Al-Rehab City & 5 mins from Cairo Airport & North 90th Street",
            "12 mins from New Administrative Capital",
            "100-acre master plan designed by Hany Saad Innovations & YBA (80% green ratio)",
            "Features 2 clubhouses, 10-acre commercial strip, & low-rise G+3 buildings"
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
        if slug in updates_b5:
            c['highlights'] = updates_b5[slug]['highlights']
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

for slug, udata in updates_b5.items():
    hl_str = json.dumps(udata['highlights'], indent=6, ensure_ascii=False)
    pattern = rf'(slug:\s*"{slug}".*?highlights:\s*)\[[^\]]*\]'
    if re.search(pattern, comp_ts_content, re.DOTALL):
        comp_ts_content = re.sub(pattern, rf'\1{hl_str}', comp_ts_content, flags=re.DOTALL)
        print(f"Updated {slug} in compounds.ts")

with open(comp_ts_path, 'w', encoding='utf-8') as f:
    f.write(comp_ts_content)

print("Finished update script for Batch 5.")
