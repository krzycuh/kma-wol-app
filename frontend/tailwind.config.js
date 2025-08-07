/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          800: '#1f2937',
        },
        purple: {
          300: '#c084fc',
          600: '#9333ea',
          700: '#7c3aed',
        },
        blue: {
          50: '#eff6ff',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        red: {
          500: '#ef4444',
        },
        pink: {
          50: '#fdf2f8',
        },
      },
    },
  },
  plugins: [],
  // Tailwind v4 może wymagać dodatkowych opcji
  experimental: {
    optimizeUniversalDefaults: true
  }
}; 