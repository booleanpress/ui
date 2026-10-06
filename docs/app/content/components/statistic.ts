import type { ComponentDoc } from "../types.ts"

export default {
  slug: "statistic",
  title: "Statistic",
  category: "Data",
  purpose: "Shows a number that matters, such as emails sent today, with its label and how it has changed.",
  links: {
    spec: "specs/004_full-suite-components.md#statistic",
  },
  usage: `\`\`\`tsx
<Statistic
  label="Emails sent today"
  value={sent}
  trend="up"
  trendValue={0.12}
  helpText="since yesterday"
/>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A label and a number, written in the provider's locale." },
    { id: "currency", title: "Currency", description: "`format=\"currency\"` with a `currency` code." },
    { id: "compact", title: "Compact", description: "`compact` shortens large numbers, and `percent` writes a fraction as a percentage." },
    {
      id: "trend",
      title: "Trend",
      description: "`trend` and `trendValue` add an arrow and the change; `invertTrendColor` makes a fall green.",
    },
    { id: "with-icon", title: "With icon", description: "An `icon` in a circle, on a card." },
    { id: "group", title: "Group", description: "`StatisticGroup` lays several statistics out in a row that wraps." },
    { id: "loading", title: "Loading", description: "`loading` shows a placeholder while the figures load." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
  ],
  accessibility: {
    semantics:
      "A description list: the label is a `dt` and the value a `dd`, so a screen reader pairs them. The trend and help text are a second `dd` of the same label.",
    labels:
      "The arrow is hidden; screen readers hear text such as \"Up 12.4%\" instead. The icon is decorative, and a loading statistic is marked busy.",
    focus: "A statistic takes no focus.",
    limits: [
      "Colour says whether a change is good; the words say only up or down. Say in `helpText` when the direction alone could mislead.",
      "A value that updates live is not announced. Wrap the statistic in your own `aria-live` region if people must hear changes.",
    ],
  },
  keyboard: [],
  theming:
    "The label is `--muted-foreground`, the value `--foreground` in bold. A rise is `--success-tag-foreground` and a fall `--destructive-tag-foreground`, the deep text colours of the status tags, which keep 4.5:1 on the page and on the card. The card is `--card` with a `--border` edge, a 12 px radius and a small shadow; the icon circle is `--secondary` unless `iconClassName` says otherwise.",
  props: {
    Statistic: {
      size: "`sm`, `default` or `lg`: a 16, 18 or 24 px value. Defaults to the provider's `controlSize`.",
    },
  },
} satisfies ComponentDoc
