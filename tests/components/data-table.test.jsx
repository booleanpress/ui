import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, within } from '@testing-library/react';
import { DataTable, downloadCsv, exportToCsv, useDataTable } from '@/components/data-table';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { DropdownMenuItem } from '@/components/dropdown-menu';
import { DataTableRowActions } from '@/components/data-table';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const DELIVERIES = [
    { id: 'm-1', recipient: 'ana@example.com', subject: 'Your invoice', status: 'Delivered', opens: 3 },
    { id: 'm-2', recipient: 'li@example.com', subject: 'Password reset', status: 'Bounced', opens: 0 },
    { id: 'm-3', recipient: 'sam@example.com', subject: 'Welcome aboard', status: 'Delivered', opens: 7 },
    { id: 'm-4', recipient: 'kim@example.com', subject: 'Weekly digest, October', status: 'Deferred', opens: 1 },
];

const COLUMNS = [
    { accessorKey: 'recipient', header: 'Recipient' },
    { accessorKey: 'subject', header: 'Subject' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'opens', header: 'Opens', meta: { align: 'end' } },
];

const getRowId = (row) => row.id;

function bodyRows() {
    return screen.getAllByRole('row').filter((row) => row.getAttribute('data-slot') === 'data-table-row');
}

function firstColumn() {
    return bodyRows().map((row) => within(row).getAllByRole('cell')[0].textContent);
}

function status() {
    return document.querySelector('[data-slot=data-table-status]');
}

