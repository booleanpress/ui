import type { ComponentDoc } from "../types.ts"

export default {
  slug: "overlay-badge",
  title: "Overlay badge",
  category: "Misc",
  purpose: "Pins a count or a dot to the corner of an icon, a button or an avatar, and says it in words.",
  links: {
    spec: "specs/004_full-suite-components.md#overlay-badge",
  },
  usage: `\`\`\`tsx
<OverlayBadge count={3} severity="danger" label="3 failed deliveries">
  <Button variant="outline" size="icon" aria-label="Delivery alerts">
    <BellIcon />
  </Button>
</OverlayBadge>
\`\`\`

The label is required, and it is read instead of the badge, so write it to stand on its own.`,
  examples: [
    { id: "icon", title: "Icon", description: "A count or a dot on an icon." },
    { id: "avatar", title: "Avatar", description: "A count, or a status dot, on an avatar." },
    { id: "dot", title: "Dot", description: "`dot` puts a small dot on a button." },
    { id: "max", title: "Max", description: "`max` caps the count, as in `99+`." },
  ],
  accessibility: {
    semantics:
      "A `span` around the element, which keeps its own role. The badge is hidden from assistive technology.",
    labels:
      "A focusable element is described by the label: \"Delivery alerts, button, 3 failed deliveries\". Any other element has the label read after it.",
    focus: "The wrapper is not focusable; the wrapped element keeps its own focus.",
    limits: [
      "Whether the element is focusable is checked once it is in the page, so the label is read beside it until the page has loaded.",
      "A changed count is not announced. For a count that changes while people watch, announce it in a live region the page owns.",
      "The badge covers the element's corner. Keep at least 10 px of space around the element so the badge does not cover its neighbours.",
    ],
  },
  keyboard: [],
  theming:
    "The badge takes the solid tokens of its `severity` (see Badge). The ring is `--card`, the surface examples and cards use; on another surface, set it with `className` on the wrapper (`[&_[data-slot=overlay-badge-badge]]:outline-background`).",
  props: {
    OverlayBadge: {
      count: "The number on the badge, formatted in the provider's locale.",
      max: "The largest count shown; above it the badge reads `{max}+`.",
      severity: "The badge's fill: `primary` (default), `secondary`, `success`, `info`, `warning`, `help`, `danger` or `contrast`.",
      size: "The badge's size: `sm`, `default` or `lg`.",
    },
  },
} satisfies ComponentDoc
