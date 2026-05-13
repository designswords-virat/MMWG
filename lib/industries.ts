export type ThemeSlug =
  | "modern"
  | "minimal"
  | "luxury"
  | "tech"
  | "editorial"
  | "playful";

export type Category = {
  code: string; // e.g. "RE-01"
  name: string; // e.g. "Prestige"
  desc: string; // e.g. "luxury developer"
  theme: ThemeSlug; // mapped visual theme used for actual redesign
};

export const INDUSTRIES = [
  { slug: "beauty", label: "Beauty / Wellness / Spa", code: "BW" },
  { slug: "clinics", label: "Clinics / Healthcare", code: "CL" },
  { slug: "ecommerce", label: "E-commerce / Retail", code: "EC" },
  { slug: "education", label: "Education", code: "ED" },
  { slug: "exporters", label: "Exporters", code: "EX" },
  { slug: "fnb", label: "F&B / Restaurants", code: "FB" },
  { slug: "fitness", label: "Fitness / Gyms / Yoga", code: "FT" },
  { slug: "hotels", label: "Hotels", code: "HT" },
  { slug: "jewelry", label: "Jewelry / Watches", code: "JW" },
  { slug: "real-estate", label: "Real Estate", code: "RE" },
  { slug: "tech", label: "Tech / SaaS / Startups", code: "TS" },
  { slug: "wedding", label: "Wedding / Events", code: "WD" },
] as const;

export type IndustrySlug = (typeof INDUSTRIES)[number]["slug"];

/* Each industry's 6 categories each map to a DIFFERENT base theme.
   Guarantees 6 visually distinct previews per industry. */
