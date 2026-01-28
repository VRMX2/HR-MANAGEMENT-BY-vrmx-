/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#000000', // Main background
                    800: '#141414', // Sidebar/Cards
                    700: '#1f1f1f', // Borders/Separators
                },
                primary: {
                    500: '#FF5722', // Orange accent (example based on screenshot)
                    600: '#F4511E',
                }
            }
        },
    },
    plugins: [],
}
