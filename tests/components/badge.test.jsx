import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Badge', () => {
    it('has the status variants on the status tag tokens', async () => {
        renderUi(
            <>
                <Badge variant="success">Delivered</Badge>
                <Badge variant="warning">Pending</Badge>
                <Badge variant="info">Queued</Badge>
                <Badge variant="destructive">Failed</Badge>
            </>,
        );
        expect(screen.getByText('Delivered').className).toContain('bg-success-tag');
        expect(screen.getByText('Pending').className).toContain('bg-warning-tag');
        expect(screen.getByText('Queued').className).toContain('bg-info-tag');
        expect(screen.getByText('Failed')).toHaveAttribute('data-variant', 'destructive');
        await expectNoAxeViolations();
    });

    it('makes a solid label with a severity, sized and rounded by its props', async () => {
        renderUi(
            <>
                <Badge severity="success" size="lg">Sent</Badge>
                <Badge severity="contrast" size="sm">Internal</Badge>
                <Badge rounded>Newsletter</Badge>
                <Badge>Draft</Badge>
            </>,
        );
        const sent = screen.getByText('Sent');
        expect(sent).toHaveAttribute('data-severity', 'success');
        expect(sent).toHaveAttribute('data-kind', 'solid');
        expect(sent).toHaveAttribute('data-size', 'lg');
        expect(screen.getByText('Internal')).toHaveAttribute('data-size', 'sm');
        expect(screen.getByText('Newsletter')).toHaveAttribute('data-rounded', 'true');
        const draft = screen.getByText('Draft');
        expect(draft).toHaveAttribute('data-kind', 'tag');
        expect(draft).toHaveAttribute('data-size', 'default');
        expect(draft).not.toHaveAttribute('data-severity');
        await expectNoAxeViolations();
    });

    it('draws a count in the provider locale and caps it at max', async () => {
        renderUi(
            <>
                <Badge count={4} data-testid="small" />
                <Badge count={1250} data-testid="large" />
                <Badge count={128} max={99} severity="danger" data-testid="capped" />
            </>,
            { locale: 'de-DE' },
        );
        expect(screen.getByTestId('small')).toHaveTextContent('4');
        expect(screen.getByTestId('small')).toHaveAttribute('data-kind', 'count');
        expect(screen.getByTestId('large')).toHaveTextContent('1.250');
        expect(screen.getByTestId('capped')).toHaveTextContent('99+');
        expect(screen.getByTestId('capped')).toHaveAttribute('data-count', '128');
        await expectNoAxeViolations();
    });

    it('writes the capped count with the provider string', () => {
        renderUi(<Badge count={1000} max={999} data-testid="capped" />, { strings: { badgeOverflow: 'über {max}' } });
        expect(screen.getByTestId('capped')).toHaveTextContent('über 999');
    });

    it('names a dot as an image, or hides it when the words beside it say the same', async () => {
        renderUi(
            <p>
                <Badge dot severity="success" aria-label="Connected" />
                <span>
                    <Badge dot severity="danger" aria-hidden data-testid="hidden" /> Failed
                </span>
            </p>,
        );
        const dot = screen.getByRole('img', { name: 'Connected' });
        expect(dot).toHaveAttribute('data-kind', 'dot');
        expect(dot).toBeEmptyDOMElement();
        expect(screen.getByTestId('hidden')).not.toHaveAttribute('role');
        expect(screen.getAllByRole('img')).toHaveLength(1);
        await expectNoAxeViolations();
    });

    it('joins a button name as its count', async () => {
        renderUi(
            <Button>
                Failed emails <Badge count={8} severity="secondary" />
            </Button>,
        );
        expect(screen.getByRole('button', { name: 'Failed emails 8' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('is never wider than its container, so long text can be truncated inside it', () => {
        renderUi(
            <div style={{ width: 80 }}>
                <Badge><span className="truncate">Enterprise customers in Western Europe</span></Badge>
            </div>,
        );
        const badge = screen.getByText('Enterprise customers in Western Europe').closest('[data-slot=badge]');
        // jsdom has no layout: the class is the contract that keeps the badge inside its container.
        expect(badge.className).toContain('max-w-full');
    });
});
