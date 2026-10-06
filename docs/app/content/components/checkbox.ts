import type { ComponentDoc } from "../types.ts"

export default {
  slug: "checkbox",
  title: "Checkbox",
  category: "Form",
  purpose: "Lets people choose one or more options, or shows that a group is partly chosen.",
  links: {
    radix: { label: "Radix Checkbox", href: "https://www.radix-ui.com/primitives/docs/components/checkbox" },
    apg: { label: "APG Checkbox", href: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/" },
    spec: "specs/003_moved-components.md#checkbox",
  },
  usage: `\`\`\`tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept the terms</Label>
</div>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Unchecked and checked, each named by its label." },
    {
      id: "custom-indicator",
      title: "Custom indicator",
      description: "`icon` replaces the check with another mark, such as a cross.",
    },
    {
      id: "indeterminate",
      title: "Indeterminate",
      description: "A box shows a dash while only some of its group is chosen.",
    },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    {
      id: "filled",
      title: "Filled",
      description: "A filled box instead of an outlined one.",
    },
    { id: "disabled", title: "Disabled", description: "A disabled box keeps its state and ignores clicks." },
    {
      id: "invalid",
      title: "Invalid",
      description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message.",
    },
  ],
  accessibility: {
    semantics:
      'A `button` with `role="checkbox"` and `aria-checked`, which can be `mixed`. In a form it also submits its value.',
    labels:
      "Name every checkbox with a `Label`, or `aria-label` when no visible text fits.",
    focus: "It is in the tab order.",
    limits: [
      "The box is 18 px (14 px small, 20 px large). Keep its label beside it, so the label adds to the target and the pair meets WCAG 2.5.8's 24 px.",
      "A custom `icon` is decorative: the state is announced from `aria-checked`, whatever the mark looks like.",
    ],
  },
  theming:
    "The box fills with `--field` (`--field-filled` with `variant=\"filled\"`) and its edge is `--control` (`--control-hover` under the pointer); checked fills with `--primary` (`--primary-hover` under the pointer) and the mark is `--primary-foreground`; mixed keeps the unfilled box with a dash in `--foreground`; focus is a 1 px `--ring` outline 2 px away; invalid is `--invalid`; disabled fills `--field-disabled`, the mark `--field-disabled-foreground`.",
  keyboard: [{ keys: ["Space"], behaviour: "Toggles between checked and unchecked. From the indeterminate state, it becomes checked." }],
  props: {
    Checkbox: {
      size: "`sm` is a 14 px box, `default` 18 px, `lg` 20 px. Defaults to the provider's `controlSize`.",
      variant: "`filled` fills the unchecked box with `--field-filled`. Defaults to the provider's `fieldVariant`.",
      icon: "The mark shown when checked, in place of the check. Sized with the box.",
      indeterminateIcon: "The mark shown when mixed, in place of the dash. Sized with the box.",
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
      checked: "The state, when you control it. Pair it with `onCheckedChange`.",
      defaultChecked: "The state it starts in, when it controls itself.",
      onCheckedChange: "Called with the new state when it is toggled.",
      required: "The form cannot be submitted until it is checked.",
    },
  },
} satisfies ComponentDoc
