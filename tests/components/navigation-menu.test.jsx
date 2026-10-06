import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuSub,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/navigation-menu';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function SiteNav({ viewport }) {
    return (
        <NavigationMenu aria-label="Main" viewport={viewport}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Sending</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul>
                            <li><NavigationMenuLink href="#connections">Connections</NavigationMenuLink></li>
                            <li><NavigationMenuLink href="#rules">Routing rules</NavigationMenuLink></li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Logs</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul>
                            <li><NavigationMenuLink href="#delivery" active>Delivery log</NavigationMenuLink></li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#help" className={navigationMenuTriggerStyle()}>Help</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const trigger = (name) => screen.getByRole('button', { name });

describe('NavigationMenu', () => {
    it('renders a navigation of disclosure buttons and links', async () => {
        const { user } = renderUi(<SiteNav />);
        expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
        const sending = trigger('Sending');
        expect(sending).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('href', '#help');
        await user.click(sending);
        expect(sending).toHaveAttribute('aria-expanded', 'true');
        expect(await screen.findByRole('link', { name: 'Connections' })).toBeInTheDocument();
        expect(screen.queryByRole('menu')).toBeNull();
        await expectNoAxeViolations();
    });

    it('opens and closes a panel with Enter', async () => {
        const { user } = renderUi(<SiteNav />);
        trigger('Sending').focus();
        await user.keyboard('{Enter}');
        expect(trigger('Sending')).toHaveAttribute('aria-expanded', 'true');
        await user.keyboard('{Enter}');
        await waitFor(() => expect(trigger('Sending')).toHaveAttribute('aria-expanded', 'false'));
    });

    it('opens a panel with Space', async () => {
        const { user } = renderUi(<SiteNav />);
        trigger('Logs').focus();
        await user.keyboard(' ');
        expect(trigger('Logs')).toHaveAttribute('aria-expanded', 'true');
    });

    it('moves into an open panel with ArrowDown', async () => {
        const { user } = renderUi(<SiteNav />);
        trigger('Sending').focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('link', { name: 'Connections' });
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(screen.getByRole('link', { name: 'Connections' })).toHaveFocus());
    });

    it('moves with Tab from an open trigger into its panel', async () => {
        const { user } = renderUi(<SiteNav />);
        trigger('Sending').focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('link', { name: 'Connections' });
        await user.tab();
        await waitFor(() => expect(screen.getByRole('link', { name: 'Connections' })).toHaveFocus());
    });

    it('moves along the row with ArrowRight and ArrowLeft', async () => {
        const { user } = renderUi(<SiteNav />);
        trigger('Sending').focus();
        await user.keyboard('{ArrowRight}');
        expect(trigger('Logs')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('link', { name: 'Help' })).toHaveFocus();
        await user.keyboard('{ArrowLeft}');
        expect(trigger('Logs')).toHaveFocus();
    });

    it('moves to the first and last item of the row with Home and End', async () => {
        const { user } = renderUi(<SiteNav />);
        trigger('Logs').focus();
        await user.keyboard('{End}');
        expect(screen.getByRole('link', { name: 'Help' })).toHaveFocus();
        await user.keyboard('{Home}');
        expect(trigger('Sending')).toHaveFocus();
    });

    it('mirrors the row keys in right-to-left pages', async () => {
        const { user } = renderUi(<SiteNav />, { dir: 'rtl' });
        trigger('Sending').focus();
        await user.keyboard('{ArrowLeft}');
        expect(trigger('Logs')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(trigger('Sending')).toHaveFocus();
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        const { user } = renderUi(<SiteNav />);
        trigger('Sending').focus();
        await user.keyboard('{Enter}');
        await screen.findByRole('link', { name: 'Connections' });
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(screen.getByRole('link', { name: 'Connections' })).toHaveFocus());
        await user.keyboard('{Escape}');
        await waitFor(() => expect(trigger('Sending')).toHaveAttribute('aria-expanded', 'false'));
        expect(trigger('Sending')).toHaveFocus();
    });

    it('marks the current page link', async () => {
        const { user } = renderUi(<SiteNav />);
        await user.click(trigger('Logs'));
        const link = await screen.findByRole('link', { name: 'Delivery log' });
        expect(link).toHaveAttribute('aria-current', 'page');
        expect(link).toHaveAttribute('data-active');
    });

    it('shows the panel in the shared viewport, or under its trigger without it', async () => {
        const { user, unmount } = renderUi(<SiteNav />);
        await user.click(trigger('Sending'));
        await screen.findByRole('link', { name: 'Connections' });
        const viewport = document.querySelector('[data-slot="navigation-menu-viewport"]');
        expect(viewport).toHaveAttribute('data-bui-motion', 'overlay');
        expect(viewport.contains(screen.getByRole('link', { name: 'Connections' }))).toBe(true);
        unmount();
        const second = renderUi(<SiteNav viewport={false} />);
        await second.user.click(trigger('Sending'));
        await screen.findByRole('link', { name: 'Connections' });
        expect(document.querySelector('[data-slot="navigation-menu-viewport"]')).toBeNull();
        expect(document.querySelector('[data-slot="navigation-menu"]')).toHaveAttribute('data-viewport', 'false');
        await expectNoAxeViolations();
    });

    it('shows one area of a submenu at a time, as tabs do', async () => {
        const { user } = renderUi(
            <NavigationMenu aria-label="Workspace">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Workspace</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuSub defaultValue="sending" orientation="vertical">
                                <NavigationMenuList>
                                    <NavigationMenuItem value="sending">
                                        <NavigationMenuTrigger>Sending area</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <NavigationMenuLink href="#connections">Connections</NavigationMenuLink>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem value="team">
                                        <NavigationMenuTrigger>Team area</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <NavigationMenuLink href="#members">Members</NavigationMenuLink>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenuSub>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        );
        await user.click(trigger('Workspace'));
        expect(await screen.findByRole('link', { name: 'Connections' })).toBeInTheDocument();
        expect(document.querySelector('[data-slot="navigation-menu-sub"]')).toHaveAttribute('data-orientation', 'vertical');
        await user.click(trigger('Team area'));
        expect(await screen.findByRole('link', { name: 'Members' })).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByRole('link', { name: 'Connections' })).toBeNull());
    });
});
