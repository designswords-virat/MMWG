"use client";

import { motion } from "framer-motion";

const DARK = "#0F0F11";
const MUTED = "#6B6B72";
const HAIRLINE = "rgba(15,15,17,0.10)";
const BLUE = "#007AFF";

const STYLES = [
  {
    slug: "modern",
    name: "modern",
    desc: "Clean, contemporary, balanced.",
    preview: (
      <div className="flex h-full w-full flex-col gap-2 bg-white p-3 text-neutral-900">
        <div className="flex items-center justify-between">
          <div className="h-2 w-8 rounded-sm bg-neutral-900" />
          <div className="flex gap-1">
            <div className="h-1 w-3 rounded-sm bg-neutral-400" />
            <div className="h-1 w-3 rounded-sm bg-neutral-400" />
          </div>
        </div>
        <div className="mt-2 h-2.5 w-20 rounded-sm bg-neutral-900" />
        <div className="h-2 w-16 rounded-sm bg-neutral-400" />
        <div className="mt-2 flex items-center gap-2">
          <div className="h-4 w-14 rounded-md bg-indigo-600" />
          <div className="h-4 w-10 rounded-md border border-neutral-300" />
        </div>
        <div className="mt-auto grid grid-cols-3 gap-1.5">
          <div className="aspect-square rounded bg-neutral-100" />
          <div className="aspect-square rounded bg-neutral-100" />
          <div className="aspect-square rounded bg-neutral-100" />
        </div>
      </div>
    ),
  },
  {
    slug: "minimal",
    name: "minimal",
    desc: "Restraint. Hairlines. Whitespace.",
    preview: (
      <div className="flex h-full w-full flex-col bg-[#FAFAF7] p-3 text-black">
        <div className="text-[7px] uppercase tracking-[0.3em] text-neutral-500">
          est. 2026
        </div>
        <div className="mt-3 text-base font-light tracking-tight leading-[0.95]">
          Quiet
          <br />
          design.
        </div>
        <div className="mt-auto space-y-1.5">
          <div className="border-t border-neutral-300" />
          <div className="flex justify-between text-[8px]">
            <span>One</span>
            <span className="text-[#A88B5A]">→</span>
          </div>
          <div className="border-t border-neutral-300" />
          <div className="flex justify-between text-[8px]">
            <span>Two</span>
            <span className="text-[#A88B5A]">→</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "luxury",
    name: "luxury",
    desc: "Serif. Cinematic. Heritage.",
    preview: (
      <div className="relative flex h-full w-full flex-col justify-end overflow-hidden bg-[#14110D] p-3">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, rgba(200,168,118,0.4), transparent 60%)",
          }}
        />
        <div className="relative z-10">
          <div className="text-[7px] uppercase tracking-[0.3em] text-[#B5AB9C]">
            — Featured
          </div>
          <div
            className="mt-1.5 text-xl leading-none text-[#F4F1EA]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Maison
            <span
              className="text-[#C8A876]"
              style={{ fontStyle: "italic", fontWeight: 300 }}
            >
              .
            </span>
          </div>
          <div className="mt-1 text-[7px] uppercase tracking-[0.22em] text-[#B5AB9C]">
            View collection →
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "tech",
    name: "tech",
    desc: "Dark mode. Glow. Monospace.",
    preview: (
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-black p-3">
        <div
          className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-60 blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.7), transparent 65%)",
          }}
        />
        <div className="relative z-10 flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          <span className="font-mono text-[7px] uppercase tracking-widest text-purple-400">
            [ live ]
          </span>
        </div>
        <div
          className="relative z-10 mt-3 bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-base font-bold leading-tight text-transparent"
          style={{ letterSpacing: "-0.03em" }}
        >
          Ship.
          <br />
          Faster.
        </div>
        <div className="relative z-10 mt-auto flex gap-1">
          <div
            className="h-4 w-12 rounded-md bg-purple-600"
            style={{ boxShadow: "0 0 12px rgba(124,58,237,0.6)" }}
          />
          <div className="h-4 w-8 rounded-md border border-white/20" />
        </div>
      </div>
    ),
  },
  {
    slug: "editorial",
    name: "editorial",
    desc: "Magazine-scale type. Drop caps.",
    preview: (
      <div className="flex h-full w-full flex-col bg-[#F4F1EA] p-2.5 text-black">
        <div className="flex items-baseline justify-between border-b border-black/30 pb-1">
          <span className="text-[6px] uppercase tracking-[0.3em] font-bold">
            Issue 01
          </span>
          <span
            className="text-xs"
            style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
          >
            Spread
          </span>
        </div>
        <div className="mt-2 text-2xl font-black leading-[0.85] tracking-[-0.04em]">
          BIG{" "}
          <span
            className="text-[#E63946]"
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            type
          </span>
          .
        </div>
        <div className="mt-auto h-px w-full bg-black/30" />
      </div>
    ),
  },
  {
    slug: "playful",
    name: "playful",
    desc: "Bright. Chunky. Sticker shadows.",
    preview: (
      <div
        className="relative flex h-full w-full flex-col p-2.5"
        style={{
          background: "linear-gradient(135deg,#FFF8E7 0%,#FFD93D 100%)",
        }}
      >
        <div className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-black bg-[#FF6B9D] text-[10px]">
          ✨
        </div>
        <div
          className="mt-auto inline-flex items-center gap-1 self-start rounded-md border-2 border-black bg-white px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide"
          style={{ boxShadow: "3px 3px 0 0 #000" }}
        >
          Hello!
        </div>
        <div
          className="mt-1.5 inline-flex self-start rounded-full border-2 border-black bg-[#FF6B9D] px-2 py-0.5 text-[8px] font-bold text-black"
          style={{ boxShadow: "2px 2px 0 0 #000" }}
        >
          Click →
        </div>
      </div>
    ),
  },
];

