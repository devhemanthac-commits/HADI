<div align="center">
  <img src="public/icons/icon-512x512.png" alt="HADI Logo" width="120" />
  
  # HADI: Heritage & Discovery Initiative
  
  **An gamified, location-based progressive web application designed to encourage exploration of Mysuru's rich heritage.**
  
  [![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
</div>

---

## 🌟 Overview

**HADI** transforms heritage exploration into an engaging, interactive adventure. By checking in at historical locations around Mysuru, users earn "Gems", build streaks, climb leaderboards, and unlock digital badges.

The app uses **real-world GPS location verification** via device sensors and the Haversine formula to ensure authentic presence, alongside a QR-code fallback for "dead zones".

## ✨ Key Features

- **📍 Live GPS Verification**: Check-ins require physical proximity (<250m) to heritage sites.
- **🗺️ Interactive Map**: Real-time Leaflet/OpenStreetMap integration displaying all hidden Gems.
- **🏆 Gamification Engine**: Dynamic points calculation, leveling system, streak mechanics, and badge unlockables.
- **🌺 Bloom System**: Anti-grind mechanic where gems "bloom" (recharge) over time, encouraging natural exploration rhythms.
- **🤝 Community & Buddies**: Add friends, track shared activities, upvote submissions, and participate in local events.
- **🛡️ Safety Engine**: Crowdsourced real-time safety reporting for user security.
- **📱 PWA Ready**: Installable on Android/iOS with offline caching and mobile-first responsive design.

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI Primitives, Framer Motion
- **Map Engine**: Leaflet (react-leaflet)
- **Backend & Database**: Firebase (Auth, Firestore, Hosting)
- **State Management**: React Context API & custom Hooks

## 📦 Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/devhemanthac-commits/HADI.git
   cd HADI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory using the provided `.env.example` format and add your Firebase credentials.

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📐 Advanced Engine Architecture

The core mechanics of HADI are driven by production-level mathematical engines (`src/app/engine/`):

### 1. Spatial Hash Grid Geofencing ($O(1)$)
Instead of linear array scans, the background location watcher uses a mathematical grid-bucketing system (`geofence.ts`). On GPS update, it maps the user to a cell grid (~500m precision) and only checks distances against gems located in the local and immediately adjacent 8 cells, scaling effortlessly to tens of thousands of locations.

### 2. Point-in-Polygon Ray-Casting Boundaries
Zones in Mysuru are defined by exact GPS coordinate polygons (`hexmap.ts`). The engine casts a horizontal mathematical ray from the user's coordinate to determine intersection parity with the polygon boundaries, perfectly bounding zones like the *Heritage Core* without relying on third-party API bounds.

### 3. TrueScore Leaderboard Algorithm
The competitive ranking system (`leaderboard.ts`) doesn't just sort by raw points. It utilizes an **Exponential Moving Average (EMA)** momentum algorithm that balances historic baselines against recent activity velocity, rewarding active players with a multiplier similar to an Elo/Glicko rating system.

### 4. Robust Optimistic Offline Sync
To ensure 100% resilience against network drop-offs, the `SyncEngine` (`sync.ts`) acts as an optimistic background queue. Actions like Check-ins or Safety Reports are immediately applied to the local UI while being persisted to an Indexed Queue. A background thread attempts to push these payloads to Firebase, applying **Exponential Backoff** (2s, 4s, 8s...) on network failure.

### 5. Multi-Layer Check-in Pipeline
Check-ins pass through spoof-detection velocity windows, Cyrb53 53-bit cryptographic hash generation, and Haversine distance verification before being processed.

---
<div align="center">
  <p>Built with ❤️ for Mysuru.</p>
</div>
