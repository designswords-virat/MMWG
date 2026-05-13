"use client";

import { motion } from "framer-motion";

export type ThemeSlug =
  | "modern"
  | "minimal"
  | "luxury"
  | "tech"
  | "editorial"
  | "playful";

type ThemeMeta = {
  slug: ThemeSlug;
  name: string;
  tagline: string;
  preview: React.ReactNode;
};

const THEMES: ThemeMeta[] = [
  {
    slug: "modern",
    name: "Modern",
    tagline: "Clean, balanced, confident.",
    preview: (
      <div className="flex h-full w-full flex-col items-start justify-between bg-white p-3 text-neutral-900">
        <div className="h-1.5 w-8 rounded-full bg-neutral-900" />
        <div className="space-y-1">
          <div className="h-1.5 w-14 rounded-sm bg-neutral-900" />
          <div className="h-1 w-10 rounded-sm bg-neutral-400" />
          <div className="mt-2 h-3 w-12 rounded-md bg-blue-600" />
        </div>
      </div>
    ),
  },
  {
    slug: "minimal",
    name: "Minimal",
    tagline: "Whitespace as the hero.",
    preview: (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white p-3">
        <div className="text-[20px] font-light tracking-tight text-black">m.</div>
        <div className="mt-2 h-px w-8 bg-neutral-300" />
      </div>
    ),
  },
  {
    slug: "luxury",
    name: "Luxury",
    tagline: "Serif. Slow. Considered.",
    preview: (
      <div className="flex h-full w-full flex-col items-start justify-end bg-[#1A1612] p-3">
        <div
          className="text-2xl leading-none text-[#C8A876]"
          style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
        >
          L.
        </div>
        <div className="mt-1 h-px w-6 bg-[#C8A876]/60" />
      </div>
    ),
  },
  {
    slug: "tech",
    name: "Tech",
    tagline: "Dark, glowing, future-facing.",
    preview: (
      <div className="relative flex h-full w-full flex-col items-start justify-end overflow-hidden bg-black p-3">
        <div className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 blur-xl opacity-70" />
        <div
          className="relative z-10 bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-xl font-bold tracking-tight text-transparent"
        >
          ⌘
        </div>
        <div className="relative z-10 mt-1 h-1 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
      </div>
    ),
  },
  {
    slug: "editorial",
    name: "Editorial",
    tagline: "Magazine-scale typography.",
    preview: (
      <div className="flex h-full w-full flex-col items-start justify-between bg-[#F4F1EA] p-3 text-black">
        <div
          className="text-3xl font-bold leading-none"
          style={{ fontFamily: "Georgia, serif" }}
        >
          E
        </div>
        <div className="space-y-1">
          <div className="h-px w-12 bg-[#E63946]" />
          <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
            01 / news
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "playful",
    name: "Playful",
    tagline: "Joyful, vibrant, characterful.",
    preview: (
      <div className="flex h-full w-full flex-col items-start justify-center gap-1 bg-gradient-to-br from-pink-300 via-yellow-200 to-mint-300 p-3" style={{ background: "linear-gradient(135deg,#FF6B9D 0%,#FFD93D 50%,#6BCB77 100%)" }}>
        <div className="rounded-md border-2 border-black bg-white px-2 py-0.5 text-xs font-extrabold text-black shadow-[2px_2px_0_0_#000]">
          P!
        </div>
        <div className="text-xs">✨</div>
      </div>
    ),
  },
];

export default function ThemeSelect({
  value,
  onChange,
}: {
  value: ThemeSlug | null;
  onChange: (slug: ThemeSlug) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-textPrimary">
          Choose a style
        </label>
        <span className="font-mono text-xs text-textMuted">
          {value ? `selected: ${value}` : "select one"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {THEMES.map((t, i) => {
          const selected = value === t.slug;
          return (
            <motion.button
              key={t.slug}
              type="button"
              onClick={() => onChange(t.slug)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.05 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative overflow-hidden rounded-xl border bg-surface/60 p-3 text-left transition-colors ${
                selected
                  ? "border-accent ring-2 ring-accent/60"
                  : "border-border hover:border-textMuted"
              }`}
            >
              <div className="relative h-20 w-full overflow-hidden rounded-md">
                {t.preview}
              </div>
              <div className="mt-3">
                <div className="text-sm font-semibold text-textPrimary">
                  {t.name}
                </div>
                <div className="mt-0.5 text-xs text-textSecondary">
                  {t.tagline}
                </div>
              </div>
              {selected && (
                <motion.div
                  layoutId="theme-selected-glow"
                  className="pointer-events-none absolute inset-0 rounded-xl"
                  style={{
                    boxShadow: "0 0 40px rgba(124, 58, 237, 0.35)",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
