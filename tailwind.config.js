export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    900: 'rgb(var(--color-dark-900) / <alpha-value>)',
                    800: 'rgb(var(--color-dark-800) / <alpha-value>)',
                    700: 'rgb(var(--color-dark-700) / <alpha-value>)',
                },
                // Override white to flip in light mode
                white: 'rgb(var(--color-text-white) / <alpha-value>)',
                // Override gray-400 to darken in light mode
                gray: {
                    400: 'rgb(var(--color-text-gray-400) / <alpha-value>)',
                },
                primary: {
                    500: '#FF5722',
                    600: '#F4511E',
                }
            }
        },
    },
    plugins: [],
}
