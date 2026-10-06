import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { MailIcon } from 'lucide-react';
import { FloatLabel } from '@/components/float-label';
import { Input } from '@/components/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';
import { InputMask } from '@/components/input-mask';
import { InputNumber } from '@/components/input-number';
import { Label } from '@/components/label';
import { NativeSelect, NativeSelectOption } from '@/components/native-select';
import { PasswordInput } from '@/components/password-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const wrapperOf = (element) => element.closest('[data-slot=float-label]');

describe('FloatLabel', () => {
    it('names its field with its label', async () => {
        renderUi(
            <FloatLabel>
                <Input id="from-name" />
                <Label htmlFor="from-name">From name</Label>
            </FloatLabel>,
        );
        expect(screen.getByRole('textbox', { name: 'From name' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('defaults to the over variant and records the variant it is given', () => {
        renderUi(
            <>
                <FloatLabel data-testid="over">
                    <Input id="a" />
                    <Label htmlFor="a">A</Label>
                </FloatLabel>
                <FloatLabel data-testid="in" variant="in">
                    <Input id="b" />
                    <Label htmlFor="b">B</Label>
                </FloatLabel>
                <FloatLabel data-testid="on" variant="on">
                    <Input id="c" />
                    <Label htmlFor="c">C</Label>
                </FloatLabel>
            </>,
        );
        expect(screen.getByTestId('over')).toHaveAttribute('data-variant', 'over');
        expect(screen.getByTestId('in')).toHaveAttribute('data-variant', 'in');
        expect(screen.getByTestId('on')).toHaveAttribute('data-variant', 'on');
    });

    it('marks itself filled while the field has a value, on typing and on clearing', async () => {
        const { user } = renderUi(
            <FloatLabel>
                <Input id="host" clearable />
                <Label htmlFor="host">SMTP host</Label>
            </FloatLabel>,
        );
        const input = screen.getByRole('textbox', { name: 'SMTP host' });
        expect(wrapperOf(input)).not.toHaveAttribute('data-filled');
        await user.type(input, 'smtp.example.com');
        expect(wrapperOf(input)).toHaveAttribute('data-filled');
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(wrapperOf(input)).not.toHaveAttribute('data-filled');
        await user.type(input, 'a');
        await user.keyboard('{Backspace}');
        expect(wrapperOf(input)).not.toHaveAttribute('data-filled');
    });

    it('starts filled with a default value', () => {
        renderUi(
            <FloatLabel>
                <Input id="port" defaultValue="587" />
                <Label htmlFor="port">SMTP port</Label>
            </FloatLabel>,
        );
        expect(wrapperOf(screen.getByRole('textbox'))).toHaveAttribute('data-filled');
    });

    it('follows a controlled value set from code', async () => {
        function Controlled() {
            const [value, setValue] = useState('');
            return (
                <>
                    <FloatLabel>
                        <Input id="domain" value={value} onChange={(e) => setValue(e.target.value)} />
                        <Label htmlFor="domain">Sending domain</Label>
                    </FloatLabel>
                    <button type="button" onClick={() => setValue('mail.example.com')}>
                        Fill
                    </button>
                    <button type="button" onClick={() => setValue('')}>
                        Empty
                    </button>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        const input = screen.getByRole('textbox', { name: 'Sending domain' });
        expect(wrapperOf(input)).not.toHaveAttribute('data-filled');
        await user.click(screen.getByRole('button', { name: 'Fill' }));
        expect(wrapperOf(input)).toHaveAttribute('data-filled');
        await user.click(screen.getByRole('button', { name: 'Empty' }));
        expect(wrapperOf(input)).not.toHaveAttribute('data-filled');
    });

    it('follows a form reset, which puts the field back without an input event', async () => {
        const { user } = renderUi(
            <form>
                <FloatLabel>
                    <Input id="from" name="from" defaultValue="Acme Support" />
                    <Label htmlFor="from">From name</Label>
                </FloatLabel>
                <FloatLabel>
                    <Input id="reply" name="reply" />
                    <Label htmlFor="reply">Reply-to</Label>
                </FloatLabel>
                <button type="reset">Reset</button>
            </form>,
        );
        const from = screen.getByRole('textbox', { name: 'From name' });
        const reply = screen.getByRole('textbox', { name: 'Reply-to' });
        await user.clear(from);
        await user.type(reply, 'help@example.com');
        expect(wrapperOf(from)).not.toHaveAttribute('data-filled');
        expect(wrapperOf(reply)).toHaveAttribute('data-filled');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        expect(from).toHaveValue('Acme Support');
        await waitFor(() => expect(wrapperOf(from)).toHaveAttribute('data-filled'));
        expect(reply).toHaveValue('');
        expect(wrapperOf(reply)).not.toHaveAttribute('data-filled');
    });

    it('reads a controlled value from a parent that re-renders it', () => {
        const ui = (value) => (
            <FloatLabel>
                <Textarea id="note" value={value} onChange={() => {}} />
                <Label htmlFor="note">Note</Label>
            </FloatLabel>
        );
        const { rerender } = renderUi(ui(''));
        const box = screen.getByRole('textbox', { name: 'Note' });
        expect(wrapperOf(box)).not.toHaveAttribute('data-filled');
        rerender(ui('Resent today.'));
        expect(wrapperOf(screen.getByRole('textbox', { name: 'Note' }))).toHaveAttribute('data-filled');
    });

    it('works with a textarea, a password input and an input group with a leading icon', async () => {
        const { user } = renderUi(
            <>
                <FloatLabel>
                    <Textarea id="reply" />
                    <Label htmlFor="reply">Reply</Label>
                </FloatLabel>
                <FloatLabel>
                    <PasswordInput id="secret" />
                    <Label htmlFor="secret">Secret</Label>
                </FloatLabel>
                <FloatLabel>
                    <InputGroup>
                        <InputGroupInput id="email" />
                        <InputGroupAddon>
                            <MailIcon />
                        </InputGroupAddon>
                    </InputGroup>
                    <Label htmlFor="email">From email</Label>
                </FloatLabel>
            </>,
        );
        await user.type(screen.getByRole('textbox', { name: 'Reply' }), 'Hi');
        await user.type(screen.getByLabelText('Secret'), 'x');
        await user.type(screen.getByRole('textbox', { name: 'From email' }), 'a@example.com');
        expect(wrapperOf(screen.getByRole('textbox', { name: 'Reply' }))).toHaveAttribute('data-filled');
        expect(wrapperOf(screen.getByLabelText('Secret'))).toHaveAttribute('data-filled');
        expect(wrapperOf(screen.getByRole('textbox', { name: 'From email' }))).toHaveAttribute('data-filled');
        await expectNoAxeViolations();
    });

    it('marks itself filled when a native select gets an option with a value', async () => {
        const { user } = renderUi(
            <FloatLabel>
                <NativeSelect id="encryption" defaultValue="">
                    <NativeSelectOption value="" />
                    <NativeSelectOption value="tls">TLS</NativeSelectOption>
                </NativeSelect>
                <Label htmlFor="encryption">Encryption</Label>
            </FloatLabel>,
        );
        const select = screen.getByRole('combobox', { name: 'Encryption' });
        expect(wrapperOf(select)).not.toHaveAttribute('data-filled');
        await user.selectOptions(select, 'tls');
        expect(wrapperOf(select)).toHaveAttribute('data-filled');
        await expectNoAxeViolations();
    });

    it('marks itself filled when a Select gets a value', async () => {
        const { user } = renderUi(
            <FloatLabel>
                <Select>
                    <SelectTrigger id="provider">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                    </SelectContent>
                </Select>
                <Label htmlFor="provider">Email provider</Label>
            </FloatLabel>,
        );
        const trigger = screen.getByRole('combobox', { name: 'Email provider' });
        expect(wrapperOf(trigger)).not.toHaveAttribute('data-filled');
        trigger.focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        await waitFor(() => expect(wrapperOf(trigger)).toHaveAttribute('data-filled'));
        await expectNoAxeViolations();
    });

    it('works with an InputNumber: named, filled by typing and by its buttons, emptied by clearing', async () => {
        const { user } = renderUi(
            <>
                <FloatLabel variant="in">
                    <InputNumber id="limit" />
                    <Label htmlFor="limit">Daily limit</Label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputNumber id="retries" buttons="horizontal" min={0} />
                    <Label htmlFor="retries">Retries</Label>
                </FloatLabel>
            </>,
        );
        const limit = screen.getByRole('textbox', { name: 'Daily limit' });
        expect(wrapperOf(limit)).not.toHaveAttribute('data-filled');
        await user.type(limit, '1200');
        expect(wrapperOf(limit)).toHaveAttribute('data-filled');
        await user.clear(limit);
        expect(wrapperOf(limit)).not.toHaveAttribute('data-filled');
        const retries = screen.getByRole('textbox', { name: 'Retries' });
        await user.click(screen.getAllByRole('button', { name: 'Increase' })[0]);
        await waitFor(() => expect(wrapperOf(retries)).toHaveAttribute('data-filled'));
        await expectNoAxeViolations();
    });

    it('works with an InputMask: named, and filled once a character is typed', async () => {
        const { user } = renderUi(
            <FloatLabel variant="in">
                <InputMask id="phone" mask="(999) 999-9999" />
                <Label htmlFor="phone">Support phone</Label>
            </FloatLabel>,
        );
        const phone = screen.getByRole('textbox', { name: 'Support phone' });
        expect(wrapperOf(phone)).not.toHaveAttribute('data-filled');
        await user.type(phone, '555');
        expect(phone).toHaveValue('(555) ___-____');
        expect(wrapperOf(phone)).toHaveAttribute('data-filled');
        await expectNoAxeViolations();
    });

    it('keeps an invalid field named and described', async () => {
        renderUi(
            <>
                <FloatLabel>
                    <Input id="host" aria-invalid aria-describedby="host-error" />
                    <Label htmlFor="host">SMTP host</Label>
                </FloatLabel>
                <p id="host-error">Enter the host your provider gave you.</p>
            </>,
        );
        const input = screen.getByRole('textbox', { name: 'SMTP host' });
        expect(input).toBeInvalid();
        expect(input).toHaveAccessibleDescription('Enter the host your provider gave you.');
        await expectNoAxeViolations();
    });
});
