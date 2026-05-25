🔴 Critical Missing Features
1. Artisan Audio Walk System
Their most powerful differentiator. Real human storytelling — each hidden gem has a guided audio walk with an artisan narrator, waveform visualizer, chapter markers, transcript toggle, and walking route map. HADI has no audio layer at all. This transforms passive discovery into an emotional experience.
Add to HADI: An Audio tab inside every Gem Detail screen. Record or script dummy audio walks for 5–6 gems. Show a waveform animation, playback controls, and a walking route card below the player.

2. Bloom & Fade Mechanism — Visualised
Their app shows real-time capacity with a traffic-light system — green glow for low capacity, yellow pulse for 60–80%, red fade for 80–100%, grey dormant for full. Zones literally fade in opacity as they fill up. HADI has the concept in our flaws analysis but it is not built into the UI at all.
Add to HADI: Bloom status badge on every gem card and hex zone. Add a "Fading Now" section on Home showing gems approaching capacity. Add opacity fade effect on gem cards as visit count rises.

3. Rarity Scoring System — Explicit and Visual
They have a 5-tier rarity system — Common, Uncommon, Rare, Epic, Legendary — with numeric scores 1–100, colour-coded card borders, and star ratings. HADI only shows "Hidden Gem" vs "Trending" badges with no structured rarity logic behind them.
Add to HADI: Replace the current 2-state badge with a 5-tier rarity system. Add a numeric rarity score to every gem detail page. Colour-code gem card borders by tier — grey, green, blue, purple, gold.

4. Dual Profile Mode — Tourist vs Local
Their onboarding has a hard split — tourist mode vs local mode — with completely different home screens, permissions, and features for each. HADI has a "Local Expert" badge in community posts but no actual role separation in the app flow.
Add to HADI: Add a mode switcher to the profile screen. Local mode unlocks: hazard reporting, artisan story submission, buddy guide listing, zone guardian controls. Tourist mode shows: discovery feed, audio walks, points economy.

5. Buddy System — Full Feature
Their buddy system is a full marketplace — filter by language, expertise, gender, availability, verified status. You request a buddy, get accepted, have a live chat, share location, end session, rate experience. HADI has only a toggle card in the right panel with no actual flow.
Add to HADI: Build a full Buddy screen. Show buddy profiles as cards with ratings, languages, specialties. Add a request flow — select date, meeting point, add note, send. Add a basic in-session chat interface.

6. Events & Exhibitions Screen
They have a full events feed with countdown timers, RSVP flows, calendar view toggle, capacity indicators, and "Filling Fast" urgency badges. HADI has no events feature at all despite Mysuru having Dasara, silk exhibitions, and cultural festivals as major draws.
Add to HADI: An Events screen in the sidebar navigation. Cards showing event name, date, venue, category, capacity remaining, and an RSVP button. Add a countdown timer on events under 7 days away.

7. Hazard Reporting Map
They have a dedicated map layer showing reported hazards as colour-coded pins — road issues, safety concerns, closed venues, wrong information. Community can upvote or confirm reports. HADI only has a safety report bottom sheet with no map visualisation of past reports.
Add to HADI: A Hazard tab inside the Hex Map screen. Overlay reported hazards as emoji pins on the hex grid. Show a list of recent reports below the map sorted by recency.

🟠 Features HADI Has That Need Upgrading
8. Search — Make It Global and Intelligent
Their search has AI-powered suggestions, category filters, masonry grid results. HADI's search is a basic input with a results list. Add search suggestions as you type, recent searches, and category filter chips on the results screen.
9. Gamification — Make It Richer
They have named achievement badges — Heritage Hunter, Food Explorer, Hidden Gem Finder, Community Guardian, Story Keeper, Social Butterfly — each with a visual badge graphic and unlock condition. HADI has achievement progress bars but no named badge system with distinct visual identities.
10. Collections System
They let users save posts and locations into named collections — like Pinterest boards for Mysuru. HADI has no save or collection feature. Add a bookmark icon on every gem card that saves to a personal collection visible on the profile screen.