export const CATEGORIES: Record<IndustrySlug, Category[]> = {
  "real-estate": [
    { code: "RE-01", name: "Prestige", desc: "luxury developer", theme: "luxury" },
    { code: "RE-02", name: "Portfolio", desc: "investor-focused", theme: "modern" },
    { code: "RE-03", name: "Authority", desc: "established firm", theme: "editorial" },
    { code: "RE-04", name: "Escape", desc: "cinematic resort / villa", theme: "tech" },
    { code: "RE-05", name: "Discovery", desc: "explorative new builds", theme: "minimal" },
    { code: "RE-06", name: "Trust", desc: "family-first developer", theme: "playful" },
  ],
  fnb: [
    { code: "FB-01", name: "Fine Dining", desc: "chef-led, tasting menu", theme: "luxury" },
    { code: "FB-02", name: "Casual Warm", desc: "neighborhood spot", theme: "minimal" },
    { code: "FB-03", name: "Editorial", desc: "cookbook / magazine feel", theme: "editorial" },
    { code: "FB-04", name: "Abundance", desc: "buffet / multi-cuisine", theme: "modern" },
    { code: "FB-05", name: "Atmosphere", desc: "bar / lounge / vibe-led", theme: "tech" },
    { code: "FB-06", name: "Street Bold", desc: "QSR / casual high-energy", theme: "playful" },
  ],
  exporters: [
    { code: "EX-01", name: "Heritage", desc: "multi-generational house", theme: "editorial" },
    { code: "EX-02", name: "Global", desc: "international authority", theme: "modern" },
    { code: "EX-03", name: "Industrial", desc: "scale / manufacturing", theme: "tech" },
    { code: "EX-04", name: "Craft", desc: "artisanal export", theme: "playful" },
    { code: "EX-05", name: "Premium", desc: "luxury goods export", theme: "luxury" },
    { code: "EX-06", name: "Minimal", desc: "clean B2B / OEM", theme: "minimal" },
  ],
  clinics: [
    { code: "CL-01", name: "Premium", desc: "concierge medicine", theme: "luxury" },
    { code: "CL-02", name: "Trust", desc: "established practice", theme: "modern" },
    { code: "CL-03", name: "Minimal", desc: "modern dermatology", theme: "minimal" },
    { code: "CL-04", name: "Warm", desc: "family / pediatric", theme: "playful" },
    { code: "CL-05", name: "Tech", desc: "advanced / robotics", theme: "tech" },
    { code: "CL-06", name: "Specialist", desc: "single-focus surgeon", theme: "editorial" },
  ],
  education: [
    { code: "ED-01", name: "Energy", desc: "ed-tech / online", theme: "tech" },
    { code: "ED-02", name: "Authority", desc: "university / institution", theme: "luxury" },
    { code: "ED-03", name: "Community", desc: "alumni / culture-led", theme: "modern" },
    { code: "ED-04", name: "Editorial", desc: "academic publishing feel", theme: "editorial" },
    { code: "ED-05", name: "Bold", desc: "disruptive / new school", theme: "playful" },
    { code: "ED-06", name: "Warm", desc: "early childhood / school", theme: "minimal" },
  ],
  hotels: [
    { code: "HT-01", name: "Luxury", desc: "five-star flagship", theme: "luxury" },
    { code: "HT-02", name: "Boutique", desc: "independent stylish", theme: "minimal" },
    { code: "HT-03", name: "Escape", desc: "cinematic resort / retreat", theme: "tech" },
    { code: "HT-04", name: "Heritage", desc: "palace / historic", theme: "editorial" },
    { code: "HT-05", name: "Design", desc: "design hotel", theme: "modern" },
    { code: "HT-06", name: "Curated", desc: "curated lifestyle", theme: "playful" },
  ],
  ecommerce: [
    { code: "EC-01", name: "Modern", desc: "DTC clean", theme: "modern" },
    { code: "EC-02", name: "Editorial", desc: "story-led product", theme: "editorial" },
    { code: "EC-03", name: "Marketplace", desc: "multi-brand / aggregator", theme: "tech" },
    { code: "EC-04", name: "Luxury", desc: "premium retail", theme: "luxury" },
    { code: "EC-05", name: "Playful", desc: "Gen Z consumer", theme: "playful" },
    { code: "EC-06", name: "Niche", desc: "specialty / single-category", theme: "minimal" },
  ],
  tech: [
    { code: "TS-01", name: "Builder", desc: "dev-tools (Linear / Vercel)", theme: "tech" },
    { code: "TS-02", name: "Enterprise", desc: "serious B2B", theme: "modern" },
    { code: "TS-03", name: "AI Native", desc: "futuristic / Anthropic-style", theme: "luxury" },
    { code: "TS-04", name: "Indie Maker", desc: "friendly bootstrap", theme: "playful" },
    { code: "TS-05", name: "Data", desc: "dashboard / analytics heavy", theme: "editorial" },
    { code: "TS-06", name: "Open Source", desc: "community / docs-led", theme: "minimal" },
  ],
  beauty: [
    { code: "BW-01", name: "Calm", desc: "serene minimal", theme: "minimal" },
    { code: "BW-02", name: "Luxury", desc: "premium spa / resort", theme: "luxury" },
    { code: "BW-03", name: "Natural", desc: "organic / clean beauty", theme: "playful" },
    { code: "BW-04", name: "Editorial", desc: "magazine beauty", theme: "editorial" },
    { code: "BW-05", name: "Clinical", desc: "medical-grade aesthetics", theme: "modern" },
    { code: "BW-06", name: "Sensory", desc: "immersive atmospheric", theme: "tech" },
  ],
  wedding: [
    { code: "WD-01", name: "Romance", desc: "soft elegant", theme: "luxury" },
    { code: "WD-02", name: "Modern", desc: "contemporary minimal", theme: "modern" },
    { code: "WD-03", name: "Heritage", desc: "traditional / cultural", theme: "editorial" },
    { code: "WD-04", name: "Bold", desc: "statement-making", theme: "playful" },
    { code: "WD-05", name: "Destination", desc: "cinematic travel-led", theme: "tech" },
    { code: "WD-06", name: "Boutique", desc: "intimate planner", theme: "minimal" },
  ],
  jewelry: [
    { code: "JW-01", name: "Heritage", desc: "timeless (Tiffany / Cartier)", theme: "luxury" },
    { code: "JW-02", name: "Atelier", desc: "handcrafted", theme: "editorial" },
    { code: "JW-03", name: "Minimal", desc: "modern luxury", theme: "minimal" },
    { code: "JW-04", name: "Statement", desc: "bold editorial", theme: "playful" },
    { code: "JW-05", name: "Cinematic", desc: "campaign / film-led", theme: "tech" },
    { code: "JW-06", name: "Bespoke", desc: "custom / commissions", theme: "modern" },
  ],
  fitness: [
    { code: "FT-01", name: "Performance", desc: "high-energy training", theme: "tech" },
    { code: "FT-02", name: "Studio", desc: "boutique fitness", theme: "modern" },
    { code: "FT-03", name: "Wellness", desc: "yoga / holistic", theme: "minimal" },
    { code: "FT-04", name: "Community", desc: "local club feel", theme: "playful" },
    { code: "FT-05", name: "Premium", desc: "luxury gym", theme: "luxury" },
    { code: "FT-06", name: "Coaching", desc: "personal trainer", theme: "editorial" },
  ],
};

export function findCategory(
  industry: IndustrySlug,
  code: string,
): Category | undefined {
  return CATEGORIES[industry]?.find((c) => c.code === code);
}

export const VALID_CATEGORY_CODES: ReadonlySet<string> = new Set(
  (Object.values(CATEGORIES) as Category[][]).flatMap((arr) =>
    arr.map((c) => c.code),
  ),
);

export function themeFromCategory(code: string): ThemeSlug | null {
  for (const arr of Object.values(CATEGORIES) as Category[][]) {
    const found = arr.find((c) => c.code === code);
    if (found) return found.theme;
  }
  return null;
}
