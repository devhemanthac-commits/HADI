"Add all of the following to the existing HADI app. Keep all existing screens intact. Only add new screens and enhance existing ones.

1. HEX MAP SCREEN — Build this completely
Full screen. Dark teal background #0F3D3D. Header: "Hex Map" in Playfair serif white + subtitle "Explore Mysuru by zone" in muted cream.
Main content: A large interactive H3 hexagonal grid covering Mysuru. Render hexagons using CSS clip-path polygon. Grid is 8 rows × 9 columns with every even row offset by half a hex width. Each hex is colour coded by status — Explored: teal #1A5252, Active: saffron #E07B2A, Hidden Gem available: gold #C9921F, Locked: translucent white 15% opacity. Hexes with hidden gems show a small 💎 inside. Locked hexes show 🔒.
When user taps a hex, show a bottom sheet sliding up from the bottom (translateY animation 300ms). Bottom sheet has: Zone name, Digipin code (e.g. MYS-4N2K), Population density badge (High/Medium/Low), Points multiplier badge (1x/2x/3x), number of gems in zone, safety score out of 5 stars, and a large "Explore This Zone →" saffron button.
Top right: a legend card showing the 4 hex colour meanings.

2. GEM DETAIL SCREEN — Opens when any gem card is tapped
Triggered from Home gem cards and Discover nearby list. Full screen page.
Top: tall gradient image block (200px) with emoji centered, place name overlaid at bottom in white Playfair serif, rarity badge top-left (Hidden Gem / Trending / Local Fav).
Below image: two-column row — left shows +points value in large saffron serif, right shows star rating.
Info section: location with pin emoji, category tag pill, Digipin zone code, distance from user.
Description paragraph: 2-3 lines of dummy descriptive text about the place.
Safety strip: coloured bar showing safety score with a shield icon and time-of-day recommendation (e.g. "Best visited before 6 PM").
Large saffron CTA button: "Scan QR to Check In" with camera icon. Tapping this navigates to QR Scan Screen.
Community reviews section below: 2 dummy review cards each with avatar, name, star rating, and short review text.
Back button top-left to return to previous screen.

3. QR SCAN SCREEN — Triggered from Gem Detail and Discover
Full screen dark overlay background #0A1A1A. Centered content.
Top: back arrow + "Scan to Verify" title in white.
Center: a square scan frame (280×280px) with animated corner brackets in saffron. A horizontal saffron scan line animates top to bottom on loop (CSS keyframe, 1.8s linear infinite). Inside frame: subtle grid pattern in white 5% opacity.
Below frame: "Point your camera at the QR code" in muted white 14px.
Below that: GPS status indicator — green dot + "GPS Verified · Lakshmipuram" text in small green.
After 3 seconds of being on this screen, auto-trigger a success state: scan frame turns green, checkmark icon animates in (scale 0 → 1.2 → 1 with spring), text changes to "Gem Verified!", then a points awarded toast slides in from top: "+220 pts awarded · Puppet Workshop Hall" in a white pill with saffron text.
Then after 1.5 more seconds auto-navigate back to the gem detail screen showing it now as "Visited".
Also show an "Or enter code manually" text link below the frame.

4. GEM SUBMISSION FLOW — Accessible from a + FAB button on Home and Discover
Add a floating action button (FAB) bottom-right corner on Home and Discover screens. Saffron circle, white + icon, subtle shadow. Tapping it opens the submission flow.
4-step flow with a progress bar at top (1 of 4, 2 of 4 etc):
Step 1 — Name & Category: Text input "What is this place called?", Category selector grid (Art, Food, Temple, Craft, Nature, Street — each a tappable pill with emoji).
Step 2 — Take Photo: Large dashed border upload zone with camera emoji and "Take a live photo" label. Simulate with a dummy gradient image appearing after tap. Note: "Gallery uploads not allowed — live photo only."
Step 3 — Confirm Location: Show a static map-like card with a pin centered, GPS coordinates below, address text, and "Use my current location" button in teal outline style.
Step 4 — Review & Submit: Summary card showing name, category, photo thumbnail, location. Large "Submit for Verification" saffron button. Small text below: "2 community members will verify your submission before it goes live."
After submit, show a success state: checkmark animation, "Submitted! You'll earn 500 pts once verified." message, and a "Back to Explore" button.
Each step has a Back and Next button. Next is disabled until required fields are filled.

