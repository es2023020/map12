import json
import re

compounds_gen_path = r"D:\map12\src\data\compounds.generated.ts"
availability_gen_path = r"D:\map12\src\data\availability.generated.ts"

print("=== FAST PYTHON DATA UPDATE ===")

# --- 1. UPDATE COMPOUNDS GENERATED ---
with open(compounds_gen_path, "r", encoding="utf-8") as f:
    c_content = f.read()

c_start = c_content.find("=") + 1
c_end = c_content.rfind(";")
compounds = json.loads(c_content[c_start:c_end].strip())
comp_map = {c["slug"]: c for c in compounds}

# 1. Update La Vista City
lvc = comp_map.get("la-vista-city")
if lvc:
    lvc["developer"] = "STM"
    lvc["developerSlug"] = "stm"
    lvc["priceFrom"] = 30.07
    lvc["types"] = ["Townhouse", "Twin House", "Standalone Villa"]
    lvc["paymentPlan"] = "Town & Twin: 10% DP / 8 yrs | Standalone: 20% DP / 8 yrs"
    lvc["blurb"] = "La Vista City by STM — an exclusive villa community in the New Capital featuring ready-to-move, fully finished classic and modern townhouses, twin houses, and standalone villas."
    lvc["status"] = "RTM"
    lvc["deliveryYear"] = 2026

# 2. Update Bamboo Extension
be = comp_map.get("bamboo-extension")
if be:
    be["developer"] = "Palm Hills Developments"
    be["developerSlug"] = "palm-hills-developments"

# 3. Update Address East
ae = comp_map.get("address-east")
if ae:
    ae["developer"] = "Dorra Group"
    ae["developerSlug"] = "dorra-group"
    ae["status"] = "On-Hold"

# 4. Add Village West
if "village-west" not in comp_map:
    vw = {
        "slug": "village-west",
        "name": "Village West",
        "destination": "sheikh-zayed",
        "lat": 30.015,
        "lng": 30.985,
        "developer": "Dorra Group",
        "developerSlug": "dorra-group",
        "priceFrom": 7.0,
        "deliveryYear": 2028,
        "status": "Off-Plan",
        "beachfront": False,
        "types": ["Apartment", "Duplex", "Penthouse", "Townhouse", "Twin House"],
        "amenities": ["Clubhouse", "Commercial Strip", "Swimming Pools", "Landscaped Parks", "24/7 Security"],
        "hero": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80"
        ],
        "blurb": "Village West by Dorra Group — a premier residential community in Sheikh Zayed offering premium apartments, penthouses, duplexes, and townhouses with 7–8 year installment plans.",
        "paymentPlan": "10% Down Payment over 7 - 8 Years",
        "areaSize": "125 feddan",
        "unitSizes": "65–270 m²",
        "type": "Residential",
        "city": "Sheikh Zayed City, Giza Governorate, Egypt",
        "highlights": [
            "Prime Sheikh Zayed location",
            "Flexible 7–8 year payment plans",
            "Diverse unit mix from 1BD to Standalone Townhouses"
        ]
    }
    compounds.append(vw)

new_c_ts = "import { Compound } from \"./compounds\";\n\nexport const compoundsGenerated: Compound[] = " + json.dumps(compounds, indent=2) + ";\n"
with open(compounds_gen_path, "w", encoding="utf-8") as f:
    f.write(new_c_ts)
print("[OK] Updated compounds.generated.ts")

# --- 2. UPDATE AVAILABILITY GENERATED ---
# We can load availability.generated.ts by converting unquoted JS object keys to valid JSON string using regex!
with open(availability_gen_path, "r", encoding="utf-8") as f:
    a_raw = f.read()

a_start = a_raw.find("=") + 1
a_end = a_raw.rfind(";")
a_js = a_raw[a_start:a_end].strip()

