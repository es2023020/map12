import sys
import json
import re
import pdfplumber

def clean_text(val):
    if val is None:
        return ""
    return str(val).strip()

def parse_price(val):
    if not val:
        return 0
    s = str(val).lower().replace(",", "").replace("egp", "").replace("le", "").strip()
    is_million = "m" in s or "مليون" in s
    s = re.sub(r"[^\d.]", "", s)
    try:
        f = float(s)
        if is_million or (0 < f < 1000):
            return int(f * 1000000)
        return int(f)
    except:
        return 0

def parse_area(val):
    if not val:
        return 0
    s = str(val).lower().replace("sqm", "").replace("m2", "").replace("m", "").strip()
    s = re.sub(r"[^\d.]", "", s)
    try:
        return float(s)
    except:
        return 0

def extract_units_from_pdf(pdf_path, default_slug="general"):
    units = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_idx, page in enumerate(pdf.pages):
            tables = page.extract_tables()
            for table in tables:
                if not table or len(table) < 2:
                    continue

                # Find header row
                header_idx = 0
                headers = [clean_text(c).lower() for c in table[0]]
                
                col_map = {}
                for idx, h in enumerate(headers):
                    if any(k in h for k in ["unit", "code", "كود", "id", "#"]):
                        col_map["unit_id"] = idx
                    elif any(k in h for k in ["type", "layout", "category", "نوع"]):
                        col_map["type"] = idx
                    elif any(k in h for k in ["price", "cost", "سعر", "egp"]):
                        col_map["price"] = idx
                    elif any(k in h for k in ["bua", "area", "sqm", "مساحة"]):
                        col_map["bua"] = idx
                    elif any(k in h for k in ["bed", "room", "غرف"]):
                        col_map["beds"] = idx
                    elif any(k in h for k in ["phase", "cluster", "مرحلة"]):
                        col_map["cluster"] = idx

                for row in table[1:]:
                    if not row:
                        continue
                    
                    raw_type = row[col_map["type"]] if "type" in col_map and col_map["type"] < len(row) else ""
                    raw_price = row[col_map["price"]] if "price" in col_map and col_map["price"] < len(row) else ""
                    raw_bua = row[col_map["bua"]] if "bua" in col_map and col_map["bua"] < len(row) else ""
                    raw_id = row[col_map["unit_id"]] if "unit_id" in col_map and col_map["unit_id"] < len(row) else ""
                    raw_cluster = row[col_map["cluster"]] if "cluster" in col_map and col_map["cluster"] < len(row) else ""

                    price = parse_price(raw_price)
                    bua = parse_area(raw_bua)

                    if price <= 0 and bua <= 0:
                        continue

                    units.append({
                        "id": clean_text(raw_id),
                        "projectSlug": default_slug,
                        "cluster": clean_text(raw_cluster),
                        "type": clean_text(raw_type) or "Apartment",
                        "beds": 3,
                        "finishing": "Core & Shell",
                        "areaSqm": bua,
                        "priceEGP": price,
                        "status": "Available",
                        "rawUnitId": clean_text(raw_id)
                    })

    return units

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No PDF file specified"}))
        sys.exit(1)

    pdf_path = sys.argv[1]
    slug = sys.argv[2] if len(sys.argv) > 2 else "general"

    try:
        extracted = extract_units_from_pdf(pdf_path, slug)
        print(json.dumps({"success": True, "units": extracted, "count": len(extracted)}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
