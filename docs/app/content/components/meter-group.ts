import type { ComponentDoc } from "../types.ts"

export default {
  slug: "meter-group",
  title: "Meter group",
  category: "Misc",
  purpose: "Shows several amounts that share one range, such as the parts of a storage quota, side by side on one track.",
  links: {
    apg: { label: "APG Meter", href: "https://www.w3.org/WAI/ARIA/apg/patterns/meter/" },
    spec: "specs/004_full-suite-components.md#meter-group",
  },
  usage: `\`\`\`tsx
<MeterGroup
  aria-label="Storage by type"
  values={[
    { label: "Attachments", value: 16 },
    { label: "Logs", value: 8 },
  ]}
/>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "One segment: the space a site's email uses." },
    { id: "multiple", title: "Multiple", description: "Four kinds of storage share the track, with a legend." },
    { id: "icons", title: "Icons", description: "An icon on each segment replaces its dot in the legend." },
    {
      id: "label-position",
      title: "Label position",
      description: "The legend sits above the track and lists its items in a column.",
    },
    { id: "vertical", title: "Vertical", description: "The track stands up, with the legend beside it." },
    { id: "min-max", title: "Min and max", description: "`max` sets the range, so each segment is its value out of 200." },
    {
      id: "custom-legend",
      title: "Custom legend",
      description: "Cards of your own above the track, with values written in gigabytes.",
    },
  ],
  accessibility: {
    semantics:
      "A `group` of meters: each segment is a `meter` with its value, minimum and maximum. The legend repeats them, so it is hidden from assistive technology.",
    labels:
      "Name the group with `aria-label` or `aria-labelledby`. Each meter is named by its segment's `label`.",
    focus: "A meter group takes no focus and has no keyboard behaviour.",
    limits: [
      "Some older screen readers announce a meter as a progress bar or as plain text with its name and value.",
      "Colour tells the segments apart in the track; the legend's labels name them. Keep the legend, or a custom one, beside the track.",
      "A custom legend you render yourself is read as well as the meters: hide it with `aria-hidden` when it only repeats them.",
    ],
  },
  keyboard: [],
  theming:
    "The track is a 6 px `--border` bar with a 6 px radius; the segments take `--chart-1` to `--chart-5` in turn, or any colour you pass. Legend text is 14 px `--foreground`.",
  props: {
    MeterGroup: {
      role: "Defaults to `group`.",
    },
  },
} satisfies ComponentDoc
