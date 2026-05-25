import type { ZoneDef, ZoneProgress, ZoneUnlockReq, UserStats, HexStatus } from "./types";

// ─── Zone definitions ──────────────────────────────────────────────────────────

export const ZONE_DEFS: ZoneDef[] = [
  {
    id: "heritage_core",
    name: "Heritage Core",
    digipinCode: "MYS-4N2K",
    totalGems: 12,
    multiplier: 3.0,
    unlockRequirement: { type: "none" },
  },
  {
    id: "artisan_quarter",
    name: "Artisan Quarter",
    digipinCode: "MYS-7R8P",
    totalGems: 9,
    multiplier: 2.0,
    unlockRequirement: { type: "gems_in_zone", zoneId: "heritage_core", gemCount: 3 },
  },
  {
    id: "street_food_belt",
    name: "Street Food Belt",
    digipinCode: "MYS-1F5Q",
    totalGems: 8,
    multiplier: 1.5,
    unlockRequirement: { type: "level", level: 1 },
  },
  {
    id: "fort_zone",
    name: "Fort Zone",
    digipinCode: "MYS-9T4L",
    totalGems: 7,
    multiplier: 2.0,
    unlockRequirement: { type: "badge", badge: "zone_master" },
  },
  {
    id: "silk_district",
    name: "Silk District",
    digipinCode: "MYS-3K6W",
    totalGems: 6,
    multiplier: 2.5,
    unlockRequirement: { type: "level", level: 2 },
  },
];

// ─── Digipin → multiplier lookup ──────────────────────────────────────────────

const CODE_MULTIPLIER: Record<string, number> = Object.fromEntries(
  ZONE_DEFS.map((z) => [z.digipinCode, z.multiplier])
);

export function getZoneMultiplier(digipinCode: string): number {
  return CODE_MULTIPLIER[digipinCode] ?? 1.0;
}

export function getZoneByDigipin(code: string): ZoneDef | undefined {
  return ZONE_DEFS.find((z) => z.digipinCode === code);
}

// ─── Zone unlock check ────────────────────────────────────────────────────────

export function isZoneUnlocked(
  zone: ZoneDef,
  stats: UserStats,
  visitedGemsByZone: Record<string, number>,
  unlockedBadges: Set<string>,
  userLevelIndex: number
): boolean {
  const req: ZoneUnlockReq = zone.unlockRequirement;
  switch (req.type) {
    case "none": return true;
    case "gems_in_zone":
      return (visitedGemsByZone[req.zoneId!] ?? 0) >= (req.gemCount ?? 1);
    case "level":
      return userLevelIndex >= (req.level ?? 0);
    case "badge":
      return unlockedBadges.has(req.badge ?? "");
    default: return false;
  }
}

// ─── Zone completion ──────────────────────────────────────────────────────────

export function getZoneCompletion(
  zone: ZoneDef,
  visitedGemsInZone: number
): ZoneProgress {
  const visited = Math.min(visitedGemsInZone, zone.totalGems);
  const completionPct = zone.totalGems > 0
    ? Math.round((visited / zone.totalGems) * 100)
    : 0;
  return {
    zoneId: zone.id,
    visitedGems: visited,
    totalGems: zone.totalGems,
    completionPct,
    unlocked: true, // caller should check isZoneUnlocked separately
    masterBadgeEarned: completionPct === 100,
  };
}

// ─── Hex cell status transitions ──────────────────────────────────────────────

/**
 * Determine a hex cell's display status from game state.
 *  - "locked"   → zone not unlocked
 *  - "active"   → zone unlocked, no gem visited here yet
 *  - "explored" → user has visited a gem in this cell
 *  - "gem"      → user has visited an Epic/Legendary gem in this cell
 */
export function getHexDisplayStatus(
  isZoneUnlocked: boolean,
  gemVisited: boolean,
  hasLegendaryOrEpic: boolean
): HexStatus {
  if (!isZoneUnlocked) return "locked";
  if (!gemVisited)     return "active";
  if (hasLegendaryOrEpic) return "gem";
  return "explored";
}

/** Completion bonus: 500 pts awarded when a zone hits 100% for the first time */
export const ZONE_MASTER_BONUS_PTS = 500;
