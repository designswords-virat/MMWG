"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { INDUSTRIES, type IndustrySlug } from "@/lib/industries";

const TEXT = "#FFFFFF";
const TEXT_MUTED = "rgba(255, 255, 255, 0.6)";
const TEXT_FAINT = "rgba(255, 255, 255, 0.4)";
const HAIRLINE = "rgba(255, 255, 255, 0.18)";
const SURFACE = "#181820";
const SURFACE_HOVER = "#22222C";

/**
 * Custom dropdown for the Industry field on the dark form.
 *
 * Replaces a native <select>/<option> because option-level styling is
 * unreliable across browsers — Windows Chrome in particular ignores
 * background/color on <option>, leaving white text on white background.
 * This component renders a button trigger + an animated dark panel of
 * choices that's fully under our control.
 */
export default function IndustrySelect({
  value,
  onChange,
}: {
  value: IndustrySlug | null;
  onChange: (v: IndustrySlug | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Click outside or Escape closes the menu.
  useEffect(() => {
    if (!open) return;

    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = INDUSTRIES.find((i) => i.slug === value) ?? null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between bg-transparent py-3 pr-8 text-left text-[16px] outline-none transition-colors"
        style={{
          borderBottom: `1px solid ${HAIRLINE}`,
          color: selected ? TEXT : TEXT_FAINT,
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected ? selected.label : "Select industry…"}</span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className="ml-3 transition-transform"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: TEXT_MUTED,
          }}
        >
          <path
            d="M1 1l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            key="industry-menu"
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-lg py-1.5"
            style={{
              background: SURFACE,
              border: `1px solid ${HAIRLINE}`,
              boxShadow:
                "0 16px 40px rgba(0, 0, 0, 0.45), 0 4px 12px rgba(0, 0, 0, 0.25)",
            }}
          >
            {INDUSTRIES.map((ind) => {
              const isSelected = value === ind.slug;
              return (
                <li key={ind.slug}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(ind.slug);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 px-5 py-2.5 text-left text-[15px] transition-colors"
                    style={{
                      color: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.85)",
                      background: isSelected ? SURFACE_HOVER : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLButtonElement).style.background = SURFACE_HOVER;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }
                    }}
                  >
                    <span className="flex-1">{ind.label}</span>
                    {isSelected && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7C3AED"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                        className="flex-shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
