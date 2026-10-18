/* ==========================================================================
   Braids by Wiza — site content
   Everything a non-developer may want to change lives in this one file.
   ========================================================================== */

window.SITE = {
  brand: "Braids by Wiza",
  owner: "Wiza",

  // TODO: replace with Wiza's real WhatsApp number in international format, digits only (e.g. 260971234567).
  whatsapp: "260000000000",
  // TODO: replace with real handles (leave "" to hide the link).
  instagram: "",
  tiktok: "",
  email: "",

  // TODO: confirm the studio town. Used for the map's "studio" pin.
  studioCity: "Lusaka",
  currency: "K",
};

/* --------------------------------------------------------------------------
   The Lookbook — real work by Wiza. `tags` drive the filters on work.html;
   `fit` is [length, vibe, time-in-chair] used by the homepage Style Finder.
   -------------------------------------------------------------------------- */
window.LOOKS = [
  { id: "honey-wave",     img: "assets/work/style-3.webp", title: "Honey Wave Cornrow Bun",     tags: ["cornrows", "updo", "colour"], fit: ["shoulder", "romantic", "half"], note: "Sculpted waves with honey-blonde accents, swept into a soft low bun." },
  { id: "boho-knotless",  img: "assets/work/style-2.webp", title: "Waist-Length Boho Knotless", tags: ["knotless", "boho"],           fit: ["long", "romantic", "long"], note: "Feather-light knotless braids with curly ends that move like silk." },
  { id: "swirl",          img: "assets/work/style-7.webp", title: "Swirl Cornrows",             tags: ["cornrows", "design"],         fit: ["long", "bold", "half"], note: "Freehand swirls finished with long side braids." },
  { id: "freestyle",      img: "assets/work/style-1.webp", title: "Freestyle Stitch Braids",    tags: ["stitch", "design"],           fit: ["shoulder", "bold", "half"], note: "Stitch-detailed freestyle pattern with curly, flowing ends." },
  { id: "classic-stitch", img: "assets/work/style-4.webp", title: "Classic Stitch Cornrows",    tags: ["stitch", "cornrows"],         fit: ["short", "classic", "quick"], note: "Clean, straight-back stitch lines — timeless and neat." },
  { id: "sculpted",       img: "assets/work/style-5.webp", title: "Sculpted Curve Cornrows",    tags: ["cornrows", "design"],         fit: ["short", "bold", "quick"], note: "Petite curved parts that frame the face beautifully." },
  { id: "spiral",         img: "assets/work/style-6.webp", title: "Spiral Stitch Design",       tags: ["stitch", "design"],           fit: ["short", "bold", "half"], note: "A spiral crown of fine stitch cornrows." },
];

window.LOOK_FILTERS = [
  { id: "all", label: "All" },
  { id: "cornrows", label: "Cornrows" },
  { id: "stitch", label: "Stitch" },
  { id: "knotless", label: "Knotless" },
  { id: "boho", label: "Boho" },
  { id: "design", label: "Freestyle designs" },
  { id: "updo", label: "Updos" },
];

/* --------------------------------------------------------------------------
   The Menu (services catalogue).
   TODO: every price below is a PLACEHOLDER — set Wiza's real prices.
   -------------------------------------------------------------------------- */
window.MENU = [
  {
    id: "cornrows", label: "Cornrows & Stitch",
    items: [
      { name: "Classic Stitch Cornrows",  time: "2 – 3 hrs", from: 250, desc: "Straight-back or side-swept, with crisp stitch detail." },
      { name: "Freestyle Design",          time: "3 – 4 hrs", from: 350, desc: "Swirls, hearts, zig-zags — your pattern, drawn freehand." },
      { name: "Cornrow Bun / Updo",        time: "3 – 4 hrs", from: 400, desc: "Braided into an elegant bun or sculpted ponytail." },
      { name: "Fulani Braids",             time: "4 – 5 hrs", from: 450, desc: "Front cornrows with a centre part and flowing back braids." },
    ],
  },
  {
    id: "knotless", label: "Knotless & Box",
    items: [
      { name: "Knotless — Shoulder",       time: "4 – 5 hrs", from: 450, desc: "Tension-free, flat at the root, light on the scalp." },
      { name: "Knotless — Mid-Back",       time: "5 – 6 hrs", from: 550, desc: "Our most-requested length." },
      { name: "Knotless — Waist / Butt",   time: "6 – 8 hrs", from: 700, desc: "Dramatic length, feather-light finish." },
      { name: "Classic Box Braids",        time: "5 – 7 hrs", from: 500, desc: "Defined, square parts in any size." },
    ],
  },
  {
    id: "boho", label: "Boho & Goddess",
    items: [
      { name: "Boho Knotless",             time: "6 – 8 hrs", from: 750, desc: "Knotless braids with soft curly strands throughout." },
      { name: "Goddess Braids",            time: "5 – 7 hrs", from: 650, desc: "Curly ends and face-framing tendrils." },
      { name: "Boho Fulani",               time: "5 – 6 hrs", from: 650, desc: "Fulani pattern meets boho curls." },
    ],
  },
  {
    id: "petite", label: "Little Queens",
    items: [
      { name: "Kids' Cornrows",            time: "1 – 2 hrs", from: 150, desc: "Gentle hands, beads optional, patience guaranteed." },
      { name: "Kids' Knotless",            time: "3 – 4 hrs", from: 300, desc: "Lightweight lengths sized for little heads." },
    ],
  },
  {
    id: "extras", label: "Finishing Touches",
    items: [
      { name: "Wash & Blow-dry",           time: "45 min",    from: 80,  desc: "Clean, detangled, stretched — ready to braid." },
      { name: "Hair Extensions Supplied",  time: "—",         from: 100, desc: "Premium pre-stretched braiding hair, colour-matched." },
      { name: "Gold Cuffs & Beads",        time: "—",         from: 50,  desc: "A little shine to finish the look." },
      { name: "Home Visit",                time: "—",         from: 150, desc: "Wiza comes to you. Priced by distance." },
    ],
  },
];

/* --------------------------------------------------------------------------
   Map pins. Coordinates are in the 1000-wide Zambia map space
   (generated alongside js/zambia-shape.js).
   -------------------------------------------------------------------------- */
window.CITIES = [
  { name: "Lusaka",      x: 539, y: 636, region: "Lusaka Province" },
  { name: "Kabwe",       x: 554, y: 550, region: "Central Province" },
  { name: "Ndola",       x: 570, y: 420, region: "Copperbelt" },
  { name: "Kitwe",       x: 533, y: 405, region: "Copperbelt" },
  { name: "Chingola",    x: 502, y: 381, region: "Copperbelt" },
  { name: "Solwezi",     x: 378, y: 351, region: "North-Western" },
  { name: "Mansa",       x: 592, y: 264, region: "Luapula" },
  { name: "Kasama",      x: 788, y: 177, region: "Northern" },
  { name: "Chipata",     x: 913, y: 479, region: "Eastern" },
  { name: "Mongu",       x: 98,  y: 621, region: "Western" },
  { name: "Choma",       x: 428, y: 758, region: "Southern" },
  { name: "Livingstone", x: 331, y: 849, region: "Southern" },
];
