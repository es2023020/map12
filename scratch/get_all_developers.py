import json
import re

compounds_gen_path = r"D:\map12\src\data\compounds.generated.ts"
devs_ts_path = r"D:\map12\src\data\developers.ts"

# Parse compounds.generated.ts
with open(compounds_gen_path, "r", encoding="utf-8") as f:
    comp_content = f.read()

dev_map = {} # canonical name -> count

matches = re.findall(r'"developer":\s*"([^"]+)"', comp_content)
for m in matches:
    name = m.strip()
    # Normalize slug vs display name
    if "-" in name and not name.isupper():
        # Might be slug
        clean_name = " ".join([w.capitalize() for w in name.split("-")])
    else:
        clean_name = name
    
    # Map common aliases
    aliases = {
        "Al Ahly Sabbour Developments": "Al Ahly Sabbour",
        "Al Marasem Development": "Al Marasem Developments",
        "City Edge Developments": "City Edge",
        "Hyde Park Developments": "Hyde Park",
        "Madaar Development": "Madaar",
        "Madaar Developments": "Madaar",
        "Marakez Developments": "Marakez",
        "Marakez Properties": "Marakez",
        "Memaar Al Morshedy": "Memaar El Morshedy",
        "M Squared Developments": "M Squared",
        "Misr Italia Properties": "Misr Italia",
        "Ora Developers": "ORA Developers",
        "People & Places": "People and Places",
        "Roya Developments": "Rooya Group",
        "Sky Abu Dhabi Developments": "SKY AD. Developments",
        "Tameer Developments": "Tameer",
        "Wadi Degla Developments": "Wadi Degla",
        "Travco Properties": "Travco",
    }
    
    final_name = aliases.get(clean_name, clean_name)
    dev_map[final_name] = dev_map.get(final_name, 0) + 1

# Also check developers.ts blurbs
with open(devs_ts_path, "r", encoding="utf-8") as f:
    dev_content = f.read()

blurb_matches = re.findall(r'^\s*"([^"]+)":', dev_content, re.MULTILINE)
for m in blurb_matches:
    if len(m) > 1 and not m.startswith("//") and not m.startswith("http") and "-" not in m:
        final_name = aliases.get(m.strip(), m.strip())
        if final_name not in dev_map:
            dev_map[final_name] = 0

sorted_devs = sorted(dev_map.keys())

print(f"Total Canonical Real Estate Developers: {len(sorted_devs)}")
for idx, d in enumerate(sorted_devs, 1):
    print(f"{idx}. {d}")
