import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxStatus,
    ComboboxValue,
    useComboboxAnchor,
} from '@/components/combobox';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { Popover, PopoverContent } from '@/components/popover';
import ComboboxAsyncExample from '../../examples/combobox/async.tsx';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/sheet';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const MAILERS = ['Amazon SES', 'Mailgun', 'Postmark', 'SendGrid'];

function Mailer({ inputProps = {}, ...props }) {
    return (
        <Combobox items={MAILERS} {...props}>
            <ComboboxInput aria-label="Mailer" placeholder="Choose a mailer" {...inputProps} />
            <ComboboxContent>
                <ComboboxEmpty />
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

const input = () => screen.getByRole('combobox', { name: 'Mailer' });
const highlighted = () => document.querySelector('[data-slot=combobox-item][data-highlighted]');

describe('Combobox', () => {
    it('opens with ArrowDown and highlights the options in turn', async () => {
        const { user } = renderUi(<Mailer />);
        input().focus();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('listbox');
        await waitFor(() => expect(highlighted()).toHaveTextContent('Amazon SES'));
        await user.keyboard('{ArrowDown}');
        expect(highlighted()).toHaveTextContent('Mailgun');
        expect(input()).toHaveAttribute('aria-activedescendant', highlighted().id);
        await expectNoAxeViolations();
    });

    it('moves up with ArrowUp', async () => {
        const { user } = renderUi(<Mailer />);
        input().focus();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}');
        expect(highlighted()).toHaveTextContent('Mailgun');
    });

    it('chooses the highlighted option with Enter, fills the field and closes', async () => {
        const values = [];
        const { user } = renderUi(<Mailer onValueChange={(v) => values.push(v)} />);
        input().focus();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}{Enter}');
        expect(values).toEqual(['Mailgun']);
        expect(input()).toHaveValue('Mailgun');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    });

    it('filters the options as you type', async () => {
        const { user } = renderUi(<Mailer />);
        await user.click(input());
        await user.keyboard('post');
        const listbox = await screen.findByRole('listbox');
        await waitFor(() => expect(within(listbox).getAllByRole('option')).toHaveLength(1));
        expect(within(listbox).getByRole('option')).toHaveTextContent('Postmark');
    });

    it('shows the provider’s "No results" when nothing matches', async () => {
        const { user } = renderUi(<Mailer />, { strings: { noResults: 'Aucun résultat' } });
        await user.click(input());
        await user.keyboard('zzz');
        await waitFor(() => expect(screen.getByText('Aucun résultat')).toBeInTheDocument());
        await expectNoAxeViolations();
    });

    it('closes with Escape without choosing', async () => {
        const values = [];
        const { user } = renderUi(<Mailer onValueChange={(v) => values.push(v)} />);
        input().focus();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(values).toEqual([]);
        expect(input()).toHaveFocus();
    });

    it('moves the text cursor to the start and the end with Home and End, as in any text field', async () => {
        const { user } = renderUi(<Mailer />);
        await user.click(input());
        await user.keyboard('mail');
        await screen.findByRole('listbox');
        await user.keyboard('{Home}');
        expect(input().selectionStart).toBe(0);
        await user.keyboard('{End}');
        expect(input().selectionStart).toBe(4);
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('chooses with a click', async () => {
        const values = [];
        const { user } = renderUi(<Mailer onValueChange={(v) => values.push(v)} />);
        await user.click(screen.getByRole('button', { name: 'Show options' }));
        await user.click(await screen.findByRole('option', { name: 'Postmark' }));
        expect(values).toEqual(['Postmark']);
        expect(input()).toHaveValue('Postmark');
    });

    it('names the chevron button from the provider', () => {
        renderUi(<Mailer />, { strings: { toggleOptions: 'Afficher les options' } });
        expect(screen.getByRole('button', { name: 'Afficher les options', hidden: true })).toBeInTheDocument();
    });

    it('marks the chosen option selected with a check', async () => {
        const { user } = renderUi(<Mailer defaultValue="Postmark" />);
        await user.click(screen.getByRole('button', { name: 'Show options' }));
        const option = await screen.findByRole('option', { name: 'Postmark' });
        expect(option).toHaveAttribute('aria-selected', 'true');
        expect(option).toHaveAttribute('data-selected');
        expect(option.querySelector('[data-slot=combobox-item-indicator] svg')).not.toBeNull();
        await expectNoAxeViolations();
    });

    it('clears with the clear button, named from the provider, and keeps focus in the field', async () => {
        const values = [];
        const { user } = renderUi(<Mailer defaultValue="Mailgun" onValueChange={(v) => values.push(v)} inputProps={{ showClear: true }} />);
        expect(input()).toHaveValue('Mailgun');
        await user.click(screen.getByRole('button', { name: 'Clear', hidden: true }));
        expect(values).toEqual([null]);
        expect(input()).toHaveValue('');
        expect(input()).toHaveFocus();
    });

    it('sets data-size and data-variant on the field, from its props or the provider', async () => {
        renderUi(
            <>
                <Mailer inputProps={{ size: 'sm', 'aria-label': 'Small' }} />
                <Mailer inputProps={{ size: 'lg', variant: 'filled', 'aria-label': 'Large' }} />
            </>,
            { controlSize: 'default' },
        );
        const small = screen.getByRole('combobox', { name: 'Small' }).closest('[data-slot=input-group]');
        const large = screen.getByRole('combobox', { name: 'Large' }).closest('[data-slot=input-group]');
        expect(small).toHaveAttribute('data-size', 'sm');
        expect(large).toHaveAttribute('data-size', 'lg');
        expect(large).toHaveAttribute('data-variant', 'filled');
        await expectNoAxeViolations();
    });

    it('takes the provider controlSize and fieldVariant when given none', () => {
        renderUi(<Mailer />, { controlSize: 'lg', fieldVariant: 'filled' });
        const group = input().closest('[data-slot=input-group]');
        expect(group).toHaveAttribute('data-size', 'lg');
        expect(group).toHaveAttribute('data-variant', 'filled');
    });

    it('does not open while disabled', async () => {
        const { user } = renderUi(<Mailer disabled inputProps={{ disabled: true }} />);
        expect(input()).toBeDisabled();
        await user.click(input());
        expect(screen.queryByRole('listbox')).toBeNull();
        await expectNoAxeViolations();
    });

    it('passes aria-invalid to the input', async () => {
        renderUi(<Mailer inputProps={{ 'aria-invalid': true }} />);
        expect(input()).toHaveAttribute('aria-invalid', 'true');
        await expectNoAxeViolations();
    });

    it('shows groups with their labels', async () => {
        const groups = [
            { value: 'API', items: ['Amazon SES', 'Postmark'] },
            { value: 'SMTP', items: ['Gmail SMTP'] },
        ];
        const { user } = renderUi(
            <Combobox items={groups}>
                <ComboboxInput aria-label="Mailer" />
                <ComboboxContent>
                    <ComboboxList>
                        {(group) => (
                            <ComboboxGroup key={group.value} items={group.items}>
                                <ComboboxLabel>{group.value}</ComboboxLabel>
                                {group.items.map((item) => (
                                    <ComboboxItem key={item} value={item}>
                                        {item}
                                    </ComboboxItem>
                                ))}
                            </ComboboxGroup>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>,
        );
        await user.click(input());
        expect(await screen.findByRole('group', { name: 'SMTP' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('async: announces loading in the status, then shows the results', async () => {
        // The request stays open until the test answers it, so the loading state is seen however busy the machine is.
        let answer;
        function Async() {
            const [items, setItems] = useState([]);
            const [loading, setLoading] = useState(false);
            return (
                <Combobox
                    items={items}
                    filter={null}
                    onInputValueChange={(query) => {
                        setLoading(true);
                        answer = () => {
                            setItems(MAILERS.filter((m) => m.toLowerCase().includes(query.toLowerCase())));
                            setLoading(false);
                        };
                    }}
                >
                    <ComboboxInput aria-label="Mailer" loading={loading} />
                    <ComboboxContent>
                        <ComboboxStatus>{loading ? 'Loading results…' : null}</ComboboxStatus>
                        <ComboboxList>
                            {(item) => (
                                <ComboboxItem key={item} value={item}>
                                    {item}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            );
        }
        const { user } = renderUi(<Async />);
        await user.click(input());
        await user.keyboard('mail');
        expect(document.querySelector('[data-slot=combobox-loading]')).not.toBeNull();
        expect(screen.getByRole('status')).toHaveTextContent('Loading results…');
        act(() => answer());
        expect(await screen.findByRole('option', { name: 'Mailgun' })).toBeInTheDocument();
        expect(document.querySelector('[data-slot=combobox-loading]')).toBeNull();
        await expectNoAxeViolations();
    });

    it('multiple: chips in the field, removed with Backspace from an empty input', async () => {
        function Chips() {
            const anchor = useComboboxAnchor();
            return (
                <Combobox items={MAILERS} multiple defaultValue={['Postmark', 'Mailgun']}>
                    <ComboboxChips ref={anchor}>
                        <ComboboxValue>
                            {(values) => values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)}
                        </ComboboxValue>
                        <ComboboxChipsInput aria-label="Mailers" />
                    </ComboboxChips>
                    <ComboboxContent anchor={anchor}>
                        <ComboboxList>
                            {(item) => (
                                <ComboboxItem key={item} value={item}>
                                    {item}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            );
        }
        const { user } = renderUi(<Chips />);
        expect(screen.getByRole('button', { name: 'Remove Mailgun', hidden: true })).toBeInTheDocument();
        await expectNoAxeViolations();
        screen.getByRole('combobox', { name: 'Mailers' }).focus();
        await user.keyboard('{Backspace}');
        expect(screen.queryByRole('button', { name: 'Remove Mailgun', hidden: true })).toBeNull();
        expect(screen.getByRole('button', { name: 'Remove Postmark', hidden: true })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Remove Postmark', hidden: true }));
        expect(document.querySelectorAll('[data-slot=combobox-chip]')).toHaveLength(0);
    });

    it('multiple: each chip’s remove button has a hit area of at least 24 × 24 px round its 22px circle (WCAG 2.5.8)', () => {
        renderUi(
            <Combobox items={MAILERS} multiple defaultValue={['Postmark']}>
                <ComboboxChips>
                    <ComboboxValue>{(values) => values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)}</ComboboxValue>
                    <ComboboxChipsInput aria-label="Mailers" />
                </ComboboxChips>
            </Combobox>,
        );
        // jsdom has no layout: this checks the classes of the transparent square centred on the button; the hit area
        // itself is measured in a browser.
        expect(screen.getByRole('button', { name: 'Remove Postmark', hidden: true })).toHaveClass(
            'relative', 'size-5.5', 'after:absolute', 'after:size-6', 'after:top-1/2', 'after:left-1/2', 'after:-translate-1/2',
        );
    });

    it('multiple: the arrow keys move between the input and the chips, flipped right to left', async () => {
        function Chips() {
            return (
                <Combobox items={MAILERS} multiple defaultValue={['Postmark', 'Mailgun']}>
                    <ComboboxChips>
                        <ComboboxValue>{(values) => values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)}</ComboboxValue>
                        <ComboboxChipsInput aria-label="Mailers" />
                    </ComboboxChips>
                </Combobox>
            );
        }
        const chip = (name) => screen.getByText(name).closest('[data-slot=combobox-chip]');
        const ltr = renderUi(<Chips />);
        screen.getByRole('combobox', { name: 'Mailers' }).focus();
        await ltr.user.keyboard('{ArrowLeft}');
        expect(chip('Mailgun')).toHaveFocus();
        await ltr.user.keyboard('{ArrowLeft}');
        expect(chip('Postmark')).toHaveFocus();
        ltr.unmount();

        const rtl = renderUi(<Chips />, { dir: 'rtl' });
        screen.getByRole('combobox', { name: 'Mailers' }).focus();
        await rtl.user.keyboard('{ArrowLeft}');
        expect(screen.getByRole('combobox', { name: 'Mailers' })).toHaveFocus();
        await rtl.user.keyboard('{ArrowRight}');
        expect(chip('Mailgun')).toHaveFocus();
        await rtl.user.keyboard('{ArrowRight}');
        expect(chip('Postmark')).toHaveFocus();
        await rtl.user.keyboard('{ArrowLeft}{ArrowLeft}');
        expect(screen.getByRole('combobox', { name: 'Mailers' })).toHaveFocus();
    });

    it('in a dialog: a click on an option picks it and the dialog stays open', async () => {
        const values = [];
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Route a mailer</DialogTitle>
                    <DialogDescription>Pick the mailer for this route.</DialogDescription>
                    <Mailer onValueChange={(v) => values.push(v)} />
                </DialogContent>
            </Dialog>,
        );
        await user.click(input());
        await screen.findByRole('listbox');
        // The modal dialog turns pointer events off on the page; the list takes them back.
        expect(document.body.style.pointerEvents).toBe('none');
        await user.click(screen.getByRole('option', { name: 'SendGrid' }));
        expect(values).toEqual(['SendGrid']);
        expect(input()).toHaveValue('SendGrid');
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('in a dialog: Escape closes the list, not the dialog', async () => {
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Route a mailer</DialogTitle>
                    <DialogDescription>Pick the mailer for this route.</DialogDescription>
                    <Mailer />
                </DialogContent>
            </Dialog>,
        );
        await user.click(input());
        await screen.findByRole('listbox');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(input()).toHaveFocus();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('in a popover: a click picks and the popover stays open; Escape closes the list, then the popover', async () => {
        const values = [];
        const { user } = renderUi(
            <Popover defaultOpen>
                <PopoverContent aria-label="Route">
                    <Mailer onValueChange={(v) => values.push(v)} />
                </PopoverContent>
            </Popover>,
        );
        await user.click(input());
        await user.click(await screen.findByRole('option', { name: 'Postmark' }));
        expect(values).toEqual(['Postmark']);
        expect(document.querySelector('[data-slot=popover-content]')).not.toBeNull();
        await user.click(input());
        await screen.findByRole('listbox');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(document.querySelector('[data-slot=popover-content]')).not.toBeNull();
        expect(input()).toHaveFocus();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(document.querySelector('[data-slot=popover-content]')).toBeNull());
    });

    it('submits the chosen value under name, one hidden input per value with multiple', () => {
        function Chips() {
            return (
                <Combobox items={MAILERS} multiple defaultValue={['Postmark', 'Mailgun']} name="fallbacks">
                    <ComboboxChips>
                        <ComboboxValue>{(values) => values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)}</ComboboxValue>
                        <ComboboxChipsInput aria-label="Fallbacks" />
                    </ComboboxChips>
                </Combobox>
            );
        }
        renderUi(
            <form aria-label="Routing">
                <Mailer name="mailer" defaultValue="SendGrid" />
                <Chips />
            </form>,
        );
        const data = new FormData(screen.getByRole('form', { name: 'Routing' }));
        expect(data.getAll('mailer')).toEqual(['SendGrid']);
        expect(data.getAll('fallbacks')).toEqual(['Postmark', 'Mailgun']);
    });

    it('keeps the name of its label while the list is open, when Base UI hides the label', async () => {
        const { user } = renderUi(
            <>
                <label htmlFor="route-mailer">Mailer</label>
                <Mailer inputProps={{ id: 'route-mailer', 'aria-label': undefined }} />
            </>,
        );
        const field = screen.getByRole('combobox', { name: 'Mailer' });
        field.focus();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('listbox');
        // Base UI hides everything outside the input and the list from assistive technology, the label included.
        await waitFor(() => expect(screen.getByText('Mailer', { selector: 'label' })).toHaveAttribute('aria-hidden', 'true'));
        expect(field).toHaveAttribute('aria-label', 'Mailer');
        expect(screen.getByRole('combobox', { name: 'Mailer' })).toBe(field);
        await expectNoAxeViolations();
    });

    it('takes its name from a label round it, leaving out hidden text, and follows a change of the label’s text', async () => {
        function Labelled() {
            const [text, setText] = useState('Mailer');
            return (
                <>
                    <label>
                        <span>{text}</span> <span aria-hidden="true">*</span>
                        <Combobox items={MAILERS}>
                            <ComboboxInput />
                            <ComboboxContent>
                                <ComboboxList>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </label>
                    <button type="button" onClick={() => setText('Fallback mailer')}>
                        Rename
                    </button>
                </>
            );
        }
        const { user } = renderUi(<Labelled />);
        const field = screen.getByRole('combobox');
        expect(field).toHaveAttribute('aria-label', 'Mailer');
        await user.click(screen.getByRole('button', { name: 'Rename' }));
        await waitFor(() => expect(field).toHaveAttribute('aria-label', 'Fallback mailer'));
        field.focus();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('listbox');
        // Base UI hides the label's text beside the field while open; the name was read before, as the list opened.
        await waitFor(() => expect(screen.getByText('Fallback mailer')).toHaveAttribute('aria-hidden', 'true'));
        expect(screen.getByRole('combobox', { name: 'Fallback mailer' })).toBe(field);
    });

    it('leaves the name of an input named by aria-labelledby or aria-label alone', () => {
        renderUi(
            <>
                <label htmlFor="labelled-mailer">Visible label</label>
                <span id="mailer-name">Route mailer</span>
                <Mailer inputProps={{ id: 'labelled-mailer', 'aria-label': undefined, 'aria-labelledby': 'mailer-name' }} />
                <label htmlFor="named-mailer">Another label</label>
                <Combobox items={MAILERS}>
                    <ComboboxInput id="named-mailer" aria-label="Backup mailer" />
                </Combobox>
            </>,
        );
        expect(screen.getByRole('combobox', { name: 'Route mailer' })).not.toHaveAttribute('aria-label');
        expect(screen.getByRole('combobox', { name: 'Backup mailer' })).toHaveAttribute('aria-label', 'Backup mailer');
    });

    it('multiple: the chips input keeps its label’s name while the list is open', async () => {
        const { user } = renderUi(
            <>
                <label htmlFor="fallback-mailers">Fallback mailers</label>
                <Combobox items={MAILERS} multiple>
                    <ComboboxChips>
                        <ComboboxValue>{(values) => values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)}</ComboboxValue>
                        <ComboboxChipsInput id="fallback-mailers" />
                    </ComboboxChips>
                    <ComboboxContent>
                        <ComboboxList>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </>,
        );
        screen.getByRole('combobox', { name: 'Fallback mailers' }).focus();
        await user.keyboard('{ArrowDown}');
        await screen.findByRole('listbox');
        await waitFor(() => expect(screen.getByText('Fallback mailers')).toHaveAttribute('aria-hidden', 'true'));
        expect(screen.getByRole('combobox', { name: 'Fallback mailers' })).toHaveAttribute('aria-label', 'Fallback mailers');
    });

    it('goes back to its defaultValue when its form resets, single and multiple, and tells onValueChange', async () => {
        const onValueChange = vi.fn();
        function Chips() {
            return (
                <Combobox items={MAILERS} multiple defaultValue={['Postmark']} name="fallbacks">
                    <ComboboxChips>
                        <ComboboxValue>{(values) => values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)}</ComboboxValue>
                        <ComboboxChipsInput aria-label="Fallbacks" />
                    </ComboboxChips>
                    <ComboboxContent>
                        <ComboboxList>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
                    </ComboboxContent>
                </Combobox>
            );
        }
        const { user } = renderUi(
            <form aria-label="Routing">
                <Mailer name="mailer" defaultValue="SendGrid" onValueChange={onValueChange} />
                <Chips />
            </form>,
        );
        const form = screen.getByRole('form', { name: 'Routing' });
        await user.click(input());
        await user.click(await screen.findByRole('option', { name: 'Mailgun' }));
        expect(input()).toHaveValue('Mailgun');
        await user.click(screen.getByRole('combobox', { name: 'Fallbacks' }));
        await user.click(await screen.findByRole('option', { name: 'Amazon SES' }));
        expect(new FormData(form).getAll('fallbacks')).toEqual(['Postmark', 'Amazon SES']);
        onValueChange.mockClear();
        act(() => form.reset());
        await waitFor(() => expect(input()).toHaveValue('SendGrid'));
        expect(new FormData(form).getAll('mailer')).toEqual(['SendGrid']);
        expect(new FormData(form).getAll('fallbacks')).toEqual(['Postmark']);
        expect(document.querySelectorAll('[data-slot=combobox-chip]')).toHaveLength(1);
        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(onValueChange.mock.calls[0][0]).toBe('SendGrid');
        expect(onValueChange.mock.calls[0][1]).toMatchObject({ reason: 'none', isCanceled: false });
    });

    it('controlled: a form reset calls onValueChange with the value it started with', async () => {
        const changes = [];
        function Controlled() {
            const [value, setValue] = useState('Postmark');
            const [mailers, setMailers] = useState([]);
            return (
                <form aria-label="Routing">
                    <Mailer
                        value={value}
                        onValueChange={(next) => {
                            changes.push(next);
                            setValue(next);
                        }}
                    />
                    <Combobox items={MAILERS} multiple value={mailers} onValueChange={setMailers}>
                        <ComboboxChips>
                            <ComboboxValue>{(values) => values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)}</ComboboxValue>
                            <ComboboxChipsInput aria-label="Fallbacks" />
                        </ComboboxChips>
                        <ComboboxContent>
                            <ComboboxList>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </form>
            );
        }
        const { user } = renderUi(<Controlled />);
        const form = screen.getByRole('form', { name: 'Routing' });
        act(() => form.reset());
        await new Promise((resolve) => setTimeout(resolve, 10));
        // Nothing changed yet: nothing to tell.
        expect(changes).toEqual([]);
        await user.click(input());
        await user.click(await screen.findByRole('option', { name: 'Mailgun' }));
        await user.click(screen.getByRole('combobox', { name: 'Fallbacks' }));
        await user.click(await screen.findByRole('option', { name: 'SendGrid' }));
        expect(document.querySelectorAll('[data-slot=combobox-chip]')).toHaveLength(1);
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        act(() => form.reset());
        await waitFor(() => expect(input()).toHaveValue('Postmark'));
        expect(changes).toEqual(['Mailgun', 'Postmark']);
        await waitFor(() => expect(document.querySelectorAll('[data-slot=combobox-chip]')).toHaveLength(0));
    });

    it('resets after a React form action, and the field keeps the focus it had', async () => {
        const submitted = [];
        const { user } = renderUi(
            <form aria-label="Routing" action={(data) => submitted.push(data.get('mailer'))}>
                <Mailer name="mailer" defaultValue="SendGrid" />
            </form>,
        );
        await user.click(input());
        await user.click(await screen.findByRole('option', { name: 'Postmark' }));
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(input()).toHaveFocus();
        act(() => screen.getByRole('form', { name: 'Routing' }).requestSubmit());
        await waitFor(() => expect(submitted).toEqual(['Postmark']));
        await waitFor(() => expect(input()).toHaveValue('SendGrid'));
        expect(input()).toHaveFocus();
    });

    it('async example: clearing the text while a search runs stops the spinner', async () => {
        const { user } = renderUi(<ComboboxAsyncExample />);
        const field = screen.getByRole('combobox', { name: 'Organisation' });
        await user.click(field);
        await user.keyboard('acme');
        expect(document.querySelector('[data-slot=combobox-loading]')).not.toBeNull();
        await user.clear(field);
        await new Promise((resolve) => setTimeout(resolve, 700));
        expect(document.querySelector('[data-slot=combobox-loading]')).toBeNull();
        await user.keyboard('fjord');
        expect(await screen.findByRole('option', { name: 'Fjord Energy' }, { timeout: 2000 })).toBeInTheDocument();
        expect(document.querySelector('[data-slot=combobox-loading]')).toBeNull();
    });

    it('in a sheet: a click picks and the sheet stays open', async () => {
        const values = [];
        const { user } = renderUi(
            <Sheet defaultOpen>
                <SheetContent>
                    <SheetTitle>Route a mailer</SheetTitle>
                    <SheetDescription>Pick the mailer for this route.</SheetDescription>
                    <Mailer onValueChange={(v) => values.push(v)} />
                </SheetContent>
            </Sheet>,
        );
        await user.click(input());
        await user.click(await screen.findByRole('option', { name: 'Mailgun' }));
        expect(values).toEqual(['Mailgun']);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});

describe('Combobox disabled on the root', () => {
    it('disables the input, which submits nothing', () => {
        const { container } = renderUi(
            <form>
                <Mailer name="mailer" defaultValue="SendGrid" disabled />
            </form>
        );
        expect(screen.getByRole('combobox', { name: 'Mailer' })).toBeDisabled();
        expect(new FormData(container.querySelector('form')).has('mailer')).toBe(false);
    });
});
