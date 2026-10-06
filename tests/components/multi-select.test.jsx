import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectEmpty,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectLabel,
    MultiSelectList,
    MultiSelectTrigger,
    MultiSelectValue,
} from '@/components/multi-select';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { Popover, PopoverContent } from '@/components/popover';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/sheet';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const EVENTS = ['Delivered', 'Bounced', 'Complained', 'Opened'];

function Events({ triggerProps = {}, valueProps = {}, contentProps = {}, indicator, ...props }) {
    return (
        <>
            <label htmlFor="events">Events</label>
            <MultiSelect items={EVENTS} {...props}>
                <MultiSelectTrigger id="events" {...triggerProps}>
                    <MultiSelectValue placeholder="Any event" {...valueProps} />
                </MultiSelectTrigger>
                <MultiSelectContent {...contentProps}>
                    <MultiSelectEmpty />
                    <MultiSelectList>
                        {(item) => (
                            <MultiSelectItem key={item} value={item} indicator={indicator}>
                                {item}
                            </MultiSelectItem>
                        )}
                    </MultiSelectList>
                </MultiSelectContent>
            </MultiSelect>
        </>
    );
}

const trigger = () => screen.getByRole('combobox', { name: 'Events' });
const filterInput = () => screen.getByRole('combobox', { name: 'Filter options' });
const highlighted = () => document.querySelector('[data-slot=multi-select-item][data-highlighted]');

async function open(user, key = '{Enter}') {
    trigger().focus();
    await user.keyboard(key);
    await screen.findByRole('listbox');
    await waitFor(() => expect(filterInput()).toHaveFocus());
}

