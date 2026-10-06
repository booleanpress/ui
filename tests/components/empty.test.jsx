import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { MailIcon } from 'lucide-react';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/empty';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Example(props) {
    return (
        <Empty {...props}>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <MailIcon />
                </EmptyMedia>
                <EmptyTitle>No emails yet</EmptyTitle>
                <EmptyDescription>Emails appear here as soon as your site sends one.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <button type="button">Send a test email</button>
            </EmptyContent>
        </Empty>
    );
}

describe('Empty', () => {
    it('renders its parts with their slots', async () => {
        renderUi(<Example />);
        expect(screen.getByText('No emails yet')).toHaveAttribute('data-slot', 'empty-title');
        expect(screen.getByText(/Emails appear here/)).toHaveAttribute('data-slot', 'empty-description');
        expect(screen.getByText('No emails yet').closest('[data-slot=empty]')).not.toBeNull();
        await expectNoAxeViolations();
    });

    it('marks the media variant', () => {
        const { container } = renderUi(<Example />);
        expect(container.querySelector('[data-slot=empty-icon]')).toHaveAttribute('data-variant', 'icon');
    });

    it('keeps its action reachable with Tab', async () => {
        const { user } = renderUi(<Example />);
        await user.tab();
        expect(screen.getByRole('button', { name: 'Send a test email' })).toHaveFocus();
    });

    it('takes a className for the border', () => {
        const { container } = renderUi(<Example className="border" />);
        expect(container.querySelector('[data-slot=empty]').className).toContain('border-dashed');
        expect(container.querySelector('[data-slot=empty]').className).toContain('border');
    });
});
