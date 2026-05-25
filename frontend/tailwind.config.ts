import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1628",
          50: "#e8ecf4",
          100: "#c5d0e4",
          200: "#9fb0d3",
          300: "#7890c2",
          400: "#5a75b4",
          500: "#3c5aa6",
          600: "#2e4a94",
          700: "#1e3578",
          800: "#12235c",
          900: "#0A1628",
        },
        teal: {
          DEFAULT: "#0E7490",
          50: "#e0f5f9",
          100: "#b3e7f2",
          200: "#80d8e9",
          300: "#4dc8e0",
          400: "#26bcd9",
          500: "#0ab0d3",
          600: "#0E7490",
          700: "#076380",
          800: "#04526e",
          900: "#023c52",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
