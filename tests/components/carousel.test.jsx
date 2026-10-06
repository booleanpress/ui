import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { Carousel, CarouselContent, CarouselDots, CarouselFooter, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/carousel';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

// jsdom has no layout. Embla measures the viewport and the slides with offset* properties, so these give every
// viewport, track and slide a 300 px box and lay the slides out one after the other, which yields three scroll
// positions. Embla also watches slide visibility with an IntersectionObserver, which jsdom lacks.
const LAYOUT = ['offsetWidth', 'offsetHeight', 'offsetLeft', 'offsetTop'];
const saved = {};
beforeAll(() => {
    const isViewport = (el) => el.getAttribute?.('data-slot') === 'carousel-content';
    const isTrack = (el) => el.parentElement && isViewport(el.parentElement);
    const isSlide = (el) => el.getAttribute?.('data-slot') === 'carousel-item';
    const size = (el) => (isViewport(el) || isTrack(el) || isSlide(el) ? 300 : 0);
    const offset = (el) => (isSlide(el) ? [...el.parentElement.children].indexOf(el) * 300 : 0);
    for (const key of LAYOUT) {
        saved[key] = Object.getOwnPropertyDescriptor(HTMLElement.prototype, key);
        Object.defineProperty(HTMLElement.prototype, key, {
            configurable: true,
            get() {
                return key.endsWith('Width') || key.endsWith('Height') ? size(this) : offset(this);
            },
        });
    }
    globalThis.IntersectionObserver ||= class IntersectionObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
            return [];
        }
    };
});
afterAll(() => {
    for (const key of LAYOUT) Object.defineProperty(HTMLElement.prototype, key, saved[key]);
});

function Example({ setApi, orientation, footer = false, children }) {
    const buttons = (
        <>
            <CarouselPrevious />
            <CarouselNext />
        </>
    );
    return (
        <Carousel aria-label="Mailers" setApi={setApi} orientation={orientation}>
            <CarouselContent>
                {['Primary', 'Backup', 'Marketing'].map((name) => (
                    <CarouselItem key={name}>
                        {name}
                        {children}
                    </CarouselItem>
                ))}
            </CarouselContent>
            {footer ? (
                <CarouselFooter>
                    <CarouselDots />
                    <div className="flex gap-2">{buttons}</div>
                </CarouselFooter>
            ) : (
                buttons
            )}
        </Carousel>
    );
}

/** Renders, waits for Embla's API and returns it with the render result. */
async function renderCarousel(props = {}, providerProps) {
    let api;
    const result = renderUi(<Example {...props} setApi={(value) => { api = value; }} />, providerProps);
    await waitFor(() => expect(api?.scrollSnapList()).toHaveLength(3));
    return { ...result, api };
}

