import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0A0A0A",
        surface: "#111111",
        border: "#222222",
        "text-body": "#E5E5E5",
        "text-muted": "#888888",
        accent: "#5B7FFF",
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
        "blur-in": "blur-in 0.8s cubic-bezier(0.32,0.72,0,1) forwards",
        "fade-in": "fade-in 0.2s ease-out",
        "stagger-1":
          "stagger-in 0.6s cubic-bezier(0.32,0.72,0,1) 100ms forwards",
        "stagger-2":
          "stagger-in 0.6s cubic-bezier(0.32,0.72,0,1) 200ms forwards",
        "stagger-3":
          "stagger-in 0.6s cubic-bezier(0.32,0.72,0,1) 300ms forwards",
        "stagger-4":
          "stagger-in 0.6s cubic-bezier(0.32,0.72,0,1) 400ms forwards",
      },
      keyframes: {
        "blur-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(4rem)",
            filter: "blur(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0)",
          },
        },
        "stagger-in": {
          "0%": { opacity: "0", transform: "translateY(1.5rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
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
