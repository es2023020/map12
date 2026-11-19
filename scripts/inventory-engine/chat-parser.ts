import { TextMessageAction, TextActionIntent, NormalizedUnit, DiscoveredProject } from "./types";
import { matchProjectAndDeveloper } from "./gatekeeper";
import { normalizeUnitId, computeUnitFingerprint } from "./dedup";

/**
 * Normalizes property types from Arabic or English
 */
export function extractPropertyType(text: string): string {
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
  if (lower.includes("clinic") || lower.includes("عيادة")) {
    return "Clinic";
  }
  if (lower.includes("office") || lower.includes("admin") || lower.includes("مكتب")) {
    return "Office";
  }
  return "Apartment";
}

/**
 * Extracts all property types mentioned in a launch announcement
 */
export function extractAllPropertyTypes(text: string): string[] {
  const lower = text.toLowerCase();
  const types = new Set<string>();
  if (lower.includes("apartment") || lower.includes("شقق") || lower.includes("شقة") || lower.includes("flat") || lower.includes("studio")) {
    types.add("Apartment");
  }
  if (lower.includes("duplex") || lower.includes("دوبلكس") || lower.includes("ivilla") || lower.includes("i-villa")) {
    types.add("Duplex");
  }
  if (lower.includes("penthouse") || lower.includes("بنتهاوس")) {
    types.add("Penthouse");
  }
  if (lower.includes("townhouse") || lower.includes("تاون هاوس") || lower.includes("تاون")) {
    types.add("Townhouse");
  }
  if (lower.includes("twinhouse") || lower.includes("توين هاوس") || lower.includes("توين")) {
    types.add("Twin House");
  }
  if (lower.includes("villa") || lower.includes("فيلا") || lower.includes("standalone") || lower.includes("ستاند الون") || lower.includes("فيلات")) {
    types.add("Standalone Villa");
  }
  if (lower.includes("chalet") || lower.includes("شاليه") || lower.includes("شاليهات")) {
    types.add("Chalet");
  }
  if (lower.includes("office") || lower.includes("مكاتب") || lower.includes("مكتب") || lower.includes("admin")) {
    types.add("Office");
  }
  if (lower.includes("clinic") || lower.includes("عيادات") || lower.includes("عيادة")) {
    types.add("Clinic");
  }
  if (types.size === 0) types.add("Apartment");
  return Array.from(types);
}

/**
 * Extracts price in EGP from text
 */
export function extractPriceEGP(text: string): number {
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
 * Extracts starting price in millions for launches (e.g. 14.5)
 */
export function extractStartingPriceMillion(text: string): number | undefined {
  const price = extractPriceEGP(text);
  if (price > 0) {
    return parseFloat((price / 1000000).toFixed(2));
  }
  // Try direct pattern like "يبدأ من 8" or "starts from 14"
  const directMatch = text.match(/(?:starts?\s*from|تبدأ\s*من|أسعار\s*تبدأ\s*من|يبدأ\s*من)\s*(\d+(?:\.\d+)?)/i);
  if (directMatch) {
    const val = parseFloat(directMatch[1]);
    if (val > 0 && val < 500) return val;
  }
  return undefined;
}

/**
 * Extracts BUA (Area in sqm)
 */
export function extractAreaSqm(text: string): number {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:sqm|m2|sq\.m|م²|متر|م(?!ليون)|m(?!illion))/i);
  if (match) {
    const val = parseFloat(match[1]);
    if (val >= 20 && val <= 3000) return val;
  }
  return 0;
}

/**
 * Extracts size range string (e.g. "80m² – 250m²")
 */
export function extractSizeRange(text: string): string | undefined {
  const rangeMatch = text.match(/(\d+)\s*(?:m|متر|sqm|م²)?\s*(?:to|-|–|—|إلى|حتى)\s*(\d+)\s*(?:sqm|m2|م²|متر)/i);
  if (rangeMatch) {
    return `${rangeMatch[1]}–${rangeMatch[2]} m²`;
  }
  const minMatch = text.match(/(?:مساحات\s*تبدأ\s*من|areas\s*from|from)\s*(\d+)\s*(?:sqm|m2|م²|متر)/i);
  if (minMatch) {
    return `From ${minMatch[1]} m²`;
  }
  return undefined;
}

