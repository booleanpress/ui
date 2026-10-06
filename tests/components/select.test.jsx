import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Category({ onValueChange, triggerProps = {}, ...props }) {
    return (
        <Select onValueChange={onValueChange} {...props}>
            <SelectTrigger aria-label="Category" clearable {...triggerProps}><SelectValue placeholder="Any category" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
        </Select>
    );
}

function Status({ onValueChange, disabled }) {
    return (
        <Select defaultValue="all" onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
        </Select>
    );
}

describe('Select', () => {
    it('opens below the field (popper), not over it', async () => {
        const { user } = renderUi(<Status />);
        screen.getByRole('combobox', { name: 'Status' }).focus();
        await user.keyboard('{Enter}');
        const listbox = await screen.findByRole('listbox');
        expect(listbox.closest('[data-radix-popper-content-wrapper]')).not.toBeNull();
        expect(listbox.closest('[data-slot=select-content]').className).toContain('data-[side=bottom]:translate-y-0.5');
        await expectNoAxeViolations();
    });

    it('chooses with the arrow keys and Enter, then closes', async () => {
        const values = [];
        const { user } = renderUi(<Status onValueChange={(v) => values.push(v)} />);
        const trigger = screen.getByRole('combobox', { name: 'Status' });
        trigger.focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}{Enter}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(values).toEqual(['delivered']);
        expect(trigger).toHaveTextContent('Delivered');
    });

    it('closes on Escape without changing the value, and returns focus to the trigger', async () => {
        const values = [];
        const { user } = renderUi(<Status onValueChange={(v) => values.push(v)} />);
        const trigger = screen.getByRole('combobox', { name: 'Status' });
        trigger.focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(values).toEqual([]);
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('opens from the trigger with Space, ArrowDown and ArrowUp', async () => {
        const { user } = renderUi(<Status />);
        const trigger = screen.getByRole('combobox', { name: 'Status' });
        for (const key of [' ', '{ArrowDown}', '{ArrowUp}']) {
            trigger.focus();
            await user.keyboard(key);
            await screen.findByRole('listbox');
            await user.keyboard('{Escape}');
            await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        }
    });

    it('chooses the focused option with Space', async () => {
        const values = [];
        const { user } = renderUi(<Status onValueChange={(v) => values.push(v)} />);
        screen.getByRole('combobox', { name: 'Status' }).focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}');
        await user.keyboard(' ');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(values).toEqual(['delivered']);
    });

    it('moves to the first and the last option with Home and End', async () => {
        const { user } = renderUi(<Status />);
        screen.getByRole('combobox', { name: 'Status' }).focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('{End}');
        await waitFor(() => expect(screen.getByRole('option', { name: 'Failed' })).toHaveFocus());
        await user.keyboard('{Home}');
        await waitFor(() => expect(screen.getByRole('option', { name: 'All' })).toHaveFocus());
    });

    it('moves to the option whose label starts with the letters typed', async () => {
        const { user } = renderUi(<Status />);
        screen.getByRole('combobox', { name: 'Status' }).focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('f');
        await waitFor(() => expect(screen.getByRole('option', { name: 'Failed' })).toHaveFocus());
    });

    it('does not open when disabled', async () => {
        const { user } = renderUi(<Status disabled />);
        const trigger = screen.getByRole('combobox', { name: 'Status' });
        expect(trigger).toBeDisabled();
        await user.click(trigger);
        expect(screen.queryByRole('listbox')).toBeNull();
        await expectNoAxeViolations();
    });

    it('sets data-size and data-variant on the trigger, from its props or the provider', async () => {
        renderUi(
            <>
                <Select><SelectTrigger aria-label="Small" size="sm"><SelectValue /></SelectTrigger></Select>
                <Select><SelectTrigger aria-label="Large" size="lg" variant="filled"><SelectValue /></SelectTrigger></Select>
                <Select><SelectTrigger aria-label="Plain"><SelectValue /></SelectTrigger></Select>
            </>,
        );
        expect(screen.getByRole('combobox', { name: 'Small' })).toHaveAttribute('data-size', 'sm');
        expect(screen.getByRole('combobox', { name: 'Large' })).toHaveAttribute('data-size', 'lg');
        expect(screen.getByRole('combobox', { name: 'Large' })).toHaveAttribute('data-variant', 'filled');
        expect(screen.getByRole('combobox', { name: 'Plain' })).toHaveAttribute('data-size', 'default');
        expect(screen.getByRole('combobox', { name: 'Plain' })).toHaveAttribute('data-variant', 'default');
        await expectNoAxeViolations();
    });

    it('takes the provider controlSize and fieldVariant when given none', () => {
        renderUi(
            <Select><SelectTrigger aria-label="Region"><SelectValue /></SelectTrigger></Select>,
            { controlSize: 'lg', fieldVariant: 'filled' },
        );
        const trigger = screen.getByRole('combobox', { name: 'Region' });
        expect(trigger).toHaveAttribute('data-size', 'lg');
        expect(trigger).toHaveAttribute('data-variant', 'filled');
    });

    it('keeps an empty value line one line tall when there is no value and no placeholder', () => {
        renderUi(
            <Select>
                <SelectTrigger aria-label="Mailer"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                </SelectContent>
            </Select>,
        );
        const trigger = screen.getByRole('combobox', { name: 'Mailer' });
        const value = trigger.querySelector('[data-slot=select-value]');
        // jsdom has no layout: the rule is checked here, the 35px height in the browser.
        expect(value).toBeEmptyDOMElement();
        expect(value.parentElement).toBe(trigger);
        expect(trigger.className).toContain('*:data-[slot=select-value]:min-h-lh');
    });

    it('fills its container with fluid', () => {
        renderUi(<Select><SelectTrigger aria-label="Zone" fluid><SelectValue /></SelectTrigger></Select>);
        expect(screen.getByRole('combobox', { name: 'Zone' }).className).toContain('w-full');
    });

    it('shows no clear button while nothing is chosen', async () => {
        renderUi(<Category />);
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
        expect(screen.getByRole('combobox', { name: 'Category' })).toHaveTextContent('Any category');
        await expectNoAxeViolations();
    });

    it('clear (uncontrolled): resets to the placeholder, reports "" and keeps focus on the field', async () => {
        const values = [];
        const { user } = renderUi(<Category defaultValue="delivery" onValueChange={(v) => values.push(v)} />);
        const trigger = screen.getByRole('combobox', { name: 'Category' });
        expect(trigger).toHaveTextContent('Delivery');
        await expectNoAxeViolations();
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(values).toEqual(['']);
        expect(trigger).toHaveTextContent('Any category');
        expect(trigger).toHaveAttribute('data-placeholder');
        expect(trigger).toHaveFocus();
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    });

    it('clear (controlled): the app state becomes "" and a new choice still works', async () => {
        function Controlled() {
            const [value, setValue] = useState('billing');
            return (
                <>
                    <Category value={value} onValueChange={setValue} />
                    <p>Category: {value || 'none'}</p>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(screen.getByText('Category: none')).toBeInTheDocument();
        const trigger = screen.getByRole('combobox', { name: 'Category' });
        expect(trigger).toHaveTextContent('Any category');
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}{Enter}');
        await waitFor(() => expect(screen.getByText('Category: delivery')).toBeInTheDocument());
    });

    it('reaches the clear button with Tab and clears with Enter, returning focus to the trigger', async () => {
        const { user } = renderUi(<Category defaultValue="billing" />);
        await user.tab();
        expect(screen.getByRole('combobox', { name: 'Category' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Clear' })).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('combobox', { name: 'Category' })).toHaveFocus();
        expect(screen.getByRole('combobox', { name: 'Category' })).toHaveTextContent('Any category');
    });

    it('clears with Space on the clear button', async () => {
        const { user } = renderUi(<Category defaultValue="billing" />);
        screen.getByRole('button', { name: 'Clear' }).focus();
        await user.keyboard(' ');
        expect(screen.getByRole('combobox', { name: 'Category' })).toHaveTextContent('Any category');
    });

    it('names the clear button from the provider string', () => {
        renderUi(<Category defaultValue="billing" />, { strings: { clear: 'Effacer' } });
        expect(screen.getByRole('button', { name: 'Effacer' })).toBeInTheDocument();
    });

    it('hides the clear button while the select is disabled', () => {
        renderUi(<Category defaultValue="billing" disabled />);
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    });

    it('in a form: submits nothing chosen as "", is invalid while required, and submits the choice', async () => {
        const { user } = renderUi(
            <form aria-label="Ticket">
                <Category name="category" required />
            </form>,
        );
        const form = screen.getByRole('form');
        expect(new FormData(form).get('category')).toBe('');
        expect(form.checkValidity()).toBe(false);
        screen.getByRole('combobox', { name: 'Category' }).focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}{Enter}');
        await waitFor(() => expect(new FormData(form).get('category')).toBe('delivery'));
        expect(form.checkValidity()).toBe(true);
    });

    it('in a form: a cleared value submits "" and blocks a required form again', async () => {
        const { user } = renderUi(
            <form aria-label="Ticket">
                <Category name="category" required defaultValue="billing" />
            </form>,
        );
        const form = screen.getByRole('form');
        expect(new FormData(form).get('category')).toBe('billing');
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(new FormData(form).get('category')).toBe('');
        expect(form.checkValidity()).toBe(false);
    });

    it('in a form: a reset brings back the first value, after a clear too', async () => {
        const values = [];
        const { user } = renderUi(
            <form aria-label="Ticket">
                <Category name="category" defaultValue="billing" onValueChange={(v) => values.push(v)} />
                <button type="reset">Reset</button>
            </form>,
        );
        const trigger = screen.getByRole('combobox', { name: 'Category' });
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(trigger).toHaveTextContent('Any category');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        await waitFor(() => expect(trigger).toHaveTextContent('Billing'));
        expect(new FormData(screen.getByRole('form')).get('category')).toBe('billing');
        expect(values).toEqual(['', 'billing']);
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    it('shows an item icon and description in the list, and only the label in the trigger', async () => {
        const { user } = renderUi(
            <Select defaultValue="sc">
                <SelectTrigger aria-label="Assignee"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="sc" icon={<span data-testid="avatar">SC</span>} description="Support lead">Sara Chowdhury</SelectItem>
                    <SelectItem value="ar" description="Billing specialist">Arif Rahman</SelectItem>
                </SelectContent>
            </Select>,
        );
        const trigger = screen.getByRole('combobox', { name: 'Assignee' });
        expect(trigger).toHaveTextContent('Sara Chowdhury');
        expect(trigger).not.toHaveTextContent('Support lead');
        trigger.focus();
        await user.keyboard('{Enter}');
        const option = await screen.findByRole('option', { name: /Sara Chowdhury/ });
        expect(option).toHaveTextContent('Support lead');
        expect(option.querySelector('[data-slot=select-item-description]')).toHaveTextContent('Support lead');
        expect(screen.getByTestId('avatar').closest('[data-slot=select-item-icon]')).not.toBeNull();
        await expectNoAxeViolations();
    });
});
