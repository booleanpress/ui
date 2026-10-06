import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import {
    Toolbar,
    ToolbarButton,
    ToolbarGroup,
    ToolbarLink,
    ToolbarOverflowButton,
    ToolbarSeparator,
    ToolbarToggleGroup,
    ToolbarToggleItem,
} from '@/components/toolbar';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Editor({ onBold, ...props }) {
    return (
        <>
            <button type="button">Before</button>
            <Toolbar aria-label="Formatting" {...props}>
                <ToolbarGroup>
                    <ToolbarButton onClick={onBold}>Bold</ToolbarButton>
                    <ToolbarButton disabled>Italic</ToolbarButton>
                    <ToolbarButton>Underline</ToolbarButton>
                </ToolbarGroup>
                <ToolbarSeparator />
                <ToolbarLink href="#help">Help</ToolbarLink>
            </Toolbar>
            <button type="button">After</button>
        </>
    );
}

const button = (name) => screen.getByRole('button', { name });

describe('Toolbar', () => {
    it('renders a named toolbar with its orientation, groups and a separator', async () => {
        const { container } = renderUi(<Editor />);
        const toolbar = screen.getByRole('toolbar', { name: 'Formatting' });
        expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');
        expect(container.querySelector('[data-slot="toolbar-group"]')).toHaveAttribute('role', 'group');
        expect(container.querySelector('[data-slot="toolbar-separator"]')).toHaveAttribute('data-orientation', 'vertical');
        expect(button('Bold')).toHaveAttribute('data-slot', 'toolbar-button');
        await expectNoAxeViolations();
    });

    it('is one tab stop: Tab enters on the first control and leaves on the next', async () => {
        const { user } = renderUi(<Editor />);
        await user.tab();
        expect(button('Before')).toHaveFocus();
        await user.tab();
        expect(button('Bold')).toHaveFocus();
        await user.tab();
        expect(button('After')).toHaveFocus();
        await user.tab({ shift: true });
        expect(button('Bold')).toHaveFocus();
    });

    it('moves with → and ←, skipping disabled controls and wrapping at the ends', async () => {
        const { user } = renderUi(<Editor />);
        button('Bold').focus();
        await user.keyboard('{ArrowRight}');
        expect(button('Underline')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('link', { name: 'Help' })).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(button('Bold')).toHaveFocus();
        await user.keyboard('{ArrowLeft}');
        expect(screen.getByRole('link', { name: 'Help' })).toHaveFocus();
    });

    it('moves to the first and last control with Home and End', async () => {
        const { user } = renderUi(<Editor />);
        button('Underline').focus();
        await user.keyboard('{End}');
        expect(screen.getByRole('link', { name: 'Help' })).toHaveFocus();
        await user.keyboard('{Home}');
        expect(button('Bold')).toHaveFocus();
    });

    it('reverses the arrows in a right-to-left page', async () => {
        const { user } = renderUi(<Editor />, { dir: 'rtl' });
        button('Bold').focus();
        await user.keyboard('{ArrowLeft}');
        expect(button('Underline')).toHaveFocus();
    });

    it('moves with ↓ and ↑ when vertical', async () => {
        const { user } = renderUi(<Editor orientation="vertical" />);
        expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');
        button('Bold').focus();
        await user.keyboard('{ArrowDown}');
        expect(button('Underline')).toHaveFocus();
        await user.keyboard('{ArrowUp}');
        expect(button('Bold')).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('activates the focused button with Enter and Space', async () => {
        const onBold = vi.fn();
        const { user } = renderUi(<Editor onBold={onBold} />);
        button('Bold').focus();
        await user.keyboard('{Enter}');
        await user.keyboard(' ');
        expect(onBold).toHaveBeenCalledTimes(2);
    });

    it('toggles items with Space and Enter, pressed in a multiple group and checked in a single group', async () => {
        const { user } = renderUi(
            <Toolbar aria-label="Style">
                <ToolbarToggleGroup type="multiple" aria-label="Text style" size="sm">
                    <ToolbarToggleItem value="bold">Bold</ToolbarToggleItem>
                    <ToolbarToggleItem value="italic">Italic</ToolbarToggleItem>
                </ToolbarToggleGroup>
                <ToolbarToggleGroup type="single" aria-label="Alignment" defaultValue="left">
                    <ToolbarToggleItem value="left">Left</ToolbarToggleItem>
                    <ToolbarToggleItem value="right">Right</ToolbarToggleItem>
                </ToolbarToggleGroup>
            </Toolbar>
        );
        const bold = screen.getByRole('button', { name: 'Bold' });
        expect(bold).toHaveAttribute('aria-pressed', 'false');
        expect(bold).toHaveAttribute('data-size', 'sm');
        bold.focus();
        await user.keyboard(' ');
        expect(bold).toHaveAttribute('aria-pressed', 'true');
        await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
        const right = screen.getByRole('radio', { name: 'Right' });
        expect(right).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(right).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('radio', { name: 'Left' })).toHaveAttribute('aria-checked', 'false');
        await expectNoAxeViolations();
    });

    it('names the overflow button from the provider strings', async () => {
        const { unmount } = renderUi(
            <Toolbar aria-label="Ticket">
                <ToolbarButton>Reply</ToolbarButton>
                <ToolbarOverflowButton />
            </Toolbar>
        );
        expect(screen.getByRole('button', { name: 'More actions' })).toHaveAttribute('data-slot', 'toolbar-overflow-button');
        await expectNoAxeViolations();
        unmount();
        renderUi(
            <Toolbar aria-label="Ticket">
                <ToolbarOverflowButton />
            </Toolbar>,
            { strings: { moreActions: 'Weitere Aktionen' } }
        );
        expect(screen.getByRole('button', { name: 'Weitere Aktionen' })).toBeInTheDocument();
    });

    it('keeps focus on a toolbar button that starts loading, and ignores its presses while it loads', async () => {
        const onSave = vi.fn();
        function Form({ loading }) {
            return (
                <Toolbar aria-label="Form">
                    <ToolbarButton>Cancel</ToolbarButton>
                    <ToolbarButton loading={loading} onClick={onSave}>Save</ToolbarButton>
                </Toolbar>
            );
        }
        const { user, rerender } = renderUi(<Form loading={false} />);
        const save = screen.getByRole('button', { name: 'Save' });
        save.focus();
        await user.keyboard('{Enter}');
        expect(onSave).toHaveBeenCalledTimes(1);
        rerender(
            <BooleanUIProvider>
                <Form loading />
            </BooleanUIProvider>,
        );
        expect(save).toHaveFocus();
        expect(save).not.toBeDisabled();
        expect(save).toHaveAttribute('aria-disabled', 'true');
        expect(save).toHaveAttribute('aria-busy', 'true');
        await user.keyboard('{Enter}');
        await user.keyboard(' ');
        await user.click(save);
        expect(onSave).toHaveBeenCalledTimes(1);
        // The arrow keys still move from it and back to it.
        await user.keyboard('{ArrowLeft}');
        expect(button('Cancel')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(save).toHaveFocus();
    });

    it('passes Button looks through and marks a loading button busy and unavailable', () => {
        renderUi(
            <Toolbar aria-label="Form">
                <ToolbarButton variant="outline" size="sm">
                    Cancel
                </ToolbarButton>
                <ToolbarButton loading>Save</ToolbarButton>
            </Toolbar>
        );
        expect(button('Cancel')).toHaveAttribute('data-variant', 'outline');
        expect(button('Cancel')).toHaveAttribute('data-size', 'sm');
        const save = screen.getByRole('button', { name: /Save/ });
        expect(save).toHaveAttribute('aria-disabled', 'true');
        expect(save).toHaveAttribute('aria-busy', 'true');
    });
});
