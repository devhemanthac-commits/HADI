import { useState, useEffect, useRef } from "react";
import { useColors } from "../context/AppContext";
import { useAuth, authErrorMessage, AuthError } from "../context/AuthContext";

interface AuthModalProps {
  onSuccess: () => void;
  onDismiss: () => void;
}

type AuthMode = "choose" | "email-signin" | "email-signup";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.704H24.48v9.024h12.96c-.564 2.988-2.244 5.52-4.776 7.212v5.988h7.728c4.524-4.164 7.14-10.296 7.14-17.52z" fill="#4285F4"/>
    <path d="M24.48 48c6.48 0 11.916-2.148 15.888-5.808l-7.728-5.988c-2.148 1.44-4.896 2.292-8.16 2.292-6.276 0-11.592-4.236-13.5-9.936H3.024v6.18C6.984 42.948 15.12 48 24.48 48z" fill="#34A853"/>
    <path d="M10.98 28.56A14.4 14.4 0 0 1 10.2 24c0-1.584.276-3.12.78-4.56v-6.18H3.024A23.952 23.952 0 0 0 .48 24c0 3.864.924 7.524 2.544 10.74l7.956-6.18z" fill="#FBBC05"/>
    <path d="M24.48 9.504c3.54 0 6.72 1.212 9.216 3.6l6.888-6.888C36.384 2.4 30.96 0 24.48 0 15.12 0 6.984 5.052 3.024 13.26l7.956 6.18c1.908-5.7 7.224-9.936 13.5-9.936z" fill="#EA4335"/>
  </svg>
);

