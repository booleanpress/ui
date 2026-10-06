import { useRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/alert-dialog';
import { Button } from '@/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Confirm({ onConfirm = () => {}, returnFocusTo }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="destructive">Delete logs</Button></AlertDialogTrigger>
            <AlertDialogContent returnFocusTo={returnFocusTo}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete the logs?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={onConfirm}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

describe('AlertDialog', () => {
    it('opens as an alertdialog with focus on Cancel, the least destructive action', async () => {
        const { user } = renderUi(<Confirm />);
        await user.click(screen.getByRole('button', { name: 'Delete logs' }));
        expect(screen.getByRole('alertdialog', { name: 'Delete the logs?' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('treats Escape as Cancel and returns focus to the trigger', async () => {
        let confirmed = false;
        const { user } = renderUi(<Confirm onConfirm={() => { confirmed = true; }} />);
        const trigger = screen.getByRole('button', { name: 'Delete logs' });
        await user.click(trigger);
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
        expect(confirmed).toBe(false);
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('activates the action with Enter', async () => {
        let confirmed = false;
        const { user } = renderUi(<Confirm onConfirm={() => { confirmed = true; }} />);
        await user.click(screen.getByRole('button', { name: 'Delete logs' }));
        screen.getByRole('button', { name: 'Delete' }).focus();
        await user.keyboard('{Enter}');
        expect(confirmed).toBe(true);
    });

    it('returns focus to the button that opened it from code, when there is no trigger', async () => {
        function Controlled() {
            const [open, setOpen] = useState(false);
            return (
                <>
                    <Button onClick={() => setOpen(true)}>Deactivate</Button>
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Deactivate the mailer?</AlertDialogTitle>
                                <AlertDialogDescription>Messages stop going through it.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Deactivate</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        const opener = screen.getByRole('button', { name: 'Deactivate' });
        await user.click(opener);
        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
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
                            <DropdownMenuItem variant="destructive" onSelect={() => setOpen(true)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete the mailer?</AlertDialogTitle>
                                <AlertDialogDescription>Its logs stay.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        }
        const { user } = renderUi(<FromMenu />);
        const menuButton = screen.getByRole('button', { name: 'Mailer actions' });
        menuButton.focus();
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus());
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus());
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
        await waitFor(() => expect(menuButton).toHaveFocus());
    });

    it('returns focus to the row button, not returnFocusTo, when a delete is cancelled', async () => {
        function Row() {
            const [open, setOpen] = useState(false);
            const heading = useRef(null);
            return (
                <>
                    <h2 ref={heading} tabIndex={-1}>Mailers</h2>
                    <Button onClick={() => setOpen(true)}>Delete mailer</Button>
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogContent returnFocusTo={heading}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete the mailer?</AlertDialogTitle>
                                <AlertDialogDescription>It stops sending.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        }
        const { user } = renderUi(<Row />);
        const opener = screen.getByRole('button', { name: 'Delete mailer' });
        await user.click(opener);
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
        await waitFor(() => expect(opener).toHaveFocus());
    });

    it('sends focus to returnFocusTo when the confirmed action removed the trigger', async () => {
        function List() {
            const [shown, setShown] = useState(true);
            const heading = useRef(null);
            return (
                <>
                    <h2 ref={heading} tabIndex={-1}>Logs</h2>
                    {shown && <Confirm returnFocusTo={heading} onConfirm={() => setShown(false)} />}
                </>
            );
        }
        const { user } = renderUi(<List />);
        await user.click(screen.getByRole('button', { name: 'Delete logs' }));
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await waitFor(() => expect(screen.getByRole('heading', { name: 'Logs' })).toHaveFocus());
    });

    it('keeps Tab and Shift+Tab inside, wrapping between its buttons', async () => {
        const { user } = renderUi(<Confirm />);
        await user.click(screen.getByRole('button', { name: 'Delete logs' }));
        const cancel = await screen.findByRole('button', { name: 'Cancel' });
        await waitFor(() => expect(cancel).toHaveFocus());
        await user.tab();
        expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus();
        await user.tab();
        expect(cancel).toHaveFocus();
        await user.tab({ shift: true });
        expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus();
    });

    it('presses the focused button with Space', async () => {
        let confirmed = 0;
        const { user } = renderUi(<Confirm onConfirm={() => (confirmed += 1)} />);
        await user.click(screen.getByRole('button', { name: 'Delete logs' }));
        await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus());
        await user.tab();
        await user.keyboard(' ');
        await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
        expect(confirmed).toBe(1);
    });
});
