import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { usePresence } from '@/lib/presence';

// jsdom runs no animations, but it computes the animation and transition properties set inline: the exit "runs" for as
// long as those say, and ends when the test fires its end event.
const EXIT = { animationName: 'exit', animationDuration: '150ms' };

function Box({ open, exit, children }) {
    const ref = useRef(null);
    const { mounted, state } = usePresence(open, ref);
    if (!mounted) return null;
    return (
        <div ref={ref} data-testid="box" data-state={state} style={state === 'closed' ? exit : undefined}>
            {children}
        </div>
    );
}

const box = () => screen.queryByTestId('box');

describe('usePresence', () => {
    afterEach(() => vi.restoreAllMocks());

    it('mounts while open and leaves at once when nothing animates', () => {
        const { rerender } = render(<Box open={false} />);
        expect(box()).toBeNull();
        rerender(<Box open />);
        expect(box()).toHaveAttribute('data-state', 'open');
        rerender(<Box open={false} />);
        expect(box()).toBeNull();
    });

    it('stays mounted, closed, while the exit animation runs, and leaves on its animationend', () => {
        const { rerender } = render(<Box open exit={EXIT}><span data-testid="child" /></Box>);
        rerender(<Box open={false} exit={EXIT}><span data-testid="child" /></Box>);
        expect(box()).toHaveAttribute('data-state', 'closed');
        // An animation of a child bubbles up: not the element's own exit.
        fireEvent.animationEnd(screen.getByTestId('child'));
        expect(box()).not.toBeNull();
        fireEvent.animationEnd(box());
        expect(box()).toBeNull();
    });

    it('leaves on transitionend when the exit is a transition', () => {
        const fade = { transitionProperty: 'opacity', transitionDuration: '0.2s' };
        const { rerender } = render(<Box open exit={fade} />);
        rerender(<Box open={false} exit={fade} />);
        expect(box()).toHaveAttribute('data-state', 'closed');
        fireEvent.transitionEnd(box());
        expect(box()).toBeNull();
    });

    it('ignores the entrance cancelled by the exit, under its own name', () => {
        const { rerender } = render(<Box open exit={EXIT} />);
        rerender(<Box open={false} exit={EXIT} />);
        const cancel = new Event('animationcancel');
        Object.defineProperty(cancel, 'animationName', { value: 'enter' });
        act(() => box().dispatchEvent(cancel));
        expect(box()).not.toBeNull();
        const end = new Event('animationend');
        Object.defineProperty(end, 'animationName', { value: 'exit' });
        act(() => box().dispatchEvent(end));
        expect(box()).toBeNull();
    });

    it('leaves after the exit’s duration when no end event comes', async () => {
        const { rerender } = render(<Box open exit={EXIT} />);
        rerender(<Box open={false} exit={EXIT} />);
        expect(box()).not.toBeNull();
        await waitFor(() => expect(box()).toBeNull(), { timeout: 1000 });
    });

    it('under reduced motion, runs the exit the stylesheet leaves, read from the computed style', () => {
        // theme.css shortens an overlay's exit to a brief fade under reduced motion; the hook follows the computed style.
        const brief = { animationName: 'exit', animationDuration: '120ms' };
        const { rerender } = render(<Box open exit={brief} />);
        rerender(<Box open={false} exit={brief} />);
        expect(box()).toHaveAttribute('data-state', 'closed');
        fireEvent.animationEnd(box(), { animationName: 'exit' });
        expect(box()).toBeNull();
    });

    it('opens again during the exit and stays', () => {
        const { rerender } = render(<Box open exit={EXIT} />);
        rerender(<Box open={false} exit={EXIT} />);
        expect(box()).toHaveAttribute('data-state', 'closed');
        rerender(<Box open exit={EXIT} />);
        expect(box()).toHaveAttribute('data-state', 'open');
        fireEvent.animationEnd(box());
        expect(box()).toHaveAttribute('data-state', 'open');
    });

    it('closes again after an interrupted exit, and leaves on the second exit’s end, not the first one’s timer', async () => {
        vi.useFakeTimers();
        try {
            const { rerender } = render(<Box open exit={EXIT} />);
            rerender(<Box open={false} exit={EXIT} />);
            act(() => vi.advanceTimersByTime(100));
            rerender(<Box open exit={EXIT} />);
            rerender(<Box open={false} exit={EXIT} />);
            // The first exit's fallback timer (200 ms after it began) would have fired here.
            act(() => vi.advanceTimersByTime(120));
            expect(box()).toHaveAttribute('data-state', 'closed');
            fireEvent.animationEnd(box());
            expect(box()).toBeNull();
        } finally {
            vi.useRealTimers();
        }
    });
});
