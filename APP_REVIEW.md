# Property Atlas — Full App Review

**Reviewed:** 22 Nov 2026 · commit `2677ec3` (main) · ~221k LOC in `src/` (152k of it one generated data file)
**Scope:** every route, the CRM, the admin panel, all server endpoints, the data pipeline, build/deploy config.
**Method:** full source read, built-bundle inspection, type-check, live deployment check, and the public GitHub repo.

---

## 1. Verdict and rating

There are two honest ways to rate this, because they are two different products.

| | Score | Why |
|---|---|---|
| **As a prototype / demo** | **7.5 / 10** | Enormous, genuinely impressive breadth. Real data at real scale. A coherent design system. It *looks* like a funded product. |
| **As a shippable business** | **3 / 10** | No real auth, no database, no payments, no tests, the flagship feature is switched off, and the admin password is published on GitHub. It cannot be sold or safely deployed today. |
| **Overall** | **4.5 / 10** | Great raw material, wrong foundation. |

**The single most important context:** the app is **not live**. The homepage recorded in the repo (`https://map12-woad.vercel.app`) returns `404 — deployment could not be found`. So this is not a review of a running product with some bugs; it is a review of a very large, never-launched local project. That is actually good news: nothing is at risk yet, and you still get to choose the foundation before customers arrive.

### Scorecard

| Dimension | Score | Note |
|---|---|---|
| Product vision & feature breadth | 8/10 | Covers more than most funded Egyptian proptech tools |
| Real data asset | 7/10 | 360 compounds, 135 developers, 244 projects, 10k units — but dirty |
| UX / visual design | 7/10 | Coherent tokens, good typography, real craft |
| Frontend performance | 2/10 | **4.06 MB** entry JS chunk; 2.87 GB of assets in `/public` |
| Backend & data architecture | 2/10 | Files are the database; the repo is written to at runtime |
| Security & privacy | 1/10 | Unauthenticated destructive APIs; plaintext passwords in a public repo |
| Code maintainability | 3/10 | 5,515-line `admin.tsx`, ~280 `any`s, no tests, `tsc` fails |
| Launch readiness | 2/10 | Deployment dead, map gated, contact form discards input |

---

## 2. The five things that are actually blocking

These are not "improvements". Each one independently prevents launch or creates real liability.

### 2.1 Your admin password is public on GitHub — rotate it today

`src/data/users.generated.ts` is committed and contains:

```ts
{ "email": "elsayedshoeip70@gmail.com", "password": "[REDACTED]", "tier": "BrokerageAdmin" }
```

That file is also **imported into the client bundle** (`store.ts:501`), so every visitor downloads it, and it is persisted to `localStorage`. The same password is hardcoded in the admin login (`admin.tsx:117-118`). The repo is **public** (`api.github.com/repos/es2023020/map12` → `"private": false`), forked freely.

**That is a personal Gmail account with a published password.** Rotate it now, enable 2FA, make the repo private, and do not assume deleting the line is enough — it is in git history and in caches. Treat it as compromised.

The same applies to `src/lib/wikimapia.ts:3`, which ships a hardcoded third-party API key to the browser. Rotate or restrict it.

### 2.2 Every server endpoint is unauthenticated and several are destructive

There is no middleware, no session, no token check, no `beforeLoad` guard — **zero** across all six server routes.

| Endpoint | What an anonymous visitor can do |
|---|---|
| `POST /api/save-users` | **Replace the entire user database** (including injecting their own admin), then auto-`git push` it |
| `POST /api/save-database` | **Overwrite all compounds / destinations / availability**, then auto-`git push` |
| `POST /api/upload-asset` | **Write any file anywhere** — `fileName` is unsanitised and `path.join` normalises `..`, so `..\..\src\routes\x.ts` overwrites server code. No type check, no size cap |
| `GET /api/upload-asset` | Creates thousands of files and spawns Python |
| `GET/POST /api/whatsapp-inventory` | Leaks the full pricing/intel pipeline; POST flips `autonomous_mode` and rewrites inventory |
| `POST /api/save-lead` | Unbounded anonymous writes of PII into `public/` — a **publicly downloadable** file |

