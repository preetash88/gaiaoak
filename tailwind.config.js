// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sangha: {
                    accent: {
                        DEFAULT: "#FB923C", // main accent
                        600: "#C2410C",
                        50: "#fff7ed",
                        100: "#ffedd5",
                        200: "#fed7aa",
                        300: "#fdba74",
                        400: "#fb923c",
                        700: "#9a2f06",
                    },
                    brandBlue: "#2563EB",
                    rose: "#F472B6",
                    bgLight: "#F7F7FB",
                    bgDark: "#0B1220",
                    surfaceLight: "#EDEFF4",
                    textDark: "#0F172A",
                    textLight: "#E6EEF8",
                },
            },
            boxShadow: {
                "glass-sm": "0 8px 32px rgba(2,6,23,0.08)",
            },
            borderRadius: {
                "lg-2xl": "20px",
            },
        },
    },
    plugins: [],
};
