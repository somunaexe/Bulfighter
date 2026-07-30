/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        generalsans: ['General Sans', 'sans-serif'],
      },
      colors: {
        // black-*/white-* (besides DEFAULT) resolve through CSS variables
        // defined in index.css, which flip between the light (default) and
        // dark theme palettes based on the [data-theme] attribute on <html>.
        // DEFAULT stays a literal fixed color on purpose - it's used for
        // scrims/overlays (video thumbnails, modal backdrops) that should
        // stay dark regardless of site theme.
        black: {
          DEFAULT: '#000',
          100: 'rgb(var(--color-black-100) / <alpha-value>)',
          200: 'rgb(var(--color-black-200) / <alpha-value>)',
          300: 'rgb(var(--color-black-300) / <alpha-value>)',
          500: 'rgb(var(--color-black-500) / <alpha-value>)',
          600: 'rgb(var(--color-black-600) / <alpha-value>)',
        },
        white: {
          DEFAULT: '#FFFFFF',
          800: 'rgb(var(--color-white-800) / <alpha-value>)',
          700: 'rgb(var(--color-white-700) / <alpha-value>)',
          600: 'rgb(var(--color-white-600) / <alpha-value>)',
          500: 'rgb(var(--color-white-500) / <alpha-value>)',
        },
        // Brand palette - the single source of truth for accent colors.
        // Reference these (brand-pink/brand-orange/brand-red) instead of
        // one-off hex codes so the whole site stays in sync.
        brand: {
          pink: '#f038b2',
          orange: '#ff8210',
          red: '#9f0000',
        },
      },
      backgroundImage: {
        terminal: "url('/assets/terminal.png')",
      },
    },
  },
  plugins: [],
};
