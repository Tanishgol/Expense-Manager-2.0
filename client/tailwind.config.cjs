/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        xs: "425px", // Custom breakpoint for 425px
        xss: "375px", // Custom breakpoint for 375px
        xsss: "320px", // Custom breakpoint for 320px
      },
    },
  },
  plugins: [],
};