import type { ComponentDoc } from "../types.ts"

export default {
  slug: "description-list",
  title: "Description list",
  category: "Data",
  purpose: "Shows pairs of labels and values, such as a record's settings, in one to three columns.",
  links: {
    spec: "specs/004_full-suite-components.md#description-list",
  },
  usage: `\`\`\`tsx
<DescriptionList>
  <DescriptionItem label="Provider">Amazon SES</DescriptionItem>
  <DescriptionItem label="From address">no-reply@acme.example</DescriptionItem>
</DescriptionList>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A mailer's settings, each label above its value." },
    { id: "horizontal", title: "Horizontal", description: "`orientation=\"horizontal\"` puts each label beside its value." },
    { id: "columns", title: "Columns", description: "`columns` sets items per row, and `span` stretches one item across them." },
    {
      id: "bordered",
      title: "Bordered",
      description: "`bordered` draws the list as a table, with the labels beside or above the values.",
    },
    { id: "with-actions", title: "With actions", description: "`action` adds a copy button at the end of each setting." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
  ],
  accessibility: {
    semantics:
      "A description list (`dl`) in which each label is paired with its value, so a screen reader reads them together.",
    labels:
      "The list takes no name of its own, so put a heading above it. Name every action after its item, such as \"Copy SMTP host\".",
    focus: "The list takes no focus. Actions are tab stops in reading order.",
    limits: [
      "The columns are visual only: a screen reader reads the items in source order, row by row.",
      "Long values wrap. Very long words, such as keys or addresses, break at any character rather than overflow.",
    ],
  },
  keyboard: [],
  theming:
    "Labels are `--muted-foreground`, values `--foreground`. Bordered lists draw 1 px `--border` lines with a 6 px radius, and the labels sit on `--subtle`.",
} satisfies ComponentDoc
