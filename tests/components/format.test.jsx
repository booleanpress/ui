import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import {
    FormatBytes,
    FormatCurrency,
    FormatDate,
    FormatNumber,
    FormatRelativeTime,
    formatBytes,
    formatCurrency,
    formatDate,
    formatNumber,
    formatRelativeTime,
} from '@/components/format';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const slot = (name) => document.querySelector(`[data-slot=${name}]`);
const NOW = '2026-10-14T12:00:00Z';

describe('formatNumber and FormatNumber', () => {
    it('writes a number in the provider’s locale inside a data element that keeps the raw value', async () => {
        renderUi(<FormatNumber value={1240861.5} />, { locale: 'de-DE' });
        const el = slot('format-number');
        expect(el.tagName).toBe('DATA');
        expect(el).toHaveAttribute('value', '1240861.5');
        expect(el).toHaveTextContent('1.240.861,5');
        await expectNoAxeViolations();
    });

    it('takes the decimal, percent, compact and unit styles and any Intl option', () => {
        expect(formatNumber(1240861, { locale: 'en-US' })).toBe('1,240,861');
        expect(formatNumber(0.4286, { locale: 'en-US', style: 'percent', maximumFractionDigits: 1 })).toBe('42.9%');
        expect(formatNumber(48250, { locale: 'en-US', style: 'compact' })).toBe('48K');
        expect(formatNumber(245, { locale: 'en-US', style: 'unit', unit: 'millisecond' })).toBe('245 ms');
        expect(formatNumber(0.031, { locale: 'en-US', style: 'percent', signDisplay: 'exceptZero', maximumFractionDigits: 1 })).toBe('+3.1%');
        expect(formatNumber(12345678901234567890n, { locale: 'en-US' })).toBe('12,345,678,901,234,567,890');
    });

    it('passes Intl options given as props, and the element’s own props to the element', () => {
        renderUi(<FormatNumber value={0.4286} style="percent" maximumFractionDigits={1} className="tabular-nums" id="open-rate" />, {
            locale: 'en-US',
        });
        const el = slot('format-number');
        expect(el).toHaveTextContent('42.9%');
        expect(el).toHaveAttribute('id', 'open-rate');
        expect(el).toHaveClass('tabular-nums');
        expect(el).not.toHaveAttribute('maximumFractionDigits');
    });

    it('lets the locale prop override the provider’s', () => {
        renderUi(<FormatNumber value={1234.5} locale="fr-FR" />, { locale: 'en-US' });
        expect(slot('format-number').textContent).toBe(new Intl.NumberFormat('fr-FR').format(1234.5));
    });

    it('writes nothing for NaN, and keeps no value', () => {
        expect(formatNumber(NaN)).toBe('');
        renderUi(<FormatNumber value={NaN} />);
        expect(slot('format-number')).toHaveTextContent('');
        expect(slot('format-number')).not.toHaveAttribute('value');
    });
});

describe('formatCurrency and FormatCurrency', () => {
    it('writes an amount in the currency and the provider’s locale', async () => {
        renderUi(<FormatCurrency value={1234.5} currency="EUR" />, { locale: 'de-DE' });
        const el = slot('format-currency');
        expect(el.textContent).toBe(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(1234.5));
        expect(el).toHaveAttribute('value', '1234.5');
        expect(el).toHaveAttribute('data-currency', 'EUR');
        await expectNoAxeViolations();
    });

    it('takes accounting signs, compact notation and fraction digits', () => {
        expect(formatCurrency(-45, { currency: 'GBP', locale: 'en-US', currencySign: 'accounting' })).toBe('(£45.00)');
        expect(formatCurrency(482500, { currency: 'USD', locale: 'en-US', notation: 'compact' })).toBe('$483K');
        expect(formatCurrency(0.085, { currency: 'USD', locale: 'en-US', maximumFractionDigits: 3 })).toBe('$0.085');
        expect(formatCurrency(29, { currency: 'USD', locale: 'en-US' })).toBe('$29.00');
    });
});

