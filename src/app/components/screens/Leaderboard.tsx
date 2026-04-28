import { useState } from "react";
import { useApp, useColors } from "../../context/AppContext";
import { useGame } from "../../store/GameStore";

const filterPills = ["This Week", "All Time", "By Zone"];
const zones = ["Heritage Core", "Artisan Quarter", "Street Food Belt", "Fort Zone", "Silk District"];

const AVATAR_EMOJIS = ["🧑", "👩", "👨", "👩‍🦰", "👩‍💼", "🧔", "👵", "👩‍🍳", "🧑‍🦱"];
const AVATAR_BGS = [
  "linear-gradient(135deg, #E07B2A, #C9921F)",
  "linear-gradient(135deg, #C9921F, #E07B2A)",
  "linear-gradient(135deg, #64748b, #94a3b8)",
  "linear-gradient(135deg, #92400e, #d97706)",
  "linear-gradient(135deg, #7c3aed, #4c1d95)",
  "linear-gradient(135deg, #065f46, #059669)",
  "linear-gradient(135deg, #1d4ed8, #06b6d4)",
  "linear-gradient(135deg, #ea580c, #d97706)",
];

function avatarForIndex(i: number) {
  return { emoji: AVATAR_EMOJIS[i % AVATAR_EMOJIS.length], bg: AVATAR_BGS[i % AVATAR_BGS.length] };
}

const medalEmoji: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

// Zone-specific leaderboards remain static (no per-zone scoring engine in v1)
const zoneLeaders: Record<string, { rank: number; name: string; gems: number; points: string; isMe: boolean }[]> = {
  "Heritage Core": [
    { rank: 1, name: "Priya Nair",  gems: 8, points: "1,640", isMe: false },
    { rank: 2, name: "Explorer",    gems: 3, points: "720",   isMe: true  },
    { rank: 3, name: "Arjun M.",    gems: 2, points: "480",   isMe: false },
  ],
  "Artisan Quarter": [
    { rank: 1, name: "Meena Devi",  gems: 6, points: "1,200", isMe: false },
    { rank: 2, name: "Suresh Rao",  gems: 4, points: "850",   isMe: false },
    { rank: 3, name: "Explorer",    gems: 1, points: "220",   isMe: true  },
  ],
  "Street Food Belt": [
    { rank: 1, name: "Kavitha S.",  gems: 5, points: "980",   isMe: false },
    { rank: 2, name: "Divya K.",    gems: 3, points: "620",   isMe: false },
  ],
  "Fort Zone": [
    { rank: 1, name: "Lakshmi V.", gems: 7, points: "1,540", isMe: false },
    { rank: 2, name: "Nirmala S.", gems: 4, points: "780",   isMe: false },
  ],
  "Silk District": [
    { rank: 1, name: "Suresh Rao", gems: 4, points: "900",   isMe: false },
    { rank: 2, name: "Priya Nair", gems: 3, points: "680",   isMe: false },
    { rank: 3, name: "Explorer",   gems: 2, points: "460",   isMe: true  },
  ],
};

