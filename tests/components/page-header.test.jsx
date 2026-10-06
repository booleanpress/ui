import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import {
    PageHeader, PageHeaderAction, PageHeaderActions, PageHeaderBreadcrumb, PageHeaderDescription, PageHeaderHeading,
    PageHeaderMeta, PageHeaderTitle,
} from '@/components/page-header';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/breadcrumb';
import { Badge } from '@/components/badge';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Header({ collapse, onExport = () => {}, onDelete = () => {}, onAdd = () => {} }) {
    return (
        <PageHeader data-testid="header">
            <PageHeaderBreadcrumb>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink href="#">Settings</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbPage>Mailers</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </PageHeaderBreadcrumb>
            <PageHeaderHeading>
                <PageHeaderTitle>Mailers</PageHeaderTitle>
                <PageHeaderMeta><Badge variant="success">3 active</Badge></PageHeaderMeta>
            </PageHeaderHeading>
            <PageHeaderDescription>The connections your sites send email through.</PageHeaderDescription>
            <PageHeaderActions collapse={collapse}>
                <PageHeaderAction onSelect={onExport}>Export</PageHeaderAction>
                <PageHeaderAction variant="destructive" onSelect={onDelete}>Delete all</PageHeaderAction>
                <PageHeaderAction pinned onSelect={onAdd}>Add mailer</PageHeaderAction>
            </PageHeaderActions>
        </PageHeader>
    );
}

describe('PageHeader', () => {
    it('renders the title as the page heading, with breadcrumb, meta and description', async () => {
        renderUi(<Header />);
        expect(screen.getByRole('heading', { level: 1, name: 'Mailers' })).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
        expect(screen.getByText('3 active')).toBeInTheDocument();
        expect(screen.getByText('The connections your sites send email through.')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('takes another heading level with as', () => {
        renderUi(
            <PageHeader>
                <PageHeaderHeading><PageHeaderTitle as="h2">Webhooks</PageHeaderTitle></PageHeaderHeading>
            </PageHeader>,
        );
        expect(screen.getByRole('heading', { level: 2, name: 'Webhooks' })).toBeInTheDocument();
    });

    it('runs an action with Enter and with Space', async () => {
        const onExport = vi.fn();
        const onAdd = vi.fn();
        const { user } = renderUi(<Header onExport={onExport} onAdd={onAdd} />);
        screen.getByRole('button', { name: 'Export' }).focus();
        await user.keyboard('{Enter}');
        screen.getByRole('button', { name: 'Add mailer' }).focus();
        await user.keyboard(' ');
        expect(onExport).toHaveBeenCalledTimes(1);
        expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it('folds the unpinned actions into a “More actions” menu that the arrows move through', async () => {
        const onDelete = vi.fn();
        const { user } = renderUi(<Header onDelete={onDelete} />);
        const more = screen.getByRole('button', { name: 'More actions' });
        more.focus();
        await user.keyboard('{Enter}');
        const menu = await screen.findByRole('menu');
        const items = within(menu).getAllByRole('menuitem');
        expect(items.map((item) => item.textContent)).toEqual(['Export', 'Delete all']);
        expect(items[1]).toHaveAttribute('data-variant', 'destructive');
        await waitFor(() => expect(items[0]).toHaveFocus());
        await user.keyboard('{ArrowDown}');
        expect(items[1]).toHaveFocus();
        await user.keyboard('{ArrowUp}');
        expect(items[0]).toHaveFocus();
        await expectNoAxeViolations();
        await user.keyboard('{ArrowDown}{Enter}');
        expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('closes the menu with Escape and returns focus to its button', async () => {
        const { user } = renderUi(<Header />);
        const more = screen.getByRole('button', { name: 'More actions' });
        await user.click(more);
        await screen.findByRole('menu');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        expect(more).toHaveFocus();
    });

    it('keeps a pinned action out of the menu, and decides once with collapse', () => {
        const { unmount } = renderUi(<Header collapse="never" />);
        expect(screen.queryByRole('button', { name: 'More actions' })).toBeNull();
        expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
        unmount();
        renderUi(<Header collapse="always" />);
        expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Export' })).toBeNull();
        expect(screen.getByRole('button', { name: 'Add mailer' })).toHaveAttribute('data-variant', 'default');
    });

    it('names the menu button from the provider', () => {
        renderUi(<Header />, { strings: { moreActions: 'Weitere Aktionen' } });
        expect(screen.getByRole('button', { name: 'Weitere Aktionen' })).toBeInTheDocument();
    });

    it('keeps elements that are not actions visible at every width, and folds only the actions', () => {
        function Mixed({ collapse }) {
            return (
                <PageHeader>
                    <PageHeaderHeading><PageHeaderTitle>Mailers</PageHeaderTitle></PageHeaderHeading>
                    <PageHeaderActions collapse={collapse}>
                        <PageHeaderAction>Export</PageHeaderAction>
                        <a href="#help">Help</a>
                        <PageHeaderAction pinned>Add mailer</PageHeaderAction>
                    </PageHeaderActions>
                </PageHeader>
            );
        }
        const { unmount } = renderUi(<Mixed />);
        const help = screen.getByRole('link', { name: 'Help' });
        // Nothing around the link hides it below 36rem; the action beside it hides alone.
        for (let node = help; node && node.dataset?.slot !== 'page-header'; node = node.parentElement) {
            expect(node.className ?? '').not.toContain('@max-xl/page-header:hidden');
        }
        expect(screen.getByRole('button', { name: 'Export' }).className).toContain('@max-xl/page-header:hidden');
        unmount();
        renderUi(<Mixed collapse="always" />);
        expect(screen.getByRole('link', { name: 'Help' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Export' })).toBeNull();
    });

    it('names an icon-only action in the menu by its aria-label', async () => {
        const { user } = renderUi(
            <PageHeader>
                <PageHeaderHeading><PageHeaderTitle>Mailers</PageHeaderTitle></PageHeaderHeading>
                <PageHeaderActions collapse="always">
                    <PageHeaderAction aria-label="Duplicate" icon={<svg aria-hidden="true" />} />
                </PageHeaderActions>
            </PageHeader>,
        );
        await user.click(screen.getByRole('button', { name: 'More actions' }));
        expect(await screen.findByRole('menuitem', { name: 'Duplicate' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('caps the actions at 60% of the header and lets them span the description’s row, so many actions wrap', () => {
        renderUi(<Header />);
        const header = screen.getByTestId('header');
        const actions = header.querySelector('[data-slot=page-header-actions]');
        // jsdom has no layout: the classes that make many actions wrap beside the title, not over it, are in place.
        expect(actions.className).toContain('max-w-[60cqi]');
        expect(actions.className).toContain('group-has-data-[slot=page-header-description]/page-header:row-end-[span_2]');
        expect(header.className).toContain('has-data-[slot=page-header-description]:grid-rows-[auto_1fr]');
    });
});
