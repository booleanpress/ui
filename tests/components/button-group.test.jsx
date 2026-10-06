import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Button } from '@/components/button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/button-group';
import { Input } from '@/components/input';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('ButtonGroup', () => {
    it('is a named group of buttons, each its own tab stop', async () => {
        const { user } = renderUi(
            <ButtonGroup aria-label="Log period">
                <Button variant="outline">Today</Button>
                <Button variant="outline">7 days</Button>
            </ButtonGroup>,
        );
        const group = screen.getByRole('group', { name: 'Log period' });
        expect(group.querySelectorAll('button')).toHaveLength(2);
        await user.tab();
        expect(screen.getByRole('button', { name: 'Today' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: '7 days' })).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('joins the buttons: the inner corners and borders go, vertical stacks them', () => {
        renderUi(
            <>
                <ButtonGroup aria-label="Row">Row</ButtonGroup>
                <ButtonGroup orientation="vertical" aria-label="Column">Column</ButtonGroup>
            </>,
        );
        expect(screen.getByRole('group', { name: 'Row' }).className).toContain('[&>*:not(:first-child)]:border-s-0');
        const column = screen.getByRole('group', { name: 'Column' });
        expect(column).toHaveAttribute('data-orientation', 'vertical');
        expect(column.className).toContain('flex-col');
    });

    it('lets a disabled button leave the tab order while the others work', async () => {
        const { user } = renderUi(
            <ButtonGroup aria-label="Pages">
                <Button disabled>Previous</Button>
                <Button>Next</Button>
            </ButtonGroup>,
        );
        await user.tab();
        expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
        expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
        await expectNoAxeViolations();
    });

    it('renders text, an input and a split-button separator', async () => {
        renderUi(
            <ButtonGroup aria-label="Test email">
                <ButtonGroupText>To</ButtonGroupText>
                <Input aria-label="Recipient" />
                <Button variant="outline">Send</Button>
                <ButtonGroupSeparator />
                <Button size="icon" aria-label="More">+</Button>
            </ButtonGroup>,
        );
        expect(screen.getByLabelText('Recipient')).toBeInTheDocument();
        expect(screen.getByText('To')).toHaveAttribute('data-slot', 'button-group-text');
        const separator = document.querySelector('[data-slot="button-group-separator"]');
        expect(separator).toHaveAttribute('data-orientation', 'vertical');
        expect(screen.queryByRole('separator')).toBeNull(); // decorative: hidden from assistive technology
        await expectNoAxeViolations();
    });
    it('passes each button its severity, size, raised and rounded flags, and gives the shadow to the group', async () => {
        renderUi(
            <ButtonGroup aria-label="Save options">
                <Button severity="success" size="sm" raised rounded>Save</Button>
                <Button severity="success" size="sm" raised rounded aria-label="More save options">+</Button>
            </ButtonGroup>,
        );
        const group = screen.getByRole('group', { name: 'Save options' });
        for (const button of screen.getAllByRole('button')) {
            expect(button).toHaveAttribute('data-severity', 'success');
            expect(button).toHaveAttribute('data-size', 'sm');
            expect(button).toHaveAttribute('data-raised', 'true');
            expect(button).toHaveAttribute('data-rounded', 'true');
        }
        // The group carries the raised shadow and the pill shape; its buttons give theirs up.
        expect(group.className).toContain('has-[>[data-raised=true]]:shadow-');
        expect(group.className).toContain('[&>[data-raised=true]]:shadow-none');
        expect(group.className).toContain('has-[>[data-rounded=true]]:rounded-full');
        await expectNoAxeViolations();
    });
});
