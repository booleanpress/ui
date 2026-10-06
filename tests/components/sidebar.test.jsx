import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { MailIcon } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarInset,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from '@/components/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const KEY = 'booleanpress-ui:sidebar';

function State() {
    const { state, open } = useSidebar();
    return (
        <>
            <span data-testid="state">{state}</span>
            <span data-testid="open">{String(open)}</span>
            <SidebarTrigger />
        </>
    );
}

function Layout({ providerProps, tooltip = 'Email log' }) {
    return (
        <SidebarProvider {...providerProps}>
            <Sidebar collapsible="icon">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Delivery</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton isActive tooltip={tooltip}><MailIcon /><span>Email log</span></SidebarMenuButton>
                                <SidebarMenuBadge>12</SidebarMenuBadge>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <header><SidebarTrigger /></header>
                <State />
            </SidebarInset>
        </SidebarProvider>
    );
}

const state = () => screen.getByTestId('state').textContent;

describe('SidebarProvider', () => {
    beforeEach(() => {
        window.localStorage.clear();
        document.cookie = 'sidebar_state=; Max-Age=0; path=/';
    });

    it('starts expanded when no preference exists', () => {
        renderUi(<SidebarProvider><State /></SidebarProvider>);
        expect(state()).toBe('expanded');
    });

    it('starts collapsed with defaultOpen={false}', () => {
        renderUi(<SidebarProvider defaultOpen={false}><State /></SidebarProvider>);
        expect(state()).toBe('collapsed');
    });

    it('toggles with the trigger, keeps the choice in local storage and restores it on the next visit', () => {
        const { unmount } = renderUi(<SidebarProvider><State /></SidebarProvider>);
        fireEvent.click(screen.getAllByRole('button', { name: 'Toggle Sidebar' })[0]);
        expect(state()).toBe('collapsed');
        expect(window.localStorage.getItem(KEY)).toBe('false');
        unmount();
        renderUi(<SidebarProvider><State /></SidebarProvider>);
        expect(state()).toBe('collapsed');
    });

    it('lets a saved choice win over defaultOpen', () => {
        window.localStorage.setItem(KEY, 'true');
        renderUi(<SidebarProvider defaultOpen={false}><State /></SidebarProvider>);
        expect(state()).toBe('expanded');
    });

    it('sets no sidebar_state cookie', () => {
        renderUi(<SidebarProvider><State /></SidebarProvider>);
        fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));
        expect(document.cookie).not.toContain('sidebar_state');
    });

    it('keeps the state under the key the provider gives it', () => {
        renderUi(<SidebarProvider><State /></SidebarProvider>, { sidebarStorageKey: 'acme:sidebar' });
        fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));
        expect(window.localStorage.getItem('acme:sidebar')).toBe('false');
        expect(window.localStorage.getItem(KEY)).toBeNull();
    });

    it('toggles with Ctrl+B and with ⌘B', async () => {
        const { user } = renderUi(<SidebarProvider><State /></SidebarProvider>);
        await user.keyboard('{Control>}b{/Control}');
        expect(state()).toBe('collapsed');
        await user.keyboard('{Meta>}b{/Meta}');
        expect(state()).toBe('expanded');
        await user.keyboard('b');
        expect(state()).toBe('expanded');
    });

    it('can be controlled with open and onOpenChange', () => {
        const onOpenChange = vi.fn();
        renderUi(<SidebarProvider open onOpenChange={onOpenChange}><State /></SidebarProvider>);
        fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(state()).toBe('expanded');
    });

    it('keeps working when local storage is blocked', () => {
        const blocked = () => {
            throw new Error('blocked');
        };
        const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked);
        const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked);
        try {
            renderUi(<SidebarProvider><State /></SidebarProvider>, { sidebarStorageKey: 'blocked-key' });
            fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));
            expect(state()).toBe('collapsed');
        } finally {
            getSpy.mockRestore();
            setSpy.mockRestore();
        }
    });

    it('throws a clear error when useSidebar is used outside the provider', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderUi(<State />)).toThrow('useSidebar must be used within a SidebarProvider.');
        error.mockRestore();
    });

    it('takes the trigger and rail names from the provider strings', () => {
        renderUi(<Layout />, { strings: { toggleSidebar: 'Basculer le menu' } });
        expect(screen.getAllByRole('button', { name: 'Basculer le menu' })).toHaveLength(3);
        expect(screen.getByTitle('Basculer le menu')).toHaveAttribute('aria-label', 'Basculer le menu');
    });
});

