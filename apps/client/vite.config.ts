import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vitest/config';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        fs: {
            allow: ['../../'],
        },
    },
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    },
    envPrefix: ["VITE_", "TAURI_"],
});
