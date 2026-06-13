import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", 
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: "#D35400",
          gold: "#D4AF37",
        },
        brand: {
          bgDark: "#1A1A1A",
          surfaceDark: "#2C2C2C",
          bgLight: "#F5F5F5",
          surfaceLight: "#FFFFFF",
        }
      },
    },
  },
  plugins: [],
};
export default config;