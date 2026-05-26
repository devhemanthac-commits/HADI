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

## 📐 Architecture & Logic

### Check-in Validation Pipeline
The app features a multi-stage validation engine (`src/app/engine/checkin.ts`):
1. Captures real device coordinates using `navigator.geolocation`.
2. Computes the Haversine distance to the target Gem's coordinates.
3. Applies proximity multipliers (e.g., 1.5x bonus for being within 20m).
4. Verifies the gem's current "Bloom" capacity to prevent spamming.
5. Persists the transaction locally (optimistic UI) and to Firestore.

### Dual-Write Persistence
To ensure offline capability, HADI uses a robust local caching mechanism (`localStorage_` wrapper) that immediately reflects state changes while asynchronously syncing with Firebase.

---
<div align="center">
  <p>Built with ❤️ for Mysuru.</p>
</div>