# Quote unquoted property keys: e.g. slug: -> "slug":
a_json_str = re.sub(r'(\b[a-zA-Z_][a-zA-Z0-9_]*\b)\s*:', r'"\1":', a_js)
# Remove trailing commas
a_json_str = re.sub(r',\s*([\]}])', r'\1', a_json_str)

a_list = json.loads(a_json_str)
a_map = {a["slug"]: a for a in a_list}

# Update La Vista City Avail
lvc_avail = {
    "slug": "la-vista-city",
    "developer": "STM",
    "totalAvailable": 12,
    "breakdown": [
        {
            "type": "Lavista P1 CLASSIC (Townhouse)",
            "beds": 3,
            "minPriceM": 30.07,
            "maxPriceM": 34.03,
            "minAreaSqm": 228,
            "maxAreaSqm": 253,
            "deliveryNote": "RTM / Fully Finished",
            "paymentPlan": "10% DP / 8 Years",
            "units": [
                {"id": "lvc-p1-1", "slug": "la-vista-city", "type": "Townhouse 228m² (M)", "beds": 3, "areaSqm": 228, "priceEGP": 30070000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "10% DP / 8 Years", "deliveryNote": "RTM"},
                {"id": "lvc-p1-2", "slug": "la-vista-city", "type": "Townhouse 253m² (C)", "beds": 3, "areaSqm": 253, "priceEGP": 34030000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "10% DP / 8 Years", "deliveryNote": "RTM"}
            ]
        },
        {
            "type": "Lavista P1 CLASSIC (Twin House)",
            "beds": 3,
            "minPriceM": 36.86,
            "maxPriceM": 36.86,
            "minAreaSqm": 275,
            "maxAreaSqm": 275,
            "deliveryNote": "RTM / Fully Finished",
            "paymentPlan": "10% DP / 8 Years",
            "units": [
                {"id": "lvc-p1-3", "slug": "la-vista-city", "type": "Twin House 275m²", "beds": 3, "areaSqm": 275, "priceEGP": 36860000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "10% DP / 8 Years", "deliveryNote": "RTM"}
            ]
        },
        {
            "type": "Lavista P1 CLASSIC (Standalone Villa)",
            "beds": 4,
            "minPriceM": 44.84,
            "maxPriceM": 66.58,
            "minAreaSqm": 303,
            "maxAreaSqm": 450,
            "deliveryNote": "RTM / Fully Finished",
            "paymentPlan": "20% DP / 8 Years",
            "units": [
                {"id": "lvc-p1-4", "slug": "la-vista-city", "type": "Standalone 303m²", "beds": 4, "areaSqm": 303, "priceEGP": 44840000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "20% DP / 8 Years", "deliveryNote": "RTM"},
                {"id": "lvc-p1-5", "slug": "la-vista-city", "type": "Standalone 336m²", "beds": 4, "areaSqm": 336, "priceEGP": 0, "status": "Sold Out", "finishing": "Fully Finished", "paymentPlan": "20% DP / 8 Years", "deliveryNote": "RTM"},
                {"id": "lvc-p1-6", "slug": "la-vista-city", "type": "Standalone 424m²", "beds": 4, "areaSqm": 424, "priceEGP": 0, "status": "Sold Out", "finishing": "Fully Finished", "paymentPlan": "20% DP / 8 Years", "deliveryNote": "RTM"},
                {"id": "lvc-p1-7", "slug": "la-vista-city", "type": "Standalone 450m²", "beds": 5, "areaSqm": 450, "priceEGP": 66580000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "20% DP / 8 Years", "deliveryNote": "RTM"}
            ]
        },
        {
            "type": "Lavista P5 MODERN (Townhouse & Twin)",
            "beds": 3,
            "minPriceM": 30.99,
            "maxPriceM": 37.87,
            "minAreaSqm": 235,
            "maxAreaSqm": 283,
            "deliveryNote": "RTM / Fully Finished",
            "paymentPlan": "10% DP / 8 Years",
            "units": [
                {"id": "lvc-p5-1", "slug": "la-vista-city", "type": "Townhouse 235m² (M)", "beds": 3, "areaSqm": 235, "priceEGP": 30990000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "10% DP / 8 Years", "deliveryNote": "RTM"},
                {"id": "lvc-p5-2", "slug": "la-vista-city", "type": "Townhouse 265m² (C)", "beds": 3, "areaSqm": 265, "priceEGP": 35640000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "10% DP / 8 Years", "deliveryNote": "RTM"},
                {"id": "lvc-p5-3", "slug": "la-vista-city", "type": "Twin House 283m²", "beds": 3, "areaSqm": 283, "priceEGP": 37870000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "10% DP / 8 Years", "deliveryNote": "RTM"}
            ]
        },
        {
            "type": "Lavista P5 MODERN (Standalone Villa)",
            "beds": 4,
            "minPriceM": 46.17,
            "maxPriceM": 70.28,
            "minAreaSqm": 312,
            "maxAreaSqm": 450,
            "deliveryNote": "RTM / Fully Finished",
            "paymentPlan": "20% DP / 8 Years",
            "units": [
                {"id": "lvc-p5-4", "slug": "la-vista-city", "type": "Standalone 312m²", "beds": 4, "areaSqm": 312, "priceEGP": 46170000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "20% DP / 8 Years", "deliveryNote": "RTM"},
                {"id": "lvc-p5-5", "slug": "la-vista-city", "type": "Standalone 347m²", "beds": 4, "areaSqm": 347, "priceEGP": 51350000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "20% DP / 8 Years", "deliveryNote": "RTM"},
                {"id": "lvc-p5-6", "slug": "la-vista-city", "type": "Standalone 432m²", "beds": 4, "areaSqm": 432, "priceEGP": 63920000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "20% DP / 8 Years", "deliveryNote": "RTM"},
                {"id": "lvc-p5-7", "slug": "la-vista-city", "type": "Standalone 450m²", "beds": 5, "areaSqm": 450, "priceEGP": 70280000, "status": "Available", "finishing": "Fully Finished", "paymentPlan": "20% DP / 8 Years", "deliveryNote": "RTM"}
            ]
        }
    ]
}

