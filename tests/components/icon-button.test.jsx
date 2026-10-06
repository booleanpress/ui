import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { PencilIcon } from 'lucide-react';
import { IconButton } from '@/components/icon-button';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('IconButton', () => {
    it('is a button named by its label, ghost by default', async () => {
        renderUi(
            <IconButton label="Edit mailer">
                <PencilIcon />
            </IconButton>,
        );
        const button = screen.getByRole('button', { name: 'Edit mailer' });
        expect(button).toHaveAttribute('data-slot', 'icon-button');
        expect(button).toHaveAttribute('data-variant', 'ghost');
        expect(button).toHaveAttribute('data-size', 'icon');
        await expectNoAxeViolations();
    });

    it('activates on Enter', async () => {
        const onClick = vi.fn();
        const { user } = renderUi(
            <IconButton label="Edit" onClick={onClick}>
                <PencilIcon />
            </IconButton>,
        );
        await user.tab();
        await user.keyboard('{Enter}');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('activates on Space', async () => {
        const onClick = vi.fn();
        const { user } = renderUi(
            <IconButton label="Edit" onClick={onClick}>
                <PencilIcon />
            </IconButton>,
        );
        await user.tab();
        await user.keyboard(' ');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('maps its sizes to the square button sizes, following the provider when given none', () => {
        renderUi(
            <>
                <IconButton label="xs" size="xs">
                    <PencilIcon />
                </IconButton>
                <IconButton label="lg" size="lg">
                    <PencilIcon />
                </IconButton>
                <IconButton label="inherited">
                    <PencilIcon />
                </IconButton>
            </>,
            { controlSize: 'sm' },
        );
        expect(screen.getByRole('button', { name: 'xs' })).toHaveAttribute('data-size', 'icon-xs');
        expect(screen.getByRole('button', { name: 'lg' })).toHaveAttribute('data-size', 'icon-lg');
        expect(screen.getByRole('button', { name: 'inherited' })).toHaveAttribute('data-size', 'icon-sm');
    });

    it('shows its label in a tooltip on focus without adding it as a description, and Escape closes it', async () => {
        const { user } = renderUi(
            <IconButton label="Copy message ID" tooltip>
                <PencilIcon />
            </IconButton>,
        );
        await user.tab();
        expect(screen.getByRole('tooltip')).toHaveTextContent('Copy message ID');
        const button = screen.getByRole('button', { name: 'Copy message ID' });
        expect(button).not.toHaveAttribute('aria-describedby');
        await expectNoAxeViolations();
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('keeps a description the consumer gives', async () => {
        const { user } = renderUi(
            <>
                <IconButton label="Delete" tooltip aria-describedby="why">
                    <PencilIcon />
                </IconButton>
                <p id="why">Removes the mailer for good.</p>
            </>,
        );
        await user.tab();
        expect(screen.getByRole('button', { name: 'Delete' })).toHaveAccessibleDescription('Removes the mailer for good.');
    });

    it('shows the spinner in place of the icon, sets aria-busy and refuses presses while loading, keeping focus', async () => {
        let clicks = 0;
        const { user } = renderUi(
            <IconButton label="Refresh" loading onClick={() => { clicks += 1; }}>
                <PencilIcon data-testid="icon" />
            </IconButton>,
        );
        const button = screen.getByRole('button', { name: 'Refresh' });
        expect(button).not.toBeDisabled();
        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(button).toHaveAttribute('aria-busy', 'true');
        expect(screen.queryByTestId('icon')).toBeNull();
        await user.tab();
        expect(button).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(clicks).toBe(0);
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('passes severity and rounded through to the button', () => {
        renderUi(
            <IconButton label="Reject" variant="default" severity="danger" rounded>
                <PencilIcon />
            </IconButton>,
        );
        const button = screen.getByRole('button', { name: 'Reject' });
        expect(button).toHaveAttribute('data-severity', 'danger');
        expect(button).toHaveAttribute('data-rounded', 'true');
    });
});
