import json
import re
from pathlib import Path

ROOT = Path(r"d:\map12")
SRC_DATA = ROOT / "src" / "data"

# 1. Update project-images.ts
pi_file = SRC_DATA / "project-images.ts"
pi_content = pi_file.read_text(encoding="utf-8")

# Add palm-hills-jirian and mountain-view-1-1 if not present
if '"palm-hills-jirian"' not in pi_content:
    pi_content = pi_content.replace(
        "export const projectImages: Record<string, string[]> = {\n",
        'export const projectImages: Record<string, string[]> = {\n  "palm-hills-jirian": ["/projects/palm-hills-jirian/1.jpg"],\n'
    )

if '"mountain-view-1-1"' not in pi_content:
    pi_content = pi_content.replace(
        "export const projectImages: Record<string, string[]> = {\n",
        'export const projectImages: Record<string, string[]> = {\n  "mountain-view-1-1": ["/projects/1.1/1.jpg", "/projects/1.1/2.jpg", "/projects/1.1/3.jpg", "/projects/1.1/4.jpg"],\n'
    )

pi_file.write_text(pi_content, encoding="utf-8")
print("Updated project-images.ts")

# 2. Update project-locations.ts
pl_file = SRC_DATA / "project-locations.ts"
pl_content = pl_file.read_text(encoding="utf-8")

new_locs = ""
if '"palm-hills-jirian"' not in pl_content and 'palm-hills-jirian:' not in pl_content:
    new_locs += """  "palm-hills-jirian": {
    name: "Palm Hills Jirian",
    location: "New Zayed",
    destination: "new-zayed",
    maps: "https://maps.google.com/?q=30.0940,30.8700",
    lat: 30.0940,
    lng: 30.8700,
  },\n"""

if '"mountain-view-1-1"' not in pl_content and 'mountain-view-1-1:' not in pl_content:
    new_locs += """  "mountain-view-1-1": {
    name: "Mountain View 1.1",
    location: "New Cairo",
    destination: "new-cairo",
    maps: "https://maps.google.com/?q=30.0550,31.4920",
    lat: 30.055,
    lng: 31.492,
  },\n"""

if new_locs:
    pl_content = pl_content.replace(
        "export const projectLocations: Record<string, {\n",
        "export const projectLocations: Record<string, {\n" + new_locs
    )
    pl_file.write_text(pl_content, encoding="utf-8")
    print("Updated project-locations.ts")

# 3. Update compound-registry.ts
cr_file = SRC_DATA / "compound-registry.ts"
cr_content = cr_file.read_text(encoding="utf-8")

# Check/Add palm-hills-jirian in compound-registry.ts
ph_registry_block = """  "palm-hills-jirian": {
    destination: "new-zayed",
    lat: 30.0940,
    lng: 30.8700,
    developer: "Palm Hills Developments",
    city: "New Zayed, Giza Governorate, Egypt",
    priceFrom: 8,
    deliveryYear: 2028,
    status: "Off-Plan",
    blurb:
      "Palm Hills Jirian is an expansive mixed-use community in New Sheikh Zayed, West Cairo. Featuring apartments, townhouses, and villas centered around a signature crystal lagoon.",
    paymentPlan: "10% down · 10 years equal installments",
    areaSize: "280 feddan",
    unitSizes: "62–405 m²",
    types: ["Apartment", "Villa", "Townhouse"],
    amenities: [
      "Clubhouse",
      "Crystal Lagoon",
      "Swimming Pools",
      "Gym & Spa",
      "Kids Destination",
      "24/7 Security",
      "Cycling Track",
      "Restaurants Strip",
      "Smart Home",
      "Mosque",
      "Co-working",
    ],
    highlights: [
      "280 feddan masterplan",
      "Crystal Lagoon centrepiece",
      "465 available units",
      "Entry from EGP 7.9M",
    ],
  },\n"""

mv11_registry_block = """  "mountain-view-1-1": {
    destination: "new-cairo",
    lat: 30.055,
    lng: 31.492,
    developer: "Mountain View",
    city: "Al Nasr Road, Fifth Settlement, New Cairo, Cairo Governorate, Egypt",
    priceFrom: 14.5,
    deliveryYear: 2026,
    status: "Off-Plan",
    blurb:
      "Mountain View 1.1 is a boutique luxury residential compound in New Cairo developed by Mountain View (DMG) in collaboration with DMA Engineering Consultants. Spanning approximately 130 feddans directly overlooking the Royal Valley, it serves as an exclusive, updated extension to Mountain View 1.",
    paymentPlan:
      "10% down + 5% over 8 yrs (Apartments/iVillas) · 20% down + 5% over 7 yrs (Villas)",
    areaSize: "130 feddans",
    unitSizes: "140–670 m²",
    types: [
      "Millennial Apartment",
      "Townhouse",
      "iVilla Garden",
      "iVilla Roof",
      "Luxury Villa",
      "Crown Palace",
    ],
    amenities: [
      "Dual Clubhouses",
      "Commercial & Business Hub",
      "Multi-sport Courts",
      "Fitness Center & Spa",
      "Indoor & Outdoor Swimming Pools",
      "Artificial Lakes",
      "Cycling & Jogging Tracks",
      "Family BBQ Zones",
      "Kids Playgrounds",
      "24/7 Smart Electronic Gates",
      "CCTV Surveillance",
      "Underground Parking",
    ],
    highlights: [
      "Directly on Al Nasr Road, opposite Al Rehab Gate 1",
      "Overlooking Royal Valley across ~130 feddans",
      "Partitioned into Villas Phase (~60 Feddans) and Park Phase (~70 Feddans)",
      "Millennial Apartments, iVillas, Townhouses & Crown Palace Mansions",
      "Over 40,000 m² office space & 17,300 m² retail strip",
      "Ready-to-move / Delivery within 6 months options available",
    ],
    masterPlanUrl: "/Masterplans/1.1.jpg",
  },\n"""

