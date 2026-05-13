"use client";

import { motion } from "framer-motion";

const DARK = "#0F0F11";
const MUTED = "#6B6B72";
const HAIRLINE = "rgba(15,15,17,0.10)";
const BLUE = "#007AFF";

const STEPS = [
  {
    n: "01",
    title: "submit",
    body: "Drop your URL, an optional reference, your business name, and how to reach you.",
  },
  {
    n: "02",
    title: "style",
    body: "Choose one of six distinct styles and your accent color.",
  },
  {
    n: "03",
    title: "build",
    body: "We scrape your real content, apply the brain, and rebuild your home page.",
  },
  {
    n: "04",
    title: "ship",
    body: "Pushed to GitHub, deployed to Vercel, live URL back in your inbox.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="process"
      className="relative bg-white"
      style={{ borderTop: `1px solid ${HAIRLINE}` }}
    >
      {/* Top metadata strip */}
      <div
        className="flex items-baseline justify-between px-6 py-4 font-mono text-[11px] uppercase tracking-widest md:px-10"
        style={{ color: MUTED }}
      >
        <span>—section · 01</span>
        <span>4 steps · 48hr total</span>
      </div>

      <div className="px-6 md:px-10">
        {/* Huge section title */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-semibold leading-[0.95] tracking-[-0.035em]"
          style={{ color: DARK, fontSize: "clamp(36px, 6vw, 88px)" }}
        >
          process
          <span className="font-light italic tracking-[-0.03em]" style={{ fontSize: "0.55em" }}>
            .
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 max-w-md text-[15px]"
          style={{ color: MUTED }}
        >
          From a single submission to a deployed, live URL — in 48 hours.
        </motion.p>

        {/* 4-column step grid */}
        <ol
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{ borderTop: `1px solid ${HAIRLINE}`, borderLeft: `1px solid ${HAIRLINE}` }}
        >
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative p-6 md:p-8"
              style={{
                color: DARK,
                background: "#FFFFFF",
                borderRight: `1px solid ${HAIRLINE}`,
                borderBottom: `1px solid ${HAIRLINE}`,
              }}
            >
              <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest">
                <span>{step.n}</span>
                <svg width="20" height="10" viewBox="0 0 24 12" fill="none">
                  <path
                    d="M0 6h20M16 1l5 5-5 5"
                    stroke={MUTED}
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
              <h3
                className="mt-16 font-semibold tracking-[-0.03em] leading-[1]"
                style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}
              >
                {step.title}
                <span
                  className="font-light italic"
                  style={{ fontSize: "0.5em" }}
                >
                  .
                </span>
              </h3>
              <p className="mt-4 text-[13px] leading-snug">{step.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Bottom metadata strip */}
      <div
        className="flex items-baseline justify-between px-6 py-4 font-mono text-[11px] uppercase tracking-widest md:px-10"
        style={{ color: MUTED }}
      >
        <span>~/mmwg/process</span>
        <span>end ·</span>
      </div>
    </section>
  );
}
