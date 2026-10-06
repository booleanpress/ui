import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Button } from '@/components/button';
import { Tour } from '@/components/tour';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Example({ tourProps = {}, withoutTarget = false }) {
    const [open, setOpen] = useState(false);
    const create = useRef(null);
    const search = useRef(null);
    const steps = [
        { target: withoutTarget ? undefined : create, title: 'Add a mailer', description: 'Connect an SMTP server.' },
        { target: search, title: 'Find a delivery', description: 'Search the log.', content: <a href="#log">Open the log</a> },
        { target: '#failures', title: 'Watch the failures', description: 'Failed in the last day.' },
    ];
    return (
        <>
            <Button onClick={() => setOpen(true)}>Start tour</Button>
            <Button ref={create}>New mailer</Button>
            <input ref={search} aria-label="Search deliveries" />
            <div id="failures">7 failed</div>
            <Tour steps={steps} open={open} onOpenChange={setOpen} {...tourProps} />
        </>
    );
}

async function start(ui = <Example />, providerProps) {
    const result = renderUi(ui, providerProps);
    await result.user.click(screen.getByRole('button', { name: 'Start tour' }));
    return result;
}

describe('Tour', () => {
    it('opens a card named by the step title, with focus on the card', async () => {
        await start();
        const card = screen.getByRole('dialog', { name: 'Add a mailer' });
        expect(card).toHaveAccessibleDescription('Connect an SMTP server.');
        expect(card).toHaveFocus();
        expect(card).toHaveTextContent('1 of 3');
        expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
        expect(document.querySelector('[data-slot=tour-mask]')).not.toBeNull();
        await expectNoAxeViolations();
    });

    it('moves between the card’s buttons with Tab and keeps focus inside with the mask', async () => {
        const { user } = await start();
        await user.click(screen.getByRole('button', { name: 'Next' }));
        const card = screen.getByRole('dialog', { name: 'Find a delivery' });
        await user.tab();
        expect(screen.getByRole('link', { name: 'Open the log' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Skip tour' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Back' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
        await user.tab();
        expect(card.contains(document.activeElement)).toBe(true);
        await user.tab({ shift: true });
        expect(card.contains(document.activeElement)).toBe(true);
    });

    it('presses Next with Enter and Back with Space, moving focus back to the card each step', async () => {
        const { user } = await start();
        await user.tab();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
        await user.keyboard('{Enter}');
        const second = screen.getByRole('dialog', { name: 'Find a delivery' });
        expect(second).toHaveTextContent('2 of 3');
        expect(second).toHaveFocus();
        screen.getByRole('button', { name: 'Back' }).focus();
        await user.keyboard(' ');
        expect(screen.getByRole('dialog', { name: 'Add a mailer' })).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('goes to the next step with ArrowRight and back with ArrowLeft', async () => {
        const { user } = await start();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('dialog', { name: 'Find a delivery' })).toBeInTheDocument();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('dialog', { name: 'Watch the failures' })).toBeInTheDocument();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('dialog', { name: 'Watch the failures' })).toBeInTheDocument();
        await user.keyboard('{ArrowLeft}');
        expect(screen.getByRole('dialog', { name: 'Find a delivery' })).toBeInTheDocument();
    });

    it('flips the arrow keys on a right-to-left page', async () => {
        const { user } = await start(<Example />, { dir: 'rtl' });
        await user.keyboard('{ArrowLeft}');
        expect(screen.getByRole('dialog', { name: 'Find a delivery' })).toBeInTheDocument();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('dialog', { name: 'Add a mailer' })).toBeInTheDocument();
    });

    it('ends on Escape and returns focus to the button that started it', async () => {
        const { user } = await start();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(screen.getByRole('button', { name: 'Start tour' })).toHaveFocus());
    });

    it('ends on Skip tour, and on Finish, which calls onFinish', async () => {
        const onFinish = vi.fn();
        const { user } = await start(<Example tourProps={{ onFinish }} />);
        await user.click(screen.getByRole('button', { name: 'Skip tour' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        expect(onFinish).not.toHaveBeenCalled();
        await user.click(screen.getByRole('button', { name: 'Start tour' }));
        expect(screen.getByRole('dialog', { name: 'Add a mailer' })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Next' }));
        await user.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.queryByRole('button', { name: 'Skip tour' })).toBeNull();
        await user.click(screen.getByRole('button', { name: 'Finish' }));
        expect(onFinish).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('starts again from the first step each time it opens', async () => {
        const { user } = await start();
        await user.click(screen.getByRole('button', { name: 'Next' }));
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await user.click(screen.getByRole('button', { name: 'Start tour' }));
        expect(screen.getByRole('dialog', { name: 'Add a mailer' })).toBeInTheDocument();
    });

    it('follows a controlled step and reports each move', async () => {
        const onStepChange = vi.fn();
        const { user } = await start(<Example tourProps={{ step: 2, onStepChange }} />);
        expect(screen.getByRole('dialog', { name: 'Watch the failures' })).toHaveTextContent('3 of 3');
        await user.click(screen.getByRole('button', { name: 'Back' }));
        expect(onStepChange).toHaveBeenCalledWith(1);
        expect(screen.getByRole('dialog', { name: 'Watch the failures' })).toBeInTheDocument();
    });

    it('stays open on a click outside, and leaves the mask out with mask={false}', async () => {
        const { user } = await start(<Example tourProps={{ mask: false }} />);
        expect(document.querySelector('[data-slot=tour-mask]')).toBeNull();
        await user.click(screen.getByText('7 failed'));
        expect(screen.getByRole('dialog', { name: 'Add a mailer' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('centres a step without a target, with no arrow', async () => {
        await start(<Example withoutTarget />);
        expect(screen.getByRole('dialog', { name: 'Add a mailer' })).toBeInTheDocument();
        expect(document.querySelector('[data-slot=tour-arrow]')).toBeNull();
        await expectNoAxeViolations();
    });

    it('centres a step whose target is not on the page, with no arrow, and points again at the next step’s target', async () => {
        function Missing() {
            const [open, setOpen] = useState(false);
            const create = useRef(null);
            const steps = [
                { target: '#no-such-element', title: 'Open the reports', description: 'Not on this page.', placement: 'right' },
                { target: create, title: 'Add a mailer', description: 'Connect an SMTP server.' },
            ];
            return (
                <>
                    <Button onClick={() => setOpen(true)}>Start tour</Button>
                    <Button ref={create}>New mailer</Button>
                    <Tour steps={steps} open={open} onOpenChange={setOpen} />
                </>
            );
        }
        const { user } = await start(<Missing />);
        const card = screen.getByRole('dialog', { name: 'Open the reports' });
        expect(card).toHaveAttribute('data-side', 'bottom');
        expect(document.querySelector('[data-slot=tour-arrow]')).toBeNull();
        await user.click(screen.getByRole('button', { name: 'Next' }));
        await screen.findByRole('dialog', { name: 'Add a mailer' });
        await waitFor(() => expect(document.querySelector('[data-slot=tour-arrow]')).not.toBeNull());
        await expectNoAxeViolations();
    });

    it('takes its words from the provider and formats the count in its locale', async () => {
        await start(<Example />, {
            locale: 'ar-EG',
            strings: { next: 'Weiter', skipTour: 'Tour überspringen', tourStep: 'Schritt {current} von {total}' },
        });
        expect(screen.getByRole('button', { name: 'Weiter' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Tour überspringen' })).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toHaveTextContent('Schritt ١ von ٣');
    });
});
