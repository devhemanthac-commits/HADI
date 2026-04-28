import { useState } from "react";
import { useApp, useColors } from "../../context/AppContext";

const filterPills = ["All Posts", "Local Tips", "Safety Notes", "Hidden Finds"];

const mysureAreas = [
  "Devaraja Market", "Chamundi Hill", "Sayyaji Rao Rd", "Fort Area",
  "Lakshmipuram", "Agrahara Lane", "Nazarbad", "Kukkarahalli",
  "Gandhi Square", "Palace Rd", "Ashoka Rd", "Chamundipuram",
];

const severityOptions = [
  { key: "Caution", icon: "⚠️", label: "Caution", desc: "Proceed carefully", color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.25)" },
  { key: "Avoid", icon: "🚫", label: "Avoid", desc: "Not safe right now", color: "#dc2626", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.25)" },
  { key: "AllClear", icon: "✅", label: "All Clear", desc: "Situation resolved", color: "#16a34a", bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.25)" },
];

const posts = [
  {
    id: 1,
    avatar: "🧑‍🦱",
    avatarBg: "linear-gradient(135deg, #7c3aed, #4c1d95)",
    name: "Kavitha S.",
    isExpert: true,
    isVerifiedLocal: true,
    timestamp: "2h ago",
    body: "Just found the most incredible rangoli painted in a tiny alleyway off Sayyaji Rao Road! The artist starts at 4am every day. It's gone by 10am. Absolutely worth the early morning trip. 🎨",
    emoji: "🎨",
    gradient: "linear-gradient(135deg, #7c3aed, #ec4899)",
    likes: 42,
    comments: 9,
    category: "Hidden Finds",
  },
  {
    id: 2,
    avatar: "👨‍💼",
    avatarBg: "linear-gradient(135deg, #059669, #0d9488)",
    name: "Ravi Kumar",
    isExpert: false,
    isVerifiedLocal: false,
    timestamp: "5h ago",
    body: "Safety note for today: The eastern entrance to Devaraja Market has a large crowd near the textile section. Recommend using the northern gate instead. Parking is also available near Irwin Road. Stay safe explorers! 🛡️",
    emoji: "⚠️",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    likes: 28,
    comments: 4,
    category: "Safety Notes",
  },
  {
    id: 3,
    avatar: "👩‍🍳",
    avatarBg: "linear-gradient(135deg, #ea580c, #d97706)",
    name: "Meena Devi",
    isExpert: true,
    isVerifiedLocal: true,
    timestamp: "1d ago",
    body: "Hidden tip: Iyer's Idli Corner in Agrahara Lane — they serve only 50 plates every morning. Go before 7am. The chutney is made fresh from Chamundi Hill herbs. Best idli I've had in 10 years of exploring Mysuru! ☕🥥",
    emoji: "🍛",
    gradient: "linear-gradient(135deg, #f97316, #dc2626)",
    likes: 87,
    comments: 23,
    category: "Local Tips",
  },
];

