import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { TriangleAlertIcon } from 'lucide-react';
import { ConfirmPopup, ConfirmPopupContent, ConfirmPopupTrigger } from '@/components/confirm-popup';
import { Button } from '@/components/button';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Save({ onConfirm, onCancel, tone, content = {}, providerProps }) {
    return renderUi(
        <ConfirmPopup onConfirm={onConfirm} onCancel={onCancel} tone={tone}>
            <ConfirmPopupTrigger asChild>
                <Button>Save</Button>
            </ConfirmPopupTrigger>
            <ConfirmPopupContent message="Save the changes?" icon={<TriangleAlertIcon />} {...content} />
        </ConfirmPopup>,
        providerProps,
    );
}

const closed = () => waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());

function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

describe('ConfirmPopup', () => {
    it('opens from its trigger as an alert dialog named by the message, with focus on Confirm', async () => {
        const { user } = Save({});
        const trigger = screen.getByRole('button', { name: 'Save' });
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await user.click(trigger);
        const popup = await screen.findByRole('alertdialog', { name: 'Save the changes?' });
        expect(popup).toHaveAttribute('aria-modal', 'true');
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        await waitFor(() => expect(within(popup).getByRole('button', { name: 'Confirm' })).toHaveFocus());
        await expectNoAxeViolations();
    });

    it('opens from the keyboard with Enter and with Space', async () => {
        const { user } = Save({});
        const trigger = screen.getByRole('button', { name: 'Save' });
        trigger.focus();
        await user.keyboard('{Enter}');
        expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        await closed();
        trigger.focus();
        await user.keyboard(' ');
        expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
    });

    it('confirms, closes and returns focus to the trigger', async () => {
        const onConfirm = vi.fn();
        const { user } = Save({ onConfirm });
        const trigger = screen.getByRole('button', { name: 'Save' });
        await user.click(trigger);
        await user.click(await screen.findByRole('button', { name: 'Confirm' }));
        await closed();
        expect(onConfirm).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('cancels with Escape and returns focus to the trigger', async () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        const { user } = Save({ onConfirm, onCancel });
        const trigger = screen.getByRole('button', { name: 'Save' });
        await user.click(trigger);
        await screen.findByRole('alertdialog');
        await user.keyboard('{Escape}');
        await closed();
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onConfirm).not.toHaveBeenCalled();
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('cancels with the Cancel button', async () => {
        const onCancel = vi.fn();
        const { user } = Save({ onCancel });
        await user.click(screen.getByRole('button', { name: 'Save' }));
        await user.click(await screen.findByRole('button', { name: 'Cancel' }));
        await closed();
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('keeps Tab and Shift+Tab between Cancel and Confirm', async () => {
        const { user } = Save({});
        await user.click(screen.getByRole('button', { name: 'Save' }));
        const popup = await screen.findByRole('alertdialog');
        const cancel = within(popup).getByRole('button', { name: 'Cancel' });
        const confirm = within(popup).getByRole('button', { name: 'Confirm' });
        await waitFor(() => expect(confirm).toHaveFocus());
        await user.tab();
        expect(cancel).toHaveFocus();
        await user.tab();
        expect(confirm).toHaveFocus();
        await user.tab({ shift: true });
        expect(cancel).toHaveFocus();
    });

    it('starts on Cancel when destructive, with a red Delete button', async () => {
        const { user } = Save({ tone: 'destructive' });
        await user.click(screen.getByRole('button', { name: 'Save' }));
        const popup = await screen.findByRole('alertdialog');
        await waitFor(() => expect(within(popup).getByRole('button', { name: 'Cancel' })).toHaveFocus());
        expect(within(popup).getByRole('button', { name: 'Delete' })).toHaveAttribute('data-variant', 'destructive');
        await expectNoAxeViolations();
    });

    it('waits for an async onConfirm with a spinner, ignoring Escape, then closes', async () => {
        const work = deferred();
        const { user } = Save({ onConfirm: () => work.promise });
        await user.click(screen.getByRole('button', { name: 'Save' }));
        const popup = await screen.findByRole('alertdialog');
        const confirm = within(popup).getByRole('button', { name: 'Confirm' });
        await user.click(confirm);
        expect(within(confirm).getByRole('status', { name: 'Loading' })).toBeInTheDocument();
        expect(confirm).toHaveAttribute('aria-busy', 'true');
        expect(popup).toHaveAttribute('aria-busy', 'true');
        await expectNoAxeViolations();
        await user.keyboard('{Escape}');
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        work.resolve();
        await closed();
    });

    it('stays open with the error when onConfirm rejects', async () => {
        const { user } = Save({ onConfirm: () => Promise.reject(new Error('The server refused the change.')) });
        await user.click(screen.getByRole('button', { name: 'Save' }));
        const popup = await screen.findByRole('alertdialog');
        await user.click(within(popup).getByRole('button', { name: 'Confirm' }));
        expect(await within(popup).findByRole('alert')).toHaveTextContent('The server refused the change.');
        expect(within(popup).getByRole('button', { name: 'Confirm' })).not.toHaveAttribute('aria-busy');
        await expectNoAxeViolations();
    });

    it('says that it failed when onConfirm rejects without a message, or with a string', async () => {
        let attempt = 0;
        const { user } = Save({
            onConfirm: () => {
                attempt += 1;
                return Promise.reject(attempt === 1 ? undefined : 'The server is busy.');
            },
        });
        await user.click(screen.getByRole('button', { name: 'Save' }));
        const popup = await screen.findByRole('alertdialog');
        await user.click(within(popup).getByRole('button', { name: 'Confirm' }));
        expect(await within(popup).findByRole('alert')).toHaveTextContent('Something went wrong. Try again.');
        await user.click(within(popup).getByRole('button', { name: 'Confirm' }));
        await waitFor(() => expect(within(popup).getByRole('alert')).toHaveTextContent('The server is busy.'));
    });

    it('takes its labels from the props or the provider', async () => {
        const { user } = Save({ content: { confirmLabel: 'Speichern' }, providerProps: { strings: { cancel: 'Abbrechen' } } });
        await user.click(screen.getByRole('button', { name: 'Save' }));
        const popup = await screen.findByRole('alertdialog');
        expect(within(popup).getByRole('button', { name: 'Speichern' })).toBeInTheDocument();
        expect(within(popup).getByRole('button', { name: 'Abbrechen' })).toBeInTheDocument();
    });

    it('takes your own content, which names the popup, and a side', async () => {
        const { user } = renderUi(
            <ConfirmPopup>
                <ConfirmPopupTrigger asChild>
                    <Button>Regenerate</Button>
                </ConfirmPopupTrigger>
                <ConfirmPopupContent side="top" align="center">
                    <p>Regenerate the Staging key?</p>
                </ConfirmPopupContent>
            </ConfirmPopup>,
        );
        await user.click(screen.getByRole('button', { name: 'Regenerate' }));
        const popup = await screen.findByRole('alertdialog', { name: 'Regenerate the Staging key?' });
        expect(popup).toHaveAttribute('data-side', 'top');
        await expectNoAxeViolations();
    });

    it('is controlled with open and onOpenChange', async () => {
        function Controlled() {
            const [open, setOpen] = useState(true);
            return (
                <>
                    <span data-testid="state">{String(open)}</span>
                    <ConfirmPopup open={open} onOpenChange={setOpen}>
                        <ConfirmPopupTrigger asChild>
                            <Button>Resend</Button>
                        </ConfirmPopupTrigger>
                        <ConfirmPopupContent message="Resend the email?" />
                    </ConfirmPopup>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        await closed();
        expect(screen.getByTestId('state')).toHaveTextContent('false');
    });

    it('sends focus to returnFocusTo when the confirmed action removed the trigger', async () => {
        function Row() {
            const [shown, setShown] = useState(true);
            const heading = useRef(null);
            return (
                <>
                    <h2 ref={heading} tabIndex={-1}>Log</h2>
                    {shown && (
                        <ConfirmPopup tone="destructive" onConfirm={() => setShown(false)}>
                            <ConfirmPopupTrigger asChild>
                                <Button>Delete entry</Button>
                            </ConfirmPopupTrigger>
                            <ConfirmPopupContent message="Delete this entry?" returnFocusTo={heading} />
                        </ConfirmPopup>
                    )}
                </>
            );
        }
        const { user } = renderUi(<Row />);
        await user.click(screen.getByRole('button', { name: 'Delete entry' }));
        await user.click(await screen.findByRole('button', { name: 'Delete' }));
        await waitFor(() => expect(screen.getByRole('heading', { name: 'Log' })).toHaveFocus());
    });
});