describe('DataTable', () => {
    it('renders a native table with column headers and one row per record', async () => {
        renderUi(<DataTable aria-label="Deliveries" columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />);
        const table = screen.getByRole('table', { name: 'Deliveries' });
        expect(table.tagName).toBe('TABLE');
        expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Recipient', 'Subject', 'Status', 'Opens']);
        expect(firstColumn()).toEqual(DELIVERIES.map((row) => row.recipient));
        await expectNoAxeViolations();
    });

    it('sorts by a column title with Enter, cycling ascending, descending and off, and announces it', async () => {
        const { user } = renderUi(<DataTable aria-label="Deliveries" sorting columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />);
        const header = screen.getByRole('columnheader', { name: /Recipient/ });
        expect(header).toHaveAttribute('aria-sort', 'none');
        within(header).getByRole('button', { name: 'Recipient' }).focus();
        await user.keyboard('{Enter}');
        expect(header).toHaveAttribute('aria-sort', 'ascending');
        expect(firstColumn()).toEqual(['ana@example.com', 'kim@example.com', 'li@example.com', 'sam@example.com']);
        expect(status()).toHaveTextContent('Sorted by Recipient, ascending');
        await user.keyboard('{Enter}');
        expect(header).toHaveAttribute('aria-sort', 'descending');
        expect(firstColumn()[0]).toBe('sam@example.com');
        await user.keyboard('{Enter}');
        expect(header).toHaveAttribute('aria-sort', 'none');
        expect(status()).toHaveTextContent('Not sorted');
        await expectNoAxeViolations();
    });

    it('sorts with Space, and adds a second column to the sort with Shift', async () => {
        const { user } = renderUi(<DataTable aria-label="Deliveries" sorting columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />);
        screen.getByRole('button', { name: 'Status' }).focus();
        await user.keyboard(' ');
        expect(screen.getByRole('columnheader', { name: /Status/ })).toHaveAttribute('aria-sort', 'ascending');
        await user.keyboard('{Shift>}');
        await user.click(screen.getByRole('button', { name: 'Opens' }));
        await user.keyboard('{/Shift}');
        // Bounced, Deferred, then the two Delivered rows by their opens.
        expect(firstColumn()).toEqual(['li@example.com', 'kim@example.com', 'ana@example.com', 'sam@example.com']);
        // aria-sort stays on the first column of the sort.
        expect(screen.getByRole('columnheader', { name: /Opens/ })).toHaveAttribute('aria-sort', 'none');
        expect(status()).toHaveTextContent('Sorted by Status, ascending; Sorted by Opens, ascending');
    });

    it('adds a column to the sort with Shift and Enter', async () => {
        const { user } = renderUi(<DataTable aria-label="Deliveries" sorting columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />);
        screen.getByRole('button', { name: 'Status' }).focus();
        await user.keyboard('{Enter}');
        screen.getByRole('button', { name: 'Opens' }).focus();
        await user.keyboard('{Shift>}{Enter}{/Shift}');
        expect(firstColumn()).toEqual(['li@example.com', 'kim@example.com', 'ana@example.com', 'sam@example.com']);
        expect(screen.getByRole('columnheader', { name: /Status/ })).toHaveAttribute('aria-sort', 'ascending');
        expect(status()).toHaveTextContent('Sorted by Status, ascending; Sorted by Opens, ascending');
    });

    it('selects rows with Space on their named checkboxes, and the header box shows mixed, then all', async () => {
        const onRowSelectionChange = vi.fn();
        function Selectable() {
            const [rowSelection, setRowSelection] = useState({});
            return (
                <DataTable
                    aria-label="Deliveries"
                    selection="multiple"
                    toolbar={<h3>Deliveries</h3>}
                    columns={COLUMNS}
                    data={DELIVERIES}
                    getRowId={getRowId}
                    state={{ rowSelection }}
                    onRowSelectionChange={(updater) => {
                        onRowSelectionChange(updater);
                        setRowSelection(updater);
                    }}
                />
            );
        }
        const { user } = renderUi(<Selectable />);
        const all = screen.getByRole('checkbox', { name: 'Select all rows on this page' });
        const li = screen.getByRole('checkbox', { name: 'Select row li@example.com' });
        li.focus();
        await user.keyboard(' ');
        expect(li).toHaveAttribute('aria-checked', 'true');
        expect(li.closest('tr')).toHaveAttribute('data-state', 'selected');
        expect(all).toHaveAttribute('aria-checked', 'mixed');
        expect(screen.getByText('1 selected', { exact: false })).toBeInTheDocument();
        await expectNoAxeViolations();
        all.focus();
        await user.keyboard(' ');
        expect(all).toHaveAttribute('aria-checked', 'true');
        expect(screen.getAllByRole('checkbox', { name: /^Select row/ }).every((box) => box.getAttribute('aria-checked') === 'true')).toBe(true);
        await user.keyboard(' ');
        expect(all).toHaveAttribute('aria-checked', 'false');
        expect(onRowSelectionChange).toHaveBeenCalled();
    });

    it('selects a range of rows with Shift and a press on a row', async () => {
        const { user } = renderUi(<DataTable aria-label="Deliveries" selection="multiple" columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />);
        await user.click(screen.getByText('ana@example.com'));
        await user.keyboard('{Shift>}');
        await user.click(screen.getByText('sam@example.com'));
        await user.keyboard('{/Shift}');
        expect(bodyRows().map((row) => row.getAttribute('data-state'))).toEqual(['selected', 'selected', 'selected', null]);
    });

    it('selects one row with radios, and the arrow keys move the selection', async () => {
        const { user } = renderUi(<DataTable aria-label="Deliveries" selection="single" columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />);
        const ana = screen.getByRole('radio', { name: 'Select row ana@example.com' });
        await user.click(ana);
        expect(ana).toBeChecked();
        await user.keyboard('{ArrowDown}');
        const li = screen.getByRole('radio', { name: 'Select row li@example.com' });
        expect(li).toBeChecked();
        expect(li).toHaveFocus();
        expect(bodyRows().filter((row) => row.getAttribute('data-state') === 'selected')).toHaveLength(1);
        await user.click(screen.getByText('sam@example.com'));
        expect(screen.getByRole('radio', { name: 'Select row sam@example.com' })).toBeChecked();
        await expectNoAxeViolations();
    });

    it('expands a row with Enter on its named button, showing what renderSubRow returns', async () => {
        const { user } = renderUi(
            <DataTable
                aria-label="Deliveries"
                columns={COLUMNS}
                data={DELIVERIES}
                getRowId={getRowId}
                renderSubRow={(row) => <p>Events for {row.original.recipient}</p>}
            />
        );
        const button = screen.getByRole('button', { name: 'Expand row ana@example.com' });
        expect(button).toHaveAttribute('aria-expanded', 'false');
        button.focus();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('button', { name: 'Collapse row ana@example.com' })).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('Events for ana@example.com')).toBeInTheDocument();
        await expectNoAxeViolations();
        await user.keyboard(' ');
        expect(screen.queryByText('Events for ana@example.com')).not.toBeInTheDocument();
    });

    it('edits a cell: Enter starts, Enter commits, focus returns to the cell', async () => {
        const onCellEdit = vi.fn();
        const columns = [{ accessorKey: 'subject', header: 'Subject', meta: { editor: 'text' } }, COLUMNS[2]];
        const { user } = renderUi(<DataTable aria-label="Deliveries" columns={columns} data={DELIVERIES} getRowId={getRowId} onCellEdit={onCellEdit} />);
        const cell = screen.getByRole('button', { name: 'Edit Subject Your invoice' });
        cell.focus();
        await user.keyboard('{Enter}');
        const field = screen.getByRole('textbox', { name: 'Subject' });
        expect(field).toHaveFocus();
        await user.clear(field);
        await user.type(field, 'Your receipt{Enter}');
        expect(onCellEdit).toHaveBeenCalledWith({ row: DELIVERIES[0], rowId: 'm-1', columnId: 'subject', value: 'Your receipt' });
        expect(screen.queryByRole('textbox', { name: 'Subject' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit Subject Your invoice' })).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('edits a cell: F2 starts, Escape cancels, focus returns to the cell', async () => {
        const onCellEdit = vi.fn();
        const columns = [{ accessorKey: 'opens', header: 'Opens', meta: { editor: 'number' } }];
        const { user } = renderUi(<DataTable aria-label="Deliveries" columns={columns} data={DELIVERIES} getRowId={getRowId} onCellEdit={onCellEdit} />);
        const cell = screen.getByRole('button', { name: 'Edit Opens 3' });
        cell.focus();
        await user.keyboard('{F2}');
        const field = screen.getByRole('spinbutton', { name: 'Opens' });
        await user.type(field, '9');
        await user.keyboard('{Escape}');
        expect(onCellEdit).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Edit Opens 3' })).toHaveFocus();
    });

    it('cancels an edit with Escape inside a dialog without closing the dialog', async () => {
        const onCellEdit = vi.fn();
        const columns = [{ accessorKey: 'subject', header: 'Subject', meta: { editor: 'text' } }];
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Edit subjects</DialogTitle>
                    <DialogDescription>Change the subject lines.</DialogDescription>
                    <DataTable aria-label="Deliveries" columns={columns} data={DELIVERIES} getRowId={getRowId} onCellEdit={onCellEdit} />
                </DialogContent>
            </Dialog>
        );
        screen.getByRole('button', { name: 'Edit Subject Your invoice' }).focus();
        await user.keyboard('{F2}');
        await user.type(screen.getByRole('textbox', { name: 'Subject' }), ' x');
        await user.keyboard('{Escape}');
        expect(screen.getByRole('dialog', { name: 'Edit subjects' })).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: 'Subject' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit Subject Your invoice' })).toHaveFocus();
        expect(onCellEdit).not.toHaveBeenCalled();
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('filters over every column with the search field and per column, announcing the result count', async () => {
        const { user } = renderUi(<DataTable aria-label="Deliveries" filtering columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />);
        await user.type(screen.getByRole('textbox', { name: 'Search' }), 'delivered');
        expect(bodyRows()).toHaveLength(2);
        expect(status()).toHaveTextContent('2 results');
        await user.clear(screen.getByRole('textbox', { name: 'Search' }));
        await user.type(screen.getByRole('textbox', { name: 'Filter Recipient' }), 'li@');
        expect(firstColumn()).toEqual(['li@example.com']);
        expect(status()).toHaveTextContent('1 results');
        await user.type(screen.getByRole('textbox', { name: 'Filter Subject' }), 'zzz');
        expect(screen.getByText('No results')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('pages the rows and announces the range of the new page', async () => {
        const many = Array.from({ length: 23 }, (_, index) => ({ id: `m-${index + 1}`, recipient: `user${index + 1}@example.com`, subject: 'Digest', status: 'Delivered', opens: index }));
        const { user } = renderUi(<DataTable aria-label="Deliveries" pagination columns={COLUMNS} data={many} getRowId={getRowId} />);
        expect(bodyRows()).toHaveLength(10);
        await user.click(screen.getByRole('link', { name: 'Go to next page' }));
        expect(firstColumn()[0]).toBe('user11@example.com');
        expect(status()).toHaveTextContent('11–20 of 23');
        await user.click(screen.getByRole('link', { name: '3' }));
        expect(bodyRows()).toHaveLength(3);
        expect(screen.getByRole('link', { name: '3' })).toHaveAttribute('aria-current', 'page');
        await expectNoAxeViolations();
    });

    it('hides a column from the toolbar Columns menu and from the column menu', async () => {
        const { user } = renderUi(<DataTable aria-label="Deliveries" columnVisibility columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />);
        await user.click(screen.getByRole('button', { name: 'Columns' }));
        await user.click(screen.getByRole('menuitemcheckbox', { name: 'Subject' }));
        expect(screen.queryByRole('columnheader', { name: /Subject/ })).not.toBeInTheDocument();
        await user.keyboard('{Escape}');
        screen.getByRole('button', { name: 'Status options' }).focus();
        await user.keyboard('{Enter}');
        await user.click(screen.getByRole('menuitem', { name: 'Hide column' }));
        expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Recipient', 'Opens']);
        await expectNoAxeViolations();
    });

    it('moves a column with Move right in its menu', async () => {
        const { user } = renderUi(<DataTable aria-label="Deliveries" columnOrdering columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />);
        screen.getByRole('button', { name: 'Recipient options' }).focus();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('menuitem', { name: 'Move left' })).toHaveAttribute('aria-disabled', 'true');
        await user.click(screen.getByRole('menuitem', { name: 'Move right' }));
        expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Subject', 'Recipient', 'Status', 'Opens']);
    });

    it('resizes a column with the arrow keys on its named handle', async () => {
        const onColumnSizingChange = vi.fn();
        function Resizable() {
            const [columnSizing, setColumnSizing] = useState({});
            return (
                <DataTable
                    aria-label="Deliveries"
                    columnResizing
                    columns={COLUMNS}
                    data={DELIVERIES}
                    getRowId={getRowId}
                    state={{ columnSizing }}
                    onColumnSizingChange={(updater) => {
                        onColumnSizingChange(updater);
                        setColumnSizing(updater);
                    }}
                />
            );
        }
        const { user } = renderUi(<Resizable />);
        const handle = screen.getByRole('separator', { name: 'Resize Recipient' });
        expect(handle).toHaveAttribute('aria-valuenow', '150');
        handle.focus();
        await user.keyboard('{ArrowRight}');
        expect(handle).toHaveAttribute('aria-valuenow', '160');
        await user.keyboard('{ArrowLeft}{ArrowLeft}');
        expect(handle).toHaveAttribute('aria-valuenow', '140');
        expect(onColumnSizingChange).toHaveBeenCalled();
        await expectNoAxeViolations();
    });

    it('swaps the resize arrows in a right-to-left page', async () => {
        const { user } = renderUi(<DataTable aria-label="Deliveries" columnResizing columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />, { dir: 'rtl' });
        const handle = screen.getByRole('separator', { name: 'Resize Recipient' });
        handle.focus();
        await user.keyboard('{ArrowLeft}');
        expect(handle).toHaveAttribute('aria-valuenow', '160');
    });

    it('writes the visible data columns and rows, in the order shown, as CSV', () => {
        let instance;
        function Probe() {
            instance = useDataTable({
                columns: [...COLUMNS, { id: 'actions', cell: () => null }],
                data: DELIVERIES,
                getRowId,
                sorting: true,
                selection: 'multiple',
                initialState: { sorting: [{ id: 'opens', desc: true }], columnVisibility: { status: false } },
            });
            return null;
        }
        renderUi(<Probe />);
        expect(exportToCsv(instance).split('\r\n')).toEqual([
            'Recipient,Subject,Opens',
            'sam@example.com,Welcome aboard,7',
            'ana@example.com,Your invoice,3',
            'kim@example.com,"Weekly digest, October",1',
            'li@example.com,Password reset,0',
        ]);
        expect(exportToCsv(instance, { separator: ';' }).split('\r\n')[3]).toBe('kim@example.com;Weekly digest, October;1');
    });

    it('quotes double quotes and line breaks, and keeps formulas as text', () => {
        let instance;
        function Probe() {
            instance = useDataTable({
                columns: [{ accessorKey: 'note', header: 'Note "internal"' }],
                data: [{ note: 'Line one\nline two' }, { note: '=HYPERLINK("x")' }, { note: '-12.5' }],
            });
            return null;
        }
        renderUi(<Probe />);
        expect(exportToCsv(instance)).toBe('"Note ""internal"""\r\n"Line one\nline two"\r\n"\'=HYPERLINK(""x"")"\r\n-12.5');
    });

    it('hands sorting, filtering and paging to the server in server mode', async () => {
        const calls = [];
        function Server() {
            const [sorting, setSorting] = useState([]);
            const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 2 });
            calls.push({ sorting, pagination });
            return (
                <DataTable
                    aria-label="Deliveries"
                    sorting
                    pagination
                    manualSorting
                    manualPagination
                    rowCount={40}
                    columns={COLUMNS}
                    data={DELIVERIES.slice(0, 2)}
                    getRowId={getRowId}
                    state={{ sorting, pagination }}
                    onSortingChange={setSorting}
                    onPaginationChange={setPagination}
                />
            );
        }
        const { user } = renderUi(<Server />);
        await user.click(screen.getByRole('button', { name: 'Opens' }));
        expect(calls.at(-1).sorting).toEqual([{ id: 'opens', desc: false }]);
        // The rows stay in the server's order.
        expect(firstColumn()).toEqual(['ana@example.com', 'li@example.com']);
        await user.click(screen.getByRole('link', { name: 'Go to next page' }));
        expect(calls.at(-1).pagination).toEqual({ pageIndex: 1, pageSize: 2 });
        expect(screen.getByRole('link', { name: '20' })).toBeInTheDocument();
    });

    it('shows skeleton rows while the first rows load, and a spinner over the rows while they refresh', async () => {
        const { rerender } = renderUi(<DataTable aria-label="Deliveries" loading columns={COLUMNS} data={[]} />);
        expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
        expect(document.querySelectorAll('[data-slot=data-table-skeleton-row]')).toHaveLength(5);
        expect(status()).toHaveTextContent('Loading');
        await expectNoAxeViolations();
        rerender(<DataTable aria-label="Deliveries" loading columns={COLUMNS} data={DELIVERIES} />);
        expect(document.querySelector('[data-slot=data-table-loading]')).not.toBeNull();
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('says when there are no rows, or shows its empty content', async () => {
        const { rerender } = renderUi(<DataTable aria-label="Deliveries" columns={COLUMNS} data={[]} />);
        expect(screen.getByRole('cell', { name: 'No rows' })).toHaveAttribute('colspan', '4');
        rerender(<DataTable aria-label="Deliveries" columns={COLUMNS} data={[]} empty={<p>No emails sent yet</p>} />);
        expect(screen.getByText('No emails sent yet')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('draws only the rows in view of 10,000, keeping the row count and indexes', async () => {
        const many = Array.from({ length: 10000 }, (_, index) => ({ id: String(index), recipient: `user${index}@example.com`, subject: 'Digest', status: 'Delivered', opens: index }));
        // jsdom has no layout: the scroll box reports the 400px it would be.
        const height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
        renderUi(<DataTable aria-label="Deliveries" virtual maxHeight={400} columns={COLUMNS} data={many} getRowId={getRowId} />);
        const rows = bodyRows();
        expect(rows.length).toBeGreaterThan(0);
        expect(rows.length).toBeLessThan(40);
        expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '10001');
        expect(rows[0]).toHaveAttribute('aria-rowindex', '2');
        await expectNoAxeViolations();
        height.mockRestore();
    });

    it('groups rows under header rows that expand, with totals', async () => {
        const columns = [
            { accessorKey: 'status', header: 'Status' },
            { accessorKey: 'recipient', header: 'Recipient' },
            { accessorKey: 'opens', header: 'Opens', aggregationFn: 'sum' },
        ];
        const { user } = renderUi(
            <DataTable aria-label="Deliveries" grouping columns={columns} data={DELIVERIES} getRowId={getRowId} initialState={{ grouping: ['status'] }} />
        );
        const groups = document.querySelectorAll('[data-slot=data-table-group-row]');
        expect([...groups].map((row) => row.textContent)).toEqual(['Delivered2', 'Bounced1', 'Deferred1']);
        expect(bodyRows()).toHaveLength(4);
        const footers = document.querySelectorAll('[data-slot=data-table-group-footer]');
        expect(footers[0].textContent).toBe('10');
        await user.click(screen.getByRole('button', { name: 'Collapse row Delivered' }));
        expect(bodyRows()).toHaveLength(2);
        await expectNoAxeViolations();
    });

    it('names the row actions after the row', async () => {
        const columns = [
            COLUMNS[0],
            {
                id: 'actions',
                cell: ({ row }) => (
                    <DataTableRowActions label={row.original.recipient}>
                        <DropdownMenuItem>Resend</DropdownMenuItem>
                    </DataTableRowActions>
                ),
            },
        ];
        const { user } = renderUi(<DataTable aria-label="Deliveries" columns={columns} data={DELIVERIES} getRowId={getRowId} />);
        await user.click(screen.getByRole('button', { name: 'Actions for li@example.com' }));
        expect(screen.getByRole('menuitem', { name: 'Resend' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('takes its strings from the provider', () => {
        renderUi(<DataTable aria-label="Envois" selection="multiple" columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />, {
            strings: { selectRow: 'Sélectionner {name}', selectAllRows: 'Tout sélectionner' },
        });
        expect(screen.getByRole('checkbox', { name: 'Sélectionner ana@example.com' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Tout sélectionner' })).toBeInTheDocument();
    });

    it('shows First and Last round the pages, and leaves them out with showEdges: false', async () => {
        const many = Array.from({ length: 23 }, (_, index) => ({ id: `m-${index + 1}`, recipient: `user${index + 1}@example.com`, subject: 'Digest', status: 'Delivered', opens: index }));
        const { user, rerender } = renderUi(<DataTable aria-label="Deliveries" pagination columns={COLUMNS} data={many} getRowId={getRowId} />);
        expect(screen.getByRole('link', { name: 'Go to first page' })).toHaveAttribute('aria-disabled', 'true');
        await user.click(screen.getByRole('link', { name: 'Go to last page' }));
        expect(firstColumn()[0]).toBe('user21@example.com');
        expect(screen.getByRole('link', { name: 'Go to last page' })).toHaveAttribute('aria-disabled', 'true');
        await user.click(screen.getByRole('link', { name: 'Go to first page' }));
        expect(firstColumn()[0]).toBe('user1@example.com');
        rerender(<DataTable aria-label="Deliveries" pagination={{ showEdges: false }} columns={COLUMNS} data={many} getRowId={getRowId} />);
        expect(screen.queryByRole('link', { name: 'Go to first page' })).toBeNull();
    });

    it('goes back to the first page when a filter or a sort changes the rows', async () => {
        const many = Array.from({ length: 35 }, (_, index) => ({ id: `m-${index + 1}`, recipient: `user${index + 1}@example.com`, subject: 'Digest', status: index % 5 ? 'Delivered' : 'Bounced', opens: index }));
        const { user } = renderUi(<DataTable aria-label="Deliveries" pagination sorting filtering="global" columns={COLUMNS} data={many} getRowId={getRowId} />);
        await user.click(screen.getByRole('link', { name: '4' }));
        expect(bodyRows()).toHaveLength(5);
        await user.type(screen.getByRole('textbox', { name: 'Search' }), 'bounced');
        expect(bodyRows()).toHaveLength(7);
        expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('aria-current', 'page');
        await user.clear(screen.getByRole('textbox', { name: 'Search' }));
        await user.click(screen.getByRole('link', { name: '3' }));
        await user.click(screen.getByRole('button', { name: 'Opens' }));
        expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('aria-current', 'page');
        expect(firstColumn()[0]).toBe('user1@example.com');
    });

    it('counts only the selected rows still in the data, unless the server pages', async () => {
        function Removable() {
            const [data, setData] = useState(DELIVERIES);
            return (
                <>
                    <button type="button" onClick={() => setData((rows) => rows.slice(2))}>Delete the first two</button>
                    <DataTable aria-label="Deliveries" selection="multiple" toolbar={<h3>Deliveries</h3>} columns={COLUMNS} data={data} getRowId={getRowId} />
                </>
            );
        }
        const { user, unmount } = renderUi(<Removable />);
        await user.click(screen.getByRole('checkbox', { name: 'Select row ana@example.com' }));
        await user.click(screen.getByRole('checkbox', { name: 'Select row sam@example.com' }));
        expect(document.querySelector('[data-slot=data-table-selected-count]')).toHaveTextContent('2 selected');
        await user.click(screen.getByRole('button', { name: 'Delete the first two' }));
        expect(document.querySelector('[data-slot=data-table-selected-count]')).toHaveTextContent('1 selected');
        unmount();
        // The server pages: ids of other pages count.
        renderUi(
            <DataTable
                aria-label="Deliveries"
                selection="multiple"
                toolbar={<h3>Deliveries</h3>}
                pagination
                manualPagination
                rowCount={40}
                columns={COLUMNS}
                data={DELIVERIES}
                getRowId={getRowId}
                state={{ rowSelection: { 'm-1': true, 'm-30': true, 'm-31': true } }}
            />
        );
        expect(document.querySelector('[data-slot=data-table-selected-count]')).toHaveTextContent('3 selected');
    });

    it('starts at the first of its page sizes, shown in the rows-per-page select', () => {
        const many = Array.from({ length: 60 }, (_, index) => ({ id: `m-${index + 1}`, recipient: `user${index + 1}@example.com`, subject: 'Digest', status: 'Delivered', opens: index }));
        renderUi(<DataTable aria-label="Deliveries" pagination={{ pageSizes: [25, 50], range: true }} columns={COLUMNS} data={many} getRowId={getRowId} />);
        expect(bodyRows()).toHaveLength(25);
        expect(screen.getByRole('combobox', { name: 'Rows per page' })).toHaveTextContent('25');
        expect(screen.getByText('1–25 of 60')).toBeInTheDocument();
    });

    it('shows a page past the end as the last page, in the paginator and the range', () => {
        renderUi(
            <DataTable
                aria-label="Deliveries"
                pagination={{ range: true }}
                manualPagination
                rowCount={23}
                columns={COLUMNS}
                data={[]}
                getRowId={getRowId}
                state={{ pagination: { pageIndex: 5, pageSize: 10 } }}
            />
        );
        expect(screen.getByRole('link', { name: '3' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByText('21–23 of 23')).toBeInTheDocument();
    });

    it('writes any text that starts like a formula as text, and leaves plain numbers alone', () => {
        let instance;
        function Probe() {
            instance = useDataTable({
                columns: [{ accessorKey: 'note', header: 'Note' }],
                data: [
                    { note: "-2+3+cmd|' /C calc'!A0" },
                    { note: '+1+1' },
                    { note: '@SUM(A1:A2)' },
                    { note: '\t=1' },
                    { note: '-12.5' },
                    { note: '-1,5' },
                    { note: -3 },
                    { note: 'Cost: -5' },
                ],
            });
            return null;
        }
        renderUi(<Probe />);
        expect(exportToCsv(instance, { separator: ';' }).split('\r\n')).toEqual([
            'Note',
            "'-2+3+cmd|' /C calc'!A0",
            "'+1+1",
            "'@SUM(A1:A2)",
            "'\t=1",
            '-12.5',
            '-1,5',
            '-3',
            'Cost: -5',
        ]);
    });

    it('keeps the file address alive after the download starts, and frees it later', () => {
        vi.useFakeTimers();
        const create = vi.fn(() => 'blob:csv');
        const revoke = vi.fn();
        const saved = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
        URL.createObjectURL = create;
        URL.revokeObjectURL = revoke;
        const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
        try {
            downloadCsv('a,b', 'deliveries.csv');
            expect(click).toHaveBeenCalledTimes(1);
            vi.advanceTimersByTime(1000);
            expect(revoke).not.toHaveBeenCalled();
            vi.advanceTimersByTime(60_000);
            expect(revoke).toHaveBeenCalledWith('blob:csv');
        } finally {
            click.mockRestore();
            URL.createObjectURL = saved.create;
            URL.revokeObjectURL = saved.revoke;
            vi.useRealTimers();
        }
    });

    it('counts the footer rows in a virtual table, each with its row index', () => {
        const many = Array.from({ length: 500 }, (_, index) => ({ id: String(index), recipient: `user${index}@example.com`, subject: 'Digest', status: 'Delivered', opens: 1 }));
        const columns = [COLUMNS[0], { ...COLUMNS[3], footer: 'Total 500' }];
        const height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
        try {
            renderUi(<DataTable aria-label="Deliveries" virtual maxHeight={400} columns={columns} data={many} getRowId={getRowId} />);
            expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '502');
            expect(screen.getByText('Total 500').closest('tr')).toHaveAttribute('aria-rowindex', '502');
        } finally {
            height.mockRestore();
        }
    });

    it('resizes from the handle without dragging the header it sits in', () => {
        renderUi(<DataTable aria-label="Deliveries" columnResizing columnOrdering columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />);
        const handle = screen.getByRole('separator', { name: 'Resize Recipient' });
        expect(handle.closest('th')).toHaveAttribute('draggable', 'true');
        // fireEvent returns false when the default action (a drag, a text selection) was prevented.
        expect(fireEvent.mouseDown(handle, { clientX: 100 })).toBe(false);
        fireEvent.mouseUp(document, { clientX: 100 });
    });

    it('moves a column dragged onto another of its headers, and ignores one dragged from another table', () => {
        renderUi(
            <>
                <DataTable aria-label="Deliveries" columnOrdering columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />
                <DataTable aria-label="Archive" columnOrdering columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />
            </>
        );
        const store = {};
        const dataTransfer = { setData: (type, value) => (store[type] = value), getData: (type) => store[type] ?? '', get types() { return Object.keys(store); }, effectAllowed: '', dropEffect: '' };
        const [main, archive] = screen.getAllByRole('table');
        const head = (table, name) => within(table).getByRole('columnheader', { name: new RegExp(name) });
        const titles = (table) => within(table).getAllByRole('columnheader').map((th) => th.textContent);
        fireEvent.dragStart(head(main, 'Recipient'), { dataTransfer });
        fireEvent.dragOver(head(archive, 'Status'), { dataTransfer });
        fireEvent.drop(head(archive, 'Status'), { dataTransfer });
        expect(titles(archive)).toEqual(['Recipient', 'Subject', 'Status', 'Opens']);
        fireEvent.drop(head(main, 'Status'), { dataTransfer });
        expect(titles(main)).toEqual(['Subject', 'Status', 'Recipient', 'Opens']);
    });

    it('keeps the last column shown: its Hide items are disabled', async () => {
        const { user } = renderUi(<DataTable aria-label="Deliveries" columnVisibility columns={COLUMNS.slice(0, 2)} data={DELIVERIES} getRowId={getRowId} />);
        await user.click(screen.getByRole('button', { name: 'Subject options' }));
        await user.click(screen.getByRole('menuitem', { name: 'Hide column' }));
        await user.click(screen.getByRole('button', { name: 'Recipient options' }));
        expect(screen.getByRole('menuitem', { name: 'Hide column' })).toHaveAttribute('aria-disabled', 'true');
        await user.keyboard('{Escape}');
        await user.click(screen.getByRole('button', { name: 'Columns' }));
        expect(screen.getByRole('menuitemcheckbox', { name: 'Recipient' })).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByRole('menuitemcheckbox', { name: 'Subject' })).not.toHaveAttribute('aria-disabled');
    });

    it('moves a column the way its menu says in a right-to-left page', async () => {
        const { user } = renderUi(<DataTable aria-label="Deliveries" columnOrdering columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />, { dir: 'rtl' });
        await user.click(screen.getByRole('button', { name: 'Recipient options' }));
        // The first column sits on the right edge: it can only move left, which is towards the end.
        expect(screen.getByRole('menuitem', { name: 'Move right' })).toHaveAttribute('aria-disabled', 'true');
        await user.click(screen.getByRole('menuitem', { name: 'Move left' }));
        expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Subject', 'Recipient', 'Status', 'Opens']);
    });

    it('reaches its size, gridlines and stripes through data attributes', () => {
        const { container, rerender } = renderUi(<DataTable aria-label="Deliveries" size="sm" gridlines striped columns={COLUMNS} data={DELIVERIES} />);
        const root = container.querySelector('[data-slot=data-table]');
        expect(root).toHaveAttribute('data-size', 'sm');
        expect(root).toHaveAttribute('data-gridlines');
        expect(root).toHaveAttribute('data-striped');
        rerender(<DataTable aria-label="Deliveries" columns={COLUMNS} data={DELIVERIES} />);
        expect(container.querySelector('[data-slot=data-table]')).toHaveAttribute('data-size', 'default');
    });
});
