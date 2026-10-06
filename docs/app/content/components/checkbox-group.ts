import type { ComponentDoc } from "../types.ts"

export default {
  slug: "checkbox-group",
  title: "Checkbox group",
  category: "Form",
  purpose: "Checkboxes that share one array value, with a parent checkbox that checks or clears them all.",
  links: {
    radix: { label: "Radix Checkbox", href: "https://www.radix-ui.com/primitives/docs/components/checkbox" },
    apg: { label: "APG Checkbox (mixed state)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/examples/checkbox-mixed/" },
    spec: "specs/004_full-suite-components.md#checkbox-group",
  },
  usage: `\`\`\`tsx
<CheckboxGroup defaultValue={["delivered"]} aria-label="Log these events">
  <CheckboxGroupParent />
  <CheckboxGroupItem value="delivered" label="Delivered" />
  <CheckboxGroupItem value="bounced" label="Bounced" />
</CheckboxGroup>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Labelled boxes sharing one value, with one checked." },
    { id: "controlled", title: "Controlled", description: "`value` and `onValueChange` keep the checked items outside, shown above the group." },
    { id: "dynamic", title: "Dynamic", description: "Items made from an array, each with a description." },
    {
      id: "select-all",
      title: "Select all",
      description: "A parent checkbox that checks or clears every item, and shows a dash while only some are checked.",
    },
    {
      id: "nested",
      title: "Nested group",
      description: "A parent for each section, under one parent for everything.",
    },
    { id: "horizontal", title: "Horizontal", description: "`orientation=\"horizontal\"` lays the boxes out in a wrapping row." },
    { id: "disabled", title: "Disabled", description: "`disabled` on the group disables every box; on an item, only that one." },
    {
      id: "invalid",
      title: "Invalid",
      description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message.",
    },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled box instead of an outlined one." },
  ],
  accessibility: {
    semantics:
      'The group is a `role="group"` of `role="checkbox"` items; the parent reads `mixed` while only some are checked.',
    labels:
      'Name the group with `aria-label`, or a `FieldSet` and `FieldLegend`. Each box is named by its `label`; the parent is "Select all" by default.',
    focus: "Every box is a tab stop, in order.",
    limits: [
      "The parent's first render on the server does not know the items unless the group has `allValues` or the parent has `values`.",
      "The group's `aria-describedby` is read when focus enters the group in some screen readers only; for an error on every box, also mark the boxes with `aria-describedby`.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves to the next box in the group, then out of it." },
    { keys: ["Space"], behaviour: "Toggles the focused item." },
    {
      keys: ["Space"],
      behaviour: "On the parent: from mixed checks every item, from checked clears them, from cleared checks all again.",
    },
  ],
  theming: "Each box is a [checkbox](/components/checkbox) and takes its tokens. Descriptions are `--muted-foreground`.",
  props: {
    CheckboxGroup: {
      value: "The checked items' values, when you control them. Pair it with `onValueChange`.",
      defaultValue: "The checked items' values at the start, when it controls itself.",
      onValueChange: "Called with the new array when an item or a parent is toggled.",
      allValues: "Every item's value, so a parent rendered on the server knows them before the items mount.",
      disabled: "Disables every box in the group.",
      orientation: "`vertical` stacks the items; `horizontal` (default) puts them in a wrapping row.",
      size: "Every box's size: `sm`, `default` or `lg`. Defaults to the provider's `controlSize`.",
      variant: "`filled` fills every unchecked box grey. Defaults to the provider's `fieldVariant`.",
      name: "The form field name of every box; each checked item submits its value under it. A form reset brings back the first value.",
      "aria-invalid": "Marks every box invalid.",
    },
    CheckboxGroupItem: {
      value: "The value the group's array holds while this box is checked.",
      label: "The visible name, drawn beside the box. Leave it out to label the box yourself.",
      description: "A line under the label, read as the box's description.",
      disabled: "Disables this box only.",
    },
    CheckboxGroupParent: {
      values: "The values it checks and clears. Every item of the group by default; disabled items are left out.",
      label: "The visible name. \"Select all\" by default.",
      description: "A line under the label, read as the box's description.",
    },
  },
} satisfies ComponentDoc
