import type { ComponentDoc } from "../types.ts"

export default {
  slug: "in-field-label",
  title: "In-field label",
  category: "Form",
  purpose: "A small label fixed inside the top of its field, above the value.",
  links: {
    spec: "specs/004_full-suite-components.md#in-field-label",
  },
  usage: `\`\`\`tsx
<InFieldLabel>
  <Input id="from-name" />
  <Label htmlFor="from-name">From name</Label>
</InFieldLabel>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "The label sits in the top of the field; an icon lines up with the value below it." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` on the field colours the label, focused or not." },
    { id: "with-select", title: "With a select", description: "A `Select` takes the label too." },
    { id: "with-number-and-mask", title: "With a number and a mask", description: "An `InputNumber` with a suffix, and an `InputMask`." },
  ],
  accessibility: {
    semantics: "A `div` round the field and a native `label`; the wrapper adds no role.",
    labels: "The label names the field through `htmlFor` and the field's `id`.",
    focus: "The wrapper takes no focus; a click on the label reaches the field under it.",
    limits: ["The 10 px label is small; keep it short."],
  },
  keyboard: [],
  theming:
    "The label is `--muted-foreground`, `--secondary-foreground` while the field has focus and `--destructive-strong` while the field is invalid.",
} satisfies ComponentDoc
