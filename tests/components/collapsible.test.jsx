import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Example(props) {
    return (
        <Collapsible {...props}>
            <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
            <CollapsibleContent>Port 587</CollapsibleContent>
        </Collapsible>
    );
}

describe('Collapsible', () => {
    it('opens and closes with Enter', async () => {
        const { user } = renderUi(<Example />);
        const trigger = screen.getByRole('button', { name: 'Advanced settings' });
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByText('Port 587')).toBeNull();
        await user.tab();
        expect(trigger).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('Port 587')).toBeInTheDocument();
        expect(trigger).toHaveAttribute('aria-controls', screen.getByText('Port 587').id);
        expect(trigger).toHaveFocus();
        await expectNoAxeViolations();
        await user.keyboard('{Enter}');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByText('Port 587')).toBeNull();
    });

    it('opens and closes with Space', async () => {
        const { user } = renderUi(<Example />);
        const trigger = screen.getByRole('button', { name: 'Advanced settings' });
        trigger.focus();
        await user.keyboard(' ');
        expect(trigger).toHaveAttribute('data-state', 'open');
        await user.keyboard(' ');
        expect(trigger).toHaveAttribute('data-state', 'closed');
    });

    it('starts open with defaultOpen', async () => {
        renderUi(<Example defaultOpen />);
        expect(screen.getByText('Port 587')).toBeVisible();
        expect(screen.getByRole('button', { name: 'Advanced settings' })).toHaveAttribute('aria-expanded', 'true');
        await expectNoAxeViolations();
    });

    it('follows `open` and reports changes through onOpenChange when controlled', async () => {
        const changes = [];
        const { user, rerender } = renderUi(<Example open={false} onOpenChange={(v) => changes.push(v)} />);
        await user.click(screen.getByRole('button', { name: 'Advanced settings' }));
        expect(changes).toEqual([true]);
        expect(screen.queryByText('Port 587')).toBeNull(); // the consumer has not changed `open`
        rerender(<Example open onOpenChange={(v) => changes.push(v)} />);
    });

    it('ignores the trigger while disabled', async () => {
        const { user } = renderUi(<Example disabled />);
        const trigger = screen.getByRole('button', { name: 'Advanced settings' });
        expect(trigger).toBeDisabled();
        await user.click(trigger);
        expect(screen.queryByText('Port 587')).toBeNull();
    });

    it('keeps closed content in the page with forceMount, marked closed', () => {
        renderUi(
            <Collapsible>
                <CollapsibleTrigger>Details</CollapsibleTrigger>
                <CollapsibleContent forceMount>Kept</CollapsibleContent>
            </Collapsible>,
        );
        expect(screen.getByText('Kept')).toHaveAttribute('data-state', 'closed');
    });
});
