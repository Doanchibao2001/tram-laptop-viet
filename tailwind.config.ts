import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#9E0A16",
          cta: "#C81020",
          ctaHover: "#9E0A16",
          dark: "#1A1A1A",
          gray: "#4A4A4A",
          bg: "#F5F5F7",
          zalo: "#0068FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam-pro)", "Inter", "sans-serif"],
      },
    },
  },
};

export default config;
