import type { ComponentDoc } from "../types.ts"

const AS_CHILD = "Render the child element instead, with this part's behaviour and classes merged onto it."

export default {
  slug: "dropdown-menu",
  title: "Dropdown menu",
  category: "Menu",
  purpose: "A list of actions that opens from a button, such as the actions of a table row.",
  links: {
    radix: { label: "Radix Dropdown Menu", href: "https://www.radix-ui.com/primitives/docs/components/dropdown-menu" },
    apg: { label: "APG Menu Button", href: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" },
    spec: "specs/003_moved-components.md#dropdown-menu",
  },
  usage: `\`\`\`tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuItem onSelect={() => duplicate()}>Duplicate</DropdownMenuItem>
    <DropdownMenuItem variant="destructive" onSelect={() => remove()}>
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
\`\`\``,
  examples: [
    { id: "actions", title: "Actions", description: "A row's actions, with a label, a group and a disabled item." },
    { id: "checkbox-items", title: "Checkbox items", description: "Show or hide columns with checkbox items." },
    { id: "radio-items", title: "Radio items", description: "Choose one of several values, with the chosen one marked." },
    { id: "submenu", title: "Submenu", description: "`DropdownMenuSub` opens a second list beside the item." },
    { id: "destructive", title: "Destructive item", description: "`variant=\"destructive\"` colours an item that removes something." },
    { id: "shortcuts", title: "With shortcuts", description: "`DropdownMenuShortcut` shows a key hint at the end of the row." },
  ],
  accessibility: {
    semantics:
      "The trigger is a `button` that opens a `menu`; items are `menuitem`, `menuitemcheckbox` or `menuitemradio`.",
    labels:
      "The trigger's text names the menu; an icon-only trigger needs `aria-label`. Items are named by their text.",
    focus:
      "Focus moves into the menu when it opens and returns to the trigger when it closes.",
    limits: [
      "Only text and icons in items. A menu is not a place for form controls: use a popover.",
      "A disabled item stays in the list and is announced as unavailable; the arrow keys skip it.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "Space"], behaviour: "On the trigger, opens the menu and highlights its first item. On an item, chooses it." },
    { keys: ["↓"], behaviour: "On the trigger, opens the menu. In the menu, moves to the next item; it stops at the last, or wraps to the first with `loop`." },
    { keys: ["↑"], behaviour: "In the menu, moves to the previous item; it stops at the first, or wraps to the last with `loop`." },
    { keys: ["Home", "End"], behaviour: "Moves to the first or last item." },
    { keys: ["A–Z"], behaviour: "Type-ahead: moves to the next item whose text starts with the letters typed." },
    { keys: ["→"], behaviour: "On a submenu trigger, opens its submenu (← in right-to-left pages)." },
    { keys: ["←"], behaviour: "In a submenu, closes it and returns to its trigger (→ in right-to-left pages)." },
    { keys: ["Escape"], behaviour: "Closes the menu and returns focus to the trigger." },
    { keys: ["Tab"], behaviour: "Does nothing while the menu is open: focus stays in the menu until it closes." },
  ],
  props: {
    DropdownMenu: {
      open: "Whether it is open, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether it starts open, when it controls itself.",
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
      modal: "Whether the rest of the page is blocked while it is open. `true` by default.",
    },
    DropdownMenuTrigger: { asChild: AS_CHILD },
    DropdownMenuPortal: { container: "Where the menu is rendered. By default, at the end of `<body>`." },
    DropdownMenuContent: {
      side: "The preferred side: `top`, `right`, `bottom` or `left`. `bottom` by default; it flips when there is no room.",
      align: "Alignment along that side: `start`, `center` or `end`. `center` by default.",
      sideOffset: "Distance in pixels from the trigger. 4 by default.",
      loop: "Whether the arrow keys wrap from the last item to the first. `false` by default.",
      onEscapeKeyDown: "Called when Escape is pressed. Call `event.preventDefault()` to keep it open.",
      onCloseAutoFocus: "Called when focus leaves as it closes. Call `event.preventDefault()` to choose where focus goes.",
    },
    DropdownMenuItem: {
      asChild: AS_CHILD,
      onSelect: "Called when the item is chosen. Call `event.preventDefault()` to keep the menu open.",
      disabled: "Skips the item and ignores clicks.",
      textValue: "The text type-ahead matches, when the content is not plain text.",
      variant: "`default`, or `destructive` for an action that removes something.",
      inset: "Indent the item to line up with items that have a check or dot.",
    },
    DropdownMenuCheckboxItem: {
      checked: "Whether it is checked: `true`, `false` or `\"indeterminate\"`. Pair it with `onCheckedChange`.",
      onCheckedChange: "Called with the new state when it is chosen.",
      onSelect: "Called when the item is chosen. Call `event.preventDefault()` to keep the menu open.",
      disabled: "Skips the item and ignores clicks.",
    },
    DropdownMenuRadioGroup: {
      value: "The chosen item's value. Pair it with `onValueChange`.",
      onValueChange: "Called with the value of the item that was chosen.",
    },
    DropdownMenuRadioItem: {
      value: "The value this item stands for.",
      onSelect: "Called when the item is chosen. Call `event.preventDefault()` to keep the menu open.",
      disabled: "Skips the item and ignores clicks.",
    },
    DropdownMenuLabel: { inset: "Indent the label to line up with items that have a check or dot." },
    DropdownMenuSub: {
      open: "Whether the submenu is open, when you control it.",
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
    },
    DropdownMenuSubTrigger: {
      disabled: "Skips the item and ignores clicks.",
      inset: "Indent the item to line up with items that have a check or dot.",
    },
    DropdownMenuSubContent: { sideOffset: "Distance in pixels from its trigger." },
  },
  theming: "The menu is a floating surface: `--popover` and `--popover-foreground`. The highlighted item uses `--accent`; icons, checks and dots use `--control-hover`, and `--muted-foreground` on the highlighted item; group labels use `--muted-foreground`; a destructive item uses `--destructive-strong`, on `--destructive-subtle` when highlighted.",
} satisfies ComponentDoc
