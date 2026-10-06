// The Vite fixture: installs the packed tarball into fixture/vite (a minimal consumer app), pastes the documented
// Checkbox example verbatim, builds the app, and checks it in a browser. Proves the exports map, theme.css and its
// `@source`, the peer setup, that no `@/` alias or other repository-only path leaked into dist/, and that copied
// documentation code works.
//
// Usage: node scripts/fixture-vite.mjs <tarball> [--quiet]
// Prints `[fixture:vite] …` and exits 1 on any failure.
import { execFileSync, spawn } from 'node:child_process';
import { copyFileSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '..');
const fixture = join(root, 'fixture', 'vite');
const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const tarball = resolve(args.find((arg) => !arg.startsWith('--')));
const dev = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).devDependencies;
const run = (cmd, cmdArgs, cwd) => execFileSync(cmd, cmdArgs, { cwd, stdio: quiet ? 'pipe' : 'inherit', encoding: 'utf8' });
const fail = (message) => {
    console.error(`[fixture:vite] FAIL ${message}`);
    process.exit(1);
};

// 1. The tarball holds what it must, and nothing private.
const listing = execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' });
for (const required of ['package/dist/provider.js', 'package/dist/provider.d.ts', 'package/dist/components/dialog.js', 'package/dist/components/dialog.d.ts', 'package/dist/docs/llms.txt', 'package/theme.css', 'package/bin/bui-contrast.mjs', 'package/LICENSE', 'package/NOTICE']) {
    if (!listing.includes(required)) fail(`${basename(tarball)} lacks ${required.replace('package/', '')}`);
}
for (const forbidden of ['package/baseline/', 'package/tests/', 'package/fixture/', 'package/docs/', 'package/examples/', 'package/office/', 'package/node_modules/']) {
    if (listing.includes(forbidden)) fail(`${basename(tarball)} contains ${forbidden.replace('package/', '')}`);
}

// 2. Install it, as a product would (peers at the products' versions), and paste the documented example.
writeFileSync(join(fixture, 'package.json'), `${JSON.stringify({
    name: 'booleanpress-ui-fixture-vite',
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
copyFileSync(join(root, 'examples', 'checkbox', 'basic.tsx'), join(fixture, 'src', 'checkbox-example.tsx'));
rmSync(join(fixture, 'node_modules', '@booleanpress'), { recursive: true, force: true });
run('pnpm', ['install', '--ignore-workspace', '--no-frozen-lockfile', '--prefer-offline'], fixture);

// 3. Build it.
try {
    run('pnpm', ['exec', 'vite', 'build'], fixture);
} catch {
    fail('vite build of the fixture failed');
}

// 4. The package's own classes reached the fixture's CSS: the fixture never writes them, the package's dist does.
const manifest = JSON.parse(readFileSync(join(fixture, 'dist', 'manifest.json'), 'utf8'));
const entry = Object.values(manifest).find((chunk) => chunk.isEntry);
const css = (entry.css ?? []).map((file) => readFileSync(join(fixture, 'dist', file), 'utf8')).join('\n');
const js = readFileSync(join(fixture, 'dist', entry.file), 'utf8');
const markers = {
    'the dialog height under the WordPress admin bar': '--wp-admin--admin-bar--height',
    'the large dialog width (sm:max-w-2xl)': 'max-w-2xl',
    'the motion tokens': '--bui-duration-slow',
};
for (const [what, marker] of Object.entries(markers)) {
    if (!css.includes(marker)) fail(`fixture CSS lacks ${what}: Tailwind did not scan the package`);
}
if (/["']@\//.test(js)) fail('the fixture bundle still imports an "@/" path');
const contexts = js.split('BooleanUIContext').length - 1;
if (contexts !== 1) fail(`the fixture bundle holds ${contexts} copies of the provider's context (expected 1)`);
if (!js.includes('Fermer')) fail('the provider strings did not reach the bundle');

// 5. In a browser: the pasted example toggles by click on its label and by Space; the dialog opens.
const port = 5192;
const server = spawn('node', [join(root, 'scripts', 'docs-serve.mjs'), join(fixture, 'dist'), String(port)], { stdio: 'pipe' });
await new Promise((ready) => server.stdout.once('data', ready));
const browser = await chromium.launch();
try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    const box = page.getByRole('checkbox', { name: 'Accept the terms' });
    if ((await box.getAttribute('aria-checked')) !== 'false') fail('the example did not start unchecked');
    await page.getByText('Accept the terms').click();
    if ((await box.getAttribute('aria-checked')) !== 'true') fail('clicking the label did not check the box');
    await box.focus();
    await page.keyboard.press('Space');
    if ((await box.getAttribute('aria-checked')) !== 'false') fail('Space did not toggle the box');
    await page.getByRole('button', { name: 'Open' }).click();
    if (!(await page.getByRole('dialog', { name: 'Fixture' }).isVisible())) fail('the dialog did not open');
    if (!(await page.getByRole('button', { name: 'Fermer' }).isVisible())) fail('the close button is not named from the provider');
    if (errors.length) fail(`page errors: ${errors.join('; ')}`);
} finally {
    await browser.close();
    server.kill();
}

console.log(`[fixture:vite] ${basename(tarball)} installed · vite build ok · the documented Checkbox example toggles by click and Space`);
