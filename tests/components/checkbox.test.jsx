import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Labelled(props) {
    return (
        <div className="flex items-center gap-2">
            <Checkbox id="terms" {...props} />
            <Label htmlFor="terms">Accept the terms</Label>
        </div>
    );
}

describe('Checkbox', () => {
    it('toggles with Space', async () => {
        const { user } = renderUi(<Labelled />);
        const box = screen.getByRole('checkbox', { name: 'Accept the terms' });
        await user.tab();
        expect(box).toHaveFocus();
        await user.keyboard(' ');
        expect(box).toHaveAttribute('aria-checked', 'true');
        await user.keyboard(' ');
        expect(box).toHaveAttribute('aria-checked', 'false');
        await expectNoAxeViolations();
    });

    it('toggles when its label is clicked', async () => {
        const { user } = renderUi(<Labelled />);
        await user.click(screen.getByText('Accept the terms'));
        expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');
    });

    it('reads mixed when indeterminate, shows the dash, and becomes checked with Space', async () => {
        function Mixed() {
            const [checked, setChecked] = useState('indeterminate');
            return <Labelled checked={checked} onCheckedChange={setChecked} />;
        }
        const { user } = renderUi(<Mixed />);
        const box = screen.getByRole('checkbox');
        expect(box).toHaveAttribute('aria-checked', 'mixed');
        expect(box).toHaveAttribute('data-state', 'indeterminate');
        expect(box.className).not.toContain('data-[state=indeterminate]:bg-primary');
        expect(box.querySelector('.lucide-minus')).not.toBeNull();
        await expectNoAxeViolations();
        box.focus();
        await user.keyboard(' ');
        expect(box).toHaveAttribute('aria-checked', 'true');
    });

    it('ignores clicks and Space while disabled', async () => {
        const { user } = renderUi(<Labelled disabled />);
        const box = screen.getByRole('checkbox');
        await user.click(box);
        box.focus();
        await user.keyboard(' ');
        expect(box).toHaveAttribute('aria-checked', 'false');
        expect(box).toBeDisabled();
    });

    it('announces an invalid box with its error message', async () => {
        renderUi(
            <>
                <Labelled aria-invalid aria-describedby="terms-error" />
                <p id="terms-error">Accept the terms to continue.</p>
            </>,
        );
        const box = screen.getByRole('checkbox');
        expect(box).toHaveAttribute('aria-invalid', 'true');
        expect(box).toHaveAccessibleDescription('Accept the terms to continue.');
        await expectNoAxeViolations();
    });

    it('sets data-size and data-variant, from its props or the provider', async () => {
        renderUi(
            <>
                <Checkbox aria-label="Small" size="sm" />
                <Checkbox aria-label="Large filled" size="lg" variant="filled" />
            </>,
        );
        expect(screen.getByRole('checkbox', { name: 'Small' })).toHaveAttribute('data-size', 'sm');
        expect(screen.getByRole('checkbox', { name: 'Large filled' })).toHaveAttribute('data-size', 'lg');
        expect(screen.getByRole('checkbox', { name: 'Large filled' })).toHaveAttribute('data-variant', 'filled');
        await expectNoAxeViolations();
    });

    it('takes the provider controlSize and fieldVariant when given none', () => {
        renderUi(<Checkbox aria-label="Copy the admin" />, { controlSize: 'sm', fieldVariant: 'filled' });
        const box = screen.getByRole('checkbox', { name: 'Copy the admin' });
        expect(box).toHaveAttribute('data-size', 'sm');
        expect(box).toHaveAttribute('data-variant', 'filled');
    });

    it('draws a custom icon when checked and a custom mixed icon when indeterminate', async () => {
        const { rerender } = renderUi(
            <Checkbox aria-label="Block sender" defaultChecked icon={<svg data-testid="cross" />} />,
        );
        const box = screen.getByRole('checkbox', { name: 'Block sender' });
        expect(screen.getByTestId('cross').closest('[data-slot=checkbox-icon]')).not.toBeNull();
        expect(box.querySelector('.lucide-check')).toBeNull();
        await expectNoAxeViolations();
        rerender(
            <Checkbox aria-label="Block sender" checked="indeterminate" indeterminateIcon={<svg data-testid="dot" />} />,
        );
        expect(screen.getByTestId('dot').closest('[data-slot=checkbox-icon]')).not.toBeNull();
        expect(screen.getByRole('checkbox').querySelector('.lucide-minus')).toBeNull();
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    });

    it('submits its value under name while checked, and goes back to its first state when the form is reset', async () => {
        const { user } = renderUi(
            <form aria-label="Signup">
                <Checkbox aria-label="Product news" name="news" value="yes" />
                <Checkbox aria-label="Accept the terms" name="terms" required defaultChecked />
                <button type="reset">Reset</button>
            </form>,
        );
        const form = screen.getByRole('form');
        expect(new FormData(form).get('news')).toBeNull();
        expect(new FormData(form).get('terms')).toBe('on');
        await user.click(screen.getByRole('checkbox', { name: 'Product news' }));
        await user.click(screen.getByRole('checkbox', { name: 'Accept the terms' }));
        expect(new FormData(form).get('news')).toBe('yes');
        expect(form.checkValidity()).toBe(false);
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        expect(screen.getByRole('checkbox', { name: 'Product news' })).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByRole('checkbox', { name: 'Accept the terms' })).toHaveAttribute('aria-checked', 'true');
        expect(new FormData(form).get('news')).toBeNull();
        expect(form.checkValidity()).toBe(true);
    });

    it('toggles a box with a custom icon with Space, as any checkbox', async () => {
        const { user } = renderUi(<Checkbox aria-label="Block sender" icon={<svg />} />);
        const box = screen.getByRole('checkbox', { name: 'Block sender' });
        box.focus();
        await user.keyboard(' ');
        expect(box).toHaveAttribute('aria-checked', 'true');
    });
});
