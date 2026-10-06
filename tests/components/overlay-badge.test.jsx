import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { BellIcon } from 'lucide-react';
import { OverlayBadge } from '@/components/overlay-badge';
import { Avatar, AvatarFallback } from '@/components/avatar';
import { Button } from '@/components/button';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('OverlayBadge', () => {
    it('describes a focusable child with its label and reads the label once', async () => {
        renderUi(
            <OverlayBadge count={3} severity="danger" label="3 failed deliveries">
                <Button size="icon" aria-label="Delivery alerts"><BellIcon /></Button>
            </OverlayBadge>,
        );
        const button = screen.getByRole('button', { name: 'Delivery alerts' });
        expect(button).toHaveAccessibleDescription('3 failed deliveries');
        await waitFor(() => expect(document.querySelector('[data-slot=overlay-badge-label]')).toHaveAttribute('hidden'));
        expect(button).toHaveAccessibleDescription('3 failed deliveries');
        await expectNoAxeViolations();
    });

    it('reads the label after a child that cannot take focus', async () => {
        renderUi(
            <OverlayBadge count={4} label="4 unassigned tickets">
                <Avatar><AvatarFallback>AL</AvatarFallback></Avatar>
            </OverlayBadge>,
        );
        const label = screen.getByText('4 unassigned tickets');
        await waitFor(() => expect(label).not.toHaveAttribute('hidden'));
        expect(label).toHaveClass('sr-only');
        await expectNoAxeViolations();
    });

    it('passes count, max, severity and size to a badge hidden from assistive technology', async () => {
        renderUi(
            <OverlayBadge count={128} max={99} severity="info" size="lg" label="128 failed emails">
                <BellIcon aria-hidden />
            </OverlayBadge>,
        );
        const badge = document.querySelector('[data-slot=overlay-badge-badge]');
        expect(badge).toHaveAttribute('aria-hidden', 'true');
        expect(badge).toHaveAttribute('data-severity', 'info');
        expect(badge).toHaveAttribute('data-size', 'lg');
        expect(badge).toHaveTextContent('99+');
        expect(badge.className).toContain('rtl:-translate-x-1/2');
        await expectNoAxeViolations();
    });

    it('draws a dot instead of the count', async () => {
        renderUi(
            <OverlayBadge dot count={5} label="New messages">
                <BellIcon aria-hidden />
            </OverlayBadge>,
        );
        const badge = document.querySelector('[data-slot=overlay-badge-badge]');
        expect(badge).toHaveAttribute('data-kind', 'dot');
        expect(badge).toBeEmptyDOMElement();
        expect(screen.getByText('New messages')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it("keeps the child's own description beside the label", () => {
        renderUi(
            <>
                <p id="hint">Opens the alert list</p>
                <OverlayBadge count={2} label="2 new alerts">
                    <Button aria-describedby="hint">Alerts</Button>
                </OverlayBadge>
            </>,
        );
        expect(screen.getByRole('button', { name: 'Alerts' })).toHaveAccessibleDescription('Opens the alert list 2 new alerts');
    });

    it('does not also describe a child that cannot take focus, so an image is not read with the label twice', async () => {
        renderUi(
            <OverlayBadge count={2} label="2 unread messages">
                <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Ada Lovelace" />
            </OverlayBadge>,
        );
        const image = screen.getByRole('img', { name: 'Ada Lovelace' });
        await waitFor(() => expect(screen.getByText('2 unread messages')).not.toHaveAttribute('hidden'));
        expect(image).not.toHaveAttribute('aria-describedby');
        expect(image).toHaveAccessibleDescription('');
        await expectNoAxeViolations();
    });

    it('lets its badge be wider than the element it sits on, so a count such as "99+" is never cut', () => {
        renderUi(
            <OverlayBadge count={120} max={99} label="120 unread">
                <span>Inbox</span>
            </OverlayBadge>
        );
        expect(document.querySelector('[data-slot="overlay-badge-badge"]')).toHaveClass('max-w-none');
    });
});
