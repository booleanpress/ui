import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

const here = import.meta.dirname;

// The test run (Vitest). It uses the component source; the package's own self-reference `@booleanpress/ui/provider`
// points at the provider source, as the library build leaves it external. The documentation site has its own
// configuration in docs/.
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        // The documentation examples import the public entry points; here they resolve to the source.
        alias: [
            { find: '@booleanpress/ui/provider', replacement: resolve(here, 'src/provider.tsx') },
            { find: '@booleanpress/ui/utils', replacement: resolve(here, 'src/lib/utils.ts') },
            { find: /^@booleanpress\/ui\/(.+)$/, replacement: resolve(here, 'src/components/$1') },
            { find: '@', replacement: resolve(here, 'src') },
        ],
    },
    test: {
        root: here,
        include: ['tests/**/*.test.{js,jsx}'],
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup.js'],
        css: false,
        // A test that opens an overlay several times and runs axe on each state takes about a second alone; with 119 files
        // running in parallel it can take several, so the limit is 15 s rather than Vitest's 5 s.
        testTimeout: 15_000,
    },
});
