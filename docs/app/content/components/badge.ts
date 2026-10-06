import type { ComponentDoc } from "../types.ts"

export default {
  slug: "badge",
  title: "Badge",
  category: "Misc",
  purpose: "A small label that shows a status, a count or a category next to other content.",
  links: {
    spec: "specs/002_pilot-mini-specs.md#badge",
  },
  usage: `\`\`\`tsx
<p>
  ada@example.com <Badge variant="success">Delivered</Badge>
</p>
<Badge count={128} max={99} severity="danger" />
<Badge dot severity="success" aria-label="Connected" />
\`\`\``,
  examples: [
    { id: "variants", title: "Variants", description: "The neutral variants." },
    { id: "severities", title: "Severities", description: "`severity` makes a solid label in each colour." },
    { id: "sizes", title: "Sizes", description: "Small, default and large, for a label, a tag and a count." },
    { id: "count", title: "Count", description: "`count` draws a round number; `max` caps it at `99+`." },
    { id: "dot", title: "Dot", description: "`dot` draws a small dot, named with `aria-label`." },
    { id: "status-dot", title: "Status", description: "A dot beside the word it stands for." },
    { id: "in-button", title: "In a button", description: "A count inside a button shrinks to fit and joins the button's name." },
    { id: "status", title: "Status tags", description: "The four status variants in a delivery list, each with its word." },
    { id: "pill", title: "Pill", description: "`rounded` makes a tag a pill." },
    { id: "with-icon", title: "With an icon", description: "An icon before the text." },
    { id: "as-link", title: "As a link", description: "`asChild` puts the badge's look on a link." },
  ],
  accessibility: {
    semantics: "A `span` with no role, so its text is read in the flow of the sentence. A named dot is `role=\"img\"`.",
    labels:
      "A status badge must say the status in words, not colour alone. Name a dot with `aria-label`, and let the words around a count say what it counts.",
    focus:
      "A badge is not focusable. Made a link with `asChild`, it is in the tab order like any link.",
    limits: [
      "A badge does not announce a change to its text. For a status that changes while people watch, put it in a live region the page owns.",
      "The visual target's solid success, info, warning and help fills carry white text below 4.5:1 in the light theme, and its count text is 10 px; `tests/contrast.test.js` lists the pairs.",
    ],
  },
  keyboard: [],
  theming: `\`default\` and \`secondary\` fill with \`--secondary\`. \`success\`, \`warning\`, \`info\` and \`destructive\` fill with their pale \`-tag\` token, each with its \`-tag-foreground\` token for the text. A \`severity\` fills with the solid tokens Button uses: \`--primary\`, \`--secondary\`, \`--success\`, \`--info-solid\`, \`--warning-solid\`, \`--help\`, \`--destructive\` and \`--contrast\`, each with its \`-foreground\`. \`bui-contrast\` checks every pair.`,
  props: {
    Badge: {
      variant: "The look: `default`, `secondary`, `outline`, `ghost`, `link` or, for a status, `success`, `warning`, `info`, `destructive`.",
      asChild: "Render the child element instead (usually a link), with the badge's classes merged onto it.",
      severity: "A solid fill: `primary`, `secondary`, `success`, `info`, `warning`, `help`, `danger` or `contrast`. It replaces the variant's colours; set as `data-severity`.",
      size: "`sm`, `default` or `lg`: 18, 22 and 26 px for a tag, 18, 20 and 24 px for a solid label or a count. A dot stays 8 px.",
      rounded: "A pill.",
      dot: "An 8 px dot with no text. It needs `aria-label` (or `aria-labelledby`), or `aria-hidden`.",
    },
  },
} satisfies ComponentDoc
