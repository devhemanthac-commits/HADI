import { useState } from "react";
import { useApp } from "../context/AppContext";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    bg: "#0F3D3D",
    emoji: "🧭",
    heading: "Welcome to HADI",
    body: "Your guide to hidden Mysuru. Discover what most tourists never find.",
    headingColor: "#fff",
    bodyColor: "rgba(250,246,238,0.75)",
    dotActive: "#E07B2A",
    dotInactive: "rgba(255,255,255,0.25)",
  },
  {
    bg: "#E07B2A",
    emoji: "💎",
    heading: "Earn Points, Unlock Zones",
    body: "Every hidden gem you discover earns you points. Rarer gems earn more.",
    headingColor: "#fff",
    bodyColor: "rgba(255,255,255,0.8)",
    dotActive: "#fff",
    dotInactive: "rgba(255,255,255,0.3)",
  },
  {
    bg: "#FAF6EE",
    emoji: "🛡️",
    heading: "Safety First, Always",
    body: "Our community keeps each other safe. Check zone safety before you explore.",
    headingColor: "#0F3D3D",
    bodyColor: "#7A6A55",
    dotActive: "#E07B2A",
    dotInactive: "rgba(15,61,61,0.2)",
  },
];

const NAME_SLIDE = {
  bg: "#0F3D3D",
  emoji: "👋",
  heading: "What should we call you?",
  body: "This is how you'll appear on the leaderboard.",
  headingColor: "#fff",
  bodyColor: "rgba(250,246,238,0.75)",
  dotActive: "#E07B2A",
  dotInactive: "rgba(255,255,255,0.25)",
};

const TOTAL_STEPS = slides.length + 1; // +1 for name slide

export function Onboarding({ onComplete }: OnboardingProps) {
  const { setUserName } = useApp();
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const isNameStep = step === slides.length;
  const isLast = step === TOTAL_STEPS - 1;
  const current = isNameStep ? NAME_SLIDE : slides[step];

  const handleComplete = () => {
    const name = nameInput.trim();
    if (name) setUserName(name);
    onComplete();
  };

  const goNext = () => {
    if (animating) return;
    if (isLast) {
      handleComplete();
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 200);
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
      style={{
        background: current.bg,
        transition: "background 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Skip */}
      <button
        onClick={handleComplete}
        className="font-dm absolute top-6 right-6"
        style={{
          background: "rgba(0,0,0,0.12)",
          border: "none",
          borderRadius: 99,
          padding: "6px 16px",
          color: current.headingColor,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          opacity: 0.7,
        }}
      >
        Skip
      </button>

      {/* Card content */}
      <div
        className="flex flex-col items-center text-center px-8 max-w-sm w-full"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateX(-20px)" : "translateX(0)",
          transition: "opacity 0.2s, transform 0.2s",
        }}
      >
        {/* Emoji */}
        <div
          className="flex items-center justify-center mb-8"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            fontSize: 60,
          }}
        >
          {current.emoji}
        </div>

        {/* Heading */}
        <h1
          className="font-playfair mb-4"
          style={{
            color: current.headingColor,
            fontSize: 34,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {current.heading}
        </h1>

        {/* Body */}
        <p
          className="font-dm mb-8"
          style={{
            color: current.bodyColor,
            fontSize: 16,
            lineHeight: 1.65,
          }}
        >
          {current.body}
        </p>

        {/* Name input on last step */}
        {isNameStep && (
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComplete()}
            placeholder="Your name…"
            maxLength={32}
            autoFocus
            className="font-dm w-full mb-4"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              borderRadius: 14,
              padding: "14px 18px",
              color: "#fff",
              fontSize: 18,
              fontWeight: 600,
              outline: "none",
              textAlign: "center",
            }}
          />
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
          <div
            key={idx}
            style={{
              width: idx === step ? 24 : 8,
              height: 8,
              borderRadius: 99,
              background: idx === step ? current.dotActive : current.dotInactive,
              transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        ))}
      </div>

      {/* CTA */}
      {isLast ? (
        <button
          onClick={handleComplete}
          className="font-dm pressable"
          style={{
            background: "#E07B2A",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            padding: "15px 40px",
            borderRadius: 99,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(224,123,42,0.35)",
            opacity: nameInput.trim() ? 1 : 0.6,
          }}
        >
          Start Exploring →
        </button>
      ) : (
        <button
          onClick={goNext}
          className="font-dm pressable"
          style={{
            background: "rgba(255,255,255,0.15)",
            color: current.headingColor,
            fontSize: 16,
            fontWeight: 600,
            padding: "15px 40px",
            borderRadius: 99,
            border: `1.5px solid ${current.headingColor}30`,
            cursor: "pointer",
          }}
        >
          Next →
        </button>
      )}
    </div>
  );
}
