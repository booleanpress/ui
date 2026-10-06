import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Rating } from '@/components/rating';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const star = (name) => screen.getByRole('radio', { name });

/** Presses an arrow key the way a person does, so Radix's roving focus checks the radio it lands on. */
async function arrow(user, key, landsOn) {
    await user.keyboard(`{${key}>}`);
    await waitFor(() => expect(star(landsOn)).toHaveFocus());
    await user.keyboard(`{/${key}}`);
}

describe('Rating', () => {
    it('renders a named radio group of stars, each named out of five, with the rating checked', async () => {
        renderUi(<Rating allowHalf={false} defaultValue={3} aria-label="Rate this reply" />);
        expect(screen.getByRole('radiogroup', { name: 'Rate this reply' })).toBeInTheDocument();
        expect(screen.getAllByRole('radio')).toHaveLength(5);
        expect(star('3 of 5')).toHaveAttribute('aria-checked', 'true');
        expect(star('4 of 5')).toHaveAttribute('aria-checked', 'false');
        const items = document.querySelectorAll('[data-slot=rating-item]');
        expect([...items].map((item) => item.getAttribute('data-state'))).toEqual(['full', 'full', 'full', 'empty', 'empty']);
        await expectNoAxeViolations();
    });

    it('moves to the chosen star with Tab', async () => {
        const { user } = renderUi(<Rating allowHalf={false} defaultValue={2} aria-label="Rate this reply" />);
        await user.tab();
        expect(star('2 of 5')).toHaveFocus();
        await user.tab();
        expect(document.body).toHaveFocus();
    });

    it('chooses the next star with ArrowRight and ArrowDown, from the last back to the first', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Rating allowHalf={false} defaultValue={4} onValueChange={onValueChange} aria-label="Rate this reply" />);
        await user.tab();
        await arrow(user, 'ArrowRight', '5 of 5');
        expect(star('5 of 5')).toHaveAttribute('aria-checked', 'true');
        await arrow(user, 'ArrowDown', '1 of 5');
        expect(star('1 of 5')).toHaveAttribute('aria-checked', 'true');
        expect(onValueChange.mock.calls.map(([v]) => v)).toEqual([5, 1]);
    });

    it('chooses the previous star with ArrowLeft and ArrowUp, from the first round to the last', async () => {
        const { user } = renderUi(<Rating allowHalf={false} defaultValue={2} aria-label="Rate this reply" />);
        await user.tab();
        await arrow(user, 'ArrowLeft', '1 of 5');
        await arrow(user, 'ArrowUp', '5 of 5');
        expect(star('5 of 5')).toHaveAttribute('aria-checked', 'true');
    });

    it('swaps ArrowLeft and ArrowRight in right-to-left pages', async () => {
        const { user } = renderUi(<Rating allowHalf={false} defaultValue={2} aria-label="Rate this reply" />, { dir: 'rtl' });
        await user.tab();
        await arrow(user, 'ArrowLeft', '3 of 5');
        expect(star('3 of 5')).toHaveAttribute('aria-checked', 'true');
    });

    it('chooses the focused star with Space when none is chosen', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Rating allowHalf={false} onValueChange={onValueChange} aria-label="Rate this reply" />);
        await user.tab();
        expect(star('1 of 5')).toHaveFocus();
        expect(star('1 of 5')).toHaveAttribute('aria-checked', 'false');
        await user.keyboard(' ');
        expect(star('1 of 5')).toHaveAttribute('aria-checked', 'true');
        expect(onValueChange).toHaveBeenCalledWith(1);
    });

    it('chooses a star when it is clicked', async () => {
        const { user } = renderUi(<Rating allowHalf={false} aria-label="Rate this reply" />);
        await user.click(star('4 of 5'));
        expect(star('4 of 5')).toHaveAttribute('aria-checked', 'true');
        expect(document.querySelectorAll('[data-slot=rating-item][data-state=full]')).toHaveLength(4);
    });

    it('clears the rating when the chosen star is clicked again, and announces it', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Rating allowHalf={false} defaultValue={3} onValueChange={onValueChange} aria-label="Rate this reply" />);
        await user.click(star('3 of 5'));
        expect(screen.getAllByRole('radio').every((radio) => radio.getAttribute('aria-checked') === 'false')).toBe(true);
        expect(onValueChange).toHaveBeenLastCalledWith(0);
        expect(screen.getByRole('status')).toHaveTextContent('Rating cleared');
        await user.click(star('2 of 5'));
        expect(star('2 of 5')).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('status')).toHaveTextContent('');
        await expectNoAxeViolations();
    });

    it('clears the rating with Space on the checked star, and chooses it again with a second Space', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Rating allowHalf={false} defaultValue={2} onValueChange={onValueChange} aria-label="Rate this reply" />);
        await user.tab();
        expect(star('2 of 5')).toHaveFocus();
        await user.keyboard(' ');
        expect(star('2 of 5')).toHaveAttribute('aria-checked', 'false');
        expect(star('2 of 5')).toHaveFocus();
        await user.keyboard(' ');
        expect(star('2 of 5')).toHaveAttribute('aria-checked', 'true');
        expect(onValueChange.mock.calls.map(([v]) => v)).toEqual([0, 2]);
    });

    it('clears the rating with Enter on the checked star, and chooses a star with Enter', async () => {
        const { user } = renderUi(<Rating allowHalf={false} defaultValue={4} aria-label="Rate this reply" />);
        await user.tab();
        await user.keyboard('{Enter}');
        expect(star('4 of 5')).toHaveAttribute('aria-checked', 'false');
        await user.keyboard('{Enter}');
        expect(star('4 of 5')).toHaveAttribute('aria-checked', 'true');
    });

    it('clears the rating with Backspace and Delete', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Rating allowHalf={false} defaultValue={3} onValueChange={onValueChange} aria-label="Rate this reply" />);
        await user.tab();
        await user.keyboard('{Backspace}');
        expect(document.querySelectorAll('[data-slot=rating-item][data-state=full]')).toHaveLength(0);
        expect(screen.getByRole('status')).toHaveTextContent('Rating cleared');
        await user.click(star('5 of 5'));
        await user.keyboard('{Delete}');
        expect(onValueChange.mock.calls.map(([v]) => v)).toEqual([0, 5, 0]);
    });

    it('keeps the rating with allowClear={false}', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Rating allowHalf={false} allowClear={false} defaultValue={3} onValueChange={onValueChange} aria-label="Rate this reply" />);
        await user.click(star('3 of 5'));
        await user.keyboard('{Backspace}');
        expect(star('3 of 5')).toHaveAttribute('aria-checked', 'true');
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('says a cleared rating in the provider string', async () => {
        const { user } = renderUi(<Rating allowHalf={false} defaultValue={1} aria-label="Bewertung" />, { strings: { ratingCleared: 'Bewertung entfernt' } });
        await user.click(screen.getByRole('radio', { name: '1 of 5' }));
        expect(screen.getByRole('status')).toHaveTextContent('Bewertung entfernt');
    });

    it('splits each star into a half and a whole by default', async () => {
        const { user } = renderUi(<Rating defaultValue={3.5} aria-label="Rate the delivery speed" />);
        expect(screen.getAllByRole('radio')).toHaveLength(10);
        expect(star('3.5 of 5')).toHaveAttribute('aria-checked', 'true');
        expect(document.querySelectorAll('[data-slot=rating-item]')[3]).toHaveAttribute('data-state', 'half');
        await user.tab();
        await arrow(user, 'ArrowRight', '4 of 5');
        expect(star('4 of 5')).toHaveAttribute('aria-checked', 'true');
        await expectNoAxeViolations();
    });

    it('moves by half stars with the arrows, mirrored in right-to-left pages, and clears a half with Space or Delete', async () => {
        const onValueChange = vi.fn();
        const { user, unmount } = renderUi(<Rating allowHalf defaultValue={3.5} onValueChange={onValueChange} aria-label="Speed" />);
        await user.tab();
        expect(star('3.5 of 5')).toHaveFocus();
        await arrow(user, 'ArrowLeft', '3 of 5');
        expect(document.querySelectorAll('[data-slot=rating-item]')[2]).toHaveAttribute('data-state', 'full');
        expect(document.querySelectorAll('[data-slot=rating-item]')[3]).toHaveAttribute('data-state', 'empty');
        await arrow(user, 'ArrowLeft', '2.5 of 5');
        await user.keyboard(' ');
        expect(star('2.5 of 5')).toHaveAttribute('aria-checked', 'false');
        expect(onValueChange.mock.calls.map(([v]) => v)).toEqual([3, 2.5, 0]);
        unmount();
        const rtl = renderUi(<Rating allowHalf defaultValue={1.5} aria-label="Speed" />, { dir: 'rtl' });
        await rtl.user.tab();
        await arrow(rtl.user, 'ArrowLeft', '2 of 5');
        await rtl.user.keyboard('{Delete}');
        expect(document.querySelectorAll('[data-slot=rating-item][data-state=empty]')).toHaveLength(5);
    });

    it('goes back to its first rating when the form is reset, and is required until a star is chosen', async () => {
        const { user } = renderUi(
            <form aria-label="Feedback">
                <Rating allowHalf={false} name="score" defaultValue={2} aria-label="Rate this reply" />
                <Rating allowHalf={false} name="speed" required aria-label="Rate the speed" />
                <button type="reset">Reset</button>
            </form>,
        );
        const form = screen.getByRole('form');
        expect(form.checkValidity()).toBe(false);
        await user.click(screen.getAllByRole('radio', { name: '4 of 5' })[0]);
        await user.click(screen.getAllByRole('radio', { name: '3 of 5' })[1]);
        expect(form.checkValidity()).toBe(true);
        expect(new FormData(form).get('score')).toBe('4');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        await waitFor(() => expect(screen.getAllByRole('radio', { name: '2 of 5' })[0]).toHaveAttribute('aria-checked', 'true'));
        expect(new FormData(form).get('score')).toBe('2');
        expect(new FormData(form).get('speed')).toBeNull();
    });

    it('is controlled by value', async () => {
        function Controlled() {
            const [score, setScore] = useState(2);
            return (
                <>
                    <Rating allowHalf={false} value={score} onValueChange={setScore} aria-label="Ticket satisfaction" />
                    <button type="button" onClick={() => setScore(5)}>
                        Five
                    </button>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(screen.getByRole('button', { name: 'Five' }));
        expect(star('5 of 5')).toHaveAttribute('aria-checked', 'true');
        await user.click(star('1 of 5'));
        expect(star('1 of 5')).toHaveAttribute('aria-checked', 'true');
    });

    it('draws max stars, each named out of max', () => {
        renderUi(<Rating allowHalf={false} max={10} defaultValue={5} aria-label="Onboarding" />);
        expect(screen.getAllByRole('radio')).toHaveLength(10);
        expect(star('5 of 10')).toHaveAttribute('aria-checked', 'true');
    });

    it('shows a read-only rating as one image named with the value, out of the tab order', async () => {
        const { user } = renderUi(<Rating allowHalf={false} readOnly allowHalf value={4.5} aria-label="Average rating" />);
        expect(screen.getByRole('img', { name: 'Average rating 4.5 of 5' })).toBeInTheDocument();
        expect(screen.queryAllByRole('radio')).toHaveLength(0);
        await user.tab();
        expect(document.body).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('names a read-only rating through aria-labelledby with its value', () => {
        renderUi(
            <>
                <span id="avg">Average</span>
                <Rating allowHalf={false} readOnly value={3} aria-labelledby="avg" />
            </>,
        );
        expect(screen.getByRole('img', { name: 'Average 3 of 5' })).toBeInTheDocument();
    });

    it('ignores clicks and keys and leaves the tab order while disabled', async () => {
        const { user } = renderUi(<Rating allowHalf={false} disabled defaultValue={3} aria-label="Rate this reply" />);
        for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
        await user.click(star('5 of 5'));
        expect(star('3 of 5')).toHaveAttribute('aria-checked', 'true');
        await user.tab();
        expect(document.body).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('draws custom icons for chosen and unchosen stars', async () => {
        renderUi(<Rating allowHalf={false} defaultValue={2} icon={<svg data-testid="on" />} emptyIcon={<svg data-testid="off" />} aria-label="Like" />);
        expect(screen.getAllByTestId('on')).toHaveLength(5);
        expect(screen.getAllByTestId('off')).toHaveLength(5);
        expect(screen.getAllByTestId('on')[0].closest('[data-slot=rating-icon]')).toHaveAttribute('aria-hidden', 'true');
        await expectNoAxeViolations();
    });

    it('names its stars from the provider string, in the provider locale', () => {
        renderUi(<Rating allowHalf defaultValue={2.5} aria-label="Bewertung" />, {
            strings: { ratingValue: '{value} von {max}' },
            locale: 'de-DE',
        });
        expect(star('2,5 von 5')).toHaveAttribute('aria-checked', 'true');
    });

    it('sets data-size from its prop or the provider', () => {
        const { unmount } = renderUi(<Rating allowHalf={false} size="lg" aria-label="Large" />);
        expect(screen.getByRole('radiogroup')).toHaveAttribute('data-size', 'lg');
        unmount();
        renderUi(<Rating allowHalf={false} aria-label="Small" />, { controlSize: 'sm' });
        expect(screen.getByRole('radiogroup')).toHaveAttribute('data-size', 'sm');
    });

    it('submits the rating in a form under name', async () => {
        const { user } = renderUi(
            <form aria-label="Feedback">
                <Rating allowHalf={false} name="score" aria-label="Rate this reply" />
            </form>,
        );
        await user.click(star('4 of 5'));
        expect(new FormData(screen.getByRole('form')).get('score')).toBe('4');
    });
});


describe('Rating templates and vertical halves', () => {
    it('passes each position and selected state to both visual layers', async () => {
        const { user } = renderUi(<Rating aria-label="Mood" defaultValue={2} allowHalf={false}
            renderIcon={({ index, active, checked }) => <span data-testid={`${active ? 'on' : 'off'}-${index}`}>{checked ? 'chosen' : 'idle'}</span>} />);
        expect(screen.getByTestId('on-1')).toHaveTextContent('chosen');
        expect(screen.getByTestId('off-0')).toHaveTextContent('idle');
        await user.click(star('4 of 5'));
        expect(screen.getByTestId('on-3')).toHaveTextContent('chosen');
        expect(screen.getByTestId('on-1')).toHaveTextContent('idle');
    });

    it('clips and targets the top half of a vertical star', async () => {
        const { user } = renderUi(<Rating orientation="vertical" defaultValue={2.5} aria-label="Score" />);
        const half = document.querySelectorAll('[data-slot=rating-icon]')[2];
        expect(half.className).toContain('[clip-path:inset(0_0_50%_0)]');
        expect(star('2.5 of 5').className).toContain('top-0');
        expect(star('3 of 5').className).toContain('bottom-0');
        await user.tab();
        await arrow(user, 'ArrowDown', '3 of 5');
        expect(star('3 of 5')).toHaveAttribute('aria-checked', 'true');
    });
});
