import type { ComponentDoc } from "../types.ts"

export default {
  slug: "separator",
  title: "Separator",
  category: "Panel",
  purpose: "Draws a thin line that divides content, horizontally or vertically.",
  links: {
    radix: { label: "Radix Separator", href: "https://www.radix-ui.com/primitives/docs/components/separator" },
    spec: "specs/002_pilot-mini-specs.md#input-label-field-separator-skeleton",
  },
  usage: `\`\`\`tsx
<Separator className="my-4" />
\`\`\``,
  examples: [
    { id: "horizontal", title: "Horizontal", description: "A line between a heading and the text below it." },
    { id: "dashed-and-dotted", title: "Dashed and dotted", description: "`variant` draws the line solid, dashed or dotted." },
    { id: "vertical", title: "Vertical", description: "Lines between inline items; the parent row sets the height." },
    { id: "with-text", title: "With text", description: "A word such as \"or\" inside the line." },
    { id: "alignment", title: "Alignment", description: "`align` puts the content at the start, centre or end of the line." },
    { id: "vertical-with-text", title: "Vertical with text", description: "A vertical line with \"or\" between two columns." },
    { id: "semantic", title: "Semantic", description: "`decorative={false}` tells assistive technology the line is a separator." },
  ],
  accessibility: {
    semantics: 'By default the line is decorative and hidden from assistive technology. With `decorative={false}` it is a `separator`.',
    labels:
      "A line needs no name. A separator with `decorative={false}` and content is named by that content.",
    focus: "It is not focusable and does nothing from the keyboard.",
    limits: [
      "The line is 1 px of `--border`. It is a visual cue only; never rely on it alone to show that two pieces of content are separate.",
    ],
  },
  keyboard: [],
  props: {
    Separator: {
      orientation: "`horizontal` (default) draws a full-width line; `vertical` a full-height one.",
      decorative: "`true` (default) hides the line from assistive technology; `false` exposes it as `role=\"separator\"`.",
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
    },
  },
} satisfies ComponentDoc
