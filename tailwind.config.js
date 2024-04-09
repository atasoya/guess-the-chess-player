/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "custom-black": "#222831",
        "custom-grey": "#393E46",
        "custom-turquoise": "#00ADB5",
        "custom-white": "#EEEEEE",
      }
    },
  },
  plugins: [],
}
