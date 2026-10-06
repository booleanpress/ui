import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen } from '@testing-library/react';
import { DateField } from '@/components/date-field';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Controlled({ initial = null, onChange, ...props }) {
    const [value, setValue] = useState(initial);
    return (
        <DateField
            aria-label="Invoice date"
            value={value}
            onValueChange={(next) => {
                setValue(next);
                onChange?.(next);
            }}
            {...props}
        />
    );
}

const segment = (name) => screen.getByRole('spinbutton', { name });
const order = () => screen.getAllByRole('spinbutton').map((el) => el.getAttribute('aria-label'));

describe('DateField', () => {
    afterEach(() => vi.useRealTimers());

    it('renders month, day and year in the en-US order', async () => {
        renderUi(<DateField aria-label="Invoice date" defaultValue={new Date(2026, 9, 5)} />, { locale: 'en-US' });
        expect(screen.getByRole('group', { name: 'Invoice date' })).toBeInTheDocument();
        expect(order()).toEqual(['Month', 'Day', 'Year']);
        expect(segment('Month')).toHaveTextContent('10');
        expect(segment('Month')).toHaveAttribute('aria-valuetext', 'October');
        expect(segment('Year')).toHaveTextContent('2026');
        await expectNoAxeViolations();
    });

    it('follows the locale order and separators: day, month, year with dots in de-DE', async () => {
        const { container } = renderUi(<DateField aria-label="Rechnungsdatum" defaultValue={new Date(2026, 9, 5)} />, {
            locale: 'de-DE',
        });
        expect(order()).toEqual(['Day', 'Month', 'Year']);
        expect(container.querySelector('[data-slot=date-field]')).toHaveTextContent('05.10.2026');
        await expectNoAxeViolations();
    });

    it('fills from typed digits, moving on as each segment completes', async () => {
        const values = [];
        const { user } = renderUi(<Controlled onChange={(v) => values.push(v)} />, { locale: 'en-US' });
        segment('Month').focus();
        await user.keyboard('1');
        await user.keyboard('0');
        expect(segment('Day')).toHaveFocus();
        await user.keyboard('5');
        expect(segment('Year')).toHaveFocus();
        await user.keyboard('2026');
        expect(values.at(-1)).toEqual(new Date(2026, 9, 5));
    });

    it('steps a segment with the arrow keys and wraps', async () => {
        const { user } = renderUi(<DateField aria-label="Invoice date" defaultValue={new Date(2026, 11, 31)} />, { locale: 'en-US' });
        segment('Month').focus();
        await user.keyboard('{ArrowUp}');
        expect(segment('Month')).toHaveTextContent('01');
        await user.keyboard('{ArrowDown}');
        expect(segment('Month')).toHaveTextContent('12');
    });

    it('moves between segments with the left and right arrows', async () => {
        const { user } = renderUi(<DateField aria-label="Invoice date" />, { locale: 'en-US' });
        segment('Month').focus();
        await user.keyboard('{ArrowRight}{ArrowRight}');
        expect(segment('Year')).toHaveFocus();
        await user.keyboard('{ArrowLeft}');
        expect(segment('Day')).toHaveFocus();
    });

    it('brings the day back to the month end when the month changes', async () => {
        const values = [];
        const { user } = renderUi(<Controlled initial={new Date(2026, 0, 31)} onChange={(v) => values.push(v)} />, {
            locale: 'en-US',
        });
        segment('Month').focus();
        await user.keyboard('{ArrowUp}');
        expect(segment('Day')).toHaveTextContent('28');
        expect(values.at(-1)).toEqual(new Date(2026, 1, 28));
    });

    it('empties the value when a segment is cleared with Backspace', async () => {
        const values = [];
        const { user } = renderUi(<Controlled initial={new Date(2026, 9, 5)} onChange={(v) => values.push(v)} />, {
            locale: 'en-US',
        });
        segment('Day').focus();
        await user.keyboard('{Backspace}');
        expect(segment('Day')).toHaveAttribute('aria-valuetext', 'Empty');
        expect(values.at(-1)).toBeNull();
        await expectNoAxeViolations();
    });

    it('empties a segment with Delete', async () => {
        const values = [];
        const { user } = renderUi(<Controlled initial={new Date(2026, 9, 5)} onChange={(v) => values.push(v)} />, {
            locale: 'en-US',
        });
        segment('Year').focus();
        await user.keyboard('{Delete}');
        expect(segment('Year')).toHaveAttribute('aria-valuetext', 'Empty');
        expect(values.at(-1)).toBeNull();
    });

    it('sets the lowest and highest value with Home and End, the day by the month', async () => {
        const { user } = renderUi(<DateField aria-label="Invoice date" defaultValue={new Date(2026, 1, 10)} />, { locale: 'en-US' });
        segment('Day').focus();
        await user.keyboard('{End}');
        expect(segment('Day')).toHaveTextContent('28');
        await user.keyboard('{Home}');
        expect(segment('Day')).toHaveTextContent('01');
    });

    it('reads a two-digit year as the one nearest today when focus leaves it', async () => {
        const values = [];
        const { user } = renderUi(<Controlled onChange={(v) => values.push(v)} />, { locale: 'en-US' });
        segment('Month').focus();
        await user.keyboard('10');
        await user.keyboard('5');
        await user.keyboard('26');
        await user.tab();
        expect(segment('Year')).toHaveTextContent('2026');
        expect(values.at(-1)).toEqual(new Date(2026, 9, 5));
    });

    it('marks the field invalid outside min and max', async () => {
        renderUi(
            <DateField
                aria-label="Invoice date"
                min={new Date(2026, 9, 1)}
                max={new Date(2026, 9, 31)}
                defaultValue={new Date(2026, 10, 2)}
            />,
            { locale: 'en-US' }
        );
        for (const el of screen.getAllByRole('spinbutton')) expect(el).toHaveAttribute('aria-invalid', 'true');
        await expectNoAxeViolations();
    });

    it('is invalid with aria-invalid, and disabled when disabled', async () => {
        const { unmount } = renderUi(<DateField aria-label="Invoice date" aria-invalid />);
        expect(segment('Day')).toHaveAttribute('aria-invalid', 'true');
        await expectNoAxeViolations();
        unmount();
        renderUi(<DateField aria-label="Invoice date" disabled defaultValue={new Date(2026, 9, 5)} />);
        expect(segment('Day')).toHaveAttribute('aria-disabled', 'true');
        expect(segment('Day')).toHaveAttribute('tabindex', '-1');
        await expectNoAxeViolations();
    });

    it('reaches data-size, and submits YYYY-MM-DD with name', () => {
        const { container } = renderUi(
            <DateField aria-label="Invoice date" size="sm" name="invoice_date" defaultValue={new Date(2026, 9, 5)} />
        );
        expect(screen.getByRole('group')).toHaveAttribute('data-size', 'sm');
        expect(container.querySelector('input[name=invoice_date]')).toHaveValue('2026-10-05');
    });

    it('makes midnight in the provider time zone', async () => {
        const values = [];
        const { user } = renderUi(<Controlled onChange={(v) => values.push(v)} />, { locale: 'en-US', timeZone: 'Asia/Tokyo' });
        segment('Month').focus();
        await user.keyboard('10052026');
        // Midnight on 5 October in Tokyo is 15:00 UTC on 4 October.
        expect(values.at(-1)?.toISOString()).toBe('2026-10-04T15:00:00.000Z');
    });

    it('keeps a day whose midnight the clocks skip in the provider time zone', async () => {
        // Summer time starts at midnight on 6 September 2026 in Santiago: the day must not become 5 September.
        const values = [];
        const { user, container } = renderUi(<Controlled name="due" onChange={(v) => values.push(v)} />, {
            locale: 'en-US',
            timeZone: 'America/Santiago',
        });
        segment('Month').focus();
        await user.keyboard('09062026');
        expect(container.querySelector('input[name=due]')).toHaveValue('2026-09-06');
        expect(values.at(-1).toISOString()).toBe('2026-09-06T04:00:00.000Z');
    });

    it('removes a digit on a phone keyboard’s Backspace, which sends no key event', () => {
        const values = [];
        renderUi(<Controlled initial={new Date(2026, 9, 15)} onChange={(v) => values.push(v)} />, { locale: 'en-US' });
        const day = segment('Day');
        day.focus();
        fireEvent(day, new InputEvent('beforeinput', { inputType: 'deleteContentBackward', bubbles: true, cancelable: true }));
        expect(day).toHaveTextContent('1');
        expect(values.at(-1)).toEqual(new Date(2026, 9, 1));
        fireEvent(day, new InputEvent('beforeinput', { inputType: 'insertText', data: '8', bubbles: true, cancelable: true }));
        expect(values.at(-1)).toEqual(new Date(2026, 9, 18));
    });

    it('focuses the first empty segment on a press on a separator', async () => {
        const { user, container } = renderUi(<DateField aria-label="Invoice date" />, { locale: 'en-US' });
        await user.click(container.querySelector('[data-slot=date-field-literal]'));
        expect(segment('Month')).toHaveFocus();
    });

    it('submits nothing while disabled, as a disabled input does', () => {
        const { container } = renderUi(<DateField aria-label="Invoice date" disabled name="invoice_date" defaultValue={new Date(2026, 9, 5)} />);
        expect(container.querySelector('input[name=invoice_date]')).toBeDisabled();
    });

    it('reads a two-digit year from the last century when it is nearer, as for a date of birth', async () => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date(2026, 9, 5));
        const values = [];
        const { user } = renderUi(<Controlled onChange={(v) => values.push(v)} />, { locale: 'en-US' });
        segment('Month').focus();
        await user.keyboard('0315');
        await user.keyboard('85');
        await user.tab();
        expect(segment('Year')).toHaveTextContent('1985');
        expect(values.at(-1)).toEqual(new Date(1985, 2, 15));
    });
});

