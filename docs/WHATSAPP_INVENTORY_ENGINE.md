# WhatsApp Automated Inventory Engine for Property Atlas

This engine automatically monitors developer WhatsApp groups, parses incoming **Excel spreadsheets**, **PDF fact sheets**, and **chat text announcements**, eliminates duplicate units, and keeps your project availability up-to-date in real time.

---

## 🚀 Quick Start

### 1. Start the WhatsApp Listener
Run:
```bash
npm run inventory:listen
```
- On first launch, a **QR Code** will be printed directly in your terminal.
- Open **WhatsApp** on your phone ➔ **Linked Devices** ➔ **Link a Device** ➔ Scan the terminal QR code.
- Authentication credentials are saved securely in `services/whatsapp-listener/session/`. You only need to scan once.

### 2. Manual Testing Commands
You can also process files or text messages without WhatsApp:
```bash
# Test an Excel or PDF inventory file
npm run inventory:process "path/to/Sabbour_Availability_Nov2026.xlsx" al-ahly-sabbour

# Test a WhatsApp text announcement (Arabic or English)
npm run inventory:text "Keeva Phase 2 is completely SOLD OUT"

# Test an Arabic flash unit release
npm run inventory:text "متاح الآن في مشروع جايا: شاليه 120م 3 غرف بسعر 10.5 مليون كود CH-502 مقدم 10% وأقساط 8 سنوات"
```

---

## ⚙️ How It Works (The 7 Modules)

### 1. Document Gatekeeper (`scripts/inventory-engine/gatekeeper.ts`)
- **Strict Filtering**: Automatically rejects non-inventory files (marketing brochures, corporate profiles, floor plans, contract templates, receipts, registration forms).
- **Accepted File Types**: Only processes sheets containing keywords (`inventory`, `availability`, `stock`, `fact sheet`, `متاح`, `جدول الوحدات`, `أسعار`) combined with dates or recognized project/developer names.
- **SHA-256 Hash Deduplication**: Files with identical content forwarded across multiple groups are only processed once.

### 2. Group Mapping (`config/whatsapp-groups.json`)
Configure which developer each group belongs to:
```json
{
  "groups": {
    "120363024829104812@g.us": {
      "name": "Al Ahly Sabbour Official Brokers",
      "developer_slug": "al-ahly-sabbour",
      "developer_name": "Al Ahly Sabbour",
      "is_master_group": true
    }
  }
}
```

### 3. WhatsApp Text Announcement Parser (`scripts/inventory-engine/chat-parser.ts`)
Parses real-time messages sent by developers in Arabic or English:
- **Sold Out notices**: `"Project Keeva is completely SOLD OUT"` ➔ Automatically marks the project `total_available: 0` and all its units as `Sold`.
- **Flash releases**: Parses property type, bedrooms, BUA area (`120م`), price (`10.5 مليون`), unit code (`كود CH-502`), and payment terms into structured inventory.

### 4. Zero-Duplication Engine (`scripts/inventory-engine/dedup.ts`)
- **Unit ID Normalization**: Standardizes codes like `Villa 104`, `V-104`, `V104`, `فيلا 104` into `V-104`.
- **Synthetic Fingerprinting**: For sheets without unique unit numbers, creates a deterministic fingerprint `(slug, type, beds, bua, cluster, price)` to prevent double-counting across revisions.

### 5. Multi-Format Tabular Parsers (`scripts/inventory-engine/parsers/`)
- **Excel Parser (`.xlsx`, `.xls`)**: Scans all workbook tabs, auto-detects header rows across rows 1–15, extracts areas, millions, payment plans, and finishing states.
- **PDF Parser (`.pdf`)**: Native Python table extractor (`pdfplumber`) extracting tabular unit grids directly into structured JSON.

### 6. Reconciliation & "Sold Out" State Engine (`scripts/inventory-engine/reconciliation.ts`)
- **Master Sheet Rule**: When a Developer Master Stock sheet is processed, any existing project in the developer's catalog that is **missing from the sheet is automatically marked as "Sold Out"**.
- **Unit-Level Rule**: Any unit that existed in the previous update but is absent from the incoming sheet is marked as **"Sold"**.

### 7. Quality Guard & Sanity Checks (`scripts/inventory-engine/quality-guard.ts`)
- Validates price bounds (detects missing 0s or corrupt values).
- Validates price per square meter within Egyptian market ranges.
- **Drop Guard**: Flags suspicious inventory drops (e.g. from 50 units to 0 due to a corrupted file) before applying.
- Appends every change to an audit log: `data/availability/audit_log.jsonl`.
- Automatically calls `scripts/import-availability.mjs` to keep `src/data/availability.generated.ts` and `public/availability-data/` in sync.
