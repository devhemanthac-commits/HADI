# HADI — Full Technical Guide

## What Is HADI?

**HADI** (Hidden Adventures & Discovery Interface) is a **gamified urban exploration app** for the city of **Mysuru, India**. Users earn XP points by physically visiting hidden "gems" — lesser-known heritage sites, street food spots, artisan workshops, temples, and cultural landmarks. The app rewards real-world movement with a progression system, community features, safety reporting, event RSVPs, and a weekly leaderboard.

Live URL: **https://hadi-vvce.web.app**

---

## File Structure

```
src/
├── main.tsx                          # React root entry
└── app/
    ├── App.tsx                       # Auth gate + provider hierarchy
    ├── routes.tsx                    # React Router v7 lazy routes
    │
    ├── context/
    │   ├── AppContext.tsx            # UI state (darkMode, toasts, saved gems, geolocation)
    │   └── AuthContext.tsx           # Firebase auth (Google + email/password)
    │
    ├── store/
    │   └── GameStore.tsx            # Central game state, wires all 14 engines
    │
    ├── engine/                       # Pure business logic (no React)
    │   ├── types.ts                  # All shared TypeScript interfaces
    │   ├── points.ts                 # XP, levels, badges, streaks
    │   ├── bloom.ts                  # Gem popularity/scarcity system
    │   ├── checkin.ts                # Check-in validation pipeline
    │   ├── hexmap.ts                 # Zone system + multipliers
    │   ├── leaderboard.ts            # Rankings + tie-breaking
    │   ├── community.ts              # Posts, voting, karma
    │   ├── safety.ts                 # Hazard reports
    │   ├── buddy.ts                  # Buddy matching + sessions
    │   ├── events.ts                 # Event RSVP + points
    │   ├── submission.ts             # Gem proposal workflow
    │   ├── notifications.ts          # Notification factory
    │   ├── consistency.ts            # Cleanup jobs + validation
    │   └── cache.ts                  # TTL cache + localStorage
    │
    ├── lib/
    │   ├── firebase.ts               # Firebase app + auth init
    │   └── firestore.ts              # All Firestore CRUD + real-time subscriptions
    │
    ├── data/
    │   ├── gems.ts                   # 10 hardcoded gem definitions
    │   └── places.ts                 # 40+ place/attraction records
    │
    └── components/
        ├── Layout.tsx                # Responsive shell (sidebar + main + right panel)
        ├── BottomNav.tsx             # Mobile 4-tab navigation
        ├── Sidebar.tsx               # Desktop left sidebar
        ├── RightPanel.tsx            # Desktop right panel
        ├── Toast.tsx                 # Toast notification display
        ├── Skeleton.tsx              # Loading placeholders
        ├── figma/
        │   └── ImageWithFallback.tsx
        ├── ui/                       # 60+ shadcn/ui primitives
        │   └── (accordion, button, dialog, select, tabs, chart …)
        └── screens/
            ├── Home.tsx              # Dashboard, nearby gems, search
            ├── Profile.tsx           # Stats, badges, settings
            ├── MapScreen.tsx         # Leaflet.js interactive map
            ├── PlacesScreen.tsx      # Attraction grid
            ├── GemDetail.tsx         # Single gem page + check-in
            ├── GemSubmission.tsx     # Submit new gem proposals
            ├── Community.tsx         # Posts, voting
            ├── EventsScreen.tsx      # Upcoming events + RSVP
            ├── BuddyScreen.tsx       # Buddy matching + session
            ├── Leaderboard.tsx       # Weekly rankings
            ├── HexMap.tsx            # Zone hex grid visualization
            ├── QRScan.tsx            # QR code check-in
            └── NotFound.tsx
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + TypeScript |
| Router | React Router v7 (lazy routes) |
| Styling | Tailwind CSS + inline dynamic styles |
| Component Library | shadcn/ui (Radix UI primitives) |
| Map | Leaflet.js + react-leaflet |
| Backend / Auth | Firebase (Firestore + Firebase Auth) |
| Build Tool | Vite |
| Deployment | Firebase Hosting |
| State | React Context + useState (no Redux) |

---

## Provider Hierarchy

The app wraps in layers — each outer layer provides data to everything inside:

```
<AuthProvider>           ← Firebase auth state
  <AppProvider>          ← UI preferences, geolocation, toasts, saved gems
    <GameProvider>       ← All 14 game engines + Firestore sync
      <Router>
        <Layout>
          <Screen />
        </Layout>
      </Router>
    </GameProvider>
  </AppProvider>
