import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { DatePicker } from '@/components/date-picker';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const TODAY = new Date(2026, 9, 3);
const OCT = (day, hour = 0, minute = 0) => new Date(2026, 9, day, hour, minute);

function Controlled({ initial = null, onChange, ...props }) {
    const [value, setValue] = useState(initial);
    return (
        <DatePicker
            trigger="button"
            aria-label="Send on"
            value={value}
            onValueChange={(next) => {
                setValue(next);
                onChange?.(next);
            }}
            today={TODAY}
            {...props}
        />
    );
}

const field = () => screen.getByRole('textbox', { name: 'Send on' });
const openButton = () => screen.getByRole('button', { name: 'Choose date' });
const dialog = () => screen.findByRole('dialog', { name: 'Choose date' });
const day = (name) => screen.getByRole('button', { name: new RegExp(name) });

describe('DatePicker', () => {
    it('shows the value in the locale format, with a named calendar button', async () => {
        const { unmount } = renderUi(<DatePicker trigger="button" aria-label="Send on" defaultValue={OCT(14)} />, { locale: 'en-US' });
        expect(field()).toHaveValue('10/14/2026');
        expect(openButton()).toHaveAttribute('aria-haspopup', 'dialog');
        await expectNoAxeViolations();
        unmount();
        renderUi(<DatePicker trigger="button" aria-label="Send on" defaultValue={OCT(14)} />, { locale: 'de-DE' });
        expect(field()).toHaveValue('14.10.2026');
    });

    it('reads typed text when the field loses focus and writes it back in the locale format', async () => {
        const values = [];
        const { user } = renderUi(<Controlled onChange={(v) => values.push(v)} />, { locale: 'en-US' });
        await user.click(field());
        await user.keyboard('10/5/2026');
        await user.tab();
        expect(values.at(-1)).toEqual(OCT(5));
        expect(field()).toHaveValue('10/05/2026');
        expect(field()).not.toHaveAttribute('aria-invalid');
    });

    it('reads typed text on Enter', async () => {
        const values = [];
        const { user } = renderUi(<Controlled onChange={(v) => values.push(v)} />, { locale: 'en-US' });
        await user.click(field());
        await user.keyboard('Oct 20 2026{Enter}');
        expect(values.at(-1)).toEqual(OCT(20));
        expect(field()).toHaveValue('10/20/2026');
    });

    it('keeps text that is not a date, marks the field invalid and empties the value until it is fixed', async () => {
        const values = [];
        const { user } = renderUi(<Controlled initial={OCT(14)} onChange={(v) => values.push(v)} />, { locale: 'en-US' });
        await user.clear(field());
        await user.keyboard('13/45/2026');
        await user.tab();
        expect(field()).toHaveValue('13/45/2026');
        expect(field()).toHaveAttribute('aria-invalid', 'true');
        expect(values.at(-1)).toBeNull();
        await expectNoAxeViolations();
        await user.clear(field());
        await user.keyboard('10/15/2026{Enter}');
        expect(field()).not.toHaveAttribute('aria-invalid');
        expect(values.at(-1)).toEqual(OCT(15));
    });

    it('treats a typed date outside min and max as invalid, and blocks those days in the calendar', async () => {
        const { user } = renderUi(<Controlled min={OCT(5)} max={OCT(25)} />, { locale: 'en-US' });
        await user.click(field());
        await user.keyboard('10/30/2026');
        await user.tab();
        expect(field()).toHaveAttribute('aria-invalid', 'true');
        await user.click(openButton());
        await dialog();
        expect(day('October 4th, 2026')).toBeDisabled();
        expect(day('October 26th, 2026')).toBeDisabled();
        expect(day('October 5th, 2026')).toBeEnabled();
    });

    it('writes and reads the format pattern', async () => {
        const values = [];
        const { user } = renderUi(<Controlled format="dd/MM/yyyy" initial={OCT(14)} onChange={(v) => values.push(v)} />);
        expect(field()).toHaveValue('14/10/2026');
        await user.clear(field());
        await user.keyboard('3-11-2026{Enter}');
        expect(values.at(-1)).toEqual(new Date(2026, 10, 3));
        expect(field()).toHaveValue('03/11/2026');
    });

    it('opens from the button with focus on the chosen day', async () => {
        const { user } = renderUi(<Controlled initial={OCT(14)} />);
        await user.click(openButton());
        await dialog();
        await waitFor(() => expect(day('October 14th, 2026')).toHaveFocus());
        expect(openButton()).toHaveAttribute('aria-expanded', 'true');
        await expectNoAxeViolations();
    });

    it('opens with Enter on the button, with focus on today when nothing is chosen', async () => {
        const { user } = renderUi(<Controlled />);
        openButton().focus();
        await user.keyboard('{Enter}');
        await dialog();
        await waitFor(() => expect(day('October 3rd, 2026')).toHaveFocus());
    });

    it('opens from the field with Alt+ArrowDown', async () => {
        const { user } = renderUi(<Controlled initial={OCT(14)} />);
        field().focus();
        await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
        await dialog();
        await waitFor(() => expect(day('October 14th, 2026')).toHaveFocus());
    });

    it('closes on Escape and returns focus to the field', async () => {
        const values = [];
        const { user } = renderUi(<Controlled initial={OCT(14)} onChange={(v) => values.push(v)} />);
        await user.click(openButton());
        await dialog();
        await waitFor(() => expect(day('October 14th, 2026')).toHaveFocus());
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        expect(field()).toHaveFocus();
        expect(values).toEqual([]);
    });

    it('chooses a day with the keyboard, closes and returns focus to the field', async () => {
        const values = [];
        const { user } = renderUi(<Controlled initial={OCT(14)} onChange={(v) => values.push(v)} />, { locale: 'en-US' });
        await user.click(openButton());
        await dialog();
        await waitFor(() => expect(day('October 14th, 2026')).toHaveFocus());
        await user.keyboard('{ArrowRight}{Enter}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        expect(values.at(-1)).toEqual(OCT(15));
        expect(field()).toHaveValue('10/15/2026');
        expect(field()).toHaveFocus();
    });

    it('keeps Tab inside the popup', async () => {
        const { user } = renderUi(<Controlled initial={OCT(14)} showButtonBar />);
        await user.click(openButton());
        const popup = await dialog();
        await waitFor(() => expect(day('October 14th, 2026')).toHaveFocus());
        const clear = within(popup).getByRole('button', { name: 'Clear' });
        clear.focus();
        await user.tab();
        expect(within(popup).getByRole('button', { name: /previous month/i })).toHaveFocus();
        await user.tab({ shift: true });
        expect(clear).toHaveFocus();
    });

    it('toggles several dates in multiple mode and lists them with commas', async () => {
        const values = [];
        const { user } = renderUi(<Controlled mode="multiple" initial={[OCT(6)]} onChange={(v) => values.push(v)} />, {
            locale: 'en-US',
        });
        await user.click(openButton());
        await dialog();
        await user.click(day('October 13th, 2026'));
        expect(values.at(-1)).toEqual([OCT(6), OCT(13)]);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(field()).toHaveValue('10/06/2026, 10/13/2026');
        await user.click(day('October 6th, 2026'));
        expect(values.at(-1)).toEqual([OCT(13)]);
    });

    it('chooses today and clears from the button bar', async () => {
        const values = [];
        const { user } = renderUi(<Controlled initial={OCT(14)} showButtonBar onChange={(v) => values.push(v)} />);
        await user.click(openButton());
        await user.click(within(await dialog()).getByRole('button', { name: 'Today' }));
        expect(values.at(-1)).toEqual(TODAY);
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await user.click(openButton());
        await user.click(within(await dialog()).getByRole('button', { name: 'Clear' }));
        expect(values.at(-1)).toBeNull();
        expect(field()).toHaveValue('');
    });

    it('changes hours, minutes and AM/PM with the arrow keys on the time spinbuttons', async () => {
        const values = [];
        const { user } = renderUi(<Controlled showTime hourCycle={12} initial={OCT(14, 9, 30)} onChange={(v) => values.push(v)} />, {
            locale: 'en-US',
        });
        expect(field()).toHaveValue('10/14/2026, 09:30 AM');
        await user.click(openButton());
        const popup = await dialog();
        // The popup moves focus to the chosen day once it has its place: wait for it, so it cannot take focus back.
        await waitFor(() => expect(day('October 14th, 2026')).toHaveFocus());
        within(popup).getByRole('spinbutton', { name: 'Hour' }).focus();
        await user.keyboard('{ArrowUp}');
        expect(values.at(-1)).toEqual(OCT(14, 10, 30));
        within(popup).getByRole('spinbutton', { name: 'Minute' }).focus();
        await user.keyboard('{ArrowDown}');
        expect(values.at(-1)).toEqual(OCT(14, 10, 29));
        within(popup).getByRole('spinbutton', { name: 'AM/PM' }).focus();
        await user.keyboard('{ArrowUp}');
        expect(values.at(-1)).toEqual(OCT(14, 22, 29));
        await user.click(day('October 20th, 2026'));
        expect(values.at(-1)).toEqual(OCT(20, 22, 29));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('chooses a month in the month view, moving with the arrow keys, PageDown, Home and End', async () => {
        const values = [];
        const { user } = renderUi(<Controlled view="month" initial={new Date(2026, 9, 1)} onChange={(v) => values.push(v)} />, {
            locale: 'en-US',
        });
        expect(field()).toHaveValue('10/2026');
        await user.click(openButton());
        await dialog();
        const october = screen.getByRole('button', { name: 'October 2026' });
        await waitFor(() => expect(october).toHaveFocus());
        expect(october.closest('[role=gridcell]')).toHaveAttribute('aria-selected', 'true');
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('button', { name: 'November 2026' })).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('button', { name: 'February 2027' })).toHaveFocus();
        await user.keyboard('{ArrowUp}{ArrowLeft}');
        expect(screen.getByRole('button', { name: 'October 2026' })).toHaveFocus();
        await user.keyboard('{PageDown}');
        expect(screen.getByRole('button', { name: 'October 2027' })).toHaveFocus();
        await user.keyboard('{Home}');
        expect(screen.getByRole('button', { name: 'January 2027' })).toHaveFocus();
        await user.keyboard('{End}');
        expect(screen.getByRole('button', { name: 'December 2027' })).toHaveFocus();
        await expectNoAxeViolations();
        await user.keyboard('{Enter}');
        expect(values.at(-1)).toEqual(new Date(2027, 11, 1));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('flips the month grid arrows in right-to-left', async () => {
        const { user } = renderUi(<Controlled view="month" initial={new Date(2026, 9, 1)} />, { dir: 'rtl' });
        await user.click(openButton());
        await dialog();
        await waitFor(() => expect(screen.getByRole('button', { name: 'October 2026' })).toHaveFocus());
        await user.keyboard('{ArrowLeft}');
        expect(screen.getByRole('button', { name: 'November 2026' })).toHaveFocus();
        await user.keyboard('{ArrowRight}{ArrowRight}');
        expect(screen.getByRole('button', { name: 'September 2026' })).toHaveFocus();
    });

    it('chooses a year in the year view', async () => {
        const values = [];
        const { user } = renderUi(<Controlled view="year" initial={new Date(2026, 0, 1)} onChange={(v) => values.push(v)} />);
        expect(field()).toHaveValue('2026');
        await user.click(openButton());
        await dialog();
        expect(screen.getByRole('grid', { name: /2020.*2029/ })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: '2028' }));
        expect(values.at(-1)).toEqual(new Date(2028, 0, 1));
    });

    it('opens the year list from the month view title', async () => {
        const { user } = renderUi(<Controlled view="month" initial={new Date(2026, 9, 1)} />);
        await user.click(openButton());
        await dialog();
        await user.click(screen.getByRole('button', { name: 'Choose year, 2026' }));
        await user.click(screen.getByRole('button', { name: '2027' }));
        expect(screen.getByRole('grid', { name: '2027' })).toBeInTheDocument();
    });

    it('opens on a click in the field with trigger="field", leaving focus there', async () => {
        const { user } = renderUi(<Controlled trigger="field" />);
        expect(screen.queryByRole('button', { name: 'Choose date' })).toBeNull();
        const combobox = screen.getByRole('combobox', { name: 'Send on' });
        expect(combobox).toHaveAttribute('aria-haspopup', 'dialog');
        expect(combobox).toHaveAttribute('aria-expanded', 'false');
        await user.click(combobox);
        await dialog();
        expect(combobox).toHaveAttribute('aria-expanded', 'true');
        expect(combobox).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('puts the button inside the field with trigger="icon"', async () => {
        renderUi(<Controlled trigger="icon" initial={OCT(14)} />);
        expect(openButton().closest('[data-slot=input-group]')).not.toBeNull();
        await expectNoAxeViolations();
    });

    it('clears with the clear button and keeps focus in the field', async () => {
        const values = [];
        const { user } = renderUi(<Controlled clearable initial={OCT(14)} onChange={(v) => values.push(v)} />);
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(values.at(-1)).toBeNull();
        expect(field()).toHaveValue('');
        expect(field()).toHaveFocus();
    });

    it('disables the field and the button', async () => {
        renderUi(<DatePicker trigger="button" aria-label="Send on" disabled defaultValue={OCT(14)} />);
        expect(field()).toBeDisabled();
        expect(openButton()).toBeDisabled();
        await expectNoAxeViolations();
    });

    it('is invalid with aria-invalid', async () => {
        renderUi(<DatePicker trigger="button" aria-label="Send on" aria-invalid />);
        expect(field()).toHaveAttribute('aria-invalid', 'true');
        await expectNoAxeViolations();
    });

    it('reaches data-size and data-variant', () => {
        renderUi(<DatePicker trigger="button" aria-label="Send on" size="sm" variant="filled" />);
        expect(field()).toHaveAttribute('data-size', 'sm');
        expect(field()).toHaveAttribute('data-variant', 'filled');
        expect(openButton()).toHaveAttribute('data-size', 'sm');
    });

    it('takes its names from the provider strings', async () => {
        const { user } = renderUi(<DatePicker trigger="button" aria-label="Send on" today={TODAY} />, { strings: { chooseDate: 'Datum wählen' } });
        await user.click(screen.getByRole('button', { name: 'Datum wählen' }));
        expect(await screen.findByRole('dialog', { name: 'Datum wählen' })).toBeInTheDocument();
    });

    it('shows and reads dates in the provider time zone', async () => {
        const values = [];
        const { user } = renderUi(<Controlled onChange={(v) => values.push(v)} />, { locale: 'en-US', timeZone: 'Asia/Tokyo' });
        await user.click(field());
        await user.keyboard('10/05/2026{Enter}');
        // Midnight on 5 October in Tokyo is 15:00 UTC on 4 October.
        expect(values.at(-1).toISOString()).toBe('2026-10-04T15:00:00.000Z');
        expect(field()).toHaveValue('10/05/2026');
    });

    it('shows the calendar on the page with inline', async () => {
        const values = [];
        const { user } = renderUi(<Controlled inline aria-label="Publish date" initial={OCT(14)} onChange={(v) => values.push(v)} />);
        expect(screen.getByRole('group', { name: 'Publish date' })).toBeInTheDocument();
        await user.click(day('October 16th, 2026'));
        expect(values.at(-1)).toEqual(OCT(16));
        await expectNoAxeViolations();
    });

    it('submits the day as YYYY-MM-DD with name', () => {
        const { container } = renderUi(<DatePicker trigger="button" aria-label="Send on" name="send_on" defaultValue={OCT(14)} />);
        expect(container.querySelector('input[type=hidden][name=send_on]')).toHaveValue('2026-10-14');
    });

    it('leaves the value alone when the field loses focus with its text unchanged', async () => {
        const values = [];
        const { user } = renderUi(
            <Controlled showTime hourCycle={24} initial={new Date(2026, 9, 14, 9, 30, 45)} onChange={(v) => values.push(v)} />,
            { locale: 'en-US' },
        );
        await user.click(field());
        await user.tab();
        expect(values).toEqual([]);
        expect(field()).toHaveValue('10/14/2026, 09:30');
    });

    it('reads AM or PM typed before the time, as Korean writes it', async () => {
        const values = [];
        const { user } = renderUi(<Controlled showTime onChange={(v) => values.push(v)} />, { locale: 'ko-KR' });
        await user.click(field());
        await user.keyboard('2026. 10. 14. 오후 9:30{Enter}');
        expect(values.at(-1)).toEqual(OCT(14, 21, 30));
        expect(field()).not.toHaveAttribute('aria-invalid');
    });

    it('chooses the 1st of today’s month with Today in the month view', async () => {
        const values = [];
        const { user } = renderUi(<Controlled view="month" showButtonBar onChange={(v) => values.push(v)} />, { locale: 'en-US' });
        await user.click(openButton());
        await user.click(within(await dialog()).getByRole('button', { name: 'Today' }));
        expect(values.at(-1)).toEqual(new Date(2026, 9, 1));
        expect(field()).toHaveValue('10/2026');
    });

    it('shows today’s month when Today is pressed', async () => {
        const values = [];
        const { user } = renderUi(
            <Controlled inline showButtonBar aria-label="Publish date" initial={new Date(2026, 11, 14)} onChange={(v) => values.push(v)} />,
            { locale: 'en-US' },
        );
        expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Today' }));
        expect(values.at(-1)).toEqual(TODAY);
        expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
    });

    it('bounds the time as well with showTime and a min that has a time', async () => {
        const values = [];
        const { user } = renderUi(
            <Controlled showTime hourCycle={24} min={OCT(14, 14)} initial={OCT(16, 9)} onChange={(v) => values.push(v)} />,
            { locale: 'en-US' },
        );
        await user.click(openButton());
        await dialog();
        await user.click(day('October 14th, 2026'));
        expect(values.at(-1)).toEqual(OCT(14, 14));
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await user.clear(field());
        await user.keyboard('10/14/2026, 09:00{Enter}');
        expect(field()).toHaveAttribute('aria-invalid', 'true');
        expect(values.at(-1)).toBeNull();
    });

    it('lists several dates with semicolons when the format has a comma, and reads them back', async () => {
        const values = [];
        const { user } = renderUi(
            <Controlled mode="multiple" format="EEE, d MMM yyyy" initial={[OCT(6), OCT(13)]} onChange={(v) => values.push(v)} />,
            { locale: 'en-US' },
        );
        expect(field()).toHaveValue('Tue, 6 Oct 2026; Tue, 13 Oct 2026');
        await user.clear(field());
        await user.keyboard('Tue, 6 Oct 2026; Wed, 14 Oct 2026{Enter}');
        expect(values.at(-1)).toEqual([OCT(6), OCT(14)]);
        expect(field()).not.toHaveAttribute('aria-invalid');
    });

    it('cancels its pending move of focus when it goes away first', () => {
        // Frames never run here: every frame still pending when the picker goes away must have been cancelled.
        let next = 0;
        const pending = new Set();
        const request = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => {
            next += 1;
            pending.add(next);
            return next;
        });
        const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => pending.delete(id));
        const { unmount } = renderUi(<DatePicker trigger="button" aria-label="Send on" defaultOpen today={TODAY} />);
        expect(next).toBeGreaterThan(0);
        unmount();
        expect([...pending]).toEqual([]);
        request.mockRestore();
        cancel.mockRestore();
    });

    it('in a dialog: a day picked keeps the dialog open, and Escape closes the calendar first', async () => {
        const values = [];
        const { user } = renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Schedule a campaign</DialogTitle>
                    <DialogDescription>Choose the day it goes out.</DialogDescription>
                    <Controlled initial={OCT(14)} onChange={(v) => values.push(v)} />
                </DialogContent>
            </Dialog>,
            { locale: 'en-US' },
        );
        await user.click(openButton());
        await dialog();
        await waitFor(() => expect(day('October 14th, 2026')).toHaveFocus());
        await user.click(day('October 20th, 2026'));
        expect(values.at(-1)).toEqual(OCT(20));
        await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Choose date' })).toBeNull());
        expect(screen.getByRole('dialog', { name: 'Schedule a campaign' })).toBeInTheDocument();
        await user.click(openButton());
        await dialog();
        await waitFor(() => expect(day('October 20th, 2026')).toHaveFocus());
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Choose date' })).toBeNull());
        expect(screen.getByRole('dialog', { name: 'Schedule a campaign' })).toBeInTheDocument();
        expect(field()).toHaveFocus();
        await expectNoAxeViolations();
    });
});

