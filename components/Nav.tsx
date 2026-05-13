"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DARK = "#0F0F11";
const MUTED = "#6B6B72";
const HAIRLINE = "rgba(15,15,17,0.10)";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-40 transition-colors duration-300"
      style={{
        background: scrolled ? "rgba(237, 238, 241, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(140%)" : undefined,
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : undefined,
        borderBottom: scrolled ? `1px solid ${HAIRLINE}` : "1px solid transparent",
      }}
    >
      <div
        className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 md:px-10"
        style={{ color: DARK }}
      >
        <a href="#" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="text-[15px]">MMWG</span>
          <span
            className="hidden font-mono text-[10px] uppercase tracking-[0.18em] md:inline"
            style={{ color: MUTED }}
          >
            / make my website great
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm md:flex" style={{ color: MUTED }}>
          <a href="#process" className="transition-colors hover:text-[#0F0F11]">
            Process
          </a>
          <a href="#styles" className="transition-colors hover:text-[#0F0F11]">
            Styles
          </a>
          <a href="#submit" className="transition-colors hover:text-[#0F0F11]">
            Submit
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <span
            className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] sm:inline-flex"
            style={{ color: MUTED }}
          >
            En:
          </span>
          <a
            href="#submit"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-transform hover:-translate-y-0.5"
            style={{ background: DARK, color: "#FFFFFF" }}
          >
            Start
            <svg width="12" height="8" viewBox="0 0 16 8" fill="none">
              <path
                d="M0 4h14M10 1l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
