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
        khair: {
          deepForest: "#073D2C",
          darkGreen: "#052C21",
          botanical: "#426B4E",
          gold: "#C9A34A",
          goldLight: "#DFBF6D",
          goldDark: "#A88330",
          warmIvory: "#FAF7EF",
          softBeige: "#EEE6D7",
          charcoal: "#20251F",
          cream: "#F4EFE6",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-amiri)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(7, 61, 44, 0.06)",
        cardHover: "0 10px 30px -4px rgba(7, 61, 44, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;

