import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen } from '@testing-library/react';
import { InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/alert';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Alert', () => {
    it('is a live region named by its title and described by its text', async () => {
        renderUi(
            <Alert>
                <InfoIcon />
                <AlertTitle>Logging is on</AlertTitle>
                <AlertDescription>Every email is kept for 30 days.</AlertDescription>
            </Alert>,
        );
        const alert = screen.getByRole('alert');
        expect(alert).toHaveAttribute('data-slot', 'alert');
        expect(alert).toHaveTextContent('Logging is on');
        expect(alert).toHaveTextContent('Every email is kept for 30 days.');
        expect(screen.getByText('Logging is on')).toHaveAttribute('data-slot', 'alert-title');
        expect(alert.className).toContain('bg-secondary');
        expect(alert.className).toContain('text-secondary-foreground');
        await expectNoAxeViolations();
    });

    it('has the status variants on the status tokens', async () => {
        renderUi(
            <>
                <Alert variant="success">Verified</Alert>
                <Alert variant="warning">Expires soon</Alert>
                <Alert variant="info">Backup in use</Alert>
                <Alert variant="destructive">Failed</Alert>
            </>,
        );
        for (const [text, tone] of [
            ['Verified', 'success'],
            ['Expires soon', 'warning'],
            ['Backup in use', 'info'],
            ['Failed', 'destructive'],
        ]) {
            const { className } = screen.getByText(text);
            expect(className).toContain(`bg-${tone}-subtle`);
            expect(className).toContain(`border-${tone}-border`);
            expect(className).toContain(`text-${tone}-strong`);
        }
        expect(screen.getAllByRole('alert')).toHaveLength(4);
        await expectNoAxeViolations();
    });

    it('keeps interactive content reachable with Tab', async () => {
        const { user } = renderUi(
            <Alert variant="warning">
                <AlertTitle>Another SMTP plugin is active</AlertTitle>
                <AlertDescription>
                    <button type="button">Review plugins</button>
                </AlertDescription>
            </Alert>,
        );
        await user.tab();
        expect(screen.getByRole('button', { name: 'Review plugins' })).toHaveFocus();
        await expectNoAxeViolations();
    });
});

describe('Alert: appearances and sizes', () => {
    it('draws the outline appearance: the edge in the strong colour, no fill', async () => {
        renderUi(
            <>
                <Alert appearance="outline" variant="success">Connected</Alert>
                <Alert appearance="outline">Importing</Alert>
            </>,
        );
        const success = screen.getByText('Connected');
        expect(success).toHaveAttribute('data-appearance', 'outline');
        expect(success.className).toContain('bg-transparent');
        expect(success.className).toContain('border-success-strong');
        expect(success.className).not.toContain('bg-success-subtle');
        const plain = screen.getByText('Importing');
        expect(plain.className).toContain('border-muted-foreground');
        expect(plain.className).toContain('text-muted-foreground');
        await expectNoAxeViolations();
    });

    it('draws the simple appearance: text and icon only, with no edge, fill, shadow or padding', () => {
        renderUi(<Alert appearance="simple" variant="warning">Expires soon</Alert>);
        const { className } = screen.getByText('Expires soon');
        expect(className).toContain('border-0');
        expect(className).toContain('bg-transparent');
        expect(className).toContain('shadow-none');
        expect(className).toContain('p-0');
        expect(className).toContain('text-warning-strong');
        expect(className).not.toContain('px-2.5');
    });

    it('takes the sm, default and lg sizes, and the description follows', () => {
        renderUi(
            <>
                {['sm', 'default', 'lg'].map((size) => (
                    <Alert key={size} size={size} aria-label={size}>
                        <AlertDescription>Logs are kept for 30 days.</AlertDescription>
                    </Alert>
                ))}
            </>,
        );
        const [sm, md, lg] = screen.getAllByRole('alert');
        expect(sm).toHaveAttribute('data-size', 'sm');
        expect(sm.className).toContain('text-xs/normal');
        expect(md).toHaveAttribute('data-size', 'default');
        expect(lg).toHaveAttribute('data-size', 'lg');
        expect(lg.className).toContain('text-base/normal');
        expect(lg.querySelector('[data-slot=alert-description]').className).toContain('group-data-[size=lg]/alert:text-base/normal');
    });
});

