import json
import re

updates_b6 = {
    "creekview": {
        "highlights": [
            "Positioned opposite Hyde Park with direct access to Middle Ring Road & South 90th St",
            "3 mins from Mountain View Hyde Park & 5 mins from South 90th St Golden Square",
            "10 mins from American University in Cairo (AUC) campus",
            "Short drive to Ain Sokhna Road, East Cairo hubs, & New Capital corridor",
            "119-acre low-density plan (16% footprint) with creek lagoons & signature iVillas"
        ]
    },
    "crescent-walk": {
        "highlights": [
            "Situated in emerging Sixth Settlement (District 6) corridor, next to Zed East",
            "5 mins from Ring Road & New Administrative Capital",
            "7 mins from Golden Square & South 90th Street",
            "12 mins from American University in Cairo (AUC) campus",
            "118-acre master plan by WATG featuring a Zamalek/Maadi-inspired crescent walkway"
        ]
    },
    "d-bay": {
        "highlights": [
            "Km 165 on Alexandria-Marsa Matrouh Coastal Road at Dabaa Axis exit",
            "5 mins from Marassi, Sidi Abdel Rahman, & La Vista Bay; 45 mins to New Alamein",
            "2.5 to 3 hours from Cairo via Dabaa / Fouka Road network",
            "200-acre master plan with 800m sandy beachfront & terraced sea-view elevations",
            "Swimmable crystal lagoons, sports academies, & boutique hotel"
        ]
    },
    "d-o-s-e": {
        "highlights": [
            "Km 174 on Alexandria-Marsa Matrouh Coastal Road (El Dabaa / Sidi Abdel Rahman)",
            "3 mins from Cairo-Dabaa Road exit; 14 to 23 km from Al Alamein Airport",
            "Close to The WaterWay North Coast, La Vista Bay, & Bianchi Ilios",
            "125-acre plan with 450m direct sandy beach & 70% open green/lagoon area",
            "Includes international hotel, pink pool, kids aqua park, & beachfront clubhouse"
        ]
    },
    "dayz": {
        "highlights": [
            "Km 97 on Coastal Road in Marina 6 (Lesan Al-Wazara cape area)",
            "Directly next to Rixos Alamein Hotel & short walk from Al Ahly Club Beach",
            "Minutes from New Alamein Towers, Downtown Alamein, & Alamein Airport",
            "Boutique beachfront community with 100% 1st-row Mediterranean sea views",
            "Hotel-serviced management (BirdNest & Gewan) for high rental yields"
        ]
    },
    "diplo-3": {
        "highlights": [
            "Km 126 on International Coastal Road in heart of Sidi Abdel Rahman bay",
            "Minutes from Marassi, Amwaj, Hacienda Bay, & Stella Sidi Abdel Rahman",
            "Close to New Alamein City & El Alamein International Airport",
            "3 hours from Cairo & 2 hours from Alexandria via regional highway network",
            "Nostalgic master plan with private sandy beach, lagoons, & commercial strip"
        ]
    },
    "direction-white": {
        "highlights": [
            "Km 192–193 on Coastal Road in heart of Ras El Hekma bay",
            "12 km from Dabaa Road exit & 20 mins from Al Alamein International Airport",
            "Close to June by SODIC, The Med, & Gaia",
            "Terraced topography rising up to 50m above sea level with 600m sandy beach",
            "Signature crystal lagoons, beachfront clubhouses, & branded hotel hospitality"
        ]
    },
    "district-5": {
        "highlights": [
            "Directly on Ain Sokhna Road corridor bridging New Cairo, Maadi, & New Capital",
            "7 mins from New Cairo & Fifth Settlement; 8 mins from Maadi",
            "19 mins from Cairo International Airport & Heliopolis",
            "200-acre mixed-use master plan anchored by District 5 Mall & sports club",
            "Low-density layout with open green parks, outdoor plazas, & co-working spaces"
        ]
    },
    "el-masyaf": {
        "highlights": [
            "Km 211–212 on Alexandria-Marsa Matrouh Coastal Road in Ras El Hekma",
            "10 mins from Fouka Road exit; 40 to 45 mins to New Alamein City & Airport",
            "Accessible from Greater Cairo in ~3 hours via Fouka Road / Dabaa Axis",
            "103-acre terraced layout with 730m direct sandy beach & massive central lagoon",
            "Diving center, beachfront clubhouses, & high-end coastal residences"
        ]
    },
    "patio-oro": {
        "highlights": [
            "Heart of Golden Square (Fifth Settlement) near Bin Zayed Axis & Middle Ring Road",
            "7 mins from American University in Cairo (AUC) campus",
            "10 to 12 mins from North 90th Street & Cairo-Suez Road",
            "14 to 15 mins from New Administrative Capital & Al-Rehab City",
            "175-acre master plan with 80%+ green open space ratio & low-rise G+3/4 buildings"
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
        if slug in updates_b6:
            c['highlights'] = updates_b6[slug]['highlights']
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

for slug, udata in updates_b6.items():
    hl_str = json.dumps(udata['highlights'], indent=6, ensure_ascii=False)
    pattern = rf'(slug:\s*"{slug}".*?highlights:\s*)\[[^\]]*\]'
    if re.search(pattern, comp_ts_content, re.DOTALL):
        comp_ts_content = re.sub(pattern, rf'\1{hl_str}', comp_ts_content, flags=re.DOTALL)
        print(f"Updated {slug} in compounds.ts")

with open(comp_ts_path, 'w', encoding='utf-8') as f:
    f.write(comp_ts_content)

print("Finished update script for Batch 6.")
