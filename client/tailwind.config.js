/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#090d16', // Obsidian navy main background
          900: '#111726', // Surface cards background
          800: '#1e293b', // Subtle card borders
          700: '#334155', // Hover borders
          400: '#94a3b8', // Muted text
          100: '#f8fafc', // Primary text
        },
        brand: {
          500: '#10b981', // Emerald Green accent
          600: '#059669',
        },
      },
    },
  },
  plugins: [],
}