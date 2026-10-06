import type { ComponentDoc } from "../types.ts"

export default {
  slug: "float-label",
  title: "Float label",
  category: "Form",
  purpose: "A label that sits inside an empty field and moves out of the way when the field has focus or a value.",
  links: {
    spec: "specs/004_full-suite-components.md#float-label",
  },
  usage: `\`\`\`tsx
<FloatLabel>
  <Input id="from-name" />
  <Label htmlFor="from-name">From name</Label>
</FloatLabel>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "The label sits inside the empty field and moves above it on focus or with a value." },
    { id: "in", title: "In", description: "`variant=\"in\"` moves the label into the top of the field." },
    { id: "on", title: "On", description: "`variant=\"on\"` moves the label onto the field's top edge." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` on the field colours the label, focused or not." },
    { id: "with-select", title: "With a select", description: "A `Select` or `NativeSelect` moves the label once a value is chosen." },
    { id: "textarea", title: "Textarea", description: "In a textarea the label sits at the first line." },
    {
      id: "with-number-and-mask",
      title: "With a number and a mask",
      description: "`InputNumber` and `InputMask` take every variant.",
    },
  ],
  accessibility: {
    semantics: "A `div` round the field and a native `label`; the wrapper adds no role.",
    labels: "The label names the field through `htmlFor` and the field's `id`, and stays in the page while it floats.",
    focus: "The wrapper takes no focus; a click on the label reaches the field under it.",
    limits: [
      "A placeholder and a resting label would overlap, so a field with a placeholder keeps its label moved.",
      "The label's position depends on the field's start padding; a field with a text addon at the start needs the `FloatLabel` inside the group.",
      "The 10 px floated label is small; keep the label short.",
    ],
  },
  keyboard: [],
  theming:
    "The label is `--muted-foreground` at rest, `--secondary-foreground` while the field has focus and `--destructive-strong` while the field is invalid. The `on` label is drawn on `--field`. The move takes `--bui-duration-control`; reduced motion makes it instant.",
  props: {
    FloatLabel: {
      variant: "Where the label goes when the field has focus or a value: `over` (default, above the field), `in` (into its top) or `on` (onto its top edge).",
    },
  },
} satisfies ComponentDoc
