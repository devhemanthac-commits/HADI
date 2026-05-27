import React, { useState, useEffect } from "react";
import { useColors, useApp } from "../context/AppContext";
import { useAuth, authErrorMessage, AuthError } from "../context/AuthContext";
import { firebaseAuth } from "../lib/firebase";

interface CharacterCreationProps {
  onSuccess: () => void;
  onDismiss: () => void;
}

interface Bubble {
  id: string;
  label: string;
  emoji: string;
  x: number; // percentage from left
  y: number; // percentage from top
  size: number; // px size
  color: string;
  pulseDelay: string;
}

const INITIAL_BUBBLES: Bubble[] = [
  { id: "coffee", label: "Filter Coffee & Heritage Cafes", emoji: "☕", x: 15, y: 25, size: 90, color: "rgba(224, 123, 42, 0.15)", pulseDelay: "0s" },
  { id: "history", label: "Hidden Architecture & Kingdom History", emoji: "🏛️", x: 65, y: 15, size: 105, color: "rgba(201, 146, 31, 0.15)", pulseDelay: "0.3s" },
  { id: "trails", label: "Offbeat Trails & Nature Escapes", emoji: "🥾", x: 45, y: 45, size: 95, color: "rgba(22, 163, 74, 0.15)", pulseDelay: "0.6s" },
  { id: "crafts", label: "Artisan Lanes & Local Crafts (Sandalwood/Silk)", emoji: "🎨", x: 20, y: 65, size: 100, color: "rgba(124, 58, 237, 0.15)", pulseDelay: "0.9s" },
  { id: "sunsets", label: "Secret Vantage & Sunset Points", emoji: "🌅", x: 70, y: 60, size: 90, color: "rgba(239, 68, 68, 0.15)", pulseDelay: "1.2s" },
];

