// The contrast contract's arithmetic, with no Node APIs, so the command (bui-contrast.mjs) and the documentation's theme
// builder run the same code: read the tokens of a stylesheet, resolve them, and measure every text/surface pair and every
// control edge the components draw against WCAG 2.2 AA.

/** WCAG 2.2 AA for normal text (1.4.3). */
export const MIN = 4.5;

/** WCAG 2.2 AA for the parts of a control that show what it is and its state, such as a checkbox's edge (1.4.11). */
export const MIN_EDGE = 3;

/** The edge tokens of form controls (checkbox, radio, switch track, text field, select) → the surfaces they sit on. */
export const EDGES = [{ edge: 'control', surfaces: ['background', 'card', 'popover', 'muted', 'sidebar'] }];

/**
 * The text-on-surface pairs the package's components draw: text token (or a literal colour) → surfaces. A surface may
 * carry the opacity a component gives it, per theme. A translucent surface (the dark theme's status fills) is seen over
 * the page background, and also over each token in `over`, when the component can sit on one of those.
 */
export const PAIRS = [
	{ text: 'foreground', surfaces: ['background', 'card', 'popover', 'muted'] },
	{ text: 'muted-foreground', surfaces: ['background', 'card', 'popover', 'muted'] },
	{ text: 'foreground', surfaces: ['field', 'field-filled'] },
	{ text: 'muted-foreground', surfaces: ['field', 'field-filled'] },
	{ text: 'heading', surfaces: ['background', 'card', 'popover'] },
	{ text: 'card-foreground', surfaces: ['card'] },
	{ text: 'popover-foreground', surfaces: ['popover'] },
	// Solid fills at rest, on hover and on press; a chosen option, and a chosen option with focus.
	{ text: 'primary-foreground', surfaces: ['primary', 'primary-hover', 'primary-active'] },
	{ text: 'secondary-foreground', surfaces: ['secondary'] },
	{ text: 'secondary-hover-foreground', surfaces: ['secondary-hover'] },
	{ text: 'accent-foreground', surfaces: ['accent'] },
	{ text: 'highlight-foreground', surfaces: ['highlight', 'highlight-focus'] },
	{ text: 'destructive-foreground', surfaces: ['destructive', 'destructive-hover', 'destructive-active'] },
	{ text: 'destructive-strong', surfaces: ['background', 'card', 'popover'] },
	{ text: 'success-strong', surfaces: ['background', 'card', 'popover'] },
	{ text: 'warning-strong', surfaces: ['background', 'card', 'popover'] },
	{ text: 'info-strong', surfaces: ['background', 'card', 'popover'] },
	{ text: 'destructive-strong', surfaces: ['destructive-subtle'], over: ['card'] },
	{ text: 'success-strong', surfaces: ['success-subtle'], over: ['card'] },
	{ text: 'warning-strong', surfaces: ['warning-subtle'], over: ['card'] },
	{ text: 'info-strong', surfaces: ['info-subtle'], over: ['card'] },
	{ text: 'destructive-tag-foreground', surfaces: ['destructive-tag'] },
	{ text: 'success-tag-foreground', surfaces: ['success-tag'] },
	{ text: 'warning-tag-foreground', surfaces: ['warning-tag'] },
	{ text: 'info-tag-foreground', surfaces: ['info-tag'] },
	{ text: 'sidebar-foreground', surfaces: ['sidebar'] },
	{ text: 'sidebar-accent-foreground', surfaces: ['sidebar-accent'] },
	{ text: 'sidebar-primary-foreground', surfaces: ['sidebar-primary'] },
	// Severities of buttons and solid badges: the text on each solid fill at rest, on hover and on press; the fill
	// colour as the text of an outlined, text or link button, on the surfaces a button sits on and on its hover and press
	// backgrounds. Chips: their text at rest and while their remove button has focus.
	{ text: 'success-foreground', surfaces: ['success', 'success-hover', 'success-active'] },
	{ text: 'info-solid-foreground', surfaces: ['info-solid', 'info-solid-hover', 'info-solid-active'] },
	{ text: 'warning-solid-foreground', surfaces: ['warning-solid', 'warning-solid-hover', 'warning-solid-active'] },
	{ text: 'help-foreground', surfaces: ['help', 'help-hover', 'help-active'] },
	{ text: 'contrast-foreground', surfaces: ['contrast', 'contrast-hover', 'contrast-active'] },
	...['success', 'info-solid', 'warning-solid', 'help', 'destructive', 'contrast'].flatMap((tone) => [
		{ text: tone, surfaces: ['background', 'card', 'popover'] },
		{ text: tone, surfaces: [`${tone}-ghost-hover`, `${tone}-ghost-active`], over: ['card'] },
	]),
	{ text: 'accent-foreground', surfaces: ['secondary', 'secondary-hover'] },
];

/** The custom properties declared directly in each `:root` and `.dark` block of a stylesheet. */
export function readThemes(css) {
	const themes = { light: {}, dark: {} };
	const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
	const block = /(^|[\s}])(:root|\.dark)\s*\{([^{}]*)\}/g;
	for (const match of clean.matchAll(block)) {
		const target = match[2] === ':root' ? themes.light : themes.dark;
		for (const declaration of match[3].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
			target[declaration[1]] = declaration[2].trim();
		}
	}
	return themes;
}

