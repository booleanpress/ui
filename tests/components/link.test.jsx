import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Link } from '@/components/link';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Link', () => {
    it('renders an anchor with its address, variant and size', async () => {
        renderUi(
            <Link href="#log" variant="muted" size="sm">
                Delivery log
            </Link>,
        );
        const link = screen.getByRole('link', { name: 'Delivery log' });
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', '#log');
        expect(link).toHaveAttribute('data-variant', 'muted');
        expect(link).toHaveAttribute('data-size', 'sm');
        expect(link).not.toHaveAttribute('target');
        await expectNoAxeViolations();
    });

    it('adds the visited colour only with visited', () => {
        renderUi(
            <>
                <Link href="#a" visited>
                    Report
                </Link>
                <Link href="#b">Plain</Link>
            </>,
        );
        expect(screen.getByRole('link', { name: 'Report' }).className).toContain('visited:text-help-active');
        expect(screen.getByRole('link', { name: 'Plain' }).className).not.toContain('visited:');
    });

    it('takes the size of the text around it when given none', () => {
        renderUi(<Link href="#log">Log</Link>);
        expect(screen.getByRole('link')).not.toHaveAttribute('data-size');
    });

    it('follows the link on Enter', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const { user } = renderUi(
            <Link href="#log" onClick={onClick}>
                Log
            </Link>,
        );
        await user.tab();
        expect(screen.getByRole('link')).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('opens an external link in a new tab, safely, and says so to screen readers', async () => {
        renderUi(
            <Link href="https://example.com/docs" external rel="external">
                SMTP guide
            </Link>,
        );
        const link = screen.getByRole('link', { name: /^SMTP guide\s?\(opens in a new tab\)$/ });
        expect(link).toHaveAttribute('target', '_blank');
        expect(link.getAttribute('rel').split(' ').sort()).toEqual(['external', 'noopener', 'noreferrer']);
        expect(link.querySelector('[data-slot=link-external-icon]')).toHaveAttribute('aria-hidden', 'true');
        const notice = link.querySelector('[data-slot=link-external-label]');
        expect(notice).toHaveClass('sr-only');
        // The leading space keeps the words apart in a browser's name (jsdom's name computation trims it).
        expect(notice.textContent).toBe(' (opens in a new tab)');
        await expectNoAxeViolations();
    });

    it('translates the new-tab notice', () => {
        renderUi(
            <Link href="https://example.com" external>
                Guide
            </Link>,
            { strings: { opensInNewTab: '(öffnet in einem neuen Tab)' } },
        );
        expect(screen.getByRole('link', { name: /^Guide\s?\(öffnet in einem neuen Tab\)$/ })).toBeInTheDocument();
    });

    it('turns off when disabled: no address, aria-disabled, out of the tab order, clicks ignored', async () => {
        const onClick = vi.fn();
        const { user } = renderUi(
            <>
                <Link href="#export" disabled onClick={onClick}>
                    Export
                </Link>
                <button type="button">Next control</button>
            </>,
        );
        const link = screen.getByRole('link', { name: 'Export' });
        expect(link).not.toHaveAttribute('href');
        expect(link).toHaveAttribute('aria-disabled', 'true');
        await user.tab();
        expect(screen.getByRole('button', { name: 'Next control' })).toHaveFocus();
        link.click();
        expect(onClick).not.toHaveBeenCalled();
        await expectNoAxeViolations();
    });

    it('puts its look and behaviour on a router link with asChild, keeping the child’s address', async () => {
        renderUi(
            <Link asChild external>
                <a href="/mailers" data-router="yes">
                    Mailers
                </a>
            </Link>,
        );
        const link = screen.getByRole('link', { name: /^Mailers\s?\(opens in a new tab\)$/ });
        expect(link).toHaveAttribute('href', '/mailers');
        expect(link).toHaveAttribute('data-router', 'yes');
        expect(link).toHaveAttribute('data-slot', 'link');
        expect(link).toHaveAttribute('target', '_blank');
        await expectNoAxeViolations();
    });

    it('keeps noopener and noreferrer beside the rel of a child passed with asChild', () => {
        renderUi(
            <Link asChild external rel="external">
                <a href="https://example.com/status" rel="nofollow">
                    Status page
                </a>
            </Link>,
        );
        const link = screen.getByRole('link', { name: /Status page/ });
        expect(link.getAttribute('rel').split(' ').sort()).toEqual(['external', 'nofollow', 'noopener', 'noreferrer']);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link.querySelector('[data-slot=link-external-icon]')).not.toBeNull();
    });

    it('takes a disabled router link out of the tab order', () => {
        renderUi(
            <Link asChild disabled>
                <a href="/mailers">Mailers</a>
            </Link>,
        );
        const link = screen.getByRole('link', { name: 'Mailers' });
        expect(link).toHaveAttribute('tabindex', '-1');
        expect(link).toHaveAttribute('aria-disabled', 'true');
    });
});
