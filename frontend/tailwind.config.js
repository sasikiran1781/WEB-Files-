/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FCFBF8",
        surface: "#FFFDF9",
        primary: {
          DEFAULT: "#D4AF37", // Metallic Gold
          dark: "#AA8C2C",
          light: "#E5C86C",
        },
        secondary: "#B8860B", // Dark Goldenrod
        accent: "#FBE7A1",    // Light Yellow Gold
        critical: "#EF4444",
        moderate: "#F59E0B",
        excellent: "#10B981",
        info: "#C2A34F", // Subdued Gold for info
      },
      backgroundImage: {
        'premium-gradient': 'radial-gradient(circle at top right, #D4AF371A, transparent), radial-gradient(circle at bottom left, #B8860B0D, transparent)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 175, 55, 0.2)',
        'glow-strong': '0 0 30px rgba(212, 175, 55, 0.4)',
        'glow-secondary': '0 0 20px rgba(184, 134, 11, 0.2)',
        'glow-excellent': '0 0 20px rgba(16, 185, 129, 0.2)',
        'glow-critical': '0 0 20px rgba(239, 68, 68, 0.2)',
        'glow-info': '0 0 20px rgba(194, 163, 79, 0.2)',
      },
      fontFamily: {
        sans: ['"Times New Roman"', 'Times', 'serif'],
        display: ['"Times New Roman"', 'Times', 'serif'],
        accent: ['"Times New Roman"', 'Times', 'serif'],
      }
    },
  },
  plugins: [],
}

