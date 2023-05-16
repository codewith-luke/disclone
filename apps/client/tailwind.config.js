/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: '#263238',
                foreground: '#B0BEC5',
                text: '#607D8B',
                'selection-background': '#546E7A',
                'selection-foreground': '#FFFFFF',
                buttons: {
                    'primary': '#0b7870',
                    'secondary': '#009688',
                    'disabled': '#415967',
                },
                'second-background': '#32424A',
                disabled: '#415967',
                contrast: '#1E272C',
                active: '#314549',
                border: '#2A373E',
                highlight: '#425B67',
                tree: '#546E7A70',
                notifications: '#1E272C',
                accent: '#009688',
                'excluded-files': '#2E3C43',
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar')({nocompatible: true}),
    ],
}
