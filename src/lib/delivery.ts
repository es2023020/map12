/**
 * Smart Ready to Move (RTM) determination utility.
 * RTM is defined strictly as delivery within 9 months or less from now (deliveryYear <= 2027).
 * Any unit or project with deliveryYear > 2027 (e.g. 2028, 2029, 2030) is NOT RTM (it is Off-Plan).
 */

export const MAX_RTM_DELIVERY_YEAR = 2027;

export function parseYearFromNote(note?: string): number | null {
  if (!note) return null;

  // Match 4-digit years (e.g. 2026, 2027, 2028, 2029, 2030)
  const yearMatch = note.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    return parseInt(yearMatch[1], 10);
  }

  // Match relative delivery notes (e.g. "3 years", "4 yrs") -> current year (2026) + relative years
  const relMatch = note.toLowerCase().match(/(\d+)\s*(?:years?|yrs?)/);
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
  // Check if delivery note contains a specific year or relative delivery timeline
  const noteYear = parseYearFromNote(deliveryNote);
  if (noteYear !== null) {
    if (noteYear > MAX_RTM_DELIVERY_YEAR) return false;
    if (noteYear <= MAX_RTM_DELIVERY_YEAR) return true;
  }

  // If explicit deliveryYear is specified and > 2027, strictly NOT RTM
  if (typeof deliveryYear === "number" && deliveryYear > 0) {
    if (deliveryYear > MAX_RTM_DELIVERY_YEAR) {
      return false;
    }
  }

  // Check if deliveryNote explicitly mentions RTM / Immediate / Ready
  if (deliveryNote) {
    const lowerNote = deliveryNote.toLowerCase();
    if (
      lowerNote.includes("rtm") ||
      lowerNote.includes("ready to move") ||
      lowerNote.includes("immediate") ||
      lowerNote.includes("ready")
    ) {
      return true;
    }
  }

  // If status is RTM and deliveryYear is <= 2027 (or unstated), it is RTM
  if (status === "RTM") {
    if (!deliveryYear || deliveryYear <= MAX_RTM_DELIVERY_YEAR) {
      return true;
    }
  }

  // If deliveryYear is <= 2027, consider RTM
  if (typeof deliveryYear === "number" && deliveryYear > 0 && deliveryYear <= MAX_RTM_DELIVERY_YEAR) {
    return true;
  }

  return false;
}