/**
 * Extracts bedrooms
 */
export function extractBeds(text: string, propType: string): number {
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
export function extractPaymentPlan(text: string): string | undefined {
  const dpMatch = text.match(/(\d+)%\s*(?:dp|down|مقدم)/i);
  const yrsMatch = text.match(/(\d+)\s*(?:years|yrs|سنوات|سنين|سنة)/i);

  if (dpMatch && yrsMatch) {
    return `${dpMatch[1]}% Down Payment · ${yrsMatch[1]} Years Equal Installments`;
  } else if (yrsMatch) {
    return `Up to ${yrsMatch[1]} Years Installments`;
  } else if (dpMatch) {
    return `${dpMatch[1]}% Down Payment`;
  }
  return undefined;
}

/**
 * Extracts destination / city from announcement
 */
export function extractDestination(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("new cairo") || lower.includes("التجمع") || lower.includes("القاهرة الجديدة") || lower.includes("5th settlement") || lower.includes("6th settlement")) {
    return "new-cairo";
  }
  if (lower.includes("zayed") || lower.includes("زايد") || lower.includes("sheikh zayed") || lower.includes("الشيخ زايد")) {
    return "sheikh-zayed";
  }
  if (lower.includes("october") || lower.includes("اكتوبر") || lower.includes("أكتوبر") || lower.includes("6th of october")) {
    return "6th-of-october";
  }
  if (lower.includes("mostakbal") || lower.includes("المستقبل") || lower.includes("mostakbal city")) {
    return "mostakbal-city";
  }
  if (lower.includes("new capital") || lower.includes("العاصمة") || lower.includes("العاصمة الإدارية") || lower.includes("r7") || lower.includes("r8")) {
    return "new-capital";
  }
  if (lower.includes("ras el hekma") || lower.includes("رأس الحكمة") || lower.includes("راس الحكمة")) {
    return "ras-el-hekma";
  }
  if (lower.includes("north coast") || lower.includes("الساحل") || lower.includes("الساحل الشمالي") || lower.includes("sahel")) {
    return "north-coast";
  }
  if (lower.includes("sokhna") || lower.includes("السخنة") || lower.includes("العين السخنة")) {
    return "ain-sokhna";
  }
  if (lower.includes("el gouna") || lower.includes("الجونة") || lower.includes("gouna")) {
    return "el-gouna";
  }
  if (lower.includes("shorouk") || lower.includes("الشروق")) {
    return "el-shorouk";
  }
  return "new-cairo";
}

/**
 * Extracts expected delivery year
 */
export function extractDeliveryYear(text: string): number | undefined {
  const match = text.match(/\b(202[5-9]|203[0-5])\b/);
  if (match) return parseInt(match[1], 10);
  return undefined;
}

/**
 * Extracts a candidate project or phase name from a title or text
 */
