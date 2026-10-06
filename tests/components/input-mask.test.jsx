import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { InputMask } from '@/components/input-mask';
import { Label } from '@/components/label';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const PHONE = '(999) 999-9999';
const field = (name = 'Phone') => screen.getByRole('textbox', { name });

describe('InputMask', () => {
    it('fills the slots as digits are typed and types the fixed characters itself', async () => {
        const { user } = renderUi(
            <>
                <Label htmlFor="phone">Phone</Label>
                <InputMask id="phone" mask={PHONE} />
            </>,
        );
        await user.type(field(), '555');
        expect(field()).toHaveValue('(555) ___-____');
        await user.keyboard('1234567');
        expect(field()).toHaveValue('(555) 123-4567');
        await expectNoAxeViolations();
    });

    it('refuses a character that does not fit its slot', async () => {
        const { user } = renderUi(<InputMask aria-label="Phone" mask={PHONE} />);
        await user.type(field(), '5a5-b5');
        expect(field()).toHaveValue('(555) ___-____');
    });

    it('takes letters, digits or either in a mixed pattern', async () => {
        const { user } = renderUi(<InputMask aria-label="Key" mask="a*-999-a999" />);
        await user.type(field('Key'), '1');
        expect(field('Key')).toHaveValue('');
        await user.keyboard('b2345c678');
        expect(field('Key')).toHaveValue('b2-345-c678');
    });

    it('removes the character before the caret with Backspace and moves the rest back', async () => {
        const { user } = renderUi(<InputMask aria-label="Phone" mask={PHONE} />);
        await user.type(field(), '5551234567');
        await user.keyboard('{Backspace}');
        expect(field()).toHaveValue('(555) 123-456_');
        // The caret after the "3": Backspace removes the 3, and 4, 5 and 6 move back.
        field().setSelectionRange(9, 9);
        await user.keyboard('{Backspace}');
        expect(field()).toHaveValue('(555) 124-56__');
        expect(field().selectionStart).toBe(8);
    });

    it('removes the character after the caret with Delete and moves the rest back', async () => {
        const { user } = renderUi(<InputMask aria-label="Phone" mask={PHONE} />);
        await user.type(field(), '5551234567');
        field().setSelectionRange(1, 1);
        await user.keyboard('{Delete}');
        expect(field()).toHaveValue('(551) 234-567_');
        expect(field().selectionStart).toBe(1);
    });

    it('replaces a selection with what is typed', async () => {
        const { user } = renderUi(<InputMask aria-label="Phone" mask={PHONE} />);
        await user.type(field(), '5551234567');
        field().setSelectionRange(6, 9);
        await user.keyboard('9');
        expect(field()).toHaveValue('(555) 945-67__');
    });

    it('reads pasted text as if it were typed', async () => {
        const { user } = renderUi(<InputMask aria-label="Phone" mask={PHONE} />);
        await user.click(field());
        await user.paste('555-123-4567');
        expect(field()).toHaveValue('(555) 123-4567');
    });

    it('empties an unfinished value when it loses focus, unless autoClear is off', async () => {
        const { user } = renderUi(
            <>
                <InputMask aria-label="Cleared" mask={PHONE} />
                <InputMask aria-label="Kept" mask={PHONE} autoClear={false} />
            </>,
        );
        await user.type(field('Cleared'), '555');
        await user.tab();
        expect(field('Cleared')).toHaveValue('');
        await user.type(field('Kept'), '555');
        await user.tab();
        expect(field('Kept')).toHaveValue('(555) ___-____');
    });

    it('is complete without its optional part, and drops the empty optional slots on blur', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<InputMask aria-label="Phone" mask="(999) 999-9999? x99999" onValueChange={onValueChange} />);
        await user.type(field(), '5551234567');
        expect(field()).toHaveValue('(555) 123-4567 x_____');
        expect(onValueChange).toHaveBeenLastCalledWith('(555) 123-4567 x_____', { complete: true });
        await user.tab();
        expect(field()).toHaveValue('(555) 123-4567');
        await user.click(field());
        field().setSelectionRange(14, 14);
        await user.keyboard('12');
        expect(field()).toHaveValue('(555) 123-4567 x12___');
    });

    it('shows slotChar in the empty slots, one character per position', async () => {
        const { user } = renderUi(<InputMask aria-label="Date" mask="99/99/9999" slotChar="mm/dd/yyyy" />);
        await user.type(field('Date'), '10');
        expect(field('Date')).toHaveValue('10/dd/yyyy');
    });

    it('reports the typed characters only with unmask, and the shown text to onChange', async () => {
        const onValueChange = vi.fn();
        const onChange = vi.fn();
        const { user } = renderUi(
            <InputMask aria-label="Phone" mask={PHONE} unmask onValueChange={onValueChange} onChange={onChange} />,
        );
        await user.type(field(), '555123');
        expect(onValueChange).toHaveBeenLastCalledWith('555123', { complete: false });
        expect(onChange.mock.lastCall[0].target.value).toBe('(555) 123-____');
    });

    it('is controlled with value and onValueChange, and takes a value set from outside', async () => {
        function Controlled() {
            const [value, setValue] = useState('5551234567');
            return (
                <>
                    <InputMask aria-label="Phone" mask={PHONE} unmask value={value} onValueChange={setValue} />
                    <button type="button" onClick={() => setValue('2025550199')}>Reset</button>
                    <output>{value}</output>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(field()).toHaveValue('(555) 123-4567');
        await user.click(field());
        field().setSelectionRange(14, 14);
        await user.keyboard('{Backspace}');
        expect(screen.getByText('555123456')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        expect(field()).toHaveValue('(202) 555-0199');
    });

    it('opens the number pad when every slot takes a digit', () => {
        renderUi(
            <>
                <InputMask aria-label="Phone" mask={PHONE} />
                <InputMask aria-label="Key" mask="a*-999" />
            </>,
        );
        expect(field()).toHaveAttribute('inputmode', 'numeric');
        expect(field('Key')).not.toHaveAttribute('inputmode');
    });

    it('clears with the clear button', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <InputMask aria-label="Phone" mask={PHONE} clearable defaultValue="5551234567" onValueChange={onValueChange} />,
        );
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(field()).toHaveValue('');
        expect(onValueChange).toHaveBeenLastCalledWith('', { complete: false });
        await user.keyboard('2');
        expect(field()).toHaveValue('(2__) ___-____');
    });

    it('redraws its value when the pattern or the slot character changes', () => {
        const ui = (mask, slotChar) => <InputMask aria-label="Code" mask={mask} slotChar={slotChar} defaultValue="1234" />;
        const { rerender } = renderUi(ui('999-999', '_'));
        expect(field('Code')).toHaveValue('123-4__');
        rerender(ui('99/99/99', '_'));
        expect(field('Code')).toHaveValue('12/34/__');
        rerender(ui('99/99/99', '#'));
        expect(field('Code')).toHaveValue('12/34/##');
        rerender(ui('aa-99', '#'));
        expect(field('Code')).toHaveValue('');
    });

    it('goes back to its default value when its form is reset, and submits what it shows', async () => {
        const { user, container } = renderUi(
            <form>
                <InputMask aria-label="Phone" name="phone" mask={PHONE} defaultValue="5551234567" />
                <button type="reset">Reset</button>
            </form>,
        );
        const form = container.querySelector('form');
        expect(new FormData(form).get('phone')).toBe('(555) 123-4567');
        await user.click(field());
        await user.keyboard('{End}{Backspace}{Backspace}');
        expect(field()).toHaveValue('(555) 123-45__');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        await waitFor(() => expect(field()).toHaveValue('(555) 123-4567'));
        expect(new FormData(form).get('phone')).toBe('(555) 123-4567');
        await user.click(field());
        await user.keyboard('{End}{Backspace}');
        expect(field()).toHaveValue('(555) 123-456_');
    });

    it('cannot be changed when disabled, and keeps its size, look and invalid state', async () => {
        const { user } = renderUi(
            <>
                <InputMask aria-label="Disabled" mask={PHONE} disabled defaultValue="5551234567" />
                <InputMask aria-label="Invalid" mask={PHONE} aria-invalid size="sm" variant="filled" />
            </>,
        );
        await user.type(field('Disabled'), '1');
        expect(field('Disabled')).toHaveValue('(555) 123-4567');
        expect(field('Invalid')).toBeInvalid();
        expect(field('Invalid')).toHaveAttribute('data-size', 'sm');
        expect(field('Invalid')).toHaveAttribute('data-variant', 'filled');
        expect(field('Invalid')).toHaveAttribute('data-slot', 'input-mask');
        await expectNoAxeViolations();
    });
});
