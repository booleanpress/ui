import type { ComponentDoc } from "../types.ts"

export default {
  slug: "segmented-control",
  title: "Segmented control",
  category: "Form",
  purpose: "Chooses one of a few options drawn as joined segments, such as a view or a period.",
  links: {
    radix: { label: "Radix Radio Group", href: "https://www.radix-ui.com/primitives/docs/components/radio-group" },
    apg: { label: "APG Radio Group", href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/" },
    spec: "specs/004_full-suite-components.md#segmented-control",
  },
  usage: `\`\`\`tsx
<SegmentedControl defaultValue="list" aria-label="Ticket view">
  <SegmentedControlItem value="list">List</SegmentedControlItem>
  <SegmentedControlItem value="board">Board</SegmentedControlItem>
</SegmentedControl>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Three views; a raised plate slides to the chosen one." },
    { id: "with-icons", title: "With icons", description: "An icon before each label." },
    { id: "icon-only", title: "Icon only", description: "Icons alone, each segment named with `aria-label`." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "fluid", title: "Fluid", description: "`fluid` fills the container, and the segments share it equally." },
    {
      id: "disabled",
      title: "Disabled",
      description: "`disabled` on the control stops every segment; on one segment, only that one.",
    },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
  ],
  accessibility: {
    semantics:
      'A `radiogroup` of `radio` buttons. The sliding plate is decoration and is hidden from screen readers.',
    labels:
      "Name the control with `aria-label` or `aria-labelledby`. Each segment is named by its text, or by `aria-label` when it shows only an icon.",
    focus:
      "The control is one tab stop, on the chosen segment or the first. The arrow keys move between segments.",
    limits: [
      "Equal segments take the width of the widest; keep labels short, or the bar grows with the longest one. Where the container is narrower than that, the segments stay equal: a label of several words wraps, and a single word too long for its segment is cut off at its end.",
      "The plate slides only between segments given straight as children.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves to the chosen segment, then out of the control." },
    { keys: ["→", "↓"], behaviour: "Chooses the next segment, from the last back to the first; → goes the other way in right-to-left pages." },
    { keys: ["←", "↑"], behaviour: "Chooses the previous segment, from the first round to the last; ← goes the other way in right-to-left pages." },
    { keys: ["Space"], behaviour: "Chooses the focused segment when it is not chosen yet." },
  ],
  theming:
    "The bar is `--muted` (`--background` in dark) with a 1px edge of its own colour; the chosen segment's plate is `--background` (`--muted` in dark) with a faint shadow, and its text `--accent-foreground`. Other segments are `--muted-foreground`, `--secondary-hover-foreground` under the pointer. The plate slides over `--bui-duration-base`, and not at all with reduced motion. Disabled takes `--field-disabled` and `--field-disabled-foreground`; invalid the `--invalid` edge.",
  props: {
    SegmentedControl: {
      value: "The chosen segment's value, when you control it. Pair it with `onValueChange`.",
      defaultValue: "The chosen segment's value at the start, when it controls itself.",
      onValueChange: "Called with the chosen segment's value.",
      size: "`sm`, `default` or `lg`: 12, 14 or 16 px text. Defaults to the provider's `controlSize`.",
      fluid: "Fills the container; the segments share it equally.",
      disabled: "Disables every segment.",
      name: "The form field name; the chosen value is submitted with the form.",
      required: "The form cannot be submitted until a segment is chosen.",
      dir: "The reading direction. The provider's `dir` by default.",
      loop: "Whether the arrow keys wrap from the last segment to the first. True by default.",
      "aria-invalid": "Draws the `--invalid` edge round the bar.",
    },
    SegmentedControlItem: {
      value: "The value the control holds while this segment is chosen.",
      disabled: "Takes this segment out of the choice.",
      "aria-label": "Names a segment that shows an icon alone.",
    },
  },
} satisfies ComponentDoc
