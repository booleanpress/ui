import { describe, expect, it, vi } from 'vitest';
import { act, screen } from '@testing-library/react';
import { useState } from 'react';
import { Button } from '@/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Example() {
    return (
        <Tooltip>
            <TooltipTrigger asChild><Button aria-label="Settings">S</Button></TooltipTrigger>
            <TooltipContent>Open the settings</TooltipContent>
        </Tooltip>
    );
}

describe('Tooltip', () => {
    it('waits for the provider delay before opening on hover', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        try {
            const { user } = renderUi(<Example />, { tooltipDelay: 500 });
            await user.hover(screen.getByRole('button', { name: 'Settings' }));
            await act(() => vi.advanceTimersByTimeAsync(300));
            expect(screen.queryByRole('tooltip')).toBeNull();
            await act(() => vi.advanceTimersByTimeAsync(300));
            expect(screen.getByRole('tooltip')).toHaveTextContent('Open the settings');
        } finally {
            vi.useRealTimers();
        }
    });

    it('opens at once on keyboard focus and closes on Escape', async () => {
        const { user } = renderUi(<Example />);
        await user.tab();
        expect(screen.getByRole('tooltip')).toHaveTextContent('Open the settings');
        await expectNoAxeViolations();
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('tooltip')).toBeNull();
    });
    it('draws the arrow by default and leaves it out with arrow={false}', async () => {
        const { user, unmount } = renderUi(<Example />);
        await user.tab();
        expect(document.querySelector('[data-slot=tooltip-arrow]')).not.toBeNull();
        unmount();
        const second = renderUi(
            <Tooltip>
                <TooltipTrigger asChild><Button>Send</Button></TooltipTrigger>
                <TooltipContent arrow={false}>Sends now</TooltipContent>
            </Tooltip>,
        );
        await second.user.tab();
        expect(screen.getByRole('tooltip')).toHaveTextContent('Sends now');
        expect(document.querySelector('[data-slot=tooltip-arrow]')).toBeNull();
        await expectNoAxeViolations();
    });

    it('waits for its own delayDuration instead of the provider’s', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        try {
            const { user } = renderUi(
                <Tooltip delayDuration={1000}>
                    <TooltipTrigger asChild><Button>Rotate</Button></TooltipTrigger>
                    <TooltipContent>Rotates the key</TooltipContent>
                </Tooltip>,
                { tooltipDelay: 500 },
            );
            await user.hover(screen.getByRole('button', { name: 'Rotate' }));
            await act(() => vi.advanceTimersByTimeAsync(700));
            expect(screen.queryByRole('tooltip')).toBeNull();
            await act(() => vi.advanceTimersByTimeAsync(400));
            expect(screen.getByRole('tooltip')).toHaveTextContent('Rotates the key');
        } finally {
            vi.useRealTimers();
        }
    });

    it('places the content with sideOffset and alignOffset without breaking it', async () => {
        const { user } = renderUi(
            <Tooltip>
                <TooltipTrigger asChild><Button>Offset</Button></TooltipTrigger>
                <TooltipContent sideOffset={12} align="start" alignOffset={24}>Moved</TooltipContent>
            </Tooltip>,
        );
        await user.tab();
        const content = document.querySelector('[data-slot=tooltip-content]');
        expect(content).toHaveAttribute('data-align', 'start');
        expect(screen.getByRole('tooltip')).toHaveTextContent('Moved');
    });

    it('follows a controlled open state and reports Escape through onOpenChange', async () => {
        const changes = [];
        function Controlled() {
            const [open, setOpen] = useState(true);
            return (
                <Tooltip
                    open={open}
                    onOpenChange={(next) => {
                        changes.push(next);
                        setOpen(next);
                    }}
                >
                    <TooltipTrigger asChild><Button>Rotate</Button></TooltipTrigger>
                    <TooltipContent>Rotates the key</TooltipContent>
                </Tooltip>
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(screen.getByRole('tooltip')).toHaveTextContent('Rotates the key');
        await user.keyboard('{Escape}');
        expect(changes).toContain(false);
        expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('opens on keyboard focus on a focusable element that is not a button', async () => {
        const { user } = renderUi(
            <p>
                Last delivery:
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span tabIndex={0}>Soft bounce</span>
                    </TooltipTrigger>
                    <TooltipContent>The mailbox was full.</TooltipContent>
                </Tooltip>
            </p>,
        );
        await user.tab();
        const trigger = screen.getByText('Soft bounce');
        expect(trigger).toHaveFocus();
        expect(screen.getByRole('tooltip')).toHaveTextContent('The mailbox was full.');
        expect(trigger).toHaveAttribute('aria-describedby');
        await expectNoAxeViolations();
    });
});