function oklchToRgb(L, C, h) {
	const a = C * Math.cos((h * Math.PI) / 180);
	const b = C * Math.sin((h * Math.PI) / 180);
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const linear = [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	];
	return linear.map((x) => {
		const v = Math.min(1, Math.max(0, x));
		return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
	});
}

/** A colour value as [r, g, b, alpha] in 0–1 sRGB, or null when it is not a colour this check understands. */
export function parseColour(value) {
	const v = value.trim().toLowerCase();
	let m = v.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/);
	if (m) {
		const L = Number(m[1]) / (m[2] ? 100 : 1);
		const alpha = m[5] === undefined ? 1 : Number(m[5]) / (m[6] ? 100 : 1);
		return [...oklchToRgb(L, Number(m[3]), Number(m[4])), alpha];
	}
	m = v.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)(%?))?\s*\)$/);
	if (m) {
		const alpha = m[4] === undefined ? 1 : Number(m[4]) / (m[5] ? 100 : 1);
		return [Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255, alpha];
	}
	m = v.match(/^#([\da-f]{3}|[\da-f]{6})$/);
	if (m) {
		const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
		return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).concat(1);
	}
	if (v === 'white') return [1, 1, 1, 1];
	if (v === 'black') return [0, 0, 0, 1];
	return null;
}

const decode = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = ([r, g, b]) => 0.2126 * decode(r) + 0.7152 * decode(g) + 0.0722 * decode(b);
const over = (top, under) => top.slice(0, 3).map((c, i) => c * top[3] + under[i] * (1 - top[3]));

/** WCAG contrast ratio of two opaque sRGB colours. */
export function ratio(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/** Resolves `var(--x)` chains inside one theme's token map. */
function resolve(tokens, name, seen = new Set()) {
	const value = tokens[name];
	if (value === undefined || seen.has(name)) return undefined;
	const ref = value.match(/^var\(\s*--([\w-]+)\s*(?:,[^)]*)?\)$/);
	if (ref) return resolve(tokens, ref[1], new Set(seen).add(name));
	return value;
}

/**
 * Every pair of PAIRS and EDGES for one theme: { text, surface, ratio, min } (ratio null when a value cannot be read). An
 * edge's `text` is its border class, `border-<token>`; `min` is the ratio the pair must reach.
 */
export function measure(tokens, theme = 'light') {
	const results = [];
	const page = parseColour(resolve(tokens, 'background') ?? '#ffffff') ?? [1, 1, 1, 1];
	for (const pair of PAIRS) {
		const literal = pair.text.startsWith('#');
		const text = literal ? pair.text : `text-${pair.text}`;
		for (const name of pair.surfaces) {
			const fg = literal ? pair.text : resolve(tokens, pair.text);
			const bg = resolve(tokens, name);
			const alpha = pair.alpha?.[theme] ?? 1;
			const surface = `bg-${name}${alpha < 1 ? `/${Math.round(alpha * 100)}` : ''}`;
			if (fg === undefined || bg === undefined) continue;
			const fgColour = parseColour(fg);
			const bgColour = parseColour(bg);
			if (!fgColour || !bgColour) {
				results.push({ text, surface, ratio: null, min: MIN, note: `cannot read ${!fgColour ? fg : bg}` });
				continue;
			}
			// A translucent surface is seen over the page background, and over each token in `over`.
			const layered = [...bgColour.slice(0, 3), bgColour[3] * alpha];
			if (layered[3] >= 1) {
				const surfaceRgb = layered.slice(0, 3);
				results.push({ text, surface, ratio: ratio(over(fgColour, surfaceRgb), surfaceRgb), min: MIN });
				continue;
			}
			for (const under of [null, ...(pair.over ?? [])]) {
				const underColour = under === null ? page : parseColour(resolve(tokens, under) ?? '');
				if (!underColour) continue;
				const surfaceRgb = over(layered, underColour.slice(0, 3));
				const label = under === null ? surface : `${surface} on bg-${under}`;
				results.push({ text, surface: label, ratio: ratio(over(fgColour, surfaceRgb), surfaceRgb), min: MIN });
			}
		}
	}
	for (const { edge, surfaces } of EDGES) {
		const value = resolve(tokens, edge);
		for (const name of surfaces) {
			const bg = resolve(tokens, name);
			if (value === undefined || bg === undefined) continue;
			const edgeColour = parseColour(value);
			const bgColour = parseColour(bg);
			const row = { text: `border-${edge}`, surface: `bg-${name}`, min: MIN_EDGE };
			if (!edgeColour || !bgColour) {
				results.push({ ...row, ratio: null, note: `cannot read ${!edgeColour ? value : bg}` });
				continue;
			}
			const surfaceRgb = bgColour[3] < 1 ? over(bgColour, page) : bgColour.slice(0, 3);
			results.push({ ...row, ratio: ratio(over(edgeColour, surfaceRgb), surfaceRgb) });
		}
	}
	return results;
}
