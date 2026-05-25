import { useState, useEffect, useMemo, Component, ErrorInfo, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { useApp } from "../../context/AppContext";
import { useGame } from "../../store/GameStore";
import { generateGemQR } from "../../engine/checkin";
import { Scanner } from "@yudiel/react-qr-scanner";

class ScannerErrorBoundary extends Component<{ children: ReactNode; onError: (err: Error) => void }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; onError: (err: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError(error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export function QRScan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useApp();
  const { doCheckin } = useGame();

  const state = location.state as { gemId?: number; gemName?: string; gemPoints?: number } | null;
  const gemId = state?.gemId ?? 8;
  const gemName = state?.gemName ?? "Puppet Workshop Hall";
  const gemPoints = state?.gemPoints ?? 220;

  const [phase, setPhase] = useState<"scanning" | "success">("scanning");
  const [showToast, setShowToast] = useState(false);
  const [awardedPoints, setAwardedPoints] = useState(gemPoints);

  const [manualCode, setManualCode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validQRString = useMemo(() => generateGemQR(gemId, Date.now()), [gemId]);

  const handleManualVerify = async (code: string) => {
    setErrorMessage("");
    
    // Sync with local Zustand game engine
    const result = doCheckin(gemId, "qr", undefined, 5, code);
    
    if (result.valid) {
      const points = result.pointsAwarded || gemPoints;
      navigate("/", { state: { checkinSuccess: true, points, gemName } });
    } else {
      setErrorMessage(result.reason || "Invalid Check-in.");
      addToast("warning", result.reason || "Check-in failed.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(validQRString);
    addToast("info", "📋 QR string copied!");
  };

  useEffect(() => {
    // Phase success no longer handled here locally, we redirect immediately instead
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto"
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
              className="relative mb-8 rounded-[16px] overflow-hidden"
              style={{ width: 280, height: 280, border: "2px solid rgba(224,123,42,0.4)", background: "rgba(0,0,0,0.5)" }}
            >
              <ScannerErrorBoundary onError={(err) => setErrorMessage(err.message || "Failed to initialize camera scanner.")}>
                <Scanner 
                  onScan={(result: any) => {
                    if (result && result.length > 0 && result[0].rawValue) {
                      handleManualVerify(result[0].rawValue);
                    }
                  }}
                  onError={(err: any) => {
                    setErrorMessage(err?.message || "Camera access denied or no camera found. Please enter code manually.");
                  }}
                  components={{ tracker: true, audio: false }}
                  styles={{ container: { width: "100%", height: "100%" } }}
                />
              </ScannerErrorBoundary>

              {/* Corner brackets */}
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
            <div className="flex items-center gap-2 mb-6">
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
              onClick={() => setShowManualInput(!showManualInput)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.35)",
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "inherit",
                marginBottom: 8,
              }}
            >
              {showManualInput ? "Hide manual entry" : "Or enter code manually"}
            </button>

            {showManualInput && (
              <div
                className="mt-2 mb-6 flex flex-col gap-3 w-full max-w-xs animate-fade-in"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <input
                  type="text"
                  placeholder="Paste time-sensitive QR string"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    padding: "8px 10px",
                    color: "#fff",
                    fontSize: 12.5,
                    fontFamily: "monospace",
                    width: "100%",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => handleManualVerify(manualCode)}
                  className="pressable"
                  style={{
                    background: "linear-gradient(135deg, #E07B2A, #C9921F)",
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 700,
                    padding: "9px",
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  Verify Code
                </button>
              </div>
            )}

            {/* Error Message Panel */}
            {errorMessage && (
              <div
                className="mt-4 mb-6 p-4 rounded-[16px] border flex items-start gap-3 w-full max-w-sm animate-fade-in text-left"
                style={{
                  background: "rgba(239, 68, 68, 0.08)",
                  borderColor: "rgba(239, 68, 68, 0.25)",
                  color: "#ef4444",
                  fontSize: 13,
                  lineHeight: 1.4,
                }}
              >
                <span style={{ fontSize: 16, marginTop: 1 }}>⚠️</span>
                <div>
                  <strong style={{ fontWeight: 600 }}>Security Blocked</strong>
                  <div style={{ marginTop: 2, color: "rgba(255, 255, 255, 0.75)" }}>{errorMessage}</div>
                </div>
              </div>
            )}

            {/* Bottom Drawer Simulator */}
            <div
              className="mt-6 w-full max-w-sm rounded-[20px] p-5 flex flex-col gap-4 animate-fade-up text-left"
              style={{
                background: "rgba(15, 61, 61, 0.35)",
                border: "1px solid rgba(224, 123, 42, 0.18)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 18 }}>🎟️</span>
                <h3
                  className="font-playfair"
                  style={{ color: "#E07B2A", fontSize: 15, fontWeight: 700, margin: 0 }}
                >
                  Venue QR Code Simulator
                </h3>
              </div>
              
              <p
                className="font-dm"
                style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.4, margin: 0 }}
              >
                Simulates scanning the uniquely generated HADI QR sticker placed at the venue. 
                Uses a 5-minute bucketed salt hash for time-sensitive anti-tampering.
              </p>

              {/* Hash Box */}
              <div className="flex flex-col gap-1">
                <span className="font-dm" style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600 }}>
                  VALID SEED HASH (CURRENT BUCKET)
                </span>
                <div
                  className="flex items-center justify-between rounded-lg p-2.5"
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      color: "#C9921F",
                      fontSize: 11,
                      wordBreak: "break-all",
                    }}
                  >
                    {validQRString}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="pressable"
                    style={{
                      background: "rgba(224, 123, 42, 0.15)",
                      border: "1px solid rgba(224, 123, 42, 0.3)",
                      borderRadius: 6,
                      color: "#E07B2A",
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: "4px 8px",
                      cursor: "pointer",
                      marginLeft: 8,
                      flexShrink: 0,
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2.5 mt-1">
                <button
                  onClick={() => handleManualVerify(validQRString)}
                  className="pressable"
                  style={{
                    background: "linear-gradient(135deg, #E07B2A, #C9921F)",
                    border: "none",
                    borderRadius: 10,
                    color: "#fff",
                    fontWeight: 700,
                    padding: "10px",
                    fontSize: 12.5,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(224, 123, 42, 0.2)",
                  }}
                >
                  Simulate Live Venue Scan
                </button>
                
                <button
                  onClick={() => handleManualVerify("HADI-QR-8-999999-invalidhash")}
                  className="pressable"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    color: "rgba(255,255,255,0.75)",
                    fontWeight: 600,
                    padding: "9px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Simulate Invalid / Expired Scan
                </button>
              </div>
            </div>
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
