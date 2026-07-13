"""Download compound images from nawy.com CDN for projects missing local photos."""
from __future__ import annotations

import json
import re
import ssl
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "projects"
MANIFEST = ROOT / "src" / "data" / "project-images.ts"

# Nawy compound slug -> our slug (verified compound pages)
NAWY_SLUGS: dict[str, str] = {
    "marassi-north-coast": "marassi",
    "mivida-new-cairo": "mivida",
    "hacienda-bay-north-coast": "hacienda-bay",
    "silversands-north-coast": "silversands",
    "jefaira-north-coast": "jefaira",
    "soul-north-coast": "soul",
    "il-bosco-new-capital": "il-bosco-city",
    "villette-new-cairo": "villette",
    "madinaty-new-cairo": "madinaty",
    "mountain-view-icity-new-cairo": "mountain-view-icity-new-cairo",
    "hyde-park-new-cairo": "hyde-park-new-cairo",
    "ramla-ras-el-hekma": "ramla",
    "swan-lake-north-coast": "swan-lake",
    "june-north-coast": "june",
    "salt-north-coast": "salt",
    "telal-north-coast": "telal",
    "telal-soul-north-coast": "telal-soul",
    "la-vista-ras-el-hekma": "la-vista-ras-el-hekma",
    "la-vista-bay-north-coast": "la-vista-bay",
    "la-vista-city-mostakbal-city": "la-vista-city",
    "north-edge-towers-new-alamein": "north-edge-towers",
    "palm-hills-new-alamein": "palm-hills-new-alamein",
    "zed-east-new-cairo": "zed-east",
    "zed-towers-sheikh-zayed": "zed-towers",
    "solana-new-zayed": "solana",
    "origami-new-cairo": "origami",
    "origami-golf-new-cairo": "origami-golf",
    "makadi-heights-hurghada": "makadi-heights",
    "soma-bay-hurghada": "soma-bay",
    "sahl-hasheesh-hurghada": "sahl-hasheesh",
    "modon-ras-el-hekma": "modon-ras-el-hekma",
    "mountain-view-ras-el-hekma": "mountain-view-ras-el-hekma",
    "ogami-ras-el-hekma": "ogami",
    "summer-north-coast": "summer",
    "jamila-north-coast": "jamila",
    "beach-town-almaza-bay": "almaza-bay",
    "il-monte-galala-ain-sokhna": "il-monte-galala",
    "marbay-ain-sokhna": "marbay",
    "hacienda-red-ain-sokhna": "hacienda-red",
    "hacienda-waters-ain-sokhna": "hacienda-waters",
    "cleo-mostakbal-city": "cleo-mostakbal",
    "bloomfields-mostakbal-city": "bloomfields",
    "district-5-mostakbal-city": "district-5",
    "crescent-walk-new-capital": "crescent-walk",
    "at-east-new-capital": "at-east",
    "koun-new-cairo": "koun",
    "sheya-residence-new-cairo": "sheya-residence",
    "taj-city-new-cairo": "taj-city",
    "sarai-new-cairo": "sarai",
    "the-butterfly-new-cairo": "the-butterfly",
    "club-views-new-cairo": "club-views",
    "elm-tree-park-new-cairo": "elm-tree-park",
    "esse-residence-new-capital": "esse-residence",
    "vye-sodic-new-zayed": "vye-sodic",
    "sodic-west-sheikh-zayed": "sodic-west",
    "sodic-east-new-cairo": "sodic-east",
    "westown-residences-sheikh-zayed": "westown-residences",
    "palm-hills-katameya-new-cairo": "palm-hills-katameya",
    "palm-hills-october-6th-of-october": "palm-hills-october",
    "palm-hills-sheikh-zayed": "palm-hills-sheikh-zayed",
    "palm-hills-one-new-cairo": "palm-hills-one",
    "97-hills-new-cairo": "97-hills",
    "badya-6th-of-october": "badya",
    "bamboo-north-coast": "bamboo-iii",
    "hacienda-ras-el-hekma": "hacienda-ras-el-hekma",
    "hacienda-west-ras-el-hekma": "hacienda-west",
    "hacienda-white-north-coast": "hacienda-white",
    "hacienda-heneish-north-coast": "hacienda-heneish",
    "hacienda-blue-north-coast": "hacienda-blue",
    "fouka-bay-ras-el-hekma": "fouka-bay",
    "d-bay-ras-el-hekma": "d-bay",
    "azha-ras-el-hekma": "azha",
    "caesar-bay-ras-el-hekma": "caesar-bay",
    "caesar-sodic-ras-el-hekma": "caesar-sodic",
    "blumar-north-coast": "blumar",
    "seashell-north-coast": "seashell",
    "seashell-ras-el-hekma": "seashell-ras-el-hekma",
    "stella-heights-north-coast": "stella-heights",
    "stella-sidi-abdel-rahman-north-coast": "stella-sidi-abdel-rahman",
    "stella-di-mare-ain-sokhna": "stella-di-mare",
    "the-mornings-new-cairo": "the-mornings",
    "the-valleys-new-cairo": "the-valleys",
    "the-islands-new-alamein": "the-islands",
    "lagoons-new-alamein": "lagoons-al-alamein",
    "downtown-new-alamein": "downtown-new-alamein",
    "mazarine-new-alamein": "mazarine",
    "the-gate-new-alamein": "the-gate-new-alamein",
    "il-latini-city-edge-new-cairo": "il-latini-city-edge",
    "il-latini-sed-new-capital": "il-latini-sed",
    "capital-heights-new-capital": "capital-heights",
    "city-oval-new-capital": "city-oval",
    "iconic-tower-new-capital": "iconic-tower-district",
    "anakaji-new-capital": "anakaji",
    "stone-residence-new-cairo": "stone-residence",
    "lake-view-residence-new-cairo": "lake-view-residence",
    "la-verde-mostakbal-city": "la-verde",
    "mountain-view-aliva-mostakbal-city": "mountain-view-aliva",
    "mountain-view-kingsway-new-cairo": "mountain-view-kingsway",
    "mountain-view-jirian-6th-of-october": "mountain-view-jirian",
    "mountain-view-grand-valley-new-cairo": "mountain-view-grand-valley",
    "mountain-view-crystal-new-cairo": "mountain-view-crystal",
    "mountain-view-chillout-new-cairo": "mountain-view-chillout",
    "mountain-view-mv4-new-cairo": "mountain-view-mv4",
    "lvls-ras-el-hekma": "lvls",
    "lyv-ras-el-hekma": "lyv",
    "solare-ras-el-hekma": "solare",
    "youd-ras-el-hekma": "youd",
    "direction-white-ras-el-hekma": "direction-white",
    "alam-al-roum-north-coast": "alam-al-roum",
    "sky-north-north-coast": "sky-north",
    "marsa-baghush-north-coast": "marsa-baghush",
    "beit-al-bahr-ain-sokhna": "beit-al-bahr",
    "el-masyaf-ain-sokhna": "el-masyaf",
    "masaya-north-coast": "masaya",
    "cleo-water-residence-north-coast": "cleo-water-residence",
    "diplo-village-north-coast": "diplo-village",
    "ghazala-bay-north-coast": "ghazala-bay",
    "zoya-north-coast": "zoya",
    "playa-ras-el-hekma": "playa",
    "cali-coast-ras-el-hekma": "cali-coast-ras-el-hekma",
    "aeon-new-cairo": "aeon",
    "telal-sokhna-ain-sokhna": "telal-sokhna",
    "murano-ain-sokhna": "murano",
    "la-vista-cascada-ain-sokhna": "la-vista-cascada",
    "azzar-island-ain-sokhna": "azzar-island",
    "rai-valleys-new-cairo": "rai-valleys",
    "heliopark-new-heliopolis": "heliopark",
    "q-bay-new-alamein": "q-bay",
    "marina-new-alamein": "marina",
    "dayz-new-alamein": "dayz",
    "south-med-north-coast": "south-med",
    "lasirena-sahel-north-coast": "lasirena-sahel",
    "zahra-new-alamein": "zahra",
    "safia-north-coast": "safia",
    "shamasi-north-coast": "shamasi",
    "bianchi-ilios-north-coast": "bianchi-ilios",
    "naia-bay-ras-el-hekma": "naia-bay",
    "the-med-ras-el-hekma": "the-med",
    "katameya-coast-north-coast": "katameya-coast",
    "sa-ada-sahel-ras-el-hekma": "saada-sahel",
    "seazen-north-coast": "seazen",
    "the-waterway-north-coast": "the-waterway",
    "la-vista-bay-east-north-coast": "la-vista-bay-east",
    "vinci-sheikh-zayed": "vinci",
    "vinci-capital-new-zayed": "vinci-capital",
    "belle-vie-6th-of-october": "belle-vie",
    "belle-vie-new-zayed": "belle-vie-new-zayed",
    "cairo-gate-sheikh-zayed": "cairo-gate",
    "karmell-new-capital": "karmell",
    "karmell-new-zayed": "karmell-new-zayed",
    "june-sheikh-zayed": "june-sheikh-zayed",
    "june-north-coast-sodic": "june",
    "botanica-new-cairo": "botanica",
    "dose-new-cairo": "dose",
    "al-rehab-new-cairo": "al-rehab",
    "gaia-north-coast": "gaia",
    "amwaj-north-coast": "amwaj",
}

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
IMG_RE = re.compile(
    r"https://prod-images\.nawy\.com/processed/compound(?:_image/image/\d+/[^\"'\s]+|/cover_image/\d+/[^\"'\s]+)",
    re.I,
)


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def download(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        ctx = ssl.create_default_context()
        with urllib.request.urlopen(req, timeout=60, context=ctx) as resp:
            dest.write_bytes(resp.read())
        return dest.stat().st_size > 5000
    except Exception as e:
        print(f"  skip download {dest.name}: {e}")
        return False


def extract_images(html: str) -> list[str]:
    seen: set[str] = set()
    urls: list[str] = []
    for m in IMG_RE.finditer(html):
        u = m.group(0).split("?")[0]
        if u not in seen:
            seen.add(u)
            urls.append(u)
    return urls


def regenerate_manifest() -> None:
    lines = [
        "// Auto-generated - local assets + Nawy CDN downloads.",
        "",
        "export const projectImages: Record<string, string[]> = {",
    ]
    if not OUT.exists():
        return
    for slug_dir in sorted(OUT.iterdir()):
        if not slug_dir.is_dir():
            continue
        imgs = sorted(
            slug_dir.glob("*.jpg"),
            key=lambda p: int(re.match(r"(\d+)", p.stem).group(1)) if re.match(r"(\d+)", p.stem) else 999,
        )
        if not imgs:
            continue
        paths = ", ".join(f'"/projects/{slug_dir.name}/{p.name}"' for p in imgs)
        lines.append(f'  "{slug_dir.name}": [{paths}],')
    lines.append("};")
    lines.append("")
    MANIFEST.write_text("\n".join(lines), encoding="utf-8")
    print(f"Manifest: {len(lines) - 4} projects")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ok = 0
    for nawy_slug, our_slug in sorted(NAWY_SLUGS.items(), key=lambda x: x[1]):
        dest_dir = OUT / our_slug
        existing = list(dest_dir.glob("*.jpg")) if dest_dir.exists() else []
        if len(existing) >= 3:
            continue
        url = f"https://www.nawy.com/compound/{nawy_slug}"
        try:
            html = fetch(url)
        except urllib.error.HTTPError as e:
            print(f"FAIL {our_slug}: HTTP {e.code}")
            continue
        except Exception as e:
            print(f"FAIL {our_slug}: {e}")
            continue
        imgs = extract_images(html)
        if not imgs:
            print(f"FAIL {our_slug}: no images")
            continue
        dest_dir.mkdir(parents=True, exist_ok=True)
        saved = 0
        for i, img_url in enumerate(imgs[:8], start=1):
            ext = ".webp" if img_url.endswith(".webp") else ".jpg"
            dest = dest_dir / f"{i}.jpg"
            if dest.exists():
                saved += 1
                continue
            # Nawy serves webp - save with .jpg extension (browsers accept webp bytes)
            if download(img_url, dest):
                saved += 1
        print(f"OK {our_slug}: {saved} images")
        ok += 1
        time.sleep(0.4)
    regenerate_manifest()
    print(f"Fetched {ok} compounds")


if __name__ == "__main__":
    main()
