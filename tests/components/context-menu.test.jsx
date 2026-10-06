import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from '@/components/context-menu';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Entry({ onResend, onDelete, children }) {
    return (
        <ContextMenu>
            <ContextMenuTrigger tabIndex={0}>Delivery to ops@example.com</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuLabel>Delivery</ContextMenuLabel>
                <ContextMenuItem onSelect={onResend}>
                    Resend<ContextMenuShortcut>R</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem disabled>Archive</ContextMenuItem>
                <ContextMenuItem>Copy ID</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive" onSelect={onDelete}>
                    Delete
                </ContextMenuItem>
                {children}
            </ContextMenuContent>
        </ContextMenu>
    );
}

const area = () => screen.getByText('Delivery to ops@example.com');

/** Shift + F10 and the menu key make the browser fire `contextmenu` on the focused element. */
async function openFromKeyboard(user) {
    area().focus();
    fireEvent.contextMenu(area());
    await screen.findByRole('menu');
    await user.keyboard('{ArrowDown}');
}

describe('ContextMenu', () => {
    it('opens on right-click as a menu with the right attributes, with overlay motion', async () => {
        const { user } = renderUi(<Entry />);
        await user.pointer({ keys: '[MouseRight]', target: area() });
        const menu = await screen.findByRole('menu');
        expect(menu).toHaveAttribute('data-bui-motion', 'overlay');
        expect(menu).toHaveAttribute('data-slot', 'context-menu-content');
        expect(screen.getAllByRole('menuitem')).toHaveLength(4);
        expect(area()).toHaveAttribute('data-state', 'open');
        await expectNoAxeViolations();
    });

    it('opens from the keyboard (Shift + F10) and focuses the first item with ArrowDown', async () => {
        const { user } = renderUi(<Entry />);
        await openFromKeyboard(user);
        await waitFor(() => expect(screen.getByRole('menuitem', { name: /Resend/ })).toHaveFocus());
    });

    it('moves with the arrow keys, skips a disabled item, and stops at the ends', async () => {
        const { user } = renderUi(<Entry />);
        await openFromKeyboard(user);
        await waitFor(() => expect(screen.getByRole('menuitem', { name: /Resend/ })).toHaveFocus());
        await user.keyboard('{ArrowUp}');
        expect(screen.getByRole('menuitem', { name: /Resend/ })).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Copy ID' })).toHaveFocus();
        await user.keyboard('{ArrowDown}{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
        await user.keyboard('{ArrowUp}');
        expect(screen.getByRole('menuitem', { name: 'Copy ID' })).toHaveFocus();
    });

    it('wraps from the last item to the first with loop', async () => {
        const { user } = renderUi(
            <ContextMenu>
                <ContextMenuTrigger tabIndex={0}>Delivery to ops@example.com</ContextMenuTrigger>
                <ContextMenuContent loop>
                    <ContextMenuItem>Resend</ContextMenuItem>
                    <ContextMenuItem>Delete</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>,
        );
        await openFromKeyboard(user);
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Resend' })).toHaveFocus());
        await user.keyboard('{ArrowUp}');
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Resend' })).toHaveFocus();
    });

    it('moves to the first and last item with Home and End', async () => {
        const { user } = renderUi(<Entry />);
        await openFromKeyboard(user);
        await user.keyboard('{End}');
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
        await user.keyboard('{Home}');
        expect(screen.getByRole('menuitem', { name: /Resend/ })).toHaveFocus();
    });

    it('moves to an item by typing its first letters', async () => {
        const { user } = renderUi(<Entry />);
        await openFromKeyboard(user);
        await user.keyboard('cop');
        expect(screen.getByRole('menuitem', { name: 'Copy ID' })).toHaveFocus();
    });

    it('chooses an item with Enter, runs onSelect and closes', async () => {
        const onResend = vi.fn();
        const { user } = renderUi(<Entry onResend={onResend} />);
        await openFromKeyboard(user);
        await waitFor(() => expect(screen.getByRole('menuitem', { name: /Resend/ })).toHaveFocus());
        await user.keyboard('{Enter}');
        expect(onResend).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });

    it('chooses an item with Space', async () => {
        const onDelete = vi.fn();
        const { user } = renderUi(<Entry onDelete={onDelete} />);
        await openFromKeyboard(user);
        await user.keyboard('{End} ');
        expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('closes on Escape and returns focus to the trigger area', async () => {
        const { user } = renderUi(<Entry />);
        await openFromKeyboard(user);
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        await waitFor(() => expect(area()).toHaveFocus());
    });

    it('marks a disabled and a destructive item', async () => {
        const { user } = renderUi(<Entry />);
        await user.pointer({ keys: '[MouseRight]', target: area() });
        expect(await screen.findByRole('menuitem', { name: 'Archive' })).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-variant', 'destructive');
    });

    it('toggles a checkbox item and chooses one radio item', async () => {
        function Columns() {
            const [opens, setOpens] = useState(false);
            const [density, setDensity] = useState('comfortable');
            return (
                <ContextMenu>
                    <ContextMenuTrigger tabIndex={0}>Delivery to ops@example.com</ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuCheckboxItem checked={opens} onCheckedChange={setOpens}>Opens</ContextMenuCheckboxItem>
                        <ContextMenuRadioGroup value={density} onValueChange={setDensity}>
                            <ContextMenuRadioItem value="comfortable">Comfortable</ContextMenuRadioItem>
                            <ContextMenuRadioItem value="compact">Compact</ContextMenuRadioItem>
                        </ContextMenuRadioGroup>
                    </ContextMenuContent>
                </ContextMenu>
            );
        }
        const { user } = renderUi(<Columns />);
        await user.pointer({ keys: '[MouseRight]', target: area() });
        expect(await screen.findByRole('menuitemcheckbox', { name: 'Opens' })).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByRole('menuitemradio', { name: 'Comfortable' })).toHaveAttribute('aria-checked', 'true');
        await expectNoAxeViolations();
        await user.click(screen.getByRole('menuitemcheckbox', { name: 'Opens' }));
        await user.pointer({ keys: '[MouseRight]', target: area() });
        expect(await screen.findByRole('menuitemcheckbox', { name: 'Opens' })).toHaveAttribute('aria-checked', 'true');
        await user.click(screen.getByRole('menuitemradio', { name: 'Compact' }));
        await user.pointer({ keys: '[MouseRight]', target: area() });
        expect(await screen.findByRole('menuitemradio', { name: 'Compact' })).toHaveAttribute('aria-checked', 'true');
    });

    const submenu = (
        <ContextMenuSub>
            <ContextMenuSubTrigger>Export as</ContextMenuSubTrigger>
            <ContextMenuSubContent>
                <ContextMenuItem>CSV</ContextMenuItem>
                <ContextMenuItem>JSON</ContextMenuItem>
            </ContextMenuSubContent>
        </ContextMenuSub>
    );

    it('opens a submenu with ArrowRight and closes it with ArrowLeft', async () => {
        const { user } = renderUi(<Entry>{submenu}</Entry>);
        await openFromKeyboard(user);
        await user.keyboard('{End}');
        const sub = screen.getByRole('menuitem', { name: 'Export as' });
        expect(sub).toHaveFocus();
        expect(sub).toHaveAttribute('aria-haspopup', 'menu');
        await user.keyboard('{ArrowRight}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'CSV' })).toHaveFocus());
        expect(screen.getAllByRole('menu')[1]).toHaveAttribute('data-bui-motion', 'overlay');
        // A long submenu stops at the room in the window and scrolls, as the menu does.
        expect(screen.getAllByRole('menu')[1].className).toMatch(/max-h-\(--radix-context-menu-content-available-height\).*overflow-y-auto/);
        await user.keyboard('{ArrowLeft}');
        await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'CSV' })).toBeNull());
        expect(screen.getByRole('menuitem', { name: 'Export as' })).toHaveFocus();
    });

    it('mirrors the submenu keys in right-to-left pages', async () => {
        const { user } = renderUi(<Entry>{submenu}</Entry>, { dir: 'rtl' });
        await openFromKeyboard(user);
        await user.keyboard('{End}');
        await user.keyboard('{ArrowRight}');
        expect(screen.queryByRole('menuitem', { name: 'CSV' })).toBeNull();
        await user.keyboard('{ArrowLeft}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'CSV' })).toHaveFocus());
        await user.keyboard('{ArrowRight}');
        await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'CSV' })).toBeNull());
    });

    it('keeps a shortcut hint in its written order on a right-to-left page', async () => {
        const { user } = renderUi(<Entry />, { dir: 'rtl' });
        await openFromKeyboard(user);
        const hint = document.querySelector('[data-slot=context-menu-shortcut]');
        expect(hint).toHaveClass('[unicode-bidi:plaintext]');
        expect(hint).toHaveClass('ms-auto');
    });
});
