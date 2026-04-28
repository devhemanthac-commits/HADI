import type { LeaderboardEntry, UserStats } from "./types";

// ─── Weekly score formula ─────────────────────────────────────────────────────

/**
 * Weekly score = checkin points + (karma earned this week × 2) + badge bonus points
 * Community points are tracked separately in the store; this function computes
 * the total from the stored weekly_score on the stats object.
 */
export function getWeeklyScore(stats: UserStats): number {
  return stats.weeklyScore;
}

// ─── Comparator / tie-breaking ────────────────────────────────────────────────

/**
 * Sort comparator implementing the 5-tier tie-breaking rules:
 *  1. Higher weekly score
 *  2. More unique gems this week
 *  3. Longer streak
 *  4. Earlier first check-in of the week
 *  5. Higher all-time XP
 */
export function compareEntries(a: LeaderboardEntry, b: LeaderboardEntry): number {
  if (b.weeklyScore !== a.weeklyScore) return b.weeklyScore - a.weeklyScore;
  if (b.uniqueGems  !== a.uniqueGems)  return b.uniqueGems  - a.uniqueGems;
  if (b.streakDays  !== a.streakDays)  return b.streakDays  - a.streakDays;

  // Earlier first check-in wins (lower timestamp = earlier)
  const aFirst = a.firstCheckinTimestamp ?? Infinity;
  const bFirst = b.firstCheckinTimestamp ?? Infinity;
  if (aFirst !== bFirst) return aFirst - bFirst;

  // All-time XP as final tiebreak
  return b.allTimeXP - a.allTimeXP;
}

// ─── Build ranked list ────────────────────────────────────────────────────────

export function buildLeaderboard(
  users: { userId: string; displayName: string; stats: UserStats }[]
): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = users.map(({ userId, displayName, stats }) => ({
    rank: 0,
    userId,
    displayName,
    weeklyScore: stats.weeklyScore,
    uniqueGems:  stats.weeklyGems,
    streakDays:  stats.streakDays,
    firstCheckinTimestamp: stats.firstCheckinOfWeekTimestamp,
    allTimeXP:   stats.totalXP,
  }));

  entries.sort(compareEntries);

  // Assign ranks (ties share same rank, next rank skips)
  let currentRank = 1;
  for (let i = 0; i < entries.length; i++) {
    if (i > 0 && compareEntries(entries[i], entries[i - 1]) === 0) {
      entries[i].rank = entries[i - 1].rank;
    } else {
      entries[i].rank = currentRank;
    }
    currentRank++;
  }

  return entries;
}

// ─── Weekly reset ─────────────────────────────────────────────────────────────

/**
 * Resets weekly counters on a UserStats object.
 * Call every Monday 00:00 UTC.
 * All-time XP is preserved; top-10 bonus (+50pts) is applied before reset.
 */
export function applyWeeklyReset(stats: UserStats, rank: number, nowISO: string): UserStats {
  const top10Bonus = rank <= 10 ? 50 : 0;
  return {
    ...stats,
    totalXP: stats.totalXP + top10Bonus, // last chance to absorb bonus
    weeklyScore: top10Bonus,             // new week starts with the bonus as seed
    weeklyGems: 0,
    firstCheckinOfWeekTimestamp: null,
    weeklyResetDate: nowISO.slice(0, 10),
  };
}

// ─── Zone-specific board ──────────────────────────────────────────────────────

export function buildZoneLeaderboard(
  users: { userId: string; displayName: string; stats: UserStats }[],
  zoneId: string,
  gemPointsByZone: Record<string, Record<string, number>> // userId -> zoneId -> pts
): LeaderboardEntry[] {
  return buildLeaderboard(
    users.map(({ userId, displayName, stats }) => ({
      userId,
      displayName,
      stats: {
        ...stats,
        weeklyScore: gemPointsByZone[userId]?.[zoneId] ?? 0,
      },
    }))
  );
}

// ─── Top-10 weekly champion check ────────────────────────────────────────────

export function getWeeklyChampions(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return entries.filter((e) => e.rank <= 3);
}
