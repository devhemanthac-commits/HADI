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
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
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
  | "requires-recent-login"
  | "unknown";

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  signInWithGoogle: () => Promise<{ ok: boolean; error?: AuthError }>;
  signInWithEmail: (email: string, password: string) => Promise<{ ok: boolean; error?: AuthError }>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<{ ok: boolean; error?: AuthError }>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<{ ok: boolean; error?: AuthError }>;
  resetPassword: (email: string) => Promise<{ ok: boolean; error?: AuthError }>;
  updateUserEmail: (newEmail: string) => Promise<{ ok: boolean; error?: AuthError }>;
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

  // Check if we are in mock/developer mode
  const isMockMode = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY.includes("mock");

  useEffect(() => {
    if (isMockMode) {
      const cached = localStorage.getItem("hadi_mock_user");
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          setUser(null);
        }
      }
      setAuthLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, [isMockMode]);

  const signInWithGoogle = useCallback(async () => {
    if (isMockMode) {
      const mockUser = {
        uid: "mock-google-uid",
        email: "traveler@hadi.local",
        displayName: "Mysuru Explorer",
        photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem("hadi_mock_user", JSON.stringify(mockUser));
      return { ok: true };
    }
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(firebaseAuth, provider);
      return { ok: true };
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      return { ok: false, error: mapFirebaseError(code) };
    }
  }, [isMockMode]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (isMockMode) {
      const mockUser = {
        uid: "mock-email-uid",
        email: email,
        displayName: email.split("@")[0],
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem("hadi_mock_user", JSON.stringify(mockUser));
      return { ok: true };
    }
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return { ok: true };
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      return { ok: false, error: mapFirebaseError(code) };
    }
  }, [isMockMode]);

  const signUpWithEmail = useCallback(async (email: string, password: string, displayName: string) => {
    if (isMockMode) {
      const mockUser = {
        uid: "mock-email-uid",
        email: email,
        displayName: displayName || email.split("@")[0],
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem("hadi_mock_user", JSON.stringify(mockUser));
      return { ok: true };
    }
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
  }, [isMockMode]);

  const signOut = useCallback(async () => {
    if (isMockMode) {
      setUser(null);
      localStorage.removeItem("hadi_mock_user");
      return;
    }
    await firebaseSignOut(firebaseAuth);
  }, [isMockMode]);

  const sendVerificationEmail = useCallback(async () => {
    if (isMockMode) return { ok: true };
    if (!firebaseAuth.currentUser) return { ok: false, error: "unknown" as AuthError };
    try {
      await sendEmailVerification(firebaseAuth.currentUser);
      return { ok: true };
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      return { ok: false, error: mapFirebaseError(code) };
    }
  }, [isMockMode]);

  const resetPassword = useCallback(async (email: string) => {
    if (isMockMode) return { ok: true };
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      return { ok: true };
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      return { ok: false, error: mapFirebaseError(code) };
    }
  }, [isMockMode]);

  const updateUserEmail = useCallback(async (newEmail: string) => {
    if (isMockMode) {
      const mockUser = {
        uid: "mock-email-uid",
        email: newEmail,
        displayName: user?.displayName ?? newEmail.split("@")[0],
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem("hadi_mock_user", JSON.stringify(mockUser));
      return { ok: true };
    }
    if (!firebaseAuth.currentUser) return { ok: false, error: "unknown" as AuthError };
    try {
      await verifyBeforeUpdateEmail(firebaseAuth.currentUser, newEmail);
      return { ok: true };
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      if (code.includes("requires-recent-login")) {
        return { ok: false, error: "requires-recent-login" as AuthError };
      }
      return { ok: false, error: mapFirebaseError(code) };
    }
  }, [isMockMode, user]);

  return (
    <AuthContext.Provider value={{
      user, authLoading,
      signInWithGoogle, signInWithEmail, signUpWithEmail, signOut,
      sendVerificationEmail, resetPassword, updateUserEmail
    }}>
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
    case "requires-recent-login": return "For your security, please sign out and sign back in to perform this action.";
    default:                   return "Something went wrong. Please try again.";
  }
}
