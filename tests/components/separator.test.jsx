import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Separator } from '@/components/separator';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Separator', () => {
    it('is decorative by default and a separator when asked', async () => {
        renderUi(
            <>
                <Separator data-testid="decorative" />
                <Separator decorative={false} orientation="vertical" />
            </>,
        );
        expect(screen.getByTestId('decorative')).toHaveAttribute('role', 'none');
        expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
        await expectNoAxeViolations();
    });
    it('draws a dashed or dotted line, solid by default', () => {
        renderUi(
            <>
                <Separator data-testid="solid" />
                <Separator variant="dashed" data-testid="dashed" />
                <Separator variant="dotted" orientation="vertical" data-testid="dotted" />
            </>,
        );
        expect(screen.getByTestId('solid')).toHaveAttribute('data-variant', 'solid');
        expect(screen.getByTestId('dashed')).toHaveAttribute('data-variant', 'dashed');
        expect(screen.getByTestId('dashed').className).toContain('border-dashed');
        expect(screen.getByTestId('dotted')).toHaveAttribute('data-variant', 'dotted');
        expect(screen.getByTestId('dotted').className).toContain('border-dotted');
    });

    it('puts content inside the line, read in the flow when decorative', async () => {
        renderUi(<Separator data-testid="or">or</Separator>);
        const root = screen.getByTestId('or');
        expect(root).toHaveAttribute('role', 'none');
        expect(root).toHaveAttribute('data-align', 'center');
        expect(root.querySelector('[data-slot=separator-content]')).toHaveTextContent('or');
        expect(root.querySelectorAll('[data-slot=separator-line][aria-hidden=true]')).toHaveLength(2);
        await expectNoAxeViolations();
    });

    it('names a real separator after its content', async () => {
        renderUi(
            <Separator decorative={false} orientation="vertical" align="top">
                Getting started
            </Separator>,
        );
        const separator = screen.getByRole('separator', { name: 'Getting started' });
        expect(separator).toHaveAttribute('aria-orientation', 'vertical');
        expect(separator).toHaveAttribute('data-align', 'start');
        await expectNoAxeViolations();
    });

    it('aligns the content at the start, the centre or the end', () => {
        renderUi(
            <>
                <Separator align="start" data-testid="start">A</Separator>
                <Separator align="end" data-testid="end">B</Separator>
                <Separator orientation="vertical" align="bottom" data-testid="bottom">C</Separator>
            </>,
        );
        expect(screen.getByTestId('start')).toHaveAttribute('data-align', 'start');
        expect(screen.getByTestId('end')).toHaveAttribute('data-align', 'end');
        expect(screen.getByTestId('bottom')).toHaveAttribute('data-align', 'end');
    });
});
