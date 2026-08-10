/**
 * analytics.ts
 * Scoring engine for PropTrack Insight Dashboard.
 *
 * Scoring formula (per project):
 *   View      = +1
 *   Save/Fav  = +3
 *   Share     = +5
 *   Call click= +7
 *
 * Business-value bonuses (applied to projects that qualify):
 *   Underpriced vs destination avg = +10
 *   Urgent / new launch            = +6
 */

export type AnalyticsEvent = {
  type: "view" | "save" | "unsave" | "share" | "call" | "search" | "limit_hit" | "conversion";
  slug?: string; // project slug (for view/save/share/call)
  area?: string; // destination / area (for search / view)
  query?: string; // raw search text
  priceRange?: string; // e.g. "5-10M"
  timestamp: number;
  meta?: any;
};

// ────────────────────────────────────────────────────────────────
// Score computation
// ────────────────────────────────────────────────────────────────

const EVENT_WEIGHTS: Record<string, number> = {
  view: 1,
  save: 3,
  unsave: -3,
  share: 5,
  call: 7,
};

const RECENCY_WINDOW_MS = 72 * 60 * 60 * 1000; // 72 h — "trending" window

/** Score decay: events in the last 72 h get full weight; older get 0.3× */
function recencyMultiplier(timestamp: number): number {
  const age = Date.now() - timestamp;
  return age <= RECENCY_WINDOW_MS ? 1 : 0.3;
}

/** Compute per-project engagement score from the raw event log */
export function computeProjectScores(
  events: AnalyticsEvent[],
  compounds: any[],
  favorites: string[],
): Record<string, number> {
  const scores: Record<string, number> = {};

  // Seed with 0 for every known project
  for (const c of compounds) scores[c.slug] = 0;

  // Tally event weights
  for (const ev of events) {
    if (!ev.slug) continue;
    const w = EVENT_WEIGHTS[ev.type] ?? 0;
    scores[ev.slug] = (scores[ev.slug] ?? 0) + w * recencyMultiplier(ev.timestamp);
  }

  // Apply business-value bonuses
  const destPrices: Record<string, number[]> = {};
  for (const c of compounds) {
    if (!c.destination || !c.priceFrom) continue;
    if (!destPrices[c.destination]) destPrices[c.destination] = [];
    destPrices[c.destination].push(c.priceFrom);
  }

  for (const c of compounds) {
    const destAvg =
      destPrices[c.destination]?.reduce((a: number, b: number) => a + b, 0) /
        (destPrices[c.destination]?.length || 1) || 0;

    // Underpriced vs destination average → +10
    if (c.priceFrom && c.priceFrom < destAvg * 0.85) scores[c.slug] += 10;

    // New launch → +6 (urgency premium)
    if (c.isNewLaunch) scores[c.slug] += 6;
  }

  return scores;
}

