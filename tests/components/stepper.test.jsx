import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import {
    Stepper,
    StepperContent,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperList,
    StepperNext,
    StepperPrevious,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from '@/components/stepper';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const STEPS = ['Connection', 'Sender', 'Test email'];

function Setup({ orientation = 'horizontal', errorStep, onNext, ...props }) {
    const vertical = orientation === 'vertical';
    return (
        <Stepper orientation={orientation} {...props}>
            <StepperList aria-label="Setup">
                {STEPS.map((title, index) => (
                    <StepperItem key={title} step={index + 1} error={errorStep === index + 1}>
                        <StepperTrigger>
                            <StepperIndicator />
                            <StepperTitle>{title}</StepperTitle>
                            {index === 0 ? <StepperDescription>Host and port</StepperDescription> : null}
                        </StepperTrigger>
                        {index < STEPS.length - 1 ? <StepperSeparator /> : null}
                        {vertical ? <StepperContent>{title} panel</StepperContent> : null}
                    </StepperItem>
                ))}
            </StepperList>
            {vertical
                ? null
                : STEPS.map((title, index) => (
                      <StepperContent key={title} step={index + 1}>
                          {title} panel
                      </StepperContent>
                  ))}
            <StepperPrevious />
            <StepperNext onClick={onNext} />
        </Stepper>
    );
}

const step = (name) => screen.getByRole('button', { name: new RegExp(name) });

describe('Stepper', () => {
    it('renders an ordered list of step buttons, the current one marked aria-current="step"', async () => {
        const { container } = renderUi(<Setup />);
        const list = screen.getByRole('list', { name: 'Setup' });
        expect(list.tagName).toBe('OL');
        expect(screen.getAllByRole('listitem')).toHaveLength(3);
        expect(screen.getByRole('button', { name: /^Step 1 of 3 Connection/ })).toHaveAttribute('aria-current', 'step');
        expect(screen.getByRole('button', { name: 'Step 2 of 3 Sender' })).not.toHaveAttribute('aria-current');
        expect(screen.getByRole('group', { name: /Connection/ })).toHaveTextContent('Connection panel');
        expect(screen.queryByText('Sender panel')).toBeNull();
        expect(container.querySelector('[data-slot="stepper-indicator"]')).toHaveAttribute('aria-hidden', 'true');
        await expectNoAxeViolations();
    });

    it('goes to a step with Enter and Space', async () => {
        const { user } = renderUi(<Setup />);
        step('Sender').focus();
        await user.keyboard('{Enter}');
        expect(step('Sender')).toHaveAttribute('aria-current', 'step');
        expect(screen.getByText('Sender panel')).toBeInTheDocument();
        step('Test email').focus();
        await user.keyboard(' ');
        expect(step('Test email')).toHaveAttribute('aria-current', 'step');
        await expectNoAxeViolations();
    });

    it('moves with Tab from step to step, then on to the content', async () => {
        const { user } = renderUi(<Setup />);
        await user.tab();
        expect(step('Connection')).toHaveFocus();
        await user.tab();
        expect(step('Sender')).toHaveFocus();
    });

    it('moves focus with → and ←, wrapping at the ends', async () => {
        const { user } = renderUi(<Setup />);
        step('Connection').focus();
        await user.keyboard('{ArrowRight}');
        expect(step('Sender')).toHaveFocus();
        await user.keyboard('{ArrowLeft}{ArrowLeft}');
        expect(step('Test email')).toHaveFocus();
        expect(step('Connection')).toHaveAttribute('aria-current', 'step');
    });

    it('moves focus to the first and last step with Home and End', async () => {
        const { user } = renderUi(<Setup />);
        step('Sender').focus();
        await user.keyboard('{End}');
        expect(step('Test email')).toHaveFocus();
        await user.keyboard('{Home}');
        expect(step('Connection')).toHaveFocus();
    });

    it('reverses → and ← in a right-to-left page', async () => {
        const { user } = renderUi(<Setup />, { dir: 'rtl' });
        step('Connection').focus();
        await user.keyboard('{ArrowLeft}');
        expect(step('Sender')).toHaveFocus();
    });

    it('moves with ↓ and ↑ when vertical, each step showing its content in its item', async () => {
        const { user } = renderUi(<Setup orientation="vertical" />);
        expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Connection panel');
        step('Connection').focus();
        await user.keyboard('{ArrowDown}');
        expect(step('Sender')).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('Sender panel');
        await user.keyboard('{ArrowUp}');
        expect(step('Connection')).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('blocks later steps when linear, and Next moves on', async () => {
        const { user } = renderUi(<Setup linear />);
        expect(step('Sender')).toBeDisabled();
        expect(step('Test email')).toBeDisabled();
        await user.click(step('Test email'));
        expect(step('Connection')).toHaveAttribute('aria-current', 'step');
        step('Connection').focus();
        await user.keyboard('{ArrowRight}');
        expect(step('Connection')).toHaveFocus();
        await user.click(screen.getByRole('button', { name: 'Next' }));
        expect(step('Sender')).toHaveAttribute('aria-current', 'step');
        expect(step('Connection')).not.toBeDisabled();
        expect(step('Test email')).toBeDisabled();
        await expectNoAxeViolations();
    });

    it('marks the steps before the current one completed, with a check', () => {
        const first3 = renderUi(<Setup defaultValue={3} />);
        expect(screen.getByRole('button', { name: 'Step 2 of 3 Sender Completed' })).toBeInTheDocument();
        first3.unmount();
        const { container } = renderUi(<Setup defaultValue={2} />);
        const [first, second] = container.querySelectorAll('[data-slot="stepper-indicator"]');
        expect(first).toHaveAttribute('data-state', 'completed');
        expect(first.querySelector('.lucide-check')).not.toBeNull();
        expect(second).toHaveTextContent('2');
        expect(container.querySelector('[data-slot="stepper-item"]')).toHaveAttribute('data-state', 'completed');
    });

    it('marks a step in error', async () => {
        const { container } = renderUi(<Setup defaultValue={2} errorStep={2} />);
        expect(screen.getByRole('button', { name: 'Step 2 of 3 Sender Has errors' })).toBeInTheDocument();
        expect(container.querySelectorAll('[data-slot="stepper-item"]')[1]).toHaveAttribute('data-error');
        expect(container.querySelectorAll('[data-slot="stepper-indicator"]')[1].querySelector('.lucide-x')).not.toBeNull();
        await expectNoAxeViolations();
    });

    it('disables Back on the first step and shows Finish on the last, which keeps the step', async () => {
        const onNext = vi.fn();
        const { user } = renderUi(<Setup defaultValue={3} onNext={onNext} />);
        expect(screen.getByRole('button', { name: 'Back' })).not.toBeDisabled();
        await user.click(screen.getByRole('button', { name: 'Finish' }));
        expect(onNext).toHaveBeenCalledTimes(1);
        expect(step('Test email')).toHaveAttribute('aria-current', 'step');
        await user.click(screen.getByRole('button', { name: 'Back' }));
        await user.click(screen.getByRole('button', { name: 'Back' }));
        expect(step('Connection')).toHaveAttribute('aria-current', 'step');
        expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
    });

    it('hands focus to Next when Back disables on the first step, so it does not fall to the page', async () => {
        const { user } = renderUi(<Setup defaultValue={2} />);
        const back = screen.getByRole('button', { name: 'Back' });
        back.focus();
        await user.keyboard('{Enter}');
        expect(step('Connection')).toHaveAttribute('aria-current', 'step');
        expect(back).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    });

    it('hands focus to Back when a Next with focus is disabled', async () => {
        function Finishing() {
            const [done, setDone] = useState(false);
            return (
                <Stepper defaultValue={2}>
                    <StepperList aria-label="Setup">
                        {[1, 2].map((n) => (
                            <StepperItem key={n} step={n}>
                                <StepperTrigger><StepperTitle>Part {n}</StepperTitle></StepperTrigger>
                            </StepperItem>
                        ))}
                    </StepperList>
                    <StepperPrevious />
                    <StepperNext disabled={done} onClick={() => setDone(true)} />
                </Stepper>
            );
        }
        const { user } = renderUi(<Finishing />);
        screen.getByRole('button', { name: 'Finish' }).focus();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('button', { name: 'Finish' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Back' })).toHaveFocus();
    });

    it('stays on the step when Next is prevented', async () => {
        const { user } = renderUi(<Setup onNext={(event) => event.preventDefault()} />);
        await user.click(screen.getByRole('button', { name: 'Next' }));
        expect(step('Connection')).toHaveAttribute('aria-current', 'step');
    });

    it('follows a controlled value and reports changes', async () => {
        const onChange = vi.fn();
        function Controlled() {
            const [value, setValue] = useState(2);
            return (
                <Setup
                    value={value}
                    onValueChange={(next) => {
                        onChange(next);
                        setValue(next);
                    }}
                />
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(step('Sender')).toHaveAttribute('aria-current', 'step');
        await user.click(step('Test email'));
        expect(onChange).toHaveBeenLastCalledWith(3);
        expect(step('Test email')).toHaveAttribute('aria-current', 'step');
    });

    it('counts the steps while rendering, so the server HTML reads "Step 2 of 3" and the last step says Finish', () => {
        const html = renderToString(
            <BooleanUIProvider>
                <Setup defaultValue={3} />
            </BooleanUIProvider>,
        );
        const doc = document.createElement('div');
        doc.innerHTML = html;
        const positions = [...doc.querySelectorAll('[data-slot=stepper-position]')].map((node) => node.textContent);
        expect(positions).toEqual(['Step 1 of 3', 'Step 2 of 3', 'Step 3 of 3']);
        expect(doc.querySelector('[data-slot=stepper-next]')).toHaveAttribute('data-last');
        expect(doc.querySelector('[data-slot=stepper-previous]')).not.toBeDisabled();
    });

    it('takes its words from the provider strings', () => {
        renderUi(<Setup defaultValue={3} />, {
            strings: { stepOf: 'Schritt {current} von {total}', stepCompleted: 'Erledigt', back: 'Zurück', finish: 'Fertig' },
        });
        expect(screen.getByRole('button', { name: 'Schritt 2 von 3 Sender Erledigt' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Zurück' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Fertig' })).toBeInTheDocument();
    });
});
