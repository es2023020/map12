import json

with open('scratch/location_audit_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== SUMMARY OF PROJECTS MISSING LOCATION DATA ===\n')

missing_wm_list = [p for p in data if 'Missing exact map pin/polygon (Wikimapia)' in p['issues']]
missing_maps_url_list = [p for p in data if 'Missing Google Maps link' in p['issues']]
missing_highlights_list = [p for p in data if 'Missing location highlight in highlights' in p['issues']]
approx_coords_list = [p for p in data if 'Using approximate/destination default center coordinates' in p['issues']]

print(f'1. Projects without exact location highlights in highlights card/list: ({len(missing_highlights_list)})')
for p in missing_highlights_list:
    print(f"  • {p['name']} (Developer: {p['developer']}, Destination: {p['destination']})")

print(f'\n2. Projects using default/approximate destination-center coordinates: ({len(approx_coords_list)})')
for p in approx_coords_list:
    print(f"  • {p['name']} (Developer: {p['developer']}, Destination: {p['destination']}, Lat/Lng: {p['lat']}, {p['lng']})")

print(f'\n3. Projects missing Google Maps link in compound registry: ({len(missing_maps_url_list)})')
for p in missing_maps_url_list[:30]: # top 30 sample
    print(f"  • {p['name']} ({p['slug']})")
if len(missing_maps_url_list) > 30:
    print(f"  ... and {len(missing_maps_url_list) - 30} more")

print(f'\n4. Projects missing exact Wikimapia map pin/boundary: ({len(missing_wm_list)})')
for p in missing_wm_list[:30]: # top 30 sample
    print(f"  • {p['name']} ({p['slug']})")
if len(missing_wm_list) > 30:
    print(f"  ... and {len(missing_wm_list) - 30} more")
