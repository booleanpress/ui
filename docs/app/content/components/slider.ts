import type { ComponentDoc } from "../types.ts"

export default {
  slug: "slider",
  title: "Slider",
  category: "Form",
  purpose: "Chooses a number, or a range between two numbers, by dragging a handle along a track.",
  links: {
    radix: { label: "Radix Slider", href: "https://www.radix-ui.com/primitives/docs/components/slider" },
    apg: { label: "APG Slider", href: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/" },
    spec: "specs/004_full-suite-components.md#slider",
  },
  usage: `\`\`\`tsx
<Label id="rate">Sending rate</Label>
<Slider defaultValue={[50]} aria-labelledby="rate" />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "One handle, from 0 to 100." },
    { id: "handles-distance", title: "Handles distance", description: "`minStepsBetweenThumbs` keeps the two handles apart." },
    { id: "filter", title: "Filter", description: "Three sliders adjust the brightness, contrast and saturation of a preview." },
    { id: "value-change", title: "Value change", description: "`onValueChange` reports every move; `onValueCommit` reports the final value." },
    { id: "step", title: "Step", description: "`step={20}` moves the value in steps of 20." },
    { id: "range", title: "Range", description: "Two values make a range with two handles." },
    { id: "vertical", title: "Vertical", description: "`orientation=\"vertical\"` stands the slider upright." },
    { id: "controlled", title: "Controlled", description: "`value` and `onValueChange` keep the value in your state and show it beside the label." },
    { id: "with-input", title: "With input", description: "A number field and the slider share one value." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "disabled", title: "Disabled", description: "`disabled` stops changes and takes the handles out of the tab order." },
  ],
  accessibility: {
    semantics:
      'Each handle is a `slider` that reports its value, minimum and maximum. The track and range are decoration.',
    labels:
      "Pass `aria-labelledby` or `aria-label` to the slider; it names every handle. A range adds \"Minimum\" and \"Maximum\".",
    focus:
      "Each handle is a tab stop, and a disabled slider has none. The arrow keys move the value.",
    limits: [
      "The value is announced as a bare number. Radix does not take a text form of the value (`aria-valuetext`), so show the unit next to the slider.",
      "The handles cannot be disabled one at a time; `disabled` covers the whole slider.",
      "A slider is hard to set to an exact value by pointer; pair it with an input when the exact number matters.",
    ],
  },
  keyboard: [
    { keys: ["→", "↑"], behaviour: "Increases the value by one step (→ decreases it in right-to-left pages)." },
    { keys: ["←", "↓"], behaviour: "Decreases the value by one step (← increases it in right-to-left pages)." },
    { keys: ["Shift", "→"], behaviour: "With any arrow key, moves ten steps that way." },
    { keys: ["Page Up", "Page Down"], behaviour: "Increases or decreases the value by ten steps." },
    { keys: ["Home", "End"], behaviour: "Sets the minimum or the maximum." },
    { keys: ["Tab"], behaviour: "Moves to the next handle, then out of the slider." },
  ],
  props: {
    Slider: {
      value: "The values, one per handle, when you control them. Pair it with `onValueChange`.",
      defaultValue: "The values at the start, one per handle, when it controls itself. `[50]` by default.",
      onValueChange: "Called with the new values while the handle moves.",
      onValueCommit: "Called with the values once, when a drag or a key press ends.",
      min: "The lowest value. 0 by default.",
      max: "The highest value. 100 by default.",
      step: "The amount each move changes the value by. 1 by default.",
      minStepsBetweenThumbs: "The fewest steps a range's handles keep between them. 0 by default.",
      orientation: "`horizontal` (default) or `vertical`.",
      inverted: "Whether the value runs the other way along the track.",
      disabled: "Ignores the pointer and the keyboard, and removes the handles from the tab order.",
      name: "The form field name; the value is submitted with the form.",
      dir: "The reading direction. The provider's `dir` by default.",
      "aria-label": "Names the handles, when there is no visible label.",
      "aria-labelledby": "The id of the visible label that names the handles.",
    },
  },
  theming:
    "The track is `--border`, the filled range `--primary`. The handle is a `--border` ring round a knob in `--background`; focus is `--ring`.",
} satisfies ComponentDoc
