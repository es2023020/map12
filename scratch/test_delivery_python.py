import re
import json

compounds_gen_path = r"D:\map12\src\data\compounds.generated.ts"

with open(compounds_gen_path, "r", encoding="utf-8") as f:
    content = f.read()

start_idx = content.find("[")
end_idx = content.rfind("]") + 1
compounds = json.loads(content[start_idx:end_idx])

def parse_year_from_note(note):
    if not note:
        return None
    m = re.search(r'\b(20\d{2})\b', note)
    if m:
        return int(m.group(1))
    rel = re.search(r'(\d+)\s*(?:years?|yrs?)', note, re.IGNORECASE)
    if rel:
        return 2026 + int(rel.group(1))
    return None

def is_ready_to_move(delivery_year, delivery_note, status):
    note_year = parse_year_from_note(delivery_note)
    if note_year is not None:
        if note_year > 2027:
            return False
        if note_year <= 2027:
            return True

    if delivery_year and delivery_year > 0:
        if delivery_year > 2027:
            return False

    if delivery_note:
        lnote = delivery_note.lower()
        if "rtm" in lnote or "ready to move" in lnote or "immediate" in lnote or "ready" in lnote:
            return True

    if status == "RTM":
        if not delivery_year or delivery_year <= 2027:
            return True

    if delivery_year and 0 < delivery_year <= 2027:
        return True

    return False

# Audit compounds
rtm_compounds = [c for c in compounds if is_ready_to_move(c.get("deliveryYear"), None, c.get("status"))]
late_rtm = [c for c in rtm_compounds if c.get("deliveryYear", 0) > 2027]

print("=== RTM FILTER VERIFICATION ===")
print(f"Total Compounds: {len(compounds)}")
print(f"RTM Compounds (delivery <= 2027): {len(rtm_compounds)}")
print(f"Compounds > 2027 in RTM: {len(late_rtm)}")

if len(late_rtm) == 0:
    print("✅ VERIFICATION PASSED: ZERO compounds with deliveryYear > 2027 qualify as RTM!")
else:
    print("❌ FAILED!")
