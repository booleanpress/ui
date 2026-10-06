// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { measure, parseColour, ratio, readThemes } from '../bin/bui-contrast.mjs';

describe('bui-contrast', () => {
    it('computes WCAG ratios', () => {
        expect(ratio([1, 1, 1], [0, 0, 0])).toBeCloseTo(21, 5);
        expect(ratio(parseColour('#767676').slice(0, 3), [1, 1, 1])).toBeCloseTo(4.54, 2);
    });

    it('reads oklch with and without alpha', () => {
        expect(parseColour('oklch(1 0 0)').slice(0, 3).map((c) => Math.round(c * 255))).toEqual([255, 255, 255]);
        expect(parseColour('oklch(1 0 0 / 10%)')[3]).toBeCloseTo(0.1, 5);
    });

    it('keeps text at AA and records the deliberately subtle control-edge exceptions', () => {
        const themes = readThemes(readFileSync(resolve(import.meta.dirname, '../theme.css'), 'utf8'));
        const light = themes.light;
        const dark = { ...light, ...themes.dark };
        const failing = [];
        for (const [theme, tokens] of [['light', light], ['dark', dark]]) {
            const rows = measure(tokens, theme);
            expect(rows.filter((r) => r.text === 'border-control')).toHaveLength(5);
            for (const row of rows) {
                expect(row.ratio, `${theme} ${row.text} on ${row.surface} is unreadable`).not.toBeNull();
                if (row.ratio < row.min) failing.push(`${theme} ${row.text} on ${row.surface}`);
            }
        }
        // The default visual contract uses subtle borders. The CLI still fails these at its unchanged 3:1 minimum.
        expect(failing).toEqual(['light', 'dark'].flatMap((theme) =>
            ['background', 'card', 'popover', 'muted', 'sidebar'].map((surface) => `${theme} border-control on bg-${surface}`),
        ));
    });

    it('passes all checks when the documented accessible edge overrides are applied', () => {
        const themes = readThemes(readFileSync(resolve(import.meta.dirname, '../theme.css'), 'utf8'));
        for (const tokens of [
            { ...themes.light, control: '#7c8ca2' },
            { ...themes.light, ...themes.dark, control: '#64748b' },
        ]) expect(measure(tokens).filter((row) => row.ratio === null || row.ratio < row.min)).toEqual([]);
    });

    it('reads rgb and rgba, as the dark theme\'s translucent status fills are written', () => {
        expect(parseColour('rgba(239, 68, 68, 0.16)')[3]).toBeCloseTo(0.16, 5);
        expect(parseColour('rgb(255, 255, 255)').slice(0, 3)).toEqual([1, 1, 1]);
    });

    it("fails a palette whose control edge is as pale as shadcn's stock input border", () => {
        const rows = measure({ background: 'oklch(1 0 0)', control: 'oklch(0.922 0 0)' });
        const row = rows.find((r) => r.text === 'border-control' && r.surface === 'bg-background');
        expect(row.min).toBe(3);
        expect(row.ratio).toBeLessThan(3);
    });

    it('measures the hover and press steps and a chosen option with focus, not the resting fill alone', () => {
        const rows = measure({
            'primary-foreground': '#ffffff',
            primary: '#1d4ed8',
            'primary-hover': '#bfdbfe',
            'highlight-foreground': '#ffffff',
            'highlight-focus': '#f1f5f9',
            'destructive-foreground': '#ffffff',
            'destructive-active': '#fecaca',
        });
        const at = (surface) => rows.find((r) => r.surface === surface).ratio;
        expect(at('bg-primary')).toBeGreaterThan(4.5);
        expect(at('bg-primary-hover')).toBeLessThan(4.5);
        expect(at('bg-highlight-focus')).toBeLessThan(4.5);
        expect(at('bg-destructive-active')).toBeLessThan(4.5);
    });

    it('fails a palette whose muted text is too light', () => {
        const rows = measure({ background: 'oklch(1 0 0)', 'muted-foreground': 'oklch(0.75 0 0)' });
        expect(rows.find((r) => r.text === 'text-muted-foreground' && r.surface === 'bg-background').ratio).toBeLessThan(4.5);
    });
});
