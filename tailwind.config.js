/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './index.html' // Include if you still have a root index.html being used directly
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        // You can extend or override Tailwind's default color palette here
      },
    },
  },
  plugins: [],
}
