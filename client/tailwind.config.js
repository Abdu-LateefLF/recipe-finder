/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" }, // Start from left
          "100%": { backgroundPosition: "100% 50%" }, // Move all the way to the right
        },
        popUp: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        gradientShift: "gradientShift 2s linear infinite", // Fast and smooth loop
        popUp: "popUp 0.5s ease-out",
      },
      backgroundSize: {
        "size-200": "200% 200%", // Large enough for smooth movement
      },
    },
  },
  plugins: [],
};
