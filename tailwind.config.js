/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',    // For App Directory
    './pages/**/*.{js,ts,jsx,tsx}',  // For Pages Directory
    './components/**/*.{js,ts,jsx,tsx}', // If you have components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