# Update Address East Avail
ae_avail = {
    "slug": "address-east",
    "developer": "Dorra Group",
    "totalAvailable": 9,
    "breakdown": [
        {
            "type": "Apartment + Garden",
            "beds": 2,
            "minPriceM": 7.9,
            "maxPriceM": 10.4,
            "minAreaSqm": 121,
            "maxAreaSqm": 160,
            "deliveryNote": "RTM / Cash only | Maintenance 7%",
            "paymentPlan": "Cash only",
            "units": [
                {"id": "ae-1", "slug": "address-east", "type": "2BD + Garden", "beds": 2, "areaSqm": 121, "priceEGP": 7900000, "status": "Available", "finishing": "Finished", "paymentPlan": "Cash only", "deliveryNote": "RTM"},
                {"id": "ae-2", "slug": "address-east", "type": "3BD + Garden", "beds": 3, "areaSqm": 140, "priceEGP": 9100000, "status": "Available", "finishing": "Finished", "paymentPlan": "Cash only", "deliveryNote": "RTM"},
                {"id": "ae-3", "slug": "address-east", "type": "3BD + Garden", "beds": 3, "areaSqm": 160, "priceEGP": 10400000, "status": "Available", "finishing": "Finished", "paymentPlan": "Cash only", "deliveryNote": "RTM"}
            ]
        },
        {
            "type": "Typical Apartment",
            "beds": 3,
            "minPriceM": 8.4,
            "maxPriceM": 10.3,
            "minAreaSqm": 140,
            "maxAreaSqm": 171,
            "deliveryNote": "RTM / Cash only | Maintenance 7%",
            "paymentPlan": "Cash only",
            "units": [
                {"id": "ae-4", "slug": "address-east", "type": "3BD Typical", "beds": 3, "areaSqm": 140, "priceEGP": 8400000, "status": "Available", "finishing": "Finished", "paymentPlan": "Cash only", "deliveryNote": "RTM"},
                {"id": "ae-5", "slug": "address-east", "type": "3BD Typical", "beds": 3, "areaSqm": 145, "priceEGP": 8700000, "status": "Available", "finishing": "Finished", "paymentPlan": "Cash only", "deliveryNote": "RTM"},
                {"id": "ae-6", "slug": "address-east", "type": "3BD Typical", "beds": 3, "areaSqm": 147, "priceEGP": 8800000, "status": "Available", "finishing": "Finished", "paymentPlan": "Cash only", "deliveryNote": "RTM"},
                {"id": "ae-7", "slug": "address-east", "type": "3BD Typical", "beds": 3, "areaSqm": 160, "priceEGP": 9600000, "status": "Available", "finishing": "Finished", "paymentPlan": "Cash only", "deliveryNote": "RTM"},
                {"id": "ae-8", "slug": "address-east", "type": "3BD Typical", "beds": 3, "areaSqm": 167, "priceEGP": 10000000, "status": "Available", "finishing": "Finished", "paymentPlan": "Cash only", "deliveryNote": "RTM"},
                {"id": "ae-9", "slug": "address-east", "type": "3BD Typical", "beds": 3, "areaSqm": 171, "priceEGP": 10300000, "status": "Available", "finishing": "Finished", "paymentPlan": "Cash only", "deliveryNote": "RTM"}
            ]
        }
    ]
}

