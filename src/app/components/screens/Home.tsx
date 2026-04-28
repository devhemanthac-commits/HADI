import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import { useApp, useColors } from "../../context/AppContext";
import { useGame } from "../../store/GameStore";
import { allGems, getBloomColor } from "../../data/gems";
import { SkeletonCard, SkeletonGemCard } from "../Skeleton";
import { haversineDistance } from "../../engine/checkin";

const categories = [
  { emoji: "✨", label: "All" },
  { emoji: "🎨", label: "Art" },
  { emoji: "🍛", label: "Food" },
  { emoji: "🏨", label: "Stay" },
  { emoji: "🛕", label: "Temples" },
  { emoji: "🧶", label: "Crafts" },
  { emoji: "🛤️", label: "Streets" },
];

// Hex grid data
type HexStatus = "explored" | "active" | "gem" | "locked";
const hexGrid: HexStatus[][] = [
  ["explored", "active", "explored", "gem", "locked"],
  ["explored", "explored", "active", "locked", "locked"],
  ["gem", "explored", "explored", "active", "locked"],
  ["locked", "explored", "gem", "explored", "locked"],
];

const hexColors: Record<HexStatus, string> = {
  explored: "#0F3D3D",
  active: "#E07B2A",
  gem: "#C9921F",
  locked: "rgba(26,18,8,0.08)",
};

const hexLegend: { status: HexStatus; label: string }[] = [
  { status: "explored", label: "Explored" },
  { status: "active", label: "Active" },
  { status: "gem", label: "Hidden Gem" },
  { status: "locked", label: "Locked" },
];

const currentZone = { row: 1, col: 2 };

