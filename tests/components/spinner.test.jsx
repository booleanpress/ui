import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Spinner } from '@/components/spinner';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Spinner', () => {
    it('is a status named by the provider', async () => {
        renderUi(<Spinner />, { strings: { loading: 'Chargement' } });
        expect(screen.getByRole('status', { name: 'Chargement' })).toHaveAttribute('data-slot', 'spinner');
        await expectNoAxeViolations();
    });

    it('falls back to English outside a provider-supplied string', () => {
        renderUi(<Spinner />);
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    });
});
