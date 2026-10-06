import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { InputNumber } from '@/components/input-number';
import { Label } from '@/components/label';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const field = (name = 'Seats') => screen.getByRole('textbox', { name });

describe('InputNumber', () => {
    it('shows the number in the provider locale, and a field locale over it', async () => {
        renderUi(
            <>
                <InputNumber aria-label="German" defaultValue={1234.5} />
                <InputNumber aria-label="Indian" defaultValue={732762} locale="en-IN" />
            </>,
            { locale: 'de-DE' },
        );
        expect(field('German')).toHaveValue('1.234,5');
        expect(field('Indian')).toHaveValue('7,32,762');
        await expectNoAxeViolations();
    });

    it('is named by its label and described as a number field by the provider string', () => {
        renderUi(
            <>
                <Label htmlFor="seats">Seats</Label>
                <InputNumber id="seats" defaultValue={3} />
            </>,
            { strings: { numberFieldRole: 'Zahlenfeld' } },
        );
        expect(field()).toHaveAttribute('aria-roledescription', 'Zahlenfeld');
    });

    it('adds step with ArrowUp and takes it away with ArrowDown', async () => {
        const { user } = renderUi(<InputNumber aria-label="Seats" defaultValue={10} step={5} />);
        await user.click(field());
        await user.keyboard('{ArrowUp}');
        expect(field()).toHaveValue('15');
        await user.keyboard('{ArrowDown}{ArrowDown}');
        expect(field()).toHaveValue('5');
    });

    it('steps by largeStep with Shift and an arrow', async () => {
        const { user } = renderUi(<InputNumber aria-label="Seats" defaultValue={10} largeStep={100} />);
        await user.click(field());
        await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
        expect(field()).toHaveValue('110');
    });

    it('steps by smallStep with Alt and an arrow', async () => {
        const { user } = renderUi(
            <InputNumber aria-label="Ratio" defaultValue={1} smallStep={0.25} format={{ maximumFractionDigits: 2 }} />,
        );
        await user.click(field('Ratio'));
        await user.keyboard('{Alt>}{ArrowUp}{/Alt}');
        expect(field('Ratio')).toHaveValue('1.25');
        await user.keyboard('{Alt>}{ArrowDown}{ArrowDown}{/Alt}');
        expect(field('Ratio')).toHaveValue('0.75');
    });

    it('steps by largeStep with Page Up and Page Down', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <InputNumber aria-label="Seats" defaultValue={30} largeStep={60} onValueChange={onValueChange} />,
        );
        await user.click(field());
        await user.keyboard('{PageUp}');
        expect(field()).toHaveValue('90');
        expect(onValueChange).toHaveBeenLastCalledWith(90, expect.objectContaining({ reason: 'keyboard' }));
        await user.keyboard('{PageDown}{PageDown}');
        expect(field()).toHaveValue('-30');
    });

    it('stops Page Up and Page Down at max and min', async () => {
        const { user } = renderUi(<InputNumber aria-label="Seats" defaultValue={95} min={0} max={100} />);
        await user.click(field());
        await user.keyboard('{PageUp}');
        expect(field()).toHaveValue('100');
        await user.keyboard('{PageDown}{PageDown}{PageDown}{PageDown}{PageDown}{PageDown}{PageDown}{PageDown}{PageDown}{PageDown}{PageDown}');
        expect(field()).toHaveValue('0');
    });

    it('goes to min with Home and to max with End', async () => {
        const { user } = renderUi(<InputNumber aria-label="Seats" defaultValue={25} min={1} max={50} />);
        await user.click(field());
        await user.keyboard('{Home}');
        expect(field()).toHaveValue('1');
        await user.keyboard('{End}');
        expect(field()).toHaveValue('50');
    });

    it('stops the arrows at max and turns the increment button off there', async () => {
        const { user } = renderUi(<InputNumber aria-label="Seats" defaultValue={99} max={100} buttons="stacked" />);
        await user.click(field());
        await user.keyboard('{ArrowUp}{ArrowUp}');
        expect(field()).toHaveValue('100');
        expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Decrease' })).toBeEnabled();
        await expectNoAxeViolations();
    });

    it('types digits and refuses letters', async () => {
        const { user } = renderUi(<InputNumber aria-label="Seats" />);
        await user.type(field(), '4a2');
        expect(field()).toHaveValue('42');
    });

    it('changes the value with the stepper buttons, named by the provider strings', async () => {
        const { user } = renderUi(<InputNumber aria-label="Seats" defaultValue={3} buttons="horizontal" />, {
            strings: { increment: 'Erhöhen', decrement: 'Verringern' },
        });
        await user.click(screen.getByRole('button', { name: 'Erhöhen' }));
        expect(field()).toHaveValue('4');
        await user.click(screen.getByRole('button', { name: 'Verringern' }));
        await user.click(screen.getByRole('button', { name: 'Verringern' }));
        expect(field()).toHaveValue('2');
        await expectNoAxeViolations();
    });

    it('keeps the stepper buttons out of the tab order', async () => {
        const { user } = renderUi(
            <>
                <InputNumber aria-label="Seats" defaultValue={3} buttons="vertical" />
                <button type="button">After</button>
            </>,
        );
        await user.tab();
        expect(field()).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('formats currency and reads the typed value back', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <InputNumber aria-label="Price" format={{ style: 'currency', currency: 'EUR' }} onValueChange={onValueChange} />,
            { locale: 'de-DE' },
        );
        await user.type(screen.getByRole('textbox', { name: 'Price' }), '12,5');
        await user.tab();
        expect(screen.getByRole('textbox', { name: 'Price' })).toHaveValue('12,50\u00a0€');
        expect(onValueChange).toHaveBeenLastCalledWith(12.5, expect.anything());
    });

    it('is controlled with value and onValueChange', async () => {
        function Controlled() {
            const [value, setValue] = useState(5);
            return (
                <>
                    <InputNumber aria-label="Seats" value={value} onValueChange={setValue} buttons="stacked" />
                    <output>{String(value)}</output>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Increase' }));
        expect(screen.getByText('6')).toBeInTheDocument();
        expect(field()).toHaveValue('6');
    });

    it('reads its prefix and suffix as its description', async () => {
        renderUi(<InputNumber aria-label="Rate" defaultValue={120} prefix="About" suffix="emails an hour" aria-describedby="rate-hint" />);
        const input = screen.getByRole('textbox', { name: 'Rate' });
        expect(input.getAttribute('aria-describedby').split(' ')).toHaveLength(3);
        expect(input).toHaveAccessibleDescription(expect.stringContaining('About'));
        expect(input).toHaveAccessibleDescription(expect.stringContaining('emails an hour'));
        await expectNoAxeViolations();
    });

    it('cannot be changed when disabled or read-only', async () => {
        const { user } = renderUi(
            <>
                <InputNumber aria-label="Disabled" defaultValue={1} disabled buttons="stacked" />
                <InputNumber aria-label="Read-only" defaultValue={2} readOnly />
            </>,
        );
        expect(field('Disabled')).toBeDisabled();
        for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled();
        await user.click(field('Read-only'));
        await user.keyboard('{ArrowUp}5');
        expect(field('Read-only')).toHaveValue('2');
        await expectNoAxeViolations();
    });

    it('announces an invalid value with its message', async () => {
        renderUi(
            <>
                <InputNumber aria-label="Amount" aria-invalid aria-describedby="amount-error" />
                <p id="amount-error">Enter an amount.</p>
            </>,
        );
        expect(field('Amount')).toBeInvalid();
        expect(field('Amount')).toHaveAccessibleDescription('Enter an amount.');
        await expectNoAxeViolations();
    });

    it('sets its size, look and buttons as attributes, the provider ones when it has none', () => {
        const { container } = renderUi(
            <>
                <InputNumber aria-label="Small" size="sm" buttons="stacked" />
                <InputNumber aria-label="Inherited" fluid />
            </>,
            { controlSize: 'lg', fieldVariant: 'filled' },
        );
        const [small, inherited] = container.querySelectorAll('[data-slot=input-number]');
        expect(small).toHaveAttribute('data-size', 'sm');
        expect(small).toHaveAttribute('data-buttons', 'stacked');
        expect(inherited).toHaveAttribute('data-size', 'lg');
        expect(inherited).toHaveAttribute('data-variant', 'filled');
        expect(inherited.className).toContain('w-full');
        expect(field('Small')).toHaveAttribute('data-size', 'sm');
    });

    it('goes back to its default value when its form is reset', async () => {
        const { user, container } = renderUi(
            <form>
                <InputNumber aria-label="Seats" name="seats" defaultValue={12} />
                <button type="reset">Reset</button>
            </form>,
        );
        await user.click(screen.getByRole('textbox', { name: 'Seats' }));
        await user.keyboard('{ArrowUp}{ArrowUp}');
        expect(screen.getByRole('textbox', { name: 'Seats' })).toHaveValue('14');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        await waitFor(() => expect(screen.getByRole('textbox', { name: 'Seats' })).toHaveValue('12'));
        expect(new FormData(container.querySelector('form')).get('seats')).toBe('12');
        await user.click(screen.getByRole('textbox', { name: 'Seats' }));
        await user.keyboard('{ArrowUp}');
        expect(screen.getByRole('textbox', { name: 'Seats' })).toHaveValue('13');
    });

    it('lets a form holding a number between whole steps submit, with min set', () => {
        const { container } = renderUi(
            <form>
                <InputNumber aria-label="Price" name="price" min={0} defaultValue={12.99} />
                <InputNumber aria-label="Minutes" name="minutes" min={0} step={15} defaultValue={20} />
            </form>,
        );
        const form = container.querySelector('form');
        expect(form.elements.namedItem('price').validity.stepMismatch).toBe(false);
        // A step of its own keeps the browser's step check, as a native number input does.
        expect(form.elements.namedItem('minutes').validity.stepMismatch).toBe(true);
    });

    it('submits its number with its form under its name', () => {
        const { container } = renderUi(
            <form>
                <InputNumber aria-label="Seats" name="seats" defaultValue={12} />
            </form>,
        );
        expect(new FormData(container.querySelector('form')).get('seats')).toBe('12');
    });
});
