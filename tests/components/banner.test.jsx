import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, screen, within } from '@testing-library/react';
import { StarIcon } from 'lucide-react';
import { Banner, BannerActions, BannerDescription, BannerTitle } from '@/components/banner';
import { Button } from '@/components/button';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Banner', () => {
    it('renders each tone with its icon, polite for the calm tones and an alert for warning and destructive', async () => {
        renderUi(
            <>
                {['neutral', 'info', 'success', 'warning', 'destructive'].map((tone) => (
                    <Banner key={tone} tone={tone} data-testid={tone}>
                        <BannerTitle>{tone} title</BannerTitle>
                        <BannerDescription>{tone} text</BannerDescription>
                    </Banner>
                ))}
            </>,
        );
        for (const tone of ['neutral', 'info', 'success']) {
            expect(screen.getByTestId(tone)).toHaveAttribute('role', 'status');
        }
        for (const tone of ['warning', 'destructive']) {
            expect(screen.getByTestId(tone)).toHaveAttribute('role', 'alert');
        }
        expect(screen.getByTestId('success')).toHaveAttribute('data-tone', 'success');
        expect(screen.getByTestId('info').querySelector('[data-slot=banner-icon] svg')).not.toBeNull();
        await expectNoAxeViolations();
    });

    it('is info and static by default, and sticky on request', () => {
        renderUi(
            <>
                <Banner data-testid="plain">Text</Banner>
                <Banner data-testid="sticky" position="sticky">Text</Banner>
            </>,
        );
        expect(screen.getByTestId('plain')).toHaveAttribute('data-tone', 'info');
        expect(screen.getByTestId('plain')).toHaveAttribute('data-position', 'static');
        expect(screen.getByTestId('sticky')).toHaveAttribute('data-position', 'sticky');
        expect(screen.getByTestId('sticky')).toHaveClass('sticky');
    });

    it('takes another icon, or none', () => {
        renderUi(
            <>
                <Banner data-testid="custom" icon={<StarIcon data-testid="star" />}>Text</Banner>
                <Banner data-testid="none" icon={null}>Text</Banner>
            </>,
        );
        expect(within(screen.getByTestId('custom')).getByTestId('star')).toBeInTheDocument();
        expect(screen.getByTestId('none').querySelector('[data-slot=banner-icon]')).toBeNull();
    });

    it('moves through its actions and × with Tab', async () => {
        const { user } = renderUi(
            <Banner tone="warning" dismissible>
                <BannerDescription>Your licence expires in 5 days.</BannerDescription>
                <BannerActions>
                    <Button>Renew licence</Button>
                </BannerActions>
            </Banner>,
        );
        await user.tab();
        expect(screen.getByRole('button', { name: 'Renew licence' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('removes itself with the × (Enter or Space), calls onDismiss and moves focus on', async () => {
        const onDismiss = vi.fn();
        const { user } = renderUi(
            <>
                <Banner dismissible onDismiss={onDismiss}>
                    <BannerDescription>Version 2.4 is out.</BannerDescription>
                </Banner>
                <Button>Next control</Button>
            </>,
        );
        screen.getByRole('button', { name: 'Dismiss' }).focus();
        await user.keyboard('{Enter}');
        expect(screen.queryByRole('status')).toBeNull();
        expect(onDismiss).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: 'Next control' })).toHaveFocus();
    });

    it('sends focus to returnFocusTo when given', async () => {
        function Page() {
            const heading = useRef(null);
            return (
                <>
                    <h1 ref={heading} tabIndex={-1}>Mailers</h1>
                    <Banner dismissible returnFocusTo={heading}>
                        <BannerDescription>Version 2.4 is out.</BannerDescription>
                    </Banner>
                </>
            );
        }
        const { user } = renderUi(<Page />);
        screen.getByRole('button', { name: 'Dismiss' }).focus();
        await user.keyboard(' ');
        expect(screen.getByRole('heading', { name: 'Mailers' })).toHaveFocus();
    });

    it('sends focus to an element the dismissal itself shows, named by returnFocusTo', async () => {
        function Page() {
            const [gone, setGone] = useState(false);
            const again = useRef(null);
            return (
                <>
                    <Banner dismissible onDismiss={() => setGone(true)} returnFocusTo={again}>
                        <BannerDescription>Version 2.4 is out.</BannerDescription>
                    </Banner>
                    <Button>Next control</Button>
                    {gone && <Button ref={again}>Show the banner again</Button>}
                </>
            );
        }
        const { user } = renderUi(<Page />);
        screen.getByRole('button', { name: 'Dismiss' }).focus();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('button', { name: 'Show the banner again' })).toHaveFocus();
    });

    it('moves focus to the control before it when nothing follows, never to the page', async () => {
        const { user } = renderUi(
            <>
                <Button>Earlier control</Button>
                <Banner dismissible>
                    <BannerDescription>Version 2.4 is out.</BannerDescription>
                </Banner>
            </>,
        );
        screen.getByRole('button', { name: 'Dismiss' }).focus();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('button', { name: 'Earlier control' })).toHaveFocus();
    });

    it('keeps its own focus target when the page passes a ref', async () => {
        const ref = { current: null };
        const { user } = renderUi(
            <>
                <Banner ref={ref} dismissible>
                    <BannerDescription>Version 2.4 is out.</BannerDescription>
                </Banner>
                <Button>Next control</Button>
            </>,
        );
        expect(ref.current).toHaveAttribute('data-slot', 'banner');
        screen.getByRole('button', { name: 'Dismiss' }).focus();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('button', { name: 'Next control' })).toHaveFocus();
        expect(ref.current).toBeNull();
    });

    it('leaves focus where it is when the × is clicked while focus is elsewhere', () => {
        renderUi(
            <>
                <input aria-label="Search" />
                <Banner dismissible>
                    <BannerDescription>Version 2.4 is out.</BannerDescription>
                </Banner>
                <Button>Next control</Button>
            </>,
        );
        const search = screen.getByRole('textbox', { name: 'Search' });
        search.focus();
        // A pointer click that does not focus the button (Safari's way).
        act(() => screen.getByRole('button', { name: 'Dismiss' }).click());
        expect(screen.queryByRole('status')).toBeNull();
        expect(search).toHaveFocus();
    });

    it('names the × from the provider, and takes another role', () => {
        renderUi(
            <Banner dismissible role="region" aria-label="Announcement">
                <BannerDescription>Text</BannerDescription>
            </Banner>,
            { strings: { dismiss: 'Ausblenden' } },
        );
        expect(screen.getByRole('button', { name: 'Ausblenden' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Announcement' })).toBeInTheDocument();
    });
});
