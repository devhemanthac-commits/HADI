import { useState } from "react";
import { useColors, useApp } from "../../context/AppContext";

interface Buddy {
  id: number;
  avatar: string;
  avatarBg: string;
  name: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  languages: string[];
  expertise: string[];
  availability: "Available" | "Busy" | "Today";
  bio: string;
  walks: number;
  badge?: string;
}

const buddies: Buddy[] = [
  {
    id: 1, avatar: "👩‍🏫", avatarBg: "linear-gradient(135deg, #E07B2A, #C9921F)",
    name: "Priya Shankar", verified: true, rating: 4.9, reviewCount: 128,
    languages: ["Kannada", "English", "Tamil"], expertise: ["Heritage", "Food", "Crafts"],
    availability: "Available", walks: 312,
    bio: "10 years guiding heritage walks across Mysuru. I know the story behind every stone.",
    badge: "Top Guide",
  },
  {
    id: 2, avatar: "🧔", avatarBg: "linear-gradient(135deg, #0F3D3D, #059669)",
    name: "Rajan Nair", verified: true, rating: 4.8, reviewCount: 96,
    languages: ["English", "Malayalam", "Kannada"], expertise: ["Architecture", "Temples", "History"],
    availability: "Today", walks: 204,
    bio: "Retired architecture professor. I'll show you the geometry in Mysuru's most sacred spaces.",
  },
  {
    id: 3, avatar: "👧", avatarBg: "linear-gradient(135deg, #7c3aed, #ec4899)",
    name: "Kavya R.", verified: false, rating: 4.7, reviewCount: 42,
    languages: ["Kannada", "Hindi", "English"], expertise: ["Street Art", "Markets", "Food"],
    availability: "Available", walks: 67,
    bio: "Born and raised in Agrahara Lane. I know every secret corner of the old city.",
  },
  {
    id: 4, avatar: "👴", avatarBg: "linear-gradient(135deg, #92400e, #d97706)",
    name: "Krishnaswamy K.", verified: true, rating: 4.9, reviewCount: 215,
    languages: ["Kannada", "English"], expertise: ["Food", "Culture", "Silk"],
    availability: "Available", walks: 500,
    bio: "Third-generation Mysurean. My father knew artisans the city has long forgotten.",
    badge: "Legend",
  },
  {
    id: 5, avatar: "👩", avatarBg: "linear-gradient(135deg, #1d4ed8, #06b6d4)",
    name: "Meera Shetty", verified: true, rating: 4.6, reviewCount: 78,
    languages: ["English", "Tulu", "Kannada"], expertise: ["Nature", "Birds", "Photography"],
    availability: "Busy", walks: 141,
    bio: "Wildlife photographer and birding guide. The lake bund at sunrise is my home.",
  },
  {
    id: 6, avatar: "🧑", avatarBg: "linear-gradient(135deg, #064e3b, #10b981)",
    name: "Vinod Pai", verified: false, rating: 4.5, reviewCount: 29,
    languages: ["Konkani", "Kannada", "English"], expertise: ["Heritage", "Streets", "Photography"],
    availability: "Today", walks: 44,
    bio: "I document Mysuru's fading architecture before it disappears. Join the mission.",
  },
];

const langOptions = ["All", "Kannada", "English", "Tamil", "Hindi", "Malayalam"];
const expertiseOptions = ["All", "Heritage", "Food", "Temples", "Crafts", "Nature", "Streets", "Art"];
const availOptions = ["All", "Available", "Today", "Busy"];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="font-dm flex items-center gap-0.5" style={{ fontSize: 12, color: "#C9921F" }}>
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
      <span style={{ color: "#7A6A55", marginLeft: 3 }}>{rating}</span>
    </span>
  );
}

