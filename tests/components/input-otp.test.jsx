import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Button } from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/dialog';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/input-otp';
import { Label } from '@/components/label';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Example({ length = 6, split = false, label = true, ...props }) {
    const slots = (from, to) => Array.from({ length: to - from }, (_, i) => <InputOTPSlot key={from + i} index={from + i} />);
    return (
        <div>
            {label && <Label htmlFor="code">Verification code</Label>}
            <InputOTP id="code" maxLength={length} {...props}>
                {split ? (
                    <>
                        <InputOTPGroup>{slots(0, 3)}</InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>{slots(3, 6)}</InputOTPGroup>
                    </>
                ) : (
                    <InputOTPGroup>{slots(0, length)}</InputOTPGroup>
                )}
            </InputOTP>
        </div>
    );
}

const boxes = () => screen.getAllByRole('textbox');
const values = () => boxes().map((box) => box.value).join('');

describe('InputOTP', () => {
    it('renders one named box per character in a group named by the label', async () => {
        renderUi(<Example />);
        expect(screen.getByRole('group', { name: 'Verification code' })).toHaveAttribute('data-slot', 'input-otp');
        expect(boxes()).toHaveLength(6);
        expect(boxes()[0]).toHaveAccessibleName('Verification code');
        expect(boxes()[1]).toHaveAccessibleName('Character 2 of 6');
        expect(boxes()[5]).toHaveAccessibleName('Character 6 of 6');
        await expectNoAxeViolations();
    });

    it('moves to the next box as each character is typed', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Example onValueChange={onValueChange} />);
        await user.click(boxes()[0]);
        await user.keyboard('482');
        expect(values()).toBe('482');
        expect(boxes()[3]).toHaveFocus();
        expect(onValueChange).toHaveBeenLastCalledWith('482', expect.anything());
    });

    it('deletes the previous character with Backspace and moves back', async () => {
        const { user } = renderUi(<Example />);
        await user.click(boxes()[0]);
        await user.keyboard('482');
        await user.keyboard('{Backspace}');
        expect(values()).toBe('48');
        expect(boxes()[2]).toHaveFocus();
        await user.keyboard('{Backspace}');
        expect(values()).toBe('4');
        expect(boxes()[1]).toHaveFocus();
    });

    it('removes the focused character with Delete, moving the rest back', async () => {
        const { user } = renderUi(<Example defaultValue="4821" />);
        boxes()[1].focus();
        await user.keyboard('{Delete}');
        expect(values()).toBe('421');
        expect(boxes()[1]).toHaveFocus();
    });

    it('fills every box from a pasted code', async () => {
        const onValueComplete = vi.fn();
        const { user } = renderUi(<Example onValueComplete={onValueComplete} />);
        await user.click(boxes()[0]);
        await user.paste('739 104');
        expect(values()).toBe('739104');
        expect(boxes()[5]).toHaveFocus();
        expect(onValueComplete).toHaveBeenCalledWith('739104', expect.anything());
    });

    it('moves between boxes with ArrowLeft and ArrowRight, and to the ends with Home and End', async () => {
        const { user } = renderUi(<Example defaultValue="4821" />);
        await user.click(boxes()[0]);
        boxes()[1].focus();
        await user.keyboard('{ArrowRight}');
        expect(boxes()[2]).toHaveFocus();
        await user.keyboard('{ArrowLeft}{ArrowLeft}');
        expect(boxes()[0]).toHaveFocus();
        await user.keyboard('{End}');
        expect(boxes()[4]).toHaveFocus();
        await user.keyboard('{Home}');
        expect(boxes()[0]).toHaveFocus();
    });

    it('swaps ArrowLeft and ArrowRight in a right-to-left page', async () => {
        const { user } = renderUi(<Example defaultValue="4821" />, { dir: 'rtl' });
        boxes()[1].focus();
        await user.keyboard('{ArrowLeft}');
        expect(boxes()[2]).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(boxes()[1]).toHaveFocus();
    });

    it('is one tab stop', async () => {
        const { user } = renderUi(
            <>
                <Example defaultValue="48" />
                <button type="button">Verify</button>
            </>,
        );
        await user.tab();
        expect(boxes()[2]).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Verify' })).toHaveFocus();
    });

    it('takes digits only when requested, with the number pad and the one-time-code autofill hint', async () => {
        const { user } = renderUi(<Example validationType="numeric" />);
        await user.click(boxes()[0]);
        await user.keyboard('a7b2');
        expect(values()).toBe('72');
        for (const box of boxes()) expect(box).toHaveAttribute('inputmode', 'numeric');
        expect(boxes()[0]).toHaveAttribute('autocomplete', 'one-time-code');
    });

    it('takes letters and digits with validationType="alphanumeric", on the full keyboard', async () => {
        const { user } = renderUi(<Example validationType="alphanumeric" />);
        await user.click(boxes()[0]);
        await user.keyboard('a-7B');
        expect(values()).toBe('a7B');
        expect(boxes()[0]).toHaveAttribute('inputmode', 'text');
        await expectNoAxeViolations();
    });

    it('hides the characters with mask', () => {
        renderUi(<Example mask defaultValue="4821" />);
        const inputs = document.querySelectorAll('[data-slot="input-otp-slot"]');
        expect(inputs).toHaveLength(6);
        for (const input of inputs) expect(input).toHaveAttribute('type', 'password');
    });

    it('works as a controlled field', async () => {
        function Controlled() {
            const [value, setValue] = useState('12');
            return (
                <>
                    <Example value={value} onValueChange={setValue} />
                    <output>{value || 'empty'}</output>
                    <button type="button" onClick={() => setValue('')}>Reset</button>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(values()).toBe('12');
        await user.click(boxes()[2]);
        await user.keyboard('3');
        expect(screen.getByRole('status')).toHaveTextContent('123');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        expect(values()).toBe('');
    });

    it('disables every box', async () => {
        const { user } = renderUi(<Example disabled />);
        for (const box of boxes()) expect(box).toBeDisabled();
        await user.click(boxes()[0]);
        await user.keyboard('4');
        expect(values()).toBe('');
        await expectNoAxeViolations();
    });

    it('marks every box invalid with aria-invalid', async () => {
        renderUi(<Example aria-invalid aria-describedby="code-error" />);
        for (const box of boxes()) expect(box).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('group')).not.toHaveAttribute('aria-invalid');
        await expectNoAxeViolations();
    });

    it('sets the size and the filled look on every box, from the prop or the provider', () => {
        const { unmount } = renderUi(<Example size="lg" variant="filled" />);
        for (const box of boxes()) {
            expect(box).toHaveAttribute('data-size', 'lg');
            expect(box).toHaveAttribute('data-variant', 'filled');
        }
        unmount();
        renderUi(<Example />, { controlSize: 'sm', fieldVariant: 'filled' });
        expect(boxes()[0]).toHaveAttribute('data-size', 'sm');
        expect(boxes()[0]).toHaveAttribute('data-variant', 'filled');
        expect(screen.getByRole('group')).toHaveAttribute('data-size', 'sm');
    });

    it('splits the boxes with a separator', async () => {
        renderUi(<Example split />);
        expect(screen.getByRole('separator')).toHaveAttribute('data-slot', 'input-otp-separator');
        expect(boxes()).toHaveLength(6);
        await expectNoAxeViolations();
    });

    it('names the boxes from the provider, and from aria-label when there is no label', () => {
        renderUi(<Example label={false} aria-label="Code de vérification" />, { strings: { otpCharacter: 'Caractère {index} sur {count}' } });
        expect(screen.getByRole('group', { name: 'Code de vérification' })).toBeInTheDocument();
        expect(boxes()[0]).toHaveAccessibleName('Code de vérification');
        expect(boxes()[1]).toHaveAccessibleName('Caractère 2 sur 6');
    });

    it('submits its code under its name and goes back to its default when its form is reset', async () => {
        const { user, container } = renderUi(
            <form>
                <Example length={4} name="code" defaultValue="12" />
                <button type="reset">Reset</button>
            </form>,
        );
        const form = container.querySelector('form');
        expect(new FormData(form).get('code')).toBe('12');
        await user.click(boxes()[2]);
        await user.keyboard('34');
        expect(new FormData(form).get('code')).toBe('1234');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        await waitFor(() => expect(values()).toBe('12'));
        expect(new FormData(form).get('code')).toBe('12');
    });

    it('takes typing inside a Dialog', async () => {
        const { user } = renderUi(
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Verify email</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Verify your email</DialogTitle>
                    <DialogDescription>Enter the code we sent.</DialogDescription>
                    <Example />
                </DialogContent>
            </Dialog>,
        );
        await user.click(screen.getByRole('button', { name: 'Verify email' }));
        await user.click(boxes()[0]);
        await user.keyboard('5521');
        expect(values()).toBe('5521');
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});


it('accepts general characters by default, including letters and punctuation', async () => {
    const { user } = renderUi(<Example />);
    await user.click(boxes()[0]);
    await user.keyboard('a7-!');
    expect(values()).toBe('a7-!');
    expect(boxes()[0]).not.toHaveAttribute('inputmode', 'numeric');
    expect(boxes()[0]).toHaveAttribute('autocomplete', 'one-time-code');
});
