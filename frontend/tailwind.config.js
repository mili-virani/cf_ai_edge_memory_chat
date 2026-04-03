/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chat-bg': '#343541',
        'chat-sidebar': '#202123',
        'chat-bubble-user': '#343541',
        'chat-bubble-ai': '#444654',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

