import type { ComponentDoc } from "../types.ts"

export default {
  slug: "scroll-area",
  title: "Scroll area",
  category: "Panel",
  purpose: "Scrolls content inside a fixed box, with a scrollbar styled to the theme.",
  links: {
    radix: { label: "Radix Scroll Area", href: "https://www.radix-ui.com/primitives/docs/components/scroll-area" },
    spec: "specs/003_moved-components.md#scroll-area",
  },
  usage: `\`\`\`tsx
<ScrollArea className="h-56 w-64 rounded-md border">
  <ul className="p-4">
    {events.map((event) => (
      <li key={event}>{event}</li>
    ))}
  </ul>
</ScrollArea>
\`\`\``,
  examples: [
    { id: "vertical", title: "Vertical", description: "A long list scrolls inside a box of fixed height." },
    { id: "horizontal", title: "Horizontal", description: "A row wider than the box, with a horizontal `ScrollBar`." },
    { id: "both", title: "Both scrollbars", description: "A table wider and taller than the box scrolls both ways." },
    { id: "fade", title: "Fade", description: "`fade` softens the edges where more content is hidden." },
    { id: "variant", title: "Variant", description: "`type` chooses when the scrollbars show." },
  ],
  accessibility: {
    semantics: "The area and its viewport are plain `div`s, and the content stays in reading order. The scrollbars carry no role or name.",
    labels: "Add `role=\"region\"` and `aria-label` when the box is a distinct part of the page that people should be able to find.",
    focus: "When the content overflows and holds nothing focusable, the viewport is a tab stop, so the arrow keys can scroll it. Focusing a control inside scrolls it into view.",
    limits: [
      "The fade is a visual hint only. It does not change what a screen reader reads, and every part of the content stays reachable.",
      "There is no setting that hides the bars entirely: a box with no visible sign that it scrolls loses people. Use `type=\"scroll\"` for bars that show only while it scrolls, and `fade` for a quieter hint.",
      "The 4 px scrollbar, in a 12 px track, is a small target for a pointer; the wheel, touch and trackpad scroll without it.",
    ],
  },
  keyboard: [],
  props: {
    ScrollArea: {
      type: "When the scrollbar shows: `hover` (default) while the pointer is over the area, `scroll` while it scrolls, `auto` whenever the content overflows, or `always`.",
      scrollHideDelay: "Milliseconds before the scrollbar hides again (default 600).",
      dir: "The reading direction. It follows the provider's `dir` unless set here.",
    },
    ScrollBar: {
      orientation: "`vertical` (default) or `horizontal`.",
    },
  },
} satisfies ComponentDoc
