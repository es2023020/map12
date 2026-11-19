const fs = require('fs');
const path = require('path');

const ALIASES_FILE = path.join(__dirname, '..', '..', 'config', 'project-aliases.json');
const aliases = JSON.parse(fs.readFileSync(ALIASES_FILE, 'utf8'));

aliases.compounds = aliases.compounds || {};
aliases.developers = aliases.developers || {};

const ARABIC_COMPOUNDS = {
  // Palm Hills
  "بادية": "badya",
  "باديه": "badya",
  "بالم هيلز": "palm-hills-october",
  "بالم باركس": "palm-parks",
  "هاسيندا": "hacienda-bay",
  "هاسيندا باي": "hacienda-bay",
  "هاسيندا وايت": "hacienda-white",
  "هاسيندا ويست": "hacienda-west",
  "هاسيندا ووترز": "hacienda-waters",
  "هاسيندا حنيش": "hacienda-heneish",
  "هاسيندا بلو": "hacienda-blue",
  "هاسيندا ريد": "hacienda-red",
  "ذا كراون": "the-crown",
  "بالم فالي": "palm-valley",

  // Ora
  "زد": "zed-east",
  "زد ايست": "zed-east",
  "زد التجمع": "zed-east",
  "زد الشيخ زايد": "zed-west",
  "زد زايد": "zed-west",
  "ابراج زد": "zed-towers",
  "سولانا": "solana",
  "سولانا ايست": "solana-east",
  "سيلفر ساندس": "silversands",
  "سيلفرتاون": "silvertown-lagoon-cabanas",

  // Mountain View
  "اي سيتي": "i-city-new-cairo",
  "ماونتن فيو اي سيتي": "i-city-new-cairo",
  "ماونتن فيو اكتوبر": "i-city-october",
  "ماونتن فيو التجمع": "i-city-new-cairo",
  "ماونتن فيو الساحل": "mountain-view-ras-el-hekma",
  "ماونتن فيو راس الحكمة": "mountain-view-ras-el-hekma",
  "ماونتن فيو هايد بارك": "mountain-view-hyde-park",
  "تشيل اوت بارك": "chillout-park",
  "ليف مي": "lvls-north-coast",
  "بلوم بارك": "plage",
  "بلاج": "plage",

  // Emaar Misr
  "مراسي": "marassi",
  "ميفيدا": "mivida",
  "اب تاون كايرو": "uptown-cairo",
  "كايرو جيت": "cairo-gate",
  "بيل في": "belle-vie",
  "سول": "soul",

  // Hyde Park
  "هايد بارك": "hyde-park-new-cairo",
  "هايد بارك التجمع": "hyde-park-new-cairo",
  "هايد بارك الساحل": "seashore",
  "سي شور": "seashore",
  "تاوني": "tawny",
  "جاردن ليكس": "garden-lakes",

  // SODIC
  "ايست تاون": "eastown",
  "فيليت": "villette",
  "سوديك ايست": "sodic-east",
  "سوديك ويست": "sodic-west",
  "الجريا": "allegria",
  "بيفرلي هيلز": "beverly-hills",
  "جون سوديك": "june-sodic",
  "اوغامي": "ogami",
  "كرمل": "karmell",
  "فاى": "veye",

  // Hassan Allam
  "سوان ليك": "swan-lake",
  "سوانليك": "swan-lake",
  "سوان ليك التجمع": "swanlake-residences-new-cairo",
  "سوان ليك الجونة": "swanlake-el-gouna",
  "سوان ليك الساحل": "swanlake-north-coast",
  "سوان ليك ويست": "swanlake-west",
  "هاب تاون": "haptown",
  "ذا فاليز": "the-valleys-mostakbal-city",
  "بارك سنترال": "park-central-mostakbal-city",

  // Tatweer Misr
  "المونت جلالة": "il-monte-galala",
  "مونت جلالة": "il-monte-galala",
  "فوكا باي": "fouka-bay",
  "دي باي": "d-bay",
  "سولت": "salt",
  "بلوم فيلدز": "bloomfields",
  "ريفرز": "rivers",

  // City Edge
  "المقصد": "almaqsad",
  "جاردن سيتي": "new-garden-city-r5",
  "نيو جاردن سيتي": "new-garden-city-r5",
  "ابراج العلمين": "north-edge-towers",
  "ذا جيت": "the-gate-new-alamein",
  "مزارين": "mazarine",
  "داون تاون العلمين": "downtown-new-alamein",
  "ايتابا": "etapa",

  // Madinet Masr (MNHD)
  "تاج سيتي": "taj-city",
  "سراي": "sarai",
  "شيا": "sheya-residence",
  "اوريجامي": "origami",
  "راي فالي": "rai-valleys",
  "كلوب فيوز": "club-views",
  "ذا باترفلاي": "the-butterfly",

  // Al Ahly Sabbour
  "جايا": "gaia",
  "امواج": "amwaj",
  "كيفا": "keeva",
  "ذا سيتي اوف اوديسيا": "the-city-of-odyssia",
  "جرين سكوير": "green-square",
  "لافينير": "l-avenir",
  "اتيدا": "atida",
  "سامر": "summer",

  // La Vista
  "لا فيستا": "la-vista-city",
  "لافيستا": "la-vista-city",
  "لافيستا سيتي": "la-vista-city",
  "لا فيستا كاسكادا": "la-vista-cascada",
  "لا فيستا باي": "la-vista-bay",
  "لا فيستا راس الحكمة": "la-vista-ras-el-hekma",
  "الباتيو": "el-patio-oro",
  "الباتيو اورو": "el-patio-oro",
  "الباتيو 7": "el-patio-7",

  // M Squared
  "تريو": "trio",
  "تريو جاردنز": "trio",
  "ماسايا": "masaya",
  "المصيف": "el-masyaf",
  "31 ويست": "31-west",

  // Al Marasem
  "فيفث سكوير": "fifth-square",
  "مار باي": "mar-bay",
  "مارفيل": "marville",

  // Orascom
  "او ويست": "o-west",
  "مكادي هايتس": "makadi-heights",

  // Misr Italia
  "البوسكو": "il-bosco-new-capital",
  "البوسكو سيتي": "il-bosco-city",
  "فينشي": "vinci",
  "سولاري": "solare",
  "كايرو بيزنس بارك": "cairo-business-park",

  // Marakez
  "ديستريكت 5": "district-5",
  "ديستركت 5": "district-5",
  "ايون": "aeon",
  "رملة": "ramla",

  // Others
  "كالي كوست": "cali-coast",
  "ازها": "azha",
  "ازها الساحل": "azha-north",
  "ازها السخنة": "azha-sokhna",
  "كريك تاون": "creek-town",
  "ذا بروكس": "the-brooks",
  "الباتروس": "albatros",
  "قطامية ديونز": "katameya-dunes",
  "قطامية هايتس": "katameya-heights",
  "قطامية كوست": "katameya-coast",
  "الماظة باي": "almaza-bay"
};

