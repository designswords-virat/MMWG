import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#EDEEF1",
        surface: "#FFFFFF",
        surfaceElevated: "#F5F5F8",
        border: "#0F0F11",
        textPrimary: "#0F0F11",
        textSecondary: "#4F4F55",
        textMuted: "#8B8B92",
        accent: "#007AFF",
        accentGlow: "rgba(0, 122, 255, 0.20)",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "grid-pulse": "gridPulse 6s ease-in-out infinite",
        "orb-drift": "orbDrift 20s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        gridPulse: {
          "0%, 100%": { opacity: "0.04" },
          "50%": { opacity: "0.08" },
        },
        orbDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.05)" },
          "66%": { transform: "translate(-30px, 40px) scale(0.95)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
