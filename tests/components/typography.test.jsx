import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Blockquote, Heading, InlineCode, Prose, Text } from '@/components/typography';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Typography', () => {
    it('Prose renders the HTML inside it as the semantic elements it is', async () => {
        renderUi(
            <Prose asChild>
                <article aria-label="Moving to a new mailer">
                    <h1>Moving to a new mailer</h1>
                    <p>
                        Read the <a href="#log">delivery log</a> and set <code>SMTP_KEY</code>. <strong>Never</strong> share it.
                    </p>
                    <h2>Before you start</h2>
                    <ul>
                        <li>Host</li>
                        <li>Port</li>
                    </ul>
                    <ol>
                        <li>Create a key.</li>
                    </ol>
                    <blockquote>
                        <p>It took an afternoon.</p>
                    </blockquote>
                    <pre>
                        <code>v=spf1 ~all</code>
                    </pre>
                    <hr />
                    <table>
                        <thead>
                            <tr>
                                <th>State</th>
                                <th>Today</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Delivered</td>
                                <td>1,284</td>
                            </tr>
                        </tbody>
                    </table>
                </article>
            </Prose>,
        );
        const article = screen.getByRole('article', { name: 'Moving to a new mailer' });
        expect(article).toHaveAttribute('data-slot', 'prose');
        expect(screen.getByRole('heading', { level: 1, name: 'Moving to a new mailer' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Before you start' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'delivery log' })).toHaveAttribute('href', '#log');
        expect(screen.getAllByRole('list')).toHaveLength(2);
        expect(screen.getAllByRole('listitem')).toHaveLength(3);
        expect(screen.getByRole('separator')).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'State' })).toBeInTheDocument();
        expect(screen.getByText('SMTP_KEY').tagName).toBe('CODE');
        expect(screen.getByText('It took an afternoon.').closest('blockquote')).not.toBeNull();
        await expectNoAxeViolations();
    });

    it('Heading renders its level and draws another level’s size on request', async () => {
        renderUi(
            <>
                <Heading level={1}>Delivery log</Heading>
                <Heading>Failed deliveries</Heading>
                <Heading level={3} size={1}>
                    Bounced
                </Heading>
            </>,
        );
        const h1 = screen.getByRole('heading', { level: 1, name: 'Delivery log' });
        expect(h1).toHaveAttribute('data-size', '1');
        expect(screen.getByRole('heading', { level: 2, name: 'Failed deliveries' })).toHaveAttribute('data-level', '2');
        const h3 = screen.getByRole('heading', { level: 3, name: 'Bounced' });
        expect(h3).toHaveAttribute('data-size', '1');
        expect(h3.className).toContain('text-3xl/9');
        await expectNoAxeViolations();
    });

    it('Text renders a paragraph, or the child with asChild, with its size and tone', async () => {
        renderUi(
            <>
                <Text size="lg" tone="muted">
                    A lead paragraph.
                </Text>
                <Text asChild tone="destructive">
                    <span>Bounced</span>
                </Text>
            </>,
        );
        const lead = screen.getByText('A lead paragraph.');
        expect(lead.tagName).toBe('P');
        expect(lead).toHaveAttribute('data-size', 'lg');
        expect(lead).toHaveAttribute('data-tone', 'muted');
        const span = screen.getByText('Bounced');
        expect(span.tagName).toBe('SPAN');
        expect(span).toHaveAttribute('data-slot', 'text');
        expect(span).toHaveAttribute('data-size', 'sm');
        await expectNoAxeViolations();
    });

    it('draws headings in the heading colour and the success tone in the tags’ deep green, as the page documents', () => {
        renderUi(
            <>
                <Heading>Failed deliveries</Heading>
                <Text tone="success">Delivered</Text>
            </>,
        );
        expect(screen.getByRole('heading', { name: 'Failed deliveries' })).toHaveClass('text-heading');
        // The deep green keeps 4.5:1 on the page; the brighter `success-strong` would not.
        expect(screen.getByText('Delivered')).toHaveClass('text-success-tag-foreground');
        expect(screen.getByText('Delivered')).not.toHaveClass('text-success-strong');
    });

    it('Blockquote and InlineCode render their native elements', async () => {
        renderUi(
            <>
                <Blockquote>We moved forty sites in an afternoon.</Blockquote>
                <p>
                    Set <InlineCode>SMTP_KEY</InlineCode> first.
                </p>
            </>,
        );
        expect(screen.getByText('We moved forty sites in an afternoon.').tagName).toBe('BLOCKQUOTE');
        const code = screen.getByText('SMTP_KEY');
        expect(code.tagName).toBe('CODE');
        expect(code).toHaveAttribute('data-slot', 'inline-code');
        await expectNoAxeViolations();
    });
});
