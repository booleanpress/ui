// `pnpm build`: the library build. Vite writes one ES module per source module into dist/; tsc writes a .d.ts beside
// each; the declarations' source-only `@/` imports are then rewritten as relative paths, so a consumer's TypeScript
// resolves them inside the package. Versioned Markdown is generated separately by `pnpm docs:markdown`.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const run = (args) => execFileSync('pnpm', ['exec', ...args], { cwd: root, stdio: 'inherit' });

run(['vite', 'build', '--config', 'vite.lib.config.js', '--logLevel', 'warn']);
run(['tsc', '-p', 'tsconfig.build.json']);

const declarations = readdirSync(dist, { recursive: true }).filter((file) => file.endsWith('.d.ts'));
for (const file of declarations) {
    const path = join(dist, file);
    const source = readFileSync(path, 'utf8');
    const rewritten = source.replace(/(from\s+|import\()(["'])@\/([^"']+)\2/g, (_, lead, quote, target) => {
        let to = relative(dirname(path), join(dist, target));
        if (!to.startsWith('.')) to = `./${to}`;
        return `${lead}${quote}${to}.js${quote}`;
    });
    if (rewritten !== source) writeFileSync(path, rewritten);
}

const leaked = declarations.filter((file) => readFileSync(join(dist, file), 'utf8').includes('"@/'));
if (leaked.length) {
    console.error(`[build] FAIL "@/" left in ${leaked.join(', ')}`);
    process.exit(1);
}