Because handlers also `exec("git push origin main")` and `exec("python …")`, this is effectively remote code execution on any non-serverless host. On Vercel the writes fail with `EROFS` and the features simply 500 — which is why they were never noticed.

### 2.3 Authentication is cosmetic — there is no auth at all

`PasswordGate.tsx` is a literal no-op:

```tsx
export function PasswordGate({ children }: Props) {
  // Access bypass: immediately render children to disable password gate
  return <>{children}</>;
}
```

- Passwords are stored **in plaintext**, compared with `===` (`store.ts:628`), and any account with an empty password accepts *any* password.
- Sessions are a `sessionStorage` boolean. No cookie, no JWT, no server session.
- `/dashboard` has no guard — logged out, it renders as "Guest Broker".
- `checkLimit` returns **unlimited** when there is no user, so anonymous users can create unlimited leads.
- "Admin" is an email literal, checked in the browser. Type it into `localStorage` and you are admin.
- Signup lets the customer self-select `BrokerageAdmin` (listed at 1,499/mo) for free.

### 2.4 The flagship feature is switched off

The homepage's primary CTA is "Explore Interactive Map". `/map` checks `user.email === "elsayedshoeip70@gmail.com"` and shows everyone else **"Interactive Map Coming Soon"** (`map.tsx:86-122`).

"One Unified Map" is the headline promise, the hero image, and the product's only real differentiator. Every conversion path leads into a dead end.

Two more public pages are unconditional 404s — `agency-partnership.tsx:9` and `developer-partnership.tsx:9` both `throw notFound()` — and `/dashboard/ai-assistant` is a 332-line component behind the same 404.

### 2.5 The data quietly lies, and it is auto-applied without review

The pipeline writes **fabricated values as if they were facts**:

- `pdf-parser.py:84-88` — every unit parsed from every PDF gets `"beds": 3`, `"finishing": "Core & Shell"`, `"status": "Available"`.
- `excel-parser.ts:97-100` — beds guessed purely from property type.
- `excel-parser.ts:287-290` — defaults injected into real listings: view "Landscape", payment plan "10% DP · 8 years".
- `excel-parser.ts:56` — any price under 1000 is multiplied by a million.

And the reconciliation engine **marks inventory sold without confirmation** (`reconciliation.ts:123-129`, `:216-222`): any unit missing from a sheet is "Sold", any project missing from a "master" sheet is "SOLD OUT". The audit log already shows this misfiring:

```
"isProjectSoldOut":true, "status":"APPLIED"   ← from one unparsable Arabic message
"sourceId":"URGENT OFFER | LAST UNIT AT THIS PRICE!"
"projectsAffected":["urgent-offer-last-unit-at-this-price"]
```

`pending_reviews.json` currently has **`"autonomous_mode": true`**, so documents and texts are applied with no human approval. For a product whose entire value is *trustworthy availability*, this is the most dangerous design decision in the codebase.

---

## 3. Business perspective — what is NOT necessary

Ranked by how much money and pain cutting it saves. Total removable surface is roughly **30-40% of the app**.

### Cut outright

