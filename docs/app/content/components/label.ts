import type { ComponentDoc } from "../types.ts"

export default {
  slug: "label",
  title: "Label",
  category: "Form",
  purpose: "The visible name of a form control.",
  links: {
    radix: { label: "Radix Label", href: "https://www.radix-ui.com/primitives/docs/components/label" },
    spec: "specs/002_pilot-mini-specs.md#input-label-field-separator-skeleton",
  },
  usage: `\`\`\`tsx
<Label htmlFor="from-name">From name</Label>
<Input id="from-name" />
\`\`\``,
  examples: [
    { id: "required", title: "Required", description: "An asterisk marks the field, with a readable explanation for screen readers." },
    { id: "basic", title: "Basic", description: "A label above a text input." },
    { id: "with-checkbox", title: "With a checkbox", description: "The label sits beside the box; clicking it toggles the box." },
    { id: "disabled", title: "Disabled", description: "The label dims along with its disabled control." },
  ],
  accessibility: {
    semantics: "A native `label` element that does not select its text on double-click.",
    labels: "A label is the name. Keep its text short and specific, and unique on the page when the controls differ.",
    focus: "A label is not focusable. Clicking it moves focus to its control.",
    limits: ["A label without `htmlFor` (or a control inside it) names nothing."],
  },
  keyboard: [],
  props: {
    Label: {
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
    },
  },
} satisfies ComponentDoc
