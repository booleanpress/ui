import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, screen, within } from '@testing-library/react';
import { PickList, transferItems } from '@/components/pick-list';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const AGENTS = [
    { id: 'amy', name: 'Amy Elsner' },
    { id: 'asiya', name: 'Asiya Javayant' },
    { id: 'onyama', name: 'Onyama Limba' },
    { id: 'anna', name: 'Anna Fali' },
];

function Agents(props) {
    return <PickList sourceHeader="Available" targetHeader="Assigned" defaultSource={AGENTS} defaultTarget={[]} {...props} />;
}

const listbox = (name) => screen.getByRole('listbox', { name });
const items = (name) => within(listbox(name)).queryAllByRole('option').map((option) => option.textContent);
const button = (name) => screen.getByRole('button', { name });
const status = () => document.querySelector('[data-slot=pick-list-status]').textContent;
const dragStatus = () => document.querySelector('[data-slot=order-list-status]').textContent;
const tick = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

// jsdom has no layout: the source list's rows sit at x 0, the target's at x 300, each 31px below the last.
function mockColumns() {
    return vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect() {
        const box = (left, top, height) => ({ x: left, y: top, left, top, right: left + 200, bottom: top + height, width: 200, height, toJSON() {} });
        const overlay = this.getAttribute?.('data-slot') === 'order-list-drag-preview' ? this.parentElement : this;
        if (overlay.style?.position === 'fixed') return box(parseFloat(overlay.style.left) || 0, parseFloat(overlay.style.top) || 0, 29);
        const slot = this.getAttribute?.('data-slot');
        const side = this.closest?.('[data-list]')?.getAttribute('data-list') === 'target' ? 300 : 0;
        if (slot === 'order-list-item') return box(side + 4, 4 + [...this.parentElement.children].indexOf(this) * 31, 29);
        if (slot === 'order-list-list') return box(side, 0, 240);
        return box(0, 0, 0);
    });
}

afterEach(() => vi.restoreAllMocks());