/** Return the top N projects by score */
export function topProjectsByScore(
  scores: Record<string, number>,
  compounds: any[],
  n = 5,
): Array<{ compound: any; score: number }> {
  return compounds
    .map((c) => ({ compound: c, score: scores[c.slug] ?? 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

// ────────────────────────────────────────────────────────────────
// Trending Areas
// ────────────────────────────────────────────────────────────────

export type AreaInsight = {
  area: string;
  searchCount: number;
  viewCount: number;
  saveCount: number;
  score: number;
};

export function computeTrendingAreas(events: AnalyticsEvent[], compounds: any[]): AreaInsight[] {
  const areaMap: Record<string, AreaInsight> = {};

  // Build area lookup from compounds
  const slugToArea: Record<string, string> = {};
  for (const c of compounds) slugToArea[c.slug] = c.destination;

  for (const ev of events) {
    const area = ev.area || (ev.slug ? slugToArea[ev.slug] : null);
    if (!area) continue;

    if (!areaMap[area]) {
      areaMap[area] = { area, searchCount: 0, viewCount: 0, saveCount: 0, score: 0 };
    }

    const m = recencyMultiplier(ev.timestamp);

    if (ev.type === "search") areaMap[area].searchCount += m;
    if (ev.type === "view") areaMap[area].viewCount += m;
    if (ev.type === "save") areaMap[area].saveCount += m;

    // Aggregate score
    areaMap[area].score +=
      (ev.type === "search" ? 2 : ev.type === "view" ? 1 : ev.type === "save" ? 3 : 0) * m;
  }

  return Object.values(areaMap).sort((a, b) => b.score - a.score);
}

// ────────────────────────────────────────────────────────────────
// Top 3 Deals  (engagement + business value)
// ────────────────────────────────────────────────────────────────

export type DealScore = {
  compound: any;
  engagementScore: number;
  businessScore: number;
  totalScore: number;
  tags: string[];
};

export function computeTopDeals(
  events: AnalyticsEvent[],
  compounds: any[],
  favorites: string[],
  n = 3,
): DealScore[] {
  const engScores = computeProjectScores(events, compounds, favorites);

  // Build per-destination price avg for business value
  const destPrices: Record<string, number[]> = {};
  for (const c of compounds) {
    if (!c.destination || !c.priceFrom) continue;
    if (!destPrices[c.destination]) destPrices[c.destination] = [];
    destPrices[c.destination].push(c.priceFrom);
  }

  const deals: DealScore[] = compounds.map((c) => {
    const engagementScore = engScores[c.slug] ?? 0;
    let businessScore = 0;
    const tags: string[] = [];

    const destAvg =
      destPrices[c.destination]?.reduce((a: number, b: number) => a + b, 0) /
        (destPrices[c.destination]?.length || 1) || 0;

    if (c.priceFrom && c.priceFrom < destAvg * 0.85) {
      businessScore += 10;
      tags.push("Underpriced");
    }
    if (c.isNewLaunch) {
      businessScore += 6;
      tags.push("New Launch");
    }
    if (c.deliveryDate && new Date(c.deliveryDate).getFullYear() <= new Date().getFullYear() + 1) {
      businessScore += 6;
      tags.push("Ready Soon");
    }
    if (favorites.includes(c.slug)) {
      businessScore += 3;
      tags.push("Saved");
    }

    return {
      compound: c,
      engagementScore,
      businessScore,
      totalScore: engagementScore + businessScore,
      tags,
    };
  });

  return deals.sort((a, b) => b.totalScore - a.totalScore).slice(0, n);
}

// ────────────────────────────────────────────────────────────────
// Market Pulse — aggregated area performance
// ────────────────────────────────────────────────────────────────

export type MarketPulseEntry = {
  area: string;
  avgPrice: number;
  projectCount: number;
  trendScore: number;
  momentum: "rising" | "stable" | "cooling";
};

export function computeMarketPulse(events: AnalyticsEvent[], compounds: any[]): MarketPulseEntry[] {
  const areaData: Record<string, { prices: number[]; projects: number; trendScore: number }> = {};

  for (const c of compounds) {
    const area = c.destination;
    if (!area) continue;
    if (!areaData[area]) areaData[area] = { prices: [], projects: 0, trendScore: 0 };
    if (c.priceFrom) areaData[area].prices.push(c.priceFrom);
    areaData[area].projects++;
  }

  const trendingAreas = computeTrendingAreas(events, compounds);
  for (const ta of trendingAreas) {
    if (areaData[ta.area]) areaData[ta.area].trendScore = ta.score;
  }

  return Object.entries(areaData)
    .map(([area, d]) => {
      const avgPrice = d.prices.length ? d.prices.reduce((a, b) => a + b, 0) / d.prices.length : 0;
      const momentum: MarketPulseEntry["momentum"] =
        d.trendScore > 20 ? "rising" : d.trendScore > 5 ? "stable" : "cooling";
      return { area, avgPrice, projectCount: d.projects, trendScore: d.trendScore, momentum };
    })
    .sort((a, b) => b.trendScore - a.trendScore);
}
