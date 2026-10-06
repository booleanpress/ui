import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { BoldIcon } from 'lucide-react';
import { Toggle } from '@/components/toggle';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Toggle', () => {
    it('renders a button with aria-pressed, named by aria-label', async () => {
        renderUi(
            <Toggle aria-label="Bold">
                <BoldIcon />
            </Toggle>,
        );
        const toggle = screen.getByRole('button', { name: 'Bold' });
        expect(toggle).toHaveAttribute('aria-pressed', 'false');
        expect(toggle).toHaveAttribute('data-state', 'off');
        await expectNoAxeViolations();
    });

    it('toggles with Space', async () => {
        const { user } = renderUi(<Toggle>Pinned</Toggle>);
        const toggle = screen.getByRole('button', { name: 'Pinned' });
        await user.tab();
        expect(toggle).toHaveFocus();
        await user.keyboard(' ');
        expect(toggle).toHaveAttribute('aria-pressed', 'true');
        await user.keyboard(' ');
        expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });

    it('toggles with Enter', async () => {
        const { user } = renderUi(<Toggle>Pinned</Toggle>);
        await user.tab();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('button', { name: 'Pinned' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('starts pressed with defaultPressed and reports changes', async () => {
        const seen = [];
        const { user } = renderUi(
            <Toggle defaultPressed onPressedChange={(v) => seen.push(v)}>
                Pinned
            </Toggle>,
        );
        const toggle = screen.getByRole('button', { name: 'Pinned' });
        expect(toggle).toHaveAttribute('data-state', 'on');
        await user.click(toggle);
        expect(seen).toEqual([false]);
    });

    it('is controlled by pressed', async () => {
        function Controlled() {
            const [pressed, setPressed] = useState(false);
            return (
                <>
                    <Toggle pressed={pressed} onPressedChange={setPressed}>
                        Mute alerts
                    </Toggle>
                    <p>{pressed ? 'Muted' : 'Alerts on'}</p>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Mute alerts' }));
        expect(screen.getByText('Muted')).toBeInTheDocument();
    });

    it('applies the variant and size classes', () => {
        renderUi(
            <Toggle variant="outline" size="lg">
                Star
            </Toggle>,
        );
        const toggle = screen.getByRole('button', { name: 'Star' });
        expect(toggle.className).toContain('border-border');
        expect(toggle.className).toContain('text-base');
    });

    it('ignores clicks and keys while disabled', async () => {
        const { user } = renderUi(<Toggle disabled>Archived</Toggle>);
        const toggle = screen.getByRole('button', { name: 'Archived' });
        await user.click(toggle);
        expect(toggle).toHaveAttribute('aria-pressed', 'false');
        expect(toggle).toBeDisabled();
        await expectNoAxeViolations();
    });

    it('sets data-size from its prop or the provider, with the matching classes', () => {
        renderUi(
            <>
                <Toggle size="sm">Small</Toggle>
                <Toggle>Provider</Toggle>
            </>,
            { controlSize: 'lg' },
        );
        expect(screen.getByRole('button', { name: 'Small' })).toHaveAttribute('data-size', 'sm');
        expect(screen.getByRole('button', { name: 'Small' }).className).toContain('text-xs');
        expect(screen.getByRole('button', { name: 'Provider' })).toHaveAttribute('data-size', 'lg');
        expect(screen.getByRole('button', { name: 'Provider' }).className).toContain('text-base');
    });

    it('fills its container with fluid', () => {
        renderUi(<Toggle fluid>Show archived tickets</Toggle>);
        expect(screen.getByRole('button', { name: 'Show archived tickets' }).className).toContain('w-full');
    });

    it('announces an invalid toggle with its message', async () => {
        renderUi(
            <>
                <Toggle aria-invalid aria-describedby="domain-error">Domain verified</Toggle>
                <p id="domain-error">Verify the sending domain first.</p>
            </>,
        );
        const toggle = screen.getByRole('button', { name: 'Domain verified' });
        expect(toggle).toHaveAttribute('aria-invalid', 'true');
        expect(toggle).toHaveAccessibleDescription('Verify the sending domain first.');
        expect(toggle.className).toContain('aria-invalid:border-invalid');
        await expectNoAxeViolations();
    });
});


it('renders content from the current state without external state', async () => {
    const { user } = renderUi(<Toggle aria-label="Notifications">{({ pressed }) => pressed ? 'Enabled' : 'Disabled'}</Toggle>);
    const toggle = screen.getByRole('button', { name: 'Notifications' });
    expect(toggle).toHaveTextContent('Disabled');
    await user.click(toggle);
    expect(toggle).toHaveTextContent('Enabled');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard(' ');
    expect(toggle).toHaveTextContent('Disabled');
});

it('preserves asChild semantics and the content plate', async () => {
    const { user } = renderUi(<Toggle asChild><button type="button">Pinned</button></Toggle>);
    const button = screen.getByRole('button', { name: 'Pinned' });
    expect(button.querySelector('[data-slot=toggle-indicator]')).toHaveTextContent('Pinned');
    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
});
