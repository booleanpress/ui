import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/menubar';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Editor({ onSave, onUndo }) {
    return (
        <Menubar aria-label="Template editor">
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onSelect={onSave}>
                        Save<MenubarShortcut>⌘S</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem disabled>Print</MenubarItem>
                    <MenubarItem>Duplicate</MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>Export as</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem>HTML</MenubarItem>
                            <MenubarItem>Plain text</MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onSelect={onUndo}>Undo</MenubarItem>
                    <MenubarItem>Redo</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Desktop preview</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}

const trigger = (name) => screen.getByRole('menuitem', { name });

describe('Menubar', () => {
    it('renders a menubar of triggers that open menus', async () => {
        const { user } = renderUi(<Editor />);
        expect(screen.getByRole('menubar', { name: 'Template editor' })).toBeInTheDocument();
        const file = trigger('File');
        expect(file).toHaveAttribute('aria-haspopup', 'menu');
        expect(file).toHaveAttribute('aria-expanded', 'false');
        await user.click(file);
        const menu = await screen.findByRole('menu');
        expect(menu).toHaveAttribute('data-bui-motion', 'overlay');
        expect(file).toHaveAttribute('aria-expanded', 'true');
        await expectNoAxeViolations();
    });

    it('is one tab stop: Tab moves into the bar and out of it', async () => {
        const { user } = renderUi(
            <>
                <Editor />
                <button type="button">After</button>
            </>
        );
        await user.tab();
        expect(trigger('File')).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('moves to the next trigger with ArrowRight, wrapping', async () => {
        const { user } = renderUi(<Editor />);
        await user.tab();
        await user.keyboard('{ArrowRight}');
        expect(trigger('Edit')).toHaveFocus();
        await user.keyboard('{ArrowRight}{ArrowRight}');
        expect(trigger('File')).toHaveFocus();
    });

    it('moves to the previous trigger with ArrowLeft, wrapping', async () => {
        const { user } = renderUi(<Editor />);
        await user.tab();
        await user.keyboard('{ArrowLeft}');
        expect(trigger('View')).toHaveFocus();
        await user.keyboard('{ArrowLeft}');
        expect(trigger('Edit')).toHaveFocus();
    });

    it('moves to the first and last trigger with Home and End', async () => {
        const { user } = renderUi(<Editor />);
        await user.tab();
        await user.keyboard('{End}');
        expect(trigger('View')).toHaveFocus();
        await user.keyboard('{Home}');
        expect(trigger('File')).toHaveFocus();
    });

    it('mirrors the arrow keys between triggers in right-to-left pages', async () => {
        const { user } = renderUi(<Editor />, { dir: 'rtl' });
        await user.tab();
        await user.keyboard('{ArrowLeft}');
        expect(trigger('Edit')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(trigger('File')).toHaveFocus();
    });

    it('opens a menu with Enter and with Space', async () => {
        const { user } = renderUi(<Editor />);
        await user.tab();
        await user.keyboard('{Enter}');
        expect(await screen.findByRole('menu')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        await user.keyboard(' ');
        expect(await screen.findByRole('menu')).toBeInTheDocument();
    });

    it('opens a menu on its first item with ArrowDown and moves with ArrowDown and ArrowUp, skipping a disabled item', async () => {
        const { user } = renderUi(<Editor />);
        await user.tab();
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: /Save/ })).toHaveFocus());
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
        await user.keyboard('{ArrowUp}');
        expect(screen.getByRole('menuitem', { name: /Save/ })).toHaveFocus();
        expect(screen.getByRole('menuitem', { name: 'Print' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('moves to the first and last item of an open menu with Home and End', async () => {
        const { user } = renderUi(<Editor />);
        await user.tab();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('menu');
        await user.keyboard('{End}');
        expect(screen.getByRole('menuitem', { name: 'Export as' })).toHaveFocus();
        await user.keyboard('{Home}');
        expect(screen.getByRole('menuitem', { name: /Save/ })).toHaveFocus();
    });

    it('moves to an item by typing its first letters', async () => {
        const { user } = renderUi(<Editor />);
        await user.tab();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('menu');
        await user.keyboard('dup');
        expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    });

    it('opens the next and previous menu with ArrowRight and ArrowLeft from inside an open menu', async () => {
        const { user } = renderUi(<Editor />);
        await user.tab();
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: /Save/ })).toHaveFocus());
        await user.keyboard('{ArrowRight}');
        await waitFor(() => expect(trigger('Edit')).toHaveAttribute('aria-expanded', 'true'));
        expect(trigger('File')).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByRole('menu').contains(document.activeElement)).toBe(true);
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus();
        await user.keyboard('{ArrowLeft}');
        await waitFor(() => expect(trigger('File')).toHaveAttribute('aria-expanded', 'true'));
        expect(screen.getByRole('menu').contains(document.activeElement)).toBe(true);
    });

    it('chooses an item with Enter, runs onSelect, closes and returns focus to its trigger', async () => {
        const onSave = vi.fn();
        const { user } = renderUi(<Editor onSave={onSave} />);
        await user.tab();
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: /Save/ })).toHaveFocus());
        await user.keyboard('{Enter}');
        expect(onSave).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        await waitFor(() => expect(trigger('File')).toHaveFocus());
    });

    it('chooses an item with Space', async () => {
        const onUndo = vi.fn();
        const { user } = renderUi(<Editor onUndo={onUndo} />);
        await user.tab();
        await user.keyboard('{ArrowRight}{ArrowDown}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus());
        await user.keyboard(' ');
        expect(onUndo).toHaveBeenCalledTimes(1);
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        const { user } = renderUi(<Editor />);
        await user.tab();
        await user.keyboard('{Enter}');
        await screen.findByRole('menu');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        expect(trigger('File')).toHaveFocus();
    });

    it('opens a submenu with ArrowRight and closes it with ArrowLeft', async () => {
        const { user } = renderUi(<Editor />);
        await user.tab();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('menu');
        await user.keyboard('{End}');
        const sub = screen.getByRole('menuitem', { name: 'Export as' });
        expect(sub).toHaveAttribute('aria-haspopup', 'menu');
        await user.keyboard('{ArrowRight}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'HTML' })).toHaveFocus());
        // A long submenu stops at the room in the window and scrolls, as the menu does.
        expect(screen.getByRole('menuitem', { name: 'HTML' }).closest('[data-slot=menubar-sub-content]').className).toMatch(
            /max-h-\(--radix-menubar-content-available-height\).*overflow-y-auto/,
        );
        await user.keyboard('{ArrowLeft}');
        await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'HTML' })).toBeNull());
        expect(screen.getByRole('menuitem', { name: 'Export as' })).toHaveFocus();
    });

    it('toggles a checkbox item and chooses one radio item', async () => {
        function Layout() {
            const [outline, setOutline] = useState(false);
            const [width, setWidth] = useState('600');
            return (
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>Layout</MenubarTrigger>
                        <MenubarContent>
                            <MenubarLabel>Panels</MenubarLabel>
                            <MenubarCheckboxItem checked={outline} onCheckedChange={setOutline}>Outline</MenubarCheckboxItem>
                            <MenubarRadioGroup value={width} onValueChange={setWidth}>
                                <MenubarRadioItem value="480">480 px</MenubarRadioItem>
                                <MenubarRadioItem value="600">600 px</MenubarRadioItem>
                            </MenubarRadioGroup>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            );
        }
        const { user } = renderUi(<Layout />);
        await user.click(trigger('Layout'));
        expect(await screen.findByRole('menuitemcheckbox', { name: 'Outline' })).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByRole('menuitemradio', { name: '600 px' })).toHaveAttribute('aria-checked', 'true');
        await expectNoAxeViolations();
        await user.click(screen.getByRole('menuitemcheckbox', { name: 'Outline' }));
        await user.click(trigger('Layout'));
        expect(await screen.findByRole('menuitemcheckbox', { name: 'Outline' })).toHaveAttribute('aria-checked', 'true');
        await user.click(screen.getByRole('menuitemradio', { name: '480 px' }));
        await user.click(trigger('Layout'));
        expect(await screen.findByRole('menuitemradio', { name: '480 px' })).toHaveAttribute('aria-checked', 'true');
    });

    it('keeps a shortcut hint in its written order on a right-to-left page', async () => {
        const { user } = renderUi(<Editor />, { dir: 'rtl' });
        await user.click(trigger('File'));
        expect(await screen.findByText('⌘S')).toHaveClass('[unicode-bidi:plaintext]');
        expect(screen.getByText('⌘S')).toHaveClass('ms-auto');
    });
});
