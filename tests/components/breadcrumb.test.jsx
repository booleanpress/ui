import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/breadcrumb';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Trail({ ellipsis = false }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/mailers">Mailers</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                {ellipsis && (
                    <>
                        <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </>
                )}
                <BreadcrumbItem><BreadcrumbLink href="/mailers/1">Primary mailer</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Connection</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}

describe('Breadcrumb', () => {
    it('is a navigation landmark named from the provider, holding an ordered list', async () => {
        renderUi(<Trail />);
        const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
        expect(nav.querySelector('ol')).not.toBeNull();
        expect(screen.getAllByRole('listitem')).toHaveLength(3);
        await expectNoAxeViolations();
    });

    it('takes the landmark name and the ellipsis label from the provider strings', async () => {
        renderUi(<Trail ellipsis />, { strings: { breadcrumb: 'Fil d’Ariane', more: 'Plus' } });
        expect(screen.getByRole('navigation', { name: 'Fil d’Ariane' })).toBeInTheDocument();
        expect(screen.getByText('Plus')).toHaveClass('sr-only');
        await expectNoAxeViolations();
    });

    it('marks the current page and hides the separators', () => {
        renderUi(<Trail />);
        const page = screen.getByText('Connection');
        expect(page).toHaveAttribute('aria-current', 'page');
        expect(page).toHaveAttribute('aria-disabled', 'true');
        const separators = document.querySelectorAll('[data-slot=breadcrumb-separator]');
        expect(separators).toHaveLength(2);
        separators.forEach((separator) => expect(separator).toHaveAttribute('aria-hidden', 'true'));
    });

    it('moves between the links with Tab and skips the current page', async () => {
        const { user } = renderUi(<Trail ellipsis />);
        await user.tab();
        expect(screen.getByRole('link', { name: 'Mailers' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('link', { name: 'Primary mailer' })).toHaveFocus();
        await user.tab();
        expect(document.body).toHaveFocus();
    });

    it('mirrors the separator chevron in right-to-left pages', () => {
        renderUi(<Trail />, { dir: 'rtl' });
        const chevron = document.querySelector('[data-slot=breadcrumb-separator] svg');
        expect(chevron.getAttribute('class')).toContain('rtl:rotate-180');
    });

    it('lets a link render the router’s element with asChild', () => {
        renderUi(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild><a href="/routed">Routed</a></BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>,
        );
        const link = screen.getByRole('link', { name: 'Routed' });
        expect(link).toHaveAttribute('data-slot', 'breadcrumb-link');
        expect(link).toHaveAttribute('href', '/routed');
    });
});
