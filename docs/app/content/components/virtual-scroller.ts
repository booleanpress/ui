import type { ComponentDoc } from "../types.ts"

export default {
  slug: "virtual-scroller",
  title: "Virtual scroller",
  category: "Data",
  purpose: "A scrolling region for long lists that renders only the items in view, in a column, a row or a grid.",
  links: {
    apg: { label: "APG Landmark Regions", href: "https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/" },
    spec: "specs/004_full-suite-components.md#virtual-scroller",
  },
  peers: ["@tanstack/react-virtual"],
  usage: `\`\`\`tsx
<VirtualScroller
  aria-label="Delivery log"
  items={deliveries}
  itemSize={40}
  getItemKey={(delivery) => delivery.id}
  className="h-80 rounded-sm border"
  renderItem={(delivery) => <div className="px-2">{delivery.to}</div>}
/>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "100,000 rows in a short region; only the few in view are rendered." },
    { id: "horizontal", title: "Horizontal", description: "`orientation=\"horizontal\"` scrolls a row of items sideways." },
    { id: "grid", title: "Grid", description: "`orientation=\"grid\"` lays out 10,000 cards in columns." },
    { id: "variable-heights", title: "Variable heights", description: "Without `itemSize`, each item is measured as it renders." },
    { id: "lazy-loading", title: "Lazy loading", description: "`hasMore`, `onLoadMore` and `loading` fetch the next items as the end comes into view." },
    { id: "scroll-to-index", title: "Scroll to index", description: "A `ref` gives `scrollToIndex`, which the buttons use to jump to an item." },
    { id: "empty-and-retry", title: "Empty and retry", description: "`empty` holds a \"Try again\" button; the list takes over once rows arrive." },
  ],
  accessibility: {
    semantics: "The scroller is a `region` holding a `list` of `listitem`s that report their position and the full size.",
    labels: "Name the region with `aria-label` or `aria-labelledby`. Loading and empty texts come from the provider.",
    focus: "The region is one tab stop, so the keyboard can scroll it. Focusable content inside items follows in the tab order.",
    limits: [
      "Items out of view are not in the page: the browser's find-in-page cannot reach them, and a focused control inside an item loses the focus when its item scrolls far out of view.",
      "A screen reader's reading cursor moves through the rendered items only; the position and size tell where they sit in the whole list.",
      "`onLoadMore` is called once for each length of `items`: after a load that adds nothing (a failed request) it is called again only when `items` changes or the end leaves the view and comes back. With no items at all, show your own way to try again.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves the focus to the region, so the keys below scroll it." },
    { keys: ["ArrowDown", "ArrowUp"], behaviour: "Scroll a little down or up (ArrowLeft and ArrowRight sideways): the browser's own scrolling." },
    { keys: ["PageDown", "PageUp"], behaviour: "Scroll by a view: the browser's own scrolling." },
    { keys: ["Home", "End"], behaviour: "Scroll to the first or the last item, through the virtualiser, so measured items land exactly." },
  ],
  theming:
    "The scroller has no surface of its own; style its frame with `className`. The loading rows use `Skeleton`, and the empty text `--muted-foreground`.",
  props: {
    VirtualScroller: {
      orientation: "`vertical` (default), `horizontal` or `grid`.",
      columns: "Items to a row in a grid; defaults to 3.",
      list: "Gives the content `role=\"list\"` and the items `listitem` with their position and the list's size; on by default.",
    },
  },
} satisfies ComponentDoc
