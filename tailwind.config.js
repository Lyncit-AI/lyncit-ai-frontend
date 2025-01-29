/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'sora': ['Sora', 'sans-serif']
        },
        colors: {
          primary: "#825C9A", // Main brand color (used for buttons, links, etc.)
          secondary: "#0D0C22", // Dark text color
          accent: "#637083", // Muted text color
          danger: "#FF0000", // Red border for errors
          muted: "#475467", // Used for supporting text
        },
        borderRadius: {
          lg: "8px",
        }
      },
    },
    plugins: [],
  }