import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, within } from '@testing-library/react';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { OrderList, OrderListGroup, moveItems } from '@/components/order-list';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const RULES = [
    { id: 'resets', name: 'Password resets' },
    { id: 'receipts', name: 'Receipts' },
    { id: 'invoices', name: 'Invoices' },
    { id: 'digests', name: 'Digests' },
];

function Rules(props) {
    return <OrderList aria-label="Rules" defaultValue={RULES} {...props} />;
}

const list = (name = 'Rules') => screen.getByRole('listbox', { name });
const order = (name = 'Rules') => within(list(name)).queryAllByRole('option').map((option) => option.textContent);
const option = (name) => screen.getByRole('option', { name });
const highlighted = () => document.querySelector('[data-slot=order-list-item][data-highlighted]');
const status = () => document.querySelector('[data-slot=order-list-status]').textContent;
const button = (name) => screen.getByRole('button', { name });
const focusList = (name) => act(() => list(name).focus());
const tick = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

// jsdom has no layout: give every item a 30px row by its place among its siblings, so dnd kit's keyboard sensor can
// find the item above and below.
function mockRows() {
    return vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect() {
        // dnd kit's overlay is fixed at the picked-up item's place, and measured there.
        const overlay = this.getAttribute?.('data-slot') === 'order-list-drag-preview' ? this.parentElement : this;
        if (overlay.style?.position === 'fixed') {
            const top = parseFloat(overlay.style.top) || 0;
            return { x: 0, y: top, top, left: 0, right: 200, bottom: top + 29, width: 200, height: 29, toJSON() {} };
        }
        const isItem = this.getAttribute?.('data-slot') === 'order-list-item';
        const index = isItem ? [...this.parentElement.children].indexOf(this) : 0;
        const top = isItem ? 4 + index * 31 : 0;
        const height = isItem ? 29 : 300;
        return { x: 0, y: top, top, left: 0, right: 200, bottom: top + height, width: 200, height, toJSON() {} };
    });
}

afterEach(() => vi.restoreAllMocks());

