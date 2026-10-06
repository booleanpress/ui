import type { ComponentDoc } from "../types.ts"

export default {
  slug: "input-group",
  title: "Input group",
  category: "Form",
  purpose: "Puts icons, text, keys or buttons inside the border of an input or textarea.",
  links: {
    spec: "specs/003_moved-components.md#input-group",
  },
  usage: `\`\`\`tsx
<InputGroup>
  <InputGroupInput aria-label="Search the email log" />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
</InputGroup>
\`\`\``,
  examples: [
    { id: "attached", title: "Attached cells and actions", description: "`attached` gives icons, text and buttons their own cells inside the joined field." },
    { id: "icon-arrangements", title: "Icon arrangements", description: "Icons at both ends, a loading indicator, a clear action and small and large fields." },
    { id: "icon", title: "Icon", description: "An icon before the text; clicking it focuses the input." },
    { id: "text", title: "Prefix and suffix", description: "`InputGroupText` at both ends holds the fixed parts of an address." },
    { id: "multiple", title: "Multiple addons", description: "Two addons on one side become two cells." },
    { id: "button", title: "Button", description: "An icon button at the end, named with `aria-label`." },
    {
      id: "checkbox-radio",
      title: "Checkbox and radio",
      description: "A `Checkbox` or `RadioGroupItem` in an addon sits as a cell beside the text.",
    },
    { id: "select", title: "Select", description: "A `Select` in an addon sits as a cell with no border of its own." },
    { id: "textarea", title: "Textarea with a toolbar", description: "A `block-end` addon holds a counter and a send button below the text." },
    { id: "sizes", title: "Sizes", description: "`size` on the group scales the control, addons and buttons." },
    { id: "filled", title: "Filled", description: "`variant=\"filled\"` fills the whole group." },
    { id: "disabled", title: "Disabled", description: "`data-disabled=\"true\"` dims the addons; `disabled` on the input stops editing." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` on the input draws the error border around the whole group." },
  ],
  accessibility: {
    semantics: "The group and each addon are `group`s; the control is a native `input` or `textarea`, and `InputGroupButton` is a `button`.",
    labels: "Name the control with `aria-label` or a `Label`, as addon text does not name it. Name icon-only buttons with `aria-label`.",
    focus: "Focus stays on the control or a button; the group's border shows focus.",
    limits: ["The groups have no accessible name. Name the control, not the group."],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves between the control and any buttons in the addons, in document order (the order of the JSX, not the visual order)." },
    {
      keys: ["Enter", "Space"],
      behaviour: "Activates a focused `InputGroupButton`. On the clear button of a `clearable` input: empties the input and moves the focus back to it.",
    },
  ],
  props: {
    InputGroup: {
      attached: "Separates inline addons into cells and stretches addon buttons to the full field height. Defaults to false for inset icon fields.",
      size: "`sm` (26 px), `default` (34 px) or `lg` (42 px), for the group and everything in it. Defaults to the provider's `controlSize`.",
      variant: "`default` (the white `--field` fill) or `filled` (the grey `--field-filled` fill). Defaults to the provider's `fieldVariant`.",
    },
    InputGroupInput: {
      clearable: "Shows a × button after the text while the input has a value.",
    },
    InputGroupAddon: {
      align: "Where it sits: `inline-start`, `inline-end` (along the text), `block-start` or `block-end` (above or below it).",
    },
    InputGroupButton: {
      size: "`xs` (24 px, default), `sm` (26 px), `icon-xs` or `icon-sm` for a square icon-only button. Each is 4 px smaller in an `sm` group and 4 px larger in an `lg` group.",
      variant: "A `Button` variant. Defaults to `ghost`.",
    },
  },
} satisfies ComponentDoc
