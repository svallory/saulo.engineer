/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: ['class', '.darkmode'],
  safelist: [
    {
      pattern: /col-span-[0-9]+/,
      variants: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  ],
}
