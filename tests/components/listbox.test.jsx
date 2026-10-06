import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { Listbox, ListboxEmpty, ListboxGroup, ListboxItem, ListboxLabel, ListboxSeparator } from '@/components/listbox';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const MAILERS = ['Amazon SES', 'Mailgun', 'Postmark', 'SendGrid'];

function Mailers(props) {
    return (
        <Listbox aria-label="Mailer" {...props}>
            {MAILERS.map((m) => (
                <ListboxItem key={m} value={m} disabled={props.disabledItem === m}>
                    {m}
                </ListboxItem>
            ))}
            <ListboxEmpty />
        </Listbox>
    );
}

const listbox = () => screen.getByRole('listbox', { name: 'Mailer' });
const highlighted = () => document.querySelector('[data-slot=listbox-item][data-highlighted]');

describe('Listbox', () => {
    it('is one tab stop; focus highlights the chosen option, else the first', async () => {
        const { user } = renderUi(<Mailers defaultValue="Postmark" />);
        await user.tab();
        expect(listbox()).toHaveFocus();
        expect(highlighted()).toHaveTextContent('Postmark');
        expect(listbox()).toHaveAttribute('aria-activedescendant', highlighted().id);
        await expectNoAxeViolations();
    });

    it('moves the highlight with ArrowDown and ArrowUp, stopping at the ends', async () => {
        const { user } = renderUi(<Mailers />);
        await user.tab();
        expect(highlighted()).toHaveTextContent('Amazon SES');
        await user.keyboard('{ArrowDown}{ArrowDown}');
        expect(highlighted()).toHaveTextContent('Postmark');
        await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}');
        expect(highlighted()).toHaveTextContent('Amazon SES');
    });

    it('moves to the first and the last option with Home and End', async () => {
        const { user } = renderUi(<Mailers />);
        await user.tab();
        await user.keyboard('{End}');
        expect(highlighted()).toHaveTextContent('SendGrid');
        await user.keyboard('{Home}');
        expect(highlighted()).toHaveTextContent('Amazon SES');
    });

    it('chooses the highlighted option with Enter or Space (single)', async () => {
        const values = [];
        const { user } = renderUi(<Mailers onValueChange={(v) => values.push(v)} />);
        await user.tab();
        await user.keyboard('{ArrowDown}{Enter}');
        expect(values).toEqual(['Mailgun']);
        expect(screen.getByRole('option', { name: 'Mailgun' })).toHaveAttribute('aria-selected', 'true');
        await user.keyboard('{ArrowDown} ');
        expect(values).toEqual(['Mailgun', 'Postmark']);
        expect(screen.getByRole('option', { name: 'Mailgun' })).toHaveAttribute('aria-selected', 'false');
    });

    it('multiple: Space toggles the highlighted option, Enter too', async () => {
        const values = [];
        const { user } = renderUi(<Mailers multiple onValueChange={(v) => values.push(v)} />);
        expect(listbox()).toHaveAttribute('aria-multiselectable', 'true');
        await user.tab();
        await user.keyboard(' {ArrowDown} {ArrowUp}{Enter}');
        expect(values).toEqual([['Amazon SES'], ['Amazon SES', 'Mailgun'], ['Mailgun']]);
        await expectNoAxeViolations();
    });

    it('type-ahead: letters move to the next option that starts with them', async () => {
        const { user } = renderUi(<Mailers />);
        await user.tab();
        await user.keyboard('po');
        expect(highlighted()).toHaveTextContent('Postmark');
        await new Promise((resolve) => setTimeout(resolve, 600));
        await user.keyboard('m');
        expect(highlighted()).toHaveTextContent('Mailgun');
    });

    it('chooses with a click and keeps focus on the list', async () => {
        const values = [];
        const { user } = renderUi(<Mailers onValueChange={(v) => values.push(v)} />);
        await user.click(screen.getByRole('option', { name: 'SendGrid' }));
        expect(values).toEqual(['SendGrid']);
        expect(listbox()).toHaveFocus();
    });

    it('skips and ignores disabled options', async () => {
        const values = [];
        const { user } = renderUi(<Mailers disabledItem="Mailgun" onValueChange={(v) => values.push(v)} />);
        expect(screen.getByRole('option', { name: 'Mailgun' })).toHaveAttribute('aria-disabled', 'true');
        await user.tab();
        await user.keyboard('{ArrowDown}');
        expect(highlighted()).toHaveTextContent('Postmark');
        await user.click(screen.getByRole('option', { name: 'Mailgun' }));
        expect(values).toEqual([]);
        await expectNoAxeViolations();
    });

    it('is out of the tab order and unchangeable while disabled', async () => {
        const values = [];
        const { user } = renderUi(<Mailers disabled defaultValue="Postmark" onValueChange={(v) => values.push(v)} />);
        expect(listbox()).toHaveAttribute('aria-disabled', 'true');
        expect(listbox()).toHaveAttribute('tabindex', '-1');
        await user.click(screen.getByRole('option', { name: 'Mailgun' }));
        expect(values).toEqual([]);
        await expectNoAxeViolations();
    });

    it('passes aria-invalid to the list', async () => {
        renderUi(<Mailers aria-invalid />);
        expect(listbox()).toHaveAttribute('aria-invalid', 'true');
        await expectNoAxeViolations();
    });

    it('filter: typing narrows the options; the arrows and Enter work from the field; "No results" from the provider', async () => {
        const values = [];
        const { user } = renderUi(<Mailers filter filterPlaceholder="Search" onValueChange={(v) => values.push(v)} />, { strings: { noResults: 'Rien', filterOptions: 'Filtrer' } });
        const input = screen.getByRole('combobox', { name: 'Filtrer' });
        expect(input).toHaveAttribute('aria-controls', listbox().id);
        await user.click(input);
        await user.keyboard('ma');
        expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Amazon SES', 'Mailgun', 'Postmark']);
        await user.keyboard('{ArrowDown}{Enter}');
        expect(values).toEqual(['Mailgun']);
        expect(input).toHaveAttribute('aria-activedescendant', highlighted().id);
        await expectNoAxeViolations();
        await user.keyboard('zzz');
        expect(screen.queryAllByRole('option')).toHaveLength(0);
        expect(screen.getByText('Rien')).toBeInTheDocument();
    });

    it('empty: "No results" is a polite status beside the list, not inside it, and the empty list passes axe', async () => {
        const { user } = renderUi(<Mailers filter />);
        const status = screen.getByRole('status');
        expect(status).toBeEmptyDOMElement();
        expect(listbox().contains(status)).toBe(false);
        await user.click(screen.getByRole('combobox', { name: 'Filter options' }));
        await user.keyboard('zzz');
        expect(screen.queryAllByRole('option')).toHaveLength(0);
        expect(status).toHaveTextContent('No results');
        await expectNoAxeViolations();
        await user.keyboard('{Backspace}{Backspace}{Backspace}');
        expect(screen.getAllByRole('option')).toHaveLength(4);
        expect(status).toBeEmptyDOMElement();
    });

    it('says "No results" for an empty list without a filter too', () => {
        renderUi(
            <Listbox aria-label="Mailer">
                <ListboxEmpty>No mailers yet</ListboxEmpty>
            </Listbox>,
        );
        expect(screen.getByRole('status')).toHaveTextContent('No mailers yet');
    });

    it('name: submits each chosen value as a hidden input; a disabled list submits nothing', () => {
        renderUi(
            <form aria-label="Settings">
                <Mailers multiple name="mailers" defaultValue={['Mailgun', 'SendGrid']} />
                <Listbox aria-label="Region" name="region" defaultValue="eu" disabled>
                    <ListboxItem value="eu">Europe</ListboxItem>
                </Listbox>
            </form>,
        );
        const data = new FormData(screen.getByRole('form', { name: 'Settings' }));
        expect(data.getAll('mailers')).toEqual(['Mailgun', 'SendGrid']);
        expect(data.getAll('region')).toEqual([]);
    });

    it('a form reset puts an uncontrolled list back to its starting value', async () => {
        const { user } = renderUi(
            <form aria-label="Settings">
                <Mailers name="mailer" defaultValue="Postmark" />
            </form>,
        );
        await user.click(screen.getByRole('option', { name: 'SendGrid' }));
        expect(screen.getByRole('option', { name: 'SendGrid' })).toHaveAttribute('aria-selected', 'true');
        act(() => screen.getByRole('form', { name: 'Settings' }).reset());
        await waitFor(() => expect(screen.getByRole('option', { name: 'Postmark' })).toHaveAttribute('aria-selected', 'true'));
        expect(new FormData(screen.getByRole('form', { name: 'Settings' })).getAll('mailer')).toEqual(['Postmark']);
    });

    it('an id given to the list is the one the filter field controls', () => {
        renderUi(<Mailers filter id="mailer-list" />);
        expect(listbox()).toHaveAttribute('id', 'mailer-list');
        expect(screen.getByRole('combobox', { name: 'Filter options' })).toHaveAttribute('aria-controls', 'mailer-list');
    });

    it('checkbox and check indicators mark the chosen options', () => {
        renderUi(
            <>
                <Listbox aria-label="Sites" multiple indicator="checkbox" defaultValue={['shop']}>
                    <ListboxItem value="shop">Shop</ListboxItem>
                    <ListboxItem value="blog">Blog</ListboxItem>
                </Listbox>
                <Listbox aria-label="Plan" indicator="check" defaultValue="pro">
                    <ListboxItem value="pro">Pro</ListboxItem>
                </Listbox>
            </>,
        );
        expect(document.querySelectorAll('[data-slot=listbox-item-checkbox]')).toHaveLength(2);
        expect(screen.getByRole('option', { name: 'Shop' }).querySelector('[data-slot=listbox-item-checkbox] svg')).not.toBeNull();
        expect(screen.getByRole('option', { name: 'Pro' }).querySelector('[data-slot=listbox-item-indicator]')).not.toBeNull();
    });

    it('groups options under their labels; a separator is hidden from assistive technology', async () => {
        renderUi(
            <Listbox aria-label="Mailer">
                <ListboxGroup>
                    <ListboxLabel>API</ListboxLabel>
                    <ListboxItem value="ses">Amazon SES</ListboxItem>
                </ListboxGroup>
                <ListboxSeparator />
                <ListboxGroup>
                    <ListboxLabel>SMTP</ListboxLabel>
                    <ListboxItem value="gmail">Gmail SMTP</ListboxItem>
                </ListboxGroup>
            </Listbox>,
        );
        expect(screen.getByRole('group', { name: 'SMTP' })).toBeInTheDocument();
        expect(document.querySelector('[data-slot=listbox-separator]')).toHaveAttribute('aria-hidden', 'true');
        await expectNoAxeViolations();
    });

    it('controlled: the app state follows', async () => {
        function Controlled() {
            const [value, setValue] = useState(['Mailgun']);
            return (
                <>
                    <Mailers multiple value={value} onValueChange={setValue} />
                    <p>Chosen: {value.join('|')}</p>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('option', { name: 'SendGrid' }));
        expect(screen.getByText('Chosen: Mailgun|SendGrid')).toBeInTheDocument();
    });
});

