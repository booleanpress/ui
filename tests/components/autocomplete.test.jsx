import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import {
    Autocomplete,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteGroup,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
    AutocompleteStatus,
} from '@/components/autocomplete';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { Popover, PopoverContent } from '@/components/popover';
import AutocompleteAsyncExample from '../../examples/autocomplete/async.tsx';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/sheet';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const TAGS = ['billing', 'bounce', 'dkim', 'dns', 'refund'];

function Tag({ inputProps = {}, withEmpty = false, ...props }) {
    return (
        <Autocomplete items={TAGS} {...props}>
            <AutocompleteInput aria-label="Tag" {...inputProps} />
            <AutocompleteContent>
                {withEmpty && <AutocompleteEmpty />}
                <AutocompleteList>
                    {(tag) => (
                        <AutocompleteItem key={tag} value={tag}>
                            {tag}
                        </AutocompleteItem>
                    )}
                </AutocompleteList>
            </AutocompleteContent>
        </Autocomplete>
    );
}

const input = () => screen.getByRole('combobox', { name: 'Tag' });
const highlighted = () => document.querySelector('[data-slot=autocomplete-item][data-highlighted]');

describe('Autocomplete', () => {
    it('keeps free text that matches no suggestion', async () => {
        const values = [];
        const { user } = renderUi(<Tag onValueChange={(v) => values.push(v)} />);
        await user.click(input());
        await user.keyboard('urgent');
        await user.tab();
        expect(input()).toHaveValue('urgent');
        expect(values.at(-1)).toBe('urgent');
    });

    it('filters the suggestions as you type', async () => {
        const { user } = renderUi(<Tag />);
        await user.click(input());
        await user.keyboard('b');
        const listbox = await screen.findByRole('listbox');
        await waitFor(() => expect(within(listbox).getAllByRole('option').map((o) => o.textContent)).toEqual(['billing', 'bounce']));
        await expectNoAxeViolations();
    });

    it('highlights suggestions with ArrowDown and ArrowUp', async () => {
        const { user } = renderUi(<Tag />);
        await user.click(input());
        await user.keyboard('d');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}');
        expect(highlighted()).toHaveTextContent('dkim');
        await user.keyboard('{ArrowDown}');
        expect(highlighted()).toHaveTextContent('dns');
        await user.keyboard('{ArrowUp}');
        expect(highlighted()).toHaveTextContent('dkim');
        expect(input()).toHaveAttribute('aria-activedescendant', highlighted().id);
    });

    it('fills the field with the highlighted suggestion on Enter and closes', async () => {
        const { user } = renderUi(<Tag />);
        await user.click(input());
        await user.keyboard('re');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}{Enter}');
        expect(input()).toHaveValue('refund');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    });

    it('closes with Escape and keeps the typed text', async () => {
        const { user } = renderUi(<Tag />);
        await user.click(input());
        await user.keyboard('bo');
        await screen.findByRole('listbox');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(input()).toHaveValue('bo');
    });

    it('moves the text cursor with Home and End', async () => {
        const { user } = renderUi(<Tag />);
        await user.click(input());
        await user.keyboard('bill');
        await user.keyboard('{Home}');
        expect(input().selectionStart).toBe(0);
        await user.keyboard('{End}');
        expect(input().selectionStart).toBe(4);
    });

    it('inline completion (mode="both") puts the highlighted suggestion in the field', async () => {
        const { user } = renderUi(<Tag mode="both" />);
        await user.click(input());
        await user.keyboard('dn');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}');
        expect(input()).toHaveValue('dns');
        expect(input()).toHaveAttribute('aria-autocomplete', 'both');
    });

    it('chooses a suggestion with a click', async () => {
        const { user } = renderUi(<Tag />);
        await user.click(input());
        await user.keyboard('k');
        await user.click(await screen.findByRole('option', { name: 'dkim' }));
        expect(input()).toHaveValue('dkim');
    });

    it('shows the provider’s "No results" with AutocompleteEmpty', async () => {
        const { user } = renderUi(<Tag withEmpty />, { strings: { noResults: 'Keine Treffer' } });
        await user.click(input());
        await user.keyboard('zzz');
        await waitFor(() => expect(screen.getByText('Keine Treffer')).toBeInTheDocument());
    });

    it('clears with the clear button, named from the provider', async () => {
        const { user } = renderUi(<Tag defaultValue="refund" inputProps={{ showClear: true }} />, { strings: { clear: 'Effacer' } });
        await user.click(screen.getByRole('button', { name: 'Effacer', hidden: true }));
        expect(input()).toHaveValue('');
        expect(input()).toHaveFocus();
    });

    it('async: announces loading, then shows the suggestions', async () => {
        // The request stays open until the test answers it, so the loading state is seen however busy the machine is.
        let answer;
        function Async() {
            const [items, setItems] = useState([]);
            const [loading, setLoading] = useState(false);
            return (
                <Autocomplete
                    items={items}
                    filter={null}
                    onValueChange={(query) => {
                        setLoading(true);
                        answer = () => {
                            setItems(TAGS.filter((t) => t.includes(query)));
                            setLoading(false);
                        };
                    }}
                >
                    <AutocompleteInput aria-label="Tag" loading={loading} />
                    <AutocompleteContent>
                        <AutocompleteStatus loading={loading} />
                        <AutocompleteList>
                            {(tag) => (
                                <AutocompleteItem key={tag} value={tag}>
                                    {tag}
                                </AutocompleteItem>
                            )}
                        </AutocompleteList>
                    </AutocompleteContent>
                </Autocomplete>
            );
        }
        const { user } = renderUi(<Async />, { strings: { loadingResults: 'Chargement…' } });
        await user.click(input());
        await user.keyboard('n');
        expect(await screen.findByRole('status')).toHaveTextContent('Chargement…');
        expect(document.querySelector('[data-slot=autocomplete-loading]')).not.toBeNull();
        act(() => answer());
        expect(await screen.findByRole('option', { name: 'bounce' })).toBeInTheDocument();
        expect(document.querySelector('[data-slot=autocomplete-loading]')).toBeNull();
        await expectNoAxeViolations();
    });

    it('shows groups with their labels', async () => {
        const groups = [
            { value: 'Recent', items: ['bounce rate'] },
            { value: 'Mailers', items: ['Postmark', 'SendGrid'] },
        ];
        const { user } = renderUi(
            <Autocomplete items={groups}>
                <AutocompleteInput aria-label="Tag" />
                <AutocompleteContent>
                    <AutocompleteList>
                        {(group) => (
                            <AutocompleteGroup key={group.value} items={group.items}>
                                <AutocompleteLabel>{group.value}</AutocompleteLabel>
                                {group.items.map((item) => (
                                    <AutocompleteItem key={item} value={item}>
                                        {item}
                                    </AutocompleteItem>
                                ))}
                            </AutocompleteGroup>
                        )}
                    </AutocompleteList>
                </AutocompleteContent>
            </Autocomplete>,
        );
        await user.click(input());
        await user.keyboard('s');
        expect(await screen.findByRole('group', { name: 'Mailers' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('sets data-size and data-variant on the field', async () => {
        renderUi(<Tag inputProps={{ size: 'sm', variant: 'filled' }} />);
        const group = input().closest('[data-slot=input-group]');
        expect(group).toHaveAttribute('data-size', 'sm');
        expect(group).toHaveAttribute('data-variant', 'filled');
        await expectNoAxeViolations();
    });

    it('takes the provider controlSize when given none', () => {
        renderUi(<Tag />, { controlSize: 'lg' });
        expect(input().closest('[data-slot=input-group]')).toHaveAttribute('data-size', 'lg');
    });

    it('is disabled and invalid on request', async () => {
        renderUi(
            <>
                <Tag disabled inputProps={{ disabled: true }} />
                <Autocomplete items={TAGS}>
                    <AutocompleteInput aria-label="Domain" aria-invalid />
                </Autocomplete>
            </>,
        );
        expect(input()).toBeDisabled();
        expect(screen.getByRole('combobox', { name: 'Domain' })).toHaveAttribute('aria-invalid', 'true');
        await expectNoAxeViolations();
    });

    it('in a dialog: a click fills the field, the dialog stays open, Escape closes the list first', async () => {
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Tag the ticket</DialogTitle>
                    <DialogDescription>Add a tag.</DialogDescription>
                    <Tag />
                </DialogContent>
            </Dialog>,
        );
        await user.click(input());
        await user.keyboard('b');
        const option = await screen.findByRole('option', { name: 'bounce' });
        expect(document.body.style.pointerEvents).toBe('none');
        await user.click(option);
        expect(input()).toHaveValue('bounce');
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await user.keyboard('{Backspace}');
        await screen.findByRole('listbox');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('in a popover: a click fills the field and the popover stays open; Escape closes the list, then the popover', async () => {
        const { user } = renderUi(
            <Popover defaultOpen>
                <PopoverContent aria-label="Tagging">
                    <Tag />
                </PopoverContent>
            </Popover>,
        );
        await user.click(input());
        await user.keyboard('re');
        await user.click(await screen.findByRole('option', { name: 'refund' }));
        expect(input()).toHaveValue('refund');
        expect(document.querySelector('[data-slot=popover-content]')).not.toBeNull();
        await user.keyboard('{Backspace}');
        await screen.findByRole('listbox');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(document.querySelector('[data-slot=popover-content]')).not.toBeNull();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(document.querySelector('[data-slot=popover-content]')).toBeNull());
    });

    it('submits the text under name, a suggestion or not', async () => {
        const { user } = renderUi(
            <form aria-label="Ticket">
                <Tag name="tag" />
            </form>,
        );
        await user.click(input());
        await user.keyboard('urgent');
        expect(new FormData(screen.getByRole('form', { name: 'Ticket' })).get('tag')).toBe('urgent');
    });

    it('keeps the name of its label while the list is open, when Base UI hides the label', async () => {
        const { user } = renderUi(
            <>
                <label htmlFor="ticket-tag">Ticket tag</label>
                <Tag inputProps={{ id: 'ticket-tag', 'aria-label': undefined }} />
            </>,
        );
        const field = screen.getByRole('combobox', { name: 'Ticket tag' });
        await user.click(field);
        await user.keyboard('b');
        await screen.findByRole('listbox');
        await waitFor(() => expect(screen.getByText('Ticket tag', { selector: 'label' })).toHaveAttribute('aria-hidden', 'true'));
        expect(field).toHaveAttribute('aria-label', 'Ticket tag');
        expect(screen.getByRole('combobox', { name: 'Ticket tag' })).toBe(field);
        await expectNoAxeViolations();
    });

    it('goes back to its defaultValue when its form resets, and tells onValueChange', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <form aria-label="Ticket">
                <Tag name="tag" defaultValue="billing" onValueChange={onValueChange} />
            </form>,
        );
        const form = screen.getByRole('form', { name: 'Ticket' });
        await user.clear(input());
        await user.keyboard('urgent');
        await user.keyboard('{Escape}');
        expect(new FormData(form).get('tag')).toBe('urgent');
        onValueChange.mockClear();
        act(() => form.reset());
        await waitFor(() => expect(input()).toHaveValue('billing'));
        expect(new FormData(form).get('tag')).toBe('billing');
        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(onValueChange.mock.calls[0][0]).toBe('billing');
        expect(onValueChange.mock.calls[0][1]).toMatchObject({ reason: 'none' });
    });

    it('controlled: a form reset calls onValueChange with the text it started with', async () => {
        const changes = [];
        function Controlled() {
            const [value, setValue] = useState('dns');
            return (
                <form aria-label="Ticket">
                    <Tag
                        value={value}
                        onValueChange={(next) => {
                            changes.push(next);
                            setValue(next);
                        }}
                    />
                </form>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.clear(input());
        await user.keyboard('refund');
        await user.keyboard('{Escape}');
        changes.length = 0;
        act(() => screen.getByRole('form', { name: 'Ticket' }).reset());
        await waitFor(() => expect(input()).toHaveValue('dns'));
        expect(changes).toEqual(['dns']);
    });

    it('async example: clearing the text while a search runs stops the spinner', async () => {
        const { user } = renderUi(<AutocompleteAsyncExample />);
        const field = screen.getByRole('combobox', { name: 'Search the help centre' });
        await user.click(field);
        await user.keyboard('dkim');
        expect(document.querySelector('[data-slot=autocomplete-loading]')).not.toBeNull();
        await user.clear(field);
        await new Promise((resolve) => setTimeout(resolve, 700));
        expect(document.querySelector('[data-slot=autocomplete-loading]')).toBeNull();
    });

    it('in a sheet: a click fills the field and the sheet stays open', async () => {
        const { user } = renderUi(
            <Sheet defaultOpen>
                <SheetContent>
                    <SheetTitle>Tag the ticket</SheetTitle>
                    <SheetDescription>Add a tag.</SheetDescription>
                    <Tag />
                </SheetContent>
            </Sheet>,
        );
        await user.click(input());
        await user.keyboard('d');
        await user.click(await screen.findByRole('option', { name: 'dns' }));
        expect(input()).toHaveValue('dns');
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});

describe('Autocomplete disabled on the root', () => {
    it('disables the input, which submits nothing', () => {
        const { container } = renderUi(
            <form>
                <Tag name="tag" defaultValue="billing" disabled />
            </form>
        );
        expect(screen.getByRole('combobox', { name: 'Tag' })).toBeDisabled();
        expect(new FormData(container.querySelector('form')).has('tag')).toBe(false);
    });
});
