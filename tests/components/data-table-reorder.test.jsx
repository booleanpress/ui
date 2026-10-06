import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { DataTable } from '@/components/data-table';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { ReorderableDataTable } from '@/components/data-table-reorder';
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

function status() {
    return document.querySelector('[data-slot=data-table-status]');
}

describe('ReorderableDataTable', () => {
    // jsdom has no layout: each body row is drawn 40px tall, one under the other, so dnd-kit can measure where to move.
    const rect = (top, height = 40) => ({ x: 0, y: top, top, left: 0, right: 600, bottom: top + height, width: 600, height, toJSON() {} });
    const original = HTMLElement.prototype.getBoundingClientRect;
    function layOutRows() {
        HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
            const row = this.closest('tr[data-slot=data-table-row]');
            if (!row) return original.call(this);
            const index = [...row.parentElement.children].indexOf(row);
            return rect(40 + index * 40);
        };
    }
    afterEach(() => {
        HTMLElement.prototype.getBoundingClientRect = original;
    });

    // The handle takes the first cell, so the recipient is the second.
    const recipients = () => bodyRows().map((row) => within(row).getAllByRole('cell')[1].textContent);

    function Reorder({ onMove, ...props }) {
        const [rows, setRows] = useState(DELIVERIES);
        return (
            <ReorderableDataTable
                aria-label="Deliveries"
                columns={COLUMNS}
                data={rows}
                getRowId={getRowId}
                onRowOrderChange={(next, move) => {
                    onMove?.(move);
                    setRows(next);
                }}
                {...props}
            />
        );
    }

    it('adds a drag handle named after its row at the start of each row', async () => {
        renderUi(<Reorder />);
        const handle = screen.getByRole('button', { name: 'Drag ana@example.com' });
        expect(handle).toHaveAttribute('data-slot', 'data-table-row-handle');
        expect(handle.closest('td')).toBe(within(bodyRows()[0]).getAllByRole('cell')[0]);
        expect(handle).not.toHaveAttribute('aria-roledescription');
        expect(screen.getAllByRole('button', { name: /^Drag / })).toHaveLength(4);
        await expectNoAxeViolations();
    });

    it('moves a row with the keyboard: Space picks it up, ArrowDown moves it, Space drops it, each step announced', async () => {
        layOutRows();
        const onMove = vi.fn();
        const { user } = renderUi(<Reorder onMove={onMove} />);
        screen.getByRole('button', { name: 'Drag ana@example.com' }).focus();
        await user.keyboard(' ');
        await waitFor(() => expect(status()).toHaveTextContent('Picked up ana@example.com at position 1 of 4.'));
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(status()).toHaveTextContent('ana@example.com moved to position 2 of 4'));
        await user.keyboard(' ');
        await waitFor(() => expect(recipients()).toEqual(['li@example.com', 'ana@example.com', 'sam@example.com', 'kim@example.com']));
        expect(onMove).toHaveBeenCalledWith({ rowId: 'm-1', from: 0, to: 1 });
        await waitFor(() => expect(screen.getByRole('button', { name: 'Drag ana@example.com' })).toHaveFocus());
    });

    it('moves a row up with ArrowUp, and puts it back with Escape', async () => {
        layOutRows();
        const onMove = vi.fn();
        const { user } = renderUi(<Reorder onMove={onMove} />);
        screen.getByRole('button', { name: 'Drag sam@example.com' }).focus();
        await user.keyboard(' ');
        await user.keyboard('{ArrowUp}');
        await waitFor(() => expect(status()).toHaveTextContent('sam@example.com moved to position 2 of 4'));
        await user.keyboard('{Escape}');
        await waitFor(() => expect(status()).toHaveTextContent('Move cancelled. sam@example.com is back at position 3 of 4.'));
        expect(onMove).not.toHaveBeenCalled();
        expect(recipients()).toEqual(DELIVERIES.map((row) => row.recipient));
        screen.getByRole('button', { name: 'Drag kim@example.com' }).focus();
        await user.keyboard(' ');
        await user.keyboard('{ArrowUp}');
        await user.keyboard('{Enter}');
        await waitFor(() => expect(onMove).toHaveBeenCalledWith({ rowId: 'm-4', from: 3, to: 2 }));
    });

    it('puts a row back with Escape inside a dialog, leaving the dialog open', async () => {
        layOutRows();
        const onMove = vi.fn();
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Delivery order</DialogTitle>
                    <DialogDescription>Drag the deliveries into order.</DialogDescription>
                    <Reorder onMove={onMove} />
                </DialogContent>
            </Dialog>
        );
        screen.getByRole('button', { name: 'Drag sam@example.com' }).focus();
        await user.keyboard(' ');
        await waitFor(() => expect(status()).toHaveTextContent('Picked up sam@example.com'));
        await user.keyboard('{ArrowUp}');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(status()).toHaveTextContent('Move cancelled. sam@example.com is back at position 3 of 4.'));
        expect(screen.getByRole('dialog', { name: 'Delivery order' })).toBeInTheDocument();
        expect(onMove).not.toHaveBeenCalled();
        // With no row moving, Escape closes the dialog as usual.
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('rests the handles while the table is sorted, or without onRowOrderChange', async () => {
        const { user, rerender } = renderUi(<Reorder sorting />);
        expect(screen.getByRole('button', { name: 'Drag ana@example.com' })).toBeEnabled();
        await user.click(screen.getByRole('button', { name: 'Recipient' }));
        expect(screen.getByRole('button', { name: 'Drag ana@example.com' })).toBeDisabled();
        rerender(<ReorderableDataTable aria-label="Deliveries" columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} />);
        expect(screen.getByRole('button', { name: 'Drag li@example.com' })).toBeDisabled();
    });

    it('names the handles and the announcements from the provider strings', async () => {
        layOutRows();
        const { user } = renderUi(<Reorder />, {
            strings: { dragHandle: '{item} verschieben', dragStarted: '{item} aufgenommen, Position {position} von {total}.' },
            locale: 'de-DE',
        });
        screen.getByRole('button', { name: 'li@example.com verschieben' }).focus();
        await user.keyboard(' ');
        await waitFor(() => expect(status()).toHaveTextContent('li@example.com aufgenommen, Position 2 von 4.'));
        await user.keyboard('{Escape}');
    });

    it('is the only way to move rows: a plain DataTable leaves the handles out', () => {
        renderUi(<DataTable aria-label="Deliveries" rowReordering columns={COLUMNS} data={DELIVERIES} getRowId={getRowId} onRowOrderChange={() => {}} />);
        expect(screen.queryByRole('button', { name: /^Drag / })).toBeNull();
        expect(within(bodyRows()[0]).getAllByRole('cell')[0]).toHaveTextContent('ana@example.com');
        expect(document.querySelector('[id^=DndDescribedBy], [id^=DndLiveRegion]')).toBeNull();
    });
});
