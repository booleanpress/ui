import { beforeAll, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Area, AreaChart, Bar, BarChart, XAxis } from 'recharts';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/chart';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

// jsdom has no layout, so Recharts' ResponsiveContainer would measure 0 x 0 and draw nothing. This observer reports a
// fixed 320 x 200 box as soon as the container is observed.
beforeAll(() => {
    globalThis.ResizeObserver = class {
        constructor(callback) {
            this.callback = callback;
        }
        observe(target) {
            this.callback([{ target, contentRect: { width: 320, height: 200 } }], this);
        }
        unobserve() {}
        disconnect() {}
    };
    for (const [prop, value] of [['offsetWidth', 320], ['offsetHeight', 200]]) {
        Object.defineProperty(HTMLElement.prototype, prop, { configurable: true, get: () => value });
    }
    Element.prototype.getBoundingClientRect = () => ({ width: 320, height: 200, top: 0, left: 0, right: 320, bottom: 200, x: 0, y: 0, toJSON() {} });
});

const data = [
    { day: 'Mon', sent: 412 },
    { day: 'Tue', sent: 538 },
];
const config = { sent: { label: 'Emails sent', color: 'var(--chart-1)' } };

function Bars(props) {
    return (
        <ChartContainer config={config} className="h-56 w-full" {...props}>
            <BarChart data={data}>
                <XAxis dataKey="day" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sent" fill="var(--color-sent)" isAnimationActive={false} />
            </BarChart>
        </ChartContainer>
    );
}

