import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { DescriptionItem, DescriptionList } from '@/components/description-list';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Mailer(props) {
    return (
        <DescriptionList {...props}>
            <DescriptionItem label="Provider">Amazon SES</DescriptionItem>
            <DescriptionItem label="From address">no-reply@acme.example</DescriptionItem>
            <DescriptionItem label="Region" span={2}>
                eu-west-1
            </DescriptionItem>
        </DescriptionList>
    );
}

describe('DescriptionList', () => {
    it('is a dl of terms and definitions, each pair in a div', async () => {
        renderUi(<Mailer />);
        const terms = screen.getAllByRole('term');
        const values = screen.getAllByRole('definition');
        expect(terms.map((t) => t.textContent)).toEqual(['Provider', 'From address', 'Region']);
        expect(values.map((v) => v.textContent)).toEqual(['Amazon SES', 'no-reply@acme.example', 'eu-west-1']);
        expect(terms[0].tagName).toBe('DT');
        expect(values[0].tagName).toBe('DD');
        expect(terms[0].parentElement.tagName).toBe('DIV');
        expect(terms[0].parentElement.parentElement.tagName).toBe('DL');
        await expectNoAxeViolations();
    });

    it('defaults to the vertical orientation, one column and the provider’s size', () => {
        renderUi(<Mailer />, { controlSize: 'lg' });
        const list = document.querySelector('[data-slot=description-list]');
        expect(list).toHaveAttribute('data-orientation', 'vertical');
        expect(list).toHaveAttribute('data-size', 'lg');
        expect(list.style.getPropertyValue('--description-columns')).toBe('1');
    });

    it('puts the labels beside the values in a shared column with orientation="horizontal"', async () => {
        renderUi(<Mailer orientation="horizontal" columns={2} />);
        const list = document.querySelector('[data-slot=description-list]');
        expect(list).toHaveAttribute('data-orientation', 'horizontal');
        expect(list.style.getPropertyValue('--description-columns')).toBe('2');
        expect(screen.getAllByRole('term')[0].parentElement.className).toContain('grid-cols-subgrid');
        await expectNoAxeViolations();
    });

    it('spans an item across columns, counting the label column when horizontal', () => {
        const { unmount } = renderUi(<Mailer columns={2} />);
        expect(screen.getByText('Region').parentElement.style.getPropertyValue('--description-span')).toBe('span 2');
        unmount();
        renderUi(<Mailer orientation="horizontal" columns={2} />);
        expect(screen.getByText('Region').parentElement.style.getPropertyValue('--description-span')).toBe('span 4');
    });

    it('caps the label column beside the values, so one long label wraps instead of squeezing every value', () => {
        renderUi(<Mailer orientation="horizontal" columns={2} />);
        const list = document.querySelector('[data-slot=description-list]');
        // An `auto` label track grows to the longest label's full width and leaves the values none.
        expect(list.className).not.toMatch(/grid-cols-\[auto_/);
        expect(list).toHaveClass('grid-cols-[fit-content(40%)_minmax(0,1fr)]');
        expect(list.className).toContain('fit-content(calc(40%/var(--description-columns)))');
    });

    it('spans no more columns than the list has', () => {
        const { unmount } = renderUi(
            <DescriptionList columns={2}>
                <DescriptionItem label="Subject" span={3}>
                    SMTP login fails
                </DescriptionItem>
            </DescriptionList>,
        );
        expect(screen.getByText('Subject').parentElement.style.getPropertyValue('--description-span')).toBe('span 2');
        unmount();
        renderUi(
            <DescriptionList>
                <DescriptionItem label="Subject" span={3}>
                    SMTP login fails
                </DescriptionItem>
            </DescriptionList>,
        );
        // One column: nothing to span.
        expect(screen.getByText('Subject').parentElement.style.getPropertyValue('--description-span')).toBe('');
    });

    it('draws the bordered table and takes the sizes', async () => {
        renderUi(
            <>
                <Mailer bordered size="sm" />
                <Mailer bordered orientation="horizontal" />
            </>,
        );
        const [small, horizontal] = document.querySelectorAll('[data-slot=description-list]');
        expect(small).toHaveAttribute('data-bordered', 'true');
        expect(small).toHaveAttribute('data-size', 'sm');
        expect(horizontal).toHaveAttribute('data-size', 'default');
        expect(within(horizontal).getAllByRole('term')[0].className).toContain('bg-subtle');
        await expectNoAxeViolations();
    });

    it('puts an action at the end of the value, reachable with Tab', async () => {
        const { user } = renderUi(
            <DescriptionList>
                <DescriptionItem label="SMTP host" action={<button type="button">Copy SMTP host</button>}>
                    smtp.acme.example
                </DescriptionItem>
            </DescriptionList>,
        );
        const value = screen.getByRole('definition');
        expect(within(value).getByText('smtp.acme.example')).toBeInTheDocument();
        await user.tab();
        expect(within(value).getByRole('button', { name: 'Copy SMTP host' })).toHaveFocus();
        await expectNoAxeViolations();
    });
});
