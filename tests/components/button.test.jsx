import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { PlusIcon, SaveIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Button', () => {
    // A Server Component may render a Button only if the Button hands no function to its child: React cannot send one.
    it('carries no click handler of its own unless it refuses presses, so it renders in a Server Component', () => {
        expect(Button({ children: 'Save' }).props.onClick).toBeUndefined();
        expect(Button({ asChild: true, children: <a href="/x">Docs</a> }).props.onClick).toBeUndefined();
        expect(typeof Button({ loading: true, children: 'Save' }).props.onClick).toBe('function');
        expect(typeof Button({ asChild: true, disabled: true, children: <a href="/x">Docs</a> }).props.onClick).toBe('function');
    });

    it('activates with Enter and Space', async () => {
        let clicks = 0;
        const { user } = renderUi(<Button onClick={() => { clicks += 1; }}>Save</Button>);
        await user.tab();
        await user.keyboard('{Enter}');
        await user.keyboard(' ');
        expect(clicks).toBe(2);
        await expectNoAxeViolations();
    });

    it('keeps the density scale: 35 px default, 28 px sm and icon-sm, 24 px icon-xs', () => {
        renderUi(
            <>
                <Button>Default</Button>
                <Button size="sm">Small</Button>
                <Button size="icon-sm" aria-label="Add"><PlusIcon /></Button>
                <Button size="icon-xs" aria-label="Add small"><PlusIcon /></Button>
            </>,
        );
        // The text sizes take their height from padding and line height, so a 1 px edge plus these make 35 and 28 px.
        expect(screen.getByRole('button', { name: 'Default' }).className).toContain('py-1.5');
        expect(screen.getByRole('button', { name: 'Default' }).className).toContain('text-sm/normal');
        expect(screen.getByRole('button', { name: 'Small' }).className).toContain('py-1');
        expect(screen.getByRole('button', { name: 'Small' }).className).toContain('text-xs/normal');
        expect(screen.getByRole('button', { name: 'Add' }).className).toContain('size-7');
        expect(screen.getByRole('button', { name: 'Add small' }).className).toContain('size-6');
    });

    it('is not activated while disabled', async () => {
        let clicks = 0;
        const { user } = renderUi(<Button disabled onClick={() => { clicks += 1; }}>Save</Button>);
        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(clicks).toBe(0);
    });

    it('renders its child as the element with asChild', async () => {
        renderUi(<Button asChild><a href="#/logs">Logs</a></Button>);
        expect(screen.getByRole('link', { name: 'Logs' })).toHaveAttribute('data-slot', 'button');
        await expectNoAxeViolations();
    });
    it('fills its container with fluid, on a button and on a link through asChild', () => {
        renderUi(
            <>
                <Button fluid>Sign in</Button>
                <Button fluid asChild><a href="/signup">Create an account</a></Button>
                <Button>Cancel</Button>
            </>
        );
        for (const name of ['Sign in', 'Create an account']) {
            const element = screen.getByRole(name === 'Sign in' ? 'button' : 'link', { name });
            expect(element).toHaveClass('w-full');
            expect(element).toHaveAttribute('data-fluid', 'true');
        }
        const plain = screen.getByRole('button', { name: 'Cancel' });
        expect(plain).not.toHaveClass('w-full');
        expect(plain).not.toHaveAttribute('data-fluid');
    });

    it('sets the severity, raised and rounded flags as data attributes on every variant that takes them', async () => {
        renderUi(
            <>
                <Button severity="success">Approve</Button>
                <Button variant="outline" severity="info">View logs</Button>
                <Button variant="ghost" severity="warning" raised>Pause sending</Button>
                <Button variant="link" severity="help">Get help</Button>
                <Button severity="danger" rounded>Delete</Button>
                <Button severity="contrast" size="icon" rounded raised aria-label="Publish"><PlusIcon /></Button>
            </>,
        );
        expect(screen.getByRole('button', { name: 'Approve' })).toHaveAttribute('data-severity', 'success');
        expect(screen.getByRole('button', { name: 'View logs' })).toHaveAttribute('data-variant', 'outline');
        expect(screen.getByRole('button', { name: 'View logs' })).toHaveAttribute('data-severity', 'info');
        const raisedText = screen.getByRole('button', { name: 'Pause sending' });
        expect(raisedText).toHaveAttribute('data-raised', 'true');
        expect(raisedText).not.toHaveAttribute('data-rounded');
        expect(screen.getByRole('button', { name: 'Get help' })).toHaveAttribute('data-severity', 'help');
        expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('data-rounded', 'true');
        const icon = screen.getByRole('button', { name: 'Publish' });
        expect(icon).toHaveAttribute('data-severity', 'contrast');
        expect(icon.className).toContain('rounded-full');
        expect(screen.getByRole('button', { name: 'Approve' })).not.toHaveAttribute('data-raised');
        await expectNoAxeViolations();
    });

    it('shows the spinner in place of the leading icon while loading, is busy and ignores clicks', async () => {
        let clicks = 0;
        const { user, rerender } = renderUi(
            <Button loading onClick={() => { clicks += 1; }}><SaveIcon data-testid="icon" />Save changes</Button>,
        );
        const button = screen.getByRole('button', { name: /Save changes/ });
        expect(button).not.toBeDisabled();
        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(button).toHaveAttribute('aria-busy', 'true');
        expect(button).toHaveAttribute('data-loading', 'true');
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
        expect(screen.queryByTestId('icon')).toBeNull();
        await user.click(button);
        expect(clicks).toBe(0);
        await expectNoAxeViolations();
        rerender(<Button onClick={() => { clicks += 1; }}><SaveIcon data-testid="icon" />Save changes</Button>);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
        expect(screen.queryByRole('status')).toBeNull();
        expect(screen.getByRole('button', { name: 'Save changes' })).not.toHaveAttribute('aria-busy');
        expect(screen.getByRole('button', { name: 'Save changes' })).not.toHaveAttribute('aria-disabled');
    });

    it('keeps focus and its tab stop while loading, and ignores Enter and Space', async () => {
        let clicks = 0;
        const onClick = () => { clicks += 1; };
        const { user, rerender } = renderUi(<Button onClick={onClick}>Save</Button>);
        await user.tab();
        const button = screen.getByRole('button', { name: 'Save' });
        expect(button).toHaveFocus();
        // The provider stays, so the button is updated in place rather than mounted again.
        rerender(<BooleanUIProvider><Button loading onClick={onClick}>Save</Button></BooleanUIProvider>);
        expect(screen.getByRole('button', { name: /Save/ })).toHaveFocus();
        await user.keyboard('{Enter}');
        await user.keyboard(' ');
        expect(clicks).toBe(0);
        rerender(<BooleanUIProvider><Button onClick={onClick}>Save</Button></BooleanUIProvider>);
        expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(clicks).toBe(1);
    });

    it('does not submit its form twice while loading, by click or by Enter in a field', async () => {
        let submits = 0;
        const { user } = renderUi(
            <form onSubmit={(event) => { event.preventDefault(); submits += 1; }}>
                <input aria-label="Sender name" />
                <Button type="submit" loading>Save</Button>
            </form>,
        );
        await user.click(screen.getByRole('button', { name: /Save/ }));
        await user.type(screen.getByRole('textbox', { name: 'Sender name' }), 'Ops{Enter}');
        expect(submits).toBe(0);
    });

    it('lays the spinner over the label when there is no icon, keeping the label in its name and its room', () => {
        renderUi(<Button loading>Send test email</Button>, { strings: { loading: 'Wird geladen' } });
        const spinner = screen.getByRole('status', { name: 'Wird geladen' });
        expect(spinner).toHaveClass('absolute');
        const button = screen.getByRole('button', { name: /^Wird geladen\s?Send test email$/ });
        const label = button.querySelector('[data-slot=button-label]');
        expect(label).toHaveTextContent('Send test email');
        expect(label).toHaveClass('opacity-0');
    });

    it('keeps a label wrapped in an element while loading, and replaces the only icon of an icon button', () => {
        renderUi(
            <>
                <Button loading><span>Send test email</span></Button>
                <Button loading size="icon" aria-label="Refresh"><SaveIcon data-testid="only-icon" /></Button>
            </>,
        );
        expect(screen.getByRole('button', { name: /Send test email/ })).toHaveTextContent('Send test email');
        expect(screen.queryByTestId('only-icon')).toBeNull();
        expect(screen.getAllByRole('status')).toHaveLength(2);
    });

    it('marks a loading link busy and refuses to follow it: a link cannot be disabled', async () => {
        let followed = null;
        const listener = (event) => { followed = !event.defaultPrevented; event.preventDefault(); };
        document.addEventListener('click', listener);
        const { user } = renderUi(
            <Button asChild loading><a href="#/logs"><SaveIcon data-testid="icon" />Logs</a></Button>,
        );
        const link = screen.getByRole('link', { name: /Logs/ });
        expect(link).toHaveAttribute('aria-busy', 'true');
        expect(link).toHaveAttribute('aria-disabled', 'true');
        expect(link).not.toHaveAttribute('disabled');
        expect(link.querySelector('[role=status]')).not.toBeNull();
        expect(screen.queryByTestId('icon')).toBeNull();
        await user.click(link);
        document.removeEventListener('click', listener);
        expect(followed).toBe(false);
    });

    it('takes a disabled link out of the tab order and refuses to follow it: a link cannot be disabled', async () => {
        let followed = null;
        const listener = (event) => { followed = !event.defaultPrevented; event.preventDefault(); };
        document.addEventListener('click', listener);
        const { user } = renderUi(
            <>
                <Button asChild disabled><a href="#/export">Export the log</a></Button>
                <Button>After</Button>
            </>,
        );
        const link = screen.getByRole('link', { name: 'Export the log' });
        expect(link).toHaveAttribute('aria-disabled', 'true');
        expect(link).toHaveAttribute('data-disabled', 'true');
        expect(link).toHaveAttribute('tabindex', '-1');
        await user.tab();
        expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
        link.click();
        document.removeEventListener('click', listener);
        expect(followed).toBe(false);
        await expectNoAxeViolations();
    });
});
