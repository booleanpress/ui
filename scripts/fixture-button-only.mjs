// The Button-only fixture: an app that imports nothing but Button installs the packed tarball with the required peers
// only, so it proves that the optional peers of the heavier entries (Chart's recharts, Calendar's react-day-picker,
// Toast's sonner and every other) are not installed for it and that it builds without them.
//
// Usage: node scripts/fixture-button-only.mjs <tarball> [--quiet]
// Prints `[fixture:button-only] …` and exits 1 on any failure.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const fixture = join(root, 'fixture', 'button-only');
const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const tarball = resolve(args.find((arg) => !arg.startsWith('--')));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const dev = pkg.devDependencies;
const run = (cmd, cmdArgs) => execFileSync(cmd, cmdArgs, { cwd: fixture, stdio: quiet ? 'pipe' : 'inherit', encoding: 'utf8' });
const fail = (message) => {
    console.error(`[fixture:button-only] FAIL ${message}`);
    process.exit(1);
};

writeFileSync(join(fixture, 'package.json'), `${JSON.stringify({
    name: 'booleanpress-ui-fixture-button-only',
    private: true,
    type: 'module',
    dependencies: {
        '@booleanpress/ui': `file:${relative(fixture, tarball)}`,
        'lucide-react': dev['lucide-react'],
        'radix-ui': dev['radix-ui'],
        react: dev.react,
        'react-dom': dev['react-dom'],
    },
    devDependencies: {
        '@tailwindcss/vite': dev['@tailwindcss/vite'],
        '@vitejs/plugin-react': dev['@vitejs/plugin-react'],
        tailwindcss: dev.tailwindcss,
        vite: dev.vite,
    },
}, null, 4)}\n`);
rmSync(join(fixture, 'node_modules'), { recursive: true, force: true });
rmSync(join(fixture, 'pnpm-lock.yaml'), { force: true });
run('pnpm', ['install', '--ignore-workspace', '--prefer-offline']);

// pnpm keeps every installed package in node_modules/.pnpm, so an optional peer that came in anyway would be there.
const store = join(fixture, 'node_modules', '.pnpm');
const installed = existsSync(store) ? readdirSync(store) : [];
const optional = Object.keys(pkg.peerDependenciesMeta ?? {});
// pnpm names a package's folder after it, with a scope's slash as "+": `@base-ui/react` is `@base-ui+react@1.8.0…`.
const folderOf = (name) => `${name.replace('/', '+')}@`;
const present = optional.filter((name) => installed.some((dir) => dir.startsWith(folderOf(name))));
if (present.length) fail(`installed ${present.join(', ')} for an app that uses only Button`);

try {
    run('pnpm', ['exec', 'vite', 'build']);
} catch {
    fail('vite build failed');
}
const assets = readdirSync(join(fixture, 'dist', 'assets'));
const js = assets.filter((f) => f.endsWith('.js')).map((f) => readFileSync(join(fixture, 'dist', 'assets', f), 'utf8')).join('\n');
if (!js.includes('data-slot') || !js.includes('Save')) fail('the built app does not hold the Button');

console.log(`[fixture:button-only] installs without the ${optional.length} optional peers · vite build ok`);
