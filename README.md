# Braids by Wiza

Website for **Braids by Wiza**, a luxury braiding business in Zambia.

A static site with no build step and no dependencies: open `index.html`, or deploy the folder to any static host (Vercel, Netlify, GitHub Pages).

## Pages
- `index.html`: home page. It has the interactive silk hero, sample work, styles and prices with the price check, the style finder, About Wiza, the mobile service note, aftercare, FAQ, and WhatsApp booking.
- `work.html`: the gallery, with all of Wiza's work, filters, and a swipeable lightbox.

## Business details (edit `js/data.js`)
- WhatsApp: +260 760 877 104 · Calls only: +260 777 091 604
- Shown on the site as a mobile braider, priced by the client's location. Trips are priced from Kabwe (not shown on the site).
- By appointment only. A 25% upfront payment secures a booking.

## Price estimate calculator
Estimate = labour (style × size × length) + hair (only if non-plain) + transport (return bus from Kabwe + local rides + overnight for far towns).
- `STYLES`: labour price and hair packs per style
- `PRICING`: size/length multipliers, local transport bands, overnight allowance, range shown
- `CITIES`: one-way bus fare from Kabwe per town
- [ ] Wiza to confirm labour prices, hair pack prices and bus fares (current values are researched estimates).
- [ ] Instagram: set `instagram` once the account exists.

## Adding new work
1. Cut the photo out onto a white background and export a ~900px-wide `.webp` into `assets/work/`.
2. Add an entry to `LOOKS` in `js/data.js`.

## Haptics
- Android (Chrome, etc.): uses the Vibration API.
- iPhone (iOS 18+ Safari): uses the system haptic from a hidden `switch` toggle, because iOS has no Vibration API.
- Visitors can switch haptics off with the phone icon in the nav.
