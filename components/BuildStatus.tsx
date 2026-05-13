"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Stage = {
  icon: string;
  text: string;
  iconClass: string;
};

const STAGES: Stage[] = [
  { icon: "$", text: "git push origin redesign", iconClass: "text-neutral-500" },
  { icon: "▸", text: "Scraping content + assets…", iconClass: "text-[#7C3AED]" },
  { icon: "▸", text: "Applying brain rules…", iconClass: "text-[#7C3AED]" },
  { icon: "▸", text: "Compiling index.html…", iconClass: "text-[#7C3AED]" },
  { icon: "✓", text: "Built in 1.2s", iconClass: "text-emerald-600" },
  { icon: "▸", text: "Deploying to Vercel…", iconClass: "text-[#7C3AED]" },
  { icon: "●", text: "Live · 48-hour average", iconClass: "text-emerald-600" },
];

export default function BuildStatus() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % STAGES.length);
    }, 1900);
    return () => clearInterval(t);
  }, []);

  const stage = STAGES[idx];

  return (
    <div
      className="mx-auto mt-12 inline-flex max-w-full items-center gap-3 rounded-lg border border-[#E8E6E0] bg-white px-4 py-2.5 font-mono text-[12px] shadow-[0_4px_16px_rgba(20,20,40,0.04)]"
      aria-live="polite"
    >
      <span className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-emerald-300" />
      </span>
      <span className="hidden text-neutral-500 sm:inline">~/mmwg</span>
      <span className="hidden text-border sm:inline">·</span>

      <span className="relative inline-flex min-w-0 items-center gap-2 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <span className={`${stage.iconClass} w-3 text-center`}>{stage.icon}</span>
            <span className="text-neutral-900">{stage.text}</span>
          </motion.span>
        </AnimatePresence>
        <span className="cursor-blink ml-0.5 inline-block h-[14px] w-[7px] translate-y-[1px] bg-textPrimary/80" />
      </span>
    </div>
  );
}
