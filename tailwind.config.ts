import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme tokens driven by CSS variables (see globals.css)
        bg: "rgb(var(--bg) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        "panel-raised": "rgb(var(--panel-raised) / <alpha-value>)",
        subtle: "rgb(var(--border-subtle) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--fg-muted) / <alpha-value>)",
        // Brand gold — constant across themes
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F5D061",
          deep: "#A67C00",
        },
        // Graffiti accent palette (from strain artwork) — used sparingly
        graffiti: {
          pink: "#FF4FA3",
          lime: "#A6E22E",
          orange: "#FF8A3D",
          cyan: "#3BD6C6",
        },
        // Dev-brief tokens — strain type badges + verify verdicts
        strain: {
          sativa: "#e0913f", // orange
          indica: "#8b6fc9", // purple
          hybrid: "#5fae7f", // green
        },
        legit: "#22c55e",
        busted: "#ef4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        gta: ["var(--font-gta)", "Impact", "sans-serif"],
        condensed: ["var(--font-condensed)", "Impact", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        "gold-glow": "0 0 24px rgba(212, 175, 55, 0.25)",
        "gold-glow-lg": "0 0 60px rgba(212, 175, 55, 0.28)",
        panel: "0 1px 0 0 rgba(255,255,255,0.03), 0 8px 30px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #F5D061 0%, #D4AF37 45%, #A67C00 100%)",
        "gold-sheen":
          "linear-gradient(135deg, rgba(245,208,97,0.18), rgba(212,175,55,0.06) 40%, transparent 70%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
