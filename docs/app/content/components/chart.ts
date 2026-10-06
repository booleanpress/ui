import type { ComponentDoc } from "../types.ts"

export default {
  slug: "chart",
  title: "Chart",
  category: "Data",
  purpose: "Draws data as a bar, line or area chart with the package's colours, tooltip and legend.",
  links: {
    spec: "specs/003_moved-components.md#chart",
  },
  peers: ["recharts"],
  usage: `\`\`\`tsx
const config = { sent: { label: "Emails sent", color: "var(--chart-1)" } } satisfies ChartConfig

<ChartContainer config={config} className="h-56 w-full">
  <BarChart data={data}>
    <XAxis dataKey="day" />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="sent" fill="var(--color-sent)" />
  </BarChart>
</ChartContainer>
\`\`\``,
  examples: [
    { id: "bar-chart", title: "Bar chart", description: "Emails sent per day, with a tooltip." },
    { id: "area-chart", title: "Area chart", description: "Delivered against bounced, with a legend and a tooltip." },
    { id: "text-alternative", title: "Text alternative", description: "A chart named as one picture, with a table of the same numbers beneath it." },
  ],
  accessibility: {
    semantics:
      'The chart is an SVG with `role="application"` by default. Nothing in it says what the numbers are.',
    labels:
      "Give every chart a name and a text alternative: a table or a sentence of the finding beside it. Use `role=\"img\"` with `aria-label` and set `accessibilityLayer={false}`.",
    focus:
      "With the accessibility layer on, the chart is a tab stop; the arrow keys move the tooltip between data points.",
    limits: [
      "A chart's numbers have no text alternative unless you write one. The tooltip and legend are visual; a screen-reader user cannot read the values from the SVG.",
      "Colour alone separates series. Add the legend, and use the tooltip's `indicator` (`dot`, `line`, `dashed`) or different line styles, so people who cannot tell the colours apart can still tell the series apart.",
      "The tooltip is a visual overlay shown on hover and from the keyboard. Anything people must read belongs in the table, not only in the tooltip.",
      "The five series colours are tuned for light and dark themes, not for contrast against each other. Do not rely on them for more than three series.",
      "In a right-to-left page the chart is not mirrored: the first data point stays on the left. The tooltip and legend read right to left.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Focuses the chart and shows the tooltip at the first data point." },
    { keys: ["Left Arrow", "Right Arrow"], behaviour: "Moves the tooltip to the previous or next data point, once the chart has focus. The accessibility layer is Recharts' own." },
    { keys: ["Enter"], behaviour: "Shows or hides the tooltip at the current data point." },
  ],
  theming: `Series colours come from the \`--chart-1\` to \`--chart-5\` tokens of \`theme.css\`, set per theme. The container also styles Recharts' grid lines, axis text, tooltip cursor and dots with theme tokens, so a chart needs no colour of its own. The tooltip is the popover surface (\`--popover\`, a \`--border\` edge, \`shadow-md\`).`,
  props: {
    ChartContainer: {
      config: "Names and colours the series by key: `{ sent: { label: \"Emails sent\", color: \"var(--chart-1)\" } }`. Use `theme: { light, dark }` in place of `color` for per-theme values, and `icon` to show an icon in the legend and tooltip.",
      initialDimension: "The width and height drawn before the chart is measured (default 320 by 200). Raise it where the chart renders on the server.",
    },
    ChartTooltipContent: {
      indicator: "The marker beside each value: `dot` (default), `line` or `dashed`.",
      hideLabel: "Hides the heading line (the category, such as the day).",
      hideIndicator: "Hides the marker beside each value.",
      nameKey: "The data key that names each row, when it is not the series key.",
      labelKey: "The data key that gives the heading, when it is not the axis key.",
      labelFormatter: "Formats the heading, for example turns `2026-10-03` into `Sat 3 Oct`.",
      formatter: "Replaces the whole row for a value.",
    },
    ChartLegendContent: {
      hideIcon: "Shows the coloured square, not the series icon.",
      nameKey: "The data key that names each entry, when it is not the series key.",
    },
  },
} satisfies ComponentDoc
