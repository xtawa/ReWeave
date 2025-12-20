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
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        maxWidth: '65ch',
                        color: theme('colors.zinc.700'),
                        a: {
                            color: theme('colors.teal.600'),
                            '&:hover': {
                                color: theme('colors.teal.700'),
                            },
                        },
                    },
                },
                invert: {
                    css: {
                        color: theme('colors.zinc.300'),
                        a: {
                            color: theme('colors.teal.400'),
                            '&:hover': {
                                color: theme('colors.teal.300'),
                            },
                        },
                        h1: { color: theme('colors.zinc.100') },
                        h2: { color: theme('colors.zinc.100') },
                        h3: { color: theme('colors.zinc.100') },
                        h4: { color: theme('colors.zinc.100') },
                        code: { color: theme('colors.zinc.100') },
                        strong: { color: theme('colors.zinc.100') },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