describe('DatePicker in a form', () => {
    const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));
    const field = (container) => container.querySelector('input:not([type="hidden"])');

    it('a form reset puts the default date back, in the field and the submitted value', async () => {
        const { container } = renderUi(
            <form>
                <DatePicker trigger="button" aria-label="Send on" name="day" defaultValue={OCT(5)} today={TODAY} />
            </form>,
            { locale: 'en-US' }
        );
        const form = container.querySelector('form');
        fireEvent.change(field(container), { target: { value: '10/06/2026' } });
        fireEvent.blur(field(container));
        expect(new FormData(form).get('day')).toBe('2026-10-06');
        act(() => form.reset());
        await settle();
        expect(field(container)).toHaveValue('10/05/2026');
        expect(new FormData(form).get('day')).toBe('2026-10-05');
    });

    it('belongs to the form its form attribute names', () => {
        const { container } = renderUi(
            <>
                <form id="schedule" />
                <DatePicker trigger="button" aria-label="Send on" name="day" form="schedule" defaultValue={OCT(5)} today={TODAY} />
            </>,
            { locale: 'en-US' }
        );
        expect(field(container).form?.id).toBe('schedule');
        expect(new FormData(document.getElementById('schedule')).get('day')).toBe('2026-10-05');
    });

    it('accepts its own Bengali and Hindi month names', () => {
        for (const locale of ['bn-BD', 'hi-IN']) {
            const { container, unmount } = renderUi(
                <form>
                    <DatePicker trigger="button" aria-label="Send on" name="day" format="d MMMM yyyy" defaultValue={OCT(5)} today={TODAY} />
                </form>,
                { locale }
            );
            const input = field(container);
            fireEvent.change(input, { target: { value: input.value } });
            fireEvent.blur(input);
            expect(input).not.toHaveAttribute('aria-invalid', 'true');
            expect(new FormData(container.querySelector('form')).get('day')).toBe('2026-10-05');
            unmount();
        }
    });
});


