<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=40&pause=1000&color=E07B2A&center=true&vCenter=true&width=600&lines=Welcome+to+HADI;Mysuru's+Gamified+Exploration;Discover+Hidden+Gems;Earn+Points+and+Badges" alt="Typing SVG" />

<br/>

<img src="https://img.shields.io/badge/HADI-Hidden%20Adventures%20%26%20Discovery%20Interface-E07B2A?style=for-the-badge&labelColor=0F3D3D" alt="HADI" />

<br /><br />

**HADI** is a gamified urban exploration app for **Mysuru, India** — turning the city's hidden gems into a real-world adventure.
Earn XP, unlock zones, climb leaderboards, and rediscover your city one hidden gem at a time.

<br />

[![Live Demo](https://img.shields.io/badge/Live%20Demo-hadi--vvce.web.app-E07B2A?style=for-the-badge&logo=firebase&logoColor=white)](https://hadi-vvce.web.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)

<br />

<img src="https://img.shields.io/badge/Platform-Mobile%20%2B%20Desktop-0F3D3D?style=flat-square" />
<img src="https://img.shields.io/badge/City-Mysuru%2C%20India-E07B2A?style=flat-square" />
<img src="https://img.shields.io/badge/Engines-14%20Game%20Modules-22c55e?style=flat-square" />

</div>

---

## 🌟 What is HADI?

Most tourists and even locals walk past the same streets every day without realising what's hidden around the corner — a 200-year-old sculptor's workshop, a tiny tea stall with legendary filter coffee, a rooftop with a forgotten view of the Chamundi Hills.

**HADI turns Mysuru into a living game.**

Check in at hidden gems using GPS or QR codes. Earn XP. Unlock zones. Build streaks. Compete on weekly leaderboards. Report hazards to keep your community safe. Discover the city the way a local does.

---

## ✨ Features

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Map.png" alt="Map" width="45" /> 
</div>

### 🗺️ Gem Discovery
- **10 curated hidden gems** across Mysuru — heritage sites, artisan workshops, street food, temples, and nature spots
- **GPS check-in** with Haversine distance validation (must be within 100m)
- **QR code check-in** as an alternative method
- **Audio walk transcripts** — each gem has a narrated story from a local artisan or guide

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Glowing%20Star.png" alt="Star" width="45" />
</div>

### ⚡ Points & Levels
Points are calculated with **6 stacked multipliers:**
```
XP = floor(base × zone × proximity × streak × bloom × buddy)
```

**5-tier progression:**

| Level | Name | XP Required |
|---|---|---|
| 🌱 | Wanderer | 0 |
| 🔭 | Explorer | 500 |
| 🗺️ | Pathfinder | 1,500 |
| ⚡ | Sage | 4,000 |
| 🌟 | Legend | 10,000 |

### 🏙️ Zone System
Mysuru is divided into **5 DIGIPIN-coded zones**, each with unique multipliers and unlock requirements:

| Zone | Multiplier | Unlock |
|---|---|---|
| Heritage Core | 3.0× | Open |
| Silk District | 2.5× | Level 2 |
| Artisan Quarter | 2.0× | 3 gems in Heritage Core |
| Fort Zone | 2.0× | Zone Master badge |
| Street Food Belt | 1.5× | Level 1 |

Complete all gems in a zone → earn the **Zone Master badge** + **500 bonus XP**.

### 🏆 Weekly Leaderboard
Real-time rankings reset every Monday with a **5-tier tie-breaking system:**
1. Weekly score
2. Unique gems this week
3. Streak length
4. First check-in of the week (timestamp)
5. All-time XP

Top-10 players earn a **+50 XP bonus** before reset. All-time XP is never reset.

### 🤝 Buddy System
Explore with a partner for bonus rewards:
- **Explorer earns +50%** points during a session
- **Buddy earns 10%** of explorer's points (capped at 500 pts/session)
- Buddies are matched using a scoring algorithm: rating, shared languages, expertise overlap, verification status
- Sessions last up to 8 hours

### 🛡️ Safety Reporting
Local Mode users can report hazards:
- 7 report types with time-appropriate expiry (4h → 72h)
- **3 community confirmations** → report verified (+40 XP to reporter)
- **5 dismissals** → auto-dismissed if unconfirmed
- Rate limited: tourists 1/day, Local Mode users 5/day

### 🌿 Community Feed
- Post hidden finds, safety notes, and local tips
- Upvote / downvote with karma system
- Posts auto-hidden at score < −5
- **Local Expert** status unlocked at 25+ high-score posts over 60 days

### 🗓️ Events
- RSVP to community events with waitlist support
- Point rewards: join (+5), check in (+75–200), review (+25)
- Creator bonus: +150 XP if ≥5 attendees show up

### 📍 Interactive Map
- Leaflet.js map of Mysuru with gem markers, place categories, and hazard overlays
- Filter by: temples, food, nature, heritage
- Tap any marker for a detail panel

### 🌙 Dark Mode + Local Mode
- Full dark/light theme with persisted preference
- **Local Mode** (unlocked at Level 2 + community activity): hazard reporting, gem submissions, event creation, Local Expert eligibility

---

## 🛠️ Tech Stack

<div align="center">
  <img src="https://skillicons.dev/icons?i=react,ts,tailwind,vite,firebase,nodejs" alt="Tech Stack" />
</div>

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Router | React Router v7 (lazy-loaded routes) |
| Styling | Tailwind CSS + dynamic inline theming |
| Components | shadcn/ui (Radix UI primitives) |
| Map | Leaflet.js + react-leaflet |
| Auth | Firebase Authentication (Google + Email) |
| Database | Cloud Firestore (real-time subscriptions) |
| Build | Vite 6 |
| Deployment | Firebase Hosting |
| State | React Context API (no Redux) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore and Authentication enabled

### 1. Clone the repository

```bash
git clone https://github.com/devhemanthac-commits/HADI.git
cd HADI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Copy the example environment file and fill in your Firebase values:

```bash
cp .env.example .env
```

Get these from: **Firebase Console → Project Settings → Your apps → Web app → SDK setup**

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit: `git commit -m "feat: describe your change"`
5. Push: `git push origin feature/your-feature-name`
6. Open a Pull Request

---

## 📄 Documentation

See [`HADI_TECHNICAL_GUIDE.md`](./HADI_TECHNICAL_GUIDE.md) for a full breakdown of every engine, algorithm, screen, and data flow.

---

## 📝 License

MIT © 2025 Hemanth A C

---

<div align="center">

Built with ❤️ for Mysuru

**[Live App](https://hadi-vvce.web.app)**

*Explore. Discover. Earn. Repeat.*

</div>