describe('DateField in a form', () => {
    afterEach(() => vi.useRealTimers());
    const submitted = (form, name) => new FormData(form).get(name);
    const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

    it('controlled: proposes a change the parent refuses, and keeps showing and submitting the parent\'s date', () => {
        const proposed = [];
        const { container } = renderUi(
            <form>
                <DateField aria-label="Invoice date" name="day" value={new Date(2026, 9, 5)} onValueChange={(v) => proposed.push(v)} />
            </form>,
            { locale: 'en-US' }
        );
        fireEvent.keyDown(segment('Day'), { key: 'ArrowUp' });
        expect(proposed).toEqual([new Date(2026, 9, 6)]);
        expect(segment('Day')).toHaveAttribute('aria-valuenow', '5');
        expect(submitted(container.querySelector('form'), 'day')).toBe('2026-10-05');
    });

    it('controlled: an accepted change shows and submits together', () => {
        const { container } = renderUi(
            <form>
                <Controlled initial={new Date(2026, 9, 5)} name="day" />
            </form>,
            { locale: 'en-US' }
        );
        fireEvent.keyDown(segment('Day'), { key: 'ArrowUp' });
        expect(segment('Day')).toHaveAttribute('aria-valuenow', '6');
        expect(submitted(container.querySelector('form'), 'day')).toBe('2026-10-06');
    });

    it('controlled: shows the date the parent turns a proposal into', () => {
        function Weekdays() {
            const [value, setValue] = useState(new Date(2026, 9, 9));
            // A Saturday becomes the Monday after.
            return (
                <DateField
                    aria-label="Invoice date"
                    value={value}
                    onValueChange={(next) => setValue(next && next.getDay() === 6 ? new Date(2026, 9, 12) : next)}
                />
            );
        }
        renderUi(<Weekdays />, { locale: 'en-US' });
        fireEvent.keyDown(segment('Day'), { key: 'ArrowUp' });
        expect(segment('Day')).toHaveAttribute('aria-valuenow', '12');
    });

    it('controlled: a parent that answers later sees the old date until it does', async () => {
        vi.useFakeTimers();
        function Later() {
            const [value, setValue] = useState(new Date(2026, 9, 5));
            return <DateField aria-label="Invoice date" value={value} onValueChange={(next) => setTimeout(() => setValue(next), 100)} />;
        }
        renderUi(<Later />, { locale: 'en-US' });
        fireEvent.keyDown(segment('Day'), { key: 'ArrowUp' });
        expect(segment('Day')).toHaveAttribute('aria-valuenow', '5');
        await act(() => vi.advanceTimersByTimeAsync(100));
        expect(segment('Day')).toHaveAttribute('aria-valuenow', '6');
    });

    it('controlled: a cleared segment stays empty to be typed again, even when the parent keeps its date', async () => {
        const proposed = [];
        const { user, container } = renderUi(
            <form>
                <DateField aria-label="Invoice date" name="day" value={new Date(2026, 9, 5)} onValueChange={(v) => proposed.push(v)} />
            </form>,
            { locale: 'en-US' }
        );
        segment('Day').focus();
        await user.keyboard('{Backspace}');
        expect(segment('Day')).toHaveAttribute('aria-valuetext', 'Empty');
        expect(proposed).toEqual([null]);
        expect(submitted(container.querySelector('form'), 'day')).toBe('2026-10-05');
        await user.keyboard('12');
        expect(proposed.at(-1)).toEqual(new Date(2026, 9, 12));
    });

    it('controlled: passing the same date again changes nothing', () => {
        const { rerender } = renderUi(<DateField aria-label="Invoice date" value={new Date(2026, 9, 5)} onValueChange={() => {}} />, {
            locale: 'en-US',
        });
        rerender(<DateField aria-label="Invoice date" value={new Date(2026, 9, 5)} onValueChange={() => {}} />);
        expect(segment('Day')).toHaveAttribute('aria-valuenow', '5');
        rerender(<DateField aria-label="Invoice date" value={null} onValueChange={() => {}} />);
        expect(segment('Day')).toHaveAttribute('aria-valuetext', 'Empty');
    });

    it('uncontrolled: a form reset puts the default back, in the segments and the submitted value', async () => {
        const { container } = renderUi(
            <form>
                <DateField aria-label="Invoice date" name="day" defaultValue={new Date(2026, 9, 5)} />
            </form>,
            { locale: 'en-US' }
        );
        const form = container.querySelector('form');
        fireEvent.keyDown(segment('Day'), { key: 'ArrowUp' });
        expect(submitted(form, 'day')).toBe('2026-10-06');
        act(() => form.reset());
        await settle();
        expect(segment('Day')).toHaveAttribute('aria-valuenow', '5');
        expect(submitted(form, 'day')).toBe('2026-10-05');
    });

    it('uncontrolled: a cancelled reset changes nothing', async () => {
        const { container } = renderUi(
            <form onReset={(event) => event.preventDefault()}>
                <DateField aria-label="Invoice date" name="day" defaultValue={new Date(2026, 9, 5)} />
            </form>,
            { locale: 'en-US' }
        );
        const form = container.querySelector('form');
        fireEvent.keyDown(segment('Day'), { key: 'ArrowUp' });
        act(() => form.reset());
        await settle();
        expect(submitted(form, 'day')).toBe('2026-10-06');
    });

    it('controlled: a form reset leaves the parent\'s date alone', async () => {
        const { container } = renderUi(
            <form>
                <Controlled initial={new Date(2026, 9, 5)} name="day" />
            </form>,
            { locale: 'en-US' }
        );
        const form = container.querySelector('form');
        fireEvent.keyDown(segment('Day'), { key: 'ArrowUp' });
        act(() => form.reset());
        await settle();
        expect(submitted(form, 'day')).toBe('2026-10-06');
    });

    it('belongs to the form its form attribute names, and resets with it', async () => {
        renderUi(
            <>
                <form id="invoice" />
                <DateField aria-label="Invoice date" name="day" form="invoice" defaultValue={new Date(2026, 9, 5)} />
            </>,
            { locale: 'en-US' }
        );
        const form = document.getElementById('invoice');
        fireEvent.keyDown(segment('Day'), { key: 'ArrowUp' });
        expect(submitted(form, 'day')).toBe('2026-10-06');
        act(() => form.reset());
        await settle();
        expect(submitted(form, 'day')).toBe('2026-10-05');
    });
});

describe('DateField read-only', () => {
    it('keeps its segments focusable and marked read-only, and the keys change nothing', () => {
        const onValueChange = vi.fn();
        renderUi(<DateField aria-label="Invoice date" readOnly defaultValue={new Date(2026, 9, 5)} onValueChange={onValueChange} />, {
            locale: 'en-US',
        });
        const day = segment('Day');
        expect(day).toHaveAttribute('aria-readonly', 'true');
        expect(day).toHaveAttribute('tabindex', '0');
        fireEvent.keyDown(day, { key: 'ArrowUp' });
        fireEvent.keyDown(day, { key: 'Backspace' });
        expect(day).toHaveAttribute('aria-valuenow', '5');
        expect(onValueChange).not.toHaveBeenCalled();
    });
});
