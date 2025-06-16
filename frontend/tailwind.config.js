/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A202C', // Dark charcoal for primary text/elements
        secondary: '#A0AEC0', // Muted gray for secondary text/elements
        background: '#F7FAFC', // Light gray for subtle backgrounds
        accent: '#D6BD8A', // Muted gold for accents
        cardBg: '#FFFFFF', // White for card backgrounds
        cardBorder: '#E2E8F0', // Light border for cards
      }
    },
  },
  plugins: [],
}