export default function StylesShowcase() {
  return (
    <section
      id="styles"
      className="relative"
      style={{ borderTop: `1px solid ${HAIRLINE}`, background: "#EDEEF1" }}
    >
      <div className="px-6 pt-16 md:px-10 md:pt-20">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-semibold leading-[0.95] tracking-[-0.035em]"
          style={{ color: DARK, fontSize: "clamp(36px, 6vw, 88px)" }}
        >
          styles
          <span
            className="font-light italic tracking-[-0.03em]"
            style={{ fontSize: "0.55em", color: MUTED }}
          >
            .
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 max-w-lg text-[15px] leading-snug"
          style={{ color: MUTED }}
        >
          Each style has its own rules — typography, color, motion, components.
          No overlap, no blur. Your site, unmistakable.
        </motion.p>

        <div
          className="mt-16 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3"
          style={{ background: HAIRLINE, border: `1px solid ${HAIRLINE}` }}
        >
          {STYLES.map((style, i) => (
            <motion.article
              key={style.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: (i % 3) * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group bg-white p-5 transition-transform hover:-translate-y-1"
              style={{ color: DARK }}
            >
              <div
                className="relative aspect-[4/3] overflow-hidden bg-[#F5F5F8]"
                style={{ border: `1px solid ${HAIRLINE}` }}
              >
                {style.preview}
              </div>
              <div
                className="mt-4 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest"
                style={{ color: MUTED }}
              >
                <span>0{i + 1}</span>
                <span>—style</span>
              </div>
              <h3
                className="mt-3 font-bold tracking-[-0.04em]"
                style={{ fontSize: "clamp(28px, 3.5vw, 44px)", color: DARK }}
              >
                {style.name}
                <span
                  className="font-light italic"
                  style={{ fontSize: "0.4em", color: MUTED }}
                >
                  .
                </span>
              </h3>
              <p className="mt-1 text-[13px] leading-snug" style={{ color: MUTED }}>
                {style.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>

    </section>
  );
}
