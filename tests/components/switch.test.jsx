import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Switch } from '@/components/switch';
import { Label } from '@/components/label';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Labelled(props) {
    return (
        <div className="flex items-center gap-2">
            <Switch id="log" {...props} />
            <Label htmlFor="log">Keep the email log</Label>
        </div>
    );
}

describe('Switch', () => {
    it('renders role switch, named by its label', async () => {
        renderUi(<Labelled />);
        const sw = screen.getByRole('switch', { name: 'Keep the email log' });
        expect(sw).toHaveAttribute('aria-checked', 'false');
        expect(sw).toHaveAttribute('data-state', 'unchecked');
        await expectNoAxeViolations();
    });

    it('toggles with Space', async () => {
        const { user } = renderUi(<Labelled />);
        const sw = screen.getByRole('switch');
        await user.tab();
        expect(sw).toHaveFocus();
        await user.keyboard(' ');
        expect(sw).toHaveAttribute('aria-checked', 'true');
        await user.keyboard(' ');
        expect(sw).toHaveAttribute('aria-checked', 'false');
    });

    it('toggles with Enter', async () => {
        const { user } = renderUi(<Labelled />);
        const sw = screen.getByRole('switch');
        await user.tab();
        await user.keyboard('{Enter}');
        expect(sw).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles when its label is clicked', async () => {
        const { user } = renderUi(<Labelled />);
        await user.click(screen.getByText('Keep the email log'));
        expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked');
    });

    it('starts on with defaultChecked and reports changes', async () => {
        const seen = [];
        const { user } = renderUi(<Labelled defaultChecked onCheckedChange={(v) => seen.push(v)} />);
        const sw = screen.getByRole('switch');
        expect(sw).toHaveAttribute('aria-checked', 'true');
        await user.click(sw);
        expect(seen).toEqual([false]);
    });

    it('is controlled by checked', async () => {
        function Controlled() {
            const [on, setOn] = useState(true);
            return (
                <>
                    <Labelled checked={on} onCheckedChange={setOn} />
                    <p>{on ? 'On' : 'Off'}</p>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('switch'));
        expect(screen.getByText('Off')).toBeInTheDocument();
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });

    it('sets the size attribute: default and sm', () => {
        renderUi(
            <>
                <Switch aria-label="Default size" />
                <Switch aria-label="Small size" size="sm" />
            </>,
        );
        expect(screen.getByRole('switch', { name: 'Default size' })).toHaveAttribute('data-size', 'default');
        expect(screen.getByRole('switch', { name: 'Small size' })).toHaveAttribute('data-size', 'sm');
    });

    it('ignores clicks and keys while disabled', async () => {
        const { user } = renderUi(<Labelled disabled />);
        const sw = screen.getByRole('switch');
        await user.click(sw);
        sw.focus();
        await user.keyboard(' ');
        expect(sw).toHaveAttribute('aria-checked', 'false');
        expect(sw).toBeDisabled();
        await expectNoAxeViolations();
    });

    it('announces an invalid switch with its error message', async () => {
        renderUi(
            <>
                <Labelled aria-invalid aria-describedby="log-error" />
                <p id="log-error">Turn this on to keep the log searchable.</p>
            </>,
        );
        const sw = screen.getByRole('switch');
        expect(sw).toHaveAttribute('aria-invalid', 'true');
        expect(sw).toHaveAccessibleDescription('Turn this on to keep the log searchable.');
        await expectNoAxeViolations();
    });

    it('sets the size attribute to lg, and takes the provider controlSize when given none', () => {
        renderUi(
            <>
                <Switch aria-label="Large size" size="lg" />
                <Switch aria-label="Provider size" />
            </>,
            { controlSize: 'sm' },
        );
        expect(screen.getByRole('switch', { name: 'Large size' })).toHaveAttribute('data-size', 'lg');
        expect(screen.getByRole('switch', { name: 'Provider size' })).toHaveAttribute('data-size', 'sm');
    });

    it('submits its value under name while on, and goes back to its first state when the form is reset', async () => {
        const { user } = renderUi(
            <form aria-label="Settings">
                <Switch aria-label="Keep the email log" name="log" />
                <button type="reset">Reset</button>
            </form>,
        );
        const form = screen.getByRole('form');
        expect(new FormData(form).get('log')).toBeNull();
        await user.click(screen.getByRole('switch'));
        expect(new FormData(form).get('log')).toBe('on');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
        expect(new FormData(form).get('log')).toBeNull();
    });

    it('renders the thumb icons, both decorative, and still toggles with Space', async () => {
        const { user } = renderUi(
            <Switch
                aria-label="Track opens"
                checkedIcon={<svg data-testid="on-icon" aria-hidden="true" />}
                uncheckedIcon={<svg data-testid="off-icon" aria-hidden="true" />}
            />,
        );
        const sw = screen.getByRole('switch', { name: 'Track opens' });
        expect(screen.getByTestId('on-icon').closest('[data-slot=switch-thumb]')).not.toBeNull();
        expect(screen.getByTestId('off-icon').closest('[data-slot=switch-icon]')).not.toBeNull();
        expect(sw).toHaveAccessibleName('Track opens');
        await expectNoAxeViolations();
        sw.focus();
        await user.keyboard(' ');
        expect(sw).toHaveAttribute('aria-checked', 'true');
    });
});