const ARABIC_DEVELOPERS = {
  "بالم هيلز": "palm-hills-developments",
  "اورا": "ora-developers",
  "ماونتن فيو": "mountain-view",
  "اعمار": "emaar-misr",
  "اعمار مصر": "emaar-misr",
  "هايد بارك": "hyde-park-developments",
  "سوديك": "sodic",
  "حسن علام": "hassan-allam-properties",
  "تطوير مصر": "tatweer-misr",
  "سيتي ايدج": "city-edge-developments",
  "مدينة مصر": "madinet-masr",
  "الاهلي صبور": "al-ahly-sabbour",
  "صبور": "al-ahly-sabbour",
  "لا فيستا": "la-vista-developments",
  "لافيستا": "la-vista-developments",
  "ام سكويرد": "m-squared",
  "المراسم": "al-marasem-developments",
  "اوراسكوم": "orascom",
  "مصر ايطاليا": "misr-italia-properties",
  "مراكز": "marakez",
  "الكازار": "il-cazar-developments",
  "كازار": "il-cazar-developments",
  "بي ار اي": "pre-developments",
  "وادى دجلة": "wadi-degla-developments",
  "وادي دجلة": "wadi-degla-developments",
  "مصر للتطوير": "misr-italia-properties",
  "كليوباترا": "cleopatra-developments",
  "باراجون": "paragon-developments",
  "البطل": "el-batal-developments",
  "روك": "el-batal-developments",
  "اكاديا": "akadia-developments",
  "اركو": "arco",
  "بنيان": "bonyan-developments",
  "سنترادا": "centrada-developments"
};

let addedC = 0;
for (const [ar, slug] of Object.entries(ARABIC_COMPOUNDS)) {
  if (!aliases.compounds[ar]) {
    aliases.compounds[ar] = slug;
    addedC++;
  }
}

let addedD = 0;
for (const [ar, slug] of Object.entries(ARABIC_DEVELOPERS)) {
  if (!aliases.developers[ar]) {
    aliases.developers[ar] = slug;
    addedD++;
  }
}

fs.writeFileSync(ALIASES_FILE, JSON.stringify(aliases, null, 2), 'utf8');

console.log(`Added ${addedC} Arabic compound aliases (Total: ${Object.keys(aliases.compounds).length})`);
console.log(`Added ${addedD} Arabic developer aliases (Total: ${Object.keys(aliases.developers).length})`);
