import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Splitter, SplitterHandle, SplitterPanel } from '@/components/splitter';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

// jsdom has no layout. react-resizable-panels reads its panels' offset sizes and positions to share out the space and
// to pair each handle with its panels, so this gives each panel a width (or height) of its flex-grow share of 600 px,
// each handle 1 px, and places every child of a group after its previous siblings.
const LAYOUT = ['offsetWidth', 'offsetHeight', 'offsetLeft', 'offsetTop'];
const saved = {};
beforeAll(() => {
    const size = (el) => (el.hasAttribute('data-panel') ? (parseFloat(el.style.flexGrow) || 0) * 6 : el.hasAttribute('data-separator') ? 1 : 0);
    const offset = (el) => {
        let position = 0;
        for (let node = el.previousElementSibling; node; node = node.previousElementSibling) position += size(node);
        return position;
    };
    for (const key of LAYOUT) {
        saved[key] = Object.getOwnPropertyDescriptor(HTMLElement.prototype, key);
        Object.defineProperty(HTMLElement.prototype, key, {
            configurable: true,
            get() {
                return key.endsWith('Width') || key.endsWith('Height') ? size(this) : offset(this);
            },
        });
    }
});
afterAll(() => {
    for (const key of LAYOUT) Object.defineProperty(HTMLElement.prototype, key, saved[key]);
});

function Example({ orientation, withHandle, disabled, first = {}, second = {} }) {
    return (
        <Splitter orientation={orientation} disabled={disabled} className="min-h-60">
            <SplitterPanel id="list" defaultSize="50%" {...first}>Mailers</SplitterPanel>
            <SplitterHandle aria-label="Resize the mailer list" withHandle={withHandle} />
            <SplitterPanel id="detail" {...second}>Details</SplitterPanel>
        </Splitter>
    );
}

const handle = () => screen.getByRole('separator', { name: 'Resize the mailer list' });
const value = () => Number(handle().getAttribute('aria-valuenow'));

