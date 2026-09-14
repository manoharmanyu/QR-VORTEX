import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        foreground: "#f8fafc",
        cyber: {
          950: "#020617",
          900: "#080e1e",
          800: "#0f172a",
          700: "#1e293b",
          blue: "#0070f3",
          cyan: "#00f0ff",
          teal: "#06b6d4",
          neon: "#38bdf8",
          safe: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
          crimson: "#dc2626",
          purple: "#8b5cf6",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "laser-scan": "scan 2.5s ease-in-out infinite alternate",
        "radar-sweep": "sweep 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glitch": "glitch 1s linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { top: "0%", opacity: "0.8" },
          "50%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0.8" },
        },
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "cyber-grid":
          "linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)",
        "radar-conic":
          "conic-gradient(from 0deg, transparent 0deg, rgba(0, 240, 255, 0.15) 300deg, rgba(0, 240, 255, 0.6) 360deg)",
      },
    },
  },
  plugins: [],
};
export default config;
