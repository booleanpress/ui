import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { AspectRatio } from '@/components/aspect-ratio';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('AspectRatio', () => {
    it('reserves the height for its ratio and holds its content', async () => {
        renderUi(
            <AspectRatio ratio={16 / 9} className="rounded-lg">
                <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Deliveries per day" />
            </AspectRatio>
        );
        const inner = document.querySelector('[data-slot="aspect-ratio"]');
        expect(inner).toHaveClass('rounded-lg');
        // Radix pads the outer box by the height as a share of the width: 9 / 16 = 56.25%.
        expect(inner.parentElement.style.paddingBottom).toBe('56.25%');
        expect(inner).toContainElement(screen.getByRole('img', { name: 'Deliveries per day' }));
        await expectNoAxeViolations();
    });

    it('is square by default', () => {
        renderUi(<AspectRatio>Logo</AspectRatio>);
        expect(document.querySelector('[data-slot="aspect-ratio"]').parentElement.style.paddingBottom).toBe('100%');
    });
});
