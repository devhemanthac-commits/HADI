import { lazy, Suspense } from "react";
import { createBrowserRouter, useRouteError } from "react-router";
import { Layout } from "./components/Layout";
import { NotFound } from "./components/screens/NotFound";

// ── Lazy-loaded screens with retry logic for chunk errors ─────────
function lazyRetry<T>(componentImport: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const hasRetried = window.sessionStorage.getItem("hadi-chunk-failed");
    componentImport()
      .then((component) => {
        window.sessionStorage.removeItem("hadi-chunk-failed");
        resolve(component);
      })
      .catch((error) => {
        if (!hasRetried && error?.message?.includes("Failed to fetch dynamically imported module")) {
          window.sessionStorage.setItem("hadi-chunk-failed", "true");
          window.location.reload();
        } else {
          reject(error);
        }
      });
  });
}

const Home          = lazy(() => lazyRetry(() => import("./components/screens/Home").then((m) => ({ default: m.Home }))));
const Community     = lazy(() => lazyRetry(() => import("./components/screens/Community").then((m) => ({ default: m.Community }))));
const Leaderboard   = lazy(() => lazyRetry(() => import("./components/screens/Leaderboard").then((m) => ({ default: m.Leaderboard }))));
const Profile       = lazy(() => lazyRetry(() => import("./components/screens/Profile").then((m) => ({ default: m.Profile }))));
const MapScreen     = lazy(() => lazyRetry(() => import("./components/screens/MapScreen").then((m) => ({ default: m.MapScreen }))));
const HexMap        = lazy(() => lazyRetry(() => import("./components/screens/HexMap").then((m) => ({ default: m.HexMap }))));
const GemDetail     = lazy(() => lazyRetry(() => import("./components/screens/GemDetail").then((m) => ({ default: m.GemDetail }))));
const GemSubmission = lazy(() => lazyRetry(() => import("./components/screens/GemSubmission").then((m) => ({ default: m.GemSubmission }))));
const QRScan        = lazy(() => lazyRetry(() => import("./components/screens/QRScan").then((m) => ({ default: m.QRScan }))));
const EventsScreen  = lazy(() => lazyRetry(() => import("./components/screens/EventsScreen").then((m) => ({ default: m.EventsScreen }))));
const BuddyScreen   = lazy(() => lazyRetry(() => import("./components/screens/BuddyScreen").then((m) => ({ default: m.BuddyScreen }))));
const PlacesScreen  = lazy(() => lazyRetry(() => import("./components/screens/PlacesScreen").then((m) => ({ default: m.PlacesScreen }))));

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

function RouteErrorFallback() {
  const error = useRouteError() as Error;
  
  if (error?.message?.includes("fetch dynamically imported module") || error?.message?.includes("Importing a module script failed")) {
    if (!window.sessionStorage.getItem("hadi-chunk-error-reload")) {
      window.sessionStorage.setItem("hadi-chunk-error-reload", "true");
      window.location.reload();
      return null;
    }
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0F3D3D", color: "#fff", padding: 20, textAlign: "center" }}>
      <span style={{ fontSize: 48, marginBottom: 16 }}>⚠️</span>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, marginBottom: 12, color: "#E07B2A" }}>Oops! Something went wrong.</h1>
      <p style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 24, maxWidth: 400 }}>
        {error?.message || "An unexpected error occurred while loading this page."}
      </p>
      <button onClick={() => window.location.assign("/")} style={{ background: "#E07B2A", color: "#fff", padding: "10px 24px", borderRadius: 99, border: "none", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
        Go to Home
      </button>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <RouteErrorFallback />,
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
    errorElement: <RouteErrorFallback />,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
