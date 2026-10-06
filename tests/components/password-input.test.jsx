import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Label } from '@/components/label';
import { PasswordInput, scorePasswordStrength, scorePasswordRules } from '@/components/password-input';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('PasswordInput', () => {
    it('keeps the show-password button in the tab order so a keyboard user can reveal the value', async () => {
        const { user } = renderUi(<PasswordInput showToggle aria-label="API key" defaultValue="secret" />);
        const toggle = screen.getByRole('button');

        // In the tab order: no negative tabindex.
        expect(toggle).not.toHaveAttribute('tabindex', '-1');
        expect(toggle.tabIndex).toBe(0);

        await user.tab();
        expect(screen.getByLabelText('API key')).toHaveFocus();
        await user.tab();
        expect(toggle).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(screen.getByLabelText('API key')).toHaveAttribute('type', 'text');
        await user.keyboard(' ');
        expect(screen.getByLabelText('API key')).toHaveAttribute('type', 'password');
    });

    it('starts hidden, shows on click and hides again, reporting the state with aria-pressed', async () => {
        const { user } = renderUi(<PasswordInput showToggle aria-label="API key" defaultValue="secret" />);
        const input = screen.getByLabelText('API key');
        expect(input).toHaveAttribute('type', 'password');
        const show = screen.getByRole('button', { name: 'Show password' });
        expect(show).toHaveAttribute('aria-pressed', 'false');
        await user.click(show);
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveValue('secret');
        expect(show).toHaveAttribute('aria-pressed', 'true');
        expect(show).toHaveAccessibleName('Show password');
        await expectNoAxeViolations();
        await user.click(show);
        expect(input).toHaveAttribute('type', 'password');
    });

    it('reads the button names from the provider strings', () => {
        renderUi(<PasswordInput showToggle aria-label="Key" />, { strings: { showPassword: 'Mostrar contraseña' } });
        expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeInTheDocument();
    });

    it('opts out of password-manager autofill, and a caller can override autocomplete', () => {
        const { rerender } = renderUi(<PasswordInput showToggle aria-label="Key" />);
        const input = screen.getByLabelText('Key');
        expect(input).toHaveAttribute('autocomplete', 'new-password');
        expect(input).toHaveAttribute('data-1p-ignore');
        expect(input).toHaveAttribute('data-lpignore', 'true');
        rerender(<PasswordInput showToggle aria-label="Key" autoComplete="off" />);
        expect(screen.getByLabelText('Key')).toHaveAttribute('autocomplete', 'off');
    });

    it('is named by a label and takes typing', async () => {
        const { user } = renderUi(
            <>
                <Label htmlFor="smtp-password">SMTP password</Label>
                <PasswordInput showToggle id="smtp-password" />
            </>,
        );
        await user.type(screen.getByLabelText('SMTP password'), 'abc');
        expect(screen.getByLabelText('SMTP password')).toHaveValue('abc');
        await expectNoAxeViolations();
    });

    it('cannot be edited when disabled', async () => {
        const { user } = renderUi(<PasswordInput showToggle aria-label="Key" disabled defaultValue="a" />);
        await user.type(screen.getByLabelText('Key'), 'x');
        expect(screen.getByLabelText('Key')).toHaveValue('a');
        expect(screen.getByLabelText('Key')).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Show password' })).toBeDisabled();
    });

    it('announces an invalid input with its message', async () => {
        renderUi(
            <>
                <PasswordInput showToggle aria-label="Key" aria-invalid aria-describedby="key-error" />
                <p id="key-error">Enter the password.</p>
            </>,
        );
        const input = screen.getByLabelText('Key');
        expect(input).toBeInvalid();
        expect(input).toHaveAccessibleDescription('Enter the password.');
        await expectNoAxeViolations();
    });

    it('sets its size as data-size on the group and the input, the provider size when it has none', () => {
        renderUi(
            <>
                <PasswordInput showToggle aria-label="Small" size="sm" />
                <PasswordInput showToggle aria-label="Unsized" />
            </>,
            { controlSize: 'lg' },
        );
        const small = screen.getByLabelText('Small');
        expect(small).toHaveAttribute('data-size', 'sm');
        expect(small.closest('[data-slot=input-group]')).toHaveAttribute('data-size', 'sm');
        const unsized = screen.getByLabelText('Unsized');
        expect(unsized).toHaveAttribute('data-size', 'lg');
        expect(unsized.closest('[data-slot=input-group]')).toHaveAttribute('data-size', 'lg');
    });

    it('sets the filled look as data-variant on the group, the provider look when it has none', async () => {
        renderUi(
            <>
                <PasswordInput showToggle aria-label="Filled" variant="filled" />
                <PasswordInput showToggle aria-label="Inherited" />
                <PasswordInput showToggle aria-label="Default" variant="default" />
            </>,
            { fieldVariant: 'filled' },
        );
        expect(screen.getByLabelText('Filled').closest('[data-slot=input-group]')).toHaveAttribute('data-variant', 'filled');
        expect(screen.getByLabelText('Inherited').closest('[data-slot=input-group]')).toHaveAttribute('data-variant', 'filled');
        expect(screen.getByLabelText('Default').closest('[data-slot=input-group]')).toHaveAttribute('data-variant', 'default');
        await expectNoAxeViolations();
    });

    it('puts the clear button between the input and the eye in the tab order', async () => {
        const { user } = renderUi(<PasswordInput showToggle aria-label="Relay password" clearable defaultValue="secret" />);
        await user.tab();
        expect(screen.getByLabelText('Relay password')).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Clear' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Show password' })).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('empties the field, calls onChange and moves the focus back with Enter on the clear button', async () => {
        const onChange = vi.fn();
        const { user } = renderUi(<PasswordInput showToggle aria-label="Relay password" clearable defaultValue="secret" onChange={onChange} />);
        screen.getByRole('button', { name: 'Clear' }).focus();
        await user.keyboard('{Enter}');
        const input = screen.getByLabelText('Relay password');
        expect(input).toHaveValue('');
        expect(input).toHaveFocus();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    });

    it('clears with a click and keeps the eye working', async () => {
        const { user } = renderUi(<PasswordInput showToggle aria-label="Relay password" clearable defaultValue="secret" />);
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(screen.getByLabelText('Relay password')).toHaveValue('');
        await user.keyboard('new');
        await user.click(screen.getByRole('button', { name: 'Show password' }));
        expect(screen.getByLabelText('Relay password')).toHaveAttribute('type', 'text');
        expect(screen.getByLabelText('Relay password')).toHaveValue('new');
    });

    it('reads the clear button name from the provider strings', () => {
        renderUi(<PasswordInput showToggle aria-label="Clave" clearable defaultValue="a" />, { strings: { clear: 'Borrar' } });
        expect(screen.getByRole('button', { name: 'Borrar' })).toBeInTheDocument();
    });

    it('has no clear button when disabled', () => {
        renderUi(<PasswordInput showToggle aria-label="Key" clearable disabled defaultValue="a" />);
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    });
});

