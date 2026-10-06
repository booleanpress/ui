import type { ComponentDoc } from "../types.ts"

const AS_CHILD = "Render the child element instead, with this part's behaviour and classes merged onto it."

export default {
  slug: "context-menu",
  title: "Context menu",
  category: "Menu",
  purpose: "A menu of actions for an area or a row, opened with a right-click, a long press or the keyboard's menu key.",
  links: {
    radix: { label: "Radix Context Menu", href: "https://www.radix-ui.com/primitives/docs/components/context-menu" },
    apg: { label: "APG Menu", href: "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" },
    spec: "specs/004_full-suite-components.md#context-menu",
  },
  usage: `\`\`\`tsx
<ContextMenu>
  <ContextMenuTrigger tabIndex={0}>Delivery to ops@example.com</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onSelect={() => resend()}>Resend</ContextMenuItem>
    <ContextMenuItem variant="destructive" onSelect={() => remove()}>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Right-click the dashed area to open a menu of actions." },
    { id: "submenus", title: "Submenus", description: "`ContextMenuSub` opens a second list from an item, with icons in the rows." },
    { id: "checkbox-radio", title: "Checkbox and radio items", description: "Show or hide columns with checkbox items, and choose one density with radio items." },
    { id: "destructive", title: "Destructive item", description: "`variant=\"destructive\"` marks the action that revokes a key." },
    { id: "shortcuts", title: "Shortcuts", description: "`ContextMenuShortcut` shows a key hint at the end of each row." },
  ],
  accessibility: {
    semantics:
      'The content is a `menu` of `menuitem`, `menuitemcheckbox` or `menuitemradio` items. The trigger area keeps its own role.',
    labels:
      "Items are named by their text. The trigger area needs visible text or a name that says what it is.",
    focus:
      "Opening moves focus into the menu, and closing returns it to the trigger area. The menu is modal: the page behind it cannot be reached.",
    limits: [
      "A context menu is hidden until it is opened. Repeat its actions somewhere visible.",
      "The trigger area must be focusable for keyboard users; Radix does not make it so.",
      "Only text and icons in items; a menu is not a place for form controls.",
    ],
  },
  keyboard: [
    { keys: ["Shift", "F10"], behaviour: "On the focused trigger area (or with the menu key), opens the menu." },
    { keys: ["↓"], behaviour: "Moves to the next item; it stops at the last, or wraps to the first with `loop`." },
    { keys: ["↑"], behaviour: "Moves to the previous item; it stops at the first, or wraps to the last with `loop`." },
    { keys: ["Home", "End"], behaviour: "Moves to the first or last item." },
    { keys: ["A–Z"], behaviour: "Type-ahead: moves to the next item whose text starts with the letters typed." },
    { keys: ["Enter", "Space"], behaviour: "Chooses the item and closes the menu; on a checkbox or radio item, also changes it." },
    { keys: ["→"], behaviour: "On a submenu trigger, opens its submenu (← in right-to-left pages)." },
    { keys: ["←"], behaviour: "In a submenu, closes it and returns to its trigger (→ in right-to-left pages)." },
    { keys: ["Escape"], behaviour: "Closes the menu and returns focus to the trigger area." },
  ],
  props: {
    ContextMenu: {
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
      modal: "Whether the rest of the page is blocked while it is open. `true` by default.",
      dir: "The reading direction. The provider's `dir` by default.",
    },
    ContextMenuTrigger: {
      asChild: AS_CHILD,
      disabled: "Lets the browser's own context menu open instead.",
    },
    ContextMenuPortal: { container: "Where the menu is rendered. By default, at the end of `<body>`." },
    ContextMenuContent: {
      loop: "Whether the arrow keys wrap from the last item to the first. `false` by default.",
      alignOffset: "Distance in pixels along the pointer's side.",
      onEscapeKeyDown: "Called when Escape is pressed. Call `event.preventDefault()` to keep it open.",
      onCloseAutoFocus: "Called when focus leaves as it closes. Call `event.preventDefault()` to choose where focus goes.",
    },
    ContextMenuItem: {
      asChild: AS_CHILD,
      onSelect: "Called when the item is chosen. Call `event.preventDefault()` to keep the menu open.",
      disabled: "Skips the item and ignores clicks.",
      textValue: "The text type-ahead matches, when the content is not plain text.",
      variant: "`default`, or `destructive` for an action that removes something.",
      inset: "Indent the item to line up with items that have a check or dot.",
    },
    ContextMenuCheckboxItem: {
      checked: "Whether it is checked: `true`, `false` or `\"indeterminate\"`. Pair it with `onCheckedChange`.",
      onCheckedChange: "Called with the new state when it is chosen.",
      disabled: "Skips the item and ignores clicks.",
    },
    ContextMenuRadioGroup: {
      value: "The chosen item's value. Pair it with `onValueChange`.",
      onValueChange: "Called with the value of the item that was chosen.",
    },
    ContextMenuRadioItem: {
      value: "The value this item stands for.",
      disabled: "Skips the item and ignores clicks.",
    },
    ContextMenuLabel: { inset: "Indent the label to line up with items that have a check or dot." },
    ContextMenuSub: {
      open: "Whether the submenu is open, when you control it.",
      onOpenChange: "Called with `true` or `false` when it opens or closes.",
    },
    ContextMenuSubTrigger: {
      disabled: "Skips the item and ignores clicks.",
      inset: "Indent the item to line up with items that have a check or dot.",
    },
    ContextMenuSubContent: { sideOffset: "Distance in pixels from its trigger." },
  },
  theming:
    "The menu is a floating surface: `--popover` and `--popover-foreground`. The highlighted item uses `--accent`; icons, checks and dots use `--control-hover`, and `--muted-foreground` on the highlighted item; labels use `--muted-foreground`; a destructive item uses `--destructive-strong`, on `--destructive-subtle` when highlighted.",
} satisfies ComponentDoc
