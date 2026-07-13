import urllib.request
import urllib.parse
import re
import ssl
import os
import time

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

targets = {
    "o-west": "O West Orascom compound",
    "nmq": "NMQ Sheikh Zayed compound",
    "one33": "One33 Sheikh Zayed compound",
    "palm-hills-new-cairo": "Palm Hills New Cairo compound",
    "uptown-cairo": "Uptown Cairo Emaar compound",
    "v-levels": "V Levels Dunes Sheikh Zayed",
    "the-hillage": "The Hillage Madaar Sheikh Zayed",
    "riv-amwaj": "Rivette Amwaj Melee"
}

def search_bing_images(query):
    q = urllib.parse.quote(query)
    url = f"https://www.bing.com/images/search?q={q}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
        # Extract clean image URLs from murl attribute
        urls = re.findall(r'murl&quot;:&quot;(https?://[^&\"\'<>]+?\.(?:jpg|jpeg|png|webp))', html, re.I)
        # Filter out junk URLs or tiny logos
        filtered = []
        for u in urls:
            u_lower = u.lower()
            if any(j in u_lower for j in ["logo", "icon", "avatar", "profile", "marker", "arrow", "button", "sprite"]):
                continue
            filtered.append(u)
        return sorted(list(set(filtered)))
    except Exception as e:
        print(f"Error searching for {query}: {e}")
        return []

def download_image(url, dest_path):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
            data = resp.read()
        # Ensure it's not a tiny tracking pixel
        if len(data) > 15000:
            with open(dest_path, "wb") as f:
                f.write(data)
            return True
        return False
    except Exception as e:
        # print(f"  Failed download {url}: {e}")
        return False

def main():
    projects_dir = r"D:\map12\public\projects"
    os.makedirs(projects_dir, exist_ok=True)
    
    for slug, query in targets.items():
        print(f"\nProcessing {slug} (query: '{query}')...")
        dest_dir = os.path.join(projects_dir, slug)
        
        # Check if already has enough images
        existing = []
        if os.path.exists(dest_dir):
            existing = [f for f in os.listdir(dest_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
            
        if len(existing) >= 4:
            print(f"  Already has {len(existing)} images, skipping.")
            continue
            
        os.makedirs(dest_dir, exist_ok=True)
        image_urls = search_bing_images(query)
        print(f"  Found {len(image_urls)} potential URLs.")
        
        downloaded = len(existing)
        idx = downloaded + 1
        
        for url in image_urls:
            if downloaded >= 5:
                break
            dest_file = os.path.join(dest_dir, f"{idx}.jpg")
            print(f"  Downloading {url} ...")
            if download_image(url, dest_file):
                print(f"    Saved as {idx}.jpg")
                downloaded += 1
                idx += 1
                time.sleep(0.5)
            else:
                print("    Failed or file too small.")
                
        print(f"  Finished {slug} -> total {downloaded} images.")
        time.sleep(1.0)

if __name__ == "__main__":
    main()
