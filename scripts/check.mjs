// `pnpm check`: the package's definition of done in one command, one summary line per step. A failing step prints its
// full output and the command exits 1. The release workflow and `pnpm release:first` run it before anything is
// published. `--fast` runs lint, types, private-name scanning and unit tests without builds or consumer installs.
//
//   [lint]          ESLint over the repository
//   [types]         TypeScript over the source, the examples, the docs and the type tests
//   [licences]      every production dependency's licence: MIT, ISC, BSD or Apache-2.0 only
//   [private]       no tracked or new file names a private term (only where office/private-names.txt exists)
//   [test]          Vitest with axe, one file per component
//   [build]         dist/: one module and one .d.ts per entry, and the Markdown documentation
//   [package]       tarball publint/Are the Types Wrong, local dist declaration tests, and no
//                   file in it naming a private term (where office/private-names.txt exists)
//   [fixture:vite]  a Vite app built from the tarball, with the documented Checkbox example pasted in, in a browser
//   [fixture:next]  a Next.js App Router app built from the tarball, rendered on the server, hydrated, in a browser
//   [fixture:button-only]  an app using only Button installs without the optional peers and builds
//   [docs]          the documentation site built from the tarball, axe and its behaviours tested in a browser
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const fast = process.argv.includes('--fast');
if (process.argv.slice(2).some((arg) => arg !== '--fast')) {
	console.error('Usage: node scripts/check.mjs [--fast]');
	process.exit(1);
}
const root = resolve(import.meta.dirname, '..');
const scratch = mkdtempSync(join(tmpdir(), 'bui-check-'));
process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

function step(name, cmd, args, options = {}) {
	try {
		return execFileSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024, ...options });
	} catch (error) {
		process.stdout.write(error.stdout ?? '');
		process.stderr.write(error.stderr ?? '');
		console.error(`[${name}] FAIL`);
		process.exit(1);
	}
}

const fail = (name, message) => {
	console.error(`[${name}] FAIL ${message}`);
	process.exit(1);
};

const lastLine = (output, prefix) => output.split('\n').filter((line) => line.startsWith(prefix)).pop() ?? '';

// Lint.
const lintReport = join(scratch, 'eslint.json');
try {
	execFileSync('pnpm', ['exec', 'eslint', '.', '--format', 'json', '--output-file', lintReport], { cwd: root, stdio: 'pipe' });
} catch {
	/* the report says why */
}
if (!existsSync(lintReport)) fail('lint', 'ESLint did not produce a report; run pnpm lint for details');
const lint = JSON.parse(readFileSync(lintReport, 'utf8'));
const errors = lint.reduce((n, file) => n + file.errorCount, 0);
const warnings = lint.reduce((n, file) => n + file.warningCount, 0);
if (errors) {
	step('lint', 'pnpm', ['exec', 'eslint', '.']);
}
console.log(`[lint] ${errors} errors${warnings ? ` · ${warnings} warnings` : ''}`);

// Types, with the type tests (tests/types): a `@ts-expect-error` that no longer errors fails here.
step('types', 'pnpm', ['exec', 'tsc', '-p', 'tsconfig.json']);
console.log('[types] 0 errors · type tests passed');

if (!fast) {
	// Licences of everything a consumer installs with the package.
	const ALLOWED = /^(MIT|ISC|0BSD|BSD-2-Clause|BSD-3-Clause|Apache-2\.0)$/;
	const licences = JSON.parse(step('licences', 'pnpm', ['licenses', 'list', '--prod', '--json']) || '{}');
	const refused = Object.entries(licences).filter(([licence]) => !ALLOWED.test(licence));
	if (refused.length) {
		fail('licences', refused.map(([licence, deps]) => `${licence}: ${deps.map((d) => d.name).join(', ')}`).join('; '));
	}
	const counts = Object.entries(licences)
		.map(([licence, deps]) => [licence, deps.length])
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
	console.log(`[licences] production dependencies: ${counts.map(([licence, n]) => `${licence} ${n}`).join(', ') || 'none'}`);
}

// Private names: the maintainers' list of terms that must never reach a file that would go public.
const privateList = join(root, 'office', 'private-names.txt');
const privatePatterns = existsSync(privateList)
	? readFileSync(privateList, 'utf8')
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line && !line.startsWith('#'))
			.map((line) => new RegExp(line, 'i'))
	: null;

/** Every file under `base` (named by its path from there) whose name or text matches a private term. */
function privateHits(base, files) {
	const hits = [];
	for (const file of files) {
		const path = join(base, file);
		if (!existsSync(path) || statSync(path).isDirectory()) continue;
		const buffer = readFileSync(path);
		const text = buffer.includes(0) ? '' : buffer.toString('utf8');
		for (const pattern of privatePatterns) {
			const match = file.match(pattern) ?? text.match(pattern);
			if (match) hits.push(`${file}: "${match[0]}"`);
		}
	}
	return hits;
}

