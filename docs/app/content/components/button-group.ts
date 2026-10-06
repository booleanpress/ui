import type { ComponentDoc } from "../types.ts"

export default {
  slug: "button-group",
  title: "Button group",
  category: "Button",
  purpose: "Joins related buttons, or a button and an input, into one connected control.",
  links: {
    spec: "specs/003_moved-components.md#button-group",
  },
  usage: `\`\`\`tsx
<ButtonGroup aria-label="Log period">
  <Button variant="outline">Today</Button>
  <Button variant="outline">7 days</Button>
</ButtonGroup>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Related buttons as one control, named by `aria-label`." },
    { id: "severities", title: "Severities", description: "A split save button in every severity." },
    { id: "raised", title: "Raised", description: "Raised buttons lift the group on one shadow." },
    { id: "rounded", title: "Rounded", description: "Rounded buttons make the group a pill." },
    { id: "text", title: "Text", description: "Text buttons with a severity, joined." },
    { id: "outlined", title: "Outlined", description: "Outlined buttons share one edge." },
    { id: "icon-only", title: "Icon only", description: "Previous and next as icon buttons." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "vertical", title: "Vertical", description: "`orientation=\"vertical\"` stacks the buttons." },
    { id: "split", title: "Split button", description: "A main action and a menu button, divided by a separator." },
    { id: "with-text-and-input", title: "With text and input", description: "A text label and an input join a button in one row." },
    { id: "disabled", title: "Disabled", description: "One disabled button; the others keep working." },
  ],
  accessibility: {
    semantics: 'A `role="group"`. The separator is decorative and hidden.',
    labels: "Name the group with `aria-label` when the buttons share a context. Name every icon-only button and input inside it.",
    focus: "Each child keeps its own tab stop, and the focus ring is never cut off by a neighbour.",
    limits: [
      "The group adds no arrow-key navigation. If you want the toolbar pattern (one tab stop, arrow keys between buttons), use a toolbar or a toggle group instead.",
      "It does not track a selected button. Mark a current choice yourself, for example with `aria-pressed`.",
    ],
  },
  keyboard: [],
  props: {
    ButtonGroup: {
      orientation: "`horizontal` joins the children side by side; `vertical` stacks them.",
    },
    ButtonGroupText: {
      asChild: "Render the child element instead, with this part's classes merged onto it, for a `Label` that sits in the group.",
    },
    ButtonGroupSeparator: {
      orientation: "`vertical` (default) divides side-by-side buttons; use `horizontal` in a vertical group.",
      decorative: "Hides the line from assistive technology (default `true`).",
    },
  },
} satisfies ComponentDoc
