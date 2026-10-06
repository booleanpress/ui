import { createRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen } from '@testing-library/react';
import { VirtualScroller } from '@/components/virtual-scroller';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const ROWS = Array.from({ length: 100_000 }, (_, index) => `Message ${index + 1}`);

// jsdom has no layout: the region is 200px each way and a measured item 50px; scrollTo moves the region and fires scroll.
beforeEach(() => {
    const size = function size() {
        const slot = this.getAttribute('data-slot');
        if (slot === 'virtual-scroller') return 200;
        if (slot === 'virtual-scroller-item' || slot === 'virtual-scroller-row') return 50;
        return 0;
    };
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(size);
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(size);
    vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(size);
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(size);
    // The region scrolls as far as its content is long.
    const extent = (axis) =>
        function scrollSize() {
            const content = this.querySelector?.('[data-slot=virtual-scroller-content]');
            return content ? parseFloat(content.style[axis]) || 0 : 0;
        };
    vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(extent('height'));
    vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(extent('width'));
    // As a browser does, a scroll to where the region already is fires no event.
    Element.prototype.scrollTo = vi.fn(function scrollTo({ top, left }) {
        const before = [this.scrollTop, this.scrollLeft];
        if (top !== undefined) this.scrollTop = top;
        if (left !== undefined) this.scrollLeft = left;
        if (before[0] === this.scrollTop && before[1] === this.scrollLeft) return;
        this.dispatchEvent(new Event('scroll'));
        this.dispatchEvent(new Event('scrollend'));
    });
});

afterEach(() => {
    vi.restoreAllMocks();
    delete Element.prototype.scrollTo;
});

const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 60)));
const region = () => screen.getByRole('region', { name: 'Delivery log' });
const rendered = () => screen.queryAllByRole('listitem');

function Log(props) {
    return <VirtualScroller aria-label="Delivery log" items={ROWS} itemSize={50} renderItem={(row) => row} {...props} />;
}

