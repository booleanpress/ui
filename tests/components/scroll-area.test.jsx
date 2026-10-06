import { describe, expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from '@/components/scroll-area';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('ScrollArea', () => {
    it('renders its content inside a viewport, in reading order', async () => {
        renderUi(
            <ScrollArea className="h-24 w-48">
                <ul>
                    <li>Email 1001</li>
                    <li>Email 1002</li>
                </ul>
            </ScrollArea>,
        );
        const viewport = document.querySelector('[data-slot="scroll-area-viewport"]');
        expect(viewport).toContainElement(screen.getByText('Email 1001'));
        expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Email 1001', 'Email 1002']);
        expect(document.querySelector('[data-slot="scroll-area"]').className).toContain('relative');
        await expectNoAxeViolations();
    });

    it('is not a tab stop by itself; a focusable control inside it is', async () => {
        const { user } = renderUi(
            <>
                <ScrollArea className="h-24 w-48">
                    <p>Plain text</p>
                </ScrollArea>
                <ScrollArea className="h-24 w-48">
                    <a href="#log">Open the log</a>
                </ScrollArea>
            </>,
        );
        await user.tab();
        expect(screen.getByRole('link', { name: 'Open the log' })).toHaveFocus();
    });

    it('takes a region role and a name from the consumer', async () => {
        renderUi(
            <ScrollArea role="region" aria-label="Recent events" className="h-24 w-48">
                <p>Delivered</p>
            </ScrollArea>,
        );
        expect(screen.getByRole('region', { name: 'Recent events' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('accepts a horizontal scrollbar as a child', async () => {
        renderUi(
            <ScrollArea type="always" className="w-48">
                <div className="w-max">Amazon SES, Postmark, SendGrid, Mailgun</div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>,
        );
        expect(screen.getByText(/Amazon SES/)).toBeInTheDocument();
        await expectNoAxeViolations();
    });
    it('renders a vertical and a horizontal bar together, with the corner between them', async () => {
        renderUi(
            <ScrollArea type="always" className="h-40 w-48">
                <table className="w-max"><tbody><tr><td>Amazon SES</td><td>48,210</td></tr></tbody></table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>,
        );
        const bars = [...document.querySelectorAll('[data-slot="scroll-area-scrollbar"]')];
        expect(bars.map((bar) => bar.getAttribute('data-orientation')).sort()).toEqual(['horizontal', 'vertical']);
        await expectNoAxeViolations();
    });

    it('draws a horizontal bar given as a child beside the viewport, so the fade does not mask it', () => {
        renderUi(
            <ScrollArea fade type="always" className="h-40 w-48">
                <table className="w-max"><tbody><tr><td>Amazon SES</td><td>48,210</td></tr></tbody></table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>,
        );
        const viewport = document.querySelector('[data-slot="scroll-area-viewport"]');
        const horizontal = document.querySelector('[data-slot="scroll-area-scrollbar"][data-orientation="horizontal"]');
        expect(viewport).toHaveAttribute('data-fade');
        expect(viewport.contains(horizontal)).toBe(false);
        expect(horizontal.parentElement).toBe(viewport.parentElement);
        expect(viewport).toHaveTextContent('Amazon SES');
    });

    it('marks the edges that hide content for the fade, and follows the scroll', async () => {
        renderUi(
            <ScrollArea fade className="h-24 w-48">
                <p>Email 1001</p>
            </ScrollArea>,
        );
        const viewport = document.querySelector('[data-slot="scroll-area-viewport"]');
        expect(viewport).toHaveAttribute('data-fade');
        expect(viewport.className).toContain('mask-composite:intersect');
        // jsdom has no layout: give the viewport the sizes of a list twice its height.
        Object.defineProperties(viewport, {
            scrollHeight: { configurable: true, value: 200 },
            clientHeight: { configurable: true, value: 100 },
            scrollWidth: { configurable: true, value: 100 },
            clientWidth: { configurable: true, value: 100 },
        });
        fireEvent.scroll(viewport);
        expect(viewport).toHaveAttribute('data-fade-bottom');
        expect(viewport).not.toHaveAttribute('data-fade-top');
        viewport.scrollTop = 100;
        fireEvent.scroll(viewport);
        expect(viewport).toHaveAttribute('data-fade-top');
        expect(viewport).not.toHaveAttribute('data-fade-bottom');
        expect(viewport).not.toHaveAttribute('data-fade-start');
        expect(viewport).not.toHaveAttribute('data-fade-end');
        await expectNoAxeViolations();
    });

    it('has no fade unless asked', () => {
        renderUi(
            <ScrollArea className="h-24 w-48">
                <p>Email 1001</p>
            </ScrollArea>,
        );
        const viewport = document.querySelector('[data-slot="scroll-area-viewport"]');
        expect(viewport).not.toHaveAttribute('data-fade');
        expect(viewport.className).not.toContain('mask-image');
    });
});
