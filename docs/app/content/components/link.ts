import type { ComponentDoc } from "../types.ts"

export default {
  slug: "link",
  title: "Link",
  category: "Misc",
  purpose: "Takes the reader to another page or place: a text link in the primary colour, underlined on hover.",
  links: {
    radix: { label: "Radix Slot", href: "https://www.radix-ui.com/primitives/docs/utilities/slot" },
    apg: { label: "APG Link", href: "https://www.w3.org/WAI/ARIA/apg/patterns/link/" },
    spec: "specs/004_full-suite-components.md#link",
  },
  usage: `\`\`\`tsx
<Link href="https://example.com/docs" external>
  SMTP setup guide
</Link>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A link in the primary colour, underlined on hover." },
    { id: "external", title: "External", description: "`external` adds an arrow, opens a new tab and tells screen readers so." },
    { id: "muted", title: "Muted", description: "A quieter link for footers and secondary places." },
    { id: "destructive", title: "Destructive", description: "A link that leads to removing something." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "in-a-paragraph", title: "In a paragraph", description: "The link takes the paragraph's size, and `underline=\"always\"` marks it without colour." },
    { id: "as-router-link", title: "As a router link", description: "`asChild` puts the look on your router's link and keeps its navigation." },
    { id: "disabled", title: "Disabled", description: "A disabled link has no address, with a note saying why." },
  ],
  accessibility: {
    semantics:
      "A native `<a href>`, or the element passed with `asChild`. A disabled link has no address and sets `aria-disabled`.",
    labels:
      "Its text is its name: say where it goes (\"SMTP setup guide\", not \"click here\"). An external link adds \"(opens in a new tab)\".",
    focus:
      "It is in the tab order. A disabled link is skipped by Tab.",
    limits: [
      "Inside running text, the primary colour differs too little from the body text to mark a link by colour alone (WCAG 1.4.1): use `underline=\"always\"` there.",
      "With `asChild`, `disabled` cannot remove the child's own address or stop a router's click handler: it sets `aria-disabled`, takes the link out of the tab order and ignores the pointer.",
      "Browsers show a visited colour only for addresses in the person's history, and only the colour can change; it has no example here because it depends on each reader's history.",
    ],
  },
  keyboard: [{ keys: ["Enter"], behaviour: "Follows the link." }],
  props: {
    Link: {
      asChild: "Render the child element instead (a router's link), with the link's look and behaviour merged onto it.",
      variant: "The colour: `default` (the primary colour), `muted` or `destructive`.",
      underline: "`hover` (default) underlines on hover only; `always` keeps the underline, for links inside running text.",
      size: "`sm` 12/18, `default` 14/21, `lg` 16/24. Left out, the link takes the size of the text around it.",
      visited: "Colours a link to a visited address purple.",
    },
  },
  theming: "The colours are `--primary`, `--muted-foreground` and `--destructive-strong`, with the underline at 40% until hover; visited links take `--help-active`.",
} satisfies ComponentDoc
