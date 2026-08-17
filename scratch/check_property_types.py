import json
import re
import os

root_dir = r"D:\map12"

compounds_gen_path = os.path.join(root_dir, "src", "data", "compounds.generated.ts")
avail_gen_path = os.path.join(root_dir, "src", "data", "availability.generated.ts")

comp_types = set()
with open(compounds_gen_path, "r", encoding="utf-8") as f:
    content = f.read()
match = re.search(r"export const compoundsGenerated: Compound\[\] =\s*(\[[\s\S]*\]);?", content)
if match:
    compounds = json.loads(match.group(1))
    for c in compounds:
        for t in c.get("types", []):
            comp_types.add(t)

avail_types = set()
with open(avail_gen_path, "r", encoding="utf-8") as f:
    content = f.read()
match = re.search(r"export const availability: ProjectAvailability\[\] =\s*(\[[\s\S]*\]);?", content)
if match:
    avail = json.loads(match.group(1))
    for a in avail:
        for b in a.get("breakdown", []):
            avail_types.add(b.get("type"))

print("Compound types in compounds.generated.ts:")
for t in sorted(comp_types):
    print(" -", t)

print("\nBreakdown types in availability.generated.ts:")
for t in sorted(avail_types):
    print(" -", t)
