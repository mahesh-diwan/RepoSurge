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
        terminal: '#FFB000',
        midnight: '#1A1200',
        bone: '#F5F5F0',
        dim: '#999',
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        'crt-sweep': 'crt-sweep 0.6s ease-out forwards',
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        'crt-sweep': {
          '0%': { top: '0', height: '0', opacity: '1' },
          '50%': { height: '2px', opacity: '1' },
          '100%': { top: '100%', height: '0', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
