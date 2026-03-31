/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/js/**/*.js"

  ],
  theme: {
    extend: {},
    screens:{
      xs:"324px",
      sm:"576px",
      md:"786px",
      lg:"992px",
      xl:"1200px",
       // => @media (min-width: 1200px) { ... }
    },
  },
  darkMode: "class",
  plugins: [require("tw-elements/plugin.cjs")]
}