if '"palm-hills-jirian"' in cr_content:
    # Replace existing brief entry with full block
    cr_content = re.sub(
        r'  "palm-hills-jirian": \{[^}]*\},',
        ph_registry_block.strip(),
        cr_content
    )
else:
    cr_content = cr_content.replace(
        "export const compoundRegistry: Record<string, Partial<Compound>> = {\n",
        "export const compoundRegistry: Record<string, Partial<Compound>> = {\n" + ph_registry_block
    )

if '"mountain-view-1-1"' not in cr_content:
    cr_content = cr_content.replace(
        "export const compoundRegistry: Record<string, Partial<Compound>> = {\n",
        "export const compoundRegistry: Record<string, Partial<Compound>> = {\n" + mv11_registry_block
    )

cr_file.write_text(cr_content, encoding="utf-8")
print("Updated compound-registry.ts")

# 4. Update compounds.ts
comp_file = SRC_DATA / "compounds.ts"
comp_content = comp_file.read_text(encoding="utf-8")

# Fix hero for palm-hills-jirian in static definition
comp_content = comp_content.replace(
    'slug: "palm-hills-jirian",\n    name: "Palm Hills Jirian",\n    destination: "new-zayed",\n    lat: 30.0940,\n    lng: 30.8700,\n    developer: "Palm Hills Developments",\n    developerSlug: "palm-hills-developments",\n    priceFrom: 8,\n    deliveryYear: 2028,\n    status: "Off-Plan",\n    beachfront: false,\n    types: ["Apartment", "Villa", "Town House"],\n    amenities:',
    'slug: "palm-hills-jirian",\n    name: "Palm Hills Jirian",\n    destination: "new-zayed",\n    lat: 30.0940,\n    lng: 30.8700,\n    developer: "Palm Hills Developments",\n    developerSlug: "palm-hills-developments",\n    priceFrom: 8,\n    deliveryYear: 2028,\n    status: "Off-Plan",\n    beachfront: false,\n    types: ["Apartment", "Villa", "Town House"],\n    hero: "/projects/palm-hills-jirian/1.jpg",\n    gallery: ["/projects/palm-hills-jirian/1.jpg"],\n    amenities:'
)

mv11_static_block = """  {
    slug: "mountain-view-1-1",
    name: "Mountain View 1.1",
    destination: "new-cairo",
    lat: 30.055,
    lng: 31.492,
    developer: "Mountain View",
    developerSlug: "mountain-view",
    priceFrom: 14.5,
    deliveryYear: 2026,
    status: "Off-Plan",
    beachfront: false,
    types: ["Millennial Apartment", "Townhouse", "iVilla Garden", "iVilla Roof", "Luxury Villa", "Crown Palace"],
    amenities: [
      "Dual Clubhouses",
      "Commercial & Business Hub",
      "Multi-sport Courts",
      "Fitness Center & Spa",
      "Indoor & Outdoor Swimming Pools",
      "Artificial Lakes",
      "Cycling & Jogging Tracks",
      "Family BBQ Zones",
      "Kids Playgrounds",
      "24/7 Smart Electronic Gates",
      "CCTV Surveillance",
      "Underground Parking",
    ],
    hero: "/projects/1.1/1.jpg",
    gallery: ["/projects/1.1/1.jpg", "/projects/1.1/2.jpg", "/projects/1.1/3.jpg", "/projects/1.1/4.jpg"],
    blurb:
      "Mountain View 1.1 is a boutique luxury residential compound in New Cairo developed by Mountain View (DMG) in collaboration with DMA Engineering Consultants. Spanning approximately 130 feddans directly overlooking the Royal Valley, it serves as an exclusive, updated extension to Mountain View 1.",
    paymentPlan: "10% down + 5% over 8 yrs (Apartments/iVillas) · 20% down + 5% over 7 yrs (Villas)",
    areaSize: "130 feddans",
    unitSizes: "140–670 m²",
    type: "Residential",
    highlights: [
      "Directly on Al Nasr Road, opposite Al Rehab Gate 1",
      "Overlooking Royal Valley across ~130 feddans",
      "Partitioned into Villas Phase (~60 Feddans) and Park Phase (~70 Feddans)",
      "Millennial Apartments, iVillas, Townhouses & Crown Palace Mansions",
      "Over 40,000 m² office space & 17,300 m² retail strip",
      "Ready-to-move / Delivery within 6 months options available",
    ],
    masterPlanUrl: "/Masterplans/1.1.jpg",
  },\n"""

if '"mountain-view-1-1"' not in comp_content and 'slug: "mountain-view-1-1"' not in comp_content:
    comp_content = comp_content.replace(
        "const baseStaticCompounds: Compound[] = [\n",
        "const baseStaticCompounds: Compound[] = [\n" + mv11_static_block
    )

comp_file.write_text(comp_content, encoding="utf-8")
print("Updated compounds.ts")

print("All updates applied!")
