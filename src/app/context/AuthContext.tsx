import {
  createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AuthError =
  | "invalid-credential"
  | "email-in-use"
  | "weak-password"
  | "network-error"
  | "popup-closed"
  | "unknown";

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  signInWithGoogle: () => Promise<{ ok: boolean; error?: AuthError }>;
  signInWithEmail: (email: string, password: string) => Promise<{ ok: boolean; error?: AuthError }>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<{ ok: boolean; error?: AuthError }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ── Error mapper ──────────────────────────────────────────────────────────────

function mapFirebaseError(code: string): AuthError {
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "invalid-credential";
  if (code.includes("email-already-in-use")) return "email-in-use";
  if (code.includes("weak-password"))        return "weak-password";
  if (code.includes("network-request-failed")) return "network-error";
  if (code.includes("popup-closed") || code.includes("cancelled-popup-request")) return "popup-closed";
  return "unknown";
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(firebaseAuth, provider);
      return { ok: true };
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      return { ok: false, error: mapFirebaseError(code) };
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return { ok: true };
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      return { ok: false, error: mapFirebaseError(code) };
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      if (displayName.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }
      return { ok: true };
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      return { ok: false, error: mapFirebaseError(code) };
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(firebaseAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ── Human-readable error messages ─────────────────────────────────────────────

export function authErrorMessage(err: AuthError): string {
  switch (err) {
    case "invalid-credential": return "Incorrect email or password.";
    case "email-in-use":       return "An account with this email already exists.";
    case "weak-password":      return "Password must be at least 6 characters.";
    case "network-error":      return "No internet connection. Please try again.";
    case "popup-closed":       return "Sign-in cancelled.";
    default:                   return "Something went wrong. Please try again.";
  }
}
