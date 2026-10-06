import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { ActionBar, ActionBarButton, ActionBarSeparator } from '@/components/action-bar';
import { Checkbox } from '@/components/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Bar({ count = 2, onClear = () => {}, ...props }) {
    return (
        <div className="relative">
            <ActionBar count={count} onClear={onClear} {...props}>
                <ActionBarButton>Archive</ActionBarButton>
                <ActionBarButton>Tag</ActionBarButton>
                <ActionBarSeparator />
                <ActionBarButton severity="danger">Delete</ActionBarButton>
            </ActionBar>
        </div>
    );
}

function List() {
    const [selected, setSelected] = useState([]);
    const toggle = (id, on) => setSelected((cur) => (on ? [...cur, id] : cur.filter((x) => x !== id)));
    return (
        <div className="relative">
            {['a', 'b'].map((id) => (
                <Checkbox key={id} aria-label={`Select ${id}`} checked={selected.includes(id)} onCheckedChange={(on) => toggle(id, on === true)} />
            ))}
            <ActionBar count={selected.length} onClear={() => setSelected([])}>
                <ActionBarButton>Archive</ActionBarButton>
            </ActionBar>
        </div>
    );
}

describe('ActionBar', () => {
    it('stays hidden while nothing is selected', () => {
        renderUi(<Bar count={0} />);
        expect(screen.queryByRole('toolbar')).toBeNull();
        expect(screen.getByRole('status')).toHaveTextContent('');
    });

    it('shows a toolbar named by the count, and announces the count politely', async () => {
        renderUi(<Bar count={2} />);
        const bar = screen.getByRole('toolbar', { name: '2 selected' });
        expect(bar).toHaveAttribute('aria-orientation', 'horizontal');
        expect(within(bar).getByText('2 selected')).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('2 selected');
        await expectNoAxeViolations();
    });

    it('announces when it appears and when the count changes', async () => {
        const { user } = renderUi(<List />);
        const status = screen.getByRole('status');
        expect(status).toHaveTextContent('');
        await user.click(screen.getByRole('checkbox', { name: 'Select a' }));
        expect(status).toHaveTextContent('1 selected');
        await user.click(screen.getByRole('checkbox', { name: 'Select b' }));
        expect(status).toHaveTextContent('2 selected');
    });

    it('is one tab stop, and moves between its buttons with the arrows, wrapping', async () => {
        const { user } = renderUi(<Bar />);
        await user.tab();
        const archive = screen.getByRole('button', { name: 'Archive' });
        expect(archive).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('button', { name: 'Tag' })).toHaveFocus();
        await user.keyboard('{ArrowLeft}{ArrowLeft}');
        expect(screen.getByRole('button', { name: 'Clear selection' })).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(archive).toHaveFocus();
        await user.tab();
        expect(document.body).toHaveFocus();
    });

    it('moves to the first and last button with Home and End', async () => {
        const { user } = renderUi(<Bar />);
        await user.tab();
        await user.keyboard('{End}');
        expect(screen.getByRole('button', { name: 'Clear selection' })).toHaveFocus();
        await user.keyboard('{Home}');
        expect(screen.getByRole('button', { name: 'Archive' })).toHaveFocus();
    });

    it('reverses the arrows in a right-to-left page', async () => {
        const { user } = renderUi(<Bar />, { dir: 'rtl' });
        await user.tab();
        await user.keyboard('{ArrowLeft}');
        expect(screen.getByRole('button', { name: 'Tag' })).toHaveFocus();
    });

    it('activates a button with Enter and Space, and clears with the ×', async () => {
        const onClear = vi.fn();
        const { user } = renderUi(<Bar onClear={onClear} />);
        await user.tab();
        await user.keyboard('{End}{Enter}');
        await user.keyboard(' ');
        expect(onClear).toHaveBeenCalledTimes(2);
    });

    it('returns focus to where it came from when it closes with focus inside', async () => {
        const { user } = renderUi(<List />);
        const checkbox = screen.getByRole('checkbox', { name: 'Select b' });
        await user.click(checkbox);
        await user.tab();
        expect(screen.getByRole('button', { name: 'Archive' })).toHaveFocus();
        await user.keyboard('{ArrowLeft}{Enter}');
        await waitFor(() => expect(screen.queryByRole('toolbar')).toBeNull());
        await waitFor(() => expect(checkbox).toHaveFocus());
    });

    it('formats the count for the locale and takes its strings from the provider', () => {
        renderUi(<Bar count={1234} />, {
            locale: 'de-DE',
            strings: { selectedCount: '{count} ausgewählt', clearSelection: 'Auswahl aufheben' },
        });
        expect(screen.getByRole('toolbar', { name: '1.234 ausgewählt' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Auswahl aufheben' })).toBeInTheDocument();
    });

    it('stays on the page, closed, while it fades out', () => {
        // jsdom runs no animations; an inline exit animation stands in for the theme's.
        const style = { animationName: 'exit', animationDuration: '150ms' };
        const { rerender } = renderUi(<Bar count={2} style={style} />);
        rerender(
            <BooleanUIProvider>
                <Bar count={0} style={style} />
            </BooleanUIProvider>,
        );
        const bar = screen.getByRole('toolbar', { hidden: true });
        expect(bar).toHaveAttribute('data-state', 'closed');
        expect(screen.getByRole('status')).toHaveTextContent('');
        fireEvent.animationEnd(bar);
        expect(screen.queryByRole('toolbar', { hidden: true })).toBeNull();
    });

    it('shows with open whatever the count, and takes a name and a place', () => {
        renderUi(<Bar count={0} open aria-label="Bulk actions" position="viewport" />);
        const bar = screen.getByRole('toolbar', { name: 'Bulk actions' });
        expect(bar).toHaveAttribute('data-position', 'viewport');
        expect(bar).toHaveClass('fixed');
    });

    it('passes focus on when a menu of the bar hands it back while the bar fades out', async () => {
        // jsdom runs no animations; an inline exit animation stands in for the theme's, so the bar is still leaving when
        // the menu returns focus to its trigger.
        const exit = { animationName: 'exit', animationDuration: '150ms' };
        function MenuList() {
            const [selected, setSelected] = useState([]);
            return (
                <div className="relative">
                    <Checkbox aria-label="Select a" checked={selected.includes('a')} onCheckedChange={(on) => setSelected(on ? ['a'] : [])} />
                    <ActionBar count={selected.length} style={selected.length ? undefined : exit}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <ActionBarButton aria-label="More actions">…</ActionBarButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => setSelected([])}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </ActionBar>
                </div>
            );
        }
        const { user } = renderUi(<MenuList />);
        const checkbox = screen.getByRole('checkbox', { name: 'Select a' });
        await user.click(checkbox);
        await user.tab();
        expect(screen.getByRole('button', { name: 'More actions' })).toHaveFocus();
        await user.keyboard('{Enter}');
        const item = await screen.findByRole('menuitem', { name: 'Delete' });
        await waitFor(() => expect(item).toHaveFocus());
        await user.keyboard('{Enter}');
        await waitFor(() => expect(checkbox).toHaveFocus());
        expect(screen.getByRole('toolbar', { hidden: true })).toHaveAttribute('data-state', 'closed');
    });

    it('returns focus to the list when a menu item empties the selection and the bar is gone before the menu lets go', async () => {
        const exit = { animationName: 'exit', animationDuration: '150ms' };
        function MenuList() {
            const [selected, setSelected] = useState([]);
            return (
                <div className="relative">
                    <Checkbox aria-label="Select a" checked={selected.includes('a')} onCheckedChange={(on) => setSelected(on ? ['a'] : [])} />
                    <ActionBar count={selected.length} style={selected.length ? undefined : exit}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <ActionBarButton aria-label="More actions">…</ActionBarButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => setSelected([])}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </ActionBar>
                </div>
            );
        }
        const { user } = renderUi(<MenuList />);
        const checkbox = screen.getByRole('checkbox', { name: 'Select a' });
        await user.click(checkbox);
        await user.tab();
        await user.keyboard('{Enter}');
        const item = await screen.findByRole('menuitem', { name: 'Delete' });
        await waitFor(() => expect(item).toHaveFocus());
        // The item empties the selection while its menu still traps focus; the bar's exit then ends before the menu
        // hands focus back to its trigger, as in a browser where both fade out together.
        fireEvent.keyDown(item, { key: 'Enter' });
        fireEvent.animationEnd(screen.getByRole('toolbar', { hidden: true }));
        expect(screen.queryByRole('toolbar', { hidden: true })).toBeNull();
        await waitFor(() => expect(checkbox).toHaveFocus());
    });

    it('still returns focus to the list after a menu of the bar was opened and closed', async () => {
        function MenuList() {
            const [selected, setSelected] = useState([]);
            return (
                <div className="relative">
                    <Checkbox aria-label="Select a" checked={selected.includes('a')} onCheckedChange={(on) => setSelected(on ? ['a'] : [])} />
                    <ActionBar count={selected.length} onClear={() => setSelected([])}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <ActionBarButton aria-label="More actions">…</ActionBarButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Archive</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </ActionBar>
                </div>
            );
        }
        const { user } = renderUi(<MenuList />);
        const checkbox = screen.getByRole('checkbox', { name: 'Select a' });
        await user.click(checkbox);
        await user.tab();
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus());
        await user.keyboard('{Escape}');
        const more = screen.getByRole('button', { name: 'More actions' });
        await waitFor(() => expect(more).toHaveFocus());
        await user.keyboard('{End}{Enter}');
        await waitFor(() => expect(screen.queryByRole('toolbar')).toBeNull());
        await waitFor(() => expect(checkbox).toHaveFocus());
    });

    it('keeps its exit and its focus return when the page passes a ref', async () => {
        const ref = { current: null };
        const style = { animationName: 'exit', animationDuration: '150ms' };
        const { rerender } = renderUi(<Bar count={2} style={style} ref={ref} />);
        expect(ref.current).toHaveAttribute('role', 'toolbar');
        rerender(
            <BooleanUIProvider>
                <Bar count={0} style={style} ref={ref} />
            </BooleanUIProvider>,
        );
        expect(screen.getByRole('toolbar', { hidden: true })).toHaveAttribute('data-state', 'closed');
    });
});
