import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, screen, within } from '@testing-library/react';
import { Checkbox } from '@/components/checkbox';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/table';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const ROWS = [
    { id: 't-1', subject: 'Cannot connect' },
    { id: 't-2', subject: 'Missing VAT number' },
];

function Basic() {
    return (
        <Table>
            <TableCaption>Open tickets</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Subject</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {ROWS.map((r) => (
                    <TableRow key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.subject}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>2</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}

describe('Table', () => {
    it('renders native table semantics, named by its caption', async () => {
        renderUi(<Basic />);
        const table = screen.getByRole('table', { name: 'Open tickets' });
        expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Ticket', 'Subject']);
        expect(within(table).getAllByRole('row')).toHaveLength(4);
        expect(within(table).getByRole('cell', { name: 'Missing VAT number' })).toBeInTheDocument();
        expect(table.closest('[data-slot="table-container"]')).not.toBeNull();
        await expectNoAxeViolations();
    });

    it('fills a selected row with the highlight colour, not the hover colour', () => {
        renderUi(
            <Table aria-label="Tickets">
                <TableBody>
                    <TableRow data-testid="chosen" data-state="selected"><TableCell>t-1</TableCell></TableRow>
                </TableBody>
            </Table>,
        );
        const row = screen.getByTestId('chosen');
        expect(row.className).toContain('data-[state=selected]:bg-highlight');
        expect(row.className).toContain('data-[state=selected]:text-highlight-foreground');
        expect(row.className).not.toContain('data-[state=selected]:bg-accent');
    });

    it('selects rows with checkboxes; the select-all box is mixed while some rows are chosen', async () => {
        function Selectable() {
            const [chosen, setChosen] = useState([]);
            const all = chosen.length === ROWS.length ? true : chosen.length > 0 ? 'indeterminate' : false;
            return (
                <Table aria-label="Tickets">
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Checkbox
                                    aria-label="Select all tickets"
                                    checked={all}
                                    onCheckedChange={(c) => setChosen(c === true ? ROWS.map((r) => r.id) : [])}
                                />
                            </TableHead>
                            <TableHead>Ticket</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ROWS.map((r) => (
                            <TableRow key={r.id} data-state={chosen.includes(r.id) ? 'selected' : undefined}>
                                <TableCell>
                                    <Checkbox
                                        aria-label={`Select ${r.id}`}
                                        checked={chosen.includes(r.id)}
                                        onCheckedChange={(c) =>
                                            setChosen((cur) => (c === true ? [...cur, r.id] : cur.filter((x) => x !== r.id)))
                                        }
                                    />
                                </TableCell>
                                <TableCell>{r.id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }
        const { user } = renderUi(<Selectable />);
        const all = screen.getByRole('checkbox', { name: 'Select all tickets' });
        expect(all).toHaveAttribute('aria-checked', 'false');
        await user.click(screen.getByRole('checkbox', { name: 'Select t-1' }));
        expect(all).toHaveAttribute('aria-checked', 'mixed');
        expect(screen.getByRole('checkbox', { name: 'Select t-1' }).closest('tr')).toHaveAttribute('data-state', 'selected');
        expect(screen.getByRole('checkbox', { name: 'Select t-2' }).closest('tr')).not.toHaveAttribute('data-state');
        await expectNoAxeViolations();
        await user.click(all);
        expect(all).toHaveAttribute('aria-checked', 'true');
        expect(document.querySelectorAll('tr[data-state="selected"]')).toHaveLength(2);
        await user.click(all);
        expect(all).toHaveAttribute('aria-checked', 'false');
        expect(document.querySelectorAll('tr[data-state="selected"]')).toHaveLength(0);
    });

    it('shows an empty state in one cell that spans the columns', async () => {
        renderUi(
            <Table aria-label="Emails">
                <TableHeader>
                    <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2}>No emails match these filters.</TableCell>
                    </TableRow>
                </TableBody>
            </Table>,
        );
        expect(screen.getByRole('cell', { name: 'No emails match these filters.' })).toHaveAttribute('colspan', '2');
        await expectNoAxeViolations();
    });

    it('gives the table no tab stop of its own: only controls inside cells take focus', async () => {
        const { user } = renderUi(
            <>
                <Basic />
                <button type="button">After</button>
            </>,
        );
        await user.tab();
        expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('makes a table wider than its box a tab stop while nothing inside it can take focus', async () => {
        // jsdom has no layout: the box reports content 600px wide in 300px, and the observer reports at once.
        const observers = [];
        const SavedObserver = globalThis.ResizeObserver;
        globalThis.ResizeObserver = class {
            constructor(callback) {
                this.callback = callback;
                observers.push(this);
            }
            observe() {}
            disconnect() {}
        };
        const scroll = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(600);
        const client = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
        try {
            const { container, rerender } = renderUi(<Basic />);
            act(() => observers.forEach((observer) => observer.callback([])));
            const box = container.querySelector('[data-slot=table-container]');
            expect(box).toHaveAttribute('tabindex', '0');
            rerender(
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Checkbox aria-label="Select t-1" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>,
            );
            act(() => observers.forEach((observer) => observer.callback([])));
            expect(container.querySelector('[data-slot=table-container]')).not.toHaveAttribute('tabindex');
        } finally {
            scroll.mockRestore();
            client.mockRestore();
            globalThis.ResizeObserver = SavedObserver;
        }
    });
});
