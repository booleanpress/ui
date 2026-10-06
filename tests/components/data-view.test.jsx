import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { DataView, DataViewLayoutToggle, DataViewSort } from '@/components/data-view';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const MAILERS = [
    { id: 'ses', name: 'Transactional', sent: 18432 },
    { id: 'postmark', name: 'Password resets', sent: 2210 },
    { id: 'mailgun', name: 'Newsletter', sent: 40125 },
];

const SORTS = [
    { value: 'most', label: 'Most sent first', compare: (a, b) => b.sent - a.sent },
    { value: 'name', label: 'Name, A to Z', compare: (a, b) => a.name.localeCompare(b.name) },
];

const names = () => within(screen.getByRole('list', { name: 'Mailers' })).getAllByRole('listitem').map((li) => li.textContent);

function Mailers(props) {
    return (
        <DataView
            aria-label="Mailers"
            items={MAILERS}
            getItemKey={(m) => m.id}
            renderItem={(m, layout) => <span data-rendered={layout}>{m.name}</span>}
            {...props}
        />
    );
}

describe('DataView', () => {
    it('renders the items as a named list, one list item each, in the list layout', async () => {
        renderUi(<Mailers />);
        const list = screen.getByRole('list', { name: 'Mailers' });
        expect(list).toHaveAttribute('data-layout', 'list');
        expect(within(list).getAllByRole('listitem')).toHaveLength(3);
        expect(screen.getByText('Transactional')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('passes the layout to renderItem and lays out a grid with defaultLayout="grid"', async () => {
        renderUi(<Mailers defaultLayout="grid" />);
        expect(screen.getByRole('list', { name: 'Mailers' })).toHaveAttribute('data-layout', 'grid');
        expect(document.querySelectorAll('[data-rendered=grid]')).toHaveLength(3);
        await expectNoAxeViolations();
    });

    it('moves focus into the layout switch with Tab, on the chosen layout', async () => {
        const { user } = renderUi(<Mailers layoutToggle />);
        await user.tab();
        expect(screen.getByRole('radio', { name: 'List' })).toHaveFocus();
        expect(screen.getByRole('radiogroup', { name: 'Layout' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('switches to the grid with ArrowRight in the layout switch', async () => {
        const layouts = [];
        const { user } = renderUi(<Mailers layoutToggle onLayoutChange={(l) => layouts.push(l)} />);
        await user.tab();
        await user.keyboard('{ArrowRight>}');
        await waitFor(() => expect(screen.getByRole('radio', { name: 'Grid' })).toHaveFocus());
        await user.keyboard('{/ArrowRight}');
        expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('list', { name: 'Mailers' })).toHaveAttribute('data-layout', 'grid');
        expect(layouts).toEqual(['grid']);
    });

    it('switches back to the list with ArrowLeft in the layout switch', async () => {
        const { user } = renderUi(<Mailers layoutToggle defaultLayout="grid" />);
        await user.tab();
        expect(screen.getByRole('radio', { name: 'Grid' })).toHaveFocus();
        await user.keyboard('{ArrowLeft>}');
        await waitFor(() => expect(screen.getByRole('radio', { name: 'List' })).toHaveFocus());
        await user.keyboard('{/ArrowLeft}');
        expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('list', { name: 'Mailers' })).toHaveAttribute('data-layout', 'list');
    });

    it('follows a controlled layout', async () => {
        function Controlled() {
            const [layout, setLayout] = useState('list');
            return (
                <>
                    <DataViewLayoutToggle value={layout} onValueChange={setLayout} />
                    <Mailers layout={layout} />
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(screen.getByRole('list', { name: 'Mailers' })).toHaveAttribute('data-layout', 'list');
        await user.click(screen.getByRole('radio', { name: 'Grid' }));
        expect(screen.getByRole('list', { name: 'Mailers' })).toHaveAttribute('data-layout', 'grid');
    });

    it('opens the sort options with Enter and sorts with ArrowDown and Enter', async () => {
        const sorts = [];
        const { user } = renderUi(<Mailers sortOptions={SORTS} onSortChange={(s) => sorts.push(s)} />);
        expect(names()).toEqual(['Transactional', 'Password resets', 'Newsletter']);
        const select = screen.getByRole('combobox', { name: 'Sort by' });
        expect(select).toHaveTextContent('Sort by');
        select.focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await expectNoAxeViolations();
        await user.keyboard('{ArrowDown}{Enter}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(sorts).toEqual(['name']);
        expect(select).toHaveTextContent('Name, A to Z');
        expect(names()).toEqual(['Newsletter', 'Password resets', 'Transactional']);
    });

    it('opens the sort options with ArrowDown', async () => {
        const { user } = renderUi(<Mailers sortOptions={SORTS} defaultSort="most" />);
        expect(names()).toEqual(['Newsletter', 'Transactional', 'Password resets']);
        screen.getByRole('combobox', { name: 'Sort by' }).focus();
        await user.keyboard('{ArrowDown}');
        expect(await screen.findByRole('listbox')).toBeInTheDocument();
    });

    it('closes the sort options with Escape without changing the order', async () => {
        const sorts = [];
        const { user } = renderUi(<Mailers sortOptions={SORTS} defaultSort="most" onSortChange={(s) => sorts.push(s)} />);
        screen.getByRole('combobox', { name: 'Sort by' }).focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(sorts).toEqual([]);
        expect(names()).toEqual(['Newsletter', 'Transactional', 'Password resets']);
    });

    it('moves with Tab from the sort select to the layout switch, the items’ controls and the pages', async () => {
        const items = Array.from({ length: 6 }, (_, i) => ({ id: i, name: `Mailer ${i + 1}`, sent: i }));
        const { user } = renderUi(
            <DataView
                aria-label="Mailers"
                items={items}
                getItemKey={(m) => m.id}
                sortOptions={SORTS}
                layoutToggle
                pageSize={2}
                renderItem={(m) => <button type="button">Edit {m.name}</button>}
            />,
        );
        await user.tab();
        expect(screen.getByRole('combobox', { name: 'Sort by' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('radio', { name: 'List' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Edit Mailer 1' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Edit Mailer 2' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('link', { name: '1' })).toHaveFocus();
    });

    it('pages the items and shows a page with Enter on its link', async () => {
        const pages = [];
        const items = Array.from({ length: 7 }, (_, i) => ({ id: i, name: `Ticket ${i + 1}` }));
        const { user } = renderUi(
            <DataView aria-label="Tickets" items={items} getItemKey={(t) => t.id} pageSize={3} onPageChange={(p) => pages.push(p)} renderItem={(t) => t.name} />,
        );
        const rows = () => within(screen.getByRole('list', { name: 'Tickets' })).getAllByRole('listitem').map((li) => li.textContent);
        expect(rows()).toEqual(['Ticket 1', 'Ticket 2', 'Ticket 3']);
        expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
        screen.getByRole('link', { name: '3' }).focus();
        await user.keyboard('{Enter}');
        expect(rows()).toEqual(['Ticket 7']);
        expect(pages).toEqual([3]);
        expect(screen.getByRole('link', { name: '3' })).toHaveAttribute('aria-current', 'page');
        await expectNoAxeViolations();
    });

    it('goes back to page 1 when the sort changes', async () => {
        const items = Array.from({ length: 4 }, (_, i) => ({ id: i, name: `Mailer ${i + 1}`, sent: i }));
        const { user } = renderUi(
            <DataView aria-label="Mailers" items={items} getItemKey={(m) => m.id} pageSize={2} sortOptions={SORTS} renderItem={(m) => m.name} />,
        );
        await user.click(screen.getByRole('link', { name: '2' }));
        expect(names()).toEqual(['Mailer 3', 'Mailer 4']);
        screen.getByRole('combobox', { name: 'Sort by' }).focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(names()).toEqual(['Mailer 4', 'Mailer 3']);
        expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('aria-current', 'page');
    });

    it('leaves paging to the server with total: shows the items as given and counts pages from total', () => {
        renderUi(<Mailers pageSize={3} total={9} page={2} />);
        expect(names()).toEqual(['Transactional', 'Password resets', 'Newsletter']);
        expect(screen.getByRole('link', { name: '3' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page');
    });

    it('shows placeholders and a status while the first items load', async () => {
        renderUi(<Mailers items={[]} loading skeletonCount={4} />);
        expect(screen.queryByRole('list')).toBeNull();
        expect(screen.getByRole('status')).toHaveTextContent('Loading');
        const loading = document.querySelector('[data-slot=data-view-loading]');
        expect(loading).toHaveAttribute('aria-busy', 'true');
        expect(loading.querySelectorAll('[data-slot=skeleton]').length).toBeGreaterThan(0);
        await expectNoAxeViolations();
    });

    it('keeps its status region on the page, so the first load is announced when it starts', () => {
        const { rerender } = renderUi(<Mailers items={[]} />);
        const status = screen.getByRole('status');
        expect(status).toBeEmptyDOMElement();
        rerender(<BooleanUIProvider><Mailers items={[]} loading /></BooleanUIProvider>);
        expect(screen.getByRole('status')).toBe(status);
        expect(status).toHaveTextContent('Loading');
        rerender(<BooleanUIProvider><Mailers loading /></BooleanUIProvider>);
        expect(status).toBeEmptyDOMElement();
    });

    it('numbers its pages in the provider’s locale', () => {
        const items = Array.from({ length: 7 }, (_, i) => ({ id: i, name: `Ticket ${i + 1}` }));
        renderUi(<DataView aria-label="Tickets" items={items} getItemKey={(t) => t.id} pageSize={3} renderItem={(t) => t.name} />, {
            locale: 'ar-EG',
        });
        expect(screen.getByRole('link', { name: '٣' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: '١' })).toHaveAttribute('aria-current', 'page');
    });

    it('keeps the items, dimmed and busy, while new ones load', async () => {
        renderUi(<Mailers loading />);
        const list = screen.getByRole('list', { name: 'Mailers' });
        expect(list).toHaveAttribute('aria-busy', 'true');
        expect(list.className).toContain('opacity-60');
        expect(within(list).getAllByRole('listitem')).toHaveLength(3);
        await expectNoAxeViolations();
    });

    it('shows the provider’s noItems text with no items, and a custom empty state', async () => {
        const { unmount } = renderUi(<Mailers items={[]} />, { strings: { noItems: 'Keine Einträge' } });
        expect(screen.getByText('Keine Einträge')).toBeInTheDocument();
        await expectNoAxeViolations();
        unmount();
        renderUi(<Mailers items={[]} empty={<p>No mailers yet</p>} />);
        expect(screen.getByText('No mailers yet')).toBeInTheDocument();
        expect(screen.queryByText('No items')).toBeNull();
    });

    it('names the switch, its radios and the sort select from the provider', async () => {
        renderUi(<Mailers layoutToggle sortOptions={SORTS} />, {
            strings: { layout: 'Ansicht', layoutList: 'Liste', layoutGrid: 'Raster', sortBy: 'Sortieren nach' },
        });
        expect(screen.getByRole('radiogroup', { name: 'Ansicht' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'Liste' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'Raster' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Sortieren nach' })).toHaveTextContent('Sortieren nach');
        await expectNoAxeViolations();
    });

    it('renders the header and footer content', () => {
        renderUi(<Mailers header={<h2>Mailers</h2>} footer={<span>3 mailers</span>} />);
        expect(screen.getByRole('heading', { name: 'Mailers' }).closest('[data-slot=data-view-header]')).not.toBeNull();
        expect(screen.getByText('3 mailers').closest('[data-slot=data-view-footer]')).not.toBeNull();
    });

    it('renders DataViewSort on its own, with the placeholder and the size', async () => {
        renderUi(<DataViewSort options={SORTS} onValueChange={() => {}} size="sm" />);
        const select = screen.getByRole('combobox', { name: 'Sort by' });
        expect(select).toHaveAttribute('data-size', 'sm');
        expect(select).toHaveAttribute('data-slot', 'data-view-sort');
        await expectNoAxeViolations();
    });
});
