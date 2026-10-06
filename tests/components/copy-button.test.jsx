import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { CopyButton } from '@/components/copy-button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

/** Replaces the clipboard user-event installs with the one given (undefined: no Clipboard API at all). */
function mockClipboard(clipboard) {
    Object.defineProperty(window.navigator, 'clipboard', { value: clipboard, configurable: true });
}

afterEach(() => {
    vi.useRealTimers();
    delete document.execCommand;
});

describe('CopyButton', () => {
    it('copies its value with the Clipboard API on Enter, shows Copied and announces it politely', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        const onCopy = vi.fn();
        const { user } = renderUi(<CopyButton value="msg_01J9X4T2QZ" label="Copy message ID" onCopy={onCopy} />);
        mockClipboard({ writeText });
        await user.tab();
        expect(screen.getByRole('tooltip')).toHaveTextContent('Copy');
        await user.keyboard('{Enter}');
        expect(writeText).toHaveBeenCalledWith('msg_01J9X4T2QZ');
        expect(onCopy).toHaveBeenCalledWith('msg_01J9X4T2QZ');
        const button = screen.getByRole('button', { name: 'Copy message ID' });
        expect(button).toHaveAttribute('data-state', 'copied');
        expect(screen.getByRole('status')).toHaveTextContent('Copied');
        expect(screen.getByRole('tooltip')).toHaveTextContent('Copied');
        expect(button).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('copies on Space', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        const { user } = renderUi(<CopyButton value="smtp.example.com" />);
        mockClipboard({ writeText });
        await user.tab();
        await user.keyboard(' ');
        expect(writeText).toHaveBeenCalledWith('smtp.example.com');
    });

    it('goes back to Copy after the timeout', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        const { user } = renderUi(<CopyButton value="key" showLabel timeout={5000} />);
        mockClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
        await user.click(screen.getByRole('button', { name: 'Copy' }));
        expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
        await act(() => vi.advanceTimersByTimeAsync(4000));
        expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
        await act(() => vi.advanceTimersByTimeAsync(1100));
        expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeEmptyDOMElement();
    });

    it('falls back to the copy command when the Clipboard API is missing, and keeps focus', async () => {
        const { user } = renderUi(<CopyButton value="bp_live_4f2a" label="Copy API key" />);
        mockClipboard(undefined);
        let copied = '';
        document.execCommand = vi.fn(() => {
            copied = document.activeElement.value;
            return true;
        });
        const button = screen.getByRole('button', { name: 'Copy API key' });
        await user.click(button);
        expect(document.execCommand).toHaveBeenCalledWith('copy');
        expect(copied).toBe('bp_live_4f2a');
        expect(document.querySelector('textarea')).toBeNull();
        expect(button).toHaveFocus();
        expect(screen.getByRole('status')).toHaveTextContent('Copied');
    });

    it('falls back when the Clipboard API refuses, and says Copy failed when nothing works', async () => {
        const onCopyError = vi.fn();
        const { user } = renderUi(<CopyButton value="secret" showLabel onCopyError={onCopyError} />);
        mockClipboard({ writeText: vi.fn().mockRejectedValue(new Error('NotAllowedError')) });
        document.execCommand = vi.fn(() => false);
        await user.click(screen.getByRole('button', { name: 'Copy' }));
        expect(document.execCommand).toHaveBeenCalledWith('copy');
        expect(onCopyError).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: 'Copy failed' })).toHaveAttribute('data-state', 'failed');
        expect(screen.getByRole('status')).toHaveTextContent('Copy failed');
    });

    it('falls back inside a dialog: the focus trap does not pull focus out of the hidden text area', async () => {
        const { user } = renderUi(
            <Dialog open>
                <DialogContent>
                    <DialogTitle>API key created</DialogTitle>
                    <DialogDescription>Copy it now: it is shown once.</DialogDescription>
                    <CopyButton value="bp_live_9c1d" label="Copy API key" />
                </DialogContent>
            </Dialog>,
        );
        mockClipboard(undefined);
        let copied = '';
        document.execCommand = vi.fn(() => {
            copied = document.activeElement.value;
            return true;
        });
        const button = screen.getByRole('button', { name: 'Copy API key' });
        await user.click(button);
        expect(copied).toBe('bp_live_9c1d');
        expect(document.querySelector('textarea')).toBeNull();
        expect(button).toHaveFocus();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes the Copied tooltip on Escape before its time is up', async () => {
        const { user } = renderUi(<CopyButton value="msg_01J9X4T2QZ" timeout={10000} />);
        mockClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
        await user.tab();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('tooltip')).toHaveTextContent('Copied');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
        expect(screen.getByRole('button', { name: 'Copy' })).toHaveAttribute('data-state', 'copied');
    });

    it('leaves no timer behind when it is removed before the copy ends', async () => {
        vi.useFakeTimers();
        let finish;
        const onCopy = vi.fn();
        const { unmount } = renderUi(
            <CopyButton getValue={() => new Promise((resolve) => { finish = resolve; })} onCopy={onCopy} />,
        );
        mockClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
        fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
        unmount();
        await act(async () => { finish('late value'); await Promise.resolve(); await Promise.resolve(); });
        expect(onCopy).toHaveBeenCalledWith('late value');
        expect(vi.getTimerCount()).toBe(0);
    });

    it('copies what getValue returns at the moment of the click', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        const { user } = renderUi(<CopyButton getValue={() => Promise.resolve('v=spf1 ~all')} />);
        mockClipboard({ writeText });
        await user.click(screen.getByRole('button', { name: 'Copy' }));
        await waitFor(() => expect(writeText).toHaveBeenCalledWith('v=spf1 ~all'));
    });

    it('takes its words from the provider and its size from the provider', async () => {
        const { user } = renderUi(<CopyButton value="x" />, {
            strings: { copy: 'Kopieren', copied: 'Kopiert' },
            controlSize: 'sm',
        });
        mockClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
        const button = screen.getByRole('button', { name: 'Kopieren' });
        expect(button).toHaveAttribute('data-size', 'icon-sm');
        await user.click(button);
        expect(screen.getByRole('status')).toHaveTextContent('Kopiert');
    });

    it('shows the label beside the icon with showLabel, sized as a text button', async () => {
        renderUi(<CopyButton value="x" showLabel size="lg" />);
        const button = screen.getByRole('button', { name: 'Copy' });
        expect(button).toHaveAttribute('data-size', 'lg');
        expect(button).toHaveAttribute('data-variant', 'outline');
        await expectNoAxeViolations();
    });

    it('does nothing when disabled', async () => {
        const writeText = vi.fn();
        renderUi(<CopyButton value="x" disabled />);
        mockClipboard({ writeText });
        expect(screen.getByRole('button', { name: 'Copy' })).toBeDisabled();
        await expectNoAxeViolations();
    });
});
