import type { ComponentDoc } from "../types.ts"

export default {
  slug: "progress",
  title: "Progress",
  category: "Misc",
  purpose: "Shows how far a task has got, such as an import or a setup, or that work of unknown length is under way.",
  links: {
    radix: { label: "Radix Progress", href: "https://www.radix-ui.com/primitives/docs/components/progress" },
    spec: "specs/003_moved-components.md#progress",
  },
  usage: `\`\`\`tsx
<Progress value={60} aria-label="Import progress" />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A bar at 60 %." },
    { id: "value", title: "Value", description: "`showValue` writes the percentage inside the bar." },
    { id: "controlled", title: "Controlled", description: "Your page owns the value and moves it a step at a time." },
    {
      id: "formatter",
      title: "Formatter",
      description: "`getValueLabel` shows a count such as \"512 of 1,024 sent\" instead of a percentage.",
    },
    { id: "with-label", title: "With a label", description: "A visible label and a count, tied to the bar with `aria-labelledby`." },
    { id: "indeterminate", title: "Indeterminate", description: "Without a `value`, a bar slides across while the length of the work is unknown." },
    { id: "steps", title: "Steps", description: "`steps={4}` draws four segments; Back and Next move between steps." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "complete", title: "Complete", description: "At 100 the bar is complete, and the page says what finished." },
  ],
  accessibility: {
    semantics:
      'A `div` with `role="progressbar"` that reports its value and a text version of it. With no value, it reports no value and counts as indeterminate.',
    labels: "Name every bar, with `aria-label` or `aria-labelledby`. Put the number in visible text beside it as well.",
    focus: "A progress bar takes no focus and has no keyboard behaviour, so it has no keyboard rows.",
    limits: [
      "A progress bar is not a live region: screen readers do not announce each change. Announce milestones (\"Import finished\") in a live region the page owns.",
      "The indeterminate bar loops for as long as it is shown; screen readers hear only that the bar is busy. Say in text what is happening, and replace the bar when the work ends.",
      "The slide to a new value is a `transition-all`, and the indeterminate bar an animation. `theme.css` ends both under `prefers-reduced-motion`: the bar jumps to its value, and the indeterminate bar rests in the middle of the track.",
      "Segments are drawn from the same value and are not separate progress bars; a screen reader hears one value, so give the step in `getValueLabel`.",
    ],
  },
  keyboard: [],
  theming: "The track is `--border`, the indicator `--primary`, the text inside it `--primary-foreground` (10 px semibold, 12 px at `lg`); the bar is 18 px tall with a 6 px radius, and fills from the inline start. Each segment of a `steps` bar has its own track and the same radius, 4 px apart. Override with `className` (on the track) or with the `data-slot` selectors: `progress-indicator`, `progress-value`, `progress-step` and its `progress-step-indicator`.",
  props: {
    Progress: {
      value: "The progress from 0 to `max` (100 by default); a value outside the range is clamped to it. Also sets `aria-valuenow` and the indicator's position. Leave it out (or pass `null`) for the indeterminate bar.",
      max: "The top of the range: the fill is `value` out of `max`, and it sets `aria-valuemax` and Radix's `complete` state. 100 by default, and 100 when it is not a positive number.",
      getValueLabel: "Returns the value's text from the value and the max, such as \"420 of 700\": the bar's `aria-valuetext`, and the text drawn inside it with `showValue`. A percentage in the provider's locale by default.",
    },
  },
} satisfies ComponentDoc
