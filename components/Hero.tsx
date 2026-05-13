"use client";

import { motion } from "framer-motion";
import LiveCodingPreview from "./LiveCodingPreview";
import WaterFX from "./WaterFX";

const DARK = "#0F0F11";
const MUTED = "#6B6B72";
const HAIRLINE = "rgba(15,15,17,0.10)";

export default function Hero() {
  return (
    <header className="relative pt-24 md:pt-28" style={{ color: DARK }}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Hero content split */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Left: text */}
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3"
              style={{ color: MUTED }}
            >
              <span className="h-px w-6" style={{ backgroundColor: MUTED }} />
              <span className="text-sm">expanding capabilities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-semibold leading-[0.92] tracking-[-0.035em]"
              style={{
                fontSize: "clamp(48px, 9vw, 132px)",
                color: DARK,
              }}
            >
              MMWG
              <span
                className="mt-3 block font-normal leading-[0.95] opacity-90"
                style={{ fontSize: "0.42em", letterSpacing: "-0.025em" }}
              >
                (Make My Website Great.)
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-8 max-w-sm text-[15px] leading-relaxed"
              style={{ color: MUTED }}
            >
              We rebuild your website&apos;s home page in 48 hours — using real
              content, premium assets, and modern motion. Six distinct styles
              across twelve industries.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href="#submit"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{ background: DARK, color: "#FFFFFF" }}
              >
                Submit yours
                <svg width="14" height="8" viewBox="0 0 16 8" fill="none">
                  <path
                    d="M0 4h14M10 1l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </a>
              <a
                href="#process"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors"
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  color: DARK,
                  background: "#FFFFFF",
                }}
              >
                How it works
              </a>
            </motion.div>
          </div>

          {/* Right: showcase visual */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5"
          >
            <WaterFX>
              <LiveCodingPreview />
            </WaterFX>

          </motion.div>
        </div>
      </div>
    </header>
  );
}
