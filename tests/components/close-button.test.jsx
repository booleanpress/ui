import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { CloseButton } from '@/components/close-button';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('CloseButton', () => {
    it('is a round ghost button named Close, of type button', async () => {
        renderUi(<CloseButton />);
        const button = screen.getByRole('button', { name: 'Close' });
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveAttribute('data-slot', 'close-button');
        expect(button).toHaveAttribute('data-rounded', 'true');
        expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
        await expectNoAxeViolations();
    });

    it('activates on Enter', async () => {
        const onClick = vi.fn();
        const { user } = renderUi(<CloseButton onClick={onClick} />);
        await user.tab();
        await user.keyboard('{Enter}');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('activates on Space', async () => {
        const onClick = vi.fn();
        const { user } = renderUi(<CloseButton onClick={onClick} />);
        await user.tab();
        await user.keyboard(' ');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('takes its name from the provider, or from label', () => {
        renderUi(
            <>
                <CloseButton />
                <CloseButton label="Dismiss the notice" />
            </>,
            { strings: { close: 'Schließen' } },
        );
        expect(screen.getByRole('button', { name: 'Schließen' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Dismiss the notice' })).toBeInTheDocument();
    });

    it('maps its sizes to the square button sizes, following the provider when given none', () => {
        renderUi(
            <>
                <CloseButton label="small" size="sm" />
                <CloseButton label="large" size="lg" />
                <CloseButton label="inherited" />
            </>,
            { controlSize: 'lg' },
        );
        expect(screen.getByRole('button', { name: 'small' })).toHaveAttribute('data-size', 'icon-sm');
        expect(screen.getByRole('button', { name: 'large' })).toHaveAttribute('data-size', 'icon-lg');
        expect(screen.getByRole('button', { name: 'inherited' })).toHaveAttribute('data-size', 'icon-lg');
    });

    it('cannot be pressed when disabled', async () => {
        renderUi(<CloseButton disabled />);
        expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
        await expectNoAxeViolations();
    });
});