describe('MultiSelect', () => {
    it('opens from the trigger with Enter, ArrowDown and a click, and moves focus into the list', async () => {
        const { user } = renderUi(<Events />);
        await open(user, '{Enter}');
        expect(trigger()).toHaveAttribute('aria-expanded', 'true');
        await expectNoAxeViolations();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        await open(user, '{ArrowDown}');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        await user.click(trigger());
        expect(await screen.findByRole('listbox')).toBeInTheDocument();
    });

    it('highlights with ArrowDown and ArrowUp', async () => {
        const { user } = renderUi(<Events />);
        await open(user);
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(highlighted()).toHaveTextContent('Delivered'));
        await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}');
        expect(highlighted()).toHaveTextContent('Bounced');
    });

    it('toggles the highlighted option with Enter and stays open', async () => {
        const values = [];
        const { user } = renderUi(<Events onValueChange={(v) => values.push(v)} />);
        await open(user);
        await user.keyboard('{ArrowDown}{Enter}{ArrowDown}{Enter}');
        expect(values.at(-1)).toEqual(['Delivered', 'Bounced']);
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        await user.keyboard('{ArrowUp}{Enter}');
        expect(values.at(-1)).toEqual(['Bounced']);
    });

    it('toggles the highlighted option with Space', async () => {
        const values = [];
        const { user } = renderUi(<Events onValueChange={(v) => values.push(v)} />);
        await open(user);
        await user.keyboard('{ArrowDown}{ArrowDown} ');
        expect(values.at(-1)).toEqual(['Bounced']);
        expect(screen.getByRole('option', { name: 'Bounced' })).toHaveAttribute('aria-selected', 'true');
    });

    it('closes with Escape and returns focus to the trigger', async () => {
        const { user } = renderUi(<Events defaultValue={['Opened']} />);
        await open(user);
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        await waitFor(() => expect(trigger()).toHaveFocus());
        expect(trigger()).toHaveTextContent('Opened');
    });

    it('filters as you type; the filter field shows once used and stays after a pick', async () => {
        const { user } = renderUi(<Events />);
        await open(user);
        expect(filterInput().closest('[data-slot=input-group]').className).toContain('sr-only');
        await user.keyboard('ed');
        const listbox = screen.getByRole('listbox');
        await waitFor(() => expect(within(listbox).getAllByRole('option').map((o) => o.textContent)).toEqual(['Delivered', 'Bounced', 'Complained', 'Opened']));
        await user.keyboard('{Backspace}{Backspace}bou');
        await waitFor(() => expect(within(listbox).getAllByRole('option')).toHaveLength(1));
        expect(filterInput().closest('[data-slot=input-group]').className).not.toContain('sr-only');
        await user.keyboard('{ArrowDown}{Enter}');
        expect(filterInput()).toHaveValue('bou');
        await expectNoAxeViolations();
    });

    it('shows a visible filter field with filter', async () => {
        const { user } = renderUi(<Events contentProps={{ filter: true, filterPlaceholder: 'Filter events' }} />, { strings: { filterOptions: 'Filtrer' } });
        trigger().focus();
        await user.keyboard('{Enter}');
        const input = await screen.findByRole('combobox', { name: 'Filtrer' });
        expect(input).toHaveAttribute('placeholder', 'Filter events');
        expect(input.closest('[data-slot=input-group]').className).not.toContain('sr-only');
    });

    it('shows the chosen labels, joined with commas', () => {
        renderUi(<Events defaultValue={['Bounced', 'Opened']} />);
        expect(trigger()).toHaveTextContent('Bounced, Opened');
    });

    it('shows the placeholder while nothing is chosen', async () => {
        renderUi(<Events />);
        expect(trigger()).toHaveTextContent('Any event');
        expect(trigger()).toHaveAttribute('data-placeholder');
        await expectNoAxeViolations();
    });

    it('maxShown: the first labels, then "+{count} more" from the provider, formatted for the locale', () => {
        renderUi(<Events defaultValue={['Delivered', 'Bounced', 'Opened']} valueProps={{ maxShown: 1 }} />, { strings: { moreSelected: 'et {count} autres' } });
        expect(trigger()).toHaveTextContent('Delivered');
        expect(trigger()).toHaveTextContent('et 2 autres');
    });

    it('display="count": "{count} selected" from the provider', () => {
        renderUi(<Events defaultValue={['Delivered', 'Bounced']} valueProps={{ display: 'count' }} />, { strings: { selectedCount: '{count} choisis' } });
        expect(trigger()).toHaveTextContent('2 choisis');
    });

    it('display="chips": a chip per value; a click on its × removes it without opening the list', async () => {
        const values = [];
        const { user } = renderUi(<Events defaultValue={['Bounced', 'Opened']} valueProps={{ display: 'chips' }} onValueChange={(v) => values.push(v)} />);
        expect(document.querySelectorAll('[data-slot=multi-select-chip]')).toHaveLength(2);
        await expectNoAxeViolations();
        await user.click(document.querySelector('[data-slot=multi-select-chip-remove]'));
        expect(values.at(-1)).toEqual(['Opened']);
        expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('display="chips": each × has a hit area of at least 24 × 24 px round its 22px circle (WCAG 2.5.8)', () => {
        renderUi(<Events defaultValue={['Bounced']} valueProps={{ display: 'chips' }} />);
        // jsdom has no layout: this checks the classes of the transparent square centred on the button; the hit area
        // itself is measured in a browser.
        expect(document.querySelector('[data-slot=multi-select-chip-remove]')).toHaveClass(
            'relative', 'size-5.5', 'after:absolute', 'after:size-6', 'after:top-1/2', 'after:left-1/2', 'after:-translate-1/2',
        );
    });

    it('Backspace on the closed trigger removes the last chosen option', async () => {
        const values = [];
        const { user } = renderUi(<Events defaultValue={['Bounced', 'Opened']} onValueChange={(v) => values.push(v)} />);
        trigger().focus();
        await user.keyboard('{Backspace}');
        expect(values.at(-1)).toEqual(['Bounced']);
    });

    it('selectAll: chooses every option the filter leaves, then clears them', async () => {
        const values = [];
        const { user } = renderUi(<Events contentProps={{ selectAll: true }} indicator="checkbox" onValueChange={(v) => values.push(v)} />, { strings: { selectAll: 'Tout choisir' } });
        await open(user);
        const all = screen.getByRole('checkbox', { name: 'Tout choisir' });
        await user.click(all);
        expect(values.at(-1)).toEqual(EVENTS);
        expect(all).toHaveAttribute('data-state', 'checked');
        expect(document.querySelectorAll('[data-slot=multi-select-item-checkbox]')).toHaveLength(4);
        await expectNoAxeViolations();
        await user.click(all);
        expect(values.at(-1)).toEqual([]);
    });

    it('selectAll is mixed while some options are chosen', async () => {
        const { user } = renderUi(<Events contentProps={{ selectAll: true }} defaultValue={['Opened']} />);
        await open(user);
        expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute('data-state', 'indeterminate');
    });

    it('clear: empties the selection, names the button from the provider and refocuses the trigger', async () => {
        const values = [];
        const { user } = renderUi(<Events defaultValue={['Bounced']} triggerProps={{ clearable: true }} onValueChange={(v) => values.push(v)} />, { strings: { clear: 'Effacer' } });
        await user.click(screen.getByRole('button', { name: 'Effacer' }));
        expect(values.at(-1)).toEqual([]);
        expect(trigger()).toHaveFocus();
        expect(screen.queryByRole('button', { name: 'Effacer' })).toBeNull();
        await expectNoAxeViolations();
    });

    it('reaches the clear button with Tab from the trigger, and clears with Enter', async () => {
        const values = [];
        const { user } = renderUi(<Events defaultValue={['Bounced']} triggerProps={{ clearable: true }} onValueChange={(v) => values.push(v)} />);
        trigger().focus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Clear' })).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(values.at(-1)).toEqual([]);
        expect(trigger()).toHaveFocus();
    });

    it('controlled: the app state follows the choices', async () => {
        function Controlled() {
            const [value, setValue] = useState(['Opened']);
            return (
                <>
                    <Events value={value} onValueChange={setValue} />
                    <p>Chosen: {value.join('|') || 'none'}</p>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await open(user);
        await user.click(screen.getByRole('option', { name: 'Delivered' }));
        expect(screen.getByText('Chosen: Opened|Delivered')).toBeInTheDocument();
        await user.click(screen.getByRole('option', { name: 'Opened' }));
        expect(screen.getByText('Chosen: Delivered')).toBeInTheDocument();
    });

    it('shows groups with their labels', async () => {
        const groups = [
            { value: 'Delivery', items: ['Delivered', 'Deferred'] },
            { value: 'Engagement', items: ['Opened', 'Clicked'] },
        ];
        const { user } = renderUi(
            <MultiSelect items={groups}>
                <MultiSelectTrigger aria-label="Events">
                    <MultiSelectValue placeholder="Any" />
                </MultiSelectTrigger>
                <MultiSelectContent>
                    <MultiSelectList>
                        {(group) => (
                            <MultiSelectGroup key={group.value} items={group.items}>
                                <MultiSelectLabel>{group.value}</MultiSelectLabel>
                                {group.items.map((item) => (
                                    <MultiSelectItem key={item} value={item}>
                                        {item}
                                    </MultiSelectItem>
                                ))}
                            </MultiSelectGroup>
                        )}
                    </MultiSelectList>
                </MultiSelectContent>
            </MultiSelect>,
        );
        await user.click(trigger());
        expect(await screen.findByRole('group', { name: 'Engagement' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('sets data-size and data-variant, from its props or the provider; fluid fills the container', () => {
        renderUi(<Events triggerProps={{ size: 'sm', variant: 'filled', fluid: true }} />);
        expect(trigger()).toHaveAttribute('data-size', 'sm');
        expect(trigger()).toHaveAttribute('data-variant', 'filled');
        expect(trigger().className).toContain('w-full');
    });

    it('takes the provider controlSize and fieldVariant when given none', () => {
        renderUi(<Events />, { controlSize: 'lg', fieldVariant: 'filled' });
        expect(trigger()).toHaveAttribute('data-size', 'lg');
        expect(trigger()).toHaveAttribute('data-variant', 'filled');
    });

    it('does not open while disabled', async () => {
        const { user } = renderUi(<Events disabled defaultValue={['Opened']} />);
        expect(trigger()).toBeDisabled();
        await user.click(trigger());
        expect(screen.queryByRole('listbox')).toBeNull();
        await expectNoAxeViolations();
    });

    it('passes aria-invalid to the trigger', async () => {
        renderUi(<Events triggerProps={{ 'aria-invalid': true }} />);
        expect(trigger()).toHaveAttribute('aria-invalid', 'true');
        await expectNoAxeViolations();
    });

    it('in a dialog: the list renders inside it, a click toggles an option and the dialog stays open', async () => {
        const values = [];
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Webhook</DialogTitle>
                    <DialogDescription>Choose the events.</DialogDescription>
                    <Events onValueChange={(v) => values.push(v)} />
                </DialogContent>
            </Dialog>,
        );
        await user.click(trigger());
        const option = await screen.findByRole('option', { name: 'Complained' });
        expect(option.closest('[data-slot=dialog-content]')).not.toBeNull();
        await user.click(option);
        expect(values.at(-1)).toEqual(['Complained']);
        expect(screen.getByRole('dialog', { name: 'Webhook' })).toBeInTheDocument();
        await waitFor(() => expect(filterInput()).toBeInTheDocument());
        filterInput().focus();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(screen.getByRole('dialog', { name: 'Webhook' })).toBeInTheDocument();
    });

    it('in a popover: the list renders inside it, a click toggles an option, Escape closes the list, then the popover', async () => {
        const values = [];
        const { user } = renderUi(
            <Popover defaultOpen>
                <PopoverContent aria-label="Filters">
                    <Events onValueChange={(v) => values.push(v)} />
                </PopoverContent>
            </Popover>,
        );
        await user.click(trigger());
        const option = await screen.findByRole('option', { name: 'Bounced' });
        expect(option.closest('[data-slot=popover-content]')).not.toBeNull();
        await user.click(option);
        expect(values.at(-1)).toEqual(['Bounced']);
        await waitFor(() => expect(filterInput()).toHaveFocus());
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(document.querySelector('[data-slot=popover-content]')).not.toBeNull();
        expect(trigger()).toHaveFocus();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(document.querySelector('[data-slot=popover-content]')).toBeNull());
    });

    it('a form reset puts an uncontrolled field back to the options it started with', async () => {
        const { user } = renderUi(
            <form aria-label="Webhook">
                <Events name="events" defaultValue={['Bounced']} />
            </form>,
        );
        await open(user);
        await user.click(screen.getByRole('option', { name: 'Opened' }));
        await user.keyboard('{Escape}');
        expect(trigger()).toHaveTextContent('Bounced, Opened');
        act(() => screen.getByRole('form', { name: 'Webhook' }).reset());
        await waitFor(() => expect(trigger()).not.toHaveTextContent('Opened'));
        expect(trigger()).toHaveTextContent('Bounced');
        expect(new FormData(screen.getByRole('form', { name: 'Webhook' })).getAll('events')).toEqual(['Bounced']);
    });

    it('submits each chosen value under name (an object its value); a disabled field submits nothing', () => {
        const agents = [
            { value: 'sc', label: 'Sara Chowdhury' },
            { value: 'ar', label: 'Arif Rahman' },
        ];
        renderUi(
            <form aria-label="Webhook">
                <Events name="events" defaultValue={['Bounced', 'Opened']} />
                <MultiSelect items={agents} defaultValue={[agents[1]]} name="agents">
                    <MultiSelectTrigger aria-label="Agents">
                        <MultiSelectValue />
                    </MultiSelectTrigger>
                </MultiSelect>
                <MultiSelect items={EVENTS} defaultValue={['Delivered']} name="locked" disabled>
                    <MultiSelectTrigger aria-label="Locked">
                        <MultiSelectValue />
                    </MultiSelectTrigger>
                </MultiSelect>
            </form>,
        );
        const data = new FormData(screen.getByRole('form', { name: 'Webhook' }));
        expect(data.getAll('events')).toEqual(['Bounced', 'Opened']);
        expect(data.getAll('agents')).toEqual(['ar']);
        expect(data.getAll('locked')).toEqual([]);
    });

    it('in a sheet: a click toggles an option and the sheet stays open', async () => {
        const values = [];
        const { user } = renderUi(
            <Sheet defaultOpen>
                <SheetContent>
                    <SheetTitle>Webhook</SheetTitle>
                    <SheetDescription>Choose the events.</SheetDescription>
                    <Events onValueChange={(v) => values.push(v)} />
                </SheetContent>
            </Sheet>,
        );
        await user.click(trigger());
        await user.click(await screen.findByRole('option', { name: 'Opened' }));
        expect(values.at(-1)).toEqual(['Opened']);
        expect(screen.getByRole('dialog', { name: 'Webhook' })).toBeInTheDocument();
    });
});
