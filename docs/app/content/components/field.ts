import type { ComponentDoc } from "../types.ts"

export default {
  slug: "field",
  title: "Field",
  category: "Form",
  purpose: "Lays out a control with its label, description and error, and groups fields into sets.",
  links: {
    spec: "specs/002_pilot-mini-specs.md#input-label-field-separator-skeleton",
  },
  usage: `\`\`\`tsx
<Field data-invalid="true">
  <FieldLabel htmlFor="port">Port</FieldLabel>
  <Input id="port" aria-invalid aria-describedby="port-help port-error" />
  <FieldDescription id="port-help">Usually 587.</FieldDescription>
  <FieldError id="port-error">Use a port between 1 and 65535.</FieldError>
</Field>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A label, an input and a description, tied together with `htmlFor` and `aria-describedby`." },
    { id: "error", title: "Error", description: "`data-invalid` colours the label, and `FieldError` is announced as an alert." },
    { id: "horizontal", title: "Horizontal", description: "A checkbox beside its label and description." },
    { id: "group", title: "Group and set", description: "`FieldSet` and `FieldLegend` name a group, and `FieldSeparator` divides fields." },
    { id: "disabled", title: "Disabled", description: "`data-disabled` dims the label and description; `disabled` on the control stops input." },
  ],
  accessibility: {
    semantics:
      "`Field` is a `group`; `FieldSet` is a `fieldset` named by its `legend`, and `FieldError` is an `alert`.",
    labels:
      "Name each control with `FieldLabel htmlFor`, list descriptions and errors in its `aria-describedby`, and name a set with `FieldLegend`.",
    focus: "Only the control takes focus; the label forwards a click to it.",
    limits: [
      "A `Field`'s `role=\"group\"` has no name of its own; only a `FieldSet` takes its name from the legend.",
      "`data-invalid` and `data-disabled` change colour only. Set `aria-invalid` and `disabled` on the control.",
    ],
  },
  keyboard: [],
  props: {
    Field: {
      orientation: "`vertical` stacks the parts; `horizontal` puts the control beside the label; `responsive` is vertical until the group is wide enough.",
    },
    FieldLegend: {
      variant: "`legend` is the larger group title; `label` is the size of a field label.",
    },
  },
} satisfies ComponentDoc
