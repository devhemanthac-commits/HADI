"Build a production-ready, fully responsive web application called Mysuru Hidden Gems — a community-driven gamified tourism decentralisation platform for Mysuru, India. Stack: React + Tailwind CSS. All data is hardcoded dummy data. No backend needed.

Design Language
Refined luxury-minimal. Not flashy, not corporate. Think a premium travel magazine crossed with a modern fintech app. Every element should feel considered and intentional.

Colors: Primary background #FAF6EE warm cream. Sidebar #0F3D3D deep teal. Accent #E07B2A saffron orange. Gold highlight #C9921F. Text #1A1208 near-black ink. Muted text #7A6A55.
Typography: Playfair Display (serif) for all headings and hero text. DM Sans for all UI, body, labels, numbers. Never use Inter, Roboto, or system fonts.
Motion: Smooth 220ms cubic-bezier transitions on every hover, click, and tab switch. Cards lift 4px on hover with shadow deepening. Nav items slide with a subtle left-border accent. Page transitions fade + slide up 8px on mount.
Surfaces: White cards with 1px rgba border and soft box-shadow. No hard borders. Generous padding. Rounded corners minimum 14px, cards 20px, hero sections 28px.
No placeholder grey boxes — use emoji + CSS gradient blocks as visual stand-ins for all images and thumbnails.


Layout — Fully Responsive
Desktop (≥1280px): Three-column — fixed left sidebar (248px) + scrollable main content (flex 1) + sticky right panel (300px).
Tablet (768px–1279px): Two-column — sidebar + main only. Right panel hidden.
Mobile (< 768px): Single column with fixed bottom navigation bar. Sidebar hidden.

Left Sidebar (Desktop)

App logo: "Mysuru" in serif italic gold + "Hidden Gems" in white + "Decentralised Tourism" subtitle in tiny uppercase muted.
Navigation sections labeled "Explore" and "Community" and "You".
Nav items: Home, Discover, Hex Map, Community, Leaderboard, Profile — each with emoji icon and label.
Active item: saffron tinted background + gold text + left accent border.
Bottom: User card with avatar circle, name "Hemanth", role "Urban Explorer", points "1,850 pts".


Bottom Navigation (Mobile)
Five items: Home, Discover, Community, Ranks, Profile. Active item saffron colored. Smooth active indicator underline animation.

Right Panel (Desktop only)
Three cards stacked:

Live Safety Alerts — list of areas with colored status pills (Safe green, Caution amber, Avoid red).
Digipin Zone Multipliers — list of 3 zones with their Digipin code, zone type, and points multiplier badge.
Buddy System toggle card — dark teal background, description text, animated toggle switch.


Screen 1 — Home
Hero card: deep teal gradient background, "Welcome back, Hemanth" label in tiny uppercase gold, large serif heading "Discover Hidden Mysuru" with italic gold word, subtitle "42 unexplored streets. 128 hidden gems waiting.", three stats in a row — Points 1850, Gems Found 5, Rank #4.
Safety alert strip below hero: amber tinted card with warning icon, area name, and short description. Dismissable.
Search bar: full width, rounded pill, subtle shadow, search icon right side, placeholder "Search streets, art, food, crafts…"
Category filter pills: horizontal scroll row — All, Art, Food, Stay, Temples, Crafts, Streets — each with emoji. Active pill solid saffron, inactive outlined.
Section "Hidden Gems Nearby" with "See all →" link: horizontal scroll row of gem cards. Each card has — gradient emoji thumbnail (130px tall), rarity badge top-left (Hidden Gem in saffron, Trending in teal, Local Fav in gold), place name in serif 15px, location row with pin emoji, footer row with points value in saffron and star rating.
Section "Your Zone Map": full-width dark teal card containing an H3 hexagonal grid rendered in CSS clip-path hexagons. 4 rows of 5 hexes each. Color-coded: explored (teal), active (saffron), hidden gem (gold), locked (translucent). One hex highlighted with white outline as "current zone". Legend below the grid.

Screen 2 — Discover
Hero card: terracotta gradient, heading "Find a Hidden Gem", subtitle about QR scan verification, large prominent scan button "Scan QR / Tap RFID" with camera emoji. Button is white with terracotta text.
"Near You Now" section: vertical list of nearby items. Each item is a card row with — colored emoji thumbnail square (56px, rounded 14px), place name in bold, type tag + distance pill in a meta row, and points value right-aligned in serif saffron. Tap animates the card sliding right 4px.

Screen 3 — Community
Post composer: full-width card with dashed border, "Share a local tip, hidden place, or safety note…" placeholder text, subtle hover state.
Filter pills: All Posts, Local Tips, Safety Notes, Hidden Finds.
Post feed: two posts visible. Each post card has — avatar circle with emoji + colored background, name + Local Expert badge (teal pill) if applicable, timestamp, post body text, image block (gradient with large emoji, 140px height, rounded 12px), action row with Like count, Comment count, Share, Flag buttons. Heart icon animates on click (scale pulse).

Screen 4 — Leaderboard
Filter pills at top: This Week, All Time, Local Only.
Podium section: saffron-to-terracotta gradient card. Three columns for rank 1, 2, 3. Rank 1 center and tallest with crown emoji above avatar. Each shows avatar circle, name, points.
Ranked list below: card with rows. Each row has rank number (gold/silver/bronze medals for top 3, plain number after), avatar circle, name + gems found subtitle, points right-aligned in serif saffron. Current user row (rank 4 "Hemanth") highlighted with saffron tinted background and "👈 You" indicator.

Screen 5 — Profile
Full-width header: deep teal to near-black gradient with subtle cross-hatch pattern overlay at 3% opacity. Centered avatar (80px circle, saffron gradient), name "Hemanth" in white serif, "Urban Explorer" badge in saffron pill.
Stats strip: three white cards overlapping the header bottom edge by 30px (negative margin-top). Points, Gems, Rank — each with large serif saffron number and tiny uppercase muted label.
Achievements section: vertical list of achievement cards. Each has — colored emoji icon square (48px, rounded 14px), title + description, progress bar (saffron fill) or checkmark. Show 4 achievements: First Hidden Gem (complete), Street Walker 7/10, Community Voice 3/10, Zone Master 1/5.

Micro-details to implement:

All cards have transition: transform 0.22s, box-shadow 0.22s with translateY(-4px) on hover.
Saffron accent color is used consistently for: points values, active states, CTA buttons, progress bars, achievement numbers.
Every section header uses Playfair Display serif. Every label, pill, metadata uses DM Sans.
The hex grid hexagons are pure CSS using clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%).
Mobile bottom nav has a 1px top border, white background, safe-area padding for iPhone notch.
Smooth fade + translateY(8px) animation on screen mount using @keyframes fadeUp.
All interactive elements have visible hover and active states.
Fonts loaded from Google Fonts CDN."*