import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/accordion';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Faq({ type = 'single', disabledItem, ...props }) {
    return (
        <Accordion type={type} {...(type === 'single' ? { collapsible: true } : {})} {...props}>
            <AccordionItem value="log">
                <AccordionTrigger>Delivery log</AccordionTrigger>
                <AccordionContent>Kept for 30 days.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="resend" disabled={disabledItem}>
                <AccordionTrigger>Resending</AccordionTrigger>
                <AccordionContent>Open the entry and choose Resend.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="providers">
                <AccordionTrigger>Providers</AccordionTrigger>
                <AccordionContent>Any SMTP server.</AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

const trigger = (name) => screen.getByRole('button', { name });

describe('Accordion', () => {
    it('renders headings with buttons that control their panels', async () => {
        renderUi(<Faq defaultValue="log" />);
        expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
        const log = trigger('Delivery log');
        expect(log).toHaveAttribute('aria-expanded', 'true');
        const region = screen.getByRole('region', { name: 'Delivery log' });
        expect(log).toHaveAttribute('aria-controls', region.id);
        expect(region).toHaveTextContent('Kept for 30 days.');
        expect(trigger('Resending')).toHaveAttribute('aria-expanded', 'false');
        await expectNoAxeViolations();
    });

    it('opens and closes a panel with Enter', async () => {
        const { user } = renderUi(<Faq />);
        trigger('Delivery log').focus();
        await user.keyboard('{Enter}');
        expect(trigger('Delivery log')).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('region', { name: 'Delivery log' })).toBeInTheDocument();
        await user.keyboard('{Enter}');
        expect(trigger('Delivery log')).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('region', { name: 'Delivery log' })).toBeNull();
    });

    it('opens and closes a panel with Space', async () => {
        const { user } = renderUi(<Faq />);
        trigger('Providers').focus();
        await user.keyboard(' ');
        expect(trigger('Providers')).toHaveAttribute('aria-expanded', 'true');
        await user.keyboard(' ');
        expect(trigger('Providers')).toHaveAttribute('aria-expanded', 'false');
    });

    it('moves with Tab from trigger to trigger', async () => {
        const { user } = renderUi(<Faq />);
        await user.tab();
        expect(trigger('Delivery log')).toHaveFocus();
        await user.tab();
        expect(trigger('Resending')).toHaveFocus();
    });

    it('moves to the next trigger with ArrowDown, wrapping at the end', async () => {
        const { user } = renderUi(<Faq />);
        trigger('Resending').focus();
        await user.keyboard('{ArrowDown}');
        expect(trigger('Providers')).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(trigger('Delivery log')).toHaveFocus();
    });

    it('moves to the previous trigger with ArrowUp, wrapping at the start', async () => {
        const { user } = renderUi(<Faq />);
        trigger('Resending').focus();
        await user.keyboard('{ArrowUp}');
        expect(trigger('Delivery log')).toHaveFocus();
        await user.keyboard('{ArrowUp}');
        expect(trigger('Providers')).toHaveFocus();
    });

    it('moves to the first and last trigger with Home and End', async () => {
        const { user } = renderUi(<Faq />);
        trigger('Resending').focus();
        await user.keyboard('{End}');
        expect(trigger('Providers')).toHaveFocus();
        await user.keyboard('{Home}');
        expect(trigger('Delivery log')).toHaveFocus();
    });

    it('keeps one panel open in single mode', async () => {
        const { user } = renderUi(<Faq defaultValue="log" />);
        await user.click(trigger('Providers'));
        expect(trigger('Providers')).toHaveAttribute('aria-expanded', 'true');
        expect(trigger('Delivery log')).toHaveAttribute('aria-expanded', 'false');
    });

    it('keeps several panels open in multiple mode', async () => {
        const { user } = renderUi(<Faq type="multiple" defaultValue={['log']} />);
        await user.click(trigger('Providers'));
        expect(trigger('Providers')).toHaveAttribute('aria-expanded', 'true');
        expect(trigger('Delivery log')).toHaveAttribute('aria-expanded', 'true');
        await expectNoAxeViolations();
    });

    it('follows a controlled value and reports changes', async () => {
        const onChange = vi.fn();
        function Controlled() {
            const [value, setValue] = useState('resend');
            return (
                <Faq
                    value={value}
                    onValueChange={(next) => {
                        onChange(next);
                        setValue(next);
                    }}
                />
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(trigger('Resending')).toHaveAttribute('aria-expanded', 'true');
        await user.click(trigger('Delivery log'));
        expect(onChange).toHaveBeenCalledWith('log');
        expect(trigger('Delivery log')).toHaveAttribute('aria-expanded', 'true');
        expect(trigger('Resending')).toHaveAttribute('aria-expanded', 'false');
    });

    it('ignores a disabled item and skips it with the arrow keys', async () => {
        const { user } = renderUi(<Faq disabledItem />);
        const resend = trigger('Resending');
        expect(resend).toBeDisabled();
        expect(resend.closest('[data-slot="accordion-item"]')).toHaveAttribute('data-disabled');
        await user.click(resend);
        expect(resend).toHaveAttribute('aria-expanded', 'false');
        trigger('Delivery log').focus();
        await user.keyboard('{ArrowDown}');
        expect(trigger('Providers')).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('disables every panel from the root', () => {
        renderUi(<Faq disabled />);
        for (const name of ['Delivery log', 'Resending', 'Providers']) expect(trigger(name)).toBeDisabled();
    });

    it('draws the chevron by default and a custom indicator when given', () => {
        renderUi(
            <Accordion type="single" collapsible>
                <AccordionItem value="a">
                    <AccordionTrigger>Default</AccordionTrigger>
                    <AccordionContent>A</AccordionContent>
                </AccordionItem>
                <AccordionItem value="b">
                    <AccordionTrigger indicator={<span data-testid="plus">+</span>}>Custom</AccordionTrigger>
                    <AccordionContent>B</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
        const indicators = document.querySelectorAll('[data-slot="accordion-indicator"]');
        expect(indicators).toHaveLength(2);
        expect(indicators[0].tagName.toLowerCase()).toBe('svg');
        expect(indicators[1]).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByTestId('plus')).toBeInTheDocument();
        expect(trigger('Custom')).toHaveAccessibleName('Custom');
    });
});
