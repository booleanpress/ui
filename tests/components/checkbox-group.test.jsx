import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { CheckboxGroup, CheckboxGroupItem, CheckboxGroupParent } from '@/components/checkbox-group';
import { Label } from '@/components/label';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const box = (name) => screen.getByRole('checkbox', { name });

function Lists(props) {
    return (
        <CheckboxGroup aria-label="Mailing lists" {...props}>
            <CheckboxGroupParent />
            <CheckboxGroupItem value="orders" label="Order receipts" />
            <CheckboxGroupItem value="news" label="Product news" />
            <CheckboxGroupItem value="digest" label="Weekly digest" />
        </CheckboxGroup>
    );
}

describe('CheckboxGroup', () => {
    it('renders a named group of labelled boxes, checked from its value', async () => {
        renderUi(
            <CheckboxGroup defaultValue={['delivered']} aria-label="Log these events">
                <CheckboxGroupItem value="delivered" label="Delivered" />
                <CheckboxGroupItem value="bounced" label="Bounced" />
            </CheckboxGroup>,
        );
        expect(screen.getByRole('group', { name: 'Log these events' })).toHaveAttribute('data-orientation', 'horizontal');
        expect(box('Delivered')).toHaveAttribute('aria-checked', 'true');
        expect(box('Bounced')).toHaveAttribute('aria-checked', 'false');
        await expectNoAxeViolations();
    });

    it('moves between the boxes with Tab', async () => {
        const { user } = renderUi(<Lists />);
        await user.tab();
        expect(box('Select all')).toHaveFocus();
        await user.tab();
        expect(box('Order receipts')).toHaveFocus();
        await user.tab();
        expect(box('Product news')).toHaveFocus();
    });

    it('toggles the focused item with Space and reports the new array', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Lists defaultValue={['orders']} onValueChange={onValueChange} />);
        box('Product news').focus();
        await user.keyboard(' ');
        expect(box('Product news')).toHaveAttribute('aria-checked', 'true');
        expect(onValueChange).toHaveBeenLastCalledWith(['orders', 'news']);
        box('Order receipts').focus();
        await user.keyboard(' ');
        expect(onValueChange).toHaveBeenLastCalledWith(['news']);
    });

    it('shows the parent mixed while some items are checked, and lists its items in aria-controls', async () => {
        renderUi(<Lists defaultValue={['orders']} />);
        const parent = box('Select all');
        expect(parent).toHaveAttribute('aria-checked', 'mixed');
        const ids = parent.getAttribute('aria-controls').split(' ');
        expect(ids).toEqual([box('Order receipts').id, box('Product news').id, box('Weekly digest').id]);
        await expectNoAxeViolations();
    });

    it('cycles the parent with Space from mixed to all, to none, and back to all', async () => {
        const { user } = renderUi(<Lists defaultValue={['news']} />);
        const parent = box('Select all');
        parent.focus();
        await user.keyboard(' ');
        expect(parent).toHaveAttribute('aria-checked', 'true');
        for (const name of ['Order receipts', 'Product news', 'Weekly digest']) expect(box(name)).toHaveAttribute('aria-checked', 'true');
        await user.keyboard(' ');
        expect(parent).toHaveAttribute('aria-checked', 'false');
        for (const name of ['Order receipts', 'Product news', 'Weekly digest']) expect(box(name)).toHaveAttribute('aria-checked', 'false');
        await user.keyboard(' ');
        expect(parent).toHaveAttribute('aria-checked', 'true');
        for (const name of ['Order receipts', 'Product news', 'Weekly digest']) expect(box(name)).toHaveAttribute('aria-checked', 'true');
    });

    it('checks every item from an unchecked parent when no mix was made', async () => {
        const { user } = renderUi(<Lists />);
        box('Select all').focus();
        await user.keyboard(' ');
        expect(box('Select all')).toHaveAttribute('aria-checked', 'true');
        expect(box('Weekly digest')).toHaveAttribute('aria-checked', 'true');
    });

    it('turns the parent checked once every item is checked by hand', async () => {
        const { user } = renderUi(<Lists defaultValue={['orders', 'news']} />);
        await user.click(box('Weekly digest'));
        expect(box('Select all')).toHaveAttribute('aria-checked', 'true');
    });

    it('controls only its values in a nested group', async () => {
        const { user } = renderUi(
            <CheckboxGroup defaultValue={['tickets.reply']} aria-label="Agent permissions">
                <CheckboxGroupParent label="All permissions" />
                <CheckboxGroupParent label="Tickets" values={['tickets.reply', 'tickets.assign']} />
                <CheckboxGroupItem value="tickets.reply" label="Reply to tickets" />
                <CheckboxGroupItem value="tickets.assign" label="Assign tickets" />
                <CheckboxGroupParent label="Billing" values={['billing.invoices']} />
                <CheckboxGroupItem value="billing.invoices" label="View invoices" />
            </CheckboxGroup>,
        );
        expect(box('Tickets')).toHaveAttribute('aria-checked', 'mixed');
        expect(box('Billing')).toHaveAttribute('aria-checked', 'false');
        expect(box('All permissions')).toHaveAttribute('aria-checked', 'mixed');
        box('Tickets').focus();
        await user.keyboard(' ');
        expect(box('Assign tickets')).toHaveAttribute('aria-checked', 'true');
        expect(box('View invoices')).toHaveAttribute('aria-checked', 'false');
        expect(box('All permissions')).toHaveAttribute('aria-checked', 'mixed');
        await user.click(box('Billing'));
        expect(box('All permissions')).toHaveAttribute('aria-checked', 'true');
        await expectNoAxeViolations();
    });

    it('leaves disabled items alone when the parent toggles', async () => {
        const { user } = renderUi(
            <CheckboxGroup defaultValue={[]} aria-label="Mailers">
                <CheckboxGroupParent />
                <CheckboxGroupItem value="smtp" label="SMTP" />
                <CheckboxGroupItem value="postmark" label="Postmark" disabled />
            </CheckboxGroup>,
        );
        box('Select all').focus();
        await user.keyboard(' ');
        expect(box('SMTP')).toHaveAttribute('aria-checked', 'true');
        expect(box('Postmark')).toHaveAttribute('aria-checked', 'false');
        expect(box('Select all')).toHaveAttribute('aria-checked', 'true');
    });

    it('is controlled by value', async () => {
        function Controlled() {
            const [value, setValue] = useState(['email']);
            return (
                <>
                    <CheckboxGroup value={value} onValueChange={setValue} aria-label="Alert channels">
                        <CheckboxGroupItem value="email" label="Email" />
                        <CheckboxGroupItem value="sms" label="SMS" />
                    </CheckboxGroup>
                    <output>{value.join(',')}</output>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.click(box('SMS'));
        expect(screen.getByRole('status')).toHaveTextContent('email,sms');
        expect(box('SMS')).toHaveAttribute('aria-checked', 'true');
    });

    it('disables every box, the parent too, when the group is disabled', async () => {
        const { user } = renderUi(<Lists disabled defaultValue={['orders']} />);
        for (const name of ['Select all', 'Order receipts', 'Product news']) expect(box(name)).toBeDisabled();
        await user.click(box('Product news'));
        expect(box('Product news')).toHaveAttribute('aria-checked', 'false');
        await expectNoAxeViolations();
    });

    it('marks every box invalid with aria-invalid on the group', async () => {
        renderUi(
            <>
                <CheckboxGroup aria-label="Consent" aria-invalid aria-describedby="consent-error">
                    <CheckboxGroupItem value="opt-in" label="Every contact opted in" />
                    <CheckboxGroupItem value="terms" label="I accept the import terms" />
                </CheckboxGroup>
                <p id="consent-error">Confirm both to import the list.</p>
            </>,
        );
        expect(box('Every contact opted in')).toHaveAttribute('aria-invalid', 'true');
        expect(box('I accept the import terms')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('group')).not.toHaveAttribute('aria-invalid');
        expect(screen.getByRole('group')).toHaveAccessibleDescription('Confirm both to import the list.');
        await expectNoAxeViolations();
    });

    it('reads an item description as the box description', async () => {
        renderUi(
            <CheckboxGroup aria-label="API key scopes">
                <CheckboxGroupItem value="mail.send" label="Send email" description="Send through every connected mailer." />
            </CheckboxGroup>,
        );
        expect(box('Send email')).toHaveAccessibleDescription('Send through every connected mailer.');
        await expectNoAxeViolations();
    });

    it('lets a box without a label be labelled by its own Label', () => {
        renderUi(
            <CheckboxGroup aria-label="Days">
                <CheckboxGroupItem value="mon" id="day-mon" />
                <Label htmlFor="day-mon">Monday</Label>
            </CheckboxGroup>,
        );
        expect(box('Monday')).toBeInTheDocument();
    });

    it('lays the items out in a row with orientation="horizontal"', () => {
        renderUi(<Lists orientation="horizontal" />);
        expect(screen.getByRole('group', { name: 'Mailing lists' })).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('labels the parent from the provider string', () => {
        renderUi(<Lists />, { strings: { selectAll: 'Alle auswählen' } });
        expect(box('Alle auswählen')).toBeInTheDocument();
    });

    it('hands its size and variant to every box', () => {
        renderUi(<Lists size="lg" variant="filled" />);
        for (const name of ['Select all', 'Order receipts']) {
            expect(box(name)).toHaveAttribute('data-size', 'lg');
            expect(box(name)).toHaveAttribute('data-variant', 'filled');
        }
    });

    it('counts only the items it can change: a checked disabled item leaves the parent unchecked and stays checked', async () => {
        const { user } = renderUi(
            <CheckboxGroup defaultValue={['smtp']} aria-label="Mailers">
                <CheckboxGroupParent />
                <CheckboxGroupItem value="smtp" label="SMTP" disabled />
                <CheckboxGroupItem value="ses" label="Amazon SES" />
                <CheckboxGroupItem value="postmark" label="Postmark" />
            </CheckboxGroup>,
        );
        expect(box('Select all')).toHaveAttribute('aria-checked', 'false');
        await user.click(box('Amazon SES'));
        expect(box('Select all')).toHaveAttribute('aria-checked', 'mixed');
        await user.click(box('Select all'));
        expect(box('Select all')).toHaveAttribute('aria-checked', 'true');
        await user.click(box('Select all'));
        expect(box('Amazon SES')).toHaveAttribute('aria-checked', 'false');
        expect(box('SMTP')).toHaveAttribute('aria-checked', 'true');
        expect(box('Select all')).toHaveAttribute('aria-checked', 'false');
    });

    it('disables the parent when every item it controls is disabled', async () => {
        renderUi(
            <CheckboxGroup defaultValue={['smtp']} aria-label="Mailers">
                <CheckboxGroupParent />
                <CheckboxGroupItem value="smtp" label="SMTP" disabled />
                <CheckboxGroupItem value="ses" label="Amazon SES" disabled />
            </CheckboxGroup>,
        );
        await waitFor(() => expect(box('Select all')).toBeDisabled());
        await expectNoAxeViolations();
    });

    it('goes back to its first value when the form is reset, the parent with it', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <form aria-label="Lists">
                <Lists name="lists" defaultValue={['orders']} onValueChange={onValueChange} />
                <button type="reset">Reset</button>
            </form>,
        );
        await user.click(box('Product news'));
        await user.click(box('Weekly digest'));
        expect(box('Select all')).toHaveAttribute('aria-checked', 'true');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        await waitFor(() => expect(box('Product news')).toHaveAttribute('aria-checked', 'false'));
        expect(box('Weekly digest')).toHaveAttribute('aria-checked', 'false');
        expect(box('Order receipts')).toHaveAttribute('aria-checked', 'true');
        expect(box('Select all')).toHaveAttribute('aria-checked', 'mixed');
        expect(onValueChange).toHaveBeenLastCalledWith(['orders']);
        expect(new FormData(screen.getByRole('form')).getAll('lists')).toEqual(['orders']);
    });

    it('calls an item onClick and lets it cancel the toggle', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const { user } = renderUi(
            <CheckboxGroup aria-label="Lists">
                <CheckboxGroupItem value="news" label="Product news" onClick={onClick} />
            </CheckboxGroup>,
        );
        await user.click(box('Product news'));
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(box('Product news')).toHaveAttribute('aria-checked', 'false');
    });

    it('submits each checked value under its name', () => {
        renderUi(
            <form aria-label="Lists">
                <Lists name="lists" defaultValue={['orders', 'digest']} />
            </form>,
        );
        expect(new FormData(screen.getByRole('form')).getAll('lists')).toEqual(['orders', 'digest']);
    });
});

describe('CheckboxGroup and its form', () => {
    it('submits its checked values to the form its form attribute names', () => {
        renderUi(
            <>
                <form id="lists" />
                <Lists name="lists" form="lists" defaultValue={['orders', 'digest']} />
            </>
        );
        expect(new FormData(document.getElementById('lists')).getAll('lists')).toEqual(['orders', 'digest']);
    });
});
