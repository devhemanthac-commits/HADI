import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { RightPanel } from "./RightPanel";
import { ToastContainer } from "./Toast";
import { useApp, useColors } from "../context/AppContext";

export function Layout() {
  const { darkMode } = useApp();
  const C = useColors();
  const location = useLocation();

  const isMapScreen = location.pathname === "/map";
  const isHexScreen = location.pathname === "/hex";
  const isFullScreen = isMapScreen || isHexScreen; // screens that want to break out of layout padding

  return (
    <div
      className={`min-h-screen font-dm${darkMode ? " dark-mode" : ""}`}
      style={{ background: C.bg, color: C.text, transition: "background 0.3s, color 0.3s" }}
    >
      {/* Global Toast */}
      <ToastContainer />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main layout container */}
      <div className="flex w-full justify-center">
        {/* Sidebar spacer for desktop */}
        <div className="hidden lg:block shrink-0" style={{ width: 248 }} />

        {/* Main content */}
        <main
          className={`flex-1 min-w-0 ${isFullScreen ? "overflow-hidden" : "pb-24 lg:pb-8"}`}
          style={{ maxWidth: isFullScreen ? "100%" : 1200, paddingTop: isFullScreen ? 0 : 28, margin: isFullScreen ? 0 : "0 auto" }}
        >
          <div className={isFullScreen ? "" : "px-4 lg:px-8"}>
            {/* Key by pathname for page transition on each route change */}
            <div
              key={location.pathname}
              style={isFullScreen ? {} : { animation: "fadeUp 0.25s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              <Outlet />
            </div>
          </div>
        </main>

        {/* Right Panel — hidden on map screen to give more width */}
        {!isFullScreen && (
          <div className="hidden xl:block shrink-0" style={{ width: 320, paddingTop: 28, paddingRight: 24 }}>
            <RightPanel />
          </div>
        )}
      </div>

      {/* Bottom Navigation (mobile) */}
      <BottomNav />
    </div>
  );
}