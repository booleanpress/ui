import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { Tree, moveTreeNode } from '@/components/tree';
import { DraggableTree } from '@/components/tree-drag';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const FILES = [
    { id: 'templates', label: 'templates', children: [{ id: 'welcome', label: 'welcome.html', leaf: true }] },
    { id: 'partials', label: 'partials', children: [{ id: 'header', label: 'header.html', leaf: true }] },
    { id: 'styles', label: 'styles.css', leaf: true },
];

const item = (name) => screen.getByRole('treeitem', { name: new RegExp(`^${name}`) });
const row = (name) => item(name).querySelector('[data-slot=tree-node-content]');
const labels = () => screen.getAllByRole('treeitem').map((node) => node.querySelector('[data-slot=tree-node-label]').textContent);

// jsdom has no layout: each node's row is given a 300 × 29 px box, 30 px below the one before, in document order.
function layOutRows() {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect() {
        const rows = [...document.querySelectorAll('[data-slot=tree-node-content]')];
        const at = rows.indexOf(this);
        const top = at < 0 ? 0 : at * 30;
        const height = at < 0 ? 0 : 29;
        const width = at < 0 ? 0 : 300;
        return { x: 0, y: top, top, left: 0, right: width, bottom: top + height, width, height, toJSON() {} };
    });
}

function Files({ onMove = () => {}, ...props }) {
    const [nodes, setNodes] = useState(FILES);
    return (
        <DraggableTree
            aria-label="Theme files"
            nodes={nodes}
            defaultExpanded={['templates', 'partials']}
            onNodeMove={(move) => {
                onMove(move);
                setNodes((current) => moveTreeNode(current, move));
            }}
            {...props}
        />
    );
}

// A mouse drag (dnd kit's mouse sensor): press, pass the 4 px activation distance, then move over the target.
async function drag(from, toY) {
    const box = from.getBoundingClientRect();
    const start = { button: 0, clientX: 20, clientY: box.top + 14 };
    await act(async () => fireEvent.mouseDown(from, start));
    await act(async () => fireEvent.mouseMove(from, { ...start, clientY: start.clientY + 8 }));
    await act(async () => fireEvent.mouseMove(from, { ...start, clientY: toY }));
    await act(async () => fireEvent.mouseMove(from, { ...start, clientY: toY + 1 }));
    return start;
}

const drop = (from, start, clientY) => act(async () => fireEvent.mouseUp(from, { ...start, clientY }));

