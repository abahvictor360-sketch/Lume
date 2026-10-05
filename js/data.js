// Product catalogue for Lume.
window.LUME_PRODUCTS = [
  {
    id: "helix", name: "Helix Orb", short: ["Helix", "Orb"], price: 185, category: "ambient",
    img: "img/helix.webp",
    tagline: "A marbled glass moon held by a ribbon of brushed brass.",
    description: "Helix Orb pairs a hand-blown marbled glass sphere with a continuous brass ribbon that glows along its inner edge. Two light sources, one sculpture, warm enough for a bedside, striking enough for a console.",
    hotspots: [
      { label: "Marbled Glass", x: 62, y: 22, text: "Hand-blown opal glass with natural marbling diffuses light into a soft, moonlit glow." },
      { label: "Brass Ribbon", x: 38, y: 68, text: "A single bent brass ribbon with an integrated LED strip: no visible bulbs, no harsh hotspots." }
    ],
    specs: { Height: "52 cm", Light: "2700K · 800 lm", Material: "Brass, opal glass", Power: "USB-C, dimmable" }
  },
  {
    id: "aurelia", name: "Aurelia Crystal", short: ["Aurelia", "Crystal"], price: 160, category: "ambient",
    img: "img/aurelia.webp",
    tagline: "Faceted crystal and gilded trim for a timeless bedside.",
    description: "A linen-white shade trimmed in gold sits atop stacked faceted crystals that scatter light across the room. Classic proportions, quietly luxurious.",
    hotspots: [
      { label: "Gilded Trim", x: 66, y: 20, text: "Gold-tone edging frames the shade and catches the light when switched on." },
      { label: "Faceted Crystal", x: 34, y: 62, text: "Two hand-cut crystal orbs refract light into soft prismatic sparkles." }
    ],
    specs: { Height: "48 cm", Light: "2700K · 650 lm", Material: "Crystal, brass, linen", Power: "E27, touch dimmer" }
  },
  {
    id: "cubo", name: "Cubo Glow", short: ["Cubo", "Glow"], price: 140, category: "ambient",
    img: "img/cubo.webp",
    tagline: "Sculpted panels around a pillow of warm light.",
    description: "Cubo Glow wraps a rounded opal core in textured panels that bounce light into a calm, enveloping halo. A small object with a big atmosphere.",
    hotspots: [
      { label: "Soft Diffusion", x: 30, y: 30, text: "An opal core paired with textured panels removes glare entirely." },
      { label: "Sculpted Frame", x: 68, y: 70, text: "Rounded-edge panels angled at 90° create layered shadows on the wall." }
    ],
    specs: { Height: "24 cm", Light: "2400K · 400 lm", Material: "Mineral composite", Power: "USB-C, 3 levels" }
  },
  {
    id: "luma", name: "Luma Mushroom", short: ["Luma", "Mushroom"], price: 120, category: "ambient",
    img: "img/luma.webp",
    tagline: "Swirled shade, ribbed sage base. Playful and warm.",
    description: "The Luma Mushroom pairs a swirl-textured dome with a ribbed sage-green base. Its light pools gently downward, perfect for reading corners and nightstands.",
    hotspots: [
      { label: "Swirl Shade", x: 30, y: 26, text: "A spiralling ridged shade spreads light in a soft gradient." },
      { label: "Ribbed Base", x: 66, y: 72, text: "Fluted sage ceramic base with a weighted, anti-slip foot." }
    ],
    specs: { Height: "30 cm", Light: "2700K · 450 lm", Material: "Ceramic, PLA", Power: "Plug-in, inline switch" }
  },
  {
    id: "halo", name: "Halo Mini", short: ["Halo", "Mini"], price: 90, category: "ambient",
    img: "img/halo.webp",
    tagline: "Soft ambient lighting for cosy evenings and gatherings.",
    description: "A compact linen drum shade on a slender matte stem. Halo Mini is the effortless companion for side tables and shelves.",
    hotspots: [
      { label: "Linen Shade", x: 68, y: 22, text: "Tightly woven linen gives an even, glowing drum of light." },
      { label: "Matte Base", x: 32, y: 78, text: "A powder-coated weighted disc keeps it steady and fingerprint-free." }
    ],
    specs: { Height: "34 cm", Light: "2700K · 500 lm", Material: "Linen, steel", Power: "E14, cord switch" }
  },
  {
    id: "dune", name: "Dune Wave", short: ["Dune", "Wave"], price: 135, category: "ambient",
    img: "img/dune.webp",
    tagline: "Sculpted ripples that turn light into texture.",
    description: "Dune Wave is a printed shade of flowing, wind-swept ridges set on a pale wooden base. Switched on, every ripple catches the glow, casting soft rhythmic shadows across the room.",
    hotspots: [
      { label: "Rippled Shade", x: 66, y: 24, text: "Hundreds of fine ridges flow around the shade, diffusing light into a warm, textured glow." },
      { label: "Ash Wood Base", x: 34, y: 86, text: "A turned ash base with a soft-touch switch and a non-slip underside." }
    ],
    specs: { Height: "32 cm", Light: "2700K · 450 lm", Material: "Plant-based PLA, ash", Power: "USB-C, dimmable" }
  },
  {
    id: "beam", name: "Quiet Beam", short: ["Quiet", "Beam"], price: 150, category: "task",
    img: "img/beam.webp",
    tagline: "An edge-lit column that turns your desk into a calm studio.",
    description: "Quiet Beam hides a full-length LED channel inside a seamless aluminium arm. It washes your workspace evenly with zero flicker and a touch dimmer at its base.",
    hotspots: [
      { label: "Edge-lit LED", x: 66, y: 20, text: "A continuous diffused LED channel along the arm, with no visible diodes." },
      { label: "Touch Dimmer", x: 34, y: 76, text: "Capacitive touch control with stepless dimming and memory." }
    ],
    specs: { Height: "45 cm", Light: "3000–5000K · 900 lm", Material: "Aluminium", Power: "USB-C, touch dimmer" }
  },
  {
    id: "arc", name: "Soft Orbit", short: ["Soft", "Orbit"], price: 110, category: "task",
    img: "img/arc.webp",
    tagline: "A round halo of light on a flexible neck.",
    description: "Soft Orbit's circular head floods your desk with shadow-free light. The silicone neck bends anywhere, and the built-in battery lasts all evening.",
    hotspots: [
      { label: "Halo Head", x: 64, y: 16, text: "A round, frosted diffuser spreads light evenly without glare." },
      { label: "Flexible Neck", x: 32, y: 58, text: "Bend and hold at any angle and the neck remembers its position." }
    ],
    specs: { Height: "40 cm", Light: "3 colour temps · 500 lm", Material: "ABS, silicone", Power: "Rechargeable, 8 h" }
  },
  {
    id: "linea", name: "Linea Clamp", short: ["Linea", "Clamp"], price: 125, category: "task",
    img: "img/linea.webp",
    tagline: "A long, slim light bar on a flexible arm that clamps to any desk.",
    description: "Linea Clamp throws a wide, even wash of light across your whole desk from a slim LED bar. The gooseneck arm bends to any angle and the steel clamp keeps your desk surface clear.",
    hotspots: [
      { label: "Light Bar", x: 64, y: 30, text: "A 45 cm LED bar with an anti-glare diffuser lights the full width of your desk." },
      { label: "Desk Clamp", x: 30, y: 82, text: "A steel clamp fits desks up to 6 cm thick and saves space on the surface." }
    ],
    specs: { Height: "60 cm reach", Light: "3000–6000K · 1000 lm", Material: "Aluminium, steel", Power: "USB, touch dimmer" }
  },
  {
    id: "flex", name: "Flex Task", short: ["Flex", "Task"], price: 85, category: "task",
    img: "img/flex.webp",
    tagline: "Slim bar light with a touch-sensitive base.",
    description: "Flex Task delivers a broad, even bar of light from a slim head on a gooseneck stem. Simple, bright and quiet on the desk.",
    hotspots: [
      { label: "Wide Bar Head", x: 34, y: 14, text: "A wide LED bar evenly lights a full A3 sheet." },
      { label: "Touch Control", x: 68, y: 82, text: "One-touch on/off with three brightness steps." }
    ],
    specs: { Height: "38 cm", Light: "4000K · 450 lm", Material: "ABS", Power: "USB, touch control" }
  },
  {
    id: "spot", name: "Spot Pivot", short: ["Spot", "Pivot"], price: 115, category: "task",
    img: "img/spot.webp",
    tagline: "A matte black cylinder that points the light exactly where you need it.",
    description: "Spot Pivot's cylindrical head rotates on a slim steel stem for precise, focused light. Architectural lines for minimalist workspaces.",
    hotspots: [
      { label: "Pivot Head", x: 72, y: 20, text: "Rotates 350° and tilts 90° for precise direction." },
      { label: "Steel Stem", x: 30, y: 62, text: "A slender powder-coated steel stem on a flat square foot." }
    ],
    specs: { Height: "46 cm", Light: "3000K · 550 lm", Material: "Steel", Power: "GU10, inline switch" }
  },
  {
    id: "noir", name: "Noir Dome", short: ["Noir", "Dome"], price: 105, category: "task",
    img: "img/noir.webp",
    tagline: "Matte black with a warm oak accent.",
    description: "Noir Dome balances a matte black shade with a turned oak cap. A focused downlight that looks as good switched off as on.",
    hotspots: [
      { label: "Oak Accent", x: 60, y: 12, text: "Solid oak cap, hand-finished with natural oil." },
      { label: "Matte Black", x: 28, y: 44, text: "Soft-touch powder coat that resists fingerprints." }
    ],
    specs: { Height: "50 cm", Light: "2700K · 600 lm", Material: "Steel, oak", Power: "E27, cord switch" }
  },
  {
    id: "nord", name: "Nord Classic", short: ["Nord", "Classic"], price: 99, category: "task",
    img: "img/nord.webp",
    tagline: "Scandinavian desk lamp on a solid wood base.",
    description: "Nord Classic pairs a white tilting shade with a solid beech base. A familiar silhouette made with honest materials.",
    hotspots: [
      { label: "Tilting Shade", x: 70, y: 22, text: "Tilt the shade to direct light onto your page or wall." },
      { label: "Wood Base", x: 30, y: 84, text: "Solid beech base with a natural, matte finish." }
    ],
    specs: { Height: "47 cm", Light: "2700K · 600 lm", Material: "Steel, beech", Power: "E27, cord switch" }
  }
];
