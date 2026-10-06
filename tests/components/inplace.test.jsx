import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { Inplace } from '@/components/inplace';
import { Button } from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

const display = (name = 'Primary SMTP') => screen.getByRole('button', { name });

describe('Inplace', () => {
    it('shows the value as a button described as “Edit {label}”', async () => {
        renderUi(<Inplace label="Mailer name" defaultValue="Primary SMTP" />);
        expect(display()).toHaveAccessibleDescription('Edit Mailer name');
        expect(display()).toHaveAttribute('data-size', 'default');
        await expectNoAxeViolations();
    });

    it('opens the field on click, focused and with its text selected', async () => {
        const { user } = renderUi(<Inplace label="Mailer name" defaultValue="Primary SMTP" />);
        await user.click(display());
        const field = screen.getByRole('textbox', { name: 'Mailer name' });
        expect(field).toHaveValue('Primary SMTP');
        await waitFor(() => expect(field).toHaveFocus());
        expect(field.selectionStart).toBe(0);
        expect(field.selectionEnd).toBe('Primary SMTP'.length);
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('opens the field with Enter and with Space on the value', async () => {
        const { user } = renderUi(<Inplace label="Mailer name" defaultValue="Primary SMTP" />);
        display().focus();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        display().focus();
        await user.keyboard(' ');
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('saves with Enter and returns focus to the value', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Inplace label="Mailer name" defaultValue="Primary SMTP" onValueChange={onValueChange} />);
        await user.click(display());
        await user.keyboard('Backup SMTP{Enter}');
        expect(onValueChange).toHaveBeenCalledWith('Backup SMTP');
        await waitFor(() => expect(display('Backup SMTP')).toHaveFocus());
    });

    it('puts the value back with Escape and returns focus to the value', async () => {
        const onSave = vi.fn();
        const { user } = renderUi(<Inplace label="Mailer name" defaultValue="Primary SMTP" onSave={onSave} />);
        await user.click(display());
        await user.keyboard('Something else{Escape}');
        expect(onSave).not.toHaveBeenCalled();
        await waitFor(() => expect(display()).toHaveFocus());
    });

    it('saves when focus leaves it, without pulling focus back', async () => {
        const onSave = vi.fn();
        const { user } = renderUi(
            <>
                <Inplace label="Mailer name" defaultValue="Primary SMTP" onSave={onSave} />
                <Button>Elsewhere</Button>
            </>,
        );
        await user.click(display());
        await user.keyboard('Backup SMTP');
        await user.click(screen.getByRole('button', { name: 'Elsewhere' }));
        expect(onSave).toHaveBeenCalledWith('Backup SMTP');
        expect(display('Backup SMTP')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus();
    });

    it('moves to the ✓ and × with Tab without saving, and saves once focus leaves them', async () => {
        const onSave = vi.fn();
        const { user } = renderUi(
            <>
                <Inplace label="Mailer name" defaultValue="Primary SMTP" onSave={onSave} />
                <Button>Elsewhere</Button>
            </>,
        );
        await user.click(display());
        await user.keyboard('Backup');
        await user.tab();
        expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
        expect(onSave).not.toHaveBeenCalled();
        await user.tab();
        expect(onSave).toHaveBeenCalledWith('Backup');
    });

    it('saves with the ✓ and cancels with the ×', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Inplace label="Mailer name" defaultValue="Primary SMTP" onValueChange={onValueChange} />);
        await user.click(display());
        await user.keyboard('Backup');
        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onValueChange).not.toHaveBeenCalled();
        await user.click(display());
        await user.keyboard('Backup');
        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(onValueChange).toHaveBeenCalledWith('Backup');
        await waitFor(() => expect(display('Backup')).toHaveFocus());
    });

    it('makes a new line with Enter in a multi-line field and saves with Ctrl+Enter', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Inplace label="Footer" defaultValue="Thanks" multiline onValueChange={onValueChange} />);
        await user.click(display('Thanks'));
        const field = screen.getByRole('textbox', { name: 'Footer' });
        expect(field.tagName).toBe('TEXTAREA');
        await user.keyboard('{End}{Enter}Ana');
        expect(field).toHaveValue('Thanks\nAna');
        expect(onValueChange).not.toHaveBeenCalled();
        await user.keyboard('{Control>}{Enter}{/Control}');
        expect(onValueChange).toHaveBeenCalledWith('Thanks\nAna');
    });

    it('shows a spinner while an async save runs, then closes', async () => {
        const save = deferred();
        const { user } = renderUi(<Inplace label="Subject" defaultValue="October invoice" onSave={() => save.promise} />);
        await user.click(display('October invoice'));
        await user.keyboard('November invoice{Enter}');
        const field = screen.getByRole('textbox', { name: 'Subject' });
        expect(field).toHaveAttribute('aria-busy', 'true');
        expect(field).toHaveAttribute('readonly');
        expect(within(screen.getByRole('button', { name: 'Save' })).getByRole('status', { name: 'Saving…' })).toBeInTheDocument();
        await expectNoAxeViolations();
        save.resolve();
        await waitFor(() => expect(display('November invoice')).toHaveFocus());
    });

    it('keeps the field open with the error when an async save fails', async () => {
        const { user } = renderUi(
            <Inplace label="Subject" defaultValue="October invoice" onSave={() => Promise.reject(new Error('Refused by the spam filter.'))} />,
        );
        await user.click(display('October invoice'));
        await user.keyboard('Free invoice{Enter}');
        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent('Refused by the spam filter.');
        const field = screen.getByRole('textbox', { name: 'Subject' });
        expect(field).toHaveAttribute('aria-invalid', 'true');
        expect(field).toHaveAccessibleDescription('Refused by the spam filter.');
        expect(field).toHaveValue('Free invoice');
        expect(field).not.toHaveAttribute('readonly');
        expect(field).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('waits for a pending save on Escape and the ×, then closes when it succeeds', async () => {
        const save = deferred();
        const onOpenChange = vi.fn();
        const { user } = renderUi(
            <Inplace label="Subject" defaultValue="October invoice" onSave={() => save.promise} onOpenChange={onOpenChange} />,
        );
        await user.click(display('October invoice'));
        await user.keyboard('November invoice{Enter}');
        await user.keyboard('{Escape}');
        const cancel = screen.getByRole('button', { name: 'Cancel' });
        expect(cancel).toHaveAttribute('aria-disabled', 'true');
        await user.click(cancel);
        expect(screen.getByRole('textbox', { name: 'Subject' })).toHaveValue('November invoice');
        expect(onOpenChange).toHaveBeenCalledTimes(1);
        save.resolve();
        await waitFor(() => expect(display('November invoice')).toHaveFocus());
        expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it('ignores a save that settles after the inplace left the page', async () => {
        const save = deferred();
        const onValueChange = vi.fn();
        const onOpenChange = vi.fn();
        const { user, unmount } = renderUi(
            <Inplace
                label="Subject"
                defaultValue="October invoice"
                onSave={() => save.promise}
                onValueChange={onValueChange}
                onOpenChange={onOpenChange}
            />,
        );
        await user.click(display('October invoice'));
        await user.keyboard('November invoice{Enter}');
        onOpenChange.mockClear();
        unmount();
        save.resolve();
        await save.promise;
        await Promise.resolve();
        expect(onValueChange).not.toHaveBeenCalled();
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('does not close a field opened again when an earlier save settles', async () => {
        const save = deferred();
        const onValueChange = vi.fn();
        function Controlled() {
            const [open, setOpen] = useState(false);
            return (
                <>
                    <Inplace
                        label="Subject"
                        defaultValue="October invoice"
                        open={open}
                        onOpenChange={setOpen}
                        onSave={() => save.promise}
                        onValueChange={onValueChange}
                    />
                    <Button onClick={() => setOpen(!open)}>Toggle</Button>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Toggle' }));
        await waitFor(() => expect(screen.getByRole('textbox', { name: 'Subject' })).toHaveFocus());
        await user.keyboard('November invoice{Enter}');
        // Closed from outside while it saves, then opened again.
        await user.click(screen.getByRole('button', { name: 'Toggle' }));
        await user.click(screen.getByRole('button', { name: 'Toggle' }));
        const field = screen.getByRole('textbox', { name: 'Subject' });
        expect(field).not.toHaveAttribute('aria-busy');
        save.resolve();
        await waitFor(() => expect(onValueChange).toHaveBeenCalledWith('November invoice'));
        expect(screen.getByRole('textbox', { name: 'Subject' })).toBeInTheDocument();
    });

    it('cancels with Escape inside a dialog and keeps the dialog open', async () => {
        const onSave = vi.fn();
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Mailer</DialogTitle>
                    <DialogDescription>Rename the mailer.</DialogDescription>
                    <Inplace label="Mailer name" defaultValue="Primary SMTP" onSave={onSave} />
                </DialogContent>
            </Dialog>,
        );
        await user.click(display());
        await user.keyboard('Backup SMTP{Escape}');
        expect(onSave).not.toHaveBeenCalled();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await waitFor(() => expect(display()).toHaveFocus());
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('keeps Enter, Escape and blur working when given its own onKeyDown and onBlur', async () => {
        const onKeyDown = vi.fn();
        const onBlur = vi.fn();
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <>
                <Inplace label="Mailer name" defaultValue="Primary SMTP" onKeyDown={onKeyDown} onBlur={onBlur} onValueChange={onValueChange} />
                <Button>Elsewhere</Button>
            </>,
        );
        await user.click(display());
        await user.keyboard('Backup{Enter}');
        expect(onValueChange).toHaveBeenLastCalledWith('Backup');
        expect(onKeyDown).toHaveBeenCalled();
        await user.click(display('Backup'));
        await user.keyboard('Relay');
        await user.click(screen.getByRole('button', { name: 'Elsewhere' }));
        expect(onValueChange).toHaveBeenLastCalledWith('Relay');
        expect(onBlur).toHaveBeenCalled();
    });

    it('keeps the line breaks of a multi-line value when it is shown', () => {
        renderUi(<Inplace label="Footer" defaultValue={'Thanks\nAna'} multiline />);
        expect(document.querySelector('[data-slot=inplace-display]').className).toContain('whitespace-pre-line');
    });

    it('says the provider’s saveFailed when the error has no message', async () => {
        const { user } = renderUi(<Inplace label="Subject" defaultValue="A" onSave={() => Promise.reject('no')} />, {
            strings: { saveFailed: 'Nicht gespeichert.' },
        });
        await user.click(display('A'));
        await user.keyboard('B{Enter}');
        expect(await screen.findByRole('alert')).toHaveTextContent('Nicht gespeichert.');
    });

    it('cannot be opened when disabled', async () => {
        const { user } = renderUi(<Inplace label="Domain" defaultValue="mail.example.com" disabled />);
        const button = display('mail.example.com');
        expect(button).toBeDisabled();
        await user.click(button);
        expect(screen.queryByRole('textbox')).toBeNull();
        await expectNoAxeViolations();
    });

    it('is controlled with value and open', async () => {
        function Controlled() {
            const [name, setName] = useState('Ana Ruiz');
            const [open, setOpen] = useState(false);
            return (
                <>
                    <Inplace label="Customer" value={name} onValueChange={setName} open={open} onOpenChange={setOpen} />
                    <Button onClick={() => setOpen(true)}>Edit name</Button>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Edit name' }));
        const field = screen.getByRole('textbox', { name: 'Customer' });
        await waitFor(() => expect(field).toHaveFocus());
        await user.keyboard('Li Wei{Enter}');
        expect(display('Li Wei')).toBeInTheDocument();
    });

    it('shows the placeholder for an empty value, and reaches data-size from its prop or the provider', () => {
        const { unmount } = renderUi(<Inplace label="Reply-to" placeholder="Add an address" size="sm" />);
        expect(display('Add an address')).toHaveAttribute('data-size', 'sm');
        unmount();
        renderUi(<Inplace label="Reply-to" defaultValue="a@example.com" />, { controlSize: 'lg' });
        expect(display('a@example.com')).toHaveAttribute('data-size', 'lg');
    });

    it('takes its strings from the provider', async () => {
        const { user } = renderUi(<Inplace label="Name" defaultValue="Ana" />, {
            strings: { edit: '{label} bearbeiten', save: 'Speichern', cancel: 'Abbrechen' },
        });
        expect(display('Ana')).toHaveAccessibleDescription('Name bearbeiten');
        await user.click(display('Ana'));
        expect(screen.getByRole('button', { name: 'Speichern' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Abbrechen' })).toBeInTheDocument();
    });

    it('renders a custom display and editor', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <Inplace
                label="Status"
                defaultValue="active"
                showButtons={false}
                onValueChange={onValueChange}
                renderDisplay={(value) => <span data-testid="badge">{value.toUpperCase()}</span>}
                renderEditor={({ value, onValueChange: change, fieldProps }) => (
                    <select {...fieldProps} value={value} onChange={(event) => change(event.target.value)}>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                    </select>
                )}
            />,
        );
        expect(screen.getByTestId('badge')).toHaveTextContent('ACTIVE');
        await user.click(display('ACTIVE'));
        const select = screen.getByRole('combobox', { name: 'Status' });
        await waitFor(() => expect(select).toHaveFocus());
        await user.selectOptions(select, 'paused');
        await user.keyboard('{Enter}');
        expect(onValueChange).toHaveBeenCalledWith('paused');
    });
});