| Thing | Why it costs you | What to do |
|---|---|---|
| **The WhatsApp inventory engine** (`services/whatsapp-listener`, `scripts/inventory-engine`, ~10k LOC) | Unofficial WhatsApp Web automation via Baileys. Violates WhatsApp ToS → **number bans**, and the linked number is a business asset. It ingests developer-confidential pricing from 268 groups, then republishes it — inviting NDA/trade-secret claims and destroying developer relationships. It is also the source of the fabricated data above. | Delete from the shipped product. Replace with an authenticated manual upload + human approval queue. Keep the parsing helpers in a private, non-deployed tool if you must. |
| **2.37 GB of PDFs in `/public` and in git** | 148 brochures, one of them **94 MB** (`ogami.pdf`) — dangerously close to GitHub's 100 MB hard limit, and it makes a 2.8 GB repo. Developers gave you those PDFs to *distribute to brokers*, not to republish on a public clone. | Move to object storage (S3/Cloudflare R2/Cloudinary), serve with signed URLs. Keep the repo under ~50 MB. |
| **40 of the 56 UI components** | `sidebar.tsx` alone is 744 lines and is imported by nothing outside itself. Dead weight in audit, install, and cognitive load. | Delete unused `src/components/ui/*`, then turn on `noUnusedLocals`. |
| **~9 unused npm dependencies** | `html2canvas` and `jspdf` have **zero** references anywhere; `date-fns` likewise. `recharts`, `vaul`, `cmdk`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `react-hook-form` are reachable only through dead UI. 23 of 26 Radix packages are unused. | `npm uninstall` the dead set. This also removes supply-chain risk. |
| **Two partnership pages** | 490 lines that return 404. Nobody can see them. | Fold tiers into `/pricing` with one contact CTA, or delete. |
| **`/developer-announcements`** | Admin-only "Coming Soon" wrapper around a fake social feed with invented likes and comments. | Delete. It cannot be defended to a customer. |
| **`/dashboard/ai-assistant`** | Route throws 404; the component is dead code. It is not AI (rule-based budget matching) and the nav advertises "Local AI". | Delete, or ship it honestly as "Lead matcher". |
| **`/dashboard/maps`, `/dashboard/announcements`** | "Coming Soon" placeholders inside a paid product. | Delete until real. |
| **Simulated billing & team** | Fake invoices, `alert("Invoice downloaded (mock)")`, "Our bank reconciliation system approved transaction ref #…" for a payment that never happened, four contradictory price tables (299/499/1,499 vs 299/499/995 vs 0/299/599). | Remove every simulated money surface until a real gateway is connected. Shipping fake invoices to a paying broker is how you get refunded and reviewed badly. |
| **`/seo/$slug`** | Duplicates the destination filter pages, has no `head()` at all, and invents precise prices in FAQ text. | Delete or merge into `/destinations/*`. |
| **One-off scripts & research artifacts** | `process_all_inventories.py` (46 KB), `process_all_new_availability.py` (36 KB), `export-availability.ts` (writes a spreadsheet the importer never reads), `extract-images.py`, `fetch-nawy-*.py`, `build-locations.py`, `wikimapia-*`, `_pdf_locations.txt`, `_pdf_sahel.txt`, `replit.nix`, `docs/research/` (22 MB, referenced by nothing), `scratch/`, `.tanstack/`. | Archive to a `legacy/` branch or delete. They make a new developer's first day impossible. |
| **The Arabic tree, as it stands** | 6 routes, orphaned (no link from Navbar/Footer), serving internal QA banners ("مراجعة لهجة مصرية…") to production, with `<html lang="en">` on Arabic pages. Half-localised is worse than not localised. | Either finish it (Section 4) or `noindex` it until it is ready. Do not leave it in this state. |

### Also delete: the marketing numbers

The homepage says **380+** compounds, the about page says **328+**, the map description says **155+**, and the real count is **360**. `about.tsx` has a timeline where both entries are "2026" and a hardcoded "26" badge. Pick one number, compute it from the data, and delete the fabricated milestones. In a trust product, invented stats are the cheapest way to lose a broker.

---

## 4. Business perspective — what you NEED to add

Ordered. The first four are the difference between "demo" and "business".

### 4.1 Real identity and access (P0)

Right now a customer can become an admin in 10 seconds in devtools. You need:

