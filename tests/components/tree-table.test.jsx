import { describe, expect, it, vi } from 'vitest';
import { act, screen, within } from '@testing-library/react';
import { TreeTable } from '@/components/tree-table';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const person = (id, label, role, tickets) => ({ id, label, data: { role, tickets } });

const ORGANISATIONS = [
    {
        id: 'northwind',
        label: 'Northwind Agency',
        data: { role: 'Organisation', tickets: 14 },
        children: [
            { id: 'support', label: 'Support', data: { role: 'Team', tickets: 9 }, children: [person('amara', 'Amara Okafor', 'Support lead', 5), person('jonas', 'Jonas Berg', 'Support agent', 4)] },
            { id: 'billing', label: 'Billing', data: { role: 'Team', tickets: 5 }, children: [person('lena', 'Lena Fischer', 'Accountant', 5)] },
        ],
    },
    { id: 'acme', label: 'Acme Hosting', data: { role: 'Organisation', tickets: 7 }, children: [person('ravi', 'Ravi Patel', 'Engineer', 7)] },
    { id: 'globex', label: 'Globex Shop', data: { role: 'Organisation', tickets: 2 }, children: [person('sam', 'Sam Rivera', 'Store manager', 2)] },
];

const COLUMNS = [
    { id: 'name', header: 'Name', sortable: true },
    { id: 'role', header: 'Role' },
    { id: 'tickets', header: 'Open tickets', sortable: true },
];

const row = (name) => screen.getAllByRole('row').find((r) => r.querySelector('[data-slot=tree-table-label]')?.textContent === name);
const names = () => screen.getAllByRole('row').map((r) => r.querySelector('[data-slot=tree-table-label]')?.textContent).filter(Boolean);

function renderTable(props = {}, providerProps = {}) {
    return renderUi(<TreeTable aria-label="Organisations" nodes={ORGANISATIONS} columns={COLUMNS} {...props} />, providerProps);
}

