import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Slider } from '@/components/slider';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const handle = (name) => screen.getByRole('slider', name ? { name } : undefined);

describe('Slider', () => {
    it('renders one named handle with its value and bounds', async () => {
        renderUi(<Slider defaultValue={[40]} aria-label="Sending rate" />);
        const thumb = handle('Sending rate');
        expect(thumb).toHaveAttribute('aria-valuenow', '40');
        expect(thumb).toHaveAttribute('aria-valuemin', '0');
        expect(thumb).toHaveAttribute('aria-valuemax', '100');
        expect(thumb).toHaveAttribute('aria-orientation', 'horizontal');
        expect(screen.getAllByRole('slider')).toHaveLength(1);
        await expectNoAxeViolations();
    });

    it('renders a single handle when no value is given', () => {
        renderUi(<Slider aria-label="Rate" />);
        expect(screen.getAllByRole('slider')).toHaveLength(1);
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '50');
    });

    it.each([[0, 1, 1], [100, 200, 100], [-100, -10, -10]])('keeps an implicit value inside %s–%s', (min, max, expected) => {
        renderUi(<Slider min={min} max={max} aria-label="Rate" />);
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', String(expected));
    });

    it('preserves explicit controlled and uncontrolled values', () => {
        renderUi(<><Slider min={0} max={1} defaultValue={[0.25]} aria-label="Default" /><Slider min={0} max={1} value={[0.75]} aria-label="Controlled" /></>);
        expect(handle('Default')).toHaveAttribute('aria-valuenow', '0.25');
        expect(handle('Controlled')).toHaveAttribute('aria-valuenow', '0.75');
    });

    it('is named by a visible label through aria-labelledby, with a description', async () => {
        renderUi(
            <>
                <span id="rate-label">Sending rate</span>
                <span id="rate-hint">Emails per minute</span>
                <Slider defaultValue={[10]} aria-labelledby="rate-label" aria-describedby="rate-hint" />
            </>
        );
        expect(handle('Sending rate')).toHaveAccessibleDescription('Emails per minute');
        await expectNoAxeViolations();
    });

    it('increases by one step with ArrowRight and ArrowUp', async () => {
        const { user } = renderUi(<Slider defaultValue={[40]} step={5} aria-label="Rate" />);
        handle('Rate').focus();
        await user.keyboard('{ArrowRight}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '45');
        await user.keyboard('{ArrowUp}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '50');
    });

    it('decreases by one step with ArrowLeft and ArrowDown', async () => {
        const { user } = renderUi(<Slider defaultValue={[40]} step={5} aria-label="Rate" />);
        handle('Rate').focus();
        await user.keyboard('{ArrowLeft}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '35');
        await user.keyboard('{ArrowDown}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '30');
    });

    it('moves ten steps with Shift and an arrow key', async () => {
        const { user } = renderUi(<Slider defaultValue={[40]} aria-label="Rate" />);
        handle('Rate').focus();
        await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '50');
        await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '40');
    });

    it('moves ten steps with Page Up and Page Down', async () => {
        const { user } = renderUi(<Slider defaultValue={[40]} aria-label="Rate" />);
        handle('Rate').focus();
        await user.keyboard('{PageUp}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '50');
        await user.keyboard('{PageDown}{PageDown}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '30');
    });

    it('sets the minimum and maximum with Home and End', async () => {
        const { user } = renderUi(<Slider defaultValue={[40]} min={10} max={90} aria-label="Rate" />);
        handle('Rate').focus();
        await user.keyboard('{End}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '90');
        await user.keyboard('{Home}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '10');
    });

    it('moves with Tab from handle to handle', async () => {
        const { user } = renderUi(<Slider defaultValue={[20, 80]} aria-label="Quiet hours" />);
        await user.tab();
        expect(handle('Quiet hours Minimum')).toHaveFocus();
        await user.tab();
        expect(handle('Quiet hours Maximum')).toHaveFocus();
    });

    it('mirrors the arrow keys in right-to-left pages', async () => {
        const { user } = renderUi(<Slider defaultValue={[40]} aria-label="Rate" />, { dir: 'rtl' });
        handle('Rate').focus();
        await user.keyboard('{ArrowRight}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '39');
        await user.keyboard('{ArrowLeft}{ArrowLeft}');
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '41');
    });

    it('names a range’s handles Minimum and Maximum from the provider strings', async () => {
        renderUi(<Slider defaultValue={[20, 80]} aria-label="Quiet hours" />, {
            strings: { sliderMinimum: 'Début', sliderMaximum: 'Fin' },
        });
        expect(handle('Quiet hours Début')).toHaveAttribute('aria-valuenow', '20');
        expect(handle('Quiet hours Fin')).toHaveAttribute('aria-valuenow', '80');
        await expectNoAxeViolations();
    });

    it('joins a range’s handle names to its visible label', () => {
        renderUi(
            <>
                <span id="window">Quiet hours</span>
                <Slider defaultValue={[20, 80]} aria-labelledby="window" />
            </>
        );
        expect(handle('Quiet hours Minimum')).toBeInTheDocument();
        expect(handle('Quiet hours Maximum')).toBeInTheDocument();
    });

    it('names three or more handles with the value string', () => {
        renderUi(<Slider defaultValue={[10, 50, 90]} />, { strings: { sliderValue: 'Point {index} sur {count}' } });
        expect(handle('Point 1 sur 3')).toHaveAttribute('aria-valuenow', '10');
        expect(handle('Point 3 sur 3')).toHaveAttribute('aria-valuenow', '90');
    });

    it('keeps a range’s handles in order', async () => {
        const { user } = renderUi(<Slider defaultValue={[40, 50]} step={10} aria-label="Window" />);
        handle('Window Minimum').focus();
        await user.keyboard('{ArrowRight}{ArrowRight}');
        // Pushed past the other handle, the values swap and focus follows the moving value.
        expect(handle('Window Minimum')).toHaveAttribute('aria-valuenow', '50');
        expect(handle('Window Maximum')).toHaveAttribute('aria-valuenow', '60');
        expect(handle('Window Maximum')).toHaveFocus();
    });

    it('follows a controlled value and reports changes and commits', async () => {
        const onChange = vi.fn();
        const onCommit = vi.fn();
        function Controlled() {
            const [value, setValue] = useState([30]);
            return (
                <Slider
                    value={value}
                    onValueChange={(next) => {
                        onChange(next);
                        setValue(next);
                    }}
                    onValueCommit={onCommit}
                    aria-label="Limit"
                />
            );
        }
        const { user } = renderUi(<Controlled />);
        handle('Limit').focus();
        await user.keyboard('{ArrowRight}');
        expect(onChange).toHaveBeenCalledWith([31]);
        expect(onCommit).toHaveBeenCalledWith([31]);
        expect(handle('Limit')).toHaveAttribute('aria-valuenow', '31');
    });

    it('is vertical with orientation', () => {
        renderUi(<Slider orientation="vertical" defaultValue={[30]} aria-label="Volume" />);
        expect(handle('Volume')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('ignores the keyboard and leaves the tab order while disabled', async () => {
        const { user } = renderUi(<Slider defaultValue={[40]} disabled aria-label="Rate" />);
        const thumb = handle('Rate');
        expect(thumb).toHaveAttribute('data-disabled');
        expect(thumb).not.toHaveAttribute('tabindex');
        expect(document.querySelector('[data-slot="slider"]')).toHaveAttribute('data-disabled');
        await user.tab();
        expect(thumb).not.toHaveFocus();
        await expectNoAxeViolations();
    });

    it('sets the size as data-size, from the prop or the provider', () => {
        const { unmount } = renderUi(<Slider size="lg" defaultValue={[5]} aria-label="Large" />);
        expect(document.querySelector('[data-slot="slider"]')).toHaveAttribute('data-size', 'lg');
        unmount();
        renderUi(<Slider defaultValue={[5]} aria-label="From provider" />, { controlSize: 'sm' });
        expect(document.querySelector('[data-slot="slider"]')).toHaveAttribute('data-size', 'sm');
    });

    it('goes back to its first value when the form is reset', async () => {
        const { user } = renderUi(
            <form aria-label="Settings">
                <Slider name="rate" defaultValue={[25]} aria-label="Rate" />
                <button type="reset">Reset</button>
            </form>
        );
        handle('Rate').focus();
        await user.keyboard('{End}');
        expect(new FormData(screen.getByRole('form')).get('rate')).toBe('100');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        expect(handle('Rate')).toHaveAttribute('aria-valuenow', '25');
        expect(new FormData(screen.getByRole('form')).get('rate')).toBe('25');
    });

    it('submits its value in a form with name', () => {
        renderUi(
            <form aria-label="Settings">
                <Slider name="rate" defaultValue={[25]} aria-label="Rate" />
            </form>
        );
        expect(new FormData(screen.getByRole('form')).get('rate')).toBe('25');
    });
});

describe('Slider in a form', () => {
    it('submits nothing while disabled, as a disabled input does', () => {
        const { container } = renderUi(
            <form>
                <Slider name="rate" defaultValue={[25]} aria-label="Rate" disabled />
            </form>
        );
        expect(new FormData(container.querySelector('form')).has('rate')).toBe(false);
    });
});


it('keeps a minimum step distance between range handles', async () => {
    const { user } = renderUi(<Slider defaultValue={[30, 50]} step={5} minStepsBetweenThumbs={2} aria-label="Window" />);
    await user.tab();
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(handle('Window Minimum')).toHaveAttribute('aria-valuenow', '40');
    expect(handle('Window Maximum')).toHaveAttribute('aria-valuenow', '50');
    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(handle('Window Maximum')).toHaveAttribute('aria-valuenow', '50');
});
