"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * A floating CTA bar pinned to the bottom of the viewport.
 *
 * Visible while scrolling so the form is always one tap away. Auto-hides
 * when the actual #submit section enters the viewport, so it never sits on
 * top of the real form. Clicking scrolls smoothly to the form.
 */
export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("submit");
    if (!target) return;

    // Show after a tiny scroll so the bar doesn't flash on page load.
    function onScroll() {
      setVisible((prev) => {
        if (window.scrollY < 200) return false;
        return prev;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // Hide whenever the form section is at least 25% visible.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            setVisible(false);
          } else if (window.scrollY >= 200) {
            setVisible(true);
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 1] },
    );
    io.observe(target);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const target = document.getElementById("submit");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sticky-cta"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 sm:pb-6"
        >
          <div className="mx-auto max-w-3xl">
            <div
              className="flex items-center justify-between gap-3 rounded-full px-4 py-3 backdrop-blur-xl sm:px-5 sm:py-3.5"
              style={{
                background: "rgba(15, 15, 17, 0.92)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow:
                  "0 12px 32px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.12)",
              }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="relative flex h-2 w-2 flex-shrink-0"
                  aria-hidden
                >
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                    style={{ background: "#7C3AED" }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: "#7C3AED" }}
                  />
                </span>
                <div className="min-w-0 text-white">
                  <p className="truncate text-[13px] font-medium leading-tight sm:text-[14px]">
                    Want a redesigned home page in 48 hours?
                  </p>
                  <p className="hidden truncate text-[11px] uppercase tracking-widest text-white/55 sm:block">
                    real content · premium assets · modern motion
                  </p>
                </div>
              </div>

              <a
                href="#submit"
                onClick={onClick}
                className="group inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#0F0F11] transition-all hover:gap-2.5 hover:bg-[#7C3AED] hover:text-white sm:px-5 sm:py-2.5"
              >
                <span className="whitespace-nowrap">Submit yours</span>
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 16 8"
                  fill="none"
                  className="transition-transform"
                >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
