/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        primaryDark: '#4f46e5',
        secondary: '#f59e0b',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f97316',
      },
    },
  },
  plugins: [],
};