describe('Alert: auto-dismiss', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('removes itself after its duration and calls onDismiss, and not before', () => {
        const onDismiss = vi.fn();
        renderUi(<Alert duration={4000} onDismiss={onDismiss}>Settings saved</Alert>);
        act(() => vi.advanceTimersByTime(3900));
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(onDismiss).not.toHaveBeenCalled();
        act(() => vi.advanceTimersByTime(200));
        expect(screen.queryByRole('alert')).toBeNull();
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('pauses while the pointer is over it, and goes on with the time that was left', () => {
        const onDismiss = vi.fn();
        renderUi(<Alert duration={4000} onDismiss={onDismiss}>Settings saved</Alert>);
        const alert = screen.getByRole('alert');
        act(() => vi.advanceTimersByTime(3000));
        fireEvent.pointerEnter(alert);
        act(() => vi.advanceTimersByTime(10000));
        expect(screen.getByRole('alert')).toBeInTheDocument();
        fireEvent.pointerLeave(alert);
        act(() => vi.advanceTimersByTime(900));
        expect(screen.getByRole('alert')).toBeInTheDocument();
        act(() => vi.advanceTimersByTime(200));
        expect(screen.queryByRole('alert')).toBeNull();
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('pauses while focus is inside it, including moves between its controls', () => {
        renderUi(
            <Alert duration={2000}>
                <AlertDescription>
                    <button type="button">Undo</button>
                    <button type="button">Details</button>
                </AlertDescription>
            </Alert>,
        );
        act(() => screen.getByRole('button', { name: 'Undo' }).focus());
        act(() => vi.advanceTimersByTime(5000));
        act(() => screen.getByRole('button', { name: 'Details' }).focus());
        act(() => vi.advanceTimersByTime(5000));
        expect(screen.getByRole('alert')).toBeInTheDocument();
        act(() => screen.getByRole('button', { name: 'Details' }).blur());
        act(() => vi.advanceTimersByTime(2100));
        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('stays paused while either the pointer or focus holds it', () => {
        renderUi(
            <Alert duration={2000}>
                <AlertDescription><button type="button">Undo</button></AlertDescription>
            </Alert>,
        );
        const alert = screen.getByRole('alert');
        fireEvent.pointerEnter(alert);
        act(() => screen.getByRole('button', { name: 'Undo' }).focus());
        fireEvent.pointerLeave(alert);
        act(() => vi.advanceTimersByTime(5000));
        expect(screen.getByRole('alert')).toBeInTheDocument();
        act(() => screen.getByRole('button', { name: 'Undo' }).blur());
        act(() => vi.advanceTimersByTime(2100));
        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('starts the count again when the duration changes, and never calls onDismiss after unmounting', () => {
        const onDismiss = vi.fn();
        const { rerender, unmount } = renderUi(<Alert duration={2000} onDismiss={onDismiss}>Settings saved</Alert>);
        act(() => vi.advanceTimersByTime(1500));
        const alert = screen.getByRole('alert');
        rerender(
            <BooleanUIProvider>
                <Alert duration={3000} onDismiss={onDismiss}>Settings saved</Alert>
            </BooleanUIProvider>,
        );
        // The same element, not a new one: the duration alone restarted the count.
        expect(screen.getByRole('alert')).toBe(alert);
        act(() => vi.advanceTimersByTime(2900));
        expect(screen.getByRole('alert')).toBeInTheDocument();
        unmount();
        act(() => vi.advanceTimersByTime(10000));
        expect(onDismiss).not.toHaveBeenCalled();
    });

    it('stays without a duration', () => {
        renderUi(<Alert>Logging is on</Alert>);
        act(() => vi.advanceTimersByTime(60000));
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });
});

describe('Alert open', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('appears at once on its first render, with no entrance', () => {
        renderUi(<Alert>Settings saved</Alert>);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveAttribute('data-state', 'open');
        expect(alert).not.toHaveAttribute('data-entering');
        expect(alert).toHaveAttribute('data-bui-motion', 'inline');
    });

    it('stays on the page while its exit runs, then leaves; opening it again plays the entrance', () => {
        const exit = { animationName: 'exit', animationDuration: '100ms' };
        const { rerender } = renderUi(<Alert open style={exit}>Settings saved</Alert>);
        rerender(<BooleanUIProvider><Alert open={false} style={exit}>Settings saved</Alert></BooleanUIProvider>);
        expect(screen.getByRole('alert')).toHaveAttribute('data-state', 'closed');
        act(() => vi.advanceTimersByTime(200));
        expect(screen.queryByRole('alert')).toBeNull();
        rerender(<BooleanUIProvider><Alert open style={exit}>Settings saved</Alert></BooleanUIProvider>);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveAttribute('data-state', 'open');
        expect(alert).toHaveAttribute('data-entering');
    });

    it('comes back when it is opened again after its duration removed it', () => {
        const { rerender } = renderUi(<Alert duration={1000}>Settings saved</Alert>);
        act(() => vi.advanceTimersByTime(1100));
        expect(screen.queryByRole('alert')).toBeNull();
        rerender(<BooleanUIProvider><Alert open={false} duration={1000}>Settings saved</Alert></BooleanUIProvider>);
        rerender(<BooleanUIProvider><Alert open duration={1000}>Settings saved</Alert></BooleanUIProvider>);
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('counts its whole duration again when it is opened after its duration removed it', () => {
        const onDismiss = vi.fn();
        const view = (open) => <BooleanUIProvider><Alert open={open} duration={1000} onDismiss={onDismiss}>Settings saved</Alert></BooleanUIProvider>;
        const { rerender } = renderUi(<Alert open duration={1000} onDismiss={onDismiss}>Settings saved</Alert>);
        act(() => vi.advanceTimersByTime(1100));
        expect(onDismiss).toHaveBeenCalledTimes(1);
        rerender(view(false));
        rerender(view(true));
        act(() => vi.advanceTimersByTime(900));
        expect(screen.getByRole('alert')).toBeInTheDocument();
        act(() => vi.advanceTimersByTime(200));
        expect(screen.queryByRole('alert')).toBeNull();
        expect(onDismiss).toHaveBeenCalledTimes(2);
    });

    it('does not count, or call onDismiss, while it is closed', () => {
        const onDismiss = vi.fn();
        renderUi(<Alert open={false} duration={1000} onDismiss={onDismiss}>Settings saved</Alert>);
        act(() => vi.advanceTimersByTime(5000));
        expect(onDismiss).not.toHaveBeenCalled();
        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('passes its ref on', () => {
        const ref = { current: null };
        renderUi(<Alert ref={ref}>Settings saved</Alert>);
        expect(ref.current).toBe(screen.getByRole('alert'));
    });
});
