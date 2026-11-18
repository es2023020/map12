import { TextMessageAction, TextActionIntent, NormalizedUnit } from "./types";
import { matchProjectAndDeveloper } from "./gatekeeper";
import { normalizeUnitId, computeUnitFingerprint } from "./dedup";

/**
 * Normalizes property types from Arabic or English
 */
function extractPropertyType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("villa") || lower.includes("فيلا") || lower.includes("standalone") || lower.includes("ستاند الون")) {
    return "Standalone Villa";
  }
  if (lower.includes("chalet") || lower.includes("شاليه")) {
    return "Chalet";
  }
  if (lower.includes("townhouse") || lower.includes("تاون هاوس") || lower.includes("تاون")) {
    return "Townhouse";
  }
  if (lower.includes("twinhouse") || lower.includes("توين هاوس") || lower.includes("توين")) {
    return "Twin House";
  }
  if (lower.includes("duplex") || lower.includes("دوبلكس") || lower.includes("ivilla") || lower.includes("اى فيلا")) {
    return "Duplex";
  }
  if (lower.includes("penthouse") || lower.includes("بنتهاوس")) {
    return "Penthouse";
  }
  if (lower.includes("studio") || lower.includes("استوديو")) {
    return "Apartment";
  }
  return "Apartment";
}

/**
 * Extracts price in EGP from text
 * Handles: 10.5M, 10,500,000, 10.5 مليون, 10500000 EGP
 */
function extractPriceEGP(text: string): number {
  // Check millions notation (e.g. "10.5m", "10.5 m", "10.5 million", "10.5 مليون")
  const millionMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:m|million|مليون)/i);
  if (millionMatch) {
    const val = parseFloat(millionMatch[1]);
    if (!isNaN(val) && val > 0 && val < 5000) {
      return Math.round(val * 1000000);
    }
  }

  // Check direct full numbers e.g. "10,500,000" or "10500000"
  const fullPriceMatch = text.match(/(?:سعر|price|egp|جنيه)?\s*[:=]?\s*(\d{1,3}(?:,\d{3})+|\d{7,10})/i);
  if (fullPriceMatch) {
    const num = parseFloat(fullPriceMatch[1].replace(/,/g, ""));
    if (!isNaN(num) && num >= 500000) {
      return Math.round(num);
    }
  }

  return 0;
}

/**
 * Extracts BUA (Area in sqm)
 */
function extractAreaSqm(text: string): number {
  // Support sqm, m2, sq.m, م², متر, or Arabic م (Meem) not followed by ليون (مليون)
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:sqm|m2|sq\.m|م²|متر|م(?!ليون)|m(?!illion))/i);
  if (match) {
    const val = parseFloat(match[1]);
    if (val >= 20 && val <= 3000) return val;
  }
  return 0;
}

/**
 * Extracts bedrooms
 */
function extractBeds(text: string, propType: string): number {
  const match = text.match(/(\d+)\s*(?:br|bed|bedroom|غرف|غرفة|نوم)/i);
  if (match) {
    const val = parseInt(match[1], 10);
    if (val >= 0 && val <= 10) return val;
  }
  if (propType === "Standalone Villa") return 5;
  if (propType === "Townhouse" || propType === "Twin House") return 4;
  if (propType === "Chalet") return 2;
  return 2;
}

/**
 * Extracts payment plan
 */
function extractPaymentPlan(text: string): string | undefined {
  const dpMatch = text.match(/(\d+)%\s*(?:dp|down|مقدم)/i);
  const yrsMatch = text.match(/(\d+)\s*(?:years|yrs|سنوات|سنين)/i);

  if (dpMatch && yrsMatch) {
    return `${dpMatch[1]}% down · ${yrsMatch[1]} years`;
  } else if (yrsMatch) {
    return `${yrsMatch[1]} years payment plan`;
  }
  return undefined;
}

/**
 * Parses raw text from a WhatsApp message or caption
 */
