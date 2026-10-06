import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import { DateRangePicker } from '@/components/date-range-picker';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const TODAY = new Date(2026, 9, 14);
const D = (month, day) => new Date(2026, month - 1, day);

function Controlled({ initial = null, onChange, ...props }) {
    const [value, setValue] = useState(initial);
    return (
        <DateRangePicker
            aria-label="Report period"
            value={value}
            onValueChange={(next) => {
                setValue(next);
                onChange?.(next);
            }}
            today={TODAY}
            placeholder="All time"
            {...props}
        />
    );
}

const field = () => screen.getByRole('combobox', { name: 'Report period' });
const dialog = () => screen.findByRole('dialog', { name: 'Choose dates' });
const day = (name) => screen.getByRole('button', { name: new RegExp(name) });
const closed = () => waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

describe('DateRangePicker', () => {
    it('shows the range in the locale, or the placeholder', async () => {
        const { unmount } = renderUi(<Controlled initial={{ from: D(10, 1), to: D(10, 7) }} />, { locale: 'en-US' });
        expect(field()).toHaveTextContent('Oct 1 – 7, 2026');
        expect(field()).toHaveAttribute('aria-haspopup', 'dialog');
        expect(field()).toHaveAttribute('aria-expanded', 'false');
        await expectNoAxeViolations();
        unmount();
        renderUi(<Controlled />);
        expect(field()).toHaveTextContent('All time');
        expect(field()).toHaveAttribute('data-placeholder');
    });

    it('opens with Enter on the field, focus on the first day of the range, and two months', async () => {
        const { user } = renderUi(<Controlled initial={{ from: D(10, 5), to: D(10, 9) }} presets={false} />);
        field().focus();
        await user.keyboard('{Enter}');
        await dialog();
        expect(screen.getAllByRole('grid')).toHaveLength(2);
        await waitFor(() => expect(day('October 5th, 2026')).toHaveFocus());
        await expectNoAxeViolations();
    });

    it('opens with Alt+ArrowDown, focus on today when nothing is chosen', async () => {
        const { user } = renderUi(<Controlled presets={false} />);
        field().focus();
        await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
        await dialog();
        await waitFor(() => expect(day('October 14th, 2026')).toHaveFocus());
    });

    it('chooses a range with two clicks, then closes and returns focus to the field', async () => {
        const values = [];
        const { user } = renderUi(<Controlled presets={false} onChange={(v) => values.push(v)} />, { locale: 'en-US' });
        await user.click(field());
        await dialog();
        await user.click(day('October 20th, 2026'));
        expect(values).toEqual([]);
        await user.click(day('October 24th, 2026'));
        expect(values.at(-1)).toEqual({ from: D(10, 20), to: D(10, 24) });
        await closed();
        expect(field()).toHaveTextContent('Oct 20 – 24, 2026');
        expect(field()).toHaveFocus();
    });

    it('starts a new range on the first click after a complete one', async () => {
        const values = [];
        const { user } = renderUi(<Controlled presets={false} initial={{ from: D(10, 5), to: D(10, 9) }} onChange={(v) => values.push(v)} />);
        await user.click(field());
        await dialog();
        await user.click(day('October 12th, 2026'));
        expect(values).toEqual([]);
        await user.click(day('October 13th, 2026'));
        expect(values.at(-1)).toEqual({ from: D(10, 12), to: D(10, 13) });
    });

    it('closes on Escape without a change and returns focus to the field', async () => {
        const values = [];
        const { user } = renderUi(<Controlled presets={false} onChange={(v) => values.push(v)} />);
        await user.click(field());
        await dialog();
        await user.click(day('October 20th, 2026'));
        await user.keyboard('{Escape}');
        await closed();
        expect(values).toEqual([]);
        expect(field()).toHaveFocus();
    });

    it('chooses each preset, counted from today', async () => {
        const values = [];
        const { user } = renderUi(<Controlled onChange={(v) => values.push(v)} />);
        const expected = {
            Today: { from: D(10, 14), to: D(10, 14) },
            Yesterday: { from: D(10, 13), to: D(10, 13) },
            'Last 7 days': { from: D(10, 8), to: D(10, 14) },
            'Last 30 days': { from: D(9, 15), to: D(10, 14) },
            'This month': { from: D(10, 1), to: D(10, 14) },
            'Last month': { from: D(9, 1), to: D(9, 30) },
        };
        for (const [label, range] of Object.entries(expected)) {
            await user.click(field());
            const popup = await dialog();
            await user.click(within(popup).getByRole('button', { name: label }));
            expect(values.at(-1)).toEqual(range);
            await closed();
        }
        await user.click(field());
        const popup = await dialog();
        expect(within(popup).getByRole('button', { name: 'Last month' })).toHaveAttribute('aria-pressed', 'true');
        expect(within(popup).getByRole('button', { name: 'Today' })).toHaveAttribute('aria-pressed', 'false');
        await expectNoAxeViolations();
    }, 20000);

    it('chooses a preset with Enter', async () => {
        const values = [];
        const { user } = renderUi(<Controlled onChange={(v) => values.push(v)} />);
        await user.click(field());
        const popup = await dialog();
        await waitFor(() => expect(day('October 14th, 2026')).toHaveFocus());
        within(popup).getByRole('button', { name: 'This month' }).focus();
        await user.keyboard('{Enter}');
        expect(values.at(-1)).toEqual({ from: D(10, 1), to: D(10, 14) });
        await closed();
        expect(field()).toHaveFocus();
    });

    it('waits for Apply with showActions, and Cancel leaves the value', async () => {
        const values = [];
        const { user } = renderUi(<Controlled showActions onChange={(v) => values.push(v)} />);
        await user.click(field());
        let popup = await dialog();
        expect(within(popup).getByRole('button', { name: 'Apply' })).toBeDisabled();
        await user.click(within(popup).getByRole('button', { name: 'Last 7 days' }));
        await user.click(day('October 20th, 2026'));
        await user.click(day('October 22nd, 2026'));
        expect(values).toEqual([]);
        await user.click(within(popup).getByRole('button', { name: 'Apply' }));
        expect(values.at(-1)).toEqual({ from: D(10, 20), to: D(10, 22) });
        await closed();
        await user.click(field());
        popup = await dialog();
        await user.click(within(popup).getByRole('button', { name: 'Yesterday' }));
        await user.click(within(popup).getByRole('button', { name: 'Cancel' }));
        await closed();
        expect(values).toHaveLength(1);
    });

    it('keeps Tab inside the popup', async () => {
        const { user } = renderUi(<Controlled showActions />);
        await user.click(field());
        const popup = await dialog();
        const today = within(popup).getByRole('button', { name: 'Today' });
        const cancel = within(popup).getByRole('button', { name: 'Cancel' });
        await waitFor(() => expect(day('October 14th, 2026')).toHaveFocus());
        cancel.focus();
        // Apply is disabled until a range is chosen, so Cancel is the last control.
        await user.tab();
        expect(today).toHaveFocus();
        await user.tab({ shift: true });
        expect(cancel).toHaveFocus();
    });

    it('blocks days and presets outside min and max', async () => {
        const { user } = renderUi(<Controlled min={D(9, 20)} max={D(10, 14)} />);
        await user.click(field());
        const popup = await dialog();
        expect(within(popup).getByRole('button', { name: 'Last 7 days' })).toBeEnabled();
        expect(within(popup).getByRole('button', { name: 'Last 30 days' })).toBeDisabled();
        expect(within(popup).getByRole('button', { name: 'Last month' })).toBeDisabled();
        expect(day('October 15th, 2026')).toBeDisabled();
        expect(day('September 19th, 2026')).toBeDisabled();
    });

    it('clears with the clear button and keeps focus on the field', async () => {
        const values = [];
        const { user } = renderUi(<Controlled clearable initial={{ from: D(10, 1), to: D(10, 7) }} onChange={(v) => values.push(v)} />);
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(values.at(-1)).toBeNull();
        expect(field()).toHaveTextContent('All time');
        expect(field()).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('is disabled, invalid, sized and filled', async () => {
        const { unmount } = renderUi(<Controlled disabled />);
        expect(field()).toBeDisabled();
        await expectNoAxeViolations();
        unmount();
        renderUi(<Controlled aria-invalid size="lg" variant="filled" />);
        expect(field()).toHaveAttribute('aria-invalid', 'true');
        expect(field()).toHaveAttribute('data-size', 'lg');
        expect(field()).toHaveAttribute('data-variant', 'filled');
        await expectNoAxeViolations();
    });

    it('takes its preset labels and popup name from the provider strings', async () => {
        const { user } = renderUi(<Controlled />, { strings: { presetToday: 'Heute', chooseDateRange: 'Zeitraum wählen' } });
        await user.click(field());
        const popup = await screen.findByRole('dialog', { name: 'Zeitraum wählen' });
        expect(within(popup).getByRole('button', { name: 'Heute' })).toBeInTheDocument();
    });

    it('counts presets in the provider time zone and submits the range with name', async () => {
        const values = [];
        // 14 October, 23:30 in New York is already 15 October in Tokyo.
        const { user, container } = renderUi(
            <Controlled name="period" today={new Date(Date.UTC(2026, 9, 15, 3, 30))} onChange={(v) => values.push(v)} />,
            { timeZone: 'Asia/Tokyo' }
        );
        await user.click(field());
        await user.click(within(await dialog()).getByRole('button', { name: 'Today' }));
        expect(values.at(-1).from.toISOString()).toBe('2026-10-14T15:00:00.000Z');
        expect(container.querySelector('input[name=period]')).toHaveValue('2026-10-15/2026-10-15');
    });

    it('reads a value whose end comes before its start the other way round', () => {
        const { container } = renderUi(<Controlled name="period" initial={{ from: D(10, 7), to: D(10, 1) }} />, { locale: 'en-US' });
        expect(field()).toHaveTextContent('Oct 1 – 7, 2026');
        expect(container.querySelector('input[name=period]')).toHaveValue('2026-10-01/2026-10-07');
    });

    it('starts from the current range when its parent opens it', async () => {
        function Parent() {
            const [open, setOpen] = useState(false);
            const [value, setValue] = useState({ from: D(10, 5), to: D(10, 9) });
            return (
                <>
                    <button type="button" onClick={() => setValue({ from: D(10, 20), to: D(10, 22) })}>
                        Last sprint
                    </button>
                    <button type="button" onClick={() => setOpen(true)}>
                        Open
                    </button>
                    <DateRangePicker
                        aria-label="Report period"
                        value={value}
                        onValueChange={setValue}
                        open={open}
                        onOpenChange={setOpen}
                        today={TODAY}
                        presets={false}
                    />
                </>
            );
        }
        const { user } = renderUi(<Parent />);
        await user.click(screen.getByRole('button', { name: 'Last sprint' }));
        await user.click(screen.getByRole('button', { name: 'Open' }));
        await dialog();
        expect(day('October 20th, 2026').closest('[role=gridcell]')).toHaveAttribute('aria-selected', 'true');
        expect(day('October 5th, 2026').closest('[role=gridcell]')).not.toHaveAttribute('aria-selected', 'true');
    });

    it('counts Yesterday right across a midnight the clocks skip', async () => {
        // In Santiago summer time starts at midnight on 6 September 2026; today is 7 September there.
        const values = [];
        const { user, container } = renderUi(
            <Controlled name="period" today={new Date(Date.UTC(2026, 8, 7, 15))} onChange={(v) => values.push(v)} />,
            { timeZone: 'America/Santiago' },
        );
        await user.click(field());
        await user.click(within(await dialog()).getByRole('button', { name: 'Yesterday' }));
        expect(container.querySelector('input[name=period]')).toHaveValue('2026-09-06/2026-09-06');
    });

    it('in a dialog: a range chosen keeps the dialog open, and Escape closes the popup first', async () => {
        const values = [];
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Export deliveries</DialogTitle>
                    <DialogDescription>Choose the period to export.</DialogDescription>
                    <Controlled presets={false} onChange={(v) => values.push(v)} />
                </DialogContent>
            </Dialog>,
        );
        await user.click(field());
        await dialog();
        await user.click(day('October 5th, 2026'));
        await user.click(day('October 9th, 2026'));
        expect(values.at(-1)).toEqual({ from: D(10, 5), to: D(10, 9) });
        await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Choose dates' })).toBeNull());
        expect(screen.getByRole('dialog', { name: 'Export deliveries' })).toBeInTheDocument();
        await user.click(field());
        await dialog();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Choose dates' })).toBeNull());
        expect(screen.getByRole('dialog', { name: 'Export deliveries' })).toBeInTheDocument();
        expect(field()).toHaveFocus();
    });
});

describe('DateRangePicker in a form', () => {
    const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

    it('a form reset puts the default range back after it was cleared', async () => {
        const { container, user } = renderUi(
            <form>
                <DateRangePicker aria-label="Period" name="range" clearable defaultValue={{ from: D(10, 5), to: D(10, 7) }} today={TODAY} />
            </form>
        );
        const form = container.querySelector('form');
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(new FormData(form).get('range')).toBe('');
        act(() => form.reset());
        await settle();
        expect(new FormData(form).get('range')).toBe('2026-10-05/2026-10-07');
    });

    it('belongs to the form its form attribute names', () => {
        renderUi(
            <>
                <form id="report" />
                <DateRangePicker aria-label="Period" name="range" form="report" defaultValue={{ from: D(10, 5), to: D(10, 7) }} today={TODAY} />
            </>
        );
        expect(new FormData(document.getElementById('report')).get('range')).toBe('2026-10-05/2026-10-07');
    });
});


describe('DateRangePicker inline', () => {
    it('shows three months, chooses a range without a popup and keeps the keyboard on the calendar', async () => {
        const values = [];
        const { user } = renderUi(<Controlled inline presets={false} numberOfMonths={3} onChange={(value) => values.push(value)} />);
        expect(screen.queryByRole('combobox')).toBeNull();
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(screen.getAllByRole('grid')).toHaveLength(3);
        await user.click(day('October 20th, 2026'));
        await user.keyboard('{ArrowRight}{Enter}');
        expect(values.at(-1)).toEqual({ from: D(10, 20), to: D(10, 21) });
        expect(screen.getAllByRole('grid')).toHaveLength(3);
        expect(day('October 21st, 2026')).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('submits completed values only and resets the inline selection and form value', async () => {
        const { container, user } = renderUi(<form><DateRangePicker inline presets={false} name="range" aria-label="Period"
            defaultValue={{ from: D(10, 5), to: D(10, 7) }} today={TODAY} /></form>);
        const form = container.querySelector('form');
        await user.click(day('October 20th, 2026'));
        expect(new FormData(form).get('range')).toBe('2026-10-05/2026-10-07');
        await user.click(day('October 24th, 2026'));
        expect(new FormData(form).get('range')).toBe('2026-10-20/2026-10-24');
        act(() => form.reset());
        await waitFor(() => expect(new FormData(form).get('range')).toBe('2026-10-05/2026-10-07'));
        expect(day('October 5th, 2026').closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    });

    it('respects controlled rejection, external changes and the separate form owner', async () => {
        const initial = { from: D(10, 5), to: D(10, 7) };
        const values = [];
        const view = (value) => <><form id="inline-report" /><DateRangePicker inline presets={false} clearable aria-label="Period"
            form="inline-report" name="range" value={value} onValueChange={(next) => values.push(next)} today={TODAY} /></>;
        const { user, rerender } = renderUi(view(initial));
        await user.click(day('October 20th, 2026'));
        await user.click(day('October 24th, 2026'));
        expect(values.at(-1)).toEqual({ from: D(10, 20), to: D(10, 24) });
        expect(new FormData(document.getElementById('inline-report')).get('range')).toBe('2026-10-05/2026-10-07');
        expect(day('October 5th, 2026').closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(day('October 5th, 2026').closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
        rerender(view({ from: D(10, 9), to: D(10, 11) }));
        expect(day('October 9th, 2026').closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    });

    it('inline with actions, Clear sits at the start of the Cancel and Apply row; without actions, under the calendar', () => {
        const { unmount } = renderUi(<DateRangePicker inline showActions clearable aria-label="Period" defaultValue={{ from: D(10, 5), to: D(10, 9) }} today={TODAY} />);
        const row = document.querySelector('[data-slot="date-range-picker-actions"]');
        const clear = screen.getByRole('button', { name: 'Clear' });
        expect(row.contains(clear)).toBe(true);
        expect([...row.querySelectorAll('button')].map((b) => b.textContent)).toEqual(['Clear', 'Cancel', 'Apply']);
        unmount();
        renderUi(<DateRangePicker inline clearable aria-label="Period" defaultValue={{ from: D(10, 5), to: D(10, 9) }} today={TODAY} />);
        expect(document.querySelector('[data-slot="date-range-picker-actions"]')).toBeNull();
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    it('applies or cancels drafts while remaining visible and excludes disabled values from forms', async () => {
        const { user, rerender, container } = renderUi(<form><DateRangePicker inline showActions name="range" aria-label="Period" today={TODAY} /></form>);
        await user.click(screen.getByRole('button', { name: 'Today' }));
        expect(new FormData(container.querySelector('form')).get('range')).toBe('');
        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
        await user.click(screen.getByRole('button', { name: 'Last 7 days' }));
        await user.click(screen.getByRole('button', { name: 'Apply' }));
        expect(new FormData(container.querySelector('form')).get('range')).toBe('2026-10-08/2026-10-14');
        expect(screen.getByRole('group', { name: 'Period' })).toBeInTheDocument();
        rerender(<form><DateRangePicker inline disabled name="range" aria-label="Period" today={TODAY} /></form>);
        expect(new FormData(container.querySelector('form')).has('range')).toBe(false);
        expect(screen.getByRole('button', { name: 'Today' })).toBeDisabled();
    });
});

it('previews a pending range in either direction without committing until the second click', async () => {
    const values = [];
    const { container, user } = renderUi(<Controlled inline presets={false} numberOfMonths={1} onChange={(value) => values.push(value)} />);
    await user.click(day('October 20th, 2026'));
    await user.hover(day('October 24th, 2026'));
    expect(day('October 20th, 2026')).toHaveAttribute('data-range-preview-start');
    expect(day('October 22nd, 2026')).toHaveAttribute('data-range-preview-middle');
    expect(day('October 24th, 2026')).toHaveAttribute('data-range-preview-end');
    expect(values).toEqual([]);
    await user.hover(day('October 16th, 2026'));
    expect(day('October 16th, 2026')).toHaveAttribute('data-range-preview-start');
    expect(day('October 20th, 2026')).toHaveAttribute('data-range-preview-end');
    await user.click(day('October 16th, 2026'));
    expect(values.at(-1)).toEqual({ from: D(10, 16), to: D(10, 20) });
    expect(container.querySelector('[data-range-preview-middle]')).toBeNull();
});
