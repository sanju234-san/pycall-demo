/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#080810",
        surface: "#0f0f1a",
        elevated: "#16162a",
        cyan: "#00e5ff",
        amber: "#ffaa00",
        crimson: "#ff3366",
        violet: "#7c5cfc",
        primary: "#e8e8f0",
        muted: "#6b6b8a",
        border: "#1e1e3a",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        body: ["DM Sans", "sans-serif"],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'packet-flow': 'packet-flow 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 40px rgba(0, 229, 255, 0.3)' },
        },
      },
    },
  },
  plugins: [],
}

