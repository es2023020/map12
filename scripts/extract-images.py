"""Copy project images from d:\\Real Estate into public/projects/<slug>/."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"d:\Real Estate")
OUT = ROOT / "public" / "projects"
MANIFEST = ROOT / "src" / "data" / "project-images.ts"

# (developer folder, project folder | None) -> compound slug
MAPPING: dict[tuple[str, str | None], str] = {
    ("ACUD", "Iconic tower district"): "iconic-tower-district",
    ("Ahly sabbour", "Amwaj"): "amwaj",
    ("Ahly sabbour", "AT east"): "at-east",
    ("Ahly sabbour", "Gaia"): "gaia",
    ("AKAM EL RAG7Y", "Dose"): "dose",
    ("Al borouj", "Bianchi Ilios"): "bianchi-ilios",
    ("Arabella", "Direction white"): "direction-white",
    ("El reedy gp", "Azzar"): "azzar-island",
    ("Emaar", "Belle vie"): "belle-vie",
    ("Emaar", "Belle vie new zayed"): "belle-vie-new-zayed",
    ("Emaar", "Cairo gate"): "cairo-gate",
    ("Emaar", "Marassi"): "marassi",
    ("Emaar", "Mivida"): "mivida",
    ("Emaar", "Soul"): "soul",
    ("Hyde park", "Hyde park new cairo"): "hyde-park-new-cairo",
    ("Madaar", "Azha"): "azha",
    ("Madinet misr", "Club view"): "club-views",
    ("Madinet misr", "ELM tree and Esse"): "elm-tree-park",
    ("Madinet misr", "Esse"): "esse-residence",
    ("Madinet misr", "Taj city"): "taj-city",
    ("Madinet misr", "Talala"): "talala",
    ("Madinet misr", "The butterfly"): "the-butterfly",
    ("Marakez", "Aeon"): "aeon",
    ("Marakez", "Cresent walk"): "crescent-walk",
    ("Marakez", "District 5"): "district-5",
    ("Marakez", "Ramla"): "ramla",
    ("Maven", "Cali coast"): "cali-coast-ras-el-hekma",
    ("Mercon", "Dayz"): "dayz",
    ("NGD", "Botancia"): "botanica",
    ("Orascom", "Byoum"): "byoum-lakeside",
    ("Orascom", "El gouna"): "el-gouna",
    ("Palm hills", "97 hills"): "97-hills",
    ("Palm hills", "Badya"): "badya",
    ("Palm hills", "Bomboo"): "bamboo-iii",
    ("Palm hills", "Cleo water residence"): "cleo-water-residence",
    ("Palm hills", "Hacienda bay"): "hacienda-bay",
    ("Palm hills", "Hacienda blue"): "hacienda-blue",
    ("Palm hills", "Hacienda heniesh"): "hacienda-heneish",
    ("Palm hills", "Hacienda red"): "hacienda-red",
    ("Palm hills", "Hacienda waters"): "hacienda-waters",
    ("Palm hills", "Hacienda west - Ras el hekma"): "hacienda-west",
    ("Palm hills", "Hacienda white"): "hacienda-white",
    ("Palm hills", "Hacienda ras el hekma"): "hacienda-ras-el-hekma",
    ("Qatari Diar", "Alam el roum"): "alam-al-roum",
    ("SODIC", "Allegria"): "allegria",
    ("SODIC", "Beverly hills"): "beverly-hills",
    ("SODIC", "Caeser"): "caesar-sodic",
    ("SODIC", "East town"): "eastown",
    ("SODIC", "June"): "june",
    ("SODIC", "June sheikh zayed"): "june-sheikh-zayed",
    ("SODIC", "Karmell"): "karmell",
    ("SODIC", "Karmell new zayed"): "karmell-new-zayed",
    ("SODIC", "Sodic east"): "sodic-east",
    ("SODIC", "Sodic west"): "sodic-west",
    ("SODIC", "Sky condos"): "sky-condos",
    ("SODIC", "Villette"): "villette",
    ("SODIC", "Westown"): "westown-residences",
    ("SUD", "Capital heights"): "capital-heights",
    ("TMG", "Rehab"): "al-rehab",
    ("TMG", "Madinaty"): "madinaty",
    ("Tatweer Misr", "Bloom fields"): "bloomfields",
    ("Tatweer Misr", "D- bay"): "d-bay",
    ("Tatweer Misr", "Fouka bay"): "fouka-bay",
    ("Tatweer Misr", "IL monte galala"): "il-monte-galala",
    ("Tatweer Misr", "Salt"): "salt",
    ("Wadi degla", "Blumar"): "blumar",
    ("Al futtaim", None): "cairo-festival-city",
    ("Almaza bay", None): "almaza-bay",
    ("Anakaji", None): "anakaji",
    ("Caesar bay by MTI", None): "caesar-bay",
    ("Diplo village", None): "diplo-village",
    ("Ghazal bay", None): "ghazala-bay",
    ("Helio park", None): "heliopark",
    ("M squared", None): "masaya",
    ("city edge", None): "downtown-new-alamein",
}

HYDE_SLUGS = {
    "hyde park west": "hyde-park-west",
    "seashore": "hyde-park-north-seashore",
}


def slug_for(dev: str, proj: str | None) -> str | None:
    key = (dev, proj)
    if key in MAPPING:
        return MAPPING[key]
    if dev == "Hyde park" and proj:
        lower = proj.lower()
        for prefix, slug in HYDE_SLUGS.items():
            if prefix in lower:
                return slug
    return None


def is_image(name: str) -> bool:
    return bool(re.match(r"^.+\.(jpg|jpeg|png|webp)$", name, re.I)) and "master" not in name.lower()


def discover_mappings() -> None:
    """Print unmapped folders to help extend MAPPING."""
    for dev_dir in sorted(SOURCE.iterdir()):
        if not dev_dir.is_dir():
            continue
        dev = dev_dir.name
        subs = [p for p in dev_dir.iterdir() if p.is_dir()]
        if subs:
            for sub in subs:
                if slug_for(dev, sub.name) is None:
                    imgs = list(sub.glob("*.*"))
                    if imgs:
                        print(f"UNMAPPED: ({dev!r}, {sub.name!r})")
        else:
            if slug_for(dev, None) is None:
                imgs = [p for p in dev_dir.iterdir() if is_image(p.name)]
                if imgs:
                    print(f"UNMAPPED ROOT: ({dev!r}, None)")


def copy_from_source() -> dict[str, int]:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    counts: dict[str, int] = {}

    for dev_dir in sorted(SOURCE.iterdir()):
        if not dev_dir.is_dir():
            continue
        dev = dev_dir.name
        subdirs = [p for p in dev_dir.iterdir() if p.is_dir()]

        if subdirs:
            for sub in subdirs:
                slug = slug_for(dev, sub.name)
                if not slug:
                    continue
                files = sorted(
                    [p for p in sub.iterdir() if is_image(p.name)],
                    key=lambda p: (
                        int(m.group(1)) if (m := re.match(r"^(\d+)", p.stem)) else 999,
                        p.name.lower(),
                    ),
                )
                if not files:
                    continue
                dest = OUT / slug
                dest.mkdir(parents=True, exist_ok=True)
                for i, src in enumerate(files, start=1):
                    shutil.copy2(src, dest / f"{i}.jpg")
                counts[slug] = len(files)
        else:
            slug = slug_for(dev, None)
            if not slug:
                continue
            files = sorted(
                [p for p in dev_dir.iterdir() if is_image(p.name)],
                key=lambda p: (
                    int(m.group(1)) if (m := re.match(r"^(\d+)", p.stem)) else 999,
                    p.name.lower(),
                ),
            )
            if not files:
                continue
            dest = OUT / slug
            dest.mkdir(parents=True, exist_ok=True)
            for i, src in enumerate(files, start=1):
                shutil.copy2(src, dest / f"{i}.jpg")
            counts[slug] = len(files)

    return counts


def regenerate_manifest(counts: dict[str, int]) -> None:
    lines = [
        "// Auto-generated by scripts/extract-images.py",
        "",
        "export const projectImages: Record<string, string[]> = {",
    ]
    for slug in sorted(counts):
        n = counts[slug]
        paths = ", ".join(f'"/projects/{slug}/{i}.jpg"' for i in range(1, n + 1))
        lines.append(f'  "{slug}": [{paths}],')
    lines.append("};")
    lines.append("")
    MANIFEST.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    counts = copy_from_source()
    print(f"Copied {len(counts)} project folders")
    for slug in sorted(counts):
        print(f"  {slug}: {counts[slug]} images")
    regenerate_manifest(counts)
    print(f"Wrote {MANIFEST}")
    print("\nUnmapped folders:")
    discover_mappings()


if __name__ == "__main__":
    main()
