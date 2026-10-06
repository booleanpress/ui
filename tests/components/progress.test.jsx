import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Progress } from '@/components/progress';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Progress', () => {
    it('emits aria-valuenow and data-state="loading" for a value (boolean-ui patch)', async () => {
        renderUi(<Progress value={60} aria-label="Import progress" />);
        const bar = screen.getByRole('progressbar', { name: 'Import progress' });
        expect(bar).toHaveAttribute('aria-valuenow', '60');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
        expect(bar).toHaveAttribute('data-state', 'loading');
        expect(bar.querySelector('[data-slot=progress-indicator]').style.transform).toBe('translateX(-40%)');
        await expectNoAxeViolations();
    });

    it('is complete at 100', async () => {
        renderUi(<Progress value={100} aria-label="Import progress" />);
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveAttribute('aria-valuenow', '100');
        expect(bar).toHaveAttribute('data-state', 'complete');
        expect(bar.querySelector('[data-slot=progress-indicator]').style.transform).toBe('translateX(-0%)');
    });

    it('follows a controlled value', () => {
        const { rerender } = renderUi(<Progress value={25} aria-label="Setup" />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
        rerender(<Progress value={50} aria-label="Setup" />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    });

    it('has no aria-valuenow without a value, and reads as indeterminate', () => {
        renderUi(<Progress aria-label="Working" />);
        const bar = screen.getByRole('progressbar');
        expect(bar).not.toHaveAttribute('aria-valuenow');
        expect(bar).toHaveAttribute('data-state', 'indeterminate');
    });

    it('is named by a label element', async () => {
        renderUi(
            <>
                <span id="p-label">Importing people</span>
                <Progress value={10} aria-labelledby="p-label" />
            </>,
        );
        expect(screen.getByRole('progressbar', { name: 'Importing people' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });
});

describe('Progress: additions', () => {
    it('writes the value inside the bar with showValue, hidden from assistive technology, matching aria-valuetext', async () => {
        renderUi(<Progress value={50} showValue aria-label="Import progress" />);
        const bar = screen.getByRole('progressbar', { name: 'Import progress' });
        const label = bar.querySelector('[data-slot=progress-value]');
        expect(label).toHaveTextContent('50%');
        expect(label).toHaveAttribute('aria-hidden', 'true');
        expect(label.style.transform).toBe('translateX(25%)');
        expect(bar).toHaveAttribute('aria-valuetext', '50%');
        await expectNoAxeViolations();
    });

    it('formats the percentage in the provider’s locale', () => {
        renderUi(<Progress value={50} showValue aria-label="Import" />, { locale: 'fr-FR' });
        const expected = new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 0 }).format(0.5);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', expected);
        expect(screen.getByRole('progressbar').querySelector('[data-slot=progress-value]').textContent).toBe(expected);
    });

    it('fills value out of max, and shows getValueLabel’s text inside the bar and to screen readers', async () => {
        renderUi(
            <Progress value={512} max={1024} showValue getValueLabel={(v, m) => `${v} of ${m} sent`} aria-label="Newsletter" />,
        );
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveAttribute('aria-valuemax', '1024');
        expect(bar).toHaveAttribute('aria-valuetext', '512 of 1024 sent');
        expect(bar.querySelector('[data-slot=progress-indicator]').style.transform).toBe('translateX(-50%)');
        expect(bar.querySelector('[data-slot=progress-value]')).toHaveTextContent('512 of 1024 sent');
        await expectNoAxeViolations();
    });

    it('slides an indeterminate bar with no value, without aria-valuenow or a value label', async () => {
        renderUi(<Progress showValue aria-label="Connecting" />);
        const bar = screen.getByRole('progressbar');
        expect(bar).not.toHaveAttribute('aria-valuenow');
        expect(bar).not.toHaveAttribute('aria-valuetext');
        const indicator = bar.querySelector('[data-slot=progress-indicator]');
        expect(indicator.className).toContain('animate-[enter_2s_var(--bui-ease-standard)_infinite]');
        expect(indicator.className).toContain('motion-reduce:translate-x-3/4');
        expect(bar.querySelector('[data-slot=progress-value]')).toBeNull();
        await expectNoAxeViolations();
    });

    it('draws segments that fill in turn from one value', async () => {
        const { rerender } = renderUi(<Progress value={50} steps={4} aria-label="Setup" />);
        const states = () => [...document.querySelectorAll('[data-slot=progress-step]')].map((el) => el.getAttribute('data-state'));
        expect(states()).toEqual(['complete', 'complete', 'empty', 'empty']);
        expect(document.querySelectorAll('[data-slot=progress-step-indicator]')).toHaveLength(4);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
        rerender(<Progress value={62.5} steps={4} aria-label="Setup" />);
        expect(states()).toEqual(['complete', 'complete', 'partial', 'empty']);
        await expectNoAxeViolations();
    });

    it('takes the sm, default and lg sizes, and draws no value at sm', () => {
        renderUi(
            <>
                <Progress size="sm" value={40} showValue aria-label="Small" />
                <Progress value={40} aria-label="Default" />
                <Progress size="lg" value={40} showValue aria-label="Large" />
            </>,
        );
        expect(screen.getByRole('progressbar', { name: 'Small' })).toHaveAttribute('data-size', 'sm');
        expect(screen.getByRole('progressbar', { name: 'Small' }).querySelector('[data-slot=progress-value]')).toBeNull();
        expect(screen.getByRole('progressbar', { name: 'Default' })).toHaveAttribute('data-size', 'default');
        expect(screen.getByRole('progressbar', { name: 'Large' })).toHaveAttribute('data-size', 'lg');
        expect(screen.getByRole('progressbar', { name: 'Large' }).querySelector('[data-slot=progress-value]')).toHaveTextContent('40%');
    });

    it('clamps a value outside the range and repairs a bad max, without a console error or an indeterminate bar', async () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        renderUi(
            <>
                <Progress value={120} showValue aria-label="Over" />
                <Progress value={-5} aria-label="Under" />
                <Progress value={3} max={0} aria-label="Bad max" />
                <Progress value={Number.NaN} aria-label="Not a number" />
            </>,
        );
        const over = screen.getByRole('progressbar', { name: 'Over' });
        expect(over).toHaveAttribute('aria-valuenow', '100');
        expect(over).toHaveAttribute('aria-valuetext', '100%');
        expect(over).toHaveAttribute('data-state', 'complete');
        expect(over.querySelector('[data-slot=progress-value]')).toHaveTextContent('100%');
        const under = screen.getByRole('progressbar', { name: 'Under' });
        expect(under).toHaveAttribute('aria-valuenow', '0');
        expect(under.querySelector('[data-slot=progress-indicator]').style.transform).toBe('translateX(-100%)');
        const badMax = screen.getByRole('progressbar', { name: 'Bad max' });
        expect(badMax).toHaveAttribute('aria-valuemax', '100');
        expect(badMax).toHaveAttribute('aria-valuenow', '3');
        expect(screen.getByRole('progressbar', { name: 'Not a number' })).toHaveAttribute('data-state', 'indeterminate');
        expect(error).not.toHaveBeenCalled();
        error.mockRestore();
        await expectNoAxeViolations();
    });

    it('labels a value out of a max other than 100 as its share of the max', () => {
        renderUi(<Progress value={3} max={5} showValue aria-label="Setup" />);
        const bar = screen.getByRole('progressbar', { name: 'Setup' });
        expect(bar).toHaveAttribute('aria-valuemax', '5');
        expect(bar).toHaveAttribute('aria-valuetext', '60%');
        expect(bar.querySelector('[data-slot=progress-value]')).toHaveTextContent('60%');
    });
});
