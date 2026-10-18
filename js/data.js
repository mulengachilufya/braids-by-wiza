/* ==========================================================================
   Braids by Wiza — site content
   Everything a non-developer may want to change lives in this one file.
   ========================================================================== */

window.SITE = {
  brand: "Braids by Wiza",
  owner: "Wiza",

  // International format, digits only.
  whatsapp: "260760877104",
  // Calls only (not on WhatsApp).
  phone: "260777091604",
  // Leave "" to hide the link. Instagram coming soon.
  instagram: "",
  tiktok: "",
  email: "",

  // Wiza's base. Towns in this province are within her home area on the map;
  // anywhere else carries transport costs on the final bill.
  baseProvince: "Central Province",
  // Upfront payment that secures an appointment.
  depositPercent: 25,
};

/* --------------------------------------------------------------------------
   The Lookbook — real work by Wiza. `tags` drive the filters on work.html;
   `fit` is [length, vibe, time-in-chair] used by the homepage Style Finder.
   -------------------------------------------------------------------------- */
window.LOOKS = [
  { id: "honey-wave",     img: "assets/work/style-3.webp", title: "Honey Wave Stitch Bun",         tags: ["stitch", "updo"],      fit: ["shoulder", "romantic", "half"], note: "Sculpted stitch waves with honey-blonde accents, swept into a soft low bun." },
  { id: "knotless-curls", img: "assets/work/style-2.webp", title: "Waist-Length Knotless",         tags: ["knotless"],            fit: ["long", "romantic", "long"], note: "Feather-light knotless braids with curly ends that move like silk." },
  { id: "swirl",          img: "assets/work/style-7.webp", title: "Swirl Stitch Braids",           tags: ["stitch", "design"],    fit: ["long", "bold", "half"], note: "Freehand swirls finished with long side braids." },
  { id: "freestyle",      img: "assets/work/style-1.webp", title: "Freestyle Stitch Braids",       tags: ["stitch", "design"],    fit: ["shoulder", "bold", "half"], note: "Stitch-detailed freestyle pattern with curly, flowing ends." },
  { id: "classic-stitch", img: "assets/work/style-4.webp", title: "Classic Stitch Braids",         tags: ["stitch"],              fit: ["short", "classic", "quick"], note: "Clean, straight-back stitch lines. Timeless and neat." },
  { id: "sculpted",       img: "assets/work/style-5.webp", title: "Sculpted Curve Stitch",         tags: ["stitch", "design"],    fit: ["short", "bold", "quick"], note: "Petite curved parts that frame the face beautifully." },
  { id: "spiral",         img: "assets/work/style-6.webp", title: "Spiral Stitch Design",          tags: ["stitch", "design"],    fit: ["short", "bold", "half"], note: "A spiral crown of fine stitch braids." },
];

window.LOOK_FILTERS = [
  { id: "all", label: "All" },
  { id: "stitch", label: "Stitch" },
  { id: "knotless", label: "Knotless" },
  { id: "design", label: "Freestyle designs" },
  { id: "updo", label: "Updos" },
];

/* --------------------------------------------------------------------------
   The Menu — Wiza's services.
   Set `from` to a number (e.g. from: 450) to show a starting price;
   leave it null to show "Quote on WhatsApp".
   -------------------------------------------------------------------------- */
window.MENU = [
  { group: "Knotless",  name: "Knotless Braids",  from: null, desc: "Tension-free from the root, flat and light on the scalp, in the length and size you choose." },
  { group: "Fulani",    name: "Stitch Fulani",    from: null, desc: "Fulani pattern with crisp stitch-detailed cornrows at the front." },
  { group: "Fulani",    name: "Fishtail Fulani",  from: null, desc: "Fulani styling finished with intricate fishtail braids." },
  { group: "Stitch",    name: "Stitch Braids",    from: null, desc: "Precise stitch lines, straight-back or freestyle: swirls, waves and curves." },
  { group: "Goddess",   name: "Goddess Braids",   from: null, desc: "Braids with soft curly ends and face-framing tendrils." },
  { group: "Mukule",    name: "Mukule (Plain)",   from: null, desc: "Classic Zambian mukule, neat and beautifully finished." },
  { group: "Mukule",    name: "Mukule with Wig",  from: null, desc: "A mukule base finished with a wig for a full, polished look." },
];

/* --------------------------------------------------------------------------
   Map pins. Coordinates are in the 1000-wide Zambia map space
   (generated alongside js/zambia-shape.js).
   -------------------------------------------------------------------------- */
window.CITIES = [
  { name: "Kabwe",         x: 554, y: 550, region: "Central Province" },
  { name: "Kapiri Mposhi", x: 574, y: 508, region: "Central Province" },
  { name: "Mkushi",        x: 634, y: 477, region: "Central Province" },
  { name: "Serenje",       x: 706, y: 443, region: "Central Province" },
  { name: "Lusaka",        x: 539, y: 636, region: "Lusaka Province" },
  { name: "Ndola",         x: 570, y: 420, region: "Copperbelt" },
  { name: "Kitwe",         x: 533, y: 405, region: "Copperbelt" },
  { name: "Chingola",      x: 502, y: 381, region: "Copperbelt" },
  { name: "Solwezi",       x: 378, y: 351, region: "North-Western" },
  { name: "Mansa",         x: 592, y: 264, region: "Luapula" },
  { name: "Kasama",        x: 788, y: 177, region: "Northern" },
  { name: "Chipata",       x: 913, y: 479, region: "Eastern" },
  { name: "Mongu",         x: 98,  y: 621, region: "Western" },
  { name: "Choma",         x: 428, y: 758, region: "Southern" },
  { name: "Livingstone",   x: 331, y: 849, region: "Southern" },
];
