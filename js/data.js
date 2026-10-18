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

  // Wiza is mobile, based in Kabwe. Towns in this province are her home area;
  // anywhere else carries transport costs on the final bill.
  baseTown: "Kabwe",
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
   Styles & pricing (all prices in Zambian Kwacha).
   `labour`: Wiza's labour for a MEDIUM size, MID-BACK length, client brings hair ("plain").
   `hair`:   what Wiza buys for "non-plain" at medium / mid-back: [packs, kwacha per pack, what].
             A price can be [min, max]: braiding hair is K70 a small pack, K150 a big pack.
   `sizes` / `lengths`: whether the size and length options apply to this style.
   Cheapest to most expensive. Four styles marked `added` were researched additions.
   -------------------------------------------------------------------------- */
window.STYLES = [
  { id: "mukule",         group: "Mukule",    name: "Mukule (Plain)",         labour: 120, hair: [],                                   sizes: false, lengths: false, desc: "Classic Zambian mukule, neat and beautifully finished." },
  { id: "mukule-wig",     group: "Mukule",    name: "Mukule with Wig",        labour: 200, hair: [[1, 350, "wig"]],                    sizes: false, lengths: false, desc: "A mukule base finished with a wig for a full, polished look." },
  { id: "stitch",         group: "Stitch",    name: "Stitch Braids",          labour: 200, hair: [[2, [70, 150], "braiding hair"]], sizes: true,  lengths: false, desc: "Precise stitch lines, straight-back or freestyle: swirls, waves and curves." },
  { id: "stitch-fulani",  group: "Fulani",    name: "Stitch Fulani",          labour: 300, hair: [[4, [70, 150], "braiding hair"]], sizes: true,  lengths: true,  desc: "Fulani pattern with crisp stitch-detailed cornrows at the front." },
  { id: "box",            group: "Box",       name: "Box Braids",             labour: 350, hair: [[5, [70, 150], "braiding hair"]], sizes: true,  lengths: true,  added: true, desc: "Classic square-parted braids. A Southern African favourite that suits everyone." },
  { id: "twists",         group: "Twists",    name: "Passion / Senegalese Twists", labour: 350, hair: [[4, 120, "twist hair"]],        sizes: true,  lengths: true,  added: true, desc: "Soft two-strand twists. Lighter than braids and quick to style." },
  { id: "fishtail-fulani",group: "Fulani",    name: "Fishtail Fulani",        labour: 350, hair: [[4, [70, 150], "braiding hair"]], sizes: true,  lengths: true,  desc: "Fulani styling finished with intricate fishtail braids." },
  { id: "knotless",       group: "Knotless",  name: "Knotless Braids",        labour: 400, hair: [[5, [70, 150], "braiding hair"]], sizes: true,  lengths: true,  desc: "Tension-free from the root, flat and light on the scalp." },
  { id: "goddess",        group: "Goddess",   name: "Goddess Braids",         labour: 450, hair: [[4, [70, 150], "braiding hair"], [2, 160, "curly hair"]], sizes: true, lengths: true, desc: "Braids with soft curly ends and face-framing tendrils." },
  { id: "french-curl",    group: "French Curl", name: "French Curl Braids",   labour: 450, hair: [[4, 150, "French curl hair"]],       sizes: true,  lengths: true,  added: true, desc: "Braids with bouncy curled ends. Soft, glamorous and very on-trend." },
  { id: "locs",           group: "Locs",      name: "Butterfly / Faux Locs",  labour: 500, hair: [[6, 110, "loc / twist hair"]],      sizes: true,  lengths: true,  added: true, desc: "Boho, textured locs without the commitment." },
];

window.PRICING = {
  // [label, labour multiplier, hair multiplier]
  sizes:   [["Large", 0.8, 0.9], ["Medium", 1, 1], ["Small", 1.3, 1.15]],
  lengths: [["Shoulder", 0.85, 0.7], ["Mid-back", 1, 1], ["Waist", 1.2, 1.3], ["Butt", 1.4, 1.6]],
  // Local transport (Yango / taxi) for the whole trip, by town type and where in town.
  areas: ["Town centre", "Residential area", "Outskirts / farm area"],
  local: { home: [50, 100, 150], city: [150, 250, 350], town: [100, 150, 250] },
  // Added when the one-way bus fare is this much or more (a night's stay + meals).
  overnightFrom: 500,
  overnight: 400,
  // Shown as a range: cheapest case × low (rounded down to K50) to dearest case × high (rounded up to K50).
  range: [0.95, 1.1],
};

/* --------------------------------------------------------------------------
   Towns: map position (1000-wide Zambia map space, see js/zambia-shape.js),
   `bus` = one-way bus fare from Kabwe in kwacha, `type` sets the local transport band.
   -------------------------------------------------------------------------- */
window.CITIES = [
  { name: "Kabwe",         x: 554, y: 550, region: "Central Province", bus: 0,   type: "home" },
  { name: "Kapiri Mposhi", x: 574, y: 508, region: "Central Province", bus: 40,  type: "home" },
  { name: "Mkushi",        x: 634, y: 477, region: "Central Province", bus: 100, type: "home" },
  { name: "Serenje",       x: 706, y: 443, region: "Central Province", bus: 150, type: "home" },
  { name: "Lusaka",        x: 539, y: 636, region: "Lusaka Province",  bus: 300, type: "city" },
  { name: "Ndola",         x: 570, y: 420, region: "Copperbelt",       bus: 200, type: "city" },
  { name: "Kitwe",         x: 533, y: 405, region: "Copperbelt",       bus: 250, type: "city" },
  { name: "Chingola",      x: 502, y: 381, region: "Copperbelt",       bus: 280, type: "town" },
  { name: "Solwezi",       x: 378, y: 351, region: "North-Western",    bus: 450, type: "town" },
  { name: "Mansa",         x: 592, y: 264, region: "Luapula",          bus: 500, type: "town" },
  { name: "Kasama",        x: 788, y: 177, region: "Northern",         bus: 650, type: "town" },
  { name: "Chipata",       x: 913, y: 479, region: "Eastern",          bus: 650, type: "town" },
  { name: "Mongu",         x: 98,  y: 621, region: "Western",          bus: 700, type: "town" },
  { name: "Choma",         x: 428, y: 758, region: "Southern",         bus: 550, type: "town" },
  { name: "Livingstone",   x: 331, y: 849, region: "Southern",         bus: 700, type: "town" },
];
