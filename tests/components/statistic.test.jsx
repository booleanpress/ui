import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Statistic, StatisticGroup } from '@/components/statistic';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Statistic', () => {
    it('pairs the label and the value in a description list', async () => {
        renderUi(<Statistic label="Emails sent" value={12408} />);
        expect(screen.getByRole('term')).toHaveTextContent('Emails sent');
        expect(screen.getAllByRole('definition')[0]).toHaveTextContent('12,408');
        await expectNoAxeViolations();
    });

    it('formats the value in the provider’s locale', () => {
        renderUi(
            <>
                <Statistic label="Sent" value={12408.5} />
                <Statistic label="Revenue" value={48250.5} format="currency" currency="EUR" />
                <Statistic label="Open rate" value={0.428} format="percent" />
                <Statistic label="Subscribers" value={12400} format="compact" />
            </>,
            { locale: 'de-DE' },
        );
        const values = document.querySelectorAll('[data-slot=statistic-value]');
        expect(values[0].textContent).toBe(new Intl.NumberFormat('de-DE').format(12408.5));
        expect(values[1].textContent).toBe(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(48250.5));
        expect(values[2].textContent).toBe(new Intl.NumberFormat('de-DE', { style: 'percent', maximumFractionDigits: 1 }).format(0.428));
        expect(values[3].textContent).toBe(new Intl.NumberFormat('de-DE', { notation: 'compact', maximumFractionDigits: 1 }).format(12400));
    });

    it('writes compact numbers as 12.4K in English, and lays formatOptions over the format', () => {
        renderUi(
            <>
                <Statistic label="Subscribers" value={12400} format="compact" />
                <Statistic label="Average order" value={64.2} format="currency" currency="USD" formatOptions={{ maximumFractionDigits: 0 }} />
                <Statistic label="Plan" value="Business" />
            </>,
            { locale: 'en-US' },
        );
        const values = document.querySelectorAll('[data-slot=statistic-value]');
        expect(values[0].textContent).toBe('12.4K');
        expect(values[1].textContent).toBe('$64');
        expect(values[2].textContent).toBe('Business');
    });

    it('isolates a written number, so a negative keeps its minus sign in front on a right-to-left page', () => {
        renderUi(
            <>
                <Statistic label="Refunds" value={-64} format="currency" currency="USD" />
                <Statistic label="Plan" value="Business" />
            </>,
            { locale: 'en-US', dir: 'rtl' },
        );
        const [refunds, plan] = document.querySelectorAll('[data-slot=statistic-value]');
        const bdi = refunds.querySelector('bdi');
        expect(bdi).not.toBeNull();
        expect(bdi.textContent).toBe(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(-64));
        // A string is the consumer's text, shown as it is.
        expect(plan.querySelector('bdi')).toBeNull();
    });

    it('writes the number plainly, rather than failing, when the currency code is not one Intl knows', () => {
        renderUi(<Statistic label="Revenue" value={48250.5} format="currency" currency="EURO" />, { locale: 'en-US' });
        expect(document.querySelector('[data-slot=statistic-value]').textContent).toBe('48,250.5');
    });

    it('says "Up" and the change for a rise, in the success colour', async () => {
        renderUi(<Statistic label="Delivered" value={11982} trend="up" trendValue={0.124} helpText="since last week" />, { locale: 'en-US' });
        const trend = document.querySelector('[data-slot=statistic-trend]');
        expect(trend).toHaveAttribute('data-trend', 'up');
        expect(trend.className).toContain('text-success-tag-foreground');
        expect(screen.getByText('Up 12.4%')).toHaveClass('sr-only');
        expect(screen.getByText('since last week', { exact: false })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('says "Down" for a fall, in the destructive colour, and the other way round with invertTrendColor', () => {
        renderUi(
            <>
                <Statistic label="Open rate" value={0.38} format="percent" trend="down" trendValue={0.021} />
                <Statistic label="Bounces" value={86} trend="down" trendValue={0.3} invertTrendColor />
            </>,
            { locale: 'en-US' },
        );
        const [open, bounces] = document.querySelectorAll('[data-slot=statistic-trend]');
        expect(open.className).toContain('text-destructive-tag-foreground');
        expect(screen.getByText('Down 2.1%')).toBeInTheDocument();
        expect(bounces.className).toContain('text-success-tag-foreground');
        expect(screen.getByText('Down 30%')).toBeInTheDocument();
    });

    it('takes the trend words from the provider and writes the change in its locale', () => {
        renderUi(<Statistic label="Zugestellt" value={11982} trend="up" trendValue={0.124} />, {
            locale: 'de-DE',
            strings: { trendUp: 'Gestiegen um {value}' },
        });
        const change = new Intl.NumberFormat('de-DE', { style: 'percent', maximumFractionDigits: 1 }).format(0.124);
        const words = document.querySelector('[data-slot=statistic-trend] .sr-only');
        expect(words.textContent).toBe(`Gestiegen um ${change}`);
    });

    it('shows a placeholder and reads "Loading" while loading, marked busy', async () => {
        renderUi(<Statistic label="Sent" value={12408} trend="up" trendValue={0.1} loading />);
        const root = document.querySelector('[data-slot=statistic]');
        expect(root).toHaveAttribute('aria-busy', 'true');
        expect(root.querySelector('[data-slot=skeleton]')).not.toBeNull();
        expect(screen.getAllByRole('definition')[0]).toHaveTextContent('Loading');
        expect(screen.queryByText('12,408')).toBeNull();
        expect(document.querySelector('[data-slot=statistic-trend]')).toBeNull();
        await expectNoAxeViolations();
    });

    it('draws a decorative icon, the card variant and the sizes', async () => {
        renderUi(
            <>
                <Statistic label="Sent" value={1} variant="card" icon={<svg data-testid="icon" />} iconClassName="bg-info-tag" />
                <Statistic label="Small" value={1} size="sm" />
            </>,
        );
        const [card, small] = document.querySelectorAll('[data-slot=statistic]');
        expect(card).toHaveAttribute('data-variant', 'card');
        expect(card).toHaveAttribute('data-size', 'default');
        const icon = card.querySelector('[data-slot=statistic-icon]');
        expect(icon).toHaveAttribute('aria-hidden', 'true');
        expect(icon.className).toContain('bg-info-tag');
        expect(small).toHaveAttribute('data-size', 'sm');
        expect(small).toHaveAttribute('data-variant', 'plain');
        await expectNoAxeViolations();
    });

    it('makes the statistics in a StatisticGroup cards, unless they or the group say otherwise', async () => {
        renderUi(
            <>
                <StatisticGroup>
                    <Statistic label="Sent" value={1} />
                    <Statistic label="Opened" value={2} variant="plain" />
                </StatisticGroup>
                <StatisticGroup variant="plain">
                    <Statistic label="Bounced" value={3} />
                </StatisticGroup>
            </>,
        );
        const variants = [...document.querySelectorAll('[data-slot=statistic]')].map((s) => s.getAttribute('data-variant'));
        expect(variants).toEqual(['card', 'plain', 'plain']);
        await expectNoAxeViolations();
    });
});
