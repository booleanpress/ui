import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import { toast } from 'sonner';
import { Toaster } from '@/components/sonner';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

afterEach(() => {
    act(() => {
        toast.dismiss();
    });
});

describe('Toaster', () => {
    it('names the region from the provider, with Sonner’s hotkey, and the English default', () => {
        const { unmount } = renderUi(<Toaster id="t-name" />);
        expect(screen.getByRole('region', { name: /^Notifications/ })).toBeInTheDocument();
        unmount();
        renderUi(<Toaster id="t-name-2" />, { strings: { notifications: 'Benachrichtigungen' } });
        expect(screen.getByRole('region', { name: /^Benachrichtigungen/ })).toBeInTheDocument();
    });

    it('shows a toast with its description and an action that runs', async () => {
        let undone = false;
        const { user } = renderUi(<Toaster id="t-action" />);
        act(() => {
            toast('Routing rule deleted', {
                toasterId: 't-action',
                description: 'Emails use the default mailer again.',
                action: { label: 'Undo', onClick: () => (undone = true) },
            });
        });
        expect(await screen.findByText('Routing rule deleted')).toBeInTheDocument();
        expect(screen.getByText('Emails use the default mailer again.')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Undo' }));
        expect(undone).toBe(true);
        await expectNoAxeViolations();
    });

    it('marks the status types, which carry the status colours', async () => {
        renderUi(<Toaster id="t-types" />);
        act(() => {
            toast.success('Delivered', { toasterId: 't-types' });
            toast.error('Rejected', { toasterId: 't-types' });
            toast.warning('Expires soon', { toasterId: 't-types' });
            toast.info('Backup in use', { toasterId: 't-types' });
        });
        await screen.findByText('Delivered');
        for (const [text, type] of [
            ['Delivered', 'success'],
            ['Rejected', 'error'],
            ['Expires soon', 'warning'],
            ['Backup in use', 'info'],
        ]) {
            expect(screen.getByText(text).closest('[data-sonner-toast]')).toHaveAttribute('data-type', type);
        }
        const list = document.querySelector('[data-sonner-toaster]');
        expect(list.style.getPropertyValue('--success-bg')).toContain('var(--success-subtle)');
        expect(list.style.getPropertyValue('--error-bg')).toContain('var(--destructive-subtle)');
        expect(list.style.getPropertyValue('--success-border')).toBe('inherit');
    });

    it('marks only the three newest toasts as visible', async () => {
        renderUi(<Toaster id="t-visible" />);
        act(() => {
            for (const n of [1, 2, 3, 4, 5]) toast(`Message ${n}`, { toasterId: 't-visible', duration: Infinity });
        });
        await screen.findByText('Message 5');
        const items = [...document.querySelectorAll('[data-sonner-toast]')];
        expect(items.filter((el) => el.getAttribute('data-visible') === 'true')).toHaveLength(3);
    });

    it('focuses the region with Alt+T, then Tab reaches the close button, named by the provider', async () => {
        const { user } = renderUi(<Toaster id="t-keys" />, { strings: { closeNotification: 'Benachrichtigung schließen' } });
        act(() => {
            toast('Settings saved', { toasterId: 't-keys', duration: Infinity });
        });
        await screen.findByText('Settings saved');
        const region = screen.getByRole('region');
        const list = region.querySelector('[data-sonner-toaster]');
        await user.keyboard('{Alt>}t{/Alt}');
        await waitFor(() => expect(list).toHaveFocus());
        await user.tab();
        expect(screen.getByText('Settings saved').closest('[data-sonner-toast]')).toHaveFocus();
        await user.tab();
        const close = screen.getByRole('button', { name: 'Benachrichtigung schließen' });
        expect(close).toHaveFocus();
    });

    it('closes a toast with Enter on its close button', async () => {
        const { user } = renderUi(<Toaster id="t-close" />);
        act(() => {
            toast('Settings saved', { toasterId: 't-close', duration: Infinity });
        });
        await screen.findByText('Settings saved');
        const close = within(screen.getByRole('region')).getByRole('button', { name: 'Close notification' });
        close.focus();
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.queryByText('Settings saved')).toBeNull(), { timeout: 2000 });
    });

    it('closes a toast with Space on its close button', async () => {
        const { user } = renderUi(<Toaster id="t-space" />);
        act(() => {
            toast('Settings saved', { toasterId: 't-space', duration: Infinity });
        });
        await screen.findByText('Settings saved');
        const close = within(screen.getByRole('region')).getByRole('button', { name: 'Close notification' });
        close.focus();
        await user.keyboard(' ');
        await waitFor(() => expect(screen.queryByText('Settings saved')).toBeNull(), { timeout: 2000 });
    });

    it('adds the app’s className to the toaster’s own classes', async () => {
        renderUi(<Toaster id="t-class" className="my-toaster" />);
        act(() => {
            toast('Settings saved', { toasterId: 't-class', duration: Infinity });
        });
        await screen.findByText('Settings saved');
        const list = document.querySelector('[data-sonner-toaster]');
        expect(list).toHaveClass('toaster', 'group', 'my-toaster');
    });

    it('sets the direction from the provider', async () => {
        renderUi(<Toaster id="t-dir" />, { dir: 'rtl' });
        act(() => {
            toast('Settings saved', { toasterId: 't-dir', duration: Infinity });
        });
        await screen.findByText('Settings saved');
        const list = document.querySelector('[data-sonner-toaster]');
        expect(list).toHaveAttribute('dir', 'rtl');
        expect(list.style.getPropertyValue('--toast-close-button-start')).toBe('0.25rem');
        expect(list.style.getPropertyValue('--toast-close-button-end')).toBe('auto');
    });

    it('removes a toast after 4 seconds, and not before', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        try {
            renderUi(<Toaster id="t-time" />);
            act(() => {
                toast('Settings saved', { toasterId: 't-time' });
            });
            expect(await screen.findByText('Settings saved')).toBeInTheDocument();
            await act(async () => {
                await vi.advanceTimersByTimeAsync(3500);
            });
            expect(screen.getByText('Settings saved')).toBeInTheDocument();
            await act(async () => {
                await vi.advanceTimersByTimeAsync(1500);
            });
            expect(screen.queryByText('Settings saved')).toBeNull();
        } finally {
            vi.useRealTimers();
        }
    });
});

