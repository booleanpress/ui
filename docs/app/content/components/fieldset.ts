import type { ComponentDoc } from "../types.ts"

export default {
  slug: "fieldset",
  title: "Fieldset",
  category: "Panel",
  purpose: "A bordered box with a legend on its edge that groups related content, and can fold it away.",
  links: {
    radix: { label: "Radix Collapsible", href: "https://www.radix-ui.com/primitives/docs/components/collapsible" },
    apg: { label: "APG Disclosure", href: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/" },
    spec: "specs/004_full-suite-components.md#fieldset",
  },
  usage: `\`\`\`tsx
<Fieldset toggleable>
  <FieldsetLegend>Sender</FieldsetLegend>
  <FieldsetContent>From Acme Support, support@example.com.</FieldsetContent>
</Fieldset>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A legend on the edge of a box holding an invoice's lines." },
    { id: "toggleable", title: "Toggleable", description: "`toggleable` makes the legend a button that folds the content away and back." },
    { id: "controlled", title: "Controlled", description: "`open` and `onOpenChange` keep the state outside, so other buttons can open and close it." },
    { id: "custom-indicator", title: "Custom indicator", description: "`indicator` replaces the minus and plus with a chevron." },
    { id: "with-form", title: "With a form inside", description: "Fields grouped under one legend, which screen readers read as the group's name." },
    { id: "disabled", title: "Disabled", description: "`disabled` greys every field inside and takes them out of the tab order." },
  ],
  accessibility: {
    semantics:
      "A native `fieldset` named by its `legend`; when toggleable, the legend holds a `button` with `aria-expanded`.",
    labels:
      "The legend's text names the group and the toggle button. Keep it short.",
    focus:
      "The legend's button is a tab stop before the content's controls.",
    limits: [
      "Folded fields are still submitted with the form, and still checked by its validation: when the browser finds one invalid on submit, its section opens so the browser can move to the field and show its message. Validation of your own (`noValidate` forms) should open the section itself, through `open`.",
      "The indicator is decoration (`aria-hidden`); the state is in `aria-expanded`.",
    ],
  },
  keyboard: [{ keys: ["Enter", "Space"], behaviour: "On a toggleable legend: shows or hides the content." }],
  props: {
    Fieldset: {
      toggleable: "Turns the legend into a button that shows and hides the content. `false` by default.",
      open: "Whether the content shows, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether the content shows at the start, when the fieldset controls itself. `true` by default.",
      onOpenChange: "Called with the new state when the content is shown or hidden.",
      disabled: "Disables every control inside, except those in the legend.",
    },
    FieldsetLegend: {
      indicator: "Replaces the minus and plus. The button is the Tailwind group `fieldset-trigger`.",
    },
  },
  theming:
    "The box is `--card` with a 1px `--border` edge, a 6px radius and 16px padding; the legend is 14px semibold on `--card`. A toggleable legend takes `--accent` under the pointer, its icon `--muted-foreground` (`--secondary-foreground` under the pointer); focus is `--ring`.",
} satisfies ComponentDoc
