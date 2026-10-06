import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen } from '@testing-library/react';
import { Knob } from '@/components/knob';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const dial = (name = 'Sending rate') => screen.getByRole('slider', { name });

describe('Knob', () => {
    it('renders a named slider with its value and bounds, and the value in the middle', async () => {
        renderUi(<Knob defaultValue={50} aria-label="Sending rate" />);
        expect(dial()).toHaveAttribute('aria-valuenow', '50');
        expect(dial()).toHaveAttribute('aria-valuemin', '0');
        expect(dial()).toHaveAttribute('aria-valuemax', '100');
        expect(dial()).not.toHaveAttribute('aria-valuetext');
        expect(dial()).toHaveAttribute('tabindex', '0');
        expect(document.querySelector('[data-slot=knob-text]')).toHaveTextContent('50');
        await expectNoAxeViolations();
    });

    it('is named by a visible label and described by a hint', async () => {
        renderUi(
            <>
                <span id="rate-label">Sending rate</span>
                <span id="rate-hint">Emails per minute</span>
                <Knob aria-labelledby="rate-label" aria-describedby="rate-hint" />
            </>,
        );
        expect(dial()).toHaveAccessibleDescription('Emails per minute');
        await expectNoAxeViolations();
    });

    it('raises the value by one step with ArrowRight and ArrowUp', async () => {
        const { user } = renderUi(<Knob defaultValue={40} step={5} aria-label="Sending rate" />);
        dial().focus();
        await user.keyboard('{ArrowRight}');
        expect(dial()).toHaveAttribute('aria-valuenow', '45');
        await user.keyboard('{ArrowUp}');
        expect(dial()).toHaveAttribute('aria-valuenow', '50');
    });

    it('lowers the value by one step with ArrowLeft and ArrowDown', async () => {
        const { user } = renderUi(<Knob defaultValue={40} step={5} aria-label="Sending rate" />);
        dial().focus();
        await user.keyboard('{ArrowLeft}');
        expect(dial()).toHaveAttribute('aria-valuenow', '35');
        await user.keyboard('{ArrowDown}');
        expect(dial()).toHaveAttribute('aria-valuenow', '30');
    });

    it('moves ten steps with Shift and an arrow key', async () => {
        const { user } = renderUi(<Knob defaultValue={40} aria-label="Sending rate" />);
        dial().focus();
        await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
        expect(dial()).toHaveAttribute('aria-valuenow', '50');
        await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
        expect(dial()).toHaveAttribute('aria-valuenow', '40');
    });

    it('moves ten steps with Page Up and Page Down', async () => {
        const { user } = renderUi(<Knob defaultValue={40} aria-label="Sending rate" />);
        dial().focus();
        await user.keyboard('{PageUp}');
        expect(dial()).toHaveAttribute('aria-valuenow', '50');
        await user.keyboard('{PageDown}{PageDown}');
        expect(dial()).toHaveAttribute('aria-valuenow', '30');
    });

    it('sets the minimum and the maximum with Home and End', async () => {
        const { user } = renderUi(<Knob defaultValue={10} min={-50} max={50} aria-label="Sending rate" />);
        dial().focus();
        await user.keyboard('{End}');
        expect(dial()).toHaveAttribute('aria-valuenow', '50');
        await user.keyboard('{Home}');
        expect(dial()).toHaveAttribute('aria-valuenow', '-50');
        await user.keyboard('{ArrowLeft}');
        expect(dial()).toHaveAttribute('aria-valuenow', '-50');
    });

    it('keeps → as "more" in right-to-left pages, as the dial turns clockwise', async () => {
        const { user } = renderUi(<Knob defaultValue={40} aria-label="Sending rate" />, { dir: 'rtl' });
        dial().focus();
        await user.keyboard('{ArrowRight}');
        expect(dial()).toHaveAttribute('aria-valuenow', '41');
    });

    it('snaps to its step', async () => {
        const { user } = renderUi(<Knob defaultValue={50} step={10} aria-label="Sending rate" />);
        dial().focus();
        await user.keyboard('{ArrowRight}');
        expect(dial()).toHaveAttribute('aria-valuenow', '60');
        await user.keyboard('{PageUp}');
        expect(dial()).toHaveAttribute('aria-valuenow', '100');
    });

    it('shows and announces the text formatValue returns', async () => {
        renderUi(<Knob defaultValue={42} formatValue={(v) => `${v}%`} aria-label="Daily quota used" />);
        expect(dial('Daily quota used')).toHaveAttribute('aria-valuetext', '42%');
        expect(document.querySelector('[data-slot=knob-text]')).toHaveTextContent('42%');
        await expectNoAxeViolations();
    });

    it('formats the value in the provider locale', () => {
        renderUi(<Knob defaultValue={2500} max={5000} aria-label="Sending rate" />, { locale: 'de-DE' });
        expect(document.querySelector('[data-slot=knob-text]')).toHaveTextContent('2.500');
    });

    it('starts the value arc at zero when the range spans it, and draws none at zero', () => {
        const { rerender } = renderUi(<Knob value={0} min={-50} max={50} aria-label="Offset" />);
        expect(document.querySelector('[data-slot=knob-value]')).toBeNull();
        rerender(<Knob value={10} min={-50} max={50} aria-label="Offset" />);
        expect(document.querySelector('[data-slot=knob-value]').getAttribute('d')).toMatch(/^M 50 10 /);
    });

    it('is controlled by value and reports each change once it ends', async () => {
        const onValueCommit = vi.fn();
        function Controlled() {
            const [n, setN] = useState(0);
            return (
                <>
                    <Knob value={n} onValueChange={setN} onValueCommit={onValueCommit} aria-label="Queue workers" />
                    <button type="button" onClick={() => setN(n + 1)}>
                        Add
                    </button>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Add' }));
        expect(dial('Queue workers')).toHaveAttribute('aria-valuenow', '1');
        dial('Queue workers').focus();
        await user.keyboard('{End}');
        expect(dial('Queue workers')).toHaveAttribute('aria-valuenow', '100');
        expect(onValueCommit).toHaveBeenLastCalledWith(100);
    });

    it('keeps a read-only dial focusable and announced but fixed', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Knob readOnly value={50} onValueChange={onValueChange} aria-label="Disk usage" />);
        expect(dial('Disk usage')).toHaveAttribute('aria-readonly', 'true');
        await user.tab();
        expect(dial('Disk usage')).toHaveFocus();
        await user.keyboard('{ArrowRight}{End}');
        expect(dial('Disk usage')).toHaveAttribute('aria-valuenow', '50');
        expect(onValueChange).not.toHaveBeenCalled();
        await expectNoAxeViolations();
    });

    it('leaves the tab order and ignores keys while disabled', async () => {
        const { user } = renderUi(<Knob disabled defaultValue={50} aria-label="Sending rate" />);
        expect(dial()).toHaveAttribute('aria-disabled', 'true');
        expect(dial()).toHaveAttribute('tabindex', '-1');
        await user.tab();
        expect(document.body).toHaveFocus();
        dial().focus();
        await user.keyboard('{ArrowRight}');
        expect(dial()).toHaveAttribute('aria-valuenow', '50');
        await expectNoAxeViolations();
    });

    it('sets the value from a press on the dial', () => {
        renderUi(<Knob defaultValue={0} aria-label="Sending rate" />);
        const svg = dial();
        svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0 });
        // Straight up from the centre is the middle of the arc.
        fireEvent.pointerDown(svg, { button: 0, clientX: 50, clientY: 0, pointerId: 1 });
        expect(svg).toHaveAttribute('aria-valuenow', '50');
        expect(svg).toHaveFocus();
        // Straight right is 90° of the 150° from the top to the end.
        fireEvent.pointerDown(svg, { button: 0, clientX: 100, clientY: 50, pointerId: 1 });
        expect(svg).toHaveAttribute('aria-valuenow', '80');
    });

    it('submits its value under name and goes back to its first value when the form is reset', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <form aria-label="Throttle">
                <Knob name="rate" defaultValue={40} onValueChange={onValueChange} aria-label="Sending rate" />
                <button type="reset">Reset</button>
            </form>,
        );
        const form = screen.getByRole('form');
        expect(new FormData(form).get('rate')).toBe('40');
        dial().focus();
        await user.keyboard('{PageUp}');
        expect(new FormData(form).get('rate')).toBe('50');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        expect(dial()).toHaveAttribute('aria-valuenow', '40');
        expect(new FormData(form).get('rate')).toBe('40');
        expect(onValueChange).toHaveBeenLastCalledWith(40);
        await expectNoAxeViolations();
    });

    it('submits nothing while disabled, as a native input', () => {
        renderUi(
            <form aria-label="Throttle">
                <Knob name="rate" defaultValue={40} disabled aria-label="Sending rate" />
            </form>,
        );
        expect(new FormData(screen.getByRole('form')).get('rate')).toBeNull();
    });

    it('sets data-size from its prop or the provider', () => {
        const { unmount } = renderUi(<Knob size="lg" aria-label="Large" />);
        expect(document.querySelector('[data-slot=knob]')).toHaveAttribute('data-size', 'lg');
        unmount();
        renderUi(<Knob aria-label="Small" />, { controlSize: 'sm' });
        expect(document.querySelector('[data-slot=knob]')).toHaveAttribute('data-size', 'sm');
    });
});

