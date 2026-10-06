import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { fr } from 'react-day-picker/locale';
import { Calendar } from '@/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const OCT = new Date(2026, 9);
const TODAY = new Date(2026, 9, 3);

function Single({ initial = new Date(2026, 9, 14), onPick, ...props }) {
    const [date, setDate] = useState(initial);
    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={(next) => {
                setDate(next);
                onPick?.(next);
            }}
            defaultMonth={OCT}
            today={TODAY}
            {...props}
        />
    );
}

const day = (name) => screen.getByRole('button', { name: new RegExp(name) });

describe('Calendar', () => {
    it('renders a grid of October 2026 with the selected day marked', async () => {
        renderUi(<Single />);
        expect(screen.getByRole('grid')).toHaveAccessibleName('October 2026');
        expect(day('October 14th, 2026').closest('td')).toHaveAttribute('aria-selected', 'true');
        await expectNoAxeViolations();
    });

    it('moves focus a day with the left and right arrows', async () => {
        const { user } = renderUi(<Single />);
        day('October 14th, 2026').focus();
        await user.keyboard('{ArrowRight}');
        expect(day('October 15th, 2026')).toHaveFocus();
        await user.keyboard('{ArrowLeft}{ArrowLeft}');
        expect(day('October 13th, 2026')).toHaveFocus();
    });

    it('moves focus a week with the up and down arrows', async () => {
        const { user } = renderUi(<Single />);
        day('October 14th, 2026').focus();
        await user.keyboard('{ArrowDown}');
        expect(day('October 21st, 2026')).toHaveFocus();
        await user.keyboard('{ArrowUp}{ArrowUp}');
        expect(day('October 7th, 2026')).toHaveFocus();
    });

    it('moves to the start and end of the week with Home and End', async () => {
        const { user } = renderUi(<Single />);
        day('October 14th, 2026').focus();
        // 14 October 2026 is a Wednesday; weeks start on Sunday.
        await user.keyboard('{Home}');
        expect(day('October 11th, 2026')).toHaveFocus();
        await user.keyboard('{End}');
        expect(day('October 17th, 2026')).toHaveFocus();
    });

    it('moves a month with PageUp and PageDown', async () => {
        const { user } = renderUi(<Single />);
        day('October 14th, 2026').focus();
        await user.keyboard('{PageDown}');
        expect(screen.getByRole('grid')).toHaveAccessibleName('November 2026');
        expect(day('November 14th, 2026')).toHaveFocus();
        await user.keyboard('{PageUp}{PageUp}');
        expect(screen.getByRole('grid')).toHaveAccessibleName('September 2026');
        expect(day('September 14th, 2026')).toHaveFocus();
    });

    it('moves a year with Shift+PageUp and Shift+PageDown', async () => {
        const { user } = renderUi(<Single />);
        day('October 14th, 2026').focus();
        await user.keyboard('{Shift>}{PageDown}{/Shift}');
        expect(screen.getByRole('grid')).toHaveAccessibleName('October 2027');
        expect(day('October 14th, 2027')).toHaveFocus();
    });

    it('selects the focused day with Enter', async () => {
        const picked = [];
        const { user } = renderUi(<Single onPick={(d) => picked.push(d)} />);
        day('October 14th, 2026').focus();
        await user.keyboard('{ArrowRight}{Enter}');
        expect(picked.at(-1).getDate()).toBe(15);
        expect(day('October 15th, 2026').closest('td')).toHaveAttribute('aria-selected', 'true');
    });

    it('selects the focused day with Space', async () => {
        const picked = [];
        const { user } = renderUi(<Single onPick={(d) => picked.push(d)} />);
        day('October 14th, 2026').focus();
        await user.keyboard('{ArrowLeft} ');
        expect(picked.at(-1).getDate()).toBe(13);
    });

    it('selects a day by click', async () => {
        const { user } = renderUi(<Single initial={undefined} />);
        await user.click(day('October 20th, 2026'));
        expect(day('October 20th, 2026').closest('td')).toHaveAttribute('aria-selected', 'true');
    });

    it('goes to the next and previous month with the arrow buttons', async () => {
        const { user } = renderUi(<Single />);
        await user.click(screen.getByRole('button', { name: /next month/i }));
        expect(screen.getByRole('grid')).toHaveAccessibleName('November 2026');
        await user.click(screen.getByRole('button', { name: /previous month/i }));
        expect(screen.getByRole('grid')).toHaveAccessibleName('October 2026');
    });

    it('selects a range: first click starts it, second ends it', async () => {
        function Range() {
            const [range, setRange] = useState();
            return <Calendar mode="range" selected={range} onSelect={setRange} defaultMonth={OCT} today={TODAY} />;
        }
        const { user } = renderUi(<Range />);
        await user.click(day('October 8th, 2026'));
        await user.click(day('October 12th, 2026'));
        for (const d of ['8th', '9th', '10th', '11th', '12th']) {
            expect(day(`October ${d}, 2026`).closest('td')).toHaveAttribute('aria-selected', 'true');
        }
        expect(day('October 13th, 2026').closest('td')).not.toHaveAttribute('aria-selected', 'true');
        await expectNoAxeViolations();
    });

    it('disables days: they are not selectable and not in the grid focus path', async () => {
        const picked = [];
        const { user } = renderUi(
            <Single initial={undefined} onPick={(d) => picked.push(d)} disabled={[{ before: TODAY }, { dayOfWeek: [0, 6] }]} />,
        );
        expect(day('October 1st, 2026')).toBeDisabled();
        expect(day('October 4th, 2026')).toBeDisabled();
        await user.click(day('October 1st, 2026'));
        expect(picked).toEqual([]);
        expect(day('October 5th, 2026')).toBeEnabled();
        await expectNoAxeViolations();
    });

    it('shows month and year dropdowns with the dropdown caption', async () => {
        const { user } = renderUi(
            <Single captionLayout="dropdown" startMonth={new Date(2024, 0)} endMonth={new Date(2028, 11)} />,
        );
        const month = screen.getByRole('combobox', { name: /month/i });
        const year = screen.getByRole('combobox', { name: /year/i });
        await user.selectOptions(month, 'Jan');
        expect(screen.getByRole('grid')).toHaveAccessibleName('January 2026');
        await user.selectOptions(year, '2027');
        expect(screen.getByRole('grid')).toHaveAccessibleName('January 2027');
        await expectNoAxeViolations();
    });

    it('lets the arrow keys follow the reading direction in RTL (the provider passes dir)', async () => {
        const { user, container } = renderUi(<Single />, { dir: 'rtl' });
        expect(container.querySelector('[data-slot=calendar]')).toHaveAttribute('dir', 'rtl');
        day('October 14th, 2026').focus();
        await user.keyboard('{ArrowLeft}');
        expect(day('October 15th, 2026')).toHaveFocus();
        await user.keyboard('{ArrowRight}{ArrowRight}');
        expect(day('October 13th, 2026')).toHaveFocus();
    });

    it('stays left-to-right by default', () => {
        const { container } = renderUi(<Single />);
        expect(container.querySelector('[data-slot=calendar]')).toHaveAttribute('dir', 'ltr');
    });

    it('writes the caption, weekday names, digits and day names in the provider’s locale', async () => {
        const { container } = renderUi(<Single />, { locale: 'de-DE' });
        expect(screen.getByRole('grid')).toHaveAccessibleName('Oktober 2026');
        expect(container.querySelector('[data-slot=calendar]')).toHaveAttribute('lang', 'de-DE');
        const headers = [...container.querySelectorAll('thead th')];
        expect(headers.map((th) => th.textContent)).toEqual(['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']);
        expect(headers[0]).toHaveAttribute('aria-label', 'Montag');
        expect(day('Mittwoch, 14. Oktober 2026')).toHaveTextContent('14');
        expect(day('Mittwoch, 14. Oktober 2026')).toHaveAccessibleName('Mittwoch, 14. Oktober 2026, selected');
        await expectNoAxeViolations();
    });

    it('starts the week on the locale’s first day, unless weekStartsOn says otherwise', () => {
        const first = (container) => container.querySelector('thead th').getAttribute('aria-label');
        const de = renderUi(<Single />, { locale: 'de-DE' });
        expect(first(de.container)).toBe('Montag');
        de.unmount();
        const ar = renderUi(<Single />, { locale: 'ar-EG' });
        expect(first(ar.container)).toBe(new Intl.DateTimeFormat('ar-EG', { weekday: 'long', timeZone: 'UTC' }).format(Date.UTC(2026, 9, 3, 12)));
        ar.unmount();
        const us = renderUi(<Single />, { locale: 'en-US' });
        expect(first(us.container)).toBe('Sunday');
        us.unmount();
        const forced = renderUi(<Single weekStartsOn={3} />, { locale: 'de-DE' });
        expect(first(forced.container)).toBe('Mittwoch');
    });

    it('writes the locale’s digits, and narrow weekday names where the short ones are too wide', () => {
        const { container } = renderUi(<Single />, { locale: 'ar-EG', dir: 'rtl' });
        const narrow = new Intl.DateTimeFormat('ar-EG', { weekday: 'narrow', timeZone: 'UTC' });
        expect(container.querySelector('thead th').textContent).toBe(narrow.format(Date.UTC(2026, 9, 3, 12)));
        expect(screen.getByRole('grid')).toHaveAccessibleName(
            new Intl.DateTimeFormat('ar-EG', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(2026, 9, 15)),
        );
        expect(container.querySelector('[aria-selected=true] button').textContent).toBe('١٤');
    });

    it('keeps English’s two-letter weekday names and ordinal day names in an English locale', () => {
        const { container, unmount } = renderUi(<Single />, { locale: 'en-US' });
        expect([...container.querySelectorAll('thead th')].map((th) => th.textContent)).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
        expect(day('Wednesday, October 14th, 2026')).toHaveAccessibleName('Wednesday, October 14th, 2026, selected');
        unmount();
        renderUi(<Single />, { locale: 'en-GB' });
        expect(day('Wednesday, 14th October 2026')).toBeInTheDocument();
    });

    it('names the days, arrows, dropdowns and week numbers with the provider’s strings', async () => {
        const strings = {
            todayDate: 'Heute, {date}',
            selectedDate: '{date}, ausgewählt',
            previousMonth: 'Vorheriger Monat',
            nextMonth: 'Nächster Monat',
            monthNavigation: 'Monat wechseln',
            month: 'Monat',
            year: 'Jahr',
            weekNumber: 'Woche {week}',
        };
        const { unmount } = renderUi(<Single captionLayout="dropdown" startMonth={new Date(2026, 0)} endMonth={new Date(2027, 11)} />, {
            locale: 'de-DE',
            strings,
        });
        expect(day('Mittwoch, 14. Oktober 2026')).toHaveAccessibleName('Mittwoch, 14. Oktober 2026, ausgewählt');
        expect(day('Samstag, 3. Oktober 2026')).toHaveAccessibleName('Heute, Samstag, 3. Oktober 2026');
        expect(screen.getByRole('button', { name: 'Vorheriger Monat' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Nächster Monat' })).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: 'Monat wechseln' })).toBeInTheDocument();
        const month = screen.getByRole('combobox', { name: 'Monat' });
        expect([...month.options].map((option) => option.textContent)[9]).toBe(
            new Intl.DateTimeFormat('de-DE', { month: 'short', timeZone: 'UTC' }).format(Date.UTC(2026, 9, 15)),
        );
        expect(screen.getByRole('combobox', { name: 'Jahr' })).toBeInTheDocument();
        await expectNoAxeViolations();
        unmount();
        // Week numbers (no axe here: the stock week-number cell is a `td` with `scope`, reported separately).
        renderUi(<Single showWeekNumber />, { locale: 'ar-EG', strings });
        expect(screen.getAllByRole('rowheader', { name: /^Woche [٠-٩]+$/ }).length).toBeGreaterThan(3);
    });

    it('uses the provider’s words in English without a locale, and DayPicker’s English dates', () => {
        renderUi(<Single />, { strings: { selectedDate: '{date} (chosen)' } });
        expect(day('October 14th, 2026')).toHaveAccessibleName('Wednesday, October 14th, 2026 (chosen)');
        expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
    });

    it('lets DayPicker’s own locale prop win over the provider’s locale and strings', () => {
        const { container } = renderUi(<Single locale={fr} />, { locale: 'de-DE', strings: { nextMonth: 'Nächster Monat' } });
        expect(screen.getByRole('grid')).toHaveAccessibleName('octobre 2026');
        expect(container.querySelector('[data-slot=calendar]')).toHaveAttribute('lang', 'fr');
        expect(screen.queryByRole('button', { name: 'Nächster Monat' })).toBeNull();
    });

    it('writes each day by its own date in DayPicker’s time zone', () => {
        renderUi(<Single timeZone="Pacific/Kiritimati" />, { locale: 'de-DE' });
        for (const button of screen.getAllByRole('button').filter((b) => /^\d+$/.test(b.textContent))) {
            expect(button.getAttribute('aria-label')).toMatch(new RegExp(`, ${button.textContent}\\. `));
        }
    });

    it('works inside a popover: picks a date and Escape closes the popover', async () => {
        function Picker() {
            const [date, setDate] = useState();
            return (
                <Popover>
                    <PopoverTrigger>{date ? `Picked ${date.getDate()}` : 'Pick a date'}</PopoverTrigger>
                    <PopoverContent aria-label="Choose a date">
                        <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={OCT} today={TODAY} />
                    </PopoverContent>
                </Popover>
            );
        }
        const { user } = renderUi(<Picker />);
        await user.click(screen.getByRole('button', { name: 'Pick a date' }));
        await user.click(await screen.findByRole('button', { name: /October 22nd, 2026/ }));
        expect(screen.getByRole('button', { name: 'Picked 22' })).toBeInTheDocument();
        await expectNoAxeViolations();
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('grid')).toBeNull();
    });

    it('gives only today the dot’s ::after, so a chosen day’s number stays centred in its circle', () => {
        // Any `after:` class creates the ::after box; outside today it is an empty item that takes the button's gap and
        // pulls the number 4 px off centre. The browser check in scripts/docs-test.mjs measures the centring itself.
        const { container } = renderUi(
            <Calendar mode="range" selected={{ from: new Date(2026, 9, 8), to: new Date(2026, 9, 15) }} defaultMonth={OCT} today={TODAY} />
        );
        const buttons = [...container.querySelectorAll('button[data-day]')];
        expect(buttons.length).toBeGreaterThan(28);
        for (const button of buttons) {
            const unscoped = [...button.classList].filter((name) => name.includes('after:') && !name.startsWith('data-[today=true]:'));
            expect(unscoped, button.getAttribute('aria-label')).toEqual([]);
        }
    });

    it('starts the week on the locale’s first day in a browser without Intl.Locale week information', () => {
        // Firefox has neither getWeekInfo nor weekInfo: the week must still start where the server started it.
        const proto = Intl.Locale.prototype;
        const saved = ['getWeekInfo', 'weekInfo'].map((key) => [key, Object.getOwnPropertyDescriptor(proto, key)]);
        for (const [key, descriptor] of saved) if (descriptor) delete proto[key];
        try {
            const first = (container) => container.querySelector('thead th').getAttribute('aria-label');
            for (const [locale, expected] of [
                ['de-DE', 'Montag'],
                ['en-US', 'Sunday'],
                ['pt-BR', 'domingo'],
                ['ar-EG', new Intl.DateTimeFormat('ar-EG', { weekday: 'long', timeZone: 'UTC' }).format(Date.UTC(2026, 9, 3, 12))],
                ['de-DE-u-fw-sun', 'Sonntag'],
            ]) {
                const { container, unmount } = renderUi(<Single />, { locale });
                expect(first(container)).toBe(expected);
                unmount();
            }
        } finally {
            for (const [key, descriptor] of saved) if (descriptor) Object.defineProperty(proto, key, descriptor);
        }
    });
});
