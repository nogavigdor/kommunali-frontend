/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'


export default {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
    "./nuxt.config.{js,ts}",
    "./assets/**/*.css",
  ],
  theme: {
    extend: {
      fontFamily: {
      //  sans: ["Rubik", "Helvetica", "Arial", "sans-serif"], // Default font for the whole app
      //  heading: ["Playfair Display", "serif"], // Font for headings
      sans : ['karla', ...defaultTheme.fontFamily.sans],
      heading : [ 'atma', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brandPrimary: { // Changed from "primary" to avoid conflict with Nuxt UI
          50: '#F4E9F7',
          100: '#E3CDED',
          200: '#D0AEE1',
          300: '#B578CF',
          400: '#9850B6',
          500: '#7B1FA2', // Deep Purple
          600: '#691B8A',
          700: '#52156E',
          800: '#3B0F51',
          900: '#280A3A',
          950: '#14051D'
        },
        brandGray: { // Changed from "gray" to avoid conflict with Nuxt UI
          50: '#F9F9F9',
          100: '#F0F0F0',
          200: '#D9D9D9',
          300: '#B8B8B8',
          400: '#969696',
          500: '#757575',
          600: '#5E5E5E',
          700: '#424242', // Dark Charcoal
          800: '#2C2C2C',
          900: '#1A1A1A',
          950: '#0E0E0E'
        },
        secondary: {
          light: "#FFF59D", // Soft Yellow for backgrounds or highlights
          DEFAULT: "#FFEB3B", // Bright Yellow for calls-to-action
          dark: "#FBC02D", // Deeper Yellow for better readability
        },
        accent: {
          light: "#F48FB1", // Soft Pink for subtle highlights
          DEFAULT: "#EC407A", // Bright Magenta for strong accents
          dark: "#D81B60", // Dark Magenta for contrast and emphasis
        },
        neutral: {
          light: "#F5F5F5", // Light Gray for backgrounds
          DEFAULT: "#CFD8DC", // Medium Gray for borders or cards
          dark: "#424242", // Dark Charcoal for text
        },
        success: {
          light: "#C8E6C9", // Light green for backgrounds
          DEFAULT: "#66BB6A", // Default green for success messages
          dark: "#388E3C" // Darker green for emphasis
        },
        error: {
          light: "#FFCDD2", // Light red for backgrounds
          DEFAULT: "#E57373", // Default red for error messages
          dark: "#D32F2F" // Darker red for emphasis
        },
        alert: {
          light: "#FFE0B2", // Light orange for warning backgrounds
          DEFAULT: "#FFB74D", // Default orange for alert messages
          dark: "#F57C00" // Darker orange for emphasis
        },
      },
      
      spacing: {
        128: "32rem", // Useful for larger sections like hero areas
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem", // Rounded corners for cards and modals to make them more friendly
      },
      boxShadow: {
        soft: "0 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
        medium: "0 6px 12px rgba(0, 0, 0, 0.15)", // Medium shadow for hover effects
        strong: "0 8px 16px rgba(0, 0, 0, 0.2)", // Strong shadow for modals or important components
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#424242", // Ensures sufficient contrast for body text
            a: {
              color: "#7B1FA2", // Links in brandPrimary deep purple
              "&:hover": {
                color: "#EC407A", // Hover state in bright magenta
              },
            },
            h1: {
              color: "#7B1FA2",
            },
            h2: {
              color: "#FFEB3B",
            },
          },
        },
      },
      
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
