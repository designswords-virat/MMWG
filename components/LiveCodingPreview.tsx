"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DARK = "#0F0F11";
const MUTED = "#6B6B72";
const FAINT = "#A8A8B0";
const HAIRLINE = "rgba(15,15,17,0.10)";
const BLUE = "#007AFF";

type Line = {
  code: string;
  reveal: "badge" | "title" | "tagline" | "cta" | null;
};

const LINES: Line[] = [
  { code: '<div class="hero">', reveal: null },
  { code: '  <span class="badge">live</span>', reveal: "badge" },
  { code: '  <h1>MMWG</h1>', reveal: "title" },
  { code: '  <p>Make My Website Great.</p>', reveal: "tagline" },
  { code: '  <button>Submit yours →</button>', reveal: "cta" },
  { code: "</div>", reveal: null },
];

const TYPE_DELAY = 32;
const PAUSE_AFTER_LINE = 320;
const HOLD_AT_END = 2600;

export default function LiveCodingPreview() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [revealed, setRevealed] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    let line = 0;
    let char = 0;
    let shown: string[] = [];

    const reset = () => {
      if (!alive) return;
      line = 0;
      char = 0;
      shown = [];
      setLineIdx(0);
      setCharIdx(0);
      setRevealed([]);
    };

    const tick = () => {
      if (!alive) return;
      const current = LINES[line];
      if (!current) return;

      if (char < current.code.length) {
        char += 1;
        setCharIdx(char);
        window.setTimeout(tick, TYPE_DELAY);
        return;
      }

      if (current.reveal && !shown.includes(current.reveal)) {
        shown = [...shown, current.reveal];
        setRevealed(shown);
      }

      if (line === LINES.length - 1) {
        window.setTimeout(() => {
          reset();
          window.setTimeout(tick, TYPE_DELAY);
        }, HOLD_AT_END);
        return;
      }

      window.setTimeout(() => {
        if (!alive) return;
        line += 1;
        char = 0;
        setLineIdx(line);
        setCharIdx(0);
        window.setTimeout(tick, TYPE_DELAY);
      }, PAUSE_AFTER_LINE);
    };

    window.setTimeout(tick, TYPE_DELAY);
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      className="grid grid-cols-1 overflow-hidden bg-white"
      style={{ border: `1px solid ${HAIRLINE}` }}
    >
      <CodePanel lineIdx={lineIdx} charIdx={charIdx} />
      <UIPanel revealed={revealed} />
    </div>
  );
}

function CodePanel({ lineIdx, charIdx }: { lineIdx: number; charIdx: number }) {
  return (
    <div className="relative bg-white" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
      <PanelHeader label="code" />

      <div
        className="px-4 pb-5 pt-4 font-mono text-[12.5px] md:text-[13.5px]"
        style={{ color: DARK, lineHeight: 1.85, minHeight: 240 }}
      >
        {LINES.map((line, i) => {
          const showFull = i < lineIdx;
          const showPartial = i === lineIdx;
          const visible = showFull
            ? line.code
            : showPartial
            ? line.code.substring(0, charIdx)
            : "";

          return (
            <div key={i} className="flex items-baseline">
              <span
                className="mr-4 inline-block w-6 shrink-0 select-none text-right"
                style={{ opacity: 0.35 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="whitespace-pre">
                <Highlighted text={visible} />
                {showPartial && (
                  <span
                    className="cursor-blink ml-px inline-block h-[14px] w-[7px] translate-y-[2px]"
                    style={{ background: DARK }}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UIPanel({ revealed }: { revealed: string[] }) {
  return (
    <div className="relative bg-[#F5F5F8]" style={{ color: DARK }}>
      <PanelHeader label="preview" />

      <div
        className="flex flex-col items-start gap-4 px-6 pb-8 pt-6 md:px-8 md:pb-10 md:pt-8"
        style={{ minHeight: 260 }}
      >
        <AnimatePresence mode="popLayout">
          {revealed.includes("badge") && (
            <motion.span
              key="badge"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-widest"
              style={{ border: `1px solid ${HAIRLINE}`, background: "#FFFFFF" }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                  style={{ background: BLUE }}
                />
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ background: BLUE }}
                />
              </span>
              live
            </motion.span>
          )}

          {revealed.includes("title") && (
            <motion.h3
              key="title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-semibold leading-[0.95] tracking-[-0.035em]"
              style={{ fontSize: "clamp(28px, 4vw, 44px)", color: DARK }}
            >
              MMWG
              <span
                className="font-light italic tracking-[-0.03em]"
                style={{ fontSize: "0.5em", color: MUTED }}
              >
                .
              </span>
            </motion.h3>
          )}

          {revealed.includes("tagline") && (
            <motion.p
              key="tagline"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-[14px] leading-snug"
              style={{ color: MUTED }}
            >
              Make My Website Great.
            </motion.p>
          )}

          {revealed.includes("cta") && (
            <motion.a
              key="cta"
              href="#submit"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-transform hover:-translate-y-0.5"
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
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PanelHeader({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5"
      style={{ borderBottom: `1px solid ${HAIRLINE}` }}
    >
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#E0E0E5" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#E0E0E5" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#E0E0E5" }} />
      </div>
      <span
        className="font-mono text-[10.5px] uppercase tracking-widest"
        style={{ color: MUTED }}
      >
        {label}
      </span>
    </div>
  );
}

/* Simple JSX-flavored syntax highlighter — monochrome blue with opacity variations */
function Highlighted({ text }: { text: string }) {
  if (!text) return null;

  // Split into tokens: tags, attrs, strings, text
  const tokens: { type: "tag" | "attr" | "string" | "text" | "punct"; text: string }[] = [];
  const regex = /(<\/?[\w-]+)|(\s[\w-]+=)|("[^"]*")|(>|\/>)|([^<>]+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match[1]) tokens.push({ type: "tag", text: match[1] });
    else if (match[2]) tokens.push({ type: "attr", text: match[2] });
    else if (match[3]) tokens.push({ type: "string", text: match[3] });
    else if (match[4]) tokens.push({ type: "punct", text: match[4] });
    else if (match[5]) tokens.push({ type: "text", text: match[5] });
  }

  return (
    <>
      {tokens.map((t, i) => {
        const opacity =
          t.type === "tag" ? 1 :
          t.type === "punct" ? 0.85 :
          t.type === "attr" ? 0.7 :
          t.type === "string" ? 0.55 :
          0.85;
        const fontStyle = t.type === "string" ? "italic" : "normal";
        return (
          <span key={i} style={{ opacity, fontStyle }}>
            {t.text}
          </span>
        );
      })}
    </>
  );
}
