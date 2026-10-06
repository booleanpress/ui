import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineItem,
    TimelineMarker,
    TimelineOpposite,
    TimelineSeparator,
} from '@/components/timeline';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const EVENTS = ['Ticket opened', 'Assigned to Priya', 'Resolved'];

function History({ opposite = false, ...props }) {
    return (
        <Timeline aria-label="Ticket history" {...props}>
            {EVENTS.map((event, index) => (
                <TimelineItem key={event}>
                    {opposite ? (
                        <TimelineOpposite>
                            <time dateTime={`2026-10-1${index}`}>1{index} Oct</time>
                        </TimelineOpposite>
                    ) : null}
                    <TimelineSeparator />
                    <TimelineContent>{event}</TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}

describe('Timeline', () => {
    it('is an ordered list with one list item per event', async () => {
        renderUi(<History />);
        const list = screen.getByRole('list', { name: 'Ticket history' });
        expect(list.tagName).toBe('OL');
        const items = within(list).getAllByRole('listitem');
        expect(items).toHaveLength(3);
        expect(items[0]).toHaveTextContent('Ticket opened');
        await expectNoAxeViolations();
    });

    it('hides the separator from assistive technology and draws a marker and connector by default', async () => {
        renderUi(<History />);
        const separators = document.querySelectorAll('[data-slot=timeline-separator]');
        expect(separators).toHaveLength(3);
        for (const separator of separators) {
            expect(separator).toHaveAttribute('aria-hidden', 'true');
            expect(separator.querySelector('[data-slot=timeline-marker]')).not.toBeNull();
            expect(separator.querySelector('[data-slot=timeline-connector]')).not.toBeNull();
        }
        // The connector is not drawn after the last event.
        expect(separators[2].querySelector('[data-slot=timeline-connector]').className).toContain('group-last/timeline-item:hidden');
    });

    it('reads the opposite content before the content of each event', async () => {
        renderUi(<History opposite />);
        const first = screen.getAllByRole('listitem')[0];
        expect(first.textContent).toBe('10 OctTicket opened');
        expect(first.querySelector('time')).toHaveAttribute('dateTime', '2026-10-10');
        await expectNoAxeViolations();
    });

    it('defaults to align="start" and orientation="vertical", with the content after the line', () => {
        renderUi(<History />);
        const list = screen.getByRole('list');
        expect(list).toHaveAttribute('data-align', 'start');
        expect(list).toHaveAttribute('data-orientation', 'vertical');
        expect(list.style.getPropertyValue('--timeline-areas')).toBe('"opposite separator content"');
        expect(list.style.getPropertyValue('--timeline-content-align')).toBe('start');
    });

    it('puts the content before the line with align="end"', () => {
        renderUi(<History align="end" />);
        const list = screen.getByRole('list');
        expect(list).toHaveAttribute('data-align', 'end');
        expect(list.style.getPropertyValue('--timeline-areas')).toBe('"content separator opposite"');
        expect(list.style.getPropertyValue('--timeline-areas-even')).toBe('"content separator opposite"');
        expect(list.style.getPropertyValue('--timeline-content-align')).toBe('end');
    });

    it('switches side on every event with align="alternate"', async () => {
        renderUi(<History align="alternate" opposite />);
        const list = screen.getByRole('list');
        expect(list.style.getPropertyValue('--timeline-areas')).toBe('"opposite separator content"');
        expect(list.style.getPropertyValue('--timeline-areas-even')).toBe('"content separator opposite"');
        expect(list.style.getPropertyValue('--timeline-tracks')).toBe('minmax(0,1fr) auto minmax(0,1fr)');
        await expectNoAxeViolations();
    });

    it('runs across the page with orientation="horizontal", the content below the line', async () => {
        renderUi(<History orientation="horizontal" />);
        const list = screen.getByRole('list');
        expect(list).toHaveAttribute('data-orientation', 'horizontal');
        expect(list.style.getPropertyValue('--timeline-areas')).toBe('"opposite" "separator" "content"');
        await expectNoAxeViolations();
    });

    it('keeps a gap after each horizontal event’s content and opposite content but the last, so wrapped text never meets the next', () => {
        renderUi(<History orientation="horizontal" opposite />);
        for (const slot of ['timeline-content', 'timeline-opposite']) {
            const part = document.querySelector(`[data-slot=${slot}]`);
            expect(part).toHaveClass('group-data-[orientation=horizontal]/timeline:pe-4');
            expect(part).toHaveClass('group-data-[orientation=horizontal]/timeline:group-last/timeline-item:pe-0');
        }
    });

    it('takes a custom marker with an icon and a connector of its own', async () => {
        renderUi(
            <Timeline aria-label="Campaign">
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineMarker className="size-8 bg-success" data-testid="marker">
                            <svg aria-hidden="true" />
                        </TimelineMarker>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>Campaign sent</TimelineContent>
                </TimelineItem>
            </Timeline>,
        );
        const marker = screen.getByTestId('marker');
        expect(marker.className).toContain('size-8');
        expect(marker.className).not.toContain('size-4');
        expect(marker.querySelector('svg')).not.toBeNull();
        await expectNoAxeViolations();
    });
});
