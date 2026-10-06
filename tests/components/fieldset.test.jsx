import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen } from '@testing-library/react';
import { Fieldset, FieldsetContent, FieldsetLegend } from '@/components/fieldset';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Sender(props) {
    return (
        <Fieldset {...props}>
            <FieldsetLegend>Sender</FieldsetLegend>
            <FieldsetContent>
                <label htmlFor="from-name">From name</label>
                <input id="from-name" name="fromName" defaultValue="Acme Support" />
            </FieldsetContent>
        </Fieldset>
    );
}

const legendButton = () => screen.getByRole('button', { name: 'Sender' });

describe('Fieldset', () => {
    it('renders a native fieldset named by its legend', async () => {
        renderUi(<Sender />);
        const group = screen.getByRole('group', { name: 'Sender' });
        expect(group.tagName).toBe('FIELDSET');
        expect(screen.getByText('Sender').tagName).toBe('LEGEND');
        expect(screen.queryByRole('button')).toBeNull();
        await expectNoAxeViolations();
    });

    it('makes the legend a disclosure button when toggleable', async () => {
        const { container } = renderUi(<Sender toggleable />);
        expect(screen.getByRole('group', { name: 'Sender' })).toBeInTheDocument();
        const button = legendButton();
        expect(button.closest('legend')).not.toBeNull();
        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(button).toHaveAttribute('aria-controls', container.querySelector('[data-slot="fieldset-content"]').id);
        await expectNoAxeViolations();
    });

    it('shows and hides the content with Enter', async () => {
        const { user } = renderUi(<Sender toggleable />);
        legendButton().focus();
        await user.keyboard('{Enter}');
        expect(legendButton()).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByLabelText('From name')).not.toBeVisible();
        await expectNoAxeViolations();
        await user.keyboard('{Enter}');
        expect(legendButton()).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByLabelText('From name')).toBeVisible();
    });

    it('shows and hides the content with Space', async () => {
        const { user } = renderUi(<Sender toggleable />);
        legendButton().focus();
        await user.keyboard(' ');
        expect(legendButton()).toHaveAttribute('aria-expanded', 'false');
        await user.keyboard(' ');
        expect(legendButton()).toHaveAttribute('aria-expanded', 'true');
    });

    it('starts closed with defaultOpen={false}', () => {
        renderUi(<Sender toggleable defaultOpen={false} />);
        expect(legendButton()).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByLabelText('From name')).not.toBeVisible();
    });

    it('keeps what was typed while folded, and still submits the folded fields with the form', async () => {
        const { user, container } = renderUi(
            <form aria-label="Settings">
                <Sender toggleable />
            </form>,
        );
        const field = screen.getByLabelText('From name');
        await user.clear(field);
        await user.type(field, 'Billing team');
        await user.click(legendButton());
        expect(legendButton()).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByLabelText('From name')).not.toBeVisible();
        expect(container.querySelector('[data-slot="fieldset-content"]')).toHaveAttribute('hidden');
        expect(new FormData(container.querySelector('form')).get('fromName')).toBe('Billing team');
        await user.click(legendButton());
        expect(screen.getByLabelText('From name')).toBeVisible();
        expect(screen.getByLabelText('From name')).toHaveValue('Billing team');
    });

    it('opens a folded section when the form finds a field in it invalid, so the field can show its message', async () => {
        const { user, container } = renderUi(
            <form aria-label="Settings">
                <Fieldset toggleable defaultOpen={false}>
                    <FieldsetLegend>Sender</FieldsetLegend>
                    <FieldsetContent>
                        <label htmlFor="reply-to">Reply-to</label>
                        <input id="reply-to" name="replyTo" required />
                    </FieldsetContent>
                </Fieldset>
            </form>,
        );
        expect(screen.getByLabelText('Reply-to')).not.toBeVisible();
        expect(container.querySelector('form').checkValidity()).toBe(false);
        expect(legendButton()).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByLabelText('Reply-to')).toBeVisible();
        await user.type(screen.getByLabelText('Reply-to'), 'help@example.com');
        expect(container.querySelector('form').checkValidity()).toBe(true);
    });

    it('hides the folded content only once its closing slide has ended', async () => {
        // jsdom runs no animations; an inline slide stands in for the theme's.
        const { user, container } = renderUi(
            <Fieldset toggleable>
                <FieldsetLegend>Sender</FieldsetLegend>
                <FieldsetContent style={{ animationName: 'collapsible-up', animationDuration: '200ms' }}>
                    From Acme Support
                </FieldsetContent>
            </Fieldset>,
        );
        const content = container.querySelector('[data-slot="fieldset-content"]');
        await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
        await user.click(legendButton());
        expect(content).toHaveAttribute('data-state', 'closed');
        expect(content).not.toHaveAttribute('hidden');
        fireEvent.animationEnd(content);
        expect(content).toHaveAttribute('hidden');
    });

    it('follows a controlled open state and reports changes', async () => {
        const onChange = vi.fn();
        function Controlled() {
            const [open, setOpen] = useState(true);
            return (
                <>
                    <button type="button" onClick={() => setOpen(false)}>
                        Close
                    </button>
                    <Sender
                        toggleable
                        open={open}
                        onOpenChange={(next) => {
                            onChange(next);
                            setOpen(next);
                        }}
                    />
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Close' }));
        expect(legendButton()).toHaveAttribute('aria-expanded', 'false');
        await user.click(legendButton());
        expect(onChange).toHaveBeenLastCalledWith(true);
        expect(screen.getByLabelText('From name')).toBeVisible();
    });

    it('draws a minus while open and a plus while closed, or a custom indicator, hidden from assistive technology', () => {
        const { container, unmount } = renderUi(<Sender toggleable />);
        const indicator = container.querySelector('[data-slot="fieldset-indicator"]');
        expect(indicator).toHaveAttribute('aria-hidden', 'true');
        expect(indicator.querySelector('.lucide-minus')).not.toBeNull();
        expect(indicator.querySelector('.lucide-plus')).not.toBeNull();
        unmount();
        renderUi(
            <Fieldset toggleable>
                <FieldsetLegend indicator={<span data-testid="chevron">v</span>}>Tracking</FieldsetLegend>
                <FieldsetContent>Off</FieldsetContent>
            </Fieldset>
        );
        expect(screen.getByTestId('chevron')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Tracking' })).toBeInTheDocument();
    });

    it('disables the controls inside but keeps the legend toggle working when disabled', async () => {
        const { user } = renderUi(<Sender toggleable disabled />);
        expect(screen.getByLabelText('From name')).toBeDisabled();
        expect(legendButton()).not.toBeDisabled();
        await user.click(legendButton());
        expect(legendButton()).toHaveAttribute('aria-expanded', 'false');
        await expectNoAxeViolations();
    });
});
