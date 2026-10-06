import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Button } from '@/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/drawer';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Example({ direction, ...props }) {
    return (
        <Drawer direction={direction} {...props}>
            <DrawerTrigger asChild>
                <Button>Open delivery log</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Delivery log</DrawerTitle>
                    <DrawerDescription>The last five messages sent by the primary mailer.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <Button>Export</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

const popup = () => document.querySelector('[data-slot="drawer-content"]');

describe('Drawer', () => {
    it('opens as a dialog named by its title and described by its description', async () => {
        const { user } = renderUi(<Example />);
        const trigger = screen.getByRole('button', { name: 'Open delivery log' });
        expect(trigger).toHaveAttribute('data-slot', 'drawer-trigger');
        await user.click(trigger);
        const dialog = await screen.findByRole('dialog', { name: 'Delivery log' });
        expect(dialog).toHaveAccessibleDescription('The last five messages sent by the primary mailer.');
        expect(dialog).toHaveAttribute('data-slot', 'drawer-content');
        await expectNoAxeViolations();
    });

    it('moves focus into the drawer when it opens', async () => {
        const { user } = renderUi(<Example />);
        await user.click(screen.getByRole('button', { name: 'Open delivery log' }));
        const dialog = await screen.findByRole('dialog');
        await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        const { user } = renderUi(<Example />);
        const trigger = screen.getByRole('button', { name: 'Open delivery log' });
        await user.click(trigger);
        const dialog = await screen.findByRole('dialog');
        await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('closes an open select or menu inside it first, then the drawer, on Escape', async () => {
        const onOpenChange = [];
        const { user } = renderUi(
            <Drawer onOpenChange={(open) => onOpenChange.push(open)}>
                <DrawerTrigger asChild><Button>Filter deliveries</Button></DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Filters</DrawerTitle>
                        <DrawerDescription>Narrow the delivery log.</DrawerDescription>
                    </DrawerHeader>
                    <Select>
                        <SelectTrigger aria-label="Status"><SelectValue placeholder="Any status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button>Saved filters</Button></DropdownMenuTrigger>
                        <DropdownMenuContent><DropdownMenuItem>Failed this week</DropdownMenuItem></DropdownMenuContent>
                    </DropdownMenu>
                </DrawerContent>
            </Drawer>,
        );
        await user.click(screen.getByRole('button', { name: 'Filter deliveries' }));
        await screen.findByRole('dialog', { name: 'Filters' });
        await user.click(screen.getByRole('combobox', { name: 'Status' }));
        await screen.findByRole('listbox');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(popup()).not.toBeNull();
        await user.click(screen.getByRole('button', { name: 'Saved filters' }));
        await screen.findByRole('menu');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        expect(popup()).not.toBeNull();
        expect(onOpenChange).toEqual([true]);
        await user.keyboard('{Escape}');
        await waitFor(() => expect(popup()).toBeNull());
        expect(onOpenChange).toEqual([true, false]);
    });

    it('keeps Tab inside the open drawer', async () => {
        const { user } = renderUi(<Example />);
        await user.click(screen.getByRole('button', { name: 'Open delivery log' }));
        const dialog = await screen.findByRole('dialog');
        await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
        // Base UI's focus guards hand focus back inside on the next task.
        for (const shift of [false, false, false, true, true, true]) {
            await user.tab({ shift });
            await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
        }
    });

    it('closes from DrawerClose and returns focus to the trigger', async () => {
        const { user } = renderUi(<Example />);
        const trigger = screen.getByRole('button', { name: 'Open delivery log' });
        await user.click(trigger);
        await user.click(await screen.findByRole('button', { name: 'Done' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('opens from the bottom by default, with the handle bar, the modal motion and the backdrop', async () => {
        const { user } = renderUi(<Example />);
        await user.click(screen.getByRole('button', { name: 'Open delivery log' }));
        await screen.findByRole('dialog');
        expect(popup()).toHaveAttribute('data-side', 'bottom');
        expect(popup()).toHaveAttribute('data-swipe-direction', 'down');
        expect(popup()).toHaveAttribute('data-bui-motion', 'modal');
        expect(popup().className).toContain('rounded-t-xl');
        expect(popup().className).toContain('bg-card');
        const bar = popup().querySelector('[data-slot="drawer-handle"]');
        expect(bar).toHaveAttribute('aria-hidden', 'true');
        expect(bar.className).toContain('h-1');
        expect(bar.className).toContain('w-10');
        const overlay = document.querySelector('[data-slot="drawer-overlay"]');
        expect(overlay).toHaveAttribute('data-bui-motion', 'modal');
        expect(overlay.className).toContain('bg-mask');
    });

    it('opens from the other edges, swiping back towards them, with no handle bar', async () => {
        for (const [direction, swipe, rtlSwipe] of [['top', 'up', 'up'], ['left', 'left', 'right'], ['right', 'right', 'left']]) {
            for (const [dir, expected] of [['ltr', swipe], ['rtl', rtlSwipe]]) {
                const { user, unmount } = renderUi(<Example direction={direction} />, { dir });
                await user.click(screen.getByRole('button', { name: 'Open delivery log' }));
                await screen.findByRole('dialog');
                expect(popup()).toHaveAttribute('data-side', direction);
                expect(popup()).toHaveAttribute('data-swipe-direction', expected);
                expect(popup().querySelector('[data-slot="drawer-handle"]')).toBeNull();
                unmount();
            }
        }
    });

    it('opens and closes from code with open and onOpenChange', async () => {
        function Controlled() {
            const [open, setOpen] = useState(true);
            return (
                <>
                    <span data-testid="state">{open ? 'open' : 'closed'}</span>
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerContent>
                            <DrawerTitle>API key</DrawerTitle>
                            <DrawerDescription>Copy the key before closing.</DrawerDescription>
                            <DrawerClose>Close</DrawerClose>
                        </DrawerContent>
                    </Drawer>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(await screen.findByRole('dialog', { name: 'API key' })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('closed'));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });
});
