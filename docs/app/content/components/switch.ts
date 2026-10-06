import type { ComponentDoc } from "../types.ts"

export default {
  slug: "switch",
  title: "Switch",
  category: "Form",
  purpose: "Turns one setting on or off, and takes effect as soon as it is flipped.",
  links: {
    radix: { label: "Radix Switch", href: "https://www.radix-ui.com/primitives/docs/components/switch" },
    apg: { label: "APG Switch", href: "https://www.w3.org/WAI/ARIA/apg/patterns/switch/" },
    spec: "specs/003_moved-components.md#switch",
  },
  usage: `\`\`\`tsx
<div className="flex items-center gap-2">
  <Switch id="log-emails" defaultChecked />
  <Label htmlFor="log-emails">Keep the email log</Label>
</div>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Off and on, each named by its label." },
    {
      id: "controlled",
      title: "Controlled",
      description: "Keep the setting in your state, shown beneath the switch.",
    },
    {
      id: "with-icons",
      title: "With icons",
      description: "`checkedIcon` and `uncheckedIcon` show a check while on and a cross while off.",
    },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "disabled", title: "Disabled", description: "A disabled switch keeps its state and ignores clicks and keys." },
    {
      id: "invalid",
      title: "Invalid",
      description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message.",
    },
  ],
  accessibility: {
    semantics: "A `button` with `role=\"switch\"` and `aria-checked`. In a form it also renders a hidden checkbox, so the value is submitted.",
    labels: "Name every switch with a `Label` or `aria-label`. Word it for the on state, because a screen reader adds \"on\" or \"off\".",
    focus: "It is in the tab order, and the focus outline shows on keyboard focus only.",
    limits: [
      "The default track is 22 px high, the small one 16 px and the large one 26 px. Keep the label beside the switch, so the label adds to the target and the pair meets WCAG 2.5.8's 24 px.",
      "The thumb icons are decorative: the state is announced from `aria-checked`.",
    ],
  },
  keyboard: [
    { keys: ["Space"], behaviour: "Flips the switch." },
    { keys: ["Enter"], behaviour: "Flips the switch. APG lists Enter as optional." },
  ],
  theming:
    "The track is `--primary` when on and `--control` when off, each a step lighter or darker under the pointer, and `--field-disabled` when disabled; the thumb is `--card` (`--muted-foreground` when off in the dark theme); invalid draws an `--invalid` edge. A thumb icon is `--muted-foreground` while off (`--card` in dark) and `--primary` while on. The thumb slides toward the end of the line, so it mirrors in right-to-left.",
  props: {
    Switch: {
      size: "`sm` (28 × 16 px), `default` (36 × 22 px) or `lg` (44 × 26 px). Defaults to the provider's `controlSize`.",
      checkedIcon: "An icon inside the thumb while on, such as a check. Sized with the thumb.",
      uncheckedIcon: "An icon inside the thumb while off, such as a cross. Sized with the thumb.",
      checked: "The state, when you control it. Pair it with `onCheckedChange`.",
      defaultChecked: "The state it starts in, when it controls itself.",
      onCheckedChange: "Called with the new state when it is flipped.",
      required: "The form cannot be submitted until it is on.",
      name: "The field name, for the value the form submits.",
      value: "The value submitted when it is on. Defaults to `on`.",
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
    },
  },
} satisfies ComponentDoc
