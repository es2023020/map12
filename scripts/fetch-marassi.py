"""Fetch Marassi images from Nawy search / Emaar / known CDN."""
from __future__ import annotations

import re
import ssl
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "projects" / "marassi"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


def get(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def download(url: str, dest: Path) -> bool:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=60, context=ctx) as resp:
        data = resp.read()
    if len(data) < 5000:
        return False
    dest.write_bytes(data)
    return True


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    urls: list[str] = []

    # Nawy search page often embeds prod-images CDN links
    try:
        html = get("https://www.nawy.com/search?keyword=marassi")
        urls.extend(re.findall(r"https://prod-images\.nawy\.com/processed/[^\s\"'<>]+", html))
    except Exception as e:
        print("nawy search:", e)

    # Emaar Misr project page
    try:
        html = get("https://www.emaarmisr.com/en/projects/marassi/")
        urls.extend(re.findall(r"https?://[^\s\"'<>]+\.(?:jpg|jpeg|webp|png)", html, re.I))
    except Exception as e:
        print("emaar:", e)

    # Known Nawy Marassi cover (compound id varies; try common pattern)
    urls.extend(
        [
            "https://prod-images.nawy.com/processed/compound/cover_image/8/high.webp",
            "https://prod-images.nawy.com/processed/compound_image/image/11681/default.webp",
        ]
    )

    seen: set[str] = set()
    unique = []
    for u in urls:
        u = u.split("?")[0]
        if u not in seen:
            seen.add(u)
            unique.append(u)

    print(f"Found {len(unique)} candidate URLs")
    saved = 0
    for i, url in enumerate(unique[:8], start=1):
        dest = OUT / f"{i}.jpg"
        if dest.exists():
            saved += 1
            continue
        try:
            if download(url, dest):
                print(f"  saved {dest.name} from {url[:80]}")
                saved += 1
        except Exception as e:
            print(f"  fail {url[:60]}: {e}")

    print(f"Marassi: {saved} images in {OUT}")


if __name__ == "__main__":
    main()
