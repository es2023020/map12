---
name: Nawy CDN image pattern
description: How to find and download real Egyptian compound images from nawy.com's CDN
---

# Nawy CDN Image Pattern

**Why:** Egyptian developer websites often block or redirect scrapers, but nawy.com serves real compound render images via a stable Cloudinary-backed CDN at `prod-images.nawy.com`.

**How to apply:**
1. Find the compound page: `https://www.nawy.com/compound/<ID>-<slug>`
2. `fetch()` the HTML (User-Agent: Mozilla/5.0)
3. Extract URLs matching `https://prod-images.nawy.com/processed/compound_image/image/<ID>/default.webp`
4. Hero image: `https://prod-images.nawy.com/processed/compound/cover_image/<ID>/high.webp`
5. Download with `fetch()` + `fs.writeFile()` into `public/projects/<slug>/<n>.jpg`
6. Add entry to `localImgs` map in `src/data/compounds.ts`

**Example compound IDs found:**
- Il Bosco New Capital: ID 181 (cover) + images 11681–11693
- Telal Soul: ID 1632, images 13776–13784
- The Valleys (Hassan Allam): images 9298–9307
