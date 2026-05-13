"use client";

import { forwardRef } from "react";

// Dark-themed input for the dark form section.
const TEXT = "#FFFFFF";
const TEXT_MUTED = "rgba(255, 255, 255, 0.6)";
const PLACEHOLDER = "rgba(255, 255, 255, 0.35)";
const HAIRLINE = "rgba(255, 255, 255, 0.18)";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, className, style, ...props },
  ref,
) {
  return (
    <label className="block" style={{ color: TEXT }}>
      <div className="mb-1.5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest">
        <span>{label}</span>
        {hint && <span style={{ color: TEXT_MUTED }}>— {hint}</span>}
      </div>
      <input
        ref={ref}
        {...props}
        className={`w-full bg-transparent py-3 text-[16px] outline-none transition-all duration-200 ${className ?? ""}`}
        style={{
          borderBottom: `1px solid ${HAIRLINE}`,
          color: TEXT,
          // CSS custom property keeps placeholder light against the dark surface.
          ["--tw-placeholder-color" as never]: PLACEHOLDER,
          ...style,
        }}
      />
      {error && (
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-widest text-red-400">
          — {error}
        </p>
      )}
      <style jsx>{`
        input::placeholder {
          color: ${PLACEHOLDER};
        }
      `}</style>
    </label>
  );
});

export default Field;
