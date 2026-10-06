import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen } from '@testing-library/react';
import { TimeField } from '@/components/time-field';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const DAY = new Date(2026, 9, 14);
const at = (hour, minute, second = 0) => new Date(2026, 9, 14, hour, minute, second);

function Controlled({ initial = null, onChange, ...props }) {
    const [value, setValue] = useState(initial);
    return (
        <TimeField
            aria-label="Send at"
            value={value}
            onValueChange={(next) => {
                setValue(next);
                onChange?.(next);
            }}
            referenceDate={DAY}
            {...props}
        />
    );
}

const segment = (name) => screen.getByRole('spinbutton', { name });

describe('TimeField', () => {
    it('renders a named group of hour, minute and AM/PM spinbuttons in the locale order', async () => {
        renderUi(<TimeField aria-label="Send at" defaultValue={at(9, 30)} />, { locale: 'en-US' });
        expect(screen.getByRole('group', { name: 'Send at' })).toBeInTheDocument();
        const names = screen.getAllByRole('spinbutton').map((el) => el.getAttribute('aria-label'));
        expect(names).toEqual(['Hour', 'Minute', 'AM/PM']);
        expect(segment('Hour')).toHaveTextContent('09');
        expect(segment('Hour')).toHaveAttribute('aria-valuenow', '9');
        expect(segment('Minute')).toHaveTextContent('30');
        expect(segment('AM/PM')).toHaveTextContent('AM');
        await expectNoAxeViolations();
    });

    it('uses a 24-hour clock where the locale does, or with hourCycle', async () => {
        const { unmount } = renderUi(<TimeField aria-label="Send at" defaultValue={at(17, 45)} />, { locale: 'de-DE' });
        expect(screen.getAllByRole('spinbutton')).toHaveLength(2);
        expect(segment('Hour')).toHaveTextContent('17');
        unmount();
        renderUi(<TimeField aria-label="Send at" hourCycle={24} defaultValue={at(17, 45)} />, { locale: 'en-US' });
        expect(screen.queryByRole('spinbutton', { name: 'AM/PM' })).toBeNull();
        await expectNoAxeViolations();
    });

    it('adds a seconds segment with showSeconds', async () => {
        renderUi(<TimeField aria-label="Send at" hourCycle={24} showSeconds defaultValue={at(8, 5, 9)} />);
        expect(segment('Second')).toHaveTextContent('09');
        await expectNoAxeViolations();
    });

    it('steps a segment up and down with the arrow keys, wrapping at the ends', async () => {
        const values = [];
        const { user } = renderUi(<Controlled hourCycle={24} initial={at(23, 59)} onChange={(v) => values.push(v)} />);
        segment('Hour').focus();
        await user.keyboard('{ArrowUp}');
        expect(segment('Hour')).toHaveTextContent('00');
        await user.keyboard('{ArrowDown}{ArrowDown}');
        expect(segment('Hour')).toHaveTextContent('22');
        expect(values.at(-1)).toEqual(at(22, 59));
    });

    it('moves between segments with the left and right arrows', async () => {
        const { user } = renderUi(<TimeField aria-label="Send at" hourCycle={12} defaultValue={at(9, 30)} />);
        segment('Hour').focus();
        await user.keyboard('{ArrowRight}');
        expect(segment('Minute')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(segment('AM/PM')).toHaveFocus();
        await user.keyboard('{ArrowLeft}{ArrowLeft}');
        expect(segment('Hour')).toHaveFocus();
    });

    it('fills a segment from typed digits and moves on when it is complete', async () => {
        const values = [];
        const { user } = renderUi(<Controlled hourCycle={24} onChange={(v) => values.push(v)} />);
        segment('Hour').focus();
        await user.keyboard('1');
        expect(segment('Hour')).toHaveTextContent('1');
        expect(segment('Hour')).toHaveFocus();
        await user.keyboard('7');
        expect(segment('Minute')).toHaveFocus();
        await user.keyboard('4');
        await user.keyboard('5');
        expect(values.at(-1)).toEqual(at(17, 45));
    });

    it('moves on at once when no second digit could follow', async () => {
        const { user } = renderUi(<TimeField aria-label="Send at" hourCycle={24} />);
        segment('Hour').focus();
        await user.keyboard('7');
        expect(segment('Hour')).toHaveTextContent('07');
        expect(segment('Minute')).toHaveFocus();
    });

    it('sets AM or PM from a typed letter', async () => {
        const values = [];
        const { user } = renderUi(<Controlled hourCycle={12} initial={at(9, 30)} onChange={(v) => values.push(v)} />, {
            locale: 'en-US',
        });
        segment('AM/PM').focus();
        await user.keyboard('p');
        expect(segment('AM/PM')).toHaveTextContent('PM');
        expect(values.at(-1)).toEqual(at(21, 30));
    });

    it('clears a digit with Backspace, then goes to the previous segment, and the value becomes null', async () => {
        const values = [];
        const { user } = renderUi(<Controlled hourCycle={24} initial={at(9, 30)} onChange={(v) => values.push(v)} />);
        segment('Minute').focus();
        await user.keyboard('{Backspace}');
        expect(segment('Minute')).toHaveTextContent('3');
        expect(values.at(-1)).toEqual(at(9, 3));
        await user.keyboard('{Backspace}');
        expect(segment('Minute')).toHaveAttribute('aria-valuetext', 'Empty');
        expect(values.at(-1)).toBeNull();
        await user.keyboard('{Backspace}');
        expect(segment('Hour')).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('empties a segment with Delete', async () => {
        const values = [];
        const { user } = renderUi(<Controlled hourCycle={24} initial={at(9, 30)} onChange={(v) => values.push(v)} />);
        segment('Hour').focus();
        await user.keyboard('{Delete}');
        expect(segment('Hour')).toHaveAttribute('aria-valuetext', 'Empty');
        expect(segment('Hour')).not.toHaveAttribute('aria-valuenow');
        expect(values.at(-1)).toBeNull();
    });

    it('sets the lowest and highest value with Home and End', async () => {
        const { user } = renderUi(<TimeField aria-label="Send at" hourCycle={24} defaultValue={at(9, 30)} />);
        segment('Hour').focus();
        await user.keyboard('{End}');
        expect(segment('Hour')).toHaveTextContent('23');
        await user.keyboard('{Home}');
        expect(segment('Hour')).toHaveTextContent('00');
    });

    it('steps minutes by step', async () => {
        const { user } = renderUi(<TimeField aria-label="Send at" hourCycle={24} step={15} defaultValue={at(9, 7)} />);
        segment('Minute').focus();
        await user.keyboard('{ArrowUp}');
        expect(segment('Minute')).toHaveTextContent('15');
        await user.keyboard('{ArrowDown}{ArrowDown}');
        expect(segment('Minute')).toHaveTextContent('45');
    });

    it('marks every segment invalid when the time is outside min and max', async () => {
        renderUi(<TimeField aria-label="Send at" hourCycle={24} min={at(9, 0)} max={at(17, 0)} defaultValue={at(18, 30)} />);
        for (const el of screen.getAllByRole('spinbutton')) expect(el).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('group')).toHaveAttribute('data-invalid');
        await expectNoAxeViolations();
    });

    it('is invalid with aria-invalid, and inert when disabled', async () => {
        const { user, unmount } = renderUi(<TimeField aria-label="Send at" aria-invalid defaultValue={at(9, 30)} />);
        expect(segment('Hour')).toHaveAttribute('aria-invalid', 'true');
        await expectNoAxeViolations();
        unmount();
        renderUi(<TimeField aria-label="Send at" hourCycle={24} disabled defaultValue={at(9, 30)} />);
        expect(screen.getByRole('group')).toHaveAttribute('aria-disabled', 'true');
        expect(segment('Hour')).toHaveAttribute('tabindex', '-1');
        segment('Hour').focus();
        await user.keyboard('{ArrowUp}');
        expect(segment('Hour')).toHaveTextContent('09');
        await expectNoAxeViolations();
    });

    it('reaches data-size and data-variant, and submits HH:mm with name', () => {
        const { container } = renderUi(
            <form>
                <TimeField aria-label="Send at" hourCycle={24} size="lg" variant="filled" name="send_at" defaultValue={at(9, 5)} />
            </form>
        );
        const group = screen.getByRole('group');
        expect(group).toHaveAttribute('data-size', 'lg');
        expect(group).toHaveAttribute('data-variant', 'filled');
        expect(container.querySelector('input[name=send_at]')).toHaveValue('09:05');
    });

    it('reads hours in the provider time zone', () => {
        // 09:30 in New York is 13:30 UTC.
        renderUi(<TimeField aria-label="Send at" hourCycle={24} defaultValue={new Date(Date.UTC(2026, 9, 14, 13, 30))} />, {
            timeZone: 'America/New_York',
        });
        expect(segment('Hour')).toHaveTextContent('09');
    });

    it('takes its segment names from the provider strings', () => {
        renderUi(<TimeField aria-label="Envoi" hourCycle={24} />, { strings: { hour: 'Heure', minute: 'Minute', emptySegment: 'Vide' } });
        expect(segment('Heure')).toHaveAttribute('aria-valuetext', 'Vide');
    });

    it('writes the same time in the new segments when hourCycle changes after mount', () => {
        const { rerender } = renderUi(<TimeField aria-label="Send at" hourCycle={12} defaultValue={at(21, 30)} />);
        expect(segment('Hour')).toHaveTextContent('09');
        expect(segment('AM/PM')).toHaveTextContent('PM');
        rerender(
            <BooleanUIProvider>
                <TimeField aria-label="Send at" hourCycle={24} defaultValue={at(21, 30)} />
            </BooleanUIProvider>,
        );
        expect(segment('Hour')).toHaveTextContent('21');
        expect(screen.queryByRole('spinbutton', { name: 'AM/PM' })).toBeNull();
    });
});

describe('TimeField in a form', () => {
    const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));
    const minute = () => screen.getByRole('spinbutton', { name: 'Minute' });

    it('controlled: a refused change keeps showing and submitting the parent\'s time', () => {
        const { container } = renderUi(
            <form>
                <TimeField aria-label="Send at" name="time" hourCycle={24} value={new Date(2026, 9, 5, 9, 30)} onValueChange={() => {}} />
            </form>
        );
        fireEvent.keyDown(minute(), { key: 'ArrowUp' });
        expect(minute()).toHaveAttribute('aria-valuenow', '30');
        expect(new FormData(container.querySelector('form')).get('time')).toBe('09:30');
    });

    it('uncontrolled: a form reset puts the default time back', async () => {
        const { container } = renderUi(
            <form>
                <TimeField aria-label="Send at" name="time" hourCycle={24} defaultValue={new Date(2026, 9, 5, 9, 30)} />
            </form>
        );
        const form = container.querySelector('form');
        fireEvent.keyDown(minute(), { key: 'ArrowUp' });
        expect(new FormData(form).get('time')).toBe('09:31');
        act(() => form.reset());
        await settle();
        expect(minute()).toHaveAttribute('aria-valuenow', '30');
        expect(new FormData(form).get('time')).toBe('09:30');
    });

    it('belongs to the form its form attribute names', () => {
        renderUi(
            <>
                <form id="schedule" />
                <TimeField aria-label="Send at" name="time" form="schedule" hourCycle={24} defaultValue={new Date(2026, 9, 5, 9, 30)} />
            </>
        );
        expect(new FormData(document.getElementById('schedule')).get('time')).toBe('09:30');
    });
});

describe('TimeField read-only', () => {
    it('keeps its segments focusable and marked read-only, and the keys change nothing', () => {
        const onValueChange = vi.fn();
        renderUi(<TimeField aria-label="Send at" hourCycle={24} readOnly defaultValue={new Date(2026, 9, 5, 9, 30)} onValueChange={onValueChange} />);
        const minute = screen.getByRole('spinbutton', { name: 'Minute' });
        expect(minute).toHaveAttribute('aria-readonly', 'true');
        expect(minute).toHaveAttribute('tabindex', '0');
        fireEvent.keyDown(minute, { key: 'ArrowUp' });
        expect(minute).toHaveAttribute('aria-valuenow', '30');
        expect(onValueChange).not.toHaveBeenCalled();
    });
});
