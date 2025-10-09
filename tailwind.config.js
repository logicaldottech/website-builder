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
        // Using CSS variables defined in index.css
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-alt': 'var(--surface-alt)',
        elevated: 'var(--elevated)',
        
        primary: {
          DEFAULT: 'var(--primary)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          600: 'var(--accent-600)',
        },

        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',

        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        
        border: 'var(--border)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(16,24,40,.06)',
        sm: '0 2px 8px rgba(16,24,40,.08)',
        md: '0 8px 24px rgba(16,24,40,.10)',
        lg: '0 12px 32px rgba(16,24,40,.12)',
      },
    },
  },
  plugins: [],
}
