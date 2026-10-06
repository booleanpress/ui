import type { ComponentDoc } from "../types.ts"

export default {
  slug: "tree-select",
  title: "Tree select",
  category: "Form",
  purpose: "A field that opens a tree of nested options to choose one, several, or whole checked branches.",
  links: {
    radix: { label: "Radix Popover", href: "https://www.radix-ui.com/primitives/docs/components/popover" },
    apg: { label: "APG Combobox", href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" },
    spec: "specs/004_full-suite-components.md#tree-select",
  },
  usage: `\`\`\`tsx
<Label htmlFor="category">Category</Label>
<TreeSelect
  id="category"
  nodes={categories}
  placeholder="Choose a category"
/>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Choosing a node, parent or child, closes the list." },
    {
      id: "multiple",
      title: "Multiple",
      description: "`selectionMode=\"multiple\"` keeps the list open while you add and remove nodes.",
    },
    {
      id: "checkbox",
      title: "Checkbox",
      description: "`selectionMode=\"checkbox\"`: checking a parent checks its whole branch.",
    },
    {
      id: "chips",
      title: "Chips display",
      description: "`display=\"chip\"` shows each choice as a chip, with a last chip counting the rest.",
    },
    { id: "filter", title: "Filter", description: "`filter` adds a field at the top of the list that keeps matching nodes." },
    { id: "clear", title: "Clear", description: "`clearable` shows a button that empties the field." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "fluid", title: "Fluid", description: "`fluid` fills the width of the container." },
    { id: "disabled", title: "Disabled", description: "A disabled field keeps its value and cannot open." },
    {
      id: "invalid",
      title: "Invalid",
      description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message.",
    },
  ],
  accessibility: {
    semantics: "The field is a `button` with `role=\"combobox\"` that opens a `tree` in a popover.",
    labels: "Name the field with a `Label`, `aria-label` or `aria-labelledby`; the open list takes the same name.",
    focus: "Opening moves focus into the list. Escape, a single choice, or Tab past the list closes it and returns focus to the field.",
    limits: [
      "Chips are a summary, not controls: take a choice away in the list, or empty the field with `clearable`.",
      "The list's keys are the tree's: see the Tree page for the full set.",
    ],
  },
  keyboard: [
    { keys: ["Enter"], behaviour: "On the field, opens the list. In the list, chooses the focused node (checks it with checkboxes)." },
    { keys: ["Space"], behaviour: "As Enter." },
    { keys: ["Down Arrow"], behaviour: "On the closed field, opens the list. In the list, moves to the next node; from the filter, moves into the tree." },
    { keys: ["Up Arrow"], behaviour: "On the closed field, opens the list. In the list, moves to the previous node." },
    { keys: ["Right Arrow"], behaviour: "In the list, opens a closed node or moves to its first child. Left Arrow in a right-to-left page." },
    { keys: ["Left Arrow"], behaviour: "In the list, closes an open node or moves to its parent. Right Arrow in a right-to-left page." },
    { keys: ["Escape"], behaviour: "Closes the list without changing the value; the focus returns to the field." },
    { keys: ["Tab"], behaviour: "From the last stop in the list, closes it and returns the focus to the field." },
  ],
  theming:
    "The field is the select field: `--field` (`--field-filled` filled), a `--control` edge that turns `--control-hover` under the pointer and `--ring` while focused or open, `--invalid` when invalid, `--field-disabled` disabled. Chips are `--secondary` with `--accent-foreground` text. The list is the tree on the `--popover` surface.",
  props: {
    TreeSelect: {
      nodes: "The options, as tree nodes: `{ id, label, icon?, children?, leaf?, disabled? }`.",
      selectionMode: "`single` (default), `multiple` or `checkbox`.",
      value: "The chosen ids, when you control them. Pair it with `onValueChange`.",
      defaultValue: "The ids chosen at first.",
      display: "`comma` (default) lists the labels; `chip` shows chips.",
      maxSelectedLabels: "The most labels or chips shown. Default 3.",
      size: "28, 35 or 42 px tall. Defaults to the provider's `controlSize`.",
      variant: "`filled` fills the field grey. Defaults to the provider's `fieldVariant`.",
      name: "Submits each chosen id in a hidden input of this name; nothing is submitted while the field is disabled.",
    },
  },
} satisfies ComponentDoc
