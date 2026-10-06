import { describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/hover-card';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Assignee(props) {
    return (
        <HoverCard {...props}>
            <HoverCardTrigger href="#maya">Maya Okafor</HoverCardTrigger>
            <HoverCardContent>Support lead, billing queue.</HoverCardContent>
        </HoverCard>
    );
}

const card = () => screen.queryByText('Support lead, billing queue.');

describe('HoverCard', () => {
    it('renders its trigger as a link and nothing else until it opens', async () => {
        renderUi(<Assignee />);
        expect(screen.getByRole('link', { name: 'Maya Okafor' })).toHaveAttribute('href', '#maya');
        expect(card()).toBeNull();
        await expectNoAxeViolations();
    });

    it('opens on hover after the open delay and closes after the close delay', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        try {
            const { user } = renderUi(<Assignee openDelay={500} closeDelay={200} />);
            await user.hover(screen.getByRole('link', { name: 'Maya Okafor' }));
            await act(() => vi.advanceTimersByTimeAsync(300));
            expect(card()).toBeNull();
            await act(() => vi.advanceTimersByTimeAsync(300));
            const content = card().closest('[data-slot="hover-card-content"]');
            expect(content).toHaveAttribute('data-state', 'open');
            expect(content).toHaveAttribute('data-bui-motion', 'overlay');
            await user.unhover(screen.getByRole('link', { name: 'Maya Okafor' }));
            await act(() => vi.advanceTimersByTimeAsync(400));
            await waitFor(() => expect(card()).toBeNull());
        } finally {
            vi.useRealTimers();
        }
    });

    it('opens when Tab focuses the trigger and closes when focus moves away', async () => {
        const { user } = renderUi(
            <>
                <Assignee openDelay={0} closeDelay={0} />
                <button type="button">Next</button>
            </>
        );
        await user.tab();
        expect(screen.getByRole('link', { name: 'Maya Okafor' })).toHaveFocus();
        expect(await screen.findByText('Support lead, billing queue.')).toBeInTheDocument();
        await expectNoAxeViolations();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
        await waitFor(() => expect(card()).toBeNull());
    });

    it('closes on Escape and keeps focus on the trigger', async () => {
        const { user } = renderUi(<Assignee openDelay={0} closeDelay={0} />);
        await user.tab();
        await screen.findByText('Support lead, billing queue.');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(card()).toBeNull());
        expect(screen.getByRole('link', { name: 'Maya Okafor' })).toHaveFocus();
    });

    it('follows a controlled open state', () => {
        const { rerender } = renderUi(<Assignee open={false} />);
        expect(card()).toBeNull();
        rerender(<Assignee open />);
        expect(card()).toBeInTheDocument();
    });
});
