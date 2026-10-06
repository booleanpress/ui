import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { Tree, getExpandableIds, moveTreeNode } from '@/components/tree';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const FOLDERS = [
    {
        id: 'inbox',
        label: 'Inbox',
        children: [
            { id: 'billing', label: 'Billing', children: [{ id: 'invoices', label: 'Invoices' }, { id: 'refunds', label: 'Refunds' }] },
            { id: 'support', label: 'Support' },
        ],
    },
    { id: 'sent', label: 'Sent', children: [{ id: 'receipts', label: 'Receipts' }] },
    { id: 'archive', label: 'Archive', children: [{ id: 'archive-2026', label: '2026' }] },
];

const item = (name) => screen.getByRole('treeitem', { name: new RegExp(`^${name}`) });
const labels = () => screen.getAllByRole('treeitem').map((node) => node.querySelector('[data-slot=tree-node-label]').textContent);

function renderTree(props = {}, providerProps = {}) {
    return renderUi(<Tree aria-label="Mail folders" nodes={FOLDERS} {...props} />, providerProps);
}

describe('Tree', () => {
    it('renders a named tree of treeitems with their level, position and state', async () => {
        renderTree({ defaultExpanded: ['inbox'] });
        const tree = screen.getByRole('tree', { name: 'Mail folders' });
        expect(tree).toBeInTheDocument();
        const inbox = item('Inbox');
        expect(inbox).toHaveAttribute('aria-level', '1');
        expect(inbox).toHaveAttribute('aria-posinset', '1');
        expect(inbox).toHaveAttribute('aria-setsize', '3');
        expect(inbox).toHaveAttribute('aria-expanded', 'true');
        expect(within(inbox).getByRole('group')).toBeInTheDocument();
        expect(item('Billing')).toHaveAttribute('aria-level', '2');
        expect(item('Support')).not.toHaveAttribute('aria-expanded');
        expect(inbox).toHaveAttribute('tabindex', '0');
        expect(item('Sent')).toHaveAttribute('tabindex', '-1');
        await expectNoAxeViolations();
    });

    it('moves to the next node with Down Arrow', async () => {
        const { user } = renderTree({ defaultExpanded: ['inbox'] });
        item('Inbox').focus();
        await user.keyboard('{ArrowDown}');
        expect(item('Billing')).toHaveFocus();
        expect(item('Billing')).toHaveAttribute('tabindex', '0');
        expect(item('Inbox')).toHaveAttribute('tabindex', '-1');
    });

    it('moves to the previous node with Up Arrow', async () => {
        const { user } = renderTree({ defaultExpanded: ['inbox'] });
        item('Sent').focus();
        await user.keyboard('{ArrowUp}');
        expect(item('Support')).toHaveFocus();
    });

    it('opens a closed node with Right Arrow, then moves to its first child', async () => {
        const { user } = renderTree();
        item('Inbox').focus();
        await user.keyboard('{ArrowRight}');
        expect(item('Inbox')).toHaveAttribute('aria-expanded', 'true');
        expect(item('Inbox')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(item('Billing')).toHaveFocus();
    });

    it('closes an open node with Left Arrow, then moves to its parent', async () => {
        const { user } = renderTree({ defaultExpanded: ['inbox', 'billing'] });
        item('Billing').focus();
        await user.keyboard('{ArrowLeft}');
        expect(item('Billing')).toHaveAttribute('aria-expanded', 'false');
        await user.keyboard('{ArrowLeft}');
        expect(item('Inbox')).toHaveFocus();
    });

    it('moves to the first node with Home', async () => {
        const { user } = renderTree({ defaultExpanded: ['inbox'] });
        item('Archive').focus();
        await user.keyboard('{Home}');
        expect(item('Inbox')).toHaveFocus();
    });

    it('moves to the last node shown with End', async () => {
        const { user } = renderTree({ defaultExpanded: ['inbox'] });
        item('Inbox').focus();
        await user.keyboard('{End}');
        expect(item('Archive')).toHaveFocus();
    });

    it('chooses the node with Enter in single selection', async () => {
        const onSelectedChange = vi.fn();
        const onNodeSelect = vi.fn();
        const { user } = renderTree({ selectionMode: 'single', onSelectedChange, onNodeSelect });
        item('Sent').focus();
        await user.keyboard('{Enter}');
        expect(onSelectedChange).toHaveBeenLastCalledWith(['sent']);
        expect(onNodeSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'sent' }));
        expect(item('Sent')).toHaveAttribute('aria-selected', 'true');
        expect(item('Inbox')).toHaveAttribute('aria-selected', 'false');
        await expectNoAxeViolations();
    });

    it('toggles a node with Space in multiple selection', async () => {
        const { user } = renderTree({ selectionMode: 'multiple' });
        expect(screen.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
        item('Sent').focus();
        await user.keyboard(' ');
        expect(item('Sent')).toHaveAttribute('aria-selected', 'true');
        await user.keyboard('{ArrowDown} ');
        expect(item('Archive')).toHaveAttribute('aria-selected', 'true');
        expect(item('Sent')).toHaveAttribute('aria-selected', 'true');
        await user.keyboard(' ');
        expect(item('Archive')).toHaveAttribute('aria-selected', 'false');
    });

    it('opens and closes a parent with Enter when nothing can be chosen', async () => {
        const { user } = renderTree();
        item('Sent').focus();
        await user.keyboard('{Enter}');
        expect(item('Sent')).toHaveAttribute('aria-expanded', 'true');
        await user.keyboard('{Enter}');
        expect(item('Sent')).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens every sibling of the focused node with *', async () => {
        const { user } = renderTree();
        item('Sent').focus();
        await user.keyboard('*');
        for (const name of ['Inbox', 'Sent', 'Archive']) expect(item(name)).toHaveAttribute('aria-expanded', 'true');
        expect(item('Billing')).toHaveAttribute('aria-expanded', 'false');
    });

    it('moves to the next node whose label starts with the letters typed', async () => {
        const { user } = renderTree({ defaultExpanded: ['inbox'] });
        item('Inbox').focus();
        await user.keyboard('s');
        expect(item('Support')).toHaveFocus();
        await user.keyboard('s');
        expect(item('Sent')).toHaveFocus();
        // The letters typed are forgotten after half a second.
        await act(() => new Promise((resolve) => setTimeout(resolve, 600)));
        await user.keyboard('ar');
        expect(item('Archive')).toHaveFocus();
    });

    it('extends the choice with Shift and Down Arrow in multiple selection', async () => {
        const onSelectedChange = vi.fn();
        const { user } = renderTree({ selectionMode: 'multiple', onSelectedChange });
        item('Inbox').focus();
        await user.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}');
        expect(item('Archive')).toHaveFocus();
        expect(onSelectedChange).toHaveBeenLastCalledWith(['sent', 'archive']);
    });

    it('chooses every node with Control and A, then none', async () => {
        const onSelectedChange = vi.fn();
        const { user } = renderTree({ selectionMode: 'multiple', onSelectedChange });
        item('Inbox').focus();
        await user.keyboard('{Control>}a{/Control}');
        expect(onSelectedChange).toHaveBeenLastCalledWith(['inbox', 'sent', 'archive']);
        await user.keyboard('{Control>}a{/Control}');
        expect(onSelectedChange).toHaveBeenLastCalledWith([]);
    });

    it('moves the node among its siblings with Alt and Up or Down Arrow', async () => {
        function Movable() {
            const [nodes, setNodes] = useState(FOLDERS);
            return <Tree aria-label="Mail folders" nodes={nodes} onNodeMove={(move) => setNodes((current) => moveTreeNode(current, move))} />;
        }
        const { user } = renderUi(<Movable />);
        item('Sent').focus();
        await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
        expect(labels()).toEqual(['Inbox', 'Archive', 'Sent']);
        await waitFor(() => expect(item('Sent')).toHaveFocus());
        await user.keyboard('{Alt>}{ArrowUp}{ArrowUp}{/Alt}');
        expect(labels()).toEqual(['Sent', 'Inbox', 'Archive']);
        await waitFor(() => expect(item('Sent')).toHaveFocus());
    });

    it('moves the node into its previous sibling with Alt and Right Arrow, and out with Alt and Left Arrow', async () => {
        const moves = [];
        function Movable() {
            const [nodes, setNodes] = useState(FOLDERS);
            return (
                <Tree
                    aria-label="Mail folders"
                    nodes={nodes}
                    onNodeMove={(move) => {
                        moves.push(move);
                        setNodes((current) => moveTreeNode(current, move));
                    }}
                />
            );
        }
        const { user } = renderUi(<Movable />);
        item('Sent').focus();
        await user.keyboard('{Alt>}{ArrowRight}{/Alt}');
        expect(moves.at(-1)).toEqual({ id: 'sent', targetId: 'inbox', position: 'inside' });
        await waitFor(() => expect(item('Sent')).toHaveFocus());
        expect(item('Sent')).toHaveAttribute('aria-level', '2');
        expect(item('Inbox')).toHaveAttribute('aria-expanded', 'true');
        await user.keyboard('{Alt>}{ArrowLeft}{/Alt}');
        expect(moves.at(-1)).toEqual({ id: 'sent', targetId: 'inbox', position: 'after' });
        await waitFor(() => expect(item('Sent')).toHaveAttribute('aria-level', '1'));
        await expectNoAxeViolations();
    });

    it('flips Right and Left Arrow in a right-to-left page', async () => {
        const { user } = renderTree({ defaultExpanded: [] }, { dir: 'rtl' });
        item('Inbox').focus();
        await user.keyboard('{ArrowLeft}');
        expect(item('Inbox')).toHaveAttribute('aria-expanded', 'true');
        await user.keyboard('{ArrowLeft}');
        expect(item('Billing')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(item('Inbox')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(item('Inbox')).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens and closes a parent from a click, and keeps the focus when a branch closes over it', async () => {
        const { user } = renderTree({ defaultExpanded: ['inbox'] });
        await user.click(screen.getByText('Billing'));
        expect(item('Billing')).toHaveAttribute('aria-expanded', 'true');
        await user.click(screen.getByText('Refunds'));
        expect(item('Refunds')).toHaveFocus();
        await user.click(item('Inbox').querySelector('[data-slot=tree-node-toggle]'));
        expect(item('Inbox')).toHaveAttribute('aria-expanded', 'false');
        await waitFor(() => expect(item('Inbox')).toHaveFocus());
    });

    it('keeps the open nodes in your state when controlled', async () => {
        function Controlled() {
            const [expanded, setExpanded] = useState([]);
            return (
                <>
                    <button type="button" onClick={() => setExpanded(getExpandableIds(FOLDERS))}>Expand all</button>
                    <Tree aria-label="Mail folders" nodes={FOLDERS} expanded={expanded} onExpandedChange={setExpanded} />
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Expand all' }));
        expect(item('Billing')).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getAllByRole('treeitem')).toHaveLength(9);
        expect(getExpandableIds(FOLDERS)).toEqual(['inbox', 'billing', 'sent', 'archive']);
    });

    it('checks a whole branch, shows a parent as mixed when part of it is checked, and checks all from mixed', async () => {
        const onSelectedChange = vi.fn();
        const { user } = renderTree({ selectionMode: 'checkbox', defaultExpanded: ['inbox', 'billing'], onSelectedChange });
        await user.click(screen.getByText('Billing'));
        expect(item('Billing')).toHaveAttribute('aria-checked', 'true');
        expect(item('Invoices')).toHaveAttribute('aria-checked', 'true');
        expect(item('Refunds')).toHaveAttribute('aria-checked', 'true');
        expect(item('Inbox')).toHaveAttribute('aria-checked', 'mixed');
        expect(onSelectedChange).toHaveBeenLastCalledWith(['billing', 'invoices', 'refunds']);

        item('Refunds').focus();
        await user.keyboard(' ');
        expect(item('Refunds')).toHaveAttribute('aria-checked', 'false');
        expect(item('Billing')).toHaveAttribute('aria-checked', 'mixed');
        expect(item('Billing').querySelector('[data-slot=tree-node-checkbox]')).toHaveAttribute('data-state', 'indeterminate');

        item('Inbox').focus();
        await user.keyboard('{Enter}');
        expect(item('Inbox')).toHaveAttribute('aria-checked', 'true');
        expect(item('Support')).toHaveAttribute('aria-checked', 'true');
        expect(item('Refunds')).toHaveAttribute('aria-checked', 'true');
        await expectNoAxeViolations();
    });

    it('leaves a disabled node out of checking and choosing', async () => {
        const nodes = [{ id: 'team', label: 'Team', children: [{ id: 'owner', label: 'Owner', disabled: true }, { id: 'admins', label: 'Admins' }] }];
        const { user } = renderUi(<Tree aria-label="Roles" nodes={nodes} selectionMode="checkbox" defaultExpanded={['team']} />);
        expect(item('Owner')).toHaveAttribute('aria-disabled', 'true');
        await user.click(screen.getByText('Owner'));
        expect(item('Owner')).toHaveAttribute('aria-checked', 'false');
        await user.click(screen.getByText('Team'));
        expect(item('Admins')).toHaveAttribute('aria-checked', 'true');
        expect(item('Owner')).toHaveAttribute('aria-checked', 'false');
        expect(item('Team')).toHaveAttribute('aria-checked', 'mixed');
        await expectNoAxeViolations();
    });

    it('filters to the matching nodes and their ancestors, and says when nothing matches', async () => {
        const { user } = renderTree({ filter: true }, { strings: { filterTree: 'Filtern', noResults: 'Keine Treffer' } });
        const field = screen.getByRole('textbox', { name: 'Filtern' });
        expect(field).toHaveAttribute('placeholder', 'Filtern');
        await user.type(field, 'refu');
        expect(labels()).toEqual(['Inbox', 'Billing', 'Refunds']);
        expect(item('Inbox')).toHaveAttribute('aria-expanded', 'true');
        expect(item('Billing')).toHaveAttribute('aria-setsize', '1');
        await user.keyboard('{ArrowDown}');
        expect(item('Inbox')).toHaveFocus();
        await expectNoAxeViolations();
        await user.clear(field);
        await user.type(field, 'zzz');
        expect(screen.queryByRole('tree')).toBeNull();
        expect(screen.getByText('Keine Treffer')).toHaveAttribute('role', 'status');
    });

    it('loads children the first time a node opens, with a spinner and a status meanwhile', async () => {
        let resolve;
        const loadChildren = vi.fn(() => new Promise((r) => (resolve = r)));
        const nodes = [{ id: 'shop', label: 'shop.example.com' }, { id: 'readme', label: 'README', leaf: true }];
        const { user } = renderUi(<Tree aria-label="Sites" nodes={nodes} loadChildren={loadChildren} />, {
            strings: { treeLoading: 'Lade {label}' },
        });
        expect(item('README')).not.toHaveAttribute('aria-expanded');
        item('shop.example.com').focus();
        await user.keyboard('{ArrowRight}');
        expect(loadChildren).toHaveBeenCalledTimes(1);
        expect(item('shop.example.com')).toHaveAttribute('aria-busy', 'true');
        expect(screen.getByText('Lade shop.example.com')).toBeInTheDocument();
        await act(async () => resolve([{ id: 'forms', label: 'Contact forms', leaf: true }]));
        expect(item('shop.example.com')).not.toHaveAttribute('aria-busy');
        expect(item('Contact forms')).toHaveAttribute('aria-level', '2');
        await user.keyboard('{ArrowLeft}{ArrowRight}');
        expect(loadChildren).toHaveBeenCalledTimes(1);
        await expectNoAxeViolations();
    });

    it('dims the nodes under a spinner while loading, and draws placeholder rows before the first load', async () => {
        const { rerender } = renderTree({ loading: true });
        expect(document.querySelector('[data-slot=tree]')).toHaveAttribute('aria-busy', 'true');
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
        await expectNoAxeViolations();
        rerender(<Tree aria-label="Mail folders" nodes={[]} loading />);
        expect(screen.queryByRole('tree')).toBeNull();
        expect(document.querySelector('[data-slot=tree-skeleton]')).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByText('Loading')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('shows the empty message, the provider default or your own', async () => {
        const { rerender } = renderUi(<Tree aria-label="Folders" nodes={[]} />);
        expect(screen.getByText('No results')).toBeInTheDocument();
        rerender(<Tree aria-label="Folders" nodes={[]} empty={<p>No folders yet</p>} />);
        expect(screen.getByText('No folders yet')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('draws custom labels and toggle marks', async () => {
        renderTree({
            defaultExpanded: ['inbox'],
            renderLabel: (node, state) => `${node.label} (${state.level})`,
            expandIcon: <span data-testid="plus" />,
            collapseIcon: <span data-testid="minus" />,
        });
        expect(screen.getByText('Billing (2)')).toBeInTheDocument();
        expect(within(item('Inbox')).getAllByTestId('minus')).toHaveLength(1);
        expect(screen.getAllByTestId('plus').length).toBeGreaterThan(0);
        await expectNoAxeViolations();
    });

    it('moves a node with moveTreeNode, and refuses a move into its own branch', () => {
        const moved = moveTreeNode(FOLDERS, { id: 'support', targetId: 'sent', position: 'inside' });
        expect(moved[1].children.map((n) => n.id)).toEqual(['receipts', 'support']);
        expect(moved[0].children.map((n) => n.id)).toEqual(['billing']);
        expect(moveTreeNode(FOLDERS, { id: 'inbox', targetId: 'refunds', position: 'before' })).toBe(FOLDERS);
        const before = moveTreeNode(FOLDERS, { id: 'archive', targetId: 'inbox', position: 'before' });
        expect(before.map((n) => n.id)).toEqual(['archive', 'inbox', 'sent']);
    });

    it('takes a node away from the choice with Shift and Up Arrow in multiple selection', async () => {
        const onSelectedChange = vi.fn();
        const { user } = renderTree({ selectionMode: 'multiple', defaultSelected: ['inbox', 'sent'], onSelectedChange });
        item('Archive').focus();
        await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
        expect(item('Sent')).toHaveFocus();
        expect(onSelectedChange).toHaveBeenLastCalledWith(['inbox']);
    });

    it('clears a branch on a second press when its only unchecked node is disabled', async () => {
        const onSelectedChange = vi.fn();
        const nodes = [{ id: 'team', label: 'Team', children: [{ id: 'owner', label: 'Owner', disabled: true }, { id: 'admins', label: 'Admins' }] }];
        const { user } = renderUi(
            <Tree aria-label="Roles" nodes={nodes} selectionMode="checkbox" defaultExpanded={['team']} onSelectedChange={onSelectedChange} />,
        );
        item('Team').focus();
        await user.keyboard(' ');
        expect(item('Team')).toHaveAttribute('aria-checked', 'mixed');
        expect(item('Admins')).toHaveAttribute('aria-checked', 'true');
        await user.keyboard(' ');
        expect(item('Admins')).toHaveAttribute('aria-checked', 'false');
        expect(item('Team')).toHaveAttribute('aria-checked', 'false');
        expect(onSelectedChange).toHaveBeenLastCalledWith([]);
    });

    it('says where a node moved with Alt and an arrow key', async () => {
        function Movable() {
            const [nodes, setNodes] = useState(FOLDERS);
            return <Tree aria-label="Mail folders" nodes={nodes} onNodeMove={(move) => setNodes((current) => moveTreeNode(current, move))} />;
        }
        const { user } = renderUi(<Movable />, { strings: { itemMoved: '{item} auf Platz {position} von {total}' } });
        const status = document.querySelector('[data-slot=tree-status]');
        item('Sent').focus();
        await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
        expect(status).toHaveTextContent('Sent auf Platz 3 von 3');
        await waitFor(() => expect(item('Sent')).toHaveFocus());
        await user.keyboard('{Alt>}{ArrowRight}{/Alt}');
        // Into Archive, its previous sibling now, after its one child.
        expect(status).toHaveTextContent('Sent auf Platz 2 von 2');
        await waitFor(() => expect(item('Sent')).toHaveAttribute('aria-level', '2'));
    });

    it('closes a node whose children fail to load, says so, and tries again when it opens', async () => {
        let reject;
        let resolve;
        const loadChildren = vi
            .fn()
            .mockImplementationOnce(() => new Promise((_, r) => (reject = r)))
            .mockImplementationOnce(() => new Promise((r) => (resolve = r)));
        const nodes = [{ id: 'shop', label: 'shop.example.com' }];
        const { user } = renderUi(<Tree aria-label="Sites" nodes={nodes} loadChildren={loadChildren} />, {
            strings: { treeLoadFailed: '{label} nicht geladen' },
        });
        const status = document.querySelector('[data-slot=tree-status]');
        item('shop.example.com').focus();
        await user.keyboard('{ArrowRight}');
        expect(item('shop.example.com')).toHaveAttribute('aria-busy', 'true');
        await act(async () => reject(new Error('offline')));
        expect(item('shop.example.com')).toHaveAttribute('aria-expanded', 'false');
        expect(item('shop.example.com')).not.toHaveAttribute('aria-busy');
        expect(status).toHaveTextContent('shop.example.com nicht geladen');
        expect(item('shop.example.com')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(loadChildren).toHaveBeenCalledTimes(2);
        await act(async () => resolve([{ id: 'forms', label: 'Contact forms', leaf: true }]));
        expect(item('Contact forms')).toHaveAttribute('aria-level', '2');
        expect(status).toHaveTextContent('');
        await expectNoAxeViolations();
    });

    it('treats a loader that throws as a failed load', async () => {
        const loadChildren = vi.fn(() => {
            throw new Error('no network');
        });
        const { user } = renderUi(<Tree aria-label="Sites" nodes={[{ id: 'shop', label: 'shop.example.com' }]} loadChildren={loadChildren} />);
        item('shop.example.com').focus();
        await user.keyboard('{ArrowRight}');
        await waitFor(() => expect(item('shop.example.com')).toHaveAttribute('aria-expanded', 'false'));
        expect(screen.getByText('Could not load shop.example.com')).toBeInTheDocument();
    });

    it('calls nothing of yours when a load settles after the tree is gone', async () => {
        let reject;
        const onExpandedChange = vi.fn();
        const loadChildren = () => new Promise((_, r) => (reject = r));
        const { user, unmount } = renderUi(
            <Tree aria-label="Sites" nodes={[{ id: 'shop', label: 'shop.example.com' }]} loadChildren={loadChildren} onExpandedChange={onExpandedChange} />,
        );
        item('shop.example.com').focus();
        await user.keyboard('{ArrowRight}');
        expect(onExpandedChange).toHaveBeenCalledTimes(1);
        unmount();
        await act(async () => reject(new Error('late')));
        expect(onExpandedChange).toHaveBeenCalledTimes(1);
    });

    it('clears the type-ahead timer when the tree goes away', () => {
        const set = vi.spyOn(globalThis, 'setTimeout');
        const clear = vi.spyOn(globalThis, 'clearTimeout');
        try {
            const { unmount } = renderTree();
            fireEvent.keyDown(item('Inbox'), { key: 's' });
            const call = set.mock.calls.findIndex(([, delay]) => delay === 500);
            expect(call).toBeGreaterThanOrEqual(0);
            const timer = set.mock.results[call].value;
            clear.mockClear();
            unmount();
            expect(clear).toHaveBeenCalledWith(timer);
        } finally {
            set.mockRestore();
            clear.mockRestore();
        }
    });
});
