/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ocean: {
          DEFAULT: "#12284C",
          dark: "#0A1830",
          light: "#1A3560",
        },
        navy: {
          DEFAULT: "#0A1830",
          light: "#12284C",
        },
        bluegray: {
          DEFAULT: "#5C6B82",
          light: "#7A8FA8",
        },
        silver: {
          DEFAULT: "#E8EEF5",
          light: "#F4F7FB",
          dark: "#D0DAE8",
        },
        skyblue: {
          DEFAULT: "#5FD3B0",
          hover: "#4BBFA0",
          tint: "#ECFAF5",
        },

        // Legacy / Component aliasing for seamless theme coverage
        teal: {
          DEFAULT: "#12284C",
          dark: "#0A1830",
          tint: "#ECFAF5",
          light: "#5FD3B0",
        },
        pink: {
          DEFAULT: "#5FD3B0",
          safe: "#5FD3B0",
          hover: "#4BBFA0",
        },
        brand: {
          blush: "#ECFAF5",
          cream: "#FFFFFF",
          ink: "#0A1830",
          muted: "#5C6B82",
          border: "#E8EEF5",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
