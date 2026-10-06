import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Button } from '@/components/button';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/command';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

function Inline({ onSelect = () => {}, ...props }) {
    return (
        <Command label="Search pages" {...props}>
            <CommandInput placeholder="Search for a page" />
            <CommandList>
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup heading="Pages">
                    <CommandItem onSelect={() => onSelect('logs')}>Email log<CommandShortcut>⌘L</CommandShortcut></CommandItem>
                    <CommandItem onSelect={() => onSelect('mailers')}>Mailers</CommandItem>
                    <CommandItem disabled onSelect={() => onSelect('export')}>Export</CommandItem>
                </CommandGroup>
                <CommandGroup heading="Account">
                    <CommandItem onSelect={() => onSelect('profile')}>Profile</CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    );
}

const selected = () => document.querySelector('[cmdk-item][aria-selected="true"]')?.textContent;

function Palette({ onSelect }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Search</Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command" />
                <CommandList>
                    <CommandEmpty>No results.</CommandEmpty>
                    <CommandGroup heading="Go to">
                        <CommandItem onSelect={() => onSelect?.('logs')}>Email log</CommandItem>
                        <CommandItem onSelect={() => onSelect?.('mailers')}>Mailers</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}

describe('Command', () => {
    it('renders a combobox named by the label, a named list, and grouped options', async () => {
        renderUi(<Inline />);
        const input = screen.getByRole('combobox', { name: 'Search pages' });
        expect(input).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('listbox', { name: 'Suggestions' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Pages' })).toBeInTheDocument();
        expect(screen.getAllByRole('option')).toHaveLength(4);
        await expectNoAxeViolations();
    });

    it('highlights the first item and moves with ArrowDown and ArrowUp', async () => {
        const { user } = renderUi(<Inline />);
        screen.getByRole('combobox').focus();
        expect(selected()).toContain('Email log');
        await user.keyboard('{ArrowDown}');
        expect(selected()).toBe('Mailers');
        await user.keyboard('{ArrowDown}');
        expect(selected()).toBe('Profile');
        await user.keyboard('{ArrowUp}');
        expect(selected()).toBe('Mailers');
    });

    it('skips a disabled item', async () => {
        const { user } = renderUi(<Inline />);
        screen.getByRole('combobox').focus();
        await user.keyboard('{ArrowDown}{ArrowDown}');
        expect(selected()).toBe('Profile');
        expect(screen.getByRole('option', { name: 'Export' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('moves to the first and last item with Home and End', async () => {
        const { user } = renderUi(<Inline />);
        screen.getByRole('combobox').focus();
        await user.keyboard('{End}');
        expect(selected()).toBe('Profile');
        await user.keyboard('{Home}');
        expect(selected()).toContain('Email log');
    });

    it('wraps from the last item to the first only with loop', async () => {
        const { user, unmount } = renderUi(<Inline />);
        screen.getByRole('combobox').focus();
        await user.keyboard('{End}{ArrowDown}');
        expect(selected()).toBe('Profile');
        unmount();
        const second = renderUi(<Inline loop />);
        screen.getByRole('combobox').focus();
        await second.user.keyboard('{End}{ArrowDown}');
        expect(selected()).toContain('Email log');
    });

    it('runs onSelect of the highlighted item on Enter', async () => {
        const onSelect = vi.fn();
        const { user } = renderUi(<Inline onSelect={onSelect} />);
        screen.getByRole('combobox').focus();
        await user.keyboard('{ArrowDown}{Enter}');
        expect(onSelect).toHaveBeenCalledWith('mailers');
    });

    it('filters as you type and shows the empty message when nothing matches', async () => {
        const { user } = renderUi(<Inline />);
        await user.type(screen.getByRole('combobox'), 'prof');
        expect(screen.getAllByRole('option')).toHaveLength(1);
        expect(screen.getByRole('option', { name: 'Profile' })).toBeInTheDocument();
        await user.clear(screen.getByRole('combobox'));
        await user.type(screen.getByRole('combobox'), 'zzz');
        expect(screen.queryAllByRole('option')).toHaveLength(0);
        expect(screen.getByText('No results.')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('shows the empty message in a status region after the listbox, not inside it', async () => {
        const { user } = renderUi(<Inline />);
        const status = screen.getByRole('status');
        expect(status).toBeEmptyDOMElement();
        await user.type(screen.getByRole('combobox'), 'zzz');
        expect(status).toHaveTextContent('No results.');
        expect(screen.getByRole('listbox').contains(screen.getByText('No results.'))).toBe(false);
        await user.clear(screen.getByRole('combobox'));
        expect(status).toBeEmptyDOMElement();
    });

    it('renders CommandEmpty where it is when it sits outside the list, and merges its className', async () => {
        const { user } = renderUi(
            <Command label="Search mailers">
                <CommandInput />
                <CommandList>
                    <CommandItem>Mailgun</CommandItem>
                </CommandList>
                <CommandEmpty className="text-muted-foreground">Nothing found.</CommandEmpty>
            </Command>,
        );
        await user.type(screen.getByRole('combobox'), 'zzz');
        const empty = screen.getByText('Nothing found.');
        expect(empty).toHaveAttribute('data-slot', 'command-empty');
        expect(empty).toHaveClass('py-8', 'text-muted-foreground');
        expect(screen.getByRole('status')).toBeEmptyDOMElement();
        await expectNoAxeViolations();
    });

    it('starts with the search given as defaultValue on CommandInput, and keeps filtering as you type', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <Command label="Search mailers">
                <CommandInput defaultValue="mail" onValueChange={onValueChange} />
                <CommandList>
                    <CommandEmpty>No results.</CommandEmpty>
                    <CommandItem>Mailgun</CommandItem>
                    <CommandItem>Mailjet</CommandItem>
                    <CommandItem>SendGrid</CommandItem>
                </CommandList>
            </Command>,
        );
        const input = screen.getByRole('combobox');
        expect(input).toHaveValue('mail');
        await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
        await user.type(input, 'j');
        expect(input).toHaveValue('mailj');
        expect(onValueChange).toHaveBeenLastCalledWith('mailj');
        expect(screen.getAllByRole('option')).toHaveLength(1);
    });

    it('keeps a separator between groups out of the accessibility tree', async () => {
        renderUi(
            <Command label="Search pages">
                <CommandInput />
                <CommandList>
                    <CommandGroup heading="Pages">
                        <CommandItem>Email log</CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Account">
                        <CommandItem>Profile</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>,
        );
        expect(document.querySelector('[data-slot=command-separator]')).toHaveAttribute('aria-hidden', 'true');
        await expectNoAxeViolations();
    });

    it('keeps a shortcut hint in its written order on a right-to-left page', () => {
        renderUi(<Inline />, { dir: 'rtl' });
        expect(screen.getByText('⌘L')).toHaveClass('[unicode-bidi:plaintext]');
    });

    it('takes the list name from the provider strings', () => {
        renderUi(<Inline />, { strings: { suggestions: 'Suggestions de pages' } });
        expect(screen.getByRole('listbox', { name: 'Suggestions de pages' })).toBeInTheDocument();
    });
});

describe('CommandDialog', () => {
    it('opens as a dialog named and described by the provider, with the field named by the title', async () => {
        const { user } = renderUi(<Palette />);
        await user.click(screen.getByRole('button', { name: 'Search' }));
        const dialog = screen.getByRole('dialog', { name: 'Command Palette' });
        expect(dialog).toHaveAccessibleDescription('Search for a command to run...');
        expect(dialog.contains(screen.getByRole('combobox', { name: 'Command Palette' }))).toBe(true);
        await expectNoAxeViolations();
    });

    it('takes the title, description and list name from the provider strings', async () => {
        const { user } = renderUi(<Palette />, {
            strings: { commandTitle: 'Palette de commandes', commandDescription: 'Cherchez une commande.', suggestions: 'Résultats' },
        });
        await user.click(screen.getByRole('button', { name: 'Search' }));
        const dialog = screen.getByRole('dialog', { name: 'Palette de commandes' });
        expect(dialog).toHaveAccessibleDescription('Cherchez une commande.');
        expect(screen.getByRole('combobox', { name: 'Palette de commandes' })).toBeInTheDocument();
        expect(screen.getByRole('listbox', { name: 'Résultats' })).toBeInTheDocument();
    });

    it('keeps its title and description inside the dialog, and none in the page while it is closed', () => {
        renderUi(<Palette />);
        expect(screen.queryByText('Command Palette')).toBeNull();
        expect(screen.queryByText('Search for a command to run...')).toBeNull();
    });

    it('lets title and description override the provider', () => {
        renderUi(
            <CommandDialog open title="Jump to" description="Pick a page.">
                <CommandInput />
                <CommandList><CommandItem>Mailers</CommandItem></CommandList>
            </CommandDialog>,
        );
        expect(screen.getByRole('dialog', { name: 'Jump to' })).toHaveAccessibleDescription('Pick a page.');
    });

    it('moves with the arrow keys, runs the item on Enter and closes on Escape, returning focus', async () => {
        const onSelect = vi.fn();
        const { user } = renderUi(<Palette onSelect={onSelect} />);
        const opener = screen.getByRole('button', { name: 'Search' });
        await user.click(opener);
        const input = screen.getByRole('combobox');
        await waitFor(() => expect(input).toHaveFocus());
        await user.keyboard('{ArrowDown}{Enter}');
        expect(onSelect).toHaveBeenCalledWith('mailers');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(opener).toHaveFocus());
    });

    it('is opened by a shortcut bound by the page', async () => {
        function WithShortcut() {
            const [open, setOpen] = useState(false);
            return (
                <>
                    <ShortcutListener onOpen={() => setOpen(true)} />
                    <CommandDialog open={open} onOpenChange={setOpen}>
                        <CommandInput />
                        <CommandList><CommandItem>Mailers</CommandItem></CommandList>
                    </CommandDialog>
                </>
            );
        }
        function ShortcutListener({ onOpen }) {
            useState(() => {
                document.addEventListener('keydown', (event) => {
                    if (event.key === 'j' && (event.metaKey || event.ctrlKey)) onOpen();
                });
            });
            return null;
        }
        const { user } = renderUi(<WithShortcut />);
        await user.keyboard('{Control>}j{/Control}');
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
    });
});