</AuthProvider>
```

**On first load**, `App.tsx` checks Firebase auth. If no user → show login screen. If user → check localStorage for onboarding flag → if unseen → show onboarding → then render the full app.

---

## The 14 Game Engines

All engines are **pure TypeScript** — no React, no side effects, fully unit-testable. `GameStore.tsx` wires them together.

---

### 1. `types.ts` — Shared Interfaces

Defines every data shape in the app. Key types:

```
GemRarityTier   → "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
BloomStatus     → "Active" | "Fading" | "Critical" | "Dormant"
GemState        → { id, rarityTier, bloomCapacity, lastVisitTimestamp, digipinCode, coords, basePoints }
UserStats       → { totalXP, weeklyScore, weeklyGems, allTimeGems, streakDays, karma, hasLocalMode … }
CheckinRecord   → { userId, gemId, timestamp, coords, pointsAwarded, multiplierBreakdown }
CommunityPost   → { authorId, category, body, upvotes, downvotes, score, votes }
SafetyReport    → { type, coords, status, confirmations, dismissals, expiresAt }
BuddySession    → { buddyId, explorerId, startTime, gemsVisited, status }
EventState      → { rsvps, waitlist, capacity, startTime, endTime }
LeaderboardEntry → { rank, weeklyScore, uniqueGems, streakDays, firstCheckinTimestamp, allTimeXP }
```

---

### 2. `points.ts` — XP, Levels, Badges, Streaks

**Level System — 5 tiers:**

| Index | Name | Icon | Min XP | Max XP |
|---|---|---|---|---|
| 0 | Wanderer | 🌱 | 0 | 500 |
| 1 | Explorer | 🔭 | 500 | 1,500 |
| 2 | Pathfinder | 🗺️ | 1,500 | 4,000 |
| 3 | Sage | ⚡ | 4,000 | 10,000 |
| 4 | Legend | 🌟 | 10,000 | ∞ |

`getLevelInfo(xp)` returns current level, progress %, points to next level, and whether a level-up occurred (compared against previous XP).

**Point formula:**

```
total = floor(basePoints × zone × proximity × streak × bloom × buddy)
```

**Streak multiplier:**

```
0–2 days  → 1.0×
3–6 days  → 1.5×
7–29 days → 2.0×
30+ days  → 3.0×
```

**Rarity base points:**

```
Common: 25 | Uncommon: 50 | Rare: 100 | Epic: 200 | Legendary: 500
```

**8 Badges with auto-check logic:**

| Badge | Unlock Condition |
|---|---|
| First Step 👣 | 1st gem checked in |
| 10 Gems 💎 | 10 unique gems visited |
| Streak Seeker 🔥 | 7-day check-in streak |
| Community Voice 🌿 | 5 posts submitted |
| Buddy Explorer 🤝 | 5 buddy walks completed |
| Gem Smith ⚒️ | 3 accepted gem submissions |
| Local Sage 🏠 | Local Mode activated |

Badges are checked by comparing `prev stats` vs `next stats` after every check-in — only newly crossed thresholds fire.

---

### 3. `bloom.ts` — Gem Scarcity System

Bloom is a 0–100 capacity meter on each gem. It **rises** when visited and **decays** when left alone. This creates natural scarcity — popular gems become unavailable, guiding users to less-visited spots.

**Status thresholds:**

```
0–40   → Active   (green,  full points,   check-in allowed)
41–70  → Fading   (yellow, 0.75× points,  check-in allowed)
71–90  → Critical (red,    0.5× points,   check-in allowed)
91–100 → Dormant  (grey,   0× points,     check-in BLOCKED)
```

**Capacity increment per check-in (rarity-based):**

```
Common: +4.0 | Uncommon: +3.0 | Rare: +2.5 | Epic: +2.0 | Legendary: +1.0
```

Rarer gems are harder to saturate, staying available longer.

**Decay rate per 24h (rarity-based — rarer = faster recovery):**

```
Common: −2.0 | Uncommon: −2.5 | Rare: −3.0 | Epic: −3.5 | Legendary: −4.0
```

**Decay algorithm:**

```
decayPer6h = DECAY_PER_24H[tier] / 4
periods    = floor(hoursSinceLastVisit / 6)
newCapacity = max(0, current − decayPer6h × periods)
```

`recalcBloomNow()` is called on every screen open — it computes elapsed hours since `lastVisitTimestamp` and applies live decay without storing intermediate values.

**Bloom Boost** (Zone Guardian power): reduces capacity by 20 points, restoring a Dormant gem to playable.

---

### 4. `checkin.ts` — Check-in Validation Pipeline

The most complex engine. `verifyCheckin()` runs 7 sequential checks:

**Step 1 — GPS accuracy** (GPS method only):

```
if gpsAccuracy > 30m → reject ("Move to open area")
```

**Step 2 — Velocity spoof detection** (GPS method only):

```
if timeSinceLast < 90s AND distanceMoved > 500m → reject (GPS spoof)
```

Catches people faking GPS location — they'd have to teleport 500m in 90 seconds.

**Step 3 — Duplicate prevention:**

```
if same user + same gem + within last 2 hours → reject
```

**Step 4 — Rate limiting:**

```
if user has 10+ check-ins in the last hour → reject
```

**Step 5 — Haversine distance check** (GPS method only):

```
R = 6,371,000 metres
dLat = toRad(b.lat - a.lat)
dLng = toRad(b.lng - a.lng)
x = sin²(dLat/2) + cos(a.lat) × cos(b.lat) × sin²(dLng/2)
distance = R × 2 × atan2(√x, √(1−x))
```

**Proximity multiplier from distance:**

```
≤20m  → 1.5× (precision bonus)
≤50m  → 1.0×
≤100m → 0.85×
>100m → 0    (rejected — too far)
```

**Step 6 — Bloom gate:**

```
if bloomStatus == "Dormant" → reject
```

**Step 7 — Points calculation:**

All multipliers assembled → `calculatePoints()` called → full breakdown returned:

```
{ base, rarity, zone, proximity, streak, bloom, buddy, total }
```

> QR code method bypasses GPS accuracy, velocity, and distance checks — but still enforces duplicate + rate limit + bloom.

---

### 5. `hexmap.ts` — Zone System

Mysuru is divided into 5 DIGIPIN-coded zones. Each zone has a **point multiplier** and an **unlock requirement**.

| Zone | DIGIPIN | Multiplier | Unlock Requirement |
|---|---|---|---|
| Heritage Core | MYS-4N2K | 3.0× | Open to all |
| Artisan Quarter | MYS-7R8P | 2.0× | 3 gems in Heritage Core |
| Street Food Belt | MYS-1F5Q | 1.5× | Level 1 (Explorer) |
| Fort Zone | MYS-9T4L | 2.0× | `zone_master` badge |
| Silk District | MYS-3K6W | 2.5× | Level 2 (Pathfinder) |

`getZoneMultiplier(digipinCode)` is a simple O(1) lookup from a pre-built `Record<string, number>`.

`isZoneUnlocked()` supports 4 unlock types: `none`, `gems_in_zone`, `level`, `badge`.

Completing 100% of gems in a zone → `masterBadgeEarned = true` → **+500 pt zone master bonus**.

HexMap screen renders this as a hex grid where each cell transitions through states:

```
locked → active → explored → gem  (Epic/Legendary visited)
```

---

### 6. `leaderboard.ts` — Rankings

**5-tier tie-breaking comparator** (evaluated in order):

1. Higher `weeklyScore`
2. More `uniqueGems` this week
3. Longer `streakDays`
4. Earlier `firstCheckinOfWeekTimestamp` (who got there first)
5. Higher `allTimeXP`

Tied players share the same rank. `buildLeaderboard()` constructs `LeaderboardEntry[]` from any user array, sorts with `compareEntries()`, then assigns ranks accounting for ties.

**Weekly reset** (every Monday 00:00 UTC):

- Top-10 players get **+50 pt bonus** added to `totalXP` before wipe
- `weeklyScore`, `weeklyGems`, `firstCheckinOfWeekTimestamp` reset to 0
- `totalXP` and `allTimeGems` are **never reset**

---

### 7. `community.ts` — Posts, Voting, Karma

Vote system:
- Each user gets one vote per post (stored in `post.votes[userId]`)
- Switching vote reverses the previous vote first
- `+1 karma` for your post getting upvoted, `−1` for downvote (karma floor = 0)
- Posts auto-hidden when `score < −5`

**Karma milestones:**

```
50 karma  → can submit Stories
500 karma → LocalExpert badge eligibility
```

`checkLocalExpertEligibility()`: requires 25+ posts with score ≥ 10, account age 60+ days, and 1500+ XP.

---

### 8. `safety.ts` — Hazard Reports

**7 report types with expiry windows:**

```
Road Hazard:           4h
Flooding:              8h
Construction:         24h
Crowd:                 6h
Suspicious Activity:  12h
Accessibility:        72h
Other:                24h
```

**Confirmation flow:**

```
3 confirmations → reporter earns +40 XP, status → Confirmed
5 dismissals (with <3 confirmations) → AutoDismissed
```

Each user can confirm or dismiss a report once (stored in arrays).

**Rate limits:**

```
Tourist:     1 report/day
Local Mode:  5 reports/day
```

---

### 9. `buddy.ts` — Buddy Matching Algorithm

**Matching score formula:**

```
score = (rating × 20)
      + (totalWalks × 0.1)
      + (sharedLanguages × 10)
      + (expertiseMatch × 15)
      + (verified ? 25 : 0)
      + (isPreferred ? 30 : 0)
