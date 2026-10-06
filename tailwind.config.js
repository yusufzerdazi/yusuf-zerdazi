import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ['Quicksand', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'modal-in': { from: { opacity: '0', transform: 'translateY(12px) scale(0.97)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'modal-in': 'modal-in 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1) both',
        'fade-in': 'fade-in 0.25s ease-out both',
      },
    },
  },
  plugins: [flowbite.plugin()],
};
