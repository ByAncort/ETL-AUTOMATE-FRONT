/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#f8fafc',
        card: '#ffffff',
        elevated: '#f1f5f9',
        subtle: '#e2e8f0',
        accent: {
          DEFAULT: '#2563eb',
          light: '#eff6ff',
          hover: '#1d4ed8',
        },
      },
      borderColor: {
        DEFAULT: '#e2e8f0',
      },
    },
  },
  plugins: [],
};
