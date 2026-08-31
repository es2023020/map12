import json
import re

# Dictionary of target updates
updates = {
    "31-west": {
        "highlights": [
            "Directly off 26th of July Corridor (Mehwar) near Bamboo extension",
            "5 mins from Al Gezira Club (October), Arkan Plaza, & Galleria 40",
            "10 mins from El Alsson British School & Lycée Albert Camus",
            "10 mins from Mall of Egypt & 15 mins from Mall of Arabia",
            "Neighbors New Giza & Palm Hills October; 25 mins to Sphinx Airport"
        ]
    },
    "90-avenue": {
        "highlights": [
            "Directly on South Teseen Street, facing American University in Cairo (AUC)",
            "1 to 5 mins from AUC, Future University (FUE), & top international schools",
            "2 to 5 mins from Point 90 Mall, Concord Plaza, & Galleria Mall",
            "7 mins from Ring Road & Suez Road; 10 mins from New Capital",
            "25 to 30 mins from Cairo International Airport"
        ]
    },
    "97-hills": {
        "highlights": [
            "Heart of Fifth Settlement with swift access to Middle Ring Road & Bin Zayed Axis",
            "5 mins from Middle Ring Road; 10 mins from AUC & Main Teseen Street",
            "10 mins from Point 90 Mall & 15 mins from Cairo Festival City (CFC)",
            "20 mins from New Administrative Capital",
            "25 mins from Cairo International Airport"
        ]
    },
    "address-east": {
        "highlights": [
            "Directly off Suez Road in Golden Square, New Cairo",
            "5 mins from New Administrative Capital",
            "10 mins from American University in Cairo (AUC) & Golden Square hubs",
            "Adjacent to Mountain View iCity & prime East Cairo retail destinations",
            "15 mins from Cairo Airport; 20 mins from Heliopolis & Nasr City"
        ]
    },
    "aeon": {
        "highlights": [
            "Directly on Gamal Abdel Nasser Street with high-rise contemporary towers",
            "5 to 10 mins from Arkan Plaza, Mall of Arabia, & Americana Plaza",
            "10 mins from top international schools, universities, & Sheikh Zayed hospitals",
            "Direct access to 26th of July Corridor (Mehwar) towards Giza & central Cairo",
            "Swift access to Cairo-Alexandria Desert Road"
        ]
    },
    "al-rehab": {
        "highlights": [
            "Directly on Suez Road with direct connectivity to Heliopolis & Nasr City",
            "Minutes from Middle Ring Road & New Administrative Capital corridors",
            "In-community Open Air Mall, Gate 1 & 2 Malls, banking, & retail centers",
            "5 to 10 mins from British School of Modern Thinking & medical hubs",
            "15 to 20 mins from Cairo International Airport"
        ]
    },
    "alam-al-roum": {
        "highlights": [
            "Prime location East of Marsa Matrouh along International Coastal Road",
            "7.2 km shoreline with powdery white sand bays & swimmable natural lagoons",
            "15 to 20 mins from downtown Marsa Matrouh, markets, & hospitals",
            "6 km from Marsa Matrouh International Airport",
            "West Coast sanctuary with 370-berth international yacht marina"
        ]
    },
    "allegria": {
        "highlights": [
            "Directly along Cairo-Alexandria Desert Road & 26th of July Corridor (Mehwar)",
            "Home to Egypt's premier Greg Norman-designed 18-hole championship golf course",
            "5 to 10 mins from BISC, AIS West, Nile University, & MUST",
            "5 to 15 mins from Arkan Plaza, Allegria Hub, & Mall of Arabia",
            "Quick access to Sphinx International Airport & 30 mins to Cairo Airport"
        ]
    },
    "almaza-bay": {
        "highlights": [
            "Km 37 on Alexandria-Marsa Matrouh International Coastal Road",
            "35 to 40 mins East of downtown Marsa Matrouh & markets",
            "Sheltered natural bay with crystal-clear turquoise waters & white sands",
            "Anchored by JAZ Almaza Beach Resort, luxury hotels, & high-end beach clubs",
            "Exclusive quiet North Coast summer sanctuary"
        ]
    },
    "amorada": {
        "highlights": [
            "Prime Golden Square position on extension of North 90th Street, opposite Hyde Park",
            "5 to 10 mins from American University in Cairo (AUC) & Future University (FUE)",
            "5 to 15 mins from Point 90 Mall, Concord Plaza, & Cairo Festival City (CFC)",
            "3 mins from Middle Ring Road & swift access to South Teseen Street & Suez Road",
            "15 to 20 mins from Cairo International Airport & New Capital"
        ]
    },
    "amwaj": {
        "highlights": [
            "Km 136 Sidi Abdel Rahman on Alexandria-Marsa Matrouh Desert Road",
            "Directly adjacent to Marassi & Hacienda Bay",
            "Expansive Mediterranean beach frontage, crystal lagoons, & water sports",
            "5 to 15 mins from Sidi Abdel Rahman commercial strips & beach clubs",
            "Fast highway transit via Dabaa Road & New Alamein bypass"
        ]
    },
    "anakaji": {
        "highlights": [
            "Heart of R8 Residential District (Plot I4) in New Administrative Capital",
            "5 to 10 mins from Diplomatic Quarter, Presidential District, & Green River Park",
            "10 mins from international university campuses & specialized medical centers",
            "Convenient access to Bin Zayed Axis & Middle Ring Road",
            "Direct road connectivity to New Cairo & Suez Road"
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
        if slug in updates:
            c['highlights'] = updates[slug]['highlights']
            updated_count += 1
    
    new_json_str = json.dumps(compounds, indent=2, ensure_ascii=False)
    new_text = text[:match.start(1)] + new_json_str + text[match.end(1):]
    with open(gen_path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print(f"Updated {updated_count} compounds in compounds.generated.ts")

# 2. Update src/data/compounds.ts if compounds array is exported there
comp_ts_path = 'src/data/compounds.ts'
with open(comp_ts_path, 'r', encoding='utf-8') as f:
    comp_ts_content = f.read()

# For compounds.ts, let's update highlights arrays for matching slugs using regex/eval or text replacement
for slug, udata in updates.items():
    hl_str = json.dumps(udata['highlights'], indent=6, ensure_ascii=False)
    pattern = rf'(slug:\s*"{slug}".*?highlights:\s*)\[[^\]]*\]'
    if re.search(pattern, comp_ts_content, re.DOTALL):
        comp_ts_content = re.sub(pattern, rf'\1{hl_str}', comp_ts_content, flags=re.DOTALL)
        print(f"Updated {slug} in compounds.ts")

with open(comp_ts_path, 'w', encoding='utf-8') as f:
    f.write(comp_ts_content)

print("Finished update script.")
