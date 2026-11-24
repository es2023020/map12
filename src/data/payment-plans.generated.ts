// Auto-generated from Nawy public data (webapi.nawy.com) on 2026-11-25 — edit via scripts, not by hand.
// Nawy derives each plan from per-unit prices, so percentages are rounded (approximate: true).
import type { ProjectPaymentPlans } from "./payment-plans";

export const paymentPlansGenerated: Record<string, ProjectPaymentPlans> = {
  "31-west": {
    "nawyId": 1238,
    "nawyUrl": "https://www.nawy.com/compound/1238-31-west",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "31-west-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "97-hills": {
    "nawyId": 1841,
    "nawyUrl": "https://www.nawy.com/compound/1841-97-hills",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "97-hills-1",
        "label": "2.5% down · 3% after 3 months · 3% after 6 months · 10 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 3,
        "month6Pct": 3,
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "97-hills-2",
        "label": "20% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "97-hills-3",
        "label": "20% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "address-east": {
    "nawyId": 227,
    "nawyUrl": "https://www.nawy.com/compound/227-address-east",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "address-east-1",
        "label": "50% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "address-east-2",
        "label": "75% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ]
  },
  "al-rehab": {
    "nawyId": 645,
    "nawyUrl": "https://www.nawy.com/compound/645-el-rehab",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "al-rehab-1",
        "label": "5% down · 11 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 11,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "al-rehab-2",
        "label": "10% down · 11 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 11,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "al-rehab-3",
        "label": "45% down · 8 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "al-rehab-4",
        "label": "75% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "almaza-bay": {
    "nawyId": 541,
    "nawyUrl": "https://www.nawy.com/compound/541-almaza-bay",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "almaza-bay-1",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "almaza-bay-2",
        "label": "70% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "almaza-bay-3",
        "label": "75% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "almaza-bay-4",
        "label": "6% down · 7 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 6.0,
        "years": 7,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 35% down · 6 years equal installments"
  },
  "amwaj": {
    "nawyId": 73,
    "nawyUrl": "https://www.nawy.com/compound/73-amwaj",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "amwaj-1",
        "label": "15% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15.0,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "amwaj-2",
        "label": "80% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "amwaj-3",
        "label": "95% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 15% down · 4 years equal installments"
  },
  "aqua-lagoons-june": {
    "nawyId": 2360,
    "nawyUrl": "https://www.nawy.com/compound/2360-aqua-lagoons-june",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "aqua-lagoons-june-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 10 years equal installments"
  },
  "ashgar-city": {
    "nawyId": 653,
    "nawyUrl": "https://www.nawy.com/compound/653-ashgar-city",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "ashgar-city-1",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "ashgar-city-2",
        "label": "70% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "ashgar-city-3",
        "label": "70% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 35% down · 5 years equal installments"
  },
  "at-east": {
    "nawyId": 1155,
    "nawyUrl": "https://www.nawy.com/compound/1155-at-east",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "at-east-1",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "at-east-2",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "at-east-3",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "at-east-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      },
      {
        "id": "at-east-5",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "at-east-6",
        "label": "45% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      }
    ]
  },
  "azad": {
    "nawyId": 205,
    "nawyUrl": "https://www.nawy.com/compound/205-azad",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "azad-1",
        "label": "30% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "azad-2",
        "label": "55% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "azad-3",
        "label": "60% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 5 years equal installments"
  },
  "azha": {
    "nawyId": 88,
    "nawyUrl": "https://www.nawy.com/compound/88-azha",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "azha-1",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "azha-2",
        "label": "75% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "azha-3",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "azha-4",
        "label": "5% down · 10 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 7 years equal installments"
  },
  "azha-north-coast": {
    "nawyId": 757,
    "nawyUrl": "https://www.nawy.com/compound/757-azha-north-coast",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "azha-north-coast-1",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "azha-north-coast-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "azha-north-coast-3",
        "label": "45% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "azha-north-coast-4",
        "label": "60% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 7 years equal installments | 30% down · 6 years equal installments"
  },
  "azha-sokhna": {
    "nawyId": 88,
    "nawyUrl": "https://www.nawy.com/compound/88-azha",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "azha-sokhna-1",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "azha-sokhna-2",
        "label": "75% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "azha-sokhna-3",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "azha-sokhna-4",
        "label": "10% down · 10 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 10,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 7 years equal installments"
  },
  "azzar-island": {
    "nawyId": 716,
    "nawyUrl": "https://www.nawy.com/compound/716-azzar--island",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "azzar-island-1",
        "label": "55% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "azzar-island-2",
        "label": "60% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "azzar-island-3",
        "label": "10% down · 7 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "badya": {
    "nawyId": 223,
    "nawyUrl": "https://www.nawy.com/compound/223-badya",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "badya-1",
        "label": "12.5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 12.5,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "badya-2",
        "label": "15% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 19
      },
      {
        "id": "badya-3",
        "label": "20% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 15
      },
      {
        "id": "badya-4",
        "label": "25% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "badya-5",
        "label": "40% down · 7 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 14
      },
      {
        "id": "badya-6",
        "label": "45% down · 7 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 18
      }
    ]
  },
  "beit-al-bahr": {
    "nawyId": 1263,
    "nawyUrl": "https://www.nawy.com/compound/1263-beit-al-bahr",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "beit-al-bahr-1",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "beit-al-bahr-2",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "beit-al-bahr-3",
        "label": "40% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "beit-al-bahr-4",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 7 years equal installments | 30% down · 7 years equal installments"
  },
  "belle-vie": {
    "nawyId": 453,
    "nawyUrl": "https://www.nawy.com/compound/453-belle-vie",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "belle-vie-1",
        "label": "35% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "belle-vie-2",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "belle-vie-3",
        "label": "55% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "belle-vie-4",
        "label": "5% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 35% down · 4 years equal installments"
  },
  "belle-vie-new-zayed": {
    "nawyId": 453,
    "nawyUrl": "https://www.nawy.com/compound/453-belle-vie",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "belle-vie-new-zayed-1",
        "label": "35% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "belle-vie-new-zayed-2",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "belle-vie-new-zayed-3",
        "label": "55% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "belle-vie-new-zayed-4",
        "label": "10% down · 9 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 9,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 35% down · 4 years equal installments"
  },
  "beta-greens": {
    "nawyId": 1316,
    "nawyUrl": "https://www.nawy.com/compound/1316-beta-greens",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "beta-greens-1",
        "label": "10% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "beta-greens-2",
        "label": "10% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 7 years equal installments | 10% down · 6 years equal installments"
  },
  "bianchi-ilios": {
    "nawyId": 528,
    "nawyUrl": "https://www.nawy.com/compound/528-bianchi-ilios",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "bianchi-ilios-1",
        "label": "10% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "bianchi-ilios-2",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "bianchi-ilios-3",
        "label": "90% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ]
  },
  "bloom-island-ogami": {
    "nawyId": 2504,
    "nawyUrl": "https://www.nawy.com/compound/2504-bloom-island-ogami",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "bloom-island-ogami-1",
        "label": "5% down · 2% after 6 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month6Pct": 2,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "bloomfields": {
    "nawyId": 202,
    "nawyUrl": "https://www.nawy.com/compound/202-bloomfields",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "bloomfields-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "bloomfields-2",
        "label": "20% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "bloomfields-3",
        "label": "30% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "bloomfields-4",
        "label": "35% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "bloomfields-5",
        "label": "80% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      },
      {
        "id": "bloomfields-6",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 11
      }
    ]
  },
  "caesar-extension-2": {
    "nawyId": 1696,
    "nawyUrl": "https://www.nawy.com/compound/1696-caesar-extension-2",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "caesar-extension-2-1",
        "label": "5% down · 2% after 6 months · 8 years (Front Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month6Pct": 2,
        "installmentType": "Front Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "caesar-extension-2-2",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "caesar-extension-2-3",
        "label": "5% down · 5% after 6 months · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Nawy",
        "month6Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "cairo-business-park": {
    "nawyId": 367,
    "nawyUrl": "https://www.nawy.com/compound/367-cairo-business-park",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "cairo-business-park-1",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "cairo-gate": {
    "nawyId": 343,
    "nawyUrl": "https://www.nawy.com/compound/343-cairo-gate",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "cairo-gate-1",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "cairo-gate-2",
        "label": "45% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "cairo-gate-3",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "cairo-gate-4",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 35% down · 5 years equal installments"
  },
  "cala-residences-katameya-coast": {
    "nawyId": 2461,
    "nawyUrl": "https://www.nawy.com/compound/2461-katameya-coast-phase-2",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "cala-residences-katameya-coast-1",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ]
  },
  "cali-coast-ras-el-hekma": {
    "nawyId": 505,
    "nawyUrl": "https://www.nawy.com/compound/505-cali-coast-ras-el-hekma",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "cali-coast-ras-el-hekma-1",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "cali-coast-ras-el-hekma-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "cali-coast-ras-el-hekma-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 12
      },
      {
        "id": "cali-coast-ras-el-hekma-4",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "cali-coast-ras-el-hekma-5",
        "label": "45% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      },
      {
        "id": "cali-coast-ras-el-hekma-6",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 7 years equal installments | 30% down · 6 years equal installments | 35% down · 6 years equal installments"
  },
  "carnelia": {
    "nawyId": 315,
    "nawyUrl": "https://www.nawy.com/compound/315-carnelia",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "carnelia-1",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "carnelia-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "carnelia-3",
        "label": "60% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "carnelia-4",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 8 years equal installments | 35% down · 6 years equal installments"
  },
  "central-water-residences": {
    "nawyId": 2191,
    "nawyUrl": "https://www.nawy.com/compound/2191-Central Water Residences",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "central-water-residences-1",
        "label": "5% down · 5% after 3 months · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "city-gate": {
    "nawyId": 764,
    "nawyUrl": "https://www.nawy.com/compound/764-city-gate",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "city-gate-1",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "city-gate-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "city-gate-3",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "city-gate-4",
        "label": "40% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "city-gate-5",
        "label": "40% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "city-gate-6",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 8 years equal installments | 30% down · 6 years equal installments | 35% down · 5 years equal installments"
  },
  "citystars-park-street": {
    "nawyId": 2142,
    "nawyUrl": "https://www.nawy.com/compound/2142-Citystars Park Street",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "citystars-park-street-1",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "citystars-park-street-2",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "club-hill-solare": {
    "nawyId": 2376,
    "nawyUrl": "https://www.nawy.com/compound/2376-club-hill-solare",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "club-hill-solare-1",
        "label": "5% down · 5% after 3 months · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 5% after 3 months · 10 years equal installments"
  },
  "commonhaus": {
    "nawyId": 2343,
    "nawyUrl": "https://www.nawy.com/compound/2343-commonhaus",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "commonhaus-1",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "coral-coves": {
    "nawyId": 2239,
    "nawyUrl": "https://www.nawy.com/compound/2239-Coral Coves",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "coral-coves-1",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ]
  },
  "covaya": {
    "nawyId": 1856,
    "nawyUrl": "https://www.nawy.com/compound/1856-covaya",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "covaya-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "covaya-2",
        "label": "5% down · 4% after 3 months · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 4,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 10 years equal installments | 5% down · 4% after 3 months · 10 years equal installments"
  },
  "creekview": {
    "nawyId": 2248,
    "nawyUrl": "https://www.nawy.com/compound/2248-Mountain View 5th settlement",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "creekview-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "creekview-2",
        "label": "5% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "creekview-3",
        "label": "7.5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 7.5,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "creekview-4",
        "label": "10% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 10 years equal installments | 5% down · 6 years equal installments | 7.5% down · 10 years equal installments"
  },
  "crescent-walk": {
    "nawyId": 1333,
    "nawyUrl": "https://www.nawy.com/compound/1333-crescent-walk",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "crescent-walk-1",
        "label": "20% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 10
      },
      {
        "id": "crescent-walk-2",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "crescent-walk-3",
        "label": "35% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      },
      {
        "id": "crescent-walk-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "crescent-walk-5",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "crescent-walk-6",
        "label": "45% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 7 years equal installments | 25% down · 8 years equal installments | 35% down · 7 years equal installments"
  },
  "d-bay": {
    "nawyId": 452,
    "nawyUrl": "https://www.nawy.com/compound/452-d-bay",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "d-bay-1",
        "label": "25% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "d-bay-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "d-bay-3",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "d-bay-4",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 9 years equal installments | 35% down · 6 years equal installments"
  },
  "d-o-s-e": {
    "nawyId": 759,
    "nawyUrl": "https://www.nawy.com/compound/759-d.o.s.e",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "d-o-s-e-1",
        "label": "20% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "d-o-s-e-2",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "d-o-s-e-3",
        "label": "45% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "d-o-s-e-4",
        "label": "80% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 9 years equal installments | 35% down · 5 years equal installments"
  },
  "dayz": {
    "nawyId": 2196,
    "nawyUrl": "https://www.nawy.com/compound/2196-Dayz",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "dayz-1",
        "label": "20% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "dayz-2",
        "label": "30% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 4 years equal installments | 30% down · 5 years equal installments"
  },
  "direction-white": {
    "nawyId": 692,
    "nawyUrl": "https://www.nawy.com/compound/692-direction-white",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "direction-white-1",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "direction-white-2",
        "label": "35% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "direction-white-3",
        "label": "60% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "direction-white-4",
        "label": "70% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "direction-white-5",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 7 years equal installments | 35% down · 7 years equal installments"
  },
  "district-5": {
    "nawyId": 222,
    "nawyUrl": "https://www.nawy.com/compound/222-district-5",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "district-5-1",
        "label": "10% down · 8% after 6 months · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Nawy",
        "month6Pct": 8,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "district-5-2",
        "label": "65% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 65,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "district-5-3",
        "label": "75% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      }
    ]
  },
  "downtown-new-alamein": {
    "nawyId": 314,
    "nawyUrl": "https://www.nawy.com/compound/314-downtown-new-alamein",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "downtown-new-alamein-1",
        "label": "20% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "downtown-new-alamein-2",
        "label": "30% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "downtown-new-alamein-3",
        "label": "40% down · 8 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "downtown-new-alamein-4",
        "label": "70% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 10 years equal installments | 30% down · 10 years equal installments"
  },
  "el-patio-riva": {
    "nawyId": 1761,
    "nawyUrl": "https://www.nawy.com/compound/1761-el-patio-riva",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "el-patio-riva-1",
        "label": "5% down · 2% after 3 months · 2% after 6 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 2,
        "month6Pct": 2,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "el-patio-riva-2",
        "label": "20% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "el-patio-riva-3",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "el-patio-riva-4",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 2% after 3 months · 2% after 6 months · 8 years equal installments | 20% down · 7 years equal installments | 25% down · 7 years equal installments"
  },
  "el-patio-sola": {
    "nawyId": 1303,
    "nawyUrl": "https://www.nawy.com/compound/1303-el-patio-sola",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "el-patio-sola-1",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "el-patio-sola-2",
        "label": "15% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "el-patio-town": {
    "nawyId": 1113,
    "nawyUrl": "https://www.nawy.com/compound/1113-el-patio-town",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "el-patio-town-1",
        "label": "5% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "el-patio-town-2",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "el-patio-town-3",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "el-patio-town-4",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "el-patio-vera": {
    "nawyId": 1138,
    "nawyUrl": "https://www.nawy.com/compound/1138-el-patio-vera",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "el-patio-vera-1",
        "label": "5% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "elea-azha-north": {
    "nawyId": 2437,
    "nawyUrl": "https://www.nawy.com/compound/2437-elea-azha-north",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "elea-azha-north-1",
        "label": "5% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 9 years equal installments"
  },
  "esse-residence": {
    "nawyId": 1240,
    "nawyUrl": "https://www.nawy.com/compound/1240-esse-residence",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "esse-residence-1",
        "label": "2.5% down · 12 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "esse-residence-2",
        "label": "5% down · 12 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 2.5% down · 12 years (Back Loaded) | 5% down · 12 years equal installments"
  },
  "ever-new-cairo": {
    "nawyId": 1123,
    "nawyUrl": "https://www.nawy.com/compound/1123-ever-new-cairo",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "ever-new-cairo-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "ever-new-cairo-2",
        "label": "15% down · 15% on delivery · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 6,
        "source": "Nawy",
        "deliveryPct": 15,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "ever-new-cairo-3",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "ever-new-cairo-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "ever-new-cairo-5",
        "label": "35% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "ever-new-cairo-6",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "gaia": {
    "nawyId": 305,
    "nawyUrl": "https://www.nawy.com/compound/305-gaia",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "gaia-1",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "gaia-2",
        "label": "90% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "gaia-3",
        "label": "95% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "gaia-4",
        "label": "10% down · 9 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 9,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 6 years equal installments"
  },
  "garden-lakes": {
    "nawyId": 798,
    "nawyUrl": "https://www.nawy.com/compound/798-garden-lakes",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "garden-lakes-1",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "garden-lakes-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "garden-lakes-3",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "garden-lakes-4",
        "label": "60% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 6 years equal installments | 35% down · 6 years equal installments"
  },
  "glen": {
    "nawyId": 1426,
    "nawyUrl": "https://www.nawy.com/compound/1426-glen",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "glen-1",
        "label": "7.5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 7.5,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "glen-2",
        "label": "15% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "glen-3",
        "label": "30% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 7.5% down · 8 years equal installments | 15% down · 7 years equal installments | 30% down · 9 years equal installments"
  },
  "green-square": {
    "nawyId": 347,
    "nawyUrl": "https://www.nawy.com/compound/347-green-square",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "green-square-1",
        "label": "30% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "green-square-2",
        "label": "60% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 5 years equal installments"
  },
  "grova-east-hills": {
    "nawyId": 2268,
    "nawyUrl": "https://www.nawy.com/compound/2268-Grova East Hills",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "grova-east-hills-1",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "hacienda-bay": {
    "nawyId": 43,
    "nawyUrl": "https://www.nawy.com/compound/43-hacienda-bay",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "hacienda-bay-1",
        "label": "65% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 65,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "hacienda-bay-2",
        "label": "90% down · 1 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 1,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ]
  },
  "hacienda-blue": {
    "nawyId": 1466,
    "nawyUrl": "https://www.nawy.com/compound/1466-hacienda-blue",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "hacienda-blue-1",
        "label": "12.5% down · 11 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 12.5,
        "years": 11,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "hacienda-blue-2",
        "label": "100% down · 8 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 100,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 12.5% down · 11 years equal installments"
  },
  "hacienda-heneish": {
    "nawyId": 1200,
    "nawyUrl": "https://www.nawy.com/compound/1200-hacienda-heneish",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "hacienda-heneish-1",
        "label": "15% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "hacienda-heneish-2",
        "label": "20% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 45
      },
      {
        "id": "hacienda-heneish-3",
        "label": "60% down · 8 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "hacienda-heneish-4",
        "label": "65% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 65,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ],
    "text": "Per Nawy (Nov 2026): 15% down · 7 years equal installments | 20% down · 7 years equal installments"
  },
  "hacienda-ras-el-hekma": {
    "nawyId": 2310,
    "nawyUrl": "https://www.nawy.com/compound/2310-hacienda-ras-el-hekma",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "hacienda-ras-el-hekma-1",
        "label": "5% down · 5% after 3 months · 10 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "hacienda-ras-el-hekma-2",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "hacienda-ras-el-hekma-3",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "hacienda-ras-el-hekma-4",
        "label": "15% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "hacienda-waters": {
    "nawyId": 1261,
    "nawyUrl": "https://www.nawy.com/compound/1261-hacienda-waters",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "hacienda-waters-1",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 20
      },
      {
        "id": "hacienda-waters-2",
        "label": "30% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 46
      },
      {
        "id": "hacienda-waters-3",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 15
      },
      {
        "id": "hacienda-waters-4",
        "label": "35% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 17
      },
      {
        "id": "hacienda-waters-5",
        "label": "40% down · 8 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      },
      {
        "id": "hacienda-waters-6",
        "label": "40% down · 7 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ]
  },
  "hacienda-west": {
    "nawyId": 521,
    "nawyUrl": "https://www.nawy.com/compound/521-hacienda-west",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "hacienda-west-1",
        "label": "60% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "hacienda-west-2",
        "label": "65% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 65,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 13
      },
      {
        "id": "hacienda-west-3",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "hadaba": {
    "nawyId": 442,
    "nawyUrl": "https://www.nawy.com/compound/442-hadaba",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "hadaba-1",
        "label": "15% down · 10% on delivery · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 5,
        "source": "Nawy",
        "deliveryPct": 10,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "hadaba-2",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "haptown": {
    "nawyId": 196,
    "nawyUrl": "https://www.nawy.com/compound/196-haptown",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "haptown-1",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "haptown-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "haptown-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "haptown-4",
        "label": "40% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "haptown-5",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 7 years equal installments | 30% down · 6 years equal installments | 35% down · 6 years equal installments"
  },
  "hyde-park-central": {
    "nawyId": 1495,
    "nawyUrl": "https://www.nawy.com/compound/1495-hyde-park-central",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "hyde-park-central-1",
        "label": "15% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "hyde-park-central-2",
        "label": "20% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      },
      {
        "id": "hyde-park-central-3",
        "label": "20% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      },
      {
        "id": "hyde-park-central-4",
        "label": "25% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      }
    ]
  },
  "hyde-park-new-cairo": {
    "nawyId": 38,
    "nawyUrl": "https://www.nawy.com/compound/38-hyde-park",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "hyde-park-new-cairo-1",
        "label": "25% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "hyde-park-new-cairo-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "hyde-park-new-cairo-3",
        "label": "30% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "hyde-park-new-cairo-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "hyde-park-new-cairo-5",
        "label": "45% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "hyde-park-new-cairo-6",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 10
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 10 years equal installments | 30% down · 6 years equal installments | 30% down · 5 years equal installments"
  },
  "il-bosco-city": {
    "nawyId": 490,
    "nawyUrl": "https://www.nawy.com/compound/490-il-bosco-city",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "il-bosco-city-1",
        "label": "15% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "il-bosco-city-2",
        "label": "15% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "il-bosco-city-3",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "il-bosco-city-4",
        "label": "30% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "il-bosco-city-5",
        "label": "80% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "il-bosco-city-6",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      }
    ],
    "text": "Per Nawy (Nov 2026): 15% down · 10 years equal installments | 15% down · 9 years equal installments | 25% down · 6 years equal installments"
  },
  "il-latini-sed": {
    "nawyId": 493,
    "nawyUrl": "https://www.nawy.com/compound/493-il-latini-sed",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "il-latini-sed-1",
        "label": "20% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "il-latini-sed-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "il-latini-sed-3",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "il-latini-sed-4",
        "label": "60% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 7 years equal installments | 35% down · 6 years equal installments"
  },
  "il-monte-galala": {
    "nawyId": 90,
    "nawyUrl": "https://www.nawy.com/compound/90-il-monte-galala",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "il-monte-galala-1",
        "label": "12.5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 12.5,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "il-monte-galala-2",
        "label": "15% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "il-monte-galala-3",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "il-monte-galala-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "il-monte-galala-5",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "il-monte-galala-6",
        "label": "95% down · 1 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 1,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ]
  },
  "ivoire-east": {
    "nawyId": 1076,
    "nawyUrl": "https://www.nawy.com/compound/1076-ivoire-east",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "ivoire-east-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "ivoire-east-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "ivoire-east-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "ivoire-east-4",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "ivoire-east-5",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "ivoire-west": {
    "nawyId": 1003,
    "nawyUrl": "https://www.nawy.com/compound/1003-ivoire-west",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "ivoire-west-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "ivoire-west-2",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "ivoire-west-3",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "ivoire-west-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "ivoire-west-5",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "ivoire-west-6",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "jadie-residence": {
    "nawyId": 1382,
    "nawyUrl": "https://www.nawy.com/compound/1382-jadie-residence",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "jadie-residence-1",
        "label": "10% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 7 years equal installments"
  },
  "jamila": {
    "nawyId": 1290,
    "nawyUrl": "https://www.nawy.com/compound/1290-jamila",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "jamila-1",
        "label": "0% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 0.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "jamila-2",
        "label": "5% down · 12 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "jamila-3",
        "label": "10% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "jamila-4",
        "label": "30% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "jamila-5",
        "label": "45% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "jamila-6",
        "label": "50% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 0% down · 10 years equal installments | 5% down · 12 years equal installments | 10% down · 10 years equal installments"
  },
  "jebal-sokhna": {
    "nawyId": 434,
    "nawyUrl": "https://www.nawy.com/compound/434-jebal-el-sokhna",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "jebal-sokhna-1",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "jebal-sokhna-2",
        "label": "10% down · 10% after 3 months · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 6,
        "source": "Nawy",
        "month3Pct": 10,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "jebal-sokhna-3",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "jebal-sokhna-4",
        "label": "95% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 5% after 3 months · 8 years equal installments | 10% down · 10% after 3 months · 6 years equal installments"
  },
  "jefaira": {
    "nawyId": 165,
    "nawyUrl": "https://www.nawy.com/compound/165-jefaira",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "jefaira-1",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "jefaira-2",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "jefaira-3",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "jefaira-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "jefaira-5",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "jefaira-6",
        "label": "95% down · 1 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 1,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 8 years equal installments | 30% down · 7 years equal installments | 30% down · 6 years equal installments"
  },
  "june": {
    "nawyId": 510,
    "nawyUrl": "https://www.nawy.com/compound/510-june",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "june-1",
        "label": "30% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "june-2",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 10
      },
      {
        "id": "june-3",
        "label": "95% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 4 years equal installments"
  },
  "kai-sokhna": {
    "nawyId": 191,
    "nawyUrl": "https://www.nawy.com/compound/191-kai-sokhna",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "kai-sokhna-1",
        "label": "85% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "kai-sokhna-2",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "katameya-coast": {
    "nawyId": 236,
    "nawyUrl": "https://www.nawy.com/compound/236-katameya-coast",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "katameya-coast-1",
        "label": "80% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "katameya-coast-2",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "katameya-coast-3",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "katameya-creeks": {
    "nawyId": 361,
    "nawyUrl": "https://www.nawy.com/compound/361-katameya-creeks",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "katameya-creeks-1",
        "label": "10% down · 5% after 6 months · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 5,
        "source": "Nawy",
        "month6Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "katameya-creeks-2",
        "label": "20% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 5% after 6 months · 5 years equal installments | 20% down · 5 years equal installments"
  },
  "kayan": {
    "nawyId": 411,
    "nawyUrl": "https://www.nawy.com/compound/411-kayan",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "kayan-1",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "kayan-2",
        "label": "95% down · 1 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 1,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "kayan-3",
        "label": "25% down · 4 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 25.0,
        "years": 4,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "keeva": {
    "nawyId": 356,
    "nawyUrl": "https://www.nawy.com/compound/356-keeva",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "keeva-1",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "keeva-2",
        "label": "35% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "keeva-3",
        "label": "80% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "keeva-4",
        "label": "80% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 5% after 3 months · 8 years equal installments | 35% down · 8 years equal installments"
  },
  "keeva-6th-of-october": {
    "nawyId": 356,
    "nawyUrl": "https://www.nawy.com/compound/356-keeva",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "keeva-6th-of-october-1",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "keeva-6th-of-october-2",
        "label": "35% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "keeva-6th-of-october-3",
        "label": "80% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "keeva-6th-of-october-4",
        "label": "80% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 5% after 3 months · 8 years equal installments | 35% down · 8 years equal installments"
  },
  "kinda-residence": {
    "nawyId": 399,
    "nawyUrl": "https://www.nawy.com/compound/399-kinda",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "kinda-residence-1",
        "label": "15% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "kinda-residence-2",
        "label": "65% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 65,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "kinda-residence-3",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 15% down · 7 years equal installments"
  },
  "koun": {
    "nawyId": 935,
    "nawyUrl": "https://www.nawy.com/compound/935-koun",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "koun-1",
        "label": "20% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "koun-2",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "koun-3",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "koun-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "koun-5",
        "label": "65% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 65,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "koun-6",
        "label": "70% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 6 years equal installments | 25% down · 8 years equal installments | 30% down · 6 years equal installments"
  },
  "la-mirada": {
    "nawyId": 724,
    "nawyUrl": "https://www.nawy.com/compound/724-la-mirada",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "la-mirada-1",
        "label": "0% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 0.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-mirada-2",
        "label": "5% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "la-mirada-3",
        "label": "10% down · 11 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 11,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-mirada-4",
        "label": "20% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-mirada-5",
        "label": "55% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-mirada-6",
        "label": "70% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "la-vista-bay-east": {
    "nawyId": 161,
    "nawyUrl": "https://www.nawy.com/compound/161-la-vista-bay-east",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "la-vista-bay-east-1",
        "label": "5% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-vista-bay-east-2",
        "label": "20% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "la-vista-bay-east-3",
        "label": "20% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "la-vista-bay-east-4",
        "label": "70% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-vista-bay-east-5",
        "label": "80% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 7 years equal installments | 20% down · 5 years equal installments | 20% down · 4 years equal installments"
  },
  "la-vista-cascada": {
    "nawyId": 71,
    "nawyUrl": "https://www.nawy.com/compound/71-la-vista-cascada",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "la-vista-cascada-1",
        "label": "35% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "la-vista-city": {
    "nawyId": 264,
    "nawyUrl": "https://www.nawy.com/compound/264-la-vista-city",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "la-vista-city-1",
        "label": "20% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-vista-city-2",
        "label": "50% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-vista-city-3",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 5 years equal installments"
  },
  "la-vista-gardens": {
    "nawyId": 16,
    "nawyUrl": "https://www.nawy.com/compound/16-la-vista-gardens",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "la-vista-gardens-1",
        "label": "5% down · 2% after 3 months · 2% after 6 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 2,
        "month6Pct": 2,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-vista-gardens-2",
        "label": "5% down · 2% after 3 months · 2% after 6 months · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Nawy",
        "month3Pct": 2,
        "month6Pct": 2,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "la-vista-gardens-3",
        "label": "10% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 2% after 3 months · 2% after 6 months · 8 years equal installments | 5% down · 2% after 3 months · 2% after 6 months · 7 years equal installments | 10% down · 5 years equal installments"
  },
  "la-vista-ras-el-hekma": {
    "nawyId": 175,
    "nawyUrl": "https://www.nawy.com/compound/175-la-vista-ras-el-hekma",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "la-vista-ras-el-hekma-1",
        "label": "20% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-vista-ras-el-hekma-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-vista-ras-el-hekma-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-vista-ras-el-hekma-4",
        "label": "15% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 4 years equal installments | 30% down · 6 years equal installments | 35% down · 6 years equal installments"
  },
  "la-vista-ray": {
    "nawyId": 220,
    "nawyUrl": "https://www.nawy.com/compound/220-la-vista-ray",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "la-vista-ray-1",
        "label": "5% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 6 years equal installments"
  },
  "la-vista-topaz": {
    "nawyId": 225,
    "nawyUrl": "https://www.nawy.com/compound/225-la-vista-topaz",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "la-vista-topaz-1",
        "label": "5% down · 2% after 3 months · 2% after 6 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 2,
        "month6Pct": 2,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-vista-topaz-2",
        "label": "5% down · 2% after 3 months · 2% after 6 months · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Nawy",
        "month3Pct": 2,
        "month6Pct": 2,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "la-vista-topaz-3",
        "label": "10% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 2% after 3 months · 2% after 6 months · 8 years equal installments | 5% down · 2% after 3 months · 2% after 6 months · 7 years equal installments | 10% down · 5 years equal installments"
  },
  "lake-view-residence": {
    "nawyId": 12,
    "nawyUrl": "https://www.nawy.com/compound/12-lake-view-residence",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "lake-view-residence-1",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "lake-view-residence-2",
        "label": "95% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "lavenir": {
    "nawyId": 99,
    "nawyUrl": "https://www.nawy.com/compound/99-l’avenir",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "lavenir-1",
        "label": "10% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 10 years equal installments"
  },
  "lyv": {
    "nawyId": 1159,
    "nawyUrl": "https://www.nawy.com/compound/1159-lyv-caesar-ras-el-hekma",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "lyv-1",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "lyv-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 10
      },
      {
        "id": "lyv-3",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 10
      },
      {
        "id": "lyv-4",
        "label": "45% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 6 years equal installments | 35% down · 6 years equal installments"
  },
  "madinaty": {
    "nawyId": 299,
    "nawyUrl": "https://www.nawy.com/compound/299-madinaty",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "madinaty-1",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 11
      },
      {
        "id": "madinaty-2",
        "label": "30% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 14
      },
      {
        "id": "madinaty-3",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "madinaty-4",
        "label": "35% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "madinaty-5",
        "label": "40% down · 7 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "madinaty-6",
        "label": "60% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 8 years equal installments | 30% down · 8 years equal installments | 30% down · 7 years equal installments"
  },
  "makadi-heights": {
    "nawyId": 454,
    "nawyUrl": "https://www.nawy.com/compound/454-makadi-heights",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "makadi-heights-1",
        "label": "25% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "makadi-heights-2",
        "label": "45% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "makadi-heights-3",
        "label": "70% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 5 years equal installments"
  },
  "marassi": {
    "nawyId": 5,
    "nawyUrl": "https://www.nawy.com/compound/5-marassi",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "marassi-1",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "marassi-2",
        "label": "95% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "marassi-3",
        "label": "5% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "marassi-red-sea": {
    "nawyId": 1849,
    "nawyUrl": "https://www.nawy.com/compound/1849-marassi-red",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "marassi-red-sea-1",
        "label": "20% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "marassi-red-sea-2",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "marassi-red-sea-3",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "marassi-red-sea-4",
        "label": "30% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "marassi-red-sea-5",
        "label": "25% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 5 years equal installments | 25% down · 6 years equal installments | 30% down · 6 years equal installments"
  },
  "marsa-baghush": {
    "nawyId": 789,
    "nawyUrl": "https://www.nawy.com/compound/789-marsa-baghush",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "marsa-baghush-1",
        "label": "10% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "marsa-baghush-2",
        "label": "10% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "marsa-baghush-3",
        "label": "60% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "marsa-baghush-4",
        "label": "70% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 8 years equal installments | 10% down · 7 years equal installments"
  },
  "masaya": {
    "nawyId": 788,
    "nawyUrl": "https://www.nawy.com/compound/788-masaya",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "masaya-1",
        "label": "10% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "masaya-2",
        "label": "80% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "masaya-3",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 8 years equal installments"
  },
  "mazarine": {
    "nawyId": 293,
    "nawyUrl": "https://www.nawy.com/compound/293-mazarine",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mazarine-1",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mazarine-2",
        "label": "35% down · 11 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 11,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mazarine-3",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "mazarine-4",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 7 years equal installments | 35% down · 11 years equal installments"
  },
  "mazarine-hub-new-alamein": {
    "nawyId": 1754,
    "nawyUrl": "https://www.nawy.com/compound/1754-mazarine-hub",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mazarine-hub-new-alamein-1",
        "label": "5% down · 5% after 3 months · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 3,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "mist": {
    "nawyId": 1528,
    "nawyUrl": "https://www.nawy.com/compound/1528-mist",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mist-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mist-2",
        "label": "15% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mist-3",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 10 years equal installments | 15% down · 9 years equal installments | 25% down · 6 years equal installments"
  },
  "mivida": {
    "nawyId": 6,
    "nawyUrl": "https://www.nawy.com/compound/6-mivida",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mivida-1",
        "label": "30% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mivida-2",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mivida-3",
        "label": "75% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mivida-4",
        "label": "95% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "mivida-5",
        "label": "5% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 5 years equal installments | 35% down · 5 years equal installments"
  },
  "mountain-view-1-1": {
    "nawyId": 655,
    "nawyUrl": "https://www.nawy.com/compound/655-mountain-view-1.1",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mountain-view-1-1-1",
        "label": "20% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mountain-view-1-1-2",
        "label": "75% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      },
      {
        "id": "mountain-view-1-1-3",
        "label": "80% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 5 years equal installments"
  },
  "mountain-view-chillout-park": {
    "nawyId": 423,
    "nawyUrl": "https://www.nawy.com/compound/423-mountain-view-chillout-park",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mountain-view-chillout-park-1",
        "label": "10% down · 5% after 6 months · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Nawy",
        "month6Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mountain-view-chillout-park-2",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "mountain-view-chillout-park-3",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 5% after 6 months · 7 years equal installments"
  },
  "mountain-view-hyde-park": {
    "nawyId": 7,
    "nawyUrl": "https://www.nawy.com/compound/7-mountain-view-hyde-park",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mountain-view-hyde-park-1",
        "label": "15% down · 5% after 6 months · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 7,
        "source": "Nawy",
        "month6Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 15% down · 5% after 6 months · 7 years equal installments"
  },
  "mountain-view-icity": {
    "nawyId": 195,
    "nawyUrl": "https://www.nawy.com/compound/195-mountain-view-icity-new-cairo",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mountain-view-icity-1",
        "label": "15% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "mountain-view-icity-2",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "mountain-view-icity-3",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 13
      },
      {
        "id": "mountain-view-icity-4",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 10
      }
    ]
  },
  "mountain-view-icity-october": {
    "nawyId": 422,
    "nawyUrl": "https://www.nawy.com/compound/422-mountain-view-icity-october",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mountain-view-icity-october-1",
        "label": "20% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "mountain-view-icity-october-2",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "mountain-view-icity-october-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      },
      {
        "id": "mountain-view-icity-october-4",
        "label": "35% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "mountain-view-icity-october-5",
        "label": "50% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 10
      },
      {
        "id": "mountain-view-icity-october-6",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 14
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 9 years equal installments | 30% down · 7 years equal installments | 35% down · 6 years equal installments"
  },
  "mountain-view-ras-el-hekma": {
    "nawyId": 45,
    "nawyUrl": "https://www.nawy.com/compound/45-mountain-view-ras-el-hekma",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mountain-view-ras-el-hekma-1",
        "label": "15% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "mountain-view-ras-el-hekma-2",
        "label": "20% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "mountain-view-ras-el-hekma-3",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "mountain-view-ras-el-hekma-4",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "mountain-view-ras-el-hekma-5",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "mountain-view-ras-el-hekma-6",
        "label": "95% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 13
      }
    ],
    "text": "Per Nawy (Nov 2026): 15% down · 8 years equal installments | 20% down · 8 years equal installments | 25% down · 7 years equal installments"
  },
  "murano": {
    "nawyId": 1051,
    "nawyUrl": "https://www.nawy.com/compound/1051-murano-wadi-degla",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "murano-1",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "murano-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "murano-3",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "murano-4",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "murano-5",
        "label": "5% down · 7 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 7 years equal installments | 30% down · 6 years equal installments"
  },
  "naia-bay": {
    "nawyId": 930,
    "nawyUrl": "https://www.nawy.com/compound/930-naia-bay",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "naia-bay-1",
        "label": "70% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "naia-bay-2",
        "label": "90% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "naia-bay-3",
        "label": "10% down · 10 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 10,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "new-garden-city-r5": {
    "nawyId": 1099,
    "nawyUrl": "https://www.nawy.com/compound/1099-new-garden-city",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "new-garden-city-r5-1",
        "label": "15% down · 11 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15.0,
        "years": 11,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "new-garden-city-r5-2",
        "label": "40% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "new-garden-city-r5-3",
        "label": "50% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 15% down · 11 years equal installments"
  },
  "nmq": {
    "nawyId": 1067,
    "nawyUrl": "https://www.nawy.com/compound/1067-nmq",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "nmq-1",
        "label": "10% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "nmq-2",
        "label": "20% down · 5% after 3 months · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 9,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "nmq-3",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "nmq-4",
        "label": "55% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 10 years equal installments | 20% down · 5% after 3 months · 9 years equal installments | 25% down · 7 years equal installments"
  },
  "nyoum-october": {
    "nawyId": 790,
    "nawyUrl": "https://www.nawy.com/compound/790-nyoum-october",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "nyoum-october-1",
        "label": "15% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "nyoum-october-2",
        "label": "30% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "nyoum-october-3",
        "label": "50% down · 7 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "nyoum-october-4",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 15% down · 8 years equal installments | 30% down · 4 years equal installments"
  },
  "one-hyde-park-new-cairo": {
    "nawyId": 2644,
    "nawyUrl": "https://www.nawy.com/compound/2644-one-hyde-park",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "one-hyde-park-new-cairo-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "one-hyde-park-new-cairo-2",
        "label": "5% down · 5% after 3 months · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "one-hyde-park-new-cairo-3",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "one-hyde-park-new-cairo-4",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 10 years equal installments | 5% down · 5% after 3 months · 10 years equal installments | 5% down · 8 years equal installments"
  },
  "one33": {
    "nawyId": 1072,
    "nawyUrl": "https://www.nawy.com/compound/1072-one33",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "one33-1",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "one33-2",
        "label": "30% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "one33-3",
        "label": "50% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "one33-4",
        "label": "60% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "one33-5",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 8 years equal installments | 30% down · 9 years equal installments"
  },
  "origami": {
    "nawyId": 1246,
    "nawyUrl": "https://www.nawy.com/compound/1246-origami",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "origami-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 10 years equal installments"
  },
  "origami-golf": {
    "nawyId": 1245,
    "nawyUrl": "https://www.nawy.com/compound/1245-origami-golf",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "origami-golf-1",
        "label": "10% down · 8 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 8 years (Back Loaded)"
  },
  "palm-hills-alexandria": {
    "nawyId": 201,
    "nawyUrl": "https://www.nawy.com/compound/201-palm-hills-alexandria",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "palm-hills-alexandria-1",
        "label": "5% down · 10 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "palm-hills-alexandria-2",
        "label": "5% down · 5% after 3 months · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "palm-hills-alexandria-3",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "palm-hills-alexandria-4",
        "label": "90% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 10 years (Back Loaded) | 5% down · 5% after 3 months · 7 years equal installments"
  },
  "palm-hills-new-alamein": {
    "nawyId": 397,
    "nawyUrl": "https://www.nawy.com/compound/397-palm-hills-new-alamein",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "palm-hills-new-alamein-1",
        "label": "95% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "palm-hills-new-alamein-2",
        "label": "95% down · 1 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 1,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "palm-hills-new-alamein-3",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "palm-hills-new-cairo": {
    "nawyId": 148,
    "nawyUrl": "https://www.nawy.com/compound/148-palm-hills-new-cairo",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "palm-hills-new-cairo-1",
        "label": "20% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      },
      {
        "id": "palm-hills-new-cairo-2",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "palm-hills-new-cairo-3",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "palm-hills-new-cairo-4",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "palm-hills-new-cairo-5",
        "label": "50% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      },
      {
        "id": "palm-hills-new-cairo-6",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 14
      }
    ]
  },
  "palm-hills-october": {
    "nawyId": 61,
    "nawyUrl": "https://www.nawy.com/compound/61-palm-hills-october",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "palm-hills-october-1",
        "label": "10% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "palm-hills-october-2",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 7 years equal installments"
  },
  "palm-parks": {
    "nawyId": 64,
    "nawyUrl": "https://www.nawy.com/compound/64-palm-parks",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "palm-parks-1",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "palm-parks-2",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "palm-parks-3",
        "label": "55% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "palm-parks-4",
        "label": "60% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 8 years equal installments | 35% down · 5 years equal installments"
  },
  "palmet": {
    "nawyId": 817,
    "nawyUrl": "https://www.nawy.com/compound/817-palmet",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "palmet-1",
        "label": "5% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 7 years equal installments"
  },
  "park-central-mostakbal-city": {
    "nawyId": 1312,
    "nawyUrl": "https://www.nawy.com/compound/1312-park-central",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "park-central-mostakbal-city-1",
        "label": "30% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "park-central-mostakbal-city-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "park-central-mostakbal-city-3",
        "label": "35% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "park-central-mostakbal-city-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "park-central-mostakbal-city-5",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "park-central-mostakbal-city-6",
        "label": "45% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      },
      {
        "id": "park-central-mostakbal-city-7",
        "label": "5% down · 10 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 8 years equal installments | 30% down · 6 years equal installments | 35% down · 7 years equal installments"
  },
  "patio-5-east": {
    "nawyId": 13,
    "nawyUrl": "https://www.nawy.com/compound/13-el-patio-5-east",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "patio-5-east-1",
        "label": "20% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "patio-5-east-2",
        "label": "60% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "patio-5-east-3",
        "label": "60% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "patio-casa": {
    "nawyId": 156,
    "nawyUrl": "https://www.nawy.com/compound/156-el-patio-casa",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "patio-casa-1",
        "label": "20% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "patio-hills": {
    "nawyId": 1532,
    "nawyUrl": "https://www.nawy.com/compound/1532-el-patio-hills",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "patio-hills-1",
        "label": "5% down · 2% after 3 months · 2% after 6 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 2,
        "month6Pct": 2,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "patio-hills-2",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "patio-hills-3",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "patio-hills-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "patio-jade": {
    "nawyId": 1954,
    "nawyUrl": "https://www.nawy.com/compound/1954-El Patio Jade",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "patio-jade-1",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "patio-oro": {
    "nawyId": 207,
    "nawyUrl": "https://www.nawy.com/compound/207-el-patio-oro",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "patio-oro-1",
        "label": "30% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 4 years equal installments"
  },
  "patio-prime": {
    "nawyId": 224,
    "nawyUrl": "https://www.nawy.com/compound/224-el-patio-prime",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "patio-prime-1",
        "label": "20% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "patio-prime-2",
        "label": "70% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "patio-prime-3",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "patio-vida": {
    "nawyId": 1427,
    "nawyUrl": "https://www.nawy.com/compound/1427-patio-vida",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "patio-vida-1",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "patio-vida-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "patio-vida-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "patio-vida-4",
        "label": "45% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "patio-zahraa": {
    "nawyId": 15,
    "nawyUrl": "https://www.nawy.com/compound/15-el-patio-zahraa",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "patio-zahraa-1",
        "label": "25% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 4 years equal installments"
  },
  "phnc-commercial": {
    "nawyId": 1057,
    "nawyUrl": "https://www.nawy.com/compound/1057-palmet-new-cairo",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "phnc-commercial-1",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "phnc-commercial-2",
        "label": "40% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "phnc-commercial-3",
        "label": "60% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 5% after 3 months · 8 years equal installments"
  },
  "playa": {
    "nawyId": 1276,
    "nawyUrl": "https://www.nawy.com/compound/1276-playa",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "playa-1",
        "label": "15% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "playa-2",
        "label": "20% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      },
      {
        "id": "playa-3",
        "label": "30% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "playa-4",
        "label": "60% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "playa-5",
        "label": "65% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 65,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 15% down · 6 years equal installments | 20% down · 6 years equal installments | 30% down · 5 years equal installments"
  },
  "px": {
    "nawyId": 1154,
    "nawyUrl": "https://www.nawy.com/compound/1154-px",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "px-1",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "px-2",
        "label": "30% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "px-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "px-4",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "px-5",
        "label": "40% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "px-6",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ]
  },
  "q-bay": {
    "nawyId": 2013,
    "nawyUrl": "https://www.nawy.com/compound/2013-Q Bay",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "q-bay-1",
        "label": "10% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "q-bay-2",
        "label": "15% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 8 years equal installments | 15% down · 8 years equal installments"
  },
  "rai-valleys": {
    "nawyId": 1244,
    "nawyUrl": "https://www.nawy.com/compound/1244-rai-valleys",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "rai-valleys-1",
        "label": "10% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "rai-valleys-2",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "ramla": {
    "nawyId": 1192,
    "nawyUrl": "https://www.nawy.com/compound/1192-ramla",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "ramla-1",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "ramla-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "ramla-3",
        "label": "55% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "ramla-4",
        "label": "60% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 7 years equal installments | 30% down · 6 years equal installments"
  },
  "riv-amwaj": {
    "nawyId": 1468,
    "nawyUrl": "https://www.nawy.com/compound/1468-rivette-amwaj",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "riv-amwaj-1",
        "label": "10% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "rock-eden": {
    "nawyId": 1148,
    "nawyUrl": "https://www.nawy.com/compound/1148-rock-eden",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "rock-eden-1",
        "label": "7.5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 7.5,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "rock-gold": {
    "nawyId": 1149,
    "nawyUrl": "https://www.nawy.com/compound/1149-rock-gold",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "rock-gold-1",
        "label": "20% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 6 years equal installments"
  },
  "rock-vera": {
    "nawyId": 1392,
    "nawyUrl": "https://www.nawy.com/compound/1392-rock-vera",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "rock-vera-1",
        "label": "7.5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 7.5,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 7.5% down · 8 years equal installments"
  },
  "sadaf": {
    "nawyId": 2348,
    "nawyUrl": "https://www.nawy.com/compound/2348-sadaf",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "sadaf-1",
        "label": "5% down · 5% after 3 months · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "sadaf-2",
        "label": "10% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 5% after 3 months · 10 years equal installments | 10% down · 10 years equal installments"
  },
  "safa-medi-plex-phase-2": {
    "nawyId": 2521,
    "nawyUrl": "https://www.nawy.com/compound/2521-safa-medi-plex-phase-2",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "safa-medi-plex-phase-2-1",
        "label": "10% down · 5% on delivery · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Nawy",
        "deliveryPct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "salt-marina": {
    "nawyId": 2494,
    "nawyUrl": "https://www.nawy.com/compound/2494-salt-marina",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "salt-marina-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "sarai": {
    "nawyId": 147,
    "nawyUrl": "https://www.nawy.com/compound/147-sarai",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "sarai-1",
        "label": "15% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "sarai-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "sarai-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 11
      },
      {
        "id": "sarai-4",
        "label": "35% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "sarai-5",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 16
      },
      {
        "id": "sarai-6",
        "label": "55% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 17
      }
    ],
    "text": "Per Nawy (Nov 2026): 15% down · 10 years equal installments | 30% down · 6 years equal installments | 35% down · 6 years equal installments"
  },
  "sealine-seashore": {
    "nawyId": 2381,
    "nawyUrl": "https://www.nawy.com/compound/2381-sealine-seashore",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "sealine-seashore-1",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 5% after 3 months · 8 years equal installments"
  },
  "seashell-ras-el-hekma": {
    "nawyId": 376,
    "nawyUrl": "https://www.nawy.com/compound/376-seashell-ras-el-hekma",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "seashell-ras-el-hekma-1",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      },
      {
        "id": "seashell-ras-el-hekma-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "seashell-ras-el-hekma-3",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "seashell-ras-el-hekma-4",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "seashell-ras-el-hekma-5",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "seashell-ras-el-hekma-6",
        "label": "5% down · 7 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 6 years equal installments | 35% down · 6 years equal installments | 35% down · 5 years equal installments"
  },
  "seazen": {
    "nawyId": 752,
    "nawyUrl": "https://www.nawy.com/compound/752-seazen",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "seazen-1",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "seazen-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "seazen-3",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "seazen-4",
        "label": "75% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 6 years equal installments | 35% down · 6 years equal installments"
  },
  "selina-carnelia": {
    "nawyId": 2331,
    "nawyUrl": "https://www.nawy.com/compound/2331-selina-carnelia",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "selina-carnelia-1",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "sheya-residence": {
    "nawyId": 1242,
    "nawyUrl": "https://www.nawy.com/compound/1242-sheya-residence",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "sheya-residence-1",
        "label": "2.5% down · 12 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "sheya-residence-2",
        "label": "5% down · 12 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 2.5% down · 12 years (Back Loaded) | 5% down · 12 years equal installments"
  },
  "silversands": {
    "nawyId": 530,
    "nawyUrl": "https://www.nawy.com/compound/530-silversands",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "silversands-1",
        "label": "15% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15.0,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "silversands-2",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "silversands-3",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "silversands-4",
        "label": "35% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "silversands-5",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "silversands-6",
        "label": "55% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 14
      }
    ],
    "text": "Per Nawy (Nov 2026): 15% down · 6 years equal installments | 25% down · 7 years equal installments | 25% down · 6 years equal installments"
  },
  "sky-condos": {
    "nawyId": 654,
    "nawyUrl": "https://www.nawy.com/compound/654-sky-condos",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "sky-condos-1",
        "label": "5% down · 10 years (Front Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Front Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "sky-condos-2",
        "label": "95% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 10 years (Front Loaded)"
  },
  "sodic-east": {
    "nawyId": 176,
    "nawyUrl": "https://www.nawy.com/compound/176-sodic-east",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "sodic-east-1",
        "label": "10% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "sodic-east-2",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "sodic-east-3",
        "label": "40% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "sodic-east-4",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 10 years equal installments | 25% down · 7 years equal installments"
  },
  "solana-east": {
    "nawyId": 1077,
    "nawyUrl": "https://www.nawy.com/compound/1077-solana-east",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "solana-east-1",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "solana-east-2",
        "label": "45% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "solana-east-3",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ]
  },
  "solare": {
    "nawyId": 929,
    "nawyUrl": "https://www.nawy.com/compound/929-solare",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "solare-1",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "solare-2",
        "label": "30% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "solare-3",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "solare-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "solare-5",
        "label": "40% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "solare-6",
        "label": "60% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 7 years equal installments | 30% down · 8 years equal installments | 30% down · 6 years equal installments"
  },
  "soul": {
    "nawyId": 758,
    "nawyUrl": "https://www.nawy.com/compound/758-soul",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "soul-1",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "soul-2",
        "label": "85% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "soul-3",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "soul-4",
        "label": "5% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 6 years equal installments"
  },
  "stella-heights": {
    "nawyId": 956,
    "nawyUrl": "https://www.nawy.com/compound/956-stella-heights",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "stella-heights-1",
        "label": "70% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "stella-heights-2",
        "label": "80% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "stella-heights-3",
        "label": "5% down · 7 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "stoda": {
    "nawyId": 1445,
    "nawyUrl": "https://www.nawy.com/compound/1445-stoda",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "stoda-1",
        "label": "20% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "stoda-2",
        "label": "45% down · 9 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "stoda-3",
        "label": "45% down · 8 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 10 years equal installments"
  },
  "stone-residence": {
    "nawyId": 410,
    "nawyUrl": "https://www.nawy.com/compound/410-stone-residence",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "stone-residence-1",
        "label": "2.5% down · 2% after 3 months · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 2,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "stone-residence-2",
        "label": "20% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 5,
        "source": "Nawy",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "stone-residence-3",
        "label": "85% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "stone-residence-4",
        "label": "85% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "sun-capital": {
    "nawyId": 210,
    "nawyUrl": "https://www.nawy.com/compound/210-sun-capital",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "sun-capital-1",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "sun-capital-2",
        "label": "35% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "sun-capital-3",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "sun-capital-4",
        "label": "70% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "sun-capital-5",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 8 years equal installments | 35% down · 7 years equal installments"
  },
  "swanlake-residences-new-cairo": {
    "nawyId": 278,
    "nawyUrl": "https://www.nawy.com/compound/278-swanlake-residences",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "swanlake-residences-new-cairo-1",
        "label": "25% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "swanlake-residences-new-cairo-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "swanlake-residences-new-cairo-3",
        "label": "45% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "swanlake-residences-new-cairo-4",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "swanlake-residences-new-cairo-5",
        "label": "5% down · 10 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 4 years equal installments | 35% down · 6 years equal installments"
  },
  "taj-city": {
    "nawyId": 186,
    "nawyUrl": "https://www.nawy.com/compound/186-taj-city",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "taj-city-1",
        "label": "20% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      },
      {
        "id": "taj-city-2",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "taj-city-3",
        "label": "35% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "taj-city-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "taj-city-5",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 11
      },
      {
        "id": "taj-city-6",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 14
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 10 years equal installments | 30% down · 7 years equal installments | 35% down · 7 years equal installments"
  },
  "talala": {
    "nawyId": 1588,
    "nawyUrl": "https://www.nawy.com/compound/1588-talala",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "talala-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "talala-2",
        "label": "15% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "talala-3",
        "label": "20% down · 11 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 11,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "talala-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "talala-5",
        "label": "50% down · 8 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "talala-6",
        "label": "50% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "telal-east": {
    "nawyId": 939,
    "nawyUrl": "https://www.nawy.com/compound/939-telal-east",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "telal-east-1",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "telal-east-2",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "telal-east-3",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "telal-east-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "telal-east-5",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      },
      {
        "id": "telal-east-6",
        "label": "65% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 65,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      }
    ]
  },
  "telal-shores": {
    "nawyId": 1028,
    "nawyUrl": "https://www.nawy.com/compound/1028-telal-shores",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "telal-shores-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "telal-shores-2",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "telal-shores-3",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "telal-sokhna": {
    "nawyId": 87,
    "nawyUrl": "https://www.nawy.com/compound/87-telal-sokhna",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "telal-sokhna-1",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "telal-sokhna-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "telal-sokhna-3",
        "label": "70% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "telal-sokhna-4",
        "label": "80% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 6 years equal installments | 35% down · 6 years equal installments"
  },
  "telal-soul": {
    "nawyId": 1632,
    "nawyUrl": "https://www.nawy.com/compound/1632-telal-soul",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "telal-soul-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "telal-soul-2",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "the-brooks": {
    "nawyId": 543,
    "nawyUrl": "https://www.nawy.com/compound/543-the-brooks",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "the-brooks-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "the-brooks-2",
        "label": "20% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "the-brooks-3",
        "label": "70% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "the-brooks-4",
        "label": "75% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ]
  },
  "the-butterfly": {
    "nawyId": 1287,
    "nawyUrl": "https://www.nawy.com/compound/1287-the-butterfly",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "the-butterfly-1",
        "label": "2.5% down · 12 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "the-butterfly-2",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "the-butterfly-3",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "the-butterfly-4",
        "label": "65% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 65,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "the-gate-new-alamein": {
    "nawyId": 294,
    "nawyUrl": "https://www.nawy.com/compound/294-the-gate-new-alamein",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "the-gate-new-alamein-1",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "the-gate-new-alamein-2",
        "label": "95% down · 1 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 1,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "the-gate-new-alamein-3",
        "label": "5% down · 7 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 7,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "the-gray-laguna-the-boulevard": {
    "nawyId": 2503,
    "nawyUrl": "https://www.nawy.com/compound/2503-the-gray-laguna-the-boulevard",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "the-gray-laguna-the-boulevard-1",
        "label": "5% down · 5% after 3 months · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "the-gray-laguna-the-boulevard-2",
        "label": "5% down · 5% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "the-hillage": {
    "nawyId": 2139,
    "nawyUrl": "https://www.nawy.com/compound/2139-The Hillage",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "the-hillage-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "the-hillage-2",
        "label": "5% down · 5% after 6 months · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "month6Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 10 years equal installments | 5% down · 5% after 6 months · 10 years equal installments"
  },
  "the-islands": {
    "nawyId": 1302,
    "nawyUrl": "https://www.nawy.com/compound/1302-the-islands",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "the-islands-1",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "the-islands-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "the-islands-3",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "the-islands-4",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 7 years equal installments | 30% down · 6 years equal installments | 35% down · 5 years equal installments"
  },
  "the-lynks": {
    "nawyId": 2342,
    "nawyUrl": "https://www.nawy.com/compound/2342-lynks",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "the-lynks-1",
        "label": "5% down · 5% after 3 months · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 5% after 3 months · 10 years equal installments"
  },
  "the-med": {
    "nawyId": 761,
    "nawyUrl": "https://www.nawy.com/compound/761-the-med",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "the-med-1",
        "label": "7.5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 7.5,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 13
      },
      {
        "id": "the-med-2",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "the-med-3",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "the-med-4",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 7.5% down · 10 years equal installments | 30% down · 7 years equal installments"
  },
  "the-mornings": {
    "nawyId": 1526,
    "nawyUrl": "https://www.nawy.com/compound/1526-the-mornings",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "the-mornings-1",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "the-mornings-2",
        "label": "30% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "the-mornings-3",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 6 years equal installments"
  },
  "the-valleys-mostakbal-city": {
    "nawyId": 1040,
    "nawyUrl": "https://www.nawy.com/compound/1040-the-valleys",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "the-valleys-mostakbal-city-1",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "the-valleys-mostakbal-city-2",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "the-valleys-mostakbal-city-3",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      }
    ],
    "text": "Per Nawy (Nov 2026): 35% down · 5 years equal installments"
  },
  "the-waterway-new-cairo": {
    "nawyId": 11,
    "nawyUrl": "https://www.nawy.com/compound/11-the-waterway-new-cairo",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "the-waterway-new-cairo-1",
        "label": "30% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "the-waterway-new-cairo-2",
        "label": "75% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "the-waterway-new-cairo-3",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 4 years equal installments"
  },
  "trio": {
    "nawyId": 204,
    "nawyUrl": "https://www.nawy.com/compound/204-trio",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "trio-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "trio-2",
        "label": "10% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "trio-3",
        "label": "50% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "trio-4",
        "label": "70% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ]
  },
  "uptown-cairo": {
    "nawyId": 4,
    "nawyUrl": "https://www.nawy.com/compound/4-uptown-cairo",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "uptown-cairo-1",
        "label": "45% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "uptown-cairo-2",
        "label": "55% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "uptown-cairo-3",
        "label": "5% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "v-levels": {
    "nawyId": 909,
    "nawyUrl": "https://www.nawy.com/compound/909-v-levels",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "v-levels-1",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "v-levels-2",
        "label": "80% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "v-levels-3",
        "label": "10% down · 6 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 6,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "v40-district": {
    "nawyId": 1920,
    "nawyUrl": "https://www.nawy.com/compound/1920-v40-district",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "v40-district-1",
        "label": "2.5% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "v40-district-2",
        "label": "5% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 2.5% down · 9 years equal installments | 5% down · 5 years equal installments"
  },
  "vea-new-cairo": {
    "nawyId": 1969,
    "nawyUrl": "https://www.nawy.com/compound/1969-VÉA",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "vea-new-cairo-1",
        "label": "2.5% down · 2% after 3 months · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 2,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "vea-new-cairo-2",
        "label": "2.5% down · 2% after 3 months · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 2,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 2.5% down · 2% after 3 months · 10 years equal installments | 2.5% down · 2% after 3 months · 8 years equal installments"
  },
  "vie-collective": {
    "nawyId": 2098,
    "nawyUrl": "https://www.nawy.com/compound/2098-Vie Collective",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "vie-collective-1",
        "label": "10% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "vie-collective-2",
        "label": "10% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "vie-collective-3",
        "label": "10% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "vie-halo": {
    "nawyId": 2267,
    "nawyUrl": "https://www.nawy.com/compound/2267-Vie-Halo",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "vie-halo-1",
        "label": "10% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "village-de-la-capitale": {
    "nawyId": 1977,
    "nawyUrl": "https://www.nawy.com/compound/1977-VILLAGE DE LA CAPITALE",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "village-de-la-capitale-1",
        "label": "2.5% down · 12 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "village-de-la-capitale-2",
        "label": "15% down · 11 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15.0,
        "years": 11,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 2.5% down · 12 years (Back Loaded) | 15% down · 11 years equal installments"
  },
  "village-west": {
    "nawyId": 391,
    "nawyUrl": "https://www.nawy.com/compound/391-village-west",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "village-west-1",
        "label": "15% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "village-west-2",
        "label": "60% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "village-west-3",
        "label": "75% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      }
    ]
  },
  "villette": {
    "nawyId": 23,
    "nawyUrl": "https://www.nawy.com/compound/23-villette",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "villette-1",
        "label": "75% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "villette-2",
        "label": "95% down · 1 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 1,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "vinci": {
    "nawyId": 252,
    "nawyUrl": "https://www.nawy.com/compound/252-vinci",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "vinci-1",
        "label": "0% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 0.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "vinci-2",
        "label": "5% down · 10% after 3 months · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 9,
        "source": "Nawy",
        "month3Pct": 10,
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "vinci-3",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "vinci-4",
        "label": "60% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 0% down · 10 years equal installments | 5% down · 10% after 3 months · 9 years equal installments"
  },
  "vye-sodic": {
    "nawyId": 336,
    "nawyUrl": "https://www.nawy.com/compound/336-vye-sodic",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "vye-sodic-1",
        "label": "35% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "vye-sodic-2",
        "label": "55% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "vye-sodic-3",
        "label": "60% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      }
    ]
  },
  "w-signature": {
    "nawyId": 1143,
    "nawyUrl": "https://www.nawy.com/compound/1143-w-signature",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "w-signature-1",
        "label": "10% down · 10% on delivery · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Nawy",
        "deliveryPct": 10,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "w-signature-2",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "w-signature-3",
        "label": "70% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ]
  },
  "w55": {
    "nawyId": 2074,
    "nawyUrl": "https://www.nawy.com/compound/2074-W55",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "w55-1",
        "label": "10% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "youd": {
    "nawyId": 1671,
    "nawyUrl": "https://www.nawy.com/compound/1671-youd",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "youd-1",
        "label": "20% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "youd-2",
        "label": "25% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "youd-3",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "youd-4",
        "label": "55% down · 8 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "youd-5",
        "label": "90% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 8 years equal installments | 25% down · 9 years equal installments | 25% down · 8 years equal installments"
  },
  "zed-east": {
    "nawyId": 345,
    "nawyUrl": "https://www.nawy.com/compound/345-zed-east",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "zed-east-1",
        "label": "20% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "zed-east-2",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "zed-east-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "zed-east-4",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "zed-east-5",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      },
      {
        "id": "zed-east-6",
        "label": "70% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 70,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 7 years equal installments | 25% down · 7 years equal installments | 35% down · 6 years equal installments"
  },
  "zomra-east": {
    "nawyId": 1631,
    "nawyUrl": "https://www.nawy.com/compound/1631-zomra-east",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "zomra-east-1",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "zomra-east-2",
        "label": "20% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "zomra-east-3",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 8 years equal installments | 20% down · 10 years equal installments | 25% down · 7 years equal installments"
  },
  "alburouj": {
    "nawyId": 219,
    "nawyUrl": "https://www.nawy.com/compound/219-al-burouj",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "alburouj-1",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "alburouj-2",
        "label": "30% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "alburouj-3",
        "label": "40% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "alburouj-4",
        "label": "55% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 6 years equal installments | 30% down · 5 years equal installments"
  },
  "azzar-islands": {
    "nawyId": 716,
    "nawyUrl": "https://www.nawy.com/compound/716-azzar--island",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "azzar-islands-1",
        "label": "55% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "azzar-islands-2",
        "label": "60% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "azzar-islands-3",
        "label": "5% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "beachfront-towers": {
    "nawyId": 1228,
    "nawyUrl": "https://www.nawy.com/compound/1228-beach-front-towers",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "beachfront-towers-1",
        "label": "40% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "beachfront-towers-2",
        "label": "60% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "beachfront-towers-new-alamein": {
    "nawyId": 1228,
    "nawyUrl": "https://www.nawy.com/compound/1228-beach-front-towers",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "beachfront-towers-new-alamein-1",
        "label": "40% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "beachfront-towers-new-alamein-2",
        "label": "60% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "chapters-residence": {
    "nawyId": 2307,
    "nawyUrl": "https://www.nawy.com/compound/2307-jadeer-r8-new-capital",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "chapters-residence-1",
        "label": "5% down · 5% after 3 months · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "month3Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "chapters-residence-2",
        "label": "20% down · 12 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 5% after 3 months · 10 years equal installments | 20% down · 12 years equal installments"
  },
  "club-views": {
    "nawyId": 1421,
    "nawyUrl": "https://www.nawy.com/compound/1421-club-views-sarai",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "club-views-1",
        "label": "0% down · 12 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 0.0,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "club-views-2",
        "label": "2.5% down · 12 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "club-views-3",
        "label": "5% down · 12 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 0% down · 12 years equal installments | 2.5% down · 12 years (Back Loaded) | 5% down · 12 years equal installments"
  },
  "creek-town": {
    "nawyId": 462,
    "nawyUrl": "https://www.nawy.com/compound/462-creektown",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "creek-town-1",
        "label": "10% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "creek-town-2",
        "label": "15% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "creek-town-3",
        "label": "65% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 65,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "creek-town-4",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      }
    ]
  },
  "el-patio-townside": {
    "nawyId": 2701,
    "nawyUrl": "https://www.nawy.com/compound/2701-el-patio-town-side",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "el-patio-townside-1",
        "label": "5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "el-patio-townside-2",
        "label": "12.5% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 12.5,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "elm-tree-park": {
    "nawyId": 1866,
    "nawyUrl": "https://www.nawy.com/compound/1866-elm-tree-sarai",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "elm-tree-park-1",
        "label": "2.5% down · 12 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "elm-tree-park-2",
        "label": "12.5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 12.5,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 2.5% down · 12 years (Back Loaded) | 12.5% down · 10 years equal installments"
  },
  "marbay-ras-el-hekma": {
    "nawyId": 1212,
    "nawyUrl": "https://www.nawy.com/compound/1212-mar-bay-ras-el-hekma",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "marbay-ras-el-hekma-1",
        "label": "25% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "marbay-ras-el-hekma-2",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 13
      },
      {
        "id": "marbay-ras-el-hekma-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 33
      },
      {
        "id": "marbay-ras-el-hekma-4",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "marbay-ras-el-hekma-5",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 13
      },
      {
        "id": "marbay-ras-el-hekma-6",
        "label": "45% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      }
    ]
  },
  "marresidence": {
    "nawyId": 2316,
    "nawyUrl": "https://www.nawy.com/compound/2316-marresidence",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "marresidence-1",
        "label": "7.5% down · 8% on delivery · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 7.5,
        "years": 8,
        "source": "Nawy",
        "deliveryPct": 8,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 7.5% down · 8% on delivery · 8 years equal installments"
  },
  "marville": {
    "nawyId": 1027,
    "nawyUrl": "https://www.nawy.com/compound/1027-mar-ville",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "marville-1",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "marville-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "marville-3",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 5
      },
      {
        "id": "marville-4",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 7 years equal installments | 35% down · 6 years equal installments"
  },
  "monte-napoleone": {
    "nawyId": 535,
    "nawyUrl": "https://www.nawy.com/compound/535-montenapoleone",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "monte-napoleone-1",
        "label": "30% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "monte-napoleone-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "monte-napoleone-3",
        "label": "75% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "monte-napoleone-4",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 30% down · 4 years equal installments | 35% down · 6 years equal installments"
  },
  "mountain-view-chillout": {
    "nawyId": 423,
    "nawyUrl": "https://www.nawy.com/compound/423-mountain-view-chillout-park",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mountain-view-chillout-1",
        "label": "10% down · 5% after 6 months · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Nawy",
        "month6Pct": 5,
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mountain-view-chillout-2",
        "label": "85% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 85,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "mountain-view-chillout-3",
        "label": "90% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ]
  },
  "mountain-view-mv4": {
    "nawyId": 800,
    "nawyUrl": "https://www.nawy.com/compound/800-mountain-view-4",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "mountain-view-mv4-1",
        "label": "10% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mountain-view-mv4-2",
        "label": "60% down · 7 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "mountain-view-mv4-3",
        "label": "75% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 6 years equal installments"
  },
  "sodic-the-estates": {
    "nawyId": 310,
    "nawyUrl": "https://www.nawy.com/compound/310-the-estates",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "sodic-the-estates-1",
        "label": "10% down · 5% after 6 months · 10 years (Front Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 10,
        "source": "Nawy",
        "month6Pct": 5,
        "installmentType": "Front Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "sodic-the-estates-2",
        "label": "80% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 80,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "sodic-the-estates-3",
        "label": "95% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ],
    "text": "Per Nawy (Nov 2026): 10% down · 5% after 6 months · 10 years (Front Loaded)"
  },
  "south-med": {
    "nawyId": 1198,
    "nawyUrl": "https://www.nawy.com/compound/1198-southmed",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "south-med-1",
        "label": "20% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 32
      },
      {
        "id": "south-med-2",
        "label": "25% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 37
      },
      {
        "id": "south-med-3",
        "label": "30% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 13
      },
      {
        "id": "south-med-4",
        "label": "35% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 26
      },
      {
        "id": "south-med-5",
        "label": "40% down · 10 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 6
      },
      {
        "id": "south-med-6",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 10 years equal installments | 25% down · 10 years equal installments | 30% down · 10 years equal installments"
  },
  "swanlake-west": {
    "nawyId": 386,
    "nawyUrl": "https://www.nawy.com/compound/386-swan-lake-west",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "swanlake-west-1",
        "label": "12.5% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 12.5,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 14
      },
      {
        "id": "swanlake-west-2",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "swanlake-west-3",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 12.5% down · 9 years equal installments"
  },
  "zed-towers": {
    "nawyId": 822,
    "nawyUrl": "https://www.nawy.com/compound/822-zed-tower",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "zed-towers-1",
        "label": "35% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "zed-towers-2",
        "label": "45% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "zed-towers-3",
        "label": "55% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "zed-towers-4",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ],
    "text": "Per Nawy (Nov 2026): 35% down · 8 years equal installments"
  },
  "aliva": {
    "nawyId": 996,
    "nawyUrl": "https://www.nawy.com/compound/996-aliva-mountain-view-mostakbal-city",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "aliva-1",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 11
      },
      {
        "id": "aliva-2",
        "label": "30% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 8
      },
      {
        "id": "aliva-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      },
      {
        "id": "aliva-4",
        "label": "35% down · 5 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 9
      },
      {
        "id": "aliva-5",
        "label": "45% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 28
      },
      {
        "id": "aliva-6",
        "label": "50% down · 5 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 5,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 21
      }
    ],
    "text": "Per Nawy (Nov 2026): 25% down · 8 years equal installments | 30% down · 7 years equal installments | 35% down · 6 years equal installments"
  },
  "hyde-park-north-seashore": {
    "nawyId": 522,
    "nawyUrl": "https://www.nawy.com/compound/522-hyde-park-north-seashore",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "hyde-park-north-seashore-1",
        "label": "20% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      },
      {
        "id": "hyde-park-north-seashore-2",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 7
      },
      {
        "id": "hyde-park-north-seashore-3",
        "label": "30% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 14
      },
      {
        "id": "hyde-park-north-seashore-4",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 29
      },
      {
        "id": "hyde-park-north-seashore-5",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 20
      },
      {
        "id": "hyde-park-north-seashore-6",
        "label": "45% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 45,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 15
      }
    ],
    "text": "Per Nawy (Nov 2026): 20% down · 7 years equal installments | 25% down · 8 years equal installments | 30% down · 6 years equal installments"
  },
  "palm-hills-jirian": {
    "nawyId": 1546,
    "nawyUrl": "https://www.nawy.com/compound/1546-jirian-palm-hills",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "palm-hills-jirian-1",
        "label": "12.5% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 12.5,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "palm-hills-jirian-2",
        "label": "20% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "palm-hills-jirian-3",
        "label": "20% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "palm-hills-jirian-4",
        "label": "25% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      }
    ],
    "text": "Per Nawy (Nov 2026): 12.5% down · 8 years equal installments | 20% down · 8 years equal installments | 20% down · 7 years equal installments"
  },
  "zoya": {
    "nawyId": 238,
    "nawyUrl": "https://www.nawy.com/compound/238-zoya-ghazala-bay",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "zoya-1",
        "label": "5% down · 5% after 3 months · 10% on delivery · 8 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 8,
        "source": "Nawy",
        "month3Pct": 5,
        "deliveryPct": 10,
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "zoya-2",
        "label": "10% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "zoya-3",
        "label": "10% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "zoya-4",
        "label": "30% down · 4 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "zoya-5",
        "label": "55% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 55,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "zoya-6",
        "label": "75% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 75,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 5% down · 5% after 3 months · 10% on delivery · 8 years (Back Loaded) | 10% down · 7 years equal installments | 10% down · 6 years equal installments"
  },
  "101-premium-compound": {
    "nawyId": 1223,
    "nawyUrl": "https://www.nawy.com/compound/1223-the-101",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "101-premium-compound-1",
        "label": "20% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "101-premium-compound-2",
        "label": "20% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "101-premium-compound-3",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      },
      {
        "id": "101-premium-compound-4",
        "label": "40% down · 8 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "101-premium-compound-5",
        "label": "40% down · 6 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 40,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "bamboo-iii": {
    "nawyId": 1636,
    "nawyUrl": "https://www.nawy.com/compound/1636-bamboo-lll",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "bamboo-iii-1",
        "label": "5% down · 10 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 10,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "bamboo-iii-2",
        "label": "15% down · 9 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 15.0,
        "years": 9,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "bamboo-iii-3",
        "label": "25% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 25,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "bamboo-iii-4",
        "label": "30% down · 8 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 30,
        "years": 8,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "bamboo-iii-5",
        "label": "95% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 95,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ]
  },
  "caesar-sodic": {
    "nawyId": 21,
    "nawyUrl": "https://www.nawy.com/compound/21-caesar",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "caesar-sodic-1",
        "label": "60% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "caesar-sodic-2",
        "label": "10% down · 8 years equal installments (previous site data, not on Nawy)",
        "kind": "launch",
        "type": "installment",
        "downPaymentPct": 10.0,
        "years": 8,
        "source": "Property Atlas (previous)"
      }
    ]
  },
  "elan": {
    "nawyId": 1239,
    "nawyUrl": "https://www.nawy.com/compound/1239-elan",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "elan-1",
        "label": "2.5% down · 12 years (Back Loaded)",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 2.5,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Back Loaded",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "elan-2",
        "label": "5% down · 12 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 5.0,
        "years": 12,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      }
    ],
    "text": "Per Nawy (Nov 2026): 2.5% down · 12 years (Back Loaded) | 5% down · 12 years equal installments"
  },
  "il-latini-city-edge": {
    "nawyId": 493,
    "nawyUrl": "https://www.nawy.com/compound/493-il-latini-sed",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "il-latini-city-edge-1",
        "label": "20% down · 7 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 20,
        "years": 7,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "il-latini-city-edge-2",
        "label": "35% down · 6 years equal installments",
        "kind": "developer",
        "type": "installment",
        "downPaymentPct": 35,
        "years": 6,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 1
      },
      {
        "id": "il-latini-city-edge-3",
        "label": "50% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 4
      },
      {
        "id": "il-latini-city-edge-4",
        "label": "60% down · 4 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 60,
        "years": 4,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      }
    ]
  },
  "north-edge-towers": {
    "nawyId": 231,
    "nawyUrl": "https://www.nawy.com/compound/231-north-edge-new-alamein",
    "verifiedAt": "2026-11-25",
    "plans": [
      {
        "id": "north-edge-towers-1",
        "label": "50% down · 3 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 50,
        "years": 3,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 2
      },
      {
        "id": "north-edge-towers-2",
        "label": "90% down · 2 years equal installments",
        "kind": "resale",
        "type": "installment",
        "downPaymentPct": 90,
        "years": 2,
        "source": "Nawy",
        "installmentType": "Equal",
        "approximate": true,
        "nawyUnits": 3
      }
    ]
  }
};
