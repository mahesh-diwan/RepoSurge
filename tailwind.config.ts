import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.tsx",
    "./components/**/*.tsx",
    "./hooks/**/*.tsx",
    "./lib/**/*.ts",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#09090B",
        surface: "#111113",
        "surface-elevated": "#18181B",
        border: "#27272A",
        "border-subtle": "#1E1E21",
        "text-body": "#FAFAFA",
        "text-muted": "#A1A1AA",
        "text-dim": "#71717A",
        accent: "#D97706",
        "accent-dim": "#B45309",
        positive: "#34D399",
        negative: "#F87171",
        warning: "#FBBF24",
        info: "#60A5FA",
      },
      fontFamily: {
        sans: ["Chivo", "system-ui", "sans-serif"],
        mono: ["'Fragment Mono'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        accent: "0 4px 24px -8px rgba(217,119,6,0.15)",
        "accent-lg": "0 8px 40px -12px rgba(217,119,6,0.2)",
        card: "0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        glow: "0 0 20px rgba(217,119,6,0.12)",
      },
      animation: {
        "surge-pulse": "surge-pulse 2s ease-in-out infinite",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-up": "fade-up 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-up": "slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 2s linear infinite",
        "draw-line": "draw-line 0.8s ease-out forwards",
      },
      keyframes: {
        "surge-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(52,211,153,0.5)" },
          "70%": { boxShadow: "0 0 0 8px rgba(52,211,153,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(52,211,153,0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "var(--path-length, 1000)" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
