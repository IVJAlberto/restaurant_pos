/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",

        surface: "rgb(var(--surface) / <alpha-value>)",
        surfaceForeground: "rgb(var(--surface-foreground) / <alpha-value>)",

        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },

        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },

        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },

        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",

        brand: {
          1: "#DD2F6E",
          2: "#F44C62",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(180deg, #DD2F6E 0%, #F44C62 100%)",
        "brand-gradient-soft":
          "linear-gradient(180deg, rgb(var(--brand-start)) 0%, rgb(var(--brand-end)) 100%)",
      },
      boxShadow: {
        brand: "0 10px 30px rgba(221, 47, 110, 0.28)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};