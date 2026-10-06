import type { ComponentDoc } from "../types.ts"

export default {
  slug: "action-bar",
  title: "Action bar",
  category: "Panel",
  purpose: "A floating bar that rises when items are selected: how many, the actions for them, and a button to clear the selection.",
  links: {
    radix: { label: "Radix Toolbar", href: "https://www.radix-ui.com/primitives/docs/components/toolbar" },
    apg: { label: "APG Toolbar", href: "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" },
    spec: "specs/004_full-suite-components.md#action-bar",
  },
  usage: `\`\`\`tsx
<ActionBar count={selected.length} onClear={clear}>
  <ActionBarButton severity="danger"><Trash2Icon />Delete</ActionBarButton>
</ActionBar>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Select tickets in a list and the bar rises with the count, two actions and a clear button." },
    { id: "many-actions", title: "With many actions", description: "Two actions and a menu for the rest." },
    { id: "in-table", title: "In a table", description: "A table with a checkbox on each row and one to select all." },
  ],
  accessibility: {
    semantics:
      'A `role="toolbar"` named by the count, plus a `role="status"` region that announces the count when the bar appears or changes.',
    labels: "Name every icon-only action. The × is named by the provider's `clearSelection` string.",
    focus:
      "The bar does not take focus when it appears; it is one tab stop and the arrow keys move between its buttons. When it closes with focus inside, focus returns to where it came from.",
    limits: [
      "It covers the bottom of the list while it shows; leave room below the last row (padding) so it stays reachable.",
      "The bar does not shrink its actions: past a few, move them into a menu.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves into the bar, onto the last button used, and out again: one stop." },
    { keys: ["→", "←"], behaviour: "Moves to the next or previous button, wrapping at the ends. Reversed in a right-to-left page." },
    { keys: ["Home", "End"], behaviour: "Moves to the first or last button." },
    { keys: ["Enter", "Space"], behaviour: "Activates the focused button; on the ×, clears the selection." },
  ],
  props: {
    ActionBar: {
      "aria-label": "The bar's name. The count text by default.",
      loop: "Whether the arrows wrap from the last button to the first. `true` by default.",
      dir: "The reading direction. The provider's `dir` by default.",
    },
    ActionBarButton: {
      variant: "Button's look: `ghost` (default), `outline`, `default`, `secondary`, `destructive`, `link`.",
      size: "Button's size: `default`, `sm`, `lg`, or a square `icon` size.",
      severity: "Button's severity colour, such as `danger` for a delete.",
    },
  },
  theming:
    "A floating surface: `--popover`, `--popover-foreground` and `--border`, 8px radius, the overlay shadow. It rises and fades with the overlay motion tokens.",
} satisfies ComponentDoc