describe('Listbox and its form', () => {
    it('submits its chosen values to the form its form attribute names', () => {
        renderUi(
            <>
                <form id="routing" />
                <Mailers multiple name="mailers" form="routing" defaultValue={['Mailgun', 'SendGrid']} />
            </>
        );
        expect(new FormData(document.getElementById('routing')).getAll('mailers')).toEqual(['Mailgun', 'SendGrid']);
    });
});


describe('Listbox focus and selection policies', () => {
    it('can wait for keyboard navigation before highlighting an option', async () => {
        const { user } = renderUi(<Mailers autoOptionFocus={false} />);
        await user.tab();
        expect(highlighted()).toBeNull();
        await user.keyboard('{ArrowDown}');
        expect(highlighted()).toHaveTextContent('Amazon SES');
    });

    it('selects during navigation when requested and skips disabled choices', async () => {
        const { user } = renderUi(<Mailers selectOnFocus disabledItem="Mailgun" />);
        await user.tab();
        expect(screen.getByRole('option', { name: 'Amazon SES' })).toHaveAttribute('aria-selected', 'true');
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('option', { name: 'Postmark' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('option', { name: 'Mailgun' })).toHaveAttribute('aria-selected', 'false');
    });

    it('keeps pointer focus selection when a multiple option is clicked', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Mailers multiple selectOnFocus onValueChange={onValueChange} />);
        await user.click(screen.getByRole('option', { name: 'Postmark' }));
        expect(screen.getByRole('option', { name: 'Postmark' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('option', { name: 'Amazon SES' })).toHaveAttribute('aria-selected', 'false');
        expect(highlighted()).toHaveTextContent('Postmark');
        await user.hover(screen.getByRole('option', { name: 'Mailgun' }));
        expect(screen.getByRole('option', { name: 'Mailgun' })).toHaveAttribute('aria-selected', 'true');
        const calls = onValueChange.mock.calls.length;
        await user.click(screen.getByRole('option', { name: 'Mailgun' }));
        expect(screen.getByRole('option', { name: 'Mailgun' })).toHaveAttribute('aria-selected', 'true');
        expect(onValueChange).toHaveBeenCalledTimes(calls);
        await user.keyboard(' ');
        expect(screen.getByRole('option', { name: 'Mailgun' })).toHaveAttribute('aria-selected', 'false');
    });

    it('keeps the first clicked option selected with selectOnFocus', async () => {
        const { user } = renderUi(<Mailers multiple selectOnFocus />);
        await user.click(screen.getByRole('option', { name: 'Amazon SES' }));
        expect(screen.getByRole('option', { name: 'Amazon SES' })).toHaveAttribute('aria-selected', 'true');
    });

    it('can leave the highlight unchanged on pointer hover', async () => {
        const { user } = renderUi(<Mailers focusOnHover={false} />);
        await user.tab();
        await user.hover(screen.getByRole('option', { name: 'Postmark' }));
        expect(highlighted()).toHaveTextContent('Amazon SES');
    });

    it('replaces pointer selection without a modifier and adds with Control, retaining keyboard toggles', async () => {
        const { user } = renderUi(<Mailers multiple metaKeySelection defaultValue={['Mailgun']} />);
        await user.click(screen.getByRole('option', { name: 'Postmark' }));
        expect(screen.getByRole('option', { name: 'Mailgun' })).toHaveAttribute('aria-selected', 'false');
        await user.keyboard('{Control>}');
        await user.click(screen.getByRole('option', { name: 'SendGrid' }));
        await user.keyboard('{/Control}');
        expect(screen.getByRole('option', { name: 'Postmark' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('option', { name: 'SendGrid' })).toHaveAttribute('aria-selected', 'true');
        await user.keyboard('{Home} ');
        expect(screen.getByRole('option', { name: 'Amazon SES' })).toHaveAttribute('aria-selected', 'true');
    });

    it('supports a controlled starts-with filter and respects a parent-rejected edit', async () => {
        const onFilterValueChange = vi.fn();
        const { user, rerender } = renderUi(<Mailers filter filterValue="ma" filterMatch="startsWith" onFilterValueChange={onFilterValueChange} />);
        expect(screen.getAllByRole('option')).toHaveLength(1);
        expect(screen.getByRole('option')).toHaveTextContent('Mailgun');
        await user.type(screen.getByRole('combobox'), 'x');
        expect(onFilterValueChange).toHaveBeenLastCalledWith('max');
        expect(screen.getByRole('combobox')).toHaveValue('ma');
        rerender(<Mailers filter filterValue="po" filterMatch="startsWith" onFilterValueChange={onFilterValueChange} />);
        expect(screen.getByRole('option')).toHaveTextContent('Postmark');
        await expectNoAxeViolations();
    });

    it('keeps interactive header controls outside the listbox role', async () => {
        function HeaderExample() {
            const [value, setValue] = useState([]);
            return <Mailers multiple value={value} onValueChange={setValue} header={<button type="button" onClick={() => setValue(MAILERS)}>Select all</button>} />;
        }
        const { user } = renderUi(<HeaderExample />);
        const button = screen.getByRole('button', { name: 'Select all' });
        expect(listbox().contains(button)).toBe(false);
        await user.click(button);
        for (const option of screen.getAllByRole('option')) expect(option).toHaveAttribute('aria-selected', 'true');
        await expectNoAxeViolations();
    });
});
