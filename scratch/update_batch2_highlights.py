import json
import re

updates_b2 = {
    "ashgar-city": {
        "highlights": [
            "Directly on Wahat Road (Oases Road) for rapid transit across West Cairo",
            "5 to 10 mins from Ring Road & 26th of July Corridor (Mehwar)",
            "10 to 15 mins from Mall of Egypt, Mall of Arabia, & Dandy Mega Mall",
            "10 to 15 mins from Nile University, MUST, & MSA University",
            "Minutes from Dream Park & Media Production City; quick access to Sphinx Airport"
        ]
    },
    "ashrafieh": {
        "highlights": [
            "Convenient location in Fifth Settlement, New Cairo",
            "10 to 15 mins from key Fifth Settlement residential & commercial hubs",
            "Close to established educational institutions & service districts",
            "Accessible transit routes connecting to Ring Road & Middle Ring Road",
            "Direct connectivity across East Cairo thoroughfares"
        ]
    },
    "at-east": {
        "highlights": [
            "Situated in Phase One of Mostakbal City facing main boulevard",
            "5 to 6 mins from Suez Road & 5 mins from Madinaty Gate 5",
            "10 mins from New Administrative Capital",
            "Close to Midtown Ring Road, Canadian University, & New Olympic Village",
            "Swift transit via Middle Ring Road, Regional Ring Road, & Al Amal Axis to Airport"
        ]
    },
    "azad": {
        "highlights": [
            "Directly behind American University in Cairo (AUC) in Golden Square",
            "1 to 5 mins from AUC campus & Future University (FUE)",
            "Next to Midtown Mall; 5 to 10 mins from Point 90 Mall & Concord Plaza",
            "Direct access to South Teseen Street, Middle Ring Road, & Suez Road",
            "20 mins from Cairo International Airport"
        ]
    },
    "azha-north-coast": {
        "highlights": [
            "Km 214 on Alexandria-Marsa Matrouh Coastal Road in Ras El Hekma bay",
            "Minutes from New Alamein City & direct exit off Fouka Road from Cairo",
            "Pristine Mediterranean beach frontage with crystal lagoons & white sand shores",
            "In-resort luxury commercial promenades, beach clubs, & 5-star hotels",
            "Prime positioning in high-growth Ras El Hekma coastal corridor"
        ]
    },
    "azha-sokhna": {
        "highlights": [
            "Located at beginning of Ain Sokhna, past toll station on Cairo-Suez Road",
            "50 to 60 mins from New Cairo & New Administrative Capital",
            "1h 15m to 1h 30m from central Cairo & Cairo International Airport",
            "Pristine Gulf of Suez beachfront, crystal lagoons, & water sports",
            "Anchored by luxury clubhouses, fine dining, & 5-star resort hotels"
        ]
    },
    "azzar-island": {
        "highlights": [
            "Prime Golden Square location in New Cairo's Fifth Settlement",
            "5 to 10 mins from American University in Cairo (AUC) & Future University (FUE)",
            "5 to 15 mins from Point 90 Mall, Concord Plaza, & Cairo Festival City (CFC)",
            "Direct access to South Teseen Street, Middle Ring Road, & Suez Road",
            "15 to 20 mins from Cairo International Airport"
        ]
    },
    "badya": {
        "highlights": [
            "3,000-acre smart city directly on El Wahat Road (Oases Road)",
            "25 mins from Grand Egyptian Museum (GEM) & Giza Pyramids",
            "Home to Badya University, international schools, & 'The Core' urban center",
            "Accessible via Dahshur Road extension & 26th of July Corridor",
            "35 mins from Sphinx International Airport & near Mall of Egypt"
        ]
    },
    "bamboo-extension": {
        "highlights": [
            "Directly along 26th of July Corridor (Mehwar) in Palm Hills October master plan",
            "Minutes from Gezira Sporting Club (October Branch) & Palm Hills Club",
            "10 to 15 mins from King's School West Cairo & MSA University",
            "10 to 15 mins from Mall of Arabia, Mall of Egypt, & Arkan Plaza",
            "Exclusive low-density layout with lush parks, foliage, & walking trails"
        ]
    },
    "bamboo-iii": {
        "highlights": [
            "Elevated terrain within Palm Hills October master plan with scenic views",
            "Directly beside Gezira Sporting Club (October Branch) & Palm Hills Golf",
            "Resort-style crystal lagoons, hardscape greenery, & modern clubhouse",
            "Fully finished townhouses (220–222 m²) & ground-garden family homes",
            "5% down payment with up to 10-year flexible payment plans"
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
        if slug in updates_b2:
            c['highlights'] = updates_b2[slug]['highlights']
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

for slug, udata in updates_b2.items():
    hl_str = json.dumps(udata['highlights'], indent=6, ensure_ascii=False)
    pattern = rf'(slug:\s*"{slug}".*?highlights:\s*)\[[^\]]*\]'
    if re.search(pattern, comp_ts_content, re.DOTALL):
        comp_ts_content = re.sub(pattern, rf'\1{hl_str}', comp_ts_content, flags=re.DOTALL)
        print(f"Updated {slug} in compounds.ts")

with open(comp_ts_path, 'w', encoding='utf-8') as f:
    f.write(comp_ts_content)

print("Finished update script for Batch 2.")
