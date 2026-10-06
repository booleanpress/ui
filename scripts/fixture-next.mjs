// The Next.js fixture: installs the packed tarball into fixture/next (a Next.js App Router app), builds it — which
// type-checks the app against the package's declarations — serves it, and checks in a browser that Dialog, Checkbox,
// Tooltip and Chart render on the server, hydrate without an error in the console, and work.
//
// Usage: node scripts/fixture-next.mjs <tarball> [--quiet]
// Prints `[fixture:next] …` and exits 1 on any failure.
import { execFileSync, spawn } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '..');
const fixture = join(root, 'fixture', 'next');
const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const tarball = resolve(args.find((arg) => !arg.startsWith('--')));
const dev = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).devDependencies;
const NEXT = '16.3.8';
const TAILWIND_POSTCSS = dev.tailwindcss;
const port = 5193;
const run = (cmd, cmdArgs) => execFileSync(cmd, cmdArgs, { cwd: fixture, stdio: quiet ? 'pipe' : 'inherit', encoding: 'utf8', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
const fail = (message) => {
    console.error(`[fixture:next] FAIL ${message}`);
    process.exit(1);
};

writeFileSync(join(fixture, 'package.json'), `${JSON.stringify({
    name: 'booleanpress-ui-fixture-next',
    private: true,
    type: 'module',
    scripts: { build: 'next build', start: 'next start' },
    dependencies: {
        '@booleanpress/ui': `file:${relative(fixture, tarball)}`,
        'lucide-react': dev['lucide-react'],
        next: NEXT,
        'radix-ui': dev['radix-ui'],
        react: dev.react,
        'react-dom': dev['react-dom'],
        recharts: dev.recharts,
    },
    devDependencies: {
        '@tailwindcss/postcss': TAILWIND_POSTCSS,
        '@types/node': dev['@types/node'],
        '@types/react': dev['@types/react'],
        '@types/react-dom': dev['@types/react-dom'],
        tailwindcss: dev.tailwindcss,
        typescript: dev.typescript,
    },
}, null, 4)}\n`);
rmSync(join(fixture, 'node_modules', '@booleanpress'), { recursive: true, force: true });
rmSync(join(fixture, '.next'), { recursive: true, force: true });
run('pnpm', ['install', '--ignore-workspace', '--no-frozen-lockfile', '--prefer-offline']);

try {
    run('pnpm', ['exec', 'next', 'build']);
} catch (error) {
    if (quiet) process.stderr.write(`${error.stdout ?? ''}${error.stderr ?? ''}`);
    fail('next build failed');
}

const server = spawn(join(fixture, 'node_modules', '.bin', 'next'), ['start', '-p', String(port), '-H', '127.0.0.1'], {
    cwd: fixture,
    stdio: 'pipe',
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
});
const stop = () => server.kill('SIGTERM');
process.on('exit', stop);
await new Promise((ready, reject) => {
    const timer = setTimeout(() => reject(new Error('next start did not answer')), 30000);
    server.stdout.on('data', (chunk) => {
        if (/Ready|started server|Local:/i.test(String(chunk))) {
            clearTimeout(timer);
            ready();
        }
    });
}).catch((error) => fail(error.message));

// The server's HTML, before any JavaScript runs.
const html = await (await fetch(`http://127.0.0.1:${port}/`)).text();
if (!/role="checkbox"[^>]*aria-checked="true"|aria-checked="true"[^>]*role="checkbox"/.test(html)) fail('the server HTML has no checked checkbox');
if (!html.includes('Open dialog')) fail('the server HTML has no dialog trigger');
if (!html.includes('Hover for a tooltip')) fail('the server HTML has no tooltip trigger');
if (!html.includes('data-testid="traffic-chart"')) fail('the server HTML has no chart box');

const browser = await chromium.launch();
try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    // The chart draws after hydration, with no hydration error (any console error fails below).
    await page.locator('[data-testid="traffic-chart"] .recharts-surface').waitFor({ timeout: 5000 }).catch(() => fail('the chart did not draw after hydration'));
    await page.getByRole('button', { name: 'Open dialog' }).click();
    const dialog = page.getByRole('dialog', { name: 'Rendered on the server' });
    await dialog.waitFor({ timeout: 5000 }).catch(() => fail('the dialog did not open after hydration'));
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached', timeout: 5000 }).catch(() => fail('Escape did not close the dialog'));
    const box = page.getByRole('checkbox', { name: 'Checked on the server' });
    await box.click();
    if ((await box.getAttribute('aria-checked')) !== 'false') fail('the checkbox did not toggle after hydration');
    await page.getByRole('button', { name: 'Hover for a tooltip' }).hover();
    await page.getByRole('tooltip').waitFor({ timeout: 5000 }).catch(() => fail('the tooltip did not open on hover'));
    if (errors.length) fail(`errors in the browser: ${errors.join('; ').slice(0, 500)}`);
} finally {
    await browser.close();
    stop();
}

console.log('[fixture:next] next build ok · Dialog, Checkbox, Tooltip and Chart render on the server and hydrate without errors · the Dialog opens');
