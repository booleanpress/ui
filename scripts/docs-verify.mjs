// `pnpm docs:verify`: builds the documentation site from the packed tarball, not the source. A copy of docs/ and
// examples/ goes into a scratch folder with the tarball installed beside it and the source aliases switched off
// (BUI_DOCS_PACKAGE=1); the site is pre-rendered, served as its host serves it, and tested in a browser: axe on every
// page in light and dark, and its behaviours.
//
// Usage: node scripts/docs-verify.mjs <tarball> [--quiet]
// Prints `[docs] N component pages, M guide pages and B blocks pre-rendered from the packed package · Markdown for each · …`.
import { execFileSync, spawn } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const tarball = resolve(args.find((arg) => !arg.startsWith('--')) ?? '');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const dev = pkg.devDependencies;
// The site shows every component, so it installs every optional peer (Chart's recharts, Carousel's embla, …).
const optionalPeers = Object.keys(pkg.peerDependenciesMeta ?? {});
const fail = (message) => {
    console.error(`[docs] FAIL ${message}`);
    process.exit(1);
};
const run = (cmd, cmdArgs, cwd, env = {}) => {
    try {
        return execFileSync(cmd, cmdArgs, { cwd, env: { ...process.env, ...env }, stdio: 'pipe', encoding: 'utf8' });
    } catch (error) {
        process.stderr.write(`${error.stdout ?? ''}${error.stderr ?? ''}`);
        throw error;
    }
};

// The real path: on macOS the temporary folder is reached through a symlink, and React Router must see one spelling.
const scratch = realpathSync(mkdtempSync(join(tmpdir(), 'bui-docs-')));
process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));
const docs = join(scratch, 'docs');
cpSync(join(root, 'docs'), docs, { recursive: true, filter: (src) => !/[/\\](node_modules|build|\.react-router)([/\\]|$)/.test(src) });
cpSync(join(root, 'examples'), join(scratch, 'examples'), { recursive: true });
cpSync(tarball, join(scratch, basename(tarball)));

// The stylesheets take the theme from the package, and Tailwind scans the package's dist/ (theme.css says so), not src/.
const shared = join(docs, 'app', 'docs-shared.css');
writeFileSync(shared, readFileSync(shared, 'utf8').replace('@source "../../src";\n', ''));
for (const file of ['docs.css', 'docs-wp.css']) {
    const path = join(docs, 'app', file);
    writeFileSync(path, readFileSync(path, 'utf8').replace('@import "../../theme.css";', '@import "@booleanpress/ui/theme.css";'));
}

const pick = (names) => Object.fromEntries(names.map((name) => [name, dev[name]]));
// Installed at the scratch root, so docs/ and examples/ both resolve the package.
writeFileSync(join(scratch, 'package.json'), `${JSON.stringify({
    name: 'booleanpress-ui-docs-verify',
    private: true,
    type: 'module',
    dependencies: { '@booleanpress/ui': `file:./${basename(tarball)}`, ...pick(['lucide-react', 'radix-ui', 'react', 'react-dom', 'react-router', ...optionalPeers]) },
    devDependencies: pick(['@react-router/dev', '@react-router/node', '@tailwindcss/vite', 'tailwindcss', 'vite', 'typescript', 'react-docgen-typescript', 'marked', 'shiki', 'pagefind', '@fontsource-variable/inter', '@fontsource-variable/geist-mono', '@types/react', '@types/react-dom']),
}, null, 4)}\n`);

try {
    run('pnpm', ['install', '--ignore-workspace', '--no-frozen-lockfile', '--prefer-offline'], scratch);
} catch {
    fail('pnpm install of the docs copy failed');
}
try {
    run('node', [join(root, 'scripts', 'docs-build.mjs'), docs, '--quiet'], docs, { BUI_DOCS_PACKAGE: '1' });
} catch {
    fail('the docs did not build from the packed package');
}

const client = join(docs, 'build', 'client');
const files = readdirSync(client, { recursive: true }).map(String);
const componentPages = files.filter((f) => /^components[/\\][^/\\]+[/\\]index\.html$/.test(f)).length;
const guidePages = files.filter((f) => /^docs[/\\][^/\\]+[/\\]index\.html$/.test(f)).length;
const blockPages = files.filter((f) => /^blocks[/\\][^/\\]+[/\\]index\.html$/.test(f)).length;
const markdown = files.filter((f) => f.endsWith('.md')).length;
const pages = componentPages + guidePages + blockPages;
if (markdown !== pages) fail(`${markdown} Markdown files for ${pages} pages`);
const html = readFileSync(join(client, 'components', 'checkbox', 'index.html'), 'utf8');
if (!html.includes('role="checkbox"')) fail('the Checkbox page was pre-rendered without its live examples');

const port = 5191;
const server = spawn('node', [join(root, 'scripts', 'docs-serve.mjs'), client, String(port)], { stdio: 'pipe' });
await new Promise((resolveReady) => server.stdout.once('data', resolveReady));
let summary;
try {
    summary = run('node', [join(root, 'scripts', 'docs-test.mjs'), `http://127.0.0.1:${port}`, '--quiet'], root).trim().split('\n').pop();
} catch {
    server.kill();
    fail('the browser tests failed on the site built from the packed package');
}
server.kill();
const axe = summary.match(/(\d+) unexpected axe violations/)?.[1] ?? '?';
const contrast = summary.match(/(\d+) documented contrast findings/)?.[1] ?? '?';
const behaviours = summary.match(/(\d+) behaviours passed/)?.[1] ?? '?';
if (!quiet) console.log(summary);
console.log(`[docs] ${componentPages} component pages, ${guidePages} guide pages and ${blockPages} blocks pre-rendered from the packed package · Markdown for each · ${axe} unexpected axe violations · ${contrast} documented contrast findings · ${behaviours} behaviours passed`);