describe('Chart', () => {
    it('defines a CSS variable per series from the config, scoped to the chart', () => {
        renderUi(<Bars />);
        const chart = document.querySelector('[data-slot="chart"]');
        const id = chart.getAttribute('data-chart');
        const css = document.querySelector('style').textContent;
        expect(css).toContain(`[data-chart=${id}]`);
        expect(css).toContain('--color-sent: var(--chart-1);');
    });

    it('writes a separate colour for each theme when the config gives a theme', () => {
        renderUi(
            <ChartContainer config={{ sent: { label: 'Sent', theme: { light: 'red', dark: 'blue' } } }}>
                <BarChart data={data}>
                    <Bar dataKey="sent" isAnimationActive={false} />
                </BarChart>
            </ChartContainer>,
        );
        const css = document.querySelector('style').textContent;
        expect(css).toMatch(/\[data-chart=[^\]]+\] \{\s*--color-sent: red;/);
        expect(css).toMatch(/\.dark \[data-chart=[^\]]+\] \{\s*--color-sent: blue;/);
    });

    it('draws the chart as an SVG with one bar per data point', () => {
        renderUi(<Bars />);
        expect(document.querySelector('[data-slot="chart"] svg.recharts-surface')).not.toBeNull();
        expect(document.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(2);
    });

    it('makes the chart a tab stop with the accessibility layer on, and Recharts names its role', async () => {
        const { user } = renderUi(<Bars />);
        const svg = document.querySelector('svg.recharts-surface');
        expect(svg).toHaveAttribute('tabindex', '0');
        expect(svg).toHaveAttribute('role', 'application');
        await user.tab();
        expect(svg).toHaveFocus();
    });

    it('moves the tooltip between data points with the arrow keys and toggles it with Enter', async () => {
        const { user } = renderUi(<Bars />);
        await user.tab();
        expect(await screen.findByText('412')).toBeInTheDocument(); // focus shows the first point
        await user.keyboard('{ArrowRight}');
        expect(await screen.findByText('538')).toBeInTheDocument();
        await user.keyboard('{ArrowLeft}');
        expect(await screen.findByText('412')).toBeInTheDocument();
        await user.keyboard('{Enter}');
        expect(screen.queryByText('412')).toBeNull();
    });

    it('is named as one image, with a table as its text alternative, when the container sets role="img"', async () => {
        renderUi(
            <figure>
                <Bars role="img" aria-label="Emails sent per day. The table below has the numbers." />
                <table>
                    <caption>Emails sent per day</caption>
                    <thead>
                        <tr><th>Day</th><th>Sent</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Mon</td><td>412</td></tr>
                    </tbody>
                </table>
            </figure>,
        );
        expect(screen.getByRole('img', { name: /Emails sent per day/ })).toBeInTheDocument();
        expect(screen.getByRole('table', { name: 'Emails sent per day' })).toBeInTheDocument();
    });

    it('renders the tooltip content with the series label, the heading and a formatted value', () => {
        renderUi(
            <ChartContainer config={config}>
                <ChartTooltipContent
                    active
                    label="Mon"
                    payload={[{ dataKey: 'sent', name: 'sent', value: 1284, payload: { day: 'Mon' }, color: 'red' }]}
                    labelFormatter={(value) => `Day: ${value}`}
                />
            </ChartContainer>,
        );
        expect(screen.getByText('Emails sent')).toBeInTheDocument();
        expect(screen.getByText(/^Day: /)).toBeInTheDocument();
        expect(screen.getByText((1284).toLocaleString())).toBeInTheDocument();
    });

    it('writes the tooltip values in the provider’s locale, and marks the tooltip and legend with data-slots', () => {
        renderUi(
            <ChartContainer config={config}>
                <ChartTooltipContent active label="Mon" payload={[{ dataKey: 'sent', name: 'sent', value: 1284.5, payload: { day: 'Mon' }, color: 'red' }]} />
            </ChartContainer>,
            { locale: 'de-DE' },
        );
        expect(screen.getByText('1.284,5')).toBeInTheDocument();
        expect(screen.getByText('Emails sent').closest('[data-slot="chart-tooltip"]')).not.toBeNull();
    });

    it('lays the SVG out left to right in a right-to-left page, so the axis labels stay outside the plot', () => {
        renderUi(<Bars />, { dir: 'rtl' });
        expect(document.querySelector('[data-slot="chart"]').className).toContain('[&_.recharts-surface]:[direction:ltr]');
    });

    it('has no tab stop inside the picture when it is one named image without the keyboard layer', async () => {
        const { user } = renderUi(
            <>
                <ChartContainer config={config} role="img" aria-label="Emails sent per day">
                    <BarChart data={data} accessibilityLayer={false}>
                        <Bar dataKey="sent" fill="var(--color-sent)" isAnimationActive={false} />
                    </BarChart>
                </ChartContainer>
                <button type="button">After</button>
            </>,
        );
        expect(screen.getByRole('img', { name: 'Emails sent per day' })).toBeInTheDocument();
        await user.tab();
        expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('draws the legend with the label of each series from the config', () => {
        renderUi(
            <ChartContainer config={{ delivered: { label: 'Delivered', color: 'var(--chart-2)' }, bounced: { label: 'Bounced', color: 'var(--chart-1)' } }}>
                <AreaChart data={[{ day: 'Mon', delivered: 10, bounced: 1 }]}>
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area dataKey="delivered" isAnimationActive={false} />
                    <Area dataKey="bounced" isAnimationActive={false} />
                </AreaChart>
            </ChartContainer>,
        );
        expect(screen.getByText('Delivered')).toBeInTheDocument();
        expect(screen.getByText('Bounced')).toBeInTheDocument();
        expect(screen.getByText('Delivered').closest('[data-slot="chart-legend"]')).not.toBeNull();
    });

    it('throws when a tooltip or legend part is used outside a chart container', () => {
        const quiet = console.error;
        console.error = () => {};
        try {
            expect(() => renderUi(<ChartTooltipContent active payload={[{ name: 'a', value: 1 }]} />)).toThrow(/ChartContainer/);
        } finally {
            console.error = quiet;
        }
    });

    it('passes axe', async () => {
        renderUi(<Bars />);
        await expectNoAxeViolations();
    });
});