```

**Verification** requires: 10+ completed walks AND weighted rating ≥ 4.0 (last 20 ratings count 2×).

**Session mechanics:**

```
Max duration:          8 hours
Max radius:           10 km
Explorer bonus:       +50% points (buddy multiplier = 1.5×)
Buddy earnings:       10% of explorer's points, capped at 500 pts/session
```

`calcBuddyEarnings(buddyXP, explorerPoints)` = `min(explorerPoints × 0.1, 500)`

---

### 10. `events.ts` — Event RSVP

Capacity + 20-person waitlist. RSVP toggles between join/leave.

**Points awarded:**

```
RSVP join:              +5 pts
Check in any gem:      +75 pts
Check in all gems:    +200 pts
Post a review:         +25 pts
Creator bonus:        +150 pts  (if ≥5 attendees show up)
```

**Validation rules:**

```
Minimum lead time:   24h before event
Maximum duration:     8h
Max active events:    3 per user
```

`getCountdown(startMs)` returns `{ days, hours, minutes, seconds }` from `Date.now()`.

---

### 11. `submission.ts` — Gem Proposals

User-submitted gem proposals go through a guardian review pipeline:

```
Draft
  └─→ Pending
        ├─→ (5 confirmations)             → Accepted  (+300 XP to submitter)
        └─→ (3+ flags, <5 confirmations)  → NeedsReview
              └─→ (72h guardian deadline) → Rejected
