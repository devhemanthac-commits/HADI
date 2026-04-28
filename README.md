<div align="center">

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

## What is HADI?

Most tourists and even locals walk past the same streets every day without realising what's hidden around the corner — a 200-year-old sculptor's workshop, a tiny tea stall with legendary filter coffee, a rooftop with a forgotten view of the Chamundi Hills.

**HADI turns Mysuru into a living game.**

Check in at hidden gems using GPS or QR codes. Earn XP. Unlock zones. Build streaks. Compete on weekly leaderboards. Report hazards to keep your community safe. Discover the city the way a local does.

---

## Features

### 🗺️ Gem Discovery
- **10 curated hidden gems** across Mysuru — heritage sites, artisan workshops, street food, temples, and nature spots
- **GPS check-in** with Haversine distance validation (must be within 100m)
- **QR code check-in** as an alternative method
- **Audio walk transcripts** — each gem has a narrated story from a local artisan or guide

### 🌸 Bloom System
Every gem has a **Bloom meter** (0–100) that rises when visited and decays when left alone. This creates natural scarcity and guides explorers to less-visited spots.

| Status | Range | Points | Check-in |
|---|---|---|---|
| 🟢 Active | 0–40 | Full | Allowed |
| 🟡 Fading | 41–70 | 0.75× | Allowed |
| 🔴 Critical | 71–90 | 0.5× | Allowed |
| ⚫ Dormant | 91–100 | Blocked | Blocked |

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

## Tech Stack

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

## Architecture

```
src/
├── main.tsx
└── app/
    ├── App.tsx                    # Auth gate + provider hierarchy
    ├── routes.tsx                 # Lazy-loaded screen routes
    ├── context/
    │   ├── AppContext.tsx         # UI state, geolocation, toasts, saved gems
    │   └── AuthContext.tsx        # Firebase auth
    ├── store/
    │   └── GameStore.tsx          # Central state — wires all 14 engines
    ├── engine/                    # Pure TypeScript game logic (no React)
    │   ├── types.ts               # All shared interfaces
    │   ├── points.ts              # XP, levels, badges, streaks
    │   ├── bloom.ts               # Gem scarcity system
    │   ├── checkin.ts             # GPS validation + anti-spoof
    │   ├── hexmap.ts              # Zone system + multipliers
    │   ├── leaderboard.ts         # Rankings + tie-breaking
    │   ├── community.ts           # Posts, voting, karma
    │   ├── safety.ts              # Hazard report lifecycle
    │   ├── buddy.ts               # Matching algorithm + sessions
    │   ├── events.ts              # RSVP + countdown
    │   ├── submission.ts          # Gem proposal workflow
    │   ├── notifications.ts       # Notification factory
    │   ├── consistency.ts         # Background cleanup jobs
    │   └── cache.ts               # TTL cache + localStorage
    ├── lib/
    │   ├── firebase.ts            # Firebase init
    │   └── firestore.ts           # CRUD + real-time subscriptions
    ├── data/
    │   ├── gems.ts                # 10 gem definitions
    │   └── places.ts              # 40+ attraction records
    └── components/
        ├── Layout.tsx
        ├── BottomNav.tsx
        ├── Sidebar.tsx
        ├── ui/                    # shadcn/ui component library
        └── screens/
            ├── Home.tsx
            ├── Profile.tsx
            ├── MapScreen.tsx
            ├── PlacesScreen.tsx
            ├── GemDetail.tsx
            ├── GemSubmission.tsx
            ├── Community.tsx
            ├── EventsScreen.tsx
            ├── BuddyScreen.tsx
            ├── Leaderboard.tsx
            ├── HexMap.tsx
            └── QRScan.tsx
```

### Provider Hierarchy

```
<AuthProvider>          ← Firebase auth state
  <AppProvider>         ← Dark mode, geolocation, toasts, saved gems
    <GameProvider>      ← All 14 game engines + Firestore sync
      <Router>
        <Layout>
          <Screen />
        </Layout>
      </Router>
    </GameProvider>
  </AppProvider>
</AuthProvider>
```

### Data Persistence — Dual Write

Every user action writes to **two places simultaneously:**

| Store | Data | Purpose |
|---|---|---|
| `localStorage` | Stats, visited gems, badges, notifications | Instant, offline-capable |
| Firestore | Everything above + checkins, community, leaderboard | Persistent, cross-device |

On startup, Firestore is read and merged with safe defaults — no field is ever `undefined`.

---

## Check-in Pipeline

When a user taps "Check In", this validation chain runs in order:

```
1. GPS accuracy check        → reject if accuracy > 30m
2. Velocity spoof detection  → reject if moved 500m in < 90s
3. Duplicate prevention      → reject if same gem checked in < 2h ago
4. Rate limiting             → reject if > 10 check-ins in last hour
5. Haversine distance        → reject if > 100m from gem
6. Bloom gate                → reject if gem is Dormant
7. Points calculation        → base × zone × proximity × streak × bloom × buddy
```

> QR code check-ins bypass steps 1, 2, and 5 — all other rules still apply.

---

## Getting Started

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

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Get these from: **Firebase Console → Project Settings → Your apps → Web app → SDK setup**

### 4. Enable Firebase services

In the Firebase Console:
- **Authentication** → Sign-in method → Enable **Email/Password** and **Google**
- **Firestore Database** → Create database in production mode

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 6. Build for production

```bash
npm run build
```

### 7. Deploy

```bash
firebase deploy --only hosting
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firestore project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

> **Never commit your `.env` file.** It is listed in `.gitignore`. Use `.env.example` as the reference template.

---

## Game Mechanics — Key Formulas

### Bloom Decay
```
decayPer6h = DECAY_RATE[rarity] / 4
periods    = floor(hoursSinceLastVisit / 6)
capacity   = max(0, stored − decayPer6h × periods)
```

### Haversine Distance
```
R    = 6,371,000 m
dLat = toRad(gem.lat − user.lat)
dLng = toRad(gem.lng − user.lng)
x    = sin²(dLat/2) + cos(user.lat) × cos(gem.lat) × sin²(dLng/2)
dist = R × 2 × atan2(√x, √(1−x))
```

### Buddy Matching Score
```
score = (rating × 20)
      + (totalWalks × 0.1)
      + (sharedLanguages × 10)
      + (expertiseMatch × 15)
      + (verified ? 25 : 0)
      + (isPreferred ? 30 : 0)
```

---

## Firestore Collections

```
users/{uid}                    Profile, stats, badges, visited/saved gems
users/{uid}/checkins/{id}      Individual check-in records
users/{uid}/activity/{id}      Activity log

community_posts/{id}           Community feed (real-time)
safety_reports/{id}            Hazard reports (real-time)
events/{id}                    City events (real-time)
gem_submissions/{id}           Gem proposals (real-time)
leaderboard/{uid}              Weekly rankings (real-time)
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit: `git commit -m "feat: describe your change"`
5. Push: `git push origin feature/your-feature-name`
6. Open a Pull Request

Engine modules in `src/app/engine/` are pure TypeScript with no React dependencies — great candidates for unit tests.

---

## Documentation

See [`HADI_TECHNICAL_GUIDE.md`](./HADI_TECHNICAL_GUIDE.md) for a full breakdown of every engine, algorithm, screen, and data flow.

---

## License

MIT © 2025 Hemanth A C

---

<div align="center">

Built with ❤️ for Mysuru

**[Live App](https://hadi-vvce.web.app)**

*Explore. Discover. Earn. Repeat.*

</div>
