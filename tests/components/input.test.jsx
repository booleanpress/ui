import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Input } from '@/components/input';
import { InputGroup, InputGroupInput } from '@/components/input-group';
import { Label } from '@/components/label';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Input', () => {
    it('takes typing and exposes invalid state with its message', async () => {
        const { user } = renderUi(
            <>
                <Label htmlFor="email">Email</Label>
                <Input id="email" aria-invalid="true" aria-describedby="email-error" />
                <p id="email-error">Enter a valid email address.</p>
            </>,
        );
        const input = screen.getByRole('textbox', { name: 'Email' });
        await user.type(input, 'me@example.com');
        expect(input).toHaveValue('me@example.com');
        expect(input).toBeInvalid();
        expect(input).toHaveAccessibleDescription('Enter a valid email address.');
        await expectNoAxeViolations();
    });

    it('cannot be edited when disabled or read-only', async () => {
        const { user } = renderUi(
            <>
                <Input aria-label="Disabled" disabled defaultValue="a" />
                <Input aria-label="Read-only" readOnly defaultValue="b" />
            </>,
        );
        await user.type(screen.getByRole('textbox', { name: 'Disabled' }), 'x');
        await user.type(screen.getByRole('textbox', { name: 'Read-only' }), 'x');
        expect(screen.getByRole('textbox', { name: 'Disabled' })).toHaveValue('a');
        expect(screen.getByRole('textbox', { name: 'Read-only' })).toHaveValue('b');
    });

    it('sets its size as data-size, the provider size when it has none', () => {
        renderUi(
            <>
                <Input aria-label="Small" size="sm" />
                <Input aria-label="Large" size="lg" />
                <Input aria-label="Unsized" />
            </>,
            { controlSize: 'lg' },
        );
        expect(screen.getByRole('textbox', { name: 'Small' })).toHaveAttribute('data-size', 'sm');
        expect(screen.getByRole('textbox', { name: 'Large' })).toHaveAttribute('data-size', 'lg');
        expect(screen.getByRole('textbox', { name: 'Unsized' })).toHaveAttribute('data-size', 'lg');
    });

    it('defaults to the default size and look outside a provider setting', () => {
        renderUi(<Input aria-label="Plain" />);
        expect(screen.getByRole('textbox')).toHaveAttribute('data-size', 'default');
        expect(screen.getByRole('textbox')).toHaveAttribute('data-variant', 'default');
    });

    it('sets the filled look as data-variant, the provider look when it has none', async () => {
        renderUi(
            <>
                <Input aria-label="Filled" variant="filled" />
                <Input aria-label="Default" variant="default" />
                <Input aria-label="Inherited" />
            </>,
            { fieldVariant: 'filled' },
        );
        expect(screen.getByRole('textbox', { name: 'Filled' })).toHaveAttribute('data-variant', 'filled');
        expect(screen.getByRole('textbox', { name: 'Default' })).toHaveAttribute('data-variant', 'default');
        expect(screen.getByRole('textbox', { name: 'Inherited' })).toHaveAttribute('data-variant', 'filled');
        await expectNoAxeViolations();
    });

    it('stays a bare input without clearable', () => {
        renderUi(<Input aria-label="Plain" defaultValue="a" />);
        expect(screen.getByRole('textbox').parentElement).not.toHaveAttribute('data-slot', 'input-wrapper');
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('shows the clear button only while there is a value', async () => {
        const { user } = renderUi(<Input aria-label="Filter" clearable />);
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
        await user.type(screen.getByRole('textbox'), 'inv');
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('empties the input, calls onChange and puts the focus back when the clear button is clicked', async () => {
        const onChange = vi.fn();
        const { user } = renderUi(<Input aria-label="Filter" clearable defaultValue="invoice" onChange={onChange} />);
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('');
        expect(input).toHaveFocus();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target.value).toBe('');
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
        // Typing starts again from the empty input.
        await user.keyboard('new');
        expect(input).toHaveValue('new');
    });

    it('moves from the input to the clear button with Tab', async () => {
        const { user } = renderUi(<Input aria-label="Filter" clearable defaultValue="invoice" />);
        await user.tab();
        expect(screen.getByRole('textbox')).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Clear' })).toHaveFocus();
    });

    it('empties the input and moves the focus back to it with Enter or Space on the clear button', async () => {
        const { user } = renderUi(
            <>
                <Input aria-label="First" clearable defaultValue="a" />
                <Input aria-label="Second" clearable defaultValue="b" />
            </>,
        );
        screen.getAllByRole('button', { name: 'Clear' })[0].focus();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('textbox', { name: 'First' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'First' })).toHaveFocus();
        screen.getByRole('button', { name: 'Clear' }).focus();
        await user.keyboard(' ');
        expect(screen.getByRole('textbox', { name: 'Second' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'Second' })).toHaveFocus();
    });

    it('clears a controlled input through its onChange', async () => {
        function Controlled() {
            const [value, setValue] = useState('invoice');
            return <Input aria-label="Filter" clearable value={value} onChange={(e) => setValue(e.target.value)} />;
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(screen.getByRole('textbox')).toHaveValue('');
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
        await user.keyboard('x');
        expect(screen.getByRole('textbox')).toHaveValue('x');
    });

    it('reads the clear button name from the provider strings', () => {
        renderUi(<Input aria-label="Filtro" clearable defaultValue="a" />, { strings: { clear: 'Borrar' } });
        expect(screen.getByRole('button', { name: 'Borrar' })).toBeInTheDocument();
    });

    it('has no clear button when disabled or read-only', () => {
        renderUi(
            <>
                <Input aria-label="Disabled" clearable disabled defaultValue="a" />
                <Input aria-label="Read-only" clearable readOnly defaultValue="b" />
            </>,
        );
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('hides the clear button when its form is reset to an empty default', async () => {
        const { user } = renderUi(
            <form>
                <Input aria-label="Filter" clearable />
                <button type="reset">Reset</button>
            </form>,
        );
        await user.type(screen.getByRole('textbox'), 'abc');
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        await screen.findByRole('button', { name: 'Reset' });
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    });
});

describe('Input keyFilter', () => {
    it('types only the characters its preset takes', async () => {
        const { user } = renderUi(
            <>
                <Input aria-label="Integer" keyFilter="int" />
                <Input aria-label="Hex" keyFilter="hex" />
                <Input aria-label="Letters" keyFilter="alpha" />
                <Input aria-label="Code" keyFilter="alphanum" />
            </>,
        );
        await user.type(screen.getByRole('textbox', { name: 'Integer' }), '-12a.5');
        expect(screen.getByRole('textbox', { name: 'Integer' })).toHaveValue('-125');
        await user.type(screen.getByRole('textbox', { name: 'Hex' }), '0fG9z');
        expect(screen.getByRole('textbox', { name: 'Hex' })).toHaveValue('0f9');
        await user.type(screen.getByRole('textbox', { name: 'Letters' }), 'Zoë 2');
        expect(screen.getByRole('textbox', { name: 'Letters' })).toHaveValue('Zoë');
        await user.type(screen.getByRole('textbox', { name: 'Code' }), 'ab-12_');
        expect(screen.getByRole('textbox', { name: 'Code' })).toHaveValue('ab12');
        await expectNoAxeViolations();
    });

    it('takes the provider locale’s separators in the number presets', async () => {
        const { user } = renderUi(
            <>
                <Input aria-label="Number" keyFilter="num" />
                <Input aria-label="Money" keyFilter="money" />
            </>,
            { locale: 'de-DE' },
        );
        await user.type(screen.getByRole('textbox', { name: 'Number' }), '-3,5.');
        expect(screen.getByRole('textbox', { name: 'Number' })).toHaveValue('-3,5');
        await user.type(screen.getByRole('textbox', { name: 'Money' }), '1.250,99$');
        expect(screen.getByRole('textbox', { name: 'Money' })).toHaveValue('1.250,99');
    });

    it('refuses a paste with any character the filter does not take', async () => {
        const { user } = renderUi(<Input aria-label="Integer" keyFilter="int" />);
        const input = screen.getByRole('textbox');
        await user.click(input);
        await user.paste('12a');
        expect(input).toHaveValue('');
        await user.paste('1200');
        expect(input).toHaveValue('1200');
    });

    it('tests a regular expression against each character', async () => {
        const { user } = renderUi(<Input aria-label="Username" keyFilter={/\S/} />);
        await user.type(screen.getByRole('textbox'), 'ops team');
        expect(screen.getByRole('textbox')).toHaveValue('opsteam');
    });

    it('tests a ^…$ regular expression against the whole value the edit would leave', async () => {
        const { user } = renderUi(<Input aria-label="Phone" keyFilter={/^\+?\d{0,4}$/} />);
        const input = screen.getByRole('textbox');
        await user.type(input, '+12+345');
        expect(input).toHaveValue('+1234');
        input.setSelectionRange(0, 0);
        await user.keyboard('9');
        expect(input).toHaveValue('+1234');
    });

    it('filters inside an input group too, and leaves deleting and clearing alone', async () => {
        const { user } = renderUi(
            <InputGroup>
                <InputGroupInput aria-label="Integer" keyFilter="int" clearable defaultValue="42" />
            </InputGroup>,
        );
        const input = screen.getByRole('textbox');
        await user.type(input, 'x{Backspace}');
        expect(input).toHaveValue('4');
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(input).toHaveValue('');
    });
});
