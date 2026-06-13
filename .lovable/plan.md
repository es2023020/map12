
# PropTrack — Build Plan

A professional real-estate intelligence web app for Egyptian brokers. Design draws from Nawy (clean property cards), Property Finder (filter UX), Wikimapia/Google Maps (interactive maps), and Property Advisor (data density).

## Visual direction
- **Identity**: Coastal premium. Deep navy + sand + turquoise accent; serif display headings (Fraunces) + clean sans (Inter). Not generic SaaS purple.
- **Map-first**: Map is the hero. Smooth pan/zoom, custom pins, hover previews, area filters, cluster behavior.
- **Density done right**: Project cards show price-from, delivery, developer, beachfront badge — like Nawy but tighter.

## Pages / routes
| Route | Purpose |
|---|---|
| `/` | Landing — hero, featured compounds, areas, value props |
| `/map` | Full-screen interactive map (Sahel + New Cairo + Sheikh Zayed + Tagamo3) with sidebar list, filters, area chips |
| `/projects` | Searchable grid of all compounds — filters (area, developer, price, delivery, type) |
| `/projects/$slug` | Full compound detail — gallery, location mini-map, developer, unit types, payment plans, amenities, nearby |
| `/areas` | All areas index (Sahel zones + Cairo zones) |
| `/areas/$slug` | Area detail with all its compounds on a map |
| `/developers` | Developer index |
| `/developers/$slug` | Developer detail + their projects |
| `/dashboard` | Broker workspace — saved leads, favorited compounds, recent searches, market pulse |
| `/dashboard/leads` | Lead pipeline (kanban: New → Contacted → Viewing → Negotiating → Closed) |
| `/dashboard/favorites` | Saved compounds |
| `/dashboard/compare` | Side-by-side compound comparison |
| `/admin` | Subscription plans table, broker accounts (placeholder data) |
| `/auth` | Sign in / sign up (local for v1) |

## Data
- **Sahel compounds**: All 80+ from the provided map, with km marker, area (Sidi Heneish, Ras El Hekma, Al Dabaa, Ghazala Bay, Sidi Abdelrahman, New Alamein), developer, price range, delivery year, beachfront yes/no.
- **Cairo zones**: 30+ compounds across New Cairo (Tagamo3), Sheikh Zayed, with same schema.
- **Coordinates**: Derived from km markers along the Mediterranean coastline (lerp between Alexandria→Marsa Matrouh anchors) for Sahel; real lat/lng for Cairo zones.
- All in `src/data/compounds.ts`, `src/data/areas.ts`, `src/data/developers.ts`.

## Tech
- **Map**: Leaflet + OpenStreetMap tiles (no API key, free, smooth) + react-leaflet. Marker clustering, area polygons, custom branded pins.
- **State**: Zustand for broker favorites/leads (localStorage-persisted).
- **Auth**: Mock local auth in v1 (sign-in stored locally). Real Lovable Cloud auth can be wired later — happy to do that as a follow-up.
- **UI**: shadcn + Tailwind, semantic tokens defined in `src/styles.css`.

## Out of scope for v1
- Real authentication backend (mocked locally — easily upgraded to Lovable Cloud).
- Payment integration for the admin subscription panel (UI only).
- Real-time lead notifications.

## Build order
1. Design system tokens + fonts in `styles.css`.
2. Compound + area + developer data files.
3. App shell (top nav, footer) + landing page.
4. Map page with all pins, area filter, sidebar list.
5. Project library + detail page (with mini-map).
6. Area + developer index/detail pages.
7. Broker dashboard (favorites, leads kanban, compare).
8. Admin subscriptions placeholder.
9. Mock auth + persistence.
10. SEO meta on every route + sitemap.

Shipping now — I'll build the whole thing in one pass.
