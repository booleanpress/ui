import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { LoadingOverlay } from '@/components/loading-overlay';
import { Button } from '@/components/button';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Card({ loading, ...props }) {
    return (
        <LoadingOverlay loading={loading} data-testid="region" {...props}>
            <p>Primary SMTP</p>
            <Button>Save</Button>
        </LoadingOverlay>
    );
}

describe('LoadingOverlay', () => {
    it('leaves the content alone while not loading', async () => {
        renderUi(<Card loading={false} />);
        const region = screen.getByTestId('region');
        expect(region).not.toHaveAttribute('aria-busy');
        expect(region.querySelector('[data-slot=loading-overlay-content]')).not.toHaveAttribute('inert');
        expect(region.querySelector('[data-slot=loading-overlay-mask]')).toBeNull();
        expect(screen.getByRole('status')).toHaveTextContent('');
        await expectNoAxeViolations();
    });

    it('marks the region busy, makes its content inert and announces the label while loading', async () => {
        renderUi(<Card loading label="Saving the mailer…" />);
        const region = screen.getByTestId('region');
        expect(region).toHaveAttribute('aria-busy', 'true');
        expect(region.querySelector('[data-slot=loading-overlay-content]')).toHaveAttribute('inert');
        expect(region.querySelector('[data-slot=loading-overlay-mask]')).toHaveAttribute('data-state', 'open');
        expect(screen.getByRole('status')).toHaveTextContent('Saving the mailer…');
        await expectNoAxeViolations();
    });

    it('announces the provider’s loading string when there is no label', () => {
        renderUi(<Card loading />, { strings: { loading: 'Wird geladen' } });
        expect(screen.getByRole('status')).toHaveTextContent('Wird geladen');
    });

    it('shows a custom indicator in place of the spinner', () => {
        renderUi(<Card loading indicator={<span data-testid="ring" />} />);
        expect(screen.getByTestId('ring')).toBeInTheDocument();
        expect(screen.getByTestId('region').querySelector('[data-slot=loading-overlay-indicator] svg')).toBeNull();
    });

    it('gives focus back to the control that had it when loading ends', async () => {
        function Saver() {
            const [saving, setSaving] = useState(false);
            return (
                <>
                    <LoadingOverlay loading={saving}>
                        <Button onClick={() => setSaving(true)}>Save</Button>
                    </LoadingOverlay>
                    <Button onClick={() => setSaving(false)} tabIndex={-1}>
                        Done
                    </Button>
                </>
            );
        }
        const { user } = renderUi(<Saver />);
        const save = screen.getByRole('button', { name: 'Save' });
        await user.click(save);
        // Inert content gives up focus, as a browser does.
        save.blur();
        screen.getByRole('button', { name: 'Done' }).click();
        await waitFor(() => expect(save).toHaveFocus());
    });

    it('covers the window and makes the rest of the page inert with fullScreen', async () => {
        function Page({ loading }) {
            return (
                <>
                    <Button>Import</Button>
                    <LoadingOverlay fullScreen loading={loading} label="Importing settings…" />
                </>
            );
        }
        const { rerender, container } = renderUi(<Page loading={false} />);
        await waitFor(() => expect(document.querySelector('[data-slot=loading-overlay-portal]')).not.toBeNull());
        expect(document.querySelector('[data-slot=loading-overlay-mask]')).toBeNull();
        rerender(<Page loading />);
        const mask = await waitFor(() => {
            const node = document.querySelector('[data-slot=loading-overlay-mask]');
            expect(node).not.toBeNull();
            return node;
        });
        expect(mask).toHaveClass('fixed');
        expect(container).toHaveAttribute('inert');
        expect(screen.getByRole('status')).toHaveTextContent('Importing settings…');
        await expectNoAxeViolations();
        rerender(<Page loading={false} />);
        await waitFor(() => expect(container).not.toHaveAttribute('inert'));
        expect(document.querySelector('[data-slot=loading-overlay-mask]')).toBeNull();
    });

    it('keeps the page inert and still until the last of two full-screen overlays ends', async () => {
        function Page({ a, b }) {
            return (
                <>
                    <Button>Import</Button>
                    <LoadingOverlay fullScreen loading={a} label="Importing settings…" />
                    <LoadingOverlay fullScreen loading={b} label="Importing templates…" />
                </>
            );
        }
        const html = document.documentElement;
        const { rerender, container } = renderUi(<Page a={false} b={false} />);
        rerender(<BooleanUIProvider><Page a b={false} /></BooleanUIProvider>);
        await waitFor(() => expect(container).toHaveAttribute('inert'));
        rerender(<BooleanUIProvider><Page a b /></BooleanUIProvider>);
        expect(html.style.overflow).toBe('hidden');
        // The overlays never make each other's parts inert: both statuses can speak.
        for (const part of document.querySelectorAll('[data-slot=loading-overlay-portal]')) {
            expect(part).not.toHaveAttribute('inert');
        }
        rerender(<BooleanUIProvider><Page a={false} b /></BooleanUIProvider>);
        expect(container).toHaveAttribute('inert');
        expect(html.style.overflow).toBe('hidden');
        rerender(<BooleanUIProvider><Page a={false} b={false} /></BooleanUIProvider>);
        expect(container).not.toHaveAttribute('inert');
        expect(container).not.toHaveAttribute('data-bui-inert');
        expect(html.style.overflow).toBe('');
        expect(html).not.toHaveAttribute('data-bui-scroll-lock');
    });

    it('releases the page and its scroll when it unmounts while loading, and keeps the page’s own values', async () => {
        const html = document.documentElement;
        html.style.overflow = 'clip';
        const outsider = document.createElement('div');
        outsider.setAttribute('inert', '');
        document.body.append(outsider);
        try {
            const { unmount, container } = renderUi(<LoadingOverlay fullScreen loading label="Importing settings…" />);
            await waitFor(() => expect(container).toHaveAttribute('inert'));
            expect(html.style.overflow).toBe('hidden');
            unmount();
            expect(container).not.toHaveAttribute('inert');
            expect(html.style.overflow).toBe('clip');
            // Inert before the overlay, so inert after it.
            expect(outsider).toHaveAttribute('inert');
        } finally {
            outsider.remove();
            html.style.overflow = '';
        }
    });

    it('puts the full-screen mask above a layer opened before loading started', async () => {
        function Page({ loading }) {
            return <LoadingOverlay fullScreen loading={loading} label="Importing settings…" />;
        }
        const { rerender } = renderUi(<Page loading={false} />);
        await waitFor(() => expect(document.querySelector('[data-slot=loading-overlay-portal]')).not.toBeNull());
        // Stands in for a dialog portalled to the end of <body> after the overlay mounted.
        const dialog = document.createElement('div');
        document.body.append(dialog);
        try {
            rerender(<BooleanUIProvider><Page loading /></BooleanUIProvider>);
            const mask = document.querySelector('[data-slot=loading-overlay-mask]');
            expect(mask.parentElement).toBe(document.body);
            expect(dialog.compareDocumentPosition(mask) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
            expect(dialog).toHaveAttribute('inert');
        } finally {
            dialog.remove();
        }
    });

    it('gives focus back when loading ends, also when the page passes its own ref', async () => {
        const ref = { current: null };
        function Saver() {
            const [saving, setSaving] = useState(false);
            return (
                <>
                    <LoadingOverlay ref={ref} loading={saving}>
                        <Button onClick={() => setSaving(true)}>Save</Button>
                    </LoadingOverlay>
                    <Button onClick={() => setSaving(false)} tabIndex={-1}>
                        Done
                    </Button>
                </>
            );
        }
        const { user } = renderUi(<Saver />);
        expect(ref.current).toHaveAttribute('data-slot', 'loading-overlay');
        const save = screen.getByRole('button', { name: 'Save' });
        await user.click(save);
        save.blur();
        screen.getByRole('button', { name: 'Done' }).click();
        await waitFor(() => expect(save).toHaveFocus());
    });
});