- Server-side accounts: hashed passwords (argon2/bcrypt) or, better for this market, **magic-link / OTP login** — Egyptian brokers live on WhatsApp, not usually on passwords.
- A real session cookie (httpOnly, secure) and a server-side role check on every route and endpoint.
- Roles: `broker`, `brokerage_admin`, `platform_admin` — enforced **server-side**, not by comparing an email string.
- Email/phone verification before a lead pipeline is allowed to exist.

### 4.2 A real database (P0)

The app currently has **no database**. Leads, notes, tasks, campaigns, users, invoices all live in one browser's `localStorage`; the "shared" data lives in TypeScript files that requests overwrite and `git push`.

Consequences today: a broker's CRM dies with their browser cache; two devices are two different businesses; the public lead form writes to a file nobody reads.

Add Postgres (Supabase/Neon are the fast path) with:
- `tenants` (brokerage) → `users` → `leads` / `projects` / `availability`
- row-level tenancy so one brokerage can never read another's leads
- migrations in git, not generated `.ts` files

### 4.3 Real payments (P0)

There is no payment processor — the only reference is a commented-out `stripeSecretKey` placeholder. For Egypt, use **Paymob** or **Fawry** (Geidea as an alternative); Stripe is not a realistic primary for local merchants.

- Checkout session created server-side, price taken from the server, never from the client.
- **Webhook-verified** activation. Never upgrade a tier because a user uploaded a receipt image.
- Real invoices with sequential numbering, VAT treatment, and a downloadable PDF.
- Server-enforced limits (leads, seats, WhatsApp sends). Client-side counters are advice, not enforcement.

### 4.4 A lead loop that actually closes

The most damaging functional gap: **public lead capture and the broker CRM are two disconnected systems.** `projects.$slug.tsx:363` posts leads to `/api/save-lead`, which writes them to a file; `leads.generated.ts` is imported by nothing. A broker pays for the CRM and the leads from their own listings never appear in it.

Wire it end to end: listing → lead → assigned broker → CRM pipeline → activity log → notification. Then add the official **WhatsApp Business Cloud API** (opt-in, per-number) so brokers get a real "new lead" message instead of a `wa.me` deep link.

### 4.5 Trust features (this is the product)

The data is the moat and the trust is the product. Add:

- **Freshness**: every project shows "verified/updated on X" with a source. You have `lastUpdated` — surface it.
- **Verified badges** for developer-supplied vs. broker-hearsay data, and a visible "sold out" that requires a human or an explicit status column.
- **A correction button** on every project — "this price is wrong" — routed into a review queue. This is how you beat Property Finder/NAYA in trust.
- **Provenance/consent**: written permission from developers for the brochures you host and the prices you republish. Without it you are redistributing their IP.

### 4.6 Ship the map — publicly

The map is the only feature a broker cannot get from a spreadsheet. Make it public (or free-tier) and put the login wall *after* the value, not before it. Right now the wall is before the product exists.

### 4.7 Arabic as a first-class language

Egypt is the market. That means: real RTL at the `<html dir>` level, an actual translation layer (not 6 duplicated route files), Egyptian dialect in the marketing copy, and **a language switcher in the navbar**. Plus Arabic SEO — `hreflang` pairs must be correct and symmetric; today the English root declares Arabic as `/` instead of `/ar`.

### 4.8 Things every paid SaaS needs that are simply absent

- Terms of Service, Privacy Policy, and a data-retention statement (you are storing names, phones and budgets — that is personal data).
- A working contact form (the current one calls `setSubmitted(true)` and discards the message).
- Support/help docs and an onboarding flow with sample data.
- Real analytics (server-side events) so you can price and measure. Today's "Intelligence Center" only scores the current browser's own clicks and labels it "Live".
- A staged demo mode that is *labelled* as demo, so you can sell before the data is perfect.

---

## 5. Developer perspective — what you NEED to make sure of

### P0 — do this before writing another feature

