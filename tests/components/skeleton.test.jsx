import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Skeleton } from '@/components/skeleton';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Skeleton', () => {
    it('renders a placeholder block that reduced motion can stop', async () => {
        renderUi(<Skeleton data-testid="skeleton" className="h-4 w-20" />);
        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toHaveAttribute('data-slot', 'skeleton');
        // The sweep is an enter animation on the pseudo-element, which theme.css ends at once under reduced motion.
        expect(skeleton.className).toContain('after:animate-in');
        expect(skeleton.className).toContain('after:repeat-infinite');
        await expectNoAxeViolations();
    });
});
