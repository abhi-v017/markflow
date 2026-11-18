/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        amoled: {
          DEFAULT: '#000000',
          50: '#1a1a24',
          100: '#14141c',
          200: '#101017',
          300: '#0c0c12',
          400: '#08080d',
          500: '#050508',
          600: '#030305',
          700: '#020203',
          800: '#010102',
          900: '#000000',
        },
        pastel: {
          lavender: '#c4b5fd',
          'lavender-light': '#ddd6fe',
          mint: '#a7f3d0',
          'mint-light': '#d1fae5',
          sky: '#bae6fd',
          'sky-light': '#e0f2fe',
          peach: '#fed7aa',
          'peach-light': '#ffedd5',
          rose: '#fecdd3',
          amber: '#fef08a',
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.75), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'neu-flat': '4px 4px 10px #020204, -4px -4px 10px #0e0e14',
        'neu-inset': 'inset 2px 2px 5px #020204, inset -2px -2px 5px #0e0e14',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