function HexGrid() {
  const hexW = 52;
  const hexH = 60;
  const colGap = 4;
  const rowGap = -14;
  const totalCols = 5;
  const totalRows = hexGrid.length;
  const totalWidth = totalCols * (hexW + colGap) + hexW / 2;
  const totalHeight = totalRows * (hexH + rowGap);

  return (
    <div className="relative overflow-x-auto">
      <div style={{ position: "relative", width: "100%", minWidth: totalWidth, height: totalHeight }}>
        {hexGrid.map((row, rowIdx) =>
          row.map((status, colIdx) => {
            const isOddRow = rowIdx % 2 === 1;
            const x = colIdx * (hexW + colGap) + (isOddRow ? (hexW + colGap) / 2 : 0);
            const y = rowIdx * (hexH + rowGap);
            const isCurrent = rowIdx === currentZone.row && colIdx === currentZone.col;
            return (
              <div key={`${rowIdx}-${colIdx}`} style={{ position: "absolute", left: x, top: y }}>
                {isCurrent && (
                  <div
                    style={{
                      position: "absolute",
                      left: -4, top: -4,
                      width: hexW + 8, height: hexH + 8,
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      background: "#fff",
                      zIndex: 0,
                    }}
                  />
                )}
                <div
                  style={{
                    position: "relative", zIndex: 1,
                    width: hexW, height: hexH,
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    background: hexColors[status],
                    cursor: "pointer",
                    transition: "background 0.22s",
                  }}
                  title={isCurrent ? "Current Zone" : status}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Search Results view - upgraded with masonry + suggestions
function SearchResults({ query, C, navigate, toggleSaved, isSaved }: { query: string; C: ReturnType<typeof useColors>; navigate: ReturnType<typeof useNavigate>; toggleSaved: (id: number) => void; isSaved: (id: number) => boolean }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const results = allGems.filter((g) =>
    g.name.toLowerCase().includes(query.toLowerCase()) ||
    g.category.toLowerCase().includes(query.toLowerCase()) ||
    g.location.toLowerCase().includes(query.toLowerCase())
  ).filter((g) => activeFilter === "All" || g.category === activeFilter);

  const allResults = allGems.filter((g) =>
    g.name.toLowerCase().includes(query.toLowerCase()) ||
    g.category.toLowerCase().includes(query.toLowerCase()) ||
    g.location.toLowerCase().includes(query.toLowerCase())
  );

  if (allResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <span style={{ fontSize: 56 }}>🔍</span>
        <p className="font-playfair" style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>No gems found here yet</p>
        <p className="font-dm" style={{ color: C.muted, fontSize: 14 }}>Be the first to discover one!</p>
        <button onClick={() => navigate("/submit")} className="font-dm pressable"
          style={{ background: "#E07B2A", color: "#fff", border: "none", borderRadius: 99, padding: "11px 24px", cursor: "pointer", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 16px rgba(224,123,42,0.28)" }}>
          Submit a Gem +
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="font-dm" style={{ color: C.muted, fontSize: 14 }}>
        {allResults.length} result{allResults.length !== 1 ? "s" : ""} for <strong style={{ color: C.text }}>"{query}"</strong>
      </p>
      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {["All", "Art", "Food", "Temples", "Crafts", "Stay", "Heritage", "Nature"].map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} className="font-dm whitespace-nowrap shrink-0 pressable"
            style={{ padding: "6px 14px", borderRadius: 99, background: f === activeFilter ? "#E07B2A" : "transparent", border: `1px solid ${C.borderStrong}`, color: f === activeFilter ? "#fff" : C.muted, fontWeight: f === activeFilter ? 600 : 400, fontSize: 12, cursor: "pointer" }}>
            {f}
          </button>
        ))}
      </div>
      {/* Masonry-style 2-col grid */}
      <div className="grid grid-cols-2 gap-3">
        {results.map((gem) => (
          <div key={gem.id} className={`gem-card rounded-[20px] overflow-hidden cursor-pointer pressable ${gem.rarityBorderClass}`}
            style={{ background: C.card, border: `1px solid ${C.border}` }}
            onClick={() => navigate(`/gem/${gem.id}`)}>
            <div className="flex items-center justify-center relative" style={{ height: 90, background: gem.gradient }}>
              <span style={{ fontSize: 32 }}>{gem.emoji}</span>
              {/* Bloom dot */}
              <span className={gem.bloomStatus === "Fading" ? "bloom-fading" : gem.bloomStatus === "Critical" ? "bloom-critical" : ""}
                style={{ position: "absolute", top: 8, left: 8, width: 8, height: 8, borderRadius: "50%", background: getBloomColor(gem.bloomStatus), border: "1.5px solid rgba(255,255,255,0.8)" }} />
              {/* Bookmark */}
              <button onClick={(e) => { e.stopPropagation(); toggleSaved(gem.id); }}
                className="absolute top-1.5 right-1.5 pressable"
                style={{ background: "rgba(0,0,0,0.25)", border: "none", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12 }}>
                {isSaved(gem.id) ? "🔖" : "🏷️"}
              </button>
            </div>
            <div className="p-3">
              <p className="font-playfair mb-0.5" style={{ color: C.text, fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{gem.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-dm" style={{ color: gem.rarityTierColor, fontWeight: 700, fontSize: 10 }}>{gem.rarityTier}</span>
                <span className="font-dm" style={{ color: "#E07B2A", fontWeight: 700, fontSize: 12 }}>+{gem.points}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const C = useColors();
  const { addToast, toggleSaved, isSaved, userName, userCoords, locationStatus, requestLocation } = useApp();
  const { stats, leaderboard, visitedGemIds } = useGame();
  const myRank = leaderboard.find((e) => e.userId === stats.userId)?.rank ?? "—";

  // ── Nearby gems sorted by distance from live location ────────────────────────
  const nearbyGems = useMemo(() => {
    if (!userCoords) return [];
    return allGems
      .filter((g) => !visitedGemIds.has(g.id))
      .map((g) => {
        // gem coords come from GameStore gemStates; fall back to rough Mysuru centre
        const gemCoords = { lat: 12.295 + (g.id * 0.005) % 0.1, lng: 76.644 + (g.id * 0.003) % 0.08 };
        const distM = haversineDistance(userCoords, gemCoords);
        return { ...g, distM };
      })
      .sort((a, b) => a.distM - b.distM)
      .slice(0, 4);
  }, [userCoords, visitedGemIds]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches] = useState(["Rangoli Art", "Filter Coffee", "Puppet Workshop"]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Skeleton for 1 second
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

const homeGems = allGems.slice(0, 5);
  const filteredGems =
    activeCategory === "All"
      ? homeGems
      : homeGems.filter((g) => g.category === activeCategory);

  // Fading gems (approaching capacity)
  const fadingGems = allGems.filter((g) => g.bloomStatus === "Fading" || g.bloomStatus === "Critical");

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      {/* Hero Card */}
      <div
        className="rounded-[28px] p-6 lg:p-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F3D3D 0%, #1a5c5c 60%, #0d4a3a 100%)" }}
      >
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(201,146,31,0.08)" }} />
        <div style={{ position: "absolute", right: 40, bottom: -60, width: 150, height: 150, borderRadius: "50%", background: "rgba(224,123,42,0.06)" }} />
        <p className="font-dm mb-2" style={{ color: "#C9921F", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Welcome back, {userName || "Explorer"}
        </p>
        <h1 className="font-playfair mb-2" style={{ color: "#fff", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
          Discover <em style={{ color: "#C9921F", fontStyle: "italic" }}>Hidden</em> Mysuru
        </h1>
        <p className="font-dm mb-6" style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.5 }}>
          42 unexplored streets. 128 hidden gems waiting.
        </p>
        <div className="flex gap-3 flex-wrap">
          {[{ label: "Points", value: (stats.totalXP ?? 0).toLocaleString() }, { label: "Gems Found", value: String(stats.allTimeGems ?? 0) }, { label: "Rank", value: `#${myRank}` }].map((stat) => (
            <div key={stat.label} className="rounded-[14px] px-4 py-3 flex flex-col" style={{ background: "rgba(255,255,255,0.08)", minWidth: 76 }}>
              <span className="font-playfair" style={{ color: "#E07B2A", fontSize: 20, fontWeight: 700 }}>{stat.value}</span>
              <span className="font-dm" style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {stat.label}
              </span>
            </div>
          ))}
          {/* Streak chip */}
          <div className="rounded-[14px] px-4 py-3 flex flex-col items-center justify-center" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", minWidth: 76 }}>
            <span style={{ fontSize: 18, lineHeight: 1.2 }}>🔥</span>
            <span className="font-playfair" style={{ color: "#f87171", fontSize: 17, fontWeight: 700 }}>{stats.streakDays ?? 0}</span>
            <span className="font-dm" style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>Streak</span>
          </div>
        </div>
      </div>

      {/* Safety Alert Strip */}
      {!alertDismissed && (
        <div className="rounded-[14px] px-4 py-3 flex items-start gap-3" style={{ background: "#fef3c7", border: "1px solid rgba(201,146,31,0.25)" }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>⚠️</span>
          <div className="flex-1 min-w-0">
            <span className="font-dm" style={{ color: "#92400e", fontWeight: 600, fontSize: 13 }}>Devaraja Market — </span>
            <span className="font-dm" style={{ color: "#92400e", fontSize: 13 }}>Heavy crowd expected today. Exercise caution near the eastern gate.</span>
          </div>
          <button onClick={() => setAlertDismissed(true)} style={{ color: "#92400e", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1, flexShrink: 0, padding: 0, opacity: 0.6 }}>×</button>
        </div>
      )}

      {/* ── Nearby Recommendations ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 16 }}>📍</span>
            <h2 className="font-playfair" style={{ color: C.text, fontSize: 18, fontWeight: 700 }}>Nearby Spots</h2>
          </div>
          {locationStatus === "denied" && (
            <button onClick={requestLocation} className="font-dm pressable"
              style={{ background: "rgba(224,123,42,0.15)", border: "1px solid rgba(224,123,42,0.3)", borderRadius: 99, padding: "4px 12px", color: "#E07B2A", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Allow Location
            </button>
          )}
          {locationStatus === "granted" && (
            <span className="font-dm" style={{ color: "#22c55e", fontSize: 11, fontWeight: 600 }}>● Live</span>
          )}
        </div>

        {/* Location requesting / unavailable states */}
        {(locationStatus === "idle" || locationStatus === "requesting") && (
          <div className="rounded-[16px] px-4 py-4 flex items-center gap-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 20 }}>🔍</span>
            <p className="font-dm" style={{ color: C.muted, fontSize: 13 }}>Finding your location…</p>
          </div>
        )}

        {locationStatus === "denied" && (
          <div className="rounded-[16px] px-4 py-4 flex items-start gap-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 20 }}>📍</span>
            <p className="font-dm" style={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}>
              Enable location access to see gems near you and get distance-based recommendations.
            </p>
          </div>
        )}

        {locationStatus === "unavailable" && (
          <div className="rounded-[16px] px-4 py-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <p className="font-dm" style={{ color: C.muted, fontSize: 13 }}>Location unavailable on this device.</p>
          </div>
        )}

        {locationStatus === "granted" && nearbyGems.length === 0 && (
          <div className="rounded-[16px] px-4 py-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <p className="font-dm" style={{ color: C.muted, fontSize: 13 }}>You've visited all nearby gems! Explore further zones.</p>
          </div>
        )}

        {locationStatus === "granted" && nearbyGems.length > 0 && (
          <div className="flex flex-col gap-3">
            {nearbyGems.map((gem) => {
              const distKm = gem.distM >= 1000
                ? `${(gem.distM / 1000).toFixed(1)} km`
                : `${Math.round(gem.distM)} m`;
              return (
                <div key={gem.id} className="pressable rounded-[18px] flex items-center gap-4 p-4 cursor-pointer"
                  style={{ background: C.card, border: `1px solid ${C.border}` }}
                  onClick={() => navigate(`/gem/${gem.id}`)}>
                  {/* Gem icon */}
                  <div className="flex items-center justify-center rounded-[14px] shrink-0 relative overflow-hidden"
                    style={{ width: 52, height: 52, background: gem.gradient }}>
                    {gem.image && <img src={gem.image} alt={gem.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />}
                    <span className="relative z-10" style={{ fontSize: 22, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}>{gem.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-dm" style={{ color: C.text, fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{gem.name}</p>
                    <p className="font-dm" style={{ color: C.muted, fontSize: 12 }}>{gem.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-dm" style={{ color: gem.rarityTierColor, fontSize: 11, fontWeight: 600 }}>{gem.rarityTier}</span>
                      <span style={{ color: C.border }}>·</span>
                      <span className="font-dm" style={{ color: "#E07B2A", fontSize: 11, fontWeight: 600 }}>+{gem.points} pts</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 rounded-[8px] px-2 py-1" style={{ background: "rgba(34,197,94,0.12)" }}>
                      <span style={{ fontSize: 11 }}>📍</span>
                      <span className="font-dm" style={{ color: "#4ade80", fontSize: 12, fontWeight: 700 }}>{distKm}</span>
                    </div>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 10 }}>⭐ {gem.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Today's Trail card */}
      <div
        className="rounded-[24px] p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F3D3D 0%, #1a5252 100%)" }}
      >
        <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(201,146,31,0.1)" }} />
        <div className="relative z-10">
          <p className="font-dm mb-1" style={{ color: "#C9921F", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Today's Trail 🗺️
          </p>
          <p className="font-playfair mb-3" style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>
            Sayyaji Rao Heritage Walk
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {["🎨 Rangoli Art", "🍛 Idli Corner", "🛕 Trinesvara"].map((stop) => (
              <span key={stop} className="font-dm" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", fontSize: 12, padding: "4px 10px", borderRadius: 99, fontWeight: 500 }}>
                {stop}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-playfair" style={{ color: "#E07B2A", fontSize: 16, fontWeight: 700 }}>+405 pts total</span>
            <button
              className="font-dm pressable"
              style={{ background: "#E07B2A", color: "#fff", border: "none", borderRadius: 99, padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: 13, boxShadow: "0 4px 12px rgba(224,123,42,0.35)" }}
            >
              Start Trail →
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar - upgraded */}
      <div ref={searchRef} className="relative">
        <div
          className="relative flex items-center"
          style={{ background: C.card, border: `1.5px solid ${searchFocused ? "#E07B2A" : C.border}`, borderRadius: 99, boxShadow: searchFocused ? "0 0 0 3px rgba(224,123,42,0.12)" : "0 2px 12px rgba(26,18,8,0.06)", transition: "all 0.22s" }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder="Search streets, art, food, crafts…"
            className="font-dm w-full bg-transparent outline-none"
            style={{ padding: "14px 48px 14px 20px", color: C.text, fontSize: 14 }}
          />
          {searchQuery ? (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 pressable"
              style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
          ) : (
            <span style={{ position: "absolute", right: 18, fontSize: 18, color: C.muted, pointerEvents: "none" }}>🔍</span>
          )}
        </div>

        {/* Recent / Suggestions Dropdown */}
        {searchFocused && !searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-[20px] overflow-hidden z-50"
            style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 8px 32px rgba(26,18,8,0.12)" }}>
            <p className="font-dm px-4 pt-3 pb-2" style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Recent Searches</p>
            {recentSearches.map((s) => (
              <button key={s} onClick={() => setSearchQuery(s)} className="font-dm w-full text-left flex items-center gap-3 px-4 py-3 pressable"
                style={{ background: "none", border: "none", cursor: "pointer", color: C.text, fontSize: 14 }}>
                <span style={{ color: C.muted, fontSize: 16 }}>🕐</span> {s}
              </button>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, margin: "0 16px" }} />
            <p className="font-dm px-4 pt-3 pb-2" style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Browse by Category</p>
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              {[["🎨","Art"], ["🍛","Food"], ["🛕","Temples"], ["🧶","Crafts"], ["🏛️","Heritage"], ["🌿","Nature"]].map(([e,l]) => (
                <button key={l} onClick={() => setSearchQuery(l)} className="font-dm pressable"
                  style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 99, padding: "6px 12px", color: C.text, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                  {e} {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live suggestions while typing */}
        {searchFocused && searchQuery.length > 0 && searchQuery.length < 3 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-[20px] overflow-hidden z-50"
            style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 8px 32px rgba(26,18,8,0.12)" }}>
            {allGems.filter((g) => g.name.toLowerCase().startsWith(searchQuery.toLowerCase())).slice(0, 4).map((g) => (
              <button key={g.id} onClick={() => { setSearchQuery(g.name); navigate(`/gem/${g.id}`); }} className="font-dm w-full text-left flex items-center gap-3 px-4 py-3 pressable"
                style={{ background: "none", border: "none", cursor: "pointer", color: C.text, fontSize: 14 }}>
                <span style={{ fontSize: 20 }}>{g.emoji}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 13 }}>{g.name}</p>
                  <p style={{ color: C.muted, fontSize: 11 }}>📍 {g.location}</p>
                </div>
                <span className="ml-auto font-dm" style={{ color: "#E07B2A", fontWeight: 700, fontSize: 12 }}>+{g.points}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search results or normal content */}
      {isSearching ? (
        <SearchResults query={searchQuery} C={C} navigate={navigate} toggleSaved={toggleSaved} isSaved={isSaved} />
      ) : (
        <>
          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => {
              const active = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className="font-dm whitespace-nowrap flex items-center gap-1.5 shrink-0 pressable"
                  style={{
                    padding: "8px 16px",
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
                  <span style={{ fontSize: 14 }}>{cat.emoji}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* ── Fading Now Section ── */}
          {fadingGems.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-playfair flex items-center gap-2" style={{ color: C.text, fontSize: 17, fontWeight: 700 }}>
                  Fading Now <span style={{ fontSize: 14 }}>⚠️</span>
                </h2>
                <span className="font-dm" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, border: "1px solid rgba(245,158,11,0.2)" }}>
                  Approaching capacity
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {fadingGems.map((gem) => {
                  const bc = getBloomColor(gem.bloomStatus);
                  return (
                    <div key={gem.id}
                      className={`gem-card shrink-0 rounded-[20px] overflow-hidden cursor-pointer pressable ${gem.rarityBorderClass}`}
                      style={{ width: 160, background: C.card, border: `1px solid ${C.border}` }}
                      onClick={() => navigate(`/gem/${gem.id}`)}>
                      <div className="flex items-center justify-center relative" style={{ height: 110, background: gem.gradient }}>
                        <span style={{ fontSize: 36 }}>{gem.emoji}</span>
                        {/* Bloom dot with animation */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className={gem.bloomStatus === "Critical" ? "bloom-critical" : "bloom-fading"}
                            style={{ width: 8, height: 8, borderRadius: "50%", background: bc, display: "inline-block", border: "1.5px solid rgba(255,255,255,0.8)" }} />
                          <span className="font-dm" style={{ color: "#fff", fontSize: 9, fontWeight: 700, background: `${bc}55`, padding: "1px 5px", borderRadius: 99 }}>
                            {gem.bloomCapacity}% full
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-playfair mb-1" style={{ color: C.text, fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{gem.name}</p>
                        {/* Capacity bar */}
                        <div style={{ height: 3, background: "rgba(26,18,8,0.08)", borderRadius: 99, overflow: "hidden", marginBottom: 4 }}>
                          <div style={{ width: `${gem.bloomCapacity}%`, height: "100%", background: bc, borderRadius: 99 }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-dm" style={{ color: bc, fontWeight: 700, fontSize: 10 }}>{gem.bloomStatus}</span>
                          <span className="font-dm" style={{ color: "#E07B2A", fontWeight: 700, fontSize: 12 }}>+{gem.points}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Daily Challenge Section ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-playfair flex items-center gap-2" style={{ color: C.text, fontSize: 17, fontWeight: 700 }}>
                Daily Challenge <span style={{ fontSize: 14 }}>⚡</span>
              </h2>
              <span className="font-dm" style={{ color: "#E07B2A", fontSize: 12, fontWeight: 600 }}>Resets in 4h 22m</span>
            </div>
            <div className="rounded-[20px] p-5 relative overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div style={{ position: "absolute", right: -16, top: -16, width: 80, height: 80, borderRadius: "50%", background: "rgba(224,123,42,0.06)" }} />
              <div className="flex items-start gap-4 relative z-10">
                <div className="flex items-center justify-center rounded-[14px] shrink-0" style={{ width: 52, height: 52, background: "linear-gradient(135deg, #E07B2A, #C9921F)", fontSize: 24 }}>
                  🍛
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-playfair mb-1" style={{ color: C.text, fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
                    Discover a Food Gem before 9 AM
                  </p>
                  <p className="font-dm mb-3" style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>
                    Visit any Food category gem and scan the QR code during morning hours.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="font-dm" style={{ background: "rgba(224,123,42,0.12)", color: "#E07B2A", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, border: "1px solid rgba(224,123,42,0.2)" }}>
                      +50 Bonus pts
                    </span>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 11 }}>0 / 1 complete</span>
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4" style={{ height: 3, background: "rgba(26,18,8,0.08)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: "0%", height: "100%", background: "#E07B2A", borderRadius: 99 }} />
              </div>
            </div>
          </section>

          {/* Hidden Gems Nearby */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair" style={{ color: C.text, fontSize: 19, fontWeight: 700 }}>Hidden Gems Nearby</h2>
              <button className="font-dm" style={{ color: "#E07B2A", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>See all →</button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {loading ? (
                <>{[1, 2, 3].map((k) => <SkeletonGemCard key={k} />)}</>
              ) : (
                filteredGems.map((gem) => (
                  <div key={gem.id} className={`gem-card shrink-0 rounded-[20px] overflow-hidden cursor-pointer pressable ${gem.rarityBorderClass}`}
                    style={{ width: 180, background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(26,18,8,0.06)" }}
                    onClick={() => navigate(`/gem/${gem.id}`)}>
                    <div className="flex items-center justify-center relative overflow-hidden" style={{ height: 130, background: gem.gradient }}>
                      {gem.image && (
                        <img src={gem.image} alt={gem.name} className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-overlay" />
                      )}
                      <span style={{ fontSize: 40, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>{gem.emoji}</span>
                      {/* Rarity badge */}
                      <span className="font-dm absolute top-3 left-3"
                        style={{ background: gem.rarityBg, color: gem.rarityTierColor, backdropFilter: "blur(8px)", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, letterSpacing: "0.04em", border: `1px solid ${gem.rarityTierColor}33` }}>
                        {gem.rarityTier}
                      </span>
                      {/* Bloom dot */}
                      <span className={gem.bloomStatus === "Fading" ? "bloom-fading" : gem.bloomStatus === "Critical" ? "bloom-critical" : ""}
                        style={{ position: "absolute", top: 8, right: 8, width: 9, height: 9, borderRadius: "50%", background: getBloomColor(gem.bloomStatus), border: "1.5px solid rgba(255,255,255,0.8)" }} />
                      {/* Bookmark */}
                      <button onClick={(e) => { e.stopPropagation(); toggleSaved(gem.id); addToast("success", isSaved(gem.id) ? "Removed from collections" : "💾 Saved to Collections"); }}
                        className="absolute bottom-2 right-2 pressable"
                        style={{ background: "rgba(0,0,0,0.25)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13 }}>
                        {isSaved(gem.id) ? "🔖" : "🏷️"}
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="font-playfair mb-1" style={{ color: C.text, fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{gem.name}</p>
                      <p className="font-dm mb-3" style={{ color: C.muted, fontSize: 12 }}>📍 {gem.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-dm" style={{ color: "#E07B2A", fontWeight: 700, fontSize: 13 }}>+{gem.points} pts</span>
                        <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>⭐ {gem.rating}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Zone Map */}
          <section className="mb-4">
            <h2 className="font-playfair mb-4" style={{ color: C.text, fontSize: 19, fontWeight: 700 }}>
              Your Zone Map
            </h2>
            <div
              className="rounded-[20px] p-6 relative overflow-hidden cursor-pointer pressable"
              style={{ background: "linear-gradient(135deg, #0F3D3D, #0d4a3a)", border: "1px solid rgba(255,255,255,0.06)" }}
              onClick={() => navigate("/hex")}
            >
              {/* Decorative dots pattern */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "20px 20px", borderRadius: 20 }} />
              <div className="relative z-10">
                <div className="overflow-x-auto">
                  <HexGrid />
                </div>
                <div className="flex flex-wrap gap-4 mt-5">
                  {hexLegend.map(({ status, label }) => (
                    <div key={status} className="flex items-center gap-2">
                      <div style={{ width: 14, height: 14, borderRadius: 3, background: hexColors[status], border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
                      <span className="font-dm" style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="font-dm" style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Tap to open Hex Zone map</span>
                  <span className="font-dm" style={{ color: "#E07B2A", fontSize: 13, fontWeight: 600 }}>Explore Zones →</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* FAB */}
      <button
        onClick={() => navigate("/submit")}
        className="fixed z-30 pressable flex items-center justify-center"
        style={{
          bottom: 88,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#E07B2A",
          color: "#fff",
          fontSize: 26,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 6px 24px rgba(224,123,42,0.4)",
        }}
        aria-label="Submit a gem"
      >
        +
      </button>
    </div>
  );
}