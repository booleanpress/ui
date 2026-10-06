import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from '@/components/field';
import { Checkbox } from '@/components/checkbox';
import { Input } from '@/components/input';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Field', () => {
    it('groups a label, control, description and an announced error', async () => {
        renderUi(
            <FieldSet>
                <FieldLegend>Connection</FieldLegend>
                <FieldGroup>
                    <Field data-invalid="true">
                        <FieldLabel htmlFor="port">Port</FieldLabel>
                        <Input id="port" aria-invalid="true" aria-describedby="port-help port-error" defaultValue="99999" />
                        <FieldDescription id="port-help">Usually 587.</FieldDescription>
                        <FieldError id="port-error">Use a port between 1 and 65535.</FieldError>
                    </Field>
                </FieldGroup>
            </FieldSet>,
        );
        expect(screen.getByRole('group', { name: 'Connection' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Port' })).toHaveAccessibleDescription('Usually 587. Use a port between 1 and 65535.');
        expect(screen.getByRole('alert')).toHaveTextContent('Use a port between 1 and 65535.');
        await expectNoAxeViolations();
    });

    it('shows one error from errors as text, several as a list without repeats, and nothing for none', async () => {
        const { rerender } = renderUi(<FieldError errors={[{ message: 'Enter a host.' }, { message: 'Enter a host.' }]} />);
        expect(screen.getByRole('alert')).toHaveTextContent('Enter a host.');
        expect(screen.queryByRole('list')).toBeNull();
        rerender(<FieldError errors={[{ message: 'Enter a host.' }, { message: 'Enter a port.' }, { message: 'Enter a host.' }]} />);
        expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Enter a host.', 'Enter a port.']);
        await expectNoAxeViolations();
        rerender(<FieldError errors={[]} />);
        expect(screen.queryByRole('alert')).toBeNull();
        rerender(<FieldError errors={[undefined]} />);
        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('records its orientation and lays a checkbox beside its label and description', async () => {
        const { user } = renderUi(
            <Field orientation="horizontal">
                <Checkbox id="bounces" />
                <FieldContent>
                    <FieldLabel htmlFor="bounces">Alert me about bounces</FieldLabel>
                    <FieldDescription>Sent once an hour, at most.</FieldDescription>
                </FieldContent>
            </Field>,
        );
        expect(screen.getByRole('group')).toHaveAttribute('data-orientation', 'horizontal');
        await user.click(screen.getByText('Alert me about bounces'));
        expect(screen.getByRole('checkbox', { name: 'Alert me about bounces' })).toBeChecked();
        await expectNoAxeViolations();
    });

    it('draws a separator with its text', () => {
        renderUi(<FieldSeparator>Sign-in</FieldSeparator>);
        expect(screen.getByText('Sign-in')).toHaveAttribute('data-slot', 'field-separator-content');
    });
});