describe('Carousel', () => {
    it('renders a named region of slides, each named by its position', async () => {
        await renderCarousel();
        const region = screen.getByRole('region', { name: 'Mailers' });
        expect(region).toHaveAttribute('aria-roledescription', 'carousel');
        const slides = screen.getAllByRole('group');
        expect(slides.map((s) => s.getAttribute('aria-label'))).toEqual(['Slide 1 of 3', 'Slide 2 of 3', 'Slide 3 of 3']);
        expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide');
        await expectNoAxeViolations();
    });

    it('moves to the next slide with ArrowRight while focus is inside', async () => {
        const { user, api } = await renderCarousel();
        screen.getByRole('button', { name: 'Next slide' }).focus();
        await user.keyboard('{ArrowRight}');
        expect(api.selectedScrollSnap()).toBe(1);
    });

    it('moves to the previous slide with ArrowLeft', async () => {
        const { user, api } = await renderCarousel();
        screen.getByRole('button', { name: 'Next slide' }).focus();
        await user.keyboard('{ArrowRight}{ArrowRight}');
        expect(api.selectedScrollSnap()).toBe(2);
        // Next is disabled on the last slide, and a disabled button cannot keep focus.
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous slide' })).toBeEnabled());
        screen.getByRole('button', { name: 'Previous slide' }).focus();
        await user.keyboard('{ArrowLeft}');
        expect(api.selectedScrollSnap()).toBe(1);
    });

    it('swaps ArrowLeft and ArrowRight in a right-to-left page', async () => {
        const { user, api } = await renderCarousel({}, { dir: 'rtl' });
        const next = vi.spyOn(api, 'scrollNext');
        const previous = vi.spyOn(api, 'scrollPrev');
        screen.getByRole('button', { name: 'Next slide' }).focus();
        await user.keyboard('{ArrowLeft}');
        expect(next).toHaveBeenCalledTimes(1);
        await user.keyboard('{ArrowRight}');
        expect(previous).toHaveBeenCalledTimes(1);
    });

    it('moves a vertical carousel with ArrowDown and ArrowUp, and ignores Left and Right', async () => {
        const { user, api } = await renderCarousel({ orientation: 'vertical' });
        screen.getByRole('button', { name: 'Next slide' }).focus();
        await user.keyboard('{ArrowRight}');
        expect(api.selectedScrollSnap()).toBe(0);
        await user.keyboard('{ArrowDown}');
        expect(api.selectedScrollSnap()).toBe(1);
        await user.keyboard('{ArrowUp}');
        expect(api.selectedScrollSnap()).toBe(0);
    });

    it('leaves the arrow keys to a text field inside a slide', async () => {
        const { user, api } = await renderCarousel({ children: <input aria-label="Note" defaultValue="abc" /> });
        const field = screen.getAllByRole('textbox', { name: 'Note' })[0];
        field.focus();
        await user.keyboard('{ArrowRight}');
        expect(api.selectedScrollSnap()).toBe(0);
    });

    it('leaves the arrow keys to a control inside a slide that handles them, such as a radio group', async () => {
        const { user, api } = await renderCarousel({
            children: (
                <RadioGroup aria-label="Send from" defaultValue="eu">
                    <RadioGroupItem value="eu" aria-label="Europe" />
                    <RadioGroupItem value="us" aria-label="United States" />
                </RadioGroup>
            ),
        });
        screen.getAllByRole('radio', { name: 'Europe' })[0].focus();
        await user.keyboard('{ArrowRight}');
        expect(screen.getAllByRole('radio', { name: 'United States' })[0]).toHaveFocus();
        expect(api.selectedScrollSnap()).toBe(0);
    });

    it('hands focus to Previous when Next disables on the last slide, and back again', async () => {
        const { user } = await renderCarousel();
        const previous = screen.getByRole('button', { name: 'Previous slide' });
        const next = screen.getByRole('button', { name: 'Next slide' });
        next.focus();
        await user.keyboard('{Enter}{Enter}');
        await waitFor(() => expect(next).toBeDisabled());
        expect(previous).toHaveFocus();
        await user.keyboard('{Enter}{Enter}');
        await waitFor(() => expect(previous).toBeDisabled());
        expect(next).toHaveFocus();
    });

    it('disables Previous on the first slide and Next on the last, and moves on click', async () => {
        const { user, api } = await renderCarousel();
        const previous = screen.getByRole('button', { name: 'Previous slide' });
        const next = screen.getByRole('button', { name: 'Next slide' });
        expect(previous).toBeDisabled();
        expect(next).toBeEnabled();
        await user.click(next);
        await user.click(next);
        expect(api.selectedScrollSnap()).toBe(2);
        await waitFor(() => expect(next).toBeDisabled());
        expect(previous).toBeEnabled();
    });

    it('moves with Enter on a button and Space on a dot', async () => {
        const { user, api } = await renderCarousel({ footer: true });
        screen.getByRole('button', { name: 'Next slide' }).focus();
        await user.keyboard('{Enter}');
        expect(api.selectedScrollSnap()).toBe(1);
        screen.getByRole('button', { name: 'Go to slide 3' }).focus();
        await user.keyboard(' ');
        expect(api.selectedScrollSnap()).toBe(2);
    });

    it('renders the arrows as 36 px round outline buttons beside the slides, or in the footer row', async () => {
        const { unmount } = await renderCarousel();
        const beside = screen.getByRole('button', { name: 'Next slide' });
        expect(beside).toHaveAttribute('data-variant', 'outline');
        expect(beside).toHaveAttribute('data-size', 'icon');
        expect(beside.className).toContain('rounded-full');
        expect(beside.className).toContain('absolute');
        expect(beside.className).toContain('-end-12');
        unmount();
        await renderCarousel({ footer: true });
        expect(screen.getByRole('button', { name: 'Next slide' }).className).not.toContain('absolute');
    });

    it('renders one dot per position, named "Go to slide n", marking the current one', async () => {
        const { user, api } = await renderCarousel({ footer: true });
        const dots = screen.getAllByRole('button', { name: /^Go to slide/ });
        expect(dots.map((d) => d.textContent)).toEqual(['Go to slide 1', 'Go to slide 2', 'Go to slide 3']);
        expect(dots[0]).toHaveAttribute('aria-current', 'true');
        await user.click(dots[2]);
        expect(api.selectedScrollSnap()).toBe(2);
        await waitFor(() => expect(dots[2]).toHaveAttribute('aria-current', 'true'));
        expect(dots[0]).not.toHaveAttribute('aria-current');
        await expectNoAxeViolations();
    });

    it('takes every built-in word from the provider', async () => {
        await renderCarousel(
            { footer: true },
            {
                strings: {
                    carouselRole: 'carrousel',
                    slideRole: 'diapositive',
                    slideOf: 'Diapositive {index} sur {count}',
                    previousSlide: 'Diapositive précédente',
                    nextSlide: 'Diapositive suivante',
                    goToSlide: 'Aller à la diapositive {index}',
                },
            },
        );
        expect(screen.getByRole('region')).toHaveAttribute('aria-roledescription', 'carrousel');
        expect(screen.getAllByRole('group')[1]).toHaveAttribute('aria-label', 'Diapositive 2 sur 3');
        expect(screen.getAllByRole('group')[1]).toHaveAttribute('aria-roledescription', 'diapositive');
        expect(screen.getByRole('button', { name: 'Diapositive précédente' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Diapositive suivante' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Aller à la diapositive 3' })).toBeInTheDocument();
    });

    it('keeps a consumer aria-label on a slide', async () => {
        renderUi(
            <Carousel aria-label="Reports">
                <CarouselContent>
                    <CarouselItem aria-label="Delivery report">Report</CarouselItem>
                </CarouselContent>
            </Carousel>,
        );
        await act(async () => {});
        expect(screen.getByRole('group', { name: 'Delivery report' })).toBeInTheDocument();
    });
});