// Safety Report Bottom Sheet
function SafetyReportSheet({ onClose, C }: { onClose: () => void; C: ReturnType<typeof useColors> }) {
  const { addToast } = useApp();
  const [area, setArea] = useState("");
  const [severity, setSeverity] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState("Now");

  const handleSubmit = () => {
    addToast("success", "Safety report submitted. Thank you for keeping explorers safe 🙏");
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease-out" }}
        onClick={onClose}
      >
        <div
          className="rounded-[24px] w-full"
          style={{
            background: C.bg,
            maxHeight: "90vh",
            maxWidth: 600,
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            animation: "modalSlideIn 0.3s cubic-bezier(0.22,1,0.36,1)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex justify-center pt-3 pb-4">
          <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(26,18,8,0.12)" }} />
        </div>

        <div className="px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-playfair" style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>
              Report a Safety Issue
            </h2>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 22 }}>×</button>
          </div>

          {/* Area selector */}
          <div className="mb-4">
            <label className="font-dm block mb-2" style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>Area</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="font-dm w-full outline-none"
              style={{ background: C.inputBg, border: `1.5px solid ${area ? "#E07B2A" : C.borderStrong}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 14 }}
            >
              <option value="">Select an area…</option>
              {mysureAreas.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Severity */}
          <div className="mb-4">
            <label className="font-dm block mb-2" style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>Severity</label>
            <div className="grid grid-cols-3 gap-2">
              {severityOptions.map((opt) => {
                const active = severity === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setSeverity(opt.key)}
                    className="pressable flex flex-col items-center gap-1 py-3 rounded-[14px]"
                    style={{
                      background: active ? opt.bg : C.card,
                      border: `1.5px solid ${active ? opt.border : C.border}`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{opt.icon}</span>
                    <span className="font-dm" style={{ color: active ? opt.color : C.muted, fontSize: 12, fontWeight: active ? 700 : 400 }}>
                      {opt.label}
                    </span>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 10 }}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text area */}
          <div className="mb-4">
            <label className="font-dm block mb-2" style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>Describe the situation (optional)</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's happening? How severe is it?"
              className="font-dm w-full outline-none resize-none"
              style={{ background: C.inputBg, border: `1.5px solid ${C.borderStrong}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 14 }}
            />
          </div>

          {/* Time */}
          <div className="mb-6">
            <label className="font-dm block mb-2" style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>When?</label>
            <div className="flex gap-2">
              {["Now", "This Morning", "This Evening"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className="font-dm flex-1 pressable"
                  style={{
                    padding: "9px 0",
                    borderRadius: 99,
                    background: time === t ? "#E07B2A" : "transparent",
                    border: time === t ? "none" : `1px solid ${C.borderStrong}`,
                    color: time === t ? "#fff" : C.muted,
                    fontWeight: time === t ? 600 : 400,
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!area || !severity}
            className="font-dm w-full pressable"
            style={{
              height: 52,
              borderRadius: 99,
              background: area && severity ? "#E07B2A" : "rgba(26,18,8,0.1)",
              color: area && severity ? "#fff" : C.muted,
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              cursor: area && severity ? "pointer" : "not-allowed",
              boxShadow: area && severity ? "0 6px 20px rgba(224,123,42,0.3)" : "none",
            }}
          >
            Submit Safety Report
          </button>
        </div>
        </div>
      </div>
    </>
  );
}

export function Community() {
  const C = useColors();
  const [activeFilter, setActiveFilter] = useState("All Posts");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [animatingHeart, setAnimatingHeart] = useState<number | null>(null);
  const [composerFocused, setComposerFocused] = useState(false);
  const [showSafetyReport, setShowSafetyReport] = useState(false);

  const handleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setAnimatingHeart(id);
    setTimeout(() => setAnimatingHeart(null), 400);
  };

  const filteredPosts =
    activeFilter === "All Posts"
      ? posts
      : posts.filter((p) => p.category === activeFilter);

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      {/* Section header */}
      <div>
        <h1 className="font-playfair mb-1" style={{ color: C.text, fontSize: 24, fontWeight: 700 }}>
          Community
        </h1>
        <p className="font-dm" style={{ color: C.muted, fontSize: 14 }}>
          Tips, discoveries & safety notes from fellow explorers.
        </p>
      </div>

      {/* Post Composer */}
      <div
        className="rounded-[20px] p-5 cursor-text"
        style={{
          background: C.card,
          border: composerFocused ? "1.5px dashed #E07B2A" : `1.5px dashed ${C.borderStrong}`,
          boxShadow: composerFocused ? "0 4px 20px rgba(224,123,42,0.1)" : "0 2px 10px rgba(26,18,8,0.04)",
          transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center rounded-full shrink-0 font-dm" style={{ width: 38, height: 38, background: "linear-gradient(135deg, #E07B2A, #C9921F)", color: "#fff", fontWeight: 700, fontSize: 15 }}>
            H
          </div>
          <textarea
            rows={2}
            placeholder="Share a local tip, hidden place, or safety note…"
            onFocus={() => setComposerFocused(true)}
            onBlur={() => setComposerFocused(false)}
            className="font-dm w-full resize-none outline-none bg-transparent"
            style={{ color: C.text, fontSize: 14, lineHeight: 1.6 }}
          />
        </div>
        {composerFocused && (
          <div className="flex justify-end mt-3">
            <button className="font-dm pressable" style={{ background: "#E07B2A", color: "#fff", fontWeight: 600, fontSize: 13, padding: "8px 20px", borderRadius: 99, border: "none", cursor: "pointer" }}>
              Post ✨
            </button>
          </div>
        )}
      </div>

      {/* Report Safety Issue button */}
      <button
        onClick={() => setShowSafetyReport(true)}
        className="font-dm pressable flex items-center gap-2"
        style={{
          background: "rgba(220,38,38,0.07)",
          border: "1px solid rgba(220,38,38,0.18)",
          borderRadius: 14,
          padding: "12px 16px",
          color: "#dc2626",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 16 }}>🚨</span>
        Report a Safety Issue
      </button>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {filterPills.map((pill) => {
          const active = activeFilter === pill;
          return (
            <button
              key={pill}
              onClick={() => setActiveFilter(pill)}
              className="font-dm whitespace-nowrap shrink-0 pressable"
              style={{
                padding: "7px 16px",
                borderRadius: 99,
                background: active ? "#E07B2A" : "transparent",
                border: active ? "none" : `1px solid ${C.borderStrong}`,
                color: active ? "#fff" : C.muted,
                fontWeight: active ? 600 : 400,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {pill}
            </button>
          );
        })}
      </div>

      {/* Post Feed */}
      <div className="flex flex-col gap-4">
        {filteredPosts.map((post) => {
          const liked = likedPosts.has(post.id);
          return (
            <div
              key={post.id}
              className="gem-card rounded-[20px] overflow-hidden"
              style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(26,18,8,0.05)" }}
            >
              {/* Post Header */}
              <div className="px-4 pt-4 pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 24, height: 24, background: post.avatarBg, fontSize: 14 }}>
                    {post.avatar}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap flex-1">
                    <span className="font-dm" style={{ color: C.text, fontWeight: 700, fontSize: 12 }}>h/{post.category.replace(/ /g, "")}</span>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>•</span>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>Posted by u/{post.name.replace(/ /g, "")}</span>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>•</span>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>{post.timestamp}</span>
                  </div>
                  {post.isVerifiedLocal && (
                    <span className="font-dm flex items-center shrink-0" style={{ background: "rgba(22,163,74,0.15)", color: "#16a34a", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.04em" }}>
                      ✓ Local
                    </span>
                  )}
                </div>
                
                {/* Title and Body */}
                <h3 className="font-playfair mb-1.5" style={{ color: C.text, fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>
                  {/* Extracting title from first sentence if no title exists, or just use full body if short */}
                  {post.body.split('.')[0]}
                </h3>
              </div>

              {/* Body */}
              <p className="font-dm px-4 pb-2" style={{ color: C.text, fontSize: 14, lineHeight: 1.65, opacity: 0.9 }}>{post.body}</p>

              {/* Image block (simulating attached media) */}
              <div className="mx-4 mb-3 mt-1 rounded-[12px] flex items-center justify-center relative overflow-hidden" style={{ height: 160, background: post.gradient }}>
                <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                <span style={{ fontSize: 52, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>{post.emoji}</span>
              </div>

              {/* Action row - Reddit style */}
              <div className="flex items-center gap-4 px-3 py-2 bg-black/5" style={{ borderTop: `1px solid ${C.border}` }}>
                {/* Voting */}
                <div className="flex items-center rounded-full" style={{ background: C.cardAlt, border: `1px solid ${C.border}` }}>
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center justify-center pressable"
                    style={{ background: "none", border: "none", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", color: liked ? "#E07B2A" : C.muted, transition: "color 0.22s" }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 700, transform: "translateY(-1px)" }}>↑</span>
                  </button>
                  <span className="font-dm" style={{ fontSize: 13, fontWeight: 700, color: liked ? "#E07B2A" : C.text, minWidth: 20, textAlign: "center" }}>
                    {liked ? post.likes + 1 : post.likes}
                  </span>
                  <button
                    className="flex items-center justify-center pressable"
                    style={{ background: "none", border: "none", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", color: C.muted }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 700, transform: "translateY(1px)" }}>↓</span>
                  </button>
                </div>

                {/* Comments */}
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full pressable" style={{ background: C.cardAlt, border: `1px solid ${C.border}`, cursor: "pointer" }}>
                  <span style={{ fontSize: 16 }}>💬</span>
                  <span className="font-dm" style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{post.comments}</span>
                </button>

                {/* Share */}
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full pressable" style={{ background: C.cardAlt, border: `1px solid ${C.border}`, cursor: "pointer" }}>
                  <span style={{ fontSize: 16 }}>↪️</span>
                  <span className="font-dm" style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Share</span>
                </button>

                {/* More options */}
                <button className="flex items-center justify-center ml-auto px-2 py-1.5 rounded-full pressable" style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}>
                  <span style={{ fontSize: 18 }}>⋮</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Report Sheet */}
      {showSafetyReport && <SafetyReportSheet onClose={() => setShowSafetyReport(false)} C={C} />}
    </div>
  );
}