describe('Splitter', () => {
    it('renders two panels and a focusable separator that reports the first panel’s size', async () => {
        renderUi(<Example />);
        expect(screen.getByText('Mailers')).toBeInTheDocument();
        expect(handle()).toHaveAttribute('tabindex', '0');
        expect(handle()).toHaveAttribute('aria-orientation', 'vertical');
        await waitFor(() => expect(value()).toBe(50));
        expect(document.querySelector('[data-slot="splitter"]')).toHaveAttribute('data-orientation', 'horizontal');
        await expectNoAxeViolations();
    });

    it('grows the first panel with ArrowRight and shrinks it with ArrowLeft', async () => {
        const { user } = renderUi(<Example />);
        await waitFor(() => expect(value()).toBe(50));
        handle().focus();
        await user.keyboard('{ArrowRight}');
        await waitFor(() => expect(value()).toBe(55));
        await user.keyboard('{ArrowLeft}{ArrowLeft}');
        await waitFor(() => expect(value()).toBe(45));
    });

    it('moves a vertical splitter with ArrowDown and ArrowUp, and ignores Left and Right', async () => {
        const { user } = renderUi(<Example orientation="vertical" />);
        await waitFor(() => expect(value()).toBe(50));
        expect(handle()).toHaveAttribute('aria-orientation', 'horizontal');
        handle().focus();
        await user.keyboard('{ArrowRight}');
        expect(value()).toBe(50);
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(value()).toBe(55));
        await user.keyboard('{ArrowUp}{ArrowUp}');
        await waitFor(() => expect(value()).toBe(45));
    });

    it('gives the first panel its smallest size with Home and its largest with End', async () => {
        const { user } = renderUi(<Example first={{ minSize: '20%', maxSize: '70%' }} />);
        await waitFor(() => expect(value()).toBe(50));
        handle().focus();
        await user.keyboard('{Home}');
        await waitFor(() => expect(value()).toBe(20));
        expect(handle()).toHaveAttribute('aria-valuemin', '20');
        await user.keyboard('{End}');
        await waitFor(() => expect(value()).toBe(70));
        expect(handle()).toHaveAttribute('aria-valuemax', '70');
    });

    it('collapses a collapsible first panel with Enter, and restores it with Enter again', async () => {
        const { user } = renderUi(<Example first={{ collapsible: true, minSize: '30%', collapsedSize: '0%' }} />);
        await waitFor(() => expect(value()).toBe(50));
        handle().focus();
        await user.keyboard('{Enter}');
        await waitFor(() => expect(value()).toBe(0));
        await user.keyboard('{Enter}');
        await waitFor(() => expect(value()).toBe(50));
    });

    it('moves focus to the next handle with F6 and back with Shift+F6', async () => {
        const { user } = renderUi(
            <Splitter>
                <SplitterPanel>Folders</SplitterPanel>
                <SplitterHandle aria-label="Resize folders" />
                <SplitterPanel>Messages</SplitterPanel>
                <SplitterHandle aria-label="Resize messages" />
                <SplitterPanel>Reading pane</SplitterPanel>
            </Splitter>,
        );
        const [first, second] = screen.getAllByRole('separator');
        first.focus();
        await user.keyboard('{F6}');
        expect(second).toHaveFocus();
        await user.keyboard('{Shift>}{F6}{/Shift}');
        expect(first).toHaveFocus();
    });

    it('lays a horizontal splitter out left to right in a right-to-left page, panels reading right to left', async () => {
        const { user } = renderUi(<Example />, { dir: 'rtl' });
        const root = document.querySelector('[data-slot="splitter"]');
        expect(root).toHaveAttribute('dir', 'ltr');
        for (const panel of document.querySelectorAll('[data-slot="splitter-panel"]')) expect(panel).toHaveAttribute('dir', 'rtl');
        await waitFor(() => expect(value()).toBe(50));
        handle().focus();
        await user.keyboard('{ArrowRight}');
        await waitFor(() => expect(value()).toBe(55));
    });

    it('keeps a vertical splitter in the page direction', () => {
        renderUi(<Example orientation="vertical" />, { dir: 'rtl' });
        expect(document.querySelector('[data-slot="splitter"]')).not.toHaveAttribute('dir');
        expect(document.querySelector('[data-slot="splitter-panel"]')).not.toHaveAttribute('dir');
    });

    it('takes a disabled splitter’s handles out of the tab order and ignores the keys', async () => {
        const { user } = renderUi(<Example disabled />);
        await waitFor(() => expect(value()).toBe(50));
        expect(handle()).toHaveAttribute('aria-disabled', 'true');
        expect(handle()).not.toHaveAttribute('tabindex');
        handle().focus();
        await user.keyboard('{ArrowRight}');
        expect(value()).toBe(50);
        await expectNoAxeViolations();
    });

    it('draws the grip with withHandle, and always keeps the 24 px handle that carries the focus outline', () => {
        const { unmount } = renderUi(<Example />);
        const plain = document.querySelector('[data-slot="splitter-handle-grip"]');
        expect(plain).toHaveAttribute('aria-hidden', 'true');
        expect(plain.className).toContain('h-6');
        expect(plain.className).toContain('group-focus-visible/splitter-handle:outline-ring');
        expect(plain.querySelector('svg')).toBeNull();
        unmount();
        renderUi(<Example withHandle />);
        const grip = document.querySelector('[data-slot="splitter-handle-grip"]');
        expect(grip.querySelector('svg')).not.toBeNull();
        expect(grip.className).toContain('border');
    });

    it('drops the frame of a splitter nested in a panel', () => {
        renderUi(
            <Splitter>
                <SplitterPanel>Folders</SplitterPanel>
                <SplitterHandle />
                <SplitterPanel>
                    <Splitter orientation="vertical">
                        <SplitterPanel>Messages</SplitterPanel>
                        <SplitterHandle />
                        <SplitterPanel>Preview</SplitterPanel>
                    </Splitter>
                </SplitterPanel>
            </Splitter>,
        );
        const [outer, inner] = document.querySelectorAll('[data-slot="splitter"]');
        expect(outer.className).toContain('border');
        expect(inner.className).toContain('in-data-[slot=splitter-panel]:border-0');
        expect(inner).toHaveAttribute('data-orientation', 'vertical');
    });
});
