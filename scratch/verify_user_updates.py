import json
import re

compounds_gen_path = r"D:\map12\src\data\compounds.generated.ts"
availability_gen_path = r"D:\map12\src\data\availability.generated.ts"

with open(compounds_gen_path, "r", encoding="utf-8") as f:
    c_content = f.read()

c_start = c_content.find("=") + 1
c_end = c_content.rfind(";")
compounds = json.loads(c_content[c_start:c_end].strip())
comp_map = {c["slug"]: c for c in compounds}

print("=== VERIFYING USER UPDATES IN DATABASE ===")

# 1. La Vista City
lvc = comp_map.get("la-vista-city")
print(f"1. La Vista City: developer='{lvc.get('developer')}', status='{lvc.get('status')}', priceFrom={lvc.get('priceFrom')}M EGP")

# 2. Bamboo Extension
be = comp_map.get("bamboo-extension")
print(f"2. Bamboo Extension: developer='{be.get('developer')}'")

# 3. Address East
ae = comp_map.get("address-east")
print(f"3. Address East: developer='{ae.get('developer')}', status='{ae.get('status')}'")

# 4. Village West
vw = comp_map.get("village-west")
print(f"4. Village West: developer='{vw.get('developer')}', status='{vw.get('status')}', priceFrom={vw.get('priceFrom')}M EGP")

with open(availability_gen_path, "r", encoding="utf-8") as f:
    a_content = f.read()

a_start = a_content.find("=") + 1
a_end = a_content.rfind(";")
a_list = json.loads(a_content[a_start:a_end].strip())
a_map = {a["slug"]: a for a in a_list}

lvc_a = a_map.get("la-vista-city")
ae_a = a_map.get("address-east")
vw_a = a_map.get("village-west")

print(f"\nAvailability Units Count:")
print(f"- La Vista City live breakdown: {len(lvc_a.get('breakdown', []))} groups, total units: {sum(len(b.get('units', [])) for b in lvc_a.get('breakdown', []))}")
print(f"- Address East live breakdown: {len(ae_a.get('breakdown', []))} groups, total units: {sum(len(b.get('units', [])) for b in ae_a.get('breakdown', []))}")
print(f"- Village West live breakdown: {len(vw_a.get('breakdown', []))} groups, total units: {sum(len(b.get('units', [])) for b in vw_a.get('breakdown', []))}")
