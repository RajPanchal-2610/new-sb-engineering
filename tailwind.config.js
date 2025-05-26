/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#C3CEDA',
        'medium-blue': '#738FA7',
        'dark-blue': '#0C4160',
        'navy': '#071330',
      }
    },
  },
  plugins: [],
}