describe('Sidebar', () => {
    beforeEach(() => window.localStorage.clear());

    it('renders the groups, the active item and the badge, and passes axe', async () => {
        renderUi(<Layout />);
        expect(screen.getByText('Delivery')).toBeInTheDocument();
        const button = screen.getByRole('button', { name: 'Email log' });
        expect(button).toHaveAttribute('data-active', 'true');
        expect(screen.getByText('12')).toHaveAttribute('data-slot', 'sidebar-menu-badge');
        await expectNoAxeViolations();
    });

    it('marks the collapsed state for icon mode', () => {
        renderUi(<Layout providerProps={{ defaultOpen: false }} />);
        const root = document.querySelector('[data-slot=sidebar][data-state]');
        expect(root).toHaveAttribute('data-state', 'collapsed');
        expect(root).toHaveAttribute('data-collapsible', 'icon');
    });

    it('moves focus through the trigger and the menu buttons with Tab, skipping the rail', async () => {
        const { user } = renderUi(<Layout />);
        await user.tab();
        expect(screen.getByRole('button', { name: 'Email log' })).toHaveFocus();
        await user.tab();
        const toggle = screen.getAllByRole('button', { name: 'Toggle Sidebar' }).find((el) => el.dataset.slot === 'sidebar-trigger');
        expect(toggle).toHaveFocus();
        expect(screen.getByTitle('Toggle Sidebar')).toHaveAttribute('tabindex', '-1');
    });

    it('presses the trigger with Enter and Space', async () => {
        const { user } = renderUi(<Layout />);
        const trigger = document.querySelector('[data-slot=sidebar-trigger]');
        trigger.focus();
        await user.keyboard('{Enter}');
        expect(state()).toBe('collapsed');
        await user.keyboard(' ');
        expect(state()).toBe('expanded');
    });
});

describe('Sidebar on a narrow window', () => {
    const original = window.innerWidth;
    beforeEach(() => {
        window.localStorage.clear();
        window.innerWidth = 500;
    });
    afterEach(() => {
        window.innerWidth = original;
    });

    it('becomes a sheet named and described by the provider, opened by the trigger', async () => {
        const { user } = renderUi(<Layout />, {
            strings: { sidebarTitle: 'Navigation', sidebarDescription: 'Pages of the admin.' },
        });
        expect(screen.queryByRole('dialog')).toBeNull();
        await user.click(document.querySelector('[data-slot=sidebar-trigger]'));
        const dialog = await screen.findByRole('dialog', { name: 'Navigation' });
        expect(dialog).toHaveAccessibleDescription('Pages of the admin.');
        expect(dialog).toHaveAttribute('data-mobile', 'true');
        expect(screen.getByRole('button', { name: 'Email log' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('closes the sheet on Escape and returns focus to the trigger', async () => {
        // The menu buttons have tooltips: on a narrow window they stay closed, so the first Escape closes the sheet.
        const { user } = renderUi(<Layout />);
        const trigger = document.querySelector('[data-slot=sidebar-trigger]');
        await user.click(trigger);
        await screen.findByRole('dialog');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('toggles the sheet with Ctrl+B and leaves the saved desktop state alone', async () => {
        const { user } = renderUi(<Layout />);
        await user.keyboard('{Control>}b{/Control}');
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
        expect(window.localStorage.getItem(KEY)).toBeNull();
    });
});

describe('Sidebar variations', () => {
    beforeEach(() => window.localStorage.clear());

    it('reaches the floating and inset variants through data-variant', async () => {
        for (const variant of ['floating', 'inset']) {
            const { unmount } = renderUi(
                <SidebarProvider>
                    <Sidebar variant={variant} collapsible="icon"><SidebarContent /></Sidebar>
                    <SidebarInset><p>Page</p></SidebarInset>
                </SidebarProvider>,
            );
            expect(document.querySelector('[data-slot=sidebar][data-state]')).toHaveAttribute('data-variant', variant);
            await expectNoAxeViolations();
            unmount();
        }
    });

    it('keeps a second, fixed sidebar while Ctrl+B collapses the first', async () => {
        const { user } = renderUi(
            <SidebarProvider>
                <Sidebar collapsible="icon"><SidebarContent /></Sidebar>
                <SidebarInset><State /></SidebarInset>
                <Sidebar collapsible="none"><aside aria-label="Customer">Dana Whitfield</aside></Sidebar>
            </SidebarProvider>,
        );
        await user.keyboard('{Control>}b{/Control}');
        expect(state()).toBe('collapsed');
        expect(screen.getByRole('complementary', { name: 'Customer' })).toBeInTheDocument();
        expect(document.querySelectorAll('[data-slot=sidebar]')).toHaveLength(2);
    });

    it('opens and closes each level of a nested menu with Enter and Space', async () => {
        const { user } = renderUi(
            <SidebarProvider>
                <Sidebar collapsible="none">
                    <SidebarMenu>
                        <Collapsible asChild>
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild><SidebarMenuButton>Settings</SidebarMenuButton></CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <Collapsible asChild>
                                            <SidebarMenuSubItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuSubButton asChild><button type="button">Routing</button></SidebarMenuSubButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        <SidebarMenuSubItem><SidebarMenuSubButton href="#rules">Rules</SidebarMenuSubButton></SidebarMenuSubItem>
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuSubItem>
                                        </Collapsible>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </Sidebar>
            </SidebarProvider>,
        );
        const settings = screen.getByRole('button', { name: 'Settings' });
        expect(settings).toHaveAttribute('aria-expanded', 'false');
        settings.focus();
        await user.keyboard('{Enter}');
        expect(settings).toHaveAttribute('aria-expanded', 'true');
        const routing = screen.getByRole('button', { name: 'Routing' });
        await user.tab();
        expect(routing).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(routing).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('link', { name: 'Rules' })).toBeInTheDocument();
        await expectNoAxeViolations();
        await user.keyboard('{Enter}');
        expect(routing).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('link', { name: 'Rules' })).toBeNull();
        await user.keyboard(' ');
        expect(routing).toHaveAttribute('aria-expanded', 'true');
    });
});
