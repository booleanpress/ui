import type { ComponentDoc } from "../types.ts"

export default {
  slug: "kbd",
  title: "Kbd",
  category: "Misc",
  purpose: "Shows a keyboard key, or a combination of keys, in the style of a key cap.",
  links: {
    spec: "specs/003_moved-components.md#kbd",
  },
  usage: `\`\`\`tsx
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
\`\`\`

Kbd only shows a shortcut: it does not register one.`,
  examples: [
    { id: "basic", title: "Basic", description: "Single keys." },
    { id: "group", title: "Group", description: "A combination: two keys with a plus sign between them." },
    { id: "in-text", title: "In text", description: "Keys inside a sentence." },
    { id: "in-button", title: "In a button", description: "A key hint at the end of a button's label." },
  ],
  accessibility: {
    semantics:
      "The native `kbd` element; a combination is a `kbd` of nested `kbd`s. Screen readers read the text as it is.",
    labels:
      "Write \"Ctrl\" and \"K\", not a symbol alone, or add a visually hidden name for symbols. Hide a decorative \"+\" with `aria-hidden`.",
    focus: "Not focusable, and it has no keyboard behaviour of its own.",
    limits: [
      "Showing a shortcut does not make it available: every action behind a shortcut needs a visible control too (WCAG 2.1.4).",
      "Key names differ by platform (Ctrl and Command). The product decides which to show.",
    ],
  },
  keyboard: [],
  theming: "The fill is `--secondary`, the text `--secondary-foreground`, the edge `--border`. In a tooltip it drops the edge and uses `--background` at 20 % on `--background` text.",
} satisfies ComponentDoc
