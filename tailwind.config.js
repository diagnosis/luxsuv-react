/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#222831',
        'gray-dark': '#393E46',
        'yellow': '#FFD369',
        'light': '#EEEEEE',
      },
    },
  },
  plugins: [],
}