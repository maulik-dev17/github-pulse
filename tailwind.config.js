/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base and surface hierarchy (Physical stack of cardstock)
        "surface": "#f6fafe",
        "surface-bright": "#f6fafe",
        "surface-dim": "#d6dade",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0f4f8",
        "surface-container": "#eaeef2",
        "surface-container-high": "#e4e9ed",
        "surface-container-highest": "#dfe3e7",
        "surface-variant": "#dfe3e7",

        // Text & Contrast
        "on-surface": "#171c1f", // Ink text - strictly never #000000
        "on-surface-variant": "#5c3f40",
        "background": "#f6fafe",
        "on-background": "#171c1f",

        // Primary Accent (Pulse Red)
        "primary": "#b80035",
        "primary-container": "#e11d48",
        "on-primary": "#ffffff",
        "on-primary-container": "#fffaf9",
        "primary-fixed-dim": "#ffb3b6",
        "on-primary-fixed-variant": "#920028",

        // Secondary (Technical Slate & Plastic chips)
        "secondary": "#565e74",
        "secondary-container": "#dae2fd",
        "on-secondary-container": "#5c647a",
        "on-secondary": "#ffffff",

        // Fallbacks and status
        "outline-variant": "#e5bdbe",
        "outline": "#906f70",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        "sm": "0.25rem", // 4px - chips
        "DEFAULT": "0.5rem", // 8px
        "md": "0.75rem", // 12px - buttons & cards
        "xl": "1.5rem", // 24px - search bar
        "full": "9999px", // pills
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ['"Space Grotesk"', "monospace", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em", // Headlines tight tracking
      },
      boxShadow: {
        "ghost": "0 12px 40px hsla(222, 47%, 11%, 0.04)",
        "ghost-lg": "0 20px 48px hsla(222, 47%, 11%, 0.08)",
        "pulse": "0 8px 24px rgba(184, 0, 53, 0.22)",
      },
    },
  },
  plugins: [],
}
