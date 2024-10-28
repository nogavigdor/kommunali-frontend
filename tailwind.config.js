/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#c9f9c8", // Light green
          DEFAULT: "#22c55e", // Default green
          dark: "#15803d", // Dark green
        },
        secondary: {
          light: "#fff3bf", // Soft yellow
          DEFAULT: "#fbbf24", // Vibrant amber
          dark: "#ea580c", // Warm orange
        },
      },
      accent: {
        light: "#fbcfe8", // Light coral
        DEFAULT: "#e879f9", // Lavender
        dark: "#c026d3", // Deep purple
      },
    },
  },
  plugins: [],
};