describe('VirtualScroller', () => {
    it('renders only the items in view and a few either side, each with its place in the whole list', async () => {
        renderUi(<Log />);
        const items = rendered();
        expect(items.length).toBe(9);
        expect(items[0]).toHaveTextContent('Message 1');
        expect(items[0]).toHaveAttribute('aria-posinset', '1');
        expect(items[0]).toHaveAttribute('aria-setsize', '100000');
        expect(screen.getByRole('list')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('renders a new slice as it scrolls', async () => {
        renderUi(<Log />);
        await act(async () => {
            region().scrollTop = 250_000;
            fireEvent.scroll(region());
        });
        const items = rendered();
        expect(items.length).toBeLessThan(20);
        expect(items.map((item) => item.textContent)).toContain('Message 5001');
        expect(screen.queryByText('Message 1')).toBeNull();
    });

    it('takes the focus with Tab, so the browser can scroll it with the arrow and page keys', async () => {
        const { user } = renderUi(<Log />);
        await user.tab();
        expect(region()).toHaveFocus();
        expect(region()).toHaveAttribute('tabindex', '0');
    });

    it('scrolls to the last and the first item with End and Home', async () => {
        const { user } = renderUi(<Log />);
        await user.tab();
        await user.keyboard('{End}');
        await act(() => new Promise((resolve) => setTimeout(resolve, 20)));
        expect(region().scrollTop).toBe(100_000 * 50 - 200);
        expect(rendered().at(-1)).toHaveAttribute('aria-posinset', '100000');
        await user.keyboard('{Home}');
        await act(() => new Promise((resolve) => setTimeout(resolve, 20)));
        expect(region().scrollTop).toBe(0);
    });

    it('scrolls to an item with scrollToIndex from its ref', async () => {
        const ref = createRef();
        renderUi(<Log ref={ref} />);
        expect(ref.current.element).toBe(region());
        await act(async () => ref.current.scrollToIndex(4_999, { align: 'start' }));
        await act(() => new Promise((resolve) => setTimeout(resolve, 20)));
        expect(region().scrollTop).toBe(4_999 * 50);
        expect(rendered().map((item) => item.textContent)).toContain('Message 5000');
        await act(async () => ref.current.scrollToOffset(100));
        expect(region().scrollTop).toBe(100);
    });

    it('scrolls a row with `orientation="horizontal"`', async () => {
        renderUi(<Log orientation="horizontal" />);
        const [first, second] = rendered();
        expect(region()).toHaveAttribute('data-orientation', 'horizontal');
        expect(first.style.width).toBe('50px');
        expect(second.style.transform).toBe('translateX(50px)');
        expect(rendered().length).toBe(9);
    });

    it('mirrors a horizontal row in a right-to-left page', async () => {
        renderUi(<Log orientation="horizontal" />, { dir: 'rtl' });
        expect(rendered()[1].style.transform).toBe('translateX(-50px)');
    });

    it('lays a grid out `columns` to a row, virtualised by row', async () => {
        renderUi(<Log orientation="grid" columns={3} />);
        const rows = document.querySelectorAll('[data-slot=virtual-scroller-row]');
        expect(rows.length).toBe(9);
        expect(rows[0].querySelectorAll('[role=listitem]')).toHaveLength(3);
        expect(rendered()[4]).toHaveAttribute('aria-posinset', '5');
        expect(rendered()[4]).toHaveTextContent('Message 5');
        await expectNoAxeViolations();
    });

    it('measures items without `itemSize`', async () => {
        renderUi(<Log itemSize={undefined} estimatedItemSize={30} />);
        await settle();
        const items = rendered();
        expect(items[0].style.height).toBe('');
        expect(items[0]).toHaveAttribute('data-index', '0');
        expect(items[1].style.transform).toBe('translateY(50px)');
    });

    it('asks for more once the end is in view, shows loading rows meanwhile, and asks once per length', async () => {
        const onLoadMore = vi.fn();
        function Lazy() {
            const [rows, setRows] = useState(ROWS.slice(0, 6));
            const [loading, setLoading] = useState(false);
            return (
                <>
                    <VirtualScroller
                        aria-label="Delivery log"
                        items={rows}
                        itemSize={50}
                        hasMore={rows.length < 12}
                        loading={loading}
                        onLoadMore={() => {
                            onLoadMore();
                            setLoading(true);
                        }}
                        renderItem={(row) => row}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setRows(ROWS.slice(0, 12));
                            setLoading(false);
                        }}
                    >
                        Finish
                    </button>
                </>
            );
        }
        const { user } = renderUi(<Lazy />);
        expect(onLoadMore).toHaveBeenCalledTimes(1);
        expect(region()).toHaveAttribute('aria-busy', 'true');
        expect(document.querySelectorAll('[data-slot=virtual-scroller-loader]')).toHaveLength(3);
        expect(document.querySelector('[data-slot=virtual-scroller-loader]')).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByRole('status')).toHaveTextContent('Loading more…');
        expect(rendered()[0]).toHaveAttribute('aria-setsize', '-1');
        await expectNoAxeViolations();
        await user.click(screen.getByRole('button', { name: 'Finish' }));
        expect(region()).not.toHaveAttribute('aria-busy');
        expect(rendered()[0]).toHaveAttribute('aria-setsize', '12');
        expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('does not ask for more before the end is near', async () => {
        const onLoadMore = vi.fn();
        renderUi(<Log hasMore onLoadMore={onLoadMore} />);
        expect(onLoadMore).not.toHaveBeenCalled();
    });

    it('says "Loading" while the first items load, and has no items to say so of when empty', async () => {
        const { unmount } = renderUi(<Log items={[]} loading />);
        expect(screen.getByRole('status')).toHaveTextContent('Loading');
        await expectNoAxeViolations();
        unmount();
        renderUi(<Log items={[]} empty="No messages sent yet" />);
        expect(screen.getByText('No messages sent yet')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('drops the list roles with `list={false}`', async () => {
        renderUi(<Log list={false} />);
        expect(screen.queryByRole('list')).toBeNull();
        expect(document.querySelector('[data-slot=virtual-scroller-item]')).not.toHaveAttribute('aria-posinset');
        await expectNoAxeViolations();
    });

    it('reads its loading text from the provider', async () => {
        renderUi(<Log items={ROWS.slice(0, 3)} loading />, { strings: { loadingMore: 'Lädt weitere…' } });
        expect(screen.getByRole('status')).toHaveTextContent('Lädt weitere…');
    });

    it('does not key every item again on each scroll, so long lists stay fast', async () => {
        const getItemKey = vi.fn((row) => row);
        renderUi(<Log getItemKey={(row, index) => getItemKey(row, index)} />);
        getItemKey.mockClear();
        await act(async () => {
            region().scrollTop = 5_000;
            fireEvent.scroll(region());
        });
        expect(rendered().map((item) => item.textContent)).toContain('Message 101');
        expect(getItemKey.mock.calls.length).toBeLessThan(1_000);
    });

    it('follows an `itemSize` changed after mount', async () => {
        const { rerender } = renderUi(<Log />);
        expect(rendered()[1].style.transform).toBe('translateY(50px)');
        rerender(<Log itemSize={80} />);
        await settle();
        expect(rendered()[1].style.transform).toBe('translateY(80px)');
        expect(rendered()[1].style.height).toBe('80px');
    });

    it('asks again after a load that added nothing once the end leaves the view and comes back', async () => {
        const onLoadMore = vi.fn();
        const rows = ROWS.slice(0, 20);
        renderUi(<Log items={rows} hasMore onLoadMore={onLoadMore} />);
        await act(async () => {
            region().scrollTop = 20 * 50 - 200;
            fireEvent.scroll(region());
        });
        expect(onLoadMore).toHaveBeenCalledTimes(1);
        // The request failed: nothing was added. Scrolling at the end does not ask again…
        await act(async () => {
            region().scrollTop = 20 * 50 - 250;
            fireEvent.scroll(region());
        });
        expect(onLoadMore).toHaveBeenCalledTimes(1);
        // …but leaving the end and coming back does.
        await act(async () => {
            region().scrollTop = 0;
            fireEvent.scroll(region());
        });
        await act(async () => {
            region().scrollTop = 20 * 50 - 200;
            fireEvent.scroll(region());
        });
        expect(onLoadMore).toHaveBeenCalledTimes(2);
    });

    it('keys items with getItemKey and draws a custom loader', async () => {
        renderUi(<Log items={ROWS.slice(0, 2)} loading getItemKey={(row) => row} renderLoader={(index) => <span>Placeholder {index + 1}</span>} />);
        expect(screen.getByText('Placeholder 1', { selector: 'span' })).toBeInTheDocument();
        expect(rendered()).toHaveLength(2);
    });
});