```

**Validation rules:**

```
Minimum level:         Level 2 (Pathfinder)
Photos required:       1–6
Description length:    100–1,000 characters
Auto-expiry:           14 days with no activity
```

---

### 12. `notifications.ts` — Notification System

**11 typed notification constructors:**

| Constructor | Priority |
|---|---|
| `notifyCheckin(gemName, pts)` | low |
| `notifyBadge(badgeName, pts)` | high |
| `notifyLevelUp(levelName)` | high |
| `notifyGemAccepted(gemName)` | medium |
| `notifySafetyConfirmed(type)` | medium |
| `notifyBloomChanged(gemName, status)` | low |

**Retention:**

```
Inbox (notifications):  30 days
Activity log:           90 days
```

Both are pruned automatically on app startup.

---

### 13. `consistency.ts` — Background Jobs

Run on every app startup:

| Job | Logic |
|---|---|
| Weekly reset | `shouldRunWeeklyReset(weeklyResetDate, nowISO)` — checks if Monday passed |
| Bloom decay | `runBloomDecayJob(gemStates)` — decays all gems based on elapsed time |
| Streak break | `checkStreakBreak(stats, today)` — resets streak if last check-in was >1 day ago |
| Safety expiry | `runSafetyExpiryJob(reports)` — marks expired reports as `Expired` |
| Submission expiry | `runSubmissionExpiryJob(submissions)` — closes 14-day-old pending submissions |
| Notification prune | `pruneOldNotifications(notifications)` — removes entries beyond retention window |

**Geo validation:** Mysuru bounding box `[11.8–12.5 lat, 76.4–77.0 lng]` — rejects coordinates outside this range.

`sanitizeText()` strips HTML tags and trims whitespace on all user-generated content before storage.

---

### 14. `cache.ts` — TTL Cache + localStorage

**TTL constants:**

```
gems:                60 min
weekly leaderboard:  60 sec
zone progress:        5 min
events:               5 min
nearby gems:          2 min
```

In-memory `appCache` class stores `{ value, expiresAt }` per key. Expired entries return `null` and are evicted on next read.

**localStorage** uses version prefix `hadi_v2` on all keys — bumping the version acts as an automatic cache bust for all stored client data.

**Invalidation rules:**

```
After check-in        → invalidate nearbyGems, zoneProgress, gemBloom
After safety change   → invalidate safetyReports
After weekly reset    → invalidate weeklyLeaderboard, zoneProgress
```

---

## Data Layer

### `gems.ts` — 10 Hardcoded Gems

Each gem definition:

```typescript
{
  id, name, emoji, category, rarityTier,
  description, shortDescription,
  bloomCapacity, points, gradient,
  image,           // optional photo URL
  coords,          // { lat, lng }
  digipinCode,     // which zone this gem belongs to
  audioTranscript, // narrated story text for audio walk
  audioArtisan,    // name of the artisan/guide narrator
}
```

Categories: Heritage | Art | Food | Nature | Hidden

### `places.ts` — 40+ Attractions

Static attraction data rendered in PlacesScreen and on the map:

```typescript
{
  id, name, category, emoji, gradient,
  description, address, rating, openNow
}
```

Categories: temple | church | food | nature | stay

---

## Firebase Layer

### Authentication (`AuthContext.tsx`)

- **Google Sign-In** via popup (`signInWithPopup`)
- **Email/password** via `signInWithEmailAndPassword` and `createUserWithEmailAndPassword`
- Error codes mapped to human-readable messages
- `onAuthStateChanged` keeps the `user` object reactive throughout the app

### Firestore Collections (`firestore.ts`)

```
users/{uid}
  ├── stats: UserStats
  ├── badges: string[]
  ├── visitedGems: number[]
  └── savedGems: number[]

