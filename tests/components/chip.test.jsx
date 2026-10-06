import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { MailIcon } from 'lucide-react';
import { Chip, ChipGroup } from '@/components/chip';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Recipients({ initial = ['ops@example.com', 'billing@example.com', 'support@example.com'] }) {
    const [list, setList] = useState(initial);
    return (
        <ChipGroup aria-label="Recipients">
            {list.map((address) => (
                <Chip key={address} label={address} onRemove={() => setList((current) => current.filter((a) => a !== address))} />
            ))}
        </ChipGroup>
    );
}

const remove = (label) => screen.getByRole('button', { name: `Remove ${label}` });

describe('Chip', () => {
    it('makes a named list of chips, each with a remove button named after it', async () => {
        renderUi(<Recipients />);
        const list = screen.getByRole('list', { name: 'Recipients' });
        expect(list.querySelectorAll('[role=listitem]')).toHaveLength(3);
        expect(remove('ops@example.com')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('moves between removable chips with Tab', async () => {
        const { user } = renderUi(<Recipients />);
        await user.tab();
        expect(remove('ops@example.com')).toHaveFocus();
        await user.tab();
        expect(remove('billing@example.com')).toHaveFocus();
    });

    it('removes the chip with Enter and moves focus to the next chip', async () => {
        const { user } = renderUi(<Recipients />);
        remove('ops@example.com').focus();
        await user.keyboard('{Enter}');
        expect(screen.queryByText('ops@example.com')).toBeNull();
        expect(remove('billing@example.com')).toHaveFocus();
    });

    it('removes the chip with Space and moves focus to the next chip', async () => {
        const { user } = renderUi(<Recipients />);
        remove('billing@example.com').focus();
        await user.keyboard(' ');
        expect(screen.queryByText('billing@example.com')).toBeNull();
        expect(remove('support@example.com')).toHaveFocus();
    });

    it('removes the chip with Backspace and moves focus to the next chip', async () => {
        const { user } = renderUi(<Recipients />);
        remove('ops@example.com').focus();
        await user.keyboard('{Backspace}');
        expect(screen.queryByText('ops@example.com')).toBeNull();
        expect(remove('billing@example.com')).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('removes the last chip with Delete and moves focus to the previous chip, then to the group', async () => {
        const { user } = renderUi(<Recipients initial={['ops@example.com', 'billing@example.com']} />);
        remove('billing@example.com').focus();
        await user.keyboard('{Delete}');
        expect(screen.queryByText('billing@example.com')).toBeNull();
        expect(remove('ops@example.com')).toHaveFocus();
        await user.keyboard('{Delete}');
        expect(screen.getByRole('list', { name: 'Recipients' })).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('names the remove button with the provider string', () => {
        renderUi(<Chip label="VIP" onRemove={() => {}} />, { strings: { removeItem: '{label} entfernen' } });
        expect(screen.getByRole('button', { name: 'VIP entfernen' })).toBeInTheDocument();
    });

    it('is plain text with no list role or tab stop when it cannot be removed', async () => {
        const { user } = renderUi(<Chip label="Transactional" icon={<MailIcon />} />);
        const chip = screen.getByText('Transactional').closest('[data-slot=chip]');
        expect(chip).not.toHaveAttribute('role');
        expect(chip.querySelector('[data-slot=chip-icon]')).toHaveAttribute('aria-hidden', 'true');
        await user.tab();
        expect(document.body).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('draws a decorative image unless it is given alternative text', async () => {
        renderUi(
            <>
                <Chip label="Ada Lovelace" image="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />
                <Chip label="Team" image="data:image/gif;base64,R0lGODlhAQABAAAAACw=" imageAlt="Support team logo" />
            </>,
        );
        expect(screen.getAllByRole('presentation')).toHaveLength(1);
        expect(screen.getByRole('img', { name: 'Support team logo' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('disables the remove button of a disabled chip', async () => {
        let removed = 0;
        const { user } = renderUi(<Chip label="Refund" disabled onRemove={() => { removed += 1; }} />);
        expect(remove('Refund')).toBeDisabled();
        expect(screen.getByText('Refund').closest('[data-slot=chip]')).toHaveAttribute('data-disabled', 'true');
        await user.click(remove('Refund'));
        expect(removed).toBe(0);
        await expectNoAxeViolations();
    });

    it('gives the remove button a hit area of at least 24 × 24 px round its 22px circle (WCAG 2.5.8)', () => {
        renderUi(<Chip label="Refund" onRemove={() => {}} />);
        // jsdom has no layout, so this checks the classes that draw the transparent square, positioned against the button
        // and centred on it; the hit area itself is measured in a browser.
        expect(remove('Refund')).toHaveClass('relative', 'size-5.5', 'after:absolute', 'after:size-6', 'after:top-1/2', 'after:left-1/2', 'after:-translate-1/2');
    });
});
