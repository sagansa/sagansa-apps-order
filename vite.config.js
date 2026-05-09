import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: 'localhost',
        },
        cors: {
            origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'https://0738640519d0.ngrok-free.app'],
            credentials: true,
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            }
        }
    },
    define: {
        'process.env.WHATSAPP_ADMIN_NUMBER': JSON.stringify(process.env.WHATSAPP_ADMIN_NUMBER),
    },
});
