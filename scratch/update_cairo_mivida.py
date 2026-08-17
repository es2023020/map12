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
    
    for c in compounds:
        if c.get("slug") == "cairo-gate":
            c["priceFrom"] = 13.3
            c["blurb"] = "Cairo Gate by Emaar Misr is a luxury 133-acre master community in Sheikh Zayed (Sold Out, starting from EGP 13.3M)."
            if "highlights" in c:
                c["highlights"] = ["Sold Out — Starting price EGP 13.3M"] + [h for h in c["highlights"] if "Sold Out" not in h]
        elif c.get("slug") == "mivida":
            c["priceFrom"] = 20
            c["blurb"] = "Mivida by Emaar Misr is a prime master-planned development in New Cairo (Sold Out, starting from EGP 20M)."
            if "highlights" in c:
                c["highlights"] = ["Sold Out — Starting price EGP 20M"] + [h for h in c["highlights"] if "Sold Out" not in h]

    new_content = "import { Compound } from \"./compounds\";\n\nexport const compoundsGenerated: Compound[] = " + json.dumps(compounds, indent=2, ensure_ascii=False) + ";\n"
    with open(compounds_gen_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Updated Cairo Gate & Mivida in compounds.generated.ts")

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
    
    cairo_gate_avail = {
        "slug": "cairo-gate",
        "developer": "Emaar Misr",
        "totalAvailable": 0,
        "breakdown": [],
        "lastUpdated": "2026-08-17",
        "note": "Sold Out. Starting price: EGP 13.3M."
    }

    mivida_avail = {
        "slug": "mivida",
        "developer": "Emaar Misr",
        "totalAvailable": 0,
        "breakdown": [],
        "lastUpdated": "2026-08-17",
        "note": "Sold Out. Starting price: EGP 20M."
    }

    avail_list = [a for a in avail_list if a.get("slug") not in ("cairo-gate", "mivida")]
    avail_list.append(cairo_gate_avail)
    avail_list.append(mivida_avail)
    
    new_avail_content = "// Auto-generated from data/availability/ — do not edit by hand.\n// Run: npm run import-availability\nimport type { ProjectAvailability } from \"./availability\";\n\nexport const availability: ProjectAvailability[] = " + json.dumps(avail_list, indent=2, ensure_ascii=False) + ";\n"
    with open(avail_gen_path, "w", encoding="utf-8") as f:
        f.write(new_avail_content)
    print("Updated Cairo Gate & Mivida in availability.generated.ts")
