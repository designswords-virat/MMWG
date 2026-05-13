"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CATEGORIES,
  type Category,
  type IndustrySlug,
  type ThemeSlug,
} from "@/lib/industries";

// Dark surface palette (form is dark-themed).
const TEXT = "#FFFFFF";
const TEXT_MUTED = "rgba(255, 255, 255, 0.6)";
const HAIRLINE = "rgba(255, 255, 255, 0.15)";
const CARD_BG = "#181820";
const CARD_BG_HOVER = "#22222C";
const ACCENT = "#7C3AED";

/* Mini visual previews — one per base theme.
   The mapped theme of a category decides which preview the card shows. */
const PREVIEWS: Record<ThemeSlug, React.ReactNode> = {
  modern: (
    <div className="flex h-full w-full flex-col items-start justify-between bg-white p-3 text-neutral-900">
      <div className="h-1.5 w-8 rounded-full bg-neutral-900" />
      <div className="space-y-1">
        <div className="h-1.5 w-14 rounded-sm bg-neutral-900" />
        <div className="h-1 w-10 rounded-sm bg-neutral-400" />
        <div className="mt-2 h-3 w-12 rounded-md bg-indigo-600" />
      </div>
    </div>
  ),
  minimal: (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white p-3">
      <div className="text-[20px] font-light tracking-tight text-black">m.</div>
      <div className="mt-2 h-px w-8 bg-neutral-300" />
    </div>
  ),
  luxury: (
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
  tech: (
    <div className="relative flex h-full w-full flex-col items-start justify-end overflow-hidden bg-black p-3">
      <div className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 opacity-70 blur-xl" />
      <div className="relative z-10 bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
        ⌘
      </div>
      <div className="relative z-10 mt-1 h-1 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
    </div>
  ),
  editorial: (
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
  playful: (
    <div
      className="flex h-full w-full flex-col items-start justify-center gap-1 p-3"
      style={{
        background:
          "linear-gradient(135deg,#FF6B9D 0%,#FFD93D 50%,#6BCB77 100%)",
      }}
    >
      <div className="rounded-md border-2 border-black bg-white px-2 py-0.5 text-xs font-extrabold text-black shadow-[2px_2px_0_0_#000]">
        P!
      </div>
      <div className="text-xs">✨</div>
    </div>
  ),
};

export default function CategorySelect({
  industry,
  value,
  onChange,
}: {
  industry: IndustrySlug | null;
  value: string | null;
  onChange: (categoryCode: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest">
        <span style={{ color: TEXT }}>Category</span>
        <span style={{ color: TEXT_MUTED }}>
          {!industry
            ? "— pick an industry category first"
            : value
            ? `selected: ${value}`
            : `select one of 6`}
        </span>
      </div>

      {!industry ? (
        <div
          className="flex min-h-[160px] items-center justify-center px-4 text-center font-mono text-[12px] uppercase tracking-widest"
          style={{
            color: TEXT_MUTED,
            border: `1px dashed ${HAIRLINE}`,
            background: CARD_BG,
          }}
        >
          Category options appear once an industry category is selected.
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={industry}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {CATEGORIES[industry].map((cat, i) => (
              <CategoryCard
                key={cat.code}
                category={cat}
                selected={value === cat.code}
                onClick={() => onChange(cat.code)}
                delay={i * 0.05}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function CategoryCard({
  category,
  selected,
  onClick,
  delay,
}: {
  category: Category;
  selected: boolean;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden p-3 text-left transition-colors"
      style={{
        background: selected ? CARD_BG_HOVER : CARD_BG,
        border: `1px solid ${selected ? ACCENT : HAIRLINE}`,
        color: TEXT,
        outline: selected ? `2px solid ${ACCENT}` : "none",
        outlineOffset: selected ? "-3px" : "0",
      }}
    >
      <div
        className="relative h-20 w-full overflow-hidden"
        style={{ border: `1px solid ${HAIRLINE}` }}
      >
        {PREVIEWS[category.theme]}
      </div>
      <div className="mt-3">
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">
          {category.code}
        </div>
        <div className="mt-0.5 text-sm font-semibold">{category.name}</div>
        <div className="mt-0.5 text-xs opacity-75">{category.desc}</div>
      </div>
    </motion.button>
  );
}