1. **Rotate every exposed credential.** Admin Gmail password, Wikimapia key. Then purge them from git history (`git filter-repo`), make the repo private, and add a secret-scanning pre-commit hook.
2. **Never ship secrets or a user table to the client.** `users.generated.ts` must not be imported by `store.ts`. Delete the user array from the bundle entirely.
3. **Authenticate the six API routes** — or delete them. `save-users`, `save-database`, `upload-asset`, `whatsapp-inventory`, `brochures-match` have no business existing unauthenticated.
4. **Remove every `exec` from a request handler.** `git add/commit/push origin main`, `python sync-media.py`, `node import-availability.mjs` all run from HTTP handlers. A web request must never mutate the repo or spawn a process.
5. **Fix the upload path traversal.** `path.join("D:\\map12\\public\\brochures", String(fileName))` with an attacker-controlled `fileName` writes anywhere. Resolve the path, assert it is inside the target dir, allowlist extensions, cap size and MIME.
6. **Delete the hardcoded `D:\map12` paths.** They exist in `api.upload-asset.ts`, `api.brochures-match.ts`, `sync-media.py`, `extract-images.py`. They cannot work on any machine but yours, and they leak your local layout to users.
7. **Stop writing to the repo at runtime.** No `fs.writeFileSync` into `src/`. No generated `.ts` committed. Data belongs in a database; the build should never depend on files a request mutated.
8. **Remove the plaintext password store**, then add server-side sessions and hashed credentials.
9. **Fix the delivery-field bug.** The generated data emits `delivery_note` (9,598 units) and `payment_plan` (9,610), but the interfaces and every consumer read `deliveryNote` / `paymentPlan` (`availability.ts:15-16`, `calculator.tsx:450`, `AvailabilitySection.tsx:278`). Result: ~9,600 units silently lose their delivery schedule and payment plan and fall back to "Off-Plan (Schedule Pending)". Either rename the parser output or normalise on import — and add a test that asserts every unit has the keys the UI reads.
10. **Make `tsc` pass.** `npx tsc --noEmit` currently fails with 6 `TS2739` errors in `compounds.generated.ts` (missing `lat/lng/hero/gallery`) — hidden because `npm run build` never type-checks.

### P1 — architecture that will otherwise sink you

11. **Break the `store → availability.generated` static import.** `store.ts:6` statically imports the 4.55 MB dataset into the entry chunk, which is why the built entry is **4,059 KB**. The dynamic import in `availability.ts:103` is defeated. Serve availability as an API/JSON fetched per project — target **<300 KB** initial JS.
12. **Kill the `availability` Proxy.** `availability.ts:167-184` re-parses the entire `localStorage` blob on *every* property access, throttled by only a 500 ms window, and `useMemo(..., [availability])` depends on an identity that never changes — so memos compute once and go stale forever. Use a plain array + `useSyncExternalStore`, or server-fetch.
13. **Replace data-as-TypeScript with schema-validated data.** You already depend on `zod` and use it in **zero** files. Validate at every ingestion boundary, make `beds`/`view`/`finishing`/`paymentPlan` **nullable instead of fabricated**, and generate types from the schema.
14. **Add CI.** There is no CI at all. Minimum: `tsc --noEmit`, `eslint`, `vite build`, on every push. All three would have caught this review's findings before deploy.
15. **Add tests — start where the money is.** Zero tests today. Prioritise: `dedup`, `gatekeeper`, `reconciliation`, `quality-guard` (pure functions, high blast radius), then lead capture, then authz.
16. **Make the pipeline idempotent and review-first.** `autonomous_mode: true` must default to **false**. Sold-out must require an explicit status column or human approval. Fix the mojibake at ingest (`audit_log.jsonl` stores Arabic as `Ù…ØªØ§Ù…`). Fail loudly instead of `success: true` on dropped `.csv` files.
17. **Stabilise IDs.** Availability slugs come from filenames; developer slugs are recomputed from display names at import (`compounds.ts:6412`), so `akam-alrajhi` and `akam-al-rajhi-developments` both exist. Add immutable `project_id` / `developer_id` before you have customers, not after.
18. **Code-split the client data.** `wikimapia-locations.json` (1.57 MB), `media-registry.json` (311 KB) and `compounds.generated.ts` (575 KB) are all statically imported into page chunks. Move them behind endpoints.
19. **Fix media.** 2,036 JPGs (428 MB), 8 WebP, no `srcset`, no `width`/`height` — and `OptimizedImage.tsx` exists but is **imported nowhere**. Convert to WebP/AVIF behind a resizer, add dimensions and `loading="lazy"`, and stop prefetching 40-95 MB PDFs in `BrochureViewerModal.tsx:113`.
20. **Stop leaking stack traces.** `__root.tsx:67-80` renders `error.message` *and* the full stack to users in production (commit `2677ec3` explicitly enabled this). Log server-side; show a correlation ID.

