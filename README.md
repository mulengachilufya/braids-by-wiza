# Braids by Wiza

Website for **Braids by Wiza**, a luxury braiding business in Zambia.

A static site with no build step and no dependencies: open `index.html`, or deploy the folder to any static host (Vercel, Netlify, GitHub Pages).

## Pages
- `index.html`: home page. It has the interactive silk hero, signature work, the menu, the style finder, About Wiza, a 3D Zambia map, aftercare, FAQ, and WhatsApp booking.
- `work.html`: the Lookbook, with all of Wiza's work, filters, and a swipeable lightbox.

## Before going live (edit `js/data.js`)
- [ ] `whatsapp`: Wiza's number, digits only, e.g. `260971234567`. Booking stays disabled until it is set.
- [ ] `instagram` / `tiktok` / `email`: her handles (optional).
- [ ] `studioCity`: the studio town shown on the map (currently `Lusaka`).
- [ ] **Prices in `MENU` are placeholders.** Replace them with real prices.
- [ ] Check the look names and descriptions in `LOOKS`.

## Adding new work
1. Cut the photo out onto a white background and export a ~900px-wide `.webp` into `assets/work/`.
2. Add an entry to `LOOKS` in `js/data.js`.

## Haptics
- Android (Chrome, etc.): uses the Vibration API.
- iPhone (iOS 18+ Safari): uses the system haptic from a hidden `switch` toggle, because iOS has no Vibration API.
- Visitors can switch haptics off with the phone icon in the nav.
