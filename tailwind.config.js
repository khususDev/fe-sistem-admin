/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: '#3C50E0',
        secondary: '#80CAEE',
        success: '#219653',
        danger: '#D34053',
        warning: '#FFA70B',
        stroke: '#E2E8F0',
        gray: '#EFF4F5',
        'gray-2': '#F7F9FC',
        boxdark: '#24303F',
        'boxdark-2': '#1A222C',
        strokedark: '#2E3A47',
        body: '#64748B',
        bodydark: '#AEB7C0',
        bodydark2: '#8A99AF',
        'meta-4': '#313D4A',
      },
    },
  },
  plugins: [],
}