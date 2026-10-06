import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const here = import.meta.dirname;
const pkg = JSON.parse(readFileSync(resolve(here, 'package.json'), 'utf8'));

// One entry per component, plus the provider and cn(); every source module becomes its own file in dist/, so a
// product's bundler keeps only the components it imports and Tailwind reads each class string as written.
const components = readdirSync(resolve(here, 'src/components')).filter((file) => file.endsWith('.tsx'));
const entries = {
    provider: resolve(here, 'src/provider.tsx'),
    'lib/utils': resolve(here, 'src/lib/utils.ts'),
    ...Object.fromEntries(components.map((file) => [`components/${file.replace(/\.tsx$/, '')}`, resolve(here, 'src/components', file)])),
};

// Peers and dependencies stay imports. So does the provider's own public name: a component reads the provider
// through `@booleanpress/ui/provider`, which a host can map to its single shared copy (an add-on loaded beside its
// base plugin, say).
const bare = [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)];
const external = (id) => id === '@booleanpress/ui/provider' || bare.some((dep) => id === dep || id.startsWith(`${dep}/`));

export default defineConfig({
    plugins: [react()],
    resolve: { alias: { '@': resolve(here, 'src') } },
    build: {
        outDir: resolve(here, 'dist'),
        emptyOutDir: true,
        minify: false,
        sourcemap: false,
        lib: { entry: entries, formats: ['es'] },
        rollupOptions: {
            external,
            output: {
                preserveModules: true,
                preserveModulesRoot: resolve(here, 'src'),
                entryFileNames: '[name].js',
            },
        },
    },
});
