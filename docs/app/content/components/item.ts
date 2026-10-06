import type { ComponentDoc } from "../types.ts"

export default {
  slug: "item",
  title: "Item",
  category: "Misc",
  purpose: "A flexible row with media, a title, a description and actions, for settings, lists and cards.",
  links: {
    spec: "specs/003_moved-components.md#item",
  },
  usage: `\`\`\`tsx
<Item variant="outline">
  <ItemContent>
    <ItemTitle>Primary mailer</ItemTitle>
    <ItemDescription>Sends through smtp.example.com on port 587.</ItemDescription>
  </ItemContent>
</Item>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "A title and a description in an outlined item." },
    { id: "variants", title: "Variants", description: "`default`, `outline` and `muted`." },
    { id: "with-media-actions", title: "With media and actions", description: "An icon tile, a title with a badge, and a button." },
    { id: "group", title: "Group", description: "Items in a group with separators between them." },
    { id: "as-link", title: "As a link", description: "`asChild` makes the whole row one link." },
  ],
  accessibility: {
    semantics:
      "Plain `div`s with no roles, and a `p` for the description. For a real list, put the items in a `ul` and `li` with `asChild`.",
    labels: "The title is the visible name; a link made with `asChild` is named by its content.",
    focus: "An item is not focusable unless it is a link or contains a control.",
    limits: [
      "`ItemDescription` keeps two lines (`line-clamp-2`) and cuts the rest with an ellipsis, so the full text is not available to sighted users: keep descriptions short.",
      "Without a list role, a screen reader does not announce how many items a group has.",
    ],
  },
  keyboard: [],
  theming: "`outline` uses `--border` and `muted` the `--muted` fill. A link item takes the `--accent` fill and `--accent-foreground` text on hover (`--secondary-hover` on a muted item). The icon tile is `--secondary`.",
  props: {
    Item: {
      variant: "`default` (no frame), `outline` (border) or `muted` (tinted fill).",
      size: "`default` (0.625rem by 0.875rem padding) or `sm` (0.25rem by 0.625rem, a tighter row).",
      asChild: "Render the child element instead, usually a link, with the item's classes merged onto it.",
    },
    ItemMedia: {
      variant: "`default` (bare), `icon` (a 32 px tile on the secondary fill) or `image` (a 40 px picture).",
    },
  },
} satisfies ComponentDoc
