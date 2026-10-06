import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Button } from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { Input } from '@/components/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Example() {
    return (
        <Popover>
            <PopoverTrigger asChild><Button>Retention</Button></PopoverTrigger>
            <PopoverContent aria-label="Retention settings">
                <Input aria-label="Days" defaultValue="30" />
            </PopoverContent>
        </Popover>
    );
}

describe('Popover', () => {
    it('opens from its trigger and moves focus inside', async () => {
        const { user } = renderUi(<Example />);
        await user.click(screen.getByRole('button', { name: 'Retention' }));
        const dialog = screen.getByRole('dialog', { name: 'Retention settings' });
        await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
        await expectNoAxeViolations();
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        const { user } = renderUi(<Example />);
        const trigger = screen.getByRole('button', { name: 'Retention' });
        await user.click(trigger);
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        expect(trigger).toHaveFocus();
    });

    it('animates through the shared motion classes, with no per-instance switch', async () => {
        const { user } = renderUi(<Example />);
        await user.click(screen.getByRole('button', { name: 'Retention' }));
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('data-[state=open]:animate-in');
        expect(content).not.toHaveAttribute('disableanimation');
    });

    it('opens and closes from the trigger with Enter and Space', async () => {
        const { user } = renderUi(<Example />);
        const trigger = screen.getByRole('button', { name: 'Retention' });
        trigger.focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('dialog', { name: 'Retention settings' });
        trigger.focus();
        await user.keyboard(' ');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('keeps Tab inside its content, wrapping from the last element to the first', async () => {
        const { user } = renderUi(
            <>
                <Example />
                <Button>After</Button>
            </>,
        );
        await user.click(screen.getByRole('button', { name: 'Retention' }));
        const days = screen.getByRole('textbox', { name: 'Days' });
        await waitFor(() => expect(days).toHaveFocus());
        await user.tab();
        expect(days).toHaveFocus();
        await user.tab({ shift: true });
        expect(days).toHaveFocus();
        expect(screen.getByRole('dialog', { name: 'Retention settings' })).toBeInTheDocument();
    });
    it('scrolls with the wheel and touch when opened from a modal dialog, whose scroll lock still holds the page', async () => {
        const ref = createRef();
        const mailers = Array.from({ length: 30 }, (_, i) => `Mailer ${i + 1}`);
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Route</DialogTitle>
                    <DialogDescription>Pick a mailer.</DialogDescription>
                    <Popover>
                        <PopoverTrigger asChild><Button>Mailers</Button></PopoverTrigger>
                        <PopoverContent ref={ref} aria-label="Mailers">
                            <p>Pick one.</p>
                            <ul data-testid="list" style={{ overflowY: 'auto' }}>
                                {mailers.map((m) => <li key={m}>{m}</li>)}
                            </ul>
                        </PopoverContent>
                    </Popover>
                </DialogContent>
            </Dialog>,
        );
        await user.click(screen.getByRole('button', { name: 'Mailers' }));
        await screen.findByRole('dialog', { name: 'Mailers' });
        // The app's own ref still reaches the content.
        expect(ref.current).toBe(document.querySelector('[data-slot=popover-content]'));
        // jsdom has no layout: give the list room to scroll.
        const list = screen.getByTestId('list');
        Object.defineProperty(list, 'scrollHeight', { configurable: true, value: 600 });
        Object.defineProperty(list, 'clientHeight', { configurable: true, value: 150 });
        const wheel = (target, deltaY) => {
            const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY });
            target.dispatchEvent(event);
            return event.defaultPrevented;
        };
        const item = screen.getByText('Mailer 3');
        // A scroll the list can take is the list's: the dialog's lock does not cancel it.
        expect(wheel(item, 120)).toBe(false);
        const at = (clientY) => [{ clientX: 10, clientY }];
        fireEvent.touchStart(item, { touches: at(100), changedTouches: at(100) });
        expect(fireEvent.touchMove(item, { touches: at(40), changedTouches: at(40) })).toBe(true);
        // One that moves nothing inside (up from the top, or over plain text) still reaches the lock and is cancelled.
        expect(wheel(item, -120)).toBe(true);
        expect(wheel(screen.getByText('Pick one.'), 120)).toBe(true);
    });
});
