/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}","./index.html"],
  theme: {
    extend: {
      keyframes: {
        flicker: {
          '0%, 100%': {translate:0 },
        '50%': {translate: '20px 0'},
        }
      }
    },
    animation: {
      flicker: 'flicker 0.3s 2',
    },
  },
  plugins: [],
}

