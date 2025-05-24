/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chartreuse: '#d8c800',
        'blue-iris': '#4120a9',
        'custom-black': '#0a0a0a',
      },
    },
  },
  plugins: [],
}