users/{uid}/checkins/{id}       ← CheckinRecord per check-in
users/{uid}/activity/{id}       ← ActivityEntry per action

community_posts/{id}            ← real-time subscription
safety_reports/{id}             ← real-time subscription
events/{id}                     ← real-time subscription
gem_submissions/{id}            ← real-time subscription
leaderboard/{uid}               ← upserted on every stat change
```

**Dual-write pattern**: every state change writes to both `localStorage` (immediate, works offline) and Firestore (persistent, shared across devices). On startup, Firestore is read and merged with `seedStats()` defaults so no field is ever `undefined`.

---

## State Management — `GameStore.tsx`

GameStore is a single React Context (~870 lines) that:

1. Initialises all state from `localStorage`, with Firestore as source of truth on next load
2. Sets up **5 real-time Firestore subscriptions** (posts, reports, events, submissions, leaderboard)
3. Runs **startup jobs** (bloom decay, streak break, expiry checks, weekly reset)
4. Exposes all action functions via the `useGame()` hook

**Full check-in pipeline** — what happens when a user taps "Check In":

```
doCheckin(gemId, "gps", userCoords, accuracy)
  │
  ├─ verifyCheckin()            [engine/checkin.ts]
  │     GPS accuracy check
  │     Velocity spoof check
  │     Duplicate check
  │     Rate limit check
  │     Haversine distance check
  │     Bloom gate check
  │     calculatePoints()
  │
  └─ if valid:
       setGemStates()           [update bloom capacity]
       setCheckinRecords()      [append record]
       setVisitedGemIds()       [mark gem as visited]
       setStats()               [+XP, +streak, +weeklyGems]
       setUnlockedBadges()      [if new badges triggered]
       pushNotif()              [checkin + badge + levelup toasts]
       pushActivity()           [activity log entries]
       invalidateAfterCheckin() [clear stale cache]
       fsAddCheckin()           [Firestore write]
       upsertLeaderboardEntry() [Firestore leaderboard update]
