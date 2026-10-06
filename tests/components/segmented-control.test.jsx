import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { SegmentedControl, SegmentedControlItem } from '@/components/segmented-control';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const segment = (name) => screen.getByRole('radio', { name });
const indicator = () => document.querySelector('[data-slot=segmented-control-indicator]');

function Views(props) {
    return (
        <SegmentedControl aria-label="Ticket view" {...props}>
            <SegmentedControlItem value="list">List</SegmentedControlItem>
            <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
            <SegmentedControlItem value="board">Board</SegmentedControlItem>
        </SegmentedControl>
    );
}

async function arrow(user, key, landsOn) {
    await user.keyboard(`{${key}>}`);
    await waitFor(() => expect(segment(landsOn)).toHaveFocus());
    await user.keyboard(`{/${key}}`);
}

describe('SegmentedControl', () => {
    it('renders a named radio group of segments with the chosen one checked and the highlight under it', async () => {
        renderUi(<Views defaultValue="grid" />);
        expect(screen.getByRole('radiogroup', { name: 'Ticket view' })).toBeInTheDocument();
        expect(segment('Grid')).toHaveAttribute('aria-checked', 'true');
        expect(segment('List')).toHaveAttribute('aria-checked', 'false');
        expect(indicator()).toHaveAttribute('aria-hidden', 'true');
        const root = screen.getByRole('radiogroup');
        expect(root.style.getPropertyValue('--segment-count')).toBe('3');
        expect(root.style.getPropertyValue('--segment-index')).toBe('1');
        await expectNoAxeViolations();
    });

    it('draws no highlight while nothing is chosen', () => {
        renderUi(<Views />);
        expect(indicator()).toBeNull();
    });

    it('moves to the chosen segment with Tab', async () => {
        const { user } = renderUi(<Views defaultValue="board" />);
        await user.tab();
        expect(segment('Board')).toHaveFocus();
        await user.tab();
        expect(document.body).toHaveFocus();
    });

    it('chooses the next segment with ArrowRight and ArrowDown, from the last back to the first', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Views defaultValue="grid" onValueChange={onValueChange} />);
        await user.tab();
        await arrow(user, 'ArrowRight', 'Board');
        expect(segment('Board')).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('radiogroup').style.getPropertyValue('--segment-index')).toBe('2');
        await arrow(user, 'ArrowDown', 'List');
        expect(segment('List')).toHaveAttribute('aria-checked', 'true');
        expect(onValueChange.mock.calls.map(([v]) => v)).toEqual(['board', 'list']);
    });

    it('chooses the previous segment with ArrowLeft and ArrowUp, from the first round to the last', async () => {
        const { user } = renderUi(<Views defaultValue="grid" />);
        await user.tab();
        await arrow(user, 'ArrowLeft', 'List');
        await arrow(user, 'ArrowUp', 'Board');
        expect(segment('Board')).toHaveAttribute('aria-checked', 'true');
    });

    it('swaps ArrowLeft and ArrowRight, and the slide, in right-to-left pages', async () => {
        const { user } = renderUi(<Views defaultValue="list" />, { dir: 'rtl' });
        expect(indicator().className).toContain('translate-x-[calc(var(--segment-index)*-100%)]');
        await user.tab();
        await arrow(user, 'ArrowLeft', 'Grid');
        expect(segment('Grid')).toHaveAttribute('aria-checked', 'true');
    });

    it('chooses the focused segment with Space when none is chosen', async () => {
        const { user } = renderUi(<Views />);
        await user.tab();
        expect(segment('List')).toHaveFocus();
        await user.keyboard(' ');
        expect(segment('List')).toHaveAttribute('aria-checked', 'true');
        expect(indicator()).not.toBeNull();
    });

    it('names an icon-only segment with aria-label', async () => {
        renderUi(
            <SegmentedControl defaultValue="left" aria-label="Text alignment">
                <SegmentedControlItem value="left" aria-label="Align left">
                    <svg aria-hidden="true" />
                </SegmentedControlItem>
                <SegmentedControlItem value="right" aria-label="Align right">
                    <svg aria-hidden="true" />
                </SegmentedControlItem>
            </SegmentedControl>,
        );
        expect(segment('Align left')).toHaveAttribute('aria-checked', 'true');
        await expectNoAxeViolations();
    });

    it('is controlled by value', async () => {
        function Controlled() {
            const [view, setView] = useState('list');
            return (
                <>
                    <Views value={view} onValueChange={setView} />
                    <button type="button" onClick={() => setView('board')}>
                        Show board
                    </button>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Show board' }));
        expect(segment('Board')).toHaveAttribute('aria-checked', 'true');
        await user.click(segment('Grid'));
        expect(segment('Grid')).toHaveAttribute('aria-checked', 'true');
    });

    it('disables every segment when disabled, and skips a disabled segment with the arrows', async () => {
        const { unmount } = renderUi(<Views disabled defaultValue="list" />);
        for (const name of ['List', 'Grid', 'Board']) expect(segment(name)).toBeDisabled();
        await expectNoAxeViolations();
        unmount();
        const { user } = renderUi(
            <SegmentedControl defaultValue="list" aria-label="Billing">
                <SegmentedControlItem value="list">List</SegmentedControlItem>
                <SegmentedControlItem value="grid" disabled>
                    Grid
                </SegmentedControlItem>
                <SegmentedControlItem value="board">Board</SegmentedControlItem>
            </SegmentedControl>,
        );
        await user.tab();
        await arrow(user, 'ArrowRight', 'Board');
        expect(segment('Board')).toHaveAttribute('aria-checked', 'true');
    });

    it('passes aria-invalid and its description to the group', async () => {
        renderUi(
            <>
                <Views aria-invalid aria-describedby="view-error" />
                <p id="view-error">Choose a view.</p>
            </>,
        );
        expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('Choose a view.');
        await expectNoAxeViolations();
    });

    it('sets data-size on the control and its segments, from its prop or the provider', () => {
        const { unmount } = renderUi(<Views size="lg" />);
        expect(screen.getByRole('radiogroup')).toHaveAttribute('data-size', 'lg');
        expect(segment('List')).toHaveAttribute('data-size', 'lg');
        unmount();
        renderUi(<Views />, { controlSize: 'sm' });
        expect(segment('Grid')).toHaveAttribute('data-size', 'sm');
    });

    it('fills its container with fluid', () => {
        renderUi(<Views fluid />);
        expect(screen.getByRole('radiogroup').className).toContain('w-full');
        // jsdom has no layout: the rules that let a long label wrap, or clip a long word, in its equal segment rather than
        // spill into the next one when the bar is narrow, are checked here; the widths in the browser.
        expect(segment('List').className).toContain('overflow-hidden');
        expect(segment('List').className).toContain('wrap-break-word');
        expect(segment('List').className).not.toContain('whitespace-nowrap');
    });

    it('lets wrapped segments draw their own plate', () => {
        renderUi(
            <SegmentedControl defaultValue="a" aria-label="Wrapped">
                <span>
                    <SegmentedControlItem value="a">A</SegmentedControlItem>
                </span>
            </SegmentedControl>,
        );
        expect(indicator()).toBeNull();
        expect(segment('A').className).toContain('data-[state=checked]:before:bg-background');
    });

    it('keeps the sliding highlight when a segment is left out by a condition', () => {
        const showBoard = false;
        renderUi(
            <SegmentedControl defaultValue="grid" aria-label="Ticket view">
                <SegmentedControlItem value="list">List</SegmentedControlItem>
                <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
                {showBoard && <SegmentedControlItem value="board">Board</SegmentedControlItem>}
            </SegmentedControl>,
        );
        expect(indicator()).not.toBeNull();
        expect(screen.getByRole('radiogroup').style.getPropertyValue('--segment-count')).toBe('2');
        expect(screen.getByRole('radiogroup').style.getPropertyValue('--segment-index')).toBe('1');
    });

    it('goes back to its first value when the form is reset, reporting "" when that was none', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <form aria-label="Settings">
                <Views name="view" defaultValue="grid" />
                <SegmentedControl name="period" aria-label="Period" onValueChange={onValueChange}>
                    <SegmentedControlItem value="day">Day</SegmentedControlItem>
                    <SegmentedControlItem value="week">Week</SegmentedControlItem>
                </SegmentedControl>
                <button type="reset">Reset</button>
            </form>,
        );
        await user.click(segment('Board'));
        await user.click(segment('Week'));
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        await waitFor(() => expect(segment('Grid')).toHaveAttribute('aria-checked', 'true'));
        expect(segment('Week')).toHaveAttribute('aria-checked', 'false');
        expect(onValueChange).toHaveBeenLastCalledWith('');
        const data = new FormData(screen.getByRole('form'));
        expect(data.get('view')).toBe('grid');
        expect(data.get('period')).toBeNull();
    });

    it('submits the chosen value under its name', () => {
        renderUi(
            <form aria-label="Settings">
                <Views name="view" defaultValue="grid" />
            </form>,
        );
        expect(new FormData(screen.getByRole('form')).get('view')).toBe('grid');
    });
});
