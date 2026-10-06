import type { ComponentDoc } from "../types.ts"

export default {
  slug: "toolbar",
  title: "Toolbar",
  category: "Panel",
  purpose: "A bar of buttons, toggles and links that the keyboard reaches as one stop and moves through with the arrows.",
  links: {
    radix: { label: "Radix Toolbar", href: "https://www.radix-ui.com/primitives/docs/components/toolbar" },
    apg: { label: "APG Toolbar", href: "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" },
    spec: "specs/004_full-suite-components.md#toolbar",
  },
  usage: `\`\`\`tsx
<Toolbar aria-label="Formatting">
  <ToolbarGroup>
    <ToolbarButton aria-label="Bold"><BoldIcon /></ToolbarButton>
    <ToolbarButton aria-label="Italic"><ItalicIcon /></ToolbarButton>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarToggleGroup type="single" aria-label="Alignment">
    <ToolbarToggleItem value="left" aria-label="Align left"><AlignLeftIcon /></ToolbarToggleItem>
    <ToolbarToggleItem value="right" aria-label="Align right"><AlignRightIcon /></ToolbarToggleItem>
  </ToolbarToggleGroup>
</Toolbar>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Formatting buttons in three groups, with a disabled Redo the arrows skip." },
    { id: "start-center-end", title: "Start, centre and end", description: "Three groups spread across the bar: icon buttons, a search field and form buttons." },
    { id: "toggle-groups", title: "With toggle groups", description: "A `multiple` group for text style and a `single` group for alignment." },
    { id: "vertical", title: "Vertical", description: "`orientation=\"vertical\"` stacks the buttons, and Up and Down Arrow move between them." },
    { id: "overflow-menu", title: "Overflow menu", description: "An overflow button at the end opens a menu of further actions." },
  ],
  accessibility: {
    semantics: "A `div` with `role=\"toolbar\"`. Buttons and links are native, and toggle items use `aria-pressed`.",
    labels: "Name the toolbar with `aria-label` or `aria-labelledby`, and every icon-only control with `aria-label`.",
    focus: "The toolbar is one tab stop: Tab lands on the last control used, and the arrow keys move between controls. Disabled controls are skipped.",
    limits: [
      "A text field inside the toolbar keeps its own arrow keys and is a separate tab stop.",
      "Groups wrap onto a new line when the bar is narrow; the arrow keys follow the source order.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves into the toolbar, onto the last control used, and out again: one stop." },
    { keys: ["→", "←"], behaviour: "Moves to the next or previous control, wrapping at the ends (↓ and ↑ when vertical). Reversed in a right-to-left page." },
    { keys: ["Home", "End"], behaviour: "Moves to the first or last control." },
    { keys: ["Enter", "Space"], behaviour: "Activates the focused button, or toggles the focused toggle item." },
  ],
  props: {
    Toolbar: {
      orientation: "`horizontal` (default) or `vertical`: the layout, and which arrow keys move.",
      loop: "Whether the arrows wrap from the last control to the first. `true` by default.",
      dir: "The reading direction. The provider's `dir` by default.",
    },
    ToolbarButton: {
      variant: "Button's look: `ghost` (default, in the muted text colour), `outline`, `default`, `secondary`, `destructive`, `link`.",
      size: "Button's size: `default`, `xs`, `sm`, `lg`, or a square `icon` size.",
      severity: "Button's severity colour: `success`, `info`, `warning`, `help`, `danger`, `contrast`.",
      raised: "Lifts the button on a shadow.",
      rounded: "A pill, or a circle for an icon button.",
      loading: "Shows the spinner and sets `aria-busy` and `aria-disabled`: the button ignores presses but keeps its focus, and the arrow keys still reach it.",
    },
    ToolbarToggleGroup: {
      type: "`single` (one item on at a time) or `multiple`. Required.",
      value: "The pressed item's value (`single`) or values (`multiple`), when you control it.",
      defaultValue: "The item or items pressed at the start, when it controls itself.",
      onValueChange: "Called with the new value or values.",
      size: "`sm`, `default` or `lg`, for every item. Defaults to the provider's `controlSize`.",
    },
    ToolbarToggleItem: {
      value: "The value this item stands for. Required.",
      disabled: "The item cannot be pressed and the arrows skip it.",
    },
    ToolbarLink: {
      asChild: "Render the child element (a router's link) instead, with the link's behaviour and classes merged onto it.",
    },
  },
  theming:
    "The bar is `--card` with a 1px `--border` edge, a 6px radius and 10px padding. Buttons are `--muted-foreground` on transparent, with `--subtle` under the pointer; toggle items take the toggle's look; separators are `--border`; focus is `--ring`.",
} satisfies ComponentDoc
