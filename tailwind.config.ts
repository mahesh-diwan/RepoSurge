import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: '#0A0A0A',
        surface: '#111111',
        border: '#222222',
        'text-body': '#E5E5E5',
        'text-muted': '#888888',
        accent: '#5B7FFF',
        positive: '#34D399',
        negative: '#F87171',
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
