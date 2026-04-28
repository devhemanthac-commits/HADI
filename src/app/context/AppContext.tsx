import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";

export interface ToastItem {
  id: string;
  type: "success" | "warning" | "info";
  message: string;
  exiting?: boolean;
}

export interface Coords {
  lat: number;
  lng: number;
}

export type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable";

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  visitedGems: Set<number>;
  markVisited: (id: number) => void;
  toasts: ToastItem[];
  addToast: (type: ToastItem["type"], message: string) => void;
  removeToast: (id: string) => void;
  // Local / Tourist mode
  localMode: boolean;
  toggleLocalMode: () => void;
  // Collections / Bookmarks
  savedGems: Set<number>;
  toggleSaved: (id: number) => void;
  isSaved: (id: number) => boolean;
  // User identity
  userName: string;
  setUserName: (name: string) => void;
  // Geolocation
  userCoords: Coords | null;
  locationStatus: LocationStatus;
  requestLocation: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadSet(key: string, fallback: number[]): Set<number> {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return new Set(JSON.parse(raw) as number[]);
  } catch {}
  return new Set(fallback);
}

function saveSet(key: string, s: Set<number>) {
  try {
    localStorage.setItem(key, JSON.stringify([...s]));
  } catch {}
}

function loadBool(key: string, fallback: boolean): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return raw === "true";
  } catch {}
  return fallback;
}

function loadString(key: string, fallback: string): string {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return raw;
  } catch {}
  return fallback;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => loadBool("hadi_darkMode", false));
  const [visitedGems, setVisitedGems] = useState<Set<number>>(() => loadSet("hadi_visitedGems", []));
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [localMode, setLocalMode] = useState(() => loadBool("hadi_localMode", false));
  const [savedGems, setSavedGems] = useState<Set<number>>(() => loadSet("hadi_savedGems", []));
  const [userName, setUserNameState] = useState(() => loadString("hadi_userName", ""));

  // ── Geolocation ──────────────────────────────────────────────────────────────
  const [userCoords, setUserCoords] = useState<Coords | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const watchIdRef = useRef<number | null>(null);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }
    setLocationStatus("requesting");
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("granted");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setLocationStatus("denied");
        else setLocationStatus("unavailable");
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 }
    );
  }, []);

  // Auto-request location on mount
  useEffect(() => {
    startWatching();
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [startWatching]);

  const requestLocation = useCallback(() => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    startWatching();
  }, [startWatching]);

  // ── Persistence ──────────────────────────────────────────────────────────────
  useEffect(() => { localStorage.setItem("hadi_darkMode", String(darkMode)); }, [darkMode]);
  useEffect(() => { localStorage.setItem("hadi_localMode", String(localMode)); }, [localMode]);
  useEffect(() => { saveSet("hadi_visitedGems", visitedGems); }, [visitedGems]);
  useEffect(() => { saveSet("hadi_savedGems", savedGems); }, [savedGems]);

  const setUserName = useCallback((name: string) => {
    setUserNameState(name);
    try { localStorage.setItem("hadi_userName", name); } catch {}
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode((v) => !v), []);
  const toggleLocalMode = useCallback(() => setLocalMode((v) => !v), []);

  const markVisited = useCallback((id: number) => {
    setVisitedGems((prev) => new Set([...prev, id]));
  }, []);

  const toggleSaved = useCallback((id: number) => {
    setSavedGems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isSaved = useCallback((id: number) => savedGems.has(id), [savedGems]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 280);
  }, []);

  const addToast = useCallback(
    (type: ToastItem["type"], message: string) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  return (
    <AppContext.Provider
      value={{
        darkMode, toggleDarkMode,
        visitedGems, markVisited,
        toasts, addToast, removeToast,
        localMode, toggleLocalMode,
        savedGems, toggleSaved, isSaved,
        userName, setUserName,
        userCoords, locationStatus, requestLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

/** Colour tokens that switch for dark mode */
export function useColors() {
  const { darkMode } = useApp();
  return {
    bg: darkMode ? "#0A2A2A" : "#0F3D3D",
    card: darkMode ? "#0D3333" : "#164A4A",
    cardAlt: darkMode ? "#0B2B2B" : "#124040",
    text: "#F5F0E8",
    muted: "#A39A88",
    border: "rgba(255,255,255,0.08)",
    borderStrong: "rgba(255,255,255,0.15)",
    inputBg: darkMode ? "#0D3333" : "#164A4A",
  };
}
