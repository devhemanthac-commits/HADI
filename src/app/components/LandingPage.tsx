import { useState, useEffect, useRef } from "react";
import { CharacterCreation } from "./CharacterCreation";
import { useColors } from "../context/AppContext";

interface LandingPageProps {
  onLogin: () => void;
  onAuthSuccess?: () => void;
}

// ── Mini screen previews ──────────────────────────────────────

function MiniHomeScreen() {
  return (
    <div className="flex flex-col gap-2 p-3 h-full overflow-hidden">
      {/* Hero card */}
      <div
        className="rounded-[10px] p-3 relative overflow-hidden shrink-0"
        style={{ background: "linear-gradient(135deg, #164A4A, #1a5c5c)" }}
      >
        <p style={{ color: "#C9921F", fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Welcome back, Explorer
        </p>
        <p className="font-playfair" style={{ color: "#fff", fontSize: 11, fontWeight: 700, marginTop: 2, lineHeight: 1.2 }}>
          Discover <em style={{ color: "#C9921F" }}>Hidden</em> Mysuru
        </p>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 7, marginTop: 3 }}>
          42 unexplored streets. 128 hidden gems.
        </p>
        <div className="flex gap-2 mt-3">
          {["1,850 pts", "5 Gems", "#4 Rank"].map((s) => (
            <div key={s} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 6px" }}>
              <span style={{ color: "#E07B2A", fontSize: 7, fontWeight: 700 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Gem cards strip */}
      <div className="flex gap-2 overflow-hidden">
        {[
          { emoji: "🎨", grad: "linear-gradient(135deg,#7c3aed,#ec4899)", name: "Rangoli Street Art" },
          { emoji: "🍛", grad: "linear-gradient(135deg,#f97316,#dc2626)", name: "Iyer's Idli Corner" },
          { emoji: "🛕", grad: "linear-gradient(135deg,#d97706,#fbbf24)", name: "Trinesvara Temple" },
        ].map((gem) => (
          <div
            key={gem.name}
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 8,
              overflow: "hidden",
              minWidth: 60,
              border: "1px solid rgba(255,255,255,0.1)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                height: 36,
                background: gem.grad,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              {gem.emoji}
            </div>
            <div style={{ padding: "3px 4px" }}>
              <p style={{ fontSize: 6, fontWeight: 600, color: "#F5F0E8", lineHeight: 1.3 }}>{gem.name}</p>
              <p style={{ fontSize: 6, color: "#E07B2A", fontWeight: 700, marginTop: 1 }}>+120 pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniDiscoverScreen() {
  return (
    <div className="flex flex-col gap-2 p-3 h-full overflow-hidden">
      {/* Scan hero */}
      <div
        className="rounded-[10px] p-3 text-center shrink-0"
        style={{ background: "linear-gradient(135deg, #c2410c, #ea580c, #d97706)" }}
      >
        <p className="font-playfair" style={{ color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1.2 }}>
          Find a Hidden Gem
        </p>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 7, marginTop: 2 }}>
          Scan QR or tap RFID
        </p>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 99,
            padding: "4px 10px",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            marginTop: 6,
          }}
        >
          <span style={{ fontSize: 10 }}>📷</span>
          <span style={{ fontSize: 7, fontWeight: 700, color: "#fff" }}>Scan QR</span>
        </div>
      </div>
      {/* Nearby list */}
      {[
        { emoji: "🕌", name: "Jama Masjid Backstreet", dist: "0.3 km", pts: 180 },
        { emoji: "☕", name: "Nandy's Filter Coffee", dist: "0.6 km", pts: 65 },
        { emoji: "🎭", name: "Puppet Workshop Hall", dist: "1.1 km", pts: 220 },
      ].map((item) => (
        <div
          key={item.name}
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: "5px 7px",
            display: "flex",
            alignItems: "center",
            gap: 5,
            border: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 12 }}>{item.emoji}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 7, fontWeight: 600, color: "#F5F0E8" }}>{item.name}</p>
            <p style={{ fontSize: 6, color: "#A39A88" }}>📍 {item.dist}</p>
          </div>
          <span style={{ fontSize: 7, fontWeight: 700, color: "#E07B2A" }}>+{item.pts}</span>
        </div>
      ))}
    </div>
  );
}

function MiniLeaderboardScreen() {
  const top3 = [
    { name: "Priya Nair", pts: "3,420", emoji: "👩", rank: 1 },
    { name: "Suresh Rao", pts: "2,890", emoji: "👨", rank: 2 },
    { name: "Lakshmi V.", pts: "2,210", emoji: "👩‍🦰", rank: 3 },
  ];
  return (
    <div className="flex flex-col gap-2 p-3 h-full overflow-hidden">
      {/* Podium */}
      <div
        className="rounded-[10px] p-3 shrink-0"
        style={{ background: "linear-gradient(135deg, #E07B2A, #c2410c)" }}
      >
        <div className="flex items-end justify-center gap-3">
          {/* rank 2 */}
          <div className="flex flex-col items-center gap-1">
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>👨</div>
            <p style={{ fontSize: 6, color: "#fff", fontWeight: 600 }}>Suresh</p>
            <div style={{ width: 28, height: 18, background: "rgba(255,255,255,0.15)", borderRadius: "4px 4px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>🥈</div>
          </div>
          {/* rank 1 */}
          <div className="flex flex-col items-center gap-1">
            <span style={{ fontSize: 10 }}>👑</span>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>👩</div>
            <p style={{ fontSize: 6, color: "#fff", fontWeight: 700 }}>Priya</p>
            <div style={{ width: 32, height: 26, background: "rgba(255,255,255,0.2)", borderRadius: "4px 4px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🥇</div>
          </div>
          {/* rank 3 */}
          <div className="flex flex-col items-center gap-1">
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>👩‍🦰</div>
            <p style={{ fontSize: 6, color: "#fff", fontWeight: 600 }}>Lakshmi</p>
            <div style={{ width: 28, height: 14, background: "rgba(255,255,255,0.1)", borderRadius: "4px 4px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>🥉</div>
          </div>
        </div>
      </div>
      {/* List rows */}
      {top3.map((entry) => (
        <div
          key={entry.rank}
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: "4px 7px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 9 }}>{entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}</span>
          <span style={{ fontSize: 12 }}>{entry.emoji}</span>
          <p style={{ flex: 1, fontSize: 7, fontWeight: 600, color: "#F5F0E8" }}>{entry.name}</p>
          <span style={{ fontSize: 7, fontWeight: 700, color: "#E07B2A" }}>{entry.pts} pts</span>
        </div>
      ))}
    </div>
  );
}

// ── Device Frame ──────────────────────────────────────────────

function DeviceFrame({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (frameRef.current) observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className="screen-card flex-1 min-w-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0D3333",
      }}
    >
      {/* Browser chrome top bar */}
      <div
        style={{
          background: "#1A1208",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 99,
            height: 14,
            marginLeft: 8,
            display: "flex",
            alignItems: "center",
            paddingLeft: 8,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 7 }}>hadi.app</span>
        </div>
      </div>
      {/* Screen content */}
      <div style={{ height: 260, overflowY: "hidden", background: "#0D3333" }}>
        {children}
      </div>
    </div>
  );
}

// ── How It Works Step ─────────────────────────────────────────

function HowItWorksStep({
  stepNum,
  title,
  desc,
  emoji,
  reverse = false,
}: {
  stepNum: string;
  title: string;
  desc: string;
  emoji: string;
  reverse?: boolean;
}) {
  const stepRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (stepRef.current) observer.observe(stepRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stepRef}
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${reverse ? "md:flex-row-reverse" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Text side */}
      <div className="flex-1 relative">
        {/* Big faint step number */}
        <span
          className="font-playfair absolute -top-6 -left-2 select-none pointer-events-none"
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#FAF6EE",
            opacity: 0.06,
            lineHeight: 1,
            zIndex: 0,
          }}
        >
          {stepNum}
        </span>
        <div className="relative z-10">
          <span
            className="font-dm inline-block mb-3"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#FAF6EE",
              fontSize: 12,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 99,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Step {stepNum}
          </span>
          <h3
            className="font-playfair mb-3"
            style={{ color: "#FAF6EE", fontSize: 26, fontWeight: 700, lineHeight: 1.25 }}
          >
            {title}
          </h3>
          <p
            className="font-dm"
            style={{ color: "rgba(250,246,238,0.7)", fontSize: 16, lineHeight: 1.7 }}
          >
            {desc}
          </p>
        </div>
      </div>

      {/* Illustration card side */}
      <div
        className="shrink-0 flex items-center justify-center rounded-[24px]"
        style={{
          width: 200,
          height: 200,
          background: "linear-gradient(135deg, #164A4A 0%, #1a5c5c 100%)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.05)",
          fontSize: 72,
        }}
      >
        {emoji}
      </div>
    </div>
  );
}

// ── Stat Item ─────────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6">
      <span
        className="font-playfair"
        style={{ color: "#E07B2A", fontSize: 40, fontWeight: 700, lineHeight: 1 }}
      >
        {value}
      </span>
      <span
        className="font-dm"
        style={{ color: "rgba(250,246,238,0.65)", fontSize: 13, fontWeight: 400, letterSpacing: "0.02em" }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Main Landing Page ─────────────────────────────────────────

export function LandingPage({ onLogin, onAuthSuccess }: LandingPageProps) {
  const colors = useColors();
  const [showModal, setShowModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const dismissedRef = useRef(false);

  // Show modal after 10 seconds (only if not already dismissed)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissedRef.current) {
        setShowModal(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShowModal(false);
    setModalDismissed(true);
    dismissedRef.current = true;
  };

  const handleLogin = () => {
    setShowModal(false);
    onLogin();
  };

  const handleAuthSuccess = () => {
    setShowModal(false);
    if (onAuthSuccess) onAuthSuccess();
    else onLogin();
  };

  return (
    <div
      className="font-dm"
      style={{ background: colors.bg, color: colors.text, overflowX: "hidden" }}
    >
      {/* ── Section 1: Hero ───────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center"
        style={{
          minHeight: "100vh",
          background: colors.bg,
          overflow: "hidden",
          padding: "80px 24px 60px",
        }}
      >
        {/* Noise texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            pointerEvents: "none",
          }}
        />

        {/* Decorative glow orbs */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(224,123,42,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,146,31,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-5" style={{ animation: "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both" }}>
            <span style={{ fontSize: 40 }}>🧭</span>
            <span
              className="font-playfair"
              style={{
                color: "#E07B2A",
                fontStyle: "italic",
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              HADI
            </span>
          </div>

          {/* Tagline */}
          <p
            className="font-dm mb-3"
            style={{
              color: "#FAF6EE",
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "0.01em",
              animation: "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.22s both",
            }}
          >
            Your guide to hidden Mysuru.
          </p>

          {/* Description */}
          <p
            className="font-dm mb-10"
            style={{
              color: "rgba(250,246,238,0.55)",
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 440,
              animation: "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.34s both",
            }}
          >
            Discover lesser-known art, food, temples and streets.
            <br />
            Earn points. Build community.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setShowModal(true)}
            className="animate-glow-pulse font-dm"
            style={{
              background: "#E07B2A",
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              padding: "16px 40px",
              borderRadius: 99,
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.01em",
              animationDelay: "0.5s",
            }}
          >
            Start Exploring →
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 animate-bounce-down"
          style={{ transform: "translateX(-50%)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="rgba(250,246,238,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* ── Section 2: App Glimpses ───────────────────────────── */}
      <section
        style={{ background: colors.bg, padding: "80px 24px" }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {/* Heading */}
          <div className="text-center mb-14">
            <h2
              className="font-playfair mb-3"
              style={{ color: colors.text, fontSize: 38, fontWeight: 700, lineHeight: 1.2 }}
            >
              Everything you need to explore Mysuru
            </h2>
            <p
              className="font-dm"
              style={{ color: colors.muted, fontSize: 17, lineHeight: 1.6 }}
            >
              A complete guide for the curious wanderer.
            </p>
          </div>

          {/* 3 screen cards */}
          <div className="flex flex-col md:flex-row gap-6 mb-14">
            <DeviceFrame delay={0}>
              <MiniHomeScreen />
            </DeviceFrame>
            <DeviceFrame delay={150}>
              <MiniDiscoverScreen />
            </DeviceFrame>
            <DeviceFrame delay={300}>
              <MiniLeaderboardScreen />
            </DeviceFrame>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {[
              {
                icon: "💎",
                title: "Hidden Gem Discovery",
                desc: "Curated spots the tourist maps don't show.",
              },
              {
                icon: "🗺️",
                title: "H3 Zone Mapping",
                desc: "Every street mapped with Uber H3 hex cells.",
              },
              {
                icon: "👥",
                title: "Community Safety",
                desc: "Real-time tips from local explorers.",
              },
            ].map((pill) => (
              <div
                key={pill.title}
                className="flex-1 flex flex-col gap-2 rounded-[20px] p-5"
                style={{
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                }}
              >
                <span style={{ fontSize: 28 }}>{pill.icon}</span>
                <p
                  className="font-playfair"
                  style={{ color: colors.text, fontSize: 16, fontWeight: 700 }}
                >
                  {pill.title}
                </p>
                <p
                  className="font-dm"
                  style={{ color: colors.muted, fontSize: 14, lineHeight: 1.5 }}
                >
                  {pill.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: How It Works ───────────────────────────── */}
      <section
        style={{
          background: colors.bg,
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Heading */}
          <div className="text-center mb-16">
            <h2
              className="font-playfair mb-3"
              style={{ color: colors.text, fontSize: 38, fontWeight: 700, lineHeight: 1.2 }}
            >
              How HADI works
            </h2>
            <p className="font-dm" style={{ color: colors.muted, fontSize: 17 }}>
              Three simple steps to become an urban explorer.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-20">
            <HowItWorksStep
              stepNum="01"
              title="Explore Mysuru Streets"
              desc="We've mapped every street. Discover art shops, temples, food stalls and crafts the tourist maps don't show."
              emoji="🗺️"
              reverse={false}
            />
            <HowItWorksStep
              stepNum="02"
              title="Scan & Verify"
              desc="Find a hidden gem? Scan the QR code or tap the RFID plaque to verify your presence and earn points."
              emoji="📷"
              reverse={true}
            />
            <HowItWorksStep
              stepNum="03"
              title="Build Community"
              desc="Share safety notes, local tips and hidden finds with fellow explorers and local guides across Mysuru."
              emoji="🌿"
              reverse={false}
            />
          </div>
        </div>
      </section>

      {/* ── Section 4: Stats Bar ──────────────────────────────── */}
      <section
        style={{
          background: colors.card,
          padding: "60px 24px",
        }}
      >
        <div
          className="flex flex-wrap items-center justify-center"
          style={{ maxWidth: 900, margin: "0 auto", gap: 0 }}
        >
          {[
            { value: "128+", label: "Hidden Gems" },
            { value: "42", label: "Mapped Streets" },
            { value: "3", label: "Active Zones" },
            { value: "500+", label: "Community Members" },
          ].map((stat, idx, arr) => (
            <div
              key={stat.label}
              className="flex items-center"
            >
              <StatItem value={stat.value} label={stat.label} />
              {idx < arr.length - 1 && (
                <div
                  style={{
                    width: 1,
                    height: 48,
                    background: "rgba(250,246,238,0.15)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: Final CTA ──────────────────────────────── */}
      <section
        style={{
          background: colors.bg,
          padding: "100px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            className="font-playfair mb-6"
            style={{
              color: colors.text,
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Ready to explore
            <br />
            <em style={{ color: "#E07B2A", fontStyle: "italic" }}>hidden Mysuru?</em>
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="font-dm mb-4"
            style={{
              background: "#E07B2A",
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              padding: "16px 44px",
              borderRadius: 99,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(224,123,42,0.3)",
              transition: "transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s",
              display: "inline-block",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 14px 36px rgba(224,123,42,0.4)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(224,123,42,0.3)";
            }}
          >
            Join HADI →
          </button>
          <p
            className="font-dm block"
            style={{ color: "#B0A090", fontSize: 13 }}
          >
            Free to join. No credit card needed.
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        style={{
          background: colors.card,
          padding: "32px 40px",
        }}
      >
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ maxWidth: 1080, margin: "0 auto" }}
        >
          {/* Logo left */}
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>🧭</span>
            <span
              className="font-playfair"
              style={{
                color: "#E07B2A",
                fontStyle: "italic",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              HADI
            </span>
          </div>

          {/* Center */}
          <p
            className="font-dm"
            style={{ color: "rgba(250,246,238,0.5)", fontSize: 13 }}
          >
            Built with ❤️ in Mysuru
          </p>

          {/* Right */}
          <p
            className="font-dm"
            style={{ color: "rgba(250,246,238,0.35)", fontSize: 12 }}
          >
            © 2026 HADI
          </p>
        </div>
      </footer>

      {/* Character Creation & Onboarding Auth */}
      {showModal && (
        <CharacterCreation onSuccess={handleAuthSuccess} onDismiss={handleDismiss} />
      )}
    </div>
  );
}