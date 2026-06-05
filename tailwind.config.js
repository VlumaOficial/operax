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
          dark:        '#06101C',
          navy:        '#0C1C2E',
          card:        '#0C1C2E',
          border:      'rgba(255,255,255,0.07)',
          green:       '#1D9E75',
          'green-dark':'#168A64',
          'green-light':'#E1F5EE',
          gold:        '#F39C12',
          'gold-light':'#FEF9E7',
          red:         '#E74C3C',
          'red-light': '#FDEDEC',
          text:        '#EBF2FF',
          muted:       '#6B8EAA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
