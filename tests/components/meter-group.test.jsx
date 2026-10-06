import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { MeterGroup, MeterGroupLegend, MeterGroupMeters } from '@/components/meter-group';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const STORAGE = [
    { label: 'Attachments', value: 16 },
    { label: 'Logs', value: 8, color: 'var(--success)' },
    { label: 'Templates', value: 24, icon: <svg data-testid="icon" /> },
];

describe('MeterGroup', () => {
    it('is a named group of meters, one per segment, with their values', async () => {
        renderUi(<MeterGroup aria-label="Storage by type" values={STORAGE} />, { locale: 'en-US' });
        expect(screen.getByRole('group', { name: 'Storage by type' })).toBeInTheDocument();
        const meters = screen.getAllByRole('meter');
        expect(meters).toHaveLength(3);
        const logs = screen.getByRole('meter', { name: 'Logs' });
        expect(logs).toHaveAttribute('aria-valuenow', '8');
        expect(logs).toHaveAttribute('aria-valuemin', '0');
        expect(logs).toHaveAttribute('aria-valuemax', '100');
        expect(logs).toHaveAttribute('aria-valuetext', '8%');
        expect(logs.style.width).toBe('8%');
        await expectNoAxeViolations();
    });

    it('colours the segments with the chart colours in turn unless one names its own', () => {
        renderUi(<MeterGroup aria-label="Storage" values={STORAGE} />);
        const [attachments, logs, templates] = screen.getAllByRole('meter');
        expect(attachments.style.backgroundColor).toBe('var(--chart-1)');
        expect(logs.style.backgroundColor).toBe('var(--success)');
        expect(templates.style.backgroundColor).toBe('var(--chart-3)');
    });

    it('measures each segment against max - min', () => {
        renderUi(<MeterGroup aria-label="Storage, of 200 GB" values={STORAGE} max={200} />, { locale: 'en-US' });
        const attachments = screen.getByRole('meter', { name: 'Attachments' });
        expect(attachments).toHaveAttribute('aria-valuemax', '200');
        expect(attachments).toHaveAttribute('aria-valuetext', '8%');
        expect(attachments.style.width).toBe('8%');
    });

    it('writes the values in the provider’s locale, or with formatValue', () => {
        const { unmount } = renderUi(<MeterGroup aria-label="Storage" values={STORAGE} />, { locale: 'de-DE' });
        const expected = new Intl.NumberFormat('de-DE', { style: 'percent', maximumFractionDigits: 0 }).format(0.16);
        expect(screen.getByRole('meter', { name: 'Attachments' })).toHaveAttribute('aria-valuetext', expected);
        expect(document.querySelector('[data-slot=meter-group-label-text]').textContent).toBe(`Attachments (${expected})`);
        unmount();
        renderUi(<MeterGroup aria-label="Storage" values={STORAGE} formatValue={(value) => `${value} GB`} />);
        expect(screen.getByRole('meter', { name: 'Logs' })).toHaveAttribute('aria-valuetext', '8 GB');
    });

    it('hides the legend, which repeats the meters, and draws an icon in place of a dot', async () => {
        renderUi(<MeterGroup aria-label="Storage" values={STORAGE} />);
        const legend = document.querySelector('[data-slot=meter-group-legend]');
        expect(legend.tagName).toBe('OL');
        expect(legend).toHaveAttribute('aria-hidden', 'true');
        expect(legend.querySelectorAll('[data-slot=meter-group-label-marker]')).toHaveLength(2);
        expect(legend.querySelector('[data-slot=meter-group-label-icon]')).toContainElement(screen.getByTestId('icon'));
        await expectNoAxeViolations();
    });

    it('puts the legend first with labelPosition="start", and in a column with labelOrientation', () => {
        renderUi(<MeterGroup aria-label="Storage" values={STORAGE} labelPosition="start" labelOrientation="vertical" />);
        const group = screen.getByRole('group');
        expect(group.firstElementChild).toHaveAttribute('data-slot', 'meter-group-legend');
        expect(group.firstElementChild).toHaveAttribute('data-orientation', 'vertical');
        expect(group.lastElementChild).toHaveAttribute('data-slot', 'meter-group-meters');
    });

    it('stands the track up with orientation="vertical", each meter as tall as its share', async () => {
        renderUi(<MeterGroup aria-label="Storage" values={STORAGE} orientation="vertical" />);
        expect(screen.getByRole('group')).toHaveAttribute('data-orientation', 'vertical');
        expect(screen.getByRole('meter', { name: 'Templates' }).style.height).toBe('24%');
        expect(document.querySelector('[data-slot=meter-group-legend]')).toHaveAttribute('data-orientation', 'vertical');
        await expectNoAxeViolations();
    });

    it('keeps a share between 0 and 100%', () => {
        renderUi(<MeterGroup aria-label="Quota" values={[{ label: 'Over', value: 140 }, { label: 'Under', value: -5 }]} />);
        expect(screen.getByRole('meter', { name: 'Over' }).style.width).toBe('100%');
        expect(screen.getByRole('meter', { name: 'Under' }).style.width).toBe('0%');
    });

    it('never draws past the end of the track when the segments add up to more than the range', () => {
        renderUi(
            <MeterGroup
                aria-label="Quota"
                values={[
                    { label: 'Attachments', value: 60 },
                    { label: 'Logs', value: 30 },
                    { label: 'Backups', value: 40 },
                    { label: 'Templates', value: 10 },
                ]}
            />,
            { locale: 'en-US' },
        );
        const meters = screen.getAllByRole('meter');
        expect(meters.map((m) => m.style.width)).toEqual(['60%', '30%', '10%', '0%']);
        // Each meter still reads its own value.
        expect(screen.getByRole('meter', { name: 'Backups' })).toHaveAttribute('aria-valuetext', '40%');
    });

    it('keeps aria-valuenow within the range while the text says the real amount', () => {
        renderUi(<MeterGroup aria-label="Quota" values={[{ label: 'Over', value: 140 }, { label: 'Under', value: -5 }]} formatValue={(v) => `${v} GB`} />);
        const over = screen.getByRole('meter', { name: 'Over' });
        expect(over).toHaveAttribute('aria-valuenow', '100');
        expect(over).toHaveAttribute('aria-valuetext', '140 GB');
        expect(screen.getByRole('meter', { name: 'Under' })).toHaveAttribute('aria-valuenow', '0');
    });

    it('takes a custom legend from children, with the parts', async () => {
        renderUi(
            <MeterGroup aria-label="Storage" values={STORAGE}>
                <p>140 GB of 200 GB</p>
                <MeterGroupMeters />
                <MeterGroupLegend orientation="vertical" />
            </MeterGroup>,
        );
        expect(screen.getByText('140 GB of 200 GB')).toBeInTheDocument();
        expect(screen.getAllByRole('meter')).toHaveLength(3);
        await expectNoAxeViolations();
    });

    it('throws a clear error for a part outside a MeterGroup', () => {
        const error = console.error;
        console.error = () => {};
        expect(() => renderUi(<MeterGroupMeters />)).toThrow('MeterGroupMeters must be used inside a MeterGroup.');
        console.error = error;
    });
});
