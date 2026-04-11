/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d283a",
        secondary: "#3c83f6",
        accent: "#20d3ee",
        customText: "#344256",
        customBg: "#f8fafc",
        // Editorial Futurity Surface Tokens
        surface: "#f7f9fb",
        "surface-container-low": "#f2f4f6",
        "surface-container-lowest": "#ffffff",
        "surface-variant": "rgba(247, 249, 251, 0.6)",
        "outline-variant": "rgba(197, 198, 205, 0.15)",
      },
      borderRadius: {
        'sq-sm': '12px',
        'sq-md': '20px',
        'sq-lg': '24px',
        'sq-xl': '32px',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'ambient': '0 40px 60px -10px rgba(25, 28, 30, 0.05)',
      }
    },
  },
  plugins: [],
}
