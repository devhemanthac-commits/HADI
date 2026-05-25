import { useState } from "react";
import { useColors } from "../../context/AppContext";

type EventCategory = "All" | "Festivals" | "Workshops" | "Exhibitions" | "Food";

interface HADIEvent {
  id: number;
  emoji: string;
  gradient: string;
  category: Exclude<EventCategory, "All">;
  name: string;
  venue: string;
  date: Date;
  dateLabel: string;
  capacity: number; // 0–100 (% filled)
  rsvpCount: number;
  description: string;
  featured?: boolean;
  image?: string;
}

const now = new Date("2026-06-01");

function daysUntil(d: Date): number {
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const events: HADIEvent[] = [
  {
    id: 1, emoji: "🪔", gradient: "linear-gradient(135deg, #C9921F, #E07B2A)",
    category: "Festivals",
    name: "Mysuru Heritage Light Festival",
    venue: "Mysore Palace Grounds", dateLabel: "Jun 5, 2026", date: new Date("2026-06-05"),
    capacity: 78, rsvpCount: 4240,
    description: "The Palace grounds come alive with 200,000 lamps during this annual 3-day celebration of Mysuru's royal heritage.",
    featured: true,
    image: "https://images.unsplash.com/photo-1636201702967-763d01c93c7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 2, emoji: "🎨", gradient: "linear-gradient(135deg, #7c3aed, #ec4899)",
    category: "Exhibitions",
    name: "Street Art & Kolam Exhibition",
    venue: "Jaganmohan Palace Gallery", dateLabel: "Jun 4 – 12", date: new Date("2026-06-04"),
    capacity: 42, rsvpCount: 312,
    description: "A curated exhibition of Mysuru's ephemeral street art tradition featuring works by Gowramma and 12 other local artists.",
    image: "https://images.unsplash.com/photo-1756366974772-1f3321b113e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 3, emoji: "🧵", gradient: "linear-gradient(135deg, #be185d, #9333ea)",
    category: "Exhibitions",
    name: "Royal Silk Saree Showcase",
    venue: "Sri Jayachamarajendra Art Gallery", dateLabel: "Jun 10–20, 2026", date: new Date("2026-06-10"),
    capacity: 55, rsvpCount: 890,
    description: "Rare royal-commissioned Mysore silk sarees dating back 150 years, alongside live demonstrations by fourth-generation weavers.",
    image: "https://images.unsplash.com/photo-1591633382222-4ce4caa53463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 4, emoji: "📸", gradient: "linear-gradient(135deg, #64748b, #0F3D3D)",
    category: "Workshops",
    name: "Heritage Photography Walk",
    venue: "Fort Area, Sayyaji Rao Rd", dateLabel: "Jun 7, 2026", date: new Date("2026-06-07"),
    capacity: 90, rsvpCount: 54,
    description: "A 3-hour guided photography walk through colonial Mysuru with award-winning photographer Divakar Shenoy. Limited to 60 participants.",
    image: "https://images.unsplash.com/photo-1651171683499-e503d589eeb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 5, emoji: "🍛", gradient: "linear-gradient(135deg, #f97316, #dc2626)",
    category: "Food",
    name: "Agrahara Street Food Fest",
    venue: "Agrahara Lane, Old City", dateLabel: "Jun 15–16, 2026", date: new Date("2026-06-15"),
    capacity: 35, rsvpCount: 1020,
    description: "32 of Mysuru's oldest food stalls gather for a two-day celebration of traditional Karnataka cuisine, street sweets, and filter coffee.",
    image: "https://images.unsplash.com/photo-1753123643389-6b52b0a03c6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 6, emoji: "🎭", gradient: "linear-gradient(135deg, #1d4ed8, #06b6d4)",
    category: "Workshops",
    name: "Yakshagana Puppet Workshop",
    venue: "Chamundipuram Cultural Centre", dateLabel: "Jun 22, 2026", date: new Date("2026-06-22"),
    capacity: 65, rsvpCount: 28,
    description: "A rare hands-on workshop with master craftsman Yellappa Nayanar — learn traditional puppet carving, painting, and performance techniques.",
    image: "https://images.unsplash.com/photo-1604074867235-6829038ab657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 7, emoji: "🛕", gradient: "linear-gradient(135deg, #d97706, #fbbf24)",
    category: "Festivals",
    name: "Chamundeshwari Abhisheka",
    venue: "Chamundi Hill Temple", dateLabel: "Jun 25, 2026", date: new Date("2026-06-25"),
    capacity: 95, rsvpCount: 8800,
    description: "The annual grand abhisheka ceremony at the Chamundeshwari Temple, attended by thousands of devotees. Pre-registration required for inner sanctum entry.",
    image: "https://images.unsplash.com/photo-1772028578109-17320e9ec929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

const filterTabs: EventCategory[] = ["All", "Festivals", "Workshops", "Exhibitions", "Food"];

function CountdownChip({ date }: { date: Date }) {
  const days = daysUntil(date);
  if (days > 7) return null;
  if (days <= 0) {
    return (
      <span className="font-dm" style={{ background: "#22c55e", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, flexShrink: 0 }}>
        LIVE NOW
      </span>
    );
  }
  const isUrgent = days <= 2;
  return (
    <span
      className="font-dm"
      style={{
        background: isUrgent ? "#ef4444" : "#f59e0b",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 99,
        flexShrink: 0,
      }}
    >
      {days === 1 ? "TOMORROW" : `${days}D LEFT`}
    </span>
  );
}

function CapacityBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#22c55e";
  const label = pct >= 90 ? "Almost Full" : pct >= 70 ? "Filling Fast" : "Spots Available";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-dm" style={{ fontSize: 10, color, fontWeight: 600 }}>{label}</span>
        <span className="font-dm" style={{ fontSize: 10, color, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: "rgba(26,18,8,0.08)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>
    </div>
  );
}

export function EventsScreen() {
  const C = useColors();
  const [activeFilter, setActiveFilter] = useState<EventCategory>("All");
  const [rsvped, setRsvped] = useState<Set<number>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<HADIEvent | null>(null);

  const featured = events.find((e) => e.featured);
  const filtered = events.filter((e) => activeFilter === "All" || e.category === activeFilter);

  const toggleRsvp = (id: number) => {
    setRsvped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-playfair" style={{ color: C.text, fontSize: 26, fontWeight: 700 }}>
          Events & Festivals
        </h1>
        <p className="font-dm mt-1" style={{ color: C.muted, fontSize: 14 }}>
          What's happening in Mysuru
        </p>
      </div>

      {/* Featured Event Hero */}
      {featured && (
        <div
          onClick={() => setSelectedEvent(featured)}
          className="gem-card rounded-[28px] overflow-hidden cursor-pointer relative pressable"
          style={{ background: featured.gradient, minHeight: 200 }}
        >
          {featured.image && (
            <img src={featured.image} alt={featured.name} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
          )}
          <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", left: -20, bottom: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(0,0,0,0.08)" }} />

          <div className="relative p-6 flex flex-col gap-3">
            {/* Featured badge */}
            <div className="flex items-center gap-2">
              <span className="font-dm" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.08em" }}>
                ⭐ FEATURED
              </span>
              <CountdownChip date={featured.date} />
            </div>

            <div className="flex items-start gap-4">
              <span style={{ fontSize: 52, flexShrink: 0, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))" }}>{featured.emoji}</span>
              <div>
                <h2 className="font-playfair" style={{ color: "#fff", fontSize: 20, fontWeight: 700, lineHeight: 1.25 }}>
                  {featured.name}
                </h2>
                <p className="font-dm mt-1" style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
                  📍 {featured.venue}
                </p>
                <p className="font-dm mt-0.5" style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
                  📅 {featured.dateLabel}
                </p>
              </div>
            </div>

            <p className="font-dm" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.6 }}>
              {featured.description}
            </p>

            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <div style={{ height: 4, flex: 1, background: "rgba(255,255,255,0.2)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${featured.capacity}%`, height: "100%", background: featured.capacity >= 70 ? "#fbbf24" : "#fff", borderRadius: 99 }} />
                </div>
                <span className="font-dm" style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                  {featured.capacity}% full · {featured.rsvpCount.toLocaleString()} going
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleRsvp(featured.id); }}
                className="font-dm w-full pressable"
                style={{
                  height: 46,
                  borderRadius: 99,
                  background: rsvped.has(featured.id) ? "rgba(255,255,255,0.2)" : "#fff",
                  color: rsvped.has(featured.id) ? "#fff" : "#C9921F",
                  fontWeight: 700,
                  fontSize: 15,
                  border: rsvped.has(featured.id) ? "1.5px solid rgba(255,255,255,0.3)" : "none",
                  cursor: "pointer",
                  backdropFilter: rsvped.has(featured.id) ? "blur(8px)" : "none",
                }}
              >
                {rsvped.has(featured.id) ? "✅ You're Going!" : "RSVP Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {filterTabs.map((tab) => {
          const active = activeFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="font-dm shrink-0 pressable"
              style={{
                padding: "8px 16px",
                borderRadius: 99,
                background: active ? "#0F3D3D" : "transparent",
                border: active ? "none" : `1px solid ${C.borderStrong}`,
                color: active ? "#E07B2A" : C.muted,
                fontWeight: active ? 700 : 400,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {tab === "All" ? "🗓 All" : tab === "Festivals" ? "🪔 Festivals" : tab === "Workshops" ? "🛠 Workshops" : tab === "Exhibitions" ? "🖼 Exhibitions" : "🍛 Food"}
            </button>
          );
        })}
      </div>

      {/* Event Cards Grid */}
      <div className="flex flex-col gap-4">
        {filtered.filter((e) => !e.featured).map((ev) => {
          const isRsvped = rsvped.has(ev.id);
          return (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className="gem-card rounded-[24px] overflow-hidden pressable cursor-pointer"
              style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(26,18,8,0.05)" }}
            >
              {/* Top gradient block */}
              <div className="flex items-center gap-4 p-4" style={{ background: ev.gradient, minHeight: 80, position: "relative", overflow: "hidden" }}>
                {ev.image && (
                  <img src={ev.image} alt={ev.name} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
                )}
                <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                <div className="flex items-center justify-center rounded-[16px] shrink-0" style={{ width: 56, height: 56, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", fontSize: 28 }}>
                  {ev.emoji}
                </div>
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-dm" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
                      {ev.category.toUpperCase()}
                    </span>
                    <CountdownChip date={ev.date} />
                  </div>
                  <h3 className="font-playfair" style={{ color: "#fff", fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>
                    {ev.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-dm flex items-center gap-1" style={{ color: C.muted, fontSize: 12 }}>
                    📅 {ev.dateLabel}
                  </span>
                  <span className="font-dm flex items-center gap-1" style={{ color: C.muted, fontSize: 12 }}>
                    📍 {ev.venue}
                  </span>
                </div>

                <p className="font-dm" style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
                  {ev.description}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>
                    👥 {ev.rsvpCount.toLocaleString()} going
                  </span>
                </div>

                <CapacityBar pct={ev.capacity} />

                <button
                  onClick={(e) => { e.stopPropagation(); toggleRsvp(ev.id); }}
                  className="font-dm w-full pressable"
                  style={{
                    height: 44,
                    borderRadius: 99,
                    background: isRsvped ? "rgba(22,163,74,0.1)" : "#0F3D3D",
                    color: isRsvped ? "#16a34a" : "#E07B2A",
                    fontWeight: 700,
                    fontSize: 14,
                    border: isRsvped ? "1.5px solid rgba(22,163,74,0.3)" : "none",
                    cursor: "pointer",
                    boxShadow: isRsvped ? "none" : "0 4px 14px rgba(15,61,61,0.22)",
                  }}
                >
                  {isRsvped ? "✅ Going — Cancel RSVP" : "RSVP for Free"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ height: 16 }} />

      {/* Event Details Modal - Centered Dialog */}
      {selectedEvent && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease-out" }} onClick={() => setSelectedEvent(null)}>
            <div
              className="rounded-[24px] overflow-hidden flex flex-col w-full"
              style={{
                background: C.bg,
                maxHeight: "90vh",
                maxWidth: 680,
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                animation: "modalSlideIn 0.3s cubic-bezier(0.22,1,0.36,1)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedEvent.image && (
                <div className="relative w-full" style={{ height: 240, background: selectedEvent.gradient }}>
                  <img src={selectedEvent.image} alt={selectedEvent.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)" }} />
                  <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 z-10 flex items-center justify-center pressable" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>✕</button>
                  <div className="absolute bottom-4 left-5 right-5">
                    <span className="font-dm inline-block mb-2" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 99 }}>{selectedEvent.category.toUpperCase()}</span>
                    <h2 className="font-playfair" style={{ color: "#fff", fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>{selectedEvent.name}</h2>
                  </div>
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {!selectedEvent.image && (
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-dm inline-block mb-2" style={{ background: "rgba(224,123,42,0.1)", color: "#E07B2A", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 99 }}>{selectedEvent.category.toUpperCase()}</span>
                      <h2 className="font-playfair" style={{ color: C.text, fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>{selectedEvent.name}</h2>
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="pressable" style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 24 }}>✕</button>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full" style={{ width: 40, height: 40, background: "rgba(224,123,42,0.1)", color: "#E07B2A", fontSize: 18 }}>📅</div>
                    <div>
                      <p className="font-dm" style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{selectedEvent.dateLabel}</p>
                      <p className="font-dm" style={{ color: C.muted, fontSize: 12 }}>Add to calendar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full" style={{ width: 40, height: 40, background: "rgba(224,123,42,0.1)", color: "#E07B2A", fontSize: 18 }}>📍</div>
                    <div>
                      <p className="font-dm" style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{selectedEvent.venue}</p>
                      <p className="font-dm" style={{ color: C.muted, fontSize: 12 }}>Open map</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-playfair mb-2" style={{ color: C.text, fontSize: 18, fontWeight: 700 }}>About Event</h3>
                  <p className="font-dm" style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{selectedEvent.description}</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-dm" style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>Capacity ({selectedEvent.capacity}% full)</span>
                      <span className="font-dm" style={{ color: C.muted, fontSize: 13 }}>{selectedEvent.rsvpCount.toLocaleString()} going</span>
                    </div>
                    <CapacityBar pct={selectedEvent.capacity} />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleRsvp(selectedEvent.id); }}
                    className="font-dm w-full pressable"
                    style={{
                      height: 52,
                      borderRadius: 99,
                      background: rsvped.has(selectedEvent.id) ? "rgba(22,163,74,0.1)" : "#0F3D3D",
                      color: rsvped.has(selectedEvent.id) ? "#16a34a" : "#E07B2A",
                      fontWeight: 700,
                      fontSize: 16,
                      border: rsvped.has(selectedEvent.id) ? "1.5px solid rgba(22,163,74,0.3)" : "none",
                      cursor: "pointer",
                      boxShadow: rsvped.has(selectedEvent.id) ? "none" : "0 4px 14px rgba(15,61,61,0.22)",
                    }}
                  >
                    {rsvped.has(selectedEvent.id) ? "✅ Going — Cancel RSVP" : "RSVP for Free"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
