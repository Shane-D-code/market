import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand — Paytm-inspired
        paytm: {
          DEFAULT: "#00BAF2",
          deep: "#002970",
          secondary: "#0078D4",
        },
        lightblue: "#E8F8FD",
        lighterblue: "#F3FBFE",
        // Surfaces & text
        surface: "#F7F9FC",
        ink: "#172B4D",
        inksoft: "#5F6C7B",
        muted: "#8A94A6",
        line: "#E4EAF0",
        // Semantic business states
        success: "#00A86B",
        successsoft: "#E9F8F2",
        warn: "#F59E0B",
        warnsoft: "#FFF7E6",
        danger: "#E53935",
        dangersoft: "#FFF0F0",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "var(--font-inter)",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,43,77,0.04), 0 8px 24px -16px rgba(0,41,112,0.10)",
        pop: "0 2px 6px rgba(23,43,77,0.05), 0 20px 48px -20px rgba(0,41,112,0.28)",
        drawer: "-24px 0 60px -24px rgba(0,41,112,0.22)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
