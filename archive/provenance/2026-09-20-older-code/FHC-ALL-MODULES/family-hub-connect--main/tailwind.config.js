/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        title: ['Nunito', 'sans-serif'],
        special: ['Caveat', 'cursive'],
      },
      keyframes: {
        'slide-down': {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      animation: {
        'slide-down': 'slide-down 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}