describe('Toaster: variations', () => {
    it('keeps a sticky toast past the timeout, then closes it with toast.dismiss(id)', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        try {
            renderUi(<Toaster id="t-sticky" />);
            let id;
            act(() => {
                id = toast.warning('The mailer is paused', { toasterId: 't-sticky', duration: Infinity });
            });
            expect(await screen.findByText('The mailer is paused')).toBeInTheDocument();
            await act(async () => {
                await vi.advanceTimersByTimeAsync(20000);
            });
            expect(screen.getByText('The mailer is paused')).toBeInTheDocument();
            vi.useRealTimers();
            act(() => {
                toast.dismiss(id);
            });
            await waitFor(() => expect(screen.queryByText('The mailer is paused')).toBeNull(), { timeout: 2000 });
        } finally {
            vi.useRealTimers();
        }
    });

    it('updates a toast in place by its id', async () => {
        renderUi(<Toaster id="t-update" />);
        let id;
        act(() => {
            id = toast.loading('Uploading the logo…', { toasterId: 't-update' });
        });
        const loading = (await screen.findByText('Uploading the logo…')).closest('[data-sonner-toast]');
        expect(loading).toHaveAttribute('data-type', 'loading');
        act(() => {
            toast.success('Logo uploaded', { id, toasterId: 't-update' });
        });
        expect(await screen.findByText('Logo uploaded')).toBeInTheDocument();
        expect(screen.queryByText('Uploading the logo…')).toBeNull();
        const items = document.querySelectorAll('[data-sonner-toast]');
        expect(items).toHaveLength(1);
        expect(items[0]).toHaveAttribute('data-type', 'success');
        await expectNoAxeViolations();
    });

    it('leaves a custom toast as its author draws it: no card rules, no close button', async () => {
        const { user } = renderUi(<Toaster id="t-custom" />);
        act(() => {
            toast.custom(
                (id) => (
                    <div className="w-(--width) rounded-md border bg-popover p-3">
                        <p>Import finished</p>
                        <button type="button" onClick={() => toast.dismiss(id)}>Dismiss</button>
                    </div>
                ),
                { toasterId: 't-custom', duration: Infinity },
            );
        });
        const item = (await screen.findByText('Import finished')).closest('[data-sonner-toast]');
        expect(item).toHaveAttribute('data-styled', 'false');
        expect(item.className).toContain('data-[styled=true]:p-2.5!');
        expect(item.className.split(' ')).not.toContain('p-2.5!');
        expect(item.querySelector('[data-title]').className).not.toMatch(/(^| )font-medium!/);
        expect(item.querySelector('[data-close-button]')).toBeNull();
        await user.click(screen.getByRole('button', { name: 'Dismiss' }));
        await waitFor(() => expect(screen.queryByText('Import finished')).toBeNull(), { timeout: 2000 });
    });

    it('shows every toast open with expand', async () => {
        renderUi(<Toaster id="t-expand" expand />);
        act(() => {
            toast('First', { toasterId: 't-expand', duration: Infinity });
            toast('Second', { toasterId: 't-expand', duration: Infinity });
        });
        await screen.findByText('Second');
        for (const item of document.querySelectorAll('[data-sonner-toast]')) {
            expect(item).toHaveAttribute('data-expanded', 'true');
        }
    });

    it('places the stack with position', async () => {
        renderUi(<Toaster id="t-position" position="top-center" />);
        act(() => {
            toast('Shown top centre', { toasterId: 't-position', duration: Infinity });
        });
        await screen.findByText('Shown top centre');
        const list = document.querySelector('[data-sonner-toaster]');
        expect(list).toHaveAttribute('data-y-position', 'top');
        expect(list).toHaveAttribute('data-x-position', 'center');
    });
});
