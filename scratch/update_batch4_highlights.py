import json
import re

updates_b4 = {
    "blumar-sokhna": {
        "highlights": [
            "Km 32 on Suez-Ain Sokhna Road in El Dome / Zaafarana area",
            "60 mins from Cairo for quick weekend getaways",
            "Spans 261 feddans with 350m private Red Sea beachfront",
            "Extensive swimming pools, lush green landscapes, & sports courts",
            "Mix of beach chalets & standalone villas"
        ]
    },
    "blumar": {
        "highlights": [
            "Km 138 on International Coastal Road in Sidi Abdel Rahman bay",
            "Located near elite coastal destinations like Amwaj & Hacienda White",
            "Covers 270,000 sqm with boutique hotel & verdant promenades",
            "Collection of beach chalets, duplexes, & penthouses near shore",
            "Direct access to Mediterranean crystal waters & pools"
        ]
    },
    "botanica": {
        "highlights": [
            "Heart of R7 Residential District (Plot E2) in New Capital",
            "Minutes from Green River Central Park, Expo City, & Diplomatic Quarter",
            "Close to Government District & Nativity Cathedral",
            "Direct access via Central Axis, Bin Zayed Axis, & Regional Ring Road",
            "Green eco-architecture with landscaped gardens surrounding low-rise blocks"
        ]
    },
    "iconic-tower-district": {
        "highlights": [
            "Heart of New Capital between North & South Bin Zayed Axes & Regional Ring Road",
            "Home to Iconic Tower (tallest skyscraper in Africa) & Green River Park",
            "Close to Government District, Ministries, & Presidential Palace",
            "Integrated with Cairo Monorail system & major highway axes",
            "Egypt's premier financial hub with high-rise corporate towers & 5-star hotels"
        ]
    },
    "byoum-lakeside": {
        "highlights": [
            "Directly on shores of Lake Qarun along Qarun Lake Touristic Road",
            "20 to 45 mins from Wadi El Rayan & Wadi Al-Hitan UNESCO World Heritage site",
            "Close to Tunis Village pottery hub & historical mounds",
            "Direct lake views, outdoor swimming pools, & eco-resort dining",
            "1.5 to 2-hour drive from Cairo via Cairo-Fayoum desert highway"
        ]
    },
    "c-north-coast": {
        "highlights": [
            "Km 188 on International Coastal Road in heart of Ras El Hekma bay",
            "Swift access via Fouka Road & Dabaa Axis; 30 mins to New Alamein",
            "Adjacent to Kattameya Coast, Swan Lake North Coast, The Med, & Soul",
            "114-acre terraced master plan elevated up to 46m above sea level",
            "400m private beachfront, crystal lagoons, 5-star hotel, & wellness club"
        ]
    },
    "c-north": {
        "highlights": [
            "Km 188 on International Coastal Road in heart of Ras El Hekma bay",
            "Swift access via Fouka Road & Dabaa Axis; 30 mins to New Alamein",
            "Adjacent to Kattameya Coast, Swan Lake North Coast, The Med, & Soul",
            "114-acre terraced master plan elevated up to 46m above sea level",
            "400m private beachfront, crystal lagoons, 5-star hotel, & wellness club"
        ]
    },
    "caesar-bay": {
        "highlights": [
            "Km 200 on Alexandria-Marsa Matrouh Coastal Road in Ras El Hekma",
            "Conveniently reachable via Fouka Road link & International Coastal Road",
            "Short drive to Marsa Matrouh to the west & New Alamein to the east",
            "Natural bay setting with wide private sandy beach & turquoise waters",
            "Established resort hospitality with multi-tiered pools, dining, & spa"
        ]
    },
    "caesar-sodic": {
        "highlights": [
            "Pristine Ras El Hekma bay along Alexandria-Marsa Matrouh Coastal Road",
            "15 mins from Dabaa Road / Fouka Road exits; 30 mins to New Alamein Airport",
            "Adjacent to June by SODIC (5 mins away)",
            "Terraced master plan elevated up to 40m with 1.2 km private beachfront",
            "Features 'Matcha' retail village, 6-hole golf course, & swimmable lagoons"
        ]
    },
    "cairo-business-park": {
        "highlights": [
            "Immediate entry points off Cairo-Suez Road & New Cairo Ring Road",
            "5 mins from North 90th Street; 10 mins from AUC & Al Rehab City",
            "15 mins from Cairo International Airport & 30 mins from New Capital",
            "18-acre gated ecosystem with 42 standalone European-style office buildings",
            "Centered around 8,700 sqm Central Park, Hilton Garden Inn, & retail strip"
        ]
    },
    "cairo-gate": {
        "highlights": [
            "Directly on Cairo-Alexandria Desert Road opposite Smart Village",
            "5 mins from Sphinx International Airport & 26th of July Corridor (Mehwar)",
            "Minutes from Arkan Plaza, Dandy Mega Mall, & Mall of Arabia",
            "Direct transit via Rod El Farag Axis & Dabaa highway connection",
            "Features Town Square retail, Vida Residences, & open-air plazas"
        ]
    },
    "cali-coast-ras-el-hekma": {
        "highlights": [
            "Km 198 on Alexandria-Marsa Matrouh Coastal Road in Ras El Hekma bay",
            "Accessible via newly developed Fouka Road extension & Coastal Road",
            "Easy reach of New Alamein City & Sidi Abdel Rahman",
            "California-style beach layout with wide sandy shore & crystal lagoons",
            "Tiered elevation with lazy rivers, boardwalks, & beach clubhouses"
        ]
    },
    "capital-heights": {
        "highlights": [
            "Prime position along Southern Bin Zayed Axis in Investors Area",
            "Overlooks & sits directly behind Green River park system",
            "5 to 10 mins from Expo City, Medical City, Al Masa Hotel, & Cathedral",
            "Adjacent to IL Bosco & Midtown communities; swift access to Regional Ring Road",
            "Low footprint density with artificial lakes, commercial mall, & sports clubs"
        ]
    },
    "carnelia": {
        "highlights": [
            "Directly on Red Sea coast at gates of Galala Marina & Galala City",
            "Seamless transit via Sokhna Road & Galala Road (1h to 90m from Cairo)",
            "Close to Red Sea yacht marinas & luxury hospitality resorts",
            "Stepped mountainside topography ensuring 90%+ sea view ratio",
            "Private sandy beach, crystal lagoons, cascading waterfalls, & boutique hotel"
        ]
    },
    "selina-carnelia": {
        "highlights": [
            "Directly on Red Sea coast at gates of Galala Marina & Galala City",
            "Seamless transit via Sokhna Road & Galala Road (1h to 90m from Cairo)",
            "Close to Red Sea yacht marinas & luxury hospitality resorts",
            "Stepped mountainside topography ensuring 90%+ sea view ratio",
            "Private sandy beach, crystal lagoons, cascading waterfalls, & boutique hotel"
        ]
    },
    "chapters-residence": {
        "highlights": [
            "Plot M5 in R8 Residential District, New Administrative Capital",
            "5 to 10 mins from CBD, Government District, Green River, & Al Masa Hotel",
            "Near Southern Bin Zayed Axis & monorail transit stations",
            "33-acre low-density plan integrating Hotel Indigo (IHG Hotels & Resorts)",
            "Landscaped green islands, clubhouse, commercial strip, & mosque"
        ]
    },
    "city-gate": {
        "highlights": [
            "East Cairo position bridging New Cairo & New Administrative Capital",
            "Direct access via Regional Ring Road & Cairo-Suez Road",
            "Minutes from AUC campus & Golden Square hubs; 30 mins to Cairo Airport",
            "Multi-million-sqm integrated mega-community layout",
            "Centered around 18-hole championship golf course, parks, & medical complexes"
        ]
    },
    "city-oval": {
        "highlights": [
            "Block L9 / Plot F1 in R8 Residential District near Dubai Mall (New Capital)",
            "5 to 10 mins from Green River, Central Park, Expo City, & Swedish University",
            "Near Presidential Palace, Diplomatic District, & Monorail stations",
            "Direct access via Southern Bin Zayed Axis, Suez Road, & Regional Ring Road",
            "37-acre English architectural layout elevated 12m with mini-golf & tennis courts"
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
        if slug in updates_b4:
            c['highlights'] = updates_b4[slug]['highlights']
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

for slug, udata in updates_b4.items():
    hl_str = json.dumps(udata['highlights'], indent=6, ensure_ascii=False)
    pattern = rf'(slug:\s*"{slug}".*?highlights:\s*)\[[^\]]*\]'
    if re.search(pattern, comp_ts_content, re.DOTALL):
        comp_ts_content = re.sub(pattern, rf'\1{hl_str}', comp_ts_content, flags=re.DOTALL)
        print(f"Updated {slug} in compounds.ts")

with open(comp_ts_path, 'w', encoding='utf-8') as f:
    f.write(comp_ts_content)

print("Finished update script for Batch 4.")
