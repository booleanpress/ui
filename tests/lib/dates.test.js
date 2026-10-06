import { describe, expect, it } from 'vitest';
import { dateFromParts, expandYear, formatDateText, getDateParts, parseDateText } from '@/lib/dates';

const at = (year, month, day, hour = 0, minute = 0) => ({ year, month, day, hour, minute, second: 0 });

describe('dateFromParts in a time zone', () => {
    it('keeps a day whose midnight the clocks skip on that day, as the first instant of it', () => {
        // Summer time starts at midnight in Santiago (6 September 2026) and Havana (8 March 2026): 00:00 never happens.
        for (const [zone, parts] of [
            ['America/Santiago', at(2026, 9, 6)],
            ['America/Havana', at(2026, 3, 8)],
        ]) {
            const date = dateFromParts(parts, zone);
            expect(getDateParts(date, zone)).toMatchObject({ year: parts.year, month: parts.month, day: parts.day, hour: 1 });
        }
    });

    it('moves a time in the skipped hour forward by the jump, and takes the first of a repeated time', () => {
        // 02:30 on 8 March 2026 never happens in New York: it is 03:30 summer time (07:30 UTC).
        expect(dateFromParts(at(2026, 3, 8, 2, 30), 'America/New_York').toISOString()).toBe('2026-03-08T07:30:00.000Z');
        // 01:30 on 1 November 2026 happens twice: first in summer time (05:30 UTC).
        expect(dateFromParts(at(2026, 11, 1, 1, 30), 'America/New_York').toISOString()).toBe('2026-11-01T05:30:00.000Z');
        expect(dateFromParts(at(2026, 10, 14), 'Asia/Tokyo').toISOString()).toBe('2026-10-13T15:00:00.000Z');
    });
});

describe('parseDateText', () => {
    it('reads a day period written before the time, as Korean and Chinese write it', () => {
        expect(parseDateText('2026. 10. 14. 오후 9:30', { locale: 'ko-KR', showTime: true })).toMatchObject({ hour: 21, minute: 30 });
        expect(parseDateText('2026/10/14 下午09:30', { locale: 'zh-CN', showTime: true, hourCycle: 12 })).toMatchObject({ hour: 21 });
        expect(parseDateText('10/14/2026, 9:30 p.m.', { locale: 'en-US', showTime: true })).toMatchObject({ hour: 21 });
        expect(parseDateText('10/14/2026 9:30 AM', { locale: 'en-US', showTime: true })).toMatchObject({ hour: 9 });
    });

    it('reads back the text it writes with a time, in locales with a day period first or other digits', () => {
        const date = new Date(2026, 9, 14, 21, 30);
        for (const locale of ['en-US', 'ko-KR', 'zh-TW', 'ar-EG', 'hi-IN', 'de-DE', 'ja-JP']) {
            const options = { locale, showTime: true, hourCycle: 12 };
            expect(parseDateText(formatDateText(date, options), options)).toMatchObject({ year: 2026, month: 10, day: 14, hour: 21, minute: 30 });
        }
    });

    it('reads a one- or two-digit year with a yyyy pattern as without one', () => {
        expect(parseDateText('05/10/26', { format: 'dd/MM/yyyy', referenceYear: 2026 })).toEqual({ year: 2026, month: 10, day: 5 });
        expect(parseDateText('05/10/2026', { format: 'dd/MM/yyyy' })).toEqual({ year: 2026, month: 10, day: 5 });
        expect(parseDateText('10/5/26', { locale: 'en-US', referenceYear: 2026 })).toEqual({ year: 2026, month: 10, day: 5 });
    });

    it('refuses days a month does not have, and knows leap years', () => {
        expect(parseDateText('31/02/2026', { locale: 'en-GB' })).toBeNull();
        expect(parseDateText('02/29/2025', { locale: 'en-US' })).toBeNull();
        expect(parseDateText('02/29/2024', { locale: 'en-US' })).toEqual({ year: 2024, month: 2, day: 29 });
        expect(parseDateText('29022024', { locale: 'en-GB' })).toEqual({ year: 2024, month: 2, day: 29 });
    });

    it('reads the locale order, year first included, and the locale digits', () => {
        expect(parseDateText('2026-10-05', { locale: 'en-CA' })).toEqual({ year: 2026, month: 10, day: 5 });
        expect(parseDateText('2026/10/05', { locale: 'ja-JP' })).toEqual({ year: 2026, month: 10, day: 5 });
        expect(parseDateText('05.10.2026', { locale: 'de-DE' })).toEqual({ year: 2026, month: 10, day: 5 });
        expect(parseDateText('٠٥/١٠/٢٠٢٦', { locale: 'ar-EG' })).toEqual({ year: 2026, month: 10, day: 5 });
        expect(parseDateText('৫/১০/২০২৬', { locale: 'bn-BD' })).toEqual({ year: 2026, month: 10, day: 5 });
    });
});

describe('expandYear', () => {
    it('reads a one- or two-digit year as the nearest to the reference year, within 50 years', () => {
        expect(expandYear('26', 2026)).toBe(2026);
        expect(expandYear('85', 2026)).toBe(1985);
        expect(expandYear('76', 2026)).toBe(2076);
        expect(expandYear('77', 2026)).toBe(1977);
        expect(expandYear('5', 2026)).toBe(2005);
        expect(expandYear('2026', 1990)).toBe(2026);
        expect(parseDateText('3/1/85', { locale: 'en-US', referenceYear: 2026 })).toEqual({ year: 1985, month: 3, day: 1 });
        expect(parseDateText('01/03/85', { format: 'dd/MM/yy', referenceYear: 2026 })).toEqual({ year: 1985, month: 3, day: 1 });
    });
});

describe('month and weekday names in every script', () => {
    const LOCALES = ['en-US', 'de-DE', 'bn-BD', 'hi-IN', 'ta-IN', 'th-TH', 'ar-EG', 'zh-CN', 'ja-JP', 'ko-KR'];
    const FORMATS = ['d MMMM yyyy', 'd MMM yyyy', 'EEEE, d MMMM yyyy'];

    it('reads back the text it writes, in each locale and pattern', () => {
        const date = new Date(Date.UTC(2026, 9, 5));
        for (const locale of LOCALES) {
            for (const format of FORMATS) {
                const options = { locale, format, timeZone: 'UTC' };
                const text = formatDateText(date, options);
                expect(parseDateText(text, options), `${locale} ${format}: "${text}"`).toMatchObject({ year: 2026, month: 10, day: 5 });
            }
        }
    });

    it('reads a month name typed into a field with no pattern', () => {
        expect(parseDateText('5 অক্টোবর 2026', { locale: 'bn-BD' })).toMatchObject({ year: 2026, month: 10, day: 5 });
        expect(parseDateText('5 अक्टूबर 2026', { locale: 'hi-IN' })).toMatchObject({ year: 2026, month: 10, day: 5 });
    });

    it('still refuses text that is not a date', () => {
        const options = { locale: 'bn-BD', format: 'd MMMM yyyy', timeZone: 'UTC' };
        expect(parseDateText('৫ নাম ২০২৬', options)).toBeNull();
        // The locale's own February, on a day it does not have.
        const february = formatDateText(new Date(Date.UTC(2026, 1, 28)), options);
        expect(parseDateText(february, options)).toMatchObject({ month: 2, day: 28 });
        expect(parseDateText(february.replace('২৮', '৩১'), options)).toBeNull();
        expect(parseDateText('5 oc 2026', { locale: 'en-US', format: 'd MMMM yyyy' })).toBeNull();
    });
});
