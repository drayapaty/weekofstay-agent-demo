/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#0B0F0E',
        'bg-elev': '#121916',
        'bg-card': '#161D1A',
        'cream': '#F4EFE6',
        'cream-dim': '#C9C2B4',
        'ink': '#E8E4DA',
        'muted': '#8B948E',
        'green': '#2EE59D',
        'green-deep': '#0F6B4C',
        'amber': '#F5C451',
        'rose': '#FF6B7A',
        'blue': '#6BB7FF',
      },
    },
  },
  plugins: [],
}
