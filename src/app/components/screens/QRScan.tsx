import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useApp } from "../../context/AppContext";
import { useGame } from "../../store/GameStore";

export function QRScan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { markVisited, addToast } = useApp();
  const { doCheckin } = useGame();

  const state = location.state as { gemId?: number; gemName?: string; gemPoints?: number } | null;
  const gemId = state?.gemId ?? 8;
  const gemName = state?.gemName ?? "Puppet Workshop Hall";
  const gemPoints = state?.gemPoints ?? 220;

  const [phase, setPhase] = useState<"scanning" | "success">("scanning");
  const [showToast, setShowToast] = useState(false);
  const [awardedPoints, setAwardedPoints] = useState(gemPoints);

  useEffect(() => {
    // Auto-success after 3 seconds
    const successTimer = setTimeout(() => {
      setPhase("success");
      markVisited(gemId);
      // Run real check-in logic via QR method
      const result = doCheckin(gemId, "qr");
      if (result.valid && result.pointsAwarded) {
        setAwardedPoints(result.pointsAwarded);
      }
      setShowToast(true);
    }, 3000);

    return () => clearTimeout(successTimer);
  }, [gemId, markVisited]);

  useEffect(() => {
    if (phase === "success") {
      // Navigate back after 2.5s
      const navTimer = setTimeout(() => {
        addToast("success", `💎 +${awardedPoints} pts · ${gemName} verified!`);
        navigate(-1);
      }, 2500);
      return () => clearTimeout(navTimer);
    }
  }, [phase, gemId, gemName, awardedPoints, navigate, addToast]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center"
      style={{ background: "#0A1A1A" }}
    >
      {/* Header */}
      <div className="w-full flex items-center gap-4 px-5 pt-12 pb-6">
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <h1
          className="font-playfair"
          style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}
        >
          Scan to Verify
        </h1>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 w-full">
        {phase === "scanning" ? (
          <>
            {/* Scan Frame */}
            <div
              className="relative mb-8"
              style={{ width: 280, height: 280 }}
            >
              {/* Subtle grid pattern inside */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                  borderRadius: 4,
                }}
              />

              {/* Animated scan line */}
              <div
                style={{
                  position: "absolute",
                  left: 8,
                  right: 8,
                  height: 2,
                  background: "linear-gradient(90deg, transparent, #E07B2A, transparent)",
                  borderRadius: 99,
                  animation: "scanLine 1.8s linear infinite",
                  boxShadow: "0 0 8px rgba(224,123,42,0.6)",
                }}
              />

              {/* Corner brackets — top-left */}
              <CornerBracket position="top-left" />
              <CornerBracket position="top-right" />
              <CornerBracket position="bottom-left" />
              <CornerBracket position="bottom-right" />
            </div>

            <p
              className="font-dm mb-3 text-center"
              style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}
            >
              Point your camera at the QR code
            </p>

            {/* GPS status */}
            <div className="flex items-center gap-2 mb-8">
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 6px rgba(34,197,94,0.7)",
                }}
              />
              <span
                className="font-dm"
                style={{ color: "#22c55e", fontSize: 13, fontWeight: 500 }}
              >
                GPS Verified · Lakshmipuram
              </span>
            </div>

            {/* Manual entry link */}
            <button
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.35)",
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "inherit",
              }}
            >
              Or enter code manually
            </button>
          </>
        ) : (
          /* Success state */
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Success frame */}
            <div
              className="relative"
              style={{ width: 220, height: 220 }}
            >
              {/* Green border */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  border: "3px solid #22c55e",
                  boxShadow: "0 0 32px rgba(34,197,94,0.3)",
                  transition: "all 0.4s",
                }}
              />
              {/* Checkmark */}
              <div
                className="animate-checkmark absolute inset-0 flex items-center justify-center"
                style={{ fontSize: 80 }}
              >
                ✅
              </div>
            </div>

            <div>
              <h2
                className="font-playfair mb-2"
                style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}
              >
                Gem Verified!
              </h2>
              <p
                className="font-dm"
                style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}
              >
                {gemName}
              </p>
            </div>

            {/* Points toast-style pill */}
            {showToast && (
              <div
                className="toast-enter flex items-center gap-3 px-5 py-3 rounded-[16px]"
                style={{
                  background: "#fff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
              >
                <span style={{ fontSize: 22 }}>💎</span>
                <span
                  className="font-dm"
                  style={{ color: "#E07B2A", fontWeight: 700, fontSize: 16 }}
                >
                  +{awardedPoints} pts awarded
                </span>
                <span
                  className="font-dm"
                  style={{ color: "#7A6A55", fontSize: 13 }}
                >
                  · {gemName}
                </span>
              </div>
            )}

            <p
              className="font-dm"
              style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}
            >
              Returning to gem detail…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CornerBracket({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const size = 28;
  const thickness = 3;
  const color = "#E07B2A";

  const styles: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    animation: "cornerPulse 2s ease-in-out infinite",
  };

  const borderStyles: Partial<React.CSSProperties> = {
    top: position.startsWith("top") ? 0 : undefined,
    bottom: position.startsWith("bottom") ? 0 : undefined,
    left: position.endsWith("left") ? 0 : undefined,
    right: position.endsWith("right") ? 0 : undefined,
    borderTop: position.startsWith("top") ? `${thickness}px solid ${color}` : undefined,
    borderBottom: position.startsWith("bottom") ? `${thickness}px solid ${color}` : undefined,
    borderLeft: position.endsWith("left") ? `${thickness}px solid ${color}` : undefined,
    borderRight: position.endsWith("right") ? `${thickness}px solid ${color}` : undefined,
    borderTopLeftRadius: position === "top-left" ? 8 : undefined,
    borderTopRightRadius: position === "top-right" ? 8 : undefined,
    borderBottomLeftRadius: position === "bottom-left" ? 8 : undefined,
    borderBottomRightRadius: position === "bottom-right" ? 8 : undefined,
  };

  return <div style={{ ...styles, ...borderStyles }} />;
}
