// Serves a built documentation site the way its static host does: /path → path/index.html, files by extension,
// anything else → 404.html with status 404. `pnpm docs:preview`, and the verification build's browser tests.
//
// Usage: node scripts/docs-serve.mjs [folder=docs/build/client] [port=5181]
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'docs/build/client');
const port = Number(process.argv[3] ?? 5181);
const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.png': 'image/png',
    '.json': 'application/json',
    '.md': 'text/markdown; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.data': 'text/x-script',
    '.wasm': 'application/wasm',
    '.pf_meta': 'application/octet-stream',
    '.pf_index': 'application/octet-stream',
    '.pf_fragment': 'application/octet-stream',
    '.pagefind': 'application/octet-stream',
};

const isFile = (path) => existsSync(path) && statSync(path).isFile();

function locate(pathname) {
    const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
    const direct = join(root, safe);
    if (!direct.startsWith(root)) return null;
    if (isFile(direct)) return direct;
    if (isFile(join(direct, 'index.html'))) return join(direct, 'index.html');
    if (isFile(`${direct}.html`)) return `${direct}.html`;
    return null;
}

createServer((request, response) => {
    const { pathname } = new URL(request.url, 'http://localhost');
    const file = locate(pathname);
    const target = file ?? join(root, '404.html');
    response.writeHead(file ? 200 : 404, { 'Content-Type': TYPES[extname(target)] ?? 'application/octet-stream' });
    createReadStream(target).pipe(response);
}).listen(port, '127.0.0.1', () => console.log(`[docs-serve] ${root} at http://127.0.0.1:${port}/`));
