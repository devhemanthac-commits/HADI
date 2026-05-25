import { NavLink, useLocation } from "react-router";
import { useApp, useColors } from "../context/AppContext";

const navItems = [
  { emoji: "🏠", label: "Home", to: "/" },
  { emoji: "🗺️", label: "Map", to: "/map" },
  { emoji: "🌿", label: "Feed", to: "/community" },
  { emoji: "👤", label: "Profile", to: "/profile" },
];

export function BottomNav() {
  const location = useLocation();
  const C = useColors();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center"
      style={{
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 16px rgba(26,18,8,0.06)",
        transition: "background 0.3s",
      }}
    >
      {navItems.map((item) => {
        const active =
          item.to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.to);
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className="flex-1 flex flex-col items-center py-2.5 relative"
            style={{ gap: 2 }}
          >
            {active && (
              <span
                className="absolute top-0 left-1/2"
                style={{
                  transform: "translateX(-50%)",
                  width: 28,
                  height: 3,
                  background: "#E07B2A",
                  borderRadius: "0 0 99px 99px",
                  transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            )}
            <span style={{ fontSize: 19 }}>{item.emoji}</span>
            <span
              className="font-dm"
              style={{
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                color: active ? "#E07B2A" : C.muted,
                letterSpacing: "0.01em",
                transition: "color 0.22s",
              }}
            >
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}