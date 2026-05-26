import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#F0EDE8",
        card: "#FFFFFF",
        border: {
          DEFAULT: "#EEEBE6",
          strong: "#DDD9D3",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#6B6560",
          muted: "#9B9589",
        },
        accent: {
          DEFAULT: "#4F46E5",
          light: "#EEF2FF",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#D97706",
          light: "#FEF9C3",
        },
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
