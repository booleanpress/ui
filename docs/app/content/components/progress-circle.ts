import type { ComponentDoc } from "../types.ts"

export default {
  slug: "progress-circle",
  title: "Progress circle",
  category: "Misc",
  purpose: "A ring that fills to show how far a task has got, or turns while work of unknown length runs, where a bar has no room.",
  links: {
    radix: { label: "Radix Progress", href: "https://www.radix-ui.com/primitives/docs/components/progress" },
    spec: "specs/004_full-suite-components.md#progress-circle",
  },
  usage: `\`\`\`tsx
<ProgressCircle value={75} showValue aria-label="Storage used" />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A ring at 75 %." },
    { id: "indeterminate", title: "Indeterminate", description: "Without a `value`, a quarter of the ring turns." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "with-label", title: "With a label", description: "`showValue` writes the percentage in the middle." },
    { id: "colours", title: "Colours", description: "Status colours, each named for what it counts." },
  ],
  accessibility: {
    semantics:
      'A `div` with `role="progressbar"` that reports its value and a text version of it. With no value, it reports no value and counts as indeterminate.',
    labels: "A name is required: `aria-label`, or `aria-labelledby` pointing at visible text. Name what is measured, such as \"Monthly sending quota\".",
    focus: "A progress circle takes no focus and has no keyboard behaviour, so it has no keyboard rows.",
    limits: [
      "It is not a live region: screen readers do not announce each change. Announce milestones in a live region the page owns.",
      "The ring alone is not a precise reading, and its colour carries no meaning by itself: put the number or the state in text when it matters.",
      "The turn of the indeterminate ring and the slide to a new value end under `prefers-reduced-motion` (`theme.css`): the ring rests with its quarter arc at the top.",
    ],
  },
  keyboard: [],
  theming: "The track is `--border`; the filled arc is the text colour, `--primary` by default or `--success`, `--info`, `--warning` and `--destructive`; the value in the middle is `--foreground`, 10 px semibold (12 px medium at `lg`). Set another arc colour with a `text-*` class, and another size with `size-*` (the ring scales with it).",
  props: {
    ProgressCircle: {
      value: "The progress from 0 to `max`; a value outside the range is clamped to it. Leave it out for the indeterminate ring.",
      max: "The top of the range. 100 by default, and 100 when it is not a positive number.",
      getValueLabel: "Returns the value's text from the value and the max: the ring's `aria-valuetext`, and the text in the middle with `showValue`. A percentage in the provider's locale by default.",
    },
  },
} satisfies ComponentDoc
