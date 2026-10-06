import { useEffect, useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { KeyRoundIcon } from 'lucide-react';
import { ConfirmProvider, useConfirm } from '@/components/confirm';
import { Button } from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Asker({ options, onResult, label = 'Delete mailer' }) {
    const confirm = useConfirm();
    return <Button onClick={async () => onResult(await confirm(options))}>{label}</Button>;
}

function setup(options = {}, providerProps = {}) {
    const results = [];
    const utils = renderUi(
        <ConfirmProvider>
            <Asker options={options} onResult={(result) => results.push(result)} />
        </ConfirmProvider>,
        providerProps,
    );
    return { ...utils, results, trigger: screen.getByRole('button', { name: 'Delete mailer' }) };
}

function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

const closed = () => waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());

describe('Confirm', () => {
    it('opens an alert dialog named by the title, with focus on Confirm, and resolves true when confirmed', async () => {
        const { user, results, trigger } = setup({ title: 'Send a test email?', description: 'It goes to admin@example.com.' });
        await user.click(trigger);
        const dialog = await screen.findByRole('alertdialog', { name: 'Send a test email?' });
        expect(dialog).toHaveAccessibleDescription('It goes to admin@example.com.');
        expect(within(dialog).getByRole('button', { name: 'Confirm' })).toHaveFocus();
        await expectNoAxeViolations();
        await user.click(within(dialog).getByRole('button', { name: 'Confirm' }));
        await closed();
        expect(results).toEqual([true]);
    });

    it('resolves false on Cancel and returns focus to the button that asked', async () => {
        const { user, results, trigger } = setup({ title: 'Delete it?' });
        await user.click(trigger);
        await user.click(await screen.findByRole('button', { name: 'Cancel' }));
        await closed();
        expect(results).toEqual([false]);
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('treats Escape as Cancel', async () => {
        const { user, results, trigger } = setup({ title: 'Delete it?' });
        await user.click(trigger);
        await screen.findByRole('alertdialog');
        await user.keyboard('{Escape}');
        await closed();
        expect(results).toEqual([false]);
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('activates the focused button with Enter and with Space', async () => {
        const { user, results, trigger } = setup({ title: 'Delete it?' });
        await user.click(trigger);
        await screen.findByRole('alertdialog');
        await user.keyboard('{Enter}');
        await closed();
        await user.click(trigger);
        await screen.findByRole('alertdialog');
        screen.getByRole('button', { name: 'Cancel' }).focus();
        await user.keyboard(' ');
        await closed();
        expect(results).toEqual([true, false]);
    });

    it('keeps Tab and Shift+Tab inside, wrapping between its buttons', async () => {
        const { user, trigger } = setup({ title: 'Delete it?' });
        await user.click(trigger);
        const dialog = await screen.findByRole('alertdialog');
        const cancel = within(dialog).getByRole('button', { name: 'Cancel' });
        const action = within(dialog).getByRole('button', { name: 'Confirm' });
        const close = within(dialog).getByRole('button', { name: 'Close' });
        expect(action).toHaveFocus();
        await user.tab();
        expect(close).toHaveFocus();
        await user.tab();
        expect(cancel).toHaveFocus();
        await user.tab({ shift: true });
        expect(close).toHaveFocus();
    });

    it('starts on Cancel for a destructive confirmation, whose button reads Delete', async () => {
        const { user, trigger } = setup({ title: 'Delete the Staging mailer?', tone: 'destructive' });
        await user.click(trigger);
        const dialog = await screen.findByRole('alertdialog');
        expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus();
        expect(within(dialog).getByRole('button', { name: 'Delete' })).toHaveAttribute('data-variant', 'destructive');
        expect(dialog).toHaveAttribute('data-tone', 'destructive');
        await expectNoAxeViolations();
    });

    it('takes custom labels, an icon and defaultFocus', async () => {
        const { user, results, trigger } = setup({
            title: 'Rotate the API key?',
            description: 'Sites stop sending until you paste the new one.',
            icon: <KeyRoundIcon data-testid="icon" />,
            confirmLabel: 'Rotate key',
            cancelLabel: 'Keep current key',
            defaultFocus: 'cancel',
        });
        await user.click(trigger);
        const dialog = await screen.findByRole('alertdialog');
        expect(within(dialog).getByTestId('icon')).toBeInTheDocument();
        expect(within(dialog).getByRole('button', { name: 'Keep current key' })).toHaveFocus();
        await expectNoAxeViolations();
        await user.click(within(dialog).getByRole('button', { name: 'Rotate key' }));
        await closed();
        expect(results).toEqual([true]);
    });

    it('resolves false from the ×, named by the provider', async () => {
        const { user, results, trigger } = setup({ title: 'Delete it?' }, { strings: { close: 'Schließen' } });
        await user.click(trigger);
        await user.click(await screen.findByRole('button', { name: 'Schließen' }));
        await closed();
        expect(results).toEqual([false]);
    });

    it('can leave out the ×', async () => {
        const { user, trigger } = setup({ title: 'Delete it?', showCloseButton: false });
        await user.click(trigger);
        const dialog = await screen.findByRole('alertdialog');
        expect(within(dialog).queryByRole('button', { name: 'Close' })).toBeNull();
    });

    it('takes its default title and labels from the provider', async () => {
        const { user } = setup({}, { strings: { confirmTitle: 'Sind Sie sicher?', confirm: 'Bestätigen', cancel: 'Abbrechen' } });
        await user.click(screen.getByRole('button', { name: 'Delete mailer' }));
        const dialog = await screen.findByRole('alertdialog', { name: 'Sind Sie sicher?' });
        expect(within(dialog).getByRole('button', { name: 'Bestätigen' })).toBeInTheDocument();
        expect(within(dialog).getByRole('button', { name: 'Abbrechen' })).toBeInTheDocument();
    });

    it('shows a spinner and stays open while an async onConfirm runs, then resolves true', async () => {
        const work = deferred();
        const { user, results, trigger } = setup({ title: 'Revoke the key?', confirmLabel: 'Revoke', onConfirm: () => work.promise });
        await user.click(trigger);
        const dialog = await screen.findByRole('alertdialog');
        const action = within(dialog).getByRole('button', { name: /Revoke/ });
        await user.click(action);
        expect(within(action).getByRole('status', { name: 'Loading' })).toBeInTheDocument();
        expect(action).toHaveAttribute('aria-busy', 'true');
        expect(action).toHaveAttribute('aria-disabled', 'true');
        expect(dialog).toHaveAttribute('aria-busy', 'true');
        expect(action).toHaveFocus();
        await expectNoAxeViolations();
        // Escape and Cancel wait for the work.
        await user.keyboard('{Escape}');
        await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        expect(results).toEqual([]);
        work.resolve();
        await closed();
        expect(results).toEqual([true]);
    });

    it('stays open with the error when onConfirm rejects, for another try', async () => {
        let attempt = 0;
        const { user, results, trigger } = setup({
            title: 'Purge the queue?',
            confirmLabel: 'Purge',
            onConfirm: () => {
                attempt += 1;
                return attempt === 1 ? Promise.reject(new Error('The queue did not answer.')) : Promise.resolve();
            },
        });
        await user.click(trigger);
        const dialog = await screen.findByRole('alertdialog');
        await user.click(within(dialog).getByRole('button', { name: 'Purge' }));
        expect(await within(dialog).findByRole('alert')).toHaveTextContent('The queue did not answer.');
        const action = within(dialog).getByRole('button', { name: 'Purge' });
        expect(action).not.toHaveAttribute('aria-disabled');
        expect(action).toHaveFocus();
        await expectNoAxeViolations();
        await user.click(action);
        await closed();
        expect(results).toEqual([true]);
    });

    it('says that it failed when onConfirm rejects without a message, in the provider’s words', async () => {
        const { user } = setup(
            { title: 'Purge the queue?', confirmLabel: 'Purge', onConfirm: () => Promise.reject() },
            { strings: { actionFailed: 'Échec. Réessayez.' } },
        );
        await user.click(screen.getByRole('button', { name: 'Delete mailer' }));
        const dialog = await screen.findByRole('alertdialog');
        await user.click(within(dialog).getByRole('button', { name: 'Purge' }));
        expect(await within(dialog).findByRole('alert')).toHaveTextContent('Échec. Réessayez.');
    });

    it('queues confirmations asked while one is open, one at a time, and returns focus at the end', async () => {
        const results = [];
        function Importer() {
            const confirm = useConfirm();
            const ask = async () => {
                const answers = await Promise.all([confirm({ title: 'Replace Primary?' }), confirm({ title: 'Replace SES?' })]);
                results.push(...answers);
            };
            return <Button onClick={ask}>Import</Button>;
        }
        const { user } = renderUi(
            <ConfirmProvider>
                <Importer />
            </ConfirmProvider>,
        );
        const trigger = screen.getByRole('button', { name: 'Import' });
        await user.click(trigger);
        expect(await screen.findByRole('alertdialog', { name: 'Replace Primary?' })).toBeInTheDocument();
        expect(screen.getAllByRole('alertdialog')).toHaveLength(1);
        await user.click(screen.getByRole('button', { name: 'Confirm' }));
        const second = await screen.findByRole('alertdialog', { name: 'Replace SES?' });
        await waitFor(() => expect(within(second).getByRole('button', { name: 'Confirm' })).toHaveFocus());
        await user.click(within(second).getByRole('button', { name: 'Cancel' }));
        await closed();
        await waitFor(() => expect(results).toEqual([true, false]));
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('sends focus to returnFocusTo when the element that asked is gone', async () => {
        function List() {
            const confirm = useConfirm();
            const [shown, setShown] = useState(true);
            const heading = useRef(null);
            const remove = async () => {
                const promise = confirm({ title: 'Delete the key?', returnFocusTo: heading });
                setShown(false);
                await promise;
            };
            return (
                <>
                    <h2 ref={heading} tabIndex={-1}>API keys</h2>
                    {shown && <Button onClick={remove}>Delete key</Button>}
                </>
            );
        }
        const { user } = renderUi(
            <ConfirmProvider>
                <List />
            </ConfirmProvider>,
        );
        await user.click(screen.getByRole('button', { name: 'Delete key' }));
        await user.click(await screen.findByRole('button', { name: 'Confirm' }));
        await closed();
        await waitFor(() => expect(screen.getByRole('heading', { name: 'API keys' })).toHaveFocus());
    });

    it('returns focus to the menu button when a menu item asked, since the item leaves with its menu', async () => {
        const results = [];
        function MenuAsker() {
            const confirm = useConfirm();
            const ask = (title) => async () => results.push(await confirm({ title }));
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button>Mailer actions</Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={ask('Delete the mailer?')}>Delete</DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onSelect={ask('Archive the mailer?')}>Archive</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
        const { user } = renderUi(
            <ConfirmProvider>
                <MenuAsker />
            </ConfirmProvider>,
        );
        const menuButton = screen.getByRole('button', { name: 'Mailer actions' });
        await user.click(menuButton);
        await user.click(await screen.findByRole('menuitem', { name: 'Delete' }));
        await screen.findByRole('alertdialog', { name: 'Delete the mailer?' });
        await user.keyboard('{Escape}');
        await closed();
        await waitFor(() => expect(menuButton).toHaveFocus());

        // From a submenu, whose trigger leaves the page too.
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus());
        await user.keyboard('{ArrowDown}{ArrowRight}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus());
        await user.keyboard('{Enter}');
        await screen.findByRole('alertdialog', { name: 'Archive the mailer?' });
        await user.click(screen.getByRole('button', { name: 'Confirm' }));
        await closed();
        await waitFor(() => expect(menuButton).toHaveFocus());
        expect(results).toEqual([false, true]);
    });

    it('asked from inside a dialog, closes alone on Escape and returns focus into the dialog', async () => {
        function DialogAsker() {
            const confirm = useConfirm();
            return (
                <Dialog>
                    <DialogTrigger asChild><Button>Edit sender</Button></DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Edit sender</DialogTitle>
                        <DialogDescription>Change the name.</DialogDescription>
                        <Button onClick={() => confirm({ title: 'Discard your changes?' })}>Discard</Button>
                    </DialogContent>
                </Dialog>
            );
        }
        const { user } = renderUi(
            <ConfirmProvider>
                <DialogAsker />
            </ConfirmProvider>,
        );
        await user.click(screen.getByRole('button', { name: 'Edit sender' }));
        const discard = await screen.findByRole('button', { name: 'Discard' });
        await user.click(discard);
        await screen.findByRole('alertdialog', { name: 'Discard your changes?' });
        await user.keyboard('{Escape}');
        await closed();
        expect(screen.getByRole('dialog', { name: 'Edit sender' })).toBeInTheDocument();
        await waitFor(() => expect(discard).toHaveFocus());
    });

    it('keeps a separate queue per provider', async () => {
        const { user } = renderUi(
            <>
                <ConfirmProvider>
                    <Asker label="First" options={{ title: 'First question?' }} onResult={() => {}} />
                </ConfirmProvider>
                <ConfirmProvider>
                    <Asker label="Second" options={{ title: 'Second question?' }} onResult={() => {}} />
                </ConfirmProvider>
            </>,
        );
        await user.click(screen.getByRole('button', { name: 'First' }));
        expect(await screen.findByRole('alertdialog', { name: 'First question?' })).toBeInTheDocument();
        await user.keyboard('{Escape}');
        await closed();
        await user.click(screen.getByRole('button', { name: 'Second' }));
        expect(await screen.findByRole('alertdialog', { name: 'Second question?' })).toBeInTheDocument();
    });

    it('resolves false for every waiting confirmation when the provider unmounts', async () => {
        const results = [];
        const pending = [];
        function Ask() {
            const confirm = useConfirm();
            useEffect(() => {
                pending.push(confirm({ title: 'One?' }), confirm({ title: 'Two?' }));
            }, [confirm]);
            return null;
        }
        const { unmount } = renderUi(
            <ConfirmProvider>
                <Ask />
            </ConfirmProvider>,
        );
        await screen.findByRole('alertdialog', { name: 'One?' });
        unmount();
        results.push(...(await Promise.all(pending)));
        expect(results).toEqual([false, false]);
    });

    it('throws a clear error when useConfirm is called outside a ConfirmProvider', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        function Lost() {
            useConfirm();
            return null;
        }
        expect(() => render(<Lost />)).toThrow(/ConfirmProvider/);
        spy.mockRestore();
    });
});
