import type { ComponentDoc } from "../types.ts"

export default {
  slug: "toggle-group",
  title: "Toggle group",
  category: "Form",
  purpose: "A row of toggles that share one choice, or several, such as a period or a set of statuses.",
  links: {
    radix: { label: "Radix Toggle Group", href: "https://www.radix-ui.com/primitives/docs/components/toggle-group" },
    apg: { label: "APG Toggle Button", href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/" },
    spec: "specs/003_moved-components.md#toggle-group",
  },
  usage: `\`\`\`tsx
<ToggleGroup type="single" variant="outline" defaultValue="7d" aria-label="Period">
  <ToggleGroupItem value="24h">24 hours</ToggleGroupItem>
  <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
  <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
</ToggleGroup>
\`\`\``,
  examples: [
    { id: "required", title: "Keep a selection", description: "`allowEmpty={false}` stops people releasing the last pressed item." },
    { id: "single", title: "Single", description: "One item pressed at a time, as a period filter." },
    {
      id: "controlled",
      title: "Controlled",
      description: "`value` and `onValueChange` keep the choice in your state.",
    },
    { id: "multiple", title: "Multiple", description: "Any number of items pressed, as a set of status filters." },
    { id: "spacing", title: "Spacing and size", description: "`spacing` separates the items into their own buttons." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "fluid", title: "Fluid", description: "`fluid` makes the group as wide as its container." },
    {
      id: "invalid",
      title: "Invalid",
      description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message.",
    },
    { id: "disabled", title: "Disabled", description: "Disable the whole group or a single item; the arrow keys skip a disabled item." },
  ],
  accessibility: {
    semantics: "A `group` of buttons with `aria-pressed`, in both selection modes.",
    labels: "Name the group with `aria-label` or `aria-labelledby`, and icon-only items with `aria-label`.",
    focus: "Each enabled button is a tab stop; Space and Enter toggle it. `rovingFocus` switches to one tab stop with arrow keys.",
    limits: [
      "Default light unpressed text (`#64748b` on `#f1f5f9`) is 4.3439:1, below the 4.5:1 AA text threshold. See [contrast overrides](/docs/accessibility#default-colours).",
      "Each item is 30 to 38 px high, depending on `size`, and at least as wide as its text.",
      "`aria-invalid` on role `group` is announced by fewer screen readers than on a radio group; keep the error message in `aria-describedby`.",
    ],
  },
  keyboard: [
    { keys: ["Tab", "Shift+Tab"], behaviour: "Moves between every enabled button, then out of the group." },
    { keys: ["Space", "Enter"], behaviour: "Toggles the focused item. In single mode the previous item is released. `allowEmpty={false}` keeps the last selection." },
    { keys: ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"], behaviour: "Only with `rovingFocus`: moves focus without changing the value. Direction and wrapping follow `dir`, `orientation` and `loop`." },
  ],
  theming:
    "Items share the toggle's tokens: a `--background` plate (`--muted` in dark) when pressed, `--foreground` text when pressed, `--border` for the `outline` edge. With `spacing={0}` the items join into one bar: the outer corners are rounded and the inner ones square, mirrored in right-to-left. An invalid group draws `--invalid` round the bar, or round each item when they are spaced.",
  props: {
    ToggleGroup: {
      allowEmpty: "Whether the last pressed item can be released. True by default, in either selection mode.",
      type: '`"single"` allows one pressed item; `"multiple"` allows any number. Required.',
      value: "The pressed value (single) or values (multiple), when you control it. Pair it with `onValueChange`.",
      defaultValue: "The value or values it starts with, when it controls itself.",
      onValueChange: "Called with the new value (single) or values (multiple).",
      variant: "`default` or `outline`, passed to every item.",
      size: "`sm`, `default` or `lg`, passed to every item. Defaults to the provider's `controlSize`.",
      fluid: "Makes the group as wide as its container; the items share the width equally.",
      spacing: "The gap between items in 4 px steps. `0` joins them into one bar.",
      disabled: "Stops every item.",
      orientation: "`horizontal` or `vertical`, for the arrow keys. It does not change the layout.",
      dir: "Reading direction for the arrow keys. Defaults to the provider's.",
      loop: "Whether the arrow keys wrap around at the ends. Defaults to `true`.",
      rovingFocus: "Opts into one tab stop with arrow-key movement. Defaults to `false`.",
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
    },
    ToggleGroupItem: {
      value: "The value this item adds to the group's value when pressed.",
      disabled: "Stops this item. The arrow keys skip it.",
      variant: "Used only when the group sets no `variant`; the group's setting wins.",
      size: "Used only when the group sets no `size`; the group's setting wins.",
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
    },
  },
} satisfies ComponentDoc
