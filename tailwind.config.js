/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#f1ead8",
        sand: "#d5c7ad",
        olive: "#bec5a4",
        sage: "#8a8e75",
        bark: "#68604d",
        olivewood: "#2d2f22",
        "wedding-white": "#faf8f9", 
      }
    },
  },
  plugins: [],
}

