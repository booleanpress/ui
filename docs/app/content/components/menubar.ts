import type { ComponentDoc } from "../types.ts"

const AS_CHILD = "Render the child element instead, with this part's behaviour and classes merged onto it."

export default {
  slug: "menubar",
  title: "Menubar",
  category: "Menu",
  purpose: "A bar of menus, such as File, Edit and View, for an editor or a tool with many commands.",
  links: {
    radix: { label: "Radix Menubar", href: "https://www.radix-ui.com/primitives/docs/components/menubar" },
    apg: { label: "APG Menubar", href: "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" },
    spec: "specs/004_full-suite-components.md#menubar",
  },
  usage: `\`\`\`tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem onSelect={() => save()}>Save</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "File, Edit and View menus, with shortcuts, submenus and a disabled item." },
    { id: "checkbox-radio", title: "Checkbox and radio items", description: "Show or hide panels with checkbox items, and choose one width with radio items." },
    { id: "with-icons", title: "With icons", description: "An icon before each trigger's text and each item's." },
  ],
  accessibility: {
    semantics:
      'The bar is a `menubar` of `menuitem` triggers; each open list is a `menu`.',
    labels:
      "Triggers and items are named by their text. Give the bar an `aria-label` when the page has more than one menubar.",
    focus:
      "The bar is one tab stop. Opening a menu moves focus into it; closing returns focus to its trigger.",
    limits: [
      "Only text and icons in items; a menu is not a place for form controls.",
      "On narrow screens the bar does not collapse into one button. Keep it short, or use a dropdown menu there.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves into the bar, onto one trigger, and out of it again." },
    { keys: ["→"], behaviour: "Moves to the next trigger, wrapping; in an open menu, opens the next menu (← in right-to-left pages)." },
    { keys: ["←"], behaviour: "Moves to the previous trigger, wrapping; in an open menu, opens the previous menu (→ in right-to-left pages)." },
    { keys: ["Enter", "Space"], behaviour: "On a trigger, opens its menu. On an item, chooses it and closes the menu." },
    { keys: ["↓"], behaviour: "On a trigger, opens its menu on the first item. In a menu, moves to the next item." },
    { keys: ["↑"], behaviour: "In a menu, moves to the previous item." },
    { keys: ["Home", "End"], behaviour: "Moves to the first or last trigger, or the first or last item in a menu." },
    { keys: ["A–Z"], behaviour: "In a menu, moves to the next item whose text starts with the letters typed." },
    { keys: ["Escape"], behaviour: "Closes the menu and returns focus to its trigger." },
  ],
  props: {
    Menubar: {
      value: "The open menu's value, when you control it. Pair it with `onValueChange`.",
      defaultValue: "The menu open at the start, when it controls itself.",
      onValueChange: "Called with the open menu's value, or an empty string when all close.",
      loop: "Whether the arrow keys wrap from the last trigger to the first. `true` by default.",
      dir: "The reading direction. The provider's `dir` by default.",
    },
    MenubarMenu: { value: "The value that names this menu, for a controlled menubar." },
    MenubarTrigger: { asChild: AS_CHILD, disabled: "Skips the trigger and ignores clicks." },
    MenubarPortal: { container: "Where the menu is rendered. By default, at the end of `<body>`." },
    MenubarContent: {
      align: "Alignment along the trigger: `start` (default), `center` or `end`.",
      alignOffset: "Distance in pixels along that side. -4 by default, so items line up with the trigger's text.",
      sideOffset: "Distance in pixels below the trigger. 8 by default.",
      loop: "Whether the arrow keys wrap from the last item to the first. `false` by default.",
      onEscapeKeyDown: "Called when Escape is pressed. Call `event.preventDefault()` to keep it open.",
    },
    MenubarItem: {
      asChild: AS_CHILD,
      onSelect: "Called when the item is chosen. Call `event.preventDefault()` to keep the menu open.",
      disabled: "Skips the item and ignores clicks.",
      textValue: "The text type-ahead matches, when the content is not plain text.",
      variant: "`default`, or `destructive` for an action that removes something.",
      inset: "Indent the item to line up with items that have a check or dot.",
    },
    MenubarCheckboxItem: {
      checked: "Whether it is checked: `true`, `false` or `\"indeterminate\"`. Pair it with `onCheckedChange`.",
      onCheckedChange: "Called with the new state when it is chosen.",
      disabled: "Skips the item and ignores clicks.",
    },
    MenubarRadioGroup: {
      value: "The chosen item's value. Pair it with `onValueChange`.",
      onValueChange: "Called with the value of the item that was chosen.",
    },
    MenubarRadioItem: { value: "The value this item stands for.", disabled: "Skips the item and ignores clicks." },
    MenubarLabel: { inset: "Indent the label to line up with items that have a check or dot." },
    MenubarSub: {
      open: "Whether the submenu is open, when you control it.",
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
    },
    MenubarSubTrigger: {
      disabled: "Skips the item and ignores clicks.",
      inset: "Indent the item to line up with items that have a check or dot.",
    },
    MenubarSubContent: { sideOffset: "Distance in pixels from its trigger." },
  },
  theming:
    "The bar is `--card` with a `--border` edge. A hovered, focused or open trigger, and the highlighted item, use `--accent`. Menus are `--popover`; icons, checks and dots use `--control-hover`, and `--muted-foreground` when highlighted; labels use `--muted-foreground`.",
} satisfies ComponentDoc
