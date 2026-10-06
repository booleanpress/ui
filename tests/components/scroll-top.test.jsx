import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { ScrollTop } from '@/components/scroll-top';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function scrollWindowTo(y) {
    act(() => {
        Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true });
        fireEvent.scroll(window);
    });
}

function scrollBoxTo(box, y) {
    act(() => {
        box.scrollTop = y;
        fireEvent.scroll(box);
    });
}

function LogBox(props) {
    return (
        <div data-testid="box" role="region" aria-label="Delivery log" tabIndex={0}>
            <p>Entry 4820</p>
            <ScrollTop target="parent" threshold={100} {...props} />
        </div>
    );
}

afterEach(() => {
    scrollWindowTo(0);
    vi.restoreAllMocks();
});

describe('ScrollTop', () => {
    it('appears once the window scrolls past the threshold', async () => {
        renderUi(<ScrollTop />);
        expect(screen.queryByRole('button')).toBeNull();
        scrollWindowTo(300);
        expect(screen.queryByRole('button')).toBeNull();
        scrollWindowTo(500);
        const button = screen.getByRole('button', { name: 'Scroll to top' });
        expect(button).toHaveAttribute('data-target', 'window');
        expect(button).toHaveAttribute('data-state', 'open');
        await expectNoAxeViolations();
    });

    it('scrolls the window back to the top, smoothly, with a click', async () => {
        const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        const { user } = renderUi(<ScrollTop threshold={200} />);
        scrollWindowTo(250);
        await user.click(screen.getByRole('button', { name: 'Scroll to top' }));
        expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('scrolls back to the top with Enter and Space', async () => {
        const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        const { user } = renderUi(<ScrollTop threshold={200} />);
        scrollWindowTo(250);
        screen.getByRole('button', { name: 'Scroll to top' }).focus();
        await user.keyboard('{Enter}');
        screen.getByRole('button', { name: 'Scroll to top' }).focus();
        await user.keyboard(' ');
        expect(scrollTo).toHaveBeenCalledTimes(2);
    });

    it('moves focus to the top of the page as it leaves, so the next Tab starts from there', async () => {
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        const { user } = renderUi(
            <>
                <a href="#log">First link</a>
                <ScrollTop threshold={200} />
                <a href="#help">Link after the button</a>
            </>,
        );
        scrollWindowTo(250);
        screen.getByRole('button', { name: 'Scroll to top' }).focus();
        await user.keyboard('{Enter}');
        // The body holds focus for the moment (a browser's next Tab then starts from the top of the page)…
        expect(document.body).toHaveFocus();
        expect(document.body).toHaveAttribute('tabindex', '-1');
        // …and gives its tabindex back once focus moves on.
        screen.getByRole('link', { name: 'First link' }).focus();
        expect(document.body).not.toHaveAttribute('tabindex');
        expect(document.body.style.outline).toBe('');
    });

    it('focuses a box that cannot take focus for the moment, after scrolling it', async () => {
        const { user } = renderUi(
            <div data-testid="plain-box">
                <p>Entry 4820</p>
                <ScrollTop target="parent" threshold={100} />
            </div>,
        );
        const box = screen.getByTestId('plain-box');
        box.scrollTo = vi.fn();
        scrollBoxTo(box, 150);
        screen.getByRole('button', { name: 'Scroll to top' }).focus();
        await user.keyboard('{Enter}');
        expect(box.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        expect(box).toHaveFocus();
        expect(box).toHaveAttribute('tabindex', '-1');
        box.blur();
        expect(box).not.toHaveAttribute('tabindex');
    });

    it('jumps instead of scrolling smoothly under reduced motion', async () => {
        const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
            matches: query.includes('reduce'),
            media: query,
            addEventListener() {},
            removeEventListener() {},
        }));
        const { user } = renderUi(<ScrollTop threshold={200} />);
        scrollWindowTo(250);
        await user.click(screen.getByRole('button', { name: 'Scroll to top' }));
        expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    });

    it('fades out and leaves once the window is back above the threshold', async () => {
        renderUi(<ScrollTop threshold={200} />);
        scrollWindowTo(250);
        expect(screen.getByRole('button', { name: 'Scroll to top' })).toBeInTheDocument();
        scrollWindowTo(0);
        expect(document.querySelector('[data-slot="scroll-top"]')).toHaveAttribute('data-state', 'closed');
        expect(document.querySelector('[data-slot="scroll-top"]')).toHaveAttribute('tabindex', '-1');
        await waitFor(() => expect(document.querySelector('[data-slot="scroll-top"]')).toBeNull());
    });

    it('watches and scrolls the box it is placed in with target="parent", then focuses the box', async () => {
        const { user } = renderUi(<LogBox />);
        const box = screen.getByTestId('box');
        box.scrollTo = vi.fn();
        expect(screen.queryByRole('button')).toBeNull();
        scrollBoxTo(box, 150);
        const button = screen.getByRole('button', { name: 'Scroll to top' });
        expect(button).toHaveAttribute('data-target', 'parent');
        await expectNoAxeViolations();
        await user.click(button);
        expect(box.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        expect(box).toHaveFocus();
    });

    it('shows a custom icon and takes its name from the provider strings', () => {
        renderUi(<LogBox icon={<svg data-testid="icon" aria-hidden="true" />} />, { strings: { scrollToTop: 'Nach oben' } });
        scrollBoxTo(screen.getByTestId('box'), 150);
        expect(screen.getByRole('button', { name: 'Nach oben' })).toBeInTheDocument();
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
});
