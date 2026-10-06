import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { MailIcon } from 'lucide-react';
import { InFieldLabel } from '@/components/in-field-label';
import { Input } from '@/components/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';
import { InputMask } from '@/components/input-mask';
import { InputNumber } from '@/components/input-number';
import { Label } from '@/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('InFieldLabel', () => {
    it('names its field with its label and takes typing', async () => {
        const { user } = renderUi(
            <InFieldLabel>
                <Input id="from-name" />
                <Label htmlFor="from-name">From name</Label>
            </InFieldLabel>,
        );
        const input = screen.getByRole('textbox', { name: 'From name' });
        expect(input.closest('[data-slot=in-field-label]')).not.toBeNull();
        await user.type(input, 'Acme Support');
        expect(input).toHaveValue('Acme Support');
        await expectNoAxeViolations();
    });

    it('works with a textarea and an input group with an icon', async () => {
        renderUi(
            <>
                <InFieldLabel>
                    <Textarea id="note" />
                    <Label htmlFor="note">Note</Label>
                </InFieldLabel>
                <InFieldLabel>
                    <InputGroup>
                        <InputGroupInput id="email" placeholder="support@example.com" />
                        <InputGroupAddon>
                            <MailIcon />
                        </InputGroupAddon>
                    </InputGroup>
                    <Label htmlFor="email">From email</Label>
                </InFieldLabel>
            </>,
        );
        expect(screen.getByRole('textbox', { name: 'Note' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'From email' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('names a Select and keeps it working', async () => {
        const { user } = renderUi(
            <InFieldLabel>
                <Select defaultValue="weekly">
                    <SelectTrigger id="digest">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Every day</SelectItem>
                        <SelectItem value="weekly">Every week</SelectItem>
                    </SelectContent>
                </Select>
                <Label htmlFor="digest">Delivery report</Label>
            </InFieldLabel>,
        );
        const trigger = screen.getByRole('combobox', { name: 'Delivery report' });
        trigger.focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await user.keyboard('{ArrowUp}{Enter}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(trigger).toHaveTextContent('Every day');
        await expectNoAxeViolations();
    });

    it('names an InputNumber and an InputMask and keeps them working', async () => {
        const { user } = renderUi(
            <>
                <InFieldLabel>
                    <InputNumber id="quota" suffix="emails" />
                    <Label htmlFor="quota">Monthly quota</Label>
                </InFieldLabel>
                <InFieldLabel>
                    <InputMask id="vat" mask="aa999999999" />
                    <Label htmlFor="vat">VAT number</Label>
                </InFieldLabel>
            </>,
        );
        const quota = screen.getByRole('textbox', { name: 'Monthly quota' });
        await user.type(quota, '25000');
        await user.tab();
        expect(quota).toHaveValue('25,000');
        const vat = screen.getByRole('textbox', { name: 'VAT number' });
        await user.type(vat, 'GB12');
        expect(vat.value.startsWith('GB12')).toBe(true);
        await expectNoAxeViolations();
    });

    it('keeps an invalid field named and described', async () => {
        renderUi(
            <>
                <InFieldLabel>
                    <Input id="key" defaultValue="key_test" aria-invalid aria-describedby="key-error" />
                    <Label htmlFor="key">API key</Label>
                </InFieldLabel>
                <p id="key-error">A live API key starts with key_live_.</p>
            </>,
        );
        const input = screen.getByRole('textbox', { name: 'API key' });
        expect(input).toBeInvalid();
        expect(input).toHaveAccessibleDescription('A live API key starts with key_live_.');
        await expectNoAxeViolations();
    });
});