export function extractCandidateProjectName(text: string): string {
  const genericKeywords = [
    "new launch",
    "launching",
    "opening soon",
    "exclusive launch",
    "now launching",
    "pre-launch",
    "new phase",
    "طرح جديد",
    "مشروع جديد",
    "مرحلة جديدة",
    "إطلاق",
    "استمارة حجز",
    "فتح باب الحجز",
  ];

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // 1. Check explicit prefix markers anywhere in text: "Compound: XYZ", "كمبوند كذا", "مشروع كذا"
  for (const line of lines) {
    const cleaned = line.replace(/[📍✨🔥🚀⭐💎🌟*#_]/g, "").trim();
    const prefixMatch = cleaned.match(/(?:compound|project|كمبوند|مشروع)\s*[:=]?\s*([A-Za-z0-9\u0600-\u06FF\s-]+)/i);
    if (prefixMatch && prefixMatch[1].trim().length >= 3) {
      const candidate = prefixMatch[1].trim().split(/\s{2,}|[|–-]/)[0].trim();
      const lower = candidate.toLowerCase();
      if (!genericKeywords.some((k) => lower === k)) {
        return candidate.replace(/(بالساحل|بالشيخ|بالتجمع|بالعاصمة|في الساحل|في زايد).*$/, "").trim();
      }
    }
  }

  // 2. Check lines with separators like "|", "–", "-"
  for (const line of lines.slice(0, 4)) {
    const cleaned = line.replace(/[📍✨🔥🚀⭐💎🌟*#_]/g, "").trim();
    if (cleaned.includes("|") || cleaned.includes("–") || cleaned.includes("-")) {
      const parts = cleaned.split(/[|–-]/).map((p) => p.trim());
      for (const p of parts) {
        const lowerP = p.toLowerCase();
        const isGeneric = genericKeywords.some((k) => lowerP.includes(k));
        const isLocation =
          lowerP.includes("زايد") ||
          lowerP.includes("التجمع") ||
          lowerP.includes("العاصمة") ||
          lowerP.includes("الساحل") ||
          lowerP.includes("أكتوبر") ||
          lowerP.includes("المستقبل");
        if (p.length >= 3 && !isGeneric && !isLocation) {
          return p.replace(/^(كمبوند|مشروع|compound|project)\s+/i, "").trim();
        }
      }
    }
  }

  // 3. Fallback: take first non-generic line
  for (const line of lines.slice(0, 3)) {
    const cleaned = line.replace(/[📍✨🔥🚀⭐💎🌟*#_]/g, "").trim();
    const lower = cleaned.toLowerCase();
    if (!genericKeywords.some((k) => lower === k)) {
      return cleaned.slice(0, 35).trim();
    }
  }

  return "New Project";
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
  const effectiveDevSlug = developerSlug || groupDevSlug || "general-developer";
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

  // 2. Detect NEW LAUNCH / NEW PHASE / NEW PROJECT
  const isNewLaunch =
    lower.includes("new launch") ||
    lower.includes("launching") ||
    lower.includes("opening soon") ||
    lower.includes("exclusive launch") ||
    lower.includes("now launching") ||
    lower.includes("pre-launch") ||
    lower.includes("new phase") ||
    lower.includes("eoi") ||
    lower.includes("طرح جديد") ||
    lower.includes("مشروع جديد") ||
    lower.includes("مرحلة جديدة") ||
    lower.includes("إطلاق") ||
    lower.includes("استمارة حجز") ||
    lower.includes("فتح باب الحجز") ||
    lower.includes("طرح حصري");

  if (isNewLaunch) {
    const candidateName = extractCandidateProjectName(trimmed);
    const candidateSlug = projectSlug || candidateName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const dest = extractDestination(trimmed);
    const startingPrice = extractStartingPriceMillion(trimmed);
    const types = extractAllPropertyTypes(trimmed);
    const sizeRange = extractSizeRange(trimmed);
    const plan = extractPaymentPlan(trimmed);
    const deliveryYear = extractDeliveryYear(trimmed);

    const devName = effectiveDevSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const discovered: DiscoveredProject = {
      id: `launch_${Date.now()}_${candidateSlug.slice(0, 15)}`,
      timestamp: new Date().toISOString(),
      source: "WHATSAPP_TEXT",
      developerSlug: effectiveDevSlug,
      developerName: devName,
      suggestedName: candidateName,
      suggestedSlug: candidateSlug,
      destination: dest,
      priceFromM: startingPrice,
      types,
      unitSizes: sizeRange,
      paymentPlan: plan,
      deliveryYear,
      blurb: trimmed.slice(0, 250).replace(/\r?\n/g, " ") + "...",
      rawText: trimmed,
      status: "PENDING_APPROVAL",
    };

    if (projectSlug) {
      // Known project receiving a new launch / phase announcement
      return {
        intent: "NEW_LAUNCH",
        developerSlug: effectiveDevSlug,
        projectSlug,
        projectName: candidateName,
        unitIds: [],
        launchData: discovered,
        confidence: 0.95,
        rawText: trimmed,
        reason: `New Launch announcement detected for known project '${projectSlug}'`,
      };
    } else {
      // UNREGISTERED project: Stage for admin approval
      return {
        intent: "UNREGISTERED_PROJECT_DISCOVERY",
        developerSlug: effectiveDevSlug,
        projectSlug: candidateSlug,
        projectName: candidateName,
        unitIds: [],
        discoveredProject: discovered,
        confidence: 0.9,
        rawText: trimmed,
        reason: `Discovered new unregistered project '${candidateName}' from developer group '${devName}'`,
      };
    }
  }

  // 3. Detect Unit Release or Inventory Listing (for groups without sheets)
  const isRelease =
    lower.includes("متاح") ||
    lower.includes("available") ||
    lower.includes("release") ||
    lower.includes("back to market") ||
    lower.includes("back on market") ||
    lower.includes("last unit") ||
    lower.includes("فرصة") ||
    lower.includes("وحدة مميزة") ||
    lower.includes("عرض") ||
    lower.includes("inventory") ||
    lower.includes("متاح الآن");

  const price = extractPriceEGP(trimmed);
  const area = extractAreaSqm(trimmed);

  if (isRelease && (price > 0 || area > 0)) {
    const propType = extractPropertyType(trimmed);
    const beds = extractBeds(trimmed, propType);
    const plan = extractPaymentPlan(trimmed);

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

    if (projectSlug) {
      // Known project: create/update unit
      const unitData: Partial<NormalizedUnit> = {
        id: cleanId,
        projectSlug,
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
        projectSlug,
        unitIds: cleanId ? [cleanId] : [],
        unitData,
        confidence: 0.85,
        rawText: trimmed,
        reason: `Parsed flash unit release (${propType}, ${area}m, ${price.toLocaleString()} EGP)`,
      };
    } else {
      // Unregistered project mentioned with units: stage for Admin
      const candidateName = extractCandidateProjectName(trimmed);
      const candidateSlug = candidateName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const devName = effectiveDevSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      const discovered: DiscoveredProject = {
        id: `inventory_${Date.now()}_${candidateSlug.slice(0, 15)}`,
        timestamp: new Date().toISOString(),
        source: "WHATSAPP_TEXT_INVENTORY",
        developerSlug: effectiveDevSlug,
        developerName: devName,
        suggestedName: candidateName,
        suggestedSlug: candidateSlug,
        destination: extractDestination(trimmed),
        priceFromM: price > 0 ? parseFloat((price / 1000000).toFixed(2)) : undefined,
        types: [propType],
        unitSizes: area > 0 ? `${area} m²` : undefined,
        paymentPlan: plan,
        blurb: trimmed.slice(0, 200).replace(/\r?\n/g, " ") + "...",
        rawText: trimmed,
        units: [
          {
            id: cleanId,
            type: propType,
            beds,
            areaSqm: area,
            priceEGP: price,
            status: "Available",
          },
        ],
        status: "PENDING_APPROVAL",
      };

      return {
        intent: "UNREGISTERED_PROJECT_DISCOVERY",
        developerSlug: effectiveDevSlug,
        projectSlug: candidateSlug,
        projectName: candidateName,
        unitIds: cleanId ? [cleanId] : [],
        discoveredProject: discovered,
        confidence: 0.8,
        rawText: trimmed,
        reason: `Discovered unit inventory for unregistered project '${candidateName}'`,
      };
    }
  }

  return {
    intent: "IRRELEVANT",
    unitIds: [],
    confidence: 0.7,
    rawText,
    reason: "No actionable real estate inventory updates found in message",
  };
}
