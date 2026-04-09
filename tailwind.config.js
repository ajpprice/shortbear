/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bear: {
          teal: '#1A9E8F',
          tealDark: '#137870',
          tealLight: '#22C4B0',
          tealPale: '#E0F5F3',
          cream: '#FDF9F4',
          brown: '#6B3D2E',
          brownLight: '#A0614E',
          jeans: '#3D5A7A',
          jeansLight: '#5B7FA6',
        },
      },
      animation: {
        'price-up': 'priceFlashRed 0.6s ease-out',
        'price-down': 'priceFlashTeal 0.6s ease-out',
        'card-in': 'cardSlideIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        priceFlashRed: {
          '0%': { backgroundColor: '#fee2e2' },
          '100%': { backgroundColor: 'transparent' },
        },
        priceFlashTeal: {
          '0%': { backgroundColor: '#d1fae5' },
          '100%': { backgroundColor: 'transparent' },
        },
        cardSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
