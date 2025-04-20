/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'], // ✅ Ensures dark mode works with data-theme="dark"
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        text: "var(--color-text)",
        card: "var(--color-card-bg)",
        border: "var(--color-border)",
        button: "var(--color-button)",
        "button-hover": "var(--color-button-hover)",
      },
    },
  },
  plugins: [],
};
