import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        spray: "#FF3C1A",
        ink: "#0D0D0D",
        concrete: "#F5F0E8",
        shadow: "#3A3A3A",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
};

export default config;