🟢 What HADI Does Better
To be fair, HADI has things Mysuru Unbound doesn't:

Digipin integration — specifically Indian, more authentic to the context
QR + RFID dual verification — more physically grounded
Community Safety Intelligence — the real-time crowdsourced safety layer is more developed in HADI's concept
Zone Guardian consent system — locals can pause tourist traffic, which is ethically stronger
Simpler, cleaner UI — the warm cream + teal palette is more refined than their gold/blue/vermillion combination


Recommended Upgrade Prompt for Figma Make
Paste this directly:


"Add the following professional upgrades to HADI, keeping all existing screens intact:
1. Rarity System: Replace Hidden Gem and Trending badges on all gem cards with a 5-tier system — Common (grey border), Uncommon (green border), Rare (blue border), Epic (purple border), Legendary (gold border). Add a rarity score 1–100 and tier label to every Gem Detail screen.*
2. Bloom & Fade: Add a bloom status indicator to every gem card and hex zone — green glow dot for Active, amber pulse dot for Fading, red dot for Critical, grey for Dormant. Add a "Fading Now ⚠️" horizontal scroll section on the Home screen above Hidden Gems Nearby showing gems approaching capacity.*
3. Audio Walk: Add an Audio Walk tab on every Gem Detail screen. Show an artisan name, craft type, duration (e.g. 12 min walk), and a play button. When play is tapped, show a full-width audio player card with a dummy waveform animation (CSS animated bars), playback controls — play/pause, 15s skip, 1x/1.5x/2x speed — progress bar, and a transcript section that toggles open.*
4. Dual Mode: Add a Tourist/Local mode toggle to the Profile screen. When switched to Local mode, the sidebar shows two additional nav items — Submit Story and Zone Guardian. A banner appears at top of screen: "Local Mode Active — You're helping keep Mysuru safe." Local mode unlocks the hazard report button globally.*
5. Events Screen: Add an Events screen to the sidebar navigation between Community and Leaderboard. Show a hero banner with a featured event, then a grid of event cards each showing — event image block (gradient + emoji), category badge, event name, date with countdown timer if under 7 days, venue, capacity bar, and RSVP button. Add filter pills: All, Festivals, Workshops, Exhibitions, Food.*
6. Buddy Screen: Add a Buddy screen to the sidebar under Community. Show a search filter row — language, expertise, availability. Below, show buddy profile cards — avatar, name, verified badge, languages, rating stars, specialties as pills, Request Buddy button. Tapping Request Buddy opens a 3-step bottom sheet: select date and time, enter meeting point, add a note, send request.*
7. Hazard Map Tab: Inside the Hex Map screen, add a tab bar: Explore / Hazards. On the Hazards tab, show the same hex grid with hazard emoji pins overlaid — 🚧 for road issues, ⚠️ for safety concerns, 🚫 for closed venues. Below the grid, show a list of recent hazard reports with area name, category, severity pill, time reported, and upvote count.*
8. Collections: Add a bookmark icon to every gem card. Tapping it saves the gem to a Collections tab on the Profile screen. Collections tab shows a 3-column grid of saved gems with remove option.*
9. Named Achievement Badges: Replace the current progress bar achievements with named badges that have distinct visual identities — Heritage Hunter 🏛️, Food Explorer 🍛, Hidden Gem Finder 💎, Community Guardian 🛡️, Story Keeper 🎙️, Zone Master 🗺️. Each badge is a circle with gradient background and emoji. Locked badges are greyscale. Show unlock condition below each badge.*
10. Global Search Upgrade: When search bar is focused, show a dropdown of recent searches and suggested categories. As user types, show live suggestion pills. Results screen shows count, category filter chips, and a masonry-style grid of results rather than a plain list."*