export function AuthModal({ onSuccess, onDismiss }: AuthModalProps) {
  const C = useColors();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const backdropRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<AuthMode>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  // Close on backdrop click or Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onDismiss(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDismiss]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onDismiss();
  };

  const clearError = () => setError(null);

  // ── Google sign-in ────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    setLoading(false);
    if (result.ok) {
      onSuccess();
    } else if (result.error !== "popup-closed") {
      setError(result.error ?? "unknown");
    }
  };

  // ── Email sign-in ─────────────────────────────────────────────────────────
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    const result = await signInWithEmail(email.trim(), password);
    setLoading(false);
    if (result.ok) onSuccess();
    else setError(result.error ?? "unknown");
  };

  // ── Password Reset ────────────────────────────────────────────────────────
  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError("unknown"); // Or set a custom string error
      return;
    }
    setLoading(true);
    setError(null);
    const result = await resetPassword(email.trim());
    setLoading(false);
    if (result.ok) {
      setResetMessage("Password reset email sent! Check your inbox.");
    } else {
      setError(result.error ?? "unknown");
    }
  };

  // ── Email sign-up ─────────────────────────────────────────────────────────
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !name.trim()) return;
    setLoading(true);
    setError(null);
    const result = await signUpWithEmail(email.trim(), password, name.trim());
    setLoading(false);
    if (result.ok) onSuccess();
    else setError(result.error ?? "unknown");
  };

  // ── Shared input style ────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    background: C.cardAlt,
    border: `1px solid ${C.borderStrong}`,
    borderRadius: 12,
    padding: "13px 16px",
    color: C.text,
    fontSize: 14,
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
  };

  const btnPrimary: React.CSSProperties = {
    height: 48,
    borderRadius: 99,
    background: loading ? "rgba(224,123,42,0.5)" : "#E07B2A",
    border: "none",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: loading ? "not-allowed" : "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 4px 16px rgba(224,123,42,0.3)",
    transition: "background 0.2s",
  };

  const btnOutline: React.CSSProperties = {
    height: 48,
    borderRadius: 99,
    background: "transparent",
    border: `1.5px solid ${C.borderStrong}`,
    color: C.text,
    fontWeight: 600,
    fontSize: 15,
    cursor: loading ? "not-allowed" : "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "background 0.2s",
    opacity: loading ? 0.6 : 1,
  };

  return (
    <div
      ref={backdropRef}
      className="animate-backdrop-in fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={handleBackdropClick}
    >
      <div
        className="animate-modal-in relative w-full max-w-[400px] rounded-[28px] overflow-hidden"
        style={{ background: C.card, boxShadow: "0 32px 80px rgba(0,0,0,0.5)", border: `1px solid ${C.borderStrong}` }}
      >
        {/* Accent strip */}
        <div style={{ height: 5, background: "linear-gradient(90deg, #0F3D3D, #E07B2A, #C9921F)" }} />

        {/* Close */}
        <button onClick={onDismiss} className="absolute top-4 right-4 flex items-center justify-center rounded-full font-dm"
          style={{ width: 34, height: 34, background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", color: C.text, fontSize: 18 }}>
          ×
        </button>

        <div className="p-8 pt-7">
          {/* Logo */}
          <div className="flex items-center gap-2 justify-center mb-1">
            <span style={{ fontSize: 22 }}>🧭</span>
            <span className="font-playfair" style={{ color: "#E07B2A", fontStyle: "italic", fontSize: 26, fontWeight: 700 }}>HADI</span>
          </div>

          {/* ── CHOOSE MODE ──────────────────────────────────────────────── */}
          {mode === "choose" && (
            <>
              <h2 className="font-playfair text-center mb-2" style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>
                Join the Community
              </h2>
              <p className="font-dm text-center mb-6" style={{ color: C.muted, fontSize: 14 }}>
                Discover and protect Mysuru's hidden gems.
              </p>

              <div style={{ height: 1, background: C.border, marginBottom: 20 }} />

              {/* Google */}
              <button style={btnOutline} onClick={handleGoogle} disabled={loading} className="font-dm mb-3">
                {loading ? <span style={{ fontSize: 16 }}>⏳</span> : <GoogleIcon />}
                Continue with Google
              </button>

              {/* Email */}
              <button style={btnPrimary} onClick={() => setMode("email-signup")} disabled={loading} className="font-dm mb-6">
                ✉️ Continue with Email
              </button>

              <p className="font-dm text-center" style={{ color: C.muted, fontSize: 12 }}>
                Already have an account?{" "}
                <span onClick={() => setMode("email-signin")}
                  style={{ color: "#E07B2A", cursor: "pointer", fontWeight: 600 }}>
                  Sign in
                </span>
              </p>

              {error && (
                <p className="font-dm text-center mt-3" style={{ color: "#f87171", fontSize: 13 }}>
                  {authErrorMessage(error)}
                </p>
              )}
            </>
          )}

          {/* ── EMAIL SIGN IN ─────────────────────────────────────────────── */}
          {mode === "email-signin" && (
            <>
              <h2 className="font-playfair text-center mb-1" style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>
                Welcome back
              </h2>
              <p className="font-dm text-center mb-6" style={{ color: C.muted, fontSize: 14 }}>Sign in to your HADI account</p>

              <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  style={inputStyle}
                  className="font-dm"
                  autoFocus
                  required
                />
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    style={{ ...inputStyle, paddingRight: 48 }}
                    className="font-dm"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {error && (
                  <p className="font-dm" style={{ color: "#f87171", fontSize: 13, textAlign: "center" }}>
                    {email && error === "invalid-credential" ? (
                      <>Incorrect email or password. <br/><span onClick={handleResetPassword} style={{ textDecoration: "underline", cursor: "pointer" }}>Forgot Password?</span></>
                    ) : (
                      authErrorMessage(error)
                    )}
                  </p>
                )}
                {resetMessage && (
                  <p className="font-dm" style={{ color: "#4ade80", fontSize: 13, textAlign: "center" }}>
                    {resetMessage}
                  </p>
                )}

                <button type="submit" style={{ ...btnPrimary, marginTop: 4 }} disabled={loading} className="font-dm">
                  {loading ? "Signing in…" : "Sign In →"}
                </button>
              </form>

              <div style={{ height: 1, background: C.border, margin: "20px 0" }} />

              <button style={btnOutline} onClick={handleGoogle} disabled={loading} className="font-dm mb-4">
                <GoogleIcon />
                Continue with Google
              </button>

              <p className="font-dm text-center" style={{ color: C.muted, fontSize: 13 }}>
                No account?{" "}
                <span onClick={() => { setMode("email-signup"); clearError(); setResetMessage(""); }}
                  style={{ color: "#E07B2A", cursor: "pointer", fontWeight: 600 }}>
                  Create one
                </span>
                {" · "}
                <span onClick={() => { setMode("choose"); clearError(); setResetMessage(""); }}
                  style={{ color: C.muted, cursor: "pointer", textDecoration: "underline" }}>
                  Back
                </span>
              </p>
            </>
          )}

          {/* ── EMAIL SIGN UP ─────────────────────────────────────────────── */}
          {mode === "email-signup" && (
            <>
              <h2 className="font-playfair text-center mb-1" style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>
                Create account
              </h2>
              <p className="font-dm text-center mb-6" style={{ color: C.muted, fontSize: 14 }}>Start exploring hidden Mysuru</p>

              <form onSubmit={handleEmailSignUp} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError(); }}
                  style={inputStyle}
                  className="font-dm"
                  autoFocus
                  required
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  style={inputStyle}
                  className="font-dm"
                  required
                />
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password (min. 6 characters)"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    style={{ ...inputStyle, paddingRight: 48 }}
                    className="font-dm"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {error && (
                  <p className="font-dm" style={{ color: "#f87171", fontSize: 13, textAlign: "center" }}>
                    {authErrorMessage(error)}
                  </p>
                )}

                <button type="submit" style={{ ...btnPrimary, marginTop: 4 }} disabled={loading} className="font-dm">
                  {loading ? "Creating account…" : "Create Account →"}
                </button>
              </form>

              <div style={{ height: 1, background: C.border, margin: "20px 0" }} />

              <button style={btnOutline} onClick={handleGoogle} disabled={loading} className="font-dm mb-4">
                <GoogleIcon />
                Continue with Google
              </button>

              <p className="font-dm text-center" style={{ color: C.muted, fontSize: 13 }}>
                Already have an account?{" "}
                <span onClick={() => { setMode("email-signin"); clearError(); }}
                  style={{ color: "#E07B2A", cursor: "pointer", fontWeight: 600 }}>
                  Sign in
                </span>
                {" · "}
                <span onClick={() => { setMode("choose"); clearError(); }}
                  style={{ color: C.muted, cursor: "pointer", textDecoration: "underline" }}>
                  Back
                </span>
              </p>
            </>
          )}

          {/* Fine print */}
          <p className="font-dm text-center mt-5" style={{ color: "#B0A090", fontSize: 11, lineHeight: 1.5 }}>
            By joining, you agree to our{" "}
            <span style={{ color: "#E07B2A", cursor: "pointer" }}>Terms</span> and{" "}
            <span style={{ color: "#E07B2A", cursor: "pointer" }}>Community Guidelines</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
