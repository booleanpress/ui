#!/usr/bin/env node
// bui-contrast: the contrast contract of @booleanpress/ui.
//
// Reads a product's brand stylesheet (its `:root` and `.dark` custom properties) on top of the package's neutral
// defaults in theme.css, and checks every text token against each surface it is drawn on, and every form control's edge
// against the surfaces it sits on, in the light and the dark theme. Exits with 1 when a pair is below WCAG 2.2 AA (4.5:1
// for normal text, 3:1 for a control's edge), so a palette change that breaks readability or hides a checkbox fails the
// product's `pnpm lint` instead of reaching a user.
//
// Usage: bui-contrast <brand.css> [--verbose]
import { readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { MIN, MIN_EDGE, measure, readThemes } from './contrast-core.mjs';

export { EDGES, MIN, MIN_EDGE, PAIRS, measure, parseColour, ratio, readThemes } from './contrast-core.mjs';

function main() {
	const args = process.argv.slice(2);
	const file = args.find((arg) => !arg.startsWith('--'));
	const verbose = args.includes('--verbose');
	if (!file) {
		console.error('Usage: bui-contrast <brand.css> [--verbose]');
		process.exit(2);
	}
	const here = dirname(fileURLToPath(import.meta.url));
	const defaults = readThemes(readFileSync(join(here, '..', 'theme.css'), 'utf8'));
	const brand = readThemes(readFileSync(file, 'utf8'));
	const label = relative(process.cwd(), file) || file;

	let failures = 0;
	let pairs = 0;
	// `.dark` sits on <html> next to `:root`, so a token the dark block leaves out keeps its light value.
	const light = { ...defaults.light, ...brand.light };
	const themes = { light, dark: { ...light, ...defaults.dark, ...brand.dark } };
	for (const [theme, tokens] of Object.entries(themes)) {
		for (const row of measure(tokens, theme)) {
			pairs += 1;
			const ok = row.ratio !== null && row.ratio >= row.min;
			if (!ok) failures += 1;
			if (!ok || verbose) {
				const shown = row.ratio === null ? row.note : `${row.ratio.toFixed(2)}:1`;
				console.log(`${ok ? '  ok ' : 'FAIL '} ${theme.padEnd(5)} ${row.text.padEnd(32)} on ${row.surface.padEnd(20)} ${shown}`);
			}
		}
	}
	if (failures) {
		console.error(`[contrast] ${label} — ${failures} of ${pairs} pairs below their minimum (text ${MIN}:1, control edges ${MIN_EDGE}:1)`);
		process.exit(1);
	}
	console.log(`[contrast] ${label} — every text/surface pair ≥ ${MIN}:1 and every control edge ≥ ${MIN_EDGE}:1 (light and dark)`);
}

// Run as a command (also through the node_modules/.bin symlink), not when imported by the tests.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
