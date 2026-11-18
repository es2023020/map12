import os
import json
import re

with open('src/data/compounds.generated.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract all compounds with their developer, slug, and name
compounds = []
pattern = re.compile(r'\{\s*"slug":\s*"([^"]+)".*?"name":\s*"([^"]+)".*?"developer":\s*"([^"]+)".*?"developerSlug":\s*"([^"]+)"', re.DOTALL)
for m in pattern.finditer(text):
    compounds.append({
        'slug': m.group(1),
        'name': m.group(2),
        'developer': m.group(3),
        'developerSlug': m.group(4)
    })

proj_dir = 'data/availability/projects'
existing_dev_dirs = sorted([d for d in os.listdir(proj_dir) if os.path.isdir(os.path.join(proj_dir, d))])

# All developers in app
all_developers = {}
for c in compounds:
    dslug = c['developerSlug']
    if dslug not in all_developers:
        all_developers[dslug] = {'name': c['developer'], 'compounds': []}
    all_developers[dslug]['compounds'].append({'slug': c['slug'], 'name': c['name']})

# Also load existing dirs in projects
for ed in existing_dev_dirs:
    if ed not in all_developers:
        all_developers[ed] = {'name': ed.replace('-', ' ').title(), 'compounds': []}

# Match each user group name to developer and projects
user_groups = [
  'Akam Al raghi', 'cred', 'M squared', 'city edge', 'hydepark', 'ADH', 'biography', 'MNHD', 'Eagles', 'Imkan misr',
  'kleek', 'modon', 'azha', 'ora', 'nations of the sky', 'katameya', 'via', 'concrete', 'egygab', 'mv', 'captain',
  'khaled sabry', 'palmhills', 'tharaa glee', 'al marasem', 'dubai misr', 'naia', 'mip', 'gro developments',
  'al ahly sabbour', 'age', 'times', 'PRE group', 'horizon', 'sodic', 'tatweer', 'beta', 'sam development', 'DMP',
  'better home', 'RNA dev', 'ardic', 'babylon', 'arabella', 'jadeer', 'STM', 'salam properties', 'el nakheel',
  'atric', 'catalyst', 'wealth plus', 'amer group', 'jawad', 'k development', 'modon emirates', 'DIG', 'il cazar',
  'badreldin', 'ajna', 'winvestor', 'manaj', 'doja', 'dahab', 'marakez', 'waterway', 'the marq', 'lavista',
  'cornerstone', 'pyramids', 'al qamzi', 'hassan allam holding', 'hassan allam', 'dorra', 'arkan palm', 'amorada',
  'liberty', 'rock/elbatal', 'karma', 'aljazi', 'HDP', 'Morshedy group', 'arabia dev', 'el ezz', 'borouj misr',
  'qatari diar', 'golden view', 'ADC'
]

manual_overrides = {
    'akam al raghi': ('akam-alrajhi', 'Akam AlRajhi Developments', ['dose']),
    'cred': ('cred', 'CRED Developments', ['ever', 'castle-landmark']),
    'm squared': ('m-squared', 'M Squared Developments', ['el-masyaf', 'trio', '31-west', 'business-district', 'mist']),
    'city edge': ('city-edge-developments', 'City Edge Developments', ['almaqsad', 'etapa', 'north-edge', 'the-gate', 'mazarine', 'baroque']),
    'hydepark': ('hyde-park-developments', 'Hyde Park Developments', ['hyde-park', 'tawny', 'seashore']),
    'adh': ('arab-developers-holding', 'Arab Developers Holding', ['nyoum-october', 'nyoum-pyramids', 'nyoum-mostakbal', 'sia']),
    'biography': ('biography-developments', 'Biography Developments', []),
    'mnhd': ('madinet-masr', 'Madinet Masr (MNHD)', ['sarai', 'taj-city', 'the-butterfly', 'origami', 'sheya-residence', 'talala', 'club-views', 'elm-tree-park', 'esse-residence', 'rai-valleys']),
    'eagles': ('eagles-developments', 'Eagles Developments', []),
    'imkan misr': ('imkan-misr', 'Imkan Misr', ['alburouj']),
    'kleek': ('kleek-developments', 'Kleek Developments', []),
    'modon': ('modon-developments', 'Modon Developments', ['green-river-tower', 'central-iconic-tower']),
    'azha': ('madaar-developments', 'Madaar Developments (Azha)', ['azha', 'azha-north']),
    'ora': ('ora-developers', 'Ora Developers', ['zed-east', 'zed-west', 'silversands', 'solana']),
    'nations of the sky': ('sky-ad-developments', 'Sky AD Developments (Sky Abu Dhabi)', ['bluetree', 'capital-avenue']),
    'katameya': ('starlight-developments', 'Starlight Developments (Katameya)', ['katameya-coast', 'katameya-creeks', 'katameya-dunes', 'urbn-k']),
    'via': ('via-developments', 'Via Developments', []),
    'concrete': ('concrete-developments', 'Concrete Developments', []),
    'egygab': ('egygab-holding', 'Egygab Holding', ['the-median', 'the-islands', 'granda', 'granda-life']),
    'mv': ('mountain-view', 'Mountain View (DMG)', ['icity-new-cairo', 'icity-october', 'aliva', 'ras-el-hekma', 'plage', 'kingsway', 'chillout-park']),
    'captain': ('captain-developments', 'Captain Developments', []),
    'khaled sabry': ('khaled-sabry-holding', 'Khaled Sabry Holding', ['rosail', 'ronza-tower']),
    'palmhills': ('palm-hills-developments', 'Palm Hills Developments', ['badya', 'hacienda-bay', 'hacienda-white', 'hacienda-waters', 'palm-hills-october', 'palm-parks', 'bamboo', 'the-crown']),
    'tharaa glee': ('tharaa-developments', 'Tharaa Developments', []),
    'al marasem': ('al-marasem-developments', 'Al Marasem Developments', ['mar-ville', 'fifth-square', 'marabay']),
    'dubai misr': ('dubai-developments', 'Dubai Developments', ['lumia', 'capital-dubai-mall']),
    'naia': ('naia-developments', 'Naia Developments', ['naia-bay', 'naia-west']),
    'mip': ('misr-italia-properties', 'Misr Italia Properties', ['il-bosco', 'il-bosco-city', 'vinci', 'kai-sokhna', 'solare', 'radamist']),
    'gro developments': ('gro-developments', 'Gro Developments', []),
    'al ahly sabbour': ('al-ahly-sabbour', 'Al Ahly Sabbour Developments', ['gaia', 'keeva', 'the-mornings', 'youd', 'green-square', 'lavenir', 'al-east-mostakbal-city']),
    'age': ('age-developments', 'AGE Developments', []),
    'times': ('times-developments', 'Times Developments', ['aster', 't-hub']),
    'pre group': ('pre-developments', 'PRE Developments (Pioneers)', ['the-brooks', 'stone-residence', 'ivoire', 'jebal-el-sokhna']),
    'horizon': ('horizon-egypt-developments', 'Horizon Egypt Developments', ['saada']),
    'sodic': ('sodic', 'SODIC', ['villette', 'karmell', 'vye', 'allegria', 'eastown', 'june', 'caesar', 'sodic-east']),
    'tatweer': ('tatweer-misr', 'Tatweer Misr', ['il-monte-galala', 'fouka-bay', 'd-bay', 'salt', 'bloomfields', 'rivers']),
    'beta': ('beta-egypt', 'Beta Egypt', ['beta-greens']),
    'sam development': ('sam-developments', 'SAM Developments', []),
    'dmp': ('dmp-developments', 'DMP Developments', []),
    'better home': ('better-home', 'Better Home', ['midtown-sky', 'midtown-solo', 'midtown-villa', 'midtown-condo']),
    'rna dev': ('rna-developments', 'RNA Developments', ['triton-tower', 'elevado-tower']),
    'ardic': ('ardic', 'ARDIC Developments', ['zizinia-el-mostakbal']),
    'babylon': ('babylon-developments', 'Babylon Developments', []),
    'arabella': ('arabella-group', 'Arabella Group', ['arabella-plaza', 'the-dir']),
    'jadeer': ('jadeer-developments', 'Jadeer Developments', ['garnet', 'code']),
    'stm': ('stm-developments', 'STM Developments', []),
    'salam properties': ('salam-developments', 'Salam Properties', []),
    'el nakheel': ('el-nakheel-developments', 'El Nakheel Developments', []),
    'atric': ('atric-developments', 'Atric Developments', ['boho', 'boardwalk']),
    'catalyst': ('catalyst-developments', 'Catalyst Developments', []),
    'wealth plus': ('wealth-developments', 'Wealth Developments', ['jeval', 'ivory', 'wing']),
    'amer group': ('amer-group', 'Amer Group (Porto)', ['porto-said', 'porto-golf-marina', 'porto-matrouh']),
    'jawad': ('jawad-developments', 'Jawad Developments', []),
    'k development': ('k-developments', 'K Developments', []),
    'modon emirates': ('modon-properties', 'Modon Properties', []),
    'dig': ('dig-developments', 'DIG Developments', ['track-10', 'track-12', 'track-14']),
    'il cazar': ('il-cazar-developments', 'IL Cazar Developments', ['creek-town', 'the-crest', 'aijar', 'safia', 'villen']),
    'badreldin': ('badreldin-developments', 'Badr El Din Developments', ['al-karma', 'k-towers']),
    'ajna': ('ajna-developments', 'Ajna Developments', ['carnelia', 'eastville']),
    'winvestor': ('winvestor-developments', 'Winvestor Developments', []),
    'manaj': 'manaj-developments',
    'doja': ('doja-developments', 'Doja Developments', ['aurora', 'x-business-complex']),
    'dahab': ('dahab-developments', 'Dahab Developments', []),
    'marakez': ('marakez', 'Marakez (Fawaz Alhokair)', ['district-5', 'aeon', 'crescent-walk', 'ramla']),
    'waterway': ('the-waterway-developments', 'The Waterway Developments', ['the-waterway-new-cairo', 'the-view', 'waterway-north-coast', 'w-residences']),
    'the marq': ('the-marq-communities', 'The MarQ Communities', ['the-marq-gardens', 'the-water-marq', 'the-wonder-marq']),
    'lavista': ('la-vista-developments', 'La Vista Developments', ['la-vista-cascada', 'la-vista-ras-el-hekma', 'la-vista-bay', 'la-vista-city', 'el-patio']),
    'cornerstone': ('cornerstone-development', 'Cornerstone Development', ['the-curve']),
    'pyramids': ('pyramids-developments', 'Pyramids Developments', ['la-capitale', 'grand-square', 'pyramids-business-tower']),
    'al qamzi': ('al-qamzi-developments', 'Al Qamzi Developments', ['seazen', 'eastshire']),
    'hassan allam holding': ('hassan-allam-properties', 'Hassan Allam Properties (HAP)', ['swanlake-residences', 'swanlake-north-coast', 'hap-town', 'little-venice', 'the-phoenix', 'springs']),
    'hassan allam': ('hassan-allam-properties', 'Hassan Allam Properties (HAP)', ['swanlake-residences', 'swanlake-north-coast', 'hap-town', 'little-venice', 'the-phoenix']),
    'dorra': ('dorra-group', 'Dorra Group', ['the-address-east', 'village-west']),
    'arkan palm': ('arkan-palm', 'Arkan Palm', ['205-sheikh-zayed', 'arkan-plaza']),
    'amorada': ('amorada-developments', 'Amorada Developments', ['amorada-new-cairo']),
    'liberty': ('liberty-developments', 'Liberty Developments', []),
    'rock/elbatal': ('el-batal-developments', 'El Batal Developments (Rock)', ['rock-vera', 'rock-eden', 'rock-ville', 'rock-capital-1']),
    'karma': ('karma-developments', 'AlKarma Developments', ['alkarma-gates', 'alkarma-kay']),
    'aljazi': ('aljazi-egypt', 'AlJazi Egypt (Seldar Holding)', ['aljazi-gardens', 'aljazi-first', 'chess-field']),
    'hdp': ('hdp-housing-and-development-properties', 'HDP (Housing & Development Properties)', ['talda', 'sqm', 'le-rois', 'terrace']),
    'morshedy group': ('morshedy-group', 'El Morshedy Group', ['dejoya', 'skyline', 'degla-palms', 'katameya-gate', 'zahra']),
    'arabia dev': ('arabia-holding', 'Arabia Holding', ['sun-capital', 'galleria-moon-valley']),
    'el ezz': ('el-ezz-developments', 'El Ezz Developments', ['destino-tower']),
    'borouj misr': ('borouj-misr', 'Borouj Misr', ['sixty-iconic-tower', 'point-9']),
    'qatari diar': ('qatari-diar', 'Qatari Diar', ['citygate-new-cairo', 'st-regis']),
    'golden view': ('golden-view-developments', 'Golden View Developments', []),
    'adc': ('adc-developments', 'ADC Developments', [])
}

final_developer_matrix = []

for ug in user_groups:
    key = ug.strip().lower()
    entry = manual_overrides.get(key)
    if isinstance(entry, tuple):
        slug, name, known_projects = entry
    elif isinstance(entry, str):
        slug = entry
        name = slug.replace('-', ' ').title()
        known_projects = []
    else:
        slug = key.replace(' ', '-').replace('/', '-')
        name = ug.strip()
        known_projects = []

    # Check compounds associated in compounds.generated.ts
    existing_compounds_in_app = []
    for d_slug, d_data in all_developers.items():
        if d_slug == slug or slug in d_slug or d_slug in slug:
            for c in d_data['compounds']:
                if c['slug'] not in existing_compounds_in_app:
                    existing_compounds_in_app.append(c['slug'])

    all_projs = list(set(known_projects + existing_compounds_in_app))

    final_developer_matrix.append({
        'group_display_name': ug.strip(),
        'canonical_slug': slug,
        'developer_name': name,
        'has_folder_in_availability': os.path.exists(os.path.join(proj_dir, slug)),
        'projects': all_projs,
        'projects_count': len(all_projs)
    })

with open('config/developers-matrix.json', 'w', encoding='utf-8') as f:
    json.dump(final_developer_matrix, f, indent=2, ensure_ascii=False)

print(f"Generated complete matrix for all {len(final_developer_matrix)} developer groups!")
active_with_projects = sum(1 for d in final_developer_matrix if d['projects_count'] > 0)
print(f"Developers with active projects in app: {active_with_projects}/{len(final_developer_matrix)}")
