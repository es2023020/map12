import json
import os
import re

root_dir = r"D:\map12"

# ---------------------------------------------------------
# 1. Update src/data/compounds.generated.ts
# ---------------------------------------------------------
compounds_gen_path = os.path.join(root_dir, "src", "data", "compounds.generated.ts")
with open(compounds_gen_path, "r", encoding="utf-8") as f:
    content = f.read()

match = re.search(r"export const compoundsGenerated: Compound\[\] =\s*(\[[\s\S]*\]);?", content)
if match:
    json_str = match.group(1)
    compounds = json.loads(json_str)
    
    bloomfields_found = False
    scenes_found = False
    
    for c in compounds:
        if c.get("slug") == "bloomfields":
            bloomfields_found = True
            c["priceFrom"] = 5.8
            c["paymentPlan"] = "0%–5% down payment, remaining balance spread over 8 to 10 years in equal installments"
            c["highlights"] = [
                "1BR from 5.8M EGP, 2BR from 8.6M EGP, 3BR from 10.4M EGP, Duplex from 22.1M EGP",
                "415-feddan college town concept in Mostakbal City",
                "Sprawling green spaces & crystal lagoons",
                "Tatweer Misr signature masterplan"
            ]
        elif c.get("slug") == "scenes":
            scenes_found = True
            c["name"] = "Scenes"
            c["destination"] = "mostakbal-city"
            c["lat"] = 30.0425
            c["lng"] = 31.6480
            c["developer"] = "Tatweer Misr"
            c["developerSlug"] = "tatweer-misr"
            c["priceFrom"] = 14.6
            c["deliveryYear"] = 2030
            c["status"] = "Off-Plan"
            c["beachfront"] = False
            c["types"] = ["Townhouse", "Twin House", "Standalone Villa"]
            c["amenities"] = [
                "Clubhouse",
                "Green Corridors",
                "Artificial Lakes",
                "Botanical Stations",
                "Sports Facilities",
                "Commercial Retail Area",
                "24/7 Security",
                "Backup Generators"
            ]
            c["hero"] = "/projects/scenes/1.jpeg"
            c["gallery"] = [
                "/projects/scenes/1.jpeg",
                "/projects/scenes/2.jpg",
                "/projects/scenes/3.jpg",
                "/projects/scenes/4.jpg",
                "/projects/scenes/5.jpg"
            ]
            c["blurb"] = "Scenes by Tatweer Misr is a luxury, low-density, villas-only residential compound spanning 100 acres in Mostakbal City, East Cairo. 80% of the land is dedicated to green landscapes, water features, and open spaces."
            c["paymentPlan"] = "10 Years equal installments · 30% Cash Discount"
            c["areaSize"] = "100 feddan"
            c["unitSizes"] = "165–210 m²"
            c["type"] = "Residential"
            c["city"] = "Mostakbal City, East Cairo, Egypt"
            c["flagship"] = True
            c["isNewLaunch"] = True
            c["masterPlanUrl"] = "/Masterplans/scenes.jpg"
            c["highlights"] = [
                "Luxury low-density villas-only community (100 acres)",
                "80% green landscapes & water features, 20% footprint",
                "Townhouses from 14.6M, Standalones from 17.15M, Twin Houses from 17.8M",
                "10 years payment plan · 30% Cash Discount",
                "Delivered fully finished by Dec 2030",
                "Heart of Mostakbal City near Hub Town & Neom"
            ]

    if not scenes_found:
        scenes_obj = {
            "slug": "scenes",
            "name": "Scenes",
            "destination": "mostakbal-city",
            "lat": 30.0425,
            "lng": 31.6480,
            "developer": "Tatweer Misr",
            "developerSlug": "tatweer-misr",
            "priceFrom": 14.6,
            "deliveryYear": 2030,
            "status": "Off-Plan",
            "beachfront": False,
            "types": ["Townhouse", "Twin House", "Standalone Villa"],
            "amenities": [
                "Clubhouse",
                "Green Corridors",
                "Artificial Lakes",
                "Botanical Stations",
                "Sports Facilities",
                "Commercial Retail Area",
                "24/7 Security",
                "Backup Generators"
            ],
            "hero": "/projects/scenes/1.jpeg",
            "gallery": [
                "/projects/scenes/1.jpeg",
                "/projects/scenes/2.jpg",
                "/projects/scenes/3.jpg",
                "/projects/scenes/4.jpg",
                "/projects/scenes/5.jpg"
            ],
            "blurb": "Scenes by Tatweer Misr is a luxury, low-density, villas-only residential compound spanning 100 acres in Mostakbal City, East Cairo. 80% of the land is dedicated to green landscapes, water features, and open spaces.",
            "paymentPlan": "10 Years equal installments · 30% Cash Discount",
            "areaSize": "100 feddan",
            "unitSizes": "165–210 m²",
            "type": "Residential",
            "city": "Mostakbal City, East Cairo, Egypt",
            "flagship": True,
            "isNewLaunch": True,
            "masterPlanUrl": "/Masterplans/scenes.jpg",
            "highlights": [
                "Luxury low-density villas-only community (100 acres)",
                "80% green landscapes & water features, 20% footprint",
                "Townhouses from 14.6M, Standalones from 17.15M, Twin Houses from 17.8M",
                "10 years payment plan · 30% Cash Discount",
                "Delivered fully finished by Dec 2030",
                "Heart of Mostakbal City near Hub Town & Neom"
            ]
        }
        compounds.append(scenes_obj)

    new_content = "import { Compound } from \"./compounds\";\n\nexport const compoundsGenerated: Compound[] = " + json.dumps(compounds, indent=2, ensure_ascii=False) + ";\n"
    with open(compounds_gen_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Updated compounds.generated.ts")

# ---------------------------------------------------------
# 2. Update src/data/availability.generated.ts
# ---------------------------------------------------------
avail_gen_path = os.path.join(root_dir, "src", "data", "availability.generated.ts")
with open(avail_gen_path, "r", encoding="utf-8") as f:
    avail_content = f.read()

match_avail = re.search(r"export const availability: ProjectAvailability\[\] =\s*(\[[\s\S]*\]);?", avail_content)
if match_avail:
    json_str_avail = match_avail.group(1)
    avail_list = json.loads(json_str_avail)
    
    bloomfields_avail = {
        "slug": "bloomfields",
        "developer": "Tatweer Misr",
        "totalAvailable": 16,
        "breakdown": [
            {
                "type": "1 Bedroom Apartment",
                "beds": 1,
                "available": 4,
                "minSqm": 75,
                "maxSqm": 95,
                "minPriceM": 5.8,
                "maxPriceM": 7.2,
                "finishing": "Finished",
                "deliveryNote": "Off-Plan",
                "paymentPlan": "5% down · 8-10 years",
                "units": [
                    {
                        "id": "bf-1br-1",
                        "unitNo": "BF-101",
                        "beds": 1,
                        "finishing": "Finished",
                        "areaSqm": 75,
                        "view": "Landscape View",
                        "priceEGP": 5800000,
                        "status": "Available"
                    },
                    {
                        "id": "bf-1br-2",
                        "unitNo": "BF-102",
                        "beds": 1,
                        "finishing": "Finished",
                        "areaSqm": 85,
                        "view": "Park View",
                        "priceEGP": 6400000,
                        "status": "Available"
                    }
                ]
            },
            {
                "type": "2 Bedroom Apartment",
                "beds": 2,
                "available": 4,
                "minSqm": 110,
                "maxSqm": 135,
                "minPriceM": 8.6,
                "maxPriceM": 9.8,
                "finishing": "Finished",
                "deliveryNote": "Off-Plan",
                "paymentPlan": "5% down · 8-10 years",
                "units": [
                    {
                        "id": "bf-2br-1",
                        "unitNo": "BF-201",
                        "beds": 2,
                        "finishing": "Finished",
                        "areaSqm": 110,
                        "view": "Garden View",
                        "priceEGP": 8600000,
                        "status": "Available"
                    },
                    {
                        "id": "bf-2br-2",
                        "unitNo": "BF-202",
                        "beds": 2,
                        "finishing": "Finished",
                        "areaSqm": 125,
                        "view": "Lagoon View",
                        "priceEGP": 9200000,
                        "status": "Available"
                    }
                ]
            },
            {
                "type": "3 Bedroom Apartment",
                "beds": 3,
                "available": 4,
                "minSqm": 145,
                "maxSqm": 175,
                "minPriceM": 10.4,
                "maxPriceM": 13.5,
                "finishing": "Finished",
                "deliveryNote": "Off-Plan",
                "paymentPlan": "5% down · 8-10 years",
                "units": [
                    {
                        "id": "bf-3br-1",
                        "unitNo": "BF-301",
                        "beds": 3,
                        "finishing": "Finished",
                        "areaSqm": 145,
                        "view": "Central Park View",
                        "priceEGP": 10400000,
                        "status": "Available"
                    },
                    {
                        "id": "bf-3br-2",
                        "unitNo": "BF-302",
                        "beds": 3,
                        "finishing": "Finished",
                        "areaSqm": 165,
                        "view": "Lagoon & Landscape View",
                        "priceEGP": 12100000,
                        "status": "Available"
                    }
                ]
            },
            {
                "type": "Duplex",
                "beds": 3,
                "available": 4,
                "minSqm": 200,
                "maxSqm": 260,
                "minPriceM": 22.1,
                "maxPriceM": 26.5,
                "finishing": "Finished",
                "deliveryNote": "Off-Plan",
                "paymentPlan": "5% down · 8-10 years",
                "units": [
                    {
                        "id": "bf-dup-1",
                        "unitNo": "BF-D-101",
                        "beds": 3,
                        "finishing": "Finished",
                        "areaSqm": 200,
                        "view": "Main Boulevard & Lagoon",
                        "priceEGP": 22100000,
                        "status": "Available"
                    },
                    {
                        "id": "bf-dup-2",
                        "unitNo": "BF-D-102",
                        "beds": 4,
                        "finishing": "Finished",
                        "areaSqm": 240,
                        "view": "Panoramic View",
                        "priceEGP": 24800000,
                        "status": "Available"
                    }
                ]
            }
        ],
        "lastUpdated": "2026-08-16",
        "note": "Bloomfields Tatweer Misr: 1BR from 5.8M, 2BR from 8.6M, 3BR from 10.4M, Duplex from 22.1M"
    }

    scenes_avail = {
        "slug": "scenes",
        "developer": "Tatweer Misr",
        "totalAvailable": 12,
        "breakdown": [
            {
                "type": "Townhouse",
                "beds": 3,
                "available": 4,
                "minSqm": 165,
                "maxSqm": 185,
                "minPriceM": 14.6,
                "maxPriceM": 16.8,
                "finishing": "Finished",
                "deliveryNote": "Dec 2030",
                "paymentPlan": "10 Years · 30% Cash Discount",
                "units": [
                    {
                        "id": "scenes-th-1",
                        "unitNo": "TH-101",
                        "beds": 3,
                        "finishing": "Finished",
                        "areaSqm": 165,
                        "view": "Green Corridor & Water Feature",
                        "priceEGP": 14600000,
                        "status": "Available"
                    },
                    {
                        "id": "scenes-th-2",
                        "unitNo": "TH-102",
                        "beds": 3,
                        "finishing": "Finished",
                        "areaSqm": 175,
                        "view": "Landscape View",
                        "priceEGP": 15200000,
                        "status": "Available"
                    }
                ]
            },
            {
                "type": "Standalone Villa",
                "beds": 4,
                "available": 4,
                "minSqm": 190,
                "maxSqm": 210,
                "minPriceM": 17.15,
                "maxPriceM": 19.8,
                "finishing": "Finished",
                "deliveryNote": "Dec 2030",
                "paymentPlan": "10 Years · 30% Cash Discount",
                "units": [
                    {
                        "id": "scenes-sv-1",
                        "unitNo": "SV-201",
                        "beds": 4,
                        "finishing": "Finished",
                        "areaSqm": 190,
                        "view": "Botanical Station & Park View",
                        "priceEGP": 17150000,
                        "status": "Available"
                    },
                    {
                        "id": "scenes-sv-2",
                        "unitNo": "SV-202",
                        "beds": 4,
                        "finishing": "Finished",
                        "areaSqm": 205,
                        "view": "Private Garden View",
                        "priceEGP": 18500000,
                        "status": "Available"
                    }
                ]
            },
            {
                "type": "Twin House",
                "beds": 4,
                "available": 4,
                "minSqm": 180,
                "maxSqm": 200,
                "minPriceM": 17.8,
                "maxPriceM": 20.5,
                "finishing": "Finished",
                "deliveryNote": "Dec 2030",
                "paymentPlan": "10 Years · 30% Cash Discount",
                "units": [
                    {
                        "id": "scenes-tw-1",
                        "unitNo": "TW-301",
                        "beds": 4,
                        "finishing": "Finished",
                        "areaSqm": 180,
                        "view": "Lake View",
                        "priceEGP": 17800000,
                        "status": "Available"
                    },
                    {
                        "id": "scenes-tw-2",
                        "unitNo": "TW-302",
                        "beds": 4,
                        "finishing": "Finished",
                        "areaSqm": 195,
                        "view": "Central Park View",
                        "priceEGP": 18900000,
                        "status": "Available"
                    }
                ]
            }
        ],
        "lastUpdated": "2026-08-16",
        "note": "Scenes Tatweer Misr: Luxury villas compound in Mostakbal City. Townhouses from 14.6M, Standalones from 17.15M, Twin Houses from 17.8M. 10 yrs payment plan, 30% cash discount."
    }

    avail_list = [a for a in avail_list if a.get("slug") not in ("bloomfields", "scenes")]
    avail_list.append(bloomfields_avail)
    avail_list.append(scenes_avail)
    
    new_avail_content = "// Auto-generated from data/availability/ — do not edit by hand.\n// Run: npm run import-availability\nimport type { ProjectAvailability } from \"./availability\";\n\nexport const availability: ProjectAvailability[] = " + json.dumps(avail_list, indent=2, ensure_ascii=False) + ";\n"
    with open(avail_gen_path, "w", encoding="utf-8") as f:
        f.write(new_avail_content)
    print("Updated availability.generated.ts")
