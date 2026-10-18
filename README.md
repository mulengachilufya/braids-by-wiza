# Braids by Wiza

Website for **Braids by Wiza**, a luxury braiding business in Zambia.

A static site with no build step and no dependencies: open `index.html`, or deploy the folder to any static host (Vercel, Netlify, GitHub Pages).

## Pages
- `index.html`: home page. It has the interactive silk hero, signature work, the menu, the style finder, About Wiza, a 3D Zambia map, aftercare, FAQ, and WhatsApp booking.
- `work.html`: the Lookbook, with all of Wiza's work, filters, and a swipeable lightbox.

## Business details (edit `js/data.js`)
- WhatsApp: +260 760 877 104 · Calls only: +260 777 091 604
- Based in Central Province. Transport costs apply outside the province.
- By appointment only. A 25% upfront payment secures a booking.
- [ ] Prices: services show "On quote" until you set `from` on each `MENU` item (e.g. `from: 450`).
- [ ] Instagram: set `instagram` once the account exists (the footer says "coming soon" until then).

## Adding new work
1. Cut the photo out onto a white background and export a ~900px-wide `.webp` into `assets/work/`.
2. Add an entry to `LOOKS` in `js/data.js`.

## Haptics
- Android (Chrome, etc.): uses the Vibration API.
- iPhone (iOS 18+ Safari): uses the system haptic from a hidden `switch` toggle, because iOS has no Vibration API.
- Visitors can switch haptics off with the phone icon in the nav.
