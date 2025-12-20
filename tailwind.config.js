/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,ts,jsx,tsx,md}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '65ch',
                        color: '#333',
                        a: {
                            color: '#3182ce',
                            '&:hover': {
                                color: '#2c5282',
                            },
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