it('passes ISO week numbering through at the year boundary regardless of locale', () => {
    const { container, rerender } = renderUi(<DatePicker inline aria-label="Date" today={new Date(2021, 0, 1)}
        calendarProps={{ showWeekNumber: true, ISOWeek: true }} />, { locale: 'en-US' });
    expect(container.querySelector('.rdp-week_number')).toHaveTextContent('53');
    rerender(<DatePicker inline aria-label="Date" today={new Date(2021, 0, 1)}
        calendarProps={{ showWeekNumber: true, weekStartsOn: 1, firstWeekContainsDate: 4 }} />);
    expect(container.querySelector('.rdp-week_number')).toHaveTextContent('53');
});


it('opens from the field by default without an attached button', async () => {
    const { user } = renderUi(<DatePicker aria-label="Default date" today={TODAY} />);
    const input = screen.getByRole('combobox', { name: 'Default date' });
    expect(screen.queryByRole('button', { name: 'Choose date' })).toBeNull();
    await user.click(input);
    await dialog();
    expect(input).toHaveFocus();
});

it('navigates from month and year headers without committing until a day is chosen', async () => {
    const values = [];
    const { user } = renderUi(<Controlled initial={OCT(14)} onChange={(value) => values.push(value)} />);
    await user.click(openButton());
    await dialog();
    await user.click(screen.getByRole('button', { name: '2026', exact: true }));
    expect(screen.getByRole('button', { name: '2026', exact: true })).toHaveFocus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(screen.getByRole('button', { name: 'October 2027', exact: true })).toHaveFocus();
    expect(values).toEqual([]);
    await user.keyboard('{ArrowRight}{Enter}');
    expect(screen.getByRole('button', { name: 'November', exact: true })).toBeInTheDocument();
    expect(values).toEqual([]);
    await user.click(day('November 10th, 2027'));
    expect(values.at(-1)).toEqual(new Date(2027, 10, 10));
    await user.click(openButton());
    await user.click(screen.getByRole('button', { name: 'November', exact: true }));
    await user.keyboard('{ArrowLeft}{Enter}');
    expect(screen.getByRole('button', { name: 'October', exact: true })).toBeInTheDocument();
    await expectNoAxeViolations();
});

it('disables outside-month pointer selection by default while arrows still cross months', async () => {
    const values = [];
    const { user } = renderUi(<Controlled inline initial={OCT(31)} onChange={(value) => values.push(value)} />);
    expect(day('September 30th, 2026')).toBeDisabled();
    await user.click(day('September 30th, 2026'));
    expect(values).toEqual([]);
    day('October 31st, 2026').focus();
    await user.keyboard('{ArrowRight}');
    expect(day('November 1st, 2026')).toHaveFocus();
    expect(day('November 1st, 2026')).not.toBeDisabled();
    await user.keyboard('{ArrowLeft}');
    expect(day('October 31st, 2026')).toHaveFocus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(values.at(-1)).toEqual(new Date(2026, 10, 1));
});

it('can opt in to choosing outside-month dates', async () => {
    const values = [];
    const { user } = renderUi(<Controlled inline initial={OCT(14)} calendarProps={{ selectOutsideDays: true }} onChange={(value) => values.push(value)} />);
    await user.click(day('September 30th, 2026'));
    expect(values.at(-1)).toEqual(new Date(2026, 8, 30));
});
