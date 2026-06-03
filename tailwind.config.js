/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vluma: {
          dark:    '#0D1117',
          card:    '#161B22',
          border:  '#30363D',
          green:   '#2ECC71',
          'green-dark': '#27AE60',
          'green-light': '#E8F8F0',
          gold:    '#F39C12',
          'gold-light': '#FEF9E7',
          red:     '#E74C3C',
          'red-light': '#FDEDEC',
          text:    '#E6EDF3',
          muted:   '#8B949E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
