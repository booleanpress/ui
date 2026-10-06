import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Kbd, KbdGroup } from '@/components/kbd';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Kbd', () => {
    it('renders a kbd element', async () => {
        renderUi(<Kbd>Esc</Kbd>);
        const key = screen.getByText('Esc');
        expect(key.tagName).toBe('KBD');
        expect(key).toHaveAttribute('data-slot', 'kbd');
        await expectNoAxeViolations();
    });

    it('nests keys in a group, which is a kbd too', async () => {
        const { container } = renderUi(
            <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
            </KbdGroup>,
        );
        const group = container.querySelector('[data-slot=kbd-group]');
        expect(group.tagName).toBe('KBD');
        expect(group.querySelectorAll('[data-slot=kbd]')).toHaveLength(2);
        await expectNoAxeViolations();
    });

    it('keeps a shortcut in its written order on a right-to-left page', async () => {
        const { container } = renderUi(
            <div dir="rtl">
                <Kbd>⌘K</Kbd>
                <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>K</Kbd>
                </KbdGroup>
            </div>,
        );
        expect(screen.getByText('⌘K')).toHaveClass('[unicode-bidi:plaintext]');
        expect(screen.getByText('⌘K')).not.toHaveAttribute('dir');
        expect(container.querySelector('[data-slot=kbd-group]')).toHaveClass('rtl:flex-row-reverse');
        await expectNoAxeViolations();
    });

    it('is not focusable and takes no part in the tab order', async () => {
        const { user } = renderUi(
            <>
                <Kbd>/</Kbd>
                <button type="button">After</button>
            </>,
        );
        await user.tab();
        expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });
});
