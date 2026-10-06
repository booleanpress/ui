import type { ComponentDoc } from "../types.ts"

export default {
  slug: "typography",
  title: "Typography",
  category: "Misc",
  purpose: "The type scale: Prose styles Markdown or rich-text HTML; Heading, Text, Blockquote and InlineCode style your own elements.",
  links: {
    spec: "specs/004_full-suite-components.md#typography",
  },
  usage: `\`\`\`tsx
<Heading level={1}>Moving to a new mailer</Heading>
<Text size="lg" tone="muted">What changes, and what stays the same.</Text>
<Prose dangerouslySetInnerHTML={{ __html: html }} />
\`\`\``,
  examples: [
    { id: "prose", title: "Prose", description: "An article: headings, paragraphs, a link, code, bold text and a rule." },
    { id: "headings", title: "Headings", description: "`Heading` at each level, and an `h2` drawn at another size." },
    { id: "text", title: "Text sizes and tones", description: "`Text` in each size and tone." },
    { id: "lists-and-quotes", title: "Lists and quotes", description: "Lists and a quote inside `Prose`, and `Blockquote` on its own." },
    { id: "table-in-prose", title: "Table inside prose", description: "A plain table inside `Prose`." },
  ],
  accessibility: {
    semantics: "Every part renders the native element: `h1` to `h6`, `p`, `blockquote` and `code`. `Prose` styles the elements inside it and changes none.",
    labels: "None of its own: the text is the content.",
    focus: "Nothing takes focus except links inside, which show the focus outline on keyboard focus.",
    limits: [
      "Choose `level` for the page's outline, not for the size: one `h1` per page, no skipped levels. Use `size` for the look.",
      "A table wider than the text overflows it: wrap a wide table in a scrolling element with `tabIndex={0}`, `role=\"region\"` and a name.",
      "A `pre` inside Prose scrolls sideways, but not every browser lets a keyboard focus it to scroll: use CodeBlock for long code.",
      "Links inside Prose are always underlined, unlike the visual target's, so they are not told apart by colour alone.",
      "The `success` tone is the status tags' deep green, not the brighter green of alerts, so it keeps 4.5:1 on the page in both themes; colour alone still says nothing to some readers, so let the words carry the meaning.",
    ],
  },
  keyboard: [],
  props: {
    Heading: {
      asChild: "Render the child element instead (a `DialogTitle`, a link), with the heading's classes merged onto it.",
    },
    Prose: {
      asChild: "Render the child element instead (an `article`), with the prose classes merged onto it.",
    },
  },
  theming:
    "Headings and bold text use `--heading`, running text `--foreground`, muted text and quotes `--muted-foreground`, inline code `--border` behind `--foreground`, links `--primary`. Code uses `font-mono`: set `--font-mono` in your theme for another typeface.",
} satisfies ComponentDoc