describe('formatBytes and FormatBytes', () => {
    it('steps by 1,000 with the short symbols B, KB, MB and GB, the number in the locale', () => {
        expect(formatBytes(0, { locale: 'en-US' })).toBe('0 B');
        expect(formatBytes(512, { locale: 'en-US' })).toBe('512 B');
        expect(formatBytes(245_760, { locale: 'en-US' })).toBe('245.8 KB');
        expect(formatBytes(1_500_000, { locale: 'en-US' })).toBe('1.5 MB');
        expect(formatBytes(2_147_483_648, { locale: 'en-US' })).toBe('2.1 GB');
        // French keeps its own spacing: a narrow no-break space before the unit.
        expect(formatBytes(1_500_000, { locale: 'fr-FR' })).toBe('1,5\u202fMB');
        expect(formatBytes(1_500_000, { locale: 'ar-EG' })).toBe('١٫٥ MB');
    });

    it('writes the locale’s own unit with unitDisplay', () => {
        expect(formatBytes(512, { locale: 'en-US', unitDisplay: 'long' })).toBe('512 bytes');
        expect(formatBytes(245_760, { locale: 'en-US', unitDisplay: 'short' })).toBe('245.8 kB');
        expect(formatBytes(1_500_000, { locale: 'fr-FR', unitDisplay: 'short' })).toBe(
            new Intl.NumberFormat('fr-FR', { style: 'unit', unit: 'megabyte', unitDisplay: 'short', maximumFractionDigits: 1 }).format(1.5),
        );
        expect(formatBytes(1_572_864, { locale: 'en-US', units: 'binary', unitDisplay: 'long' })).toBe('1.5 MiB');
    });

    it('steps by 1,024 with the IEC symbols in binary units, in the locale’s number format', () => {
        expect(formatBytes(512, { locale: 'en-US', units: 'binary' })).toBe('512 B');
        expect(formatBytes(1_572_864, { locale: 'en-US', units: 'binary' })).toBe('1.5 MiB');
        expect(formatBytes(2_147_483_648, { locale: 'en-US', units: 'binary' })).toBe('2 GiB');
        expect(formatBytes(1_572_864, { locale: 'de-DE', units: 'binary' })).toBe('1,5 MiB');
    });

    it('moves up a unit where rounding would reach the next one, and keeps the sign', () => {
        expect(formatBytes(999_960, { locale: 'en-US' })).toBe('1 MB');
        expect(formatBytes(1_048_575, { locale: 'en-US', units: 'binary' })).toBe('1 MiB');
        expect(formatBytes(-1_500_000, { locale: 'en-US' })).toBe('-1.5 MB');
        expect(formatBytes(1_234_567, { locale: 'en-US', maximumFractionDigits: 2 })).toBe('1.23 MB');
        expect(formatBytes(512, { locale: 'en-US', unitDisplay: 'short' })).toBe('512 byte');
        expect(formatBytes(Infinity)).toBe('');
    });

    it('renders a data element with the size in bytes as its value', async () => {
        renderUi(<FormatBytes value={3_670_016} units="binary" />, { locale: 'en-US' });
        const el = slot('format-bytes');
        expect(el.tagName).toBe('DATA');
        expect(el).toHaveAttribute('value', '3670016');
        expect(el).toHaveTextContent('3.5 MiB');
        await expectNoAxeViolations();
    });
});

