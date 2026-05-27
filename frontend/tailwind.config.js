/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bdd2ff',
          300: '#8eb3ff',
          400: '#5b8aff',
          500: '#3666ff',
          600: '#2148ee',
          700: '#1b39c5',
          800: '#1a319c',
          900: '#1b2e7a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