const RULES = [
    { label: 'At least 12 characters', test: (value) => value.length >= 12 },
    { label: 'A number', test: (value) => /[0-9]/.test(value) },
];

describe('PasswordInput rules and strength', () => {
    it('lists the rules, each read as met or not met, and ticks them as the value meets them', async () => {
        const { user } = renderUi(<PasswordInput showToggle aria-label="Password" rules={RULES} />);
        const items = () => screen.getAllByRole('listitem');
        expect(items()[0]).toHaveTextContent('At least 12 characters: not met');
        expect(items()[1]).toHaveTextContent('A number: not met');
        await user.type(screen.getByLabelText('Password'), 'abc1');
        expect(items()[1]).toHaveTextContent('A number: met');
        expect(items()[1]).toHaveAttribute('data-met', 'true');
        expect(items()[0]).not.toHaveAttribute('data-met');
        await expectNoAxeViolations();
    });

    it('announces a rule met or lost politely', async () => {
        const { user } = renderUi(<PasswordInput showToggle aria-label="Password" rules={RULES} />);
        const status = screen.getByRole('status');
        expect(status).toHaveAttribute('aria-live', 'polite');
        expect(status).toBeEmptyDOMElement();
        await user.type(screen.getByLabelText('Password'), 'a1');
        expect(status).toHaveTextContent('A number: met');
        await user.keyboard('{Backspace}');
        expect(status).toHaveTextContent('A number: not met');
    });

    it('describes the field with its checklist', () => {
        renderUi(<PasswordInput showToggle aria-label="Password" rules={RULES} aria-describedby="hint" />);
        const input = screen.getByLabelText('Password');
        expect(input.getAttribute('aria-describedby')).toMatch(/^hint /);
        expect(input).toHaveAccessibleDescription(expect.stringContaining('At least 12 characters: not met'));
    });

    it('scores four strength levels from the length and character checks', () => {
        expect(scorePasswordStrength('')).toBeNull();
        expect(scorePasswordStrength('abc')).toBe('weak');
        expect(scorePasswordStrength('abcdefgh')).toBe('weak');
        expect(scorePasswordStrength('abcdef12')).toBe('medium');
        expect(scorePasswordStrength('Abcdef12xyz')).toBe('strong');
        expect(scorePasswordStrength('Abcdef12!xyz')).toBe('very-strong');
    });

    it('shows the meter only while there is a value, with the level read and announced', async () => {
        const { user, container } = renderUi(<PasswordInput showToggle aria-label="Password" strength />);
        expect(container.querySelector('[data-slot=password-input-strength]')).toBeNull();
        const input = screen.getByLabelText('Password');
        await user.type(input, 'abc');
        expect(container.querySelector('[data-slot=password-input-strength]')).toHaveAttribute('data-level', 'weak');
        expect(container.querySelector('[data-slot=password-input-strength]')).toHaveTextContent('Password strength: Weak');
        expect(screen.getByRole('status')).toHaveTextContent('Password strength: Weak');
        await user.keyboard('def12');
        expect(container.querySelector('[data-slot=password-input-strength]')).toHaveAttribute('data-level', 'medium');
        expect(screen.getByRole('status')).toHaveTextContent('Password strength: Medium');
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
        await user.keyboard('!X%z');
        expect(container.querySelector('[data-slot=password-input-strength]')).toHaveAttribute('data-level', 'very-strong');
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
        await expectNoAxeViolations();
    });

    it('takes its own score through scoreStrength', async () => {
        const { user, container } = renderUi(
            <PasswordInput showToggle aria-label="Password" strength scoreStrength={(value) => (value.length > 2 ? 'strong' : 'weak')} />,
        );
        await user.type(screen.getByLabelText('Password'), 'abc');
        expect(container.querySelector('[data-slot=password-input-strength]')).toHaveAttribute('data-level', 'strong');
    });

    it('reads its rule and strength words from the provider strings', async () => {
        const { user, container } = renderUi(<PasswordInput showToggle aria-label="Kennwort" rules={RULES.slice(1)} strength />, {
            strings: {
                ruleMet: 'Erfüllt: {label}',
                ruleNotMet: 'Offen: {label}',
                passwordStrength: 'Stärke: {level}',
                strengthWeak: 'Schwach',
            },
        });
        expect(screen.getByRole('listitem')).toHaveTextContent('Offen: A number');
        await user.type(screen.getByLabelText('Kennwort'), '1');
        expect(screen.getByRole('listitem')).toHaveTextContent('Erfüllt: A number');
        expect(container.querySelector('[data-slot=password-input-strength]')).toHaveTextContent('Stärke: Schwach');
        expect(screen.getByRole('status')).toHaveTextContent('Erfüllt: A number');
    });

    it('shows the feedback in a panel while the field has focus, and Escape hides it until the next change', async () => {
        const { user } = renderUi(
            <>
                <PasswordInput showToggle aria-label="Password" rules={RULES} feedback="popover" />
                <button type="button">After</button>
            </>,
        );
        expect(screen.queryByRole('list')).toBeNull();
        const input = screen.getByLabelText('Password');
        await user.click(input);
        expect(await screen.findByRole('list')).toBeInTheDocument();
        expect(input).toHaveFocus();
        expect(input).toHaveAccessibleDescription(expect.stringContaining('A number: not met'));
        await expectNoAxeViolations();
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('list')).toBeNull();
        expect(input).toHaveFocus();
        await user.keyboard('7');
        expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('A number: met');
        await user.tab();
        await user.tab();
        expect(screen.queryByRole('list')).toBeNull();
    });

    it('follows a form reset with its checklist and meter', async () => {
        const { user } = renderUi(
            <form>
                <PasswordInput showToggle aria-label="Password" name="password" rules={RULES} strength />
                <button type="reset">Reset</button>
            </form>,
        );
        const input = screen.getByLabelText('Password');
        await user.type(input, 'Relay-secret-2026');
        expect(screen.getAllByRole('listitem')[1]).toHaveAttribute('data-met', 'true');
        expect(screen.getByText('Password strength: Very strong')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        expect(input).toHaveValue('');
        await waitFor(() => expect(screen.getAllByRole('listitem')[1]).not.toHaveAttribute('data-met'));
        expect(screen.queryByText('Password strength: Very strong')).toBeNull();
    });

    it('keeps its look and behaviour without rules or a meter', () => {
        const { container } = renderUi(<PasswordInput showToggle aria-label="Key" />);
        expect(container.querySelector('[data-slot=password-input]')).toBeNull();
        expect(screen.queryByRole('status')).toBeNull();
    });
});