export function BuddyScreen() {
  const C = useColors();
  const { addToast } = useApp();

  const [langFilter, setLangFilter] = useState("All");
  const [expertiseFilter, setExpertiseFilter] = useState("All");
  const [availFilter, setAvailFilter] = useState("All");

  // Request flow state
  const [requestBuddy, setRequestBuddy] = useState<Buddy | null>(null);
  const [step, setStep] = useState(1);
  const [reqDate, setReqDate] = useState("2026-04-30");
  const [reqTime, setReqTime] = useState("09:00");
  const [reqPlace, setReqPlace] = useState("");
  const [reqNote, setReqNote] = useState("");

  const filtered = buddies.filter((b) => {
    if (langFilter !== "All" && !b.languages.includes(langFilter)) return false;
    if (expertiseFilter !== "All" && !b.expertise.includes(expertiseFilter)) return false;
    if (availFilter !== "All" && b.availability !== availFilter) return false;
    return true;
  });

  const availColor = (a: string) =>
    a === "Available" ? "#22c55e" : a === "Today" ? "#E07B2A" : "#9ca3af";

  const sendRequest = () => {
    const buddyName = requestBuddy?.name ?? "your buddy";
    setRequestBuddy(null);
    setStep(1);
    addToast("success", `🤝 Request sent to ${buddyName}! They'll confirm within 2 hours.`);
  };

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-playfair" style={{ color: C.text, fontSize: 26, fontWeight: 700 }}>
          Find a Guide Buddy
        </h1>
        <p className="font-dm mt-1" style={{ color: C.muted, fontSize: 14 }}>
          Connect with verified local guides for a personal Mysuru experience
        </p>
      </div>

      {/* Filter Row */}
      <div className="rounded-[20px] p-4 flex flex-col gap-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        {/* Language */}
        <div>
          <p className="font-dm mb-2" style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Language</p>
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {langOptions.map((l) => (
              <button key={l} onClick={() => setLangFilter(l)} className="font-dm shrink-0 pressable"
                style={{ padding: "6px 12px", borderRadius: 99, background: langFilter === l ? "#0F3D3D" : "transparent", border: `1px solid ${C.borderStrong}`, color: langFilter === l ? "#E07B2A" : C.muted, fontWeight: langFilter === l ? 700 : 400, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
                {l}
              </button>
            ))}
          </div>
        </div>
        {/* Expertise */}
        <div>
          <p className="font-dm mb-2" style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Expertise</p>
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {expertiseOptions.map((e) => (
              <button key={e} onClick={() => setExpertiseFilter(e)} className="font-dm shrink-0 pressable"
                style={{ padding: "6px 12px", borderRadius: 99, background: expertiseFilter === e ? "#E07B2A" : "transparent", border: `1px solid ${C.borderStrong}`, color: expertiseFilter === e ? "#fff" : C.muted, fontWeight: expertiseFilter === e ? 700 : 400, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
                {e}
              </button>
            ))}
          </div>
        </div>
        {/* Availability */}
        <div>
          <p className="font-dm mb-2" style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Availability</p>
          <div className="flex gap-2">
            {availOptions.map((a) => (
              <button key={a} onClick={() => setAvailFilter(a)} className="font-dm shrink-0 pressable"
                style={{ padding: "6px 12px", borderRadius: 99, background: availFilter === a ? availColor(a === "All" ? "Available" : a) : "transparent", border: `1px solid ${C.borderStrong}`, color: availFilter === a ? "#fff" : C.muted, fontWeight: availFilter === a ? 700 : 400, fontSize: 12, cursor: "pointer" }}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="font-dm -mb-2" style={{ color: C.muted, fontSize: 13 }}>
        {filtered.length} guide{filtered.length !== 1 ? "s" : ""} available
      </p>

      {/* Buddy Cards */}
      <div className="flex flex-col gap-4">
        {filtered.map((buddy) => (
          <div key={buddy.id} className="gem-card rounded-[24px] p-5 flex flex-col gap-4" style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(26,18,8,0.04)" }}>
            {/* Top row */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="flex items-center justify-center rounded-full" style={{ width: 58, height: 58, background: buddy.avatarBg, fontSize: 26, border: `2px solid ${C.border}` }}>
                  {buddy.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 rounded-full" style={{ width: 14, height: 14, background: availColor(buddy.availability), border: "2px solid #fff" }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-playfair truncate" style={{ color: C.text, fontWeight: 700, fontSize: 18 }}>{buddy.name}</span>
                  {buddy.verified && (
                    <span className="font-dm shrink-0 flex items-center justify-center" style={{ background: "#3b82f6", color: "#fff", width: 14, height: 14, borderRadius: "50%", fontSize: 8 }}>✓</span>
                  )}
                  {buddy.badge && (
                    <span className="font-dm shrink-0" style={{ background: "rgba(201,146,31,0.12)", color: "#C9921F", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(201,146,31,0.2)" }}>⭐ {buddy.badge}</span>
                  )}
                </div>
                <Stars rating={buddy.rating} />
                <p className="font-dm mt-1" style={{ color: C.muted, fontSize: 13, fontWeight: 500 }}>{buddy.reviewCount} reviews • {buddy.walks} walks led</p>
              </div>

              <div className="text-right shrink-0">
                <div className="font-dm rounded-[8px] px-2 py-1" style={{ background: availColor(buddy.availability) + "18", color: availColor(buddy.availability), fontSize: 11, fontWeight: 700 }}>
                  {buddy.availability}
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="font-dm" style={{ color: C.text, fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>{buddy.bio}</p>

            {/* Languages */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-dm shrink-0" style={{ color: C.muted, fontSize: 13, marginRight: 4 }}>🗣️ Speaks</span>
              {buddy.languages.map((l) => (
                <span key={l} className="font-dm" style={{ background: C.cardAlt, color: C.text, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 99, border: `1px solid ${C.border}` }}>{l}</span>
              ))}
            </div>

            {/* Expertise pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-dm shrink-0" style={{ color: C.muted, fontSize: 13, marginRight: 4 }}>🎯 Knows</span>
              {buddy.expertise.map((e) => (
                <span key={e} className="font-dm" style={{ background: "rgba(224,123,42,0.08)", border: "1px solid rgba(224,123,42,0.2)", color: "#E07B2A", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 99 }}>{e}</span>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => { setRequestBuddy(buddy); setStep(1); }}
              disabled={buddy.availability === "Busy"}
              className="font-dm w-full pressable"
              style={{
                height: 48,
                borderRadius: 99,
                background: buddy.availability === "Busy" ? C.cardAlt : "#E07B2A",
                color: buddy.availability === "Busy" ? C.muted : "#fff",
                fontWeight: 700,
                fontSize: 15,
                border: buddy.availability === "Busy" ? `1px solid ${C.borderStrong}` : "none",
                cursor: buddy.availability === "Busy" ? "not-allowed" : "pointer",
                boxShadow: buddy.availability === "Busy" ? "none" : "0 4px 14px rgba(224,123,42,0.3)",
                transition: "all 0.22s",
              }}
            >
              {buddy.availability === "Busy" ? "Currently Unavailable" : "🤝 Request a Walk"}
            </button>
          </div>
        ))}
      </div>

      {/* ── Request Modal ── */}
      {requestBuddy && (
        <>
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease-out" }} onClick={() => setRequestBuddy(null)}>
            <div
              className="rounded-[24px] w-full flex flex-col gap-5 p-6"
              style={{ background: C.bg, maxHeight: "90vh", maxWidth: 600, overflowY: "auto", animation: "modalSlideIn 0.3s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
              onClick={(e) => e.stopPropagation()}
            >

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: requestBuddy.avatarBg, fontSize: 22 }}>
                {requestBuddy.avatar}
              </div>
              <div>
                <p className="font-playfair" style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>Request Walk with</p>
                <p className="font-playfair" style={{ color: "#E07B2A", fontWeight: 700, fontSize: 16 }}>{requestBuddy.name}</p>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= s ? "#E07B2A" : C.cardAlt, border: `1.5px solid ${step >= s ? "#E07B2A" : C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="font-dm" style={{ color: step >= s ? "#fff" : C.muted, fontSize: 12, fontWeight: 700 }}>{s}</span>
                  </div>
                  {s < 3 && <div style={{ flex: 1, height: 2, background: step > s ? "#E07B2A" : C.border, minWidth: 32 }} />}
                </div>
              ))}
              <span className="font-dm ml-2" style={{ color: C.muted, fontSize: 12 }}>
                {step === 1 ? "Date & Time" : step === 2 ? "Meeting Point" : "Add a Note"}
              </span>
            </div>

            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-dm block mb-1.5" style={{ color: C.muted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Date</label>
                  <input type="date" value={reqDate} min="2026-04-27" onChange={(e) => setReqDate(e.target.value)}
                    className="font-dm w-full rounded-[14px] px-4 py-3 outline-none"
                    style={{ background: C.card, border: `1.5px solid ${C.border}`, color: C.text, fontSize: 14 }} />
                </div>
                <div>
                  <label className="font-dm block mb-1.5" style={{ color: C.muted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Time</label>
                  <input type="time" value={reqTime} onChange={(e) => setReqTime(e.target.value)}
                    className="font-dm w-full rounded-[14px] px-4 py-3 outline-none"
                    style={{ background: C.card, border: `1.5px solid ${C.border}`, color: C.text, fontSize: 14 }} />
                </div>
              </div>
            )}

            {/* Step 2: Meeting Point */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <p className="font-dm" style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
                  Where should {requestBuddy.name} meet you?
                </p>
                {["Mysore Palace Main Gate", "Gandhi Square Clock Tower", "Devaraja Market Entrance", "Chamundi Hill Bus Stand", "Kukkarahalli Lake North Gate"].map((place) => (
                  <button key={place} onClick={() => setReqPlace(place)}
                    className="font-dm text-left pressable rounded-[14px] px-4 py-3"
                    style={{ background: reqPlace === place ? "rgba(224,123,42,0.1)" : C.card, border: `1.5px solid ${reqPlace === place ? "#E07B2A" : C.border}`, color: reqPlace === place ? "#E07B2A" : C.text, fontWeight: reqPlace === place ? 600 : 400, fontSize: 14, cursor: "pointer" }}>
                    📍 {place}
                  </button>
                ))}
                <input
                  placeholder="Or type a custom location…"
                  value={!["Mysore Palace Main Gate","Gandhi Square Clock Tower","Devaraja Market Entrance","Chamundi Hill Bus Stand","Kukkarahalli Lake North Gate"].includes(reqPlace) ? reqPlace : ""}
                  onChange={(e) => setReqPlace(e.target.value)}
                  className="font-dm w-full rounded-[14px] px-4 py-3 outline-none"
                  style={{ background: C.card, border: `1.5px solid ${C.border}`, color: C.text, fontSize: 14 }}
                />
              </div>
            )}

            {/* Step 3: Note */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="rounded-[16px] p-4" style={{ background: "rgba(15,61,61,0.06)", border: "1px solid rgba(15,61,61,0.1)" }}>
                  <p className="font-dm" style={{ color: "#0F3D3D", fontSize: 13 }}>
                    📅 {reqDate} at {reqTime}
                  </p>
                  <p className="font-dm mt-1" style={{ color: "#0F3D3D", fontSize: 13 }}>
                    📍 {reqPlace || "Meeting point not set"}
                  </p>
                </div>
                <div>
                  <label className="font-dm block mb-1.5" style={{ color: C.muted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Optional Note</label>
                  <textarea
                    value={reqNote}
                    onChange={(e) => setReqNote(e.target.value)}
                    placeholder={`Tell ${requestBuddy.name} what you're interested in exploring…`}
                    rows={4}
                    className="font-dm w-full rounded-[14px] px-4 py-3 outline-none resize-none"
                    style={{ background: C.card, border: `1.5px solid ${C.border}`, color: C.text, fontSize: 14, lineHeight: 1.6 }}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} className="font-dm pressable"
                  style={{ flex: 1, height: 48, borderRadius: 99, background: "transparent", border: `1.5px solid ${C.border}`, color: C.text, fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
                  ← Back
                </button>
              )}
              <button
                onClick={() => { if (step < 3) setStep(s => s + 1); else sendRequest(); }}
                className="font-dm pressable"
                style={{ flex: 2, height: 48, borderRadius: 99, background: "#E07B2A", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(224,123,42,0.3)" }}
              >
                {step < 3 ? "Next →" : "Send Request 🤝"}
              </button>
            </div>
            </div>
          </div>
        </>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}
