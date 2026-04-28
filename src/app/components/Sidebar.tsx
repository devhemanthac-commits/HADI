import { NavLink, useLocation } from "react-router";
import { useApp, useColors } from "../context/AppContext";
import { useGame } from "../store/GameStore";

export function Sidebar() {
  const location = useLocation();
  const { localMode, userName } = useApp();
  const C = useColors();
  const { stats } = useGame();

  const navSections = [
    {
      label: "Explore",
      items: [
        { emoji: "🏠", label: "Home",      to: "/" },
        { emoji: "📍", label: "Places",    to: "/places" },
        { emoji: "🗺️", label: "Map",       to: "/map" },
        { emoji: "🔶", label: "Hex Zones", to: "/hex" },
      ],
    },
    {
      label: "Community",
      items: [
        { emoji: "🌿", label: "Community",  to: "/community" },
        { emoji: "🗓", label: "Events",     to: "/events" },
        { emoji: "🤝", label: "Buddy",      to: "/buddy" },
        { emoji: "🏆", label: "Leaderboard",to: "/leaderboard" },
        ...(localMode
          ? [
              { emoji: "📖", label: "Submit Story",  to: "/submit" },
              { emoji: "🛡️", label: "Zone Guardian", to: "/profile" },
            ]
          : []),
      ],
    },
    {
      label: "You",
      items: [
        { emoji: "👤", label: "Profile", to: "/profile" },
      ],
    },
  ];

  return (
    <aside style={{ width: 248, background: "#0F3D3D", borderRight: "none", minHeight: "100vh" }} className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-colors duration-300">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 20 }}>🧭</span>
          <span className="font-playfair" style={{ color: "#E07B2A", fontStyle: "italic", fontSize: 24, fontWeight: 700 }}>HADI</span>
        </div>
        <p className="font-dm mt-1" style={{ color: "#FAF6EE", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Your guide to hidden Mysuru
        </p>
      </div>

      {/* Local mode banner */}
      {localMode && (
        <div className="mx-3 mb-3 px-3 py-2 rounded-[10px] flex items-center gap-2" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}>
          <span style={{ fontSize: 14 }}>🛡️</span>
          <span className="font-dm" style={{ color: "#4ade80", fontSize: 11, fontWeight: 700 }}>Local Mode Active</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="font-dm px-3 mb-2" style={{ color: "#FAF6EE", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
              {section.label}
            </p>
            {section.items.map((item) => {
              const trueActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <NavLink key={item.label} to={item.to}
                  className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-[14px] mb-1"
                  style={{ background: trueActive ? "rgba(224,123,42,0.15)" : "transparent", borderLeft: trueActive ? "3px solid #E07B2A" : "3px solid transparent", paddingLeft: trueActive ? 10 : 12 }}>
                  <span style={{ fontSize: 17 }}>{item.emoji}</span>
                  <span className="font-dm" style={{ color: trueActive ? "#E07B2A" : "#FAF6EE", fontWeight: trueActive ? 700 : 500, fontSize: 14, transition: "color 0.22s" }}>
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="mx-3 mb-5 p-4 rounded-[14px]" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full font-dm"
            style={{ width: 40, height: 40, background: "linear-gradient(135deg, #E07B2A, #C9921F)", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
            {(userName || "E")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-playfair" style={{ color: "#FAF6EE", fontWeight: 700, fontSize: 16 }}>{userName || "Explorer"}</p>
            <p className="font-dm" style={{ color: localMode ? "#4ade80" : "#FAF6EE", fontSize: 12, fontWeight: 500 }}>
              {localMode ? "🏠 Local Guide" : "🧭 Urban Explorer"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-dm" style={{ color: "#E07B2A", fontWeight: 800, fontSize: 14 }}>{stats.totalXP.toLocaleString()}</p>
            <p className="font-dm" style={{ color: "#FAF6EE", fontSize: 11, fontWeight: 600 }}>pts</p>
          </div>
        </div>
      </div>
    </aside>
  );
}