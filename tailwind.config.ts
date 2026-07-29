import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.tsx",
    "./components/**/*.tsx",
    "./hooks/**/*.tsx",
    "./data/**/*.json",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0A0A0A",
        surface: "#111111",
        border: "#222222",
        "text-body": "#E5E5E5",
        "text-muted": "#888888",
        accent: "#D97706",
        positive: "#34D399",
        negative: "#F87171",
      },
      fontFamily: {
        sans: ["Geist Sans", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      animation: {
        "surge-pulse": "surge-pulse 2s ease-in-out infinite",
        "surge-glow": "surge-glow 3s ease-in-out infinite",
      },
      keyframes: {
        "surge-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(52,211,153,0.5)" },
          "70%": { boxShadow: "0 0 0 8px rgba(52,211,153,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(52,211,153,0)" },
        },
        "surge-glow": {
          "0%, 100%": { boxShadow: "inset 0 0 16px rgba(217,119,6,0.06)" },
          "50%": { boxShadow: "inset 0 0 24px rgba(217,119,6,0.12)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