### P2 — hygiene you will thank yourself for

21. **Break up the monoliths.** `admin.tsx` is **5,515 lines**; `store.ts` 2,063; `dashboard.index.tsx` 1,558. Split by feature; the same file size is why four price tables and eleven copies of the admin email drifted apart.
22. **One source of truth for pricing and limits.** You have four contradictory tables. Move them to `pricing-config.ts` and import everywhere.
23. **Delete dead code and dead dependencies** (Section 3), then enable `noUnusedLocals` / `noUnusedParameters`.
24. **Accessibility is not optional for a B2B product** — 0 `role="dialog"` and 0 `aria-modal` across 13 hand-rolled modals, ~325 icon buttons without accessible names, ~123 form fields without labels, 130 `focus:outline-none` vs 18 `focus-visible:`. Use one `Dialog` primitive.
25. **Add security headers and rate limits.** No CSP, no `Origin` check, no body-size cap, no rate limiting. `vite.config.ts` sets `host: "0.0.0.0"` and `allowedHosts: true` — fine for a LAN demo, not for a server.
26. **Make time dynamic.** `const CURRENT_YEAR = 2026` is hardcoded in `delivery.ts:8`; it silently misclassifies delivery status every January.
27. **Fix the small real bugs while you are in there:** contact WhatsApp link is malformed (`wa.me/2201029324783` — that is a different country code; the rest of the app uses `wa.me/201029324783`); `auth.tsx` ignores the `?tier=` param that every pricing CTA sends; `NewLaunchesDashboard.tsx` is never mounted; the six Arabic routes ship internal QA banners.

---

## 6. What is genuinely good — protect this

Do not let the above read as "throw it away". A lot of this is hard to build and worth keeping:

- **The data asset.** 360 compounds, 135 developers, 244 projects with 10,048 units, 242 hand-verified registry overrides. That took real work and is the actual moat — it just needs to be *true* and *fresh*.
- **The design system.** Tailwind 4 with a coherent oklch token set, light/dark parity, good typography. It looks like a product, which is why the fake parts are so jarring.
- **The payment-plan calculator** and the **compare engine** — genuinely useful, working tools that brokers would pay for.
- **The SEO foundation** — destinations, developers, sitemaps, JSON-LD. Structurally right; it mostly needs canonical cleanup.
- **The availability data model** (`availability.ts` interfaces, `unitTypeSlug`) — sound shape, bad pipeline.
- **`compound-registry.ts`** — the 242 hand-verified overrides are the most trustworthy layer in the codebase.
- **The intent behind the WhatsApp engine** (keep availability fresh automatically) is correct. The implementation is what's wrong — that should be a manual, authenticated, review-gated upload, not a bot.

---

## 7. The shortest path to a business

The instinct will be to add features. Do the opposite: **freeze features and narrow the promise.**

**Weeks 1-2 — make it safe.** Rotate credentials, private repo, delete the WhatsApp engine from the product, strip secrets from the bundle, auth on every endpoint, remove runtime repo writes. Nothing else matters until this is done.

