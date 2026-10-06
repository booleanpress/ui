import type { ComponentDoc } from "../types.ts"

export default {
  slug: "command",
  title: "Command",
  category: "Menu",
  purpose: "A search field above a filtered list of commands or pages, inline or in a dialog.",
  links: {
    apg: { label: "APG Combobox", href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" },
    spec: "specs/003_moved-components.md#command",
  },
  usage: `\`\`\`tsx
<Command label="Search pages">
  <CommandInput placeholder="Search for a page" />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Pages">
      <CommandItem onSelect={() => open("/logs")}>Email log</CommandItem>
      <CommandItem onSelect={() => open("/mailers")}>Mailers</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "An inline list with two groups and shortcut hints." },
    { id: "dialog", title: "In a dialog", description: "`CommandDialog` opens from a button or with ⌘J / Ctrl+J." },
    { id: "empty", title: "Empty result", description: "`CommandEmpty` shows when nothing matches the search." },
    { id: "disabled-item", title: "Disabled item", description: "A disabled item is skipped by the arrow keys and cannot be chosen." },
  ],
  accessibility: {
    semantics:
      'The search field is a `combobox` that controls a `listbox` of `option` items. The empty message is announced in a `status` region, and focus stays in the field while the arrow keys move the highlight.',
    labels:
      "Name an inline command with the `label` prop on `Command`; `CommandDialog` uses the dialog's title.",
    focus:
      "Focus goes to the search field when a `CommandDialog` opens and returns to what opened it on close. Inline, the field is a normal tab stop.",
    limits: [
      "cmdk also binds Ctrl+N, Ctrl+J (next) and Ctrl+P, Ctrl+K (previous) while the field has focus. Pass `vimBindings={false}` to `Command` if your shortcuts collide.",
      "`CommandShortcut` is only a hint. Bind the key yourself, and not on a key that cmdk uses.",
    ],
  },
  keyboard: [
    { keys: ["↓"], behaviour: "Highlights the next item, wrapping from the last to the first (`loop`)." },
    { keys: ["↑"], behaviour: "Highlights the previous item." },
    { keys: ["Home"], behaviour: "Highlights the first item." },
    { keys: ["End"], behaviour: "Highlights the last item." },
    { keys: ["Enter"], behaviour: "Runs the highlighted item's `onSelect`." },
    { keys: ["Escape"], behaviour: "In a `CommandDialog`, closes it and returns focus." },
  ],
  props: {
    Command: {
      label: "The accessible name of the search field.",
      value: "The highlighted item's value, when you control it. Pair it with `onValueChange`.",
      onValueChange: "Called with the value of the highlighted item.",
      shouldFilter: "Set to `false` to turn off cmdk's filtering and filter the items yourself.",
      filter: "A function `(value, search, keywords) => number` that scores an item; 0 hides it.",
      loop: "Whether the arrow keys wrap from the last item to the first. `false` by default.",
      vimBindings: "Whether Ctrl+N, Ctrl+J, Ctrl+P and Ctrl+K move the highlight. `true` by default.",
    },
    CommandDialog: {
      open: "Whether it is open. Pair it with `onOpenChange`.",
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
      title: "The hidden dialog title, which also names the search field. Defaults to the provider's `commandTitle`.",
      description: "The hidden dialog description. Defaults to the provider's `commandDescription`.",
      showCloseButton: "Render the × button. `true` by default.",
    },
    CommandInput: {
      placeholder: "Text shown while the field is empty. It is not a name.",
      defaultValue: "The search text at the start, when the field holds its own.",
      value: "The search text, when you control it. Pair it with `onValueChange`.",
      onValueChange: "Called with the search text as it changes.",
    },
    CommandGroup: {
      heading: "The group's visible heading, which also names the group.",
      forceMount: "Show the group whatever the search is.",
    },
    CommandItem: {
      value: "What the item matches the search against, when it is not its text.",
      keywords: "Extra words that match the search.",
      onSelect: "Called with the item's value when it is chosen with Enter or a click.",
      disabled: "Skips the item and ignores clicks.",
      forceMount: "Show the item whatever the search is.",
    },
  },
  theming: "The list is a floating surface: `--popover` and `--popover-foreground`. The highlighted item uses `--accent` and `--accent-foreground`; item icons use `--control-hover`, and group headings `--muted-foreground`.",
} satisfies ComponentDoc