export function CharacterCreation({ onSuccess, onDismiss }: CharacterCreationProps) {
  const C = useColors();
  const { setLocalMode, localMode, addToast } = useApp();
  const { signInWithGoogle, sendSignInLink } = useAuth();

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [flyingBubbles, setFlyingBubbles] = useState<Record<string, boolean>>({});
  const [email, setEmail] = useState("");
  const [linkSentMode, setLinkSentMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  // Auto-set localMode in AppContext based on choice in Step 1
  const handleSelectRole = (isLocal: boolean) => {
    setLocalMode(isLocal);
    setStep(1);
  };

  // Step 2 interaction: toggle vibe, play animation into backpack
  const handleToggleVibe = (id: string) => {
    if (selectedVibes.includes(id)) {
      setSelectedVibes((prev) => prev.filter((v) => v !== id));
      return;
    }

    // Trigger flight animation
    setFlyingBubbles((prev) => ({ ...prev, [id]: true }));
    setSelectedVibes((prev) => [...prev, id]);

    // Cleanup flight state after animation completes
    setTimeout(() => {
      setFlyingBubbles((prev) => ({ ...prev, [id]: false }));
    }, 850);
  };

  // Google OAuth Auth Trigger
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    const res = await signInWithGoogle();
    setLoading(false);
    if (res.ok) {
      // Save interests to localStorage so GameStore can pick it up on mount
      localStorage.setItem("hadi_user_vibes", JSON.stringify(selectedVibes));
      const uid = firebaseAuth.currentUser?.uid || "mock-google-uid";
      localStorage.setItem(`hadi_onboarded_${uid}`, "true");
      localStorage.setItem("hadi_onboarded_mock-google-uid", "true");
      addToast("success", "Welcome Explorer! HADI Passport authenticated.");
      onSuccess();
    } else {
      setError(res.error ?? "unknown");
    }
  };

  // Email link login auth logic
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      addToast("warning", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await sendSignInLink(email.trim());
    setLoading(false);
    if (res.ok) {
      setLinkSentMode(true);
      addToast("info", "Verification link sent to your email!");
    } else {
      setError(res.error ?? "unknown");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-between overflow-y-auto px-4 py-6 md:p-8 animate-fade-in"
      style={{
        background: `linear-gradient(135deg, ${C.bg} 0%, #082121 100%)`,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        @keyframes bubble-to-backpack {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          50% { transform: translate(var(--tx), var(--ty)) scale(0.5); opacity: 0.7; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.1); opacity: 0; }
        }
        .bubble-pulse {
          animation: pulse-ring 3s ease-in-out infinite;
        }
        .bubble-float {
          animation: float-slow 4s ease-in-out infinite;
        }
        .fly-backpack {
          animation: bubble-to-backpack 0.85s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
        }
        .passport-perspective {
          perspective: 1200px;
        }
        .passport-card {
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .passport-flipped {
          transform: rotateY(-180deg);
        }
        .passport-face {
          backface-visibility: hidden;
        }
        .passport-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Header / Progress bar */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 24 }}>🧭</span>
          <span className="font-playfair font-bold text-2xl tracking-wide italic text-[#E07B2A]">HADI</span>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B0A090]">Character Creator</span>
            <span className="text-xs font-semibold text-[#F5F0E8]">{step === 0 ? "Identity Selection" : step === 1 ? "Vibe Swipe" : "Passport Claim"}</span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((s) => (
              <div
                key={s}
                style={{
                  width: 32,
                  height: 6,
                  borderRadius: 99,
                  background: s === step ? "#E07B2A" : s < step ? "rgba(224,123,42,0.4)" : "rgba(255,255,255,0.1)",
                  boxShadow: s === step ? "0 0 10px rgba(224,123,42,0.4)" : "none",
                  transition: "all 0.4s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── STEP 0: IDENTITY SELECTION ─────────────────────────────────── */}
      {step === 0 && (
        <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full py-8 z-10">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="font-playfair text-3xl md:text-5xl font-extrabold text-[#F5F0E8] leading-tight mb-3">
              Choose your <em className="text-[#E07B2A] not-italic">Starting Path</em>
            </h1>
            <p className="font-dm text-sm md:text-base text-[#A39A88] max-w-xl mx-auto">
              How do you want to explore the kingdom of Mysuru? This selection calibrates the recommenders and game engine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 px-2 md:px-0">
            {/* Card A: Voyager */}
            <div
              onClick={() => handleSelectRole(false)}
              className="group rounded-[32px] p-6 md:p-8 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #164A4A 0%, #0d3838 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              }}
            >
              <div className="absolute inset-0 bg-[#E07B2A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C9921F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 text-4xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                🧭
              </div>

              <div>
                <h3 className="font-playfair text-2xl font-bold text-[#F5F0E8] mb-3 group-hover:text-[#E07B2A] transition-colors duration-200">
                  The Voyager
                </h3>
                <p className="font-dm text-sm leading-relaxed text-[#A39A88] mb-6">
                  "I am here to explore Mysuru’s grand history, iconic sights, and must-see cultural trails."
                </p>
              </div>

              <div className="flex gap-2.5 flex-wrap justify-center mb-6">
                {["Historic Maps", "Transit Planner", "Curated Trails", "Palace Tours"].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[#C9921F]">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                className="w-full font-dm py-3.5 rounded-2xl bg-white/5 group-hover:bg-[#E07B2A] text-[#F5F0E8] group-hover:text-white font-bold text-sm tracking-wide transition-all duration-300 border border-white/10 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-[#E07B2A]/20"
              >
                Select Voyager Mode →
              </button>
            </div>

            {/* Card B: Local Legend */}
            <div
              onClick={() => handleSelectRole(true)}
              className="group rounded-[32px] p-6 md:p-8 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #124040 0%, #0a2b2b 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              }}
            >
              <div className="absolute inset-0 bg-[#E07B2A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E07B2A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 text-4xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                ☕
              </div>

              <div>
                <h3 className="font-playfair text-2xl font-bold text-[#F5F0E8] mb-3 group-hover:text-[#E07B2A] transition-colors duration-200">
                  The Local Legend
                </h3>
                <p className="font-dm text-sm leading-relaxed text-[#A39A88] mb-6">
                  "I live here. Show me the tucked-away cafes, artisan streets, and secret sunset points I’ve missed."
                </p>
              </div>

              <div className="flex gap-2.5 flex-wrap justify-center mb-6">
                {["Safety Reporter", "Gem Proposer", "Zone Guardian", "Artisan Lanes"].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[#E07B2A]">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                className="w-full font-dm py-3.5 rounded-2xl bg-white/5 group-hover:bg-[#E07B2A] text-[#F5F0E8] group-hover:text-white font-bold text-sm tracking-wide transition-all duration-300 border border-white/10 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-[#E07B2A]/20"
              >
                Select Local Legend →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: VIBE CHECK (BUBBLE POP) ─────────────────────────────── */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full py-6 z-10 relative">
          <div className="text-center mb-4 shrink-0">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C9921F] mb-1.5 block">Vibe Swipe Matrix</span>
            <h1 className="font-playfair text-2xl md:text-4xl font-extrabold text-[#F5F0E8] leading-tight mb-2">
              Select Your Top Vibes
            </h1>
            <p className="font-dm text-xs md:text-sm text-[#A39A88] max-w-md mx-auto">
              Tap the floating bubbles that match your core interests to pack your bag. Selected vibes float directly into your Backpack!
            </p>
          </div>

          {/* Interactive Floating Bubble Canvas */}
          <div
            className="flex-1 w-full relative rounded-3xl border border-white/5 overflow-hidden my-4"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              boxShadow: "inset 0 4px 30px rgba(0,0,0,0.2)",
            }}
          >
            {INITIAL_BUBBLES.map((b) => {
              const active = selectedVibes.includes(b.id);
              const flying = flyingBubbles[b.id];

              // Set flying vector (aiming at backpack at middle-bottom, approx x:50%, y:95%)
              const tx = 50 - b.x;
              const ty = 95 - b.y;

              return (
                <button
                  key={b.id}
                  onClick={() => handleToggleVibe(b.id)}
                  className={`absolute rounded-full flex flex-col items-center justify-center text-center p-3 cursor-pointer select-none transition-all duration-300 bubble-float`}
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: b.size,
                    height: b.size,
                    background: active ? "#E07B2A" : b.color,
                    border: active ? "2.5px solid #fff" : "1.5px solid rgba(255,255,255,0.08)",
                    boxShadow: active
                      ? "0 8px 24px rgba(224, 123, 42, 0.4), inset 0 2px 10px rgba(255,255,255,0.3)"
                      : "0 6px 16px rgba(0, 0, 0, 0.15)",
                    zIndex: active ? 30 : 10,
                    animationDelay: b.pulseDelay,
                    // custom properties for flying animations
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    "--tx": `${tx}vw`,
                    "--ty": `${ty}vh`,
                  }}
                >
                  <span style={{ fontSize: b.size * 0.32 }} className={active ? "" : "bubble-pulse"}>
                    {b.emoji}
                  </span>
                  <span
                    className="font-dm font-bold leading-tight mt-1"
                    style={{
                      fontSize: b.size * 0.10,
                      color: active ? "#fff" : "#F5F0E8",
                      opacity: b.size < 95 && !active ? 0.7 : 1,
                    }}
                  >
                    {b.label.split(" & ")[0]}
                  </span>
                </button>
              );
            })}

            {/* Float-up background aesthetic rings */}
            <div className="absolute inset-0 pointer-events-none flex justify-around items-end opacity-20">
              <div className="w-1 h-20 bg-gradient-to-t from-transparent to-[#E07B2A] rounded-full blur-[1px]" style={{ animation: "float-slow 6s ease-in-out infinite" }} />
              <div className="w-1 h-32 bg-gradient-to-t from-transparent to-[#C9921F] rounded-full blur-[1px]" style={{ animation: "float-slow 8s ease-in-out infinite 2s" }} />
              <div className="w-1 h-24 bg-gradient-to-t from-transparent to-[#E07B2A] rounded-full blur-[1px]" style={{ animation: "float-slow 5s ease-in-out infinite 1s" }} />
            </div>
          </div>

          {/* Backpack container at the bottom */}
          <div className="w-full flex flex-col items-center shrink-0">
            <div
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 w-full max-w-sm`}
              style={{
                background: selectedVibes.length > 0 ? "rgba(224, 123, 42, 0.08)" : "rgba(255,255,255,0.03)",
                borderColor: selectedVibes.length > 0 ? "#E07B2A/30" : "rgba(255,255,255,0.08)",
                boxShadow: selectedVibes.length > 0 ? "0 4px 20px rgba(224, 123, 42, 0.1)" : "none",
              }}
            >
              <div className="text-3xl relative">
                🎒
                {selectedVibes.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E07B2A] text-[10px] font-extrabold text-white animate-bounce shadow-md"
                  >
                    {selectedVibes.length}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-dm font-bold text-xs uppercase text-[#A39A88]">Your Expedition Backpack</p>
                <p className="font-dm text-xs text-[#F5F0E8] truncate">
                  {selectedVibes.length === 0
                    ? "Pack is empty. Tap bubbles above..."
                    : selectedVibes.map((v) => INITIAL_BUBBLES.find((b) => b.id === v)?.emoji).join("  ")}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-4 w-full mt-4 justify-between max-w-sm">
              <button
                onClick={() => setStep(0)}
                className="font-dm font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl border border-white/10 text-[#A39A88] cursor-pointer hover:bg-white/5 hover:text-[#F5F0E8] transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={selectedVibes.length === 0}
                className="font-dm font-bold text-xs tracking-wider uppercase px-8 py-3.5 rounded-xl bg-[#E07B2A] disabled:bg-white/5 text-white disabled:text-white/20 border border-transparent disabled:border-white/5 cursor-pointer disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex-1 text-center"
              >
                Secure HADI Passport →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: ACCOUNT CREATION (PASSPORT ANIMATION) ───────────────── */}
      {step === 2 && (
        <div className="flex-1 flex flex-col justify-center items-center max-w-md mx-auto w-full py-6 z-10">
          <div className="text-center mb-6">
            <span className="text-xs font-bold tracking-widest uppercase text-[#E07B2A] mb-1.5 block">Step 3: Registration</span>
            <h1 className="font-playfair text-2xl md:text-3xl font-extrabold text-[#F5F0E8] leading-tight">
              Claim Your HADI Passport
            </h1>
            <p className="font-dm text-xs text-[#A39A88] mt-1 max-w-xs mx-auto">
              Secure your profile to claim your **100 XP Welcome Bonus** and start climbing the leaderboard.
            </p>
          </div>

          {/* Interactive Passport 3D Layout */}
          <div className="w-full max-w-[340px] h-[360px] passport-perspective mb-6">
            <div className={`w-full h-full passport-card relative ${linkSentMode ? "passport-flipped" : ""}`}>
              {/* PASSPORT COVER (Front Face) */}
              <div
                className="passport-face absolute inset-0 rounded-[24px] p-6 flex flex-col justify-between overflow-hidden shadow-2xl border"
                style={{
                  background: "linear-gradient(145deg, #103b3b 0%, #071f1f 100%)",
                  borderColor: "rgba(201, 146, 31, 0.35)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.06)",
                }}
              >
                {/* Gold Crest decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,146,31,0.08)_0%,transparent_70%)] pointer-events-none" />

                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold tracking-widest uppercase text-[#C9921F] opacity-80">Republic of Hadi</span>
                  <span className="text-lg">🇮🇳</span>
                </div>

                <div className="flex flex-col items-center py-4">
                  <div
                    className="w-20 h-20 rounded-full border-2 border-[#C9921F]/30 flex items-center justify-center text-4xl mb-4 bg-white/5 shadow-inner"
                    style={{ textShadow: "0 0 12px rgba(201,146,31,0.5)" }}
                  >
                    👑
                  </div>
                  <h2 className="font-playfair text-2xl font-bold tracking-wider text-[#F5F0E8]">PASSPORT</h2>
                  <p className="font-dm text-[9px] uppercase tracking-widest text-[#C9921F] mt-1">Explorer Credential</p>
                </div>

                <div className="flex justify-between items-end border-t border-[#C9921F]/20 pt-4">
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-[#A39A88]">Welcome Gift</p>
                    <p className="font-playfair font-extrabold text-sm text-[#E07B2A]">★ 100 XP BONUS</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-wider text-[#A39A88]">Class Mode</p>
                    <p className="font-dm font-bold text-xs text-[#F5F0E8]">{localMode ? "Local Legend" : "Voyager"}</p>
                  </div>
                </div>
              </div>

              {/* PASSPORT DETAILS / OTP SCREEN (Back Face) */}
              <div
                className="passport-face passport-back absolute inset-0 rounded-[24px] p-6 flex flex-col justify-between overflow-hidden shadow-2xl border"
                style={{
                  background: "linear-gradient(145deg, #0a2626 0%, #051414 100%)",
                  borderColor: "rgba(224, 123, 42, 0.3)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E07B2A]">Verification Gate</span>
                  <span className="text-[9px] text-[#A39A88]">SECURE-LINK</span>
                </div>

                {/* Verification Overlay */}
                <div className="flex-1 flex flex-col justify-center items-center py-4">
                  <p className="font-dm text-sm text-[#A39A88] text-center mb-4">
                    A secure sign-in link has been sent to <br/><strong className="text-[#F5F0E8]">{email}</strong>
                  </p>
                  
                  <div className="text-4xl animate-pulse my-4 drop-shadow-lg">
                    ✉️
                  </div>

                  <p className="text-[10px] text-[#A39A88] text-center mt-2">
                    Check your inbox and click the link to claim your profile. You can close this window.
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                  <button
                    onClick={() => { setLinkSentMode(false); }}
                    className="text-xs font-semibold text-[#A39A88] hover:text-[#F5F0E8] cursor-pointer"
                  >
                    ← Change Email
                  </button>
                  {loading && <span className="text-xs text-[#E07B2A] animate-pulse">Verifying…</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Form / Actions area below passport */}
          {!linkSentMode ? (
            <div className="w-full flex flex-col gap-3">
              {/* Google Button */}
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-white/5 border border-white/10 text-white font-dm font-semibold text-sm cursor-pointer hover:bg-white/10 transition-all shadow-md"
              >
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none" className="shrink-0">
                  <path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.704H24.48v9.024h12.96c-.564 2.988-2.244 5.52-4.776 7.212v5.988h7.728c4.524-4.164 7.14-10.296 7.14-17.52z" fill="#4285F4"/>
                  <path d="M24.48 48c6.48 0 11.916-2.148 15.888-5.808l-7.728-5.988c-2.148 1.44-4.896 2.292-8.16 2.292-6.276 0-11.592-4.236-13.5-9.936H3.024v6.18C6.984 42.948 15.12 48 24.48 48z" fill="#34A853"/>
                  <path d="M10.98 28.56A14.4 14.4 0 0 1 10.2 24c0-1.584.276-3.12.78-4.56v-6.18H3.024A23.952 23.952 0 0 0 .48 24c0 3.864.924 7.524 2.544 10.74l7.956-6.18z" fill="#FBBC05"/>
                  <path d="M24.48 9.504c3.54 0 6.72 1.212 9.216 3.6l6.888-6.888C36.384 2.4 30.96 0 24.48 0 15.12 0 6.984 5.052 3.024 13.26l7.956 6.18c1.908-5.7 7.224-9.936 13.5-9.936z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Apple Button (Mocked) */}
              <button
                onClick={handleGoogleAuth} // uses standard mock google for speed
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-white/5 border border-white/10 text-white font-dm font-semibold text-sm cursor-pointer hover:bg-white/10 transition-all shadow-md"
              >
                <span className="text-lg"></span>
                Continue with Apple
              </button>

              {/* OR bar */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-[1px] bg-white/10" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A39A88]">or use email</span>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>

              {/* Passwordless Email form */}
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className="font-dm w-full px-5 py-3.5 rounded-2xl text-sm"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    outline: "none",
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-dm py-3.5 rounded-2xl bg-[#E07B2A] text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-md shadow-[#E07B2A]/20 cursor-pointer"
                >
                  {loading ? "Sending link…" : "Get Verification Link →"}
                </button>
              </form>

              {error && (
                <p className="font-dm text-center text-xs text-[#f87171] mt-2">
                  {authErrorMessage(error)}
                </p>
              )}

              <button
                onClick={() => setStep(1)}
                className="font-dm font-bold text-xs uppercase tracking-wider text-[#A39A88] text-center mt-3 hover:text-[#F5F0E8] cursor-pointer"
              >
                ← Back to Vibes
              </button>
            </div>
          ) : (
            <div className="w-full text-center">
              <p className="font-dm text-xs text-[#A39A88] max-w-xs mx-auto leading-relaxed">
                Waiting for verification. Once you click the link in your email, you will be authenticated automatically!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer / Dismiss */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-center shrink-0 z-10">
        <button
          onClick={onDismiss}
          className="font-dm text-xs font-semibold text-[#A39A88] hover:text-[#F5F0E8] transition-colors cursor-pointer"
        >
          Cancel Character Creation
        </button>
      </div>
    </div>
  );
}
