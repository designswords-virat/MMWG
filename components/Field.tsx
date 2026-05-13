"use client";

import { forwardRef } from "react";

const DARK = "#0F0F11";
const MUTED = "#6B6B72";
const HAIRLINE = "rgba(15,15,17,0.18)";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, className, ...props },
  ref,
) {
  return (
    <label className="block" style={{ color: DARK }}>
      <div className="mb-1.5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest">
        <span>{label}</span>
        {hint && <span style={{ color: MUTED }}>— {hint}</span>}
      </div>
      <input
        ref={ref}
        {...props}
        className={`w-full bg-transparent py-3 text-[16px] outline-none transition-all duration-200 placeholder:text-[#A8A8B0] ${className ?? ""}`}
        style={{
          borderBottom: `1px solid ${HAIRLINE}`,
          color: DARK,
        }}
      />
      {error && (
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-widest text-red-600">
          — {error}
        </p>
      )}
    </label>
  );
});

export default Field;