# New Village West Avail
vw_avail = {
    "slug": "village-west",
    "developer": "Dorra Group",
    "totalAvailable": 52,
    "breakdown": [
        {
            "type": "Apartments 2028",
            "beds": 2,
            "minPriceM": 9.2,
            "maxPriceM": 25.9,
            "minAreaSqm": 89,
            "maxAreaSqm": 243,
            "deliveryNote": "2028 | Maintenance 7%",
            "paymentPlan": "DP 10% / 7-Years",
            "units": [
                {"id": "vw-28-1", "slug": "village-west", "type": "1BD", "beds": 1, "areaSqm": 89, "priceEGP": 9200000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-2", "slug": "village-west", "type": "2BD", "beds": 2, "areaSqm": 123, "priceEGP": 12800000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-3", "slug": "village-west", "type": "2BD", "beds": 2, "areaSqm": 130, "priceEGP": 13300000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-4", "slug": "village-west", "type": "3BD", "beds": 3, "areaSqm": 149, "priceEGP": 15900000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-5", "slug": "village-west", "type": "3BD", "beds": 3, "areaSqm": 159, "priceEGP": 16300000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-6", "slug": "village-west", "type": "3BD", "beds": 3, "areaSqm": 163, "priceEGP": 17100000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-7", "slug": "village-west", "type": "3BD", "beds": 3, "areaSqm": 164, "priceEGP": 17400000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-8", "slug": "village-west", "type": "3BD", "beds": 3, "areaSqm": 167, "priceEGP": 17500000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-9", "slug": "village-west", "type": "3BD + Nanny", "beds": 3, "areaSqm": 169, "priceEGP": 17300000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-10", "slug": "village-west", "type": "3BD + Nanny", "beds": 3, "areaSqm": 175, "priceEGP": 18200000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-11", "slug": "village-west", "type": "4BD", "beds": 4, "areaSqm": 203, "priceEGP": 20400000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-12", "slug": "village-west", "type": "1BD + Garden", "beds": 1, "areaSqm": 89, "priceEGP": 9600000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-13", "slug": "village-west", "type": "1BD + Garden", "beds": 1, "areaSqm": 95, "priceEGP": 9900000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-14", "slug": "village-west", "type": "2BD + Garden", "beds": 2, "areaSqm": 141, "priceEGP": 15500000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-15", "slug": "village-west", "type": "3BD + Garden", "beds": 3, "areaSqm": 154, "priceEGP": 16300000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-16", "slug": "village-west", "type": "3BD + Garden", "beds": 3, "areaSqm": 164, "priceEGP": 17400000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-17", "slug": "village-west", "type": "3BD + Garden", "beds": 3, "areaSqm": 167, "priceEGP": 17500000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-18", "slug": "village-west", "type": "3BD + Garden", "beds": 3, "areaSqm": 177, "priceEGP": 18200000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-19", "slug": "village-west", "type": "Duplex", "beds": 4, "areaSqm": 203, "priceEGP": 21300000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-20", "slug": "village-west", "type": "Penthouse", "beds": 3, "areaSqm": 190, "priceEGP": 20900000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-21", "slug": "village-west", "type": "Penthouse", "beds": 3, "areaSqm": 213, "priceEGP": 22300000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-22", "slug": "village-west", "type": "Penthouse", "beds": 4, "areaSqm": 231, "priceEGP": 24100000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"},
                {"id": "vw-28-23", "slug": "village-west", "type": "Penthouse", "beds": 4, "areaSqm": 243, "priceEGP": 25900000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 7-Years", "deliveryNote": "2028"}
            ]
        },
        {
            "type": "Apartments 2029",
            "beds": 2,
            "minPriceM": 7.0,
            "maxPriceM": 26.2,
            "minAreaSqm": 65,
            "maxAreaSqm": 243,
            "deliveryNote": "2029 | Maintenance 7%",
            "paymentPlan": "DP 10% / 8-Years",
            "units": [
                {"id": "vw-29-1", "slug": "village-west", "type": "1BD", "beds": 1, "areaSqm": 75, "priceEGP": 7900000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-2", "slug": "village-west", "type": "2BD", "beds": 2, "areaSqm": 123, "priceEGP": 12800000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-3", "slug": "village-west", "type": "2BD", "beds": 2, "areaSqm": 130, "priceEGP": 13100000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-4", "slug": "village-west", "type": "3BD", "beds": 3, "areaSqm": 149, "priceEGP": 15900000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-5", "slug": "village-west", "type": "3BD", "beds": 3, "areaSqm": 154, "priceEGP": 16100000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-6", "slug": "village-west", "type": "3BD", "beds": 3, "areaSqm": 159, "priceEGP": 16300000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-7", "slug": "village-west", "type": "3BD", "beds": 3, "areaSqm": 163, "priceEGP": 17100000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-8", "slug": "village-west", "type": "3BD", "beds": 3, "areaSqm": 164, "priceEGP": 17400000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-9", "slug": "village-west", "type": "3BD", "beds": 3, "areaSqm": 167, "priceEGP": 17500000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-10", "slug": "village-west", "type": "3BD + Nanny", "beds": 3, "areaSqm": 175, "priceEGP": 18200000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-11", "slug": "village-west", "type": "4BD", "beds": 4, "areaSqm": 203, "priceEGP": 20900000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-12", "slug": "village-west", "type": "1BD + Garden", "beds": 1, "areaSqm": 65, "priceEGP": 7000000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-13", "slug": "village-west", "type": "1BD + Garden", "beds": 1, "areaSqm": 95, "priceEGP": 9900000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-14", "slug": "village-west", "type": "2BD + Garden", "beds": 2, "areaSqm": 123, "priceEGP": 12900000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-15", "slug": "village-west", "type": "2BD + Garden", "beds": 2, "areaSqm": 141, "priceEGP": 15500000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-16", "slug": "village-west", "type": "3BD + Garden", "beds": 3, "areaSqm": 149, "priceEGP": 16100000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-17", "slug": "village-west", "type": "3BD + Garden", "beds": 3, "areaSqm": 164, "priceEGP": 17500000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-18", "slug": "village-west", "type": "3BD + Garden", "beds": 3, "areaSqm": 167, "priceEGP": 17500000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-19", "slug": "village-west", "type": "3BD + Garden", "beds": 3, "areaSqm": 190, "priceEGP": 19600000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-20", "slug": "village-west", "type": "Duplex", "beds": 4, "areaSqm": 203, "priceEGP": 20700000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-21", "slug": "village-west", "type": "Penthouse", "beds": 3, "areaSqm": 190, "priceEGP": 20400000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-22", "slug": "village-west", "type": "Penthouse", "beds": 3, "areaSqm": 213, "priceEGP": 22200000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-23", "slug": "village-west", "type": "Penthouse", "beds": 4, "areaSqm": 231, "priceEGP": 24100000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"},
                {"id": "vw-29-24", "slug": "village-west", "type": "Penthouse", "beds": 4, "areaSqm": 243, "priceEGP": 26200000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 10% / 8-Years", "deliveryNote": "2029"}
            ]
        },
        {
            "type": "Villas 2027",
            "beds": 3,
            "minPriceM": 22.0,
            "maxPriceM": 26.0,
            "minAreaSqm": 220,
            "maxAreaSqm": 220,
            "deliveryNote": "2027 | Maintenance 5%",
            "paymentPlan": "DP 20% / 3-Years",
            "units": [
                {"id": "vw-v27-1", "slug": "village-west", "type": "Townhouse M", "beds": 3, "areaSqm": 220, "priceEGP": 22000000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 20% / 3-Years; Maintenance 5%", "deliveryNote": "2027"},
                {"id": "vw-v27-2", "slug": "village-west", "type": "Townhouse C", "beds": 3, "areaSqm": 220, "priceEGP": 26000000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 20% / 3-Years; Maintenance 5%", "deliveryNote": "2027"}
            ]
        },
        {
            "type": "Villas 2028",
            "beds": 3,
            "minPriceM": 22.0,
            "maxPriceM": 28.0,
            "minAreaSqm": 220,
            "maxAreaSqm": 270,
            "deliveryNote": "2028 | Maintenance 5%",
            "paymentPlan": "DP 15% / 4-Years",
            "units": [
                {"id": "vw-v28-1", "slug": "village-west", "type": "Townhouse M", "beds": 3, "areaSqm": 220, "priceEGP": 22000000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 15% / 4-Years; Maintenance 5%", "deliveryNote": "2028"},
                {"id": "vw-v28-2", "slug": "village-west", "type": "Townhouse C", "beds": 3, "areaSqm": 220, "priceEGP": 26000000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 15% / 4-Years; Maintenance 5%", "deliveryNote": "2028"},
                {"id": "vw-v28-3", "slug": "village-west", "type": "Twinhouse", "beds": 3, "areaSqm": 270, "priceEGP": 28000000, "status": "Available", "finishing": "Finished", "paymentPlan": "DP 15% / 4-Years; Maintenance 5%", "deliveryNote": "2028"}
            ]
        }
    ]
}

# Merge or update in a_list
def set_avail(item):
    idx = next((i for i, a in enumerate(a_list) if a["slug"] == item["slug"]), -1)
    if idx >= 0:
        a_list[idx] = item
    else:
        a_list.append(item)

set_avail(lvc_avail)
set_avail(ae_avail)
set_avail(vw_avail)

new_a_ts = "// Auto-generated from data/availability/ — do not edit by hand.\nimport type { ProjectAvailability } from \"./availability\";\n\nexport const availability: ProjectAvailability[] = " + json.dumps(a_list, indent=2) + ";\n"

with open(availability_gen_path, "w", encoding="utf-8") as f:
    f.write(new_a_ts)
print("[OK] Updated availability.generated.ts")
print("=== FAST PYTHON UPDATE COMPLETE ===")