describe('formatDate and FormatDate', () => {
    const SENT = '2026-10-14T09:30:00Z';

    it('writes a date in the provider’s locale and time zone inside a time element', async () => {
        renderUi(<FormatDate value={SENT} dateStyle="medium" timeStyle="short" />, { locale: 'en-US', timeZone: 'Europe/Berlin' });
        const el = slot('format-date');
        expect(el.tagName).toBe('TIME');
        expect(el).toHaveAttribute('dateTime', '2026-10-14T09:30:00.000Z');
        expect(el.textContent).toBe(
            new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Berlin' }).format(new Date(SENT)),
        );
        expect(el.textContent).toContain('11:30');
        await expectNoAxeViolations();
    });

    it('lets the timeZone prop override the provider’s', () => {
        renderUi(<FormatDate value={SENT} timeStyle="short" timeZone="Asia/Tokyo" />, { locale: 'en-US', timeZone: 'Europe/Berlin' });
        expect(slot('format-date').textContent).toBe(
            new Intl.DateTimeFormat('en-US', { timeStyle: 'short', timeZone: 'Asia/Tokyo' }).format(new Date(SENT)),
        );
    });

    it('writes a medium date when no field is given, and takes fields of its own', () => {
        expect(formatDate(SENT, { locale: 'en-US', timeZone: 'UTC' })).toBe('Oct 14, 2026');
        expect(formatDate(SENT, { locale: 'en-US', timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' })).toBe('Wednesday, October 14');
        expect(formatDate(new Date(SENT).getTime(), { locale: 'de-DE', timeZone: 'UTC', dateStyle: 'long' })).toBe('14. Oktober 2026');
    });

    it('writes a date-only string as that calendar day in every time zone', () => {
        for (const timeZone of ['America/Los_Angeles', 'UTC', 'Pacific/Kiritimati']) {
            expect(formatDate('2026-10-31', { locale: 'en-US', timeZone, dateStyle: 'long' })).toBe('October 31, 2026');
        }
        renderUi(<FormatDate value="2026-10-31" dateStyle="long" />, { locale: 'en-US', timeZone: 'America/Los_Angeles' });
        expect(slot('format-date')).toHaveAttribute('dateTime', '2026-10-31');
        expect(slot('format-date')).toHaveTextContent('October 31, 2026');
    });

    it('writes nothing for an invalid date, and keeps no dateTime', () => {
        expect(formatDate('not a date')).toBe('');
        renderUi(<FormatDate value="not a date" />);
        expect(slot('format-date')).toHaveTextContent('');
        expect(slot('format-date')).not.toHaveAttribute('dateTime');
    });
});

describe('formatRelativeTime and FormatRelativeTime', () => {
    afterEach(() => vi.useRealTimers());

    it('picks the largest unit that keeps the number at 1 or more', () => {
        const at = (iso) => formatRelativeTime(iso, { locale: 'en-US', now: NOW });
        expect(at('2026-10-14T12:00:00Z')).toBe('now');
        expect(at('2026-10-14T11:59:15Z')).toBe('45 seconds ago');
        expect(at('2026-10-14T11:48:00Z')).toBe('12 minutes ago');
        expect(at('2026-10-14T09:02:00Z')).toBe('3 hours ago');
        expect(at('2026-10-13T08:30:00Z')).toBe('yesterday');
        expect(at('2026-10-10T12:00:00Z')).toBe('4 days ago');
        expect(at('2026-09-29T10:00:00Z')).toBe('2 weeks ago');
        expect(at('2026-08-14T12:00:00Z')).toBe('2 months ago');
        expect(at('2024-10-14T12:00:00Z')).toBe('2 years ago');
        expect(at('2026-10-17T09:00:00Z')).toBe('in 3 days');
    });

    it('takes a forced unit, numeric always and the short style', () => {
        expect(formatRelativeTime('2026-10-13T12:00:00Z', { locale: 'en-US', now: NOW, numeric: 'always' })).toBe('1 day ago');
        expect(formatRelativeTime('2026-10-13T12:00:00Z', { locale: 'en-US', now: NOW, unit: 'hour' })).toBe('24 hours ago');
        expect(formatRelativeTime('2026-10-14T09:00:00Z', { locale: 'en-US', now: NOW, style: 'short' })).toBe('3 hr. ago');
        expect(formatRelativeTime('2026-10-14T09:00:00Z', { locale: 'de-DE', now: NOW })).toBe('vor 3 Stunden');
        expect(formatRelativeTime('nope', { now: NOW })).toBe('');
    });

    it('renders a time element in the provider’s locale against a fixed now', async () => {
        renderUi(<FormatRelativeTime value="2026-10-14T09:00:00Z" now={NOW} />, { locale: 'de-DE' });
        const el = slot('format-relative-time');
        expect(el.tagName).toBe('TIME');
        expect(el).toHaveAttribute('dateTime', '2026-10-14T09:00:00.000Z');
        expect(el).toHaveTextContent('vor 3 Stunden');
        await expectNoAxeViolations();
    });

    it('writes the time again every minute with live, and stops when it is removed', () => {
        vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
        vi.setSystemTime(new Date('2026-10-14T12:00:30Z'));
        const clear = vi.spyOn(window, 'clearInterval');
        const { unmount } = renderUi(<FormatRelativeTime value="2026-10-14T12:00:00Z" live />, { locale: 'en-US' });
        expect(slot('format-relative-time')).toHaveTextContent('30 seconds ago');
        act(() => vi.advanceTimersByTime(60_000));
        expect(slot('format-relative-time')).toHaveTextContent('2 minutes ago');
        act(() => vi.advanceTimersByTime(120_000));
        expect(slot('format-relative-time')).toHaveTextContent('4 minutes ago');
        unmount();
        expect(clear).toHaveBeenCalled();
        clear.mockRestore();
    });

    it('writes the server’s text again against the browser’s clock once hydrated', async () => {
        vi.useFakeTimers({ toFake: ['Date'] });
        const ui = (
            <BooleanUIProvider locale="en-US">
                <FormatRelativeTime value="2026-10-14T12:00:00Z" />
            </BooleanUIProvider>
        );
        // The page was rendered (and cached) at 12:00:30, and is opened three hours later.
        vi.setSystemTime(new Date('2026-10-14T12:00:30Z'));
        const host = document.createElement('div');
        host.innerHTML = renderToString(ui);
        document.body.append(host);
        expect(host).toHaveTextContent('30 seconds ago');
        vi.setSystemTime(new Date('2026-10-14T15:00:00Z'));
        const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
        let root;
        await act(async () => {
            root = hydrateRoot(host, ui);
        });
        expect(host.querySelector('[data-slot=format-relative-time]')).toHaveTextContent('3 hours ago');
        expect(errors).not.toHaveBeenCalled();
        errors.mockRestore();
        act(() => root.unmount());
        host.remove();
    });

    it('does not tick without live, or when now is given', () => {
        vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
        vi.setSystemTime(new Date('2026-10-14T12:00:30Z'));
        renderUi(
            <>
                <FormatRelativeTime value="2026-10-14T12:00:00Z" />
                <FormatRelativeTime value="2026-10-14T12:00:00Z" now="2026-10-14T12:10:00Z" live />
            </>,
            { locale: 'en-US' },
        );
        act(() => vi.advanceTimersByTime(180_000));
        const [plain, fixed] = document.querySelectorAll('[data-slot=format-relative-time]');
        expect(plain).toHaveTextContent('30 seconds ago');
        expect(fixed).toHaveTextContent('10 minutes ago');
    });
});

describe('Format in another locale', () => {
    it('writes every part in the provider’s locale, Arabic digits included', async () => {
        renderUi(
            <div lang="ar-EG" dir="rtl">
                <FormatNumber value={1240861.5} />
                <FormatCurrency value={1234.5} currency="EGP" />
                <FormatBytes value={3_670_016} />
                <FormatDate value="2026-10-14" dateStyle="long" />
                <FormatRelativeTime value="2026-10-14T09:00:00Z" now={NOW} />
            </div>,
            { locale: 'ar-EG' },
        );
        expect(slot('format-number').textContent).toBe(new Intl.NumberFormat('ar-EG').format(1240861.5));
        expect(slot('format-currency').textContent).toBe(new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(1234.5));
        expect(slot('format-date').textContent).toBe(
            new Intl.DateTimeFormat('ar-EG', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date('2026-10-14T00:00:00Z')),
        );
        expect(slot('format-relative-time').textContent).toBe(new Intl.RelativeTimeFormat('ar-EG', { numeric: 'auto' }).format(-3, 'hour'));
        expect(slot('format-number').textContent).toMatch(/[٠-٩]/);
        expect(screen.getByText(slot('format-bytes').textContent)).toBeInTheDocument();
        await expectNoAxeViolations();
    });
});
