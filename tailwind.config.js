/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0A0E',
        'primary-purple': '#6E42E8',
        'secondary-gray': '#15141A',
        'text-primary': '#F0F0F0',
        'text-secondary': '#A0A0A0',
        'border-color': '#2A292F',
        'canvas-bg': '#0F0E13',
        'canvas-light-bg': '#FFFFFF' // Changed to white as requested
      }
    },
  },
  plugins: [],
}
