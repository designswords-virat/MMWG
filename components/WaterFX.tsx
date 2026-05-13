"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const RIPPLE = "#0F0F11";

type Splash = { id: number; x: number; y: number };

/* Tuning — kept here so it's easy to dial */
const MIN_INTERVAL_MS = 200;     // throttle between splashes
const MIN_DISTANCE_PX = 38;      // min cursor travel before a new splash
const SPLASH_BOOST = 5.5;        // displacement added per splash (smaller = smoother ramp-up)
const MAX_TARGET = 14;           // ceiling so spamming clicks doesn't go nuclear
const LERP_RATE = 0.085;         // how fast current value chases target (smaller = smoother)
const TARGET_DECAY = 0.972;      // how fast the target falls back to 0 (closer to 1 = slower settle)

export default function WaterFX({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const last = useRef({ t: 0, x: -9999, y: -9999 });
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const [filterReady, setFilterReady] = useState(false);

  function drop(x: number, y: number) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setSplashes((prev) => [...prev.slice(-5), { id, x, y }]);
    // Push the target up — current value smoothly chases it
    targetRef.current = Math.min(targetRef.current + SPLASH_BOOST, MAX_TARGET);
  }

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();

    const dx = x - last.current.x;
    const dy = y - last.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (now - last.current.t < MIN_INTERVAL_MS) return;
    if (dist < MIN_DISTANCE_PX) return;

    last.current = { t: now, x, y };
    drop(x, y);
  }

  function onEnter(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    last.current = {
      t: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function onClick(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    drop(e.clientX - rect.left, e.clientY - rect.top);
    targetRef.current = Math.min(targetRef.current + 3, MAX_TARGET);
  }

  // Smooth animation loop
  useEffect(() => {
    setFilterReady(true);
    let raf = 0;
    let phase = 0;

    function tick() {
      phase += 0.0065; // slower phase = calmer ambient water

      if (turbRef.current) {
        // Larger, slower waves: lower baseFreq + small modulation
        const freqX = 0.012 + Math.sin(phase) * 0.0025;
        const freqY = 0.016 + Math.cos(phase * 0.6) * 0.003;
        turbRef.current.setAttribute(
          "baseFrequency",
          `${freqX.toFixed(4)} ${freqY.toFixed(4)}`,
        );
      }

      // Smoothly chase the target (lerp), then decay the target gently
      currentRef.current += (targetRef.current - currentRef.current) * LERP_RATE;
      targetRef.current *= TARGET_DECAY;

      if (Math.abs(currentRef.current) < 0.02) currentRef.current = 0;
      if (targetRef.current < 0.02) targetRef.current = 0;

      if (dispRef.current) {
        dispRef.current.setAttribute("scale", currentRef.current.toFixed(2));
      }

      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Garbage-collect old splashes
  useEffect(() => {
    if (splashes.length === 0) return;
    const t = window.setTimeout(() => {
      setSplashes((prev) => prev.filter((s) => Date.now() - s.id < 2800));
    }, 700);
    return () => window.clearTimeout(t);
  }, [splashes]);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onClick={onClick}
      className="relative overflow-hidden"
    >
      {/* SVG filter defs */}
      <svg
        width="0"
        height="0"
        aria-hidden
        style={{ position: "absolute", overflow: "hidden" }}
      >
        <defs>
          <filter
            id="waterfx-displacement"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.012 0.016"
              numOctaves="2"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Children with water displacement applied */}
      <div
        style={{
          filter: filterReady ? "url(#waterfx-displacement)" : undefined,
          willChange: "filter",
        }}
      >
        {children}
      </div>

      {/* Splash rings — rendered above the filter so they stay crisp */}
      <div className="pointer-events-none absolute inset-0">
        <AnimatePresence>
          {splashes.map((s) => (
            <SplashRipple key={s.id} x={s.x} y={s.y} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SplashRipple({ x, y }: { x: number; y: number }) {
  return (
    <>
      <ImpactDot x={x} y={y} />
      <Ring x={x} y={y} maxSize={180} delay={0}    stroke={1.5} opacity={0.35} duration={1.9} />
      <Ring x={x} y={y} maxSize={270} delay={0.15} stroke={1}   opacity={0.25} duration={2.2} />
      <Ring x={x} y={y} maxSize={360} delay={0.32} stroke={0.8} opacity={0.15} duration={2.5} />
    </>
  );
}

function ImpactDot({ x, y }: { x: number; y: number }) {
  return (
    <motion.span
      initial={{ scale: 0.22, opacity: 0.45 }}
      animate={{ scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        left: x - 14,
        top: y - 14,
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: RIPPLE,
        willChange: "transform, opacity",
      }}
    />
  );
}

function Ring({
  x,
  y,
  maxSize,
  delay,
  stroke,
  opacity,
  duration,
}: {
  x: number;
  y: number;
  maxSize: number;
  delay: number;
  stroke: number;
  opacity: number;
  duration: number;
}) {
  return (
    <motion.span
      initial={{ scale: 0.05, opacity }}
      animate={{ scale: 1, opacity: 0 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        left: x - maxSize / 2,
        top: y - maxSize / 2,
        width: maxSize,
        height: maxSize,
        borderRadius: "50%",
        border: `${stroke}px solid ${RIPPLE}`,
        willChange: "transform, opacity",
      }}
    />
  );
}