describe('DraggableTree', () => {
    afterEach(() => vi.restoreAllMocks());

    it('renders the drag-and-drop tree without changing its semantics', async () => {
        renderUi(<Files />);
        expect(item('templates')).toHaveAttribute('role', 'treeitem');
        expect(item('templates')).not.toHaveAttribute('aria-roledescription');
        expect(row('templates')).not.toHaveAttribute('aria-roledescription');
        // dnd kit's hidden regions are on the page: the drag layer is in place.
        expect(document.querySelector('[id^=DndDescribedBy], [id^=DndLiveRegion]')).not.toBeNull();
        await expectNoAxeViolations();
    });

    it('drops a node into a folder with the pointer, marking the source and the target meanwhile', async () => {
        layOutRows();
        const onMove = vi.fn();
        renderUi(<Files onMove={onMove} />);
        const source = row('styles.css');
        const target = row('templates').getBoundingClientRect();
        const start = await drag(source, target.top + 14);
        expect(row('styles.css')).toHaveAttribute('data-dragging', 'true');
        await waitFor(() => expect(row('templates')).toHaveAttribute('data-drop', 'inside'));
        await drop(source, start, target.top + 15);
        expect(onMove).toHaveBeenCalledWith({ id: 'styles', targetId: 'templates', position: 'inside' });
        expect(item('styles.css')).toHaveAttribute('aria-level', '2');
        expect(document.querySelector('[data-drop]')).toBeNull();
        expect(document.querySelector('[data-dragging]')).toBeNull();
    });

    it('drops a node before another from the top quarter of its row', async () => {
        layOutRows();
        const onMove = vi.fn();
        renderUi(<Files onMove={onMove} />);
        const source = row('styles.css');
        const target = row('templates').getBoundingClientRect();
        const start = await drag(source, target.top + 2);
        await waitFor(() => expect(row('templates')).toHaveAttribute('data-drop', 'before'));
        await drop(source, start, target.top + 3);
        expect(onMove).toHaveBeenCalledWith({ id: 'styles', targetId: 'templates', position: 'before' });
        expect(labels().slice(0, 2)).toEqual(['styles.css', 'templates']);
    });

    it('refuses a drop into the node’s own branch', async () => {
        layOutRows();
        const onMove = vi.fn();
        renderUi(<Files onMove={onMove} />);
        const source = row('templates');
        const target = row('welcome.html').getBoundingClientRect();
        const start = await drag(source, target.top + 14);
        expect(row('welcome.html')).not.toHaveAttribute('data-drop');
        await drop(source, start, target.top + 15);
        expect(onMove).not.toHaveBeenCalled();
    });

    it('keeps the tree’s keyboard moves with Alt and the arrows', async () => {
        const onMove = vi.fn();
        const { user } = renderUi(<Files onMove={onMove} />);
        item('styles.css').focus();
        await user.keyboard('{Alt>}{ArrowUp}{/Alt}');
        expect(onMove).toHaveBeenLastCalledWith({ id: 'styles', targetId: 'partials', position: 'before' });
        await waitFor(() => expect(item('styles.css')).toHaveFocus());
        expect(labels().at(-3)).toBe('styles.css');
    });

    it('leaves a disabled node undraggable', async () => {
        layOutRows();
        const onMove = vi.fn();
        renderUi(<Files onMove={onMove} nodes={[...FILES.slice(0, 2), { ...FILES[2], disabled: true }]} />);
        const source = row('styles.css');
        const target = row('templates').getBoundingClientRect();
        const start = await drag(source, target.top + 14);
        expect(row('styles.css')).not.toHaveAttribute('data-dragging');
        await drop(source, start, target.top + 15);
        expect(onMove).not.toHaveBeenCalled();
    });

    it('is the only way to drag: a plain Tree with onNodeMove has no drag layer', () => {
        renderUi(<Tree aria-label="Theme files" nodes={FILES} onNodeMove={() => {}} />);
        expect(document.querySelector('[id^=DndDescribedBy], [id^=DndLiveRegion]')).toBeNull();
        expect(row('styles.css')).not.toHaveAttribute('aria-describedby');
    });

    it('drags with a finger after a long press', async () => {
        layOutRows();
        const onMove = vi.fn();
        renderUi(<Files onMove={onMove} />);
        const source = row('styles.css');
        const target = row('templates').getBoundingClientRect();
        const at = (clientY) => ({ touches: [{ clientX: 20, clientY }], changedTouches: [{ clientX: 20, clientY }] });
        const startY = source.getBoundingClientRect().top + 14;
        await act(async () => fireEvent.touchStart(source, at(startY)));
        // Held for the 250 ms press before the drag starts.
        await act(() => new Promise((resolve) => setTimeout(resolve, 300)));
        await act(async () => fireEvent.touchMove(source, at(target.top + 14)));
        await act(async () => fireEvent.touchMove(source, at(target.top + 15)));
        expect(row('styles.css')).toHaveAttribute('data-dragging', 'true');
        await waitFor(() => expect(row('templates')).toHaveAttribute('data-drop', 'inside'));
        await act(async () => fireEvent.touchEnd(source, at(target.top + 15)));
        expect(onMove).toHaveBeenCalledWith({ id: 'styles', targetId: 'templates', position: 'inside' });
    });

    it('opens the folder a node is dropped into, and says where it went', async () => {
        layOutRows();
        renderUi(<Files defaultExpanded={[]} />);
        const source = row('styles.css');
        const target = row('templates').getBoundingClientRect();
        const start = await drag(source, target.top + 14);
        await waitFor(() => expect(row('templates')).toHaveAttribute('data-drop', 'inside'));
        await drop(source, start, target.top + 15);
        expect(item('templates')).toHaveAttribute('aria-expanded', 'true');
        expect(item('styles.css')).toHaveAttribute('aria-level', '2');
        expect(document.querySelector('[data-slot=tree-status]')).toHaveTextContent('styles.css moved to position 2 of 2');
    });

    it('drops only before or after a lazy node whose children have not loaded', async () => {
        layOutRows();
        const onMove = vi.fn();
        const nodes = [{ id: 'remote', label: 'remote' }, { id: 'styles', label: 'styles.css', leaf: true }];
        renderUi(<DraggableTree aria-label="Theme files" nodes={nodes} loadChildren={() => new Promise(() => {})} onNodeMove={onMove} />);
        const source = row('styles.css');
        const target = row('remote').getBoundingClientRect();
        const start = await drag(source, target.top + 18);
        await waitFor(() => expect(row('remote')).toHaveAttribute('data-drop', 'after'));
        await drop(source, start, target.top + 19);
        expect(onMove).toHaveBeenCalledWith({ id: 'styles', targetId: 'remote', position: 'after' });
    });

    it('cancels a drag with Escape inside a dialog, and the dialog stays open', async () => {
        layOutRows();
        const onMove = vi.fn();
        renderUi(
            <Dialog defaultOpen>
                <DialogContent>
                    <DialogTitle>Move theme files</DialogTitle>
                    <DialogDescription>Drag a file into a folder.</DialogDescription>
                    <Files onMove={onMove} />
                </DialogContent>
            </Dialog>,
        );
        const source = row('styles.css');
        const target = row('templates').getBoundingClientRect();
        const start = await drag(source, target.top + 14);
        expect(row('styles.css')).toHaveAttribute('data-dragging', 'true');
        // The preview is drawn on the body, outside the dialog's transformed box, so it stays under the pointer.
        const preview = document.querySelector('[data-slot=tree-drag-preview]');
        expect(preview).toHaveTextContent('styles.css');
        expect(preview.closest('[role=dialog]')).toBeNull();
        await act(async () => fireEvent.keyDown(source, { key: 'Escape', code: 'Escape' }));
        expect(row('styles.css')).not.toHaveAttribute('data-dragging');
        expect(screen.getByRole('dialog', { name: 'Move theme files' })).toBeInTheDocument();
        await drop(source, start, target.top + 15);
        expect(onMove).not.toHaveBeenCalled();
    });
});
