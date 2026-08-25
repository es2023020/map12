import json
import re

compounds_gen_path = r"D:\map12\src\data\compounds.generated.ts"
availability_gen_path = r"D:\map12\src\data\availability.generated.ts"

with open(compounds_gen_path, "r", encoding="utf-8") as f:
    c_content = f.read()
c_start = c_content.find("=") + 1
c_end = c_content.rfind(";")
compounds = json.loads(c_content[c_start:c_end].strip())

with open(availability_gen_path, "r", encoding="utf-8") as f:
    a_content = f.read()
a_start = a_content.find("=") + 1
a_end = a_content.rfind(";")
avail_list = json.loads(a_content[a_start:a_end].strip())
avail_map = {a["slug"]: a for a in avail_list}

def parse_year(note):
    if not note:
        return None
    m = re.search(r'\b(20\d{2})\b', str(note))
    if m:
        return int(m.group(1))
    rel = re.search(r'(\d+)\s*(?:years?|yrs?)', str(note), re.I)
    if rel:
        return 2026 + int(rel.group(1))
    return None

def is_rtm(delivery_year, delivery_note, status):
    ny = parse_year(delivery_note)
    if ny is not None:
        return ny <= 2027
    if delivery_year and delivery_year > 0:
        return delivery_year <= 2027
    if delivery_note:
        ln = delivery_note.lower()
        if any(x in ln for x in ["rtm", "ready to move", "immediate", "ready"]):
            return True
    if status == "RTM":
        return True
    return False

print("=== VERIFYING RTM UNIT & PROJECT LOGIC ===")

mixed_projects = []
for c in compounds:
    slug = c["slug"]
    a = avail_map.get(slug)
    has_rtm = False
    has_offplan = False
    
    if a and "breakdown" in a:
        for b in a["breakdown"]:
            units = b.get("units", [])
            if units:
                for u in units:
                    note = u.get("deliveryNote") or u.get("delivery_note") or b.get("deliveryNote") or b.get("delivery_note")
                    if is_rtm(c.get("deliveryYear"), note, c.get("status")):
                        has_rtm = True
                    else:
                        has_offplan = True
            else:
                note = b.get("deliveryNote") or b.get("delivery_note")
                if is_rtm(c.get("deliveryYear"), note, c.get("status")):
                    has_rtm = True
                else:
                    has_offplan = True
    else:
        if is_rtm(c.get("deliveryYear"), None, c.get("status")):
            has_rtm = True
        else:
            has_offplan = True
            
    if has_rtm and has_offplan:
        mixed_projects.append((c["name"], c["slug"]))

print(f"Projects with BOTH RTM & Off-Plan units ({len(mixed_projects)} found):")
for name, slug in mixed_projects[:10]:
    print(f" - {name} (`{slug}`)")

print("\n=== VERIFICATION COMPLETE ===")
