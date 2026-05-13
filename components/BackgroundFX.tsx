"use client";

export default function BackgroundFX() {
  // Esper-style backdrop — soft cool grey, no decorations
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: "#EDEEF1" }}
    />
  );
}
