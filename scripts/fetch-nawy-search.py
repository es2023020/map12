"""Fetch project images via Nawy search API/HTML for a given keyword."""
from __future__ import annotations

import json
import re
import ssl
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "projects"
MANIFEST = ROOT / "src" / "data" / "project-images.ts"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# slug -> nawy search keyword (must match compound name closely)
SEARCH: dict[str, str] = {
    "marassi": "Marassi North Coast",
    "mivida": "Mivida New Cairo",
    "jefaira": "Jefaira North Coast",
    "silversands": "Silversands North Coast",
    "madinaty": "Madinaty New Cairo",
    "villette": "Villette New Cairo",
    "il-bosco-city": "Il Bosco New Capital",
    "mountain-view-icity-new-cairo": "Mountain View iCity New Cairo",
    "telal-soul": "Telal Soul North Coast",
    "the-mornings": "The Mornings New Cairo",
    "ramla": "Ramla Ras El Hekma",
    "modon-ras-el-hekma": "Modon Ras El Hekma",
    "june": "June North Coast",
    "salt": "Salt North Coast",
    "swan-lake": "Swan Lake North Coast",
    "north-edge-towers": "North Edge Towers New Alamein",
    "il-monte-galala": "IL Monte Galala Ain Sokhna",
    "marbay": "Marbay Ain Sokhna",
    "jamila": "Jamila North Coast",
    "summer": "Summer North Coast",
    "soul": "Soul North Coast Emaar",
    "hacienda-ras-el-hekma": "Hacienda Ras El Hekma",
    "la-vista-ras-el-hekma": "La Vista Ras El Hekma",
    "la-vista-bay": "La Vista Bay",
    "la-vista-city": "La Vista City",
    "zed-east": "Zed East New Cairo",
    "origami": "Origami New Cairo",
    "makadi-heights": "Makadi Heights",
    "soma-bay": "Soma Bay",
    "sahl-hasheesh": "Sahl Hasheesh",
    "telal": "Telal North Coast",
    "marsa-baghush": "Marsa Baghush",
    "sky-north": "Sky North North Coast",
    "ogami": "Ogami Ras El Hekma",
    "naia-bay": "Naia Bay",
    "solare": "Solare North Coast",
    "lvls": "LVLS Ras El Hekma",
    "lyv": "Lyv Ras El Hekma",
    "koun": "Koun New Cairo",
    "stone-residence": "Stone Residence New Cairo",
    "lake-view-residence": "Lake View Residence",
    "cleo-mostakbal": "Cleo Mostakbal",
    "bloomfields": "Bloomfields Mostakbal",
    "district-5": "District 5 Mostakbal",
    "crescent-walk": "Crescent Walk New Capital",
    "at-east": "At East New Capital",
    "esse-residence": "Esse Residence New Capital",
    "city-oval": "City Oval New Capital",
    "karmell": "Karmell New Capital",
    "il-latini-city-edge": "Il Latini City Edge",
    "lagoons-al-alamein": "Lagoons New Alamein",
    "the-islands": "The Islands New Alamein",
    "mazarine": "Mazarine New Alamein",
    "palm-hills-new-alamein": "Palm Hills New Alamein",
    "q-bay": "Q Bay New Alamein",
    "marina": "Marina New Alamein",
    "stella-heights": "Stella Heights North Coast",
    "stella-sidi-abdel-rahman": "Stella Sidi Abdel Rahman",
    "stella-di-mare": "Stella di Mare Ain Sokhna",
    "seashell": "Seashell North Coast",
    "seashell-ras-el-hekma": "Seashell Ras El Hekma",
    "playa": "Playa Ras El Hekma",
    "the-med": "The Med Ras El Hekma",
    "katameya-coast": "Katameya Coast",
    "saada-sahel": "Saada Sahel",
    "seazen": "Seazen North Coast",
    "the-waterway": "The Waterway North Coast",
    "la-vista-bay-east": "La Vista Bay East",
    "la-vista-cascada": "La Vista Cascada",
    "lasirena-sahel": "Lasirena Sahel",
    "south-med": "South Med North Coast",
    "zahra": "Zahra New Alamein",
    "safia": "Safia North Coast",
    "shamasi": "Shamasi North Coast",
    "sheya-residence": "Sheya Residence",
    "taj-city": "Taj City New Cairo",
    "sarai": "Sarai New Cairo",
    "the-butterfly": "The Butterfly New Cairo",
    "club-views": "Club Views New Cairo",
    "elm-tree-park": "Elm Tree Park",
    "talala": "Talala New Cairo",
    "beit-al-bahr": "Beit Al Bahr Sidi Heneish North Coast",
    "el-masyaf": "El Masyaf Ain Sokhna",
    "murano": "Murano Ain Sokhna",
    "telal-sokhna": "Telal Sokhna",
    "mountain-view-ras-el-hekma": "Mountain View Ras El Hekma",
    "mountain-view-aliva": "Mountain View Aliva",
    "mountain-view-kingsway": "Mountain View Kingsway",
    "mountain-view-jirian": "Mountain View Jirian",
    "mountain-view-grand-valley": "Mountain View Grand Valley",
    "mountain-view-crystal": "Mountain View Crystal",
    "mountain-view-chillout": "Mountain View Chillout",
    "mountain-view-mv4": "Mountain View MV4",
    "palm-hills-katameya": "Palm Hills Katameya",
    "palm-hills-october": "Palm Hills October",
    "palm-hills-one": "Palm Hills One",
    "palm-hills-sheikh-zayed": "Palm Hills Sheikh Zayed",
    "sodic-east": "Sodic East",
    "sodic-west": "Sodic West",
    "westown-residences": "Westown Residences",
    "vye-sodic": "VYE SODIC",
    "solana": "Solana New Zayed",
    "zed-towers": "ZED Towers",
    "vinci": "Vinci Sheikh Zayed",
    "vinci-capital": "Vinci Capital",
    "june-sheikh-zayed": "June Sheikh Zayed",
    "karmell-new-zayed": "Karmell New Zayed",
    "origami-golf": "Origami Golf",
    "rai-valleys": "Rai Valleys",
    "the-gate-new-alamein": "The Gate New Alamein",
    "the-valleys": "The Valleys Hassan Allam",
    "youd": "Youd Ras El Hekma",
    "zoya": "Zoya North Coast",
    "il-latini-sed": "Il Latini SED",
    "la-verde": "La Verde Mostakbal",
}


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def download(url: str, dest: Path) -> bool:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=60, context=ctx) as resp:
        data = resp.read()
    if len(data) < 8000:
        return False
    dest.write_bytes(data)
    return True


