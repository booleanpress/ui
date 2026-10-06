// `pnpm fixture`: packs the package exactly as npm would publish it and runs the consumer fixtures on the tarball — the
// Vite app (fixture/vite), the Next.js App Router app (fixture/next) and the Button-only app (fixture/button-only).
// `pnpm check` runs them too.
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const tarball = join(root, `booleanpress-ui-${version}.tgz`);
rmSync(tarball, { force: true });
execFileSync('pnpm', ['pack', '--pack-destination', root], { cwd: root, stdio: 'pipe' });
for (const script of ['fixture-vite.mjs', 'fixture-next.mjs', 'fixture-button-only.mjs']) {
    execFileSync('node', [join(root, 'scripts', script), tarball, ...process.argv.slice(2)], { cwd: root, stdio: 'inherit' });
}
