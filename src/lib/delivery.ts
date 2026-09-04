export interface DeliveryInfo {
  label: string; // "Delivered" | "RTM (Immediate)" | "Off-Plan (In 2 Years / 2028)" | etc.
  category: "delivered" | "rtm" | "offplan" | "mixed";
  shortLabel: string; // "Delivered" | "RTM (Immediate)" | "Off-Plan (2028)"
  yearsRemaining?: number;
}

const CURRENT_YEAR = 2026;

export function isReadyToMove(
  deliveryYear?: number,
  deliveryNote?: string,
  compoundStatus?: string
): boolean {
  if (compoundStatus?.toLowerCase() === "rtm") return true;
  const note = (deliveryNote || "").toLowerCase();
  if (note.includes("rtm") || note.includes("ready to move") || note.includes("immediate") || note.includes("ready")) {
    return true;
  }
  if (deliveryYear && deliveryYear <= CURRENT_YEAR) return true;
  return false;
}

export function hasRTMUnits(
  compound?: { deliveryYear?: number; status?: string },
  availability?: { breakdown?: { deliveryNote?: string; units?: { deliveryNote?: string }[] }[] }
): boolean {
  if (compound?.status?.toLowerCase() === "rtm") return true;
  if (compound?.deliveryYear && compound.deliveryYear <= CURRENT_YEAR) return true;
  if (!availability?.breakdown) return false;
  return availability.breakdown.some((b) =>
    (b.units || []).some((u) => isReadyToMove(compound?.deliveryYear, u.deliveryNote, compound?.status))
  );
}

export function hasOffPlanUnits(
  compound?: { deliveryYear?: number; status?: string },
  availability?: { breakdown?: { deliveryNote?: string; units?: { deliveryNote?: string }[] }[] }
): boolean {
  if (compound?.status?.toLowerCase() === "off-plan") return true;
  if (compound?.deliveryYear && compound.deliveryYear > CURRENT_YEAR) return true;
  if (!availability?.breakdown) return false;
  return availability.breakdown.some((b) =>
    (b.units || []).some((u) => !isReadyToMove(compound?.deliveryYear, u.deliveryNote, compound?.status))
  );
}

export function formatDeliveryStatus(
  deliveryNote?: string,
  deliveryYear?: number,
  compoundStatus?: string,
  hasMixedAvailability?: boolean
): DeliveryInfo {
  if (hasMixedAvailability) {
    return {
      label: "RTM & Off-Plan Available",
      category: "mixed",
      shortLabel: "RTM & Off-Plan",
    };
  }

  const noteLower = (deliveryNote || "").toLowerCase().trim();
  const statusLower = (compoundStatus || "").toLowerCase().trim();

  // Check Delivered status
  if (
    noteLower.includes("delivered") ||
    statusLower.includes("delivered") ||
    (deliveryYear && deliveryYear <= 2025)
  ) {
    return {
      label: "Delivered (Handed Over)",
      category: "delivered",
      shortLabel: "Delivered",
      yearsRemaining: 0,
    };
  }

  // Check Ready to Move (RTM)
  if (
    statusLower === "rtm" ||
    noteLower.includes("rtm") ||
    noteLower.includes("ready to move") ||
    noteLower.includes("immediate") ||
    noteLower.includes("ready") ||
    (deliveryYear && deliveryYear === CURRENT_YEAR)
  ) {
    if (noteLower.includes("month")) {
      const match = noteLower.match(/(\d+)\s*month/);
      if (match) {
        const months = match[1];
        return {
          label: `RTM (In ${months} Months)`,
          category: "rtm",
          shortLabel: `RTM (${months} Mo)`,
          yearsRemaining: 0,
        };
      }
    }
    return {
      label: "RTM (Immediate Delivery)",
      category: "rtm",
      shortLabel: "RTM (Immediate)",
      yearsRemaining: 0,
    };
  }

  // Check Off-Plan delivery year / note
  let targetYear = deliveryYear;

  if (!targetYear && deliveryNote) {
    const yearMatch = deliveryNote.match(/\b(202[6-9]|203[0-5])\b/);
    if (yearMatch) {
      targetYear = parseInt(yearMatch[1], 10);
    } else {
      const yearCountMatch = deliveryNote.match(/(\d+(\.\d+)?)\s*year/i);
      if (yearCountMatch) {
        const numYears = Math.round(parseFloat(yearCountMatch[1]));
        targetYear = CURRENT_YEAR + numYears;
      }
    }
  }

  if (targetYear && targetYear > CURRENT_YEAR) {
    const yearsRemaining = targetYear - CURRENT_YEAR;
    const yearText = yearsRemaining === 1 ? "1 Year" : `${yearsRemaining} Years`;
    return {
      label: `Off-Plan (In ${yearText} / ${targetYear})`,
      category: "offplan",
      shortLabel: `Off-Plan (${targetYear})`,
      yearsRemaining,
    };
  }

  if (targetYear && targetYear <= CURRENT_YEAR) {
    return {
      label: "RTM (Immediate Delivery)",
      category: "rtm",
      shortLabel: "RTM (Immediate)",
      yearsRemaining: 0,
    };
  }

  // Default fallback if unknown
  return {
    label: "Off-Plan (Schedule Pending)",
    category: "offplan",
    shortLabel: "Off-Plan",
  };
}
