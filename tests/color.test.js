import { describe, expect, it } from 'vitest';
import { parseColor, toHex, toOklchCss, withChannel, channelValue } from '@/lib/color';

describe('picker colour conversion', () => {
    it.each([
        ['#abc', '#aabbcc'], ['#abcd', '#aabbccdd'], ['#ff000080', '#ff000080'],
        ['rgb(255 0 0 / 50%)', '#ff000080'], ['rgba(100%, 0%, 0%, .5)', '#ff000080'],
        ['hsl(120deg 100% 50%)', '#00ff00'], ['hsla(.5turn, 100%, 50%, .25)', '#00ffff40'],
        ['hsba(240 100 100 / .75)', '#0000ffbf'], ['hsv(60 100 100)', '#ffff00'],
        ['oklch(62.7955% .257683 29.2339)', '#ff0000'],
    ])('parses %s as %s', (input, expected) => expect(toHex(parseColor(input), true)).toBe(expected));

    it.each(['', '#12', 'nonsense', 'rgb(NaN 0 0)', 'rgb(1 2)', 'rgb(1 2 3 4 5)', 'rgb(1deg 2 3)', 'hsl(0 50turn 50%)', 'oklch(.5 .2 0 / 1deg)'])('rejects %s', (input) => expect(parseColor(input)).toBeNull());

    it.each(['#276def', '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#a6b5c480'])('round trips %s through OKLCH', (hex) => {
        expect(toHex(parseColor(toOklchCss(parseColor(hex))), true)).toBe(hex);
    });

    it('edits HSL independently of HSV saturation', () => {
        const red = parseColor('#804040');
        expect(channelValue(red, 'saturation', 'hsba')).toBeCloseTo(50);
        expect(channelValue(red, 'saturation', 'hsla')).toBeCloseTo(33.3333);
        expect(toHex(withChannel(red, 'lightness', 100, 'hsla'), true)).toBe('#ffffff');
    });

    it('edits OKLCH lightness and clips out-of-gamut colours to sRGB', () => {
        expect(toHex(withChannel(parseColor('#ff0000'), 'lightness', 0, 'oklcha'), true)).toMatch(/^#[0-9a-f]{6}$/);
        const white = parseColor('oklch(100% 0 0)');
        expect(toHex(white, true)).toBe('#ffffff');
        expect(channelValue(parseColor('#ff0000'), 'chroma', 'oklcha')).toBeCloseTo(0.257683, 5);
    });

    it('retains a visible alpha byte near opaque', () => expect(toHex({ h: 0, s: 100, v: 100, a: 99.6 }, true)).toBe('#ff0000fe'));
});
