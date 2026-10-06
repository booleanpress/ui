import type { ComponentDoc } from "../types.ts"

export default {
  slug: "toggle",
  title: "Toggle",
  category: "Form",
  purpose: "A button that stays pressed or not, for a view or filter option that applies at once.",
  links: {
    radix: { label: "Radix Toggle", href: "https://www.radix-ui.com/primitives/docs/components/toggle" },
    apg: { label: "APG Button (toggle button)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/" },
    spec: "specs/003_moved-components.md#toggle",
  },
  usage: `\`\`\`tsx
<Toggle variant="outline" aria-label="Star">
  <StarIcon />
</Toggle>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "An icon toggle named by `aria-label`, and a text toggle that starts pressed." },
    { id: "state-content", title: "State content", description: "A function child receives `{ pressed }` to change the label and icon." },
    { id: "variants", title: "Variants and sizes", description: "`default` and `outline`, each pressed, in three sizes." },
    {
      id: "controlled",
      title: "Controlled",
      description: "`pressed` and `onPressedChange` keep the state in your code.",
    },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "fluid", title: "Fluid", description: "`fluid` makes the toggle as wide as its container." },
    {
      id: "invalid",
      title: "Invalid",
      description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message.",
    },
    { id: "disabled", title: "Disabled", description: "A disabled toggle keeps its state and ignores clicks and keys." },
  ],
  accessibility: {
    semantics: "A `button` with `aria-pressed` set to `true` or `false`.",
    labels: "Icon-only toggles need `aria-label`. Keep the name the same in both states.",
    focus: "It is in the tab order, and the focus ring shows on keyboard focus only.",
    limits: [
      "Default light unpressed text (`#64748b` on `#f1f5f9`) is 4.3439:1, below the 4.5:1 AA text threshold. See [contrast overrides](/docs/accessibility#default-colours).",
      "The small size is 30 px high, the default 34 px and the large 38 px; an icon-only toggle is 44 px wide. All meet WCAG 2.5.8's 24 px.",
      "The pressed state is shown by a raised plate inside the toggle (`--background`, `--muted` in dark) and darker text. An icon-only toggle in the `default` variant has no border, so keep it next to a label or group when the plate alone would be missed.",
    ],
  },
  keyboard: [
    { keys: ["Space"], behaviour: "Presses or releases the toggle." },
    { keys: ["Enter"], behaviour: "Presses or releases the toggle." },
  ],
  theming: "The toggle is `--muted` (`--background` in dark) with `--field-placeholder` text. Pressed, a `--background` plate (`--muted` in dark) with `--foreground` text. Disabled, `--field-disabled` with `--field-disabled-foreground`. The `outline` variant adds a `--border` edge; invalid, an `--invalid` one.",
  props: {
    Toggle: {
      children: "Content or a function receiving `{ pressed }`. Supply a stable accessible name when the visible text changes.",
      variant: "`default` has no visible edge; `outline` has a `--border` edge.",
      size: "`sm` is 30 px high, `default` 34 px, `lg` 38 px. Defaults to the provider's `controlSize`.",
      fluid: "Makes the toggle as wide as its container.",
      pressed: "The state, when you control it. Pair it with `onPressedChange`.",
      defaultPressed: "The state it starts in, when it controls itself.",
      onPressedChange: "Called with the new state when it is toggled.",
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
    },
  },
} satisfies ComponentDoc
