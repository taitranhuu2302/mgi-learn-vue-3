/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#4AB1FF',
        'primary-500': '#2D5CFE'
      }
    }
  },
  plugins: []
}
