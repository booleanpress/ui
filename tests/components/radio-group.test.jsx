import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Label } from '@/components/label';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Mode({ onValueChange, itemProps = {}, ...props }) {
    return (
        <RadioGroup aria-label="Sending mode" onValueChange={onValueChange} {...props}>
            {[
                ['instant', 'Send at once'],
                ['queue', 'Send through the queue'],
                ['off', 'Do not send'],
            ].map(([value, label]) => (
                <div key={value} className="flex items-center gap-2">
                    <RadioGroupItem id={`mode-${value}`} value={value} {...(itemProps[value] ?? {})} />
                    <Label htmlFor={`mode-${value}`}>{label}</Label>
                </div>
            ))}
        </RadioGroup>
    );
}

const radio = (name) => screen.getByRole('radio', { name });

describe('RadioGroup', () => {
    it('renders a radiogroup of radios, one checked', async () => {
        renderUi(<Mode defaultValue="queue" />);
        expect(screen.getByRole('radiogroup', { name: 'Sending mode' })).toBeInTheDocument();
        expect(screen.getAllByRole('radio')).toHaveLength(3);
        expect(radio('Send through the queue')).toHaveAttribute('aria-checked', 'true');
        expect(radio('Send at once')).toHaveAttribute('aria-checked', 'false');
        await expectNoAxeViolations();
    });

    it('puts only the checked radio in the tab order and moves focus into it with Tab', async () => {
        const { user } = renderUi(<Mode defaultValue="queue" />);
        await user.tab();
        expect(radio('Send through the queue')).toHaveFocus();
        expect(radio('Send at once')).toHaveAttribute('tabindex', '-1');
    });

    it('leaves the group with a second Tab', async () => {
        const { user } = renderUi(
            <>
                <Mode defaultValue="queue" />
                <button type="button">After</button>
            </>,
        );
        await user.tab();
        await user.tab();
        expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('focuses the first radio with Tab when none is checked', async () => {
        const { user } = renderUi(<Mode />);
        await user.tab();
        expect(radio('Send at once')).toHaveFocus();
    });

    it('moves focus and checks the next radio with the Down and Right arrows, wrapping at the end', async () => {
        const values = [];
        const { user } = renderUi(<Mode defaultValue="queue" onValueChange={(v) => values.push(v)} />);
        await user.tab();
        // Radix checks the radio that the arrow key focuses only while the key is still held, so hold it.
        await user.keyboard('{ArrowDown>}');
        await waitFor(() => expect(radio('Do not send')).toHaveFocus());
        await user.keyboard('{/ArrowDown}');
        expect(radio('Do not send')).toHaveAttribute('aria-checked', 'true');
        await user.keyboard('{ArrowRight>}');
        await waitFor(() => expect(radio('Send at once')).toHaveFocus());
        await user.keyboard('{/ArrowRight}');
        expect(values).toEqual(['off', 'instant']);
    });

    it('moves focus and checks the previous radio with the Up and Left arrows, wrapping at the start', async () => {
        const { user } = renderUi(<Mode defaultValue="queue" />);
        await user.tab();
        await user.keyboard('{ArrowUp>}');
        await waitFor(() => expect(radio('Send at once')).toHaveFocus());
        await user.keyboard('{/ArrowUp}');
        await user.keyboard('{ArrowLeft>}');
        await waitFor(() => expect(radio('Do not send')).toHaveFocus());
        await user.keyboard('{/ArrowLeft}');
        expect(radio('Do not send')).toHaveAttribute('aria-checked', 'true');
    });

    it('checks the focused radio with Space', async () => {
        const { user } = renderUi(<Mode />);
        await user.tab();
        expect(radio('Send at once')).toHaveAttribute('aria-checked', 'false');
        await user.keyboard(' ');
        expect(radio('Send at once')).toHaveAttribute('aria-checked', 'true');
    });

    it('checks a radio when its label is clicked', async () => {
        const { user } = renderUi(<Mode />);
        await user.click(screen.getByText('Do not send'));
        expect(radio('Do not send')).toHaveAttribute('data-state', 'checked');
    });

    it('follows the reading direction in RTL: Left moves to the next radio', async () => {
        const { user } = renderUi(<Mode defaultValue="queue" orientation="horizontal" />, { dir: 'rtl' });
        await user.tab();
        await user.keyboard('{ArrowLeft}');
        expect(radio('Do not send')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(radio('Send through the queue')).toHaveFocus();
    });

    it('is controlled by value', async () => {
        function Controlled() {
            const [value, setValue] = useState('off');
            return (
                <>
                    <Mode value={value} onValueChange={setValue} />
                    <p>Mode: {value}</p>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(radio('Do not send')).toHaveAttribute('aria-checked', 'true');
        await user.click(radio('Send at once'));
        expect(screen.getByText('Mode: instant')).toBeInTheDocument();
        expect(radio('Send at once')).toHaveAttribute('aria-checked', 'true');
    });

    it('ignores clicks and arrows while the whole group is disabled', async () => {
        const { user } = renderUi(<Mode defaultValue="queue" disabled />);
        await user.click(radio('Send at once'));
        expect(radio('Send at once')).toHaveAttribute('aria-checked', 'false');
        expect(radio('Send through the queue')).toBeDisabled();
        await expectNoAxeViolations();
    });

    it('skips a disabled radio when moving with the arrows', async () => {
        const { user } = renderUi(<Mode defaultValue="instant" itemProps={{ queue: { disabled: true } }} />);
        expect(radio('Send through the queue')).toBeDisabled();
        await user.tab();
        await user.keyboard('{ArrowDown}');
        expect(radio('Do not send')).toHaveFocus();
    });

    it('announces an invalid group with its error message', async () => {
        renderUi(
            <>
                <Mode aria-invalid aria-describedby="mode-error" itemProps={{ instant: { 'aria-invalid': true } }} />
                <p id="mode-error">Choose how mail is sent.</p>
            </>,
        );
        expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('Choose how mail is sent.');
        expect(radio('Send at once')).toHaveAttribute('aria-invalid', 'true');
        await expectNoAxeViolations();
    });

    it('passes the group size and variant to its radios, and a radio keeps its own', async () => {
        renderUi(
            <Mode size="lg" variant="filled" defaultValue="queue" itemProps={{ off: { size: 'sm' } }} />,
        );
        expect(radio('Send at once')).toHaveAttribute('data-size', 'lg');
        expect(radio('Send at once')).toHaveAttribute('data-variant', 'filled');
        expect(radio('Do not send')).toHaveAttribute('data-size', 'sm');
        await expectNoAxeViolations();
    });

    it('takes the provider controlSize and fieldVariant when given none', () => {
        renderUi(<Mode />, { controlSize: 'sm', fieldVariant: 'filled' });
        expect(radio('Send at once')).toHaveAttribute('data-size', 'sm');
        expect(radio('Send at once')).toHaveAttribute('data-variant', 'filled');
    });

    it('submits the chosen value under name, is required until one is chosen, and resets with the form', async () => {
        const { user } = renderUi(
            <form aria-label="Settings">
                <Mode name="mode" required />
                <button type="reset">Reset</button>
            </form>,
        );
        const form = screen.getByRole('form');
        expect(form.checkValidity()).toBe(false);
        await user.click(radio('Do not send'));
        expect(new FormData(form).get('mode')).toBe('off');
        expect(form.checkValidity()).toBe(true);
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        await waitFor(() => expect(radio('Do not send')).toHaveAttribute('aria-checked', 'false'));
        expect(new FormData(form).get('mode')).toBeNull();
    });

    it('renders radios from an array and moves through them with the arrows', async () => {
        const departments = ['Billing', 'Sales', 'Support'];
        const { user } = renderUi(
            <RadioGroup aria-label="Route new tickets to" defaultValue="Billing">
                {departments.map((name) => (
                    <div key={name} className="flex items-center gap-2">
                        <RadioGroupItem id={`d-${name}`} value={name} />
                        <Label htmlFor={`d-${name}`}>{name}</Label>
                    </div>
                ))}
            </RadioGroup>,
        );
        expect(screen.getAllByRole('radio')).toHaveLength(3);
        await user.tab();
        await user.keyboard('{ArrowDown}');
        expect(radio('Sales')).toHaveFocus();
    });
});
