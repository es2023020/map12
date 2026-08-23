import json
import os
import re

compounds_gen_path = r"D:\map12\src\data\compounds.generated.ts"
availability_gen_path = r"D:\map12\src\data\availability.generated.ts"

with open(compounds_gen_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract from '=' to ';'
start_idx = content.find("=") + 1
end_idx = content.rfind(";")
json_str = content[start_idx:end_idx].strip()
# Remove trailing commas before closing brackets or braces
json_str_clean = re.sub(r',\s*([\]}])', r'\1', json_str)

compounds = json.loads(json_str_clean)

print("=== AUDITING DATABASE STATUSES ===")
print(f"Total compounds in compounds.generated.ts: {len(compounds)}")

compounds_off_plan_but_2027_or_earlier = []
compounds_rtm_but_2028_or_later = []

for c in compounds:
    year = c.get("deliveryYear", 0)
    curr_status = c.get("status")
    
    if year > 0 and year <= 2027 and curr_status != "RTM":
        compounds_off_plan_but_2027_or_earlier.append((c["name"], c["slug"], year, curr_status))
    elif year > 2027 and curr_status == "RTM":
        compounds_rtm_but_2028_or_later.append((c["name"], c["slug"], year, curr_status))

print(f"1. Compounds with deliveryYear <= 2027 but status='{compounds_off_plan_but_2027_or_earlier[0][3] if compounds_off_plan_but_2027_or_earlier else 'Off-Plan'}': {len(compounds_off_plan_but_2027_or_earlier)}")
for name, slug, year, curr in compounds_off_plan_but_2027_or_earlier[:10]:
    print(f"   - {name} (`{slug}`): Year={year}, current status='{curr}' -> should be updated to 'RTM'")

print(f"\n2. Compounds with deliveryYear > 2027 but status='RTM': {len(compounds_rtm_but_2028_or_later)}")
for name, slug, year, curr in compounds_rtm_but_2028_or_later[:10]:
    print(f"   - {name} (`{slug}`): Year={year}, current status='{curr}' -> should be updated to 'Off-Plan'")

# Audit availability units in availability.generated.ts
with open(availability_gen_path, "r", encoding="utf-8") as f:
    avail_content = f.read()

a_start = avail_content.find("=") + 1
a_end = avail_content.rfind(";")
a_json = re.sub(r',\s*([\]}])', r'\1', avail_content[a_start:a_end].strip())

avail_data = json.loads(a_json)
print(f"\nTotal availability project records: {len(avail_data)}")