```

---

## Screens Explained

### Home (`Home.tsx`)
- Hero card with user's level icon and current XP
- Geolocation-based **Nearby Gems** — all unvisited gems sorted by haversine distance from current position, top 5 shown
- Search bar with category suggestions
- **Fading Gems** alert — gems currently in Critical bloom that need visiting to earn points before they go Dormant
- Daily challenge card
- Hex zone mini-map preview with completion percentages

### Profile (`Profile.tsx`)
- Stats strip: Points / Gems found / Weekly Rank
- XP progress bar with full level badge row
- **Tabbed content:**
  - Achievements — badge grid (locked/unlocked state)
  - My Gems — grid of visited gems
  - Collections — saved/bookmarked gems with remove button
  - Activity — timestamped log of all actions
- **Settings:** Dark mode toggle, Local Mode toggle, Sign Out
- Edit Profile modal (display name, full name, email, phone, location, role, interests, profile image)

### Map (`MapScreen.tsx`)
- Leaflet.js map centered on Mysuru (12.295, 76.644)
- Custom markers for all places + active hazard reports
- Category filter pills (all / temple / food / nature / heritage)
- Tap a marker → slide-up detail card with description, open/closed status
- Hazard report panel with upvote confirmation buttons

### GemDetail (`GemDetail.tsx`)
- Bloom status indicator (colour-coded)
- Point breakdown preview (base × zone multiplier × bloom multiplier)
- Check-in button → triggers `doCheckin()` → shows result modal with XP earned
- Audio walk transcript (artisan narration text)
- Save / unsave to personal collection

### Community (`Community.tsx`)
- Feed sorted by score (upvotes − downvotes)
- Categories: Hidden Finds / Safety Notes / Local Tips / Events
- Upvote / downvote with live karma feedback
- Submit post form with `sanitizeText()` on content

### Leaderboard (`Leaderboard.tsx`)
- Top 3 podium display with special styling
- Full ranked list with weekly score, gems found, streak days
- Current user's row highlighted
- Weekly reset countdown timer

---

## Styling System

Colors served from `useColors()` hook in `AppContext`:

```
C.bg          → page background
C.card        → card background
C.cardAlt     → secondary / nested card
C.text        → primary text
C.muted       → secondary / label text
C.border      → card borders
C.borderStrong → input borders
```

These toggle between light and dark values based on `darkMode` state stored in `localStorage`.

**Brand colour tokens (hardcoded):**

```
#E07B2A   → orange accent    (XP bars, primary buttons, highlights)
#0F3D3D   → dark teal        (hero backgrounds, CTA buttons)
#C9921F   → gold             (level badges, max-level indicator)
#22c55e   → green            (Active bloom, success states)
#ef4444   → red              (Critical bloom, error states)
#9ca3af   → grey             (Dormant bloom, muted/disabled)
```

---

## Key Algorithms Summary

| Algorithm | File | Complexity |
|---|---|---|
| Haversine distance | `checkin.ts` | O(1) |
| Bloom decay | `bloom.ts` | O(1) per gem |
| Leaderboard sort + rank assign | `leaderboard.ts` | O(n log n) |
| Buddy matching score | `buddy.ts` | O(n) candidates |
| Badge check | `points.ts` | O(b) — 8 badges |
| Zone multiplier lookup | `hexmap.ts` | O(1) hash map |
| Velocity spoof detection | `checkin.ts` | O(1) |
| Duplicate check | `checkin.ts` | O(r) recent records |
| Hourly rate limit | `checkin.ts` | O(r) recent records |
| Weekly reset detection | `consistency.ts` | O(1) date compare |

---

## Data Persistence Summary

| Storage | What | When |
|---|---|---|
| `localStorage` | stats, visitedGems, savedGems, badges, checkinRecords, notifications, activityLog | On every state change (via `useEffect`) |
| Firestore `users/{uid}` | stats, badges, visitedGems, savedGems | On every stat change |
| Firestore subcollections | checkins, activity | Per event |
| Firestore shared collections | community_posts, safety_reports, events, submissions | Per user action |
| Firestore `leaderboard/{uid}` | weeklyScore, totalXP, weeklyGems, streakDays | On every stat change |
| In-memory `appCache` | nearbyGems, zoneProgress, bloom states | TTL-based, cleared on relevant mutations |