if (privatePatterns) {
	const files = step('private', 'git', ['ls-files', '-co', '--exclude-standard']).split('\n').filter(Boolean);
	const hits = privateHits(root, files);
	if (hits.length) fail('private', `${hits.length} files name a private term:\n  ${hits.join('\n  ')}`);
	console.log('[private] 0 files name a private term');
}

// Tests, with axe on every component.
const testReport = join(scratch, 'vitest.json');
try {
	execFileSync('pnpm', ['exec', 'vitest', 'run', '--reporter=json', `--outputFile=${testReport}`], { cwd: root, stdio: 'pipe' });
} catch {
	/* the report says why */
}
if (!existsSync(testReport)) fail('test', 'Vitest did not produce a report; run pnpm test for details');
const tests = JSON.parse(readFileSync(testReport, 'utf8'));
const componentFiles = tests.testResults.filter((file) => file.name.includes('/tests/components/'));
const failedFiles = tests.testResults.filter((file) => file.status !== 'passed');
const axeFailures = tests.testResults
	.flatMap((file) => file.assertionResults)
	.filter((test) => test.status === 'failed' && test.failureMessages.some((message) => /(critical|serious|moderate|minor) [a-z-]+:/.test(message)));
if (failedFiles.length || !tests.success) {
	for (const file of failedFiles) {
		for (const test of file.assertionResults.filter((t) => t.status === 'failed')) {
			console.error(`FAIL ${file.name.replace(`${root}/`, '')} › ${test.fullName}\n${test.failureMessages.join('\n')}`);
		}
		if (!file.assertionResults.length) console.error(`FAIL ${file.name.replace(`${root}/`, '')}\n${file.message}`);
	}
	console.error(`[test] FAIL ${failedFiles.length} files · ${axeFailures.length} axe violations`);
	process.exit(1);
}
console.log(`[test] ${tests.numPassedTests} tests passed · ${componentFiles.length} component files · ${axeFailures.length} axe violations`);
if (fast) process.exit(0);

// Library build: modules, declarations and the Markdown documentation.
step('build', 'node', ['scripts/build.mjs']);
step('build', 'pnpm', ['docs:markdown']);
const dist = join(root, 'dist');
const sources = readdirSync(join(root, 'src', 'components')).filter((file) => file.endsWith('.tsx'));
const modules = readdirSync(join(dist, 'components')).filter((file) => file.endsWith('.js'));
const declarations = readdirSync(join(dist, 'components')).filter((file) => file.endsWith('.d.ts'));
const entries = ['provider', 'lib/utils'];
const missing = [
	...entries.flatMap((entry) => [`${entry}.js`, `${entry}.d.ts`]).filter((file) => !existsSync(join(dist, file))),
	...(existsSync(join(dist, 'docs', 'llms.txt')) ? [] : ['docs/llms.txt']),
];
if (modules.length !== sources.length || declarations.length !== sources.length || missing.length) {
	fail('build', `dist has ${modules.length} modules and ${declarations.length} declarations for ${sources.length} components${missing.length ? `; missing ${missing.join(', ')}` : ''}`);
}
console.log(`[build] dist: ${modules.length} components + provider + theme.css + bui-contrast · a .d.ts for every entry`);

// The packed tarball, exactly as npm would publish it.
const tarball = join(root, `booleanpress-ui-${pkg.version}.tgz`);
rmSync(tarball, { force: true });
step('package', 'pnpm', ['pack', '--pack-destination', root]);
step('package', 'pnpm', ['exec', 'publint', 'run', tarball, '--strict']);
const entrypoints = ['./provider', './utils', ...sources.map((file) => `./${file.replace(/\.tsx$/, '')}`)];
step('package', 'pnpm', ['exec', 'attw', tarball, '--profile', 'esm-only', '--format', 'ascii', '--entrypoints', ...entrypoints]);
step('package', 'pnpm', ['exec', 'tsc', '-p', 'tests/types/tsconfig.dist.json']);
// The files that would be published, read again: a stale build or generated page can carry a term the sources no longer do.
let packedNote = '';
if (privatePatterns) {
	const unpacked = join(scratch, 'packed');
	rmSync(unpacked, { recursive: true, force: true });
	step('package', 'mkdir', ['-p', unpacked]);
	step('package', 'tar', ['-xzf', tarball, '-C', unpacked]);
	const files = step('package', 'tar', ['-tzf', tarball]).split('\n').filter((file) => file && !file.endsWith('/'));
	const hits = privateHits(unpacked, files);
	if (hits.length) fail('package', `${hits.length} files in the tarball name a private term:\n  ${hits.join('\n  ')}`);
	packedNote = ` · ${files.length} files in the tarball, none naming a private term`;
}
console.log(`[package] publint: no issues · are-the-types-wrong: no problems${packedNote}`);

// Consumers built from the tarball, and the documentation site built from it.
for (const [name, script] of [['fixture:vite', 'fixture-vite.mjs'], ['fixture:next', 'fixture-next.mjs'], ['fixture:button-only', 'fixture-button-only.mjs'], ['docs', 'docs-verify.mjs']]) {
	const output = step(name, 'node', [join('scripts', script), tarball, '--quiet']);
	console.log(lastLine(output, `[${name}]`));
}