describe('OrderList', () => {
    it('is a multi-selectable listbox; focus highlights the first chosen item, else the first', async () => {
        const { user } = renderUi(<Rules defaultSelected={['invoices']} />);
        expect(list()).toHaveAttribute('aria-multiselectable', 'true');
        expect(screen.getAllByRole('button')).toHaveLength(4);
        await user.tab();
        await user.tab();
        await user.tab();
        await user.tab();
        await user.tab();
        expect(list()).toHaveFocus();
        expect(highlighted()).toHaveTextContent('Invoices');
        expect(list()).toHaveAttribute('aria-activedescendant', highlighted().id);
        expect(option('Invoices')).toHaveAttribute('aria-selected', 'true');
        expect(option('Receipts')).toHaveAttribute('aria-selected', 'false');
        await expectNoAxeViolations();
    });

    it('moves the highlight with ArrowDown and ArrowUp, stopping at the ends', async () => {
        const { user } = renderUi(<Rules />);
        await focusList();
        expect(highlighted()).toHaveTextContent('Password resets');
        await user.keyboard('{ArrowUp}');
        expect(highlighted()).toHaveTextContent('Password resets');
        await user.keyboard('{ArrowDown}{ArrowDown}');
        expect(highlighted()).toHaveTextContent('Invoices');
        await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
        expect(highlighted()).toHaveTextContent('Digests');
    });

    it('moves the highlight to the first and the last item with Home and End', async () => {
        const { user } = renderUi(<Rules />);
        await focusList();
        await user.keyboard('{End}');
        expect(highlighted()).toHaveTextContent('Digests');
        await user.keyboard('{Home}');
        expect(highlighted()).toHaveTextContent('Password resets');
    });

    it('chooses and un-chooses the highlighted item with Space', async () => {
        const changes = [];
        const { user } = renderUi(<Rules onSelectedChange={(keys) => changes.push(keys)} />);
        await focusList();
        await user.keyboard('{ArrowDown} ');
        expect(option('Receipts')).toHaveAttribute('aria-selected', 'true');
        await user.keyboard('{ArrowDown} ');
        await user.keyboard('{ArrowUp} ');
        expect(changes).toEqual([['receipts'], ['receipts', 'invoices'], ['invoices']]);
        await expectNoAxeViolations();
    });

    it('extends the choice with Shift and the arrows, Home or End', async () => {
        const changes = [];
        const { user } = renderUi(<Rules onSelectedChange={(keys) => changes.push(keys)} />);
        await focusList();
        await user.keyboard('{ArrowDown}');
        await user.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}');
        expect(changes.at(-1)).toEqual(['receipts', 'invoices', 'digests']);
        await user.keyboard('{Shift>}{Home}{/Shift}');
        expect(changes.at(-1)).toEqual(['resets', 'receipts']);
    });

    it('chooses the range from the last chosen item with Shift and Space', async () => {
        const changes = [];
        const { user } = renderUi(<Rules onSelectedChange={(keys) => changes.push(keys)} />);
        await focusList();
        await user.keyboard(' {ArrowDown}{ArrowDown}');
        await user.keyboard('{Shift>} {/Shift}');
        expect(changes.at(-1)).toEqual(['resets', 'receipts', 'invoices']);
    });

    it('chooses every item with Control and A, and none the second time (⌘ and A too)', async () => {
        const changes = [];
        const { user } = renderUi(<Rules onSelectedChange={(keys) => changes.push(keys)} />);
        await focusList();
        await user.keyboard('{Control>}a{/Control}');
        expect(changes.at(-1)).toEqual(['resets', 'receipts', 'invoices', 'digests']);
        await user.keyboard('{Meta>}a{/Meta}');
        expect(changes.at(-1)).toEqual([]);
    });

    it('moves the chosen items one place with Alt and the arrows, and says so', async () => {
        const values = [];
        const { user } = renderUi(<Rules defaultSelected={['invoices']} onValueChange={(v) => values.push(v.map((r) => r.id))} />);
        await focusList();
        await user.keyboard('{Alt>}{ArrowUp}{/Alt}');
        expect(order()).toEqual(['Password resets', 'Invoices', 'Receipts', 'Digests']);
        expect(status()).toBe('Invoices moved to position 2 of 4');
        await user.keyboard('{Alt>}{ArrowDown}{ArrowDown}{/Alt}');
        expect(order()).toEqual(['Password resets', 'Receipts', 'Digests', 'Invoices']);
        expect(status()).toBe('Invoices moved to position 4 of 4');
        expect(values).toHaveLength(3);
        await expectNoAxeViolations();
    });

    it('moves the highlighted item with Alt and an arrow when none is chosen, and chooses it', async () => {
        const { user } = renderUi(<Rules />);
        await focusList();
        await user.keyboard('{ArrowDown}{Alt>}{ArrowDown}{/Alt}');
        expect(order()).toEqual(['Password resets', 'Invoices', 'Receipts', 'Digests']);
        expect(option('Receipts')).toHaveAttribute('aria-selected', 'true');
    });

    it('moves the chosen items to the top and the bottom with Alt and Home or End', async () => {
        const { user } = renderUi(<Rules defaultSelected={['invoices', 'digests']} />);
        await focusList();
        await user.keyboard('{Alt>}{Home}{/Alt}');
        expect(order()).toEqual(['Invoices', 'Digests', 'Password resets', 'Receipts']);
        expect(status()).toBe('2 items moved; the first is now at position 1 of 4');
        await user.keyboard('{Alt>}{End}{/Alt}');
        expect(order()).toEqual(['Password resets', 'Receipts', 'Invoices', 'Digests']);
    });

    it('type-ahead moves the highlight to the next item that starts with the letters typed', async () => {
        const { user } = renderUi(<Rules />);
        await focusList();
        await user.keyboard('in');
        expect(highlighted()).toHaveTextContent('Invoices');
        await new Promise((resolve) => setTimeout(resolve, 600));
        await user.keyboard('d');
        expect(highlighted()).toHaveTextContent('Digests');
    });

    it('picks an item up with Enter, moves it with the arrows and drops it with Space (keyboard sensor)', async () => {
        mockRows();
        const values = [];
        const { user } = renderUi(<Rules draggable onValueChange={(v) => values.push(v.map((r) => r.id))} />);
        await focusList();
        await user.keyboard('{ArrowDown}');
        await user.keyboard('{Enter}');
        await tick();
        expect(status()).toBe('Picked up Receipts at position 2 of 4. Arrow keys move it, Space or Enter drops it, Escape cancels.');
        await user.keyboard('{ArrowDown}');
        await tick();
        expect(status()).toBe('Receipts moved to position 3 of 4');
        await user.keyboard('{ArrowDown}');
        await tick();
        await user.keyboard(' ');
        await tick();
        expect(values).toEqual([['resets', 'invoices', 'digests', 'receipts']]);
        expect(order()).toEqual(['Password resets', 'Invoices', 'Digests', 'Receipts']);
        expect(status()).toBe('Receipts moved to position 4 of 4');
        expect(list()).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('puts a picked-up item back with Escape and says so', async () => {
        mockRows();
        const values = [];
        const { user } = renderUi(<Rules draggable onValueChange={(v) => values.push(v)} />);
        await focusList();
        await user.keyboard('{Enter}');
        await tick();
        await user.keyboard('{ArrowDown}');
        await tick();
        await user.keyboard('{Escape}');
        await tick();
        expect(values).toEqual([]);
        expect(order()).toEqual(['Password resets', 'Receipts', 'Invoices', 'Digests']);
        expect(status()).toBe('Move cancelled. Password resets is back at position 1 of 4.');
    });

    it('says the place again when a picked-up item comes back over its own place', async () => {
        mockRows();
        const { user } = renderUi(<Rules draggable />);
        await focusList();
        await user.keyboard('{Enter}');
        await tick();
        await user.keyboard('{ArrowDown}');
        await tick();
        expect(status()).toBe('Password resets moved to position 2 of 4');
        await user.keyboard('{ArrowUp}');
        await tick();
        expect(status()).toBe('Password resets moved to position 1 of 4');
        await user.keyboard('{Escape}');
        await tick();
    });

    it('works inside a dialog: the dragged copy is not shifted, and Escape puts the item back and leaves the dialog open', async () => {
        mockRows();
        const values = [];
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Routing</DialogTitle>
                    <DialogDescription>Put the rules in order.</DialogDescription>
                    <Rules draggable onValueChange={(v) => values.push(v)} />
                </DialogContent>
            </Dialog>
        );
        await focusList();
        await user.keyboard('{Enter}');
        await tick();
        // The dragged copy is drawn on the body: the dialog's transform would otherwise shift its fixed position.
        const preview = document.querySelector('[data-slot=order-list-drag-preview]');
        expect(preview).toHaveTextContent('Password resets');
        expect(screen.getByRole('dialog').contains(preview)).toBe(false);
        expect(preview).toHaveAttribute('aria-hidden', 'true');
        await user.keyboard('{ArrowDown}');
        await tick();
        await user.keyboard('{Escape}');
        await tick();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(values).toEqual([]);
        expect(status()).toBe('Move cancelled. Password resets is back at position 1 of 4.');
        // With nothing picked up, Escape is the dialog's again.
        await user.keyboard('{Escape}');
        await tick();
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('does nothing on Enter without draggable', async () => {
        const values = [];
        const { user } = renderUi(<Rules onValueChange={(v) => values.push(v)} />);
        await focusList();
        await user.keyboard('{Enter}{ArrowDown} ');
        await tick();
        expect(values).toEqual([]);
        expect(status()).toBe('');
    });

    it('moves the chosen items with the buttons and keeps the focus on a button that has no move left', async () => {
        const { user } = renderUi(<Rules defaultSelected={['invoices']} />);
        await user.click(button('Move up'));
        expect(order()).toEqual(['Password resets', 'Invoices', 'Receipts', 'Digests']);
        expect(status()).toBe('Invoices moved to position 2 of 4');
        await user.click(button('Move to top'));
        expect(order()[0]).toBe('Invoices');
        expect(button('Move to top')).toHaveAttribute('aria-disabled', 'true');
        expect(button('Move up')).toHaveAttribute('aria-disabled', 'true');
        expect(button('Move to top')).toHaveFocus();
        await user.click(button('Move to top'));
        expect(order()[0]).toBe('Invoices');
        await user.click(button('Move down'));
        expect(order()).toEqual(['Password resets', 'Invoices', 'Receipts', 'Digests']);
        await user.click(button('Move to bottom'));
        expect(order()).toEqual(['Password resets', 'Receipts', 'Digests', 'Invoices']);
        expect(button('Move down')).toHaveAttribute('aria-disabled', 'true');
        await expectNoAxeViolations();
    });

    it('marks every Move button unavailable while nothing is chosen', async () => {
        renderUi(<Rules />);
        for (const name of ['Move to top', 'Move up', 'Move down', 'Move to bottom']) {
            expect(button(name)).toHaveAttribute('aria-disabled', 'true');
        }
    });

    it('moves several chosen items together, keeping their order', async () => {
        const { user } = renderUi(<Rules defaultSelected={['receipts', 'digests']} />);
        await user.click(button('Move up'));
        expect(order()).toEqual(['Receipts', 'Password resets', 'Digests', 'Invoices']);
        expect(status()).toBe('2 items moved; the first is now at position 1 of 4');
    });

    it('chooses with a click: one item, Control adds or removes one, Shift a range', async () => {
        const changes = [];
        const { user } = renderUi(<Rules onSelectedChange={(keys) => changes.push(keys)} />);
        await user.click(option('Receipts'));
        expect(list()).toHaveFocus();
        await user.click(option('Digests'));
        expect(changes.at(-1)).toEqual(['digests']);
        await user.keyboard('{Control>}');
        await user.click(option('Password resets'));
        await user.keyboard('{/Control}');
        expect(changes.at(-1)).toEqual(['resets', 'digests']);
        await user.keyboard('{Shift>}');
        await user.click(option('Invoices'));
        await user.keyboard('{/Shift}');
        expect(changes.at(-1)).toEqual(['resets', 'receipts', 'invoices']);
    });

    it('checkbox: a click toggles an item, and the Select all box chooses every item or none', async () => {
        const changes = [];
        const { user } = renderUi(<Rules indicator="checkbox" selectAll onSelectedChange={(keys) => changes.push(keys)} />);
        await user.click(option('Receipts'));
        await user.click(option('Digests'));
        expect(changes.at(-1)).toEqual(['receipts', 'digests']);
        expect(document.querySelectorAll('[data-slot=order-list-checkbox] svg')).toHaveLength(2);
        const all = screen.getByRole('checkbox', { name: 'Select all' });
        expect(all).toHaveAttribute('aria-checked', 'mixed');
        await user.click(all);
        expect(changes.at(-1)).toEqual(['resets', 'receipts', 'invoices', 'digests']);
        await user.click(all);
        expect(changes.at(-1)).toEqual([]);
        await expectNoAxeViolations();
    });

    it('checkbox without a filter: the Select all box shows its label, which names it; beside a filter it is named only for assistive technology', async () => {
        const { user, unmount } = renderUi(<Rules indicator="checkbox" selectAll />);
        const all = screen.getByRole('checkbox', { name: 'Select all' });
        const label = screen.getByText('Select all', { selector: 'label' });
        expect(label).toHaveAttribute('for', all.id);
        await user.click(label);
        expect(all).toHaveAttribute('aria-checked', 'true');
        await expectNoAxeViolations();
        unmount();
        renderUi(<Rules indicator="checkbox" selectAll filter />);
        expect(screen.getByRole('checkbox', { name: 'Select all' })).toBeInTheDocument();
        expect(screen.queryByText('Select all', { selector: 'label' })).toBeNull();
    });

    it('filters the items in view; moves leave the hidden ones in place', async () => {
        const values = [];
        const { user } = renderUi(<Rules filter defaultSelected={['digests']} onValueChange={(v) => values.push(v.map((r) => r.id))} />);
        const field = screen.getByRole('textbox', { name: 'Filter options' });
        await user.type(field, 's');
        expect(order()).toEqual(['Password resets', 'Receipts', 'Invoices', 'Digests']);
        await user.clear(field);
        await user.type(field, 'ts');
        expect(order()).toEqual(['Password resets', 'Receipts', 'Digests']);
        await user.click(button('Move up'));
        expect(values).toEqual([['resets', 'digests', 'invoices', 'receipts']]);
        expect(order()).toEqual(['Password resets', 'Digests', 'Receipts']);
        await user.type(field, 'zz');
        expect(order()).toEqual([]);
        expect(list()).toHaveAccessibleDescription('No results');
        await expectNoAxeViolations();
    });

    it('moves the focus from the filter field to the list with ArrowDown', async () => {
        const { user } = renderUi(<Rules filter />);
        await user.click(screen.getByRole('textbox', { name: 'Filter options' }));
        await user.keyboard('{ArrowDown}');
        expect(list()).toHaveFocus();
        expect(highlighted()).toHaveTextContent('Password resets');
    });

    it('says when it has no items, with the provider text or `empty`', async () => {
        const { unmount } = renderUi(<OrderList aria-label="Rules" defaultValue={[]} />);
        expect(list()).toHaveAccessibleDescription('No items');
        await expectNoAxeViolations();
        unmount();
        renderUi(<OrderList aria-label="Rules" defaultValue={[]} empty="No rules yet" />);
        expect(list()).toHaveAccessibleDescription('No rules yet');
    });

    it('is greyed, unchangeable and out of the tab order while disabled', async () => {
        const values = [];
        const changes = [];
        const { user } = renderUi(
            <Rules disabled defaultSelected={['receipts']} onValueChange={(v) => values.push(v)} onSelectedChange={(k) => changes.push(k)} />
        );
        expect(list()).toHaveAttribute('aria-disabled', 'true');
        expect(list()).toHaveAttribute('tabindex', '-1');
        expect(button('Move up')).toBeDisabled();
        await user.click(option('Digests'));
        await focusList();
        await user.keyboard('{Alt>}{ArrowUp}{/Alt} ');
        expect(values).toEqual([]);
        expect(changes).toEqual([]);
        await expectNoAxeViolations();
    });

    it('does not take the focus or show a highlight when a disabled list is pressed', async () => {
        const { user } = renderUi(<Rules disabled />);
        await user.click(option('Digests'));
        expect(list()).not.toHaveFocus();
        expect(highlighted()).toBeNull();
    });

    it('passes aria-invalid and aria-describedby to the list', async () => {
        renderUi(
            <>
                <Rules aria-invalid aria-describedby="rules-error" />
                <p id="rules-error">Put at least one rule first.</p>
            </>
        );
        expect(list()).toHaveAttribute('aria-invalid', 'true');
        expect(list()).toHaveAccessibleDescription('Put at least one rule first.');
        await expectNoAxeViolations();
    });

    it('follows a controlled value and reports each move', async () => {
        const values = [];
        function Controlled() {
            const [rules, setRules] = useState(RULES);
            return (
                <OrderList
                    aria-label="Rules"
                    value={rules}
                    onValueChange={(next) => {
                        values.push(next.map((r) => r.id));
                        setRules(next);
                    }}
                    defaultSelected={['digests']}
                />
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(button('Move to top'));
        expect(values).toEqual([['digests', 'resets', 'receipts', 'invoices']]);
        expect(order()[0]).toBe('Digests');
    });

    it('keeps the order a controlled value gives it until the value changes', async () => {
        const values = [];
        const { user } = renderUi(<OrderList aria-label="Rules" value={RULES} onValueChange={(v) => values.push(v)} defaultSelected={['digests']} />);
        await user.click(button('Move to top'));
        expect(values).toHaveLength(1);
        expect(order()[0]).toBe('Password resets');
    });

    it('names itself from `header`, and draws items with `renderItem`', async () => {
        renderUi(
            <OrderList
                header="Routing rules"
                defaultValue={RULES}
                renderItem={(rule, { index }) => `${index + 1}. ${rule.name}`}
            />
        );
        expect(screen.getByRole('listbox', { name: 'Routing rules' })).toBeInTheDocument();
        expect(option('3. Invoices')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('takes strings and plain items, and `controls` places or hides the buttons', async () => {
        const { container, unmount } = renderUi(<OrderList aria-label="Mailers" defaultValue={['SES', 'Postmark']} controls="end" />);
        expect(order('Mailers')).toEqual(['SES', 'Postmark']);
        expect(container.querySelector('[data-slot=order-list]')).toHaveAttribute('data-controls', 'end');
        unmount();
        renderUi(<OrderList aria-label="Mailers" defaultValue={['SES']} controls="none" />);
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('shows a grip named for its item with `dragHandle`, hidden from assistive technology', async () => {
        renderUi(<Rules draggable dragHandle />);
        const grips = document.querySelectorAll('[data-slot=order-list-handle]');
        expect(grips).toHaveLength(4);
        expect(grips[0]).toHaveAttribute('aria-hidden', 'true');
        expect(grips[0]).toHaveAttribute('title', 'Drag Password resets');
        await expectNoAxeViolations();
    });

    it('reads its names and announcements from the provider', async () => {
        const { user } = renderUi(<Rules defaultSelected={['receipts']} />, {
            strings: { moveUp: 'Nach oben', itemMoved: '{item} ist jetzt an Position {position} von {total}' },
            locale: 'de-DE',
        });
        await user.click(screen.getByRole('button', { name: 'Nach oben' }));
        expect(status()).toBe('Receipts ist jetzt an Position 1 von 4');
    });

    it('moves the highlight in a long draggable list without copying the list once per item', async () => {
        const many = Array.from({ length: 1000 }, (_, index) => ({ id: `r${index}`, name: `Rule ${index + 1}` }));
        const { user } = renderUi(<OrderList aria-label="Rules" defaultValue={many} draggable />);
        await focusList();
        await user.keyboard('{ArrowDown}');
        // dnd kit copies the ids after each item whenever the array of ids is new: a million copies for 1,000 items.
        const slice = Array.prototype.slice;
        let copied = 0;
        Array.prototype.slice = function countedSlice(...args) {
            const result = slice.apply(this, args);
            copied += result.length;
            return result;
        };
        try {
            await user.keyboard('{ArrowDown}');
        } finally {
            Array.prototype.slice = slice;
        }
        expect(highlighted()).toHaveTextContent('Rule 3');
        expect(copied).toBeLessThan(10_000);
    });

    it.each([
        ['a plain list', false],
        ['a draggable list', true],
    ])('redraws only the items a key press changes in a long list (%s)', async (_name, draggable) => {
        const many = Array.from({ length: 500 }, (_, index) => ({ id: `r${index}`, name: `Rule ${index + 1}` }));
        const draw = vi.fn((rule) => rule.name);
        const { user } = renderUi(<OrderList aria-label="Rules" defaultValue={many} renderItem={draw} draggable={draggable} />);
        expect(draw.mock.calls.length).toBeGreaterThanOrEqual(500);
        await focusList();
        await user.keyboard('{ArrowDown}');
        // ArrowDown moves the highlight from one item to the next: those two are drawn again, not all 500.
        draw.mockClear();
        await user.keyboard('{ArrowDown}');
        expect(highlighted()).toHaveTextContent('Rule 3');
        expect(draw.mock.calls.length).toBeLessThanOrEqual(4);
        draw.mockClear();
        await user.keyboard(' ');
        expect(option('Rule 3')).toHaveAttribute('aria-selected', 'true');
        expect(draw.mock.calls.length).toBeLessThanOrEqual(2);
        if (!draggable) {
            // A move redraws the two items that swapped places (their index changed), not the rest.
            draw.mockClear();
            await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
            expect(order().slice(0, 4)).toEqual(['Rule 1', 'Rule 2', 'Rule 4', 'Rule 3']);
            expect(draw.mock.calls.length).toBeLessThanOrEqual(4);
        }
    });

    it('moves the highlight to the item under the pointer while the list has focus', async () => {
        renderUi(<Rules />);
        await focusList();
        expect(highlighted()).toHaveTextContent('Password resets');
        fireEvent.mouseMove(option('Invoices'));
        expect(highlighted()).toHaveTextContent('Invoices');
        expect(list()).toHaveAttribute('aria-activedescendant', option('Invoices').id);
    });

    it('draws items again when a new renderItem is given', () => {
        const { rerender } = renderUi(<Rules renderItem={(rule) => rule.name} />);
        expect(order()).toEqual(['Password resets', 'Receipts', 'Invoices', 'Digests']);
        rerender(
            <BooleanUIProvider>
                <Rules renderItem={(rule) => `${rule.name}!`} />
            </BooleanUIProvider>
        );
        expect(order()).toEqual(['Password resets!', 'Receipts!', 'Invoices!', 'Digests!']);
    });

    it('lets several lists share one group', async () => {
        renderUi(
            <OrderListGroup>
                <OrderList aria-label="First" defaultValue={['A', 'B']} draggable />
                <OrderList aria-label="Second" defaultValue={['C']} draggable />
            </OrderListGroup>
        );
        expect(order('First')).toEqual(['A', 'B']);
        expect(order('Second')).toEqual(['C']);
        expect(document.querySelectorAll('[data-slot=order-list-status]')).toHaveLength(1);
        await expectNoAxeViolations();
    });
});

describe('moveItems', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];

    it('moves chosen items one place up or down as a block, leaving those against the end', () => {
        expect(moveItems(items, ['b', 'd'], 'up')).toEqual(['b', 'a', 'd', 'c', 'e']);
        expect(moveItems(items, ['a', 'c'], 'up')).toEqual(['a', 'c', 'b', 'd', 'e']);
        expect(moveItems(items, ['d', 'e'], 'down')).toEqual(items);
        expect(moveItems(items, ['b', 'c'], 'down')).toEqual(['a', 'd', 'b', 'c', 'e']);
    });

    it('moves chosen items to the top or the bottom in their order', () => {
        expect(moveItems(items, ['d', 'b'], 'top')).toEqual(['b', 'd', 'a', 'c', 'e']);
        expect(moveItems(items, ['a', 'c'], 'bottom')).toEqual(['b', 'd', 'e', 'a', 'c']);
    });

    it('keys objects by id, then value, or by getItemKey, and never mutates', () => {
        const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const copy = [...rows];
        expect(moveItems(rows, ['3'], 'top').map((r) => r.id)).toEqual([3, 1, 2]);
        expect(rows).toEqual(copy);
        expect(moveItems([{ value: 'x' }, { value: 'y' }], ['y'], 'up').map((r) => r.value)).toEqual(['y', 'x']);
        expect(moveItems([{ k: 'x' }, { k: 'y' }], ['y'], 'top', (r) => r.k).map((r) => r.k)).toEqual(['y', 'x']);
    });
});
