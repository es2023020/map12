/**
 * Smart Ready to Move (RTM) determination utility.
 * RTM is defined strictly as delivery within 9 months or less from today's date (August 2026 => delivery <= 2027 / May 2027).
 * Any unit or project with deliveryYear > 2027 (e.g. 2028, 2029, 2030) or relative delivery > 1 year is NOT RTM (it is Off-Plan).
 */

export const MAX_RTM_DELIVERY_YEAR = 2027;

export function parseYearFromNote(note?: string): number | null {
  if (!note) return null;

  const lower = note.toLowerCase();

  // Match 4-digit years (e.g. 2026, 2027, 2028, 2029, 2030)
  const yearMatch = note.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    return parseInt(yearMatch[1], 10);
  }

  // Match explicit RTM phrases
  if (
    lower.includes("ready") ||
    lower.includes("rtm") ||
    lower.includes("immediate")
  ) {
    return 2026;
  }

  // Match relative months (e.g. "1 month", "6 months", "Ready in 1 Month")
  const monthMatch = lower.match(/(\d+)\s*(?:months?|mos?)/);
  if (monthMatch) {
    const relMonths = parseInt(monthMatch[1], 10);
    return relMonths <= 18 ? 2026 : 2026 + Math.ceil(relMonths / 12);
  }

  // Match relative years (e.g. "3 years", "4 yrs") -> current year (2026) + relative years
  const relMatch = lower.match(/(\d+)\s*(?:years?|yrs?)/);
  if (relMatch) {
    const relYears = parseInt(relMatch[1], 10);
    return 2026 + relYears;
  }

  return null;
}

export function isReadyToMove(
  deliveryYear?: number,
  deliveryNote?: string,
  status?: string
): boolean {
  const noteYear = parseYearFromNote(deliveryNote);

  // If delivery note explicitly states delivery > 2027 (e.g. 2028, 2029, 2030, 3-4 years), strictly NOT RTM
  if (noteYear !== null && noteYear > MAX_RTM_DELIVERY_YEAR) {
    return false;
  }

  // If explicit deliveryYear is specified and > 2027, strictly NOT RTM
  if (typeof deliveryYear === "number" && deliveryYear > MAX_RTM_DELIVERY_YEAR) {
    return false;
  }

  // Check if deliveryNote explicitly mentions RTM / Immediate / Ready to Move
  if (deliveryNote) {
    const lowerNote = deliveryNote.toLowerCase();
    if (
      lowerNote.includes("rtm") ||
      lowerNote.includes("ready to move") ||
      lowerNote.includes("immediate")
    ) {
      return true;
    }
  }

  // If status is Off-Plan and no explicit RTM note, it is strictly OFF-PLAN
  if (status === "Off-Plan") {
    if (noteYear !== null && noteYear <= MAX_RTM_DELIVERY_YEAR) {
      return true;
    }
    return false;
  }

  // If status is RTM and noteYear is not > 2027, return true
  if (status === "RTM") {
    return true;
  }

  // Fallback to deliveryYear check
  if (typeof deliveryYear === "number" && deliveryYear > 0) {
    return deliveryYear <= MAX_RTM_DELIVERY_YEAR;
  }

  return false;
}

export function hasRTMUnits(
  c: { deliveryYear?: number; status?: string },
  avail?: { breakdown?: any[] }
): boolean {
  if (avail && avail.breakdown && avail.breakdown.length > 0) {
    let checkedAny = false;
    for (const b of avail.breakdown) {
      if (b.units && b.units.length > 0) {
        for (const u of b.units) {
          checkedAny = true;
          const note = u.deliveryNote || u.delivery_note || b.deliveryNote || b.delivery_note;
          if (isReadyToMove(c.deliveryYear, note, c.status)) {
            return true;
          }
        }
      } else {
        checkedAny = true;
        const note = b.deliveryNote || b.delivery_note;
        if (isReadyToMove(c.deliveryYear, note, c.status)) {
          return true;
        }
      }
    }
    if (checkedAny) return false;
  }
  return isReadyToMove(c.deliveryYear, undefined, c.status);
}

export function hasOffPlanUnits(
  c: { deliveryYear?: number; status?: string },
  avail?: { breakdown?: any[] }
): boolean {
  if (avail && avail.breakdown && avail.breakdown.length > 0) {
    let checkedAny = false;
    for (const b of avail.breakdown) {
      if (b.units && b.units.length > 0) {
        for (const u of b.units) {
          checkedAny = true;
          const note = u.deliveryNote || u.delivery_note || b.deliveryNote || b.delivery_note;
          if (!isReadyToMove(c.deliveryYear, note, c.status)) {
            return true;
          }
        }
      } else {
        checkedAny = true;
        const note = b.deliveryNote || b.delivery_note;
        if (!isReadyToMove(c.deliveryYear, note, c.status)) {
          return true;
        }
      }
    }
    if (checkedAny) return false;
  }
  return !isReadyToMove(c.deliveryYear, undefined, c.status);
}
