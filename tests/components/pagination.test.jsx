import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import {
    getPaginationItems,
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationJump,
    PaginationLast,
    PaginationLink,
    PaginationNext,
    PaginationPages,
    PaginationPrevious,
    PaginationRange,
    PaginationRowsPerPage,
} from '@/components/pagination';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Pages(props) {
    return (
        <Pagination {...props}>
            <PaginationContent>
                <PaginationItem><PaginationPrevious href="#1" /></PaginationItem>
                <PaginationItem><PaginationLink href="#1">1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#2" isActive>2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                <PaginationItem><PaginationLink href="#9">9</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext href="#3" /></PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

describe('Pagination', () => {
    it('is a navigation landmark with a list of links, the current page marked', async () => {
        renderUi(<Pages />);
        const nav = screen.getByRole('navigation', { name: 'Pagination' });
        expect(within(nav).getByRole('list')).toBeInTheDocument();
        expect(within(nav).getAllByRole('link')).toHaveLength(5);
        expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', { name: '1' })).not.toHaveAttribute('aria-current');
        expect(screen.getByRole('link', { name: 'Go to previous page' })).toHaveAttribute('href', '#1');
        expect(screen.getByRole('link', { name: 'Go to next page' })).toHaveAttribute('href', '#3');
        await expectNoAxeViolations();
    });

    it('moves focus through the links with Tab and Shift+Tab, and Enter follows a link', async () => {
        function Controlled() {
            const [page, setPage] = useState(1);
            const go = (n) => (e) => {
                e.preventDefault();
                setPage(n);
            };
            return (
                <>
                    <p>Page {page}</p>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem><PaginationLink href="#1" onClick={go(1)}>1</PaginationLink></PaginationItem>
                            <PaginationItem><PaginationLink href="#2" onClick={go(2)}>2</PaginationLink></PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        await user.tab();
        expect(screen.getByRole('link', { name: '1' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('link', { name: '2' })).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(screen.getByText('Page 2')).toBeInTheDocument();
        await user.tab({ shift: true });
        expect(screen.getByRole('link', { name: '1' })).toHaveFocus();
    });

    it('reads the landmark name and the link names from the provider strings', async () => {
        renderUi(<Pages />, {
            strings: {
                pagination: 'Seitennavigation',
                previous: 'Zurück',
                next: 'Weiter',
                previousPage: 'Zur vorherigen Seite',
                nextPage: 'Zur nächsten Seite',
                morePages: 'Weitere Seiten',
            },
        });
        expect(screen.getByRole('navigation', { name: 'Seitennavigation' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Zur vorherigen Seite' })).toHaveTextContent('Zurück');
        expect(screen.getByRole('link', { name: 'Zur nächsten Seite' })).toHaveTextContent('Weiter');
        expect(screen.getByText('Weitere Seiten')).toHaveClass('sr-only');
        expect(screen.queryByText('Go to next page')).toBeNull();
        await expectNoAxeViolations();
    });

    it('lets an aria-label on the landmark replace the provider name', () => {
        renderUi(<Pages aria-label="Email log pages" />);
        expect(screen.getByRole('navigation', { name: 'Email log pages' })).toBeInTheDocument();
    });

    it('hides the ellipsis from assistive technology, and mirrors the chevrons in a right-to-left page', () => {
        renderUi(<Pages />, { dir: 'rtl' });
        const ellipsis = document.querySelector('[data-slot="pagination-ellipsis"]');
        expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
        for (const chevron of document.querySelectorAll('[data-slot="pagination-link"] svg')) {
            expect(chevron.getAttribute('class')).toContain('rtl:rotate-180');
        }
    });
    it('computes the pages around the current one, with gaps, keeping one length', () => {
        expect(getPaginationItems({ page: 6, pageCount: 20, siblings: 2 })).toEqual([1, 'ellipsis-start', 4, 5, 6, 7, 8, 'ellipsis-end', 20]);
        expect(getPaginationItems({ page: 1, pageCount: 20 })).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
        expect(getPaginationItems({ page: 20, pageCount: 20 })).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
        expect(getPaginationItems({ page: 3, pageCount: 5 })).toEqual([1, 2, 3, 4, 5]);
        expect(getPaginationItems({ page: 1, pageCount: 1 })).toEqual([1]);
        expect(getPaginationItems({ page: 1, pageCount: 0 })).toEqual([]);
    });

    it('draws the pages from page and pageCount, siblings either side, and changes page on a click', async () => {
        const onPageChange = vi.fn();
        const { user } = renderUi(
            <Pagination>
                <PaginationPages page={6} pageCount={20} siblings={2} onPageChange={onPageChange} />
            </Pagination>,
        );
        const links = screen.getAllByRole('link').map((link) => link.textContent);
        expect(links).toEqual(['Previous', '1', '4', '5', '6', '7', '8', '20', 'Next']);
        expect(screen.getByRole('link', { name: '6' })).toHaveAttribute('aria-current', 'page');
        await user.click(screen.getByRole('link', { name: '8' }));
        expect(onPageChange).toHaveBeenLastCalledWith(8);
        await user.click(screen.getByRole('link', { name: 'Go to next page' }));
        expect(onPageChange).toHaveBeenLastCalledWith(7);
        await expectNoAxeViolations();
    });

    it('dims Previous on the first page and Next on the last, out of the tab order', async () => {
        const onPageChange = vi.fn();
        const { user, rerender } = renderUi(<Pagination><PaginationPages page={1} pageCount={3} onPageChange={onPageChange} /></Pagination>);
        const previous = screen.getByRole('link', { name: 'Go to previous page' });
        expect(previous).toHaveAttribute('aria-disabled', 'true');
        expect(previous).toHaveAttribute('tabindex', '-1');
        await user.tab();
        expect(screen.getByRole('link', { name: '1' })).toHaveFocus();
        rerender(<Pagination><PaginationPages page={3} pageCount={3} onPageChange={onPageChange} getHref={(n) => `?page=${n}`} /></Pagination>);
        expect(screen.getByRole('link', { name: 'Go to next page' })).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('href', '?page=2');
        expect(onPageChange).not.toHaveBeenCalled();
    });

    it('adds First and Last with showEdges, named from the provider, going to the first and last page', async () => {
        const onPageChange = vi.fn();
        const { user } = renderUi(
            <Pagination>
                <PaginationPages page={6} pageCount={20} onPageChange={onPageChange} showEdges />
            </Pagination>,
        );
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAccessibleName('Go to first page');
        expect(links.at(-1)).toHaveAccessibleName('Go to last page');
        await user.click(screen.getByRole('link', { name: 'Go to last page' }));
        expect(onPageChange).toHaveBeenLastCalledWith(20);
        await user.click(screen.getByRole('link', { name: 'Go to first page' }));
        expect(onPageChange).toHaveBeenLastCalledWith(1);
        await expectNoAxeViolations();
    });

    it('dims First on the first page and Last on the last, out of the tab order', async () => {
        const { user, rerender } = renderUi(<Pagination><PaginationPages page={1} pageCount={3} showEdges onPageChange={() => {}} /></Pagination>);
        expect(screen.getByRole('link', { name: 'Go to first page' })).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByRole('link', { name: 'Go to last page' })).not.toHaveAttribute('aria-disabled');
        await user.tab();
        expect(screen.getByRole('link', { name: '1' })).toHaveFocus();
        rerender(<Pagination><PaginationPages page={3} pageCount={3} showEdges getHref={(n) => `?page=${n}`} /></Pagination>);
        const last = screen.getByRole('link', { name: 'Go to last page' });
        expect(last).toHaveAttribute('aria-disabled', 'true');
        expect(last).toHaveAttribute('tabindex', '-1');
        expect(screen.getByRole('link', { name: 'Go to first page' })).toHaveAttribute('href', '?page=1');
    });

    it('draws PaginationFirst and PaginationLast as named links, from the provider strings', () => {
        renderUi(
            <Pagination>
                <PaginationContent>
                    <PaginationItem><PaginationFirst href="?page=1" /></PaginationItem>
                    <PaginationItem><PaginationLast href="?page=9" /></PaginationItem>
                </PaginationContent>
            </Pagination>,
            { strings: { firstPage: 'Zur ersten Seite', lastPage: 'Zur letzten Seite' } },
        );
        expect(screen.getByRole('link', { name: 'Zur ersten Seite' })).toHaveAttribute('href', '?page=1');
        expect(screen.getByRole('link', { name: 'Zur letzten Seite' })).toHaveAttribute('data-slot', 'pagination-last');
    });

    it('writes the range of rows from the provider string, numbers in the provider locale', async () => {
        const { unmount } = renderUi(<PaginationRange page={3} pageSize={10} total={120} />);
        expect(screen.getByRole('status')).toHaveTextContent('21–30 of 120');
        await expectNoAxeViolations();
        unmount();
        renderUi(<PaginationRange page={2} pageSize={1000} total={1284} />, {
            strings: { pageRange: 'Zeilen {start} bis {end} von {total}' },
            locale: 'de-DE',
        });
        expect(screen.getByRole('status')).toHaveTextContent('Zeilen 1.001 bis 1.284 von 1.284');
    });

    it('writes an empty range as 0–0', () => {
        renderUi(<PaginationRange page={1} pageSize={10} total={0} />);
        expect(screen.getByRole('status')).toHaveTextContent('0–0 of 0');
    });

    it('changes the rows per page from its labelled select, with Enter and the arrow keys', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<PaginationRowsPerPage value={10} onValueChange={onValueChange} />, {
            strings: { rowsPerPage: 'Lignes par page' },
        });
        const select = screen.getByRole('combobox', { name: 'Lignes par page' });
        expect(select).toHaveTextContent('10');
        expect(select).toHaveAttribute('data-size', 'sm');
        await expectNoAxeViolations();
        select.focus();
        await user.keyboard('{Enter}');
        expect(await screen.findByRole('listbox')).toBeInTheDocument();
        expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['10', '20', '50']);
        await user.keyboard('{ArrowDown}{Enter}');
        await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(20));
    });

    it('goes to the page typed when Enter is pressed, kept within the pages', async () => {
        const onPageChange = vi.fn();
        const { user } = renderUi(<PaginationJump page={2} pageCount={20} onPageChange={onPageChange} />);
        const field = screen.getByRole('spinbutton', { name: 'Go to page' });
        expect(field).toHaveValue(2);
        await user.clear(field);
        await user.type(field, '7');
        expect(onPageChange).not.toHaveBeenCalled();
        await user.keyboard('{Enter}');
        expect(onPageChange).toHaveBeenLastCalledWith(7);
        await user.clear(field);
        await user.type(field, '99{Enter}');
        expect(onPageChange).toHaveBeenLastCalledWith(20);
        expect(field).toHaveValue(20);
        await expectNoAxeViolations();
    });

    it('puts the current page back in the jump field when it is left without Enter, and follows the page', async () => {
        const onPageChange = vi.fn();
        function Pages() {
            const [page, setPage] = useState(2);
            return (
                <>
                    <PaginationJump page={page} pageCount={20} onPageChange={onPageChange} />
                    <button type="button" onClick={() => setPage(5)}>Page 5</button>
                </>
            );
        }
        const { user } = renderUi(<Pages />);
        const field = screen.getByRole('spinbutton', { name: 'Go to page' });
        await user.clear(field);
        await user.type(field, '9');
        await user.tab();
        expect(field).toHaveValue(2);
        expect(onPageChange).not.toHaveBeenCalled();
        await user.click(screen.getByRole('button', { name: 'Page 5' }));
        expect(field).toHaveValue(5);
    });

    it('draws one page, or none, with every way to move dimmed, when pageCount is 1 or 0', () => {
        const { unmount } = renderUi(
            <Pagination>
                <PaginationPages page={1} pageCount={1} onPageChange={() => {}} showEdges />
            </Pagination>
        );
        expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('aria-current', 'page');
        for (const name of ['Go to first page', 'Go to previous page', 'Go to next page', 'Go to last page']) {
            expect(screen.getByRole('link', { name })).toHaveAttribute('aria-disabled', 'true');
        }
        unmount();
        renderUi(
            <Pagination>
                <PaginationPages page={1} pageCount={0} onPageChange={() => {}} />
            </Pagination>
        );
        expect(screen.queryByRole('link', { name: '1' })).toBeNull();
        expect(screen.getByRole('link', { name: 'Go to next page' })).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByRole('link', { name: 'Go to previous page' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('shows a page size that is not among the options, as a choice in its place', async () => {
        const { user } = renderUi(<PaginationRowsPerPage value={25} onValueChange={() => {}} />);
        const select = screen.getByRole('combobox', { name: 'Rows per page' });
        expect(select).toHaveTextContent('25');
        await user.click(select);
        expect((await screen.findAllByRole('option')).map((option) => option.textContent)).toEqual(['10', '20', '25', '50']);
    });

    it('names the jump field from the provider', () => {
        renderUi(<PaginationJump page={1} pageCount={4} onPageChange={() => {}} />, { strings: { goToPage: 'Aller à la page' } });
        expect(screen.getByRole('spinbutton', { name: 'Aller à la page' })).toHaveAttribute('max', '4');
    });
});
