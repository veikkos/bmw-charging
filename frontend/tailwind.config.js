/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#262626',
        card: '#EFEFEF',
        warning: '#FFF360',
      },
    },
  },
  plugins: [],
}