**Weeks 3-5 — make it real.** Postgres + server sessions + tenancy. Move generated data out of the bundle into an API. Fix the delivery/payment-plan field bug. Ship the map publicly. Wire public lead capture into the CRM. Type-check + build in CI.

**Weeks 6-8 — make it sellable.** Paymob/Fawry checkout with webhooks and real invoices; server-enforced limits; freshness badges and the "report a wrong price" loop; Arabic switcher and correct `hreflang`; Terms/Privacy; a working contact form.

**Week 9+ — sell a narrow v1:** *the map + project intelligence + lead capture for brokers* — not the CRM, not announcements, not the social feed, not WhatsApp automation. Charge for freshness and coverage, not for features. Then let paying customers tell you which of the 30 dead tabs to rebuild.

The good news: you are not fixing a broken business. You are choosing a foundation before the first customer arrives — and you still have one of the better Egyptian property datasets in hand.

---

## Appendix — evidence index

| Claim | Location |
|---|---|
| No-op password gate | `src/components/PasswordGate.tsx:5-7` |
| Plaintext passwords, public repo | `src/data/users.generated.ts:6,15` · `store.ts:501` · `api.github.com/repos/es2023020/map12` → `"private": false` |
| Hardcoded admin password | `src/routes/admin.tsx:117-118` |
| Client-side admin check | `src/routes/admin.tsx:96-97`, `map.tsx:86` |
| Any-password login | `src/lib/store.ts:628` |
| Unauthenticated destructive endpoints | `api.save-users.ts:26,34` · `api.save-database.ts:29,47,56` · `api.upload-asset.ts:70,102,106` · `api.whatsapp-inventory.ts:88,123` |
| Path traversal in upload | `api.upload-asset.ts:70-72,88` |
| Map is admin-only "Coming Soon" | `src/routes/map.tsx:86-132` |
| Partnership pages 404 | `developer-partnership.tsx:9-11`, `agency-partnership.tsx:9-11` |
| Fabricated unit data | `parsers/pdf-parser.py:84-88` · `excel-parser.ts:56,97-100,287-290` |
| Auto-sold-out without review | `reconciliation.ts:123-129,216-222` · `pending_reviews.json:2` (`autonomous_mode: true`) |
| Field-name mismatch | `availability.ts:15-16` vs `availability.generated.ts` (9,598 × `delivery_note`, 0 × `deliveryNote`) |
| 4.06 MB entry chunk | `.vercel/output/static/assets/index-DsvbIZxr.js` = 4,159,674 B |
| Static import of 4.55 MB dataset | `src/lib/store.ts:6` |
| Proxy re-parses localStorage | `src/data/availability.ts:123-184` |
| 2.87 GB assets / 94 MB PDF | `public/` (3,435 files, 148 PDFs = 2,373 MB) |
| No tests, no CI | zero `*.test.*` / `*.spec.*`; `.github/` has no workflows |
| `tsc` fails | 6 × `TS2739` in `compounds.generated.ts` |
| Stack traces to users | `src/routes/__root.tsx:67-80` |
| Unused deps | `html2canvas`, `jspdf`, `date-fns` = 0 references |
| Hardcoded year | `src/lib/delivery.ts:8` |
| Broken contact WhatsApp | `src/routes/contact.tsx:28` (`wa.me/2201029324783`) |
| Fake contact submit | `src/routes/contact.tsx:81-84` |
| Deployment dead | `https://map12-woad.vercel.app/` → HTTP 404 |

*Note: at the start of this review the workspace folder `D:\map12` was blocking file access, so its Windows permissions were repaired (your user account was granted full control; contents and ownership unchanged). The rollback command is printed in `C:\Users\LORD LAPTOP\AppData\Local\Temp\dsh-acl-recovery\` if you ever want the previous permissions restored.*
