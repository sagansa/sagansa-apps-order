import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: '#1B3C73',
                secondary: '#FF6B35',
                accent: '#2A9D8F',
                neutral: '#F8F9FA',
                'text-dark': '#2D3748',
                'text-light': '#718096'
            }
        },
    },

    plugins: [forms],
};
