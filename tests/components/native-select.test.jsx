import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Label } from '@/components/label';
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '@/components/native-select';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Encryption(props) {
    return (
        <>
            <Label htmlFor="encryption">Encryption</Label>
            <NativeSelect id="encryption" defaultValue="tls" {...props}>
                <NativeSelectOption value="none">None</NativeSelectOption>
                <NativeSelectOption value="tls">TLS</NativeSelectOption>
                <NativeSelectOption value="ssl">SSL</NativeSelectOption>
            </NativeSelect>
        </>
    );
}

describe('NativeSelect', () => {
    it('is named by its label and changes its value with the options', async () => {
        const { user } = renderUi(<Encryption />);
        const select = screen.getByRole('combobox', { name: 'Encryption' });
        expect(select).toHaveValue('tls');
        await user.selectOptions(select, 'SSL');
        expect(select).toHaveValue('ssl');
        await expectNoAxeViolations();
    });

    it('is reached with Tab and keeps the chevron out of the accessibility tree', async () => {
        const { user, container } = renderUi(<Encryption />);
        await user.tab();
        expect(screen.getByRole('combobox')).toHaveFocus();
        expect(container.querySelector('[data-slot="native-select-icon"]')).toHaveAttribute('aria-hidden', 'true');
    });

    it('sets the size on the select, defaulting to default', () => {
        renderUi(
            <>
                <NativeSelect aria-label="One">
                    <NativeSelectOption>a</NativeSelectOption>
                </NativeSelect>
                <NativeSelect aria-label="Two" size="sm">
                    <NativeSelectOption>a</NativeSelectOption>
                </NativeSelect>
            </>,
        );
        expect(screen.getByRole('combobox', { name: 'One' })).toHaveAttribute('data-size', 'default');
        expect(screen.getByRole('combobox', { name: 'Two' })).toHaveAttribute('data-size', 'sm');
    });

    it('groups options', async () => {
        renderUi(
            <NativeSelect aria-label="Mailer">
                <NativeSelectOptGroup label="API">
                    <NativeSelectOption value="ses">Amazon SES</NativeSelectOption>
                </NativeSelectOptGroup>
            </NativeSelect>,
        );
        expect(screen.getByRole('group', { name: 'API' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Amazon SES' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('cannot be changed when disabled', async () => {
        const { user } = renderUi(<Encryption disabled />);
        const select = screen.getByRole('combobox');
        expect(select).toBeDisabled();
        await user.selectOptions(select, 'SSL');
        expect(select).toHaveValue('tls');
    });

    it('announces an invalid select with its message', async () => {
        renderUi(
            <>
                <NativeSelect aria-label="Priority" aria-invalid aria-describedby="priority-error">
                    <NativeSelectOption value="">Choose one</NativeSelectOption>
                </NativeSelect>
                <p id="priority-error">Choose a priority.</p>
            </>,
        );
        const select = screen.getByRole('combobox');
        expect(select).toBeInvalid();
        expect(select).toHaveAccessibleDescription('Choose a priority.');
        await expectNoAxeViolations();
    });

    it('sets lg and filled on the select, and fluid on the wrapper', async () => {
        const { container } = renderUi(
            <NativeSelect aria-label="Retention" size="lg" variant="filled" fluid>
                <NativeSelectOption>30 days</NativeSelectOption>
            </NativeSelect>,
        );
        const select = screen.getByRole('combobox', { name: 'Retention' });
        expect(select).toHaveAttribute('data-size', 'lg');
        expect(select).toHaveAttribute('data-variant', 'filled');
        expect(container.querySelector('[data-slot="native-select-wrapper"]').className).toContain('w-full');
        await expectNoAxeViolations();
    });

    it('takes the provider controlSize and fieldVariant when given none', () => {
        renderUi(
            <NativeSelect aria-label="Retention">
                <NativeSelectOption>30 days</NativeSelectOption>
            </NativeSelect>,
            { controlSize: 'sm', fieldVariant: 'filled' },
        );
        const select = screen.getByRole('combobox', { name: 'Retention' });
        expect(select).toHaveAttribute('data-size', 'sm');
        expect(select).toHaveAttribute('data-variant', 'filled');
    });
});
