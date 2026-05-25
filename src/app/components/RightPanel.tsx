import { useState } from "react";
import { useColors } from "../context/AppContext";

const safetyData = [
  { area: "Chamundi Hill", status: "Safe" },
  { area: "Devaraja Market", status: "Caution" },
  { area: "Old Agrahara", status: "Avoid" },
  { area: "Kukkarahalli Lake", status: "Safe" },
  { area: "Glass House Rd", status: "Caution" },
];

const digipinZones = [
  { code: "MYS-4N2K", type: "Heritage Core", multiplier: "3×" },
  { code: "MYS-7R8P", type: "Artisan Quarter", multiplier: "2×" },
  { code: "MYS-1F5Q", type: "Street Food Belt", multiplier: "1.5×" },
];

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  Safe: { color: "#166534", bg: "#dcfce7", label: "Safe" },
  Caution: { color: "#92400e", bg: "#fef3c7", label: "Caution" },
  Avoid: { color: "#991b1b", bg: "#fee2e2", label: "Avoid" },
};

export function RightPanel() {
  const [buddyEnabled, setBuddyEnabled] = useState(false);
  const C = useColors();

  return (
    <aside
      className="hidden xl:flex flex-col gap-4 sticky top-0"
      style={{ width: "100%", flexShrink: 0, height: "100vh", overflowY: "auto", paddingTop: 28, paddingBottom: 28 }}
    >
      {/* Live Safety Alerts */}
      <div
        className="rounded-[20px] p-5"
        style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 2px 16px rgba(26,18,8,0.05)", transition: "background 0.3s" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span style={{ fontSize: 16 }}>🛡️</span>
          <h3 className="font-playfair" style={{ color: C.text, fontSize: 15, fontWeight: 600 }}>
            Live Safety Alerts
          </h3>
        </div>
        <div className="flex flex-col gap-2.5">
          {safetyData.map((item) => {
            const cfg = statusConfig[item.status];
            return (
              <div key={item.area} className="flex items-center justify-between">
                <span className="font-dm" style={{ color: C.text, fontSize: 13 }}>{item.area}</span>
                <span className="font-dm" style={{ background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 99, letterSpacing: "0.02em" }}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Digipin Zone Multipliers */}
      <div
        className="rounded-[20px] p-5"
        style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 2px 16px rgba(26,18,8,0.05)", transition: "background 0.3s" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span style={{ fontSize: 16 }}>📡</span>
          <h3 className="font-playfair" style={{ color: C.text, fontSize: 15, fontWeight: 600 }}>
            Digipin Multipliers
          </h3>
        </div>
        <div className="flex flex-col gap-3">
          {digipinZones.map((zone) => (
            <div
              key={zone.code}
              className="rounded-[14px] p-3"
              style={{ background: C.cardAlt, border: "1px solid rgba(201,146,31,0.15)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-dm" style={{ color: C.muted, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                    {zone.code}
                  </p>
                  <p className="font-dm" style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{zone.type}</p>
                </div>
                <span className="font-dm font-bold shrink-0" style={{ background: "linear-gradient(135deg, #E07B2A, #C9921F)", color: "#fff", fontSize: 14, fontWeight: 700, padding: "3px 12px", borderRadius: 99 }}>
                  {zone.multiplier}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buddy System */}
      <div className="rounded-[20px] p-5 transition-colors duration-300" style={{ background: C.bg, border: `1px solid ${C.border}`, boxShadow: "0 2px 16px rgba(15,61,61,0.2)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: 16 }}>🤝</span>
          <h3 className="font-playfair" style={{ color: C.text, fontSize: 15, fontWeight: 600 }}>Buddy System</h3>
        </div>
        <p className="font-dm mb-4" style={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}>
          Explore with a verified local buddy. Earn 50% bonus points on every gem discovered together.
        </p>
        <div className="flex items-center justify-between">
          <span className="font-dm" style={{ color: buddyEnabled ? "#E07B2A" : C.muted, fontSize: 13, fontWeight: 500, transition: "color 0.22s" }}>
            {buddyEnabled ? "Active" : "Inactive"}
          </span>
          <button
            onClick={() => setBuddyEnabled((v) => !v)}
            className="relative pressable"
            style={{ width: 48, height: 26, borderRadius: 99, background: buddyEnabled ? "#E07B2A" : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", transition: "background 0.22s cubic-bezier(0.22,1,0.36,1)", padding: 0 }}
            aria-label="Toggle buddy system"
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: buddyEnabled ? 25 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.22s cubic-bezier(0.22,1,0.36,1)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