export function parseWhatsAppTextMessage(rawText: string, groupDevSlug?: string): TextMessageAction {
  const trimmed = rawText.trim();
  if (!trimmed || trimmed.length < 5) {
    return {
      intent: "IRRELEVANT",
      unitIds: [],
      confidence: 1,
      rawText,
      reason: "Message is too short",
    };
  }

  const { projectSlug, developerSlug } = matchProjectAndDeveloper(trimmed);
  const effectiveDevSlug = developerSlug || groupDevSlug;

  const lower = trimmed.toLowerCase();

  // 1. Detect SOLD OUT announcements
  const isSoldOut =
    lower.includes("sold out") ||
    lower.includes("soldout") ||
    lower.includes("سولد اوت") ||
    lower.includes("تم بيع بالكامل") ||
    lower.includes("تم بيع جميع") ||
    lower.includes("مباع بالكامل") ||
    lower.includes("انتهت جميع وحدات");

  if (isSoldOut) {
    // Check if specific unit IDs are mentioned
    const unitMatches = trimmed.match(/(?:unit|villa|chalet|وحدة|فيلا|شاليه)\s*([A-Za-z0-9-_/]+)/gi);
    if (unitMatches && unitMatches.length > 0 && !lower.includes("all") && !lower.includes("جميع")) {
      const unitIds = unitMatches.map((m) => normalizeUnitId(m));
      return {
        intent: "MARK_UNITS_SOLD",
        developerSlug: effectiveDevSlug,
        projectSlug,
        unitIds,
        confidence: 0.9,
        rawText,
        reason: "Detected specific units marked sold",
      };
    }

    // Entire project or phase is sold out
    if (projectSlug) {
      return {
        intent: "MARK_PROJECT_SOLD_OUT",
        developerSlug: effectiveDevSlug,
        projectSlug,
        unitIds: [],
        confidence: 0.95,
        rawText,
        reason: `Detected project '${projectSlug}' announced as completely SOLD OUT`,
      };
    }
  }

  // 2. Detect Flash Unit Release or Back-On-Market
  const isRelease =
    lower.includes("متاح") ||
    lower.includes("available") ||
    lower.includes("release") ||
    lower.includes("back to market") ||
    lower.includes("back on market") ||
    lower.includes("last unit") ||
    lower.includes("فرصة") ||
    lower.includes("وحدة مميزة") ||
    lower.includes("عرض");

  const price = extractPriceEGP(trimmed);
  const area = extractAreaSqm(trimmed);

  if (isRelease && (price > 0 || area > 0) && (projectSlug || effectiveDevSlug)) {
    const propType = extractPropertyType(trimmed);
    const beds = extractBeds(trimmed, propType);
    const plan = extractPaymentPlan(trimmed);

    // Extract unit ID if explicitly given, prioritizing explicit code markers
    let rawId = "";
    const explicitCodeMatch = trimmed.match(/(?:كود|code|unit\s*#?|رقم\s*الوحدة)\s*[:=]?\s*([A-Za-z0-9-_]+)/i);
    if (explicitCodeMatch) {
      rawId = explicitCodeMatch[1];
    } else {
      const fallbackMatch = trimmed.match(/(?:unit|villa|chalet|وحدة|فيلا|شاليه)\s*#?\s*([A-Za-z0-9-_]+)/i);
      if (fallbackMatch && isNaN(Number(fallbackMatch[1]))) {
        rawId = fallbackMatch[1];
      }
    }
    const cleanId = normalizeUnitId(rawId);

    const slug = projectSlug || "general";
    const unitData: Partial<NormalizedUnit> = {
      id: cleanId,
      projectSlug: slug,
      developerSlug: effectiveDevSlug,
      type: propType,
      beds,
      areaSqm: area,
      priceEGP: price,
      paymentPlan: plan || "Standard terms",
      finishing: lower.includes("fully") || lower.includes("تشطيب كامل") ? "Fully Finished" : "Core & Shell",
      status: lower.includes("last unit") ? "Last Unit" : "Available",
      deliveryNote: lower.includes("ready") || lower.includes("استلام فوري") ? "Ready to Move" : undefined,
    };

    return {
      intent: "ADD_OR_UPDATE_UNIT",
      developerSlug: effectiveDevSlug,
      projectSlug: slug,
      unitIds: cleanId ? [cleanId] : [],
      unitData,
      confidence: 0.85,
      rawText,
      reason: `Parsed flash unit release (${propType}, ${area}m, ${price.toLocaleString()} EGP)`,
    };
  }

  return {
    intent: "IRRELEVANT",
    unitIds: [],
    confidence: 0.7,
    rawText,
    reason: "No actionable real estate inventory updates found in message",
  };
}
