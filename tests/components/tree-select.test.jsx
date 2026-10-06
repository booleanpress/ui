import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { TreeSelect } from '@/components/tree-select';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const CATEGORIES = [
    { id: 'billing', label: 'Billing', children: [{ id: 'invoices', label: 'Invoices' }, { id: 'refunds', label: 'Refunds' }] },
    { id: 'delivery', label: 'Email delivery', children: [{ id: 'smtp', label: 'SMTP errors' }, { id: 'bounces', label: 'Bounces' }] },
    { id: 'account', label: 'Account' },
];

function Category(props) {
    return (
        <>
            <label htmlFor="category">Category</label>
            <TreeSelect id="category" nodes={CATEGORIES} placeholder="Choose a category" {...props} />
        </>
    );
}

const field = () => screen.getByRole('combobox', { name: 'Category' });
const option = (name) => screen.getByRole('treeitem', { name: new RegExp(`^${name}`) });

describe('TreeSelect', () => {
    it('is a named combobox showing its placeholder until a node is chosen', async () => {
        renderUi(
            <>
                <Category />
                <TreeSelect aria-label="Filtered" nodes={CATEGORIES} filter />
            </>
        );
        expect(field()).toHaveAttribute('aria-haspopup', 'tree');
        expect(screen.getByRole('combobox', { name: 'Filtered' })).toHaveAttribute('aria-haspopup', 'dialog');
        expect(field()).toHaveAttribute('aria-expanded', 'false');
        expect(field()).toHaveTextContent('Choose a category');
        expect(field()).toHaveAttribute('data-placeholder');
        await expectNoAxeViolations();
    });

    it('opens on a click, moves the focus into the tree, and chooses a node with Enter, closing the list', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Category onValueChange={onValueChange} />);
        await user.click(field());
        const tree = await screen.findByRole('tree', { name: 'Category' });
        expect(field()).toHaveAttribute('aria-expanded', 'true');
        expect(field()).toHaveAttribute('aria-controls', tree.closest('[data-slot=tree-select-content]').id);
        await waitFor(() => expect(option('Billing')).toHaveFocus());
        await expectNoAxeViolations();
        await user.keyboard('{ArrowRight}{ArrowDown}{ArrowDown}{Enter}');
        expect(onValueChange).toHaveBeenLastCalledWith(['refunds']);
        await waitFor(() => expect(screen.queryByRole('tree')).toBeNull());
        expect(field()).toHaveTextContent('Refunds');
        await waitFor(() => expect(field()).toHaveFocus());
    });

    it('opens with Down Arrow and closes with Escape without changing the value', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Category defaultValue={['bounces']} onValueChange={onValueChange} />);
        field().focus();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('tree');
        // The chosen node's branch opens with the list, and the chosen node takes the focus.
        expect(option('Email delivery')).toHaveAttribute('aria-expanded', 'true');
        await waitFor(() => expect(option('Bounces')).toHaveFocus());
        await user.keyboard('{ArrowUp}{Escape}');
        await waitFor(() => expect(screen.queryByRole('tree')).toBeNull());
        expect(onValueChange).not.toHaveBeenCalled();
        expect(field()).toHaveTextContent('Bounces');
        await waitFor(() => expect(field()).toHaveFocus());
    });

    it('opens from the field with Enter, Space and Up Arrow', async () => {
        const { user } = renderUi(<Category />);
        for (const key of ['{Enter}', ' ', '{ArrowUp}']) {
            field().focus();
            await user.keyboard(key);
            await screen.findByRole('tree');
            await user.keyboard('{Escape}');
            await waitFor(() => expect(screen.queryByRole('tree')).toBeNull());
        }
    });

    it('chooses with Space, and opens and closes nodes with Right and Left Arrow in the list', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Category onValueChange={onValueChange} />);
        await user.click(field());
        await waitFor(() => expect(option('Billing')).toHaveFocus());
        await user.keyboard('{ArrowRight}');
        expect(option('Billing')).toHaveAttribute('aria-expanded', 'true');
        await user.keyboard('{ArrowRight}');
        expect(option('Invoices')).toHaveFocus();
        await user.keyboard('{ArrowLeft}');
        expect(option('Billing')).toHaveFocus();
        await user.keyboard('{ArrowLeft}');
        expect(option('Billing')).toHaveAttribute('aria-expanded', 'false');
        await user.keyboard('{ArrowDown} ');
        expect(onValueChange).toHaveBeenLastCalledWith(['delivery']);
        await waitFor(() => expect(screen.queryByRole('tree')).toBeNull());
    });

    it('closes when Tab leaves the list, the focus back on the field', async () => {
        const { user } = renderUi(<Category />);
        await user.click(field());
        await waitFor(() => expect(option('Billing')).toHaveFocus());
        await user.keyboard('{Tab}');
        await waitFor(() => expect(screen.queryByRole('tree')).toBeNull());
        await waitFor(() => expect(field()).toHaveFocus());
    });

    it('chooses a node with a click, a parent included', async () => {
        const { user } = renderUi(<Category />);
        await user.click(field());
        await user.click(await screen.findByText('Email delivery'));
        await waitFor(() => expect(screen.queryByRole('tree')).toBeNull());
        expect(field()).toHaveTextContent('Email delivery');
    });

    it('empties the field with the clear button, named by the provider, and refocuses it', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Category defaultValue={['refunds']} clearable onValueChange={onValueChange} />, {
            strings: { clear: 'Leeren' },
        });
        await user.click(screen.getByRole('button', { name: 'Leeren' }));
        expect(onValueChange).toHaveBeenLastCalledWith([]);
        expect(field()).toHaveTextContent('Choose a category');
        expect(field()).toHaveFocus();
        expect(screen.queryByRole('button', { name: 'Leeren' })).toBeNull();
        await expectNoAxeViolations();
    });

    it('keeps the list open in multiple selection and lists the labels, then the count past the limit', async () => {
        const { user } = renderUi(<Category selectionMode="multiple" maxSelectedLabels={2} defaultExpanded={['billing']} />, {
            strings: { selectedCount: '{count} gewählt' },
        });
        await user.click(field());
        expect(await screen.findByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
        await user.click(screen.getByText('Invoices'));
        await user.click(screen.getByText('Refunds'));
        expect(screen.getByRole('tree')).toBeInTheDocument();
        expect(field()).toHaveTextContent('Invoices, Refunds');
        await user.click(screen.getByText('Account'));
        expect(field()).toHaveTextContent('3 gewählt');
        await expectNoAxeViolations();
    });

    it('shows chips, with a last chip counting the rest past the limit', async () => {
        renderUi(<Category selectionMode="multiple" display="chip" maxSelectedLabels={2} defaultValue={['invoices', 'refunds', 'smtp']} />);
        const chips = document.querySelectorAll('[data-slot=tree-select-chip]');
        expect([...chips].map((chip) => chip.textContent)).toEqual(['Invoices', 'Refunds', '+1 more']);
        await expectNoAxeViolations();
    });

    it('checks whole branches and shows a checked branch by its top node', async () => {
        function Checked() {
            const [value, setValue] = useState([]);
            return (
                <>
                    <Category selectionMode="checkbox" value={value} onValueChange={setValue} />
                    <output>{value.join(',')}</output>
                </>
            );
        }
        const { user } = renderUi(<Checked />);
        await user.click(field());
        await user.click(await screen.findByText('Billing'));
        expect(document.querySelector('output')).toHaveTextContent('billing,invoices,refunds');
        expect(field()).toHaveTextContent('Billing');
        expect(option('Billing')).toHaveAttribute('aria-checked', 'true');
        await expectNoAxeViolations();
    });

    it('submits each chosen id under its name', () => {
        renderUi(
            <form>
                <Category name="categories" selectionMode="multiple" defaultValue={['refunds', 'account']} />
            </form>
        );
        const inputs = document.querySelectorAll('input[type=hidden][name=categories]');
        expect([...inputs].map((input) => input.value)).toEqual(['refunds', 'account']);
    });

    it('cannot open while disabled', async () => {
        const { user } = renderUi(<Category disabled defaultValue={['refunds']} />);
        expect(field()).toBeDisabled();
        await user.click(field());
        expect(screen.queryByRole('tree')).toBeNull();
        await expectNoAxeViolations();
    });

    it('marks an invalid field and passes sizes and the filled look to the trigger', async () => {
        renderUi(
            <>
                <TreeSelect aria-label="Small" size="sm" nodes={CATEGORIES} />
                <TreeSelect aria-label="Large" size="lg" variant="filled" nodes={CATEGORIES} aria-invalid />
            </>
        );
        expect(screen.getByRole('combobox', { name: 'Small' })).toHaveAttribute('data-size', 'sm');
        const large = screen.getByRole('combobox', { name: 'Large' });
        expect(large).toHaveAttribute('data-size', 'lg');
        expect(large).toHaveAttribute('data-variant', 'filled');
        expect(large).toHaveAttribute('aria-invalid', 'true');
        await expectNoAxeViolations();
    });

    it('filters the list from a field at its top, named by the provider', async () => {
        const { user } = renderUi(<Category filter />, { strings: { filterTree: 'Filtern' } });
        await user.click(field());
        expect(await screen.findByRole('dialog', { name: 'Category' })).toBeInTheDocument();
        const filter = screen.getByRole('textbox', { name: 'Filtern' });
        await waitFor(() => expect(filter).toHaveFocus());
        await user.type(filter, 'bou');
        expect(screen.getAllByRole('treeitem').map((node) => node.querySelector('[data-slot=tree-node-label]').textContent)).toEqual([
            'Email delivery',
            'Bounces',
        ]);
        await user.keyboard('{ArrowDown}');
        expect(option('Email delivery')).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('works inside a dialog: choosing a node keeps the dialog open', async () => {
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>New ticket</DialogTitle>
                    <DialogDescription>Route it to a team.</DialogDescription>
                    <Category />
                </DialogContent>
            </Dialog>
        );
        await user.click(field());
        await user.click(await screen.findByText('Account'));
        await waitFor(() => expect(screen.queryByRole('tree')).toBeNull());
        expect(screen.getByRole('dialog', { name: 'New ticket' })).toBeInTheDocument();
        expect(field()).toHaveTextContent('Account');
        await expectNoAxeViolations();
    });
    it('moves to the previous node with Up Arrow in the list', async () => {
        const { user } = renderUi(<Category defaultValue={['account']} />);
        await user.click(field());
        await waitFor(() => expect(option('Account')).toHaveFocus());
        await user.keyboard('{ArrowUp}');
        expect(option('Email delivery')).toHaveFocus();
        await user.keyboard('{ArrowUp}');
        expect(option('Billing')).toHaveFocus();
    });

    it('mirrors Right and Left Arrow in a right-to-left page', async () => {
        const { user } = renderUi(<Category />, { dir: 'rtl' });
        await user.click(field());
        await waitFor(() => expect(option('Billing')).toHaveFocus());
        await user.keyboard('{ArrowRight}');
        expect(option('Billing')).toHaveAttribute('aria-expanded', 'false');
        await user.keyboard('{ArrowLeft}');
        expect(option('Billing')).toHaveAttribute('aria-expanded', 'true');
        await user.keyboard('{ArrowLeft}');
        expect(option('Invoices')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(option('Billing')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(option('Billing')).toHaveAttribute('aria-expanded', 'false');
    });

    it('is not submitted while disabled, and goes back to its first nodes when its form resets', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <form aria-label="Ticket form">
                <Category name="category" defaultValue={['refunds']} onValueChange={onValueChange} />
                <TreeSelect aria-label="Locked" name="locked" nodes={CATEGORIES} defaultValue={['account']} disabled />
            </form>
        );
        const form = screen.getByRole('form');
        expect([...new FormData(form).entries()]).toEqual([['category', 'refunds']]);
        await user.click(field());
        await user.click(within(await screen.findByRole('tree')).getByText('Account'));
        await waitFor(() => expect(field()).toHaveTextContent('Account'));
        expect(new FormData(form).getAll('category')).toEqual(['account']);
        act(() => form.reset());
        await waitFor(() => expect(field()).toHaveTextContent('Refunds'));
        expect(new FormData(form).getAll('category')).toEqual(['refunds']);
        expect(onValueChange).toHaveBeenLastCalledWith(['refunds']);
    });

    it('never grows past its container, so a long value truncates', () => {
        renderUi(<Category defaultValue={['refunds']} clearable />);
        expect(field().className).toContain('max-w-full');
        expect(field().parentElement.className).toContain('max-w-full');
    });
    it('keeps wheel and touch scrolling in the list from a dialog\'s scroll lock', async () => {
        const reached = vi.fn();
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>New ticket</DialogTitle>
                    <DialogDescription>Route it to a team.</DialogDescription>
                    <Category />
                </DialogContent>
            </Dialog>
        );
        await user.click(field());
        await waitFor(() => expect(option('Billing')).toHaveFocus());
        // jsdom has no layout: give the list room to scroll.
        const list = document.querySelector('[data-slot=tree-select-content]');
        list.style.overflowY = 'auto';
        Object.defineProperty(list, 'scrollHeight', { configurable: true, value: 600 });
        Object.defineProperty(list, 'clientHeight', { configurable: true, value: 200 });
        document.addEventListener('wheel', reached);
        document.addEventListener('touchmove', reached);
        try {
            fireEvent.wheel(option('Billing'), { deltaY: 120 });
            const at = (clientY) => [{ clientX: 10, clientY }];
            fireEvent.touchStart(option('Billing'), { touches: at(100), changedTouches: at(100) });
            fireEvent.touchMove(option('Billing'), { touches: at(40), changedTouches: at(40) });
            expect(reached).not.toHaveBeenCalled();
            // At the top a scroll up moves nothing in the list: it reaches the lock, which keeps the page still.
            fireEvent.wheel(option('Billing'), { deltaY: -120 });
            expect(reached).toHaveBeenCalledTimes(1);
        } finally {
            document.removeEventListener('wheel', reached);
            document.removeEventListener('touchmove', reached);
        }
    });
});
