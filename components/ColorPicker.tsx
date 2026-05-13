"use client";

import { motion } from "framer-motion";

const PRESETS = [
  "#7C3AED",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#C8A876",
  "#FAFAFA",
];

export default function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest">
        <span style={{ color: "#FFFFFF" }}>Accent color</span>
        <span style={{ color: "rgba(255,255,255,0.6)" }}>{value}</span>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg"
          style={{ border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-full w-full cursor-pointer border-0 bg-transparent p-0"
            aria-label="Pick a custom color"
          />
        </div>

        <div className="flex flex-1 flex-wrap gap-2">
          {PRESETS.map((hex) => {
            const selected = value.toLowerCase() === hex.toLowerCase();
            return (
              <motion.button
                key={hex}
                type="button"
                onClick={() => onChange(hex)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="h-8 w-8 rounded-full transition-shadow"
                style={{
                  backgroundColor: hex,
                  border: selected ? "2px solid #FFFFFF" : "1px solid rgba(255,255,255,0.15)",
                  boxShadow: selected ? `0 0 22px ${hex}66` : undefined,
                }}
                aria-label={`Use color ${hex}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
