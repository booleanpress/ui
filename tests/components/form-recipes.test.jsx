import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import SelectFilter from '../../examples/select/filter.tsx';
import SelectMultiple from '../../examples/select/multiple.tsx';
import SelectArrow from '../../examples/select/arrow.tsx';
import ForceSelection from '../../examples/autocomplete/force-selection.tsx';
import Chips from '../../examples/autocomplete/chips.tsx';
import FocusPolicy from '../../examples/autocomplete/focus-policy.tsx';
import AutocompleteArrow from '../../examples/autocomplete/arrow.tsx';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Selection recipes', () => {
    it('filters options inside the popup and puts the selection on the trigger', async () => {
        const { user } = renderUi(<SelectFilter />);
        await user.click(screen.getByRole('combobox', { name: 'Mailer' }));
        const search = await screen.findByRole('combobox', { name: 'Filter mailers' });
        await user.type(search, 'post');
        const list = await screen.findByRole('listbox');
        await waitFor(() => expect(within(list).getAllByRole('option')).toHaveLength(1));
        await user.click(screen.getByRole('option', { name: 'Postmark' }));
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(screen.getByRole('combobox', { name: 'Mailer' })).toHaveTextContent('Postmark');
        await expectNoAxeViolations();
    });

    it('keeps multiple choices and allows removing a choice', async () => {
        const { user } = renderUi(<SelectMultiple />);
        await user.click(screen.getByRole('combobox', { name: 'Channels' }));
        await user.click(await screen.findByRole('option', { name: 'SMS' }));
        expect(screen.getByRole('option', { name: 'Email' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('option', { name: 'SMS' })).toHaveAttribute('aria-selected', 'true');
        await user.click(screen.getByRole('option', { name: 'Email' }));
        expect(screen.getByRole('option', { name: 'Email' })).toHaveAttribute('aria-selected', 'false');
        await user.keyboard('{Escape}');
        expect(screen.getByRole('combobox', { name: 'Channels' })).toHaveTextContent('SMS');
    });

    it('renders the positioned select arrow without changing keyboard selection', async () => {
        const { user } = renderUi(<SelectArrow />);
        await user.click(screen.getByRole('combobox', { name: 'Frequency' }));
        await screen.findByRole('listbox');
        expect(document.querySelector('[data-slot=select-arrow]')).toBeInTheDocument();
        await user.keyboard('{Home}{Enter}');
        expect(screen.getByRole('combobox', { name: 'Frequency' })).toHaveTextContent('Daily');
    });
});

describe('Autocomplete recipes', () => {
    it('clears unmatched text on blur, canonicalizes a match and preserves a picked option', async () => {
        const { user } = renderUi(<ForceSelection />);
        const input = screen.getByRole('combobox', { name: 'Country' });
        await user.type(input, 'unknown');
        await user.tab();
        expect(input).toHaveValue('');
        await user.type(input, 'canada');
        await user.tab();
        expect(input).toHaveValue('Canada');
        await user.clear(input);
        await user.type(input, 'ger');
        await user.click(await screen.findByRole('option', { name: 'Germany' }));
        await user.tab();
        expect(input).toHaveValue('Germany');
    });

    it('adds suggestions as chips and removes individual chips', async () => {
        const { user } = renderUi(<Chips />);
        const input = screen.getByRole('combobox', { name: 'Webhook events' });
        await user.type(input, 'del');
        await user.click(await screen.findByRole('option', { name: 'Delivered' }));
        expect(screen.getByRole('button', { name: 'Remove Delivered' })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Remove Bounced' }));
        expect(screen.queryByRole('button', { name: 'Remove Bounced' })).toBeNull();
        expect(screen.getByRole('button', { name: 'Remove Delivered' })).toBeInTheDocument();
    });

    it('opens and selects text on focus, highlights the first match and ignores hover', async () => {
        const { user } = renderUi(<FocusPolicy />);
        await user.tab();
        const input = screen.getByRole('combobox', { name: 'City' });
        expect(input.selectionStart).toBe(0);
        expect(input.selectionEnd).toBe(1);
        const berlin = await screen.findByRole('option', { name: 'Berlin' });
        await waitFor(() => expect(berlin).toHaveAttribute('data-highlighted'));
        await user.hover(screen.getByRole('option', { name: 'Boston' }));
        expect(berlin).toHaveAttribute('data-highlighted');
        await user.keyboard('{Enter}');
        expect(input).toHaveValue('Berlin');
    });

    it('renders the positioned autocomplete arrow and still picks a suggestion', async () => {
        const { user } = renderUi(<AutocompleteArrow />);
        await user.click(screen.getByRole('combobox', { name: 'City' }));
        await screen.findByRole('listbox');
        expect(document.querySelector('[data-slot=autocomplete-arrow]')).toBeInTheDocument();
        await user.click(screen.getByRole('option', { name: 'Boston' }));
        expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue('Boston');
    });
});
