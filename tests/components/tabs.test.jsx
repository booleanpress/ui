import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { createRef, useState } from 'react';
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from '@/components/tabs';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Example() {
    return (
        <Tabs defaultValue="all">
            <TabsList aria-label="Status">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
                <TabsTrigger value="pending" disabled>Pending</TabsTrigger>
            </TabsList>
            <TabsContent value="all">All messages</TabsContent>
            <TabsContent value="failed">Failed messages</TabsContent>
        </Tabs>
    );
}

describe('Tabs', () => {
    it('selects with the arrow keys and shows the matching panel', async () => {
        const { user } = renderUi(<Example />);
        await user.tab();
        expect(screen.getByRole('tab', { name: 'All' })).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('tab', { name: 'Failed' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Failed messages');
        await expectNoAxeViolations();
    });

    it('skips a disabled tab and wraps', async () => {
        const { user } = renderUi(<Example />);
        await user.tab();
        await user.keyboard('{ArrowRight}{ArrowRight}');
        expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
    });

    it('follows the provider direction: ArrowLeft moves forward in RTL', async () => {
        const { user } = renderUi(<Example />, { dir: 'rtl' });
        await user.tab();
        await user.keyboard('{ArrowLeft}');
        expect(screen.getByRole('tab', { name: 'Failed' })).toHaveAttribute('aria-selected', 'true');
    });

    it('underlines the selected tab in the primary colour and draws the others in the secondary-text colour', () => {
        renderUi(<Example />);
        const tab = screen.getByRole('tab', { name: 'Failed' });
        expect(tab.className).toContain('data-[state=active]:text-primary');
        expect(tab.className).toContain('after:bg-primary');
        expect(tab.className).toContain('text-muted-foreground');
        expect(tab.className).not.toContain('text-foreground/60');
        const list = screen.getByRole('tablist');
        expect(list.className).toContain('group-data-[orientation=horizontal]/tabs:border-b');
        expect(list.className).not.toContain('bg-muted');
    });

    it('reaches the selected tab, then the panel, with Tab', async () => {
        const { user } = renderUi(<Example />);
        await user.tab();
        expect(screen.getByRole('tab', { name: 'All' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('tabpanel')).toHaveFocus();
    });

    it('moves to the first and the last tab with Home and End', async () => {
        const { user } = renderUi(<Example />);
        await user.tab();
        await user.keyboard('{End}');
        expect(screen.getByRole('tab', { name: 'Failed' })).toHaveFocus();
        await user.keyboard('{Home}');
        expect(screen.getByRole('tab', { name: 'All' })).toHaveFocus();
    });

    it('moves with ArrowDown and ArrowUp in a vertical list', async () => {
        const { user } = renderUi(
            <Tabs defaultValue="a" orientation="vertical">
                <TabsList aria-label="Settings">
                    <TabsTrigger value="a">General</TabsTrigger>
                    <TabsTrigger value="b">Sending</TabsTrigger>
                </TabsList>
                <TabsContent value="a">General settings</TabsContent>
                <TabsContent value="b">Sending settings</TabsContent>
            </Tabs>,
        );
        await user.tab();
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('tab', { name: 'Sending' })).toHaveFocus();
        await user.keyboard('{ArrowUp}');
        expect(screen.getByRole('tab', { name: 'General' })).toHaveFocus();
    });
});

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June'];

function Scrollable() {
    return (
        <Tabs defaultValue="January">
            <TabsList scrollable aria-label="Months">
                {MONTHS.map((m) => <TabsTrigger key={m} value={m}>{m}</TabsTrigger>)}
            </TabsList>
            {MONTHS.map((m) => <TabsContent key={m} value={m}>Report for {m}</TabsContent>)}
        </Tabs>
    );
}

/** jsdom has no layout: give every tab list a 300px box over 900px of tabs, and record scrollBy. */
function fakeOverflow() {
    const proto = window.HTMLElement.prototype;
    const restore = [
        ['scrollWidth', Object.getOwnPropertyDescriptor(proto, 'scrollWidth')],
        ['clientWidth', Object.getOwnPropertyDescriptor(proto, 'clientWidth')],
    ];
    Object.defineProperty(proto, 'scrollWidth', { configurable: true, get() { return this.getAttribute('role') === 'tablist' ? 900 : 0; } });
    Object.defineProperty(proto, 'clientWidth', { configurable: true, get() { return this.getAttribute('role') === 'tablist' ? 300 : 0; } });
    const scrollBy = vi.fn(function scrollBy({ left }) {
        this.scrollLeft += left;
        this.dispatchEvent(new Event('scroll'));
    });
    proto.scrollBy = scrollBy;
    return {
        scrollBy,
        undo() {
            for (const [key, descriptor] of restore) {
                if (descriptor) Object.defineProperty(proto, key, descriptor);
                else delete proto[key];
            }
            delete proto.scrollBy;
        },
    };
}

function Drafts({ initial = ['Welcome', 'Reset', 'Invoice'], first = 'Welcome', onClosed = () => {} }) {
    const [drafts, setDrafts] = useState(initial);
    const [value, setValue] = useState(first);
    return (
        <Tabs value={value} onValueChange={setValue}>
            <TabsList aria-label="Drafts">
                {drafts.map((d) => (
                    <TabsTrigger
                        key={d}
                        value={d}
                        onClose={() => {
                            onClosed(d);
                            setDrafts((list) => list.filter((x) => x !== d));
                        }}
                    >
                        {d}
                    </TabsTrigger>
                ))}
            </TabsList>
            {drafts.map((d) => <TabsContent key={d} value={d}>Editing {d}</TabsContent>)}
        </Tabs>
    );
}

describe('Tabs: scrollable', () => {
    let fake;
    afterEach(() => fake?.undo());

    it('shows the next button only while there is more, scrolls with it, then shows the previous one', async () => {
        fake = fakeOverflow();
        const { user } = renderUi(<Scrollable />);
        expect(screen.queryByRole('button', { name: 'Scroll tabs backward' })).toBeNull();
        const forward = screen.getByRole('button', { name: 'Scroll tabs forward' });
        await user.click(forward);
        expect(fake.scrollBy).toHaveBeenCalledTimes(1);
        expect(fake.scrollBy.mock.calls[0][0].left).toBeGreaterThan(0);
        expect(screen.getByRole('button', { name: 'Scroll tabs backward' })).toBeInTheDocument();
        // 600px of overflow, a page of 228px: two more presses reach the end, and the next button goes.
        await user.click(screen.getByRole('button', { name: 'Scroll tabs forward' }));
        await user.click(screen.getByRole('button', { name: 'Scroll tabs forward' }));
        expect(screen.queryByRole('button', { name: 'Scroll tabs forward' })).toBeNull();
        await user.click(screen.getByRole('button', { name: 'Scroll tabs backward' }));
        expect(fake.scrollBy.mock.calls[3][0].left).toBeLessThan(0);
        expect(screen.getByRole('button', { name: 'Scroll tabs forward' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('scrolls toward the inline end in RTL, and names the buttons from the provider', async () => {
        fake = fakeOverflow();
        const { user } = renderUi(<Scrollable />, { dir: 'rtl', strings: { scrollTabsForward: 'Weiter blättern' } });
        await user.click(screen.getByRole('button', { name: 'Weiter blättern' }));
        expect(fake.scrollBy.mock.calls[0][0].left).toBeLessThan(0);
    });

    it('keeps the scroll buttons out of the tab order, so the list stays one tab stop', async () => {
        fake = fakeOverflow();
        const { user } = renderUi(<Scrollable />);
        expect(screen.getByRole('button', { name: 'Scroll tabs forward' })).toHaveAttribute('tabindex', '-1');
        await user.tab();
        expect(screen.getByRole('tab', { name: 'January' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('tabpanel')).toHaveFocus();
    });

    it('scrolls the selected tab into view clear of the buttons, on load and when the selection changes', async () => {
        fake = fakeOverflow();
        // Six 150px tabs in a 300px list, laid out from its left edge and moved by its scroll.
        const proto = window.HTMLElement.prototype;
        const original = proto.getBoundingClientRect;
        proto.getBoundingClientRect = function getBoundingClientRect() {
            const box = (left, width) => ({ left, right: left + width, top: 0, bottom: 40, width, height: 40, x: left, y: 0 });
            if (this.getAttribute('role') === 'tablist') return box(0, 300);
            if (this.getAttribute('role') === 'tab') {
                const list = this.closest('[role="tablist"]');
                return box([...list.children].indexOf(this) * 150 - list.scrollLeft, 150);
            }
            return original.call(this);
        };
        try {
            function Controlled() {
                const [value, setValue] = useState('May');
                return (
                    <>
                        <button type="button" onClick={() => setValue('January')}>Back to January</button>
                        <Tabs value={value} onValueChange={setValue}>
                            <TabsList scrollable aria-label="Months">
                                {MONTHS.map((m) => <TabsTrigger key={m} value={m}>{m}</TabsTrigger>)}
                            </TabsList>
                        </Tabs>
                    </>
                );
            }
            const { user } = renderUi(<Controlled />);
            // May spans 600–750px: its end is brought to 36px short of the list's end, at once.
            expect(fake.scrollBy).toHaveBeenCalledWith({ left: 486, behavior: 'instant' });
            await user.click(screen.getByRole('button', { name: 'Back to January' }));
            await waitFor(() => expect(fake.scrollBy).toHaveBeenLastCalledWith({ left: -486, behavior: 'smooth' }));
        } finally {
            proto.getBoundingClientRect = original;
        }
    });

    it('hands a ref to the scrollable list and keeps its buttons working', async () => {
        fake = fakeOverflow();
        const ref = createRef();
        const { user } = renderUi(
            <Tabs defaultValue="January">
                <TabsList scrollable aria-label="Months" ref={ref}>
                    {MONTHS.map((m) => <TabsTrigger key={m} value={m}>{m}</TabsTrigger>)}
                </TabsList>
            </Tabs>,
        );
        expect(ref.current).toBe(screen.getByRole('tablist'));
        await user.click(screen.getByRole('button', { name: 'Scroll tabs forward' }));
        expect(fake.scrollBy).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: 'Scroll tabs backward' })).toBeInTheDocument();
    });

    it('moves focus along a scrollable list with Right Arrow, selecting each tab', async () => {
        fake = fakeOverflow();
        const { user } = renderUi(<Scrollable />);
        await user.tab();
        await user.keyboard('{ArrowRight}{ArrowRight}');
        expect(screen.getByRole('tab', { name: 'March' })).toHaveFocus();
        expect(screen.getByRole('tab', { name: 'March' })).toHaveAttribute('aria-selected', 'true');
    });
});

describe('Tabs: closable', () => {
    it('closes the selected tab with Delete: the next tab is selected and takes focus', async () => {
        const closed = [];
        const { user } = renderUi(<Drafts onClosed={(d) => closed.push(d)} />);
        await user.tab();
        expect(screen.getByRole('tab', { name: 'Welcome' })).toHaveFocus();
        await user.keyboard('{Delete}');
        expect(closed).toEqual(['Welcome']);
        expect(screen.queryByRole('tab', { name: 'Welcome' })).toBeNull();
        const reset = screen.getByRole('tab', { name: 'Reset' });
        expect(reset).toHaveFocus();
        expect(reset).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Editing Reset');
        await expectNoAxeViolations();
    });

    it('closes with Backspace too; the last tab hands over to the previous one', async () => {
        const { user } = renderUi(<Drafts first="Invoice" />);
        await user.tab();
        expect(screen.getByRole('tab', { name: 'Invoice' })).toHaveFocus();
        await user.keyboard('{Backspace}');
        expect(screen.getByRole('tab', { name: 'Reset' })).toHaveFocus();
        expect(screen.getByRole('tab', { name: 'Reset' })).toHaveAttribute('aria-selected', 'true');
    });

    it('closes a background tab with its × and keeps the selection where it was', async () => {
        const { user } = renderUi(<Drafts />);
        const reset = screen.getByRole('tab', { name: 'Reset' });
        await user.click(reset.querySelector('[data-slot=tabs-trigger-close]'));
        expect(screen.queryByRole('tab', { name: 'Reset' })).toBeNull();
        expect(screen.getByRole('tab', { name: 'Welcome' })).toHaveAttribute('aria-selected', 'true');
    });

    it('closes the selected tab with its × and selects the neighbour', async () => {
        const { user } = renderUi(<Drafts />);
        const welcome = screen.getByRole('tab', { name: 'Welcome' });
        await user.click(welcome.querySelector('[data-slot=tabs-trigger-close]'));
        expect(screen.getByRole('tab', { name: 'Reset' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: 'Reset' })).toHaveFocus();
    });

    it('names the × from the provider, hides it from assistive technology, and announces the Delete key', async () => {
        renderUi(<Drafts />, { strings: { closeTab: '{label} schließen' } });
        const tab = screen.getByRole('tab', { name: 'Welcome' });
        expect(tab).toHaveAttribute('aria-keyshortcuts', 'Delete');
        const close = tab.querySelector('[data-slot=tabs-trigger-close]');
        expect(close).toHaveAttribute('aria-hidden', 'true');
        await waitFor(() => expect(close).toHaveAttribute('title', 'Welcome schließen'));
        await expectNoAxeViolations();
    });

    it('leaves Delete alone on a tab that is not closable', async () => {
        const { user } = renderUi(<Example />);
        await user.tab();
        await user.keyboard('{Delete}');
        expect(screen.getByRole('tab', { name: 'All' })).toHaveFocus();
        expect(screen.getByRole('tab', { name: 'All' })).not.toHaveAttribute('aria-keyshortcuts');
    });

    it('selects the neighbour of an uncontrolled Tabs too', async () => {
        function Uncontrolled() {
            const [tabs, setTabs] = useState(['One', 'Two']);
            return (
                <Tabs defaultValue="One">
                    <TabsList aria-label="Uncontrolled">
                        {tabs.map((t) => (
                            <TabsTrigger key={t} value={t} onClose={() => setTabs((l) => l.filter((x) => x !== t))}>{t}</TabsTrigger>
                        ))}
                    </TabsList>
                    {tabs.map((t) => <TabsContent key={t} value={t}>Panel {t}</TabsContent>)}
                </Tabs>
            );
        }
        const { user } = renderUi(<Uncontrolled />);
        await user.tab();
        await user.keyboard('{Delete}');
        expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel Two');
    });
});

describe('Tabs: activation and control', () => {
    function Manual() {
        return (
            <Tabs defaultValue="sent" activationMode="manual">
                <TabsList aria-label="Mail">
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="failed">Failed</TabsTrigger>
                    <TabsTrigger value="queued">Queued</TabsTrigger>
                </TabsList>
                <TabsContent value="sent">Sent mail</TabsContent>
                <TabsContent value="failed">Failed mail</TabsContent>
                <TabsContent value="queued">Queued mail</TabsContent>
            </Tabs>
        );
    }

    it('with manual activation, moves focus with the arrow keys and selects with Enter', async () => {
        const { user } = renderUi(<Manual />);
        await user.tab();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('tab', { name: 'Failed' })).toHaveFocus();
        expect(screen.getByRole('tab', { name: 'Sent' })).toHaveAttribute('aria-selected', 'true');
        await user.keyboard('{Enter}');
        expect(screen.getByRole('tab', { name: 'Failed' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Failed mail');
        await expectNoAxeViolations();
    });

    it('with manual activation, selects with Space', async () => {
        const { user } = renderUi(<Manual />);
        await user.tab();
        await user.keyboard('{End}');
        await user.keyboard(' ');
        expect(screen.getByRole('tab', { name: 'Queued' })).toHaveAttribute('aria-selected', 'true');
    });

    it('follows a controlled value set from outside the tabs', async () => {
        const changes = [];
        function Controlled() {
            const [tab, setTab] = useState('overview');
            return (
                <>
                    <button type="button" onClick={() => setTab('logs')}>Show the logs</button>
                    <Tabs value={tab} onValueChange={(v) => { changes.push(v); setTab(v); }}>
                        <TabsList aria-label="Mailer">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="logs">Logs</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview">Overview panel</TabsContent>
                        <TabsContent value="logs">Logs panel</TabsContent>
                    </Tabs>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Show the logs' }));
        expect(screen.getByRole('tab', { name: 'Logs' })).toHaveAttribute('aria-selected', 'true');
        await user.click(screen.getByRole('tab', { name: 'Overview' }));
        expect(changes).toEqual(['overview']);
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    });
});

describe('TabsIndicator', () => {
    it('hides the tabs’ own bars and moves to the selected tab with a transform', async () => {
        const proto = window.HTMLElement.prototype;
        const left = Object.getOwnPropertyDescriptor(proto, 'offsetLeft');
        const width = Object.getOwnPropertyDescriptor(proto, 'offsetWidth');
        Object.defineProperty(proto, 'offsetLeft', { configurable: true, get() { return this.textContent === 'Billing' ? 120 : 0; } });
        Object.defineProperty(proto, 'offsetWidth', { configurable: true, get() { return this.getAttribute('role') === 'tab' ? 100 : 0; } });
        try {
            const { user } = renderUi(
                <Tabs defaultValue="account">
                    <TabsList aria-label="Settings">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="billing">Billing</TabsTrigger>
                        <TabsIndicator />
                    </TabsList>
                    <TabsContent value="account">Account panel</TabsContent>
                    <TabsContent value="billing">Billing panel</TabsContent>
                </Tabs>,
            );
            const indicator = document.querySelector('[data-slot=tabs-indicator]');
            expect(indicator).toHaveAttribute('aria-hidden', 'true');
            expect(indicator.style.transform).toBe('translateX(0px) scaleX(100)');
            expect(screen.getByRole('tab', { name: 'Account' }).className).toContain('[[data-slot=tabs-list]:has(>[data-slot=tabs-indicator])_&]:after:hidden');
            await user.click(screen.getByRole('tab', { name: 'Billing' }));
            await waitFor(() => expect(indicator.style.transform).toBe('translateX(120px) scaleX(100)'));
            await act(() => new Promise((r) => requestAnimationFrame(r)));
            expect(indicator).toHaveAttribute('data-ready');
            await expectNoAxeViolations();
        } finally {
            if (left) Object.defineProperty(proto, 'offsetLeft', left);
            if (width) Object.defineProperty(proto, 'offsetWidth', width);
        }
    });
});
