import type { ComponentDoc } from "../types.ts"

export default {
  slug: "card",
  title: "Card",
  category: "Panel",
  purpose: "Groups related content and actions in one raised block.",
  links: {
    spec: "specs/002_pilot-mini-specs.md#card",
  },
  usage: `\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Primary mailer</CardTitle>
    <CardDescription>Amazon SES</CardDescription>
  </CardHeader>
  <CardContent>Healthy</CardContent>
</Card>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A header with an action, some content and a footer button." },
    { id: "simple", title: "Statistic", description: "A header and content only, showing one number." },
    { id: "with-dividers", title: "With dividers", description: "Lines between the header, content and footer." },
  ],
  accessibility: {
    semantics: "Plain elements with no role, so a card is not a landmark or a group.",
    labels: "`CardTitle` is not a heading. Where the card starts a section, put an `h2` or `h3` inside it. Name icon-only buttons with `aria-label`.",
    focus: "A card has no tab stop; buttons and links inside it follow reading order. For a clickable card, use a real link or button inside it.",
    limits: [
      "The title is not a heading by default, so a screen-reader user cannot jump from card to card by heading. Add the heading element yourself where that navigation matters.",
      "A card has no state of its own (selected, loading, disabled). Show such a state with content or a `Badge`, never by colour alone.",
    ],
  },
  keyboard: [],
  theming: "`bg-card` and `text-card-foreground` set the surface, and `shadow-sm` lifts it; the card has no border of its own. The dividers you add with `border-b` and `border-t` are `--border`.",
} satisfies ComponentDoc
