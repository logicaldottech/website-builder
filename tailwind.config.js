/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...fontFamily.sans],
      },
      colors: {
        background: '#111827',     // Dark blue-gray, almost black
        secondary: '#1F2937',       // Lighter panel color
        primary: '#3B82F6',         // Vibrant Blue
        destructive: '#EF4444',     // Vibrant Red
        'text-primary': '#F9FAFB',   // Off-white
        'text-secondary': '#9CA3AF', // Muted gray
        border: '#374151',           // Mid-gray for borders
        'canvas-bg': '#000000',      // Pure black for canvas background
        'canvas-light-bg': '#FFFFFF' // White for the actual page canvas
      }
    },
  },
  plugins: [],
}
