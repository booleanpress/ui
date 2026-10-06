import type { ComponentDoc } from "../types.ts"

export default {
  slug: "knob",
  title: "Knob",
  category: "Form",
  purpose: "Chooses a number by turning a dial, with the value in its middle.",
  links: {
    apg: { label: "APG Slider", href: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/" },
    spec: "specs/004_full-suite-components.md#knob",
  },
  usage: `\`\`\`tsx
<Knob defaultValue={50} aria-label="Sending rate" />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A dial from 0 to 100, set to 50." },
    { id: "min-max", title: "Min and max", description: "A range from -50 to 50, with the arc starting at zero." },
    { id: "step", title: "Step", description: "The value moves in steps, by key and by drag." },
    { id: "value-template", title: "Value template", description: "`formatValue` shows and announces the value as a percentage." },
    { id: "stroke", title: "Stroke width", description: "A thinner arc." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    {
      id: "colours",
      title: "Colours",
      description: "Theme colours for the value and the track.",
    },
    { id: "controlled", title: "Controlled", description: "The value is also changed by two buttons." },
    { id: "read-only", title: "Read only", description: "The dial stays focusable and announced, but cannot change." },
    { id: "disabled", title: "Disabled", description: "The dial is dimmed and skipped by Tab." },
  ],
  accessibility: {
    semantics:
      'The dial is a `role="slider"` with its value, minimum and maximum; `formatValue` sets the text that is announced.',
    labels: "Name it with `aria-label` or `aria-labelledby`. Put a hint or an error in `aria-describedby`.",
    focus:
      "The dial is one tab stop, and dragging it focuses it so the keys continue from there.",
    limits: [
      "The dial turns clockwise to raise the value in every reading direction, so → and ↑ raise it in right-to-left pages too.",
      "A drag is hard to stop on an exact value; the arrow keys, or a number field beside it, are exact.",
      "Colours given to `valueColor`, `rangeColor` or `textColor` are yours to check for contrast against the page.",
    ],
  },
  keyboard: [
    { keys: ["→", "↑"], behaviour: "Raises the value by one step." },
    { keys: ["←", "↓"], behaviour: "Lowers the value by one step." },
    { keys: ["Shift", "→"], behaviour: "With any arrow key, moves ten steps that way." },
    { keys: ["Page Up", "Page Down"], behaviour: "Raises or lowers the value by ten steps." },
    { keys: ["Home", "End"], behaviour: "Sets the minimum or the maximum." },
  ],
  theming:
    "The arc is `--border`, the value's arc `--primary` and the text `--muted-foreground`; `valueColor`, `rangeColor` and `textColor` set them as the variables `--knob-value`, `--knob-range` and `--knob-text`. Focus is `--ring`. A disabled knob is drawn at 60% opacity.",
  props: {
    Knob: {
      value: "The value, when you control it. Pair it with `onValueChange`.",
      defaultValue: "The value at the start, when it controls itself. `min` by default.",
      onValueChange: "Called with the new value while it changes.",
      onValueCommit: "Called with the value once a drag or a key press ends.",
      min: "The lowest value. 0 by default.",
      max: "The highest value. 100 by default.",
      step: "The amount each move changes the value by. 1 by default.",
      size: "`sm` is 80 px, `default` 100 px, `lg` 150 px. Defaults to the provider's `controlSize`.",
      strokeWidth: "The arc's thickness, in hundredths of the dial's width, from 1 to 20. 14 by default.",
      formatValue: "Turns the value into the text in the middle and the announced value.",
      showValue: "Shows the value in the middle. True by default.",
      valueColor: "The colour of the value's arc. `--primary` by default.",
      rangeColor: "The colour of the rest of the arc. `--border` by default.",
      textColor: "The colour of the value text. `--muted-foreground` by default.",
      readOnly: "Keeps the dial focusable and announced but fixed.",
      disabled: "Dims the dial and takes it out of the tab order.",
      name: "The form field name; the value is submitted with the form, and a form reset brings back the first value.",
      "aria-label": "Names the dial, when there is no visible label.",
      "aria-labelledby": "The id of the visible label that names the dial.",
    },
  },
} satisfies ComponentDoc
