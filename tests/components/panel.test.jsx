import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import {
    Panel,
    PanelActions,
    PanelContent,
    PanelFooter,
    PanelHeader,
    PanelTitle,
    PanelTrigger,
} from '@/components/panel';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Invoice({ footerInside = false, ...props }) {
    return (
        <Panel {...props}>
            <PanelHeader>
                <PanelTitle>October invoice</PanelTitle>
                <PanelActions>
                    <button type="button">Download</button>
                    <PanelTrigger />
                </PanelActions>
            </PanelHeader>
            <PanelContent>
                Growth plan, $29.00
                {footerInside ? <PanelFooter>Paid on 1 October</PanelFooter> : null}
            </PanelContent>
            {footerInside ? null : <PanelFooter>Paid on 1 October</PanelFooter>}
        </Panel>
    );
}

const toggle = () => screen.getByRole('button', { name: 'Show or hide October invoice' });

describe('Panel', () => {
    it('renders a header, title and content, with no toggle unless toggleable', async () => {
        const { container } = renderUi(<Invoice />);
        expect(container.querySelector('[data-slot="panel"]')).toBeInTheDocument();
        expect(screen.getByText('October invoice')).toHaveAttribute('data-slot', 'panel-title');
        expect(screen.getByText('Growth plan, $29.00')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /show or hide/i })).toBeNull();
        await expectNoAxeViolations();
    });

    it('names the toggle from the title and ties it to the content', async () => {
        const { container } = renderUi(<Invoice toggleable />);
        const button = await screen.findByRole('button', { name: 'Show or hide October invoice' });
        expect(button).toHaveAttribute('aria-expanded', 'true');
        const content = container.querySelector('[data-slot="panel-content"]');
        expect(button).toHaveAttribute('aria-controls', content.id);
        await expectNoAxeViolations();
    });

    it('shows and hides the content with Enter', async () => {
        const { user } = renderUi(<Invoice toggleable />);
        (await screen.findByRole('button', { name: 'Show or hide October invoice' })).focus();
        await user.keyboard('{Enter}');
        expect(toggle()).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByText('Growth plan, $29.00')).toBeNull();
        await expectNoAxeViolations();
        await user.keyboard('{Enter}');
        expect(toggle()).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('Growth plan, $29.00')).toBeInTheDocument();
    });

    it('shows and hides the content with Space', async () => {
        const { user } = renderUi(<Invoice toggleable />);
        (await screen.findByRole('button', { name: 'Show or hide October invoice' })).focus();
        await user.keyboard(' ');
        expect(toggle()).toHaveAttribute('aria-expanded', 'false');
        await user.keyboard(' ');
        expect(toggle()).toHaveAttribute('aria-expanded', 'true');
    });

    it('starts closed with defaultOpen={false}', async () => {
        renderUi(<Invoice toggleable defaultOpen={false} />);
        expect(await screen.findByRole('button', { name: 'Show or hide October invoice' })).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByText('Growth plan, $29.00')).toBeNull();
    });

    it('follows a controlled open state and reports changes', async () => {
        const onChange = vi.fn();
        function Controlled() {
            const [open, setOpen] = useState(false);
            return (
                <>
                    <button type="button" onClick={() => setOpen(true)}>
                        Open
                    </button>
                    <Invoice
                        toggleable
                        open={open}
                        onOpenChange={(next) => {
                            onChange(next);
                            setOpen(next);
                        }}
                    />
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(screen.queryByText('Growth plan, $29.00')).toBeNull();
        await user.click(screen.getByRole('button', { name: 'Open' }));
        expect(screen.getByText('Growth plan, $29.00')).toBeInTheDocument();
        await user.click(toggle());
        expect(onChange).toHaveBeenLastCalledWith(false);
        expect(screen.queryByText('Growth plan, $29.00')).toBeNull();
    });

    it('keeps a footer outside the content in view when closed, and folds one inside it', async () => {
        const { user, unmount } = renderUi(<Invoice toggleable />);
        await user.click(await screen.findByRole('button', { name: 'Show or hide October invoice' }));
        expect(screen.getByText('Paid on 1 October')).toBeInTheDocument();
        unmount();
        const second = renderUi(<Invoice toggleable footerInside />);
        await second.user.click(await screen.findByRole('button', { name: 'Show or hide October invoice' }));
        expect(screen.queryByText('Paid on 1 October')).toBeNull();
    });

    it('replaces the chevron with a custom indicator, hidden from assistive technology', async () => {
        const { container } = renderUi(
            <Panel toggleable>
                <PanelHeader>
                    <PanelTitle>Retry policy</PanelTitle>
                    <PanelTrigger indicator={<span data-testid="plus">+</span>} />
                </PanelHeader>
                <PanelContent>Three retries.</PanelContent>
            </Panel>
        );
        expect(screen.getByTestId('plus')).toBeInTheDocument();
        expect(container.querySelector('[data-slot="panel-indicator"]')).toHaveAttribute('aria-hidden', 'true');
        expect(await screen.findByRole('button', { name: 'Show or hide Retry policy' })).toBeInTheDocument();
    });

    it('keeps force-mounted content in the page while folded, hidden, with what was typed', async () => {
        const { user, container } = renderUi(
            <Panel toggleable>
                <PanelHeader>
                    <PanelTitle>SMTP connection</PanelTitle>
                    <PanelTrigger />
                </PanelHeader>
                <PanelContent forceMount>
                    <label htmlFor="smtp-host">Host</label>
                    <input id="smtp-host" defaultValue="smtp.example.com" />
                </PanelContent>
            </Panel>,
        );
        const toggleButton = screen.getByRole('button', { name: 'Show or hide SMTP connection' });
        await user.clear(screen.getByLabelText('Host'));
        await user.type(screen.getByLabelText('Host'), 'mail.example.org');
        await user.click(toggleButton);
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
        expect(container.querySelector('[data-slot="panel-content"]')).toHaveAttribute('hidden');
        expect(screen.getByLabelText('Host')).not.toBeVisible();
        await expectNoAxeViolations();
        await user.click(toggleButton);
        expect(screen.getByLabelText('Host')).toBeVisible();
        expect(screen.getByLabelText('Host')).toHaveValue('mail.example.org');
    });

    it('disables the toggle with disabled', async () => {
        const { user } = renderUi(<Invoice toggleable disabled />);
        const button = await screen.findByRole('button', { name: 'Show or hide October invoice' });
        expect(button).toBeDisabled();
        await user.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('renders the title as a heading with asChild', async () => {
        renderUi(
            <Panel toggleable>
                <PanelHeader>
                    <PanelTitle asChild>
                        <h2>Sender</h2>
                    </PanelTitle>
                    <PanelTrigger />
                </PanelHeader>
                <PanelContent>Acme Support</PanelContent>
            </Panel>
        );
        expect(screen.getByRole('heading', { level: 2, name: 'Sender' })).toHaveAttribute('data-slot', 'panel-title');
        expect(await screen.findByRole('button', { name: 'Show or hide Sender' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('takes the toggle name from the provider strings', async () => {
        renderUi(<Invoice toggleable />, { strings: { toggleContent: 'Afficher ou masquer {title}' } });
        expect(await screen.findByRole('button', { name: 'Afficher ou masquer October invoice' })).toBeInTheDocument();
    });

    it('keeps the title where the translation puts it', () => {
        renderUi(<Invoice toggleable />, { strings: { toggleContent: '{title} ein- oder ausblenden' } });
        expect(screen.getByRole('button', { name: 'October invoice ein- oder ausblenden' })).toBeInTheDocument();
    });

    it('names the toggle after the title from the first render, so the server HTML has the name', () => {
        const host = document.createElement('div');
        host.innerHTML = renderToString(
            <BooleanUIProvider>
                <Invoice toggleable />
            </BooleanUIProvider>,
        );
        document.body.append(host);
        expect(screen.getByRole('button', { name: 'Show or hide October invoice' })).toHaveAttribute('aria-expanded', 'true');
        host.remove();
    });

    it('follows a title id of your own', () => {
        renderUi(
            <Panel toggleable>
                <PanelHeader>
                    <PanelTitle id="sender-title">Sender</PanelTitle>
                    <PanelTrigger />
                </PanelHeader>
                <PanelContent>Acme Support</PanelContent>
            </Panel>
        );
        const button = screen.getByRole('button', { name: 'Show or hide Sender' });
        expect(button.getAttribute('aria-labelledby')).toContain('sender-title');
    });
});
