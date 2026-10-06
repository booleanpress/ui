import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Label } from '@/components/label';
import { SearchField } from '@/components/search-field';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('SearchField', () => {
    it('is a named searchbox inside a search landmark of the same name', async () => {
        renderUi(<SearchField aria-label="Search delivery logs" />);
        expect(screen.getByRole('search', { name: 'Search delivery logs' })).toBeInTheDocument();
        expect(screen.getByRole('searchbox', { name: 'Search delivery logs' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('takes the provider string as its name when it has no label', () => {
        renderUi(<SearchField />, { strings: { search: 'Suchen' } });
        expect(screen.getByRole('searchbox', { name: 'Suchen' })).toBeInTheDocument();
        expect(screen.getByRole('search', { name: 'Suchen' })).toBeInTheDocument();
    });

    it('is named by a visible label through its id', () => {
        renderUi(
            <>
                <Label htmlFor="log-search">Find a log</Label>
                <SearchField id="log-search" />
            </>,
        );
        expect(screen.getByRole('searchbox', { name: 'Find a log' })).toBeInTheDocument();
    });

    it('submits the search with Enter, without reloading the page', async () => {
        const onSearch = vi.fn();
        const { user } = renderUi(<SearchField aria-label="Search" onSearch={onSearch} />);
        await user.type(screen.getByRole('searchbox'), 'bounce{Enter}');
        expect(onSearch).toHaveBeenCalledWith('bounce');
    });

    it('works inside a form: Enter searches without sending the form, and the form submits the text under its name', async () => {
        const onSearch = vi.fn();
        const onSubmit = vi.fn((event) => event.preventDefault());
        const { user, container } = renderUi(
            <form onSubmit={onSubmit}>
                <SearchField aria-label="Search lists" name="q" onSearch={onSearch} />
                <button type="submit">Save</button>
            </form>,
        );
        expect(container.querySelectorAll('form')).toHaveLength(1);
        await user.type(screen.getByRole('searchbox'), 'newsletter{Enter}');
        expect(onSearch).toHaveBeenCalledWith('newsletter');
        expect(onSubmit).not.toHaveBeenCalled();
        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(new FormData(container.querySelector('form')).get('q')).toBe('newsletter');
    });

    it('empties the field with Escape and keeps the focus in it, then leaves it with a second Escape', async () => {
        const onChange = vi.fn();
        const { user } = renderUi(<SearchField aria-label="Search" defaultValue="invoice" onChange={onChange} />);
        const input = screen.getByRole('searchbox');
        await user.click(input);
        await user.keyboard('{Escape}');
        expect(input).toHaveValue('');
        expect(input).toHaveFocus();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target.value).toBe('');
        await user.keyboard('{Escape}');
        expect(input).not.toHaveFocus();
    });

    it('clears a controlled field with Escape through its onChange', async () => {
        function Controlled() {
            const [value, setValue] = useState('mailgun');
            return <SearchField aria-label="Search" value={value} onChange={(event) => setValue(event.target.value)} />;
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('searchbox'));
        await user.keyboard('{Escape}');
        expect(screen.getByRole('searchbox')).toHaveValue('');
        await user.keyboard('ses');
        expect(screen.getByRole('searchbox')).toHaveValue('ses');
    });

    it('shows a clear button while there is text, which empties the field and keeps the focus', async () => {
        const { user } = renderUi(<SearchField aria-label="Search" />);
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
        await user.type(screen.getByRole('searchbox'), 'postmark');
        await user.tab();
        expect(screen.getByRole('button', { name: 'Clear' })).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('searchbox')).toHaveValue('');
        expect(screen.getByRole('searchbox')).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('shows a spinner named by the provider and marks the field busy while loading', async () => {
        renderUi(<SearchField aria-label="Search" loading />, { strings: { loading: 'Lädt' } });
        expect(screen.getByRole('status', { name: 'Lädt' })).toBeInTheDocument();
        expect(screen.getByRole('searchbox')).toHaveAttribute('aria-busy', 'true');
        await expectNoAxeViolations();
    });

    it('cannot be used when disabled, and has no clear button then', async () => {
        renderUi(<SearchField aria-label="Search" disabled defaultValue="live" />);
        expect(screen.getByRole('searchbox')).toBeDisabled();
        expect(screen.queryByRole('button')).toBeNull();
        await expectNoAxeViolations();
    });

    it('sets its size and look on the group, the provider ones when it has none', () => {
        renderUi(
            <>
                <SearchField aria-label="Small" size="sm" />
                <SearchField aria-label="Inherited" />
            </>,
            { controlSize: 'lg', fieldVariant: 'filled' },
        );
        const small = screen.getByRole('searchbox', { name: 'Small' });
        expect(small).toHaveAttribute('data-size', 'sm');
        expect(small.closest('[data-slot=input-group]')).toHaveAttribute('data-size', 'sm');
        const inherited = screen.getByRole('searchbox', { name: 'Inherited' }).closest('[data-slot=input-group]');
        expect(inherited).toHaveAttribute('data-size', 'lg');
        expect(inherited).toHaveAttribute('data-variant', 'filled');
    });
});
