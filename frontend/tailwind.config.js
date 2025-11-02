/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8f7ff",
          100: "#f0edff",
          200: "#e4dcff",
          300: "#d1c0ff",
          400: "#b899ff",
          500: "#9c6dff",
          600: "#8b47ff",
          700: "#7c2dff",
          800: "#6b1fff",
          900: "#5a0fff",
        },
        dark: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d9d9de",
          300: "#b8b9c1",
          400: "#92939e",
          500: "#747582",
          600: "#5e5f6a",
          700: "#4d4e56",
          800: "#424349",
          900: "#3a3a3f",
          950: "#1a1a1d",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "dark-gradient":
          "linear-gradient(135deg, #1a1a1d 0%, #2d1b69 50%, #1a1a1d 100%)",
        "purple-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": {
            boxShadow: "0 0 5px #9c6dff, 0 0 10px #9c6dff, 0 0 15px #9c6dff",
          },
          "100%": {
            boxShadow: "0 0 10px #9c6dff, 0 0 20px #9c6dff, 0 0 30px #9c6dff",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
