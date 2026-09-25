import json
import re
from pathlib import Path

ROOT = Path(r"d:\map12")
SRC_DATA = ROOT / "src" / "data"

# 1. Update compounds.generated.ts
comp_gen_file = SRC_DATA / "compounds.generated.ts"
content = comp_gen_file.read_text(encoding="utf-8")

m = re.search(r"export const compoundsGenerated: Compound\[\] = (\[.*\]);?\s*$", content, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    
    # Update scenes
    for c in data:
        if c.get("slug") == "scenes":
            c["developer"] = "Tatweer Misr"
            c["developerSlug"] = "tatweer-misr"
            print("Updated scenes in compounds.generated.ts")
            break
            
    # Check/Update palm-hills-jirian
    ph_jirian = None
    for c in data:
        if c.get("slug") == "palm-hills-jirian":
            ph_jirian = c
            break
            
    if ph_jirian:
        ph_jirian["developer"] = "Palm Hills Developments"
        ph_jirian["developerSlug"] = "palm-hills-developments"
        ph_jirian["hero"] = "/projects/palm-hills-jirian/1.jpg"
        ph_jirian["gallery"] = ["/projects/palm-hills-jirian/1.jpg"]
        ph_jirian["destination"] = "new-zayed"
        ph_jirian["city"] = "New Zayed, Giza Governorate, Egypt"
        ph_jirian["priceFrom"] = 8
        ph_jirian["areaSize"] = "280 feddan"
        ph_jirian["unitSizes"] = "62–405 m²"
        ph_jirian["status"] = "Off-Plan"
        ph_jirian["deliveryYear"] = 2028
        ph_jirian["paymentPlan"] = "10% down · 10 years equal installments"
        ph_jirian["types"] = ["Apartment", "Villa", "Townhouse"]
        ph_jirian["blurb"] = "Palm Hills Jirian is an expansive mixed-use community in New Sheikh Zayed, West Cairo. Featuring apartments, townhouses, and villas centered around a signature crystal lagoon."
        ph_jirian["amenities"] = [
            "Clubhouse", "Crystal Lagoon", "Swimming Pools", "Gym & Spa", 
            "Kids Destination", "24/7 Security", "Cycling Track", "Restaurants Strip", 
            "Smart Home", "Mosque", "Co-working"
        ]
        ph_jirian["highlights"] = [
            "280 feddan masterplan", "Crystal Lagoon centrepiece", "465 available units", "Entry from EGP 7.9M"
        ]
        ph_jirian["lat"] = 30.0940
        ph_jirian["lng"] = 30.8700
        print("Updated existing palm-hills-jirian in compounds.generated.ts")
    else:
        new_ph = {
            "slug": "palm-hills-jirian",
            "name": "Palm Hills Jirian",
            "developer": "Palm Hills Developments",
            "developerSlug": "palm-hills-developments",
            "destination": "new-zayed",
            "city": "New Zayed, Giza Governorate, Egypt",
            "priceFrom": 8,
            "areaSize": "280 feddan",
            "unitSizes": "62–405 m²",
            "status": "Off-Plan",
            "deliveryYear": 2028,
            "paymentPlan": "10% down · 10 years equal installments",
            "types": ["Apartment", "Villa", "Townhouse"],
            "blurb": "Palm Hills Jirian is an expansive mixed-use community in New Sheikh Zayed, West Cairo. Featuring apartments, townhouses, and villas centered around a signature crystal lagoon.",
            "amenities": [
                "Clubhouse", "Crystal Lagoon", "Swimming Pools", "Gym & Spa", 
                "Kids Destination", "24/7 Security", "Cycling Track", "Restaurants Strip", 
                "Smart Home", "Mosque", "Co-working"
            ],
            "highlights": [
                "280 feddan masterplan", "Crystal Lagoon centrepiece", "465 available units", "Entry from EGP 7.9M"
            ],
            "hero": "/projects/palm-hills-jirian/1.jpg",
            "gallery": ["/projects/palm-hills-jirian/1.jpg"],
            "lat": 30.0940,
            "lng": 30.8700
        }
        data.append(new_ph)
        print("Added new palm-hills-jirian to compounds.generated.ts")

    # Add mountain-view-1-1
    mv_11 = None
    for c in data:
        if c.get("slug") == "mountain-view-1-1":
            mv_11 = c
            break
            
    new_mv11_data = {
        "slug": "mountain-view-1-1",
        "name": "Mountain View 1.1",
        "developer": "Mountain View",
        "developerSlug": "mountain-view",
        "destination": "new-cairo",
        "city": "Al Nasr Road, Fifth Settlement, New Cairo, Cairo Governorate, Egypt",
        "priceFrom": 14.5,
        "areaSize": "130 feddans",
        "unitSizes": "140–670 m²",
        "status": "Off-Plan",
        "deliveryYear": 2026,
        "paymentPlan": "10% down + 5% over 8 yrs (Apartments/iVillas) · 20% down + 5% over 7 yrs (Villas)",
        "types": [
            "Millennial Apartment", "Townhouse", "iVilla Garden", 
            "iVilla Roof", "Luxury Villa", "Crown Palace"
        ],
        "blurb": "Mountain View 1.1 is a boutique luxury residential compound in New Cairo developed by Mountain View (DMG) in collaboration with DMA Engineering Consultants. Spanning approximately 130 feddans directly overlooking the Royal Valley, it serves as an exclusive, updated extension to Mountain View 1.",
        "amenities": [
            "Dual Clubhouses", "Commercial & Business Hub", "Multi-sport Courts", 
            "Fitness Center & Spa", "Indoor & Outdoor Swimming Pools", "Artificial Lakes", 
            "Cycling & Jogging Tracks", "Family BBQ Zones", "Kids Playgrounds", 
            "24/7 Smart Electronic Gates", "CCTV Surveillance", "Underground Parking"
        ],
        "highlights": [
            "Directly on Al Nasr Road, opposite Al Rehab Gate 1",
            "Overlooking Royal Valley across ~130 feddans",
            "Partitioned into Villas Phase (~60 Feddans) and Park Phase (~70 Feddans)",
            "Millennial Apartments, iVillas, Townhouses & Crown Palace Mansions",
            "Over 40,000 m² office space & 17,300 m² retail strip",
            "Ready-to-move / Delivery within 6 months options available"
        ],
        "hero": "/projects/1.1/1.jpg",
        "gallery": [
            "/projects/1.1/1.jpg",
            "/projects/1.1/2.jpg",
            "/projects/1.1/3.jpg",
            "/projects/1.1/4.jpg"
        ],
        "masterPlanUrl": "/Masterplans/1.1.jpg",
        "lat": 30.055,
        "lng": 31.492
    }
    
    if mv_11:
        mv_11.update(new_mv11_data)
        print("Updated existing mountain-view-1-1 in compounds.generated.ts")
    else:
        data.append(new_mv11_data)
        print("Added new mountain-view-1-1 to compounds.generated.ts")

    new_content = f"// Auto-generated from Command Center save action — do not edit by hand.\nimport type {{ Compound }} from \"./compounds\";\n\nexport const compoundsGenerated: Compound[] = {json.dumps(data, indent=2, ensure_ascii=False)};\n"
    comp_gen_file.write_text(new_content, encoding="utf-8")
    print("Saved compounds.generated.ts successfully.")

# 2. Update media-registry.json
media_reg_file = SRC_DATA / "media-registry.json"
if media_reg_file.exists():
    media_data = json.loads(media_reg_file.read_text(encoding="utf-8"))
    media_data["palm-hills-jirian"] = [{"path": "/projects/palm-hills-jirian/1.jpg"}]
    media_data["mountain-view-1-1"] = [
        {"path": "/projects/1.1/1.jpg"},
        {"path": "/projects/1.1/2.jpg"},
        {"path": "/projects/1.1/3.jpg"},
        {"path": "/projects/1.1/4.jpg"}
    ]
    media_reg_file.write_text(json.dumps(media_data, indent=2, ensure_ascii=False), encoding="utf-8")
    print("Updated media-registry.json successfully.")

print("Script finished!")
