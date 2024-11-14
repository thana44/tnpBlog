/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns:{
        "65-35": "1.65fr 1.35fr",
        "70-30": "1.7fr 0.3fr",
      },
      backgroundColor:{
        "bg-or":"rgba(238, 238, 239, 0.567)",
      }
    },
  },
  plugins: [],
}

