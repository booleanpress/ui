// `pnpm docs:build`: pre-renders the documentation site into docs/build/client, writes the "not found" page where a
// static host looks for it (404.html), and indexes the pages for search with Pagefind.
//
// Usage: node scripts/docs-build.mjs [docs folder=docs] [--quiet]
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const docs = resolve(args.find((arg) => !arg.startsWith('--')) ?? 'docs');
const client = join(docs, 'build', 'client');
const stdio = quiet ? 'pipe' : 'inherit';
const bin = (name) => {
    for (let dir = docs; ; dir = resolve(dir, '..')) {
        const candidate = join(dir, 'node_modules', '.bin', name);
        if (existsSync(candidate)) return candidate;
        if (dir === resolve(dir, '..')) throw new Error(`${name} is not installed`);
    }
};

// Every component's props, parsed once before pre-rendering (see scripts/docs-api-cache.mjs), in a file named for this
// run alone and removed afterwards, whatever happens: no later build or dev server can read it.
const apiCache = join(tmpdir(), `bui-docs-api-${process.pid}-${Date.now()}.json`);
try {
    // Cloudflare Workers Builds names the branch it builds; the site says "Preview" on every branch but main.
    const branch = process.env.WORKERS_CI_BRANCH;
    const env = { ...process.env, VITE_BUI_PREVIEW: branch && branch !== 'main' ? '1' : '', BUI_API_CACHE: apiCache };
    execFileSync(process.execPath, ['--disable-warning=ExperimentalWarning', join(import.meta.dirname, 'docs-api-cache.mjs'), docs, apiCache], { cwd: docs, stdio, encoding: 'utf8', env });
    execFileSync(bin('react-router'), ['build', docs], { cwd: docs, stdio, encoding: 'utf8', env });
} catch (error) {
    if (quiet) process.stderr.write(`${error.stdout ?? ''}${error.stderr ?? ''}`);
    console.error('[docs-build] FAIL react-router build');
    process.exitCode = 1;
} finally {
    rmSync(apiCache, { force: true });
}
if (process.exitCode) process.exit();
copyFileSync(join(client, '404', 'index.html'), join(client, '404.html'));
// Text files need no client-side data: drop the data files React Router writes beside them.
for (const file of readdirSync(client, { recursive: true }).map(String).filter((f) => /\.(md|txt)\.data$/.test(f))) rmSync(join(client, file));
execFileSync(bin('pagefind'), ['--site', client, '--glob', '**/*.html', '--exclude-selectors', '[data-pagefind-ignore]'], { stdio: 'pipe' });

const files = readdirSync(client, { recursive: true }).map(String);
const pages = files.filter((f) => f.endsWith('index.html'));
const markdown = files.filter((f) => f.endsWith('.md'));

// For search engines: a sitemap of the pages worth finding (the home page, the guides and the component pages, not the
// examples' own pages, which are noindex, nor the "not found" page), and a robots.txt that names it.
const site = readFileSync(join(docs, 'app', 'content', 'site.ts'), 'utf8').match(/url: "([^"]+)"/)[1];
const listed = pages
    .map((f) => `/${f.replace(/index\.html$/, '').replace(/\/$/, '')}`)
    .filter((path) => !/^\/(examples|404)(\/|$)/.test(path))
    .sort();
const urls = listed.map((path) => `  <url><loc>${site}${path === '/' ? '/' : path}</loc></url>`).join('\n');
writeFileSync(join(client, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(client, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);

console.log(`[docs-build] ${pages.length} pages pre-rendered · ${markdown.length} Markdown files · llms.txt${files.includes('llms.txt') ? '' : ' MISSING'} · sitemap of ${listed.length} pages · search index built`);
