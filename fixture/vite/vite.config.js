import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    root: import.meta.dirname,
    build: { outDir: 'dist', emptyOutDir: true, manifest: 'manifest.json' },
});
