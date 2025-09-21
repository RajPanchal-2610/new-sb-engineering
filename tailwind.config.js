  export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
        colors: {
          black: "#000",
          white: "#fff",
          gray: {
            100: "#f5f5f5",
            200: "#e5e5e5",
            400: "#a1a1aa",
            600: "#52525b",
            900: "#18181b"
          },
          accent: "#1f1f1f", // for hover states / buttons
          border: "#e2e2e2",
          star: "#facc15"
        },
        boxShadow: {
          card: "0 0 10px rgba(0,0,0,0.05)",
          hover: "0 10px 20px rgba(0,0,0,0.1)"
        },
        transitionTimingFunction: {
          'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)'
        },
        keyframes: {
          marquee: {
            '0%': { transform: 'translateX(0%)' },
            '100%': { transform: 'translateX(-50%)' },
          },
          slideInLeft: {
            '0%': { opacity: '0', transform: 'translateX(-50px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          slideInRight: {
            '0%': { opacity: '0', transform: 'translateX(50px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
        },
        animation: {
          marquee: 'marquee 6s linear infinite',
          slideInLeft: 'slideInLeft 1s ease-out forwards',
          slideInRight: 'slideInRight 1s ease-out forwards',
        },
      },
    },
    plugins: [],
  }
