/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-blue": "#EEF5FF",
        "md-light-blue": "#B4D4FF",
        blue: "#86B6F6",
        "dark-blue": "#176B87",
      },
    },
  },
  plugins: [],
};
