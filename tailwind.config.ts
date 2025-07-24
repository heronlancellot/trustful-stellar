import { Space_Grotesk } from "next/font/google";

const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        spaceGrotesk: ["var(--font-space-grotesk)"],
        inter: ["var(--font-inter)"],
      },
      colors: {
        brandBlack: "rgba(22, 22, 23, 1)",
        brandWhite: "rgba(245, 255, 255, 1)",
        whiteOpacity008: "rgba(245, 255, 255, 0.08)",
        whiteOpacity005: "rgba(245, 255, 255, 0.05)",
        whiteOpacity05: "rgba(245, 255, 255, 0.5)",
        brandGreen: "rgba(177, 239, 66, 1)",
        othersRed: "rgba(239, 87, 66, 1)",
        darkRedOpacity: "rgba(239, 87, 66, 0.12)",
        grey02: "rgba(45, 46, 47, 1)",
        darkGreenOpacity01: "rgba(211,248,144,0.10)",
        orange: "rgba(255, 165, 0, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
