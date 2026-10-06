import { useRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Button } from '@/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/dialog';
import { Input } from '@/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Example({ size, children, returnFocusTo, rootProps, contentProps }) {
    return (
        <Dialog {...rootProps}>
            <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
            <DialogContent size={size} returnFocusTo={returnFocusTo} {...contentProps}>
                <DialogHeader>
                    <DialogTitle>Edit mailer</DialogTitle>
                    <DialogDescription>Change the name.</DialogDescription>
                </DialogHeader>
                <DialogBody>{children ?? <Input aria-label="Name" />}</DialogBody>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

describe('Dialog', () => {
    it('opens as a labelled dialog and moves focus inside', async () => {
        const { user } = renderUi(<Example />);
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        const dialog = screen.getByRole('dialog', { name: 'Edit mailer' });
        expect(dialog).toHaveAccessibleDescription('Change the name.');
        expect(dialog.contains(document.activeElement)).toBe(true);
        await expectNoAxeViolations();
    });

    it('keeps Tab and Shift+Tab inside, wrapping at both ends', async () => {
        const { user } = renderUi(<Example />);
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        const dialog = screen.getByRole('dialog');
        const close = screen.getByRole('button', { name: 'Close' });
        close.focus();
        await user.tab();
        expect(dialog.contains(document.activeElement)).toBe(true);
        expect(document.activeElement).not.toBe(close);
        for (let i = 0; i < 6; i += 1) {
            await user.tab({ shift: i % 2 === 0 });
            expect(dialog.contains(document.activeElement)).toBe(true);
        }
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        const { user } = renderUi(<Example />);
        const trigger = screen.getByRole('button', { name: 'Open dialog' });
        await user.click(trigger);
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('closes an open select first, then the dialog, on Escape', async () => {
        const { user } = renderUi(
            <Example>
                <Select defaultValue="all">
                    <SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </Example>,
        );
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        screen.getByRole('combobox', { name: 'Status' }).focus();
        await user.keyboard('{Enter}');
        expect(await screen.findByRole('listbox')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('renders the × as the 36 px round icon button, named by the provider', async () => {
        const { user } = renderUi(<Example />, { strings: { close: 'Fermer' } });
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        const close = screen.getByRole('button', { name: 'Fermer' });
        expect(close).toHaveAttribute('data-slot', 'dialog-close');
        expect(close).toHaveAttribute('data-size', 'icon');
        expect(close.className).toContain('size-9');
        expect(close.className).toContain('rounded-full');
        expect(close.className).toContain('end-4.5');
    });

    it('maps size to a maximum width', async () => {
        for (const [size, width] of [['sm', 'sm:max-w-sm'], ['md', 'sm:max-w-lg'], ['lg', 'sm:max-w-2xl']]) {
            const { user, unmount } = renderUi(<Example size={size} />);
            await user.click(screen.getByRole('button', { name: 'Open dialog' }));
            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('data-size', size);
            expect(dialog.className).toContain(width);
            unmount();
        }
    });

    it('sends focus to returnFocusTo when its trigger was removed', async () => {
        function Rows() {
            const [rows, setRows] = useState(['a', 'b']);
            const heading = useRef(null);
            return (
                <>
                    <h2 ref={heading} tabIndex={-1}>Rows</h2>
                    {rows.map((row) => (
                        <Dialog key={row}>
                            <DialogTrigger asChild><Button>Delete {row}</Button></DialogTrigger>
                            <DialogContent returnFocusTo={heading}>
                                <DialogTitle>Delete {row}?</DialogTitle>
                                <DialogDescription>Removes the row.</DialogDescription>
                                <DialogClose asChild>
                                    <Button onClick={() => setRows((list) => list.filter((r) => r !== row))}>Confirm</Button>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                    ))}
                </>
            );
        }
        const { user } = renderUi(<Rows />);
        await user.click(screen.getByRole('button', { name: 'Delete a' }));
        await user.click(screen.getByRole('button', { name: 'Confirm' }));
        await waitFor(() => expect(screen.getByRole('heading', { name: 'Rows' })).toHaveFocus());
    });

    it('returns focus to the button that opened it from code, when there is no trigger', async () => {
        function Controlled() {
            const [open, setOpen] = useState(false);
            return (
                <>
                    <Button onClick={() => setOpen(true)}>Quick Test</Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent>
                            <DialogTitle>Send a test email</DialogTitle>
                            <DialogDescription>To your address.</DialogDescription>
                        </DialogContent>
                    </Dialog>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        const opener = screen.getByRole('button', { name: 'Quick Test' });
        await user.click(opener);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(opener).toHaveFocus());
    });

    it('returns focus to the menu button when a menu item opened it, since the item leaves with its menu', async () => {
        function FromMenu() {
            const [open, setOpen] = useState(false);
            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button>Mailer actions</Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => setOpen(true)}>Rename</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent>
                            <DialogTitle>Rename the mailer</DialogTitle>
                            <DialogDescription>Give it a name your team knows.</DialogDescription>
                        </DialogContent>
                    </Dialog>
                </>
            );
        }
        const { user } = renderUi(<FromMenu />);
        const menuButton = screen.getByRole('button', { name: 'Mailer actions' });
        await user.click(menuButton);
        await user.click(await screen.findByRole('menuitem', { name: 'Rename' }));
        await screen.findByRole('dialog', { name: 'Rename the mailer' });
        await waitFor(() => expect(screen.getByRole('dialog')).toContainElement(document.activeElement));
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(menuButton).toHaveFocus());
    });

    it('lets the footer close button take its label from the provider', async () => {
        const { user } = renderUi(
            <Dialog>
                <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
                <DialogContent showCloseButton={false}>
                    <DialogTitle>Notice</DialogTitle>
                    <DialogDescription>Read me.</DialogDescription>
                    <DialogFooter showCloseButton />
                </DialogContent>
            </Dialog>,
            { strings: { close: 'Schließen' } },
        );
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        expect(screen.getByRole('button', { name: 'Schließen' })).toBeInTheDocument();
    });
    it('maximises and restores with its header button, named from the provider', async () => {
        const { user } = renderUi(<Example contentProps={{ maximizable: true }} />, {
            strings: { maximize: 'Agrandir', restore: 'Restaurer' },
        });
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('data-maximized', 'false');
        expect(dialog).toHaveAttribute('data-size', 'md');
        await user.click(screen.getByRole('button', { name: 'Agrandir' }));
        expect(dialog).toHaveAttribute('data-maximized', 'true');
        expect(dialog).toHaveAttribute('data-size', 'full');
        expect(dialog.className).toContain('rounded-none');
        const restore = screen.getByRole('button', { name: 'Restaurer' });
        expect(restore).toHaveAttribute('data-slot', 'dialog-maximize');
        await expectNoAxeViolations();
        await user.click(restore);
        expect(dialog).toHaveAttribute('data-size', 'md');
        expect(screen.getByRole('button', { name: 'Agrandir' })).toBeInTheDocument();
    });

    it('toggles the maximised size with Enter and Space on the maximise button', async () => {
        const { user } = renderUi(<Example contentProps={{ maximizable: true }} />);
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        const dialog = screen.getByRole('dialog');
        screen.getByRole('button', { name: 'Maximize' }).focus();
        await user.keyboard('{Enter}');
        expect(dialog).toHaveAttribute('data-size', 'full');
        expect(screen.getByRole('button', { name: 'Restore' })).toHaveFocus();
        await user.keyboard(' ');
        expect(dialog).toHaveAttribute('data-size', 'md');
    });

    it('reports a controlled maximised state and leaves it to the consumer', async () => {
        function Controlled() {
            const [maximized, setMaximized] = useState(false);
            return (
                <>
                    <span data-testid="maximized">{String(maximized)}</span>
                    <Example contentProps={{ maximizable: true, maximized, onMaximizedChange: setMaximized }} />
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        await user.click(screen.getByRole('button', { name: 'Maximize' }));
        expect(screen.getByTestId('maximized')).toHaveTextContent('true');
        expect(screen.getByRole('dialog')).toHaveAttribute('data-size', 'full');
    });

    it('puts the maximise button beside the ×, or in its place without one', async () => {
        const { user, unmount } = renderUi(<Example contentProps={{ maximizable: true }} />);
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        expect(screen.getByRole('button', { name: 'Maximize' }).className).toContain('end-15.5');
        unmount();
        const second = renderUi(<Example contentProps={{ maximizable: true, showCloseButton: false }} />);
        await second.user.click(screen.getByRole('button', { name: 'Open dialog' }));
        expect(screen.getByRole('button', { name: 'Maximize' }).className).toContain('end-4.5');
    });

    it('fills the window with size="full", and draws no maximise button there', async () => {
        const { user } = renderUi(<Example size="full" contentProps={{ maximizable: true }} />);
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('data-size', 'full');
        expect(dialog.className).toContain('rounded-none');
        expect(dialog.className).toContain('max-w-none');
        expect(screen.queryByRole('button', { name: 'Maximize' })).toBeNull();
        await expectNoAxeViolations();
    });

    it('places the dialog by position, centred by default', async () => {
        for (const [position, edge] of [['center', 'translate-y-[-50%]'], ['top', 'top-[calc(var(--wp-admin--admin-bar--height,0px)+1rem)]'], ['bottom', 'bottom-4'], ['start', 'start-4'], ['end', 'end-4']]) {
            const { user, unmount } = renderUi(<Example contentProps={position === 'center' ? {} : { position }} />);
            await user.click(screen.getByRole('button', { name: 'Open dialog' }));
            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('data-position', position);
            expect(dialog.className).toContain(edge);
            unmount();
        }
    });

    it('as a non-modal dialog, has no mask, lets Tab leave it and stays open while the page is used', async () => {
        const { user } = renderUi(
            <>
                <Button>Before</Button>
                <Example rootProps={{ modal: false }} />
                <Button>After</Button>
            </>,
        );
        const trigger = screen.getByRole('button', { name: 'Open dialog' });
        await user.click(trigger);
        const dialog = screen.getByRole('dialog');
        expect(dialog).not.toHaveAttribute('aria-modal');
        expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeNull();
        screen.getByRole('button', { name: 'Close' }).focus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        screen.getByRole('textbox', { name: 'Name' }).focus();
        await user.tab({ shift: true });
        expect(trigger).toHaveFocus();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Before' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await expectNoAxeViolations();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('with scroll="outside", sits in the scrolling mask and takes focus itself; a non-modal dialog scrolls inside', async () => {
        const { user, unmount } = renderUi(<Example contentProps={{ scroll: 'outside' }} />);
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        const dialog = screen.getByRole('dialog');
        const mask = document.querySelector('[data-slot="dialog-overlay"]');
        expect(mask).toContainElement(dialog);
        expect(mask.className).toContain('overflow-y-auto');
        expect(dialog).toHaveAttribute('data-scroll', 'outside');
        expect(dialog.className).not.toContain('fixed');
        // It opens at its top: focus goes to the dialog itself, not to a control that may sit at the end.
        expect(dialog).toHaveFocus();
        await expectNoAxeViolations();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        unmount();
        const second = renderUi(<Example rootProps={{ modal: false }} contentProps={{ scroll: 'outside' }} />);
        await second.user.click(screen.getByRole('button', { name: 'Open dialog' }));
        expect(screen.getByRole('dialog')).toHaveAttribute('data-scroll', 'inside');
    });

    it('with scroll="outside", closes on a click on the mask', async () => {
        const { user } = renderUi(<Example contentProps={{ scroll: 'outside' }} />);
        await user.click(screen.getByRole('button', { name: 'Open dialog' }));
        await user.click(document.querySelector('[data-slot="dialog-overlay"]'));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });
});