def compound_images(keyword: str) -> list[str]:
    q = urllib.parse.quote(keyword)
    html = fetch(f"https://www.nawy.com/search?keyword={q}")
    # Prefer compound-specific inventory paths that include compound name slug fragment
    slug_hint = keyword.lower().split()[0]
    pattern = re.compile(r"https://prod-images\.nawy\.com/processed/[^\s\"'<>]+", re.I)
    all_urls = pattern.findall(html)
    filtered = [u for u in all_urls if slug_hint in u.lower() or "compound" in u.lower()]
    pool = filtered if filtered else all_urls
    seen: set[str] = set()
    out: list[str] = []
    for u in pool:
        u = u.split("?")[0]
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def regenerate_manifest() -> None:
    lines = [
        "// Auto-generated - Real Estate folder + Nawy search downloads.",
        "",
        "export const projectImages: Record<string, string[]> = {",
    ]
    for slug_dir in sorted(OUT.iterdir()):
        if not slug_dir.is_dir():
            continue
        imgs = sorted(
            slug_dir.glob("*.jpg"),
            key=lambda p: int(m.group(1)) if (m := re.match(r"(\d+)", p.stem)) else 999,
        )
        if not imgs:
            continue
        paths = ", ".join(f'"/projects/{slug_dir.name}/{p.name}"' for p in imgs)
        lines.append(f'  "{slug_dir.name}": [{paths}],')
    lines.append("};")
    lines.append("")
    MANIFEST.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ok = 0
    for slug, keyword in sorted(SEARCH.items()):
        dest_dir = OUT / slug
        existing = list(dest_dir.glob("*.jpg")) if dest_dir.exists() else []
        if len(existing) >= 3:
            continue
        try:
            imgs = compound_images(keyword)
        except Exception as e:
            print(f"FAIL {slug}: {e}")
            continue
        if not imgs:
            print(f"FAIL {slug}: no images")
            continue
        dest_dir.mkdir(parents=True, exist_ok=True)
        saved = len(existing)
        start = saved + 1
        for i, url in enumerate(imgs[:8 - saved], start=start):
            dest = dest_dir / f"{i}.jpg"
            if dest.exists():
                continue
            try:
                if download(url, dest):
                    saved += 1
            except Exception:
                pass
        if saved >= 3:
            print(f"OK {slug}: {saved} images")
            ok += 1
        else:
            print(f"WARN {slug}: only {saved} images")
        time.sleep(0.35)
    regenerate_manifest()
    print(f"Done: {ok} projects updated")


if __name__ == "__main__":
    main()
