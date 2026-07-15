import os
import sys
import json
import re
import shutil
from pathlib import Path

def safe_print(msg):
    try:
        print(msg)
    except UnicodeEncodeError:
        # Fallback to printing ASCII-only characters if the terminal encoding is limited
        try:
            print(msg.encode(sys.stdout.encoding, errors='replace').decode(sys.stdout.encoding))
        except Exception:
            print(msg.encode('ascii', errors='ignore').decode('ascii'))

# Setup paths
brochures_src = Path(r"D:\map12\data\Prochures")
brochures_dest = Path(r"D:\map12\public\brochures")
profiles_dir = Path(r"D:\map12\public\profiles")
projects_dir = Path(r"D:\map12\public\projects")
registry_out = Path(r"D:\map12\src\data\media-registry.json")

# Ensure target directories exist
brochures_src.mkdir(parents=True, exist_ok=True)
brochures_dest.mkdir(parents=True, exist_ok=True)
profiles_dir.mkdir(parents=True, exist_ok=True)
projects_dir.mkdir(parents=True, exist_ok=True)

registry = {
    "brochures": [],
    "profiles": [],
    "projects_media": {},
    "brochures_by_project": {}
}

# 1. Get all project slugs by looking at folders under public/projects
project_slugs = []
if projects_dir.exists():
    for d in projects_dir.iterdir():
        if d.is_dir():
            project_slugs.append(d.name)

# 2. Copy and register brochures
safe_print("Copying new brochures from data/Prochures...")
if brochures_src.exists():
    for f in brochures_src.iterdir():
        try:
            if f.is_file() and f.suffix.lower() == ".pdf":
                dest_file = brochures_dest / f.name
                try:
                    shutil.copy2(f, dest_file)
                    safe_print(f"Copied brochure: {f.name}")
                except Exception as e:
                    safe_print(f"Error copying {f.name}: {e}")
        except Exception as e:
            safe_print(f"Error reading source file: {e}")

safe_print("Scanning brochures in public/brochures...")
if brochures_dest.exists():
    for f in brochures_dest.iterdir():
        try:
            if f.is_file() and f.suffix.lower() == ".pdf":
                clean_name = re.sub(r'[\-_]', ' ', f.stem).strip().title()
                brochure_info = {
                    "filename": f.name,
                    "clean_name": clean_name,
                    "path": f"/brochures/{f.name}",
                    "size_mb": round(f.stat().st_size / (1024 * 1024), 2)
                }
                registry["brochures"].append(brochure_info)

                # Try to associate brochure to a project by matching filename
                matched = False
                for slug in project_slugs:
                    slug_words = slug.replace("-", " ")
                    pattern = r'\b' + re.escape(slug) + r'\b|\b' + re.escape(slug_words) + r'\b'
                    if re.search(pattern, f.name.lower()) or slug.lower() in f.name.lower().replace("-", ""):
                        if slug not in registry["brochures_by_project"]:
                            registry["brochures_by_project"][slug] = []
                        registry["brochures_by_project"][slug].append(brochure_info)
                        matched = True
                
                if not matched:
                    for slug in project_slugs:
                        if any(word in f.name.lower() for word in slug.split("-") if len(word) > 3):
                            if slug not in registry["brochures_by_project"]:
                                registry["brochures_by_project"][slug] = []
                            registry["brochures_by_project"][slug].append(brochure_info)
        except Exception as e:
            safe_print(f"Skipping brochure file due to error: {e}")

# 3. Register company profiles
safe_print("Scanning developer profiles in public/profiles...")
if profiles_dir.exists():
    for f in profiles_dir.iterdir():
        try:
            if f.is_file() and f.suffix.lower() == ".pdf":
                clean_name = re.sub(r'[\-_]', ' ', f.stem).strip().title()
                registry["profiles"].append({
                    "filename": f.name,
                    "clean_name": clean_name,
                    "path": f"/profiles/{f.name}",
                    "size_mb": round(f.stat().st_size / (1024 * 1024), 2)
                })
        except Exception as e:
            safe_print(f"Skipping profile file due to error: {e}")

# 4. Register project media
safe_print("Scanning project images and videos in public/projects...")
if projects_dir.exists():
    for folder in projects_dir.iterdir():
        try:
            if folder.is_dir():
                slug = folder.name
                media_files = []
                for f in folder.iterdir():
                    if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov", ".avi"):
                        media_files.append({
                            "filename": f.name,
                            "type": "video" if f.suffix.lower() in (".mp4", ".mov", ".avi") else "image",
                            "path": f"/projects/{slug}/{f.name}"
                        })
                if media_files:
                    registry["projects_media"][slug] = media_files
        except Exception as e:
            safe_print(f"Skipping project folder due to error: {e}")

# Write registry file
registry_out.parent.mkdir(parents=True, exist_ok=True)
with open(registry_out, "w", encoding="utf-8") as out:
    json.dump(registry, out, indent=2, ensure_ascii=False)

safe_print("\n--- Summary ---")
safe_print(f"Synced brochures: {len(registry['brochures'])}")
safe_print(f"Registered profiles: {len(registry['profiles'])}")
safe_print(f"Registered project folders: {len(registry['projects_media'])}")
safe_print("media-registry.json updated successfully!")
