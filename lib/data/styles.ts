export type StyleData = {
  id: string;
  name: string;
  description: string;
  history: string;
  key_characteristics: string[];
  design_tips: string[];
  color_palette: string[];
  metal_finishes: string[];
  wood_finishes: string[];
  display_order: number;
};

export const STYLES: StyleData[] = [
  {
    id: "french-country",
    name: "French Country",
    display_order: 1,
    description:
      "You're drawn to the charm of the French countryside, where elegance meets rustic warmth. Your home tells a story of timeworn beauty — think linen drapes billowing in a summer breeze, distressed wood furniture with graceful curves, and soft floral patterns that feel both lived-in and refined. You appreciate spaces that feel effortlessly put-together, as if they've evolved over generations rather than been carefully styled. This is design for someone who values comfort, history, and quiet beauty.",
    history:
      "French Country style emerged from the rural provinces of France, particularly Provence, in the 17th and 18th centuries. It blended the ornate craftsmanship of Parisian interiors with the rustic practicality of country life. The style came to international prominence in the 20th century as designers celebrated its unpretentious elegance and the timeless appeal of the French provincial home.",
    key_characteristics: [
      "Distressed Wood",
      "Soft Florals",
      "Toile Patterns",
      "Carved Details",
      "Warm Neutrals",
    ],
    design_tips: [
      "Use linen and cotton slipcovers in cream or soft sage for sofas and armchairs.",
      "Mix antique and vintage pieces with modern finds — the contrast adds authenticity.",
      "Incorporate open shelving with French pottery, crockery, and copper cookware.",
      "Add a stone or brick fireplace surround as the heart of the living space.",
      "Use sheer curtains to let light filter softly through windows.",
      "Layer rugs for texture — a sisal base with a floral overlay works beautifully.",
    ],
    color_palette: ["Soft White", "Sage Green", "Dusty Rose", "Warm Beige", "Lavender"],
    metal_finishes: ["Aged Brass", "Wrought Iron", "Antique Gold", "Oil-Rubbed Bronze"],
    wood_finishes: ["Whitewashed Oak", "Distressed Walnut", "Bleached Pine", "Reclaimed Wood"],
  },
  {
    id: "japandi",
    name: "Japandi",
    display_order: 2,
    description:
      "You're a person who finds peace in simplicity. Your ideal home is a sanctuary — uncluttered, intentional, and deeply calming. You appreciate the beauty in natural materials and honest craftsmanship, and you have a talent for making a space feel warm without filling it with things. You gravitate toward objects that have both purpose and beauty, and you believe that what you leave out is just as important as what you put in.",
    history:
      "Japandi is a fusion of Japanese and Scandinavian design philosophies that gained mainstream recognition in the 2010s and 2020s. It draws on Japan's wabi-sabi concept — finding beauty in imperfection and impermanence — and Scandinavia's hygge principle of cozy, functional living. The two cultures share a deep respect for craftsmanship and nature, making their design languages surprisingly complementary and their combined aesthetic uniquely serene.",
    key_characteristics: [
      "Wabi-Sabi",
      "Clean Lines",
      "Natural Materials",
      "Muted Tones",
      "Functional Beauty",
    ],
    design_tips: [
      "Limit your palette to 3–4 earthy tones and resist the urge to add more.",
      "Choose furniture with low profiles and visible joinery that celebrates craft.",
      "Bring in a single statement plant — a fiddle-leaf fig, bonsai, or snake plant.",
      "Use handmade ceramics for tabletop styling instead of matching sets.",
      "Leave surfaces intentionally clear — negative space is part of the design.",
      "Invest in quality over quantity, choosing one beautiful piece over several average ones.",
    ],
    color_palette: ["Warm White", "Charcoal", "Terracotta", "Sage", "Sand"],
    metal_finishes: ["Matte Black", "Brushed Nickel", "Cast Iron", "Blackened Steel"],
    wood_finishes: ["Light Ash", "Bamboo", "Bleached Oak", "Natural Teak"],
  },
  {
    id: "modern-farmhouse",
    name: "Modern Farmhouse",
    display_order: 3,
    description:
      "You love the feeling of coming home — the warmth of a lived-in space that's both cozy and practical. You're drawn to the simplicity of farmhouse life, but with a modern polish that keeps things fresh. Shiplap walls, barn-style doors, and vintage-inspired fixtures speak to you, but so does a clean, uncluttered layout. You want your home to feel like a retreat from the world — unpretentious, welcoming, and full of character.",
    history:
      "Modern Farmhouse style is rooted in the practical, no-frills architecture of American working farms of the 19th and early 20th centuries. It was revitalized in the 2010s, largely driven by designers like Joanna Gaines and the cultural phenomenon of the renovation television genre. The style updated traditional farmhouse aesthetics with cleaner lines and a more neutral, curated palette, making rural warmth accessible to suburban and urban homes alike.",
    key_characteristics: [
      "Shiplap Walls",
      "Barn Doors",
      "Neutral Palette",
      "Rustic Accents",
      "Cozy Textures",
    ],
    design_tips: [
      "Add shiplap or board-and-batten to a feature wall for instant character.",
      "Use a farmhouse apron sink in the kitchen as a functional focal point.",
      "Mix matte black hardware with white cabinetry for a classic contrast.",
      "Layer chunky knit throws and linen pillows on sofas for warmth.",
      "Incorporate a reclaimed wood dining table as the heart of the home.",
      "Hang vintage-style pendant lights over kitchen islands and breakfast bars.",
    ],
    color_palette: ["Crisp White", "Warm Gray", "Matte Black", "Soft Cream", "Sage Green"],
    metal_finishes: ["Matte Black", "Brushed Bronze", "Oil-Rubbed Bronze", "Antique Nickel"],
    wood_finishes: ["Reclaimed Oak", "Weathered Pine", "Whitewashed Wood", "Wire-Brushed Walnut"],
  },
  {
    id: "bohemian",
    name: "Bohemian",
    display_order: 4,
    description:
      "Your home is a living expression of who you are — an eclectic, colorful, deeply personal space that tells the story of everywhere you've been and everything you love. You're not afraid of pattern mixing, global textiles, or an unexpected art piece on the wall. For you, more is more — but in a way that feels intentional and alive, not chaotic. You want your home to feel like a curated collection of beautiful things, layered and rich with personality.",
    history:
      "Bohemian style traces its roots to the 19th-century artistic movements of Europe, where artists, writers, and free spirits in Paris and Prague rejected conventional society and expressed their individualism through their living spaces. The style gained new life in the 1960s and 1970s counterculture movement and has since evolved into a globally-inspired, free-spirited aesthetic that celebrates handcraft, travel, and cultural exchange.",
    key_characteristics: [
      "Global Textiles",
      "Pattern Mixing",
      "Rich Jewel Tones",
      "Macramé & Weaving",
      "Layered Rugs",
    ],
    design_tips: [
      "Layer rugs of different textures and patterns directly on top of each other.",
      "Hang a tapestry or macramé piece as a statement wall instead of framed art.",
      "Mix vintage furniture with handmade global finds from markets and travels.",
      "Use plants abundantly — trailing pothos, hanging ferns, and large tropicals.",
      "Display meaningful objects from travel openly on shelves and tables.",
      "Don't shy away from color — jewel tones and warm earth tones work beautifully together.",
    ],
    color_palette: ["Terracotta", "Saffron", "Deep Teal", "Dusty Rose", "Warm Cream"],
    metal_finishes: ["Aged Copper", "Antique Brass", "Hammered Bronze", "Gold"],
    wood_finishes: ["Dark Walnut", "Carved Mango Wood", "Driftwood", "Ebony"],
  },
  {
    id: "mid-century-modern",
    name: "Mid Century Modern",
    display_order: 5,
    description:
      "You have an eye for good design and a love of the optimistic, forward-thinking spirit of the mid-20th century. Your style is clean without being cold, and retro without being kitsch. You're drawn to iconic forms — the sculptural chair, the walnut sideboard, the sunburst clock — that feel as relevant today as they did in 1960. You value authenticity, craftsmanship, and the idea that great design should be both functional and beautiful.",
    history:
      "Mid Century Modern emerged in the United States and Europe between roughly 1945 and 1969, flourishing in the postwar optimism that drove experimentation in architecture, furniture, and industrial design. Pioneers like Charles and Ray Eames, Eero Saarinen, and Florence Knoll created pieces that broke with Victorian ornamentation in favor of organic forms, new materials like molded fiberglass and bent plywood, and the seamless integration of indoor and outdoor living.",
    key_characteristics: [
      "Organic Forms",
      "Walnut Tones",
      "Tapered Legs",
      "Bold Color Accents",
      "Open Plan Living",
    ],
    design_tips: [
      "Invest in one or two iconic statement pieces — an Eames lounge chair goes a long way.",
      "Keep walls white or light gray to let the furniture be the focal point.",
      "Add a geometric area rug in warm tones — ochre, rust, or olive.",
      "Use sunburst mirrors or abstract expressionist art as wall accents.",
      "Mix warm walnut wood tones with pops of mustard, orange, or avocado green.",
      "Choose a low-profile sofa with clean, straight lines and tapered wooden legs.",
    ],
    color_palette: ["Mustard Yellow", "Avocado Green", "Warm White", "Walnut Brown", "Burnt Orange"],
    metal_finishes: ["Polished Chrome", "Brushed Gold", "Satin Brass", "Stainless Steel"],
    wood_finishes: ["Dark Walnut", "Teak", "Rosewood", "Light Maple"],
  },
  {
    id: "coastal",
    name: "Coastal",
    display_order: 6,
    description:
      "You feel most at home near the water — or at least, you want your home to feel that way. Light, airy, and naturally relaxed, your style draws from the palette of the sea and shore: sandy whites, ocean blues, and weathered textures. You appreciate a home that feels like a breath of fresh air, where the living is easy and every room invites you to slow down. Coastal style for you isn't about themed décor — it's about capturing a feeling.",
    history:
      "Coastal design has roots in the beach cottages and seaside resorts of early 20th-century America and Europe, where whitewashed walls and nautical accents defined summer escapes. Over time it evolved beyond literal nautical themes into a more refined aesthetic that captures the light, texture, and palette of life by the sea. Today it draws influence from Mediterranean, Hamptons, and tropical island design traditions into a style that is universally relaxed and timelessly appealing.",
    key_characteristics: [
      "Natural Light",
      "Ocean Blues",
      "Weathered Textures",
      "Airy Spaces",
      "Natural Fibers",
    ],
    design_tips: [
      "Paint walls in soft white or pale blue-gray to maximize the sense of light.",
      "Use jute, sisal, or seagrass rugs as a natural, textural foundation.",
      "Choose furniture in weathered wood, rattan, or whitewashed finishes.",
      "Layer linen and cotton textiles in whites, creams, and soft blues.",
      "Bring in natural elements like driftwood, sea glass, and woven baskets.",
      "Keep window treatments light and sheer to let the outside world in.",
    ],
    color_palette: ["Ocean Blue", "Sandy Beige", "Seafoam Green", "Crisp White", "Driftwood Gray"],
    metal_finishes: ["Brushed Nickel", "Antique Silver", "Pewter", "Weathered Brass"],
    wood_finishes: ["Whitewashed Pine", "Driftwood", "Weathered Oak", "Bleached Teak"],
  },
  {
    id: "industrial",
    name: "Industrial",
    display_order: 7,
    description:
      "You're drawn to spaces with soul — the kind that feel like they have a history, even if they're brand new. Exposed brick, raw steel, and worn leather speak to you more than polished surfaces and perfect finishes. You appreciate authenticity over ornamentation, and you're not afraid of a space that feels a little rough around the edges. Your home is cool, confident, and unashamedly urban.",
    history:
      "Industrial style emerged from the conversion of factories and warehouses into residential lofts in New York City, particularly in SoHo and TriBeCa, during the 1960s and 1970s. Artists and designers moved into these spaces and began celebrating rather than concealing the raw architectural features — exposed pipes, brick walls, concrete floors, and steel beams. By the 2000s, the aesthetic had been codified into a mainstream design movement embraced far beyond converted lofts.",
    key_characteristics: [
      "Exposed Brick",
      "Raw Steel",
      "Concrete Surfaces",
      "Edison Bulbs",
      "Open Ceilings",
    ],
    design_tips: [
      "Leave brick walls unpainted, or whitewash them lightly for a softer industrial feel.",
      "Use Edison bulb pendants or cage-style fixtures over kitchen islands and dining tables.",
      "Choose furniture with metal frames and dark leather or distressed wood upholstery.",
      "Use a concrete or dark-stained wood dining table as the room's anchor.",
      "Add a steel bookshelf or rolling library ladder for functional drama.",
      "Keep the palette dark and moody — charcoal and black warmed by Edison lighting.",
    ],
    color_palette: [
      "Charcoal Gray",
      "Rust Orange",
      "Raw Concrete",
      "Matte Black",
      "Deep Espresso",
    ],
    metal_finishes: ["Raw Steel", "Black Pipe", "Oxidized Iron", "Aged Copper"],
    wood_finishes: ["Dark Stained Oak", "Reclaimed Barn Wood", "Distressed Walnut", "Ebonized Pine"],
  },
  {
    id: "transitional",
    name: "Transitional",
    display_order: 8,
    description:
      "You like your home to feel both timeless and current — not rigidly traditional, not starkly modern, but somewhere beautifully in between. You appreciate classic architectural details like crown molding and paneling, but you pair them with clean-lined contemporary furniture and a restrained color palette. You're someone who doesn't want to follow any one trend too closely, because you know that good design outlasts all of them.",
    history:
      "Transitional design emerged in the late 20th century as a response to the extremes of both traditional and contemporary design. It found its footing among homeowners and designers who wanted spaces that felt sophisticated and livable without the formality of traditional styles or the austerity of minimalist modernism. Today it is one of the most popular design styles in North America, valued for its broad appeal, adaptability, and enduring relevance.",
    key_characteristics: [
      "Balanced Contrast",
      "Refined Simplicity",
      "Neutral Palette",
      "Quality Materials",
      "Timeless Forms",
    ],
    design_tips: [
      "Pair a classic sofa silhouette with clean-lined, contemporary upholstery fabric.",
      "Mix wood tones intentionally — don't match every piece; contrast adds depth.",
      "Add architectural interest through millwork, wainscoting, or coffered ceilings.",
      "Choose lighting that bridges eras — drum shades or geometric pendants work well.",
      "Keep the palette neutral with one or two richer accent tones for depth.",
      "Invest in quality upholstery — performance velvet or linen stands the test of time.",
    ],
    color_palette: ["Warm White", "Greige", "Soft Navy", "Taupe", "Charcoal"],
    metal_finishes: ["Brushed Nickel", "Polished Nickel", "Champagne Bronze", "Satin Gold"],
    wood_finishes: ["Medium Walnut", "Honey Oak", "Dark Espresso", "Warm Cherry"],
  },
];

export const STYLE_IDS = STYLES.map((s) => s.id);
