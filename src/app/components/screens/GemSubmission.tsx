import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp, useColors } from "../../context/AppContext";

const categories = [
  { emoji: "🎨", label: "Art" },
  { emoji: "🍛", label: "Food" },
  { emoji: "🛕", label: "Temple" },
  { emoji: "🧶", label: "Craft" },
  { emoji: "🌿", label: "Nature" },
  { emoji: "🛤️", label: "Street" },
];

const TOTAL_STEPS = 4;

export function GemSubmission() {
  const navigate = useNavigate();
  const C = useColors();
  const { addToast } = useApp();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [gemName, setGemName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [photoTaken, setPhotoTaken] = useState(false);
  const [coords] = useState({ lat: "12.2958° N", lng: "76.6394° E" });
  const [address] = useState("Sayyaji Rao Rd, Mysuru, Karnataka 570001");

  const canNext =
    step === 1 ? gemName.trim().length > 0 && selectedCategory !== "" :
    step === 2 ? photoTaken :
    step === 3 ? true :
    true;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      // Submit
      setSubmitted(true);
      addToast("info", "👥 Submission sent! You'll earn 500 pts once verified.");
    }
  };

  if (submitted) {
    return (
      <div
        className="animate-fade-up flex flex-col items-center justify-center text-center py-16 gap-6 min-h-[60vh]"
        style={{ background: C.bg }}
      >
        <div className="animate-checkmark" style={{ fontSize: 72 }}>✅</div>
        <div>
          <h2
            className="font-playfair mb-2"
            style={{ color: C.text, fontSize: 26, fontWeight: 700 }}
          >
            Submitted!
          </h2>
          <p className="font-dm" style={{ color: C.muted, fontSize: 15, lineHeight: 1.6 }}>
            You'll earn{" "}
            <span style={{ color: "#E07B2A", fontWeight: 700 }}>500 pts</span>{" "}
            once verified.
          </p>
          <p className="font-dm mt-2" style={{ color: C.muted, fontSize: 13 }}>
            2 community members will verify your submission.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="font-dm pressable"
          style={{
            background: "#E07B2A",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            padding: "14px 36px",
            borderRadius: 99,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(224,123,42,0.3)",
          }}
        >
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up flex flex-col gap-6" style={{ background: C.bg }}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => (step > 1 ? setStep((s) => s - 1) : navigate(-1))}
          style={{
            background: "rgba(26,18,8,0.07)",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: C.muted,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="font-playfair" style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>
            Submit a Hidden Gem
          </h1>
          <p className="font-dm" style={{ color: C.muted, fontSize: 13 }}>
            Step {step} of {TOTAL_STEPS}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 4,
          background: "rgba(26,18,8,0.08)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(step / TOTAL_STEPS) * 100}%`,
            background: "linear-gradient(90deg, #E07B2A, #C9921F)",
            borderRadius: 99,
            transition: "width 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>

      {/* Step content */}
      {step === 1 && (
        <Step1
          gemName={gemName}
          setGemName={setGemName}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          C={C}
        />
      )}
      {step === 2 && (
        <Step2 photoTaken={photoTaken} setPhotoTaken={setPhotoTaken} C={C} />
      )}
      {step === 3 && (
        <Step3 coords={coords} address={address} C={C} />
      )}
      {step === 4 && (
        <Step4
          gemName={gemName}
          selectedCategory={selectedCategory}
          photoTaken={photoTaken}
          address={address}
          C={C}
        />
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-2 pb-4">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="font-dm pressable flex-1"
            style={{
              height: 50,
              borderRadius: 99,
              background: "transparent",
              border: `1.5px solid ${C.borderStrong}`,
              color: C.muted,
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="font-dm pressable"
          style={{
            flex: 2,
            height: 50,
            borderRadius: 99,
            background: canNext ? "#E07B2A" : "rgba(26,18,8,0.1)",
            color: canNext ? "#fff" : C.muted,
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: canNext ? "pointer" : "not-allowed",
            boxShadow: canNext ? "0 6px 20px rgba(224,123,42,0.28)" : "none",
            transition: "all 0.22s",
          }}
        >
          {step === TOTAL_STEPS ? "Submit for Verification →" : "Next →"}
        </button>
      </div>
    </div>
  );
}

// ─── Step 1 ────────────────────────────────────────────────────

function Step1({
  gemName,
  setGemName,
  selectedCategory,
  setSelectedCategory,
  C,
}: {
  gemName: string;
  setGemName: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  C: ReturnType<typeof useColors>;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="font-dm block mb-2" style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>
          What is this place called?
        </label>
        <input
          type="text"
          value={gemName}
          onChange={(e) => setGemName(e.target.value)}
          placeholder="e.g. Yellappa's Puppet Studio"
          className="font-dm w-full outline-none"
          style={{
            background: C.inputBg,
            border: `1.5px solid ${gemName ? "#E07B2A" : C.borderStrong}`,
            borderRadius: 14,
            padding: "14px 16px",
            color: C.text,
            fontSize: 15,
            transition: "border-color 0.22s",
          }}
        />
      </div>

      <div>
        <label className="font-dm block mb-3" style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>
          Category
        </label>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => {
            const active = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className="font-dm pressable flex flex-col items-center gap-2 py-4 rounded-[16px]"
                style={{
                  background: active ? "rgba(224,123,42,0.1)" : C.card,
                  border: active ? "1.5px solid #E07B2A" : `1.5px solid ${C.border}`,
                  cursor: "pointer",
                  transition: "all 0.22s",
                }}
              >
                <span style={{ fontSize: 24 }}>{cat.emoji}</span>
                <span style={{ color: active ? "#E07B2A" : C.muted, fontSize: 13, fontWeight: active ? 700 : 400 }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 ────────────────────────────────────────────────────

function Step2({
  photoTaken,
  setPhotoTaken,
  C,
}: {
  photoTaken: boolean;
  setPhotoTaken: (v: boolean) => void;
  C: ReturnType<typeof useColors>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-playfair mb-1" style={{ color: C.text, fontSize: 18, fontWeight: 700 }}>
          Take a Photo
        </p>
        <p className="font-dm" style={{ color: C.muted, fontSize: 13 }}>
          Gallery uploads not allowed — live photo only.
        </p>
      </div>

      <button
        onClick={() => setPhotoTaken(true)}
        className="pressable w-full relative overflow-hidden rounded-[20px]"
        style={{
          height: 220,
          border: photoTaken ? "2px solid #22c55e" : `2px dashed ${C.borderStrong}`,
          background: photoTaken
            ? "linear-gradient(135deg, #059669, #0d9488)"
            : C.card,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {photoTaken ? (
          <>
            <span style={{ fontSize: 52 }}>✅</span>
            <span className="font-dm" style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
              Photo captured!
            </span>
            <span className="font-dm" style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
              Tap to retake
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 48 }}>📷</span>
            <span className="font-dm" style={{ color: C.muted, fontWeight: 600, fontSize: 15 }}>
              Take a live photo
            </span>
            <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>
              Tap to capture
            </span>
          </>
        )}
      </button>

      <p className="font-dm text-center" style={{ color: C.muted, fontSize: 12 }}>
        📸 Live camera only · No gallery uploads allowed
      </p>
    </div>
  );
}

// ─── Step 3 ────────────────────────────────────────────────────

function Step3({
  coords,
  address,
  C,
}: {
  coords: { lat: string; lng: string };
  address: string;
  C: ReturnType<typeof useColors>;
}) {
  const [locationSet, setLocationSet] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-playfair mb-1" style={{ color: C.text, fontSize: 18, fontWeight: 700 }}>
          Confirm Location
        </p>
        <p className="font-dm" style={{ color: C.muted, fontSize: 13 }}>
          We'll use your current GPS position.
        </p>
      </div>

      {/* Map card */}
      <div
        className="relative rounded-[20px] overflow-hidden"
        style={{ height: 180, background: "linear-gradient(135deg, #0F3D3D, #1a5c5c)" }}
      >
        {/* Fake map tiles */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Streets */}
        <div style={{ position: "absolute", top: "40%", left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.12)" }} />
        <div style={{ position: "absolute", left: "35%", top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.12)" }} />
        <div style={{ position: "absolute", top: "65%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.07)" }} />
        {/* Pin */}
        <div
          className="absolute flex flex-col items-center"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              background: "#E07B2A",
              boxShadow: "0 4px 16px rgba(224,123,42,0.5)",
              border: "3px solid #fff",
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "rgba(224,123,42,0.4)",
              marginTop: 4,
              boxShadow: "0 0 12px rgba(224,123,42,0.4)",
            }}
          />
        </div>
      </div>

      {/* GPS info */}
      <div
        className="rounded-[16px] p-4 flex flex-col gap-2"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-2">
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.6)", flexShrink: 0 }} />
          <span className="font-dm" style={{ color: "#22c55e", fontSize: 12, fontWeight: 600 }}>GPS Active</span>
        </div>
        <p className="font-dm" style={{ color: C.text, fontSize: 13, fontFamily: "monospace" }}>
          {coords.lat}, {coords.lng}
        </p>
        <p className="font-dm" style={{ color: C.muted, fontSize: 13 }}>{address}</p>
      </div>

      <button
        onClick={() => setLocationSet(true)}
        className="font-dm pressable"
        style={{
          height: 44,
          borderRadius: 99,
          background: "transparent",
          border: "1.5px solid #0F3D3D",
          color: "#0F3D3D",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        📍 Use my current location
      </button>
    </div>
  );
}

// ─── Step 4 ────────────────────────────────────────────────────

function Step4({
  gemName,
  selectedCategory,
  photoTaken,
  address,
  C,
}: {
  gemName: string;
  selectedCategory: string;
  photoTaken: boolean;
  address: string;
  C: ReturnType<typeof useColors>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-playfair mb-1" style={{ color: C.text, fontSize: 18, fontWeight: 700 }}>
          Review & Submit
        </p>
        <p className="font-dm" style={{ color: C.muted, fontSize: 13 }}>
          Double-check your submission before sending.
        </p>
      </div>

      {/* Summary card */}
      <div
        className="rounded-[20px] overflow-hidden"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        {/* Photo thumbnail */}
        {photoTaken && (
          <div
            style={{
              height: 120,
              background: "linear-gradient(135deg, #059669, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            📷
          </div>
        )}

        <div className="p-5 flex flex-col gap-3">
          <SummaryRow label="Name" value={gemName || "—"} C={C} />
          <SummaryRow label="Category" value={selectedCategory || "—"} C={C} />
          <SummaryRow label="Location" value={address} C={C} />
          <SummaryRow label="Photo" value={photoTaken ? "✅ Captured" : "❌ Missing"} C={C} />
        </div>
      </div>

      <div
        className="rounded-[14px] px-4 py-3 flex items-start gap-3"
        style={{ background: "rgba(15,61,61,0.06)", border: "1px solid rgba(15,61,61,0.1)" }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>👥</span>
        <p className="font-dm" style={{ color: "#0F3D3D", fontSize: 13, lineHeight: 1.5 }}>
          2 community members will verify your submission before it goes live.
        </p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, C }: { label: string; value: string; C: ReturnType<typeof useColors> }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-dm shrink-0" style={{ color: C.muted, fontSize: 13 }}>{label}</span>
      <span className="font-dm text-right" style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{value}</span>
    </div>
  );
}
