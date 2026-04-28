import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LandingPage } from "./components/LandingPage";
import { Onboarding } from "./components/Onboarding";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider, useApp } from "./context/AppContext";
import { GameProvider } from "./store/GameStore";

// ── Onboarding gate key ───────────────────────────────────────────────────────
function onboardedKey(uid: string) {
  return `hadi_onboarded_${uid}`;
}

function hasCompletedOnboarding(uid: string): boolean {
  try { return localStorage.getItem(onboardedKey(uid)) === "true"; } catch { return false; }
}

function markOnboardingDone(uid: string) {
  try { localStorage.setItem(onboardedKey(uid), "true"); } catch {}
}

// ── Inner app — only rendered when user is authenticated ──────────────────────
function AuthenticatedApp() {
  const { user } = useAuth();
  const { setUserName, userName } = useApp();

  const uid = user!.uid;
  const isOnboarded = hasCompletedOnboarding(uid);

  // Auto-populate userName from Google/email display name on first login
  useEffect(() => {
    if (!userName && user?.displayName) {
      setUserName(user.displayName);
    }
  }, [user?.displayName, userName, setUserName]);

  const handleOnboardingComplete = () => {
    markOnboardingDone(uid);
    // Force re-render — the key trick handles this; just reload state
    window.location.reload();
  };

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="animate-app-fade-up">
      <RouterProvider router={router} />
    </div>
  );
}

// ── Loading spinner ───────────────────────────────────────────────────────────
function AuthLoadingScreen() {
  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", background: "#0F3D3D",
    }}>
      <span style={{ fontSize: 40, marginBottom: 16 }}>🧭</span>
      <p style={{ color: "rgba(250,246,238,0.5)", fontFamily: "Georgia, serif", fontSize: 14 }}>
        Loading HADI…
      </p>
    </div>
  );
}

// ── Root — handles auth state ─────────────────────────────────────────────────
function AppRoot() {
  const { user, authLoading } = useAuth();

  if (authLoading) return <AuthLoadingScreen />;

  if (!user) {
    return (
      <AppProvider>
        <LandingPage onLogin={() => {}} onAuthSuccess={() => {}} />
      </AppProvider>
    );
  }

  // Keyed by uid so all providers re-mount fresh on user change
  return (
    <AppProvider key={user.uid}>
      <GameProvider userId={user.uid}>
        <AuthenticatedApp />
      </GameProvider>
    </AppProvider>
  );
}

// ── App entry point ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoot />
      </AuthProvider>
    </ErrorBoundary>
  );
}