describe('TreeTable', () => {
    it('renders a named treegrid whose rows carry their level, position and state', async () => {
        renderTable({ defaultExpanded: ['northwind'] });
        expect(screen.getByRole('treegrid', { name: 'Organisations' })).toBeInTheDocument();
        const northwind = row('Northwind Agency');
        expect(northwind).toHaveAttribute('aria-level', '1');
        expect(northwind).toHaveAttribute('aria-posinset', '1');
        expect(northwind).toHaveAttribute('aria-setsize', '3');
        expect(northwind).toHaveAttribute('aria-expanded', 'true');
        expect(row('Support')).toHaveAttribute('aria-level', '2');
        expect(within(northwind).getAllByRole('gridcell').map((cell) => cell.textContent)).toEqual(['Northwind Agency', 'Organisation', '14']);
        expect(northwind).toHaveAttribute('tabindex', '0');
        expect(row('Acme Hosting')).toHaveAttribute('tabindex', '-1');
        await expectNoAxeViolations();
    });

    it('moves to the next row with Down Arrow', async () => {
        const { user } = renderTable({ defaultExpanded: ['northwind'] });
        row('Northwind Agency').focus();
        await user.keyboard('{ArrowDown}');
        expect(row('Support')).toHaveFocus();
    });

    it('moves to the previous row with Up Arrow', async () => {
        const { user } = renderTable({ defaultExpanded: ['northwind'] });
        row('Acme Hosting').focus();
        await user.keyboard('{ArrowUp}');
        expect(row('Billing')).toHaveFocus();
    });

    it('opens a closed row with Right Arrow, then moves to its first child', async () => {
        const { user } = renderTable();
        row('Acme Hosting').focus();
        await user.keyboard('{ArrowRight}');
        expect(row('Acme Hosting')).toHaveAttribute('aria-expanded', 'true');
        await user.keyboard('{ArrowRight}');
        expect(row('Ravi Patel')).toHaveFocus();
    });

    it('closes an open row with Left Arrow, then moves to its parent', async () => {
        const { user } = renderTable({ defaultExpanded: ['northwind', 'support'] });
        row('Support').focus();
        await user.keyboard('{ArrowLeft}');
        expect(row('Support')).toHaveAttribute('aria-expanded', 'false');
        await user.keyboard('{ArrowLeft}');
        expect(row('Northwind Agency')).toHaveFocus();
    });

    it('moves to the first row with Home', async () => {
        const { user } = renderTable();
        row('Globex Shop').focus();
        await user.keyboard('{Home}');
        expect(row('Northwind Agency')).toHaveFocus();
    });

    it('moves to the last row shown with End', async () => {
        const { user } = renderTable();
        row('Northwind Agency').focus();
        await user.keyboard('{End}');
        expect(row('Globex Shop')).toHaveFocus();
    });

    it('chooses the row with Enter in single selection', async () => {
        const onSelectedChange = vi.fn();
        const { user } = renderTable({ selectionMode: 'single', onSelectedChange });
        row('Acme Hosting').focus();
        await user.keyboard('{Enter}');
        expect(onSelectedChange).toHaveBeenLastCalledWith(['acme']);
        expect(row('Acme Hosting')).toHaveAttribute('aria-selected', 'true');
        expect(row('Acme Hosting')).toHaveAttribute('data-state', 'selected');
        await expectNoAxeViolations();
    });

    it('checks the row with Space in checkbox selection', async () => {
        const { user } = renderTable({ selectionMode: 'checkbox' });
        row('Acme Hosting').focus();
        await user.keyboard(' ');
        expect(row('Acme Hosting')).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('checkbox', { name: 'Acme Hosting' })).toHaveAttribute('aria-checked', 'true');
    });

    it('opens every sibling of the focused row with *', async () => {
        const { user } = renderTable();
        row('Acme Hosting').focus();
        await user.keyboard('*');
        for (const name of ['Northwind Agency', 'Acme Hosting', 'Globex Shop']) expect(row(name)).toHaveAttribute('aria-expanded', 'true');
    });

    it('moves to the next row whose label starts with the letters typed', async () => {
        const { user } = renderTable();
        row('Northwind Agency').focus();
        await user.keyboard('g');
        expect(row('Globex Shop')).toHaveFocus();
    });

    it('opens a row from its toggle, named by the provider, and keeps the focus on the row', async () => {
        const { user } = renderTable({}, { strings: { expandNode: '{label} öffnen', collapseNode: '{label} schließen' } });
        await user.click(screen.getByRole('button', { name: 'Acme Hosting öffnen' }));
        expect(row('Acme Hosting')).toHaveAttribute('aria-expanded', 'true');
        expect(row('Acme Hosting')).toHaveFocus();
        expect(screen.getByRole('button', { name: 'Acme Hosting schließen' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('sorts siblings by a heading: ascending, descending, then not at all', async () => {
        const onSortChange = vi.fn();
        const { user } = renderTable({ defaultExpanded: ['northwind'], onSortChange });
        const heading = screen.getByRole('columnheader', { name: /Open tickets/ });
        expect(heading).toHaveAttribute('aria-sort', 'none');
        expect(screen.getByRole('columnheader', { name: 'Role' })).not.toHaveAttribute('aria-sort');
        await user.click(within(heading).getByRole('button'));
        expect(heading).toHaveAttribute('aria-sort', 'ascending');
        expect(onSortChange).toHaveBeenLastCalledWith({ id: 'tickets', desc: false });
        expect(names()).toEqual(['Globex Shop', 'Acme Hosting', 'Northwind Agency', 'Billing', 'Support']);
        await user.click(within(heading).getByRole('button'));
        expect(heading).toHaveAttribute('aria-sort', 'descending');
        expect(names()).toEqual(['Northwind Agency', 'Support', 'Billing', 'Acme Hosting', 'Globex Shop']);
        await user.click(within(heading).getByRole('button'));
        expect(heading).toHaveAttribute('aria-sort', 'none');
        expect(onSortChange).toHaveBeenLastCalledWith(null);
        await expectNoAxeViolations();
    });

    it('checks a branch, shows a partly checked row as mixed, and checks every row from the heading', async () => {
        const onSelectedChange = vi.fn();
        const { user } = renderTable({ selectionMode: 'checkbox', defaultExpanded: ['northwind', 'support'], onSelectedChange }, { strings: { selectAll: 'Alle wählen' } });
        await user.click(screen.getByRole('checkbox', { name: 'Support' }));
        expect(screen.getByRole('checkbox', { name: 'Amara Okafor' })).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('checkbox', { name: 'Northwind Agency' })).toHaveAttribute('aria-checked', 'mixed');
        expect(row('Support')).toHaveFocus();
        expect(onSelectedChange).toHaveBeenLastCalledWith(['support', 'amara', 'jonas']);
        const all = screen.getByRole('checkbox', { name: 'Alle wählen' });
        expect(all).toHaveAttribute('aria-checked', 'mixed');
        await user.click(all);
        expect(all).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('checkbox', { name: 'Globex Shop' })).toHaveAttribute('aria-checked', 'true');
        await user.click(all);
        expect(onSelectedChange).toHaveBeenLastCalledWith([]);
        await user.click(screen.getByText('Amara Okafor'));
        expect(screen.getByRole('checkbox', { name: 'Amara Okafor' })).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('checkbox', { name: 'Support' })).toHaveAttribute('aria-checked', 'mixed');
        await expectNoAxeViolations();
    });

    it('pages the top-level rows, their children staying with them', async () => {
        const { user } = renderTable({ pageSize: 2, defaultExpanded: ['acme'] });
        expect(names()).toEqual(['Northwind Agency', 'Acme Hosting', 'Ravi Patel']);
        expect(screen.getByText('1–2 of 3')).toBeInTheDocument();
        await user.click(screen.getByRole('link', { name: 'Go to next page' }));
        expect(names()).toEqual(['Globex Shop']);
        expect(screen.getByText('3–3 of 3')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('opens or closes every row from the expand-all button', async () => {
        const { user } = renderTable({ expandAllButton: true }, { strings: { expandAll: 'Alle öffnen', collapseAll: 'Alle schließen' } });
        await user.click(screen.getByRole('button', { name: 'Alle öffnen' }));
        expect(row('Support')).toHaveAttribute('aria-expanded', 'true');
        expect(names()).toHaveLength(10);
        await user.click(screen.getByRole('button', { name: 'Alle schließen' }));
        expect(names()).toHaveLength(3);
        await expectNoAxeViolations();
    });

    it('loads children the first time a row opens, with a busy row and a status meanwhile', async () => {
        let resolve;
        const loadChildren = vi.fn(() => new Promise((r) => (resolve = r)));
        const nodes = [{ id: 'acme', label: 'Acme Hosting', data: { role: 'Organisation', tickets: 7 } }];
        const { user } = renderUi(<TreeTable aria-label="Organisations" nodes={nodes} columns={COLUMNS} loadChildren={loadChildren} />);
        row('Acme Hosting').focus();
        await user.keyboard('{ArrowRight}');
        expect(row('Acme Hosting')).toHaveAttribute('aria-busy', 'true');
        expect(screen.getByText('Loading Acme Hosting')).toBeInTheDocument();
        await act(async () => resolve([person('ravi', 'Ravi Patel', 'Engineer', 7)]));
        expect(row('Ravi Patel')).toHaveAttribute('aria-level', '2');
        expect(row('Acme Hosting')).not.toHaveAttribute('aria-busy');
        await expectNoAxeViolations();
    });

    it('dims the rows while loading, and draws placeholder rows before the first load', async () => {
        const { rerender } = renderTable({ loading: true });
        expect(screen.getByRole('treegrid')).toHaveAttribute('aria-busy', 'true');
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
        await expectNoAxeViolations();
        rerender(<TreeTable aria-label="Organisations" nodes={[]} columns={COLUMNS} loading />);
        expect(document.querySelectorAll('[data-slot=tree-table-skeleton]')).toHaveLength(4);
        await expectNoAxeViolations();
    });

    it('shows the empty message across the columns', async () => {
        const { rerender } = renderUi(<TreeTable aria-label="Organisations" nodes={[]} columns={COLUMNS} />);
        expect(screen.getByRole('gridcell', { name: 'No results' })).toHaveAttribute('colspan', '3');
        rerender(<TreeTable aria-label="Organisations" nodes={[]} columns={COLUMNS} empty="No organisations yet" />);
        expect(screen.getByText('No organisations yet')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('draws sizes, gridlines, stripes and a scrolling header', async () => {
        renderTable({ size: 'sm', gridlines: true, striped: true, scrollHeight: '10rem' });
        const cell = within(row('Acme Hosting')).getAllByRole('gridcell')[1];
        expect(cell.className).toContain('px-2');
        expect(cell.className).toContain('border-s');
        expect(row('Acme Hosting').className).toContain('even:bg-subtle');
        expect(document.querySelector('[data-slot=tree-table-container]').style.maxHeight).toBe('10rem');
        expect(document.querySelector('[data-slot=tree-table-header]').className).toContain('sticky');
        await expectNoAxeViolations();
    });

    it('flips Right and Left Arrow in a right-to-left page', async () => {
        const { user } = renderTable({}, { dir: 'rtl' });
        row('Acme Hosting').focus();
        await user.keyboard('{ArrowLeft}');
        expect(row('Acme Hosting')).toHaveAttribute('aria-expanded', 'true');
        await user.keyboard('{ArrowLeft}');
        expect(row('Ravi Patel')).toHaveFocus();
        await user.keyboard('{ArrowRight}{ArrowRight}');
        expect(row('Acme Hosting')).toHaveAttribute('aria-expanded', 'false');
    });

    it('extends the choice with Shift and an arrow key in multiple selection', async () => {
        const onSelectedChange = vi.fn();
        const { user } = renderTable({ selectionMode: 'multiple', onSelectedChange });
        expect(screen.getByRole('treegrid')).toHaveAttribute('aria-multiselectable', 'true');
        row('Northwind Agency').focus();
        await user.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}');
        expect(row('Globex Shop')).toHaveFocus();
        expect(onSelectedChange).toHaveBeenLastCalledWith(['acme', 'globex']);
        await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
        expect(onSelectedChange).toHaveBeenLastCalledWith(['globex']);
    });

    it('chooses every row with Control and A in multiple selection, then none', async () => {
        const onSelectedChange = vi.fn();
        const { user } = renderTable({ selectionMode: 'multiple', onSelectedChange });
        row('Northwind Agency').focus();
        await user.keyboard('{Control>}a{/Control}');
        expect(onSelectedChange).toHaveBeenLastCalledWith(['northwind', 'acme', 'globex']);
        await user.keyboard('{Control>}a{/Control}');
        expect(onSelectedChange).toHaveBeenLastCalledWith([]);
    });

    it('clears every row from the heading when the only unchecked rows are disabled', async () => {
        const onSelectedChange = vi.fn();
        const nodes = [ORGANISATIONS[1], { ...ORGANISATIONS[2], disabled: true, children: undefined }];
        const { user } = renderUi(
            <TreeTable aria-label="Organisations" nodes={nodes} columns={COLUMNS} selectionMode="checkbox" onSelectedChange={onSelectedChange} />,
        );
        const all = screen.getByRole('checkbox', { name: 'Select all' });
        await user.click(all);
        expect(onSelectedChange).toHaveBeenLastCalledWith(['acme', 'ravi']);
        expect(all).toHaveAttribute('aria-checked', 'mixed');
        await user.click(all);
        expect(onSelectedChange).toHaveBeenLastCalledWith([]);
        expect(all).toHaveAttribute('aria-checked', 'false');
    });

    it('names each row checkbox by its label, even when the row id holds a space', async () => {
        const nodes = [{ id: 'acme hosting', label: 'Acme Hosting', data: { role: 'Organisation', tickets: 7 } }];
        renderUi(<TreeTable aria-label="Organisations" nodes={nodes} columns={COLUMNS} selectionMode="checkbox" />);
        expect(screen.getByRole('checkbox', { name: 'Acme Hosting' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('takes its size from the provider unless it is given one', () => {
        const { rerender } = renderUi(<TreeTable aria-label="Organisations" nodes={ORGANISATIONS} columns={COLUMNS} />, { controlSize: 'sm' });
        expect(document.querySelector('[data-slot=tree-table]')).toHaveAttribute('data-size', 'sm');
        expect(within(row('Acme Hosting')).getAllByRole('gridcell')[1].className).toContain('px-2');
        rerender(<TreeTable aria-label="Organisations" nodes={ORGANISATIONS} columns={COLUMNS} size="lg" />);
        expect(document.querySelector('[data-slot=tree-table]')).toHaveAttribute('data-size', 'lg');
    });

    it('closes a row whose children fail to load and says so', async () => {
        let reject;
        const nodes = [{ id: 'acme', label: 'Acme Hosting', data: { role: 'Organisation', tickets: 7 } }];
        const { user } = renderUi(
            <TreeTable aria-label="Organisations" nodes={nodes} columns={COLUMNS} loadChildren={() => new Promise((_, r) => (reject = r))} />,
        );
        row('Acme Hosting').focus();
        await user.keyboard('{ArrowRight}');
        await act(async () => reject(new Error('offline')));
        expect(row('Acme Hosting')).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByText('Could not load Acme Hosting')).toBeInTheDocument();
    });
});
