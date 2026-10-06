import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Button } from '@/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/sheet';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Example({ side, size }) {
    return (
        <Sheet>
            <SheetTrigger asChild><Button>Open sheet</Button></SheetTrigger>
            <SheetContent side={side} size={size}>
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Narrow the list.</SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}

describe('Sheet', () => {
    it('opens as a dialog with the 36 px close button named by the provider', async () => {
        const { user } = renderUi(<Example />, { strings: { close: 'Fermer' } });
        await user.click(screen.getByRole('button', { name: 'Open sheet' }));
        expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
        const close = screen.getByRole('button', { name: 'Fermer' });
        expect(close.className).toContain('size-9');
        await expectNoAxeViolations();
    });

    it('slides from the edge it sits on, in either direction', async () => {
        const { user } = renderUi(<Example side="left" />);
        await user.click(screen.getByRole('button', { name: 'Open sheet' }));
        expect(screen.getByRole('dialog').className).toContain('start-0');
        expect(screen.getByRole('dialog').className).toContain('slide-in-from-start');
    });

    it('closes with the close button and returns focus to the trigger', async () => {
        const { user } = renderUi(<Example />);
        const trigger = screen.getByRole('button', { name: 'Open sheet' });
        await user.click(trigger);
        await user.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        const { user } = renderUi(<Example />);
        const trigger = screen.getByRole('button', { name: 'Open sheet' });
        await user.click(trigger);
        await screen.findByRole('dialog');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('keeps Tab and Shift+Tab inside the sheet', async () => {
        const { user } = renderUi(<Example />);
        await user.click(screen.getByRole('button', { name: 'Open sheet' }));
        const dialog = await screen.findByRole('dialog');
        for (let i = 0; i < 3; i += 1) {
            await user.tab();
            expect(dialog.contains(document.activeElement)).toBe(true);
        }
        await user.tab({ shift: true });
        expect(dialog.contains(document.activeElement)).toBe(true);
    });
    it('covers the window with size="full", still sliding from its edge', async () => {
        const { user } = renderUi(<Example side="bottom" size="full" />);
        await user.click(screen.getByRole('button', { name: 'Open sheet' }));
        const sheet = screen.getByRole('dialog', { name: 'Filters' });
        expect(sheet).toHaveAttribute('data-size', 'full');
        expect(sheet).toHaveAttribute('data-side', 'bottom');
        expect(sheet.className).toContain('w-full');
        expect(sheet.className).toContain('top-[var(--wp-admin--admin-bar--height,0px)]');
        expect(sheet.className).toContain('slide-in-from-bottom');
        await expectNoAxeViolations();
    });

    it('keeps the panel size by default', async () => {
        const { user } = renderUi(<Example />);
        await user.click(screen.getByRole('button', { name: 'Open sheet' }));
        const sheet = screen.getByRole('dialog');
        expect(sheet).toHaveAttribute('data-size', 'default');
        expect(sheet.className).toContain('sm:max-w-80');
    });

    it('returns focus to the menu button when a menu item opened it, since the item leaves with its menu', async () => {
        function FromMenu() {
            const [open, setOpen] = useState(false);
            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button>View</Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => setOpen(true)}>Filters</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                                <SheetDescription>Narrow the list.</SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </>
            );
        }
        const { user } = renderUi(<FromMenu />);
        const menuButton = screen.getByRole('button', { name: 'View' });
        await user.click(menuButton);
        await user.click(await screen.findByRole('menuitem', { name: 'Filters' }));
        await screen.findByRole('dialog', { name: 'Filters' });
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(menuButton).toHaveFocus());
    });
});
