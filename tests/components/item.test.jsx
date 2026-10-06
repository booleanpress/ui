import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemSeparator,
    ItemTitle,
} from '@/components/item';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Rules() {
    return (
        <ItemGroup>
            <Item>
                <ItemContent>
                    <ItemTitle>Order emails</ItemTitle>
                    <ItemDescription>Subject contains Order</ItemDescription>
                </ItemContent>
            </Item>
            <ItemSeparator />
            <Item variant="outline" size="sm">
                <ItemContent>
                    <ItemTitle>Everything else</ItemTitle>
                </ItemContent>
                <ItemActions>
                    <button type="button">Edit</button>
                </ItemActions>
            </Item>
        </ItemGroup>
    );
}

describe('Item', () => {
    it('has no list role on the group, so axe finds no list-item violation', async () => {
        const { container } = renderUi(<Rules />);
        const group = container.querySelector('[data-slot=item-group]');
        expect(group).not.toHaveAttribute('role');
        expect(screen.queryByRole('list')).toBeNull();
        expect(screen.queryByRole('listitem')).toBeNull();
        await expectNoAxeViolations();
    });

    it('marks the variant and the size', () => {
        const { container } = renderUi(<Rules />);
        const items = container.querySelectorAll('[data-slot=item]');
        expect(items[0]).toHaveAttribute('data-variant', 'default');
        expect(items[0]).toHaveAttribute('data-size', 'default');
        expect(items[1]).toHaveAttribute('data-variant', 'outline');
        expect(items[1]).toHaveAttribute('data-size', 'sm');
    });

    it('renders a link with asChild and leaves it in the tab order', async () => {
        const { user } = renderUi(
            <Item asChild variant="outline">
                <a href="#email-log">
                    <ItemContent>
                        <ItemTitle>Email log</ItemTitle>
                    </ItemContent>
                </a>
            </Item>,
        );
        const link = screen.getByRole('link', { name: 'Email log' });
        expect(link).toHaveAttribute('data-slot', 'item');
        await user.tab();
        expect(link).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('keeps actions reachable with Tab', async () => {
        const { user } = renderUi(<Rules />);
        await user.tab();
        expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus();
    });
});
