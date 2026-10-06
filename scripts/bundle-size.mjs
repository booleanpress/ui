// Informational module sizes. Run `pnpm build` first; these are not application bundle budgets.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');

const kb = (bytes) => Math.round(bytes / 10) / 100;

/** The entry's module and every package module it reaches through relative imports, each once. */
function closure(file, seen = new Set()) {
	if (seen.has(file)) return seen;
	seen.add(file);
	const source = readFileSync(file, 'utf8');
	for (const m of source.matchAll(/(?:from|import)\s*"(\.{1,2}\/[^"]+)"/g)) closure(resolve(dirname(file), m[1]), seen);
	return seen;
}

const entries = {
	provider: join(dist, 'provider.js'),
	utils: join(dist, 'lib', 'utils.js'),
	...Object.fromEntries(
		readdirSync(join(dist, 'components'))
			.filter((f) => f.endsWith('.js'))
			.map((f) => [f.replace(/\.js$/, ''), join(dist, 'components', f)]),
	),
};

const sizes = Object.fromEntries(
	Object.entries(entries).map(([name, file]) => {
		const bytes = [...closure(file)].reduce((sum, f) => sum + gzipSync(readFileSync(f), { level: 9 }).length, 0);
		return [name, kb(bytes)];
	}),
);

console.log("Internal unminified modules, gzip kB; excludes external dependencies and consumer CSS.");
for (const [name, size] of Object.entries(sizes).sort(([, a], [, b]) => b - a)) {
	console.log(`  ${name.padEnd(24)} ${String(size).padStart(6)} kB`);
}
