/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,js,mjs}",
    "./projects/**/*.{html,ts,js,mjs}",
  ],
  theme: {
    extend: {
     
      maxWidth: {
        'container': '1600px',
      },
    },
  },
  plugins: [],
}

