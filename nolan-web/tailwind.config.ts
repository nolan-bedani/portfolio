import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#EDEBFF',
          DEFAULT: '#AAB8FF',
          dark: '#6F5BD5',
        },
        neutral: {
          50: '#f8f9fb',
          100: '#f1f3f7',
          200: '#e5e8ef',
          300: '#d2d6df',
          400: '#a3aab7',
          500: '#768099',
          600: '#4d5771',
          700: '#323c53',
          800: '#1e2735',
          900: '#0f1222',
        },
      },
    },
  },
  plugins: [],
}

export default config;