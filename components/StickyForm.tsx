"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * A compact form bar pinned to the bottom of the viewport.
 *
 * Always visible while scrolling so a visitor can start typing their URL
 * without hunting for the form section. When the in-page #submit section
 * comes into view (≥25% visible), the bar auto-hides so it never sits on
 * top of the real form. Submitting the bar pre-fills the URL into the
 * full form via sessionStorage and smooth-scrolls there.
 */
export default function StickyForm() {
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const target = document.getElementById("submit");
    if (!target) return;

    // Only show once visitor has scrolled past the very top (avoids a
    // flash on initial load).
    const onScroll = () => {
      // Re-evaluate visibility on every scroll only if the form section
      // is NOT currently visible — IntersectionObserver controls the
      // hiding side.
      // For showing: gate on scrollY > 200 to avoid load flash.
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const formInView =
            entry.isIntersecting && entry.intersectionRatio > 0.25;
          if (formInView) {
            setVisible(false);
          } else if (window.scrollY >= 200) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 1] },
    );
    io.observe(target);

    // Trigger an initial check so the bar appears as soon as user scrolls
    // past the hero.
    const initialCheck = () => {
      if (window.scrollY >= 200) {
        const rect = target.getBoundingClientRect();
        const inView =
          rect.top < window.innerHeight && rect.bottom > 0 &&
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0) >
            rect.height * 0.25;
        setVisible(!inView);
      }
    };
    window.addEventListener("scroll", initialCheck, { passive: true });
    initialCheck();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", initialCheck);
      io.disconnect();
    };
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const target = document.getElementById("submit");
    if (url.trim()) {
      // Persist the URL so the full form can pre-fill it on mount.
      try {
        sessionStorage.setItem("mmwg:prefill-url", url.trim());
      } catch {
        // sessionStorage can be unavailable in private mode — fine to ignore.
      }
      // Dispatch a custom event so the live Form (if mounted) picks it up
      // without needing a remount.
      window.dispatchEvent(
        new CustomEvent("mmwg:prefill-url", { detail: url.trim() }),
      );
    }
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sticky-form"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-6"
        >
          <div className="mx-auto max-w-3xl">
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 rounded-2xl p-2 backdrop-blur-xl sm:gap-3 sm:rounded-full sm:p-2"
              style={{
                background: "rgba(14, 14, 16, 0.94)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow:
                  "0 16px 40px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.18)",
              }}
            >
              {/* Pulsing accent dot */}
              <span
                className="ml-2 hidden h-2 w-2 flex-shrink-0 sm:flex"
                aria-hidden
              >
                <span
                  className="absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-70"
                  style={{ background: "#7C3AED" }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: "#7C3AED" }}
                />
              </span>

              {/* URL input — primary field */}
              <input
                type="url"
                inputMode="url"
                placeholder="Your website URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[14px] text-white outline-none placeholder:text-white/45 sm:text-[15px]"
                aria-label="Your website URL"
              />

              {/* Submit / Continue */}
              <button
                type="submit"
                className="group inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0F0F11] transition-all hover:gap-2.5 hover:bg-[#7C3AED] hover:text-white sm:rounded-full sm:px-5 sm:text-[14px]"
              >
                <span className="whitespace-nowrap">Submit</span>
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
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
