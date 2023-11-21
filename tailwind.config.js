/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        dark: "#212121",
        error: "#D86161",
        primary: "#1597E4",
        lightDark: "#7A7A7A",
        mediumDark: "#212147",
        lightGray: "#E6E6E6",
        lightBlack: "#000000",
        darkBlack: "#182021",
        borderBlack: "#DADEDF",
      },
      width: {
        popup: "577px",
        image: "48px",
        cardWidth: "830px",
      },
      fontFamily: {
        poppins: ["Poppins"],
      },
    },
  },
  plugins: [],
};
