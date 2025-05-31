/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#000000',
        'dark-red': '#3D0000',
        'medium-red': '#950101',
        'bright-red': '#FF0000',
      },
    },
  },
  plugins: [],
}