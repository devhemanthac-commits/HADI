import type { Coords, CheckinRecord, CheckinResult, GemState, UserStats } from "./types";
import { getBloomStatus, getBloomMultiplier, incrementBloomCapacity } from "./bloom";
import { calculatePoints, updateStreak, getLevelInfo, checkNewBadges } from "./points";
import { getZoneMultiplier } from "./hexmap";

// ─── Constants ─────────────────────────────────────────────────────────────────

const MAX_CHECKIN_RADIUS_M = 100;
const PRECISION_BONUS_RADIUS_M = 20;
const LOW_ACCURACY_RADIUS_M = 50;
const DUPLICATE_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX_CHECKINS_PER_HOUR = 10;
const MAX_VELOCITY_MS = 500 / 90;  // 500m / 90s in m/ms — faster than this = spoofed
const MAX_GPS_ACCURACY_M = 30;     // reject readings with stated accuracy > 30m

// ─── Haversine distance ────────────────────────────────────────────────────────

export function haversineDistance(a: Coords, b: Coords): number {
  const R = 6_371_000; // metres
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const x = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ─── Proximity multiplier ──────────────────────────────────────────────────────

export function getProximityMultiplier(distanceM: number): number {
  if (distanceM <= PRECISION_BONUS_RADIUS_M) return 1.5;
  if (distanceM <= LOW_ACCURACY_RADIUS_M)    return 1.0;
  if (distanceM <= MAX_CHECKIN_RADIUS_M)     return 0.85;
  return 0; // out of range
}

// ─── Anti-spoofing checks ──────────────────────────────────────────────────────

interface SpoofCheck {
  valid: boolean;
  reason?: string;
}

export function checkVelocitySpoof(
  currentCoords: Coords,
  currentTimestamp: number,
  lastRecord: CheckinRecord | null
): SpoofCheck {
  if (!lastRecord) return { valid: true };
  const timeDeltaMs = currentTimestamp - lastRecord.timestamp;
  if (timeDeltaMs < 90_000) {
    const dist = haversineDistance(currentCoords, lastRecord.coords);
    if (dist > 500) {
      return { valid: false, reason: "Location changed too fast — possible GPS spoof detected." };
    }
  }
  return { valid: true };
}

export function checkGPSAccuracy(accuracyM: number): SpoofCheck {
  if (accuracyM > MAX_GPS_ACCURACY_M) {
    return { valid: false, reason: `GPS accuracy too low (${Math.round(accuracyM)}m). Move to an open area.` };
  }
  return { valid: true };
}

export function checkDuplicateCheckin(
  userId: string,
  gemId: number,
  recentRecords: CheckinRecord[],
  nowMs: number
): SpoofCheck {
  const recent = recentRecords.find(
    (r) => r.userId === userId && r.gemId === gemId && nowMs - r.timestamp < DUPLICATE_WINDOW_MS
  );
  if (recent) {
    const waitMin = Math.ceil((DUPLICATE_WINDOW_MS - (nowMs - recent.timestamp)) / 60_000);
    return { valid: false, reason: `Already checked in here recently. Try again in ${waitMin} min.` };
  }
  return { valid: true };
}

export function checkHourlyRateLimit(
  userId: string,
  recentRecords: CheckinRecord[],
  nowMs: number
): SpoofCheck {
  const last1h = recentRecords.filter(
    (r) => r.userId === userId && nowMs - r.timestamp < 3_600_000
  );
  if (last1h.length >= MAX_CHECKINS_PER_HOUR) {
    return { valid: false, reason: "Check-in limit reached (10/hour). Slow down, explorer!" };
  }
  return { valid: true };
}

// ─── Main verify function ──────────────────────────────────────────────────────

export interface VerifyCheckinInput {
  userCoords: Coords;
  gpsAccuracy: number;
  method: "gps" | "qr";
  gem: GemState;
  stats: UserStats;
  isBuddyActive: boolean;
  unlockedBadges: Set<string>;
  recentRecords: CheckinRecord[];
  lastRecord: CheckinRecord | null;
  nowMs?: number;
  nowISO?: string;
}

export function verifyCheckin(input: VerifyCheckinInput): CheckinResult {
  const now = input.nowMs ?? Date.now();
  const nowISO = input.nowISO ?? new Date(now).toISOString();

  // ── GPS-only validations (skip for QR) ────────────────────────────────────
  if (input.method === "gps") {
    const acc = checkGPSAccuracy(input.gpsAccuracy);
    if (!acc.valid) return { valid: false, reason: acc.reason };

    const vel = checkVelocitySpoof(input.userCoords, now, input.lastRecord);
    if (!vel.valid) return { valid: false, reason: vel.reason };
  }

  // ── Duplicate & rate limit (both methods) ─────────────────────────────────
  const dup = checkDuplicateCheckin(input.stats.userId, input.gem.id, input.recentRecords, now);
  if (!dup.valid) return { valid: false, reason: dup.reason };

  const rate = checkHourlyRateLimit(input.stats.userId, input.recentRecords, now);
  if (!rate.valid) return { valid: false, reason: rate.reason };

  // ── Distance check ────────────────────────────────────────────────────────
  const distance = input.method === "qr"
    ? 0  // QR bypasses distance
    : haversineDistance(input.userCoords, input.gem.coords);

  const proximityMultiplier = input.method === "qr" ? 1.0 : getProximityMultiplier(distance);
  if (proximityMultiplier === 0) {
    return { valid: false, reason: `Too far from gem (${Math.round(distance)}m). Move within 100m.`, distance };
  }

  // ── Bloom check ───────────────────────────────────────────────────────────
  const currentBloomStatus = getBloomStatus(input.gem.bloomCapacity);
  if (currentBloomStatus === "Dormant") {
    return { valid: false, reason: "This gem is Dormant — too many recent visitors. Come back later." };
  }
  const bloomMultiplier = getBloomMultiplier(currentBloomStatus);

  // ── Zone multiplier ───────────────────────────────────────────────────────
  const zoneMultiplier = getZoneMultiplier(input.gem.digipinCode);

  // ── Streak ────────────────────────────────────────────────────────────────
  const { newStreakDays, wasUpdated: streakUpdated } = updateStreak(input.stats, nowISO);

  // ── Point calculation ─────────────────────────────────────────────────────
  const breakdown = calculatePoints({
    rarityTier: input.gem.rarityTier,
    zoneMultiplier,
    proximityMultiplier,
    bloomMultiplier,
    streakDays: newStreakDays,
    buddyActive: input.isBuddyActive,
  });

  // ── Bloom capacity update ─────────────────────────────────────────────────
  const newBloomCapacity = incrementBloomCapacity(input.gem.bloomCapacity, input.gem.rarityTier);
  const newBloomStatus   = getBloomStatus(newBloomCapacity);

  // ── Level & badge changes ─────────────────────────────────────────────────
  const prevXP = input.stats.totalXP;
  const nextXP = prevXP + breakdown.total;
  const { level: newLevel, didLevelUp } = getLevelInfo(nextXP, prevXP);

  const nextStats: UserStats = {
    ...input.stats,
    totalXP: nextXP,
    weeklyScore: input.stats.weeklyScore + breakdown.total,
    weeklyGems: input.stats.weeklyGems + 1,
    allTimeGems: input.stats.allTimeGems + 1,
    streakDays: newStreakDays,
    lastCheckinDate: nowISO.slice(0, 10),
    firstCheckinOfWeekTimestamp: input.stats.firstCheckinOfWeekTimestamp ?? now,
  };

  const badgesUnlocked = checkNewBadges(input.stats, nextStats, input.unlockedBadges);

  return {
    valid: true,
    distance,
    proximityMultiplier,
    pointsAwarded: breakdown.total,
    breakdown,
    newBloomCapacity,
    newBloomStatus,
    badgesUnlocked,
    levelUp: didLevelUp,
    newLevel: didLevelUp ? newLevel.name : undefined,
    streakUpdated,
    newStreakDays,
  };
}
