/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",           // Ye line ensure karti hai ki Tailwind HTML check kare
    "./src/**/*.{js,ts,jsx,tsx}", // Ye aapke components check karega
  ],
  theme: {
    extend: {
      colors: {
      darkBg: '#0f172a',      // Deep Blue/Black background
      cardBg: '#1e293b',      // Slightly lighter card background
      neonGreen: '#10b981',   // Accent color for buttons/indicators
      neonPurple: '#8b5cf6',
      },
    },
  },
  plugins: [],
}
