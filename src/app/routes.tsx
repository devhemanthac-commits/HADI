import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { NotFound } from "./components/screens/NotFound";

// ── Lazy-loaded screens ──────────────────────────────────────────────────────
const Home          = lazy(() => import("./components/screens/Home").then((m) => ({ default: m.Home })));
const Community     = lazy(() => import("./components/screens/Community").then((m) => ({ default: m.Community })));
const Leaderboard   = lazy(() => import("./components/screens/Leaderboard").then((m) => ({ default: m.Leaderboard })));
const Profile       = lazy(() => import("./components/screens/Profile").then((m) => ({ default: m.Profile })));
const MapScreen     = lazy(() => import("./components/screens/MapScreen").then((m) => ({ default: m.MapScreen })));
const HexMap        = lazy(() => import("./components/screens/HexMap").then((m) => ({ default: m.HexMap })));
const GemDetail     = lazy(() => import("./components/screens/GemDetail").then((m) => ({ default: m.GemDetail })));
const GemSubmission = lazy(() => import("./components/screens/GemSubmission").then((m) => ({ default: m.GemSubmission })));
const QRScan        = lazy(() => import("./components/screens/QRScan").then((m) => ({ default: m.QRScan })));
const EventsScreen  = lazy(() => import("./components/screens/EventsScreen").then((m) => ({ default: m.EventsScreen })));
const BuddyScreen   = lazy(() => import("./components/screens/BuddyScreen").then((m) => ({ default: m.BuddyScreen })));
const PlacesScreen  = lazy(() => import("./components/screens/PlacesScreen").then((m) => ({ default: m.PlacesScreen })));

// ── Minimal inline fallback ──────────────────────────────────────────────────
function ScreenFallback() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(250,246,238,0.4)",
        fontSize: 28,
      }}
    >
      🧭
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,         element: withSuspense(Home) },
      { path: "community",   element: withSuspense(Community) },
      { path: "events",      element: withSuspense(EventsScreen) },
      { path: "buddy",       element: withSuspense(BuddyScreen) },
      { path: "leaderboard", element: withSuspense(Leaderboard) },
      { path: "profile",     element: withSuspense(Profile) },
      { path: "map",         element: withSuspense(MapScreen) },
      { path: "hex",         element: withSuspense(HexMap) },
      { path: "gem/:id",     element: withSuspense(GemDetail) },
      { path: "submit",      element: withSuspense(GemSubmission) },
      { path: "places",      element: withSuspense(PlacesScreen) },
      { path: "*",           Component: NotFound },
    ],
  },
  {
    path: "/qrscan",
    element: withSuspense(QRScan),
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
