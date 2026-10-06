import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Label } from '@/components/label';
import { Textarea } from '@/components/textarea';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Textarea', () => {
    it('is named by its label and takes typing, including new lines', async () => {
        const { user } = renderUi(
            <>
                <Label htmlFor="signature">Email signature</Label>
                <Textarea id="signature" />
            </>,
        );
        const box = screen.getByRole('textbox', { name: 'Email signature' });
        await user.type(box, 'Best regards{Enter}Acme');
        expect(box).toHaveValue('Best regards\nAcme');
        await expectNoAxeViolations();
    });

    it('moves focus on with Tab instead of typing a tab', async () => {
        const { user } = renderUi(
            <>
                <Textarea aria-label="Note" />
                <button type="button">Save</button>
            </>,
        );
        await user.tab();
        expect(screen.getByRole('textbox', { name: 'Note' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
        expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('shows a controlled value and reports changes', async () => {
        const seen = [];
        const { user } = renderUi(<Textarea aria-label="Note" value="fixed" onChange={(e) => seen.push(e.target.value)} />);
        await user.type(screen.getByRole('textbox'), 'x');
        expect(screen.getByRole('textbox')).toHaveValue('fixed');
        expect(seen).toEqual(['fixedx']);
    });

    it('cannot be edited or focused when disabled', async () => {
        const { user } = renderUi(<Textarea aria-label="Reason" disabled defaultValue="a" />);
        const box = screen.getByRole('textbox');
        await user.type(box, 'x');
        expect(box).toHaveValue('a');
        expect(box).toBeDisabled();
        await user.tab();
        expect(box).not.toHaveFocus();
        await expectNoAxeViolations();
    });

    it('announces an invalid textarea with its message', async () => {
        renderUi(
            <>
                <Textarea aria-label="Note" aria-invalid aria-describedby="note-error" />
                <p id="note-error">Write a note before you save.</p>
            </>,
        );
        const box = screen.getByRole('textbox');
        expect(box).toBeInvalid();
        expect(box).toHaveAccessibleDescription('Write a note before you save.');
        await expectNoAxeViolations();
    });

    it('sets its size as data-size, the provider size when it has none', () => {
        renderUi(
            <>
                <Textarea aria-label="Small" size="sm" />
                <Textarea aria-label="Large" size="lg" />
                <Textarea aria-label="Unsized" />
            </>,
            { controlSize: 'sm' },
        );
        expect(screen.getByRole('textbox', { name: 'Small' })).toHaveAttribute('data-size', 'sm');
        expect(screen.getByRole('textbox', { name: 'Large' })).toHaveAttribute('data-size', 'lg');
        expect(screen.getByRole('textbox', { name: 'Unsized' })).toHaveAttribute('data-size', 'sm');
    });

    it('sets the filled look as data-variant, the provider look when it has none', async () => {
        renderUi(
            <>
                <Textarea aria-label="Filled" variant="filled" />
                <Textarea aria-label="Default" variant="default" />
                <Textarea aria-label="Inherited" />
            </>,
            { fieldVariant: 'filled' },
        );
        expect(screen.getByRole('textbox', { name: 'Filled' })).toHaveAttribute('data-variant', 'filled');
        expect(screen.getByRole('textbox', { name: 'Default' })).toHaveAttribute('data-variant', 'default');
        expect(screen.getByRole('textbox', { name: 'Inherited' })).toHaveAttribute('data-variant', 'filled');
        await expectNoAxeViolations();
    });

    it('defaults to the default size and look', () => {
        renderUi(<Textarea aria-label="Note" />);
        expect(screen.getByRole('textbox')).toHaveAttribute('data-size', 'default');
        expect(screen.getByRole('textbox')).toHaveAttribute('data-variant', 'default');
    });
});

describe('Textarea read-only', () => {
    it('can be focused but not edited when read-only', async () => {
        const { user } = renderUi(<Textarea aria-label="Bounce reason" readOnly defaultValue="550 5.1.1" />);
        const box = screen.getByRole('textbox', { name: 'Bounce reason' });
        await user.tab();
        expect(box).toHaveFocus();
        await user.type(box, ' more');
        expect(box).toHaveValue('550 5.1.1');
    });
});


it('uses fixed rows and native width by default; growth and fluid width are opt-in', () => {
    const { rerender } = renderUi(<Textarea rows={5} cols={30} aria-label="Note" />);
    const box = screen.getByRole('textbox');
    expect(box).toHaveAttribute('rows', '5');
    expect(box).toHaveAttribute('cols', '30');
    expect(box.className).not.toContain('field-sizing-content');
    expect(box.className).not.toContain('w-full');
    rerender(<Textarea autoResize fluid aria-label="Note" />);
    const growing = screen.getByRole('textbox');
    expect(growing).toHaveAttribute('data-auto-resize', 'true');
    expect(growing.className).toContain('w-full');
    expect(growing).not.toHaveAttribute('autoResize');
    expect(growing).not.toHaveAttribute('fluid');
});


it('autoResize grows and shrinks to content without shrinking below native rows', async () => {
    const { user } = renderUi(<Textarea autoResize rows={5} cols={30} aria-label="Note" />);
    const box = screen.getByRole('textbox');
    Object.defineProperties(box, {
        offsetHeight: { configurable: true, get: () => 114 },
        clientHeight: { configurable: true, get: () => 112 },
        scrollHeight: { configurable: true, get: () => box.value.length > 3 ? 172 : 112 },
    });
    await user.type(box, 'long note');
    expect(box.style.height).toBe('174px');
    await user.clear(box);
    expect(box.style.height).toBe('114px');
    expect(box).toHaveAttribute('cols', '30');
});
