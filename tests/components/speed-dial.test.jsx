import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { SpeedDial, SpeedDialAction, SpeedDialContent, SpeedDialTrigger } from '@/components/speed-dial';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const LABELS = ['Edit template', 'Retry failed emails', 'Delete template'];

function Dial({ onEdit, ...props }) {
    return (
        <>
            <SpeedDial {...props}>
                <SpeedDialTrigger />
                <SpeedDialContent>
                    {LABELS.map((label, index) => (
                        <SpeedDialAction key={label} label={label} onClick={index === 0 ? onEdit : undefined}>
                            <svg aria-hidden="true" />
                        </SpeedDialAction>
                    ))}
                </SpeedDialContent>
            </SpeedDial>
            <button type="button">Elsewhere</button>
        </>
    );
}

const trigger = () => screen.getByRole('button', { name: 'Actions' });
const action = (name) => screen.getByRole('menuitem', { name });

describe('SpeedDial', () => {
    it('renders a menu button whose closed menu is inert', async () => {
        const { container } = renderUi(<Dial />);
        const button = screen.getByRole('button', { name: 'Actions' });
        expect(button).toHaveAttribute('aria-haspopup', 'menu');
        expect(button).toHaveAttribute('aria-expanded', 'false');
        const menu = container.querySelector('[role="menu"]');
        expect(button).toHaveAttribute('aria-controls', menu.id);
        expect(menu).toHaveAttribute('inert');
        expect(menu).toHaveAttribute('aria-labelledby', button.id);
        await expectNoAxeViolations();
    });

    it('opens with a click, keeping its name, leaving focus on the trigger', async () => {
        const { user, container } = renderUi(<Dial />);
        await user.click(trigger());
        expect(trigger()).toHaveAttribute('aria-expanded', 'true');
        expect(trigger()).toHaveAccessibleName('Actions');
        expect(trigger()).toHaveFocus();
        expect(container.querySelector('[role="menu"]')).not.toHaveAttribute('inert');
        expect(screen.getAllByRole('menuitem')).toHaveLength(3);
        await expectNoAxeViolations();
        await user.click(trigger());
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens with Enter and Space, focusing the first action', async () => {
        const { user } = renderUi(<Dial />);
        trigger().focus();
        await user.keyboard('{Enter}');
        expect(trigger()).toHaveAttribute('aria-expanded', 'true');
        expect(action('Edit template')).toHaveFocus();
        trigger().focus();
        await user.keyboard(' ');
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');
        await user.keyboard(' ');
        expect(action('Edit template')).toHaveFocus();
    });

    it('opens with an arrow key on the trigger, focusing the first action', async () => {
        const { user } = renderUi(<Dial />);
        trigger().focus();
        await user.keyboard('{ArrowDown}');
        expect(trigger()).toHaveAttribute('aria-expanded', 'true');
        expect(action('Edit template')).toHaveFocus();
    });

    it('moves along an upward line with ↑ (outwards) and ↓ (back), wrapping', async () => {
        const { user } = renderUi(<Dial />);
        trigger().focus();
        await user.keyboard('{Enter}');
        await user.keyboard('{ArrowUp}');
        expect(action('Retry failed emails')).toHaveFocus();
        await user.keyboard('{ArrowUp}{ArrowUp}');
        expect(action('Edit template')).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(action('Delete template')).toHaveFocus();
    });

    it('moves along a line to the right with → and ←', async () => {
        const { user } = renderUi(<Dial direction="right" />);
        trigger().focus();
        await user.keyboard('{Enter}');
        await user.keyboard('{ArrowRight}');
        expect(action('Retry failed emails')).toHaveFocus();
        await user.keyboard('{ArrowLeft}');
        expect(action('Edit template')).toHaveFocus();
    });

    it('keeps left and right physical in a right-to-left page, where a row runs from the right', () => {
        const { container, unmount } = renderUi(<Dial direction="right" />, { dir: 'rtl' });
        for (const node of [container.querySelector('[data-slot=speed-dial]'), container.querySelector('[role=menu]')]) {
            expect(node.className).toContain('flex-row');
            expect(node.className).toContain('rtl:flex-row-reverse');
        }
        unmount();
        const left = renderUi(<Dial direction="left" />, { dir: 'rtl' }).container.querySelector('[role=menu]');
        expect(left.className).toContain('flex-row-reverse');
        expect(left.className).toContain('rtl:flex-row');
    });

    it('moves round a circle with ↓ and → on, ↑ and ← back', async () => {
        const { user } = renderUi(<Dial type="circle" />);
        trigger().focus();
        await user.keyboard('{Enter}');
        await user.keyboard('{ArrowDown}');
        expect(action('Retry failed emails')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(action('Delete template')).toHaveFocus();
        await user.keyboard('{ArrowLeft}{ArrowUp}');
        expect(action('Edit template')).toHaveFocus();
    });

    it('moves to the first and last action with Home and End', async () => {
        const { user } = renderUi(<Dial />);
        trigger().focus();
        await user.keyboard('{Enter}');
        await user.keyboard('{End}');
        expect(action('Delete template')).toHaveFocus();
        await user.keyboard('{Home}');
        expect(action('Edit template')).toHaveFocus();
    });

    it('closes with Escape and returns focus to the trigger', async () => {
        const { user } = renderUi(<Dial />);
        trigger().focus();
        await user.keyboard('{Enter}');
        await user.keyboard('{Escape}');
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');
        expect(trigger()).toHaveFocus();
    });

    it('runs an action with Enter, closes and returns focus to the trigger', async () => {
        const onEdit = vi.fn();
        const { user } = renderUi(<Dial onEdit={onEdit} />);
        trigger().focus();
        await user.keyboard('{Enter}');
        await user.keyboard('{Enter}');
        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');
        expect(trigger()).toHaveFocus();
    });

    it('closes when Tab moves focus out, and on a press outside', async () => {
        const { user } = renderUi(<Dial />);
        trigger().focus();
        await user.keyboard('{Enter}');
        await user.tab();
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');
        await user.click(trigger());
        expect(trigger()).toHaveAttribute('aria-expanded', 'true');
        fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }));
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    });

    it('shows an action’s label in a tooltip on focus', async () => {
        const { user } = renderUi(<Dial />);
        trigger().focus();
        await user.keyboard('{Enter}');
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Edit template');
    });

    it('draws a mask while open that closes the actions when clicked', async () => {
        const { user, container } = renderUi(<Dial mask />);
        const mask = container.querySelector('[data-slot="speed-dial-mask"]');
        expect(mask).toHaveAttribute('aria-hidden', 'true');
        expect(mask).toHaveAttribute('data-state', 'closed');
        await user.click(trigger());
        expect(mask).toHaveAttribute('data-state', 'open');
        await user.click(mask);
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    });

    it('places the actions of a round layout with transforms only', async () => {
        const { container } = renderUi(<Dial type="quarter-circle" direction="down-right" defaultOpen />);
        const items = container.querySelectorAll('[data-slot="speed-dial-item"]');
        expect(items[0].style.getPropertyValue('--speed-dial-x')).toBe('calc(-50% + 0px)');
        expect(items[0].style.getPropertyValue('--speed-dial-y')).toBe('calc(-50% + 120px)');
        expect(items[2].style.getPropertyValue('--speed-dial-x')).toBe('calc(-50% + 120px)');
        expect(items[2].style.getPropertyValue('--speed-dial-y')).toBe('calc(-50% + 0px)');
        expect(container.querySelector('[data-slot="speed-dial"]')).toHaveAttribute('data-direction', 'down-right');
        await expectNoAxeViolations();
    });

    it('follows a controlled open state and reports changes', async () => {
        const onChange = vi.fn();
        function Controlled() {
            const [open, setOpen] = useState(true);
            return (
                <Dial
                    open={open}
                    onOpenChange={(next) => {
                        onChange(next);
                        setOpen(next);
                    }}
                />
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(trigger()).toHaveAttribute('aria-expanded', 'true');
        await user.click(trigger());
        expect(onChange).toHaveBeenLastCalledWith(false);
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    });

    it('names the trigger from the provider string, one name in both states, the state in aria-expanded', async () => {
        const { user } = renderUi(<Dial />, { strings: { speedDialActions: 'Aktionen' } });
        const button = screen.getByRole('button', { name: 'Aktionen' });
        expect(button).toHaveAttribute('aria-expanded', 'false');
        await user.click(button);
        expect(screen.getByRole('button', { name: 'Aktionen' })).toHaveAttribute('aria-expanded', 'true');
    });
});
