/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-light-gray": "#FBFBFB",
      },
      fontFamily: {
        "lato-black": ["lato-black"],
        "lato-bold": ["lato-bold"],
        "lato-regular": ["lato-regular"],
        "lato-light": ["lato-light"],
        "lato-thin": ["lato-thin"],
      },
    },
  },
  plugins: [],
};