export function Leaderboard() {
  const C = useColors();
  const { userName } = useApp();
  const { leaderboard, stats } = useGame();
  const [activeFilter, setActiveFilter] = useState("This Week");
  const [selectedZone, setSelectedZone] = useState("Heritage Core");

  const isZoneMode = activeFilter === "By Zone";

  // Derive display name: for "me" entry, use the live userName from context
  function displayName(entry: (typeof leaderboard)[number]): string {
    return entry.userId === stats.userId ? (userName || "Explorer") : entry.displayName;
  }

  const topThree = leaderboard.slice(0, 3);
  const currentZoneRaw = zoneLeaders[selectedZone] ?? [];
  // Replace "Explorer" placeholder with actual userName for isMe entries
  const currentZoneList = currentZoneRaw.map((e) =>
    e.isMe ? { ...e, name: userName || "Explorer" } : e
  );

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-playfair mb-1" style={{ color: C.text, fontSize: 24, fontWeight: 700 }}>
          Leaderboard
        </h1>
        <p className="font-dm" style={{ color: C.muted, fontSize: 14 }}>
          Top explorers of hidden Mysuru.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {filterPills.map((pill) => {
          const active = activeFilter === pill;
          return (
            <button
              key={pill}
              onClick={() => setActiveFilter(pill)}
              className="font-dm whitespace-nowrap shrink-0 pressable"
              style={{
                padding: "7px 18px",
                borderRadius: 99,
                background: active ? "#E07B2A" : "transparent",
                border: active ? "none" : `1px solid ${C.borderStrong}`,
                color: active ? "#fff" : C.muted,
                fontWeight: active ? 600 : 400,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {pill}
            </button>
          );
        })}
      </div>

      {/* Zone dropdown (only when By Zone is active) */}
      {isZoneMode && (
        <div className="flex flex-col gap-3">
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="font-dm outline-none"
            style={{
              background: C.card,
              border: `1.5px solid #E07B2A`,
              borderRadius: 14,
              padding: "12px 16px",
              color: C.text,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {zones.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>

          <div className="rounded-[20px] overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(26,18,8,0.05)" }}>
            {currentZoneList.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-dm" style={{ color: C.muted, fontSize: 14 }}>No explorers yet in this zone.</p>
              </div>
            ) : (
              currentZoneList.map((entry, idx) => {
                const av = avatarForIndex(idx);
                return (
                  <div
                    key={entry.rank}
                    className="flex items-center gap-4 px-5 py-4"
                    style={{
                      background: entry.isMe ? "rgba(224,123,42,0.06)" : "transparent",
                      borderBottom: idx < currentZoneList.length - 1 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    <div style={{ width: 32, flexShrink: 0, textAlign: "center" }}>
                      {entry.rank <= 3 ? (
                        <span style={{ fontSize: 20 }}>{medalEmoji[entry.rank]}</span>
                      ) : (
                        <span className="font-dm" style={{ color: C.muted, fontWeight: 600, fontSize: 14 }}>#{entry.rank}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 42, height: 42, background: av.bg, fontSize: 20, border: entry.isMe ? "2px solid #E07B2A" : "none" }}>
                      {av.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-dm" style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>
                        {entry.name}
                        {entry.isMe && <span className="font-dm" style={{ color: "#E07B2A", fontSize: 12, fontWeight: 500, marginLeft: 6 }}>👈 You</span>}
                      </p>
                      <p className="font-dm" style={{ color: C.muted, fontSize: 12 }}>💎 {entry.gems} gems in zone</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-playfair" style={{ color: "#E07B2A", fontWeight: 700, fontSize: 16 }}>{entry.points}</p>
                      <p className="font-dm" style={{ color: C.muted, fontSize: 11 }}>pts</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Normal leaderboard (not zone mode) */}
      {!isZoneMode && (
        <>
          {/* Podium — top 3 */}
          {topThree.length >= 1 && (
            <div className="rounded-[28px] px-6 pt-6 pb-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #E07B2A 0%, #c2410c 100%)" }}>
              <div className="flex items-end justify-center gap-3">
                {/* Rank 2 */}
                {topThree[1] && (() => {
                  const p = topThree[1];
                  const av = avatarForIndex(1);
                  return (
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 52, height: 52, background: av.bg, fontSize: 22, border: "2px solid rgba(255,255,255,0.3)" }}>{av.emoji}</div>
                      <p className="font-playfair" style={{ color: "#fff", fontWeight: 600, fontSize: 12, textAlign: "center", lineHeight: 1.2 }}>{displayName(p)}</p>
                      <p className="font-dm" style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>{p.weeklyScore.toLocaleString()} pts</p>
                      <div className="w-full flex items-center justify-center rounded-t-[8px]" style={{ height: 56, background: "rgba(255,255,255,0.15)" }}>
                        <span style={{ fontSize: 24 }}>🥈</span>
                      </div>
                    </div>
                  );
                })()}
                {/* Rank 1 */}
                {topThree[0] && (() => {
                  const p = topThree[0];
                  const av = avatarForIndex(0);
                  return (
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <span style={{ fontSize: 22 }}>👑</span>
                      <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 66, height: 66, background: av.bg, fontSize: 28, border: "3px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>{av.emoji}</div>
                      <p className="font-playfair" style={{ color: "#fff", fontWeight: 700, fontSize: 14, textAlign: "center", lineHeight: 1.2 }}>{displayName(p)}</p>
                      <p className="font-dm" style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600 }}>{p.weeklyScore.toLocaleString()} pts</p>
                      <div className="w-full flex items-center justify-center rounded-t-[8px]" style={{ height: 80, background: "rgba(255,255,255,0.22)" }}>
                        <span style={{ fontSize: 30 }}>🥇</span>
                      </div>
                    </div>
                  );
                })()}
                {/* Rank 3 */}
                {topThree[2] && (() => {
                  const p = topThree[2];
                  const av = avatarForIndex(2);
                  return (
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 52, height: 52, background: av.bg, fontSize: 22, border: "2px solid rgba(255,255,255,0.3)" }}>{av.emoji}</div>
                      <p className="font-playfair" style={{ color: "#fff", fontWeight: 600, fontSize: 12, textAlign: "center", lineHeight: 1.2 }}>{displayName(p)}</p>
                      <p className="font-dm" style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>{p.weeklyScore.toLocaleString()} pts</p>
                      <div className="w-full flex items-center justify-center rounded-t-[8px]" style={{ height: 40, background: "rgba(255,255,255,0.1)" }}>
                        <span style={{ fontSize: 22 }}>🥉</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Ranked list */}
          <div className="rounded-[20px] overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(26,18,8,0.05)" }}>
            {leaderboard.map((entry, idx) => {
              const isMe = entry.userId === stats.userId;
              const av = avatarForIndex(idx);
              return (
                <div
                  key={entry.userId}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{
                    background: isMe ? "rgba(224,123,42,0.06)" : "transparent",
                    borderBottom: idx < leaderboard.length - 1 ? `1px solid ${C.border}` : "none",
                  }}
                >
                  <div style={{ width: 32, flexShrink: 0, textAlign: "center" }}>
                    {entry.rank <= 3 ? (
                      <span style={{ fontSize: 20 }}>{medalEmoji[entry.rank]}</span>
                    ) : (
                      <span className="font-dm" style={{ color: C.muted, fontWeight: 600, fontSize: 14 }}>#{entry.rank}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 42, height: 42, background: av.bg, fontSize: 20, border: isMe ? "2px solid #E07B2A" : "none" }}>
                    {av.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-dm" style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>
                      {displayName(entry)}
                      {isMe && <span className="font-dm" style={{ color: "#E07B2A", fontSize: 12, fontWeight: 500, marginLeft: 6 }}>👈 You</span>}
                    </p>
                    <p className="font-dm" style={{ color: C.muted, fontSize: 12 }}>💎 {entry.uniqueGems} gems · 🔥 {entry.streakDays}d streak</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-playfair" style={{ color: "#E07B2A", fontWeight: 700, fontSize: 16 }}>{entry.weeklyScore.toLocaleString()}</p>
                    <p className="font-dm" style={{ color: C.muted, fontSize: 11 }}>pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
