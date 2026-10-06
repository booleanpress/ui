import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { SearchIcon } from 'lucide-react';
import { Checkbox } from '@/components/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from '@/components/input-group';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('InputGroup', () => {
    it('focuses the input when a text addon is clicked, and takes typing', async () => {
        const { user } = renderUi(
            <InputGroup>
                <InputGroupAddon>
                    <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput aria-label="Tracking domain" />
            </InputGroup>,
        );
        await user.click(screen.getByText('https://'));
        const input = screen.getByRole('textbox', { name: 'Tracking domain' });
        expect(input).toHaveFocus();
        await user.keyboard('track');
        expect(input).toHaveValue('track');
        await expectNoAxeViolations();
    });

    it('moves from the input to an addon button with Tab, and Enter and Space press it', async () => {
        const onClick = vi.fn();
        const { user } = renderUi(
            <InputGroup>
                <InputGroupInput aria-label="Webhook URL" />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton aria-label="Copy" size="icon-xs" onClick={onClick}>
                        <SearchIcon />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>,
        );
        await user.tab();
        expect(screen.getByRole('textbox')).toHaveFocus();
        await user.tab();
        const button = screen.getByRole('button', { name: 'Copy' });
        expect(button).toHaveFocus();
        await user.keyboard('{Enter}');
        await user.keyboard(' ');
        expect(onClick).toHaveBeenCalledTimes(2);
        await expectNoAxeViolations();
    });

    it('does not move focus to the input when an addon button is clicked, and the button is type=button', async () => {
        const { user } = renderUi(
            <InputGroup>
                <InputGroupInput aria-label="Search" />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton>Go</InputGroupButton>
                </InputGroupAddon>
            </InputGroup>,
        );
        const button = screen.getByRole('button', { name: 'Go' });
        expect(button).toHaveAttribute('type', 'button');
        await user.click(button);
        expect(screen.getByRole('textbox')).not.toHaveFocus();
    });

    it('records the alignment of an addon, defaulting to the start', () => {
        renderUi(
            <InputGroup>
                <InputGroupAddon data-testid="a">a</InputGroupAddon>
                <InputGroupInput aria-label="x" />
                <InputGroupAddon data-testid="b" align="block-end">
                    b
                </InputGroupAddon>
            </InputGroup>,
        );
        expect(screen.getByTestId('a')).toHaveAttribute('data-align', 'inline-start');
        expect(screen.getByTestId('b')).toHaveAttribute('data-align', 'block-end');
    });

    it('works with a textarea', async () => {
        const { user } = renderUi(
            <InputGroup>
                <InputGroupTextarea aria-label="Reply" />
                <InputGroupAddon align="block-end">
                    <InputGroupText>0 / 2000</InputGroupText>
                </InputGroupAddon>
            </InputGroup>,
        );
        await user.type(screen.getByRole('textbox', { name: 'Reply' }), 'Hi');
        expect(screen.getByRole('textbox')).toHaveValue('Hi');
        await expectNoAxeViolations();
    });

    it('cannot be edited when its input is disabled', async () => {
        const { user } = renderUi(
            <InputGroup data-disabled="true">
                <InputGroupInput aria-label="Sender" disabled defaultValue="a" />
            </InputGroup>,
        );
        await user.type(screen.getByRole('textbox'), 'x');
        expect(screen.getByRole('textbox')).toHaveValue('a');
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('announces an invalid input with its message', async () => {
        renderUi(
            <>
                <InputGroup>
                    <InputGroupInput aria-label="Recipient" aria-invalid aria-describedby="recipient-error" />
                </InputGroup>
                <p id="recipient-error">Enter a full email address.</p>
            </>,
        );
        const input = screen.getByRole('textbox');
        expect(input).toBeInvalid();
        expect(input).toHaveAccessibleDescription('Enter a full email address.');
        await expectNoAxeViolations();
    });

    it('sets its size as data-size and hands it to its input and textarea, the provider size when it has none', () => {
        renderUi(
            <>
                <InputGroup size="sm" data-testid="small">
                    <InputGroupInput aria-label="Small" />
                </InputGroup>
                <InputGroup data-testid="unsized">
                    <InputGroupTextarea aria-label="Unsized" />
                </InputGroup>
            </>,
            { controlSize: 'lg' },
        );
        expect(screen.getByTestId('small')).toHaveAttribute('data-size', 'sm');
        expect(screen.getByRole('textbox', { name: 'Small' })).toHaveAttribute('data-size', 'sm');
        expect(screen.getByTestId('unsized')).toHaveAttribute('data-size', 'lg');
        expect(screen.getByRole('textbox', { name: 'Unsized' })).toHaveAttribute('data-size', 'lg');
    });

    it('sets the filled look as data-variant on the group only, the provider look when it has none', async () => {
        renderUi(
            <>
                <InputGroup variant="filled" data-testid="filled">
                    <InputGroupInput aria-label="Filled" />
                </InputGroup>
                <InputGroup data-testid="inherited">
                    <InputGroupInput aria-label="Inherited" />
                </InputGroup>
            </>,
            { fieldVariant: 'filled' },
        );
        expect(screen.getByTestId('filled')).toHaveAttribute('data-variant', 'filled');
        expect(screen.getByTestId('inherited')).toHaveAttribute('data-variant', 'filled');
        // The group draws the fill; its input keeps the default look.
        expect(screen.getByRole('textbox', { name: 'Filled' })).toHaveAttribute('data-variant', 'default');
        await expectNoAxeViolations();
    });

    it('empties a clearable input and moves the focus back with Enter on its clear button', async () => {
        const onChange = vi.fn();
        const { user } = renderUi(
            <InputGroup>
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput aria-label="Search" clearable defaultValue="bounce" onChange={onChange} />
            </InputGroup>,
        );
        const clear = screen.getByRole('button', { name: 'Clear' });
        // The clear button is one of the group's parts, after the input.
        expect(clear.parentElement).toHaveAttribute('data-slot', 'input-group');
        clear.focus();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('textbox')).toHaveValue('');
        expect(screen.getByRole('textbox')).toHaveFocus();
        expect(onChange).toHaveBeenCalledTimes(1);
        await expectNoAxeViolations();
    });

    it('holds a checkbox and a radio in addons, reached with Tab and toggled with Space', async () => {
        const { user } = renderUi(
            <>
                <InputGroup>
                    <InputGroupAddon>
                        <Checkbox aria-label="Send a copy" />
                    </InputGroupAddon>
                    <InputGroupInput aria-label="Copy address" />
                </InputGroup>
                <RadioGroup aria-label="Default connection">
                    <InputGroup>
                        <InputGroupInput aria-label="SMTP host" />
                        <InputGroupAddon align="inline-end">
                            <RadioGroupItem value="smtp" aria-label="Use SMTP" />
                        </InputGroupAddon>
                    </InputGroup>
                </RadioGroup>
            </>,
        );
        await user.tab();
        expect(screen.getByRole('checkbox', { name: 'Send a copy' })).toHaveFocus();
        await user.keyboard(' ');
        expect(screen.getByRole('checkbox')).toBeChecked();
        // A click on the checkbox does not send the focus to the input.
        await user.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).toHaveFocus();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
        await user.tab();
        expect(screen.getByRole('textbox', { name: 'Copy address' })).toHaveFocus();
        await user.click(screen.getByRole('radio', { name: 'Use SMTP' }));
        expect(screen.getByRole('radio', { name: 'Use SMTP' })).toBeChecked();
        await expectNoAxeViolations();
    });

    it('focuses the text input, not the checkbox’s hidden form input, when a checkbox cell is clicked in a form', async () => {
        const { user } = renderUi(
            <form>
                <InputGroup>
                    <InputGroupAddon data-testid="cell">
                        <Checkbox aria-label="Send a copy" name="copy" />
                    </InputGroupAddon>
                    <InputGroupInput aria-label="Copy address" />
                </InputGroup>
            </form>,
        );
        await user.click(screen.getByTestId('cell'));
        expect(screen.getByRole('textbox', { name: 'Copy address' })).toHaveFocus();
    });

    it('gives InputGroupText its data-slot', () => {
        renderUi(
            <InputGroup>
                <InputGroupAddon>
                    <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput aria-label="Tracking domain" />
            </InputGroup>,
        );
        expect(screen.getByText('https://')).toHaveAttribute('data-slot', 'input-group-text');
    });

    it('holds a select in an addon that opens with Enter and chooses with the arrow keys', async () => {
        const { user } = renderUi(
            <InputGroup>
                <InputGroupAddon>
                    <Select defaultValue="post">
                        <SelectTrigger aria-label="Request method">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="post">POST</SelectItem>
                            <SelectItem value="put">PUT</SelectItem>
                        </SelectContent>
                    </Select>
                </InputGroupAddon>
                <InputGroupInput aria-label="Webhook URL" />
            </InputGroup>,
        );
        const trigger = screen.getByRole('combobox', { name: 'Request method' });
        trigger.focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowDown}{Enter}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(trigger).toHaveTextContent('PUT');
        await expectNoAxeViolations();
    });
});