describe('PickList', () => {
    it('renders two named multi-selectable listboxes with buttons between them', async () => {
        renderUi(<Agents />);
        expect(listbox('Available')).toHaveAttribute('aria-multiselectable', 'true');
        expect(items('Available')).toEqual(['Amy Elsner', 'Asiya Javayant', 'Onyama Limba', 'Anna Fali']);
        expect(items('Assigned')).toEqual([]);
        for (const name of ['Move to target', 'Move all to target', 'Move to source', 'Move all to source']) {
            expect(button(name)).toBeInTheDocument();
        }
        expect(screen.getAllByRole('button', { name: 'Move up' })).toHaveLength(2);
        await expectNoAxeViolations();
    });

    it('names the lists Source and Target from the provider when they have no header', async () => {
        renderUi(<PickList defaultSource={['SES']} defaultTarget={['Postmark']} />, { strings: { sourceList: 'Verfügbar', targetList: 'Ausgewählt' } });
        expect(items('Verfügbar')).toEqual(['SES']);
        expect(items('Ausgewählt')).toEqual(['Postmark']);
        await expectNoAxeViolations();
    });

    it('moves the chosen items to the end of the target with Move to target, and says so', async () => {
        const { user } = renderUi(<Agents defaultTarget={[{ id: 'stephen', name: 'Stephen Shaw' }]} />);
        expect(button('Move to target')).toHaveAttribute('aria-disabled', 'true');
        await user.click(screen.getByRole('option', { name: 'Asiya Javayant' }));
        await user.click(button('Move to target'));
        expect(items('Available')).toEqual(['Amy Elsner', 'Onyama Limba', 'Anna Fali']);
        expect(items('Assigned')).toEqual(['Stephen Shaw', 'Asiya Javayant']);
        expect(status()).toBe('Asiya Javayant moved to position 2 of 2');
        expect(button('Move to target')).toHaveAttribute('aria-disabled', 'true');
        expect(button('Move to target')).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('moves every item in view with Move all to target and Move all to source', async () => {
        const { user } = renderUi(<Agents />);
        await user.click(button('Move all to target'));
        expect(items('Available')).toEqual([]);
        expect(items('Assigned')).toEqual(['Amy Elsner', 'Asiya Javayant', 'Onyama Limba', 'Anna Fali']);
        expect(status()).toBe('4 items moved; the first is now at position 1 of 4');
        expect(button('Move all to target')).toHaveAttribute('aria-disabled', 'true');
        await user.click(button('Move all to source'));
        expect(items('Available')).toHaveLength(4);
        expect(items('Assigned')).toEqual([]);
    });

    it('moves the chosen items back with Move to source, from the keyboard (Enter and Space on a button)', async () => {
        const { user } = renderUi(<Agents defaultSource={AGENTS.slice(0, 2)} defaultTarget={AGENTS.slice(2)} />);
        await user.click(screen.getByRole('option', { name: 'Anna Fali' }));
        button('Move to source').focus();
        await user.keyboard('{Enter}');
        expect(items('Available')).toEqual(['Amy Elsner', 'Asiya Javayant', 'Anna Fali']);
        await user.click(screen.getByRole('option', { name: 'Onyama Limba' }));
        button('Move to source').focus();
        await user.keyboard(' ');
        expect(items('Assigned')).toEqual([]);
    });

    it('chooses with the arrows and Space and moves with Alt and the arrows inside each list', async () => {
        const { user } = renderUi(<Agents />);
        await act(() => listbox('Available').focus());
        await user.keyboard('{ArrowDown}{ArrowDown} ');
        expect(screen.getByRole('option', { name: 'Onyama Limba' })).toHaveAttribute('aria-selected', 'true');
        await user.keyboard('{Alt>}{ArrowUp}{/Alt}');
        expect(items('Available')).toEqual(['Amy Elsner', 'Onyama Limba', 'Asiya Javayant', 'Anna Fali']);
        expect(dragStatus()).toBe('Onyama Limba moved to position 2 of 4');
    });

    it('moves the highlight with Home and End and chooses every item with Control and A inside a list', async () => {
        const { user } = renderUi(<Agents defaultSource={[]} defaultTarget={AGENTS} />);
        await act(() => listbox('Assigned').focus());
        await user.keyboard('{End}');
        expect(listbox('Assigned')).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Anna Fali' }).id);
        await user.keyboard('{Home}');
        expect(listbox('Assigned')).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Amy Elsner' }).id);
        await user.keyboard('{Control>}a{/Control}');
        expect(within(listbox('Assigned')).getAllByRole('option', { selected: true })).toHaveLength(4);
        expect(button('Move to source')).not.toHaveAttribute('aria-disabled');
    });

    it('puts each list in order with its own Move buttons', async () => {
        const { user } = renderUi(<Agents defaultSource={[]} defaultTarget={AGENTS} />);
        await user.click(screen.getByRole('option', { name: 'Anna Fali' }));
        const target = listbox('Assigned').closest('[data-slot=order-list]');
        await user.click(within(target).getByRole('button', { name: 'Move to top' }));
        expect(items('Assigned')[0]).toBe('Anna Fali');
    });

    it('moves only the items in view with a filter', async () => {
        const { user } = renderUi(<Agents filter />);
        const [sourceFilter] = screen.getAllByRole('textbox', { name: 'Filter options' });
        await user.type(sourceFilter, 'an');
        expect(items('Available')).toEqual(['Asiya Javayant', 'Anna Fali']);
        await user.click(button('Move all to target'));
        expect(items('Assigned')).toEqual(['Asiya Javayant', 'Anna Fali']);
        await user.clear(sourceFilter);
        expect(items('Available')).toEqual(['Amy Elsner', 'Onyama Limba']);
    });

    it('keeps chosen items the filter hides chosen when the ones in view move', async () => {
        const { user } = renderUi(<Agents filter />);
        await user.click(screen.getByRole('option', { name: 'Amy Elsner' }));
        await user.keyboard('{Control>}');
        await user.click(screen.getByRole('option', { name: 'Anna Fali' }));
        await user.keyboard('{/Control}');
        const [sourceFilter] = screen.getAllByRole('textbox', { name: 'Filter options' });
        await user.type(sourceFilter, 'fali');
        await user.click(button('Move to target'));
        expect(items('Assigned')).toEqual(['Anna Fali']);
        await user.clear(sourceFilter);
        expect(screen.getByRole('option', { name: 'Amy Elsner' })).toHaveAttribute('aria-selected', 'true');
        expect(button('Move to target')).not.toHaveAttribute('aria-disabled');
    });

    it('drags an item into the other list from the keyboard: Enter, ArrowRight, Space', async () => {
        mockColumns();
        const sources = [];
        const targets = [];
        const { user } = renderUi(
            <Agents
                draggable
                defaultTarget={[{ id: 'stephen', name: 'Stephen Shaw' }]}
                onSourceChange={(v) => sources.push(v.map((a) => a.id))}
                onTargetChange={(v) => targets.push(v.map((a) => a.id))}
            />
        );
        await act(() => listbox('Available').focus());
        await user.keyboard('{ArrowDown}');
        await user.keyboard('{Enter}');
        await tick();
        expect(dragStatus()).toBe('Picked up Asiya Javayant at position 2 of 4. Arrow keys move it, Space or Enter drops it, Escape cancels.');
        await user.keyboard('{ArrowRight}');
        await tick();
        expect(dragStatus()).toBe('Asiya Javayant moved to position 1 of 2');
        await user.keyboard(' ');
        await tick();
        expect(sources).toEqual([['amy', 'onyama', 'anna']]);
        expect(targets).toEqual([['asiya', 'stephen']]);
        expect(items('Assigned')).toEqual(['Asiya Javayant', 'Stephen Shaw']);
        expect(listbox('Assigned')).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('draws checkboxes and a Select all box in each list', async () => {
        const { user } = renderUi(<Agents indicator="checkbox" selectAll defaultTarget={[{ id: 'stephen', name: 'Stephen Shaw' }]} />);
        const [all] = screen.getAllByRole('checkbox', { name: 'Select all' });
        await user.click(all);
        expect(within(listbox('Available')).getAllByRole('option', { selected: true })).toHaveLength(4);
        await user.click(button('Move to target'));
        expect(items('Assigned')).toHaveLength(5);
        await expectNoAxeViolations();
    });

    it('says when a list is empty, in its own words or the provider text', async () => {
        renderUi(<Agents targetEmpty="Nobody assigned yet" defaultSource={[]} />);
        expect(listbox('Assigned')).toHaveAccessibleDescription('Nobody assigned yet');
        expect(listbox('Available')).toHaveAccessibleDescription('No items');
        await expectNoAxeViolations();
    });

    it('follows controlled lists and reports each move', async () => {
        const changes = [];
        function Controlled() {
            const [source, setSource] = useState(AGENTS);
            const [target, setTarget] = useState([]);
            return (
                <PickList
                    sourceHeader="Available"
                    targetHeader="Assigned"
                    source={source}
                    target={target}
                    onSourceChange={(v) => {
                        changes.push(['source', v.length]);
                        setSource(v);
                    }}
                    onTargetChange={(v) => {
                        changes.push(['target', v.length]);
                        setTarget(v);
                    }}
                />
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('option', { name: 'Amy Elsner' }));
        await user.click(button('Move to target'));
        expect(changes).toEqual([
            ['source', 3],
            ['target', 1],
        ]);
        expect(items('Assigned')).toEqual(['Amy Elsner']);
    });

    it('disables both lists and every button with `disabled`', async () => {
        renderUi(<Agents disabled />);
        for (const name of ['Move to target', 'Move all to target', 'Move to source', 'Move all to source']) {
            expect(button(name)).toBeDisabled();
        }
        expect(listbox('Available')).toHaveAttribute('aria-disabled', 'true');
        expect(listbox('Assigned')).toHaveAttribute('tabindex', '-1');
        await expectNoAxeViolations();
    });

    it('reads its button names and announcements from the provider', async () => {
        const { user } = renderUi(<Agents />, {
            strings: { moveAllToTarget: 'Alle nach rechts', itemsMoved: '{count} verschoben, ab Position {position} von {total}' },
            locale: 'de-DE',
        });
        await user.click(screen.getByRole('button', { name: 'Alle nach rechts' }));
        expect(status()).toBe('4 verschoben, ab Position 1 von 4');
    });

    it('keeps the same names in a right-to-left page', async () => {
        renderUi(<Agents />, { dir: 'rtl' });
        expect(button('Move to target')).toBeInTheDocument();
        expect(button('Move to source')).toBeInTheDocument();
    });

    it('redraws only the item a choice changes in a long list, then moves every chosen item', async () => {
        const many = Array.from({ length: 500 }, (_, index) => ({ id: `m${index}`, name: `Mailer ${index + 1}` }));
        const draw = vi.fn((mailer, state) => `${mailer.name} (${state.list})`);
        const { user } = renderUi(<PickList defaultSource={many} defaultTarget={[]} renderItem={draw} draggable />);
        await act(() => listbox('Source').focus());
        await user.keyboard('{ArrowDown}');
        // Choosing re-renders the pick list, which holds the choice; only the chosen item is drawn again.
        draw.mockClear();
        await user.keyboard(' ');
        expect(screen.getByRole('option', { name: 'Mailer 2 (source)' })).toHaveAttribute('aria-selected', 'true');
        expect(draw.mock.calls.length).toBeLessThanOrEqual(2);
        await user.keyboard('{Control>}a{/Control}');
        await user.click(button('Move to target'));
        expect(items('Target')).toHaveLength(500);
        expect(items('Target')[499]).toBe('Mailer 500 (target)');
        expect(status()).toBe('500 items moved; the first is now at position 1 of 500');
    });
});

describe('transferItems', () => {
    it('moves the keyed items to the end of the other list in their order, without mutating', () => {
        const from = ['a', 'b', 'c', 'd'];
        const to = ['x'];
        expect(transferItems(from, to, ['c', 'a'])).toEqual({ from: ['b', 'd'], to: ['x', 'a', 'c'] });
        expect(from).toEqual(['a', 'b', 'c', 'd']);
        expect(transferItems([{ id: 1 }, { id: 2 }], [], ['2'])).toEqual({ from: [{ id: 1 }], to: [{ id: 2 }] });
    });
});