5. SAFETY REPORT FLOW — Accessible from community screen and right panel
Add a "Report Safety Issue" button on Community screen below the post composer.
Opens a bottom sheet (not full screen). Content:

Title "Report a Safety Issue" in serif
Area selector dropdown: list of Mysuru areas
Severity selector: 3 large tappable cards — Caution (amber), Avoid (red), All Clear (green) — each with icon and one-line description
Text area: "Describe the situation (optional)"
Time selector: Now / This Morning / This Evening
Submit button saffron full width
After submit: toast notification "Safety report submitted. Thank you for keeping explorers safe 🙏"


6. SEARCH RESULTS SCREEN — Triggered from home search bar
When user types in the search bar, the main content area transforms into search results.
Show a results count "12 results for 'silk'" at top.
Filter row: All, Art, Food, Temples, Crafts, Stay.
Results list: same style as Discover nearby list — emoji thumbnail, name, type tag, distance, points. Each tappable to Gem Detail.
Empty state: if no results, show a centered illustration (large 🔍 emoji, "No gems found here yet", "Be the first to discover one!" subtitle, and a "Submit a Gem +" button).

7. ONBOARDING FLOW — Shown only to first-time users after login
3 full-screen swipeable cards before reaching Home:
Card 1 — deep teal background. Large compass emoji 🧭. "Welcome to HADI" in Playfair white 36px. "Your guide to hidden Mysuru. Discover what most tourists never find." in cream 16px.
Card 2 — saffron background. Large gem emoji 💎. "Earn Points, Unlock Zones" in Playfair white 36px. "Every hidden gem you discover earns you points. Rarer gems earn more." in white 16px.
Card 3 — cream background. Large shield emoji 🛡️. "Safety First, Always" in Playfair teal 36px. "Our community keeps each other safe. Check zone safety before you explore." in ink 16px.
Each card has dot pagination indicators at bottom. Final card has "Start Exploring →" saffron button instead of Next. Skip button top-right on all cards.

8. TOAST NOTIFICATION SYSTEM
A global toast component that slides in from the top of the screen. Used across all screens. 3 types:

Success (teal left border): "💎 +220 pts · Puppet Workshop Hall verified!"
Warning (amber left border): "⚠️ Safety alert in Devaraja Market"
Info (blue left border): "👥 Kavitha S. verified your gem submission"

Toast auto-dismisses after 4 seconds with a fade + slide out animation. Show a demo toast 5 seconds after reaching the Home screen.

9. ENHANCEMENTS TO EXISTING SCREENS
Home Screen: Add a "Today's Trail" card between the safety strip and search bar. Card has a teal gradient, title "Today's Trail 🗺️", trail name "Sayyaji Rao Heritage Walk", 3 gem stops listed as small pills, total points value, and a "Start Trail →" button.
Discover Screen: Add filter tabs (All, Nearest, Highest Points, Hidden Only) above the nearby list. Add a visited state on already-visited gems — slightly greyed out with a ✅ checkmark on the thumbnail.
Community Screen: Add Like button heart animation — when tapped, heart scales 0 → 1.4 → 1 with a brief saffron color flash. Add a "Verified Local" green tick badge distinct from the existing Local Expert badge.
Profile Screen: Add a "My Gems" section below achievements — a 3-column grid of visited gem thumbnails (gradient emoji cards), tappable to Gem Detail. Add an Edit Profile button in the header area.
Leaderboard Screen: Add a Zone Leaderboard tab alongside This Week / All Time / Local Only — shows top explorers per selected zone from a zone dropdown.

10. GLOBAL UI POLISH
Add skeleton loader shimmer animation on all card lists — shown for 1 second on screen mount before content appears. Shimmer is a grey animated gradient moving left to right.
Add smooth page transition on every screen change: new screen fades in + slides up 10px over 250ms. Exiting screen fades out simultaneously.
Add a dark mode toggle in the Profile screen settings section. In dark mode: background changes to #0A0A0A, cards to #1A1A1A, text to #F5F0E8, sidebar stays teal. All transitions smooth 300ms.
All interactive elements (buttons, cards, pills) must have explicit hover states (lift + shadow on desktop) and active states (scale 0.97 on tap)."*