describe('PasswordInput visibility and scored feedback', () => {
    it('omits the visibility action by default and accepts an unmasked initial state', () => {
        const { rerender } = renderUi(<PasswordInput aria-label="Password" />);
        expect(screen.queryByRole('button')).toBeNull();
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
        rerender(<PasswordInput key="unmasked" aria-label="Password" defaultMask={false} />);
        expect(screen.getByRole('textbox', { name: 'Password' })).toBeInTheDocument();
    });

    it('requests mask changes without overriding a controlled parent', async () => {
        const onMaskChange = vi.fn();
        const { user, rerender } = renderUi(<PasswordInput showToggle aria-label="Password" mask onMaskChange={onMaskChange} />);
        await user.click(screen.getByRole('button', { name: 'Show password' }));
        expect(onMaskChange).toHaveBeenCalledWith(false);
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
        rerender(<PasswordInput showToggle aria-label="Password" mask={false} onMaskChange={onMaskChange} />);
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    });

    it('scores five equally weighted rules at each twenty-percent step', () => {
        const rules = ['a', 'b', 'c', 'd', 'e'].map((letter) => ({ label: letter, test: (value) => value.includes(letter) }));
        expect(scorePasswordRules('', rules)).toBeNull();
        expect(scorePasswordRules('a', rules)).toEqual({ level: 'too-weak', percent: 20 });
        expect(scorePasswordRules('ab', rules)).toEqual({ level: 'weak', percent: 40 });
        expect(scorePasswordRules('abc', rules)).toEqual({ level: 'fair', percent: 60 });
        expect(scorePasswordRules('abcd', rules)).toEqual({ level: 'strong', percent: 80 });
        expect(scorePasswordRules('abcde', rules)).toEqual({ level: 'very-strong', percent: 100 });
        expect(scorePasswordRules('a', [{ ...rules[0], weight: 3 }, rules[1]])).toEqual({ level: 'strong', percent: 75 });
    });

    it('renders rule scoring with a named popover header and accessible percentage', async () => {
        const { user } = renderUi(<PasswordInput aria-label="Password" rules={RULES} strength="rules" feedback="popover" />);
        await user.type(screen.getByLabelText('Password'), '1');
        expect(screen.getByText('Password strength')).toBeInTheDocument();
        expect(screen.getByRole('progressbar', { name: 'Password strength' })).toHaveAttribute('aria-valuenow', '50');
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Fair');
        await expectNoAxeViolations();
    });

    it('clamps custom score percentages and reads extended labels from the provider', async () => {
        renderUi(<PasswordInput aria-label="Password" defaultValue="abc" strength scoreStrength={() => ({ level: 'very-strong', percent: 110 })} />, {
            strings: { strengthVeryStrong: 'Muy fuerte', passwordStrengthTitle: 'Seguridad' },
        });
        expect(screen.getByRole('progressbar', { name: 'Seguridad' })).toHaveAttribute('aria-valuenow', '100');
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Muy fuerte');
        await expectNoAxeViolations();
    });
});


it('has no rule strength badge until a requirement is met', () => {
    expect(scorePasswordRules('abc', [{ label: 'A number', test: (value) => /[0-9]/.test(value) }])).toBeNull();
});