describe('Knob and its form', () => {
    const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

    it('belongs to the form its form attribute names, and resets with it', async () => {
        renderUi(
            <>
                <form id="throttle" />
                <Knob name="rate" form="throttle" defaultValue={40} aria-label="Sending rate" />
            </>
        );
        const form = document.getElementById('throttle');
        fireEvent.keyDown(dial(), { key: 'PageUp' });
        expect(new FormData(form).get('rate')).toBe('50');
        act(() => form.reset());
        await settle();
        expect(new FormData(form).get('rate')).toBe('40');
    });

    it('keeps its value when the reset is cancelled', async () => {
        renderUi(
            <form aria-label="Throttle" onReset={(event) => event.preventDefault()}>
                <Knob name="rate" defaultValue={40} aria-label="Sending rate" />
            </form>
        );
        const form = screen.getByRole('form');
        fireEvent.keyDown(dial(), { key: 'PageUp' });
        act(() => form.reset());
        await settle();
        expect(new FormData(form).get('rate')).toBe('50');
    });

    it('leaves a controlled value to its parent on a reset', async () => {
        const onValueChange = vi.fn();
        renderUi(
            <form aria-label="Throttle">
                <Knob name="rate" value={70} onValueChange={onValueChange} aria-label="Sending rate" />
            </form>
        );
        act(() => screen.getByRole('form').reset());
        await settle();
        expect(onValueChange).not.toHaveBeenCalled();
        expect(dial()).toHaveAttribute('aria-valuenow', '70');
    });
});
