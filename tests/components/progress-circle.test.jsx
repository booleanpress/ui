import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { ProgressCircle } from '@/components/progress-circle';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const range = (el) => el.querySelector('[data-slot=progress-circle-range]');

describe('ProgressCircle', () => {
    it('is a named progressbar with its value, min and max, and fills its arc to the value', async () => {
        renderUi(<ProgressCircle value={75} aria-label="Storage used" />);
        const ring = screen.getByRole('progressbar', { name: 'Storage used' });
        expect(ring).toHaveAttribute('aria-valuenow', '75');
        expect(ring).toHaveAttribute('aria-valuemin', '0');
        expect(ring).toHaveAttribute('aria-valuemax', '100');
        expect(ring).toHaveAttribute('aria-valuetext', '75%');
        expect(ring).toHaveAttribute('data-state', 'loading');
        expect(ring.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
        // 40 px box, 4 px ring: radius 18, circumference 36π; a quarter is left unfilled.
        const circumference = 2 * Math.PI * 18;
        expect(Number(range(ring).getAttribute('stroke-dasharray'))).toBeCloseTo(circumference);
        expect(Number(range(ring).getAttribute('stroke-dashoffset'))).toBeCloseTo(circumference / 4);
        await expectNoAxeViolations();
    });

    it('is named by visible text with aria-labelledby', async () => {
        renderUi(
            <>
                <span id="quota">Monthly sending quota</span>
                <ProgressCircle value={42} aria-labelledby="quota" />
            </>,
        );
        expect(screen.getByRole('progressbar', { name: 'Monthly sending quota' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('turns a quarter arc with no value, without aria-valuenow', async () => {
        renderUi(<ProgressCircle showValue aria-label="Checking the DNS records" />);
        const ring = screen.getByRole('progressbar');
        expect(ring).not.toHaveAttribute('aria-valuenow');
        expect(ring).toHaveAttribute('data-state', 'indeterminate');
        expect(ring.querySelector('svg').getAttribute('class')).toContain('animate-spin');
        expect(ring.querySelector('[data-slot=progress-circle-value]')).toBeNull();
        await expectNoAxeViolations();
    });

    it('writes the value in the middle with showValue, from getValueLabel when given, hidden from assistive technology', () => {
        const { rerender } = renderUi(<ProgressCircle value={75} showValue aria-label="Quota" />);
        const value = () => screen.getByRole('progressbar').querySelector('[data-slot=progress-circle-value]');
        expect(value()).toHaveTextContent('75%');
        expect(value()).toHaveAttribute('aria-hidden', 'true');
        rerender(<ProgressCircle value={4200} max={10000} showValue getValueLabel={(v, m) => `${v}/${m}`} aria-label="Quota" />);
        expect(value()).toHaveTextContent('4200/10000');
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '4200/10000');
    });

    it('formats the percentage in the provider’s locale', () => {
        renderUi(<ProgressCircle value={50} aria-label="Quota" />, { locale: 'de-DE' });
        const expected = new Intl.NumberFormat('de-DE', { style: 'percent', maximumFractionDigits: 0 }).format(0.5);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', expected);
    });

    it('takes the sm, default and lg sizes with their ring widths, and draws no value at sm', () => {
        renderUi(
            <>
                <ProgressCircle size="sm" value={40} showValue aria-label="Small" />
                <ProgressCircle value={40} aria-label="Default" />
                <ProgressCircle size="lg" value={40} strokeWidth={8} aria-label="Large" />
            </>,
        );
        const small = screen.getByRole('progressbar', { name: 'Small' });
        expect(small).toHaveAttribute('data-size', 'sm');
        expect(small.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
        expect(range(small)).toHaveAttribute('stroke-width', '3');
        expect(small.querySelector('[data-slot=progress-circle-value]')).toBeNull();
        expect(screen.getByRole('progressbar', { name: 'Default' })).toHaveAttribute('data-size', 'default');
        const large = screen.getByRole('progressbar', { name: 'Large' });
        expect(large.querySelector('svg')).toHaveAttribute('viewBox', '0 0 64 64');
        expect(range(large)).toHaveAttribute('stroke-width', '8');
    });

    it('colours the arc with the status variants', async () => {
        renderUi(
            <>
                {['success', 'info', 'warning', 'destructive'].map((v) => (
                    <ProgressCircle key={v} variant={v} value={50} aria-label={v} />
                ))}
            </>,
        );
        for (const v of ['success', 'info', 'warning', 'destructive']) {
            const ring = screen.getByRole('progressbar', { name: v });
            expect(ring).toHaveAttribute('data-variant', v);
            expect(ring.className).toContain(`text-${v}`);
        }
        await expectNoAxeViolations();
    });

    it('is complete at the top of the range', () => {
        renderUi(<ProgressCircle value={100} aria-label="Done" />);
        const ring = screen.getByRole('progressbar');
        expect(ring).toHaveAttribute('data-state', 'complete');
        expect(Number(range(ring).getAttribute('stroke-dashoffset'))).toBeCloseTo(0);
    });

    it('clamps a value outside the range and repairs a bad max, without a console error', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        renderUi(
            <>
                <ProgressCircle value={250} max={200} showValue aria-label="Over" />
                <ProgressCircle value={-1} aria-label="Under" />
                <ProgressCircle value={40} max={-3} aria-label="Bad max" />
            </>,
        );
        const over = screen.getByRole('progressbar', { name: 'Over' });
        expect(over).toHaveAttribute('aria-valuenow', '200');
        expect(over).toHaveAttribute('data-state', 'complete');
        expect(over.querySelector('[data-slot=progress-circle-value]')).toHaveTextContent('100%');
        expect(Number(range(over).getAttribute('stroke-dashoffset'))).toBeCloseTo(0);
        expect(screen.getByRole('progressbar', { name: 'Under' })).toHaveAttribute('aria-valuenow', '0');
        expect(screen.getByRole('progressbar', { name: 'Bad max' })).toHaveAttribute('aria-valuemax', '100');
        expect(error).not.toHaveBeenCalled();
        error.mockRestore();
    });
});
