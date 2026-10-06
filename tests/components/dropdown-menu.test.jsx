import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Button } from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Actions({ onEdit, onDelete }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild><Button>Actions</Button></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Primary mailer</DropdownMenuLabel>
                <DropdownMenuItem onSelect={onEdit}>Edit<DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>
                <DropdownMenuItem disabled>Move</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const trigger = () => screen.getByRole('button', { name: 'Actions' });

describe('DropdownMenu', () => {
    it('opens from the trigger as a menu with the right attributes', async () => {
        const { user } = renderUi(<Actions />);
        const button = trigger();
        expect(button).toHaveAttribute('aria-haspopup', 'menu');
        expect(button).toHaveAttribute('aria-expanded', 'false');
        await user.click(button);
        expect(await screen.findByRole('menu')).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getAllByRole('menuitem')).toHaveLength(4);
        await expectNoAxeViolations();
    });

    it('opens with Enter and focuses the first item', async () => {
        const { user } = renderUi(<Actions />);
        trigger().focus();
        await user.keyboard('{Enter}');
        const first = await screen.findByRole('menuitem', { name: /Edit/ });
        await waitFor(() => expect(first).toHaveFocus());
    });

    it('opens with Space', async () => {
        const { user } = renderUi(<Actions />);
        trigger().focus();
        await user.keyboard(' ');
        expect(await screen.findByRole('menu')).toBeInTheDocument();
    });

    it('opens with ArrowDown and focuses the first item', async () => {
        const { user } = renderUi(<Actions />);
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        const first = await screen.findByRole('menuitem', { name: /Edit/ });
        await waitFor(() => expect(first).toHaveFocus());
    });

    it('moves with the arrow keys, skips a disabled item, and stops at the ends', async () => {
        const { user } = renderUi(<Actions />);
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: /Edit/ })).toHaveFocus());
        await user.keyboard('{ArrowUp}');
        expect(screen.getByRole('menuitem', { name: /Edit/ })).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
        await user.keyboard('{ArrowUp}');
        expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    });

    it('wraps from the last item to the first with loop', async () => {
        const { user } = renderUi(
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button>Actions</Button></DropdownMenuTrigger>
                <DropdownMenuContent loop>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
        await user.keyboard('{ArrowUp}');
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    });

    it('moves to the first and last item with Home and End', async () => {
        const { user } = renderUi(<Actions />);
        trigger().focus();
        await user.keyboard('{ArrowDown}{End}');
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
        await user.keyboard('{Home}');
        expect(screen.getByRole('menuitem', { name: /Edit/ })).toHaveFocus();
    });

    it('moves to an item by typing its first letters', async () => {
        const { user } = renderUi(<Actions />);
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('menu');
        await user.keyboard('del');
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    });

    it('chooses an item with Enter, runs onSelect and closes', async () => {
        const onEdit = vi.fn();
        const { user } = renderUi(<Actions onEdit={onEdit} />);
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: /Edit/ })).toHaveFocus());
        await user.keyboard('{Enter}');
        expect(onEdit).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        await waitFor(() => expect(trigger()).toHaveFocus());
    });

    it('chooses an item with Space', async () => {
        const onDelete = vi.fn();
        const { user } = renderUi(<Actions onDelete={onDelete} />);
        trigger().focus();
        await user.keyboard('{ArrowDown}{End}');
        await user.keyboard(' ');
        expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        const { user } = renderUi(<Actions />);
        trigger().focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('menu');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        await waitFor(() => expect(trigger()).toHaveFocus());
    });

    it('keeps Tab inside the menu (it does not move focus to the page)', async () => {
        const { user } = renderUi(<Actions />);
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('menu');
        await user.tab();
        expect(screen.getByRole('menu').contains(document.activeElement)).toBe(true);
    });

    it('ignores a disabled item and marks it', async () => {
        const { user } = renderUi(<Actions />);
        await user.click(trigger());
        const move = await screen.findByRole('menuitem', { name: 'Move' });
        expect(move).toHaveAttribute('aria-disabled', 'true');
        expect(move).toHaveAttribute('data-disabled');
    });

    it('marks a destructive item', async () => {
        const { user } = renderUi(<Actions />);
        await user.click(trigger());
        expect(await screen.findByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-variant', 'destructive');
    });

    it('toggles checkbox items and reports the state', async () => {
        function Columns() {
            const [on, setOn] = useState(false);
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button>Actions</Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuCheckboxItem checked={on} onCheckedChange={setOn}>Mailer</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
        const { user } = renderUi(<Columns />);
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        const item = await screen.findByRole('menuitemcheckbox', { name: 'Mailer' });
        expect(item).toHaveAttribute('aria-checked', 'false');
        await waitFor(() => expect(item).toHaveFocus());
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        expect(await screen.findByRole('menuitemcheckbox', { name: 'Mailer' })).toHaveAttribute('aria-checked', 'true');
        await expectNoAxeViolations();
    });

    it('chooses one radio item', async () => {
        function Range() {
            const [value, setValue] = useState('7d');
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button>Actions</Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
                            <DropdownMenuRadioItem value="24h">24 hours</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="7d">7 days</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
        const { user } = renderUi(<Range />);
        await user.click(trigger());
        expect(await screen.findByRole('menuitemradio', { name: '7 days' })).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('menuitemradio', { name: '24 hours' })).toHaveAttribute('aria-checked', 'false');
        await user.click(screen.getByRole('menuitemradio', { name: '24 hours' }));
        await user.click(trigger());
        expect(await screen.findByRole('menuitemradio', { name: '24 hours' })).toHaveAttribute('aria-checked', 'true');
        await expectNoAxeViolations();
    });

    function Submenu() {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button>Actions</Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Export as</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem>CSV</DropdownMenuItem>
                            <DropdownMenuItem>JSON</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    it('opens a submenu with ArrowRight and closes it with ArrowLeft', async () => {
        const { user } = renderUi(<Submenu />);
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        const sub = await screen.findByRole('menuitem', { name: 'Export as' });
        await waitFor(() => expect(sub).toHaveFocus());
        expect(sub).toHaveAttribute('aria-haspopup', 'menu');
        await user.keyboard('{ArrowRight}');
        const csv = await screen.findByRole('menuitem', { name: 'CSV' });
        await waitFor(() => expect(csv).toHaveFocus());
        // A long submenu stops at the room in the window and scrolls, as the menu does.
        expect(csv.closest('[data-slot=dropdown-menu-sub-content]').className).toMatch(/max-h-\(--radix-dropdown-menu-content-available-height\).*overflow-y-auto/);
        await user.keyboard('{ArrowLeft}');
        await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'CSV' })).toBeNull());
        expect(screen.getByRole('menuitem', { name: 'Export as' })).toHaveFocus();
    });

    it('mirrors the submenu keys in right-to-left pages', async () => {
        const { user } = renderUi(<Submenu />, { dir: 'rtl' });
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        const sub = await screen.findByRole('menuitem', { name: 'Export as' });
        await waitFor(() => expect(sub).toHaveFocus());
        await user.keyboard('{ArrowRight}');
        expect(screen.queryByRole('menuitem', { name: 'CSV' })).toBeNull();
        await user.keyboard('{ArrowLeft}');
        const csv = await screen.findByRole('menuitem', { name: 'CSV' });
        await waitFor(() => expect(csv).toHaveFocus());
        await user.keyboard('{ArrowRight}');
        await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'CSV' })).toBeNull());
    });

    it('closes the whole menu with Escape from a submenu', async () => {
        const { user } = renderUi(<Submenu />);
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('menuitem', { name: 'Export as' });
        await user.keyboard('{ArrowRight}');
        await screen.findByRole('menuitem', { name: 'CSV' });
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'CSV' })).toBeNull());
    });

    it('keeps a shortcut hint in its written order on a right-to-left page', async () => {
        const { user } = renderUi(<Actions />, { dir: 'rtl' });
        await user.click(trigger());
        expect(await screen.findByText('⌘E')).toHaveClass('[unicode-bidi:plaintext]');
        expect(screen.getByText('⌘E')).toHaveClass('ms-auto');
    });
    it('scrolls a long menu with the wheel inside a modal dialog, modal or not', async () => {
        const mailers = Array.from({ length: 30 }, (_, i) => `Mailer ${i + 1}`);
        for (const modal of [true, false]) {
            const { user, unmount } = renderUi(
                <Dialog defaultOpen>
                    <DialogContent>
                        <DialogTitle>Route</DialogTitle>
                        <DialogDescription>Pick a mailer.</DialogDescription>
                        <DropdownMenu modal={modal}>
                            <DropdownMenuTrigger asChild><Button>Mailers</Button></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {mailers.map((m) => <DropdownMenuItem key={m}>{m}</DropdownMenuItem>)}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </DialogContent>
                </Dialog>,
            );
            await user.click(screen.getByRole('button', { name: 'Mailers' }));
            const menu = await screen.findByRole('menu');
            // jsdom has no layout: give the menu room to scroll.
            menu.style.overflowY = 'auto';
            Object.defineProperty(menu, 'scrollHeight', { configurable: true, value: 900 });
            Object.defineProperty(menu, 'clientHeight', { configurable: true, value: 200 });
            const wheel = (deltaY) => {
                const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY });
                screen.getByRole('menuitem', { name: 'Mailer 2' }).dispatchEvent(event);
                return event.defaultPrevented;
            };
            expect(wheel(120)).toBe(false);
            // Without a lock of its own, up from the top moves nothing in the menu: the dialog's lock cancels it.
            if (!modal) expect(wheel(-120)).toBe(true);
            unmount();
        }
    });
});
