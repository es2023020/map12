"""Generate src/data/project-locations.ts from Egypt locations PDF text."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXT = ROOT / "_pdf_locations.txt"
OUT = ROOT / "src/data/project-locations.ts"


def slugify(s: str) -> str:
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", s.lower()))


def loc_to_area(loc: str) -> str:
    l = loc.lower()
    if "sidi heneish" in l or "heneish" in l:
        return "sidi-heneish"
    if "ras el hekma" in l:
        return "ras-el-hekma"
    if "sidi abdel rahman" in l:
        return "sidi-abdelrahman"
    if "new alamein" in l:
        return "new-alamein"
    if "ghazala" in l:
        return "ghazala-bay"
    if "ain sokhna road" in l or "north coast (ain sokhna" in l:
        return "al-dabaa"
    if "north coast" in l or "matrouh" in l:
        if "dabaa" in l:
            return "al-dabaa"
        if "sidi abdel" in l:
            return "sidi-abdelrahman"
        return "north-coast-generic"
    if "mostakbal" in l:
        return "mostakbal-city"
    if "new administrative capital" in l or "new capital" in l:
        return "new-administrative-capital"
    if "new cairo" in l or "fifth settlement" in l:
        return "new-cairo"
    if "new zayed" in l:
        return "new-zayed"
    if "sheikh zayed" in l:
        return "sheikh-zayed"
    if "6th of october" in l or "october city" in l:
        return "6th-october"
    if "ain sokhna" in l:
        return "ain-sokhna"
    if "hurghada" in l or "gouna" in l:
        return "red-sea"
    if "south sinai" in l or "sharm" in l or "ras sudr" in l:
        return "south-sinai"
    if "fayoum" in l:
        return "fayoum"
    if "heliopolis" in l:
        return "heliopolis"
    if "alexandria" in l:
        return "alexandria"
    if "katameya" in l:
        return "new-cairo"
    return "new-cairo"


def parse_projects(text: str) -> list[dict]:
    text = re.sub(
        r"https://maps\.google\.com/\?q=([^\n]+)\n([A-Za-z])",
        r"https://maps.google.com/?q=\1\2",
        text,
    )
    blocks = re.split(r"\n\s*(\d+)\n", text)[3:]
    projects = []
    for i in range(0, len(blocks) - 1, 2):
        num = int(blocks[i])
        body = blocks[i + 1]
        lines = [l.strip() for l in body.strip().split("\n") if l.strip()]
        if len(lines) < 2:
            continue
        name, loc = lines[0], lines[1]
        maps = ""
        for line in lines[2:]:
            if "maps.google.com" in line or line.startswith("http"):
                maps += line
        projects.append({"num": num, "name": name, "location": loc, "maps": maps})
    return projects


SLUG_AREA: dict[str, str] = {
    "alam-al-roum": "sidi-heneish",
    "jamila": "sidi-heneish",
    "almaza-bay": "sidi-heneish",
    "hacienda-heneish": "sidi-heneish",
    "silversands": "sidi-heneish",
    "sky-north": "sidi-heneish",
    "summer": "sidi-heneish",
    "beit-al-bahr": "sidi-heneish",
    "marsa-baghush": "sidi-heneish",
    "hacienda-red": "ain-sokhna",
    "hacienda-waters": "ain-sokhna",
    "azha": "ras-el-hekma",
    "marassi": "sidi-abdelrahman",
    "hacienda-bay": "sidi-abdelrahman",
    "il-bosco-city": "mostakbal-city",
    "crescent-walk": "new-administrative-capital",
    "at-east": "new-administrative-capital",
    "district-5": "mostakbal-city",
    "belle-vie": "6th-october",
    "karmell": "new-administrative-capital",
    "koun": "ras-el-hekma",
    "hyde-park-north-seashore": "ras-el-hekma",
}


def main() -> None:
    text = TEXT.read_text(encoding="utf-8")
    projects = parse_projects(text)
    out: dict[str, dict] = {}
    for p in projects:
        slug = slugify(p["name"])
        area = loc_to_area(p["location"])
        if slug == "azha":
            area = "ras-el-hekma"
            p["location"] = "Ras El Hekma, North Coast, Matrouh Governorate, Egypt"
        if area == "north-coast-generic":
            area = "ras-el-hekma"
        if slug == "beit-al-bahr":
            area = "sidi-heneish"
            p["location"] = "Sidi Heneish, North Coast (km 241), Matrouh Governorate, Egypt"
            p["maps"] = "https://maps.google.com/?q=Beit+Al+Bahr+Sidi+Heneish+North+Coast+Egypt"
        if slug == "koun":
            area = "ras-el-hekma"
            p["location"] = "Ras El Hekma, North Coast (km 201), Matrouh Governorate, Egypt"
            p["maps"] = "https://maps.google.com/?q=Koun+Ras+El+Hekma+North+Coast+Egypt"
        if slug == "hyde-park-north":
            slug = "hyde-park-north-seashore"
            p["name"] = "Hyde Park North - Seashore"
            area = "ras-el-hekma"
            p["location"] = "Ras El Hekma, North Coast, Matrouh Governorate, Egypt"
        if slug in SLUG_AREA:
            area = SLUG_AREA[slug]
        out[slug] = {
            "name": p["name"],
            "area": area,
            "location": p["location"],
            "mapsUrl": p["maps"],
        }

    lines = [
        "// Source: Egypt_Real_Estate_Projects_Locations.pdf",
        "export type ProjectLocation = {",
        "  name: string;",
        "  area: string;",
        "  location: string;",
        "  mapsUrl: string;",
        "};",
        "",
        "export const projectLocations: Record<string, ProjectLocation> = {",
    ]
    for slug in sorted(out):
        v = out[slug]
        loc = v["location"].replace('"', "'")
        maps = v["mapsUrl"].replace('"', "'")
        lines.append(
            f'  "{slug}": {{ name: "{v["name"]}", area: "{v["area"]}", location: "{loc}", mapsUrl: "{maps}" }},'
        )
    lines.append("};")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(out)} locations to {OUT}")


if __name__ == "__main__":
    main()
