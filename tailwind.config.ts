import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'amber-bg': '#1A1200',
        'amber-primary': '#FFB000',
        'amber-dim': '#CC8800',
        'amber-muted': '#8B6914',
        'amber-bright': '#FFD040',
        'amber-bezel': '#0D0900',
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },

      },
    },
  },
  plugins: [],
};

export default config;
