/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'bg-navbar': 'var(--bg-navbar)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-journal-title': 'var(--text-journal-title)',
        'accent': 'var(--accent)',
        'highlight': 'var(--highlight)',
        'border': 'var(--border)',
        'card-bg': 'var(--card-bg)',
        'card-txt': 'var(--card-txt)',
      },
      backgroundColor: {
        'primary': 'var(--bg-primary)',
        'secondary': 'var(--bg-secondary)',
        'navbar': 'var(--bg-navbar)',
        'card': 'var(--card-bg)',
      },
      textColor: {
        'primary': 'var(--text-primary)',
        'secondary': 'var(--text-secondary)',
        'journal-title': 'var(--text-journal-title)',
        'card': 'var(--card-txt)',
      },
      borderColor: {
        'default': 'var(--border)',
      },
      boxShadow: {
        'default': '0 2px 4px var(--shadow)',
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
