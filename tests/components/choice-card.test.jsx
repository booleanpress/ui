import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { ChoiceCard, ChoiceCardGroup } from '@/components/choice-card';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Plans(props) {
    return (
        <ChoiceCardGroup type="single" aria-label="Plan" {...props}>
            <ChoiceCard value="starter" title="Starter" aside="$0/month" description="For one site sending its own receipts." />
            <ChoiceCard value="pro" title="Pro" icon={<svg data-testid="icon" />} description="For teams sending from several sites." />
            <ChoiceCard value="agency" title="Agency" description="For agencies running mail for their clients." />
        </ChoiceCardGroup>
    );
}

function Alerts(props) {
    return (
        <ChoiceCardGroup type="multiple" aria-label="Notify me about" {...props}>
            <ChoiceCard value="bounces" title="Bounces" description="A message could not be delivered." />
            <ChoiceCard value="complaints" title="Complaints" description="A recipient marked a message as spam." />
        </ChoiceCardGroup>
    );
}

const radio = (name) => screen.getByRole('radio', { name });
const box = (name) => screen.getByRole('checkbox', { name });

describe('ChoiceCard', () => {
    it('renders single cards as a named radio group, each radio named by its title and described by the rest', async () => {
        renderUi(<Plans defaultValue="pro" />);
        expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
        expect(radio('Pro')).toHaveAttribute('aria-checked', 'true');
        expect(radio('Starter')).toHaveAccessibleDescription('$0/month For one site sending its own receipts.');
        expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
        await expectNoAxeViolations();
    });

    it('chooses a card when any part of it is clicked', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Plans onValueChange={onValueChange} />);
        await user.click(screen.getByText('For agencies running mail for their clients.'));
        expect(radio('Agency')).toHaveAttribute('aria-checked', 'true');
        expect(onValueChange).toHaveBeenLastCalledWith('agency');
    });

    it('moves to the chosen card with Tab and chooses the next one with ArrowDown', async () => {
        const { user } = renderUi(<Plans defaultValue="starter" />);
        await user.tab();
        expect(radio('Starter')).toHaveFocus();
        await user.keyboard('{ArrowDown>}');
        await waitFor(() => expect(radio('Pro')).toHaveFocus());
        await user.keyboard('{/ArrowDown}');
        expect(radio('Pro')).toHaveAttribute('aria-checked', 'true');
        await user.keyboard('{ArrowUp>}');
        await waitFor(() => expect(radio('Starter')).toHaveFocus());
        await user.keyboard('{/ArrowUp}');
        expect(radio('Starter')).toHaveAttribute('aria-checked', 'true');
    });

    it('chooses the focused radio card with Space', async () => {
        const { user } = renderUi(<Plans />);
        await user.tab();
        expect(radio('Starter')).toHaveFocus();
        await user.keyboard(' ');
        expect(radio('Starter')).toHaveAttribute('aria-checked', 'true');
    });

    it('renders multiple cards as checkboxes that toggle with Space and with a click', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Alerts defaultValue={['bounces']} onValueChange={onValueChange} />);
        expect(screen.getByRole('group', { name: 'Notify me about' })).toBeInTheDocument();
        expect(box('Bounces')).toHaveAttribute('aria-checked', 'true');
        await user.tab();
        expect(box('Bounces')).toHaveFocus();
        await user.keyboard(' ');
        expect(onValueChange).toHaveBeenLastCalledWith([]);
        await user.click(screen.getByText('A recipient marked a message as spam.'));
        expect(box('Complaints')).toHaveAttribute('aria-checked', 'true');
        expect(onValueChange).toHaveBeenLastCalledWith(['complaints']);
        await expectNoAxeViolations();
    });

    it('takes a disabled card out of the choice', async () => {
        const { user } = renderUi(
            <ChoiceCardGroup type="single" defaultValue="daily" aria-label="Log retention">
                <ChoiceCard value="daily" title="30 days" />
                <ChoiceCard value="forever" title="Keep forever" disabled />
            </ChoiceCardGroup>,
        );
        expect(radio('Keep forever')).toBeDisabled();
        await user.click(screen.getByText('Keep forever'));
        expect(radio('30 days')).toHaveAttribute('aria-checked', 'true');
        await expectNoAxeViolations();
    });

    it('disables every card when the group is disabled', () => {
        renderUi(<Alerts disabled />);
        expect(box('Bounces')).toBeDisabled();
        expect(box('Complaints')).toBeDisabled();
    });

    it('marks every control invalid with aria-invalid on the group', async () => {
        renderUi(
            <>
                <Plans aria-invalid aria-describedby="plan-error" />
                <p id="plan-error">Choose a plan.</p>
            </>,
        );
        for (const name of ['Starter', 'Pro', 'Agency']) expect(radio(name)).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('Choose a plan.');
        await expectNoAxeViolations();
    });

    it('puts the radio at the end and the checkbox at the start unless told otherwise', () => {
        const { unmount } = renderUi(<Plans />);
        const card = screen.getByText('Starter').closest('[data-slot=choice-card]');
        expect(card.lastElementChild).toBe(radio('Starter'));
        unmount();
        renderUi(
            <ChoiceCardGroup type="multiple" aria-label="Alerts">
                <ChoiceCard value="a" title="Bounces" />
                <ChoiceCard value="b" title="Complaints" indicator="end" />
            </ChoiceCardGroup>,
        );
        expect(screen.getByText('Bounces').closest('[data-slot=choice-card]').firstElementChild).toBe(box('Bounces'));
        expect(screen.getByText('Complaints').closest('[data-slot=choice-card]').lastElementChild).toBe(box('Complaints'));
    });

    it('hands its size to the controls', () => {
        renderUi(<Plans size="sm" />);
        expect(radio('Pro')).toHaveAttribute('data-size', 'sm');
    });

    it('goes back to its first value when the form is reset, single and multiple', async () => {
        const { user } = renderUi(
            <form aria-label="Signup">
                <Plans name="plan" defaultValue="starter" />
                <Alerts name="alerts" defaultValue={['bounces']} />
                <button type="reset">Reset</button>
            </form>,
        );
        await user.click(screen.getByText('Agency'));
        await user.click(screen.getByText('Bounces'));
        await user.click(screen.getByText('Complaints'));
        expect(new FormData(screen.getByRole('form')).getAll('alerts')).toEqual(['complaints']);
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        await waitFor(() => expect(radio('Starter')).toHaveAttribute('aria-checked', 'true'));
        expect(box('Bounces')).toHaveAttribute('aria-checked', 'true');
        expect(box('Complaints')).toHaveAttribute('aria-checked', 'false');
        const data = new FormData(screen.getByRole('form'));
        expect(data.get('plan')).toBe('starter');
        expect(data.getAll('alerts')).toEqual(['bounces']);
    });

    it('submits the chosen value under its name', async () => {
        const { user } = renderUi(
            <form aria-label="Signup">
                <Plans name="plan" />
            </form>,
        );
        await user.click(screen.getByText('Pro'));
        expect(new FormData(screen.getByRole('form')).get('plan')).toBe('pro');
    });
});

describe('ChoiceCardGroup and its form', () => {
    it('submits to the form its form attribute names, one card or several', () => {
        renderUi(
            <>
                <form id="signup" />
                <Plans name="plan" form="signup" defaultValue="starter" />
                <Alerts name="alerts" form="signup" defaultValue={['bounces']} />
            </>
        );
        const data = new FormData(document.getElementById('signup'));
        expect(data.get('plan')).toBe('starter');
        expect(data.getAll('alerts')).toEqual(['bounces']);
    });
});
