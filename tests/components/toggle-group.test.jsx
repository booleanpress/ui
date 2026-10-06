import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Period({ itemProps = {}, ...props }) {
    return (
        <ToggleGroup type="single" aria-label="Period" {...props}>
            <ToggleGroupItem value="24h" {...(itemProps['24h'] ?? {})}>24 hours</ToggleGroupItem>
            <ToggleGroupItem value="7d" {...(itemProps['7d'] ?? {})}>7 days</ToggleGroupItem>
            <ToggleGroupItem value="30d" {...(itemProps['30d'] ?? {})}>30 days</ToggleGroupItem>
        </ToggleGroup>
    );
}

const item = (name) => screen.getByRole('button', { name });

describe('ToggleGroup', () => {
    it('single: renders a group of toggle buttons, the chosen one pressed', async () => {
        renderUi(<Period rovingFocus defaultValue="7d" />);
        expect(screen.getByRole('group', { name: 'Period' })).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(3);
        expect(item('7 days')).toHaveAttribute('aria-pressed', 'true');
        await expectNoAxeViolations();
    });

    it('multiple: renders a group of toggle buttons with aria-pressed', async () => {
        renderUi(
            <ToggleGroup type="multiple" aria-label="Statuses" defaultValue={['bounced']}>
                <ToggleGroupItem value="delivered">Delivered</ToggleGroupItem>
                <ToggleGroupItem value="bounced">Bounced</ToggleGroupItem>
            </ToggleGroup>,
        );
        expect(screen.getByRole('button', { name: 'Bounced' })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: 'Delivered' })).toHaveAttribute('aria-pressed', 'false');
        await expectNoAxeViolations();
    });

    it('is one tab stop: Tab enters on the chosen item, the others are tabindex -1', async () => {
        const { user } = renderUi(<Period rovingFocus defaultValue="7d" />);
        await user.tab();
        expect(item('7 days')).toHaveFocus();
        expect(item('24 hours')).toHaveAttribute('tabindex', '-1');
        await user.tab();
        expect(document.body).toHaveFocus();
    });

    it('moves focus with Right and Left, wrapping at the ends, without changing the value', async () => {
        const { user } = renderUi(<Period rovingFocus defaultValue="7d" />);
        await user.tab();
        await user.keyboard('{ArrowRight}');
        expect(item('30 days')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(item('24 hours')).toHaveFocus();
        await user.keyboard('{ArrowLeft}');
        expect(item('30 days')).toHaveFocus();
        expect(item('7 days')).toHaveAttribute('aria-pressed', 'true');
    });

    it('moves focus with Down and Up as well', async () => {
        const { user } = renderUi(<Period rovingFocus defaultValue="7d" />);
        await user.tab();
        await user.keyboard('{ArrowDown}');
        expect(item('30 days')).toHaveFocus();
        await user.keyboard('{ArrowUp}{ArrowUp}');
        expect(item('24 hours')).toHaveFocus();
    });

    it('moves focus to the first and last item with Home and End', async () => {
        const { user } = renderUi(<Period rovingFocus defaultValue="7d" />);
        await user.tab();
        await user.keyboard('{End}');
        expect(item('30 days')).toHaveFocus();
        await user.keyboard('{Home}');
        expect(item('24 hours')).toHaveFocus();
    });

    it('chooses the focused item with Space and Enter; choosing the chosen item clears it', async () => {
        const { user } = renderUi(<Period rovingFocus defaultValue="7d" />);
        await user.tab();
        await user.keyboard('{ArrowRight}{Enter}');
        expect(item('30 days')).toHaveAttribute('aria-pressed', 'true');
        expect(item('7 days')).toHaveAttribute('aria-pressed', 'false');
        await user.keyboard(' ');
        expect(item('30 days')).toHaveAttribute('aria-pressed', 'false');
    });

    it('multiple: Space toggles each item independently', async () => {
        const { user } = renderUi(
            <ToggleGroup type="multiple" rovingFocus aria-label="Statuses">
                <ToggleGroupItem value="delivered">Delivered</ToggleGroupItem>
                <ToggleGroupItem value="bounced">Bounced</ToggleGroupItem>
            </ToggleGroup>,
        );
        await user.tab();
        await user.keyboard(' {ArrowRight} ');
        expect(screen.getByRole('button', { name: 'Delivered' })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: 'Bounced' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('follows the reading direction in RTL: Left moves to the next item', async () => {
        const { user } = renderUi(<Period rovingFocus defaultValue="7d" />, { dir: 'rtl' });
        await user.tab();
        await user.keyboard('{ArrowLeft}');
        expect(item('30 days')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(item('7 days')).toHaveFocus();
    });

    it('is controlled by value', async () => {
        function Controlled() {
            const [value, setValue] = useState('24h');
            return (
                <>
                    <Period value={value} onValueChange={setValue} />
                    <p>Period: {value || 'none'}</p>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(item('30 days'));
        expect(screen.getByText('Period: 30d')).toBeInTheDocument();
    });

    it('passes variant, size and spacing down to the items', () => {
        renderUi(<Period variant="outline" size="sm" spacing={2} defaultValue="7d" />);
        const group = screen.getByRole('group', { name: 'Period' });
        expect(group).toHaveAttribute('data-variant', 'outline');
        expect(group).toHaveAttribute('data-spacing', '2');
        expect(item('7 days')).toHaveAttribute('data-variant', 'outline');
        expect(item('7 days')).toHaveAttribute('data-size', 'sm');
    });

    it('disables the whole group', async () => {
        const { user } = renderUi(<Period disabled defaultValue="7d" />);
        await user.click(item('30 days'));
        expect(item('30 days')).toHaveAttribute('aria-pressed', 'false');
        expect(item('30 days')).toBeDisabled();
        await expectNoAxeViolations();
    });

    it('skips a disabled item when moving with the arrows', async () => {
        const { user } = renderUi(<Period rovingFocus defaultValue="24h" itemProps={{ '7d': { disabled: true } }} />);
        await user.tab();
        await user.keyboard('{ArrowRight}');
        expect(item('30 days')).toHaveFocus();
        expect(item('7 days')).toBeDisabled();
    });

    it('sets the provider controlSize on the group and its items when none is given', () => {
        renderUi(<Period rovingFocus defaultValue="7d" />, { controlSize: 'lg' });
        expect(screen.getByRole('group', { name: 'Period' })).toHaveAttribute('data-size', 'lg');
        expect(item('7 days')).toHaveAttribute('data-size', 'lg');
    });

    it('fluid: the group fills its container and the items share it', () => {
        renderUi(<Period fluid defaultValue="7d" />);
        expect(screen.getByRole('group', { name: 'Period' }).className).toContain('w-full');
        expect(item('24 hours').className).toContain('flex-1');
        // jsdom has no layout: the rules that let a long label wrap, or clip a long word, in its equal item rather than
        // spill into the next one when the group is narrow, are checked here; the widths in the browser.
        expect(item('24 hours').className).toContain('overflow-hidden');
        expect(item('24 hours').className).toContain('wrap-break-word');
        expect(item('24 hours').className).toContain('whitespace-normal');
        expect(item('24 hours').className).not.toContain('whitespace-nowrap');
    });

    it('announces an invalid group with its message', async () => {
        renderUi(
            <>
                <Period aria-invalid aria-describedby="period-error" />
                <p id="period-error">Choose a period.</p>
            </>,
        );
        const group = screen.getByRole('group', { name: 'Period' });
        expect(group).toHaveAttribute('aria-invalid', 'true');
        expect(group).toHaveAccessibleDescription('Choose a period.');
        await expectNoAxeViolations();
    });

    it('controlled: a handler that ignores the empty value keeps one item pressed', async () => {
        function Required() {
            const [value, setValue] = useState('7d');
            return (
                <>
                    <Period value={value} onValueChange={(v) => v && setValue(v)} />
                    <p>Period: {value}</p>
                </>
            );
        }
        const { user } = renderUi(<Required />);
        await user.click(item('7 days'));
        expect(item('7 days')).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByText('Period: 7d')).toBeInTheDocument();
        await user.click(item('24 hours'));
        expect(screen.getByText('Period: 24h')).toBeInTheDocument();
    });
});


it('defaults to a tab stop for each enabled button without arrow-key movement', async () => {
    const { user } = renderUi(<Period defaultValue="7d" itemProps={{ '30d': { disabled: true } }} />);
    await user.tab();
    expect(item('24 hours')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(item('24 hours')).toHaveFocus();
    await user.tab();
    expect(item('7 days')).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
    expect(item('7 days')).not.toHaveAttribute('aria-checked');
});

it('allowEmpty=false keeps the last single selection and permits changing it', async () => {
    const { user } = renderUi(<Period defaultValue="7d" allowEmpty={false} />);
    await user.click(item('7 days'));
    expect(item('7 days')).toHaveAttribute('aria-pressed', 'true');
    await user.click(item('24 hours'));
    expect(item('24 hours')).toHaveAttribute('aria-pressed', 'true');
    expect(item('7 days')).toHaveAttribute('aria-pressed', 'false');
});

it('allowEmpty=false keeps the last multiple selection and permits releasing others', async () => {
    const { user } = renderUi(<ToggleGroup type="multiple" defaultValue={['a', 'b']} allowEmpty={false} aria-label="Letters">
        <ToggleGroupItem value="a">A</ToggleGroupItem><ToggleGroupItem value="b">B</ToggleGroupItem>
    </ToggleGroup>);
    await user.click(item('A'));
    expect(item('A')).toHaveAttribute('aria-pressed', 'false');
    await user.click(item('B'));
    expect(item('B')).toHaveAttribute('aria-pressed', 'true');
});
