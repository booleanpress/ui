import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { TagsInput } from '@/components/tags-input';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/sheet';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Recipients(props) {
    return (
        <>
            <label htmlFor="recipients">Recipients</label>
            <TagsInput id="recipients" placeholder="Add an address" {...props} />
        </>
    );
}

// With suggestions the input is a combobox; without, a plain text box.
const input = () => screen.queryByRole('textbox', { name: 'Recipients' }) ?? screen.getByRole('combobox', { name: 'Recipients' });
const tagLabels = () => Array.from(document.querySelectorAll('[data-slot=chip-label]')).map((el) => el.textContent);

describe('TagsInput', () => {
    it('adds the typed text as a tag on Enter and empties the input', async () => {
        const values = [];
        const { user } = renderUi(<Recipients onValueChange={(v) => values.push(v)} />);
        await user.click(input());
        await user.keyboard('ops@example.com{Enter}');
        expect(values.at(-1)).toEqual(['ops@example.com']);
        expect(tagLabels()).toEqual(['ops@example.com']);
        expect(input()).toHaveValue('');
        expect(input()).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('ignores Enter with only spaces typed', async () => {
        const values = [];
        const { user } = renderUi(<Recipients onValueChange={(v) => values.push(v)} />);
        await user.click(input());
        await user.keyboard('   {Enter}');
        expect(values).toEqual([]);
    });

    it('adds on a delimiter as well as Enter, and splits pasted text', async () => {
        const { user } = renderUi(<Recipients delimiter="," />);
        await user.click(input());
        await user.keyboard('billing,support{Enter}');
        expect(tagLabels()).toEqual(['billing', 'support']);
        expect(input()).toHaveValue('');
        await user.paste('alerts, ops ,news');
        expect(tagLabels()).toEqual(['billing', 'support', 'alerts', 'ops', 'news']);
    });

    it('does not add a tag already in the field, unless allowDuplicates', async () => {
        const { user } = renderUi(
            <>
                <Recipients defaultValue={['billing']} />
                <TagsInput aria-label="Labels" defaultValue={['billing']} allowDuplicates />
            </>,
        );
        await user.click(input());
        await user.keyboard('billing{Enter}');
        expect(tagLabels().filter((t) => t === 'billing')).toHaveLength(2);
        expect(input()).toHaveValue('billing');
        await user.click(screen.getByRole('textbox', { name: 'Labels' }));
        await user.keyboard('billing{Enter}');
        expect(tagLabels().filter((t) => t === 'billing')).toHaveLength(3);
    });

    it('stops at max: the input stops taking text', async () => {
        const { user } = renderUi(<Recipients max={2} defaultValue={['a@example.com']} />);
        await user.click(input());
        await user.keyboard('b@example.com{Enter}');
        expect(tagLabels()).toHaveLength(2);
        expect(input()).toHaveAttribute('readonly');
        await user.keyboard('c@example.com{Enter}');
        expect(tagLabels()).toHaveLength(2);
    });

    it('removes the last tag with Backspace in the empty input', async () => {
        const values = [];
        const { user } = renderUi(<Recipients defaultValue={['billing', 'support']} onValueChange={(v) => values.push(v)} />);
        await user.click(input());
        await user.keyboard('{Backspace}');
        expect(values.at(-1)).toEqual(['billing']);
        expect(input()).toHaveFocus();
    });

    it('removes a tag with its remove button, named from the provider, and keeps focus in the field', async () => {
        const { user } = renderUi(<Recipients defaultValue={['billing', 'support']} />, { strings: { removeItem: 'Retirer {label}' } });
        await user.click(screen.getByRole('button', { name: 'Retirer billing' }));
        expect(tagLabels()).toEqual(['support']);
        expect(screen.getByRole('button', { name: 'Retirer support' })).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(tagLabels()).toEqual([]);
        await waitFor(() => expect(input()).toHaveFocus());
        await expectNoAxeViolations();
    });

    it('removes a focused tag with Backspace or Delete on its remove button', async () => {
        const { user } = renderUi(<Recipients defaultValue={['billing', 'support', 'alerts']} />);
        screen.getByRole('button', { name: 'Remove support' }).focus();
        await user.keyboard('{Delete}');
        expect(tagLabels()).toEqual(['billing', 'alerts']);
        await user.keyboard('{Backspace}');
        expect(tagLabels()).toEqual(['billing']);
    });

    it('reaches the tags with Shift+Tab from the input', async () => {
        const { user } = renderUi(<Recipients defaultValue={['billing']} />);
        await user.click(input());
        await user.tab({ shift: true });
        expect(screen.getByRole('button', { name: 'Remove billing' })).toHaveFocus();
    });

    it('shows tagIcon before each label', () => {
        renderUi(<Recipients defaultValue={['billing']} tagIcon={(tag) => <span data-testid={`icon-${tag}`} />} />);
        expect(screen.getByTestId('icon-billing').closest('[data-slot=chip-icon]')).not.toBeNull();
    });

    it('controlled: the app state follows', async () => {
        function Controlled() {
            const [tags, setTags] = useState(['billing']);
            return (
                <>
                    <Recipients value={tags} onValueChange={setTags} />
                    <p>Tags: {tags.join('|')}</p>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(input());
        await user.keyboard('refund{Enter}');
        expect(screen.getByText('Tags: billing|refund')).toBeInTheDocument();
    });

    it('submits each tag under name', () => {
        renderUi(<Recipients name="to" defaultValue={['a@example.com', 'b@example.com']} />);
        expect(Array.from(document.querySelectorAll('input[type=hidden][name=to]')).map((el) => el.value)).toEqual(['a@example.com', 'b@example.com']);
    });

    it('readOnly: no remove buttons, Backspace and typing change nothing, and the tags still submit', async () => {
        const values = [];
        const { user } = renderUi(<Recipients name="to" readOnly defaultValue={['a@example.com']} onValueChange={(v) => values.push(v)} />);
        expect(screen.queryByRole('button', { name: 'Remove a@example.com' })).toBeNull();
        await user.click(input());
        await user.keyboard('b@example.com{Enter}{Backspace}');
        expect(values).toEqual([]);
        expect(tagLabels()).toEqual(['a@example.com']);
        expect(document.querySelector('input[type=hidden][name=to]')).not.toBeDisabled();
        await expectNoAxeViolations();
    });

    it('a form reset puts the tags it started with back and empties the input', async () => {
        const { user } = renderUi(
            <form aria-label="Alerts">
                <Recipients name="to" defaultValue={['ops@example.com']} />
            </form>,
        );
        await user.click(input());
        await user.keyboard('finance@example.com{Enter}draft');
        expect(tagLabels()).toEqual(['ops@example.com', 'finance@example.com']);
        act(() => screen.getByRole('form', { name: 'Alerts' }).reset());
        await waitFor(() => expect(tagLabels()).toEqual(['ops@example.com']));
        expect(input()).toHaveValue('');
    });

    it('a disabled field submits no tags, as a disabled input', () => {
        renderUi(<Recipients name="to" disabled defaultValue={['a@example.com']} />);
        const hidden = document.querySelector('input[type=hidden][name=to]');
        expect(hidden).toBeDisabled();
    });

    it('required asks for one tag: the form is invalid while there is none, valid once one is in', async () => {
        const { user } = renderUi(
            <form aria-label="Alerts">
                <Recipients name="to" required />
            </form>,
        );
        const form = screen.getByRole('form', { name: 'Alerts' });
        expect(form.checkValidity()).toBe(false);
        await user.click(input());
        await user.keyboard('ops@example.com{Enter}');
        expect(input()).toHaveValue('');
        expect(form.checkValidity()).toBe(true);
        expect([...new FormData(form).getAll('to')]).toEqual(['ops@example.com']);
    });

    it('splits pasted text with the typed text round the cursor', async () => {
        const { user } = renderUi(<Recipients delimiter="," />);
        await user.click(input());
        await user.keyboard('news');
        input().setSelectionRange(0, 0);
        await user.paste('alerts,ops,');
        expect(tagLabels()).toEqual(['alerts', 'ops', 'news']);
        expect(input()).toHaveValue('');
    });

    it('full, with suggestions: the input stays focusable and Backspace still removes the last tag', async () => {
        const { user } = renderUi(<Recipients suggestions={['billing', 'bounce']} max={2} defaultValue={['refund', 'dns']} />);
        expect(input()).not.toBeDisabled();
        expect(input()).toHaveAttribute('readonly');
        await user.click(input());
        expect(input()).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(screen.queryByRole('option')).toBeNull();
        await user.keyboard('{Backspace}');
        expect(tagLabels()).toEqual(['refund']);
        expect(input()).not.toHaveAttribute('readonly');
    });

    it('typeahead: suggestions filter as you type, and picking one adds it', async () => {
        const { user } = renderUi(<Recipients suggestions={['billing', 'bounce', 'refund']} defaultValue={['refund']} />);
        await user.click(input());
        await user.keyboard('b');
        await screen.findByRole('listbox');
        expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['billing', 'bounce']);
        await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowUp}');
        expect(document.querySelector('[data-slot=tags-input-suggestion][data-highlighted]')).toHaveTextContent('bounce');
        await user.keyboard('{Enter}');
        expect(tagLabels()).toEqual(['refund', 'bounce']);
        expect(input()).toHaveValue('');
        await user.keyboard('custom{Enter}');
        expect(tagLabels()).toEqual(['refund', 'bounce', 'custom']);
    });

    it('typeahead: the input keeps the name of its label while the list is open, when Base UI hides the label', async () => {
        const { user } = renderUi(<Recipients suggestions={['billing', 'bounce']} />);
        await user.click(input());
        await user.keyboard('b');
        await screen.findByRole('listbox');
        await waitFor(() => expect(screen.getByText('Recipients', { selector: 'label' })).toHaveAttribute('aria-hidden', 'true'));
        expect(screen.getByRole('combobox', { name: 'Recipients' })).toHaveAttribute('aria-label', 'Recipients');
        await expectNoAxeViolations();
    });

    it('typeahead: a click on a suggestion adds it', async () => {
        const { user } = renderUi(<Recipients suggestions={['billing', 'bounce']} />);
        await user.click(input());
        await user.keyboard('bi');
        await user.click(await screen.findByRole('option', { name: 'billing' }));
        expect(tagLabels()).toEqual(['billing']);
        await expectNoAxeViolations();
    });

    it('sets data-size and data-variant, from its props or the provider', async () => {
        renderUi(
            <>
                <TagsInput aria-label="Small" size="sm" variant="filled" />
                <TagsInput aria-label="Plain" />
            </>,
            { controlSize: 'lg' },
        );
        const small = screen.getByRole('textbox', { name: 'Small' }).closest('[data-slot=tags-input]');
        expect(small).toHaveAttribute('data-size', 'sm');
        expect(small).toHaveAttribute('data-variant', 'filled');
        expect(screen.getByRole('textbox', { name: 'Plain' }).closest('[data-slot=tags-input]')).toHaveAttribute('data-size', 'lg');
        await expectNoAxeViolations();
    });

    it('is disabled: no typing, and the tags show without remove buttons', async () => {
        renderUi(<Recipients disabled defaultValue={['billing']} />);
        expect(input()).toBeDisabled();
        expect(tagLabels()).toEqual(['billing']);
        expect(screen.queryByRole('button', { name: 'Remove billing' })).toBeNull();
        await expectNoAxeViolations();
    });

    it('passes aria-invalid to the input', async () => {
        renderUi(<Recipients aria-invalid />);
        expect(input()).toHaveAttribute('aria-invalid', 'true');
        await expectNoAxeViolations();
    });

    it('in a dialog: a suggestion picked with the mouse is added and the dialog stays open; Escape closes the list first', async () => {
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Tag the ticket</DialogTitle>
                    <DialogDescription>Add tags.</DialogDescription>
                    <Recipients suggestions={['billing', 'bounce']} />
                </DialogContent>
            </Dialog>,
        );
        await user.click(input());
        await user.keyboard('b');
        const option = await screen.findByRole('option', { name: 'bounce' });
        expect(document.body.style.pointerEvents).toBe('none');
        await user.click(option);
        expect(tagLabels()).toEqual(['bounce']);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await user.keyboard('b');
        await screen.findByRole('listbox');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('in a sheet: a suggestion picked with the mouse is added and the sheet stays open', async () => {
        const { user } = renderUi(
            <Sheet defaultOpen>
                <SheetContent>
                    <SheetTitle>Tag the ticket</SheetTitle>
                    <SheetDescription>Add tags.</SheetDescription>
                    <Recipients suggestions={['billing', 'bounce']} />
                </SheetContent>
            </Sheet>,
        );
        await user.click(input());
        await user.keyboard('bi');
        await user.click(await screen.findByRole('option', { name: 'billing' }));
        expect(tagLabels()).toEqual(['billing']);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});
