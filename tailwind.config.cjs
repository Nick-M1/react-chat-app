/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /bg-(indigo|teal|orange|lime|pink|cyan|purple)-(300|500)/,
      // variants: ['lg', 'hover', 'focus', 'lg:hover'],      // Optional
    },
    {
      pattern: /text-(indigo|teal|orange|lime|pink|cyan|purple)-(300|500)/,
    },
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   'montserrat': ['Montserrat']
      // }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
